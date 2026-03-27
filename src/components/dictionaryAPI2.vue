<template>
  <div class="pronunciation-trainer q-pa-md">
    <div class="trainer-container">

      <!-- Заголовок -->
      <div class="text-center q-mb-lg">
        <h3 class="text-primary">🎤 Тренажер фраз</h3>
        <p>Слушай и повторяй целые фразы на английском</p>
      </div>

      <!-- Переключатель режимов -->
      <div class="mode-switch q-mb-md text-center">
        <q-btn-toggle
          v-model="mode"
          toggle-color="primary"
          :options="[
            { label: '📝 Слова', value: 'words' },
            { label: '💬 Фразы', value: 'phrases' }
          ]"
        />
      </div>

      <!-- Основная карточка -->
      <q-card class="word-card q-mb-lg">
        <q-card-section class="text-center">
          <!-- Текущий текст -->
          <div class="word-display">
            <div class="phrase-text">{{ currentItem.text }}</div>
            <div v-if="mode === 'words'" class="transcription text-grey-6">
              {{ currentItem.transcription }}
            </div>
            <div class="translation text-grey-7">
              {{ currentItem.translation }}
            </div>

            <!-- НОВОЕ: Сложность фразы -->
            <div v-if="mode === 'phrases'" class="difficulty-badge">
              <q-chip
                :color="getDifficultyColor(currentItem.difficulty)"
                text-color="white"
                size="sm"
              >
                {{ currentItem.difficulty }}
              </q-chip>
            </div>
          </div>

          <!-- Визуализация голоса -->
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
              @click="speakText"
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

          <!-- Результат сравнения -->
          <div v-if="comparisonResult" class="result-area q-mt-lg">
            <q-card :class="['result-card', comparisonResult.score > 70 ? 'good' : 'needs-work']">
              <q-card-section>
                <div class="text-center">
                  <q-icon :name="comparisonResult.score > 70 ? 'check_circle' : 'replay'" size="md" />

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

                  <!-- НОВОЕ: Детальный разбор фразы -->
                  <div v-if="comparisonResult.wordMatches" class="phrase-breakdown q-mt-md">
                    <div class="breakdown-title">Разбор фразы:</div>
                    <div class="words-breakdown">
                      <div
                        v-for="(word, idx) in comparisonResult.wordMatches"
                        :key="idx"
                        :class="['word-match', word.match ? 'correct' : 'incorrect']"
                      >
                        <span class="word-text">{{ word.expected }}</span>
                        <span v-if="!word.match && word.spoken" class="word-spoken">
                          → {{ word.spoken }}
                        </span>
                        <q-icon
                          :name="word.match ? 'check_circle' : 'cancel'"
                          size="sm"
                          class="word-icon"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Сравнение полных фраз -->
                  <div class="full-comparison q-mt-md">
                    <div class="row justify-center q-gutter-md">
                      <div class="text-center">
                        <div class="caption-label">Вы сказали:</div>
                        <div class="user-phrase">{{ comparisonResult.userText }}</div>
                      </div>
                      <div class="text-center">
                        <div class="caption-label">Нужно было:</div>
                        <div class="target-phrase">{{ comparisonResult.targetText }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- История попыток -->
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
                <span class="history-text">{{ attempt.userText }}</span>
                <span class="history-score">{{ attempt.score }}%</span>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Список для тренировки -->
      <div class="items-list">
        <div class="row items-center justify-between q-mb-md">
          <h5 class="q-my-none">
            {{ mode === 'words' ? 'Слова для тренировки' : 'Фразы для тренировки' }}
          </h5>
          <q-btn
            @click="addCustomItem"
            color="primary"
            flat
            icon="add"
            :label="mode === 'words' ? 'Добавить слово' : 'Добавить фразу'"
          />
        </div>

        <div class="items-chips">
          <q-chip
            v-for="item in currentItems"
            :key="item.text"
            :color="currentItem.text === item.text ? 'primary' : 'grey-3'"
            :text-color="currentItem.text === item.text ? 'white' : 'dark'"
            clickable
            @click="selectItem(item)"
            removable
            @remove="removeItem(item)"
          >
            {{ item.text }}
            <q-tooltip>{{ item.translation }}</q-tooltip>
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

    <!-- Диалог добавления -->
    <q-dialog v-model="addItemDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ mode === 'words' ? 'Добавить новое слово' : 'Добавить новую фразу' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newItem.text"
            :label="mode === 'words' ? 'Слово (английский)' : 'Фраза (английский)'"
            outlined
            class="q-mb-md"
            autogrow
          />
          <q-input
            v-if="mode === 'words'"
            v-model="newItem.transcription"
            label="Транскрипция (опционально)"
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="newItem.translation"
            label="Перевод"
            outlined
            class="q-mb-md"
            autogrow
          />
          <q-select
            v-if="mode === 'phrases'"
            v-model="newItem.difficulty"
            :options="['Легкая', 'Средняя', 'Сложная']"
            label="Сложность"
            outlined
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn flat label="Добавить" color="primary" @click="saveNewItem" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Режим: words или phrases
const mode = ref('phrases')

// Данные для слов
const wordsList = ref([
  { text: 'hello', transcription: '/həˈləʊ/', translation: 'привет', difficulty: 'Легкая' },
  { text: 'beautiful', transcription: '/ˈbjuːtɪfl/', translation: 'красивый', difficulty: 'Средняя' },
  { text: 'pronunciation', transcription: '/prəˌnʌnsiˈeɪʃn/', translation: 'произношение', difficulty: 'Сложная' }
])

// Данные для фраз (с твоим примером!)
const phrasesList = ref([
  {
    text: 'My collection of ducks is not very big yet',
    translation: 'Моя коллекция уток еще не очень большая',
    difficulty: 'Средняя'
  },
  {
    text: 'I love learning new languages',
    translation: 'Я люблю учить новые языки',
    difficulty: 'Легкая'
  },
  {
    text: 'The weather is beautiful today',
    translation: 'Сегодня прекрасная погода',
    difficulty: 'Легкая'
  },
  {
    text: 'Could you please help me with this task?',
    translation: 'Не могли бы вы помочь мне с этим заданием?',
    difficulty: 'Средняя'
  },
  {
    text: 'Despite the challenges, we managed to complete the project successfully',
    translation: 'Несмотря на трудности, нам удалось успешно завершить проект',
    difficulty: 'Сложная'
  }
])

// Текущий элемент
const currentItem = ref(phrasesList.value[0])

// Вычисляемый список в зависимости от режима
const currentItems = computed(() => {
  return mode.value === 'words' ? wordsList.value : phrasesList.value
})

// Состояние
const isSpeaking = ref(false)
const isRecording = ref(false)
const isProcessing = ref(false)
let recognition = null
let audioContext = null
let mediaStream = null
let analyser = null
let animationFrame = null

const voiceLevels = ref(Array(30).fill(5))
const interimTranscript = ref('')
const recentAttempts = ref([])
const comparisonResult = ref(null)

const stats = reactive({
  totalAttempts: 0,
  averageScore: 0,
  bestScore: 0,
  scores: []
})

const addItemDialog = ref(false)
const newItem = ref({
  text: '',
  transcription: '',
  translation: '',
  difficulty: 'Средняя'
})

// Следим за сменой режима
watch(mode, (newMode) => {
  if (newMode === 'words') {
    currentItem.value = wordsList.value[0]
  } else {
    currentItem.value = phrasesList.value[0]
  }
  comparisonResult.value = null
  recentAttempts.value = []
})

onMounted(() => {
  loadStats()
  loadData()
  initSpeechRecognition()
})

onBeforeUnmount(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  if (mediaStream) mediaStream.getTracks().forEach(track => track.stop())
})

