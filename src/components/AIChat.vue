<!--sk-bb3058c6ae2a4e069a94559b11437844-->

<template>
  <div class="chat-wrapper">
    <div class="chat-layout">
    <!-- Боковая панель с историей -->
    <div class="chat-sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="sidebar-header">
        <h3>Memories</h3>
        <q-btn flat round icon="close" @click="sidebarOpen = false" class="close-sidebar-btn" />
      </div>
      <div class="chats-list">
        <div v-for="chat in chatHistory" :key="chat.id"
             class="chat-item"
             :class="{ active: currentChatId === chat.id }"
             @click="loadChat(chat.id)">
          <div class="chat-date">{{ getChatHistoryDate(chat.date) }}</div>
          <q-btn flat round dense icon="delete" size="sm" @click.stop="deleteChat(chat.id)" />
        </div>
      </div>
<!--      <div class="sidebar-footer">-->
<!--         <q-btn flat full-width @click="newChat" color="primary">➕ Новый чат</q-btn>-->
<!--      </div>-->
    </div>

    <!-- Основной чат (клик по нему закрывает сайдбар на мобилках) -->
    <div class="ai-chat-container q-pa-md" @click="closeSidebarOnClick">
      <q-card class="chat-card">
        <!-- Заголовок -->
        <q-toolbar class="bg-primary text-white">
          <q-btn flat round icon="menu" @click.stop="sidebarOpen = !sidebarOpen" />

          <!-- Аватар ассистента вместо эмодзи мозга -->
          <q-avatar>
            <span style="font-size: 28px;"
                  @click.stop="sidebarOpen = !sidebarOpen"
            >{{ currentAssistant.avatar }}</span>
          </q-avatar>

          <!-- Название с кнопкой переключения -->
          <q-toolbar-title
            @click.stop="cycleAssistant"
            class="assistant-title">
            <div class="assistant-name-wrapper">
              <span>{{ currentAssistant.name }}</span>
            </div>
            <div class="current-chat-date">{{ getChatHeaderDate(currentChatDate) }}</div>
          </q-toolbar-title>

          <q-btn flat round icon="logout" @click="goToAllMissionSets" />
        </q-toolbar>

        <!-- Сообщения -->
        <q-scroll-area class="messages-area" ref="scrollArea">
          <div class="messages-container">
            <div v-for="(msg, idx) in messages" :key="idx" class="q-mb-md">
              <div :class="['message', msg.role]">
                <div class="message-header">
                  <strong>{{ msg.role === 'user' ? '/ май мЭсидж / My message :' : '🧠' }}</strong>
                  <small class="text-grey-7">{{ msg.timestamp }}</small>
                </div>
                <div v-html="formatMessage(msg.content)" class="message-content"></div>
              </div>
            </div>

            <!-- Индикатор печати -->
            <div v-if="isLoading" class="message assistant">
              <div class="message-header">
                <strong>{{ currentLoadingPhrase }}</strong>
              </div>
              <div class="message-content typing-indicator">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          </div>
        </q-scroll-area>

        <!-- Предустановленные запросы -->
        <q-separator />
        <div class="presets-area">
          <q-btn-group flat>
            <!-- НОВАЯ КНОПКА НОВЫЙ ЧАТ - ВСЕГДА ВИДИМАЯ, САМАЯ ПЕРВАЯ -->
            <q-btn
              @click="createNewChatAndOpenSidebar"
              size="sm"
              color="primary"
              icon="add"
              label="New chat"
              class="new-chat-preset-btn"
            >

            </q-btn>

            <!-- Уровень 0: начальные кнопки (видны только до первого сообщения) -->
            <q-btn
              v-if="!isPresetUsed('hello') && userMessageCount === 0"
              @click="sendOneTimePreset('hello')"
              size="sm"
            >
              👋 Hello
            </q-btn>

            <q-btn
              v-if="!isPresetUsed('iDontRemember') && userMessageCount >= 0 && userMessageCount < 4"
              @click="sendOneTimePreset('iDontRemember')"
              size="sm"
            >
              Я ничего не помню 🤷
            </q-btn>

            <!-- Уровень 1: появляются после 2 сообщений -->
            <q-btn
              v-if="userMessageCount >= 1"
              @click="sendCyclicPreset('iDontKnow')"
              size="sm"
            >
              {{ iDontKnowButtonTexts[iDontKnowButtonIndex] }}
            </q-btn>

            <q-btn
              v-if="userMessageCount >= 2"
              @click="sendCyclicPreset('anotherExample')"
              size="sm"
            >
              Еще пример 📚
            </q-btn>

            <!-- Кнопка коррекции (появляется после 2 сообщений) -->
            <q-btn
              v-if="userMessageCount >= 2 && userMessageCount < 5"
              @click="sendCorrectionPreset"
              size="sm"
            >
              Я правильно написал? ✍️
            </q-btn>

            <!-- Кнопка Ask Me появляется после 3 сообщений -->
            <q-btn
              v-if="!isPresetUsed('askMe') && userMessageCount >= 3"
              @click="sendOneTimePreset('askMe')"
              size="sm"
            >
              Ask me ❓
            </q-btn>

            <!-- Уровень 2: появляются после 4 сообщений -->
            <q-btn
              v-if="userMessageCount >= 4 && isRiddleAvailable"
              @click="sendRiddlePreset"
              size="sm"
            >
              Загадка 🧩
            </q-btn>

            <q-btn
              v-if="userMessageCount >= 4 && isDescribeAvailable"
              @click="sendDescribePreset"
              size="sm"
            >
              Describe 🖼️
            </q-btn>
          </q-btn-group>
        </div>

        <!-- Поле ввода -->
        <div class="input-area q-pa-md">
          <q-input v-model="userInput"
                   @keyup.enter="sendMessage"
                   placeholder="Напечатай или запиши голосовое"
                   dense
                   outlined
                   input-class="italic"
                   class="full-width"
                   :disable="isLoading"
                   autofocus />


          <q-btn @click="startVoiceInput"
                 color="secondary"
                 icon="mic"
                 :loading="isRecording"
                 :disable="isLoading"
                 class="q-ml-sm border-radius50" />
          <q-btn @click="sendMessage"
                 color="primary"
                 icon="send"
                 :loading="isLoading"
                 :disable="!userInput.trim()"
                 class="q-ml-sm border-radius50" />
        </div>
      </q-card>
    </div>
  </div>
  </div>

