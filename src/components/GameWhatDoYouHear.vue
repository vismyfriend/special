<template>
  <div class="game-container">
    <!-- Стартовый экран -->
    <div v-if="!gameStarted" class="start-screen">
      <div class="safe-overlay">
        <div class="safe-door">
          <div class="safe-lock">
            <div class="lock-circle"></div>
            <div class="lock-hole"></div>
          </div>
          <div class="safe-handle"></div>
        </div>
      </div>
      <div class="start-content">
        <h1 class="game-title">🔐 WHAT DO YOU HEAR? 🔐</h1>
        <div class="instruction">
          <p>🎧 Сейчас вы услышите слово или фразу на английском</p>
          <p>📖 Выберите правильный перевод из предложенных вариантов</p>
          <p>🔓 Успешно взломайте 10 кодов, чтобы открыть сейф!</p>
        </div>
        <button class="start-btn" @click="startGame">
          <span class="btn-text">НАЧАТЬ ВЗЛОМ</span>
          <span class="btn-icon">🔑</span>
        </button>
      </div>
    </div>

    <!-- Основная игра -->
    <div v-else class="game-screen">
      <!-- Прогресс взлома -->
      <div class="hack-progress">
        <div class="progress-header">
          <span class="progress-label">ВЗЛОМ СЕЙФА</span>
<!--          <span class="progress-count">{{ correctAnswers }} / {{ totalQuestions }}</span>-->
        </div>
        <div class="progress-bar-safe">
          <div class="progress-fill-safe" :style="{ width: (correctAnswers / totalQuestions * 100) + '%' }"></div>
          <div class="progress-lights">
            <div v-for="i in totalQuestions" :key="i" class="light" :class="{ active: i <= correctAnswers }"></div>
          </div>
        </div>
      </div>

      <!-- Кодовый дисплей -->
      <div class="code-display">
        <div class="display-screen">
          <div class="display-text">
            <span class="prompt">🔊 {{ showTextInsteadOfAudio ? 'READ THE CODE:' : 'HEAR THE CODE:' }}</span>
            <div v-if="!showTextInsteadOfAudio" class="audio-wave" :class="{ playing: isPlaying }">
              <span></span><span></span><span></span><span></span><span></span>
            </div>
            <div v-else class="text-code">
              {{ currentPhrase?.eng }}
            </div>
          </div>
          <div class="button-group">
            <button class="play-btn" @click="playCurrentPhrase" :disabled="isPlaying || showTextInsteadOfAudio">
              <span>🎧</span> PLAY
            </button>
            <button class="no-sound-btn" @click="toggleNoSound" :disabled="false">
              <span>🔇</span> НЕ СЛЫШНО
            </button>
          </div>
        </div>
      </div>

      <!-- Варианты ответов (как кнопки сейфа) -->
      <div class="options-panel">
        <div class="safe-keypad">
          <button
            v-for="(option, idx) in currentOptions"
            :key="idx"
            class="option-btn"
            :class="{
              wrong: showFeedback && !option.isCorrect && selectedOption === option.text,
              selected: showFeedback && selectedOption === option.text
            }"
            @click="selectAnswer(option)"
            :disabled="answerLocked"
          >
            <span class="option-number">{{ idx + 1 }}</span>
            <span class="option-text">{{ option.text }}</span>
            <span class="option-lock">🔒</span>
          </button>
        </div>
      </div>

      <!-- Сообщение о результате -->
      <div v-if="feedbackMessage" class="feedback-message" :class="feedbackType">
        {{ feedbackMessage }}
      </div>

      <!-- Модалка завершения -->
      <div v-if="gameCompleted" class="completion-modal">
        <div class="modal-content-safe">
          <div class="safe-opened">
            <div class="safe-door-open">
              <div class="treasure">
                <span class="treasure-icon">💎</span>
                <span class="treasure-icon">💰</span>
                <span class="treasure-icon">🏆</span>
              </div>
            </div>
          </div>
          <h2>🎉 СЕЙФ ОТКРЫТ! 🎉</h2>
          <p>Вы успешно взломали {{ totalQuestions }} кодов!</p>
          <p class="success-rate">Точность: {{ Math.round(correctAnswers / totalQuestions * 100) }}%</p>
          <div class="completion-buttons">
            <button class="play-again-btn" @click="restartGame">ИГРАТЬ СНОВА</button>
            <button class="close-btn" @click="closeGame">ЗАКРЫТЬ</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const $q = useQuasar()

