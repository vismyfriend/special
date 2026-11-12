<template>
  <div class="editor">
    <div class="toolbar">
      <select v-model="currentLevel" @change="onLevelChange" class="level-select">
        <option v-for="key in levelKeys" :key="key" :value="key">{{ key }}</option>
        <option value="__new__">+ Новый уровень</option>
      </select>

      <label class="file-label">
        🖼 Загрузить картинку
        <input type="file" accept="image/*" @change="onImageLoad" />
      </label>

      <button @click="toggleCropMode">{{ cropMode ? '✅ Готово' : '✂️ Обрезать' }}</button>
      <button v-if="!cropMode" @click="addZoneAtCenter">+ добавить слово</button>
      <button v-if="!cropMode" @click="exportJson" :disabled="hasConflicts"
              :title="hasConflicts ? 'Убери пересечения зон' : 'Экспорт JSON'"
              :class="{ 'btn-disabled': hasConflicts }">⬇️ Экспорт JSON</button>
      <button v-if="!cropMode" @click="downloadJson" :disabled="hasConflicts"
              title="Скачать JSON-файл для levels/">💾 Скачать JSON</button>
      <button v-if="!cropMode" @click="clearAll">🗑 Очистить</button>
      <button v-if="cropMode" @click="resetCrop">↺ Сбросить</button>
      <span v-if="cropMode" class="crop-hint">Подгони картинку и нажми «✅ Применить обрезку»</span>
    </div>

    <div class="workspace">
      <div ref="wrapperRef" class="canvas-wrap">
        <canvas
          ref="canvasRef"
          class="canvas"
          @pointerdown="onDown"
          @pointermove="onMove"
          @pointerup="onUp"
          @pointerleave="onUp"
        ></canvas>
      </div>

      <aside v-if="!cropMode" class="sidebar">
        <div class="zones-scroll">
          <div
            v-for="(z, i) in zones"
            :key="z.id"
            class="zone-item"
            :class="{ selected: z.id === selectedZoneId, conflict: conflictingZoneIds.has(z.id) }"
            @click="selectZone(z.id)"
          >
            <div class="zone-row">
              <span class="zone-num">{{ i + 1 }}</span>
              <input
                v-model="z.text"
                placeholder="Слово..."
                class="zone-input"
                :ref="el => setZoneInputRef(el, z.id)"
              />
              <button @click.stop="duplicateZone(i)" class="zone-dup" title="Дублировать">⧉</button>
              <button @click.stop="removeZone(i)" class="zone-del" title="Удалить">✕</button>
            </div>

            <div class="zone-row form-row">
              <button class="shape-btn" :class="{ active: z.shape === 'rect' }"
                      @click.stop="z.shape = 'rect'" title="Прямоугольник">🟩</button>
              <span class="zone-label">форма</span>
              <button class="shape-btn" :class="{ active: z.shape === 'circle' }"
                      @click.stop="z.shape = 'circle'" title="Круг">⭕</button>

              <template v-if="z.shape === 'circle'">
                <input type="range" min="0.02" max="0.3" step="0.005"
                       v-model.number="z.r" class="zone-range radius-range" @click.stop />
                <span class="zone-r-val">{{ (z.r * 100).toFixed(0) }}%</span>
              </template>
            </div>
          </div>
          <p v-if="zones.length === 0" class="hint">Кликни по картинке, чтобы добавить зону</p>
        </div>
      </aside>

      <aside v-else class="sidebar crop-sidebar">
        <h3>✂️ Обрезка картинки</h3>
        <p class="hint">Тяни края/углы рамки на canvas. Внутри рамки — перемещай.</p>
        <div class="zone-row">
          <span class="zone-label">масштаб</span>
          <input type="range" min="0.1" max="3" step="0.01" v-model.number="crop.scale" @input="onCropScaleInput" class="zone-range" />
          <span class="zone-r-val">{{ (crop.scale * 100).toFixed(0) }}%</span>
        </div>
        <div class="zone-row">
          <span class="zone-label">сдвиг X</span>
          <input type="range" min="-1" max="1" step="0.01" v-model.number="crop.offsetX" @input="nextTick(draw)" class="zone-range" />
        </div>
        <div class="zone-row">
          <span class="zone-label">сдвиг Y</span>
          <input type="range" min="-1" max="1" step="0.01" v-model.number="crop.offsetY" @input="nextTick(draw)" class="zone-range" />
        </div>
        <button class="btn-apply-crop" @click="applyCrop">✅ Применить обрезку</button>
        <button class="btn-reset-crop" @click="resetCrop">↺ Сбросить</button>
      </aside>
    </div>

    <pre v-if="lastExport" class="export">{{ lastExport }}</pre>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { connectLineGames } from './ConnectLineData'

const route = useRoute()
const router = useRouter()

// ─── КОНСТАНТЫ (как в setupBoard игры) ───
const BASE_W = 800
const BASE_H = 520
const CARD_W = 110
const SIDE_PAD = 10

const levelKeys = computed(() => Object.keys(connectLineGames))
const currentLevel = ref(route.query.level || levelKeys.value[0] || '')
const newLevelName = ref('')

