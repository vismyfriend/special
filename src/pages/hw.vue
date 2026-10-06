<template>
  <div class="container">
    <!-- Заголовок с именем агента -->
    <div class="header">
      <div class="header-left">
        <h1 class="agent-name" @click="openNameModal">
          {{ displayUserName }}
        </h1>
<!--        <span class="mission-badge" @click="openMissionsList">-->
<!--          {{ currentMission?.missionName || 'Миссия' }}-->
<!--        </span>-->
      </div>
      <div class="header-right">
        <button class="print-button"
                @click="checkAnswers"
                title="Скачать PDF">
          ✅
        </button>
        <button class="print-button" @click="printPDF" title="Скачать PDF">
          🖨️
        </button>

      </div>
    </div>

    <div class="notebook-wrapper" :style="{ height: notebookHeight + 'px' }">
      <div class="notebook-cover">
        <div class="notebook-page">
          <div class="notebook-grid"></div>

          <div class="notebook-content" ref="contentRef">
            <!-- ЕСЛИ МИССИЯ НАЙДЕНА -->
            <div v-if="currentMission" class="content-inner">
              <p class="gray-font">
                {{ currentMission.description }}
              </p>

              <div
                v-for="(task, index) in currentMission.tasks"
                :key="index"
                class="task-block"
              >
                <div class="question-text">
                  {{ task.question }}

                  <!-- Подсказки в виде лампочек -->
                  <span
                    v-for="hint in getAvailableHints(task, index)"
                    :key="hint.index"
                    class="hint-icon"
                    @click="toggleHint(index, hint.index)"
                  >
                    💡
                  </span>

                  <!-- Флажок для показа правильного ответа -->
                  <span
                    v-if="task.answers && task.answers.length > 0 && !showAnswerFlag[index]"
                    class="answer-flag"
                    @click="showCorrectAnswer(index)"
                  >
                    🏁
                  </span>
                </div>

                <!-- Подсказки -->
                <div v-if="showHint[index] && showHint[index].size > 0" class="hints">
                  <div
                    v-for="(hintText, hintIndex) in getShownHints(currentMission.tasks[index], index)"
                    :key="hintIndex"
                    class="hint-text"
                  >
                    {{ hintText }}
                  </div>
                </div>

                <!-- Показ правильного ответа -->
                <div v-if="showAnswerFlag[index] && task.answers" class="correct-answer-display">
                  <span class="answer-label">Правильный ответ:</span>
                  <span class="answer-text">{{ task.answers.join(' или ') }}</span>
                </div>




                <!-- === ТИП DO THE MAGIC (+ − ? o? a*) === -->



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

                <!-- === ОБЫЧНЫЙ TEXTAREA === -->
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

                <!-- === ОБЫЧНЫЙ INPUT (TEXT) === -->
                <div v-else class="input-wrapper">
                  <input
                    class="message-input-text"
                    :class="getInputClass(index)"
                    :placeholder="task.placeholder"
                    v-model="answers[index]"
                    @input="adjustInputHeight"
                  />
                </div>

                <!-- Результат для конкретного задания -->
<!--                <div v-if="showResults && taskResults[index]" class="task-result">-->
<!--                  <span class="result-icon"></span>-->
<!--                  <span-->
<!--                    class="result-message"-->
<!--                    :class="taskResults[index].isCorrect ? 'correct-text' : 'incorrect-text'"-->
<!--                  >-->
<!--                    {{ taskResults[index].message }}-->
<!--                  </span>-->
<!--                </div>-->
              </div>

              <!-- Кнопки -->
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

            <!-- ЕСЛИ МИССИЯ НЕ НАЙДЕНА -->
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
      <h2>📚 Список домашних заданий</h2>
      <div class="missions-list">
        <div
          v-for="mission in missionsList"
          :key="mission.id"
          class="mission-item"
          @click="goToMission(mission.id)"
        >
          <span class="mission-item-name">{{ mission.missionName }}</span>
          <span class="mission-item-badge">→</span>
        </div>
      </div>
      <button class="modal-btn save" @click="closeMissionsModal">Закрыть</button>
    </div>
  </div>
</template>
<script setup>import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getHomework, getAllMissions } from '../dataForGames/hwData'
import { useGameStore } from 'stores/example-store'
import { useSpellingCheck } from 'src/composables/specialSpellingCheck'

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()

// Composable для проверки ответов
const { usualCheck } = useSpellingCheck()
const missionName = computed(() => route.params.missionName || 'intro-1')
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

