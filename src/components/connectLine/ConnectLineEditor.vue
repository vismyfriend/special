<template>
  <div class="editor">
    <div class="toolbar">
      <!-- Выбор уровня -->
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
      <canvas ref="canvasRef" class="canvas" @pointerdown="onDown" @pointermove="onMove"
              @pointerup="onUp" @pointerleave="onUp"></canvas>

      <aside v-if="!cropMode" class="sidebar">
        <div class="zones-scroll">
          <div v-for="(z, i) in zones" :key="z.id" class="zone-item"
               :class="{ selected: z.id === selectedZoneId, conflict: conflictingZoneIds.has(z.id) }"
               @click="selectZone(z.id)">
            <div class="zone-row">
              <span class="zone-num">{{ i + 1 }}</span>
              <input v-model="z.text" placeholder="Слово..." class="zone-input"
                     :ref="el => setZoneInputRef(el, z.id)" />
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
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { connectLineGames } from './ConnectLineData'

const route = useRoute()
const router = useRouter()

// ─── УРОВНИ ───
const levelKeys = computed(() => Object.keys(connectLineGames))
const currentLevel = ref(route.query.level || levelKeys.value[0] || '')
const newLevelName = ref('')

const canvasRef = ref(null)
const zones = ref([])
const img = ref(null)
const lastExport = ref('')
const selectedZoneId = ref(null)
const zoneInputRefs = {}

// Реальные размеры оригинальной картинки (для JSON)
const originalImageSize = ref({ width: 800, height: 520 })
// Параметры применённого crop (сохраняются в JSON)
const appliedCrop = ref(null)

let dragging = null
let dragOffset = { x: 0, y: 0 }
let resizeHandle = null
let resizeZone = null
let resizeStart = null

const W = 800
const H = 520
const HANDLE_SIZE = 10

// ─── CROP ───
const cropMode = ref(false)
const crop = ref({ scale: 1, offsetX: 0, offsetY: 0, box: { x: 0, y: 0, w: W, h: H } })
let cropDrag = null
let cropDragStart = null
let croppedImage = ref(null)

// ─── ЗАГРУЗКА УРОВНЯ ───
async function loadLevel(key) {
  const data = connectLineGames[key]
  if (!data) return
  try {
    const image = new Image()
    image.src = data.image
    await new Promise((res, rej) => { image.onload = res; image.onerror = rej })
    img.value = image
    originalImageSize.value = { width: image.width, height: image.height }
  } catch (_) {
    img.value = null
    originalImageSize.value = { width: W, height: H }
  }
  appliedCrop.value = data.crop ? { ...data.crop, box: { ...data.crop.box } } : null
  zones.value = (data.words || []).map(w => ({
    id: w.id, text: w.text, shape: w.shape || 'circle',
    x: w.x, y: w.y,
    r: w.r ?? 0.07, w: w.w ?? 0.14, h: w.h ?? 0.14,
  }))
  selectedZoneId.value = null
  cropMode.value = false
  lastExport.value = ''
  nextTick(draw)
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
    originalImageSize.value = { width: W, height: H }
    router.replace({ query: { ...route.query, level: name } })
    nextTick(draw)
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
      : { scale: 1, offsetX: 0, offsetY: 0, box: { x: 0, y: 0, w: W, h: H } }
    cropMode.value = true
    nextTick(draw)
  } else {
    cropMode.value = false
    nextTick(draw)
  }
}

function resetCrop() {
  crop.value = { scale: 1, offsetX: 0, offsetY: 0, box: { x: 0, y: 0, w: W, h: H } }
  croppedImage.value = null
  appliedCrop.value = null
  nextTick(draw)
}

function onCropScaleInput() {
  nextTick(draw)
}

function applyCrop() {
  if (!img.value) return

  // Сохраняем параметры crop ДО сброса
  appliedCrop.value = {
    scale: crop.value.scale,
    offsetX: crop.value.offsetX,
    offsetY: crop.value.offsetY,
    box: { ...crop.value.box },
  }

  const off = document.createElement('canvas')
  off.width = W
  off.height = H
  const ctx = off.getContext('2d')
  ctx.clearRect(0, 0, W, H)

  const iw = img.value.width
  const ih = img.value.height
  const baseScale = Math.min(W / iw, H / ih)
  const s = baseScale * crop.value.scale
  const drawW = iw * s
  const drawH = ih * s
  const drawX = (W - drawW) / 2 + crop.value.offsetX * W
  const drawY = (H - drawH) / 2 + crop.value.offsetY * H

  const bx = crop.value.box.x
  const by = crop.value.box.y
  const bw = crop.value.box.w
  const bh = crop.value.box.h

  const sx = (bx - drawX) / s
  const sy = (by - drawY) / s
  const sw = bw / s
  const sh = bh / s

  ctx.drawImage(img.value, sx, sy, sw, sh, bx, by, bw, bh)

  croppedImage.value = off
  const newImg = new Image()
  newImg.onload = () => {
    img.value = newImg
    cropMode.value = false
    nextTick(draw)
  }
  newImg.src = off.toDataURL('image/png')
}