</template>

<script setup>
import { ref, nextTick, onMounted, watch, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from "vue-router";
import {
  initAssistant,
  nextAssistant,
  getCurrentAssistant,
  getCurrentSystemPrompt
} from '../dataForGames/assistantConfig'

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
const router = useRouter()
const $q = useQuasar()

// API ключ
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY

// ==================== АССИСТЕНТ ====================
const currentAssistant = ref(getCurrentAssistant())

// Функция для циклического переключения ассистентов
const cycleAssistant = () => {
  const newAssistant = nextAssistant()
  const oldAssistantName = currentAssistant.value.name
  currentAssistant.value = newAssistant

  if (messages.value.length > 0) {
    // Добавляем служебное сообщение от системы
    messages.value.push({
      role: 'system',
      content: `Ассистент сменился с "${oldAssistantName}" на "${newAssistant.name}". Продолжаем общение в новом стиле.`,
      timestamp: new Date().toLocaleTimeString()
    })

    let welcomeMessage = ''
    switch (newAssistant.id) {
      case 'vincent_helper':
        welcomeMessage = "Hi, hey, what's up! What do you want to talk about? 🎓"
        break
      case 'grumpy_grandpa':
        welcomeMessage = "Эх... Ох.. 👴 Чё нада? What do ya want? спрашивай давай"
        break
      case 'mechanic':
        welcomeMessage = "Здарова! 🔧 Английский как движок — проверять надо! What's the problem? 🚗"
        break
      case 'beauty_guru':
        welcomeMessage = "Приветик, солнышко! 💅 Ready to make your English beautiful? Let's start, sweetie! ✨"
        break
      case 'taxi_mikhalych':
        welcomeMessage = "О, дарагой! 🚕 Welcome to my taxi-english! У меня свой бизнес кстати, а такси чисто для души. Ask me anything, I explain very good! Атлична!"
        break
      default:
        welcomeMessage = "Hi there! How can I help you today?"
    }

    messages.value.push({
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date().toLocaleTimeString()
    })
    nextTick(() => scrollToBottom())
  }
}

// ==================== UI СОСТОЯНИЕ ====================
const userInput = ref('')
const isLoading = ref(false)
const scrollArea = ref(null)
const sidebarOpen = ref(false)

// ==================== ГОЛОСОВОЙ ВВОД ====================
const isRecording = ref(false)
const recognition = ref(null)

const initSpeechRecognition = () => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    recognition.value = new SpeechRecognition()
    recognition.value.lang = 'en-US'
    recognition.value.interimResults = false
    recognition.value.maxAlternatives = 1
    recognition.value.continuous = false

    recognition.value.onstart = () => {
      isRecording.value = true
      $q.notify({
        message: ' I am listening to your English... Говорите 🎤',
        timeout: 2000,
        position: 'bottom'
      })
    }

    recognition.value.onend = () => {
      isRecording.value = false
    }

    recognition.value.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      if (userInput.value) {
        userInput.value += ' ' + transcript
      } else {
        userInput.value = transcript
      }
    }

    recognition.value.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      isRecording.value = false

      let errorMessage = 'Ошибка распознавания'
      if (event.error === 'not-allowed') {
        errorMessage = '❌ Нет доступа к микрофону. Разрешите доступ в настройках браузера'
      } else if (event.error === 'no-speech') {
        errorMessage = '🎤 Не услышал речь. Попробуйте еще раз'
      } else if (event.error === 'audio-capture') {
        errorMessage = '🎙️ Микрофон не найден. Проверьте подключение'
      }

      $q.notify({
        type: 'negative',
        message: errorMessage,
        timeout: 3000,
        position: 'top'
      })
    }
  } else {
    $q.notify({
      type: 'warning',
      message: 'Ваш браузер не поддерживает распознавание речи',
      timeout: 3000,
      position: 'top'
    })
  }
}

const startVoiceInput = () => {
  if (!recognition.value) {
    initSpeechRecognition()
  }

  if (recognition.value) {
    try {
      recognition.value.start()
    } catch (error) {
      console.error('Failed to start recognition:', error)
      $q.notify({
        type: 'negative',
        message: 'Не удалось запустить микрофон',
        timeout: 2000
      })
    }
  }
}