// Модалки
const showNameModal = ref(false)
const tempName = ref('')
const showMissionsModal = ref(false)

// Refs для textarea в doTheMagic (чтобы управлять высотой)
const doTheMagicRefs = ref({}) // { 'index_key': HTMLElement }

const setDoTheMagicRef = (el, index, key) => {
  if (el) {
    doTheMagicRefs.value[`${index}_${key}`] = el
  }
}

// Авто-высота для textarea в doTheMagic
const adjustDoTheMagicHeight = (event, index, key) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  // Округляем до кратного 20px (клетке)
  const scrollHeight = textarea.scrollHeight
  const roundedHeight = Math.max(20, Math.ceil(scrollHeight / 20) * 20)
  textarea.style.height = roundedHeight + 'px'
}

// Показ правильного ответа при клике на метку
const hintAnswer = ref({}) // { 'taskIndex_key': 'правильный ответ' }
const savedAnswers = ref({}) // { 'taskIndex_key': 'что было в поле' }
const showAnswerHint = (taskIndex, key, task) => {
  const hintKey = `${taskIndex}_${key}`

  // Если уже показан — не показываем
  if (hintAnswer.value[hintKey]) return

  // Собираем правильный ответ
  const correctList = task.correct?.[key]
  if (!correctList || correctList.length === 0) return

  // Показываем через /, если несколько
  const answerText = correctList.join(' / ')

  // Сохраняем текущий ввод студента
  const savedAnswer = answers.value[taskIndex][key] || ''
  savedAnswers.value[hintKey] = savedAnswer

  // Очищаем поле — чтобы placeholder стал виден
  answers.value[taskIndex][key] = ''
// Сбрасываем высоту textarea до 20px (одна клетка)
  nextTick(() => {
    const refKey = `${taskIndex}_${key}`
    if (doTheMagicRefs.value[refKey]) {
      doTheMagicRefs.value[refKey].style.height = '20px'
    }
  })
  // Показываем подсказку
  hintAnswer.value = {
    ...hintAnswer.value,
    [hintKey]: answerText
  }

  // Через 2 секунды убираем
  setTimeout(() => {
    const currentValue = answers.value[taskIndex][key]
    if (currentValue === '' || currentValue === undefined) {
      answers.value[taskIndex][key] = savedAnswers.value[hintKey] || ''
    }

    // ← Пересчитываем высоту после возврата
    nextTick(() => {
      const refKey = `${taskIndex}_${key}`
      const textarea = doTheMagicRefs.value[refKey]
      if (textarea) {
        textarea.style.height = 'auto'
        const scrollHeight = textarea.scrollHeight
        const roundedHeight = Math.max(20, Math.ceil(scrollHeight / 20) * 20)
        textarea.style.height = roundedHeight + 'px'
      }
    })

    // Убираем подсказку
    const newHint = {...hintAnswer.value}
    delete newHint[hintKey]
    hintAnswer.value = newHint

    // Очищаем сохранённое
    const newSaved = {...savedAnswers.value}
    delete newSaved[hintKey]
    savedAnswers.value = newSaved
  }, 2000)
}

const isBackendAvailable = ref(true)

// ==================== ПРОВЕРКА: ЕСТЬ ЛИ ХОТЯ БЫ 2 СИМВОЛА ====================
const isAnyAnswerFilled = computed(() => {
  if (!answers.value || answers.value.length === 0) return false

  return answers.value.some(answer => {
    // Если это строка (обычный ответ)
    if (typeof answer === 'string') {
      return answer.trim().length >= 2
    }
    // Если это объект (doTheMagic)
    if (typeof answer === 'object' && answer !== null) {
      return Object.values(answer).some(v => v && v.trim().length >= 2)
    }
    return false
  })
})

const displayUserName = computed(() => {
  let name = ''

  if (gameStore.agentName) {
    name = gameStore.agentName.split('#')[0]
  } else {
    const savedName = localStorage.getItem('agentName')
    if (savedName) {
      name = savedName
    } else {
      name = 'нажми сюда'
    }
  }

  if (!isBackendAvailable.value && name !== 'Agent 404') {
    return `${name} (404)`
  }

  return name
})

