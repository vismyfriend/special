<template>
  <div class="container">
    <div class="notebook-wrapper">
      <!-- Желтый блокнот -->
      <div class="college-notebook">
        <!-- Обложка -->
        <div class="notebook-cover">
          <!-- Лист в клетку -->
          <div class="notebook-page">
            <!-- Клетка -->
            <div class="grid-pattern"></div>

            <!-- Красная линия полей -->
            <div class="red-margin"></div>

            <!-- Содержимое -->
            <div class="notebook-content">
              <slot>
                Задание номер 1<br>
                напишите свое имя <br>
              </slot>
              <textarea
                class="message-input"
                placeholder="нажмите чтобы писать..."
                v-model="messageText"
                @input="adjustTextareaHeight"
                ref="textareaRef"
              ></textarea>
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const messageText = ref('')
const textareaRef = ref(null)

// Автоматически подстраиваем высоту textarea под содержимое
const adjustTextareaHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
  }
}

onMounted(() => {
  // Устанавливаем начальную высоту
  if (textareaRef.value) {
    textareaRef.value.style.height = '80px' // 4 строки по 20px
  }
})
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-family: 'Times New Roman', serif;
}

.notebook-wrapper {
  position: relative;
  width: 900px;
  height: 700px;
  perspective: 1200px;
}

.college-notebook {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
}

.notebook-cover {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f9e076 0%, #f7d74e 50%, #f5cf3a 100%);
  border-radius: 8px 4px 4px 8px;
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.3),
    0 2px 10px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  padding: 25px 35px 25px 45px;
  border: 1px solid #e6c860;
}

.notebook-page {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fefbe6; /* Легкий желтый фон */
  border-radius: 2px;
  box-shadow:
    inset 0 0 0 1px rgba(0, 0, 0, 0.05),
    0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Клетчатый паттерн */
.grid-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    /* Горизонтальные линии */
    linear-gradient(to bottom,
      transparent 0%,
      transparent 19px,
      #e0e8e8 19px,
      #e0e8e8 20px,
      transparent 20px
    ),
      /* Вертикальные линии */
    linear-gradient(to right,
      transparent 0%,
      transparent 19px,
      #e0e8e8 19px,
      #e0e8e8 20px,
      transparent 20px
    );
  background-size: 20px 20px;
  opacity: 0.6;
  pointer-events: none;
  z-index: 1;
}

.red-margin {
  position: absolute;
  top: 0;
  left: 40px;
  width: 2px;
  height: 100%;
  background: #ff6b6b;
  z-index: 2;
  opacity: 0.7;
}

.notebook-content {
  position: relative;
  z-index: 3;
  height: 100%;
  padding: 20px 25px 20px 50px;
  //font-family: 'Georgia', serif;
  //font-size: 14px;
  font-family: Special_f1;
  font-size: 14px;
  line-height: 20px; /* Совпадает с высотой клетки */
  color: #2c3e50;
}

/* Поле ввода сообщения */
.message-input {
  position: relative;
  width: 100%;
  min-height: 80px; /* 4 строки по 20px */
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  font-family: 'Georgia', serif;
  font-size: 14px;
  line-height: 20px; /* Важно: совпадает с высотой клетки */
  color: #2c3e50;
  margin-top: 10px;
  padding: 0;
  overflow: hidden;

  /* Убираем стандартные стили */
  box-shadow: none;
  border-radius: 0;

  /* Прозрачный фон */
  background: transparent;

  /* Курсор и выделение */
  caret-color: #2c3e50;

  &::placeholder {
    color: #95a5a6;
    opacity: 0.7;
    font-style: italic;
  }

  /* При фокусе добавляем легкую подсветку */
  &:focus {
    background: rgba(255, 255, 255, 0.3);
    box-shadow: inset 0 0 0 1px rgba(74, 144, 226, 0.3);
  }
}


/* Тень для реалистичности */
.notebook-wrapper::after {
  content: '';
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  width: 85%;
  height: 30px;
  background: radial-gradient(ellipse at center,
    rgba(0, 0, 0, 0.3) 0%,
    transparent 70%
  );
  z-index: -1;
  filter: blur(5px);
}

/* Эффект легкого изгиба страницы */
.notebook-page::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 10px;
  background: linear-gradient(to right,
    transparent 0%,
    rgba(0, 0, 0, 0.03) 100%
  );
  pointer-events: none;
}

/* Заголовок блокнота */
.notebook-cover::before {
  content: 'COLLEGE NOTEBOOK';
  position: absolute;
  top: 7px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: #8b6914;
  text-transform: uppercase;
  opacity: 0.8;
}

/* Номер страницы (опционально) */
.notebook-page::before {
  content: '1';
  position: absolute;
  bottom: 10px;
  right: 15px;
  font-family: 'Georgia', serif;
  font-size: 12px;
  color: #95a5a6;
  opacity: 0.6;
  z-index: 3;
}
</style>
