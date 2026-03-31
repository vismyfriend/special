<template>
  <!-- Добавляем состояние загрузки -->
  <div v-if="isLoading" class="loading-screen">
    <div class="loader"></div>
    <p>🔐 Загрузка тренировочных данных...</p>
  </div>
  <div class="game-container" v-if="gameWords.length">
    <!-- Модалка с результатами -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>🎉 Поздравляем! 🎉</h3>
        <p>Вы прошли все фразы!</p>

        <div class="statistics">
          <div class="stat-item">
            <strong>Всего фраз:</strong> {{ totalWordsCount }}
          </div>
          <div class="stat-item">
            <strong>Средний балл:</strong> {{ averageScore }}%
          </div>
          <div class="stat-item">
            <strong>Лучший результат:</strong> {{ bestScore }}%
          </div>

          <div class="word-stats">
            <div class="stat-title">📊 Подробные результаты по фразам:</div>
            <div v-for="(stat, idx) in wordStatistics" :key="idx" class="word-stat-item">
              <div class="word-stat-header">
                <div class="word-stat-phrase">{{ stat.phrase }}</div>
                <div class="word-stat-best">Лучший: {{ stat.bestScore }}%</div>
              </div>
              <div class="word-stat-attempts">
                <div class="attempts-title">Все попытки ({{ stat.attempts.length }}):</div>
                <div v-for="(attempt, attemptIdx) in stat.attempts" :key="attemptIdx" class="attempt-item">
                  <div class="attempt-score" :class="getScoreClass(attempt.score)">
                    {{ attempt.score }}%
                  </div>
                  <div class="attempt-text">{{ attempt.userText }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button @click="restartGame">Играть снова</button>
        <button @click="closeModal" class="close-btn">Закрыть</button>
      </div>
    </div>
    <!-- Индикатор прогресса -->
    <div class="progress-indicator q-mb-md">
      <div class="progress-stats">
        <span>Прогресс: {{ completedWordsCount }} / {{ gameWords.length }}</span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: (completedWordsCount / gameWords.length * 100) + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="game-content-wrapper">


      <!-- Кнопка назад - всегда активна -->
      <button class="nav-button prev-button" @click="goToPreviousWord">
        ‹
      </button>

      <!-- Центральный блок с карточкой -->
      <div class="main-content">
        <!-- Карточка с фразой -->
        <div class="word-card">
          <div class="word-counter">{{ currentIndex + 1 }} / {{ gameWords.length }}</div>
          <div class="word" ref="wordText">{{ currentWord.ru }}</div>

          <!-- Произношение (blurred) с возможностью снять blur -->
          <div
            v-if="currentWord.pronunciation"
            class="pronunciation-hint"
            :class="{ 'blurred': isPronunciationBlurred }"
            @click="isPronunciationBlurred = false"
          >
            {{ currentWord.pronunciation }}
            <span v-if="isPronunciationBlurred" class="hint-click">(нажми, чтобы увидеть)</span>
          </div>

          <!-- Что сказал пользователь -->
          <div v-if="currentAttempt" class="user-phrase-display">
            <div class="caption-label">Вы сказали:</div>
            <div class="user-phrase-text">
              <template v-for="(word, wordIdx) in currentAttempt.detailedWords" :key="wordIdx">
                <span class="user-word">
                  <span
                    v-for="(char, charIdx) in word.userChars"
                    :key="charIdx"
                    :class="{'error-char': word.errors && word.errors.includes(charIdx)}"
                    class="user-char"
                  >
                    {{ charIdx === 0 && wordIdx === 0 ? capitalizeFirstLetter(char) : char }}
                  </span>
                </span>
                <span v-if="wordIdx < currentAttempt.detailedWords.length - 1" class="user-space"> </span>
              </template>
            </div>
            <div v-if="currentAttempt.score > 0" class="score-badge" :class="getScoreClass(currentAttempt.score)">
              Оценка: {{ currentAttempt.score }}%
            </div>
            <div class="target-phrase-display">
              <div class="caption-label">Нужно было сказать:</div>
              <div class="target-phrase-text">{{ currentWord.eng }}</div>
            </div>
          </div>

          <!-- Если нет попыток -->
          <div v-else class="no-attempt-message">
            <div class="caption-label">🎤 Нажмите на микрофон, чтобы произнести фразу</div>
          </div>
        </div>

        <!-- Кнопки управления -->
        <div class="control-buttons">
          <button
            class="control-btn speak-btn"
            @click="speakPhrase"
            :disabled="isSpeaking"
          >
            🔊
          </button>
          <button
            class="control-btn mic-btn"
            @click="toggleRecording"
            :disabled="isProcessing"
            :class="{ 'recording': isRecording }"
          >
            🎤
          </button>
          <button
            class="control-btn next-btn"
            @click="markAsCompleted"
            :disabled="!hasAttempt"
            :class="{ 'active': hasAttempt }"
          >
            ✓
          </button>
        </div>

        <!-- Статус записи -->
        <div v-if="isRecording" class="recording-status">
          🎙️ Запись... {{ recordingTimer }} сек.
        </div>
      </div>

      <!-- Кнопка вперед - всегда активна -->
      <button class="nav-button next-button" @click="goToNextWord">
        ›
      </button>
    </div>
  </div>
  <!-- Если данных нет и не в загрузке -->
  <div v-else-if="!isLoading && !gameWords.length" class="error-screen">
    <p>❌ Не удалось загрузить данные</p>
    <button @click="loadGameData">Повторить попытку</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

// 👇 ДОБАВЛЯЕМ СИНХРОННЫЙ ИМПОРТ КАК ЗАПАСНОЙ ВАРИАНТ
import shortWordsData from '../dataForGames/short-words-data'

const route = useRoute()
const $q = useQuasar()

// Данные игры
const gameWords = ref([])
const currentIndex = ref(0)
const currentWord = ref({})
const wordStatistics = ref([])
const isPronunciationBlurred = ref(true)
const currentAttempt = ref(null)
const hasAttempt = ref(false)
const isLoading = ref(true) // 👈 ДОБАВЛЯЕМ состояние загрузки



// Количество завершенных слов (имеющих хотя бы одну попытку)
const completedWordsCount = computed(() => {
  return wordStatistics.value.filter(stat => stat.attempts.length > 0).length
})
// Состояние для записи и распознавания
const isRecording = ref(false)
const isSpeaking = ref(false)
const isProcessing = ref(false)
const recordingTimer = ref(0)
let recognition = null
let recordingInterval = null

// Модалка
const showModal = ref(false)

// Статистика для модалки
const totalWordsCount = ref(0)
const averageScore = ref(0)
const bestScore = ref(0)




// 👇 НОВАЯ ФУНКЦИЯ: синхронная инициализация с fallback
const initGame = (data) => {
  if (!data || !data.length) {
    console.error('No data provided for pronunciation game')
    isLoading.value = false
    return false
  }

  gameWords.value = data.map(item => ({
    ru: item.ru || item.translation || item.text,
    eng: item.eng || item.word || item.text,
    pronunciation: item.pronunciation || item.hint || item.transcription || ''
  }))

  // Берем первые 10 фраз или все, если меньше
  if (gameWords.value.length > 10) {
    gameWords.value = gameWords.value.slice(0, 10)
  }

  // Перемешиваем
  gameWords.value = shuffle(gameWords.value)

  // Инициализируем статистику
  wordStatistics.value = gameWords.value.map(word => ({
    phrase: word.ru,
    attempts: [],
    bestScore: 0
  }))

  currentIndex.value = 0
  isPronunciationBlurred.value = false
  loadCurrentWord()
  isLoading.value = false

  return true
}


// Голоса для TTS
let availableVoices = []
let currentVoice = null

// Настройки голосов (как в PronunciationTrainer)
const voiceOptions = [
  { label: '👨 Дэниэл', value: 'daniel', description: 'Мужской, четкий' },
  { label: '👩 Саманта', value: 'samantha', description: 'Женский, мягкий' },
  { label: '👨 Алекс', value: 'alex', description: 'Мужской, глубокий' },
  { label: '👨 Arthur', value: 'arthur', description: 'Мужской, глубокий' },
  { label: '👨 albert', value: 'albert', description: 'Мужской, глубокий' },
  { label: '👩 Виктория', value: 'victoria', description: 'Женский, выразительный' }
]

const selectedVoice = ref('albert')




// Функция для получения цвета оценки
const getScoreClass = (score) => {
  if (score >= 85) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 50) return 'average'
  return 'needs-work'
}

