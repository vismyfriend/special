<template>
  <div class="pronunciation-trainer q-pa-md">
    <div class="trainer-container">

      <!-- Заголовок -->
      <div class="text-center q-mb-lg">
        <h3 class="text-primary">🎤 Тренажер фраз</h3>
        <p>Слушай, повторяй и учись произносить правильно!</p>
      </div>

      <!-- Основная карточка -->
      <q-card class="word-card q-mb-lg">
        <q-card-section class="text-center">
          <!-- Выбор голоса (4 варианта) -->
          <div class="voice-selector q-mb-md">
            <div class="row justify-center q-gutter-sm">
              <q-btn
                v-for="voice in voiceOptions"
                :key="voice.value"
                :color="selectedVoice === voice.value ? 'primary' : 'grey-3'"
                :text-color="selectedVoice === voice.value ? 'white' : 'dark'"
                :label="voice.label"
                @click="selectVoice(voice.value)"
                dense
                no-caps
              />
            </div>
          </div>
          <!-- Чекбокс Live Captions -->
          <div class="live-captions-toggle q-mb-md">
            <q-checkbox
              v-model="liveCaptionsEnabled"
              label="🎤 Live Captions"
              color="primary"
              size="lg"
            />
            <span class="text-caption q-ml-sm">Показывать распознаваемые слова в реальном времени</span>
          </div>

          <!-- Live Captions блок -->
          <div v-if="liveCaptionsEnabled && liveWords.length > 0" class="live-captions q-mt-md">
            <div class="caption-title text-subtitle2 q-mb-sm">🎯 Распознанные слова:</div>
            <div class="words-container">
              <q-chip
                v-for="(word, idx) in liveWords"
                :key="idx"
                :color="getWordColor(word.confidence)"
                text-color="white"
                size="md"
                class="word-chip"
              >
                {{ word.text }}
                <q-tooltip>Уверенность: {{ Math.round(word.confidence * 100) }}%</q-tooltip>
              </q-chip>
            </div>
          </div>

          <!-- Текущая фраза -->
          <div class="word-display">
            <div class="phrase-text">{{ currentPhrase.text }}</div>
