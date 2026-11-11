<template>
  <div class="hardcore">
    <p class="instructions">{{ gameData.instructions }}</p>

    <div class="canvas-wrapper" ref="wrapperRef">
      <canvas ref="canvasRef" class="game-canvas"></canvas>
      <input
        v-for="card in cards"
        :key="card.id"
        type="text"
        class="card-input"
        :class="getInputClass(card.id)"
        :value="inputs[card.id]"
        placeholder="?"
        @input="onInput(card.id, $event)"
        @blur="checkCard(card.id)"
        @keyup.enter="checkCard(card.id)"
        :ref="el => setInputRef(el, card.id)"
      />
    </div>

    <!-- ─── Панель управления: сложность + кнопки ─── -->
    <div class="control-panel">
      <!-- Сложность -->
      <div class="difficulty-segments">
        <button class="seg" @click="goEasy">🟢 Лёгкий</button>
        <button class="seg" @click="goMedium">🟡 Средний</button>
        <button class="seg" @click="goHard">🔴 Сложный</button>
        <button class="seg seg-hardcore active" disabled>⚫ Хардкор</button>
      </div>

      <!-- Кнопки -->
<!--      <div class="controls">-->
<!--        <button @click="handleCheckAll" class="btn-check">✅ Проверить</button>-->
<!--      </div>-->
    </div>

    <p v-if="lastResult" class="result-text">
      Правильно: {{ lastResult.correct }} / {{ lastResult.total }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CanvasEngine } from '../specialEngine/CanvasEngine'
import { useConnectLineHardcore } from './useConnectLineHardcore'
import { connectLineGames } from './ConnectLineData'

const props = defineProps({
  missionName: { type: String, default: null },
})
const route = useRoute()
const router = useRouter()

const resolvedName = computed(
  () => props.missionName || route.query.level || route.params.missionName || 'house'
)
const gameData = computed(() => connectLineGames[resolvedName.value])

const wrapperRef = ref(null)
const canvasRef = ref(null)
let engine = null
let logic = null

const cards = ref([])
const inputs = ref({})
const results = ref({})
const lastResult = ref(null)

const inputRefs = {}
function setInputRef(el, cardId) {
  if (el) inputRefs[cardId] = el
  else delete inputRefs[cardId]
}

function getInputClass(cardId) { return logic?.getInputClass(cardId) || '' }
function onInput(cardId, e) { logic.setInput(cardId, e.target.value) }
function checkCard(cardId) { logic.checkCard(cardId) }
function handleCheckAll() { lastResult.value = logic.checkAll() }

// === синхронизация позиций input-ов с canvas-карточками ===
let rafId = null
function syncInputPositions() {
  cards.value.forEach(card => {
    const el = inputRefs[card.id]
    if (!el) return
    el.style.left = card.x + 'px'
    el.style.top = card.y + 'px'
    el.style.width = card.w + 'px'
    el.style.height = card.h + 'px'
  })
  rafId = requestAnimationFrame(syncInputPositions)
}

async function restart() {
  if (!engine) return
  engine.clear()
  if (!gameData.value) return
  logic = useConnectLineHardcore(engine, gameData.value)
  await logic.setup()
  engine.start()

  cards.value = logic.cards
  inputs.value = logic.inputs.value
  results.value = logic.results.value
  lastResult.value = null

  await nextTick()
  if (rafId) cancelAnimationFrame(rafId)
  syncInputPositions()
}

function goBack() {
  router.push({
    path: '/specialCursor/v/specialHeader/tablet/connectLine',
    query: { level: resolvedName.value },
  })
}

function goEasy() {
  router.push({
    path: '/specialCursor/v/specialHeader/tablet/connectLine',
    query: { level: resolvedName.value, difficulty: 'easy' },
  })
}

function goMedium() {
  router.push({
    path: '/specialCursor/v/specialHeader/tablet/connectLine',
    query: { level: resolvedName.value, difficulty: 'medium' },
  })
}