// Функция для преобразования первой буквы в заглавную
const capitalizeFirstLetter = (text) => {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// Загрузка голосов
const loadVoices = () => {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length) {
      availableVoices = voices
      resolve()
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        availableVoices = window.speechSynthesis.getVoices()
        resolve()
      }
    }
  })
}

// Обновление выбранного голоса
const updateSelectedVoice = () => {
  if (!availableVoices.length) return

  const voiceSearchMap = {
    daniel: ['Daniel', 'Google UK English Male'],
    samantha: ['Samantha', 'Google UK English Female'],
    arthur: ['Arthur', 'Google US English'],
    alex: ['alex', 'Google US English'],
    albert: ['albert'],
    victoria: ['Karen', 'Catherine', 'Martha']
  }

  const searchTerms = voiceSearchMap[selectedVoice.value] || ['english']

  let foundVoice = availableVoices.find(voice =>
    searchTerms.some(term => voice.name.toLowerCase().includes(term.toLowerCase()))
  )

  if (!foundVoice) {
    foundVoice = availableVoices.find(voice => voice.lang.startsWith('en'))
  }

  currentVoice = foundVoice
  console.log('Selected voice:', currentVoice?.name, 'for option:', selectedVoice.value)
}

// Озвучка фразы
const speakPhrase = () => {
  if (!currentWord.value || !currentWord.value.eng) return

  if (!currentVoice) {
    $q.notify({ type: 'warning', message: 'Голос еще не загружен' })
    return
  }

  isSpeaking.value = true
  const utterance = new SpeechSynthesisUtterance(currentWord.value.eng)
  utterance.voice = currentVoice
  utterance.rate = 0.8
  utterance.onend = () => { isSpeaking.value = false }
  utterance.onerror = () => { isSpeaking.value = false }
  window.speechSynthesis.speak(utterance)
}

