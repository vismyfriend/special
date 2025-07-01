<template>
  <div class="detective-container">
    <!-- Состояние загрузки -->
    <div v-if="loading" class="loading-screen">
      <div class="loading-spinner"></div>
      <div class="loading-text">DECRYPTING CASE FILES...</div>
    </div>

    <!-- Основной интерфейс -->
    <template v-else>
      <!-- Финальный экран -->
      <div v-if="showResults" class="results-screen">
        <h2 class="secret-text">MISSION COMPLETE</h2>
        <div class="results-stats">
          <div class="stat correct-stat">
            <span class="stat-value">{{ correctSentences }}</span>
            <span class="stat-label">CORRECT ANSWERS</span>
          </div>
          <div class="stat attempts-stat">
            <span class="stat-value">{{ totalAttempts }}</span>
            <span class="stat-label">TOTAL ATTEMPTS</span>
          </div>
        </div>
        <div class="success-rate">
          SUCCESS RATE: <span class="rate-value">{{ successRate }}%</span>
        </div>
        <button @click="resetTest" class="detective-button restart-btn">
          NEW MISSION
        </button>
      </div>

      <!-- Основной экран -->
      <div v-else>
        <!-- Заголовок -->
        <div class="case-header">
          <h2 class="secret-text">{{ mainDescription }}</h2>
          <p class="case-description">code name: WORD ORDER RECONSTRUCTION</p>
        </div>

        <!-- Полезные слова -->
        <div v-if="currentTask.usefulWords" class="evidence-note">
          <div class="note-header">EVIDENCE // NOTES</div>
          <div class="word-grid">
            <div v-for="(pair, i) in parseUsefulWords(currentTask.usefulWords)"
                 :key="i" class="word-pair">
              <span class="evidence-word">{{ pair.english }}</span>
              <span class="evidence-separator">::</span>
              <span class="evidence-translation">{{ pair.russian }}</span>
            </div>
          </div>
        </div>

        <!-- Задание -->
        <div class="case-file">
          <div class="case-number">{{ currentQuestionIndex + 1 }}/{{ totalQuestions }}</div>
          <h3 class="case-title">{{ currentTask.taskDescription || 'RECONSTRUCT THE SENTENCES' }}</h3>

          <!-- Картинка -->
          <div v-if="currentTask.taskPicture" class="evidence-photo">
            <img :src="currentTask.taskPicture" class="case-img">
          </div>
          <h3 class="case-text" v-if="currentQuestion.text">{{ currentQuestion.text }}</h3>

          <!-- Типы предложений -->
          <div class="sentence-types">
            <button
              v-for="(type, index) in sentenceTypes"
              :key="index"
              @click="setActiveType(type)"
              :class="{ 'active': activeType === type }"
              class="type-tab"
            >
              {{ typeLabels[type] }}
            </button>
          </div>

          <!-- Контейнер для предложений -->
          <div class="sentence-container">
            <div
              v-for="(sentence, sIndex) in currentSentences"
              :key="sIndex"
              class="sentence-row"
              :class="{ 'correct': sentence.isCorrect }"
            >
              <div class="sentence-label">{{ getTypeLabel(sentence.type) }}:</div>
              <div
                class="word-bank"
                @dragover.prevent="handleDragOver($event, sIndex)"
                @drop="handleDrop($event, sIndex)"
                @touchmove.prevent
              >
                <div
                  v-for="(word, wIndex) in sentence.words"
                  :key="wIndex"
                  class="word-tag"
                  draggable="true"
                  @dragstart="handleDragStart($event, sIndex, wIndex)"
                  @dragend="handleDragEnd"
                  @touchstart="handleTouchStart($event, sIndex, wIndex)"
                  @touchend="handleTouchEnd($event, sIndex)"
                  @touchmove="handleTouchMove"
                >
                  {{ word }}
                </div>
              </div>
            </div>
          </div>

          <!-- Кнопки управления -->
          <div class="case-controls">
            <button
              @click="checkSentences"
              class="detective-button verify-btn"
            >
              is this correct?
            </button>
            <button
              v-if="!isLastQuestion"
              @click="nextQuestion"
              class="detective-button next-btn"
              :disabled="!allSentencesCorrect"
            >
              Super ! NEXT
            </button>
            <button
              v-if="isLastQuestion"
              @click="showFinalResults"
              class="detective-button finish-btn"
              :disabled="!allSentencesCorrect"
            >
              SUBMIT CASE
            </button>
          </div>

        </div>
      </div>
    </template>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import pnqwData from '../dataForGames/pnqw' // Импортируем данные

