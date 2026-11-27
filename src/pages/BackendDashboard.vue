<template>
  <main class="dashboard">
    <header>
      <h1>Диагностика бэкенда</h1>
      <p>Связь с API и статистика из выбранной базы.</p>
    </header>

    <form class="connection" @submit.prevent="runChecks">
      <q-input v-model="address" label="Адрес API" outlined dense :disable="running" />
      <q-btn type="submit" color="primary" label="Проверить и обновить" :loading="running" no-caps />
    </form>
    <p v-if="addressError" class="text-negative" role="alert">{{ addressError }}</p>

    <section aria-labelledby="checks-heading">
      <h2 id="checks-heading">Проверки</h2>
      <div class="cards" aria-live="polite">
        <q-card v-for="probe in probes" :key="probe.path" flat bordered>
          <q-card-section>
            <strong>{{ probe.title }}</strong> <code>{{ probe.path }}</code>
            <div class="status">
              {{ statusLabels[probe.state] }}
              <span v-if="probe.status"> · HTTP {{ probe.status }}</span>
              <span v-if="probe.duration != null"> · {{ probe.duration }} мс</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </section>

    <section v-if="snapshot" aria-labelledby="stats-heading">
      <h2 id="stats-heading">Статистика</h2>
      <p class="snapshot-caption">Данные с {{ checkedAddress }} на {{ updatedAt }}.</p>
      <div class="cards">
        <q-card v-for="metric in metrics" :key="metric.label" flat bordered>
          <q-card-section>
            <span>{{ metric.label }}</span>
            <strong class="metric">{{ metric.value }}</strong>
          </q-card-section>
        </q-card>
      </div>
      <p>Роли: {{ roleSummary }}</p>
      <p>Тарифы: {{ tierSummary }}</p>

      <h3>Профили</h3>
      <q-input v-model="userFilter" label="Поиск по агенту, роли или тарифу" outlined dense class="filter" />
      <q-table flat bordered row-key="key" :rows="users" :columns="userColumns"
               :filter="userFilter" :pagination="pagination" no-data-label="Профилей нет"
               no-results-label="Ничего не найдено" />

      <h3>Игры</h3>
      <q-table flat bordered row-key="game" :rows="games" :columns="gameColumns"
               :pagination="pagination" no-data-label="Результатов нет" />

      <h3>Результаты</h3>
      <p>Это сохранённые рекорды. Повторные попытки могут обновлять запись.</p>
      <q-input v-model="scoreFilter" label="Поиск по игре, агенту или набору" outlined dense class="filter" />
      <q-table flat bordered row-key="key" :rows="scores" :columns="scoreColumns"
               :filter="scoreFilter" :pagination="pagination" no-data-label="Результатов нет"
               no-results-label="Ничего не найдено" />
    </section>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { createBackendDiagnostics } from 'src/api/backendDiagnostics'
import { httpClient } from 'src/api/modules/httpClient'

const initialProbes = [
  { path: '/test', title: 'Сервер' },
  { path: '/health', title: 'Связь с базой' },
  { path: '/db', title: 'Данные для статистики' },
]

const statusLabels = {
  idle: 'Ожидает проверки',
  pending: 'Проверяем…',
  ok: 'Доступно',
  unexpected: 'Неожиданный формат ответа',
  'http-error': 'Сервер вернул ошибку',
  timeout: 'Сервер не ответил за 10 секунд',
  'network-error': 'Браузер не получил ответ (сеть или CORS)',
}

const address = ref(httpClient.defaults.baseURL)
const addressError = ref('')
const checkedAddress = ref('')
const updatedAt = ref('')
const probes = ref(initialProbes.map(probe => ({ ...probe, state: 'idle' })))
const snapshot = ref(null)
const running = ref(false)
const userFilter = ref('')
const scoreFilter = ref('')
const pagination = { rowsPerPage: 10 }
let activeRun

async function runChecks() {
  if (running.value) return
  addressError.value = ''
  const run = new AbortController()
  const target = address.value
  let diagnostics
  try {
    diagnostics = createBackendDiagnostics(target, run.signal)
  } catch {
    addressError.value = 'Введи полный адрес API, например https://api.example.com.'
    return
  }

  activeRun = run
  running.value = true
  snapshot.value = null
  probes.value = initialProbes.map(probe => ({ ...probe, state: 'pending' }))

  await Promise.all(initialProbes.map(async ({ path }, index) => {
    const { snapshot: data, ...result } = await diagnostics.check(path)
    if (run.signal.aborted) return
    Object.assign(probes.value[index], result)
    if (data) {
      snapshot.value = data
      checkedAddress.value = target.trim()
      updatedAt.value = new Date().toLocaleString('ru-RU')
    }
  }))

  if (!run.signal.aborted) running.value = false
}