// ─── ПЕРЕСЕЧЕНИЯ ───
function getBoundingBox(z) {
  const minSide = Math.min(W, H)
  const cx = z.x * W, cy = z.y * H
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
  const minSide = Math.min(W, H)
  if (z.shape === 'rect') {
    const w = z.w * minSide, h = z.h * minSide
    const cx = z.x * W, cy = z.y * H
    return { cx, cy, w, h, left: cx - w / 2, top: cy - h / 2, right: cx + w / 2, bottom: cy + h / 2 }
  }
  const r = z.r * minSide
  const cx = z.x * W, cy = z.y * H
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

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  canvas.width = W * dpr
  canvas.height = H * dpr
  canvas.style.width = W + 'px'
  canvas.style.height = H + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  if (img.value) {
    if (cropMode.value) {
      const iw = img.value.width, ih = img.value.height
      const baseScale = Math.min(W / iw, H / ih)
      const s = baseScale * crop.value.scale
      const drawW = iw * s, drawH = ih * s
      const drawX = (W - drawW) / 2 + crop.value.offsetX * W
      const drawY = (H - drawH) / 2 + crop.value.offsetY * H
      ctx.drawImage(img.value, drawX, drawY, drawW, drawH)

      const { x, y, w, h } = crop.value.box
      ctx.save()
      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.fillRect(0, 0, W, y)
      ctx.fillRect(0, y + h, W, H - (y + h))
      ctx.fillRect(0, y, x, h)
      ctx.fillRect(x + w, y, W - (x + w), h)
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
      ctx.drawImage(img.value, 0, 0, W, H)
    }
  }

  const minSide = Math.min(W, H)
  zones.value.forEach((z, i) => {
    const cx = z.x * W, cy = z.y * H
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
    originalImageSize.value = { width: image.width, height: image.height }
    crop.value = { scale: 1, offsetX: 0, offsetY: 0, box: { x: 0, y: 0, w: W, h: H } }
    cropMode.value = true
    appliedCrop.value = null
    nextTick(draw)
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
  const minSide = Math.min(W, H)
  for (let i = zones.value.length - 1; i >= 0; i--) {
    const z = zones.value[i]
    const cx = z.x * W, cy = z.y * H
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

// ─── МЫШЬ ───
function onDown(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  const px = e.clientX - rect.left
  const py = e.clientY - rect.top

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
    dragOffset.x = px - hit.zone.x * W
    dragOffset.y = py - hit.zone.y * H
    return
  }

  selectedZoneId.value = null
  zones.value.unshift({
    id: 'w' + Date.now(),
    text: `zone ${zones.value.length + 1}`,
    shape: 'rect',
    x: px / W,
    y: py / H,
    r: 0.07, w: 0.14, h: 0.14,
  })
  draw()
}

function onMove(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  const px = e.clientX - rect.left
  const py = e.clientY - rect.top

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
    const minSide = Math.min(W, H)
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

    resizeZone.x = newCx / W
    resizeZone.y = newCy / H
    resizeZone.w = newW / minSide
    resizeZone.h = newH / minSide
    draw()
    return
  }

  if (dragging) {
    dragging.x = (px - dragOffset.x) / W
    dragging.y = (py - dragOffset.y) / H
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
  const data = {
    title: 'My level',
    instructions: 'Протяни линию от названия к нужному месту на картинке',
    imageWidth: originalImageSize.value.width,
    imageHeight: originalImageSize.value.height,
    crop: appliedCrop.value
      ? {
        scale: appliedCrop.value.scale,
        offsetX: appliedCrop.value.offsetX,
        offsetY: appliedCrop.value.offsetY,
        box: { ...appliedCrop.value.box },
      }
      : null,
    words: zones.value.map(z => {
      const base = { id: z.id, text: z.text, shape: z.shape, x: +z.x.toFixed(3), y: +z.y.toFixed(3) }
      if (z.shape === 'rect') { base.w = +z.w.toFixed(3); base.h = +z.h.toFixed(3) }
      else { base.r = +z.r.toFixed(3) }
      return base
    }),
  }
  return data
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
  if (currentLevel.value && currentLevel.value !== '__new__') {
    await loadLevel(currentLevel.value)
  } else if (levelKeys.value.length > 0) {
    currentLevel.value = levelKeys.value[0]
    await loadLevel(currentLevel.value)
  }
  nextTick(draw)
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

.canvas {
  flex: 0 0 800px;
  width: 800px;
  height: 520px;
  border: 1px solid #cbd5e1; border-radius: 8px;
  touch-action: none; cursor: crosshair; display: block;
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
  .canvas { max-width: 100%; height: auto; aspect-ratio: 800 / 520; flex: none; width: 100%; }
}
</style>