// Распознавание речи
const initSpeechRecognition = () => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = true
    recognition.maxAlternatives = 3

    recognition.onstart = () => {
      isRecording.value = true
      isProcessing.value = true
      recordingTimer.value = 10

      recordingInterval = setInterval(() => {
        if (recordingTimer.value <= 1) {
          if (recognition) recognition.stop()
        } else {
          recordingTimer.value--
        }
      }, 1000)
    }

    recognition.onresult = (event) => {
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
      }

      if (finalTranscript) {
        evaluatePhrase(finalTranscript)
      }
    }

    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error)
      stopRecording()
      $q.notify({
        type: 'negative',
        message: 'Ошибка распознавания: ' + event.error
      })
    }

    recognition.onend = () => {
      stopRecording()
    }
  } else {
    $q.notify({ type: 'negative', message: 'Распознавание речи не поддерживается' })
  }
}

const startRecording = () => {
  if (recognition) {
    currentAttempt.value = null
    recognition.start()
  }
}

const stopRecording = () => {
  isRecording.value = false
  isProcessing.value = false

  if (recordingInterval) {
    clearInterval(recordingInterval)
    recordingInterval = null
  }
  recordingTimer.value = 0
}

const toggleRecording = () => {
  if (isRecording.value) {
    if (recognition) recognition.stop()
  } else {
    startRecording()
  }
}

