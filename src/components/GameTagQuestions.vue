<template>
  <div v-if="exerciseData" class="futuristic-container">
    <!-- Финальный экран -->
    <div v-if="showResults" class="results-screen">
      <h2 class="glowing-text">MISSION COMPLETE</h2>
      <div class="results-stats">
        <div class="stat correct-stat">
          <span class="stat-value">{{ correctQuestions }}</span>
          <span class="stat-label">CORRECT ANSWERS</span>
        </div>
<!--        <div class="stat incorrect-stat">-->
<!--          <span class="stat-value">{{ incorrectAttempts }}</span>-->
<!--          <span class="stat-label">INCORRECT ATTEMPTS</span>-->
<!--        </div>-->
        <div class="stat attempts-stat">
          <span class="stat-value">{{ totalAttempts }}</span>
          <span class="stat-label">TOTAL ATTEMPTS</span>
        </div>
      </div>
      <div class="success-rate">
        SUCCESS RATE: <span class="rate-value">{{ successRate }}%</span>
<!--        ({{ correctQuestions }} из {{ totalQuestions }})-->
      </div>
      <button @click="resetTest" class="cyber-button restart-btn">
        RESTART MISSION
      </button>
    </div>

    <!-- Основной экран -->
    <div v-else>
      <!-- Заголовок -->
      <div class="neon-header">
        <h2 class="glowing-text">{{ exerciseData.mainDescription }}</h2>
        <p class="cyber-description">training protocol - уточняющие вопросы</p>
      </div>

      <!-- Полезные слова -->
      <div v-if="exerciseData.tasks[0].usefulWords" class="data-chip">
        <div class="chip-header">hints = подсказки</div>
        <div class="word-grid">
          <div v-for="(pair, i) in parseUsefulWords(exerciseData.tasks[0].usefulWords)"
               :key="i" class="word-pair">
            <span class="cyber-word">{{ pair.english }}</span>
            <span class="cyber-separator">::</span>
            <span class="cyber-translation">{{ pair.russian }}</span>
          </div>
        </div>
      </div>

      <!-- Задание -->
      <div class="task-card">
        <div class="task-id">{{ currentQuestionIndex + 1 }}/{{ totalQuestions }}</div>
        <h3 class="cyber-title">{{ exerciseData.tasks[0].taskDescription }}</h3>

        <!-- Картинка -->
        <div v-if="exerciseData.tasks[0].taskPicture" class="media-frame">
          <img :src="exerciseData.tasks[0].taskPicture" class="holographic-img">
        </div>

        <!-- Вопрос -->
        <div class="question-input-container">
          <div class="question-text">{{ currentQuestion.text }}</div>
          <input
            ref="answerInput"
            v-model="userAnswer"
            class="cyber-input"
            :class="inputClass"
          />

          <!-- Результат проверки -->
          <div v-if="isAnswered" class="result-display">
            <span :class="resultClass">
              {{ isAnswerCorrect ? '✓ CORRECT' : '✗ INCORRECT можно либо исправить/ввести другой ответ или нажать next' }}
            </span>
          </div>

          <!-- Объяснение -->
          <div v-if="showExplanation && isAnswered" class="explanation-text">

            <div class="explanation-content">
              {{ currentQuestion.explanation }}
            </div>
            <div v-if="!isAnswerCorrect" class="correct-answer-text">
              Correct answer: <span class="answer-highlight">{{ currentQuestion.correctAnswer }}</span>
            </div>
          </div>
          <!-- Блок кнопок -->
          <div class="buttons-container">
            <button
              v-if="!isAnswered"
              @click="checkAnswer"
              class="cyber-button verify-btn"
              :class="{ 'warning': showWarning }"
              :disabled="showWarning"
            >
              {{ showWarning ? 'PLEASE хоть что-то впиши' : 'VERIFY' }}
            </button>
            <button
              v-if="isAnswered"
              @click="toggleExplanation"
              class="holographic-btn"
            >
              {{ showExplanation ? 'HIDE EXPLANATION' : 'PLEASE, EXPLAIN' }}
            </button>
            <button
              v-if="isAnswered && !isLastQuestion"
              @click="nextQuestion"
              class="cyber-button next-btn"
            >
              NEXT QUESTION
            </button>

            <button
              v-if="isAnswered && isLastQuestion"
              @click="showFinalResults"
              class="cyber-button finish-btn"
            >
              FINISH MISSION
            </button>


          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import NewFuturisticStyleData from '../dataForGames/NewFuturisticStyle.js'