const canvasRef = ref(null)
const wrapperRef = ref(null)
const zones = ref([])
const img = ref(null)
const lastExport = ref('')
const selectedZoneId = ref(null)
const zoneInputRefs = {}

// ─── ДВА НАБОРА РАЗМЕРОВ ───
// sourceImageSize  — размеры ОРИГИНАЛА (то, что грузится из URL / файла)
// originalImageSize — размеры ТЕКУЩЕЙ картинки (после применения crop), используется для отрисовки
const sourceImageSize = ref({ width: BASE_W, height: BASE_H })
const originalImageSize = ref({ width: BASE_W, height: BASE_H })

const appliedCrop = ref(null)

// адаптивные размеры canvas в CSS-пикселях
const canvasW = ref(BASE_W)
const canvasH = ref(BASE_H)
let dpr = 1

let dragging = null
let dragOffset = { x: 0, y: 0 }
let resizeHandle = null
let resizeZone = null
let resizeStart = null

const HANDLE_SIZE = 10

// ─── ОБЛАСТЬ КАРТИНКИ — всегда в виртуальных 800×520 ───
let imgRect = { x: 0, y: 0, w: BASE_W, h: BASE_H, scale: 1 }

function computeImageRect() {
  const iw = img.value?.width || originalImageSize.value.width || BASE_W
  const ih = img.value?.height || originalImageSize.value.height || BASE_H

  const sidePanel = CARD_W + SIDE_PAD
  const availW = Math.max(100, BASE_W - sidePanel * 2)
  const availH = Math.max(100, BASE_H)

  const scale = Math.min(availW / iw, availH / ih, 1)
  const w = iw * scale
  const h = ih * scale
  const x = (BASE_W - w) / 2
  const y = (BASE_H - h) / 2
  return { x, y, w, h, scale }
}

// ─── CROP ───
const cropMode = ref(false)
const crop = ref({ scale: 1, offsetX: 0, offsetY: 0, box: { x: 0, y: 0, w: BASE_W, h: BASE_H } })
let cropDrag = null
let cropDragStart = null
const croppedImage = ref(null)

// ─── ПРИМЕНИТЬ CROP К КАРТИНКЕ (как в setupBoard игры) ───
function applyCropToImage(sourceImg, cropData) {
  if (!sourceImg || !cropData) return sourceImg
  const outW = cropData.croppedWidth || BASE_W
  const outH = cropData.croppedHeight || BASE_H

  const off = document.createElement('canvas')
  off.width = outW
  off.height = outH
  const ctx = off.getContext('2d')

  const iw = sourceImg.width
  const ih = sourceImg.height
  const baseScale = Math.min(BASE_W / iw, BASE_H / ih)
  const s = baseScale * cropData.scale
  const drawW = iw * s
  const drawH = ih * s
  const dx = (BASE_W - drawW) / 2 + cropData.offsetX * BASE_W
  const dy = (BASE_H - drawH) / 2 + cropData.offsetY * BASE_H

  const bx = cropData.box.x
  const by = cropData.box.y
  const bw = cropData.box.w
  const bh = cropData.box.h

  const sx = (bx - dx) / s
  const sy = (by - dy) / s
  const sw = bw / s
  const sh = bh / s

  ctx.drawImage(sourceImg, sx, sy, sw, sh, 0, 0, outW, outH)

  const result = new Image()
  result.src = off.toDataURL('image/png')
  return result
}

// ─── ЗАГРУЗКА УРОВНЯ ───
async function loadLevel(key) {
  const data = connectLineGames[key]
  if (!data) return

  if (data.image) {
    try {
      const image = new Image()
      image.src = data.image
      await new Promise((res, rej) => { image.onload = res; image.onerror = rej })

      // это ОРИГИНАЛ
      sourceImageSize.value = { width: image.width, height: image.height }

      if (data.crop) {
        // сразу применяем crop — как игра
        const cropped = applyCropToImage(image, data.crop)
        await new Promise((res, rej) => {
          if (cropped.complete && cropped.naturalWidth > 0) return res()
          cropped.onload = res
          cropped.onerror = rej
        })
        img.value = cropped
        originalImageSize.value = { width: cropped.width, height: cropped.height }
      } else {
        img.value = image
        originalImageSize.value = { width: image.width, height: image.height }
      }
    } catch (_) {
      img.value = null
      sourceImageSize.value = { width: BASE_W, height: BASE_H }
      originalImageSize.value = { width: BASE_W, height: BASE_H }
    }
  } else {
    img.value = null
    sourceImageSize.value = { width: BASE_W, height: BASE_H }
    originalImageSize.value = { width: BASE_W, height: BASE_H }
  }

  appliedCrop.value = data.crop ? { ...data.crop, box: { ...data.crop.box } } : null

  // ─── ЗОНЫ: [0..1] от картинки ───
  zones.value = (data.words || []).map(w => ({
    id: w.id,
    text: w.text,
    shape: w.shape || 'circle',
    x: w.x,
    y: w.y,
    r: w.r ?? 0.07,
    w: w.w ?? 0.14,
    h: w.h ?? 0.14,
  }))

  selectedZoneId.value = null
  cropMode.value = false
  lastExport.value = ''
  await nextTick()
  resizeCanvas()
  draw()
}

