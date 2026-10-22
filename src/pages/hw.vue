<template>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <h1 class="agent-name" @click="openNameModal">
          my name is {{ displayUserName }}
        </h1>
      </div>
      <div class="header-right">
        <button class="print-button"
                @click="checkAnswers"
                :disabled="isChecking || !isAnyAnswerFilled"
                title="Проверить">
          ✅
        </button>
        <button class="print-button pdf-button" @click="printPDF" title="Скачать PDF">
          🖨️
        </button>
        <button class="print-button"
                @click="openClearConfirmModal"
                title="Очистить">
          🧹
        </button>
        <button class="print-button" @click="openMissionsList" title="Список заданий">
          📚
        </button>
      </div>
    </div>

    <div class="notebook-wrapper" :style="{ height: notebookHeight + 'px' }">
      <div class="notebook-cover">
        <div class="notebook-page">
          <div class="notebook-grid"></div>

          <div class="notebook-content" ref="contentRef">
            <div v-if="currentMission" class="content-inner">
              <p class="gray-font">
                {{ currentMission.description }}
              </p>

              <div
                v-for="(task, index) in currentMission.tasks"
                :key="index"
                class="task-block"
              >
                <h3 v-if="task.title" class="task-title">{{ task.title }}</h3>

                <div class="question-text">
                  {{ task.question }}

                  <span
                    v-for="hint in getAvailableHints(task, index)"
                    :key="hint.index"
                    class="hint-icon"
                    @click="toggleHint(index, hint.index)"
                  >
                    💡
                  </span>

                  <span
                    v-if="
                      task.type !== 'fillInTheBlank' &&
                      task.answers && task.answers.length > 0 &&
                      !showAnswerFlag[index] &&
                      showResults &&
                      taskResults[index] &&
                      taskResults[index].isCorrect !== true
                    "
                    class="answer-flag"
                    @click="showCorrectAnswer(index)"
                  >
                    🏁
                  </span>
                </div>

                <div v-if="showHint[index] && showHint[index].size > 0" class="hints">
                  <div
                    v-for="(hintText, hintIndex) in getShownHints(currentMission.tasks[index], index)"
                    :key="hintIndex"
                    class="hint-text"
                  >
                    {{ hintText }}
                  </div>
                </div>

                <div
                  v-if="task.type !== 'fillInTheBlank' && showAnswerFlag[index] && task.answers"
                  class="correct-answer-display"
                >
                  <span class="answer-label">Правильный ответ:</span>
                  <span class="answer-text">{{ task.answers.join(' или ') }}</span>
                </div>

                <!-- === DO THE MAGIC === -->
                <div v-if="task.type === 'doTheMagic'" class="doTheMagic-block">
                  <div class="doTheMagic-grid">
                    <div
                      v-for="(label, key) in task.labels"
                      :key="key"
                      class="doTheMagic-row"
                    >
                      <span
                        class="doTheMagic-label"
                        @dblclick.prevent="showAnswerHint(index, key, task)"
                        :title="`Двойной клик — показать правильный ответ для «${label}»`"
                      >
                        {{ label }}
                      </span>
                      <textarea
                        class="doTheMagic-input"
                        :class="[
                          getDoTheMagicClass(index, key),
                          { 'showing-hint': hintAnswer[`${index}_${key}`] }
                        ]"
                        :placeholder="hintAnswer[`${index}_${key}`] || getDoTheMagicPlaceholder(key, index)"
                        v-model="answers[index][key]"
                        @input="adjustDoTheMagicHeight($event, index, key)"
                        rows="1"
                        :ref="el => setDoTheMagicRef(el, index, key)"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <!-- === FILL IN THE BLANKS === -->
                <div v-else-if="task.type === 'fillInTheBlank'" class="fill-blank-block">
                  <div class="fill-blank-text">
                    <template v-for="(segment, segIndex) in getFillSegments(task)" :key="segIndex">
                      <span v-if="segment.type === 'text'">{{ segment.value }}</span>
                      <span
                        v-else
                        class="fill-blank-wrapper"
                        :class="getFillClass(index, segment.blankIndex)"
                        :style="{ width: getFillWidth(segment.underscores) }"
                      >
                        <input
                          type="text"
                          class="fill-blank-input"
                          v-model="answers[index][segment.blankIndex]"
                        />
                      </span>
                    </template>
                  </div>
                </div>


                <!-- === ARTICLE WORDS INPUT === -->
                <div v-else-if="task.type === 'articleWordsInput'" class="article-block">
                  <p v-if="task.taskDescription" class="article-description">
                    {{ task.taskDescription }}
                  </p>
                  <div v-if="task.usefulWords" class="article-useful-words">
