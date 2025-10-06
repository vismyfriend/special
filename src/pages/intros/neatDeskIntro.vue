<template>
  <div class="container">
    <div class="background-wrapper">
      <img
        src="src/assets/images/introCopybook.jpg"
        alt="monitor"
        class="background-image"
        ref="bgImage"
      />

      <!-- Текст вопроса -->
      <div class="question-text" :style="questionStyle">
        {{ currentQuestion.text }}
      </div>

      <!-- Кнопки ответа -->
      <div v-if="showAnswerButtons" class="answers-container" :style="answersContainerStyle">
        <button
          v-for="(answer, index) in currentQuestion.answers"
          :key="index"
          class="answer-btn"
          :class="getAnswerButtonClass(answer)"
          @click="handleAnswer(answer)"
          @mouseenter="hoverAnswer = index"
          @mouseleave="hoverAnswer = -1"
        >
          <span class="answer-text">{{ answer.text }}</span>
          <div class="highlight-animation" :class="{ active: hoverAnswer === index }"></div>
        </button>
      </div>

      <!-- Поле ввода сообщения (показывается только на последнем вопросе) -->
      <textarea
        v-if="showInput"
        class="message-input"
        v-model="customMessage"
        placeholder="Нажмите сюда и введите ваше имя по-английски"
        :style="inputStyle"
      ></textarea>

      <button
        v-if="showInput"
        class="action-btn btn-1"
        :style="button1Style"
        @click="openTelegramMessage"
        :disabled="!customMessage.trim()"
      >finish -></button>

      <button
        class="action-btn btn-2"
        :style="button2Style"
      >Я хочу говорить<br> на английском !? <br> <br> I want to speak <br> ай вонт ту спик <br>English</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const bgImage = ref(null)
const customMessage = ref('') // Храним текст из поля ввода
const hoverAnswer = ref(-1) // Отслеживаем наведение на кнопки

// Диалоговая система
const dialogState = ref({
  currentStep: 'start',
  history: [],
  userData: {} // Здесь будем хранить ключевые ответы
})

// Определяем все шаги диалога
const dialogSteps = {
  start: {
    text: 'Я хочу говорить на английском ?!',
    answers: [
      {
        text: 'Yes , I do',
        nextStep: 'lazy_question',
        type: 'yes'
      },
      {
        text: 'No , I don\'t',
        nextStep: 'goodbye',
        type: 'no'
      }
    ]
  },
  lazy_question: {
    text: 'Am I lazy ?',
    answers: [
      {
        text: 'I am',
        nextStep: 'question_3',
        type: 'yes',
        saveAs: 'lazyStatus', // Сохраняем ответ под этим ключом
        value: 'lazy'
      },
      {
        text: 'I am not',
        nextStep: 'question_3',
        type: 'no',
        saveAs: 'lazyStatus',
        value: 'not lazy'
      }
    ]
  },
  question_3: {
    text: 'Vincent is a good teacher',
    answers: [
      {
        text: 'he is',
        nextStep: 'name_input',
        type: 'yes',
        saveAs: 'question_3_answer',
        value: 'sure'
      },
      {
        text: 'maybe',
        nextStep: 'name_input',
        type: 'no',
        saveAs: 'question_3_answer',
        value: 'notSure'
      },
      {
        text: 'X.3.',
        nextStep: 'name_input',
        type: 'maybe',
        saveAs: 'question_3_answer',
        value: 'X3'
      }
    ]
  },
  name_input: {
    text: 'Okay :) Write your name please',
    answers: []
  },
  goodbye: {
    text: 'Ну пока тогда , прощаемся ???',
    answers: [
      {
        text: 'Goodbye',
        action: 'redirect',
        url: 'https://www.google.com',
        type: 'yes'
      },
      {
        text: 'NO , It is a joke',
        nextStep: 'start',
        type: 'no'
      }
    ]
  }
}

// Вычисляемые свойства
const currentQuestion = computed(() => dialogSteps[dialogState.value.currentStep])
const showAnswerButtons = computed(() => currentQuestion.value.answers && currentQuestion.value.answers.length > 0)
const showInput = computed(() => dialogState.value.currentStep === 'name_input')

// Стили для элементов
const questionStyle = ref({
  top: '55%',
  left: '46%',
  transform: 'translate(-50%, -50%)'
})

const answersContainerStyle = ref({
  top: '75%',
  left: '46%',
  transform: 'translate(-50%, -50%)'
})

const inputStyle = ref({
  top: '75%',
  left: '46%',
  width: '190px',
  height: '80px'
})

const button1Style = ref({
  top: '90%',
  left: '45%'
})

const button2Style = ref({
  top: '95%',
  left: '46%'
})

// Обработка ответов
const handleAnswer = (answer) => {
  // Сохраняем ключевые ответы
  if (answer.saveAs) {
    dialogState.value.userData[answer.saveAs] = answer.value
  }

  // Добавляем в историю
  dialogState.value.history.push({
    step: dialogState.value.currentStep,
    answer: answer.text,
    value: answer.value
  })

  // Выполняем действие или переходим к следующему шагу
  if (answer.action === 'redirect') {
    window.open(answer.url, '_blank')
  } else if (answer.nextStep) {
    dialogState.value.currentStep = answer.nextStep
  }
}

// Получаем класс для кнопки ответа
const getAnswerButtonClass = (answer) => {
  return answer.type === 'yes' ? 'yes-btn' : answer.type === 'no' ? 'no-btn' : 'maybe-btn'
}