<!--            <div class="phrase-text">{{ comparisonResult.userText }}</div>-->
            <div class="translation text-grey-7 q-mt-sm">
              {{ currentPhrase.translation }}
            </div>
            <!-- Что сказал пользователь (если есть результат) -->
            <div v-if="comparisonResult && comparisonResult.detailedWords" class="user-phrase-display q-mt-md">
              <div class="caption-label text-grey-6">Вы сказали:</div>
              <div class="user-phrase-text">
                <template v-for="(word, wordIdx) in comparisonResult.detailedWords" :key="wordIdx">
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
                  <span v-if="wordIdx < comparisonResult.detailedWords.length - 1" class="user-space"> </span>
                </template>
              </div>            </div>


            <div class="difficulty-badge q-mt-sm">
              <q-chip
                :color="getDifficultyColor(currentPhrase.difficulty)"
                text-color="white"
                size="sm"
              >
                {{ currentPhrase.difficulty }}
              </q-chip>
            </div>
          </div>

          <!-- Визуализация голоса для записи -->
          <div v-if="isRecognitionRecording || isSimpleRecording" class="voice-visualizer q-mt-md">
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
                🎙️ {{ isSimpleRecording ? `Запись... (${recordingTimer} сек.)` : 'Слушаю...' }}
              </q-chip>
            </div>
          </div>

          <!-- Кнопки управления -->
          <div class="control-buttons q-gutter-md q-mt-lg">
            <!-- Основные кнопки для работы с фразой -->
            <q-btn
              @click="speakPhrase"
              color="primary"
              icon="volume_up"
              size="lg"
              round
              :loading="isSpeaking"
            >
              <q-tooltip>Слушать произношение</q-tooltip>
            </q-btn>

            <q-btn
              @click="toggleRecognitionRecording"
              color="secondary"
              :icon="isRecognitionRecording ? 'stop' : 'compare'"
              size="lg"
              round
              :loading="isProcessing"
              :class="{ 'recording-animation': isRecognitionRecording }"
            >
              <q-tooltip>{{ isRecognitionRecording ? 'Остановить запись' : 'Начать запись для сравнения' }}</q-tooltip>
            </q-btn>

            <!-- Дополнительные кнопки для простой записи и прослушивания -->
            <q-btn
              @click="toggleSimpleRecording"
              color="amber"
              :icon="isSimpleRecording ? 'stop' : 'fiber_manual_record'"
              size="lg"
              round
              :class="{ 'recording-animation': isSimpleRecording }"
            >
              <q-tooltip>{{ isSimpleRecording ? 'Остановить запись' : 'Записать свой голос 10 секунд' }}</q-tooltip>
            </q-btn>

            <q-btn
              v-if="lastRecordingUrl"
              @click="playLastRecording"
              color="info"
              icon="play_arrow"
              size="lg"
              round
            >
              <q-tooltip>Прослушать последнюю запись</q-tooltip>
            </q-btn>

            <!-- Пятая кнопка - сравнить запись -->
            <q-btn
              @click="compareWithRecording"
              color="purple"
              icon="compare_arrows"
              size="lg"
              round
              :disable="!lastRecordingUrl || isProcessing"
              :loading="isProcessing"
            >
              <q-tooltip>Сравнить последнюю запись с фразой</q-tooltip>
            </q-btn>
          </div>

          <!-- Результат сравнения с детальным разбором по буквам -->
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

                  <!-- Детальный разбор с выделением букв -->
                  <div v-if="comparisonResult.detailedWords" class="detailed-breakdown q-mt-md">
                    <div class="breakdown-title">Разбор произношения:</div>
                    <div class="words-breakdown">
                      <div
                        v-for="(word, wordIdx) in comparisonResult.detailedWords"
                        :key="wordIdx"
                        class="word-analysis"
                      >
                        <div class="target-word">{{ word.expected }}</div>
                        <div class="spoken-word">
                          <span v-for="(char, charIdx) in word.expectedChars" :key="charIdx" :class="{'error-char': word.errors && word.errors.includes(charIdx)}">
                            {{ char }}
                          </span>
                        </div>
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

      <!-- Список фраз -->
      <div class="items-list">
        <div class="row items-center justify-between q-mb-md">
          <h5 class="q-my-none">Фразы для тренировки</h5>
          <q-btn
            @click="addCustomPhrase"
            color="primary"
            flat
            icon="add"
            label="Добавить фразу"
          />
        </div>

        <div class="items-chips">
          <q-chip
            v-for="phrase in phrasesList"
            :key="phrase.text"
            :color="currentPhrase.text === phrase.text ? 'primary' : 'grey-3'"
            :text-color="currentPhrase.text === phrase.text ? 'white' : 'dark'"
            clickable
            @click="selectPhrase(phrase)"
            removable
            @remove="removePhrase(phrase)"
          >
            {{ phrase.text.length > 40 ? phrase.text.slice(0, 37) + '...' : phrase.text }}
            <q-tooltip>{{ phrase.translation }}</q-tooltip>
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

    <!-- Диалог добавления фразы -->
    <q-dialog v-model="addPhraseDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Добавить новую фразу</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newPhrase.text"
            label="Фраза (английский)"
            outlined
            class="q-mb-md"
            autogrow
          />
          <q-input
            v-model="newPhrase.translation"
            label="Перевод"
            outlined
            class="q-mb-md"
            autogrow
          />
          <q-select
            v-model="newPhrase.difficulty"
            :options="['Легкая', 'Средняя', 'Сложная']"
            label="Сложность"
            outlined
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn flat label="Добавить" color="primary" @click="saveNewPhrase" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()


// Live Captions
const liveCaptionsEnabled = ref(false)
const liveWords = ref([])
let lastFinalTranscript = ''

// --- Данные для фраз ---
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

const currentPhrase = ref(phrasesList.value[0])