<!--                    <div class="useful-words-header">-->
<!--                      <span class="useful-words-icon">📝</span>-->
<!--                      <span class="useful-words-title">Впиши эти слова в пропуски:</span>-->
<!--                    </div>-->

                    <!-- Если массив объектов -->
                    <div v-if="Array.isArray(task.usefulWords)" class="useful-words-grid">
                      <div
                        v-for="(word, wIndex) in task.usefulWords"
                        :key="wIndex"
                        class="useful-word-card"
                      >
                        <span class="useful-word-eng">{{ word.eng }}</span>
                        <span class="useful-word-ru">{{ word.ru }}</span>
                      </div>
                    </div>

                    <!-- Если строка (старый формат) -->
                    <p v-else class="useful-words-text">{{ task.usefulWords }}</p>
                  </div>
                  <img
                    v-if="task.taskPicture"
                    :src="task.taskPicture"
                    :alt="'Image for task ' + (index + 1)"
                    class="article-picture"
                  >

                  <div v-if="task.taskAudio" class="audio-player-sticky-container">
                    <audio
                      controls
                      class="audio-player"
                      controlsList="nodownload"
                      oncontextmenu="return false;"
                    >
                      <source :src="task.taskAudio" type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>

                  <div class="article-text">
                    <template v-for="(segment, segIndex) in getArticleSegments(task)" :key="segIndex">
                      <span v-if="segment.type === 'text'">{{ segment.value }}</span>
                      <span
                        v-else
                        class="article-blank-wrapper"
                        :class="getArticleBlankClass(index, segment.blankIndex)"
                        :style="{ width: getArticleBlankWidth(segment.answer) }"
                      >
        <input
          type="text"
          class="article-blank-input"
          v-model="answers[index][segment.blankIndex]"
        />
      </span>
                    </template>
                  </div>
                </div>

                <!-- === TABLE FILL === -->
                <div v-else-if="task.type === 'tableFill'" class="table-fill-block">
                  <div
                    class="table-fill"
                    :style="{
                      '--cols': task.cols || 4,
                      '--rows': task.rows || 3
                    }"
                  >
                    <!-- Слой линий сетки -->
                    <div
                      v-for="line in getTableGridLines(task)"
                      :key="line.key"
                      class="table-grid-line"
                      :class="`table-grid-line--${line.orientation}`"
                      :style="line.style"
                    ></div>

                    <!-- Ячейки -->
                    <div
                      v-for="cell in getTableCells(task)"
                      :key="cell.key"
                      class="table-cell"
                      :style="getTableCellStyle(cell)"
                    >
                      <span v-if="cell.data.text" class="table-cell-text">{{ cell.data.text }}</span>
                      <input
                        v-else
                        type="text"
                        class="table-cell-input"
                        :class="getTableCellClass(index, cell.key)"
                        v-model="answers[index][cell.key]"
                        placeholder="?"

                      />
                    </div>
                  </div>
                </div>

                <!-- === TEXTAREA === -->
                <div v-else-if="task.type === 'textarea'" class="input-wrapper">
                  <textarea
                    class="message-input"
                    :class="getInputClass(index)"
                    :placeholder="task.placeholder"
                    v-model="answers[index]"
                    @input="adjustTextareaHeight($event, index)"
                    :data-index="index"
                    rows="1"
                  ></textarea>
                </div>

                <!-- === TEXT === -->
                <div v-else class="input-wrapper">
                  <input
                    class="message-input-text"
                    :class="getInputClass(index)"
                    :placeholder="task.placeholder"
                    v-model="answers[index]"
                    @input="adjustInputHeight"
                  />
                </div>
              </div>

              <div class="button-wrapper">
                <button
                  class="check-button"
                  @click="checkAnswers"
                  :disabled="isChecking || !isAnyAnswerFilled"
                >
                  {{ isChecking ? 'Проверяем...' : showResults ? 'Я исправил, перепроверить' : 'Проверить' }}
                </button>
              </div>
            </div>

            <div v-else class="error-message">
              <span>📚</span>
              <p>Задание не найдено</p>
              <small>Проверьте правильность ссылки</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Модалка подтверждения очистки -->
  <div v-if="showClearConfirmModal" class="modal-overlay" @click.self="closeClearConfirmModal">
    <div class="modal-content clear-confirm-modal">
      <div class="clear-confirm-icon">🧹</div>
      <h2>Are you sure?</h2>
      <p class="clear-confirm-text">
        Вы уверены, что хотите очистить ваши записи с этого задания?
      </p>
      <div class="modal-buttons clear-confirm-buttons">
        <button class="modal-btn cancel" @click="closeClearConfirmModal">No</button>
        <button class="modal-btn save" @click="confirmClearAnswers">Yes</button>
      </div>
    </div>
  </div>

  <!-- Модалка для имени -->
  <div v-if="showNameModal" class="modal-overlay" @click.self="closeNameModal">
    <div class="modal-content">
      <h2>Введите ваше имя</h2>
      <input
        v-model="tempName"
        class="modal-input"
        placeholder="Ваше имя..."
        @keyup.enter="saveName"
      />
      <div class="modal-buttons">
        <button class="modal-btn cancel" @click="closeNameModal">Отмена</button>
        <button class="modal-btn save" @click="saveName">Сохранить</button>
      </div>
    </div>
  </div>

  <!-- Модалка со списком миссий -->
  <div v-if="showMissionsModal" class="modal-overlay" @click.self="closeMissionsModal">
    <div class="modal-content missions-modal">
      <div class="missions-header">
        <h2>📚 Список домашних:</h2>
        <span class="missions-count">{{ missionsList.length }}</span>
      </div>
      <div class="missions-list">
        <div
          v-for="mission in missionsList"
          :key="mission.id"
          class="mission-item"
          @click="goToMission(mission.id)"
        >
        <span class="mission-item-name" :title="mission.missionName">
          {{ mission.missionName || mission.id }}
        </span>
          <span class="mission-item-badge">→</span>
        </div>
      </div>
      <button class="modal-btn save missions-close" @click="closeMissionsModal">Закрыть</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getHomework, getAllMissions } from '../dataForGames/hwData'
import { useGameStore } from 'stores/example-store'
import { useSpellingCheck } from 'src/composables/specialSpellingCheck'
import html2pdf from 'html2pdf.js'

const downloadPDF = () => {
  const element = document.querySelector('.notebook-content') // ваш блок с заданиями
  html2pdf().from(element).save('my-homework.pdf')
}


const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()

const { usualCheck } = useSpellingCheck()
const missionName = computed(() => route.params.missionName || 'intro-1')
const firstDoTheMagicIndex = computed(() => {
  if (!currentMission.value) return -1
  return currentMission.value.tasks.findIndex(t => t.type === 'doTheMagic')
})
const currentMission = ref(null)
const answers = ref([])
const contentRef = ref(null)
const notebookHeight = ref(600)
const isChecking = ref(false)
const showResults = ref(false)
const taskResults = ref([])
const correctAnswers = ref(0)
const totalTasks = ref(0)
const showHint = ref([])
const showAnswerFlag = ref([])
const missionsList = ref([])

const showNameModal = ref(false)
const tempName = ref('')
const showMissionsModal = ref(false)
const showClearConfirmModal = ref(false)

const doTheMagicRefs = ref({})
const setDoTheMagicRef = (el, index, key) => {
  if (el) doTheMagicRefs.value[`${index}_${key}`] = el
}



// ==================== send as pdf ====================

const disableAudioDownload = () => {
  document.addEventListener('contextmenu', (e) => {
    if (e.target.classList.contains('audio-player')) {
      e.preventDefault()
      return false
    }
  })
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
    }
  })
}

const ARTICLE_BLANK_REGEX = /\(([^)]+)\)/g

const getArticleSegments = (task) => {
  const script = task.articleScript || ''
  const parts = script.split(ARTICLE_BLANK_REGEX)
  const segments = []
  let blankIndex = 0
  // split с capture-группой даёт массив: текст, содержимое1, текст, содержимое2, ...
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (i % 2 === 0) {
      // текст
      if (part) segments.push({ type: 'text', value: part })
    } else {
      // пропуск
      segments.push({
        type: 'blank',
        answer: part,
        blankIndex: blankIndex++
      })
    }
  }
  return segments
}

const UNDERSCORE_STEP = 8   // px: 4px штрих + 4px промежуток

const getArticleBlankWidth = (answer) => {
  const clean = (answer || '').split('|')[0].trim()
  const len = Math.max(5, clean.length)   // минимум 5 штрихов
  return `${len * UNDERSCORE_STEP + 8}px` // 8px запас по краям
}

const getArticleBlankClass = (taskIndex, blankIndex) => {
  if (!showResults.value) return ''
  const res = taskResults.value[taskIndex]?.results
  if (!res) return ''
  const val = res[blankIndex]
  if (val === undefined) return ''
  return val ? 'article-blank-correct' : 'article-blank-incorrect'
}

// ==================== FILL IN THE BLANKS ====================
const getFillSegments = (task) => {
  const parts = (task.text || '').split(/(_{1,})/g)
  let blankIndex = 0
  return parts
    .filter(Boolean)
    .map(part => /^_{1,}$/.test(part)
      ? { type: 'blank', underscores: part.length, blankIndex: blankIndex++ }
      : { type: 'text', value: part })
}

const getFillWidth = (n) => {
  if (n >= 5) return '200px'
  if (n === 4) return '160px'
  if (n === 3) return '120px'
  if (n === 2) return '80px'
  if (n === 1) return '40px'
  return '42px'
}

const getFillClass = (taskIndex, blankIndex) => {
  if (!showResults.value) return ''
  const res = taskResults.value[taskIndex]?.results
  if (!res) return ''
  const val = res[blankIndex]
  if (val === undefined) return ''
  return val ? 'fill-blank-correct' : 'fill-blank-incorrect'
}

// ==================== TABLE FILL ====================
const TABLE_CELL_W = 120
const TABLE_CELL_H = 20

const parseCellKey = (key) => {
  const m = key.match(/^([a-z]+)(\d+)$/)
  if (!m) return null
  const colLetters = m[1]
  const rowNumber = parseInt(m[2], 10)
  let col = 0
  for (let i = 0; i < colLetters.length; i++) {
    col = col * 26 + (colLetters.charCodeAt(i) - 96)
  }
  return { col: col - 1, row: rowNumber - 1 }
}

const getTableCells = (task) => {
  const result = []
  const data = task.cells || {}
  Object.keys(data).forEach(key => {
    const pos = parseCellKey(key)
    if (!pos) return
    result.push({ key, col: pos.col, row: pos.row, data: data[key] })
  })
  return result
}