const route = useRoute()

// ========== STATE ==========
const loading = ref(true)
const exerciseData = ref(null)
const currentSentences = ref([])
const currentQuestionIndex = ref(0)
const showResults = ref(false)
const correctSentences = ref(0)
const totalAttempts = ref(0)
const activeType = ref('all')

// Drag and drop state
const touchStartX = ref(0)
const touchStartY = ref(0)
const draggedElement = ref(null)
const draggedElementIndex = ref(-1)
const draggedSentenceIndex = ref(-1)

// ========== CONSTANTS ==========
const sentenceTypes = ['positive', 'negative', 'question', 'openQuestion']
const typeLabels = {
  positive: '(+) УТВЕРЖДЕНИЕ',
  negative: '(-) ОТРИЦАНИЕ',
  question: '(?) ВОПРОС на который ответ ДА или НЕТ',
  openQuestion: '(o?) Дополнительный вопрос',
  all: 'All Types'
}


// ========== COMPUTED ==========

const allSentencesCorrect = computed(() => {
  return currentSentences.value.length > 0 &&
    currentSentences.value.every(s => s.isCorrect)
})
const currentTask = computed(() => {
  return exerciseData.value?.tasks?.[0] || {}
})

const currentQuestion = computed(() => {
  return currentTask.value.questions?.[currentQuestionIndex.value] || {}
})

const totalQuestions = computed(() => {
  return currentTask.value.questions?.length || 0
})

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === totalQuestions.value - 1
})

const successRate = computed(() => {
  return totalQuestions.value ? Math.round((correctSentences.value / totalQuestions.value) * 100) : 0
})
const currentMission = computed(() => {
  const missionName = route.params.missionName
  return pnqwData[missionName] || {}
})

const mainDescription = computed(() => {
  return currentMission.value.mainDescription || 'VERY SECRET MISSION'
})

// ========== LIFECYCLE ==========
onMounted(() => {
  const missionName = route.params.missionName
  exerciseData.value = pnqwData[missionName] || null

  if (exerciseData.value) {
    updateSentences()
    loading.value = false
  } else {
    loading.value = false
    console.error('Game data not loaded!')
  }
})

// ========== DATA METHODS ==========
const updateSentences = () => {
  const sentences = []
  const question = currentQuestion.value

  if (!question) return

  const addSentence = (type, statement) => {
    if (statement) {
      const words = splitSentence(statement)
      sentences.push({
        type,
        original: statement,
        normalizedOriginal: words.join(' '),
        words: shuffleArray(words),
        isCorrect: false
      })
    }
  }

  if (activeType.value === 'all' || activeType.value === 'positive') {
    addSentence('positive', question.positiveStatement)
  }

  if (activeType.value === 'all' || activeType.value === 'negative') {
    addSentence('negative', question.negativeStatement)
  }

  if (activeType.value === 'all' || activeType.value === 'question') {
    addSentence('question', question.questionStatement)
  }

  if (activeType.value === 'all' || activeType.value === 'openQuestion') {
    addSentence('openQuestion', question.openQuestionStatement)
  }

  currentSentences.value = sentences
}

// ========== UI METHODS ==========
const setActiveType = (type) => {
  activeType.value = type
  updateSentences()
}

const nextQuestion = () => {
  currentQuestionIndex.value++
  activeType.value = 'all'
  updateSentences()
}

const resetTest = () => {
  currentQuestionIndex.value = 0
  showResults.value = false
  correctSentences.value = 0
  totalAttempts.value = 0
  activeType.value = 'all'
  updateSentences()
}

