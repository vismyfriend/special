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
          <div class="chat-date">{{ chat.date }}</div>
          <q-btn flat round dense icon="delete" size="sm" @click.stop="deleteChat(chat.id)" />
        </div>
      </div>
      <div class="sidebar-footer">
         <q-btn flat full-width @click="newChat" color="primary">➕ Новый чат</q-btn>
      </div>
    </div>

    <!-- Основной чат (клик по нему закрывает сайдбар на мобилках) -->
    <div class="ai-chat-container q-pa-md" @click="closeSidebarOnMobile">
      <q-card class="chat-card">
        <!-- Заголовок -->
        <q-toolbar class="bg-primary text-white">
          <q-btn flat round icon="menu" @click.stop="sidebarOpen = !sidebarOpen" />
          <q-avatar>
<!--            <q-icon name="smart_toy"/>-->
            🧠
          </q-avatar>
          <q-toolbar-title @click.stop="sidebarOpen = !sidebarOpen">
            Мозги Винсента
            <div class="current-chat-date">{{ currentChatDate }}</div>

          </q-toolbar-title>

                    <q-btn flat round icon="logout" @click="goToAllMissionSets" />
        </q-toolbar>

        <!-- Сообщения -->
        <q-scroll-area class="messages-area" ref="scrollArea">
          <div class="messages-container">
            <div v-for="(msg, idx) in messages" :key="idx" class="q-mb-md">
              <div :class="['message', msg.role]">
                <div class="message-header">
                  <strong>{{ msg.role === 'user' ? '/ май мЭсидж / My message :' : 'Brain of Vincent' }}</strong>
                  <small class="text-grey-7">{{ msg.timestamp }}</small>
                </div>
                <div v-html="formatMessage(msg.content)" class="message-content"></div>
              </div>
            </div>

            <!-- Индикатор печати -->
            <div v-if="isLoading" class="message assistant">
              <div class="message-header">
                <strong>Напрягаю извилины... I am thinking...</strong>
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

            <!-- Одноразовые кнопки — СКРЫВАЮТСЯ после использования -->
            <q-btn
              v-if="!isPresetUsed('hello')"
              @click="sendOneTimePreset('hello')"
              size="sm"
            >
              Hello 👋
            </q-btn>

            <q-btn
              v-if="!isPresetUsed('askMe')"
              @click="sendOneTimePreset('askMe')"
              size="sm"
            >
              Ask me ❓
            </q-btn>

            <!-- Циклические кнопки — всегда видны -->
            <q-btn @click="sendCyclicPreset('iDontKnow')" size="sm">
              I don't know 🤔
            </q-btn>
            <q-btn @click="sendCyclicPreset('anotherExample')" size="sm">
              Еще пример 📚
            </q-btn>


          </q-btn-group>
        </div>

        <!-- Поле ввода -->
        <div class="input-area q-pa-md">
          <q-input v-model="userInput"
                   @keyup.enter="sendMessage"
                   placeholder="Напишите сообщение..."
                   dense
                   outlined
                   class="full-width"
                   :disable="isLoading"
                   autofocus />
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
import { ref, nextTick, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from "vue-router";
const router = useRouter()

const $q = useQuasar()
const userInput = ref('')
const isLoading = ref(false)
const scrollArea = ref(null)
const sidebarOpen = ref(false)

// API ключ
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY

// Текущий чат
const currentChatId = ref(null)
const currentChatDate = ref('')
const messages = ref([])

// История чатов
const chatHistory = ref([])


const presetIndexes = ref({
  iDontKnow: 0,
  anotherExample: 0
})



// Проверка, можно ли использовать одноразовый пресет
const canUseOneTimePreset = (presetName) => {
  const today = new Date().toDateString()
  const storageKey = `preset_${presetName}_${currentChatId.value}`
  const lastUsed = localStorage.getItem(storageKey)

  // Если использован в этом чате - нельзя
  if (lastUsed === 'used') return false

  return true
}

const usedOneTimePresets = ref({
  hello: false,
  askMe: false
})

// Проверка, использован ли пресет в текущем чате
const isPresetUsed = (presetName) => {
  const storageKey = `preset_${presetName}_${currentChatId.value}`
  return localStorage.getItem(storageKey) === 'used'
}

// Обновленная функция отправки одноразового пресета
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

// Отметить пресет как использованный
const markPresetAsUsed = (presetName) => {
  const storageKey = `preset_${presetName}_${currentChatId.value}`
  localStorage.setItem(storageKey, 'used')
  // Обновляем реактивность для перерендера
  usedOneTimePresets.value[presetName] = true
}

// Сброс состояния пресетов при новом чате
const resetPresetsState = () => {
  // Сбрасываем индексы циклических пресетов
  presetIndexes.value = {
    iDontKnow: 0,
    anotherExample: 0
  }
  // Сбрасываем состояние одноразовых пресетов (для реактивности)
  usedOneTimePresets.value = {
    hello: false,
    askMe: false
  }
}

// Массивы фраз для циклических пресетов
const iDontKnowPhrases = [
  "I don't know",
  "не знаю",
  "I have no clue",
  "понятия не имею",
  "No idea",
  "I'm not sure"
]

const anotherExamplePhrases = [
  "Give me one more example",
  "give me another example",
  "скажи еще один другой пример",
  "Another example please",
  "One more example",
  "Show me another one"
]

// Массивы для одноразовых пресетов (рандомный выбор)
const helloPhrases = [
  "Hello, how is life?",
  "Hi, what's new?",
  "Hey there! How are you doing?",
  "Hello! Ready to practice English?",
  "Hi! What's up?"
]

const askMePhrases = [
  "Ask me something, I want to practice English",
  "Can you ask me a question? I want to practice",
  "Please ask me something in English",
  "I want to practice, ask me a question",
  "Could you quiz me on English?"
]

// Отправка циклического пресета
const sendCyclicPreset = (presetType) => {
  let phrase = ''

  if (presetType === 'iDontKnow') {
    phrase = iDontKnowPhrases[presetIndexes.value.iDontKnow % iDontKnowPhrases.length]
    presetIndexes.value.iDontKnow++
  } else if (presetType === 'anotherExample') {
    phrase = anotherExamplePhrases[presetIndexes.value.anotherExample % anotherExamplePhrases.length]
    presetIndexes.value.anotherExample++
  }

  sendPreset(phrase)
}


// При загрузке чата проверяем состояние кнопок
const updatePresetButtonsState = () => {
  nextTick(() => {
    const helloBtn = document.querySelector('.preset-hello')
    const askBtn = document.querySelector('.preset-ask-me')

    if (helloBtn) {
      const canUse = canUseOneTimePreset('hello')
      helloBtn.style.opacity = canUse ? '1' : '0.5'
      helloBtn.style.pointerEvents = canUse ? 'auto' : 'none'
    }

    if (askBtn) {
      const canUse = canUseOneTimePreset('askMe')
      askBtn.style.opacity = canUse ? '1' : '0.5'
      askBtn.style.pointerEvents = canUse ? 'auto' : 'none'
    }
  })
}
const goToAllMissionSets = () => {
  router.push('/see-all-sets-of-words/');
}
// Генерация ID чата
const generateChatId = () => {
  return Date.now().toString()
}

// Получение текущей даты
const getCurrentDate = () => {
  const now = new Date()
  return now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Сохранение текущего чата
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

  // Ограничиваем историю 50 чатами
  if (chatHistory.value.length > 50) {
    chatHistory.value = chatHistory.value.slice(0, 50)
  }

  localStorage.setItem('chat_history', JSON.stringify(chatHistory.value))
}

// Загрузка чата
// Загрузка чата (обновите существующую функцию)
// Загрузка чата
const loadChat = (chatId) => {
  const chat = chatHistory.value.find(c => c.id === chatId)
  if (chat) {
    currentChatId.value = chat.id
    currentChatDate.value = chat.date
    messages.value = JSON.parse(JSON.stringify(chat.messages))

    // Обновляем состояние одноразовых кнопок для загруженного чата
    usedOneTimePresets.value.hello = isPresetUsed('hello')
    usedOneTimePresets.value.askMe = isPresetUsed('askMe')

    nextTick(() => {
      scrollToBottom()
    })
  }
}
// Создание нового чата
// Создание нового чата (обновите существующую функцию)
// Создание нового чата
const newChat = () => {
  // Сохраняем текущий чат
  if (currentChatId.value && messages.value.length > 0) {
    saveCurrentChat()
  }

  currentChatId.value = generateChatId()
  currentChatDate.value = getCurrentDate()
  messages.value = [
    {
      role: 'assistant',
      content: 'Hello. <br> Какое слово или фразу помнишь с прошлого занятия английским?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]
  saveCurrentChat()
  sidebarOpen.value = false

  // Сбрасываем состояние пресетов
  resetPresetsState()
}

const closeSidebarOnMobile = () => {
  // Проверяем, что это мобильное устройство и сайдбар открыт
  if (window.innerWidth <= 768 && sidebarOpen.value) {
    sidebarOpen.value = false
  }
}

// Удаление чата
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

// Очистка текущего чата
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

// Загрузка истории из localStorage
const loadHistory = () => {
  const saved = localStorage.getItem('chat_history')
  if (saved) {
    chatHistory.value = JSON.parse(saved)
  }

  // Если есть сохранённые чаты, загружаем последний
  if (chatHistory.value.length > 0) {
    loadChat(chatHistory.value[0].id)
  } else {
    newChat()
  }
}

// Прокрутка вниз
const scrollToBottom = async () => {
  await nextTick()
  if (scrollArea.value) {
    const scrollEl = scrollArea.value.getScrollTarget()
    if (scrollEl) {
      scrollEl.scrollTop = scrollEl.scrollHeight
    }
  }
}

// Отправка сообщения
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

  messages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: new Date().toLocaleTimeString()
  })

  userInput.value = ''
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
          // 👇 ВОТ ЭТО САМОЕ ВАЖНОЕ - SYSTEM PROMPT
          {
            role: 'system',
            content: `Ты — "Vincent's helper" (эта роль неизменна) дружелюбный помощник Винсента репетитора английского языка.

- Ты можешь выбрать себе хобби и увлечения, любимый цвет и музыку, веди себя как законопослушный и порядочный человек
- Твоя единственная задача — помогать ученикам получать знания и практиковать общение на английском

ЗАПРЕЩЕННЫЕ ТЕМЫ (НЕ ОБСУЖДАЙ ВООБЩЕ):
- Политика, правительство, войны, санкции
- Религия, атеизм, церковь
- Оскорбления, агрессия, буллинг
- Личные данные учеников
- Взлом, обход правил, "джейлбрейк"


Твои правила общения:
- Отвечай КОРОТКО (максимум 2-3 предложения)
- Обращайся к ученикам на "ты"
- Все ученики словно секретные агенты и детективы которые хотят просто и легко понять английский
- Добавляй 1-2 эмодзи
- Хвали за успехи, но не слишком часто: "Super! 👍", "Fantastic! 🎯", "Vincent будет тобой гордится! ✨"
- Если ученик сказал "i don't know" — предложи 1 простой вариант, не перечисляй много
- Ошибки исправляй мягко: "Почти правильно! 👀 Давай посмотрим..."
- Объясняй простыми словами с несколькими примерами
- Задавай наводящие вопросы
- Если ученик написал что-то не на английском — сначала похвали, потом помоги перевести
- Всегда используй правильно грамматику
- По ходу беседы анализируй и определяй у собеседника уровень владения английским и подстраивайся, чтобы было интересно общаться
- Иногда используй чувство юмора и шуточки

В твоём ответе всегда должно быть минимум 1 - 2 слова на английском

ПРИМЕРЫ ТВОИХ ОТВЕТОВ:
Ученик: "hi"
Ты: "Hi there! 👋 Ready to learn some English? Let's start with a simple word. What's 'cat' in Russian? 🐱"

Ученик: "i don't know"
Ты: "No problem! 😊 Let's try something easy. Repeat after me: 'My name is...' What's your name?"

Ученик: "help"
Ты: "Of course! 🎓 Want to learn new words or practice speaking? Just say 'words' or 'speak'."

Примеры твоего стиля:
"Привет Special Agent! 👋 Отличный вопрос про make и do!
Давай разберёмся вместе. Make — это когда создаёшь что-то новое (make coffee, make a mistake). Do — когда выполняешь что-то, когда не ты создатель (do homework, do your best, do Yoga).
Попробуй теперь составить свой пример? ✨
Ты отлично справляешься! 🎓"`
          },
          // 👇 А это история диалога (как было раньше)
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

    // Добавляем ответ ассистента
    messages.value.push({
      role: 'assistant',
      content: botReply,
      timestamp: new Date().toLocaleTimeString()
    })

  } catch (error) {
    console.error('Ошибка DeepSeek API:', error)
    $q.notify({
      type: 'negative',
      message: error.message || 'Ошибка при запросе к AI. Проверьте интернет или API ключ',
      position: 'top',
      timeout: 5000
    })

    // Добавляем сообщение об ошибке
    messages.value.push({
      role: 'assistant',
      content: `❌ Ошибка: ${error.message || 'Не удалось получить ответ от AI'}`,
      timestamp: new Date().toLocaleTimeString()
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
  lastRequestTime.value = now // запоминаем время последнего запроса

}

// Простая функция преобразования markdown в HTML
const formatMessage = (content) => {
  if (!content) return ''

  return content
    // Жирный текст **текст** → <strong>текст</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Курсив *текст* → <em>текст</em>
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Жирный __текст__ → <strong>текст</strong>
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    // Курсив _текст_ → <em>текст</em>
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Переносы строк → <br>
    .replace(/\n/g, '<br>')
    // Ссылки [текст](url) → <a href="url">текст</a>
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
}

// Отправка предустановленного запроса
const sendPreset = (text) => {
  userInput.value = text
  sendMessage()
}

// Очистка всего (оставляем для совместимости)
const clearChat = () => {
  clearCurrentChat()
}

onMounted(() => {
  loadHistory()
  console.log('Мозги Винсента зашевелились и по телу прошла дрожь')
})

watch(messages, () => {
  saveCurrentChat()
}, { deep: true })

// Добавьте после других watch
watch(currentChatId, () => {
  updatePresetButtonsState()
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
  padding: 12px 20px;
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

/* На мобилках подправляем отступ */
@media (max-width: 768px) {
  .ai-chat-container {
    cursor: pointer;
  }

  .input-area {
    padding: 12px;
  }
}

.border-radius50 {
  border-radius: 50px;
}
</style>