// ==================== УПРАВЛЕНИЕ ЧАТАМИ ====================
const currentChatId = ref(null)
const currentChatDate = ref('')
const messages = ref([])
const chatHistory = ref([])

const generateChatId = () => {
  return Date.now().toString()
}

const getCurrentDate = () => {
  return new Date().toISOString()
}

const saveCurrentChat = () => {
  if (!currentChatId.value || messages.value.length === 0) return

  const preview = messages.value[0]?.content?.substring(0, 50) || 'Новый чат'
  const chatIndex = chatHistory.value.findIndex(c => c.id === currentChatId.value)

  const chatData = {
    id: currentChatId.value,
    date: currentChatDate.value,
    preview: preview,
    messages: messages.value
  }

  if (chatIndex >= 0) {
    chatHistory.value[chatIndex] = chatData
  } else {
    chatHistory.value.unshift(chatData)
  }

  if (chatHistory.value.length > 50) {
    chatHistory.value = chatHistory.value.slice(0, 50)
  }

  localStorage.setItem('chat_history', JSON.stringify(chatHistory.value))
}

const loadChat = (chatId) => {
  const chat = chatHistory.value.find(c => c.id === chatId)
  if (chat) {
    currentChatId.value = chat.id
    currentChatDate.value = chat.date
    messages.value = JSON.parse(JSON.stringify(chat.messages))

    hasUserSentMessage.value = messages.value.some(msg => msg.role === 'user')
    userMessageCount.value = messages.value.filter(msg => msg.role === 'user').length
    assistantMessageCount.value = messages.value.filter(msg => msg.role === 'assistant').length

    triggeredMotivations.value = {
      6: assistantMessageCount.value >= 6,
      12: assistantMessageCount.value >= 12
    }

    usedOneTimePresets.value.hello = isPresetUsed('hello')
    usedOneTimePresets.value.askMe = isPresetUsed('askMe')
    usedOneTimePresets.value.iDontRemember = isPresetUsed('iDontRemember')

    nextTick(() => {
      scrollToBottom()
    })
  }
}

const newChat = () => {
  if (currentChatId.value && messages.value.length > 0) {
    saveCurrentChat()
  }

  currentChatId.value = generateChatId()
  currentChatDate.value = getCurrentDate()
  messages.value = [
    {
      role: 'assistant',
      content: '- Hello 👋 <br> Какое слово или выражение помнишь с твоего последнего занятия английским?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]
  saveCurrentChat()
  resetPresetsState()
}

const deleteChat = (chatId) => {
  $q.dialog({
    title: 'Удалить чат',
    message: 'Вы уверены, что хотите удалить этот диалог?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    chatHistory.value = chatHistory.value.filter(c => c.id !== chatId)
    localStorage.setItem('chat_history', JSON.stringify(chatHistory.value))

    if (currentChatId.value === chatId) {
      newChat()
    }
  })
}

const clearCurrentChat = () => {
  $q.dialog({
    title: 'Очистить чат',
    message: 'Вы уверены, что хотите очистить текущий диалог?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    messages.value = [
      {
        role: 'assistant',
        content: 'Чат очищен. Чем могу помочь?',
        timestamp: new Date().toLocaleTimeString()
      }
    ]
    saveCurrentChat()
    scrollToBottom()
  })
}

const loadHistory = () => {
  const saved = localStorage.getItem('chat_history')
  if (saved) {
    let history = JSON.parse(saved)

    history = history.map(chat => {
      if (chat.date && chat.date.match(/^\d{4}-\d{2}-\d{2}/)) {
        return chat
      }

      if (chat.date && typeof chat.date === 'string') {
        const months = {
          'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3, 'мая': 4, 'июня': 5,
          'июля': 6, 'августа': 7, 'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11
        }

        const parts = chat.date.match(/(\d+)\s+([а-я]+)\s+(\d+)/)
        if (parts) {
          const day = parseInt(parts[1])
          const month = months[parts[2]]
          const year = parseInt(parts[3])

          if (month !== undefined && !isNaN(day) && !isNaN(year)) {
            const newDate = new Date(year, month, day, 12, 0, 0)
            chat.date = newDate.toISOString()
          }
        }

        if (!chat.date.match(/^\d{4}-\d{2}-\d{2}/)) {
          chat.date = new Date().toISOString()
        }
      }

      return chat
    })

    chatHistory.value = history
  }

  checkAndCreateNewChatIfNewDay()
}

const checkAndCreateNewChatIfNewDay = () => {
  if (chatHistory.value.length === 0) {
    newChat()
    return
  }

  const lastChat = chatHistory.value[0]
  const lastChatDate = new Date(lastChat.date).toDateString()
  const todayDate = new Date().toDateString()

  if (lastChatDate !== todayDate) {
    console.log('Новый день! Создаём новый чат автоматически')
    newChat()

    $q.notify({
      type: 'info',
      message: '✨ Новый день! Начинаем свежий диалог ✨',
      timeout: 3000,
      position: 'top'
    })
  } else {
    loadChat(lastChat.id)
  }
}

const handleVisibilityChange = () => {
  if (!document.hidden && chatHistory.value.length > 0) {
    const lastChat = chatHistory.value[0]
    const lastChatDate = new Date(lastChat.date).toDateString()
    const todayDate = new Date().toDateString()

    if (lastChat && lastChatDate !== todayDate) {
      checkAndCreateNewChatIfNewDay()
    }
  }
}

// ==================== ФОРМАТИРОВАНИЕ ДАТ ====================
const getChatHistoryDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getMonth()]

  return `${day} ${month}, ${hours}:${minutes}`
}

const getChatHeaderDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  return `${day} ${month} ${year}, ${hours}:${minutes}`
}

// ==================== ПРЕСЕТЫ И КНОПКИ ====================
// Счётчики
const userMessageCount = ref(0)
const assistantMessageCount = ref(0)
const describeUsageCount = ref(0)
const riddleUsageCount = ref(0)
const MAX_USAGE = 3
const COOLDOWN_MS = 5 * 60 * 1000

// Таймеры
let describeCooldownTimer = null
let riddleCooldownTimer = null

// Флаги доступности
const isDescribeAvailable = ref(true)
const isRiddleAvailable = ref(true)
const hasUserSentMessage = ref(false)

// Индексы пресетов
const presetIndexes = ref({
  iDontKnow: 0,
  correction: 0,
  anotherExample: 0
})

const iDontKnowButtonTexts = [
  "I don't know 🤔",
  "I am not sure 🤷",
  "Give me a hint 💡"
]
const iDontKnowButtonIndex = ref(0)

// Одноразовые пресеты
const usedOneTimePresets = ref({
  hello: false,
  askMe: false,
  iDontRemember: false,
})

const isPresetUsed = (presetName) => {
  const storageKey = `preset_${presetName}_${currentChatId.value}`
  return localStorage.getItem(storageKey) === 'used'
}

const markPresetAsUsed = (presetName) => {
  const storageKey = `preset_${presetName}_${currentChatId.value}`
  localStorage.setItem(storageKey, 'used')
  usedOneTimePresets.value[presetName] = true
}

const resetPresetsState = () => {
  presetIndexes.value = {
    iDontKnow: 0,
    correction: 0,
    anotherExample: 0
  }
  usedOneTimePresets.value = {
    hello: false,
    askMe: false,
    iDontRemember: false,
  }
  hasUserSentMessage.value = false
  userMessageCount.value = 0
  describeUsageCount.value = 0
  riddleUsageCount.value = 0
  isDescribeAvailable.value = true
  isRiddleAvailable.value = true
  iDontKnowButtonIndex.value = 0
  assistantMessageCount.value = 0
  triggeredMotivations.value = {
    6: false,
    12: false
  }

  if (describeCooldownTimer) clearTimeout(describeCooldownTimer)
  if (riddleCooldownTimer) clearTimeout(riddleCooldownTimer)
}

// ==================== ФРАЗЫ ДЛЯ ПРЕСЕТОВ ====================
const riddlePhrases = [
  "Give me a riddle in English (только не подсказывай сразу ответ при помощи emoji, я попрошу подсказку позже)",
  "Загадай мне загадку на английском, только не подсказывай сразу ответ при помощи emoji, я попрошу подсказку позже",
  "I want to guess - хочу отгадать попробовать что-нибудь ((только не подсказывай сразу ответ при помощи emoji, я попрошу подсказку позже)",
]

const correctionPhrasesTemplates = [
  "Проверь моё последнее сообщение:\nя правильно написал?\n\"{message}\"",
  "Были mistakes - ошибки в моём message или всё норм?\n\"{message}\"",
  "Я правильно вообще пишу и говорю? Меня поймут?",
  "Correct me if I make mistakes, okay? 👀"
]

const iDontKnowPhrases = [
  "I don't know - не знаю",
  "Ай эм нот щуэ - не уверен",
  "Дашь подсказку?",
]

const anotherExamplePhrases = [
  "Give me one more example",
  "give me another example",
  "скажи еще один другой пример",
  "Another example please",
  "One more example",
  "Show me another one"
]

const helloPhrases = [
  "Hello, how is life?",
  "Hi, what's new?",
  "Hey there! How are you doing?",
  "Hello! Ready to practice English?",
  "Hi! What's up?"
]

const iDontRememberPhrases = [
  "<b>+</b> I remember nothing <br><b>-</b> I don't remember anything<br><b>?</b> Do I remember anything?<br> <br>I must remember something",
  "I remember nothing!!!<br> <br>Спроси меня что-нибудь полегче!",
  "Ничё не помню!<br> <br>Как кстати это по-английски говорится? дай два варианта формально и на сленге",
  "I don't remember anything!<br> <br>Напиши какие-нибудь популярные сейчас сленговые phrases, чтобы я удивил Винсента на уроке!",
]

const askMePhrases = [
  "Ask me something, I want to practice English",
  "Can you ask me a question? I want to practice",
  "Please ask me something in English",
  "I want to practice, ask me a question",
  "Could you quiz me on English?"
]