// Оценка фразы
const evaluatePhrase = (spoken) => {
  const target = currentWord.value.eng.toLowerCase()
  const userText = spoken.toLowerCase()

  const cleanUser = userText.replace(/[^\w\s]/g, '').trim()
  const cleanTarget = target.replace(/[^\w\s]/g, '').trim()

  const targetWords = cleanTarget.split(/\s+/)
  const userWords = cleanUser.split(/\s+/)

  const overallSimilarity = calculateSimilarity(cleanTarget, cleanUser)

  let correctWords = 0
  const detailedWords = []

  for (let i = 0; i < targetWords.length; i++) {
    const expectedWord = targetWords[i]
    const spokenWord = userWords[i] || ''
    const wordSimilarity = calculateSimilarity(expectedWord, spokenWord)
    const isMatch = wordSimilarity > 0.7
    if (isMatch) correctWords++

    const errorIndices = findErrorIndices(expectedWord, spokenWord)

    detailedWords.push({
      expected: expectedWord,
      spoken: spokenWord,
      match: isMatch,
      similarity: wordSimilarity,
      errors: errorIndices,
      expectedChars: expectedWord.split(''),
      userChars: spokenWord.split('')
    })
  }

  const wordAccuracy = correctWords / targetWords.length
  const finalScore = Math.round((overallSimilarity * 70 + wordAccuracy * 30))

  const attemptData = {
    score: finalScore,
    userText: cleanUser,
    targetText: cleanTarget,
    detailedWords: detailedWords,
    timestamp: new Date()
  }

  currentAttempt.value = attemptData
  hasAttempt.value = true

  // Сохраняем в статистику
  if (wordStatistics.value[currentIndex.value]) {
    wordStatistics.value[currentIndex.value].attempts.push({
      score: finalScore,
      userText: cleanUser,
      detailedWords: detailedWords
    })

    // Обновляем лучший результат
    const bestAttempt = Math.max(...wordStatistics.value[currentIndex.value].attempts.map(a => a.score))
    wordStatistics.value[currentIndex.value].bestScore = bestAttempt
  }

  let feedback = ''
  if (finalScore >= 95) {
    feedback = '🎉 Превосходно! Идеальное произношение!'
  } else if (finalScore >= 85) {
    feedback = '🌟 Отлично! Очень хорошее произношение!'
  } else if (finalScore >= 75) {
    feedback = '👍 Хорошо! Небольшие недочеты.'
  } else if (finalScore >= 65) {
    feedback = '📚 Неплохо! Обратите внимание на выделенные буквы.'
  } else if (finalScore >= 50) {
    feedback = '🎯 Почти получилось! Попробуйте еще раз.'
  } else {
    feedback = '🔄 Стоит потренироваться. Послушайте еще раз.'
  }

  $q.notify({
    type: finalScore > 70 ? 'positive' : 'warning',
    message: feedback,
    timeout: 2000
  })
}

// Алгоритм сравнения строк
const calculateSimilarity = (str1, str2) => {
  if (str1 === str2) return 1
  if (!str1 || !str2) return 0

  str1 = str1.toLowerCase().trim()
  str2 = str2.toLowerCase().trim()

  const len1 = str1.length
  const len2 = str2.length

  const matrix = []
  for (let i = 0; i <= len1; i++) matrix[i] = [i]
  for (let j = 0; j <= len2; j++) matrix[0][j] = j

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }

  const distance = matrix[len1][len2]
  const maxLength = Math.max(len1, len2)
  return 1 - distance / maxLength
}