// ==================== ЗАГРУЗКА МИССИИ ====================
const loadMission = () => {
  const data = getHomework(missionName.value)
  currentMission.value = data

  if (data) {
    // Создаём answers в зависимости от типа задания
    answers.value = data.tasks.map(task => {
      if (task.type === 'doTheMagic') {
        // Для doTheMagic — объект с полями по ключам labels
        const obj = {}
        if (task.labels) {
          Object.keys(task.labels).forEach(key => {
            obj[key] = ''
          })
        }
        return obj
      }
      // Для остальных — строка
      return ''
    })

    showHint.value = data.tasks.map(() => new Set())
    showAnswerFlag.value = new Array(data.tasks.length).fill(false)
    totalTasks.value = data.tasks.length
  }

  showResults.value = false
  taskResults.value = []
  missionsList.value = getAllMissions()
}

// ==================== ПОДСКАЗКИ ====================
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
  const allHints = getAllHintsWithIndex(task)
  const shownHints = showHint.value[taskIndex] || new Set()
  return allHints.filter(hint => !shownHints.has(hint.index))
}

const getShownHints = (task, taskIndex) => {
  const allHints = getAllHintsWithIndex(task)
  const shownHints = showHint.value[taskIndex] || new Set()
  return allHints
    .filter(hint => shownHints.has(hint.index))
    .map(hint => hint.text)
}

const toggleHint = (taskIndex, hintIndex) => {
  if (!showHint.value[taskIndex]) {
    showHint.value[taskIndex] = new Set()
  }
  showHint.value[taskIndex].add(hintIndex)
  showHint.value = [...showHint.value]
}

const showCorrectAnswer = (index) => {
  const task = currentMission.value.tasks[index]
  if (task.answers && task.answers.length > 0) {
    showAnswerFlag.value[index] = true
  }
}

// ==================== АВТО-ВЫСОТА ====================
const adjustTextareaHeight = async (event, index) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

const adjustInputHeight = async () => {
  // Ничего не делаем
}

// ==================== СТИЛИ ДЛЯ INPUT ====================
const getInputClass = (index) => {
  if (!showResults.value) return ''
  if (!taskResults.value[index]) return ''
  return taskResults.value[index].isCorrect ? 'input-correct' : 'input-incorrect'
}

// ==================== DO THE MAGIC ====================
const getDoTheMagicClass = (taskIndex, fieldKey) => {
  if (!showResults.value) return ''
  if (!taskResults.value[taskIndex]?.fields) return ''
  return taskResults.value[taskIndex].fields[fieldKey] ? 'doTheMagic-correct' : 'doTheMagic-incorrect'
}

const getDoTheMagicPlaceholder = (key, taskIndex) => {
  // Placeholder только для ПЕРВОГО задания
  if (taskIndex !== 0) return ''

  const placeholders = {
    positive: 'Утверждение...',
    negative: 'Отрицание...',
    question: 'Вопрос yes/no',
    openQuestion: 'Открытый вопрос...',
    answer: 'Ответ (*необязательно)'
  }
  return placeholders[key] || ''
}
// ==================== ПРОВЕРКА ОТКРЫТОГО ВОПРОСА ====================
const WH_WORDS = ['how often', 'why the hell', 'where the hell', 'when the hell','what the hell',
  'what', 'what time', 'how long', 'when', 'where', 'why', 'how',]

/**
 * Проверка открытого вопроса.
 *
 * Если в task.correct есть openQuestion — проверяем по нему.
 * Если НЕТ — берём question (закрытый вопрос) и разрешаем любой wh-word спереди.
 *
 * Пример:
 * - Студент пишет: "Why do you like English?"
 * - В данных question: ["Do you like English?"], openQuestion нет.
 * - Берём "Do you like English?", отделяем wh-word "why", остаток "do you like english".
 * - Остаток студента (после "why"): "do you like english".
 * - Совпадает → ✅
 */