// --- Настройки голосов (4 варианта) ---
const voiceOptions = [
  { label: '👨 Дэниэл', value: 'daniel', description: 'Мужской, четкий' },
  { label: '👩 Саманта', value: 'samantha', description: 'Женский, мягкий' },
  { label: '👨 Алекс', value: 'alex', description: 'Мужской, глубокий' },
  { label: '👨 Arthur', value: 'arthur', description: 'Мужской, глубокий' },
  { label: '👨 albert', value: 'albert', description: 'Мужской, глубокий' },
  { label: '👩 Виктория', value: 'victoria', description: 'Женский, выразительный' }
]

const selectedVoice = ref('albert')
let availableVoices = []
let currentVoice = null

// Состояние для распознавания
const isSpeaking = ref(false)
const isRecognitionRecording = ref(false)
const isProcessing = ref(false)
let recognition = null

// Состояние для простой записи
const isSimpleRecording = ref(false)
let simpleMediaRecorder = null
let simpleMediaStream = null
let simpleAudioChunks = []
let simpleRecordingTimer = null

// Общие элементы для визуализации
let audioContext = null
let analyser = null
let animationFrame = null
let currentVisualizationStream = null

const voiceLevels = ref(Array(30).fill(5))
const recordingTimer = ref(0)
const lastRecordingUrl = ref(null)
const recentAttempts = ref([])
const comparisonResult = ref(null)

const stats = reactive({
  totalAttempts: 0,
  averageScore: 0,
  bestScore: 0,
  scores: []
})

const addPhraseDialog = ref(false)
const newPhrase = ref({
  text: '',
  translation: '',
  difficulty: 'Средняя'
})

// --- Функции для работы с голосом ---
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

const selectVoice = (voiceName) => {
  selectedVoice.value = voiceName
  updateSelectedVoice()
  $q.notify({
    type: 'info',
    message: `Выбран голос: ${voiceOptions.find(v => v.value === voiceName)?.label}`,
    position: 'top',
    timeout: 1500
  })
}

const updateSelectedVoice = () => {
  if (!availableVoices.length) return

  if (selectedVoice.value === 'default') {
    currentVoice = null
    console.log('Using default browser voice')
    return
  }

  const voiceSearchMap = {
    daniel: ['Daniel', 'Google UK English Male'],
    samantha: ['Samantha', 'Google UK English Female'],
    arthur: ['Arthur', 'Google US English'],
    alex: ['alex', 'Google US English'],
    albert: ['albert'],
    victoria: ['Karen', 'Catherine', 'Martha']
  }

  const searchTerms = voiceSearchMap[selectedVoice.value] || ['english']
  console.log(`🔍 Ищем для ${selectedVoice.value}:`, searchTerms)

  let foundVoice = availableVoices.find(voice =>
    searchTerms.some(term => voice.name.toLowerCase().includes(term.toLowerCase()))
  )

  if (foundVoice) {
    console.log(`✅ Найден голос: ${foundVoice.name}`)
  } else {
    console.log(`❌ Не найдено совпадений, ищем любой английский`)
    foundVoice = availableVoices.find(voice => voice.lang.startsWith('en'))
    console.log(`🔄 Fallback голос: ${foundVoice?.name}`)
  }

  currentVoice = foundVoice
}

const speakPhrase = () => {
  // Для default не проверяем currentVoice
  if (selectedVoice.value !== 'default' && !currentVoice) {
    $q.notify({ type: 'warning', message: 'Голос еще не загружен, попробуйте позже' })
    return
  }

  isSpeaking.value = true
  const utterance = new SpeechSynthesisUtterance(currentPhrase.value.text)
  utterance.lang = 'en-US'
  utterance.rate = 0.8

  // Если выбран не default, устанавливаем конкретный голос
  if (selectedVoice.value !== 'default' && currentVoice) {
    utterance.voice = currentVoice
    console.log('🔊 ВЫБРАН ГОЛОС:', currentVoice.name)
    console.log('🔊 Язык:', currentVoice.lang)
    console.log('🔊 Локальный:', currentVoice.localService)
  } else {
    console.log('🔊 Используется голос ПО УМОЛЧАНИЮ (без указания)')
  }

  utterance.onend = () => { isSpeaking.value = false }
  utterance.onerror = () => { isSpeaking.value = false }
  window.speechSynthesis.speak(utterance)
}