// Инициализация распознавания
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
      interimTranscript.value = ''
      startVoiceVisualization()
    }

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interim = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interim += transcript
        }
      }

      if (interim) {
        interimTranscript.value = `🎙️ ${interim}`
      } else if (finalTranscript) {
        interimTranscript.value = `✅ ${finalTranscript}`
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
        message: 'Ошибка: ' + event.error,
        position: 'top'
      })
    }

    recognition.onend = () => {
      stopRecording()
    }
  }
}

// Визуализация голоса (та же, что и была)
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
        message: 'Говорите фразу...',
        position: 'top',
        timeout: 2000
      })
    }
  }
}

// Оценка фразы (улучшенная для целых предложений)
const evaluatePhrase = (spoken) => {
  const target = currentItem.value.text.toLowerCase()
  const userText = spoken.toLowerCase()

  // Очищаем от пунктуации
  const cleanUser = userText.replace(/[^\w\s]/g, '').trim()
  const cleanTarget = target.replace(/[^\w\s]/g, '').trim()

  // Общая схожесть
  const overallSimilarity = calculateSimilarity(cleanTarget, cleanUser)

  // Разбиваем на слова и сравниваем каждое
  const targetWords = cleanTarget.split(/\s+/)
  const userWords = cleanUser.split(/\s+/)

  const wordMatches = []
  let correctWords = 0

  for (let i = 0; i < targetWords.length; i++) {
    const expected = targetWords[i]
    const spokenWord = userWords[i] || ''
    const wordSimilarity = calculateSimilarity(expected, spokenWord)
    const isMatch = wordSimilarity > 0.7

    if (isMatch) correctWords++

    wordMatches.push({
      expected: expected,
      spoken: spokenWord,
      match: isMatch,
      similarity: wordSimilarity
    })
  }

  // Вычисляем итоговый балл (70% от общей схожести + 30% от точности слов)
  const wordAccuracy = correctWords / targetWords.length
  const finalScore = Math.round((overallSimilarity * 70 + wordAccuracy * 30))

  // Формируем обратную связь
  let feedback = ''
  if (finalScore >= 85) {
    feedback = '🎉 Идеально! Фраза прозвучала отлично!'
  } else if (finalScore >= 70) {
    feedback = '👍 Хорошо! Есть небольшие недочеты в произношении.'
  } else if (finalScore >= 50) {
    feedback = '📚 Неплохо! Обратите внимание на выделенные слова.'
  } else {
    feedback = '🔄 Попробуйте еще раз. Послушайте фразу и повторите.'
  }

  // Дополнительная обратная связь по ошибкам
  const mistakes = wordMatches.filter(w => !w.match)
  if (mistakes.length > 0 && mistakes.length <= 3) {
    feedback += ` Особое внимание уделите словам: ${mistakes.map(m => m.expected).join(', ')}.`
  }

  comparisonResult.value = {
    score: finalScore,
    feedback: feedback,
    userText: cleanUser,
    targetText: cleanTarget,
    wordMatches: wordMatches
  }

  // История
  recentAttempts.value.unshift({
    userText: cleanUser.length > 50 ? cleanUser.slice(0, 47) + '...' : cleanUser,
    score: finalScore,
    timestamp: new Date()
  })

  if (recentAttempts.value.length > 5) {
    recentAttempts.value.pop()
  }

  updateStats(finalScore)

  if (finalScore > 70) {
    $q.notify({ type: 'positive', message: feedback, position: 'top', timeout: 2000 })
  } else {
    $q.notify({ type: 'warning', message: feedback, position: 'top', timeout: 3000 })
  }

  stopRecording()
}