// Данные игры
const gameWords = ref([])
const currentPhrase = ref(null)
const currentOptions = ref([])
const correctAnswers = ref(0)
const totalQuestions = 10
const gameStarted = ref(false)
const gameCompleted = ref(false)
const answerLocked = ref(false)
const showFeedback = ref(false)
const selectedOption = ref(null)
const feedbackMessage = ref('')
const feedbackType = ref('')
const isPlaying = ref(false)
const lastPhraseEng = ref(null)
const showTextInsteadOfAudio = ref(false)

// Голоса для TTS
let availableVoices = []
let currentVoice = null

// Настройки голосов
const voiceOptions = [
  { label: '👨 Дэниэл', value: 'daniel' },
  { label: '👩 Саманта', value: 'samantha' },
  { label: '👨 Алекс', value: 'alex' },
  { label: '👨 Arthur', value: 'arthur' },
  { label: '👨 albert', value: 'albert' },
  { label: '👩 Виктория', value: 'victoria' }
]

const currentVoiceName = ref('albert')

// Функция для случайного выбора голоса
const getRandomVoice = () => {
  const availableVoicesValues = voiceOptions.map(v => v.value)
  const randomIndex = Math.floor(Math.random() * availableVoicesValues.length)
  return availableVoicesValues[randomIndex]
}

// Поиск голоса по названию
const findVoiceByName = (voiceName) => {
  if (!availableVoices.length) return null

  const voiceSearchMap = {
    daniel: ['Daniel', 'Google UK English Male'],
    samantha: ['Samantha', 'Google UK English Female'],
    arthur: ['Arthur', 'Google US English'],
    alex: ['alex', 'Google US English'],
    albert: ['albert'],
    victoria: ['Karen', 'Catherine', 'Martha']
  }

  const searchTerms = voiceSearchMap[voiceName] || ['english']

  let foundVoice = availableVoices.find(voice =>
    searchTerms.some(term => voice.name.toLowerCase().includes(term.toLowerCase()))
  )

  if (!foundVoice) {
    foundVoice = availableVoices.find(voice => voice.lang.startsWith('en'))
  }

  return foundVoice
}

// Обновление выбранного голоса
const updateSelectedVoice = (voiceName) => {
  currentVoiceName.value = voiceName
  currentVoice = findVoiceByName(voiceName)
  console.log('Selected voice:', currentVoice?.name, 'for option:', voiceName)
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

// Остановка текущего воспроизведения
const cancelCurrentSpeech = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
  isPlaying.value = false
}

// Озвучка фразы
const speakPhrase = (text) => {
  return new Promise((resolve) => {
    if (!currentVoice) {
      resolve()
      return
    }

    isPlaying.value = true
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = currentVoice
    utterance.rate = 0.8
    utterance.onend = () => {
      isPlaying.value = false
      resolve()
    }
    utterance.onerror = () => {
      isPlaying.value = false
      resolve()
    }
    window.speechSynthesis.speak(utterance)
  })
}

// Воспроизведение текущей фразы со случайным голосом
const playCurrentPhrase = async () => {
  if (isPlaying.value) return

  // Сбрасываем режим "не слышно" если он был включен
  if (showTextInsteadOfAudio.value) {
    showTextInsteadOfAudio.value = false
  }

  // Выбираем случайный голос для этой фразы
  const randomVoice = getRandomVoice()
  updateSelectedVoice(randomVoice)

  await speakPhrase(currentPhrase.value.eng)
}

// Кнопка "Не слышно"
// Кнопка "Не слышно"
const toggleNoSound = () => {
  // Останавливаем любое текущее воспроизведение
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
  isPlaying.value = false
  showTextInsteadOfAudio.value = true

  $q.notify({
    type: 'info',
    message: '🔍 Показан текст. Нажмите PLAY, чтобы попробовать снова',
    timeout: 2000
  })
}

