<template>
  <div class="connect-game">
    <h2>{{ gameData.title }}</h2>
    <p class="instructions">{{ gameData.instructions }}</p>
    <canvas ref="canvasRef" class="game-canvas"></canvas>

    <div class="controls">
<!--      <button @click="restart">Начать заново</button>-->
      <button class="editor-btn" @click="openEditor">✏️ Редактор</button>
    </div>

    <!-- сегментированный переключатель уровня -->
    <div class="difficulty-segments">
      <button
        class="seg"
        :class="{ active: difficulty === 'easy' }"
        @click="setDifficulty('easy')"
      >🟢 Лёгкий</button>
      <button
        class="seg"
        :class="{ active: difficulty === 'medium' }"
        @click="setDifficulty('medium')"
      >🟡 Средний</button>
      <button
        class="seg"
        :class="{ active: difficulty === 'hard' }"
        @click="setDifficulty('hard')"
      >🔴 Сложный</button>
      <button
        class="seg seg-hardcore"
        @click="goHardcore"
      >⚫ Хардкор</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CanvasEngine } from '../specialEngine/CanvasEngine'
import { useConnectLine } from './useConnectLine'
import { connectLineGames } from './ConnectLineData'

const props = defineProps({
  missionName: { type: String, default: null },
})
const route = useRoute()
const router = useRouter()

const resolvedName = computed(
  () => props.missionName || route.params.missionName || 'house'
)
const gameData = computed(() => connectLineGames[resolvedName.value])

const canvasRef = ref(null)
let engine = null
let logic = null

const difficulty = ref('easy')

async function restart() {
  if (!engine) return
  if (logic) {
    logic.activeLine.value = null
    logic.selectedCard.value = null
  }
  engine.clear()
  if (!gameData.value) return

  logic = useConnectLine(engine, gameData.value, difficulty)
  await logic.setup()
  engine.onPointerDown = logic.onPointerDown
  engine.onPointerMove = logic.onPointerMove
  engine.onPointerUp = logic.onPointerUp
  engine.start()
}

function setDifficulty(level) {
  if (level === difficulty.value) return
  difficulty.value = level
  restart()
}

function goHardcore() {
  router.push({
    path: '/connectLine-hardcore',
    query: { level: resolvedName.value },
  })
}

function openEditor() {
  router.push({
    path: '/connectLine-editor',
    query: { level: resolvedName.value },
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
  const qd = route.query.difficulty
  if (qd && ['easy','medium','hard'].includes(qd)) {
    difficulty.value = qd
  }
  engine = new CanvasEngine(canvasRef.value)
  lastWidth = window.innerWidth
  window.addEventListener('resize', onResize)
  await restart()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  engine?.destroy()
})
</script>

<style scoped>
.connect-game {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  font-family: system-ui, sans-serif;
}
h2 { margin: 0 0 8px; }
.instructions { color: #555; margin: 0 0 16px; }
.game-canvas {
  width: 100%;
  height: 520px;
  display: block;
  background: #f8fafc;
  border-radius: 16px;
  touch-action: none;
  cursor: crosshair;
}
.controls { margin-top: 16px; text-align: center; }
button {
  padding: 10px 24px;
  border: none;
  border-radius: 12px;
  background: #3b82f6;
  color: white;
  font-weight: 600;
  cursor: pointer;
}
.editor-btn {
  background: #f59e0b;
  margin-left: 12px;
}

/* === сегментированный переключатель === */
.difficulty-segments {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
  padding: 6px;
  background: #f1f5f9;
  border-radius: 14px;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
}
.seg {
  flex: 1;
  min-width: 0;
  padding: 10px 14px;
  background: transparent;
  color: #475569;
  border: 2px solid transparent;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.seg:hover {
  background: rgba(255,255,255,0.6);
}
.seg.active {
  background: white;
  color: #1d4ed8;
  border-color: #3b82f6;
  box-shadow: 0 2px 6px rgba(59,130,246,0.2);
}
.seg-hardcore {
  color: #7c3aed;
}
.seg-hardcore:hover {
  background: rgba(124,58,237,0.08);
}

@media (max-width: 600px) {
  .editor-btn { display: none !important; }

  .connect-game { margin: 16px auto; padding: 12px; }
  h2 { font-size: 20px; }
  .instructions { font-size: 14px; }
  .game-canvas { height: 70vh; }
  .controls { margin-top: 12px; }
  button { padding: 8px 18px; font-size: 14px; }
  .editor-btn { margin-left: 8px; }
  .difficulty-segments {
    gap: 4px;
    padding: 4px;
    max-width: 100%;
  }
  .seg {
    font-size: 12px;
    padding: 8px 6px;
  }
}
</style>