// Алгоритм сравнения (улучшенный)
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

const speakText = () => {
  isSpeaking.value = true
  const utterance = new SpeechSynthesisUtterance(currentItem.value.text)
  utterance.lang = 'en-US'
  utterance.rate = 0.8
  utterance.onend = () => { isSpeaking.value = false }
  utterance.onerror = () => { isSpeaking.value = false }
  speechSynthesis.speak(utterance)
}

const getDifficultyColor = (difficulty) => {
  if (difficulty === 'Легкая') return 'green'
  if (difficulty === 'Средняя') return 'orange'
  return 'red'
}

const updateStats = (score) => {
  stats.totalAttempts++
  stats.scores.push(score)
  const sum = stats.scores.reduce((a, b) => a + b, 0)
  stats.averageScore = Math.round(sum / stats.scores.length)
  if (score > stats.bestScore) stats.bestScore = score

  localStorage.setItem(`pronunciation_stats_${mode.value}`, JSON.stringify({
    totalAttempts: stats.totalAttempts,
    scores: stats.scores,
    bestScore: stats.bestScore
  }))
}

const loadStats = () => {
  const saved = localStorage.getItem(`pronunciation_stats_${mode.value}`)
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

const loadData = () => {
  const savedWords = localStorage.getItem('pronunciation_words')
  if (savedWords) wordsList.value = JSON.parse(savedWords)

  const savedPhrases = localStorage.getItem('pronunciation_phrases')
  if (savedPhrases) phrasesList.value = JSON.parse(savedPhrases)
}

const saveData = () => {
  localStorage.setItem('pronunciation_words', JSON.stringify(wordsList.value))
  localStorage.setItem('pronunciation_phrases', JSON.stringify(phrasesList.value))
}

const selectItem = (item) => {
  currentItem.value = item
  comparisonResult.value = null
  $q.notify({
    type: 'info',
    message: mode.value === 'words' ? `Слово: ${item.text}` : `Фраза: ${item.text.slice(0, 30)}...`,
    position: 'top',
    timeout: 1000
  })
}

const addCustomItem = () => {
  newItem.value = {
    text: '',
    transcription: '',
    translation: '',
    difficulty: 'Средняя'
  }
  addItemDialog.value = true
}

const saveNewItem = () => {
  if (!newItem.value.text || !newItem.value.translation) {
    $q.notify({ type: 'negative', message: 'Заполните текст и перевод', position: 'top' })
    return
  }

  const item = {
    text: newItem.value.text,
    translation: newItem.value.translation,
    difficulty: newItem.value.difficulty
  }

  if (mode.value === 'words') {
    item.transcription = newItem.value.transcription
    wordsList.value.push(item)
  } else {
    phrasesList.value.push(item)
  }

  saveData()
  addItemDialog.value = false

  $q.notify({ type: 'positive', message: 'Добавлено!', position: 'top' })
}

const removeItem = (item) => {
  $q.dialog({
    title: 'Удалить',
    message: `Удалить "${item.text.slice(0, 30)}..."?`,
    cancel: true
  }).onOk(() => {
    if (mode.value === 'words') {
      const index = wordsList.value.indexOf(item)
      if (index !== -1) wordsList.value.splice(index, 1)
    } else {
      const index = phrasesList.value.indexOf(item)
      if (index !== -1) phrasesList.value.splice(index, 1)
    }

    saveData()

    if (currentItem.value.text === item.text && currentItems.value.length > 0) {
      selectItem(currentItems.value[0])
    }

    $q.notify({ type: 'positive', message: 'Удалено', position: 'top' })
  })
}
</script>

<style scoped>
/* Стили из предыдущей версии + новые */

.phrase-text {
  font-size: 1.8rem;
  font-weight: bold;
  line-height: 1.3;
  margin-bottom: 10px;
  word-break: break-word;
}

@media (max-width: 600px) {
  .phrase-text {
    font-size: 1.4rem;
  }
}

.difficulty-badge {
  margin-top: 10px;
}

.phrase-breakdown {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 12px;
}

.breakdown-title {
  font-size: 0.85rem;
  margin-bottom: 8px;
  opacity: 0.9;
}

.words-breakdown {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.word-match {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.9rem;
}

.word-match.correct {
  background: rgba(76, 175, 80, 0.3);
  border: 1px solid #4caf50;
}

.word-match.incorrect {
  background: rgba(255, 152, 0, 0.3);
  border: 1px solid #ff9800;
}

.word-spoken {
  font-size: 0.8rem;
  opacity: 0.8;
}

.word-icon {
  font-size: 0.8rem;
}

.user-phrase, .target-phrase {
  font-size: 1rem;
  max-width: 250px;
  word-break: break-word;
}

.history-text {
  flex: 1;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mode-switch {
  background: white;
  border-radius: 8px;
  padding: 4px;
}

/* Остальные стили из предыдущей версии */
.word-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
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

.score-circle {
  width: 120px;
  height: 120px;
  margin: 15px auto;
}

.score-circle svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
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

.caption-chip {
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

.history-list {
  max-height: 150px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 5px;
  background: rgba(255, 255, 255, 0.1);
}

.history-item.good-attempt {
  border-left: 3px solid #4caf50;
}

.history-item.bad-attempt {
  border-left: 3px solid #ff9800;
}

.items-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