// Функция для выделения ошибок
const findErrorIndices = (expected, spoken) => {
  const len1 = expected.length
  const len2 = spoken.length
  const dp = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0))

  for (let i = 0; i <= len1; i++) dp[i][0] = i
  for (let j = 0; j <= len2; j++) dp[0][j] = j

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = expected[i-1] === spoken[j-1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i-1][j] + 1,
        dp[i][j-1] + 1,
        dp[i-1][j-1] + cost
      )
    }
  }

  const errorIndices = new Set()
  let i = len1, j = len2
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && expected[i-1] === spoken[j-1]) {
      i--; j--
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i-1][j-1] + 1) {
      errorIndices.add(i-1)
      i--; j--
    } else if (i > 0 && dp[i][j] === dp[i-1][j] + 1) {
      errorIndices.add(i-1)
      i--
    } else if (j > 0) {
      j--
    }
  }
  return Array.from(errorIndices)
}

// Переход к следующему слову без попыток
const goToNextUnattemptedWord = () => {
  // Ищем следующее слово без попыток после текущего
  for (let i = currentIndex.value + 1; i < gameWords.value.length; i++) {
    if (wordStatistics.value[i].attempts.length === 0) {
      currentIndex.value = i
      loadCurrentWord()
      return
    }
  }

  // Если не нашли после текущего, ищем сначала
  for (let i = 0; i < currentIndex.value; i++) {
    if (wordStatistics.value[i].attempts.length === 0) {
      currentIndex.value = i
      loadCurrentWord()
      return
    }
  }

  // Если все слова имеют попытки - завершаем игру
  showFinalModal()
}

// Отметить слово как выполненное и перейти к следующему
const markAsCompleted = () => {
  if (!hasAttempt.value) {
    $q.notify({ type: 'warning', message: 'Сначала произнесите фразу!' })
    return
  }

  // Переходим к следующему слову без попыток
  goToNextUnattemptedWord()
}

// Переход к следующему слову (навигационная кнопка)
const goToNextWord = () => {
  if (currentIndex.value < gameWords.value.length - 1) {
    currentIndex.value++
    loadCurrentWord()
  } else {
    // Если это последнее слово, возвращаемся к первому
    currentIndex.value = 0
    loadCurrentWord()
  }
}

// Переход к предыдущему слову (навигационная кнопка)
const goToPreviousWord = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    loadCurrentWord()
  } else {
    // Если это первое слово, переходим к последнему
    currentIndex.value = gameWords.value.length - 1
    loadCurrentWord()
  }
}

// Загрузка текущего слова
const loadCurrentWord = () => {
  currentWord.value = gameWords.value[currentIndex.value]

  // Загружаем последнюю попытку для этого слова, если есть
  const stats = wordStatistics.value[currentIndex.value]
  if (stats && stats.attempts.length > 0) {
    const lastAttempt = stats.attempts[stats.attempts.length - 1]
    currentAttempt.value = lastAttempt
    hasAttempt.value = true
  } else {
    currentAttempt.value = null
    hasAttempt.value = false
  }

  // Блюр только если это не первое слово
  isPronunciationBlurred.value = currentIndex.value !== 0

  nextTick(() => {
    // Можно добавить анимацию
  })
}

// Показ финальной модалки
const showFinalModal = () => {
  const allScores = []
  wordStatistics.value.forEach(stat => {
    if (stat.bestScore > 0) allScores.push(stat.bestScore)
  })

  totalWordsCount.value = gameWords.value.length
  averageScore.value = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) || 0
  bestScore.value = Math.max(...allScores, 0)

  showModal.value = true
}

// Перезапуск игры
const restartGame = () => {
  // Создаем копию слов
  const phrases = [...gameWords.value]

  // Перемешиваем
  gameWords.value = shuffle(phrases)

  // Сбрасываем статистику
  wordStatistics.value = gameWords.value.map(word => ({
    phrase: word.ru,
    attempts: [],
    bestScore: 0
  }))

  currentIndex.value = 0
  hasAttempt.value = false
  currentAttempt.value = null
  showModal.value = false
  loadCurrentWord()
}

// Перемешивание массива
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// Закрыть модалку
const closeModal = () => {
  showModal.value = false
}


