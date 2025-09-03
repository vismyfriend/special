<template>
  <div class="relative">
    <div class="phone-content">
      <div id="phoneFrame">
        <!-- Выбор уровней -->
        <div class="level-selection">
          <h3 class="special-font">Случайный вопрос :</h3>
          <div class="level-checkboxes">
            <label v-for="level in availableLevels" :key="level" class="checkbox-label">
              <input
                type="checkbox"
                :value="level"
                v-model="selectedLevels"
                @change="updateQuestions"
              >
              <span class="checkmark"></span>
              {{ level }}
            </label>
          </div>
        </div>



        <!-- Слайдер с карточками вопросов -->
        <div class="question-randomizer">
          <div class="slider-container">
            <button class="slider-arrow slider-arrow-left" @click="prevQuestion">
              <i class="fas fa-chevron-left special-font"> < < </i>
            </button>

            <div class="slider-track" ref="sliderTrack">
              <div
                v-for="(question, index) in filteredQuestions"
                :key="question.id"
                class="question-card"
                :class="{ 'active': currentIndex === index }"
              >
                <div class="card-content">
                  <div class="question-text">
                    <div class="eng">{{ question.eng }}</div>
                    <div
                      class="ru"
                      :class="{ 'blurred': !question.showTranslation }"
                      @click="toggleTranslation(question)"
                    >
                      {{ question.ru }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button class="slider-arrow slider-arrow-right" @click="nextQuestion">
              <i class="fas fa-chevron-right special-font"> >  > </i>
            </button>
          </div>

          <!-- Информация о количестве вопросов -->
          <div class="questions-info">
            Практикуйте разговор - отвечайте полным ответом, а не одним словом.
          </div>

          <!-- Кнопка таймера -->
          <button
            class="timer-btn"
            @click="toggleTimer"
            :disabled="filteredQuestions.length === 0"
            :class="{ 'timer-active': timerActive }"
          >
            <i class="fas" :class="timerActive ? 'fa-stop' : 'fa-play'"></i>
            {{ timerActive ? 'Остановить таймер' : 'Включить таймер' }}
          </button>

          <!-- Таймер -->
          <div v-if="timerActive" class="timer-display">
            <div class="timer-circle">
              <div class="timer-text">{{ timerCount }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import randomQuestionsData from '../dataForGames/random-questions-data'

const availableLevels = ref(['levelA', 'levelB', 'levelC'])
const selectedLevels = ref(['levelA', 'levelB', 'levelC'])
const timerActive = ref(false)
const timerCount = ref(60)
const timerInterval = ref(null)

// Таймер функций
const startTimer = () => {
  timerActive.value = true
  timerCount.value = 60
  timerInterval.value = setInterval(() => {
    timerCount.value--
    if (timerCount.value <= 0) {
      stopTimer()
    }
  }, 1000)
}

const stopTimer = () => {
  timerActive.value = false
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

const toggleTimer = () => {
  if (timerActive.value) {
    stopTimer()
  } else {
    startTimer()
  }
}

// Очистка таймера при размонтировании компонента
onUnmounted(() => {
  stopTimer()
})

// Собираем все вопросы в один массив с указанием уровня
const allQuestions = computed(() => {
  const questions = []
  availableLevels.value.forEach(level => {
    if (randomQuestionsData[level]) {
      randomQuestionsData[level].forEach(q => {
        questions.push({
          ...q,
          level: level.replace('level', ''),
          showTranslation: false
        })
      })
    }
  })
  return questions
})

// Фильтруем вопросы по выбранным уровням
const filteredQuestions = computed(() => {
  if (selectedLevels.value.length === 0) return []

  return allQuestions.value.filter(question =>
    selectedLevels.value.some(level => question.level === level.replace('level', ''))
  )
})

const questions = ref([])
const currentIndex = ref(0)
const sliderTrack = ref(null)

// Функция для перемешивания вопросов (исправленная)
const shuffleQuestions = (array) => {
  if (!array || array.length === 0) return []

  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Сбрасываем показ переводов при перемешивании
  shuffled.forEach(q => {
    q.showTranslation = false
  })

  return shuffled
}

// Переключение видимости перевода
const toggleTranslation = (question) => {
  question.showTranslation = !question.showTranslation
}

// Обновляем вопросы при изменении выбора уровней
const updateQuestions = () => {
  if (filteredQuestions.value.length > 0) {
    questions.value = shuffleQuestions(filteredQuestions.value)
    currentIndex.value = 0
    updateSliderPosition()
  } else {
    questions.value = []
    currentIndex.value = 0
  }
}

// Навигация по вопросам с бесконечной прокруткой
const nextQuestion = () => {
  if (questions.value.length === 0) return

  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  } else {
    // Бесконечная прокрутка - возвращаемся к первому вопросу
    currentIndex.value = 0
  }
  updateSliderPosition()
}

const prevQuestion = () => {
  if (questions.value.length === 0) return

  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    // Бесконечная прокрутка - переходим к последнему вопросу
    currentIndex.value = questions.value.length - 1
  }
  updateSliderPosition()
}

// Обновление позиции слайдера
const updateSliderPosition = () => {
  if (sliderTrack.value && questions.value.length > 0) {
    const cardWidth = sliderTrack.value.querySelector('.question-card').offsetWidth
    sliderTrack.value.style.transform = `translateX(-${currentIndex.value * cardWidth}px)`
  }
}

// Обработчики для свайпа на мобильных устройствах
let touchStartX = 0
let touchEndX = 0

const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX
}

const handleTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].clientX
  handleSwipe()
}

const handleSwipe = () => {
  const diff = touchStartX - touchEndX
  const swipeThreshold = 50

  if (diff > swipeThreshold) {
    nextQuestion()
  } else if (diff < -swipeThreshold) {
    prevQuestion()
  }
}

// Инициализация
onMounted(() => {
  // Добавляем обработчики для свайпа
  if (sliderTrack.value) {
    sliderTrack.value.addEventListener('touchstart', handleTouchStart)
    sliderTrack.value.addEventListener('touchend', handleTouchEnd)
  }

  // Инициализируем вопросы с перемешиванием при загрузке
  updateQuestions()
})

// Следим за изменениями filteredQuestions и автоматически перемешиваем
watch(filteredQuestions, () => {
  updateQuestions()
}, { immediate: true })

// Также перемешиваем при изменении selectedLevels
watch(selectedLevels, () => {
  updateQuestions()
})
</script>

<style lang="scss" scoped>
.level-selection {
  padding: 20px;
  text-align: center;

  h3 {
    color: #d6d6d6;
    margin-bottom: 15px;
    font-size: 1.2rem;
  }
}

.level-checkboxes {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: none;
  font-weight: 500;
  color: #555;

  input[type="checkbox"] {
    display: none;

    &:checked + .checkmark {
      background: #667eea;
      border-color: #667eea;

      &::after {
        content: '✓';
        color: white;
        font-size: 12px;
      }
    }
  }

  .checkmark {
    width: 20px;
    height: 20px;
    border: 2px solid #ddd;
    border-radius: 4px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  &:hover .checkmark {
    border-color: #667eea;
  }
}

.timer-display {
  display: flex;
  justify-content: center;
  margin: 5px 0;
}

.timer-circle {
  width: 55px;
  height: 55px;
  border-radius: 35%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.timer-text {
  font-family: monospace;
}

.questions-info {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    color: #e8e8e8;
  }
}

.timer-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  margin-top: 15px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.timer-active {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  }
}

/* Остальные стили остаются такими же, как в вашем предыдущем коде */
.ru.blurred {
  filter: blur(5px);
  cursor: none;
  transition: filter 0.3s ease;
  user-select: none;

  &:hover {
    filter: blur(0);
  }
}

.ru:not(.blurred) {
  filter: none;
  cursor: none;
}

#phoneFrame {
  position: relative;
  height: 655px;
  width: 310px;
  background: linear-gradient(to top, #fff -250%, #000000 150%);
  margin: 5px auto;
  border-radius: 2em;
  border: solid 5px #6a6a6a;
  box-shadow:
    inset 0 0 2px 7px #000,
    inset 0 0 3px 7px #000,
    0 150px 200px -80px #000;


  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: gray;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: darkgray;
  }
}

.question-randomizer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.slider-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
  overflow: hidden;
}

.slider-track {
  display: flex;
  transition: transform 0.3s ease;
  will-change: transform;
}

.question-card {
  flex: 0 0 100%;
  min-width: 100%;
  height: 300px;
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;

  &.active {
    border-color: #667eea;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
  }
}

.card-content {
  text-align: center;
}

.question-text {
  .eng {
    font-size: 1.8rem;

    color: #333;
    margin-bottom: 15px;
    line-height: 25px;
  }

  .ru {
    font-size: 1.1rem;
    color: #666;
    font-style: italic;
    line-height: 21px;
    margin-bottom: 15px;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 2px solid #667eea;
  color: #667eea;
  font-size: 16px;
  cursor: none;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-50%) scale(1.1);
  }

  &.slider-arrow-left {
    left: -20px;
  }

  &.slider-arrow-right {
    right: -20px;
  }
}

.special-font {
  font-family: Special_f1;
}

// Адаптивность
@media (max-width: 480px) {
  .level-checkboxes {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .slider-container {
    max-width: 300px;
  }

  .question-card {
    padding: 20px;
  }

  .question-text {
    .eng {
      font-size: 1.2rem;
    }

    .ru {
      font-size: 1rem;
      min-height: 50px;
    }
  }

  .slider-arrow {
    width: 35px;
    height: 35px;
    font-size: 14px;

    &.slider-arrow-left {
      left: -15px;
    }

    &.slider-arrow-right {
      right: -15px;
    }
  }

  .timer-circle {
    width: 60px;
    height: 60px;
    font-size: 1.2rem;
  }
}
</style>
