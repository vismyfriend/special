<template>
  <div class="pronunciation-trainer q-pa-md">
    <div class="trainer-container">

      <!-- Заголовок -->
      <div class="text-center q-mb-lg">
        <h3 class="text-primary">🎤 Тренажер произношения</h3>
        <p>Слушай и повторяй английские слова</p>
      </div>

      <!-- Основная карточка слова -->
      <q-card class="word-card q-mb-lg">
        <q-card-section class="text-center">
          <!-- Текущее слово -->
          <div class="word-display">
            <div class="word-text">{{ currentWord.word }}</div>
            <div class="transcription text-grey-6">
              {{ currentWord.transcription }}
            </div>
            <div class="translation text-grey-7">
              {{ currentWord.translation }}
            </div>
          </div>

          <!-- НОВОЕ: Визуализация голоса в реальном времени -->
          <div v-if="isRecording" class="voice-visualizer q-mt-md">
            <div class="visualizer-bars">
              <div
                v-for="(level, idx) in voiceLevels"
                :key="idx"
                class="voice-bar"
                :style="{ height: level + 'px' }"
              ></div>
            </div>
            <div class="caption-area">
              <q-chip
                color="primary"
                text-color="white"
                icon="mic"
                class="caption-chip"
              >
                {{ interimTranscript || '🎙️ Слушаю...' }}
              </q-chip>
            </div>
          </div>

          <!-- Кнопки управления -->
          <div class="control-buttons q-gutter-md q-mt-lg">
            <q-btn
              @click="speakWord"
              color="primary"
              icon="volume_up"
              size="lg"
              round
              :loading="isSpeaking"
            >
              <q-tooltip>Слушать произношение</q-tooltip>
            </q-btn>

            <q-btn
              @click="startRecording"
              color="secondary"
              :icon="isRecording ? 'stop' : 'mic'"
              size="lg"
              round
              :loading="isProcessing"
              :class="{ 'recording-animation': isRecording }"
            >
              <q-tooltip>{{ isRecording ? 'Остановить запись' : 'Начать запись' }}</q-tooltip>
            </q-btn>
          </div>

          <!-- Результат сравнения с анимацией -->
          <div v-if="comparisonResult" class="result-area q-mt-lg">
            <q-card :class="['result-card', comparisonResult.score > 70 ? 'good' : 'needs-work']">
              <q-card-section>
                <div class="text-center">
                  <q-icon :name="comparisonResult.score > 70 ? 'check_circle' : 'replay'" size="md" />

                  <!-- Анимированный круговой индикатор -->
                  <div class="score-circle">
                    <svg viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="6"/>
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="white"
                        stroke-width="6"
                        stroke-dasharray="339.292"
                        :stroke-dashoffset="339.292 * (1 - comparisonResult.score / 100)"
                        stroke-linecap="round"
                        style="transition: stroke-dashoffset 1s ease"
                      />
                      <text x="60" y="70" text-anchor="middle" fill="white" font-size="24" font-weight="bold">
                        {{ comparisonResult.score }}%
                      </text>
                    </svg>
                  </div>

                  <div class="feedback">{{ comparisonResult.feedback }}</div>

                  <!-- НОВОЕ: Сравнение слов визуально -->
                  <div class="word-comparison q-mt-md">
                    <div class="row justify-center q-gutter-md">
                      <div class="text-center">
                        <div class="caption-label">Вы сказали:</div>
                        <div class="user-word">{{ comparisonResult.userText }}</div>
                      </div>
                      <div class="text-center">
                        <div class="caption-label">Нужно было:</div>
                        <div class="target-word">{{ comparisonResult.targetText }}</div>
                      </div>
                    </div>

                    <!-- НОВОЕ: Похожие буквы подсветка -->
                    <div class="letter-comparison q-mt-sm">
                      <div
                        v-for="(char, idx) in getLetterComparison()"
                        :key="idx"
                        :class="['letter', char.match ? 'match' : 'mismatch']"
                      >
                        {{ char.user || '?' }}
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- НОВОЕ: История попыток -->
          <div v-if="recentAttempts.length > 0" class="attempts-history q-mt-md">
            <q-separator class="q-mb-md" />
            <div class="text-left text-subtitle2">Последние попытки:</div>
            <div class="history-list">
              <div
                v-for="(attempt, idx) in recentAttempts"
                :key="idx"
                class="history-item"
                :class="attempt.score > 70 ? 'good-attempt' : 'bad-attempt'"
              >
                <q-icon :name="attempt.score > 70 ? 'check_circle' : 'cancel'" size="sm" />
                <span class="history-word">{{ attempt.userText }}</span>
                <span class="history-score">{{ attempt.score }}%</span>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Список слов (как было) -->
      <div class="words-list">
        <div class="row items-center justify-between q-mb-md">
          <h5 class="q-my-none">Слова для тренировки</h5>
          <q-btn
            @click="addCustomWord"
            color="primary"
            flat
            icon="add"
            label="Добавить слово"
          />
        </div>

        <div class="word-chips">
          <q-chip
            v-for="word in wordsList"
            :key="word.word"
            :color="currentWord.word === word.word ? 'primary' : 'grey-3'"
            :text-color="currentWord.word === word.word ? 'white' : 'dark'"
            clickable
            @click="selectWord(word)"
            removable
            @remove="removeWord(word)"
          >
            {{ word.word }}
            <q-tooltip>{{ word.translation }}</q-tooltip>
          </q-chip>
        </div>
      </div>

      <!-- Статистика -->
      <div class="stats q-mt-lg">
        <q-separator class="q-mb-md" />
        <div class="row q-gutter-md">
          <div class="col">
            <div class="stat-card text-center">
              <div class="stat-value">{{ stats.totalAttempts }}</div>
              <div class="stat-label">Всего попыток</div>
            </div>
          </div>
          <div class="col">
            <div class="stat-card text-center">
              <div class="stat-value">{{ stats.averageScore }}%</div>
              <div class="stat-label">Средний балл</div>
            </div>
          </div>
          <div class="col">
            <div class="stat-card text-center">
              <div class="stat-value">{{ stats.bestScore }}%</div>
              <div class="stat-label">Лучший результат</div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Диалог добавления слова (как был) -->
    <q-dialog v-model="addWordDialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Добавить новое слово</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="newWord.word"
            label="Слово (английский)"
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="newWord.transcription"
            label="Транскрипция (опционально)"
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="newWord.translation"
            label="Перевод"
            outlined
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn flat label="Добавить" color="primary" @click="saveNewWord" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Состояние
const currentWord = ref({
  word: 'hello',
  transcription: '/həˈləʊ/',
  translation: 'привет'
})