const findCellKeyAt = (task, col, row) => {
  for (const [key, data] of Object.entries(task.cells || {})) {
    const pos = parseCellKey(key)
    if (!pos) continue
    const cs = data.colspan || 1
    const rs = data.rowspan || 1
    if (col >= pos.col && col < pos.col + cs && row >= pos.row && row < pos.row + rs) {
      return key
    }
  }
  return null
}

const getTableCellStyle = (cell) => {
  const cs = cell.data.colspan || 1
  const rs = cell.data.rowspan || 1
  return {
    left: `${cell.col * TABLE_CELL_W}px`,
    top: `${cell.row * TABLE_CELL_H}px`,
    width: `${cs * TABLE_CELL_W}px`,
    height: `${rs * TABLE_CELL_H}px`
  }
}

const getTableCellClass = (taskIndex, cellKey) => {
  if (!showResults.value) return ''
  const res = taskResults.value[taskIndex]?.cells
  if (!res) return ''
  const val = res[cellKey]
  if (val === undefined) return ''
  return val ? 'table-cell-correct' : 'table-cell-incorrect'
}

const getTableGridLines = (task) => {
  const cols = task.cols || 4
  const rows = task.rows || 3
  const lines = []

  // Вертикальные
  for (let c = 1; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const leftKey = findCellKeyAt(task, c - 1, r)
      const rightKey = findCellKeyAt(task, c, r)
      if (leftKey && rightKey && leftKey === rightKey) continue
      lines.push({
        key: `v-${c}-${r}`,
        orientation: 'v',
        style: {
          left: `${c * TABLE_CELL_W}px`,
          top: `${r * TABLE_CELL_H}px`,
          height: `${TABLE_CELL_H}px`
        }
      })
    }
  }

  // Горизонтальные
  for (let r = 1; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const topKey = findCellKeyAt(task, c, r - 1)
      const bottomKey = findCellKeyAt(task, c, r)
      if (topKey && bottomKey && topKey === bottomKey) continue
      lines.push({
        key: `h-${c}-${r}`,
        orientation: 'h',
        style: {
          left: `${c * TABLE_CELL_W}px`,
          top: `${r * TABLE_CELL_H}px`,
          width: `${TABLE_CELL_W}px`
        }
      })
    }
  }

  return lines
}

// ==================== DO THE MAGIC (auto-height) ====================
const adjustDoTheMagicHeight = (event) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  const roundedHeight = Math.max(20, Math.ceil(textarea.scrollHeight / 20) * 20)
  textarea.style.height = roundedHeight + 'px'
}

const hintAnswer = ref({})
const savedAnswers = ref({})
const showAnswerHint = (taskIndex, key, task) => {
  const hintKey = `${taskIndex}_${key}`
  if (hintAnswer.value[hintKey]) return

  const correctList = task.correct?.[key]
  if (!correctList || correctList.length === 0) return

  savedAnswers.value[hintKey] = answers.value[taskIndex][key] || ''
  answers.value[taskIndex][key] = ''

  nextTick(() => {
    const refKey = `${taskIndex}_${key}`
    if (doTheMagicRefs.value[refKey]) {
      doTheMagicRefs.value[refKey].style.height = '20px'
    }
  })

  hintAnswer.value = { ...hintAnswer.value, [hintKey]: correctList.join(' / ') }

  setTimeout(() => {
    const currentValue = answers.value[taskIndex][key]
    if (currentValue === '' || currentValue === undefined) {
      answers.value[taskIndex][key] = savedAnswers.value[hintKey] || ''
    }
    nextTick(() => {
      const refKey = `${taskIndex}_${key}`
      const textarea = doTheMagicRefs.value[refKey]
      if (textarea) {
        textarea.style.height = 'auto'
        const roundedHeight = Math.max(20, Math.ceil(textarea.scrollHeight / 20) * 20)
        textarea.style.height = roundedHeight + 'px'
      }
    })
    const newHint = { ...hintAnswer.value }
    delete newHint[hintKey]
    hintAnswer.value = newHint
    const newSaved = { ...savedAnswers.value }
    delete newSaved[hintKey]
    savedAnswers.value = newSaved
  }, 2000)
}

const isBackendAvailable = ref(true)

// ==================== FILLED / SAVED ====================
const isAnyAnswerFilled = computed(() => {
  if (!answers.value || answers.value.length === 0) return false
  return answers.value.some(answer => {
    if (typeof answer === 'string') return answer.trim().length >= 2
    if (typeof answer === 'object' && answer !== null) {
      return Object.values(answer).some(v => v && v.trim().length >= 2)
    }
    return false
  })
})

const hasSavedAnswers = computed(() => {
  if (!answers.value || answers.value.length === 0) return false
  return answers.value.some(answer => {
    if (typeof answer === 'string') return answer.trim().length > 0
    if (typeof answer === 'object' && answer !== null) {
      return Object.values(answer).some(v => v && v.trim().length > 0)
    }
    return false
  })
})

// ==================== LOCALSTORAGE ====================
const STORAGE_PREFIX = 'hw_answers_'
const getStorageKey = () => `${STORAGE_PREFIX}${missionName.value}`

const saveAnswersToStorage = () => {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(answers.value))
  } catch (e) {
    console.warn('Не удалось сохранить ответы:', e)
  }
}

const loadAnswersFromStorage = (tasks) => {
  try {
    const raw = localStorage.getItem(getStorageKey())
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length !== tasks.length) return null

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
      const saved = parsed[i]
      if (task.type === 'doTheMagic') {
        if (typeof saved !== 'object' || saved === null) return null
        const expectedKeys = Object.keys(task.labels || {})
        const savedKeys = Object.keys(saved)
        if (expectedKeys.length !== savedKeys.length) return null
        if (!expectedKeys.every(k => savedKeys.includes(k))) return null
      } else if (task.type === 'fillInTheBlank') {
        if (!Array.isArray(saved) || saved.length !== (task.answers || []).length) return null
        if (!saved.every(v => typeof v === 'string')) return null
      } else if (task.type === 'tableFill') {
        if (typeof saved !== 'object' || saved === null) return null
        const expectedKeys = Object.keys(task.cells || {})
        const savedKeys = Object.keys(saved)
        if (expectedKeys.length !== savedKeys.length) return null
        if (!expectedKeys.every(k => savedKeys.includes(k))) return null
      } else {
        if (typeof saved !== 'string') return null
      }
    }
    return parsed
  } catch (e) {
    console.warn('Не удалось загрузить ответы:', e)
    return null
  }
}

const clearAnswersFromStorage = () => {
  localStorage.removeItem(getStorageKey())
}

const isLoadingMission = ref(false)

const displayUserName = computed(() => {
  let name = ''
  if (gameStore.agentName) {
    name = gameStore.agentName.split('#')[0]
  } else {
    name = localStorage.getItem('agentName') || 'нажми сюда'
  }
  if (!isBackendAvailable.value && name !== 'Agent 404') {
    return `${name} (404)`
  }
  return name
})