// --- Сравнение записанного аудио с целевой фразой ---
const compareWithRecording = async () => {
  if (!lastRecordingUrl.value) {
    $q.notify({
      type: 'warning',
      message: 'Сначала запишите свой голос',
      position: 'top',
      timeout: 2000
    })
    return
  }

  if (!currentPhrase.value.text) {
    $q.notify({
      type: 'warning',
      message: 'Нет целевой фразы для сравнения',
      position: 'top',
      timeout: 2000
    })
    return
  }

  isProcessing.value = true

  try {
    // Получаем аудио blob из URL
    const response = await fetch(lastRecordingUrl.value)
    const audioBlob = await response.blob()

    // Создаем новый экземпляр SpeechRecognition
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    if (!SpeechRecognition) {
      throw new Error('Распознавание речи не поддерживается')
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    // Создаем временный URL для аудио
    const audioUrl = URL.createObjectURL(audioBlob)

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      console.log('Распознанный текст из записи:', transcript)

      // Сравниваем с целевой фразой
      evaluatePhrase(transcript)

      URL.revokeObjectURL(audioUrl)
    }

    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error)
      $q.notify({
        type: 'negative',
        message: 'Ошибка распознавания речи из записи: ' + event.error,
        position: 'top',
        timeout: 3000
      })
      URL.revokeObjectURL(audioUrl)
      isProcessing.value = false
    }

    recognition.onend = () => {
      isProcessing.value = false
    }

    // Запускаем распознавание
    recognition.start()

    // Воспроизводим записанное аудио через распознавание
    const audio = new Audio(audioUrl)
    audio.play()

    audio.onended = () => {
      setTimeout(() => {
        if (recognition) recognition.stop()
      }, 1000)
    }

    $q.notify({
      type: 'info',
      message: 'Анализ записи...',
      position: 'top',
      timeout: 1500
    })

  } catch (error) {
    console.error('Error comparing recording:', error)
    $q.notify({
      type: 'negative',
      message: 'Ошибка при сравнении записи: ' + error.message,
      position: 'top',
      timeout: 3000
    })
    isProcessing.value = false
  }
}
const getWordColor = (confidence) => {
  if (confidence > 0.85) return 'primary'
  if (confidence > 0.5) return 'warning'
  return 'primary'
}

// Функция для преобразования первой буквы в заглавную
const capitalizeFirstLetter = (text) => {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// --- Функции для распознавания (основная логика) ---
const initSpeechRecognition = () => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = true
    recognition.maxAlternatives = 3

    recognition.onstart = () => {
      isRecognitionRecording.value = true
      isProcessing.value = true
      startVisualizationForRecognition()
    }

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interimWords = []

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0].transcript
        const confidence = result[0].confidence || 0.8

        if (result.isFinal) {
          finalTranscript += transcript
          lastFinalTranscript = transcript
        } else {
          // Промежуточные результаты - добавляем слова
          const words = transcript.split(/\s+/)
          words.forEach(word => {
            if (word.trim()) {
              interimWords.push({
                text: word.trim(),
                confidence: confidence,
                isInterim: true
              })
            }
          })
        }
      }

      // Обновляем Live Captions если включены
      if (liveCaptionsEnabled.value) {
        // Показываем промежуточные слова
        if (interimWords.length > 0) {
          liveWords.value = interimWords.map(w => ({
            text: w.text,
            confidence: w.confidence,
            isInterim: true
          }))
        }
        // Если есть финальный текст, добавляем его как отдельное слово
        else if (finalTranscript && finalTranscript !== lastFinalTranscript) {
          const finalWords = finalTranscript.split(/\s+/)
          liveWords.value = finalWords.map(word => ({
            text: word.trim(),
            confidence: 0.95,
            isInterim: false
          }))

          // Автоматически скроллим к новым словам
          setTimeout(() => {
            const container = document.querySelector('.words-container')
            if (container) {
              container.scrollTop = container.scrollHeight
            }
          }, 100)
        }
      }

      if (finalTranscript) {
        evaluatePhrase(finalTranscript)
        // Очищаем live слова через 3 секунды после финального результата
        // setTimeout(() => {
        //   if (liveCaptionsEnabled.value && liveWords.value.length > 0) {
        //     liveWords.value = []
        //   }
        // }, 3000)
      }
    }

    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error)
      stopRecognitionRecording()
      $q.notify({
        type: 'negative',
        message: 'Ошибка распознавания: ' + event.error,
        position: 'top'
      })
    }

    recognition.onend = () => {
      stopRecognitionRecording()
    }
  } else {
    $q.notify({ type: 'negative', message: 'Ваш браузер не поддерживает распознавание речи', position: 'top' })
  }
}