// Получаем данные из параметров маршрута

// 👇 ИСПРАВЛЕННАЯ ФУНКЦИЯ: с синхронным fallback
const loadGameData = async () => {
  const missionName = route.params.missionName

  if (!missionName) {
    console.error('No mission name in route params')
    $q.notify({
      type: 'negative',
      message: '❌ Ошибка: не указана миссия',
      timeout: 3000
    })
    isLoading.value = false
    return
  }

  // Сначала проверяем синхронные данные (быстро)
  const syncData = shortWordsData[missionName]
  if (syncData) {
    console.log('Using sync data for mission:', missionName)
    initGame(syncData)
    return
  }

  // Если синхронных нет, пробуем динамический импорт (может быть API в будущем)
  try {
    console.log('Trying dynamic import for mission:', missionName)
    const module = await import(`../dataForGames/short-words-data.js`)
    const data = module.default[missionName]

    if (data) {
      initGame(data)
    } else {
      console.error('Mission not found:', missionName)
      $q.notify({
        type: 'negative',
        message: `❌ Миссия "${missionName}" не найдена`,
        timeout: 3000
      })
      isLoading.value = false
    }
  } catch (error) {
    console.error('Error loading game data:', error)
    $q.notify({
      type: 'negative',
      message: '❌ Ошибка загрузки данных игры',
      timeout: 3000
    })
    isLoading.value = false
  }
}

// Функция для случайного выбора голоса
const getRandomVoice = () => {
  const availableVoicesValues = voiceOptions.map(v => v.value)
  const randomIndex = Math.floor(Math.random() * availableVoicesValues.length)
  return availableVoicesValues[randomIndex]
}


// Жизненный цикл
onMounted(async () => {
  await loadVoices()

  // Выбираем случайный голос при загрузке
  const randomVoice = getRandomVoice()
  selectedVoice.value = randomVoice

  updateSelectedVoice()
  initSpeechRecognition()

  // Загружаем данные (теперь с синхронным fallback)
  await loadGameData()

  // Показываем уведомление о случайном голосе (только если данные загружены)
  if (!isLoading.value && gameWords.value.length) {
    $q.notify({
      type: 'info',
      message: `🎲 Сегодняшний голос: ${voiceOptions.find(v => v.value === randomVoice)?.label}`,
      position: 'top',
      timeout: 3000
    })
  }
})

onBeforeUnmount(() => {
  if (recognition) recognition.abort()
  if (recordingInterval) clearInterval(recordingInterval)
})
</script>

<style scoped>
/* Все стили остаются как в предыдущей версии, добавляем новые */

.word-counter {
  font-size: 14px;
  color: #95a5a6;
  margin-bottom: 10px;
}

.no-attempt-message {
  width: 100%;
  padding: 20px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 12px;
  margin-top: 10px;
}

.word-stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.word-stat-best {
  font-size: 12px;
  color: #2ecc71;
  font-weight: bold;
}

.attempts-title {
  font-size: 11px;
  color: #7f8c8d;
  margin-bottom: 5px;
}

.attempt-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  border-bottom: 1px solid #ecf0f1;
  font-size: 12px;
}

.attempt-score {
  min-width: 45px;
  padding: 2px 6px;
  border-radius: 12px;
  font-weight: bold;
  text-align: center;
}

.attempt-text {
  flex: 1;
  color: #2c3e50;
  word-break: break-word;
  font-family: monospace;
}

.attempt-score.excellent {
  background: #2ecc71;
  color: white;
}

.attempt-score.good {
  background: #3498db;
  color: white;
}

.attempt-score.average {
  background: #f39c12;
  color: white;
}

.attempt-score.needs-work {
  background: #e74c3c;
  color: white;
}

/* Остальные стили из предыдущей версии */
.game-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  z-index: 100;
}

.game-content-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 800px;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 500px;
}