const checkSentences = () => {
  let correctCount = 0
  let hasIncorrect = false

  currentSentences.value.forEach(sentence => {
    const userSentence = sentence.words.join(' ')
    sentence.isCorrect = userSentence === sentence.normalizedOriginal

    if (sentence.isCorrect) {
      correctCount++
    } else {
      hasIncorrect = true
    }
  })

  totalAttempts.value++

  if (hasIncorrect) {
    document.querySelectorAll('.sentence-row').forEach(row => {
      if (!row.classList.contains('correct')) {
        const startPulse = () => {
          row.classList.add('incorrect-pulse')
          setTimeout(() => {
            row.classList.remove('incorrect-pulse')
            setTimeout(() => {
              row.classList.add('incorrect-pulse')
              setTimeout(() => {
                row.classList.remove('incorrect-pulse')
                setTimeout(() => {
                  row.classList.add('incorrect-pulse')
                  setTimeout(() => row.classList.remove('incorrect-pulse'), 100)
                }, 300)
              }, 300)
            }, 300)
          }, 300)
        }
        startPulse()
      }
    })
  }

  if (correctCount === currentSentences.value.length) {
    correctSentences.value++
  }
}

const showFinalResults = () => {
  showResults.value = true
}

// ========== DRAG AND DROP ==========
const handleDragStart = (event, sentenceIndex, wordIndex) => {
  event.dataTransfer.setData('text/plain', JSON.stringify({
    sentenceIndex,
    wordIndex
  }))
  event.target.classList.add('dragging')
}

const handleDragOver = (event) => {
  event.preventDefault()
}

const handleDrop = (event, targetSentenceIndex) => {
  event.preventDefault()
  const data = JSON.parse(event.dataTransfer.getData('text/plain'))
  moveWord(data.sentenceIndex, data.wordIndex, targetSentenceIndex, event)
}

const handleDragEnd = (event) => {
  event.target.classList.remove('dragging')
}

const handleTouchStart = (event, sentenceIndex, wordIndex) => {
  const touch = event.touches[0]
  touchStartX.value = touch.clientX
  touchStartY.value = touch.clientY
  draggedElement.value = event.target
  draggedElementIndex.value = wordIndex
  draggedSentenceIndex.value = sentenceIndex
  draggedElement.value.classList.add('dragging')
}

const handleTouchMove = (event) => {
  if (!draggedElement.value) return
  event.preventDefault()
  const touch = event.touches[0]
  const x = touch.clientX
  const y = touch.clientY

  draggedElement.value.style.transform = `translate(${x - touchStartX.value}px, ${y - touchStartY.value}px)`
}

const handleTouchEnd = (event, targetSentenceIndex) => {
  if (!draggedElement.value) return

  draggedElement.value.classList.remove('dragging')
  draggedElement.value.style.transform = ''

  if (draggedSentenceIndex.value === targetSentenceIndex) {
    const dropEvent = {
      clientX: event.changedTouches[0].clientX,
      currentTarget: event.currentTarget
    }
    moveWord(draggedSentenceIndex.value, draggedElementIndex.value, targetSentenceIndex, dropEvent)
  }

  draggedElement.value = null
}

const moveWord = (sourceSentenceIndex, sourceWordIndex, targetSentenceIndex, event) => {
  if (sourceSentenceIndex !== targetSentenceIndex) return

  const sentences = [...currentSentences.value]
  const words = [...sentences[targetSentenceIndex].words]
  const [removed] = words.splice(sourceWordIndex, 1)

  let insertIndex = words.length

  const wordBank = event.currentTarget
  const wordElements = Array.from(wordBank.querySelectorAll('.word-tag'))

  let closestElement = null
  let minDistance = Infinity
  const dropX = event.clientX || event.changedTouches?.[0]?.clientX
  const dropY = event.clientY || event.changedTouches?.[0]?.clientY

  wordElements.forEach(el => {
    if (el.classList.contains('dragging')) return

    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distance = Math.sqrt(Math.pow(dropX - centerX, 2) + Math.pow(dropY - centerY, 2))

    if (distance < minDistance) {
      minDistance = distance
      closestElement = el
    }
  })

  if (closestElement) {
    const closestIndex = wordElements.indexOf(closestElement)
    const closestRect = closestElement.getBoundingClientRect()
    insertIndex = dropX < closestRect.left + closestRect.width / 2 ? closestIndex : closestIndex + 1
    insertIndex = Math.min(insertIndex, words.length)
  }

  words.splice(insertIndex, 0, removed)
  sentences[targetSentenceIndex].words = words
  currentSentences.value = sentences
}

