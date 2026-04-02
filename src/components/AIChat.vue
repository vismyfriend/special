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
          <q-avatar>
<!--            <q-icon name="smart_toy"/>-->
            🧠
          </q-avatar>
          <q-toolbar-title @click.stop="sidebarOpen = !sidebarOpen">
            Мозг Винсента
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
                  <strong>{{ msg.role === 'user' ? '/ май мЭсидж / My message :' : 'Brain of Vincent' }}</strong>
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
              Hello 👋
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
import { ref, nextTick, onMounted, watch , onUnmounted } from 'vue'
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

// Счётчик сообщений пользователя
const userMessageCount = ref(0)

// Счётчики использований для лимитированных кнопок
const describeUsageCount = ref(0)
const riddleUsageCount = ref(0)
const MAX_USAGE = 3
const COOLDOWN_MS = 5 * 60 * 1000 // 5 минут

// Таймеры для кнопок
let describeCooldownTimer = null
let riddleCooldownTimer = null

// Флаги доступности кнопок
const isDescribeAvailable = ref(true)
const isRiddleAvailable = ref(true)

const presetIndexes = ref({
  iDontKnow: 0,
  correction: 0,
  anotherExample: 0
})

// Массив названий для кнопки I don't know (циклически меняется)
const iDontKnowButtonTexts = [
  "I don't know 🤔",
  "I am not sure 🤷",
  "Give me a hint 💡"
]

// Текущий индекс названия кнопки
const iDontKnowButtonIndex = ref(0)

// Массив запросов для загадок
const riddlePhrases = [
  "Give me a riddle in English (только не подсказывай сразу ответ при помощи emoji, я попрошу подсказку позже)",
  "Загадай мне загадку на английском, только не подсказывай сразу ответ при помощи emoji, я попрошу подсказку позже",
  "I want to guess - хочу отгадать попробовать что-нибудь ((только не подсказывай сразу ответ при помощи emoji, я попрошу подсказку позже)",
]