async function onLevelChange() {
  if (currentLevel.value === '__new__') {
    const name = prompt('Имя нового уровня (ключ в ConnectLineData, например: bodyParts):')
    if (!name || !/^[a-zA-Z0-9_-]+$/.test(name)) {
      currentLevel.value = levelKeys.value[0] || ''
      return
    }
    newLevelName.value = name
    img.value = null
    zones.value = []
    lastExport.value = ''
    selectedZoneId.value = null
    cropMode.value = false
    appliedCrop.value = null
    sourceImageSize.value = { width: BASE_W, height: BASE_H }
    originalImageSize.value = { width: BASE_W, height: BASE_H }
    router.replace({ query: { ...route.query, level: name } })
    nextTick(() => { resizeCanvas(); draw() })
    return
  }
  newLevelName.value = ''
  await loadLevel(currentLevel.value)
  router.replace({ query: { ...route.query, level: currentLevel.value } })
}

// ─── INPUT-Ы ───
function setZoneInputRef(el, zoneId) {
  if (el) zoneInputRefs[zoneId] = el
  else delete zoneInputRefs[zoneId]
}

async function selectZone(zoneId) {
  selectedZoneId.value = zoneId
  await nextTick()
  const input = zoneInputRefs[zoneId]
  if (!input) return
  input.focus({ preventScroll: true })
  input.select()
  requestAnimationFrame(() => {
    const item = input.closest('.zone-item')
    const scroll = input.closest('.zones-scroll')
    if (!item || !scroll) return
    const itemTop = item.offsetTop - scroll.offsetTop
    const itemBottom = itemTop + item.offsetHeight
    const scrollTop = scroll.scrollTop
    const scrollBottom = scrollTop + scroll.clientHeight
    const padding = 8
    if (itemTop < scrollTop + padding) {
      scroll.scrollTo({ top: Math.max(0, itemTop - padding), behavior: 'smooth' })
    } else if (itemBottom > scrollBottom - padding) {
      scroll.scrollTo({ top: itemBottom - scroll.clientHeight + padding, behavior: 'smooth' })
    }
  })
}

// ─── CROP ───
function toggleCropMode() {
  if (!img.value) return
  if (!cropMode.value) {
    crop.value = appliedCrop.value
      ? { ...appliedCrop.value, box: { ...appliedCrop.value.box } }
      : { scale: 1, offsetX: 0, offsetY: 0, box: { x: 0, y: 0, w: BASE_W, h: BASE_H } }
    cropMode.value = true
    nextTick(draw)
  } else {
    cropMode.value = false
    nextTick(draw)
  }
}

function resetCrop() {
  crop.value = { scale: 1, offsetX: 0, offsetY: 0, box: { x: 0, y: 0, w: BASE_W, h: BASE_H } }
  croppedImage.value = null
  appliedCrop.value = null

  // вернуть ОРИГИНАЛ картинки
  const srcUrl = connectLineGames[currentLevel.value]?.image
  if (srcUrl) {
    const image = new Image()
    image.onload = () => {
      img.value = image
      originalImageSize.value = { width: image.width, height: image.height }
      nextTick(() => { resizeCanvas(); draw() })
    }
    image.src = srcUrl
  } else {
    nextTick(draw)
  }
}

function onCropScaleInput() {
  nextTick(draw)
}

function applyCrop() {
  if (!img.value) return

  const bx = crop.value.box.x
  const by = crop.value.box.y
  const bw = crop.value.box.w
  const bh = crop.value.box.h

  appliedCrop.value = {
    scale: crop.value.scale,
    offsetX: crop.value.offsetX,
    offsetY: crop.value.offsetY,
    box: { ...crop.value.box },
    croppedWidth: Math.round(bw),
    croppedHeight: Math.round(bh),
  }

  const off = document.createElement('canvas')
  off.width = Math.round(bw)
  off.height = Math.round(bh)
  const ctx = off.getContext('2d')

  const iw = img.value.width
  const ih = img.value.height
  const baseScale = Math.min(BASE_W / iw, BASE_H / ih)
  const s = baseScale * crop.value.scale
  const drawW = iw * s
  const drawH = ih * s
  const drawX = (BASE_W - drawW) / 2 + crop.value.offsetX * BASE_W
  const drawY = (BASE_H - drawH) / 2 + crop.value.offsetY * BASE_H

  const sx = (bx - drawX) / s
  const sy = (by - drawY) / s
  const sw = bw / s
  const sh = bh / s

  ctx.drawImage(img.value, sx, sy, sw, sh, 0, 0, bw, bh)

  croppedImage.value = off
  const newImg = new Image()
  newImg.onload = () => {
    img.value = newImg
    // sourceImageSize НЕ трогаем — там оригинал
    originalImageSize.value = { width: Math.round(bw), height: Math.round(bh) }
    cropMode.value = false
    nextTick(() => { resizeCanvas(); draw() })
  }
  newImg.src = off.toDataURL('image/png')
}