// ==================== ОПИСАНИЕ КАРТИНОК ====================
const describeMessages = [
  "🖼️ **Опиши эту картинку по-английски:**\n\nWhat do you see? 3-4 предложения составь.",
  "🎨 **Look at this image!**\n\nОпиши эту картинку in English.",
  "📸 **Опиши вслух - что видишь?**\n\nWhat colors, objects, and actions do you see?",
  "🌍 **дискрАйб - описАть**\n\nDescribe what you see:",
]

const imageIds = [1, 10, 15, 20, 25, 30, 33, 40, 42, 50, 55, 60, 66, 70, 77, 80, 88, 90, 99, 100]

// ==================== МОТИВАЦИОННЫЕ СООБЩЕНИЯ ====================
const motivationalMessages = [
  {
    triggerCount: 6,
    message: "Кстати By the way! Ты же хочешь говорить, а не молчать на английском! Читай всё вслух! Разговаривай 🗣️✨"
  },
  {
    triggerCount: 12,
    message: "Do you read everything outloud? Точно вслух всё читаешь? Винсент следит за тобой 😎 👀"
  }
]

const triggeredMotivations = ref({
  6: false,
  12: false
})

const checkAndSendMotivationalMessage = () => {
  for (const msg of motivationalMessages) {
    if (assistantMessageCount.value === msg.triggerCount && !triggeredMotivations.value[msg.triggerCount]) {
      triggeredMotivations.value[msg.triggerCount] = true

      setTimeout(() => {
        messages.value.push({
          role: 'assistant',
          content: msg.message,
          timestamp: new Date().toLocaleTimeString()
        })
        nextTick(() => scrollToBottom())
      }, 1500)
      break
    }
  }
}

// ==================== ИНДИКАТОР ЗАГРУЗКИ ====================
const loadingPhrases = [
  "Напрягаю извилинки... 🧠",
  "Хммм... 🤔",
  "One moment... 🤔",
  "Let me think a bit... 💭",
  "Ща... пару секунд... ⚙️",
  "To be or not to be... 🧐",
  "Серое вещество бурлит... 🧠⚡",
  "Just a second... ⏳",
  "Соображаю... 🤓",
]

const longerLoadingPhrases = [
  "когда вообще использовать ing... 📊",
  "it, he, she + S пиши... 🎯",
  "Так-то Винсент молодец мне кажется...",
  "хорошо, что я уже выучил русский... 🤯",
  "ну и запрос! Думаю... 🤯",
  "This is good... 🔄",
  "Английский — это вам не хухры-мухры... 📚",
  "Мозг кипит! Скоро отвечу... ⚡",
  "Загружаю знания из глубины памяти... 💾",
  "Ох уж этот Роckoмнадзор...🤯",
  "Формулирую ответ, чтобы даже ребенок понял... 💡"
]

const currentLoadingPhrase = ref("Напрягаю извилины... I am thinking...")
let loadingTimer = null
let currentLongIndex = 0

const getRandomLoadingPhrase = () => {
  const randomIndex = Math.floor(Math.random() * loadingPhrases.length)
  return loadingPhrases[randomIndex]
}

const getNextLongPhrase = () => {
  const randomIndex = Math.floor(Math.random() * longerLoadingPhrases.length)
  return longerLoadingPhrases[randomIndex]
}

const startLoadingPhraseTimer = () => {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
    clearInterval(loadingTimer)
    loadingTimer = null
  }

  currentLongIndex = 0
  currentLoadingPhrase.value = getRandomLoadingPhrase()

  loadingTimer = setTimeout(() => {
    if (isLoading.value) {
      currentLoadingPhrase.value = getNextLongPhrase()

      const interval = setInterval(() => {
        if (isLoading.value) {
          currentLoadingPhrase.value = getNextLongPhrase()
        } else {
          clearInterval(interval)
        }
      }, 3000)
      loadingTimer = interval
    }
  }, 2000)
}

const stopLoadingPhraseTimer = () => {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
    clearInterval(loadingTimer)
    loadingTimer = null
  }
  currentLongIndex = 0
}

// ==================== ОТПРАВКА ПРЕСЕТОВ ====================
const sendPreset = (text) => {
  userInput.value = text
  sendMessage()
}

const sendOneTimePreset = (presetType) => {
  if (presetType === 'hello') {
    if (isPresetUsed('hello')) {
      $q.notify({
        type: 'warning',
        message: 'Приветствие уже использовано в этом чате! Попробуйте в новом чате 😊',
        timeout: 3000
      })
      return
    }
    const randomHello = helloPhrases[Math.floor(Math.random() * helloPhrases.length)]
    markPresetAsUsed('hello')
    sendPreset(randomHello)
  }
  else if (presetType === 'iDontRemember') {
    if (isPresetUsed('iDontRemember')) {
      $q.notify({
        type: 'warning',
        message: 'Эта фраза уже использована в этом чате! 😊',
        timeout: 3000
      })
      return
    }
    const randomPhrase = iDontRememberPhrases[Math.floor(Math.random() * iDontRememberPhrases.length)]
    markPresetAsUsed('iDontRemember')
    sendPreset(randomPhrase)
  }
  else if (presetType === 'askMe') {
    if (isPresetUsed('askMe')) {
      $q.notify({
        type: 'warning',
        message: 'Эта функция уже использована в этом чате! Попробуйте в новом чате 😊',
        timeout: 3000
      })
      return
    }
    const randomAsk = askMePhrases[Math.floor(Math.random() * askMePhrases.length)]
    markPresetAsUsed('askMe')
    sendPreset(randomAsk)
  }
}