const isSpeaking = ref(false)
const isRecording = ref(false)
const isProcessing = ref(false)
let recognition = null
let audioContext = null
let mediaStream = null
let analyser = null
let animationFrame = null

// НОВОЕ: для визуализации голоса
const voiceLevels = ref(Array(30).fill(5))
const interimTranscript = ref('')
const recentAttempts = ref([])

// Остальные переменные как были
const wordsList = ref([
  { word: 'hello', transcription: '/həˈləʊ/', translation: 'привет' },
  { word: 'world', transcription: '/wɜːld/', translation: 'мир' },
  { word: 'beautiful', transcription: '/ˈbjuːtɪfl/', translation: 'красивый' },
  { word: 'pronunciation', transcription: '/prəˌnʌnsiˈeɪʃn/', translation: 'произношение' },
  { word: 'challenge', transcription: '/ˈtʃælɪndʒ/', translation: 'вызов' }
])

const stats = reactive({
  totalAttempts: 0,
  averageScore: 0,
  bestScore: 0,
  scores: []
})

const comparisonResult = ref(null)
const addWordDialog = ref(false)
const newWord = ref({ word: '', transcription: '', translation: '' })

onMounted(() => {
  loadStats()
  loadWords()
  initSpeechRecognition()
})

onBeforeUnmount(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
  }
})

// Инициализация распознавания речи с промежуточными результатами
const initSpeechRecognition = () => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = true  // ВКЛЮЧАЕМ промежуточные результаты!
    recognition.maxAlternatives = 3

    recognition.onstart = () => {
      isRecording.value = true
      isProcessing.value = true
      interimTranscript.value = ''
      startVoiceVisualization()
    }

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interim = ''

      // Собираем результаты
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interim += transcript
        }
      }

      // Показываем промежуточный текст (captions)
      if (interim) {
        interimTranscript.value = `🎙️ ${interim}`
      } else if (finalTranscript) {
        interimTranscript.value = `✅ ${finalTranscript}`
      }

      // Если есть финальный результат
      if (finalTranscript) {
        evaluatePronunciation(finalTranscript)
      }
    }

    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error)
      stopRecording()
      $q.notify({
        type: 'negative',
        message: 'Ошибка: ' + event.error,
        position: 'top'
      })
    }

    recognition.onend = () => {
      stopRecording()
    }
  }
}