const route = useRoute()
const exerciseData = ref(null)
const answerInput = ref(null)

// Состояние теста
const currentQuestionIndex = ref(0)
const userAnswer = ref('')
const isAnswered = ref(false)
const showExplanation = ref(false)
const showResults = ref(false)
const correctQuestions = ref(0)
const incorrectAttempts = ref(0)
const totalAttempts = ref(0)
const questionStats = ref([])
const attemptsPerQuestion = ref(0)
const lastAnswerSubmitted = ref('') // Последний отправленный ответ
// Добавляем новую реактивную переменную
const showWarning = ref(false)


// Инициализация
onMounted(() => {
  const missionName = route.params.missionName
  exerciseData.value = NewFuturisticStyleData[missionName] || null
  focusInput()

  // Добавляем обработчик клавиш
  window.addEventListener('keyup', handleKeyUp)
})

// Не забываем удалить обработчик при уничтожении компонента
onUnmounted(() => {
  window.removeEventListener('keyup', handleKeyUp)
})

// Фокусировка на поле ввода
const focusInput = () => {
  nextTick(() => {
    if (answerInput.value) {
      answerInput.value.focus()
    }
  })
}

// Вычисляемые свойства
const currentQuestion = computed(() => {
  return exerciseData.value?.tasks[0]?.questions[currentQuestionIndex.value] || {}
})

const totalQuestions = computed(() => {
  return exerciseData.value?.tasks[0]?.questions.length || 0
})

const inputClass = computed(() => {
  if (!isAnswered.value) return ''
  return isAnswerCorrect.value ? 'input-correct' : 'input-incorrect'
})

const resultClass = computed(() => {
  return isAnswerCorrect.value ? 'correct-answer' : 'incorrect-answer'
})

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === totalQuestions.value - 1
})

const successRate = computed(() => {
  return totalQuestions.value ? Math.round((correctQuestions.value / totalQuestions.value) * 100) : 0
})

// Парсинг полезных слов
const parseUsefulWords = (wordsString) => {
  if (!wordsString) return []
  return wordsString.split(',').map(pair => {
    const [english, russian] = pair.split('-').map(s => s.trim())
    return { english, russian }
  })
}

// Проверка текущего ответа (без сохранения в статистику)
const checkCurrentAnswer = () => {
  return isAnswerCloseEnough(userAnswer.value, currentQuestion.value.correctAnswer)
}
const isEnterLocked = ref(false)

// Проверка ответа

const checkAnswer = () => {
  if (isEnterLocked.value) return

  if (!userAnswer.value.trim()) {
    showWarning.value = true
    setTimeout(() => {
      showWarning.value = false
    }, 200)
    return
  }

  // Если ответ уже был проверен и не изменялся, не проверяем снова
  if (isAnswered.value && userAnswer.value === lastAnswerSubmitted.value) {
    return
  }

  // Если уже было 2 попытки для этого вопроса, не проверяем снова
  if (attemptsPerQuestion.value >= 2) {
    alert('You have used all attempts for this question')
    return
  }

  isAnswered.value = true
  attemptsPerQuestion.value++
  totalAttempts.value++
  lastAnswerSubmitted.value = userAnswer.value

  const isCorrect = checkCurrentAnswer()

  // Инициализируем статистику вопроса, если ее еще нет
  if (!questionStats.value[currentQuestionIndex.value]) {
    questionStats.value[currentQuestionIndex.value] = {
      wasCorrect: false,
      incorrectAttempts: 0
    }
  }

  if (isCorrect) {
    // Если это первый правильный ответ для вопроса
    if (!questionStats.value[currentQuestionIndex.value].wasCorrect) {
      questionStats.value[currentQuestionIndex.value].wasCorrect = true
      correctQuestions.value++
    }
  } else {
    // Увеличиваем счетчик неправильных попыток для этого вопроса
    questionStats.value[currentQuestionIndex.value].incorrectAttempts++
    incorrectAttempts.value++
  }

  // Блокируем Enter на 1 секунду
  isEnterLocked.value = true
  setTimeout(() => {
    isEnterLocked.value = false
  }, 1000)
}