function goHard() {
  router.push({
    path: '/specialCursor/v/specialHeader/tablet/connectLine',
    query: { level: resolvedName.value, difficulty: 'hard' },
  })
}

let lastWidth = 0
let resizeTimer = null
function onResize() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    if (Math.abs(window.innerWidth - lastWidth) < 50) return
    lastWidth = window.innerWidth
    restart()
  }, 300)
}

onMounted(async () => {
  engine = new CanvasEngine(canvasRef.value)
  lastWidth = window.innerWidth
  window.addEventListener('resize', onResize)
  await restart()
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', onResize)
  engine?.destroy()
})
</script>

<style scoped>
/* ─── КОРНЕВОЙ КОНТЕЙНЕР ─── */
.hardcore {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  font-family: system-ui, sans-serif;
  background: #ffffff;
  border-radius: 25px;
}

.instructions {
  color: #555;
  margin: 0 0 16px;
}

/* ─── CANVAS + INPUT-Ы ─── */
.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 520px;
}

.game-canvas {
  width: 100%;
  height: 520px;
  display: block;
  background: #f8fafc;
  border-radius: 16px;
  touch-action: none;
}

.card-input {
  position: absolute;
  box-sizing: border-box;
  padding: 0 10px;
  border: 2px solid #3b82f6;
  border-radius: 12px;
  background: white;
  font-family: system-ui, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}

.card-input:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.card-input.correct {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.08);
  color: #15803d;
}

.card-input.incorrect {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
  color: #b91c1c;
}

/* ─── ПАНЕЛЬ УПРАВЛЕНИЯ ─── */
.control-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
  padding: 8px 12px;
  background: #f1f5f9;
  border-radius: 14px;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

/* ─── СЛОЖНОСТЬ ─── */
.difficulty-segments {
  display: flex;
  gap: 4px;
  flex-wrap: nowrap;
}

.seg {
  padding: 8px 12px;
  background: transparent;
  color: #475569;
  border: 2px solid transparent;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  line-height: 1;
}

.seg:hover {
  background: rgba(255, 255, 255, 0.6);
}

.seg.active {
  background: white;
  color: #1d4ed8;
  border-color: #3b82f6;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
}

.seg-hardcore {
  color: #7c3aed;
}

.seg-hardcore.active {
  color: #7c3aed;
  border-color: #7c3aed;
}

.seg:disabled {
  cursor: default;
}

.seg:disabled:hover {
  background: white;
}

/* ─── КНОПКИ ─── */
.controls {
  display: flex;
  gap: 6px;
  align-items: center;
}

.btn-check,
.btn-restart,
.btn-back {
  padding: 8px 14px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  line-height: 1;
}

.btn-check {
  background: #3b82f6;
  color: white;
}
.btn-check:hover {
  background: #2563eb;
}

.btn-restart {
  background: #64748b;
  color: white;
}
.btn-restart:hover {
  background: #475569;
}

.btn-back {
  background: #f59e0b;
  color: white;
}
.btn-back:hover {
  background: #d97706;
}

/* ─── РЕЗУЛЬТАТ ─── */
.result-text {
  text-align: center;
  margin-top: 12px;
  font-weight: 600;
  color: #1e293b;
}

/* ─── МОБИЛКА ─── */
@media (max-width: 600px) {
  .hardcore {
    margin: 16px auto;
    padding: 12px;
  }

  .instructions {
    font-size: 14px;
  }

  .canvas-wrapper,
  .game-canvas {
    height: 70vh;
  }

  .card-input {
    font-size: 13px;
    padding: 0 6px;
    border-radius: 8px;
    border-width: 1.5px;
  }

  .control-panel {
    gap: 8px;
    padding: 6px 8px;
  }

  .difficulty-segments {
    flex-wrap: wrap;
    gap: 3px;
  }

  .seg {
    padding: 6px 8px;
    font-size: 12px;
  }

  .btn-check,
  .btn-restart,
  .btn-back {
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style>