const startVisualizationForRecognition = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    currentVisualizationStream = stream
    startVoiceVisualization(stream)
  } catch (error) {
    console.error('Error getting mic for visualization:', error)
  }
}

const toggleRecognitionRecording = () => {
  if (isRecognitionRecording.value) {
    if (recognition) recognition.stop()
  } else {
    if (recognition) {
      comparisonResult.value = null
      recognition.start()
      $q.notify({
        type: 'info',
        message: 'Говорите фразу... (пауза автоматически остановит запись)',
        position: 'top',
        timeout: 2000
      })
    }
  }
}

const stopRecognitionRecording = () => {
  isRecognitionRecording.value = false
  isProcessing.value = false
  stopVoiceVisualization()
  if (currentVisualizationStream) {
    currentVisualizationStream.getTracks().forEach(track => track.stop())
    currentVisualizationStream = null
  }
}

// --- Простая запись с возможностью остановки ---
const toggleSimpleRecording = async () => {
  if (isSimpleRecording.value) {
    // Останавливаем запись
    if (simpleMediaRecorder && simpleMediaRecorder.state === 'recording') {
      simpleMediaRecorder.stop()
    }
    if (simpleRecordingTimer) {
      clearInterval(simpleRecordingTimer)
      simpleRecordingTimer = null
    }
  } else {
    // Начинаем новую запись
    await startSimpleRecording()
  }
}

const startSimpleRecording = async () => {
  try {
    simpleMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })

    currentVisualizationStream = simpleMediaStream
    startVoiceVisualization(simpleMediaStream)

    simpleAudioChunks = []
    simpleMediaRecorder = new MediaRecorder(simpleMediaStream)

    simpleMediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        simpleAudioChunks.push(event.data)
      }
    }

    simpleMediaRecorder.onstop = () => {
      const audioBlob = new Blob(simpleAudioChunks, { type: 'audio/wav' })
      if (lastRecordingUrl.value) {
        URL.revokeObjectURL(lastRecordingUrl.value)
      }
      lastRecordingUrl.value = URL.createObjectURL(audioBlob)

      stopVoiceVisualization()

      if (simpleMediaStream) {
        simpleMediaStream.getTracks().forEach(track => track.stop())
        simpleMediaStream = null
      }
      currentVisualizationStream = null

      isSimpleRecording.value = false
      recordingTimer.value = 0

      $q.notify({
        type: 'positive',
        message: 'Запись завершена! Теперь можно прослушать.',
        position: 'top',
        timeout: 2000
      })
    }

    simpleMediaRecorder.start()
    isSimpleRecording.value = true

    recordingTimer.value = 10
    simpleRecordingTimer = setInterval(() => {
      if (recordingTimer.value <= 1) {
        if (simpleMediaRecorder && simpleMediaRecorder.state === 'recording') {
          simpleMediaRecorder.stop()
        }
        if (simpleRecordingTimer) {
          clearInterval(simpleRecordingTimer)
          simpleRecordingTimer = null
        }
      } else {
        recordingTimer.value--
      }
    }, 1000)

  } catch (error) {
    console.error('Error starting simple recording:', error)
    $q.notify({ type: 'negative', message: 'Нет доступа к микрофону', position: 'top' })
    isSimpleRecording.value = false
  }
}