// Визуализация голоса
const startVoiceVisualization = async () => {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(mediaStream)
    source.connect(analyser)
    analyser.fftSize = 256

    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    const updateVisualizer = () => {
      if (!isRecording.value) return

      analyser.getByteFrequencyData(dataArray)

      // Вычисляем уровень громкости для каждого бара
      const levels = []
      const step = Math.floor(dataArray.length / 30)

      for (let i = 0; i < 30; i++) {
        let sum = 0
        for (let j = 0; j < step; j++) {
          sum += dataArray[i * step + j] || 0
        }
        const avg = sum / step
        const height = Math.min(50, Math.max(5, avg / 5))
        levels.push(height)
      }

      voiceLevels.value = levels
      animationFrame = requestAnimationFrame(updateVisualizer)
    }

    updateVisualizer()
  } catch (error) {
    console.error('Microphone error:', error)
    $q.notify({
      type: 'negative',
      message: 'Нет доступа к микрофону',
      position: 'top'
    })
  }
}

const stopRecording = () => {
  isRecording.value = false
  isProcessing.value = false
  interimTranscript.value = ''

  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
    mediaStream = null
  }

  if (audioContext) {
    audioContext.close()
    audioContext = null
  }
}

const startRecording = () => {
  if (isRecording.value) {
    if (recognition) recognition.stop()
  } else {
    if (recognition) {
      comparisonResult.value = null
      recognition.start()

      $q.notify({
        type: 'info',
        message: 'Говорите... Субтитры появятся на экране',
        position: 'top',
        timeout: 2000
      })
    }
  }
}

// Оценка произношения (улучшенная)
const evaluatePronunciation = (spoken) => {
  const target = currentWord.value.word.toLowerCase()
  const userText = spoken.toLowerCase()

  // Убираем пунктуацию и лишние пробелы
  const cleanUser = userText.replace(/[^\w\s]/g, '').trim()
  const cleanTarget = target.replace(/[^\w\s]/g, '').trim()

  // Вычисляем схожесть
  const similarity = calculateSimilarity(cleanTarget, cleanUser)
  const score = Math.round(similarity * 100)

  // Формируем обратную связь
  let feedback = ''
  if (score >= 90) {
    feedback = '🎉 Превосходно! Идеальное произношение!'
  } else if (score >= 70) {
    feedback = '👍 Хорошо! Немного потренируйтесь еще.'
  } else if (score >= 50) {
    feedback = '📚 Неплохо! Послушайте еще раз и повторите.'
  } else {
    feedback = '🔄 Попробуйте еще раз. Внимательно слушайте произношение.'
  }

  // Сохраняем результат
  comparisonResult.value = {
    score: score,
    feedback: feedback,
    userText: cleanUser,
    targetText: cleanTarget
  }

  // Добавляем в историю
  recentAttempts.value.unshift({
    userText: cleanUser,
    score: score,
    timestamp: new Date()
  })

  // Оставляем только последние 5 попыток
  if (recentAttempts.value.length > 5) {
    recentAttempts.value.pop()
  }

  // Обновляем статистику
  updateStats(score)

  // Визуальная обратная связь
  if (score > 70) {
    $q.notify({
      type: 'positive',
      message: feedback,
      position: 'top',
      timeout: 2000
    })
  } else {
    $q.notify({
      type: 'warning',
      message: feedback,
      position: 'top',
      timeout: 3000
    })
  }

  stopRecording()
}