// ─── ПЕРЕСЕЧЕНИЯ ───
function getBoundingBox(z) {
  const minSide = Math.min(imgRect.w, imgRect.h)
  const cx = imgRect.x + z.x * imgRect.w
  const cy = imgRect.y + z.y * imgRect.h
  if (z.shape === 'rect') {
    const w = z.w * minSide, h = z.h * minSide
    return { left: cx - w / 2, right: cx + w / 2, top: cy - h / 2, bottom: cy + h / 2 }
  }
  const r = z.r * minSide
  return { left: cx - r, right: cx + r, top: cy - r, bottom: cy + r }
}

function zonesOverlap(a, b) {
  const A = getBoundingBox(a), B = getBoundingBox(b)
  return A.left < B.right && A.right > B.left && A.top < B.bottom && A.bottom > B.top
}

const conflictingZoneIds = computed(() => {
  const set = new Set()
  for (let i = 0; i < zones.value.length; i++) {
    for (let j = i + 1; j < zones.value.length; j++) {
      if (zonesOverlap(zones.value[i], zones.value[j])) {
        set.add(zones.value[i].id); set.add(zones.value[j].id)
      }
    }
  }
  return set
})

const hasConflicts = computed(() => conflictingZoneIds.value.size > 0)

// ─── РИСОВАНИЕ ───
function getZoneRect(z) {
  const minSide = Math.min(imgRect.w, imgRect.h)
  const cx = imgRect.x + z.x * imgRect.w
  const cy = imgRect.y + z.y * imgRect.h
  if (z.shape === 'rect') {
    const w = z.w * minSide, h = z.h * minSide
    return { cx, cy, w, h, left: cx - w / 2, top: cy - h / 2, right: cx + w / 2, bottom: cy + h / 2 }
  }
  const r = z.r * minSide
  return { cx, cy, r, left: cx - r, top: cy - r, right: cx + r, bottom: cy + r }
}

function getHandles(z) {
  if (z.shape !== 'rect') return []
  const { left, top, right, bottom } = getZoneRect(z)
  const cx = (left + right) / 2, cy = (top + bottom) / 2
  return [
    { key: 'nw', x: left, y: top }, { key: 'n', x: cx, y: top }, { key: 'ne', x: right, y: top },
    { key: 'e', x: right, y: cy }, { key: 'se', x: right, y: bottom }, { key: 's', x: cx, y: bottom },
    { key: 'sw', x: left, y: bottom }, { key: 'w', x: left, y: cy },
  ]
}

function getCropHandles() {
  const { x, y, w, h } = crop.value.box
  return [
    { key: 'nw', x, y }, { key: 'n', x: x + w / 2, y }, { key: 'ne', x: x + w, y },
    { key: 'e', x: x + w, y: y + h / 2 }, { key: 'se', x: x + w, y: y + h }, { key: 's', x: x + w / 2, y: y + h },
    { key: 'sw', x, y: y + h }, { key: 'w', x, y: y + h / 2 },
  ]
}

// ─── ПОДСКАЗКА О ЗАРЕЗЕРВИРОВАННЫХ ЗОНАХ ───
function drawReservedZones(ctx) {
  const leftEdge = imgRect.x
  const rightEdge = imgRect.x + imgRect.w

  // тонированная подложка панелей
  ctx.save()
  ctx.fillStyle = 'rgba(148, 163, 184, 0.12)'
  if (leftEdge > 0) {
    ctx.fillRect(0, 0, leftEdge, BASE_H)
  }
  if (rightEdge < BASE_W) {
    ctx.fillRect(rightEdge, 0, BASE_W - rightEdge, BASE_H)
  }
  ctx.restore()

  // пунктирные границы
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'
  ctx.lineWidth = 2
  ctx.setLineDash([8, 8])

  if (leftEdge > 0) {
    ctx.beginPath()
    ctx.moveTo(leftEdge, 0)
    ctx.lineTo(leftEdge, BASE_H)
    ctx.stroke()
  }
  if (rightEdge < BASE_W) {
    ctx.beginPath()
    ctx.moveTo(rightEdge, 0)
    ctx.lineTo(rightEdge, BASE_H)
    ctx.stroke()
  }

  // оси симметрии панелей
  ctx.setLineDash([4, 10])
  ctx.strokeStyle = 'rgba(9,9,9,0.18)'
  if (leftEdge > 0) {
    const lc = leftEdge / 2
    ctx.beginPath(); ctx.moveTo(lc, 0); ctx.lineTo(lc, BASE_H); ctx.stroke()
  }
  if (rightEdge < BASE_W) {
    const rc = (rightEdge + BASE_W) / 2
    ctx.beginPath(); ctx.moveTo(rc, 0); ctx.lineTo(rc, BASE_H); ctx.stroke()
  }
  ctx.restore()

  // подписи
  ctx.save()
  ctx.fillStyle = 'rgb(9,9,9)'
  ctx.font = '600 13px system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  if (leftEdge > 0) {
    ctx.save()
    ctx.translate(leftEdge / 2, BASE_H / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('зоны для слов слева', 0, 0)
    ctx.restore()
  }
  if (rightEdge < BASE_W) {
    ctx.save()
    ctx.translate((rightEdge + BASE_W) / 2, BASE_H / 2)
    ctx.rotate(Math.PI / 2)
    ctx.fillText('зоны для словсправа', 0, 0)
    ctx.restore()
  }
  ctx.restore()
}

