<template>

  <div class="container">
    <!-- Заголовок с именем агента -->
    <div class="header">
      <div class="header-left">
        <h1 class="agent-name" @click="openNameModal">
          {{ displayUserName }}
        </h1>
        <span class="mission-badge" @click="openMissionsList">
          {{ currentMission?.missionName || 'Миссия' }}
        </span>
      </div>
      <div class="header-right">
<!--        <span class="progress-text">{{ getProgressText() }}</span>-->
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

                <div class="input-wrapper">
                  <textarea
                    v-if="task.type === 'textarea'"
                    class="message-input"
                    :class="getInputClass(index)"
                    :placeholder="task.placeholder"
                    v-model="answers[index]"
                    @input="adjustTextareaHeight($event, index)"
                    :data-index="index"
                    rows="1"
                  ></textarea>

                  <input
                    v-else
                    class="message-input-text"
                    :class="getInputClass(index)"
                    :placeholder="task.placeholder"
                    v-model="answers[index]"
                    @input="adjustInputHeight"
                  />
                </div>

                <!-- Результат для конкретного задания -->
                <div v-if="showResults && taskResults[index]" class="task-result">
                  <span class="result-icon">
<!--                    {{ taskResults[index].isCorrect ? '✅' : '🔄' }}-->
                  </span>
                  <span class="result-message" :class="taskResults[index].isCorrect ? 'correct-text' : 'incorrect-text'">
                    {{ taskResults[index].message }}
                  </span>
                </div>
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

              <!-- Общий результат -->
<!--              <div v-if="showResults" class="results">-->
<!--                <div class="score">-->
<!--                  {{ correctAnswers }} из {{ totalTasks }} правильных-->
<!--                  <span class="score-percent">({{ Math.round((correctAnswers / totalTasks) * 100) }}%)</span>-->
<!--                </div>-->
<!--                <div class="score-message" :class="getScoreClass()">-->
<!--                  {{ getScoreMessage() }}-->
<!--                </div>-->
<!--              </div>-->
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

<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getHomework, getAllMissions } from '../dataForGames/hwData'
import { useGameStore } from 'stores/example-store'

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()

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
const showHint = ref([]) // Массив Set'ов с индексами показанных подсказок
const showAnswerFlag = ref([])
const missionsList = ref([])

// Модалки
const showNameModal = ref(false)
const tempName = ref('')
const showMissionsModal = ref(false)

const isBackendAvailable = ref(true)

// Вычисляемое свойство - проверяет, есть ли хотя бы 2 символа в любом поле
const isAnyAnswerFilled = computed(() => {
  if (!answers.value || answers.value.length === 0) return false;

  // Проверяем, есть ли хоть одно поле с 2+ символами
  return answers.value.some(answer =>
    answer && answer.trim().length >= 2
  );
});

const displayUserName = computed(() => {
  let name = '';

  if (gameStore.agentName) {
    name = gameStore.agentName.split('#')[0];
  } else {
    const savedName = localStorage.getItem('agentName');
    if (savedName) {
      name = savedName;
    } else {
      name = 'нажми сюда';
    }
  }

  if (!isBackendAvailable.value && name !== 'Agent 404') {
    return `${name} (404)`;
  }

  return name;
});

const loadMission = () => {
  const data = getHomework(missionName.value)
  currentMission.value = data
  if (data) {
    answers.value = new Array(data.tasks.length).fill('')
    // Создаем массив Set'ов для отслеживания показанных подсказок
    showHint.value = data.tasks.map(() => new Set())
    showAnswerFlag.value = new Array(data.tasks.length).fill(false)
    totalTasks.value = data.tasks.length
  }
  showResults.value = false
  taskResults.value = []
  missionsList.value = getAllMissions()
}

// Получить все подсказки для задачи с их индексами и текстом
const getAllHintsWithIndex = (task) => {
  const hints = []
  if (task.hint1) hints.push({ text: task.hint1, index: 1 })
  if (task.hint2) hints.push({ text: task.hint2, index: 2 })
  if (task.hint3) hints.push({ text: task.hint3, index: 3 })
  if (task.hint4) hints.push({ text: task.hint4, index: 4 })
  if (task.hint5) hints.push({ text: task.hint5, index: 5 })
  return hints
}