// Генерация случайных вариантов ответов
const generateOptions = (correctPhrase, allPhrases) => {
  const otherPhrases = allPhrases.filter(p => p.eng !== correctPhrase.eng)

  const shuffled = [...otherPhrases]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  const randomOptions = shuffled.slice(0, 4).map(p => ({
    text: p.ru,
    isCorrect: false,
    eng: p.eng
  }))

  const options = [{
    text: correctPhrase.ru,
    isCorrect: true,
    eng: correctPhrase.eng
  }, ...randomOptions]

  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[options[i], options[j]] = [options[j], options[i]]
  }

  return options
}

// Загрузка нового вопроса
const loadNewQuestion = () => {
  if (correctAnswers.value >= totalQuestions) {
    gameCompleted.value = true
    return
  }

  let availablePhrases = gameWords.value

  if (lastPhraseEng.value) {
    availablePhrases = gameWords.value.filter(p => p.eng !== lastPhraseEng.value)
  }

  const randomIndex = Math.floor(Math.random() * availablePhrases.length)
  currentPhrase.value = availablePhrases[randomIndex]

  lastPhraseEng.value = currentPhrase.value.eng
  currentOptions.value = generateOptions(currentPhrase.value, gameWords.value)

  // Сбрасываем режим "не слышно" для нового вопроса
  showTextInsteadOfAudio.value = false

  answerLocked.value = false
  showFeedback.value = false
  selectedOption.value = null
  feedbackMessage.value = ''
}

// Обработка выбора ответа
const selectAnswer = async (option) => {
  if (answerLocked.value) return

  selectedOption.value = option.text
  answerLocked.value = true
  showFeedback.value = true

  if (option.isCorrect) {
    correctAnswers.value++
    feedbackMessage.value = '✅ ВЕРНО! Код принят!'
    feedbackType.value = 'success'

    $q.notify({
      type: 'positive',
      message: '✅ Правильно! +1 очко',
      timeout: 1000
    })

    setTimeout(() => {
      if (correctAnswers.value >= totalQuestions) {
        gameCompleted.value = true
      } else {
        loadNewQuestion()
      }
    }, 1500)
  } else {
    feedbackMessage.value = '❌ НЕВЕРНО! Попробуйте еще раз...'
    feedbackType.value = 'error'

    // Произносим выбранный неправильный вариант
    if (option.eng) {
      const randomVoice = getRandomVoice()
      updateSelectedVoice(randomVoice)
      await speakPhrase(option.eng)
    }

    $q.notify({
      type: 'negative',
      message: '❌ Неправильно! Попробуйте еще раз',
      timeout: 1500
    })

    setTimeout(() => {
      answerLocked.value = false
      showFeedback.value = false
      selectedOption.value = null
      feedbackMessage.value = ''
    }, 1500)
  }
}

// Запуск игры
const startGame = () => {
  gameStarted.value = true
  correctAnswers.value = 0
  showTextInsteadOfAudio.value = false
  loadNewQuestion()
}

// Перезапуск игры
const restartGame = () => {
  gameCompleted.value = false
  correctAnswers.value = 0
  showTextInsteadOfAudio.value = false
  loadNewQuestion()
}

// Закрыть игру
const closeGame = () => {
  gameCompleted.value = false
  gameStarted.value = false
  cancelCurrentSpeech()
}

// Инициализация игры с данными
const initGame = (data) => {
  if (!data || !data.length) {
    console.error('No data provided for What Do You Hear game')
    return
  }

  gameWords.value = data.map(item => ({
    ru: item.ru || item.translation || item.text,
    eng: item.eng || item.word || item.text,
    pronunciation: item.pronunciation || item.hint || item.transcription || ''
  }))
}

// Получаем данные из параметров маршрута
const loadGameData = () => {
  const missionName = route.params.missionName

  import(`../dataForGames/short-words-data.js`).then(module => {
    const data = module.default[missionName]
    if (data) {
      initGame(data)
    } else {
      console.error('Mission not found:', missionName)
      $q.notify({ type: 'negative', message: 'Данные для игры не найдены' })
    }
  }).catch(error => {
    console.error('Error loading game data:', error)
    $q.notify({ type: 'negative', message: 'Ошибка загрузки данных' })
  })
}

// Жизненный цикл
onMounted(async () => {
  await loadVoices()
  const randomVoice = getRandomVoice()
  updateSelectedVoice(randomVoice)
  loadGameData()
})