// ─── РАЗМЕР CANVAS (адаптив) ───
function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const wrap = wrapperRef.value
  const availW = wrap ? wrap.getBoundingClientRect().width : BASE_W
  const w = Math.max(320, Math.min(BASE_W, availW))
  canvasW.value = w
  canvasH.value = w * (BASE_H / BASE_W)
  dpr = window.devicePixelRatio || 1
  draw()
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  canvas.width = Math.round(canvasW.value * dpr)
  canvas.height = Math.round(canvasH.value * dpr)
  canvas.style.width = canvasW.value + 'px'
  canvas.style.height = canvasH.value + 'px'

  // масштаб: виртуальные BASE_W×BASE_H → реальные canvasW×canvasH
  const sx = canvasW.value / BASE_W
  const sy = canvasH.value / BASE_H
  ctx.setTransform(dpr * sx, 0, 0, dpr * sy, 0, 0)

  ctx.clearRect(0, 0, BASE_W, BASE_H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, BASE_W, BASE_H)

  imgRect = computeImageRect()

  if (!cropMode.value) {
    drawReservedZones(ctx)
  }

  if (img.value) {
    if (cropMode.value) {
      const iw = img.value.width, ih = img.value.height
      const baseScale = Math.min(BASE_W / iw, BASE_H / ih)
      const s = baseScale * crop.value.scale
      const drawW = iw * s
      const drawH = ih * s
      const drawX = (BASE_W - drawW) / 2 + crop.value.offsetX * BASE_W
      const drawY = (BASE_H - drawH) / 2 + crop.value.offsetY * BASE_H
      ctx.drawImage(img.value, drawX, drawY, drawW, drawH)

      const { x, y, w, h } = crop.value.box
      ctx.save()
      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.fillRect(0, 0, BASE_W, y)
      ctx.fillRect(0, y + h, BASE_W, BASE_H - (y + h))
      ctx.fillRect(0, y, x, h)
      ctx.fillRect(x + w, y, BASE_W - (x + w), h)
      ctx.restore()

      ctx.strokeStyle = '#22c55e'
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, w, h)

      getCropHandles().forEach(hd => {
        ctx.beginPath()
        ctx.rect(hd.x - HANDLE_SIZE / 2, hd.y - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE)
        ctx.fillStyle = '#22c55e'
        ctx.fill()
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 1.5
        ctx.stroke()
      })
      return
    } else {
      ctx.drawImage(img.value, imgRect.x, imgRect.y, imgRect.w, imgRect.h)
    }
  }

  // ─── ЗОНЫ ───
  const minSide = Math.min(imgRect.w, imgRect.h)
  zones.value.forEach((z, i) => {
    const cx = imgRect.x + z.x * imgRect.w
    const cy = imgRect.y + z.y * imgRect.h
    const isSelected = z.id === selectedZoneId.value
    const isConflict = conflictingZoneIds.value.has(z.id)

    if (z.shape === 'rect') {
      const w = z.w * minSide, h = z.h * minSide
      ctx.beginPath(); ctx.rect(cx - w / 2, cy - h / 2, w, h)
      ctx.fillStyle = 'rgba(59,130,246,0.25)'; ctx.fill()
      ctx.strokeStyle = isConflict ? '#ef4444' : (isSelected ? '#f59e0b' : '#3b82f6')
      ctx.lineWidth = isConflict ? 3 : (isSelected ? 2.5 : 2); ctx.stroke()
    } else {
      const cr = z.r * minSide
      ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(59,130,246,0.25)'; ctx.fill()
      ctx.strokeStyle = isConflict ? '#ef4444' : (isSelected ? '#f59e0b' : '#3b82f6')
      ctx.lineWidth = isConflict ? 3 : (isSelected ? 2.5 : 2); ctx.stroke()
    }

    if (isConflict) {
      ctx.font = 'bold 20px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('⚠️', cx, cy)
    } else {
      const lensR = 6, handleLen = 5, handleAngle = Math.PI / 4
      const hx = cx + Math.cos(handleAngle) * (lensR + handleLen / 2)
      const hy = cy + Math.sin(handleAngle) * (lensR + handleLen / 2)
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(handleAngle) * lensR, cy + Math.sin(handleAngle) * lensR)
      ctx.lineTo(hx + Math.cos(handleAngle) * handleLen / 2, hy + Math.sin(handleAngle) * handleLen / 2)
      ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.stroke()
      ctx.beginPath(); ctx.arc(cx, cy, lensR, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'; ctx.fill()
      ctx.strokeStyle = 'rgba(187,69,234,0.62)'; ctx.lineWidth = 2; ctx.stroke()
    }

    ctx.fillStyle = '#1e3a8a'; ctx.font = 'bold 14px system-ui'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    const labelY = z.shape === 'rect' ? cy - (z.h * minSide) / 2 - 12 : cy - z.r * minSide - 12
    ctx.fillText(z.text || `зона ${i + 1}`, cx, labelY)

    if (isSelected && z.shape === 'rect') {
      getHandles(z).forEach(h => {
        ctx.beginPath()
        ctx.rect(h.x - HANDLE_SIZE / 2, h.y - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE)
        ctx.fillStyle = '#f59e0b'; ctx.fill()
        ctx.strokeStyle = 'white'; ctx.lineWidth = 1.5; ctx.stroke()
      })
    }
  })
}