// Получить доступные подсказки для задачи (только те, которые еще не показаны)
const getAvailableHints = (task, taskIndex) => {
  const allHints = getAllHintsWithIndex(task)
  const shownHints = showHint.value[taskIndex] || new Set()

  // Возвращаем только те подсказки, которых нет в показанных
  return allHints.filter(hint => !shownHints.has(hint.index))
}

// Получить показанные подсказки для отображения
const getShownHints = (task, taskIndex) => {
  const allHints = getAllHintsWithIndex(task)
  const shownHints = showHint.value[taskIndex] || new Set()

  // Возвращаем текст подсказок, которые были показаны
  return allHints
    .filter(hint => shownHints.has(hint.index))
    .map(hint => hint.text)
}

// Переключить подсказку по ее индексу
const toggleHint = (taskIndex, hintIndex) => {
  // Убеждаемся, что Set для этой задачи существует
  if (!showHint.value[taskIndex]) {
    showHint.value[taskIndex] = new Set()
  }

  // Добавляем индекс подсказки в показанные
  showHint.value[taskIndex].add(hintIndex)

  // Триггерим обновление (для реактивности)
  showHint.value = [...showHint.value]
}

// Показать правильный ответ
const showCorrectAnswer = (index) => {
  if (currentMission.value.tasks[index].answers &&
    currentMission.value.tasks[index].answers.length > 0) {
    showAnswerFlag.value[index] = true
  }
}

const calculateContentHeight = () => {
  return 600
}

const adjustTextareaHeight = async (event, index) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

const adjustInputHeight = async () => {
  // Ничего не делаем
}

const getInputClass = (index) => {
  if (!showResults.value) return ''
  if (!taskResults.value[index]) return ''
  return taskResults.value[index].isCorrect ? 'input-correct' : 'input-incorrect'
}

const checkSingleAnswer = (task, answer) => {
  if (!task.answers || task.answers.length === 0) {
    return {
      isCorrect: null,
      message: '📝 Эта часть не может быть проверена автоматически! - Отправь скриншот учителю на проверку'
    }
  }

  const normalizedAnswer = answer.trim().toLowerCase()
  const isCorrect = task.answers.some(correct =>
    normalizedAnswer === correct.toLowerCase()
  )

  return {
    isCorrect: isCorrect,
    message: isCorrect ? '✅ super !' : '☝️ Странно выглядит... нажми чтобы исправить самостоятельно. \n Или отправь скриншот Винсенту - можно так сказать или нет, он проверит '
  }
}

const checkAnswers = () => {
  if (!currentMission.value || isChecking.value) return

  isChecking.value = true

  setTimeout(() => {
    const results = []
    let correct = 0

    currentMission.value.tasks.forEach((task, index) => {
      const answer = answers.value[index] || ''
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

const getProgressText = () => {
  if (!currentMission.value) return ''
  const answered = answers.value.filter(a => a && a.trim().length > 0).length
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

// Модалка имени
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

// Модалка списка миссий
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

// Печать PDF
const printPDF = () => {
  window.print()
}

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
      #e0e8e8 19px,
      #e0e8e8 20px,
      transparent 20px
    ),
    linear-gradient(to bottom,
      transparent 0%,
      transparent 19px,
      #e0e8e8 19px,
      #e0e8e8 20px,
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
  margin-bottom: 18px;
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

}

.message-input {
  width: 100%;
  min-height: 37px;
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
  background: transparent;
  border: none;
  outline: none;
  font-family: 'Times New Roman', serif;
  font-size: 16px;
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

  .message-input,
  .message-input-text {
    border-bottom: 1px solid #ccc !important;
    min-height: 30px !important;
  }

  .task-block {
    page-break-inside: avoid;
    margin-bottom: 18px !important;
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
    padding: 20px 0 20px 30px;

    &::before {

      left: 30px;
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
}
</style>
