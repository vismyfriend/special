<!--sk-bb3058c6ae2a4e069a94559b11437844-->

<template>
  <div class="ai-chat-container q-pa-md">
    <q-card class="chat-card">
      <!-- Заголовок -->
      <q-toolbar class="bg-primary text-white">
        <q-avatar>
          <q-icon name="smart_toy" />
        </q-avatar>
        <q-toolbar-title>
          AI Ассистент DeepSeek
        </q-toolbar-title>
        <q-btn flat round icon="delete" @click="clearChat" />
      </q-toolbar>

      <!-- Сообщения -->
      <q-scroll-area class="messages-area" ref="scrollArea">
        <div class="messages-container">
          <div v-for="(msg, idx) in messages" :key="idx"
               class="q-mb-md">
            <div :class="['message', msg.role]">
              <div class="message-header">
                <strong>{{ msg.role === 'user' ? 'Вы' : 'DeepSeek AI' }}</strong>
                <small class="text-grey-7">{{ msg.timestamp }}</small>
              </div>
              <div class="message-content">
                {{ msg.content }}
              </div>
            </div>
          </div>

          <!-- Индикатор печати -->
          <div v-if="isLoading" class="message assistant">
            <div class="message-header">
              <strong>DeepSeek AI</strong>
            </div>
            <div class="message-content typing-indicator">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        </div>
      </q-scroll-area>

      <!-- Предустановленные запросы (как ты хотел) -->
      <q-separator />
      <div class="presets-area q-pa-sm">
        <q-btn-group flat>
          <q-btn @click="sendPreset('Переведи на русский: hello, world')"
                 size="sm" outline rounded>
            Перевод
          </q-btn>
          <q-btn @click="sendPreset('Составь предложение со словом amazing')"
                 size="sm" outline rounded>
            Пример
          </q-btn>
          <q-btn @click="sendPreset('Объясни разницу между make и do')"
                 size="sm" outline rounded>
            Грамматика
          </q-btn>
          <q-btn @click="sendPreset('Исправь ошибки: She go to school yesterday')"
                 size="sm" outline rounded>
            Исправление
          </q-btn>
        </q-btn-group>
      </div>

      <q-separator />

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
               class="q-ml-sm" />
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const userInput = ref('')
const isLoading = ref(false)
const scrollArea = ref(null)

// Твой API ключ DeepSeek (замени на свой)
// ВНИМАНИЕ: Для продакшена лучше использовать переменные окружения
const DEEPSEEK_API_KEY = 'sk-bb3058c6ae2a4e069a94559b11437844'

// Сообщения хранятся только в рамках сессии
const messages = ref([
  {
    role: 'assistant',
    content: 'Привет! Я AI-помощник на базе DeepSeek. Чем могу помочь?',
    timestamp: new Date().toLocaleTimeString()
  }
])

// Функция для прокрутки вниз
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
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  const userMessage = userInput.value.trim()

  // Добавляем сообщение пользователя
  messages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: new Date().toLocaleTimeString()
  })

  userInput.value = ''
  isLoading.value = true

  await scrollToBottom()

  try {
    // Запрос к DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',  // Используем стандартную модель
        messages: messages.value.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,  // Контролирует креативность (0-1)
        max_tokens: 500,   // Максимальная длина ответа
        stream: false      // Без стриминга для простоты
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
}

// Отправка предустановленного запроса
const sendPreset = (text) => {
  userInput.value = text
  sendMessage()
}

// Очистка чата
const clearChat = () => {
  $q.dialog({
    title: 'Очистить чат',
    message: 'Вы уверены, что хотите очистить историю диалога?',
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
    $q.notify({
      type: 'positive',
      message: 'Чат очищен',
      position: 'top'
    })
  })
}
</script>

<style scoped>
.ai-chat-container {
  max-width: 800px;
  margin: 0 auto;
  height: 100vh;
  max-height: 700px;
}

.chat-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
}

.messages-area {
  flex: 1;
  background: #f5f5f5;
}

.messages-container {
  padding: 16px;
}

.message {
  padding: 12px;
  border-radius: 12px;
  max-width: 85%;
}

.message.user {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-left: auto;
}

.message.assistant {
  background: white;
  border: 1px solid #e0e0e0;
  margin-right: auto;
}

.message-header {
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.message-header small {
  margin-left: 8px;
}

.message-content {
  line-height: 1.5;
  word-wrap: break-word;
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  animation: typing 1.4s infinite;
  opacity: 0;
}

.typing-indicator span:nth-child(1) { animation-delay: 0s; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% { opacity: 0; }
  30% { opacity: 1; }
}

.presets-area {
  background: white;
  border-top: 1px solid #e0e0e0;
  overflow-x: auto;
  white-space: nowrap;
}

.input-area {
  display: flex;
  gap: 8px;
  background: white;
}
</style>
