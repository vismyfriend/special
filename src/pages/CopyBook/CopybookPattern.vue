<template>
  <div class="container">
    <div class="notebook-wrapper" :style="{ height: notebookHeight + 'px' }">
      <!-- Обложка тетради -->
      <div class="notebook-cover">
        <!-- Лист тетради в клетку -->
        <div class="notebook-page">
          <!-- Сетка тетради -->
          <div class="notebook-grid"></div>

          <!-- Содержимое тетради -->
          <div class="notebook-content" ref="contentRef">
            <slot>
              <p class="gray-font">
                [ пр'Эктис ] - practice - практика
              </p>

              <br>
              <div class="task-block">
                напишите чем вы занимались on Saturday and Sunday : <br>
                <br>
                where were you ? <br>
                who did you see ? <br>
                what did you eat ?
                <textarea
                  class="message-input"
                  placeholder="нажмите чтобы писать..."
                  v-model="firstAnswer"
                  @input="adjustTextareaHeight($event, 'first')"
                ></textarea>
              </div>

              <div class="task-block">
                Напишите любой вопрос своему тичеру Винсентику :
                <textarea
                  class="message-input"
                  placeholder="нажмите чтобы писать..."
                  v-model="secondAnswer"
                  @input="adjustTextareaHeight($event, 'second')"
                ></textarea>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

// Отдельные переменные для каждого поля
const firstAnswer = ref('')
const secondAnswer = ref('')
const contentRef = ref(null)
const notebookHeight = ref(600)

// Функция для расчета общей высоты контента
const calculateContentHeight = () => {
  if (!contentRef.value) return 600

  const contentHeight = contentRef.value.scrollHeight
  const minHeight = 600
  const padding = 100 // дополнительное место

  return Math.max(minHeight, contentHeight + padding)
}

// Подстраиваем высоту конкретного textarea и всей тетради
const adjustTextareaHeight = async (event, field) => {
  const textarea = event.target
  // Сохраняем текущие отступы для расчетов
  const computedStyle = window.getComputedStyle(textarea)
  const paddingTop = parseInt(computedStyle.paddingTop) || 0
  const paddingBottom = parseInt(computedStyle.paddingBottom) || 0

  // Настраиваем высоту textarea с учетом отступов
  textarea.style.height = 'auto'
  const contentHeight = textarea.scrollHeight - paddingTop - paddingBottom
  textarea.style.height = (contentHeight + paddingTop + paddingBottom) + 'px'

  // Ждем обновления DOM
  await nextTick()

  // Затем настраиваем высоту тетради
  notebookHeight.value = calculateContentHeight()
}

onMounted(() => {
  // Инициализируем высоту
  adjustNotebookHeight()
})

// Функция для начальной настройки высоты
const adjustNotebookHeight = async () => {
  await nextTick()
  notebookHeight.value = calculateContentHeight()
}
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.notebook-wrapper {
  position: relative;
  width: 800px;
  height: 600px;
  perspective: 1000px;
  transition: height 0.3s ease;
}

.notebook-cover {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e5799 0%,#207cca 51%,#2989d8 51%,#7db9e8 100%);
  border-radius: 8px 12px 12px 8px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  padding: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 40px;
    width: 2px;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    z-index: 1;
  }
}

.notebook-page {
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 4px;
  box-shadow:
    0 2px 10px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 white,
    inset 0 -1px 0 white;
  padding: 40px 0 20px 50px;
  overflow: hidden;
}

/* Сетка тетради в клетку */
.notebook-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    /* Вертикальные линии для клетки */
    linear-gradient(90deg,
      transparent 0%,
      transparent 19px,
      #e0e8e8 19px,
      #e0e8e8 20px,
      transparent 20px
    ),
      /* Горизонтальные линии для клетки */
    linear-gradient(to bottom,
      transparent 0%,
      transparent 19px,
      #e0e8e8 19px,
      #e0e8e8 20px,
      transparent 20px
    );
  background-size: 20px 20px;
  z-index: 1;
  pointer-events: none;
}


.notebook-content {
  position: relative;
  z-index: 3;
  height: 100%;
  padding: 0 15px;
  font-family: Special_f1;
  font-size: 14px;
  line-height: 20px; /* Совпадает с высотой клетки */
  color: #25598e;
}

.task-block {
  margin: 0; /* Отступ между заданиями */

  &:last-child {
    margin-bottom: 0;
  }
}

/* Поле ввода сообщения */
.message-input {
  position: relative;
  width: 100%;
  min-height: 60px; /* 1 строка + padding */
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  font-family: 'Times New Roman', serif;
  font-size: 16px;
  line-height: 20px; /* Важно: совпадает с высотой клетки */
  color: #2c3e50;
  overflow: hidden;
  vertical-align: top; /* Важно для выравнивания */

  /* Внутренние отступы */
  padding: 20px 0; /* Вот они - 20px сверху и снизу */

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

/* Специальные стили для выравнивания с учетом padding */
.message-input-wrapper {
  position: relative;
  margin: 20px 0;
}

/* Добавляем отступы между элементами контента */
.notebook-content br {
  display: block;
  content: "";
  margin-top: 0;
  height: 20px; /* Высота одной строки сетки */
}

.notebook-content p {
  margin: 0;
  padding: 0;
}

/* Специальный класс для текста перед textarea */
.question-text {
  display: block;
  margin-bottom: 5px; /* Небольшой отступ перед полем ввода */
}

/* Красная вертикальная линия для полей */
.notebook-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50px;
  width: 1px;
  height: 100%;
  background: #ff6b6b;
  z-index: 3; /* Красная линия поверх всего */
}

/* Дырочки для пружины */
.notebook-cover::after {
  content: '';
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 80%;
  background:
    radial-gradient(circle at center, #666 2px, transparent 2px),
    transparent;
  background-size: 8px 20px;
  background-repeat: repeat-y;
  z-index: 2;
}

/* Тень под тетрадью */
.notebook-wrapper::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 20px;
  background: radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%);
  z-index: -1;
}

.gray-font {
  color: #666;
  font-style: italic;
  margin: 0;
  padding: 0;
  line-height: 20px;
}
</style>