const playLastRecording = () => {
  if (lastRecordingUrl.value) {
    const audio = new Audio(lastRecordingUrl.value)
    audio.play()
    $q.notify({
      type: 'info',
      message: 'Воспроизведение записи...',
      position: 'top',
      timeout: 1000
    })
  }
}

// --- Визуализация голоса ---
const startVoiceVisualization = (stream) => {
  if (!stream) return

  if (audioContext) {
    audioContext.close()
  }

  audioContext = new (window.AudioContext || window.webkitAudioContext)()
  analyser = audioContext.createAnalyser()
  const source = audioContext.createMediaStreamSource(stream)
  source.connect(analyser)
  analyser.fftSize = 256

  const dataArray = new Uint8Array(analyser.frequencyBinCount)

  const updateVisualizer = () => {
    if (!isRecognitionRecording.value && !isSimpleRecording.value) return
    if (!analyser) return

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
}

const stopVoiceVisualization = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
  if (audioContext) {
    audioContext.close()
    audioContext = null
  }
  analyser = null
  voiceLevels.value = Array(30).fill(5)
}

// --- Функция для выделения ошибок в буквах ---
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

// --- Оценка фразы ---
const evaluatePhrase = (spoken) => {
  const target = currentPhrase.value.text.toLowerCase()
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
      userChars: spokenWord.split('') // Добавляем символы, которые сказал пользователь

    })
  }

  const wordAccuracy = correctWords / targetWords.length
  const finalScore = Math.round((overallSimilarity * 70 + wordAccuracy * 30))

  let feedback = ''
  if (finalScore >= 95) {
    feedback = '🏆 Тебя поймут на 100% ! Винсент доволен!'
  } else if (finalScore >= 85) {
    feedback = '🌟 Звучит хорошо, почти все понятно'
  } else if (finalScore >= 75) {
    feedback = '👍 Ну... в принципе понятно... Repeat please.'
  } else if (finalScore >= 65) {
    feedback = '📚 Немного не расслышал вас, say it again.'
  } else if (finalScore >= 50) {
    feedback = '🎯 Чего-то понятно, а чего-то нет...'
  } else if (finalScore >= 35) {
    feedback = '🔄 I didn`t get it. Say faster'
  } else {
    feedback = '💪 Whaaaat ?! Вообще ничего непонятно.'
  }

  comparisonResult.value = {
    score: finalScore,
    feedback: feedback,
    userText: cleanUser,
    targetText: cleanTarget,
    detailedWords: detailedWords
  }

  recentAttempts.value.unshift({
    userText: cleanUser.length > 50 ? cleanUser.slice(0, 47) + '...' : cleanUser,
    score: finalScore,
    timestamp: new Date()
  })

  if (recentAttempts.value.length > 5) {
    recentAttempts.value.pop()
  }

  updateStats(finalScore)

  $q.notify({
    type: finalScore > 70 ? 'positive' : 'warning',
    message: feedback,
    position: 'top',
    timeout: 3000
  })
}

// --- Алгоритм сравнения строк ---
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

// --- Вспомогательные функции ---
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

const loadData = () => {
  const savedPhrases = localStorage.getItem('pronunciation_phrases')
  if (savedPhrases) phrasesList.value = JSON.parse(savedPhrases)
}

const saveData = () => {
  localStorage.setItem('pronunciation_phrases', JSON.stringify(phrasesList.value))
}

const selectPhrase = (phrase) => {
  currentPhrase.value = phrase
  comparisonResult.value = null
  $q.notify({
    type: 'info',
    message: `Фраза: ${phrase.text.slice(0, 30)}...`,
    position: 'top',
    timeout: 1000
  })
}

const addCustomPhrase = () => {
  newPhrase.value = { text: '', translation: '', difficulty: 'Средняя' }
  addPhraseDialog.value = true
}

