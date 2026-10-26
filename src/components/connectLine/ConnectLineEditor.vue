<template>
  <div class="editor">
    <h2>Connect Line — редактор уровней</h2>

    <div class="toolbar">
      <label class="file-label">
        🖼 Загрузить картинку
        <input type="file" accept="image/*" @change="onImageLoad" />
      </label>

      <label class="file-label">
        📂 Загрузить JSON
        <input type="file" accept="application/json,.json" @change="onJsonLoad" />
      </label>

      <button @click="addZoneAtCenter">+ зона в центр</button>
      <button
        @click="exportJson"
        :disabled="hasConflicts"
        :title="hasConflicts ? 'Убери пересечения зон' : 'Экспорт JSON'"
        :class="{ 'btn-disabled': hasConflicts }"
      >
        ⬇️ Экспорт JSON
      </button>
      <button @click="clearAll">🗑 Очистить</button>
    </div>

<!--    <div v-if="hasConflicts" class="conflict-banner">-->
<!--      ⚠️ Некоторые зоны пересекаются. Раздвинь их, чтобы экспортировать JSON.-->
<!--    </div>-->

    <div class="workspace">
      <canvas
        ref="canvasRef"
        class="canvas"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointerleave="onUp"
      ></canvas>

      <aside class="sidebar">
        <h3>Зоны ({{ zones.length }})</h3>
        <div
          v-for="(z, i) in zones"
          :key="z.id"
          class="zone-item"
          :class="{
            selected: z.id === selectedZoneId,
            conflict: conflictingZoneIds.has(z.id)
          }"
          @click="selectedZoneId = z.id"
        >
          <div class="zone-row">
            <span class="zone-num">{{ i + 1 }}</span>
            <input v-model="z.text" placeholder="Слово..." class="zone-input" />
            <button @click.stop="duplicateZone(i)" class="zone-dup" title="Дублировать">⧉</button>
            <button @click.stop="removeZone(i)" class="zone-del" title="Удалить">✕</button>
          </div>

          <div class="zone-row">
            <span class="zone-label">форма</span>
            <select v-model="z.shape" class="zone-select">
              <option value="circle">круг</option>
              <option value="rect">прямоугольник</option>
            </select>
          </div>

          <div v-if="z.shape === 'circle'" class="zone-row">
            <span class="zone-label">радиус</span>
            <input
              type="range" min="0.02" max="0.3" step="0.005"
              v-model.number="z.r"
              class="zone-range"
            />
            <span class="zone-r-val">{{ (z.r * 100).toFixed(0) }}%</span>
          </div>
          <p v-else class="zone-hint">
            тяни за уголки на canvas
          </p>
        </div>
        <p v-if="zones.length === 0" class="hint">
          Кликни по картинке, чтобы добавить зону
        </p>
      </aside>
    </div>

    <pre v-if="lastExport" class="export">{{ lastExport }}</pre>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { connectLineGames } from './ConnectLineData'

const route = useRoute()

const canvasRef = ref(null)
const zones = ref([])
const img = ref(null)
const lastExport = ref('')
const selectedZoneId = ref(null)

let dragging = null
let dragOffset = { x: 0, y: 0 }
let resizeHandle = null
let resizeZone = null
let resizeStart = null

const W = 800
const H = 520
const HANDLE_SIZE = 10

// ============ ПЕРЕСЕЧЕНИЯ (bounding box, AABB) ============
function getBoundingBox(z) {
  const minSide = Math.min(W, H)
  const cx = z.x * W
  const cy = z.y * H
  if (z.shape === 'rect') {
    const w = z.w * minSide
    const h = z.h * minSide
    return { left: cx - w / 2, right: cx + w / 2, top: cy - h / 2, bottom: cy + h / 2 }
  }
  // круг → квадрат 2r × 2r
  const r = z.r * minSide
  return { left: cx - r, right: cx + r, top: cy - r, bottom: cy + r }
}

function zonesOverlap(a, b) {
  const A = getBoundingBox(a)
  const B = getBoundingBox(b)
  return A.left < B.right && A.right > B.left && A.top < B.bottom && A.bottom > B.top
}

