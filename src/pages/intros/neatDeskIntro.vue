<template>
  <div class="container">
    <div class="background-wrapper">
      <img
        src="/src/assets/images/introCopybook.jpg"
        alt="monitor"
        class="background-image"
        ref="bgImage"
      />

      <!-- Поле ввода сообщения -->
      <textarea
        class="message-input"
        v-model="customMessage"
        placeholder="Введите ваше сообщение для Vincent..."
        :style="inputStyle"
      ></textarea>

      <button
        class="action-btn btn-1"
        :style="button1Style"
        @click="openTelegramMessage"
        :disabled="!customMessage.trim()"
      >Send to Vincent!</button>

      <button
        class="action-btn btn-2"
        :style="button2Style"
      >I'm not a student, <br>I'm a special agent <br> <br> ВИнсент - не учитель, <br> Vincent is my friend </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const bgImage = ref(null)
const customMessage = ref('') // Храним текст из поля ввода

// Координаты в процентах от размеров изображения
const inputStyle = ref({
  top: '75%',
  left: '45%',
  width: '300px',
  height: '80px'
})

const button1Style = ref({
  top: '85%',
  left: '45%'
})

const button2Style = ref({
  top: '65%',
  left: '46%'
})

const openTelegramMessage = () => {
  const username = 'omgbuddy'

  // Используем текст из поля ввода, или стандартное сообщение если поле пустое
  const message = customMessage.value.trim() || 'Hello Vincent!'

  const telegramUrl = `https://t.me/${username}?text=${encodeURIComponent(message)}`
  window.open(telegramUrl, '_blank')
}

const handleResize = () => {
  // Можно добавить логику адаптации позиций при ресайзе
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.background-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.message-input {
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 12px;
  border: 2px solid #4a90e2;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-family: Arial, sans-serif;
  resize: vertical;
  z-index: 10;

  &:focus {
    outline: none;
    border-color: #357abd;
    background: white;
    box-shadow: 0 0 10px rgba(74, 144, 226, 0.5);
  }

  &::placeholder {
    color: #666;
  }
}

.action-btn {
  position: absolute;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #4a90e2;
  color: white;
  font-size: 16px;
  font-weight: bold;
  line-height: 19px;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: #357abd;
    transform: translate(-50%, -50%) scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: translate(-50%, -50%);

    &:hover {
      background: #4a90e2;
      transform: translate(-50%, -50%);
    }
  }
}

.btn-2 {
  font-family: Special_f1;
  background: none;
  color: rgba(0, 0, 0, 0.71);
  padding: 0;
  &:hover {
    background: none;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

.btn-1 {
  font-family: Special_f1;
  background: none;
  color: rgba(0, 100, 255, 0.71);
  padding: 0;
  &:hover {
    background: none;
    transform: translate(-50%, -50%) scale(1.05);
  }

  &:disabled {
    color: rgba(0, 100, 255, 0.4);
  }
}
</style>