onBeforeUnmount(() => activeRun?.abort())

function numberOrMissing(value) {
  return value != null && value !== '' && Number.isFinite(Number(value)) ? Number(value) : null
}

const users = computed(() => (snapshot.value?.users ?? []).map((row, index) => ({
  key: index,
  agent: row?.username || '—',
  role: row?.role || 'Не указана',
  tier: row?.subscription_tier || 'Не указан',
  expires: row?.subscription_end_date || null,
})))

const scores = computed(() => (snapshot.value?.scores ?? []).map((row, index) => ({
  key: index,
  agent: row?.agent || '—',
  game: row?.game_name || row?.game || '—',
  wordSet: row?.wordset || row?.wordSet || '—',
  time: numberOrMissing(row?.time),
  mistakes: numberOrMissing(row?.mistakes),
})))

const games = computed(() => {
  const byGame = new Map()
  for (const score of scores.value) {
    if (!byGame.has(score.game)) {
      byGame.set(score.game, { game: score.game, count: 0, bestTime: null })
    }
    const game = byGame.get(score.game)
    game.count++
    if (score.time != null && (game.bestTime == null || score.time < game.bestTime)) {
      game.bestTime = score.time
    }
  }
  return [...byGame.values()].sort((a, b) => b.count - a.count || a.game.localeCompare(b.game))
})

const metrics = computed(() => [
  { label: 'Профили в базе', value: users.value.length },
  { label: 'Сохранённые результаты', value: scores.value.length },
  { label: 'Игры с результатами', value: games.value.filter(({ game }) => game !== '—').length },
])

function summarize(rows, field) {
  const counts = new Map()
  for (const row of rows) counts.set(row[field], (counts.get(row[field]) ?? 0) + 1)
  return [...counts].map(([label, count]) => `${label} — ${count}`).join(', ') || '—'
}

const roleSummary = computed(() => summarize(users.value, 'role'))
const tierSummary = computed(() => summarize(users.value, 'tier'))

function formatTime(ms) {
  return ms == null ? '—' : `${(ms / 1000).toLocaleString('ru-RU', { maximumFractionDigits: 2 })} с`
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('ru-RU')
}

const userColumns = [
  { name: 'agent', label: 'Агент', field: 'agent', align: 'left', sortable: true },
  { name: 'role', label: 'Роль', field: 'role', align: 'left', sortable: true },
  { name: 'tier', label: 'Тариф', field: 'tier', align: 'left', sortable: true },
  { name: 'expires', label: 'Подписка до', field: 'expires', format: formatDate },
]

const gameColumns = [
  { name: 'game', label: 'Игра', field: 'game', align: 'left', sortable: true },
  { name: 'count', label: 'Результаты', field: 'count', sortable: true },
  { name: 'bestTime', label: 'Лучшее время', field: 'bestTime', format: formatTime, sortable: true },
]

const scoreColumns = [
  gameColumns[0],
  userColumns[0],
  { name: 'wordSet', label: 'Набор', field: 'wordSet', align: 'left', sortable: true },
  { name: 'time', label: 'Время', field: 'time', format: formatTime, sortable: true },
  { name: 'mistakes', label: 'Ошибки', field: 'mistakes', format: value => value ?? '—', sortable: true },
]
</script>

<style scoped>
.dashboard {
  max-width: 1080px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 32px clamp(16px, 4vw, 40px) 48px;
  color: #172339;
  background: #f6f8fc;
}

h1, h2, h3 {
  line-height: 1.2;
}

h1 { margin: 0 0 8px; font-size: clamp(1.8rem, 5vw, 2.5rem); }
h2 { margin: 28px 0 12px; font-size: 1.4rem; }
h3 { margin: 24px 0 12px; font-size: 1.15rem; }

.connection {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.connection .q-field { flex: 1 1 300px; }

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.status { margin-top: 8px; }
.metric { display: block; margin-top: 6px; font-size: 1.6rem; }
.snapshot-caption { overflow-wrap: anywhere; }
.filter { max-width: 380px; margin-bottom: 10px; }
</style>