const saveNewPhrase = () => {
  if (!newPhrase.value.text || !newPhrase.value.translation) {
    $q.notify({ type: 'negative', message: 'Заполните текст и перевод', position: 'top' })
    return
  }
  phrasesList.value.push({ ...newPhrase.value })
  saveData()
  addPhraseDialog.value = false
  $q.notify({ type: 'positive', message: 'Фраза добавлена!', position: 'top' })
}

const removePhrase = (phrase) => {
  $q.dialog({
    title: 'Удалить',
    message: `Удалить "${phrase.text.slice(0, 30)}..."?`,
    cancel: true
  }).onOk(() => {
    const index = phrasesList.value.indexOf(phrase)
    if (index !== -1) phrasesList.value.splice(index, 1)
    saveData()
    if (currentPhrase.value.text === phrase.text && phrasesList.value.length > 0) {
      selectPhrase(phrasesList.value[0])
    }
    $q.notify({ type: 'positive', message: 'Удалено', position: 'top' })
  })
}
// Функция для случайного выбора голоса из доступных
const getRandomVoice = () => {
  const availableVoicesValues = voiceOptions.map(v => v.value)
  const randomIndex = Math.floor(Math.random() * availableVoicesValues.length)
  return availableVoicesValues[randomIndex]
}

// --- Жизненный цикл ---
onMounted(async () => {
  await loadVoices()

  // Выбираем случайный голос при загрузке
  const randomVoice = getRandomVoice()
  selectedVoice.value = randomVoice

  updateSelectedVoice()
  loadStats()
  loadData()
  initSpeechRecognition()

  // Показываем уведомление о случайном голосе
  $q.notify({
    type: 'info',
    message: `🎲 Сегодняшний голос: ${voiceOptions.find(v => v.value === randomVoice)?.label}`,
    position: 'top',
    timeout: 3000
  })
})

onBeforeUnmount(() => {
  if (recognition) recognition.abort()
  if (simpleRecordingTimer) clearInterval(simpleRecordingTimer)
  if (simpleMediaStream) simpleMediaStream.getTracks().forEach(track => track.stop())
  if (currentVisualizationStream && currentVisualizationStream !== simpleMediaStream) {
    currentVisualizationStream.getTracks().forEach(track => track.stop())
  }
  if (lastRecordingUrl.value) URL.revokeObjectURL(lastRecordingUrl.value)
  stopVoiceVisualization()
})
</script>

<style scoped>
/* Стили остаются теми же */
.voice-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

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

.detailed-breakdown {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 12px;
  max-height: 200px;
  overflow-y: auto;
}

.breakdown-title {
  font-size: 0.85rem;
  margin-bottom: 8px;
  opacity: 0.9;
}

.words-breakdown {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.word-analysis {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 6px 12px;
  min-width: 80px;
}

.target-word {
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.spoken-word {
  font-family: monospace;
  font-size: 1rem;
  letter-spacing: 1px;
}

.error-char {
  color: #ff5252;
  font-weight: bold;
  text-decoration: underline;
  text-decoration-thickness: 2px;
}

.user-phrase, .target-phrase {
  font-size: 1rem;
  max-width: 250px;
  word-break: break-word;
}

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

.live-captions {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
  max-height: 150px;
  overflow-y: auto;
}

.caption-title {
  text-align: left;
  font-weight: bold;
}

.words-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  max-height: 100px;
  overflow-y: auto;
}

.word-chip {
  animation: fadeIn 0.2s ease;
  cursor: help;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}




.user-phrase-display {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 15px;
  margin-top: 10px;
}

.user-phrase-text {
  font-size: 1.8rem;
  font-weight: bold;
  line-height: 1.3;
  word-break: break-word;
  letter-spacing: 1px;
}

.user-word {
  display: inline-block;
  margin-right: 8px;
}

.user-char {
  display: inline-block;
  transition: all 0.2s ease;
}

.user-char.error-char {
  color: #ff5252;
  text-decoration: underline;
  text-decoration-thickness: 3px;
  text-decoration-color: #ff5252;
}

.user-space {
  display: inline-block;
  width: 0;
  margin: 0;
  border-bottom: 1px dotted rgba(255, 255, 255, 0.3);
}

.caption-label {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-bottom: 8px;
}
</style>