const checkOpenQuestion = (userAnswer, task) => {
  const userLower = (userAnswer || '').toLowerCase().trim()

  // 1. Если в task.correct есть openQuestion — сначала проверяем по нему
  if (task.correct?.openQuestion && task.correct.openQuestion.length > 0) {
    if (usualCheck(userAnswer, task.correct.openQuestion)) return true
  }

  // 2. Определяем wh-word студента
  const userWh = WH_WORDS.find(w => userLower.startsWith(w + ' '))
  if (!userWh) return false

  // 3. Извлекаем "остаток" студента (без wh-word)
  const userRest = userLower.slice(userWh.length).trim()

  // 4. Собираем список "закрытых вопросов" для сравнения
  // Приоритет: openQuestion (если есть) + question (всегда)
  const closedQuestions = []
  if (task.correct?.question) {
    closedQuestions.push(...task.correct.question)
  }
  if (task.correct?.openQuestion) {
    closedQuestions.push(...task.correct.openQuestion)
  }

  // 5. Сравниваем "остаток" студента с каждым закрытым вопросом
  return closedQuestions.some(correct => {
    const correctLower = correct.toLowerCase().trim()

    // Если правильный тоже начинается с wh-word — убираем его
    const correctWh = WH_WORDS.find(w => correctLower.startsWith(w + ' '))
    const correctRest = correctWh
      ? correctLower.slice(correctWh.length).trim()
      : correctLower

    // Сравниваем "остатки" через usualCheck
    return usualCheck(userRest, correctRest)
  })
}
// ==================== ПРОВЕРКА ОДНОГО ОТВЕТА ====================
const checkSingleAnswer = (task, answer) => {
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

        // ← СПЕЦИАЛЬНАЯ ОБРАБОТКА ДЛЯ openQuestion
        if (key === 'openQuestion') {
          isFieldCorrect = checkOpenQuestion(userAnswer, task)
        } else {
          // ← ОБЫЧНАЯ ПРОВЕРКА
          isFieldCorrect = usualCheck(userAnswer, task.correct[key])
        }

        results[key] = isFieldCorrect

        if (!isFieldCorrect && userAnswer.length > 0) {
          allCorrect = false
        }
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

  // === ОБЫЧНЫЕ ЗАДАНИЯ ===
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
    isCorrect: isCorrect,
    message: isCorrect
      ? '✅ super !'
      : '☝️ Странно выглядит... нажми чтобы исправить самостоятельно. \n Или отправь скриншот Винсенту - можно так сказать или нет, он проверит '
  }
}

// ==================== ПРОВЕРКА ВСЕХ ОТВЕТОВ ====================
const checkAnswers = () => {
  if (!currentMission.value || isChecking.value) return

  isChecking.value = true

  setTimeout(() => {
    const results = []
    let correct = 0

    currentMission.value.tasks.forEach((task, index) => {
      const answer = answers.value[index]
      const result = checkSingleAnswer(task, answer)

      if (result.isCorrect === true) {
        correct++
      }

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

// ==================== ПРОЧЕЕ ====================
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

// ==================== МОДАЛКА ИМЕНИ ====================
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

// ==================== МОДАЛКА МИССИЙ ====================
const openMissionsList = () => {
  missionsList.value = getAllMissions()
  showMissionsModal.value = true
}

const closeMissionsModal = () => {
  showMissionsModal.value = false
}

const goToMission = (missionId) => {
  closeMissionsModal()
  router.push(`/hw/${missionId}`)
}

// ==================== ПЕЧАТЬ ====================
const printPDF = () => {
  window.print()
}

// ==================== ЗАГРУЗКА ПОЛЬЗОВАТЕЛЯ ====================
const loadUserFromBackend = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      console.log('Нет токена, пользователь не авторизован')
      return false
    }

    const fullAgentName = localStorage.getItem('fullAgentName')
    const agentName = localStorage.getItem('agentName')

    if (fullAgentName && agentName) {
      gameStore.setAgentName(fullAgentName)
      console.log('Имя восстановлено из localStorage:', agentName)
      return true
    }
    return false
  } catch (error) {
    console.error('Ошибка загрузки пользователя:', error)
    return false
  }
}

const adjustNotebookHeight = async () => {
  notebookHeight.value = 600
}

// ==================== WATCH & MOUNT ====================
watch(() => route.params.missionName, () => {
  loadMission()
  nextTick(() => {
    notebookHeight.value = 600
  })
})

onMounted(async () => {
  await loadUserFromBackend()
  loadMission()
  await adjustNotebookHeight()
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

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

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

.mission-badge {
  color: #7db9e8;
  font-size: 16px;
  font-family: 'Special_f1', sans-serif;
  background: rgba(125, 185, 232, 0.15);
  padding: 5px 15px;
  border-radius: 20px;
  border: 1px solid rgba(125, 185, 232, 0.3);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(125, 185, 232, 0.25);
    transform: scale(1.05);
  }
}

.progress-text {
  color: #95a5a6;
  font-size: 14px;
  font-family: 'Special_f1', sans-serif;
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  padding: 0 15px 0 15px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #207cca;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.content-inner {
  font-family: 'Times New Roman', serif;
  font-size: 16px;
  line-height: 20px;
  color: #25598e;
}

.task-block {
  margin-bottom: 20px;
  position: relative;
}

.question-text {
  display: block;
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
  line-height: 20px;
  font-family: 'Special_f1', sans-serif;
}

.hint-icon {
  display: inline-block;
  margin-left: 6px;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.2);
  }
}

.answer-flag {
  display: inline-block;
  margin-left: 6px;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.2);
  }
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

  &:not(:last-child) {
    margin-bottom: 4px;
  }
}