const sendCyclicPreset = (presetType) => {
  let phrase = ''

  if (presetType === 'iDontKnow') {
    phrase = iDontKnowPhrases[presetIndexes.value.iDontKnow % iDontKnowPhrases.length]
    presetIndexes.value.iDontKnow++
    iDontKnowButtonIndex.value = (iDontKnowButtonIndex.value + 1) % iDontKnowButtonTexts.length
  } else if (presetType === 'anotherExample') {
    phrase = anotherExamplePhrases[presetIndexes.value.anotherExample % anotherExamplePhrases.length]
    presetIndexes.value.anotherExample++
  }

  sendPreset(phrase)
}

const sendCorrectionPreset = () => {
  const lastUserMessage = [...messages.value].reverse().find(msg => msg.role === 'user')

  if (!lastUserMessage) {
    $q.notify({
      type: 'warning',
      message: 'Сначала напишите что-нибудь, чтобы я мог проверить 😊',
      timeout: 3000
    })
    return
  }

  const template = correctionPhrasesTemplates[presetIndexes.value.correction % correctionPhrasesTemplates.length]
  presetIndexes.value.correction++
  const correctionRequest = template.replace('{message}', lastUserMessage.content)
  sendPreset(correctionRequest)
}

const sendRiddlePreset = () => {
  riddleUsageCount.value++
  const randomRiddle = riddlePhrases[Math.floor(Math.random() * riddlePhrases.length)]
  sendPreset(randomRiddle)

  if (riddleUsageCount.value >= MAX_USAGE) {
    isRiddleAvailable.value = false
    riddleCooldownTimer = setTimeout(() => {
      isRiddleAvailable.value = true
      riddleUsageCount.value = 0
      $q.notify({
        type: 'positive',
        message: 'Кнопка "Загадка" снова доступна! 🎉',
        timeout: 3000
      })
    }, COOLDOWN_MS)
  }
}

const sendDescribePreset = () => {
  if (!isDescribeAvailable.value) {
    $q.notify({
      type: 'warning',
      message: 'Кнопка "Describe" временно недоступна. Попробуйте через 5 минут! 😊',
      timeout: 3000
    })
    return
  }

  const randomId = imageIds[Math.floor(Math.random() * imageIds.length)]
  const randomImageUrl = `https://picsum.photos/400/300?image=${randomId}`
  const randomMessage = describeMessages[Math.floor(Math.random() * describeMessages.length)]

  const emojis = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵',
    '🐔', '🐧', '🐦', '🐤', '🐴', '🐺', '🦝', '🐗', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜',
    '🌵', '🎄', '🌲', '🌳', '🌴', '🌿', '🍀', '☘️', '🍃', '🍂', '🍁', '🌾', '🌺', '🌸', '🌷',
    '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝',
    '⭐', '🌟', '✨', '💫', '☀️', '🌙', '🌈', '⚡', '🔥', '💧', '❄️', '🎈', '🎉', '🎊', '💝'
  ]

  const shuffled = [...emojis]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  const randomEmojis = shuffled.slice(0, 5)
  const emojiString = randomEmojis.join(' ')

  const img = new Image()
  const loadingHtml = `<div style="padding: 10px; text-align: center;">🖼️ Загрузка картинки...</div>`

  describeUsageCount.value++

  const messageIndex = messages.value.length
  messages.value.push({
    role: 'assistant',
    content: `${randomMessage}\n\n${loadingHtml}`,
    timestamp: new Date().toLocaleTimeString()
  })

  nextTick(() => scrollToBottom())

  img.onload = () => {
    const imageHtml = `<img src="${randomImageUrl}" alt="Random scene for description" style="max-width: 100%; border-radius: 12px; margin: 8px 0;" />`
    messages.value[messageIndex].content = `${randomMessage}\n\n${imageHtml}`
    nextTick(() => scrollToBottom())
  }

  img.onerror = () => {
    const fallbackHtml = `
      <div style="padding: 12px; text-align: center; background: #f5f5f5; border-radius: 12px; margin: 8px 0;">
        <div style="font-size: 40px; letter-spacing: 8px;">${emojiString}</div>
        <div style="font-size: 12px; color: #666; margin-top: 8px;"> (Пейзаж не загружается, РКН ограничивает доступ к знаниям. Опишем иконки)</div>
      </div>
    `
    messages.value[messageIndex].content = `${randomMessage}\n\n${fallbackHtml}`
    nextTick(() => scrollToBottom())
  }

  img.src = randomImageUrl

  assistantMessageCount.value++
  checkAndSendMotivationalMessage()

  if (describeUsageCount.value >= MAX_USAGE) {
    isDescribeAvailable.value = false
    $q.notify({
      type: 'info',
      message: `Кнопка "Describe" заблокирована на 5 минут. Пишите свои сообщения! 💪`,
      timeout: 4000
    })
    describeCooldownTimer = setTimeout(() => {
      isDescribeAvailable.value = true
      describeUsageCount.value = 0
      $q.notify({
        type: 'positive',
        message: 'Кнопка "Describe" снова доступна! 🎉',
        timeout: 3000
      })
    }, COOLDOWN_MS)
  }
}

