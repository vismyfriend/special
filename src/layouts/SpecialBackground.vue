<!-- src/layouts/SpecialBackground.vue -->
<template>
  <!-- Фон рабочего стола -->
  <img
    class="desktop-background"
    :style="blurStyle"
    :src="currentBackground?.img"
    alt=""
  />

  <!-- Контент страниц -->
  <div class="desktop-content">
    <router-view />
  </div>

  <!-- Dev-панель: только в dev -->
  <div v-if="showDevPanel" class="dev-panel">
    <div class="dev-panel__header">
      <span>🛠️ Dev: Background</span>
      <button class="dev-panel__close" @click="devCollapsed = !devCollapsed">
        {{ devCollapsed ? '▲' : '▼' }}
      </button>
    </div>

    <div v-if="!devCollapsed" class="dev-panel__body">
      <p class="dev-panel__info">
        <b>Сегодня:</b> {{ dayNames[todayDay] }} (day = {{ todayDay }})
      </p>
      <p class="dev-panel__info">
        <b>Текущий фон:</b> {{ dayNames[currentDay] }} (day = {{ currentDay }})
      </p>

      <!-- BLUR info -->
      <p class="dev-panel__info">
        <b>Blur:</b> {{ blurAmount }}px
        <span v-if="devBlurOverride !== null"> (dev)</span>
        <span v-else-if="route.meta?.blur !== undefined"> (meta: {{ route.meta.blur }})</span>
      </p>

      <!-- Дни недели -->
      <div class="dev-panel__buttons">
        <button
          v-for="b in backgrounds"
          :key="b.day"
          :class="{ active: b.day === currentDay }"
          @click="setDay(b.day)"
        >
          {{ dayNames[b.day] }}
        </button>
      </div>

      <!-- Blur-кнопки -->
      <div class="dev-panel__actions dev-panel__blur-actions">
        <button
          v-for="opt in blurOptions"
          :key="opt.value"
          :class="{ active: devBlurOverride === opt.value }"
          @click="devBlurOverride = opt.value"
        >
          {{ opt.label }}
        </button>
        <button
          :class="{ active: devBlurOverride === null }"
          @click="devBlurOverride = null"
        >
          Сброс
        </button>
      </div>

      <!-- Навигация по дням -->
      <div class="dev-panel__actions">
        <button @click="resetToToday">↺ Сегодня</button>
        <button @click="prevDay">← Предыдущий</button>
        <button @click="nextDay">Следующий →</button>
      </div>

      <p class="dev-panel__hint">
        только для этой сессии. При перезагрузке — снова meta/дефолт.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// ─── DEV-ФЛАГ ───
const isDev = import.meta.env.DEV

// ─── ФОН ───
const backgrounds = ref([
  { day: 0, img: new URL('../assets/images/background1.jpg', import.meta.url).href },
  { day: 1, img: new URL('../assets/images/background2.jpg', import.meta.url).href },
  { day: 2, img: new URL('../assets/images/background8.jpg', import.meta.url).href },
  { day: 3, img: new URL('../assets/images/SpecialRoomGreen.jpg', import.meta.url).href },
  { day: 4, img: new URL('../assets/images/background5.jpg', import.meta.url).href },
  { day: 5, img: new URL('../assets/images/background6.jpg', import.meta.url).href },
  { day: 6, img: new URL('../assets/images/background7.jpg', import.meta.url).href },
])

const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

const currentDay = ref(0)
const todayDay = computed(() => new Date().getDay())

const currentBackground = computed(() =>
  backgrounds.value.find(el => el.day === currentDay.value)
)

// ─── BLUR ───
const DEFAULT_BLUR = 6

const devBlurOverride = ref(null)

const blurOptions = [
  { label: '0',    value: 0 },
  { label: '3px',  value: 3 },
  { label: '6px',  value: 6 },
  { label: '10px', value: 10 },
  { label: '15px', value: 15 },
]

const blurAmount = computed(() => {
  // 1) dev-override (только в dev)
  if (isDev && devBlurOverride.value !== null) {
    return Math.max(0, devBlurOverride.value)
  }

  // 2) meta.blur
  const b = route.meta?.blur
  if (b !== undefined) {
    if (b === false) return 0
    if (b === true) return DEFAULT_BLUR
    if (typeof b === 'number') return Math.max(0, b)
    return DEFAULT_BLUR
  }

  // 3) обратная совместимость
  if (route.path === '/notBlurredBackground') return 0

  // 4) дефолт
  return DEFAULT_BLUR
})

const blurStyle = computed(() => {
  if (blurAmount.value <= 0) return {}
  return {
    filter: `blur(${blurAmount.value}px)`,
    boxShadow: '0 0 20px 17px black',
  }
})

// ─── DEV-ПАНЕЛЬ ───
const showDevPanel = computed(() =>
    isDev && (
      route.path === '/test-background' ||
      route.meta?.showDevPanel === true
    )
)

const devCollapsed = ref(false)

// ─── УПРАВЛЕНИЕ ───
function setDay(day) {
  currentDay.value = day
}
function resetToToday() {
  currentDay.value = new Date().getDay()
}
function nextDay() {
  currentDay.value = (currentDay.value + 1) % 7
}
function prevDay() {
  currentDay.value = (currentDay.value + 6) % 7
}

// ─── ИНИЦИАЛИЗАЦИЯ ───
onMounted(() => {
  currentDay.value = new Date().getDay()
  console.log('какой сегодня день -', currentDay.value)
})
</script>

<style scoped>
/* ─── ФОН ─── */
.desktop-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
  pointer-events: none;
}

/* ─── КОНТЕНТ ─── */
.desktop-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;

}

/* ─── DEV-ПАНЕЛЬ ─── */
.dev-panel {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 9999;
  background: rgba(15, 23, 42, 0.95);
  color: #e2e8f0;
  border-radius: 12px;
  padding: 10px 14px;
  font-family: system-ui, sans-serif;
  font-size: 13px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  max-width: 340px;
}

.dev-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  margin-bottom: 8px;
  gap: 12px;
}

.dev-panel__close {
  background: transparent;
  border: none;
  color: #e2e8f0;
  cursor: pointer;
  font-size: 14px;
  padding: 0 4px;
}

.dev-panel__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dev-panel__info {
  margin: 0;
  font-size: 12px;
  color: #cbd5e1;
}

.dev-panel__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.dev-panel__buttons button {
  padding: 6px 10px;
  border: 1px solid #475569;
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
}

.dev-panel__buttons button:hover {
  background: #334155;
}

.dev-panel__buttons button.active {
  background: #3b82f6;
  border-color: #3b82f6;
}

.dev-panel__actions {
  display: flex;
  gap: 6px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.dev-panel__actions button {
  padding: 6px 10px;
  border: 1px solid #475569;
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
}

.dev-panel__actions button:hover {
  background: #334155;
}

.dev-panel__actions button.active {
  background: #3b82f6;
  border-color: #3b82f6;
}

.dev-panel__blur-actions {
  padding-top: 6px;
  border-top: 1px solid #334155;
  margin-top: 6px;
}

.dev-panel__hint {
  margin: 0;
  font-size: 11px;
  color: #94a3b8;
  font-style: italic;
}
</style>