// Обработчик нажатия клавиш
const handleKeyUp = (event) => {
  if (event.key === 'Enter') {
    if (!isAnswered.value) {
      checkAnswer()
    } else {
      // Если ответ уже проверен, нажатие Enter переходит к следующему вопросу
      if (!isEnterLocked.value) {
        if (!isLastQuestion.value) {
          nextQuestion()
        } else {
          showFinalResults()
        }
      }
    }
  }
}

const normalizeAnswer = (answer) => {
  if (!answer) return ''

  return answer
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/['’‘`"“”]/g, '')
    .replace(/[.,!?;:]$/g, '')
    .replace(/[-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const isTypoCloseEnough = (userWord, correctWord) => {
  // Строгие слова, где НЕ допускаются опечатки
  const strictWords = ['he', 'she', 'is', 'are', 'was', 'were', 'do', 'does', 'have', 'has', 'should', 'could', 'would'];

  // Если слово в списке строгих - проверяем точное совпадение
  if (strictWords.includes(correctWord.toLowerCase())) {
    return userWord.toLowerCase() === correctWord.toLowerCase();
  }

  // Для остальных слов - старая логика с допуском одной опечатки
  if (userWord.length === correctWord.length) {
    let diffCount = 0;
    for (let i = 0; i < userWord.length; i++) {
      if (userWord[i] !== correctWord[i]) {
        diffCount++;
        if (diffCount > 1) return false;
      }
    }
    return true;
  }

  if (Math.abs(userWord.length - correctWord.length) === 1) {
    const longer = userWord.length > correctWord.length ? userWord : correctWord
    const shorter = userWord.length > correctWord.length ? correctWord : userWord

    for (let i = 0, j = 0; i < longer.length; i++) {
      if (longer[i] === shorter[j]) {
        j++
      } else if (i !== j) {
        return false
      }
    }
    return true
  }

  return false
}

const isAnswerCloseEnough = (userAnswer, correctAnswer) => {
  const normalizedUser = normalizeAnswer(userAnswer)
  const normalizedCorrect = normalizeAnswer(correctAnswer)

  if (normalizedUser === normalizedCorrect) return true

  const userWords = normalizedUser.split(' ')
  const correctWords = normalizedCorrect.split(' ')

  if (userWords.length !== correctWords.length) return false

  for (let i = 0; i < correctWords.length; i++) {
    const userWord = userWords[i]
    const correctWord = correctWords[i]

    if (userWord === correctWord) continue
    if (!isTypoCloseEnough(userWord, correctWord)) {
      return false
    }
  }

  return true
}

// В computed свойствах
const isAnswerCorrect = computed(() => {
  return isAnswered.value ? checkCurrentAnswer() : false
})

// Следующий вопрос
const nextQuestion = () => {
  // Если ответ был изменен после последней проверки
  if (isAnswered.value && userAnswer.value !== lastAnswerSubmitted.value) {
    checkAnswer()
  }
  // Если ответ не проверен, но есть ввод
  else if (!isAnswered.value && userAnswer.value.trim()) {
    checkAnswer()
  }

  // Переходим к следующему вопросу
  currentQuestionIndex.value++
  userAnswer.value = ''
  isAnswered.value = false
  showExplanation.value = false
  attemptsPerQuestion.value = 0
  lastAnswerSubmitted.value = ''
  focusInput()
}

// Показать финальные результаты
const showFinalResults = () => {
  // Если ответ был изменен после последней проверки
  if (isAnswered.value && userAnswer.value !== lastAnswerSubmitted.value) {
    checkAnswer()
  }
  // Если ответ не проверен, но есть ввод
  else if (!isAnswered.value && userAnswer.value.trim()) {
    checkAnswer()
  }

  showResults.value = true
}

// Переключение объяснения
const toggleExplanation = () => {
  showExplanation.value = !showExplanation.value
}

// Сброс теста
const resetTest = () => {
  currentQuestionIndex.value = 0
  userAnswer.value = ''
  isAnswered.value = false
  showExplanation.value = false
  showResults.value = false
  correctQuestions.value = 0
  incorrectAttempts.value = 0
  totalAttempts.value = 0
  attemptsPerQuestion.value = 0
  lastAnswerSubmitted.value = ''
  questionStats.value = []
  focusInput()
}
</script>

<style scoped>
/* Основные стили */
.futuristic-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #0a0a12;
  color: #e0e0ff;
  font-family: 'Courier New', monospace;
  border: 1px solid #2a2a4a;
  box-shadow: 0 0 15px rgba(64, 224, 208, 0.3);
}

/* Экраны */
.results-screen {
  text-align: center;
  padding: 30px;
  background-color: #1a1a2a;
  border: 1px solid #3a5a7a;
  border-radius: 10px;
  margin-top: 20px;
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
  border-radius: 8px;
  min-width: 120px;
}

.correct-stat {
  background-color: rgba(0, 255, 170, 0.1);
  border: 1px solid #00ffaa;
}

.incorrect-stat {
  background-color: rgba(255, 85, 119, 0.1);
  border: 1px solid #ff5577;
}
.attempts-stat {
  background-color: rgba(147, 112, 219, 0.1);
  border: 1px solid #fd9e16;
}

.attempts-stat .stat-value {
  color: #fd9e16;
}
.stat-value {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1;
}

.correct-stat .stat-value {
  color: #00ffaa;
}

.incorrect-stat .stat-value {
  color: #ff5577;
}

.stat-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
}

.success-rate {
  font-size: 1.2rem;
  margin: 25px 0;
  color: #e0e0ff;
}

.rate-value {
  color: #40e0d0;
  font-weight: bold;
}

/* Кнопки */
.restart-btn {
  background-color: #9370db;
  padding: 12px 30px;
  font-size: 1.1rem;
  margin-top: 20px;
}

.restart-btn:hover {
  background-color: #a88beb;
}

.finish-btn {
  background-color: #9370db;
}

.finish-btn:hover {
  background-color: #a88beb;
}

/* Подсветка правильного ответа */
.answer-highlight {
  color: #00ffaa;
  font-weight: bold;
}


.futuristic-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #0a0a12;
  color: #e0e0ff;
  font-family: 'Courier New', monospace;
  border: 1px solid #2a2a4a;
  box-shadow: 0 0 15px rgba(64, 224, 208, 0.3);
}

.neon-header {
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #3a3a5a;
}

.glowing-text {
  font-size: 2.2rem;
  color: #40e0d0;
  text-shadow: 0 0 10px #40e0d0, 0 0 20px #40e0d0;
  letter-spacing: 2px;
}

/* Карточка задания */
.task-card {
  position: relative;
  margin-top: 20px;
  padding: 20px;
  background-color: #1a1a2a;
  border: 1px solid #3a5a7a;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(64, 224, 208, 0.1);
}

.task-id {
  position: absolute;
  top: -15px;
  left: 20px;
  width: auto;
  min-width: 50px;
  padding: 0 10px;
  height: 30px;
  background-color: #40e0d0;
  color: #0a0a12;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
}

.cyber-title {
  color: #7fffd4;
  font-size: 1.3rem;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #3a5a7a;
}

/* Контейнер вопроса */
.question-input-container {
  margin: 0;
  padding: 10px;
  background-color: #2a2a3a;
  border-radius: 5px;
}

.question-text {
  font-size: 1.2rem;
  color: #e0e0ff;
  line-height: 1.4;
}

/* Поле ввода */
.cyber-input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  background-color: #0a0a1a;
  border: 1px solid #3a5a7a;
  color: #7fffd4;
  font-family: 'Courier New', monospace;
  font-size: 20px;
  border-radius: 4px;
  transition: all 0.3s;
}