.correct-answer-display {
  margin: 6px 0 8px 0;
  padding: 8px 12px;
  background: rgba(46, 204, 113, 0.1);
  border-left: 3px solid #27ae60;
  border-radius: 4px;
}

.answer-label {
  font-weight: bold;
  color: #27ae60;
  margin-right: 8px;
}

.answer-text {
  color: #2c3e50;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;         /* ← добавили */
  align-items: center;   /* ← добавили */
}

.message-input {
  width: 100%;
  min-height: 40px;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  font-family: 'Times New Roman', serif;
  font-size: 16px;
  line-height: 20px;
  color: #2c3e50;
  box-shadow: none;
  border-radius: 0;
  background: transparent;
  caret-color: #2c3e50;
  transition: all 0.3s;
  overflow: hidden;

  &::placeholder {
    color: #95a5a6;
    opacity: 0.7;
    font-style: italic;
  }

  &:focus {
    background: rgba(255, 255, 255, 0.3);
    box-shadow: inset 0 0 0 1px rgba(74, 144, 226, 0.3);
  }

  &.input-correct {
    background: rgba(46, 204, 113, 0.08);
    border-bottom: 2px solid #27ae60;
  }

  &.input-incorrect {
    background: rgba(243, 156, 18, 0.08);
    border-bottom: 2px solid #f39c12;
  }
}

.message-input-text {
  width: 100%;
  height: 20px;           /* ← явная высота */
  padding: 0;             /* ← убираем браузерный padding */
  border: none;
  box-sizing: border-box; /* ← height включает padding/border */
  background: transparent;
  outline: none;
  font-family: 'Fira Code', serif;
  font-size: 14px;
  line-height: 20px;
  color: #2c3e50;
  transition: all 0.3s;

  &::placeholder {
    color: #95a5a6;
    opacity: 0.7;
    font-style: italic;
  }

  &:focus {
    border-bottom-color: #207cca;
  }

  &.input-correct {
    border-bottom-color: #27ae60;
    background: rgba(26, 211, 79, 0.27);
  }

  &.input-incorrect {
    border-bottom-color: #f39c12;
    background: rgba(243, 156, 18, 0.15);
  }
}

.task-result {
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.result-icon {
  font-size: 16px;
}

.result-message {
  font-size: 14px;
  font-weight: 500;
  white-space: pre-wrap;



  &.incorrect-text {
    color: #207cca;
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

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(32, 124, 202, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.results {
  margin-top: 12px;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  border: 1px solid #e0e8e8;
}

.score {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 6px;
}

.score-percent {
  color: #7f8c8d;
  font-weight: normal;
  font-size: 13px;
}

.score-message {
  text-align: center;
  font-size: 15px;
  font-family: 'Times New Roman', serif;
  padding: 6px;
  border-radius: 4px;

  &.score-excellent {
    color: #27ae60;
    background: rgba(46, 204, 113, 0.1);
  }

  &.score-good {
    color: #3498db;
    background: rgba(52, 152, 219, 0.1);
  }

  &.score-ok {
    color: #f39c12;
    background: rgba(243, 156, 18, 0.1);
  }

  &.score-bad {
    color: #e74c3c;
    background: rgba(231, 76, 60, 0.1);
  }
}

.error-message {
  text-align: center;
  padding: 40px 0;

  span {
    font-size: 48px;
    display: block;
    margin-bottom: 20px;
  }

  p {
    color: #e74c3c;
    font-size: 24px;
    margin: 0 0 10px 0;
  }

  small {
    color: #95a5a6;
    font-size: 14px;
  }
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
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

  &:focus {
    border-color: #207cca;
  }
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

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(32, 124, 202, 0.3);
    }
  }

  &.cancel {
    background: #e0e8e8;
    color: #2c3e50;

    &:hover {
      background: #d0d8e0;
    }
  }
}

/* Список миссий */
.missions-modal {
  max-width: 600px;
}

.missions-list {
  max-height: 400px;
  overflow-y: auto;
  margin: 15px 0;
}

.mission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e8f0fe;
    transform: translateX(5px);
  }

  .mission-item-name {
    font-family: 'Times New Roman', serif;
    font-size: 16px;
    color: #2c3e50;
  }

  .mission-item-badge {
    color: #207cca;
    font-size: 18px;
  }
}