const createNewChatAndOpenSidebar = async () => {
  newChat()
  cycleAssistant()
  await nextTick()
  setTimeout(() => {
    sidebarOpen.value = true
  }, 50)
}

// ==================== ОСНОВНЫЕ ФУНКЦИИ ЧАТА ====================
const scrollToBottom = async () => {
  await nextTick()
  if (scrollArea.value) {
    const scrollEl = scrollArea.value.getScrollTarget()
    if (scrollEl) {
      scrollEl.scrollTop = scrollEl.scrollHeight
    }
  }
}

const closeSidebarOnClick = () => {
  if (sidebarOpen.value) {
    sidebarOpen.value = false
  }
}

const goToAllMissionSets = () => {
  router.push('/see-all-sets-of-words/')
}

const formatMessage = (content) => {
  if (!content) return ''
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
}

// ==================== ОТПРАВКА СООБЩЕНИЙ ====================
const lastRequestTime = ref(0)
const MIN_DELAY_MS = 2000

const sendMessage = async () => {
  const now = Date.now()
  if (now - lastRequestTime.value < MIN_DELAY_MS) {
    const waitSeconds = Math.ceil((MIN_DELAY_MS - (now - lastRequestTime.value)) / 1000)
    $q.notify({
      type: 'warning',
      message: `⏳ Подожди ${waitSeconds} сек. между запросами`,
      timeout: 2000
    })
    return
  }

  if (!userInput.value.trim() || isLoading.value) return

  const userMessage = userInput.value.trim()

  if (!hasUserSentMessage.value) {
    hasUserSentMessage.value = true
  }

  userMessageCount.value++

  messages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: new Date().toLocaleTimeString()
  })

  userInput.value = ''

  startLoadingPhraseTimer()
  isLoading.value = true
  await scrollToBottom()

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: getCurrentSystemPrompt()
          },
          ...messages.value.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 500,
        stream: false
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    const botReply = data.choices[0].message.content

    messages.value.push({
      role: 'assistant',
      content: botReply,
      timestamp: new Date().toLocaleTimeString()
    })

    assistantMessageCount.value++
    checkAndSendMotivationalMessage()

  } catch (error) {
    console.error('Ошибка DeepSeek API:', error)
    $q.notify({
      type: 'negative',
      message: error.message || 'Ошибка при запросе к AI. Проверьте интернет или API ключ',
      position: 'top',
      timeout: 5000
    })

    messages.value.push({
      role: 'assistant',
      content: `❌ Ошибка: ${error.message || 'Не удалось получить ответ от AI'}`,
      timestamp: new Date().toLocaleTimeString()
    })
  } finally {
    isLoading.value = false
    stopLoadingPhraseTimer()
    await scrollToBottom()
  }
  lastRequestTime.value = now
}

// ==================== ЖИЗНЕННЫЙ ЦИКЛ ====================
onMounted(() => {
  loadHistory()
  document.addEventListener('visibilitychange', handleVisibilityChange)
  initAssistant()
  currentAssistant.value = getCurrentAssistant()
  console.log('Мозги Винсента зашевелились и по телу прошла дрожь')
})

watch(messages, () => {
  saveCurrentChat()
}, { deep: true })

watch(currentChatId, () => {
  if (currentChatId.value) {
    usedOneTimePresets.value.hello = isPresetUsed('hello')
    usedOneTimePresets.value.askMe = isPresetUsed('askMe')
  }
})

onUnmounted(() => {
  stopLoadingPhraseTimer()
  if (describeCooldownTimer) clearTimeout(describeCooldownTimer)
  if (riddleCooldownTimer) clearTimeout(riddleCooldownTimer)
  document.removeEventListener('visibilitychange', handleVisibilityChange)

  if (recognition.value) {
    try {
      recognition.value.stop()
    } catch (e) {}
  }
})
</script>

<style>
/* Глобальные стили - добавляем в тот же компонент или в App.vue */
html, body, #app {
  overflow: hidden !important;
  position: fixed !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  touch-action: none !important;
}

/* Особые стили для iOS Safari */
@supports (-webkit-touch-callout: none) {
  body {
    overscroll-behavior-y: none;
    -webkit-overflow-scrolling: auto;
  }
}
</style>

<style scoped>
/* Обертка для центрирования только на десктопе */
.chat-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e0e0e0;
}

/* На десктопе добавляем отступы и центрирование */
@media (min-width: 769px) {
  .chat-wrapper {
    min-height: 100vh;
    padding: 20px;
  }
  .chat-layout .chat-sidebar.sidebar-open ~ .ai-chat-container {
    width: calc(100% - 180px);
    margin-left: 0;

  }

}

/* На мобилках убираем лишние отступы */
@media (max-width: 768px) {
  .chat-wrapper {
    min-height: auto;
    padding: 0;
    align-items: flex-start;
  }

}

/* Основной контейнер */
.chat-layout {
  width: 100%;
  max-width: 800px;
  height: 100dvh;
  max-height: 700px;
  overflow: hidden;
  position: relative;
  background: #f5f5f5;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* На мобилках убираем скругления и тень, чтобы чат был вплотную к краям */
@media (max-width: 768px) {
  .chat-layout {
    border-radius: 0;
    box-shadow: none;
    max-height: none;
  }

  .chat-sidebar {
    border-radius: 0;
  }
}

/* Боковая панель - всегда absolute */
.chat-sidebar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 180px;
  background: white;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 20;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 12px 0 0 12px;
}