// ==================== LOAD MISSION ====================
const loadMission = () => {
  isLoadingMission.value = true
  const data = getHomework(missionName.value)
  currentMission.value = data

  if (data) {
    answers.value = data.tasks.map(task => {
      if (task.type === 'doTheMagic') {
        const obj = {}
        Object.keys(task.labels || {}).forEach(key => { obj[key] = '' })
        return obj
      }
      if (task.type === 'fillInTheBlank') {
        return new Array((task.answers || []).length).fill('')
      }
      if (task.type === 'tableFill') {
        const obj = {}
        Object.keys(task.cells || {}).forEach(key => { obj[key] = '' })
        return obj
      }
      if (task.type === 'articleWordsInput') {
        const segments = getArticleSegments(task)
        const blankCount = segments.filter(s => s.type === 'blank').length
        return new Array(blankCount).fill('')
      }

      return ''
    })

    const saved = loadAnswersFromStorage(data.tasks)
    if (saved) {
      answers.value = saved
      nextTick(() => {
        data.tasks.forEach((task, index) => {
          if (task.type === 'doTheMagic') {
            Object.keys(task.labels || {}).forEach(key => {
              const el = doTheMagicRefs.value[`${index}_${key}`]
              if (el) {
                el.style.height = 'auto'
                const h = Math.max(20, Math.ceil(el.scrollHeight / 20) * 20)
                el.style.height = h + 'px'
              }
            })
          } else if (task.type === 'textarea') {
            const el = contentRef.value?.querySelector(`textarea[data-index="${index}"]`)
            if (el) {
              el.style.height = 'auto'
              el.style.height = el.scrollHeight + 'px'
            }
          } else if (task.type === 'articleWordsInput') {
            if (!Array.isArray(saved)) return null
            const segments = getArticleSegments(task)
            const expectedCount = segments.filter(s => s.type === 'blank').length
            if (saved.length !== expectedCount) return null
            if (!saved.every(v => typeof v === 'string')) return null
          }
        })
      })
    }

    showHint.value = data.tasks.map(() => new Set())
    showAnswerFlag.value = new Array(data.tasks.length).fill(false)
    totalTasks.value = data.tasks.length
  }

  showResults.value = false
  taskResults.value = []
  missionsList.value = getAllMissions()
  nextTick(() => { isLoadingMission.value = false })
}

// ==================== AUTOSAVE ====================
let saveTimer = null
watch(answers, () => {
  if (isLoadingMission.value) return
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => saveAnswersToStorage(), 400)
}, { deep: true })

// ==================== CLEAR ====================
const clearAllAnswers = () => {
  if (!currentMission.value) return
  answers.value = currentMission.value.tasks.map(task => {
    if (task.type === 'doTheMagic') {
      const obj = {}
      Object.keys(task.labels || {}).forEach(k => { obj[k] = '' })
      return obj
    }
    if (task.type === 'fillInTheBlank') {
      return new Array((task.answers || []).length).fill('')
    }
    if (task.type === 'tableFill') {
      const obj = {}
      Object.keys(task.cells || {}).forEach(k => { obj[k] = '' })
      return obj
    }
    if (task.type === 'articleWordsInput') {
      const segments = getArticleSegments(task)
      const blankCount = segments.filter(s => s.type === 'blank').length
      return new Array(blankCount).fill('')
    }
    return ''
  })
  showResults.value = false
  taskResults.value = []
  showAnswerFlag.value = new Array(currentMission.value.tasks.length).fill(false)
  clearAnswersFromStorage()
  nextTick(() => {
    currentMission.value.tasks.forEach((task, index) => {
      if (task.type === 'doTheMagic') {
        Object.keys(task.labels || {}).forEach(key => {
          const el = doTheMagicRefs.value[`${index}_${key}`]
          if (el) el.style.height = '20px'
        })
      }
    })
  })
}

const openClearConfirmModal = () => { showClearConfirmModal.value = true }
const closeClearConfirmModal = () => { showClearConfirmModal.value = false }
const confirmClearAnswers = () => {
  clearAllAnswers()
  showClearConfirmModal.value = false
}

// ==================== HINTS ====================
const getAllHintsWithIndex = (task) => {
  const hints = []
  if (task.hint1) hints.push({ text: task.hint1, index: 1 })
  if (task.hint2) hints.push({ text: task.hint2, index: 2 })
  if (task.hint3) hints.push({ text: task.hint3, index: 3 })
  if (task.hint4) hints.push({ text: task.hint4, index: 4 })
  if (task.hint5) hints.push({ text: task.hint5, index: 5 })
  return hints
}

const getAvailableHints = (task, taskIndex) => {
  const all = getAllHintsWithIndex(task)
  const shown = showHint.value[taskIndex] || new Set()
  return all.filter(h => !shown.has(h.index))
}

const getShownHints = (task, taskIndex) => {
  const all = getAllHintsWithIndex(task)
  const shown = showHint.value[taskIndex] || new Set()
  return all.filter(h => shown.has(h.index)).map(h => h.text)
}

const toggleHint = (taskIndex, hintIndex) => {
  if (!showHint.value[taskIndex]) showHint.value[taskIndex] = new Set()
  showHint.value[taskIndex].add(hintIndex)
  showHint.value = [...showHint.value]
}

const showCorrectAnswer = (index) => {
  const task = currentMission.value.tasks[index]
  if (task.answers && task.answers.length > 0) {
    showAnswerFlag.value[index] = true
  }
}

// ==================== AUTO-HEIGHT ====================
const adjustTextareaHeight = (event) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}
const adjustInputHeight = () => {}

// ==================== INPUT CLASSES ====================
const getInputClass = (index) => {
  if (!showResults.value) return ''
  if (!taskResults.value[index]) return ''
  const task = currentMission.value.tasks[index]
  // если автопроверки нет (answers не задан) — это «на проверку», красим синим
  const isAutoCheckable = task && task.answers && task.answers.length > 0
  if (!isAutoCheckable) return 'input-manual'
  return taskResults.value[index].isCorrect ? 'input-correct' : 'input-incorrect'
}

// ==================== DO THE MAGIC CLASSES ====================
const getDoTheMagicClass = (taskIndex, fieldKey) => {
  if (!showResults.value) return ''
  if (!taskResults.value[taskIndex]?.fields) return ''
  const ok = taskResults.value[taskIndex].fields[fieldKey]
  if (fieldKey === 'answer') {
    return ok ? 'doTheMagic-correct' : 'doTheMagic-blue'
  }
  return ok ? 'doTheMagic-correct' : 'doTheMagic-incorrect'
}

const getDoTheMagicPlaceholder = (key, taskIndex) => {
  if (taskIndex !== firstDoTheMagicIndex.value) return ''
  const placeholders = {
    positive: 'Утверждение...',
    negative: 'Отрицание...',
    question: 'Вопрос yes/no',
    openQuestion: 'Открытый вопрос...',
    answer: 'Ответ (*необязательно)'
  }
  return placeholders[key] || ''
}

// ==================== OPEN QUESTION ====================
const WH_WORDS = ['how often', 'why the hell', 'where the hell', 'when the hell','what the hell',
  'what', 'what time', 'how long', 'when', 'where', 'why', 'how']

const checkOpenQuestion = (userAnswer, task) => {
  const userLower = (userAnswer || '').toLowerCase().trim()

  if (task.correct?.openQuestion && task.correct.openQuestion.length > 0) {
    if (usualCheck(userAnswer, task.correct.openQuestion)) return true
  }

  const userWh = WH_WORDS.find(w => userLower.startsWith(w + ' '))
  if (!userWh) return false

  const userRest = userLower.slice(userWh.length).trim()

  const closed = []
  if (task.correct?.question) closed.push(...task.correct.question)
  if (task.correct?.openQuestion) closed.push(...task.correct.openQuestion)

  return closed.some(correct => {
    const correctLower = correct.toLowerCase().trim()
    const correctWh = WH_WORDS.find(w => correctLower.startsWith(w + ' '))
    const correctRest = correctWh
      ? correctLower.slice(correctWh.length).trim()
      : correctLower
    return usualCheck(userRest, correctRest)
  })
}