/* ==================== DO THE MAGIC (+ − ? o? a*) ==================== */
.doTheMagic-block {
  margin: 0;
  padding: 0;
}

.doTheMagic-grid {
  display: flex;
  flex-direction: column;
  gap: 0;                     /* ← без отступов, чтобы строки шли подряд */
}

.doTheMagic-row {
  display: flex;
  align-items: flex-start;    // ← вместо center как было у проста поля ввода (теперь это текст area)
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
  padding-top: 0;           // ← на случай, если был padding
  align-self: flex-start;   // ← прижимаем к верху
}

.doTheMagic-input {
  flex: 1;
  width: 100%;
  min-height: 20px;           // ← минимум одна клетка
  height: 20px;               // ← стартовая высота
  background: transparent;
  border: none;
  outline: none;
  resize: none;               // ← запрещаем ручной resize
  padding: 0;
  margin: 0;
  font-family: 'Fira Code', serif;
  font-size: 16px;
  line-height: 20px;          // ← ровно на клетку
  color: #2c3e50;
  caret-color: #2c3e50;
  transition: background 0.3s, box-shadow 0.3s;
  overflow: hidden;           // ← скрываем скроллбар
  vertical-align: top;        // ← важно для textarea
  box-sizing: border-box;     // ← чтобы padding не ломал высоту
  word-break: break-word;     // ← перенос длинных слов
  overflow-wrap: break-word;  // ← альтернативный перенос

  &.showing-hint::placeholder {
    color: #27ae60;
    opacity: 0.85;
    font-style: italic;
    font-weight: 500;
    animation: hintFadeIn 0.3s ease;
  }

  &::placeholder {
    color: #95a5a6;
    opacity: 0.6;
    font-style: italic;
    font-size: 14px;
  }

  &:focus {
    background: rgba(255, 255, 255, 0.3);
    box-shadow: inset 0 -1px 0 0 #207cca;
  }


  &.doTheMagic-correct {
    background: rgba(46, 204, 113, 0.08);
    //box-shadow: inset 0 -1px 0 0 #27ae60;
  }

  &.doTheMagic-incorrect {
    background: rgba(243, 156, 18, 0.08);
    //box-shadow: inset 0 -1px 0 0 #f39c12;
  }
}

/* Стили для печати */
@media print {
  .container {
    background: white !important;
    padding: 20px !important;
    min-height: auto !important;
    display: block !important;

  }

  .header {
    margin-bottom: 20px !important;

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

    &::before {
      display: none !important;
    }
  }

  .notebook-page {
    box-shadow: none !important;
    padding: 20px !important;

    &::before {
      display: none !important;
    }
  }

  .notebook-grid {
    display: none !important;
  }

  .notebook-content {
    overflow: visible !important;
    height: auto !important;
  }

  .notebook-wrapper::after {
    display: none !important;
  }

  .button-wrapper,
  .check-button,
  .results,
  .task-result,
  .hint-icon,
  .answer-flag,
  .print-button,
  .reset-button,
  .progress-text,
  .modal-overlay {
    display: none !important;
  }
  .message-input::placeholder,
  .message-input-text::placeholder {
    color: transparent !important;
    opacity: 0 !important;
  }
  .message-input,
  .message-input-text {
    border-bottom: 1px solid #ccc !important;
    min-height: 30px !important;
  }

  .task-block {
    page-break-inside: avoid;
    margin-bottom: 20px !important;
  }

  .hints {
    display: none !important;
  }

  .correct-answer-display {
    display: none !important;
  }
}

/* Адаптивность */
@media (max-width: 850px) {
  .print-button {
    display: none !important;
  }
  .notebook-cover {
    padding: 10px;
  }

  .notebook-wrapper, .header {
    width: 95%;
  }


  .notebook-page {
    padding: 20px 0 20px 5px;

    &::before {

      left: 5px;
    }
  }
  .header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .header-left {
    flex-direction: column;
    gap: 10px;
  }

  .button-wrapper {
    flex-direction: column;
    align-items: center;
  }

  .modal-content {
    max-width: 95%;
    padding: 20px;
  }


  .doTheMagic-input {

    letter-spacing: -0.5px;
    font-size: 14px;

  }

}
</style>