.cyber-input:focus {
  outline: none;
  border-color: #40e0d0;
  box-shadow: 0 0 10px rgba(64, 224, 208, 0.3);
}

.input-correct {
  border-color: #00ffaa;
  box-shadow: 0 0 5px #00ffaa;
}

.input-incorrect {
  border-color: #ff5577;
  box-shadow: 0 0 5px #ff5577;
}

/* Блок кнопок */
.buttons-container {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  justify-content: center;
  flex-direction: column;


}

/* Кнопки */
.cyber-button {
  padding: 10px 20px;
  background-color: #40e0d0;
  color: #0a0a12;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

.cyber-button:hover {
  background-color: #7fffd4;
  box-shadow: 0 0 10px rgba(64, 224, 208, 0.5);
}

.verify-btn {
  background-color: #40e0d0;
}

.next-btn {
  background-color: #9370db;
}

.next-btn:hover {
  background-color: #a88beb;
  box-shadow: 0 0 10px rgba(147, 112, 219, 0.5);
}

.holographic-btn {
  padding: 5px;
  background-color: transparent;
  border: 1px solid #9370db;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.2rem;
  border-radius: 4px;
}

.holographic-btn:hover {
  background-color: rgba(147, 112, 219, 0.1);
  box-shadow: 0 0 10px rgba(147, 112, 219, 0.3);
}

/* Результаты */
.result-display {
text-align: center;
  background-color: rgba(20, 20, 30, 0.7);
  border-radius: 5px;
}

.correct-answer {
  color: #00ffaa;
  font-weight: bold;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 10px;
}

.incorrect-answer {
  color: #ff5577;
  font-weight: bold;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 10px;
  line-height: 18px;
}

.correct-answer-text {
  color: #7fffd4;
  font-size: 0.95rem;
  display: block;
  margin-top: 5px;
}

/* Объяснение */
.explanation-text {

  padding: 15px;
  background-color: rgba(64, 224, 208, 0.1);
  border-left: 3px solid #40e0d0;
  color: #e0e0ff;
  font-size: 0.95rem;
  line-height: 1.5;
  border-radius: 0 5px 5px 0;
}

/* Полезные слова */
.data-chip {
  margin-bottom: 25px;
  padding: 15px;
  background-color: #1a1a2a;
  border: 1px solid #3a5a7a;
  border-radius: 5px;
}

.chip-header {
  color: #9370db;
  font-size: 0.9rem;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
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
  background-color: #2a2a3a;
  border-radius: 4px;
}

.cyber-word {
  color: #40e0d0;
  font-style: italic;
}

.cyber-separator {
  margin: 0 8px;
  color: #9370db;
}

.cyber-translation {
  color: #e0e0ff;
}

/* Медиа элементы */
.media-frame {
  margin: 15px 0;
  text-align: center;
}

.holographic-img {
  max-width: 100%;
  border: 1px solid #3a5a7a;
  box-shadow: 0 0 15px rgba(64, 224, 208, 0.2);
  border-radius: 5px;
}
.cyber-button.warning {
  background: linear-gradient(45deg, #ff4500, #ff8c00, #ff4500);
  color: #0a0a12 !important;
  text-shadow: 0 0 5px white;
  border: 1px solid #ff0000;
  animation:
    pulse-warning 0.5s infinite alternate,
    shake 0.5s ease-in-out;
}

@keyframes pulse-warning {
  from { box-shadow: 0 0 5px #ff4500, 0 0 10px #ff8c00; }
  to { box-shadow: 0 0 15px #ff4500, 0 0 30px #ff8c00, 0 0 45px #ff8c00; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}
/* Адаптивность */
@media (max-width: 600px) {
  .buttons-container {
    flex-direction: column;
  }

  .cyber-button, .holographic-btn {
    width: 100%;
  }
}
</style>