.word-card {
  width: 500px;
  min-height: 450px;
  border-radius: 20px;
  padding: 30px 20px;
  background: white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.word {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  line-height: 1.3;
}

.pronunciation-hint {
  font-size: 18px;
  color: #7f8c8d;
  font-style: italic;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.pronunciation-hint.blurred {
  filter: blur(4px);
}

.pronunciation-hint.blurred:hover {
  filter: blur(2px);
}

.hint-click {
  font-size: 12px;
  color: #95a5a6;
  display: block;
  margin-top: 5px;
}

.user-phrase-display {
  width: 100%;
  border-top: 1px solid #e0e5ec;
  padding-top: 15px;
  margin-top: 10px;
}

.caption-label {
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 5px;
  text-align: left;
}

.user-phrase-text {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  line-height: 1.3;
  word-break: break-word;
  margin-bottom: 10px;
}

.target-phrase-display {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #e0e5ec;
}

.target-phrase-text {
  font-size: 18px;
  color: #27ae60;
  font-weight: bold;
  word-break: break-word;
}

.user-word {
  display: inline-block;
  margin-right: 8px;
}

.user-char {
  display: inline-block;
}

.user-char.error-char {
  color: #e74c3c;
  text-decoration: underline;
  text-decoration-thickness: 2px;
}

.user-space {
  display: inline-block;
  width: 4px;
}

.score-badge {
  margin-top: 10px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  display: inline-block;
}

.score-badge.excellent {
  background: #2ecc71;
  color: white;
}

.score-badge.good {
  background: #3498db;
  color: white;
}

.score-badge.average {
  background: #f39c12;
  color: white;
}

.score-badge.needs-work {
  background: #e74c3c;
  color: white;
}

.control-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.control-btn {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.control-btn:active {
  transform: scale(0.95);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.speak-btn {
  background: #3498db;
  color: white;
}

.mic-btn {
  background: #e67e22;
  color: white;
}

.mic-btn.recording {
  animation: pulse 1.5s infinite;
  background: #e74c3c;
}

.next-btn {
  background: #bdc3c7;
  color: white;
}

.next-btn.active {
  background: #2ecc71;
}

.nav-button {
  width: 60px;
  height: 300px;
  border-radius: 16px;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  font-size: 32px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

.recording-status {
  font-size: 14px;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px 15px;
  border-radius: 20px;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Модальное окно */
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
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 20px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.statistics {
  margin: 20px 0;
}

.stat-item {
  padding: 8px 0;
  border-bottom: 1px solid #e0e5ec;
}

.word-stats {
  margin-top: 20px;
}

.stat-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #2c3e50;
}

.word-stat-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.word-stat-phrase {
  font-weight: bold;
  color: #2c3e50;
}

.modal-content button {
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.modal-content button:first-of-type {
  background: #2ecc71;
  color: white;
}

.close-btn {
  background: #95a5a6;
  color: white;
}

@media (max-width: 600px) {
  .game-content-wrapper {
    flex-direction: column;
  }

  .main-content {
    width: 100%;
  }

  .word-card {
    width: 100%;
    min-height: 350px;
  }

  .word {
    font-size: 22px;
  }

  .user-phrase-text {
    font-size: 16px;
  }

  .target-phrase-text {
    font-size: 16px;
  }

  .nav-button {
    width: 100%;
    height: 50px;
  }

  .control-btn {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .modal-content {
    padding: 20px;
  }
}
.progress-indicator {
  margin-bottom: 15px;
  width: 100%;
  max-width: 400px;
}

.progress-stats {
  font-size: 14px;
  color: white;
  margin-bottom: 5px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #2ecc71;
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Добавляем стили для экранов загрузки и ошибок */
.loading-screen,
.error-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.loader {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-screen p,
.error-screen p {
  color: white;
  font-size: 18px;
  margin-bottom: 20px;
}

.error-screen button {
  padding: 10px 20px;
  background: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  color: #667eea;
}
</style>