const conflictingZoneIds = computed(() => {
  const set = new Set()
  for (let i = 0; i < zones.value.length; i++) {
    for (let j = i + 1; j < zones.value.length; j++) {
      if (zonesOverlap(zones.value[i], zones.value[j])) {
        set.add(zones.value[i].id)
        set.add(zones.value[j].id)
      }
    }
  }
  return set
})

const hasConflicts = computed(() => conflictingZoneIds.value.size > 0)

// ============ РИСОВАНИЕ ============
function getZoneRect(z) {
  const minSide = Math.min(W, H)
  if (z.shape === 'rect') {
    const w = z.w * minSide
    const h = z.h * minSide
    const cx = z.x * W
    const cy = z.y * H
    return { cx, cy, w, h, left: cx - w / 2, top: cy - h / 2, right: cx + w / 2, bottom: cy + h / 2 }
  }
  const r = z.r * minSide
  const cx = z.x * W
  const cy = z.y * H
  return { cx, cy, r, left: cx - r, top: cy - r, right: cx + r, bottom: cy + r }
}

function getHandles(z) {
  if (z.shape !== 'rect') return []
  const { left, top, right, bottom } = getZoneRect(z)
  const cx = (left + right) / 2
  const cy = (top + bottom) / 2
  return [
    { key: 'nw', x: left, y: top },
    { key: 'n',  x: cx,   y: top },
    { key: 'ne', x: right, y: top },
    { key: 'e',  x: right, y: cy },
    { key: 'se', x: right, y: bottom },
    { key: 's',  x: cx,   y: bottom },
    { key: 'sw', x: left, y: bottom },
    { key: 'w',  x: left, y: cy },
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
    ctx.drawImage(img.value, 0, 0, W, H)
  }

  const minSide = Math.min(W, H)
  zones.value.forEach((z, i) => {
    const cx = z.x * W
    const cy = z.y * H
    const isSelected = z.id === selectedZoneId.value
    const isConflict = conflictingZoneIds.value.has(z.id)

    // === ФОРМА ЗОНЫ ===
    if (z.shape === 'rect') {
      const w = z.w * minSide
      const h = z.h * minSide
      ctx.beginPath()
      ctx.rect(cx - w / 2, cy - h / 2, w, h)
      ctx.fillStyle = 'rgba(59,130,246,0.25)'
      ctx.fill()
      ctx.strokeStyle = isConflict ? '#ef4444' : (isSelected ? '#f59e0b' : '#3b82f6')
      ctx.lineWidth = isConflict ? 3 : (isSelected ? 2.5 : 2)
      ctx.stroke()
    } else {
      const cr = z.r * minSide
      ctx.beginPath()
      ctx.arc(cx, cy, cr, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(59,130,246,0.25)'
      ctx.fill()
      ctx.strokeStyle = isConflict ? '#ef4444' : (isSelected ? '#f59e0b' : '#3b82f6')
      ctx.lineWidth = isConflict ? 3 : (isSelected ? 2.5 : 2)
      ctx.stroke()
    }

    // === ЯКОРЬ / ⚠️ ===
    if (isConflict) {
      ctx.font = 'bold 20px system-ui'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('⚠️', cx, cy)
    } else {
      const lensR = 6
      const handleLen = 5
      const handleAngle = Math.PI / 4

      const hx = cx + Math.cos(handleAngle) * (lensR + handleLen / 2)
      const hy = cy + Math.sin(handleAngle) * (lensR + handleLen / 2)
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(handleAngle) * lensR, cy + Math.sin(handleAngle) * lensR)
      ctx.lineTo(hx + Math.cos(handleAngle) * handleLen / 2, hy + Math.sin(handleAngle) * handleLen / 2)
      ctx.strokeStyle = '#1e3a8a'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(cx, cy, lensR, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(187,69,234,0.62)'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // === ПОДПИСЬ ===
    ctx.fillStyle = '#1e3a8a'
    ctx.font = 'bold 14px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const labelY = z.shape === 'rect'
      ? cy - (z.h * minSide) / 2 - 12
      : cy - z.r * minSide - 12
    ctx.fillText(z.text || `зона ${i + 1}`, cx, labelY)

    // === МАРКЕРЫ RESIZE ===
    if (isSelected && z.shape === 'rect') {
      getHandles(z).forEach(h => {
        ctx.beginPath()
        ctx.rect(h.x - HANDLE_SIZE / 2, h.y - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE)
        ctx.fillStyle = '#f59e0b'
        ctx.fill()
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 1.5
        ctx.stroke()
      })
    }
  })
}

watch(zones, () => { nextTick(draw) }, { deep: true })
watch(selectedZoneId, () => { nextTick(draw) })

// ============ ЗАГРУЗКА / ЭКСПОРТ ============
function onImageLoad(e) {
  const file = e.target.files[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  const image = new Image()
  image.onload = () => {
    img.value = image
    nextTick(draw)
  }
  image.src = url
}

async function onJsonLoad(e) {
  const file = e.target.files[0]
  if (!file) return
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    if (Array.isArray(data.words)) {
      zones.value = data.words.map(w => ({
        id: w.id || 'w' + Date.now() + Math.random(),
        text: w.text || '',
        shape: w.shape || 'circle',
        x: w.x,
        y: w.y,
        r: w.r ?? 0.07,
        w: w.w ?? 0.14,
        h: w.h ?? 0.14,
      }))
      nextTick(draw)
    }
  } catch (err) {
    console.warn('Не удалось прочитать JSON:', err)
  }
}

// ============ ХИТ-ТЕСТ ============
function hitHandle(px, py) {
  const z = zones.value.find(z => z.id === selectedZoneId.value)
  if (!z || z.shape !== 'rect') return null
  const handles = getHandles(z)
  for (const h of handles) {
    if (Math.abs(px - h.x) <= HANDLE_SIZE && Math.abs(py - h.y) <= HANDLE_SIZE) {
      return h.key
    }
  }
  return null
}

function hitZone(px, py) {
  const minSide = Math.min(W, H)
  for (let i = zones.value.length - 1; i >= 0; i--) {
    const z = zones.value[i]
    const cx = z.x * W
    const cy = z.y * H

    if (z.shape === 'rect') {
      const w = z.w * minSide
      const h = z.h * minSide
      if (px >= cx - w / 2 && px <= cx + w / 2 &&
        py >= cy - h / 2 && py <= cy + h / 2) {
        return { zone: z, index: i }
      }
    } else {
      const cr = z.r * minSide
      if (Math.hypot(px - cx, py - cy) <= cr) return { zone: z, index: i }
    }
  }
  return null
}

// ============ МЫШЬ ============
function onDown(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  const px = e.clientX - rect.left
  const py = e.clientY - rect.top

  const handle = hitHandle(px, py)
  if (handle) {
    const z = zones.value.find(z => z.id === selectedZoneId.value)
    const r = getZoneRect(z)
    resizeHandle = handle
    resizeZone = z
    resizeStart = {
      px, py,
      x: z.x, y: z.y,
      w: z.w, h: z.h,
      left: r.left, top: r.top, right: r.right, bottom: r.bottom,
    }
    return
  }

  const hit = hitZone(px, py)
  if (hit) {
    selectedZoneId.value = hit.zone.id
    dragging = hit.zone
    dragOffset.x = px - hit.zone.x * W
    dragOffset.y = py - hit.zone.y * H
    return
  }

  selectedZoneId.value = null
  zones.value.push({
    id: 'w' + Date.now(),
    text: `zone ${zones.value.length + 1}`,
    shape: 'rect',
    x: px / W,
    y: py / H,
    r: 0.07,
    w: 0.14,
    h: 0.14,
  })
  draw()
}

function onMove(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  const px = e.clientX - rect.left
  const py = e.clientY - rect.top

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
    if (right - left < minPx) {
      if (resizeHandle.includes('w')) left = right - minPx
      else right = left + minPx
    }
    if (bottom - top < minPx) {
      if (resizeHandle.includes('n')) top = bottom - minPx
      else bottom = top + minPx
    }

    const newW = right - left
    const newH = bottom - top
    const newCx = (left + right) / 2
    const newCy = (top + bottom) / 2

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
}

// ============ ДЕЙСТВИЯ ============
function addZoneAtCenter() {
  zones.value.push({
    id: 'w' + Date.now(),
    text: `zone ${zones.value.length + 1}`,
    shape: 'rect',
    x: 0.5,
    y: 0.5,
    r: 0.07,
    w: 0.14,
    h: 0.14,
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
    text: z.text,
    shape: z.shape,
    x: 0.5,
    y: 0.5,
    r: z.r,
    w: z.w,
    h: z.h,
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

function exportJson() {
  if (hasConflicts.value) return

  const data = {
    title: 'My level',
    instructions: 'Протяни линию от названия к нужному месту на картинке',
    imageWidth: W,
    imageHeight: H,
    words: zones.value.map(z => {
      const base = {
        id: z.id,
        text: z.text,
        shape: z.shape,
        x: +z.x.toFixed(3),
        y: +z.y.toFixed(3),
      }
      if (z.shape === 'rect') {
        base.w = +z.w.toFixed(3)
        base.h = +z.h.toFixed(3)
      } else {
        base.r = +z.r.toFixed(3)
      }
      return base
    }),
  }
  lastExport.value = JSON.stringify(data, null, 2)
  navigator.clipboard?.writeText(lastExport.value)
}

// ============ ЗАГРУЗКА УРОВНЯ ============
onMounted(async () => {
  const level = route.query.level
  if (level && connectLineGames[level]) {
    const data = connectLineGames[level]
    try {
      const image = new Image()
      image.src = data.image
      await new Promise((res, rej) => {
        image.onload = res
        image.onerror = rej
      })
      img.value = image
    } catch (_) {}
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
  }
  nextTick(draw)
})
</script>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  font-family: system-ui, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}
h2 { margin: 0 0 4px; }
.toolbar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}
.toolbar button, .file-label {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: white;
  cursor: pointer;
  font-size: 14px;
}
.toolbar button:disabled {
  cursor: not-allowed;
}
.btn-disabled {
  opacity: 0.5;
}
.file-label { position: relative; overflow: hidden; }
.file-label input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

.conflict-banner {
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #b91c1c;
  font-size: 14px;
  font-weight: 600;
}

.workspace { display: flex; gap: 16px; }
.canvas {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  touch-action: none;
  cursor: crosshair;
  flex-shrink: 0;
}
.sidebar {
  width: 320px;
  max-height: 520px;
  overflow-y: auto;
  padding: 12px;
  background: #f1f5f9;
  border-radius: 8px;
}
.zone-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
  padding: 8px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
}
.zone-item.selected {
  border-color: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245,158,11,0.2);
}
.zone-item.conflict {
  border-color: #ef4444;
  background: #fef2f2;
}
.zone-row {
  display: flex;
  gap: 6px;
  align-items: center;
}
.zone-num {
  width: 20px;
  text-align: center;
  color: #64748b;
  font-size: 12px;
}
.zone-input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 13px;
}
.zone-select {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 13px;
  background: white;
}
.zone-range { flex: 1; }
.zone-label { font-size: 12px; color: #64748b; width: 50px; }
.zone-r-val { font-size: 12px; color: #64748b; width: 34px; text-align: right; }
.zone-dup {
  background: #bfdbfe;
  border: none;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}
.zone-dup:hover { background: #93c5fd; }
.zone-del {
  background: #fecaca;
  border: none;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}
.zone-hint {
  font-size: 11px;
  color: #94a3b8;
  font-style: italic;
  margin: 0;
}
.hint { color: #64748b; font-size: 13px; }
.export {
  background: #0f172a;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  max-height: 300px;
  overflow: auto;
  font-size: 12px;
  white-space: pre;
}
</style>