// Алгоритм сравнения (как был)
const calculateSimilarity = (str1, str2) => {
  if (str1 === str2) return 1

  str1 = str1.toLowerCase().trim()
  str2 = str2.toLowerCase().trim()

  const len1 = str1.length
  const len2 = str2.length

  if (len1 === 0 || len2 === 0) return 0

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

// НОВОЕ: Сравнение букв для визуализации
const getLetterComparison = () => {
  if (!comparisonResult.value) return []

  const target = comparisonResult.value.targetText
  const user = comparisonResult.value.userText
  const maxLen = Math.max(target.length, user.length)
  const result = []

  for (let i = 0; i < maxLen; i++) {
    result.push({
      user: user[i] || '',
      target: target[i] || '',
      match: user[i] === target[i]
    })
  }

  return result
}

const speakWord = () => {
  isSpeaking.value = true
  const utterance = new SpeechSynthesisUtterance(currentWord.value.word)
  utterance.lang = 'en-US'
  utterance.rate = 0.8
  utterance.onend = () => { isSpeaking.value = false }
  utterance.onerror = () => { isSpeaking.value = false }
  speechSynthesis.speak(utterance)
}

const updateStats = (score) => {
  stats.totalAttempts++
  stats.scores.push(score)
  const sum = stats.scores.reduce((a, b) => a + b, 0)
  stats.averageScore = Math.round(sum / stats.scores.length)
  if (score > stats.bestScore) stats.bestScore = score

  localStorage.setItem('pronunciation_stats', JSON.stringify({
    totalAttempts: stats.totalAttempts,
    scores: stats.scores,
    bestScore: stats.bestScore
  }))
}

const loadStats = () => {
  const saved = localStorage.getItem('pronunciation_stats')
  if (saved) {
    const data = JSON.parse(saved)
    stats.totalAttempts = data.totalAttempts
    stats.scores = data.scores
    stats.bestScore = data.bestScore
    if (stats.scores.length > 0) {
      const sum = stats.scores.reduce((a, b) => a + b, 0)
      stats.averageScore = Math.round(sum / stats.scores.length)
    }
  }
}

const loadWords = () => {
  const saved = localStorage.getItem('pronunciation_words')
  if (saved) wordsList.value = JSON.parse(saved)
}

const saveWords = () => {
  localStorage.setItem('pronunciation_words', JSON.stringify(wordsList.value))
}

const selectWord = (word) => {
  currentWord.value = word
  comparisonResult.value = null
  $q.notify({ type: 'info', message: `Слово: ${word.word}`, position: 'top', timeout: 1000 })
}

const addCustomWord = () => { addWordDialog.value = true }
const saveNewWord = () => {
  if (!newWord.value.word || !newWord.value.translation) {
    $q.notify({ type: 'negative', message: 'Заполните слово и перевод', position: 'top' })
    return
  }
  wordsList.value.push({
    word: newWord.value.word.toLowerCase(),
    transcription: newWord.value.transcription || '',
    translation: newWord.value.translation
  })
  saveWords()
  addWordDialog.value = false
  newWord.value = { word: '', transcription: '', translation: '' }
  $q.notify({ type: 'positive', message: 'Слово добавлено!', position: 'top' })
}

const removeWord = (word) => {
  $q.dialog({
    title: 'Удалить слово',
    message: `Удалить "${word.word}" из списка?`,
    cancel: true
  }).onOk(() => {
    const index = wordsList.value.indexOf(word)
    if (index !== -1) {
      wordsList.value.splice(index, 1)
      saveWords()
      if (currentWord.value.word === word.word && wordsList.value.length > 0) {
        selectWord(wordsList.value[0])
      }
      $q.notify({ type: 'positive', message: 'Слово удалено', position: 'top' })
    }
  })
}
</script>

<style scoped>
/* Все стили как были, плюс новые: */

.voice-visualizer {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 15px;
}

.visualizer-bars {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
  height: 60px;
  margin-bottom: 15px;
}

.voice-bar {
  width: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: height 0.05s ease;
}

.caption-area {
  text-align: center;
  min-height: 40px;
}

.caption-chip {
  font-size: 1.1rem;
  padding: 8px 16px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.score-circle {
  width: 120px;
  height: 120px;
  margin: 15px auto;
  position: relative;
}

.score-circle svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.word-comparison {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
}

.caption-label {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-bottom: 5px;
}

.user-word, .target-word {
  font-size: 1.2rem;
  font-weight: bold;
}

.letter-comparison {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 10px;
}

.letter {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1rem;
}

.letter.match {
  background: #4caf50;
  color: white;
}

.letter.mismatch {
  background: #ff9800;
  color: white;
  opacity: 0.7;
}

.history-list {
  max-height: 150px;
  overflow-y: auto;
  margin-top: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 5px;
  background: #f5f5f5;
}

.history-item.good-attempt {
  border-left: 3px solid #4caf50;
}

.history-item.bad-attempt {
  border-left: 3px solid #ff9800;
}

.history-word {
  flex: 1;
  font-family: monospace;
}

.history-score {
  font-weight: bold;
  font-size: 0.9rem;
}

/* Остальные стили из предыдущей версии */
.word-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
}

.word-text {
  font-size: 3rem;
  font-weight: bold;
}

.recording-animation {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
}

.result-card.good {
  background: #4caf50;
  color: white;
}

.result-card.needs-work {
  background: #ff9800;
  color: white;
}
</style>