watch(zones, () => { nextTick(draw) }, { deep: true })
watch(selectedZoneId, () => { nextTick(draw) })

// ─── ЗАГРУЗКА КАРТИНКИ ───
function onImageLoad(e) {
  const file = e.target.files[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  const image = new Image()
  image.onload = () => {
    img.value = image
    sourceImageSize.value = { width: image.width, height: image.height }
    originalImageSize.value = { width: image.width, height: image.height }
    crop.value = { scale: 1, offsetX: 0, offsetY: 0, box: { x: 0, y: 0, w: BASE_W, h: BASE_H } }
    cropMode.value = true
    appliedCrop.value = null
    nextTick(() => { resizeCanvas(); draw() })
  }
  image.src = url
}

// ─── ХИТ-ТЕСТ ───
function hitHandle(px, py) {
  const z = zones.value.find(z => z.id === selectedZoneId.value)
  if (!z || z.shape !== 'rect') return null
  const handles = getHandles(z)
  for (const h of handles) {
    if (Math.abs(px - h.x) <= HANDLE_SIZE && Math.abs(py - h.y) <= HANDLE_SIZE) return h.key
  }
  return null
}

function hitZone(px, py) {
  const minSide = Math.min(imgRect.w, imgRect.h)
  for (let i = zones.value.length - 1; i >= 0; i--) {
    const z = zones.value[i]
    const cx = imgRect.x + z.x * imgRect.w
    const cy = imgRect.y + z.y * imgRect.h
    if (z.shape === 'rect') {
      const w = z.w * minSide, h = z.h * minSide
      if (px >= cx - w / 2 && px <= cx + w / 2 && py >= cy - h / 2 && py <= cy + h / 2) {
        return { zone: z, index: i }
      }
    } else {
      const cr = z.r * minSide
      if (Math.hypot(px - cx, py - cy) <= cr) return { zone: z, index: i }
    }
  }
  return null
}

function hitCropHandle(px, py) {
  if (!cropMode.value) return null
  const handles = getCropHandles()
  for (const h of handles) {
    if (Math.abs(px - h.x) <= HANDLE_SIZE && Math.abs(py - h.y) <= HANDLE_SIZE) return h.key
  }
  return null
}

function inCropBox(px, py) {
  const { x, y, w, h } = crop.value.box
  return px >= x && px <= x + w && py >= y && py <= y + h
}

// ─── КООРДИНАТЫ КУРСОРА В ВИРТУАЛЬНОЙ СИСТЕМЕ ───
function getVirtualPointer(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  const rx = (e.clientX - rect.left) / rect.width
  const ry = (e.clientY - rect.top) / rect.height
  return { px: rx * BASE_W, py: ry * BASE_H }
}

// ─── МЫШЬ ───
function onDown(e) {
  const { px, py } = getVirtualPointer(e)

  if (cropMode.value) {
    const ch = hitCropHandle(px, py)
    if (ch) {
      cropDrag = ch
      cropDragStart = { px, py, box: { ...crop.value.box } }
      return
    }
    if (inCropBox(px, py)) {
      cropDrag = 'move'
      cropDragStart = { px, py, box: { ...crop.value.box } }
      return
    }
    return
  }

  const handle = hitHandle(px, py)
  if (handle) {
    const z = zones.value.find(z => z.id === selectedZoneId.value)
    const r = getZoneRect(z)
    resizeHandle = handle
    resizeZone = z
    resizeStart = {
      px, py, x: z.x, y: z.y, w: z.w, h: z.h,
      left: r.left, top: r.top, right: r.right, bottom: r.bottom,
    }
    return
  }

  const hit = hitZone(px, py)
  if (hit) {
    selectZone(hit.zone.id)
    dragging = hit.zone
    dragOffset.x = px - (imgRect.x + hit.zone.x * imgRect.w)
    dragOffset.y = py - (imgRect.y + hit.zone.y * imgRect.h)
    return
  }

  selectedZoneId.value = null

  const nx = (px - imgRect.x) / imgRect.w
  const ny = (py - imgRect.y) / imgRect.h
  if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return

  zones.value.unshift({
    id: 'w' + Date.now(),
    text: `zone ${zones.value.length + 1}`,
    shape: 'rect',
    x: nx,
    y: ny,
    r: 0.07, w: 0.14, h: 0.14,
  })
  draw()
}

function onMove(e) {
  const { px, py } = getVirtualPointer(e)

  if (cropMode.value && cropDrag && cropDragStart) {
    const dx = px - cropDragStart.px
    const dy = py - cropDragStart.py
    const start = cropDragStart.box
    let { x, y, w, h } = start

    if (cropDrag === 'move') {
      x = start.x + dx
      y = start.y + dy
    } else {
      if (cropDrag.includes('w')) { x = start.x + dx; w = start.w - dx }
      if (cropDrag.includes('e')) { w = start.w + dx }
      if (cropDrag.includes('n')) { y = start.y + dy; h = start.h - dy }
      if (cropDrag.includes('s')) { h = start.h + dy }
    }

    const minPx = 30
    if (w < minPx) { if (cropDrag.includes('w')) x = start.x + start.w - minPx; w = minPx }
    if (h < minPx) { if (cropDrag.includes('n')) y = start.y + start.h - minPx; h = minPx }

    crop.value.box = { x, y, w, h }
    draw()
    return
  }

  if (resizeHandle && resizeZone) {
    const minSide = Math.min(imgRect.w, imgRect.h)
    const dx = px - resizeStart.px
    const dy = py - resizeStart.py
    const start = resizeStart
    let { left, top, right, bottom } = start

    if (resizeHandle.includes('w')) left = start.left + dx
    if (resizeHandle.includes('e')) right = start.right + dx
    if (resizeHandle.includes('n')) top = start.top + dy
    if (resizeHandle.includes('s')) bottom = start.bottom + dy

    const minPx = 12
    if (right - left < minPx) { if (resizeHandle.includes('w')) left = right - minPx; else right = left + minPx }
    if (bottom - top < minPx) { if (resizeHandle.includes('n')) top = bottom - minPx; else bottom = top + minPx }

    const newW = right - left, newH = bottom - top
    const newCx = (left + right) / 2, newCy = (top + bottom) / 2

    resizeZone.x = (newCx - imgRect.x) / imgRect.w
    resizeZone.y = (newCy - imgRect.y) / imgRect.h
    resizeZone.w = newW / minSide
    resizeZone.h = newH / minSide
    draw()
    return
  }

  if (dragging) {
    dragging.x = (px - dragOffset.x - imgRect.x) / imgRect.w
    dragging.y = (py - dragOffset.y - imgRect.y) / imgRect.h
    draw()
  }
}

function onUp() {
  dragging = null
  resizeHandle = null
  resizeZone = null
  resizeStart = null
  cropDrag = null
  cropDragStart = null
}

// ─── ДЕЙСТВИЯ ───
function addZoneAtCenter() {
  zones.value.unshift({
    id: 'w' + Date.now(),
    text: `zone ${zones.value.length + 1}`,
    shape: 'rect',
    x: 0.5, y: 0.5,
    r: 0.07, w: 0.14, h: 0.14,
  })
  draw()
}

function removeZone(i) {
  const removed = zones.value[i]
  zones.value.splice(i, 1)
  if (selectedZoneId.value === removed.id) selectedZoneId.value = null
  draw()
}

function duplicateZone(i) {
  const z = zones.value[i]
  if (!z) return
  const copy = {
    id: 'w' + Date.now() + Math.random().toString(36).slice(2, 6),
    text: z.text, shape: z.shape,
    x: 0.5, y: 0.5,
    r: z.r, w: z.w, h: z.h,
  }
  zones.value.splice(i + 1, 0, copy)
  draw()
}

function clearAll() {
  zones.value = []
  selectedZoneId.value = null
  lastExport.value = ''
  draw()
}

// ─── ЭКСПОРТ ───
function buildJson() {
  return {
    title: 'My level',
    instructions: 'Протяни линию от названия к нужному месту на картинке',
    // ОРИГИНАЛ (до crop) — как в игре
    imageWidth: sourceImageSize.value.width,
    imageHeight: sourceImageSize.value.height,
    crop: appliedCrop.value
      ? {
        scale: appliedCrop.value.scale,
        offsetX: appliedCrop.value.offsetX,
        offsetY: appliedCrop.value.offsetY,
        box: { ...appliedCrop.value.box },
        croppedWidth: appliedCrop.value.croppedWidth,
        croppedHeight: appliedCrop.value.croppedHeight,
      }
      : null,
    words: zones.value.map(z => {
      const base = { id: z.id, text: z.text, shape: z.shape, x: +z.x.toFixed(4), y: +z.y.toFixed(4) }
      if (z.shape === 'rect') { base.w = +z.w.toFixed(4); base.h = +z.h.toFixed(4) }
      else { base.r = +z.r.toFixed(4) }
      return base
    }),
  }
}

async function exportJson() {
  if (hasConflicts.value) return
  const json = buildJson()
  lastExport.value = JSON.stringify(json, null, 2)
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(lastExport.value)
    } else {
      const ta = document.createElement('textarea')
      ta.value = lastExport.value
      ta.style.position = 'fixed'; ta.style.opacity = '0'
      document.body.appendChild(ta); ta.select(); document.execCommand('copy')
      document.body.removeChild(ta)
    }
    console.log('✅ JSON скопирован в буфер')
  } catch (err) { console.warn('Не удалось скопировать:', err) }
}