// ========== UTILITIES ==========
const parseUsefulWords = (wordsString) => {
  if (!wordsString) return []
  return wordsString.split(',').map(pair => {
    const [english, russian] = pair.split('-').map(s => s.trim())
    return { english, russian }
  })
}

const splitSentence = (sentence) => {
  return sentence.match(/(\w+['`]\w+|\w+-\w+|\w+|[.,!?])/g) || []
}

const shuffleArray = (array) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

const getTypeLabel = (type) => {
  return typeLabels[type] || type
}
</script>
<style scoped>
/* Основные стили */
.detective-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #1a1a1a;
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
  border: 1px solid #3a3a3a;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  background-image: url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L100 100 M100 0 L0 100" stroke="rgba(80,80,80,0.1)" stroke-width="1"/></svg>');
}

/* Состояние загрузки */
.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: #d4af37;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  border-top-color: #d4af37;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.2rem;
  letter-spacing: 2px;
  text-transform: uppercase;
}


.error-screen {
  text-align: center;
  padding: 40px;
  color: #e0e0e0;
}

.error-screen p {
  margin: 20px 0;
  color: #a0a0a0;
}

/* Основные стили */
.detective-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #1a1a1a;
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
  border: 1px solid #3a3a3a;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  background-image: url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L100 100 M100 0 L0 100" stroke="rgba(80,80,80,0.1)" stroke-width="1"/></svg>');
}

/* Экраны */
.results-screen {
  text-align: center;
  padding: 30px;
  background-color: #2a2a2a;
  border: 1px solid #4a4a4a;
  border-radius: 5px;
  margin-top: 20px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
}

/* Текст */
.secret-text {
  font-size: 2rem;
  color: #d4af37;
  text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
  letter-spacing: 2px;
  margin-bottom: 20px;
  font-weight: normal;
  text-transform: uppercase;
}

.case-description {
  color: #a0a0a0;
  font-size: 0.9rem;
  margin-top: 5px;
  letter-spacing: 1px;
}

/* Статистика */
.results-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 30px 0;
}

.stat {
  padding: 20px;
  border-radius: 5px;
  min-width: 120px;
  background-color: #2a2a2a;
  border: 1px solid #4a4a4a;
}

.correct-stat {
  border-color: #4caf50;
}

.attempts-stat {
  border-color: #ff9800;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  line-height: 1;
  color: #ffffff;
}

.correct-stat .stat-value {
  color: #4caf50;
}

.attempts-stat .stat-value {
  color: #ff9800;
}

.stat-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
  margin-top: 5px;
}

.success-rate {
  font-size: 1.1rem;
  margin: 25px 0;
  color: #e0e0e0;
}

.rate-value {
  color: #d4af37;
  font-weight: bold;
}

/* Кнопки */
.detective-button {
  padding: 10px 20px;
  background-color: #333;
  color: #d4af37;
  border: 1px solid #d4af37;
  border-radius: 3px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
  font-family: 'Courier New', monospace;
  margin: 5px;
}

.detective-button:hover {
  background-color: #d4af37;
  color: #1a1a1a;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
}

.restart-btn {
  background-color: #d4af37;
  color: #1a1a1a;
  border: none;
  padding: 12px 30px;
  font-size: 1rem;
  margin-top: 20px;
}

.restart-btn:hover {
  background-color: #e6c362;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.7);
}

/* Заголовок */
.case-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #3a3a3a;
}

/* Полезные слова */
.evidence-note {
  margin-bottom: 25px;
  padding: 15px;
  background-color: #2a2a2a;
  border: 1px solid #4a4a4a;
  border-radius: 5px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
}

.note-header {
  color: #d4af37;
  font-size: 0.8rem;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #4a4a4a;
  padding-bottom: 5px;
}

.word-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}

.word-pair {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  background-color: #333;
  border-radius: 3px;
  font-size: 0.9rem;
}

.evidence-word {
  color: #d4af37;
  font-style: italic;
}

.evidence-separator {
  margin: 0 8px;
  color: #a0a0a0;
}

.evidence-translation {
  color: #e0e0e0;
}