onBeforeUnmount(() => {
  cancelCurrentSpeech()
})
</script>

<style scoped>
.game-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1f 100%);
  font-family: 'Courier New', monospace;
  z-index: 100;
}

/* Стартовый экран */
.start-screen {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 60px;

}

.safe-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(45deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 2px, transparent 2px, transparent 8px);
}

.safe-door {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 400px;
  background: linear-gradient(145deg, #2c3e50, #1a2632);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
  border: 3px solid #e67e22;
}

.safe-lock {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, #bdc3c7, #7f8c8d);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 10px;
}

.no-sound-btn {
  background: linear-gradient(135deg, #7f8c8d, #95a5a6);
  border: none;
  padding: 10px 30px;
  color: white;
  font-weight: bold;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Courier New', monospace;
}

.no-sound-btn:hover:not(:disabled) {
  transform: scale(1.05);
  background: linear-gradient(135deg, #95a5a6, #7f8c8d);
}

.no-sound-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.text-code {
  font-size: 24px;
  font-weight: bold;
  color: #2ecc71;
  text-align: center;
  padding: 10px;
  font-family: 'Courier New', monospace;
  word-break: break-word;
}
.lock-circle {
  width: 50px;
  height: 50px;
  border: 3px solid #2c3e50;
  border-radius: 50%;
  position: relative;
}

.lock-hole {
  width: 12px;
  height: 12px;
  background: #2c3e50;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.safe-handle {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 8px;
  background: #95a5a6;
  border-radius: 4px;
}

.start-content {
  position: relative;
  z-index: 10;
  text-align: center;
  background: rgba(0,0,0,0.7);
  padding: 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  margin: 20px;
}

.game-title {
  font-size: 36px;
  color: #e67e22;
  text-shadow: 0 0 10px rgba(230,126,34,0.5);
  margin-bottom: 30px;
  letter-spacing: 2px;
}

.instruction {
  color: #ecf0f1;
  font-size: 18px;
  margin-bottom: 30px;
  line-height: 1.6;
}

.start-btn {
  background: linear-gradient(135deg, #e67e22, #d35400);
  border: none;
  padding: 15px 40px;
  font-size: 20px;
  font-weight: bold;
  color: white;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Courier New', monospace;
}

.start-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(230,126,34,0.5);
}

/* Основная игра */
.game-screen {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

/* Прогресс */
.hack-progress {
  width: 100%;
  max-width: 600px;
  background: rgba(0,0,0,0.5);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #e67e22;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #e67e22;
  font-weight: bold;
}

.progress-bar-safe {
  position: relative;
  height: 30px;
  background: #2c3e50;
  border-radius: 15px;
  overflow: hidden;
}

.progress-fill-safe {
  height: 100%;
  background: linear-gradient(90deg, #e67e22, #f39c12);
  transition: width 0.5s ease;
  border-radius: 15px;
}

.progress-lights {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  align-items: center;
}

.light {
  width: 12px;
  height: 12px;
  background: #34495e;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.light.active {
  background: #2ecc71;
  box-shadow: 0 0 10px #2ecc71;
}

/* Кодовый дисплей */
.code-display {
  width: 100%;
  max-width: 600px;
}

.display-screen {
  background: #0a0a0f;
  border: 3px solid #e67e22;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(230,126,34,0.3);
}

.display-text {
  text-align: center;
  margin-bottom: 15px;
}

.prompt {
  color: #2ecc71;
  font-size: 14px;
  letter-spacing: 2px;
  display: block;
  margin-bottom: 10px;
}

.audio-wave {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  height: 40px;
}

.audio-wave span {
  width: 4px;
  height: 20px;
  background: #e67e22;
  border-radius: 2px;
  transition: all 0.2s ease;
}

.audio-wave.playing span {
  animation: wave 0.5s ease infinite alternate;
}

.audio-wave.playing span:nth-child(1) { animation-delay: 0s; height: 30px; }
.audio-wave.playing span:nth-child(2) { animation-delay: 0.1s; height: 40px; }
.audio-wave.playing span:nth-child(3) { animation-delay: 0.2s; height: 35px; }
.audio-wave.playing span:nth-child(4) { animation-delay: 0.3s; height: 45px; }
.audio-wave.playing span:nth-child(5) { animation-delay: 0.4s; height: 25px; }

@keyframes wave {
  from { height: 20px; }
  to { height: 50px; }
}

.play-btn {
  background: linear-gradient(135deg, #e67e22, #d35400);
  border: none;
  padding: 10px 30px;
  color: white;
  font-weight: bold;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Courier New', monospace;
}

.play-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(230,126,34,0.5);
}

.play-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Опции ответов */
.options-panel {
  width: 100%;
  max-width: 800px;
}

.safe-keypad {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
  padding: 20px;
  background: rgba(0,0,0,0.3);
  border-radius: 15px;
  border: 1px solid #e67e22;
}

.option-btn {
  background: linear-gradient(135deg, #2c3e50, #1a2632);
  border: 2px solid #e67e22;
  padding: 15px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  color: #ecf0f1;
}

.option-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(230,126,34,0.3);
  border-color: #f39c12;
}

.option-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.option-btn.correct {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  border-color: #f1c40f;
  animation: correctFlash 0.5s ease;
}

.option-btn.selected {
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-color: #f1c40f;
}

.option-btn.selected.correct {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
}

.option-btn.wrong {
  background: linear-gradient(135deg, #c0392b, #e74c3c);
  border-color: #e67e22;
  animation: wrongShake 0.3s ease;
}

@keyframes correctFlash {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px #2ecc71; }
}

@keyframes wrongShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.option-number {
  font-size: 20px;
  font-weight: bold;
  color: #e67e22;
  min-width: 35px;
}

.option-text {
  flex: 1;
  text-align: left;
}

.option-lock {
  opacity: 0.5;
  font-size: 14px;
}

/* Сообщение о результате */
.feedback-message {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 18px;
  animation: slideUp 0.3s ease;
  z-index: 100;
}

.feedback-message.success {
  background: rgba(46, 204, 113, 0.9);
  color: white;
  border-left: 4px solid #f1c40f;
}

.feedback-message.error {
  background: rgba(231, 76, 60, 0.9);
  color: white;
  border-left: 4px solid #e67e22;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Модалка завершения */
.completion-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(5px);
}

.modal-content-safe {
  background: linear-gradient(135deg, #2c3e50, #1a2632);
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  border: 3px solid #e67e22;
  max-width: 500px;
  animation: modalOpen 0.5s ease;
}

@keyframes modalOpen {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.safe-opened {
  margin-bottom: 20px;
}

.safe-door-open {
  width: 200px;
  height: 200px;
  background: linear-gradient(145deg, #34495e, #2c3e50);
  border-radius: 20px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e67e22;
}

.treasure {
  display: flex;
  gap: 15px;
  animation: treasureGlow 1s ease infinite alternate;
}

.treasure-icon {
  font-size: 40px;
  animation: float 2s ease infinite;
}

@keyframes treasureGlow {
  from { filter: drop-shadow(0 0 5px gold); }
  to { filter: drop-shadow(0 0 20px gold); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.modal-content-safe h2 {
  color: #e67e22;
  margin-bottom: 15px;
  font-size: 28px;
}

.modal-content-safe p {
  color: #ecf0f1;
  margin-bottom: 10px;
}

.success-rate {
  font-size: 24px;
  font-weight: bold;
  color: #2ecc71;
  margin: 15px 0;
}

.completion-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.play-again-btn, .close-btn {
  padding: 10px 25px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  font-family: 'Courier New', monospace;
}

.play-again-btn {
  background: linear-gradient(135deg, #e67e22, #d35400);
  color: white;
}

.close-btn {
  background: #7f8c8d;
  color: white;
}

.play-again-btn:hover, .close-btn:hover {
  transform: scale(1.05);
}

@media (max-width: 600px) {
  .safe-keypad {
    grid-template-columns: 1fr;
  }

  .option-btn {
    padding: 12px 15px;
  }

  .game-title {
    font-size: 24px;
  }

  .instruction {
    font-size: 14px;
  }

  .modal-content-safe {
    padding: 20px;
    margin: 20px;
  }
}

/* Адаптация для мобильных устройств */
@media (max-width: 768px) {
  .game-container {
    overflow-y: auto;
  }

  .game-screen {
    padding: 15px;
    gap: 15px;
    justify-content: flex-start;
    min-height: 100%;
    overflow-y: auto;
  }

  /* Прогресс */
  .hack-progress {
    max-width: 100%;
    padding: 10px;
  }

  .progress-header {
    font-size: 12px;
  }

  .progress-bar-safe {
    height: 25px;
  }

  .light {
    width: 8px;
    height: 8px;
  }

  /* Кодовый дисплей */
  .code-display {
    max-width: 100%;
  }

  .display-screen {
    padding: 15px;
  }

  .prompt {
    font-size: 12px;
  }

  .text-code {
    font-size: 16px;
    padding: 8px;
  }

  .audio-wave {
    height: 30px;
  }

  .audio-wave span {
    width: 3px;
    height: 15px;
  }

  .audio-wave.playing span:nth-child(1) { height: 22px; }
  .audio-wave.playing span:nth-child(2) { height: 28px; }
  .audio-wave.playing span:nth-child(3) { height: 25px; }
  .audio-wave.playing span:nth-child(4) { height: 32px; }
  .audio-wave.playing span:nth-child(5) { height: 20px; }

  .button-group {
    gap: 10px;
    flex-direction: column;
  }

  .play-btn, .no-sound-btn {
    padding: 8px 20px;
    font-size: 14px;
    justify-content: center;
  }

  /* Опции ответов */
  .options-panel {
    max-width: 100%;
  }

  .safe-keypad {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 15px;
  }

  .option-btn {
    padding: 12px 15px;
    font-size: 14px;
    gap: 10px;
  }

  .option-number {
    font-size: 16px;
    min-width: 28px;
  }

  .option-lock {
    font-size: 12px;
  }

  /* Сообщение о результате */
  .feedback-message {
    bottom: 20px;
    padding: 8px 16px;
    font-size: 14px;
    max-width: 90%;
    text-align: center;
  }

  /* Модалка завершения */
  .modal-content-safe {
    padding: 25px;
    margin: 20px;
    max-width: calc(100% - 40px);
  }

  .modal-content-safe h2 {
    font-size: 22px;
  }

  .modal-content-safe p {
    font-size: 14px;
  }

  .success-rate {
    font-size: 20px;
  }

  .safe-door-open {
    width: 150px;
    height: 150px;
  }

  .treasure-icon {
    font-size: 30px;
  }

  .completion-buttons {
    gap: 10px;
    flex-direction: column;
  }

  .play-again-btn, .close-btn {
    padding: 8px 20px;
    font-size: 14px;
  }
}

/* Для очень маленьких экранов (iPhone SE и подобные) */
@media (max-width: 480px) {
  .game-screen {
    padding: 10px;
    gap: 12px;
  }

  .hack-progress {
    padding: 8px;
  }

  .progress-header {
    font-size: 10px;
  }

  .progress-bar-safe {
    height: 20px;
  }

  .display-screen {
    padding: 12px;
  }

  .prompt {
    font-size: 10px;
  }

  .text-code {
    font-size: 14px;
  }

  .option-btn {
    padding: 10px 12px;
    font-size: 12px;
  }

  .option-number {
    font-size: 14px;
    min-width: 24px;
  }

  .feedback-message {
    bottom: 15px;
    padding: 6px 12px;
    font-size: 12px;
  }

  .modal-content-safe {
    padding: 20px;
  }

  .modal-content-safe h2 {
    font-size: 18px;
  }

  .success-rate {
    font-size: 16px;
  }

  .safe-door-open {
    width: 120px;
    height: 120px;
  }

  .treasure-icon {
    font-size: 24px;
  }
}

/* Для горизонтальной ориентации на телефонах */
@media (max-width: 900px) and (orientation: landscape) {
  .game-screen {
    padding: 10px;
    gap: 10px;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .hack-progress {
    width: 100%;
    order: 1;
  }

  .code-display {
    width: 45%;
    order: 2;
  }

  .options-panel {
    width: 45%;
    order: 3;
  }

  .display-screen {
    padding: 10px;
  }

  .safe-keypad {
    padding: 10px;
  }

  .option-btn {
    padding: 8px 12px;
  }
}
</style>