function downloadJson() {
  if (hasConflicts.value) return
  const json = buildJson()
  const key = currentLevel.value === '__new__'
    ? (newLevelName.value || 'newLevel')
    : currentLevel.value
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${key}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ─── ИНИЦИАЛИЗАЦИЯ ───
onMounted(async () => {
  window.addEventListener('resize', resizeCanvas)
  if (currentLevel.value && currentLevel.value !== '__new__') {
    await loadLevel(currentLevel.value)
  } else if (levelKeys.value.length > 0) {
    currentLevel.value = levelKeys.value[0]
    await loadLevel(currentLevel.value)
  }
  nextTick(() => { resizeCanvas(); draw() })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
.editor {
  display: flex; flex-direction: column; gap: 12px;
  padding: 20px; font-family: system-ui, sans-serif;
  max-width: 1200px; margin: 80px auto 0; box-sizing: border-box;
  background: #fff;
  border-radius: 20px;
}
h2 { margin: 0 0 4px; }

.toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.toolbar button, .file-label, .level-select {
  padding: 8px 14px; border-radius: 8px; border: 1px solid #cbd5e1;
  background: white; cursor: pointer; font-size: 14px;
}
.toolbar button:disabled { cursor: not-allowed; }
.btn-disabled { opacity: 0.5; }
.file-label { position: relative; overflow: hidden; }
.file-label input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.crop-hint { font-size: 13px; color: #64748b; font-style: italic; }

.workspace { display: flex; gap: 16px; align-items: flex-start; width: 100%; }

.canvas-wrap {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 800px;
}

.canvas {
  width: 100%;
  display: block;
  aspect-ratio: 800 / 520;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  touch-action: none;
  cursor: crosshair;
  background: #f8fafc;
}

.sidebar {
  flex: 0 0 320px;
  height: 520px;
  max-height: 520px;
  padding: 12px;
  background: #f1f5f9;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.sidebar h3 { margin: 0 0 8px; flex-shrink: 0; }

.zones-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.crop-sidebar { flex: 0 0 280px; height: auto; max-height: none; overflow: visible; }

.zone-item {
  display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px;
  padding: 8px; background: white; border-radius: 8px;
  border: 1px solid #e2e8f0; cursor: pointer;
}
.zone-item.selected { border-color: #f59e0b; box-shadow: 0 0 0 2px rgba(245,158,11,0.2); }
.zone-item.conflict { border-color: #ef4444; background: #fef2f2; }

.zone-row { display: flex; gap: 6px; align-items: center; margin-bottom: 6px; }
.zone-num { width: 20px; text-align: center; color: #64748b; font-size: 12px; }
.zone-input {
  flex: 1; padding: 4px 8px; border: 1px solid #cbd5e1;
  border-radius: 6px; font-size: 13px;
}
.zone-range { flex: 1; }
.zone-label { font-size: 12px; color: #64748b; width: 70px; }
.zone-r-val { font-size: 12px; color: #64748b; width: 40px; text-align: right; }
.zone-dup { background: #bfdbfe; border: none; padding: 4px 8px; border-radius: 6px; cursor: pointer; font-size: 12px; }
.zone-dup:hover { background: #93c5fd; }
.zone-del { background: #fecaca; border: none; padding: 4px 8px; border-radius: 6px; cursor: pointer; font-size: 12px; }
.hint { color: #64748b; font-size: 13px; }

.form-row {
  flex-wrap: nowrap;
  gap: 4px;
  align-items: center;
  margin-bottom: 0;
}
.shape-btn {
  padding: 2px 6px;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  transition: all 0.15s;
}
.shape-btn:hover { background: rgba(59, 130, 246, 0.1); }
.shape-btn.active { border-color: #3b82f6; background: rgba(59, 130, 246, 0.15); }
.form-row .zone-label { width: auto; font-size: 12px; color: #64748b; padding: 0 2px; }
.radius-range { flex: 1; min-width: 60px; }
.radius-range + .zone-r-val { flex-shrink: 0; }

.btn-apply-crop, .btn-reset-crop {
  width: 100%; padding: 8px 14px; border: none; border-radius: 8px;
  font-weight: 600; cursor: pointer; margin-top: 8px;
}
.btn-apply-crop { background: #22c55e; color: white; }
.btn-apply-crop:hover { background: #16a34a; }
.btn-reset-crop { background: #64748b; color: white; }
.btn-reset-crop:hover { background: #475569; }

.export {
  background: #0f172a; color: #e2e8f0; padding: 16px; border-radius: 8px;
  max-height: 300px; overflow: auto; font-size: 12px; white-space: pre;
}

@media (max-width: 1200px) {
  .workspace { flex-direction: column; }
  .sidebar, .crop-sidebar { width: 100%; flex: none; height: auto; max-height: 400px; }
  .zones-scroll { max-height: 300px; }
  .canvas-wrap { width: 100%; max-width: 100%; }
}
</style>