/* Карточка задания */
.case-file {
  position: relative;
  margin-top: 20px;
  padding: 20px 5px;
  background-color: #2a2a2a;
  border: 1px solid #4a4a4a;
  border-radius: 5px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
}

.case-number {
  position: absolute;
  top: -12px;
  left: 20px;
  width: auto;
  min-width: 40px;
  padding: 0 10px;
  height: 25px;
  background-color: #d4af37;
  color: #1a1a1a;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
}

.case-title, .case-text {
  color: #d4af37;
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #4a4a4a;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.case-text {
color: #00ffaa;

}
/* Картинка */
.evidence-photo {
  margin: 15px 0;
  text-align: center;
}

.case-img {
  max-width: 100%;
  border: 1px solid #4a4a4a;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 3px;
}

/* Типы предложений */
.sentence-types {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 15px 0;
  display: none;
}

.type-tab {
  padding: 5px 10px;
  background-color: #333;
  color: #a0a0a0;
  border: 1px solid #4a4a4a;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.type-tab:hover {
  background-color: #444;
  color: #e0e0e0;
}

.type-tab.active {
  background-color: #d4af37;
  color: #1a1a1a;
  border-color: #d4af37;
  font-weight: bold;
}

/* Контейнер предложений */
.sentence-container {
  margin: 20px 0;
}

.sentence-row {
  margin-bottom: 15px;
  padding: 2px;
  background-color: #333;
  border-radius: 3px;
  border-left: 3px solid #4a4a4a;
  transition: all 0.3s;
}

/* Анимация только для неправильных ответов */
.sentence-row:not(.correct).incorrect-pulse {
  animation: pulse-red 0.4s ease-in-out;
}

.sentence-row.correct {
  border-left-color: #4caf50 !important;
  background-color: rgba(76, 175, 80, 0.1) !important;
  animation: none !important;
}
@keyframes pulse-red {
  0% { border-left-color: #4a4a4a; }
  50% { border-left-color: #ff5252; }
  100% { border-left-color: #4a4a4a; }
}

.sentence-row.incorrect-pulse {
  animation: pulse-red 0.5s ease-in-out;
  background-color: rgba(255, 82, 82, 0.1);
}
.sentence-label {
  color: #a0a0a0;
  font-size: 0.8rem;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;

}

.word-bank {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  min-height: 40px;
  padding: 5px;
  background-color: #2a2a2a;
  border-radius: 3px;
}


.word-tag {
  padding: 6px 7px;
  background-color: #444;
  color: #e0e0e0;
  border-radius: 4px;
  cursor: grab;
  user-select: none;
  transition: transform 0.1s, box-shadow 0.1s;
  touch-action: none;
  font-size: 18px;

}

.word-tag.dragging {
  opacity: 0.8;
  background-color: #d4af37;
  color: #1a1a1a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  cursor: grabbing;
  transform: scale(1.05);
  z-index: 1000;
  position: relative;
}

.word-bank {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  min-height: 50px;
  padding: 8px;
  background-color: #2a2a2a;
  border-radius: 4px;
  position: relative; /* Для позиционирования абсолютных элементов */
}

/* Для мобильных устройств */
@media (max-width: 768px) {
  .word-tag {
    padding: 7px 6px;
    font-size: 16px;
    touch-action: none; /* Отключаем стандартное поведение касания */
  }

  .word-bank {
    min-height: 60px;
  }
}

/* Управление */
.case-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #4a4a4a;
}

.verify-btn {
  background-color: #4a4a4a;
  color: #ffffff;
}

.next-btn {
  background-color: #333;
  color: #d4af37;
}

.finish-btn {
  background-color: #d4af37;
  color: #1a1a1a;
}

/* Адаптивность */
@media (max-width: 600px) {
  .results-stats {
    flex-direction: column;
    gap: 15px;
  }

  .sentence-types {
    flex-direction: column;
  }

  .case-controls {
    flex-direction: column;
  }

  .detective-button {
    width: 100%;
  }
}
/* Добавим стиль для неактивной кнопки */
.detective-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #333 !important;
  color: #666 !important;
  border-color: #4a4a4a !important;
  box-shadow: none !important;
}

</style>