// Новая функция: создаёт чат И открывает сайдбар если он свернут
// Новая функция: создаёт чат И открывает сайдбар если он свернут
const createNewChatAndOpenSidebar = async () => {

  // Создаём новый чат
  newChat()

  // Ждём следующего тика, чтобы Vue завершил все обновления
  await nextTick()

  // Небольшая задержка, чтобы обойти возможные сбросы
  setTimeout(() => {
    sidebarOpen.value = true
  }, 50)
}
// Функция для отправки пресета с загадкой
const sendRiddlePreset = () => {


  riddleUsageCount.value++
  const randomRiddle = riddlePhrases[Math.floor(Math.random() * riddlePhrases.length)]
  sendPreset(randomRiddle)

  // Если достигнут лимит, блокируем кнопку на 5 минут
  if (riddleUsageCount.value >= MAX_USAGE) {
    isRiddleAvailable.value = false



    // Устанавливаем таймер на разблокировку
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
//  функция отправки циклического пресета для коррекции
// Фразы для пресета коррекции (с шаблоном)
const correctionPhrasesTemplates = [
  "Проверь моё последнее сообщение:\nя правильно написал?\n\"{message}\"",
  "Были mistakes - ошибки в моём message или всё норм?\n\"{message}\"",
  "Я правильно вообще пишу и говорю? Меня поймут?",
  "Correct me if I make mistakes, okay? 👀"
]

// Функция отправки пресета коррекции
const sendCorrectionPreset = () => {
  // Находим последнее сообщение пользователя
  const lastUserMessage = [...messages.value].reverse().find(msg => msg.role === 'user')

  if (!lastUserMessage) {
    $q.notify({
      type: 'warning',
      message: 'Сначала напишите что-нибудь, чтобы я мог проверить 😊',
      timeout: 3000
    })
    return
  }

  // Выбираем случайную фразу и подставляем сообщение
  const template = correctionPhrasesTemplates[presetIndexes.value.correction % correctionPhrasesTemplates.length]
  presetIndexes.value.correction++

  const correctionRequest = template.replace('{message}', lastUserMessage.content)

  sendPreset(correctionRequest)
}

// Добавьте кнопки которые хотите сделать одноразовыми
const usedOneTimePresets = ref({
  hello: false,
  askMe: false,
  iDontRemember: false,  // ← добавляем

})

// Флаг, было ли отправлено сообщение пользователем
const hasUserSentMessage = ref(false)

// Добавьте в функцию resetPresetsState
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

  // 👇 СБРАСЫВАЕМ СЧЁТЧИК ОТВЕТОВ АССИСТЕНТА И ФЛАГИ
  assistantMessageCount.value = 0
  triggeredMotivations.value = {
    6: false,
    12: false
  }

  if (describeCooldownTimer) clearTimeout(describeCooldownTimer)
  if (riddleCooldownTimer) clearTimeout(riddleCooldownTimer)
}


// Проверка, нужно ли создать новый чат при загрузке
// Проверка, нужно ли создать новый чат при загрузке
const checkAndCreateNewChatIfNewDay = () => {
  // Если нет чатов в истории, просто создаём новый
  if (chatHistory.value.length === 0) {
    newChat()
    return
  }

  // Получаем последний чат (первый в списке, т.к. новые добавляются в начало)
  const lastChat = chatHistory.value[0]

  // Сравниваем ТОЛЬКО ДАТУ (без времени)
  const lastChatDate = new Date(lastChat.date).toDateString()
  const todayDate = new Date().toDateString()

  // Если дата последнего чата не сегодняшняя - создаём новый чат
  if (lastChatDate !== todayDate) {
    console.log('Новый день! Создаём новый чат автоматически')
    newChat()

    // Показываем уведомление (опционально)
    $q.notify({
      type: 'info',
      message: '✨ Новый день! Начинаем свежий диалог ✨',
      timeout: 3000,
      position: 'top'
    })
  } else {
    // Если чат сегодняшний, загружаем его
    loadChat(lastChat.id)
  }
}

// Проверка, использован ли пресет в текущем чате
const isPresetUsed = (presetName) => {
  const storageKey = `preset_${presetName}_${currentChatId.value}`
  return localStorage.getItem(storageKey) === 'used'
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
  else if (presetType === 'iDontRemember') {  // ← добавляем
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

// Обновите функцию markPresetAsUsed, чтобы поддерживала новый тип
const markPresetAsUsed = (presetName) => {
  const storageKey = `preset_${presetName}_${currentChatId.value}`
  localStorage.setItem(storageKey, 'used')
  usedOneTimePresets.value[presetName] = true
}



// Массив фраз для индикатора загрузки (добавьте после других массивов)
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

// Массив длинных фраз (если ответ задерживается)
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

// Текущая фраза загрузки (добавьте с другими ref)
const currentLoadingPhrase = ref("Напрягаю извилины... I am thinking...")


// Таймер и счётчик для смены фраз
let loadingTimer = null
let currentLongIndex = 0

// Счётчик ответов ассистента
const assistantMessageCount = ref(0)

// Мотивационные сообщения (появляются после определённого количества ответов ассистента)
const motivationalMessages = [
  {
    triggerCount: 6,
    message: "Кстати By the way! Ты же хочешь говорить, а не молчать на английском! Тренируйся читать все вслух! 🗣️✨"
  },
  {
    triggerCount: 12,
    message: "Do you read everything outloud? Точно вслух всё читаешь? Винсент следит за тобой 😎👀"
  }
]

// Функция для проверки и отправки мотивационных сообщений
// Функция для проверки и отправки мотивационных сообщений
const checkAndSendMotivationalMessage = () => {
  for (const msg of motivationalMessages) {
    if (assistantMessageCount.value === msg.triggerCount && !triggeredMotivations.value[msg.triggerCount]) {
      // Отмечаем, что сообщение уже отправлено
      triggeredMotivations.value[msg.triggerCount] = true

      // Добавляем псевдосообщение от ассистента С ЗАДЕРЖКОЙ
      setTimeout(() => {
        messages.value.push({
          role: 'assistant',
          content: msg.message,
          timestamp: new Date().toLocaleTimeString()
        })

        nextTick(() => {
          scrollToBottom()
        })
      }, 1500) // 1.5 секунды задержки

      break
    }
  }
}

// Флаг, чтобы не отправлять сообщение повторно при достижении триггера
const triggeredMotivations = ref({
  6: false,
  12: false
})

// Функция для получения следующей длинной фразы (циклически)
// const getNextLongPhrase = () => {
//   const phrase = longerLoadingPhrases[currentLongIndex % longerLoadingPhrases.length]
//   currentLongIndex++
//   return phrase
// }
// Функция для получения случайной длинной фразы
const getNextLongPhrase = () => {
  const randomIndex = Math.floor(Math.random() * longerLoadingPhrases.length)
  return longerLoadingPhrases[randomIndex]
}


// Функция для запуска таймера смены фраз
const startLoadingPhraseTimer = () => {
  // Очищаем предыдущий таймер, если есть
  if (loadingTimer) {
    clearTimeout(loadingTimer)
    clearInterval(loadingTimer)
    loadingTimer = null
  }

  // Сбрасываем счётчик длинных фраз
  currentLongIndex = 0

  // Устанавливаем первую случайную короткую фразу
  currentLoadingPhrase.value = getRandomLoadingPhrase()

  // Таймер для переключения на длинные фразы через 3 секунды
  loadingTimer = setTimeout(() => {
    if (isLoading.value) {
      currentLoadingPhrase.value = getNextLongPhrase()

      // Запускаем интервал для смены длинных фраз каждые 4 секунды
      const interval = setInterval(() => {
        if (isLoading.value) {
          currentLoadingPhrase.value = getNextLongPhrase()
        } else {
          clearInterval(interval)
        }
      }, 3000)  // ← ЭТО 3 СЕКУНДЫ (интервал между длинными фразами)

      // Сохраняем интервал в loadingTimer для очистки
      loadingTimer = interval
    }
  }, 2000)  // ← ЭТО  2 СЕКУНДЫ (задержка перед первым переключением)
}

// Функция для остановки таймера
const stopLoadingPhraseTimer = () => {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
    clearInterval(loadingTimer)
    loadingTimer = null
  }
  currentLongIndex = 0
}

// Функция для получения случайной фразы загрузки
const getRandomLoadingPhrase = () => {
  const randomIndex = Math.floor(Math.random() * loadingPhrases.length)
  return loadingPhrases[randomIndex]
}


// Массивы фраз для циклических пресетов
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

// Массивы для одноразовых пресетов (рандомный выбор)
const helloPhrases = [
  "Hello, how is life?",
  "Hi, what's new?",
  "Hey there! How are you doing?",
  "Hello! Ready to practice English?",
  "Hi! What's up?"
]

const iDontRememberPhrases = [  // ← добавляем

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




// Варианты сообщений для описания картинки
const describeMessages = [
  "🖼️ **Опиши эту картинку по-английски:**\n\nWhat do you see? 3-4 предложения составь.",
  "🎨 **Look at this image!**\n\nОпиши эту картинку in English.",
  "📸 **Опиши вслух - что видишь?**\n\nWhat colors, objects, and actions do you see?",
  "🌍 **дискрАйб - описАть**\n\nDescribe what you see:",

]

// Известные рабочие ID картинок (от 1 до 200 — точно существуют)
const imageIds = [1, 10, 15, 20, 25, 30, 33, 40, 42, 50, 55, 60, 66, 70, 77, 80, 88, 90, 99, 100]



// Функция для отправки пресета с картинкой
// Функция для отправки пресета с картинкой
// Функция для отправки пресета с картинкой
const sendDescribePreset = () => {
  // Выбираем случайный ID из массива
  const randomId = imageIds[Math.floor(Math.random() * imageIds.length)]
  const randomImageUrl = `https://picsum.photos/400/300?image=${randomId}`
  const randomMessage = describeMessages[Math.floor(Math.random() * describeMessages.length)]

  // Большой массив эмодзи по категориям
  const emojis = [
    // Животные 🐾
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵',
    '🐔', '🐧', '🐦', '🐤', '🐴', '🐺', '🦝', '🐗', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜',
    '🕷️', '🦂', '🦀', '🐠', '🐟', '🐡', '🐙', '🦑', '🐬', '🐳', '🐋', '🦈', '🦭', '🐊', '🐉',

    // Растения 🌱
    '🌵', '🎄', '🌲', '🌳', '🌴', '🌿', '🍀', '☘️', '🍃', '🍂', '🍁', '🌾', '🌺', '🌸', '🌷',
    '🌹', '🌻', '🌼', '💐', '🪴', '🌱', '🪷', '🌊',

    // Еда 🍕
    '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝',
    '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠',
    '🥐', '🥯', '🍞', '🥖', '🧀', '🍳', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙',
    '🥚', '🍲', '🥣', '🥗', '🍿', '🧈', '🍩', '🍪', '🎂', '🍰', '🧁', '🍫', '🍬', '🍭', '🍮',

    // Разное 🌟
    '⭐', '🌟', '✨', '💫', '☀️', '🌙', '🌈', '⚡', '🔥', '💧', '❄️', '🎈', '🎉', '🎊', '💝'
  ]

  // Выбираем 5 случайных разных эмодзи
  const shuffled = [...emojis]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  const randomEmojis = shuffled.slice(0, 5)
  const emojiString = randomEmojis.join(' ')

  // Создаём изображение с обработчиками ошибок
  const img = new Image()

  // Показываем индикатор загрузки
  const loadingHtml = `<div style="padding: 10px; text-align: center;">🖼️ Загрузка картинки...</div>`

  if (!isDescribeAvailable.value) {
    $q.notify({
      type: 'warning',
      message: 'Кнопка "Describe" временно недоступна. Попробуйте через 5 минут! 😊',
      timeout: 3000
    })
    return
  }
  describeUsageCount.value++

  // Сначала показываем сообщение с загрузкой
  const messageIndex = messages.value.length
  messages.value.push({
    role: 'assistant',
    content: `${randomMessage}\n\n${loadingHtml}`,
    timestamp: new Date().toLocaleTimeString()
  })

  nextTick(() => {
    scrollToBottom()
  })

  // Пытаемся загрузить изображение
  img.onload = () => {
    // Изображение загрузилось - обновляем сообщение
    const imageHtml = `<img src="${randomImageUrl}" alt="Random scene for description" style="max-width: 100%; border-radius: 12px; margin: 8px 0;" />`
    messages.value[messageIndex].content = `${randomMessage}\n\n${imageHtml}`
    nextTick(() => {
      scrollToBottom()
    })
  }

  img.onerror = () => {
    // Ошибка загрузки - показываем эмодзи
    const fallbackHtml = `
      <div style="padding: 12px; text-align: center; background: #f5f5f5; border-radius: 12px; margin: 8px 0;">
        <div style="font-size: 40px; letter-spacing: 8px;">${emojiString}</div>
        <div style="font-size: 12px; color: #666; margin-top: 8px;"> (Фотка пока не загрузилась, опиши эмОджиз)</div>
      </div>
    `
    messages.value[messageIndex].content = `${randomMessage}\n\n${fallbackHtml}`
    nextTick(() => {
      scrollToBottom()
    })
  }

  img.src = randomImageUrl

  // 👇 УВЕЛИЧИВАЕМ СЧЁТЧИК ОТВЕТОВ АССИСТЕНТА
  assistantMessageCount.value++

  // 👇 ПРОВЕРЯЕМ МОТИВАЦИОННЫЕ СООБЩЕНИЯ
  checkAndSendMotivationalMessage()

  // Если достигнут лимит, блокируем кнопку на 5 минут
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

// Отправка циклического пресета
// Отправка циклического пресета
const sendCyclicPreset = (presetType) => {
  let phrase = ''

  if (presetType === 'iDontKnow') {
    phrase = iDontKnowPhrases[presetIndexes.value.iDontKnow % iDontKnowPhrases.length]
    presetIndexes.value.iDontKnow++

    // 👇 МЕНЯЕМ НАЗВАНИЕ КНОПКИ ПРИ КАЖДОМ НАЖАТИИ
    iDontKnowButtonIndex.value = (iDontKnowButtonIndex.value + 1) % iDontKnowButtonTexts.length
  } else if (presetType === 'anotherExample') {
    phrase = anotherExamplePhrases[presetIndexes.value.anotherExample % anotherExamplePhrases.length]
    presetIndexes.value.anotherExample++
  }

  sendPreset(phrase)
}


const goToAllMissionSets = () => {
  router.push('/see-all-sets-of-words/');
}
// Генерация ID чата
const generateChatId = () => {
  return Date.now().toString()
}

// Получение текущей даты
// Получение текущей даты (сохраняем полную дату для сортировки)
const getCurrentDate = () => {
  return new Date().toISOString()  // Сохраняем ISO формат для правильной сортировки
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


// Форматирование для истории чатов (компактный формат: "16 марта, 16:26" или "16 Mar, 16:26")
const getChatHistoryDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  // Месяц на английском (3 буквы)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getMonth()]

  return `${day} ${month}, ${hours}:${minutes}`
}

// Форматирование для заголовка чата (полный русский формат с временем)
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

// Загрузка чата
const loadChat = (chatId) => {
  const chat = chatHistory.value.find(c => c.id === chatId)
  if (chat) {
    currentChatId.value = chat.id
    currentChatDate.value = chat.date
    messages.value = JSON.parse(JSON.stringify(chat.messages))

    // Проверяем, есть ли сообщения от пользователя
    hasUserSentMessage.value = messages.value.some(msg => msg.role === 'user')

    // Считаем количество сообщений пользователя
    userMessageCount.value = messages.value.filter(msg => msg.role === 'user').length

    // 👇 СЧИТАЕМ КОЛИЧЕСТВО ОТВЕТОВ АССИСТЕНТА
    assistantMessageCount.value = messages.value.filter(msg => msg.role === 'assistant').length

    // 👇 ВОССТАНАВЛИВАЕМ ФЛАГИ МОТИВАЦИОННЫХ СООБЩЕНИЙ
    triggeredMotivations.value = {
      6: assistantMessageCount.value >= 6,
      12: assistantMessageCount.value >= 12
    }

    // Обновляем состояние одноразовых кнопок
    usedOneTimePresets.value.hello = isPresetUsed('hello')
    usedOneTimePresets.value.askMe = isPresetUsed('askMe')
    usedOneTimePresets.value.iDontRemember = isPresetUsed('iDontRemember')

    nextTick(() => {
      scrollToBottom()
    })
  }
}

// Создание нового чата
const newChat = () => {
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

  // Сбрасываем состояние пресетов
  resetPresetsState()
}

// Закрытие сайдбара при клике на область чата (работает и на мобилках, и на десктопе)
const closeSidebarOnClick = () => {
  // Закрываем сайдбар, если он открыт (на любом устройстве)
  if (sidebarOpen.value) {
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
// Загрузка истории из localStorage
// Загрузка истории из localStorage
const loadHistory = () => {
  const saved = localStorage.getItem('chat_history')
  if (saved) {
    let history = JSON.parse(saved)

    // Миграция старых дат в ISO формат
    history = history.map(chat => {
      // Если дата уже в ISO формате - пропускаем
      if (chat.date && chat.date.match(/^\d{4}-\d{2}-\d{2}/)) {
        return chat
      }

      // Пытаемся преобразовать старый русский формат "16 марта 2026"
      if (chat.date && typeof chat.date === 'string') {
        const months = {
          'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3, 'мая': 4, 'июня': 5,
          'июля': 6, 'августа': 7, 'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11
        }

        // Пробуем распарсить "16 марта 2026"
        const parts = chat.date.match(/(\d+)\s+([а-я]+)\s+(\d+)/)
        if (parts) {
          const day = parseInt(parts[1])
          const month = months[parts[2]]
          const year = parseInt(parts[3])

          if (month !== undefined && !isNaN(day) && !isNaN(year)) {
            // Создаём дату в полдень, чтобы избежать проблем с часовыми поясами
            const newDate = new Date(year, month, day, 12, 0, 0)
            chat.date = newDate.toISOString()
          }
        }

        // Если не распарсилось, пробуем другой формат или ставим текущую дату
        if (!chat.date.match(/^\d{4}-\d{2}-\d{2}/)) {
          chat.date = new Date().toISOString()
        }
      }

      return chat
    })

    chatHistory.value = history
  }

  // Проверяем дату и создаём новый чат если нужно
  checkAndCreateNewChatIfNewDay()
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

  // 👇 Устанавливаем флаг, что пользователь отправил сообщение
  if (!hasUserSentMessage.value) {
    hasUserSentMessage.value = true
  }

  // 👇 Увеличиваем счётчик сообщений
  userMessageCount.value++

  messages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: new Date().toLocaleTimeString()
  })


  userInput.value = ''


  // Запускаем таймер смены фраз
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


// 👇 УВЕЛИЧИВАЕМ СЧЁТЧИК ТОЛЬКО ЗДЕСЬ
    assistantMessageCount.value++

// 👇 ПРОВЕРЯЕМ МОТИВАЦИОННЫЕ СООБЩЕНИЯ
    checkAndSendMotivationalMessage()

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
    stopLoadingPhraseTimer()
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
  document.addEventListener('visibilitychange', handleVisibilityChange)  // ← при возвращении на страницу (например, пользователь переключил вкладку и вернулся через несколько часов) тоже проверялась дата.
  console.log('Мозги Винсента зашевелились и по телу прошла дрожь')
})

watch(messages, () => {
  saveCurrentChat()
}, { deep: true })

watch(currentChatId, () => {
  // При смене чата обновляем состояние кнопок через реактивность
  if (currentChatId.value) {
    usedOneTimePresets.value.hello = isPresetUsed('hello')
    usedOneTimePresets.value.askMe = isPresetUsed('askMe')
  }
})

onUnmounted(() => {
  stopLoadingPhraseTimer()
  if (describeCooldownTimer) clearTimeout(describeCooldownTimer)
  if (riddleCooldownTimer) clearTimeout(riddleCooldownTimer)
  document.removeEventListener('visibilitychange', handleVisibilityChange)  // ← добавить

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
    padding: 12px;
  }
}

.border-radius50 {
  border-radius: 50px;
}
</style>