// ==================== CHECK ONE ====================
const checkSingleAnswer = (task, answer) => {
  if (task.type === 'articleWordsInput') {
    const segments = getArticleSegments(task)
    const res = []
    let filled = 0

    segments.filter(s => s.type === 'blank').forEach((seg, i) => {
      const user = String(answer?.[i] ?? '').trim()
      if (user) filled++

      // варианты через |
      const variants = seg.answer.split('|').map(v => v.trim()).filter(Boolean)

      let ok
      if (!user) {
        ok = false
      } else {
        ok = usualCheck(user, variants)
      }
      res[i] = ok
    })

    const allOk = res.every(Boolean)
    return {
      isCorrect: allOk && filled > 0,
      message: allOk && filled > 0
        ? '✅ Отлично! Все слова верны'
        : '⚠️ Проверь ещё раз — не все слова совпали',
      results: res
    }
  }
  // === TABLE FILL ===
  if (task.type === 'tableFill') {
    const cellsRes = {}
    let allCorrect = true
    let filled = 0

    Object.keys(task.cells || {}).forEach(key => {
      const cell = task.cells[key]
      if (cell.text) return

      const user = String(answer?.[key] ?? '').trim()
      if (user) filled++

      const variants = cell.answers || []
      const ok = variants.length > 0 && usualCheck(user, variants)

      cellsRes[key] = ok
      if (!ok) allCorrect = false
    })

    return {
      isCorrect: allCorrect && filled > 0,
      message: allCorrect && filled > 0
        ? '✅ Отлично! Все ячейки верны'
        : '⚠️ Проверь ещё раз — не все ячейки совпали',
      cells: cellsRes
    }
  }

  // === FILL IN THE BLANKS ===
  if (task.type === 'fillInTheBlank') {
    const res = []
    let filled = 0

    const correctList = (task.answers || []).map(item => {
      if (Array.isArray(item)) return item.map(v => String(v ?? ''))
      return [String(item ?? '')]
    })

    correctList.forEach((variants, i) => {
      const user = String(answer?.[i] ?? '').trim()
      if (user) filled++

      const allowsEmpty = variants.some(v => {
        const n = v.toLowerCase().trim()
        return n === '' || n === '-'
      })

      let ok
      if (user === '' || user === '-') {
        ok = allowsEmpty
      } else {
        const nonEmpty = variants.filter(v => {
          const n = v.toLowerCase().trim()
          return n !== '' && n !== '-'
        })
        ok = nonEmpty.length > 0 && usualCheck(user, nonEmpty)
      }
      res[i] = ok
    })

    const allAllowEmpty = correctList.every(v =>
      v.some(x => {
        const n = x.toLowerCase().trim()
        return n === '' || n === '-'
      })
    )
    const isFilled = filled > 0 || allAllowEmpty
    const allOk = res.every(Boolean)

    return {
      isCorrect: allOk && isFilled,
      message: allOk && isFilled ? '✅ Верно' : '⚠️ Проверь ещё раз',
      results: res
    }
  }

  // === DO THE MAGIC ===
  if (task.type === 'doTheMagic') {
    const results = {}
    let allCorrect = true
    let filledCount = 0
    if (task.correct) {
      Object.keys(task.correct).forEach(key => {
        const userAnswer = (answer[key] || '').trim()
        if (userAnswer.length > 0) filledCount++

        let isFieldCorrect
        if (key === 'openQuestion') {
          isFieldCorrect = checkOpenQuestion(userAnswer, task)
        } else {
          isFieldCorrect = usualCheck(userAnswer, task.correct[key])
        }
        results[key] = isFieldCorrect
        if (!isFieldCorrect && userAnswer.length > 0) allCorrect = false
      })
    }
    return {
      isCorrect: allCorrect && filledCount > 0,
      message: allCorrect && filledCount > 0
        ? '✅ Отлично! Все формы верны'
        : '⚠️ Проверь ещё раз — не все формы совпали',
      fields: results
    }
  }

  // === TEXT / TEXTAREA ===
  if (!task.answers || task.answers.length === 0) {
    return {
      isCorrect: null,
      message: '📝 Эта часть не может быть проверена автоматически! - Отправь скриншот учителю на проверку'
    }
  }

  const normalizedAnswer = (answer || '').trim().toLowerCase()
  const isCorrect = task.answers.some(correct =>
    normalizedAnswer === correct.toLowerCase()
  )

  return {
    isCorrect,
    message: isCorrect
      ? '✅ super !'
      : '☝️ Странно выглядит... нажми чтобы исправить самостоятельно. \n Или отправь скриншот Винсенту - можно так сказать или нет, он проверит '
  }
}

// ==================== CHECK ALL ====================
const checkAnswers = () => {
  if (!currentMission.value || isChecking.value) return
  isChecking.value = true
  setTimeout(() => {
    const results = []
    let correct = 0
    currentMission.value.tasks.forEach((task, index) => {
      const result = checkSingleAnswer(task, answers.value[index])
      if (result.isCorrect === true) correct++
      if (result.isCorrect === null) {
        result.isCorrect = true
        result.message = '📝 Эта часть не может быть проверена автоматически! - Отправь скриншот учителю на проверку'
      }
      results.push(result)
    })
    taskResults.value = results
    correctAnswers.value = correct
    showResults.value = true
    isChecking.value = false
  }, 100)
}

// ==================== SCORE ====================
const getProgressText = () => {
  if (!currentMission.value) return ''
  const answered = answers.value.filter(a => {
    if (typeof a === 'string') return a && a.trim().length > 0
    if (typeof a === 'object' && a !== null) {
      return Object.values(a).some(v => v && v.trim().length > 0)
    }
    return false
  }).length
  return `${answered} / ${totalTasks.value}`
}

const getScoreMessage = () => {
  const percent = Math.round((correctAnswers.value / totalTasks.value) * 100)
  if (percent === 100) return '🎉 Отлично! Все ответы верны!'
  if (percent >= 80) return '👍 Хорошо! Почти все правильно!'
  if (percent >= 60) return '😊 Неплохо, но можно лучше!'
  return '💪 Попробуй еще раз, у тебя получится!'
}

const getScoreClass = () => {
  const percent = Math.round((correctAnswers.value / totalTasks.value) * 100)
  if (percent === 100) return 'score-excellent'
  if (percent >= 80) return 'score-good'
  if (percent >= 60) return 'score-ok'
  return 'score-bad'
}

// ==================== NAME MODAL ====================
const openNameModal = () => {
  tempName.value = gameStore.agentName || localStorage.getItem('agentName') || ''
  showNameModal.value = true
}
const closeNameModal = () => {
  showNameModal.value = false
  tempName.value = ''
}
const saveName = () => {
  if (tempName.value.trim()) {
    const name = tempName.value.trim()
    gameStore.setAgentName(name)
    localStorage.setItem('agentName', name)
    localStorage.setItem('fullAgentName', name)
    closeNameModal()
  }
}

// ==================== MISSIONS MODAL ====================
const openMissionsList = () => {
  missionsList.value = getAllMissions()
  showMissionsModal.value = true
}
const closeMissionsModal = () => { showMissionsModal.value = false }
const goToMission = (missionId) => {
  closeMissionsModal()
  router.push(`/hw/${missionId}`)
}

// ==================== PRINT ====================
const printPDF = () => window.print()

// ==================== USER ====================
const loadUserFromBackend = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return false
    const fullAgentName = localStorage.getItem('fullAgentName')
    const agentName = localStorage.getItem('agentName')
    if (fullAgentName && agentName) {
      gameStore.setAgentName(fullAgentName)
      return true
    }
    return false
  } catch (error) {
    console.error('Ошибка загрузки пользователя:', error)
    return false
  }
}

const adjustNotebookHeight = async () => { notebookHeight.value = 600 }

// ==================== WATCH & MOUNT ====================
watch(() => route.params.missionName, () => {
  loadMission()
  nextTick(() => { notebookHeight.value = 600 })
})

