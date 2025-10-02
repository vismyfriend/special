<template>
  <div class="notebook-container" :style="containerStyle">
    <div class="notebook-wrapper" :style="wrapperStyle">
      <!-- Обложка тетради -->
      <div class="notebook-cover" :style="coverStyle">
        <!-- Лист тетради в клетку -->
        <div class="notebook-page" :style="pageStyle">
          <!-- Поле для даты -->
          <div v-if="showDate" class="date-field" :style="dateFieldStyle">
            <input
              type="text"
              v-model="dateValue"
              :placeholder="datePlaceholder"
              class="date-input"
              @focus="onDateFocus"
              @blur="onDateBlur"
            />
          </div>

          <!-- Содержимое тетради -->
          <div class="notebook-content" :style="contentStyle">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Пропсы компонента
const props = defineProps({
  // Основные размеры
  width: {
    type: [String, Number],
    default: 800
  },
  height: {
    type: [String, Number],
    default: 600
  },

  // Цвета
  coverColor: {
    type: String,
    default: 'linear-gradient(135deg, #1e5799 0%,#207cca 51%,#2989d8 51%,#7db9e8 100%)'
  },
  gridColor: {
    type: String,
    default: '#e0e8e8'
  },
  pageColor: {
    type: String,
    default: 'white'
  },

  // Размер клетки
  gridSize: {
    type: Number,
    default: 20
  },

  // Отступы
  padding: {
    type: String,
    default: '40px 50px 20px 50px'
  },

  // Поле для даты
  showDate: {
    type: Boolean,
    default: false
  },
  datePlaceholder: {
    type: String,
    default: 'Date...'
  },
  datePosition: {
    type: String,
    default: 'top-right' // 'top-right', 'top-left', 'top-center'
  },

  // Адаптивность
  responsive: {
    type: Boolean,
    default: true
  },
  maxWidth: {
    type: [String, Number],
    default: '90vw'
  },
  maxHeight: {
    type: [String, Number],
    default: '90vh'
  }
})

// Реактивные данные
const dateValue = ref('')

// Вычисляемые стили
const containerStyle = computed(() => ({
  width: props.responsive ? '100%' : `${parseSize(props.width)}px`,
  height: props.responsive ? '100%' : `${parseSize(props.height)}px`,
  maxWidth: props.responsive ? props.maxWidth : 'none',
  maxHeight: props.responsive ? props.maxHeight : 'none'
}))

const wrapperStyle = computed(() => ({
  width: `${parseSize(props.width)}px`,
  height: `${parseSize(props.height)}px`
}))

const coverStyle = computed(() => ({
  background: props.coverColor
}))

const pageStyle = computed(() => ({
  background: `
    linear-gradient(90deg,
      transparent 0%,
      transparent ${props.gridSize - 1}px,
      ${props.gridColor} ${props.gridSize - 1}px,
      ${props.gridColor} ${props.gridSize}px,
      transparent ${props.gridSize}px
    ),
    linear-gradient(to bottom,
      transparent 0%,
      transparent ${props.gridSize - 1}px,
      ${props.gridColor} ${props.gridSize - 1}px,
      ${props.gridColor} ${props.gridSize}px,
      transparent ${props.gridSize}px
    ),
    linear-gradient(${props.pageColor}, ${props.pageColor})
  `,
  backgroundSize: `${props.gridSize}px ${props.gridSize}px`,
  padding: props.padding
}))

const contentStyle = computed(() => ({
  fontSize: `${Math.max(12, props.gridSize * 0.7)}px`,
  lineHeight: `${props.gridSize}px`
}))

const dateFieldStyle = computed(() => {
  const positions = {
    'top-right': { top: '20px', right: '30px', left: 'auto' },
    'top-left': { top: '20px', left: '60px', right: 'auto' },
    'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)', right: 'auto' }
  }
  return positions[props.datePosition]
})

// Вспомогательные функции
const parseSize = (size) => {
  return typeof size === 'string' ? parseInt(size) : size
}

// Обработчики событий
const onDateFocus = (event) => {
  event.target.select()
}

const onDateBlur = () => {
  if (dateValue.value) {
    console.log('Date entered:', dateValue.value)
  }
}

// Экспортируем методы если нужно
defineExpose({
  getDate: () => dateValue.value,
  setDate: (date) => { dateValue.value = date },
  clearDate: () => { dateValue.value = '' }
})
</script>

<style lang="scss" scoped>
.notebook-container {
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.notebook-wrapper {
  position: relative;
  perspective: 1000px;
}

.notebook-cover {
  position: relative;
  width: 100%;
  height: 100%;
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
  }
}

.notebook-page {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  box-shadow:
    0 2px 10px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 white,
    inset 0 -1px 0 white;
  overflow: hidden;
}

.notebook-content {
  position: relative;
  z-index: 2;
  height: 100%;
  font-family: 'Courier New', monospace;
  color: #333;
}

/* Поле для даты */
.date-field {
  position: absolute;
  z-index: 3;

  .date-input {
    background: transparent;
    border: 1px dashed #ccc;
    border-radius: 3px;
    padding: 4px 8px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    color: #666;
    width: 100px;
    text-align: center;

    &:focus {
      outline: none;
      border-color: #4a90e2;
      background: rgba(255, 255, 255, 0.9);
    }

    &::placeholder {
      color: #999;
    }
  }
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
  z-index: 1;
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
</style>
