<template>
  <div class="connect-game">
<!--    <h2>{{ gameData.title }}</h2>-->
    <p class="instructions">{{ gameData.instructions }}</p>
    <canvas ref="canvasRef" class="game-canvas"></canvas>



    <!-- ─── Панель управления: сложность + кнопки ─── -->
    <div class="control-panel">
      <!-- Сложность -->
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

      <!-- Кнопки -->
      <div class="controls">
        <button
          v-if="difficulty === 'medium' || difficulty === 'hard'"
          @click="handleCheckAll"
          class="btn-check"
        >✅ Проверить</button>
        <button v-if="difficulty === 'easy'" class="btn-editor" @click="openEditor">✏️ Редактор</button>
        <!-- Уровни — только на лёгком -->
        <div v-if="difficulty === 'easy'" class="levels-dropdown" ref="levelsDropdownRef">
          <button class="btn-levels" @click="levelsOpen = !levelsOpen">
            📚 Уровни ▾
          </button>
          <ul v-if="levelsOpen" class="levels-menu">
            <li
              v-for="key in levelKeys"
              :key="key"
              :class="{ active: key === resolvedName }"
              @click="selectLevel(key)"
            >
              {{ key }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
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
  () => props.missionName || route.query.level || route.params.missionName || 'house'
)
const gameData = computed(() => connectLineGames[resolvedName.value])

const canvasRef = ref(null)
let engine = null
let logic = null

const difficulty = ref('easy')
const lastResult = ref(null)

function handleCheckAll() {
  if (!logic?.checkAll) return
  lastResult.value = logic.checkAll()
}

async function restart() {
  console.log('🔄 restart, level =', resolvedName.value, 'engine =', !!engine)
  if (!engine) return
  if (logic) {
    logic.activeLine.value = null
    logic.selectedCard.value = null
  }
  engine.clear()
  if (!gameData.value) return

  logic = useConnectLine(engine, gameData.value, difficulty, difficulty.value === 'easy')
  await logic.setup()
  engine.onPointerDown = logic.onPointerDown
  engine.onPointerMove = logic.onPointerMove
  engine.onPointerUp = logic.onPointerUp
  engine.start()
  lastResult.value = null
}

function setDifficulty(level) {
  if (level === difficulty.value) return
  difficulty.value = level
  restart()
}

function goHardcore() {
  router.push({
    path: '/specialCursor/v/specialHeader/tablet/connectLine-hardcore',
    query: { level: resolvedName.value },
  })
}

function openEditor() {
  router.push({
    path: '/specialCursor/v/specialHeader/connectLine-editor',
    query: { level: resolvedName.value },
  })
}

// ─── УРОВНИ ───
const levelsOpen = ref(false)
const levelsDropdownRef = ref(null)
const levelKeys = computed(() => Object.keys(connectLineGames))

function selectLevel(key) {
  levelsOpen.value = false
  if (key === resolvedName.value) return
  router.push({
    path: '/specialCursor/v/specialHeader/tablet/connectLine',
    query: { level: key, difficulty: difficulty.value },
  })
}

function onClickOutside(e) {
  if (!levelsDropdownRef.value) return
  if (!levelsDropdownRef.value.contains(e.target)) {
    levelsOpen.value = false
  }
}

// Перезапуск игры при смене уровня
watch(resolvedName, (newVal, oldVal) => {
  console.log('📚 level changed:', oldVal, '→', newVal)
  levelsOpen.value = false
  restart()
})

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
  document.addEventListener('click', onClickOutside)

  const qd = route.query.difficulty
  if (qd && ['easy', 'medium', 'hard'].includes(qd)) {
    difficulty.value = qd
  }
  engine = new CanvasEngine(canvasRef.value)
  lastWidth = window.innerWidth
  window.addEventListener('resize', onResize)
  await restart()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  window.removeEventListener('resize', onResize)
  engine?.destroy()
})
</script>
<style scoped>
/* ─── КОРНЕВОЙ КОНТЕЙНЕР ─── */
.connect-game {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  font-family: system-ui, sans-serif;
  background: #ffffff;
  border-radius: 25px;
}

h2 {
  margin: 0 0 8px;
}

.instructions {
  color: #555;
  margin: 0 0 16px;
}

/* ─── CANVAS ─── */
.game-canvas {
  width: 100%;
  height: 520px;
  display: block;
  background: #f8fafc;
  border-radius: 16px;
  touch-action: none;
  cursor: crosshair;
}

/* ─── ПАНЕЛЬ УПРАВЛЕНИЯ: сложность + кнопки в одну строку ─── */
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

/* ─── Сложность (сегменты) ─── */
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

.seg-hardcore:hover {
  background: rgba(124, 58, 237, 0.08);
}

/* ─── УРОВНИ (dropdown вверх) ─── */
.levels-dropdown {
  position: relative;
  display: inline-block;
}

.btn-levels {
  padding: 8px 14px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  line-height: 1;
  background: #8b5cf6;
  color: white;
}

.btn-levels:hover {
  background: #7c3aed;
}

.levels-menu {
  position: absolute;
  bottom: 100%;           /* ← открывается ВВЕРХ */
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 6px;     /* отступ от кнопки */
  list-style: none;
  padding: 6px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  min-width: 160px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
}

.levels-menu li {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #334155;
  transition: background 0.15s;
  white-space: nowrap;
}

.levels-menu li:hover {
  background: #f1f5f9;
}

.levels-menu li.active {
  background: #ede9fe;
  color: #6d28d9;
  font-weight: 600;
}

/* ─── Кнопки «Проверить» / «Редактор» ─── */
.controls {
  display: flex;
  gap: 6px;
  align-items: center;
}

.btn-check,
.btn-editor {
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

.btn-editor {
  background: #f59e0b;
  color: white;
}

.btn-editor:hover {
  background: #d97706;
}

/* ─── МОБИЛКА ─── */
@media (max-width: 600px) {
  .connect-game {
    margin: 16px auto;
    padding: 12px;
  }

  h2 {
    font-size: 20px;
  }

  .instructions {
    font-size: 14px;
  }

  .game-canvas {
    height: 70vh;
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
  .btn-editor {
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style>