const openTelegramMessage = () => {
  const username = 'omgbuddy'

  // Используем текст из поля ввода, или стандартное сообщение если поле пустое
  const userMessage = customMessage.value.trim() || 'Hello Vincent!'

  // Создаем динамическое сообщение на основе сохраненных данных
  let dynamicMessage = `Hi Vincent! This is ${userMessage} texting to you.\n\n`

  // Добавляем информацию о lazy/not lazy
  if (dialogState.value.userData.lazyStatus) {
    if (dialogState.value.userData.lazyStatus === 'lazy') {
      dynamicMessage += ` I want to tell you that I feel a little lazy today. `
    } else {
      dynamicMessage += ` I want to tell you that I am not lazy today.`
    }
  }

  // Добавляем информацию об уверенности
  if (dialogState.value.userData.question_3_answer) {
    const question_3_answerText = {
      sure: "But I am 100% sure that I want to practice my English and chat with you.",
      notSure: "I'll be happy to practice my English with you if you can.",
      X3: "I don't know what to tell you, but I will be happy to chat with you."
    }
    dynamicMessage += ` ${question_3_answerText[dialogState.value.userData.question_3_answer]}`
  }

  dynamicMessage += ` \n\nHow is your life? What are you doing now?`

  const telegramUrl = `https://t.me/${username}?text=${encodeURIComponent(dynamicMessage)}`
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

.question-text {
  position: absolute;
  font-size: 16px;
  font-weight: bold;
  color: rgba(51, 51, 51, 0.85);
  text-align: center;
  padding: 15px 30px;
  border-radius: 10px;
  z-index: 10;
  width: 240px;
  font-family: Special_f1;
}

.answers-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 10;
}

.answer-btn {
  position: relative;
  background: none;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.94);
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: Special_f1;
  font-weight: bold;
  text-align: center;
  min-width: 160px;
  border-radius: 4px;
  overflow: hidden;

  /* Анимация пульсации для каждой кнопки по очереди */
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;

  &:hover {
    transform: translateX(5px);
    animation: none; /* Останавливаем пульсацию при наведении */
  }

  &:focus {
    outline: none;
  }
}

/* Поочередная пульсация для кнопок */
.answer-btn:nth-child(1) {
  animation-name: pulseButton1;
  animation-delay: 0s;
}

.answer-btn:nth-child(2) {
  animation-name: pulseButton2;
  animation-delay: 0.3s;
}

.answer-btn:nth-child(3) {
  animation-name: pulseButton3;
  animation-delay: 0.6s;
}

.answer-text {
  position: relative;
  z-index: 2;
  transition: color 0.3s ease;
}

/* Анимации пульсации */
@keyframes pulseButton1 {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 253, 160, 0);
  }
  25% {
    transform: scale(1.03);
    box-shadow: 0 0 15px rgba(255, 253, 160, 0.4);
  }
  50%, 75% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 253, 160, 0);
  }
}

@keyframes pulseButton2 {
  0%, 25%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 253, 160, 0);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 0 15px rgba(255, 253, 160, 0.4);
  }
  75% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 253, 160, 0);
  }
}

@keyframes pulseButton3 {
  0%, 50%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 253, 160, 0);
  }
  75% {
    transform: scale(1.03);
    box-shadow: 0 0 15px rgba(255, 253, 160, 0.4);
  }
}

//.answer-btn:hover .answer-text {
//  color: #2c5530;
//}
//
//.no-btn:hover .answer-text {
//  color: #8b4513;
//}

.highlight-animation {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      90deg,
      rgba(255, 253, 208, 0.4) 0%,
      rgba(255, 253, 160, 0.8) 20%,
      rgba(255, 253, 160, 0.8) 80%,
      rgba(255, 253, 208, 0.4) 100%
  );
  transition: left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 1;
  border-radius: 4px;

  mask: linear-gradient(
      90deg,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 10%,
      rgba(0, 0, 0, 0.8) 20%,
      black 30%,
      black 70%,
      rgba(0, 0, 0, 0.8) 80%,
      rgba(0, 0, 0, 0.3) 90%,
      transparent 100%
  );
  -webkit-mask: linear-gradient(
      90deg,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 10%,
      rgba(0, 0, 0, 0.8) 20%,
      black 30%,
      black 70%,
      rgba(0, 0, 0, 0.8) 80%,
      rgba(0, 0, 0, 0.3) 90%,
      transparent 100%
  );

  &.active {
    left: 0%;
  }
}

.no-btn .highlight-animation {
  background: linear-gradient(
      90deg,
      rgba(255, 253, 208, 0.4) 0%,
      rgba(255, 253, 160, 0.8) 20%,
      rgba(255, 253, 160, 0.8) 80%,
      rgba(255, 253, 208, 0.4) 100%
  );
}

.message-input {
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 12px;
  border: 2px solid rgba(74, 144, 226, 0);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0);
  font-size: 14px;
  text-align: center;
  font-family: Special_f1, sans-serif;
  color: rgb(198, 1, 253);
  resize: vertical;
  z-index: 10;

  &:focus {
    outline: none;
    //border-color: #357abd;
    //background: white;
    box-shadow: 0 0 10px rgba(74, 144, 226, 0.5);
  }

  &::placeholder {
    color: #666;
    font-style: italic;
    font-family: Arial, sans-serif;

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

.btn-2 {  display: none;

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