.chat-sidebar.sidebar-open {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-sidebar-btn {
  display: block;
}

.chats-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  background: #fafafa;
}

.chat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  margin-bottom: 6px;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.chat-item:hover {
  background: #f0f7ff;
  border-color: rgba(102, 126, 234, 0.2);
  transform: translateX(2px);
}

.chat-item.active {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-left: 3px solid #667eea;
  border-color: #667eea;
}

.chat-date {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  background: white;
}

/* Контейнер чата - будет сдвигаться */
.ai-chat-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  transition: transform 0.3s ease;
  transform: translateX(0);
  padding: 0;
}

/* Когда сайдбар открыт - чат сдвигается вправо */
.chat-layout .chat-sidebar.sidebar-open ~ .ai-chat-container {
  transform: translateX(180px);

}

/* Карточка чата */
.chat-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Заголовок чата */
.chat-card :deep(.q-toolbar) {
  background: white !important;
  color: #1a1a1a !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding: 6px 20px;
  flex-shrink: 0;
}

.chat-card :deep(.q-toolbar .q-btn) {
  color: #667eea;
}

.chat-card :deep(.q-toolbar-title) {
  font-weight: 600;
  font-size: 18px;
}

.current-chat-date {
  font-size: 11px;
  opacity: 0.6;
  font-weight: normal;
  margin-top: 2px;
}

/* Область сообщений - только здесь скролл */
.messages-area {
  flex: 1;
  background: #fafafa;
  overflow-y: auto;
}

.messages-container {
  padding: 12px;
}

.message {
  padding: 12px 16px;
  border-radius: 16px;
  max-width: 80%;
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

.message.user {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.message.assistant {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  margin-right: auto;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-header {
  margin-bottom: 8px;
  font-size: 0.8rem;
  opacity: 0.8;
}

.message-header strong {
  font-weight: 600;
}

.message-header small {
  margin-left: 8px;
}

.message-content {
  line-height: 17px;
  word-wrap: break-word;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.typing-indicator span {
  animation: typing 1.4s infinite;
  opacity: 0;
  font-size: 20px;
}

.typing-indicator span:nth-child(1) { animation-delay: 0s; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% { opacity: 0; }
  30% { opacity: 1; }
}
/* ========== АККУРАТНЫЕ КНОПКИ ПРЕСЕТОВ ========== */
.presets-area {
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 8px 12px;
  flex-shrink: 0;
}

.presets-area :deep(.q-btn-group) {
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.presets-area :deep(.q-btn) {
  text-transform: none;
  font-weight: 400;
  font-size: 0.75rem;
  padding: 4px 14px;
  min-height: 30px;
  border-radius: 24px;
  background: #f5f5f7;
  color: #4a4a4a;
  border: none;
  transition: all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  box-shadow: none;
  letter-spacing: 0.3px;
}

.presets-area :deep(.q-btn):hover {
  background: #e8e8ec;
  color: #1a1a1a;
  transform: translateY(-1px);
}

.presets-area :deep(.q-btn):active {
  transform: translateY(0);
  transition: transform 0.05s ease;
}

.presets-area :deep(.q-btn:focus) {
  outline: none;
  background: #e8e8ec;
}

/* Адаптив для мобилок */
@media (max-width: 768px) {
  .presets-area {
    padding: 6px 10px;
  }

  .presets-area :deep(.q-btn) {
    font-size: 0.7rem;
    padding: 3px 12px;
    min-height: 28px;
  }

  .presets-area :deep(.q-btn-group) {
    gap: 5px;
  }

  .message {

    max-width: 92%;
  }
}

/* Поле ввода - прижато к низу */
.input-area {
  display: flex;
  gap: 12px;
  background: white;
  padding: 16px;
  flex-shrink: 0;
  margin-top: auto;
}

.input-area :deep(.q-field__control) {
  border-radius: 24px;
}

/* Стилизация скролла только для чата */
.messages-area::-webkit-scrollbar {
  width: 6px;
}

.messages-area::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.messages-area::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.messages-area::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Убираем скролл у всех остальных элементов */
.chat-wrapper,
.chat-layout,
.ai-chat-container,
.chat-card {
  overflow: hidden;
}


/* Стиль для кнопки Новый чат в пресетах */
.new-chat-preset-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  font-weight: 500 !important;
}

.new-chat-preset-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

/* На мобилках подправляем отступ */
@media (max-width: 768px) {
  .ai-chat-container {
    cursor: pointer;
  }

  .input-area {
    padding: 6px;
    gap: 1px;

  }
}

.border-radius50 {
  border-radius: 50px;
}

.assistant-title {
  cursor: pointer;

}

.assistant-name-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;

}

.assistant-name-wrapper:hover {
  opacity: 0.8;

}


/* Адаптив для мобилок */
@media (max-width: 768px) {
  .assistant-name-wrapper {
    gap: 4px;
  }

  .assistant-switch-btn {
    padding: 4px;
  }
}
</style>