onMounted(async () => {
  await loadUserFromBackend()
  loadMission()
  await adjustNotebookHeight()
  disableAudioDownload()
})
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap');

.container {
  width: 100vw;
  min-height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header {
  width: 800px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.header-left { display: flex; align-items: center; gap: 20px; }
.header-right { display: flex; align-items: center; gap: 15px; }

.agent-name {
  color: white;
  font-size: 24px;
  font-family: 'Special_f1', sans-serif;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s;
  margin: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
}

.print-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
}

.notebook-wrapper {
  position: relative;
  width: 800px;
  height: 600px;
  perspective: 1000px;
  flex-shrink: 0;
}

.notebook-cover {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e5799 0%, #207cca 51%, #2989d8 51%, #7db9e8 100%);
  border-radius: 8px 12px 12px 8px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  padding: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 40px;
    width: 2px;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    z-index: 1;
  }
}

.notebook-page {
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 4px;
  box-shadow:
    0 2px 10px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 white,
    inset 0 -1px 0 white;
  padding: 20px 0 20px 50px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50px;
    width: 1px;
    height: 100%;
    background: #ff6b6b;
    z-index: 3;
  }
}

.notebook-grid {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg,
      transparent 0%,
      transparent 19px,
      #eef2f2 19px,
      #eef2f2 20px,
      transparent 20px
    ),
    linear-gradient(to bottom,
      transparent 0%,
      transparent 19px,
      #eef2f2 19px,
      #eef2f2 20px,
      transparent 20px
    );
  background-size: 20px 20px;
  z-index: 1;
  pointer-events: none;
}

.notebook-content {

  position: relative;
  z-index: 3;
  height: 100%;
  padding: 0 15px;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #207cca; border-radius: 2px; }
  &::-webkit-scrollbar-track { background: transparent; }
}

.content-inner {
  font-family: 'Times New Roman', serif;
  font-size: 16px;
  line-height: 20px;
  color: #25598e;
}

//.task-block { margin-bottom: 20px; position: relative; }

.question-text {
  display: block;
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
  line-height: 20px;
  font-family: 'Special_f1', sans-serif;
}

.hint-icon, .answer-flag {
  display: inline-block;
  margin-left: 6px;
  cursor: pointer;
  transition: transform 0.3s;
  &:hover { transform: scale(1.2); }
}

.hints {
  margin: 6px 0 8px 0;
  padding: 8px 12px;
  background: rgba(255, 193, 7, 0.1);
  border-left: 3px solid #ffc107;
  border-radius: 4px;
}

.hint-text {
  font-size: 14px;
  color: #7f8c8d;
  padding: 2px 0;
  line-height: 20px;
  &:not(:last-child) { margin-bottom: 4px; }
}

.correct-answer-display {
  margin: 6px 0 8px 0;
  padding: 8px 12px;
  background: rgba(46, 204, 113, 0.1);
  border-left: 3px solid #27ae60;
  border-radius: 4px;
}

.answer-label { font-weight: bold; color: #27ae60; margin-right: 8px; }
.answer-text { color: #2c3e50; font-weight: 500; }

.input-wrapper { position: relative; display: flex; align-items: center; }

.message-input {
  width: 100%;
  min-height: 40px;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  font-family: 'Fira Code', serif;
  font-size: 14px;
  line-height: 20px;
  color: #2c3e50;
  caret-color: #2c3e50;
  transition: all 0.3s;
  overflow: hidden;

  &::placeholder { color: #95a5a6; opacity: 0.7; font-style: italic; }
  &:focus { background: rgba(255, 255, 255, 0.3); box-shadow: inset 0 0 0 1px rgba(74, 144, 226, 0.3); }
  &.input-correct { background: rgba(46, 204, 113, 0.08); border-bottom: 2px solid #27ae60; }
  &.input-incorrect { background: rgba(243, 156, 18, 0.08); border-bottom: 2px solid #f39c12; }
  &.input-manual {
    background: rgba(52, 152, 219, 0.08);
    border-bottom: 2px solid #3498db;
  }
}

.message-input-text {
  width: 100%;
  height: 20px;
  padding: 0;
  border: none;
  box-sizing: border-box;
  background: transparent;
  outline: none;
  font-family: 'Fira Code', serif;
  font-size: 14px;
  line-height: 20px;
  color: #2c3e50;
  transition: all 0.3s;

  &::placeholder { color: #95a5a6; opacity: 0.7; font-style: italic; }
  &:focus { border-bottom-color: #207cca; }
  &.input-correct { border-bottom-color: #27ae60; background: rgba(26, 211, 79, 0.27); }
  &.input-incorrect { border-bottom-color: #f39c12; background: rgba(243, 156, 18, 0.15); }
  &.input-manual {
    border-bottom-color: #3498db;
    background: rgba(52, 152, 219, 0.15);
  }
}

.button-wrapper {
  margin-top: 45px;
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  padding-bottom: 4px;
}

.check-button {
  padding: 10px 32px;
  background: linear-gradient(135deg, #207cca, #1e5799);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-family: 'Special_f1', sans-serif;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(32, 124, 202, 0.3);

  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(32, 124, 202, 0.4); }
  &:active:not(:disabled) { transform: translateY(0); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}

.error-message {
  text-align: center;
  padding: 40px 0;
  span { font-size: 48px; display: block; margin-bottom: 20px; }
  p { color: #e74c3c; font-size: 24px; margin: 0 0 10px 0; }
  small { color: #95a5a6; font-size: 14px; }
}

.gray-font {
  color: #666;
  font-style: italic;
  margin: 0 0 40px 4px;
  padding: 0;
  line-height: 20px;
  font-size: 15px;
  font-family: Special_f1;
}

.task-title {
  color: #666;
  font-style: italic;
  margin: 40px 0 20px 25px;
  padding: 0;
  line-height: 20px;
  font-size: 15px;
  font-family: Special_f1;
}

.notebook-wrapper::after {
  content: '';
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 20px;
  background: radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%);
  z-index: -1;
}

/* Модальные окна */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from { opacity: 0; transform: translateY(-30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-content h2 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-family: 'Special_f1', sans-serif;
  text-align: center;
}

.modal-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e8e8;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Times New Roman', serif;
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box;
  &:focus { border-color: #207cca; }
}

.modal-buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: flex-end;
}

.modal-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Special_f1', sans-serif;
  cursor: pointer;
  transition: all 0.3s;

  &.save {
    background: linear-gradient(135deg, #207cca, #1e5799);
    color: white;
    &:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(32, 124, 202, 0.3); }
  }
  &.cancel {
    background: #e0e8e8;
    color: #2c3e50;
    &:hover { background: #d0d8e0; }
  }
}
.missions-modal {
  max-width: 480px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

.missions-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  h2 {
    margin: 0;
    font-size: 18px;
    font-family: 'Special_f1', sans-serif;
    color: #2c3e50;
    text-align: left;
  }
}

.missions-count {
  font-size: 12px;
  color: #95a5a6;
  background: #f0f3f5;
  padding: 2px 8px;
  border-radius: 10px;
  font-family: 'Fira Code', monospace;
}

.missions-list {
  flex: 1;
  min-height: 0;          /* чтобы flex-скролл работал */
  overflow-y: auto;
  margin: 0 0 12px 0;
  padding-right: 4px;     /* место под скроллбар */

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb {
    background: #c8d0d6;
    border-radius: 2px;
  }
  &::-webkit-scrollbar-track { background: transparent; }
}

.mission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 4px;
  background: #f8f9fa;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: #e8f0fe;
    border-color: #c5d9f1;
    /* никакого transform — не дребезжит */
  }

  &:active {
    background: #d8e6fa;
  }

  &:last-child {
    margin-bottom: 0;
  }

  .mission-item-name {
    flex: 1;
    min-width: 0;                    /* чтобы ellipsis работал внутри flex */
    font-family: 'Times New Roman', serif;
    font-size: 14px;
    line-height: 20px;
    color: #2c3e50;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mission-item-badge {
    flex-shrink: 0;
    color: #207cca;
    font-size: 14px;
    opacity: 0.6;
    transition: opacity 0.15s, transform 0.15s;
  }

  &:hover .mission-item-badge {
    opacity: 1;
  }
}

.missions-close {
  width: 100%;
  padding: 8px 16px;
  font-size: 14px;
}

/* DO THE MAGIC */
.doTheMagic-block { margin: 0; padding: 0; }
.doTheMagic-grid { display: flex; flex-direction: column; gap: 0; }
.doTheMagic-row {
  display: flex;
  align-items: flex-start;
  gap: 2px;
  min-height: 20px;
  line-height: 20px;
}
.doTheMagic-label {
  user-select: none;
  font-family: 'Fira Code', monospace;
  font-weight: 500;
  font-size: 14px;
  color: #207cca;
  min-width: 28px;
  text-align: center;
  flex-shrink: 0;
  line-height: 20px;
  align-self: flex-start;
}
.doTheMagic-input {
  flex: 1;
  width: 100%;
  min-height: 20px;
  height: 20px;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  padding: 0;
  margin: 0;
  font-family: 'Fira Code', serif;
  font-size: 16px;
  line-height: 20px;
  color: #2c3e50;
  caret-color: #2c3e50;
  transition: background 0.3s, box-shadow 0.3s;
  overflow: hidden;
  vertical-align: top;
  box-sizing: border-box;
  word-break: break-word;
  overflow-wrap: break-word;

  &.showing-hint::placeholder {
    color: #27ae60;
    opacity: 0.85;
    font-style: italic;
    font-weight: 500;
  }
  &::placeholder { color: #95a5a6; opacity: 0.6; font-style: italic; font-size: 14px; }
  &:focus { background: rgba(255, 255, 255, 0.3); box-shadow: inset 0 -1px 0 0 #207cca; }
  &.doTheMagic-correct { background: rgba(46, 204, 113, 0.08); }
  &.doTheMagic-incorrect { background: rgba(243, 156, 18, 0.08); }
  &.doTheMagic-blue {
    // background: rgba(52, 152, 219, 0.12);
  }
}

/* ==================== FILL IN THE BLANKS ==================== */
.fill-blank-block { margin: 0; padding: 0; }

.fill-blank-text {
  font-family: "Fira Code";
  letter-spacing: -0.5px;
  font-size: 13px;
  line-height: 20px;
  color: #2c3e50;
  word-break: break-word;
  overflow-wrap: break-word;
}

.fill-blank-wrapper {
  display: inline-block;
  vertical-align: baseline;
  height: 20px;
  line-height: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #b0bec5;
  margin: 0 2px;
  transition: background 0.3s, border-bottom-color 0.3s;

  &.fill-blank-correct {
    background: rgba(46, 204, 113, 0.1);
    border-bottom-color: #27ae60;
  }
  &.fill-blank-incorrect {
    background: rgba(243, 156, 18, 0.1);
    border-bottom-color: #f39c12;
  }
}

.fill-blank-input {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  outline: none;
  font-family: 'Fira Code', serif;
  font-size: 15px;
  line-height: 20px;
  color: #2c3e50;
  caret-color: #2c3e50;
  box-sizing: border-box;
  text-align: center;
}

/* ==================== TABLE FILL ==================== */
.table-fill-block {
  margin: 0;
  padding: 0;
  margin-left: 15px;
  /* убираем background: white отсюда */
  position: relative;
  z-index: 2;
  /* блок пусть будет по ширине содержимого, а не на всю строку */
  display: inline-block;
  vertical-align: top;
}


.table-fill {
  position: relative;
  width: calc(var(--cols) * 120px);
  height: calc(var(--rows) * 20px);
  background: white;   /* ← белый фон только под таблицей */
  z-index: 1;          /* чтобы перекрыть клетки .notebook-grid */
}

.table-grid-line {
  position: absolute;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.08);
  z-index: 1;

  &--v {
    width: 1px;
  }
  &--h {
    height: 1px;
  }
}

.table-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid rgba(0, 0, 0, 0.15);
  pointer-events: none;
  z-index: 2;
}

.table-cell {
  position: absolute;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  z-index: 3;
}

.table-cell-text {
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  color: #2c3e50;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-cell-input {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  outline: none;
  font-family: 'Fira Code', serif;
  font-size: 13px;
  line-height: 20px;
  color: #2c3e50;
  caret-color: #2c3e50;
  box-sizing: border-box;
  text-align: center;

  &:focus {
    background: rgba(255, 255, 255, 0.4);
  }
  &.table-cell-correct {
    background: rgba(46, 204, 113, 0.1);
  }
  &.table-cell-incorrect {
    background: rgba(243, 156, 18, 0.1);
  }
  &::placeholder {
    color: rgba(0, 0, 0, 0.25);
    font-style: italic;
    text-align: center;
  }
}

/* Модалка очистки */
.clear-confirm-modal { max-width: 420px; text-align: center; }
.clear-confirm-icon { font-size: 44px; line-height: 1; margin-bottom: 12px; }
.clear-confirm-text {
  margin: 0 0 8px 0;
  color: #5a6b7b;
  font-family: 'Times New Roman', serif;
  font-size: 16px;
  line-height: 22px;
}
.clear-confirm-buttons { justify-content: center; margin-top: 24px; }
.clear-confirm-buttons .modal-btn { min-width: 110px; }


/* ==================== ARTICLE WORDS INPUT ==================== */
.article-block {
  margin: 0;
  padding: 0;
}

.article-description {
  font-family: 'Special_f1', sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #2c3e50;
}

.article-useful-words {
  font-family: 'Times New Roman', serif;
  font-size: 13px;
  line-height: 20px;
  color: #7f8c8d;
  margin: 0 0 12px 0;
  padding: 6px 10px;
  background: rgba(52, 152, 219, 0.06);
  border-left: 3px solid #3498db;
  border-radius: 4px;

  strong {
    color: #207cca;
  }
}

.article-picture {
  max-width: 200px;
  max-height: 200px;
  display: block;
  margin: 0 0 12px 0;
  border-radius: 8px;
}

.audio-player-sticky-container {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 10px 0;
  margin-bottom: 15px;
}

.audio-player {
  width: 100%;
  max-width: 500px;
  outline: none;

  &::-webkit-media-controls-enclosure {
    overflow: hidden;
  }
  &::-webkit-media-controls-panel {
    -webkit-user-select: none;
  }
}

.article-text {
  font-family: "Fira Code", serif;
  font-size: 14px;
  line-height: 26px;
  color: #2c3e50;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
}

.article-blank-wrapper {
  position: relative;
  display: inline-block;
  vertical-align: baseline;
  height: 22px;
  line-height: 22px;
  box-sizing: border-box;
  margin: 0 2px;
  transition: background 0.3s;

  &::before {
    content: '';
    position: absolute;
    left: 4px;
    right: 4px;
    bottom: 2px;
    height: 1px;
    pointer-events: none;
    background-image: repeating-linear-gradient(
        to right,
        rgba(0, 0, 0, 0.3) 0px,
        rgba(0, 0, 0, 0.3) 4px,
        transparent 4px,
        transparent 8px
    );
  }

  &.article-blank-correct {
    background: rgba(46, 204, 113, 0.1);
    &::before {
      background-image: repeating-linear-gradient(
          to right,
          #27ae60 0px,
          #27ae60 4px,
          transparent 4px,
          transparent 8px
      );
    }
  }
  &.article-blank-incorrect {
    background: rgba(243, 156, 18, 0.1);
    &::before {
      background-image: repeating-linear-gradient(
          to right,
          #f39c12 0px,
          #f39c12 4px,
          transparent 4px,
          transparent 8px
      );
    }
  }
}

.article-blank-input {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  border: none;                 /* убрали border-bottom */
  background: transparent;
  outline: none;
  font-family: inherit;          /* ← наследуем шрифт от родителя */
  font-size: 14px;
  line-height: 22px;
  color: #2c3e50;
  caret-color: #2c3e50;
  box-sizing: border-box;
  text-align: center;
  position: relative;
  z-index: 1;
}
.article-useful-words {
  font-family: 'Times New Roman', serif;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.08), rgba(155, 89, 182, 0.06));
  border-left: 4px solid #3498db;
  border-radius: 8px;
}

.useful-words-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.useful-words-icon {
  font-size: 16px;
  line-height: 1;
}

.useful-words-title {
  font-family: 'Special_f1', sans-serif;
  font-size: 14px;
  font-weight: bold;
  color: #207cca;
  line-height: 20px;
}

.useful-words-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 6px;
}

.useful-word-card {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 10px;
  background: white;
  border: 1px solid rgba(52, 152, 219, 0.25);
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #3498db;
    box-shadow: 0 2px 6px rgba(52, 152, 219, 0.15);
  }
}

.useful-word-eng {
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  line-height: 20px;
}

.useful-word-ru {
  font-family: 'Times New Roman', serif;
  font-size: 13px;
  color: #7f8c8d;
  line-height: 18px;
}

.useful-words-text {
  margin: 0;
  font-size: 13px;
  line-height: 20px;
  color: #5a6b7b;
}
/* Стили для печати */
@media print {
  @page {
    size: A4;
    margin: 10mm;
  }

  :global(html),
  :global(body) {
    font-size: 11px;
  }

  .container {
    background: white !important;
    padding: 0 !important;
    min-height: auto !important;
    display: block !important;
  }

  .header { margin-bottom: 8px !important; }

  .agent-name {
    font-size: 0 !important;
    color: transparent !important;
  }
  .agent-name::before {
    content: 'My name is ________';
    font-size: 14px;
    color: #333;
    font-family: 'Special_f1', sans-serif;
  }

  .notebook-wrapper {
    width: 100% !important;
    height: auto !important;
    perspective: none !important;
  }
  .notebook-cover {
    background: white !important;
    box-shadow: none !important;
    padding: 0 !important;
    &::before { display: none !important; }
  }
  .notebook-page {
    box-shadow: none !important;
    padding: 0 !important;
    &::before { display: none !important; }
  }
  .notebook-grid { display: none !important; }
  .notebook-content {
    overflow: visible !important;
    height: auto !important;
    padding: 0 !important;
  }
  .notebook-wrapper::after { display: none !important; }

  .content-inner {
    font-size: 11px !important;
    line-height: 14px !important;
    color: #000 !important;
  }

  .gray-font {
    font-size: 10px !important;
    line-height: 13px !important;
    margin: 0 0 8px 0 !important;
    color: #555 !important;
  }

  .task-title {
    font-size: 11px !important;
    line-height: 14px !important;
    margin: 8px 0 4px 0 !important;
    color: #333 !important;

    .task-block:not(:first-child) & {
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      padding-top: 16px;
      margin-top: 30px;
    }
  }

  .task-block {
    page-break-inside: avoid;
    margin-bottom: 8px !important;
  }

  .question-text {
    font-size: 11px !important;
    line-height: 14px !important;
    color: #000 !important;
  }

  .button-wrapper,
  .check-button,
  .results,
  .task-result,
  .hint-icon,
  .answer-flag,
  .print-button,
  .pdf-button,
  .reset-button,
  .progress-text,
  .modal-overlay,
  .hints,
  .correct-answer-display {
    display: none !important;
  }

  .message-input,
  .message-input-text {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    min-height: 16px !important;
    font-size: 11px !important;
    line-height: 14px !important;
    background: transparent !important;
    border-bottom: 1px solid #ccc !important;

  }
  .message-input::placeholder,
  .message-input-text::placeholder {
    color: transparent !important;
    opacity: 0 !important;
  }
  .message-input {
    min-height: 80px !important;
    background-image: repeating-linear-gradient(
        to bottom,
        transparent 0px,
        transparent 19px,
        rgba(0, 0, 0, 0.15) 19px,
        rgba(0, 0, 0, 0.15) 20px
    ) !important;
    background-size: 100% 20px !important;
    background-attachment: local !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .doTheMagic-row {
    min-height: 14px;
    line-height: 14px;
  }
  .doTheMagic-label {
    font-size: 11px;
    line-height: 14px;
    min-width: 18px;
  }
  .doTheMagic-input {
    height: 14px;
    min-height: 14px;
    font-size: 11px;
    line-height: 14px;
  }

  .fill-blank-text {
    font-size: 11px !important;
    line-height: 14px !important;
  }
  .fill-blank-wrapper {
    height: 14px !important;
    line-height: 14px !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    background: transparent !important;
  }
  .fill-blank-wrapper.fill-blank-correct,
  .fill-blank-wrapper.fill-blank-incorrect {
    background: transparent !important;
    border-bottom-color: rgba(0, 0, 0, 0.08) !important;

  }
  .fill-blank-input {
    font-size: 11px !important;
    line-height: 14px !important;
  }

  .table-fill-block {
    margin-left: 0 !important;
  }
  .table-cell-text,
  .table-cell-input {
    font-size: 11px;
    line-height: 14px;
  }
  .table-cell-input {
    background: transparent !important;
  }
  .table-cell-input.table-cell-correct,
  .table-cell-input.table-cell-incorrect {
    background: transparent !important;
  }
  .table-grid-line {
    background: rgba(0, 0, 0, 0.2) !important;
  }

  .article-block {
    page-break-inside: avoid;
  }
  .article-description,
  .article-useful-words {
    font-size: 11px !important;
    line-height: 14px !important;
  }
  .article-text {
    font-size: 11px !important;
    line-height: 18px !important;
  }
  .article-blank-wrapper {
    height: 16px !important;
    line-height: 16px !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2) !important;
    background: transparent !important;
  }
  .article-blank-wrapper.article-blank-correct,
  .article-blank-wrapper.article-blank-incorrect {
    background: transparent !important;
    border-bottom-color: rgba(0, 0, 0, 0.2) !important;
  }
  .article-blank-input {
    font-size: 11px !important;
    line-height: 16px !important;
  }
  .audio-player-sticky-container {
    display: none !important;
  }
  .article-picture {
    max-width: 100px !important;
    max-height: 100px !important;
  }
}

/* Адаптивность */
@media (max-width: 850px) {
  .pdf-button { display: none !important; }

  .notebook-cover { padding: 10px; }
  .notebook-wrapper, .header { width: 95%; }

  .notebook-page {
    padding: 20px 0 20px 5px;
    &::before { left: 5px; }
  }

  .header { flex-direction: column; gap: 10px; text-align: center; }
  .header-left { flex-direction: column; gap: 10px; }
  .button-wrapper { flex-direction: column; align-items: center; }
  .modal-content { max-width: 95%; padding: 20px; }

  .doTheMagic-input { letter-spacing: -0.5px; font-size: 14px; }
  .fill-blank-input { font-size: 14px; }

  .table-fill-block {
    margin-left: 0;
  }
}
</style>
