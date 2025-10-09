<template>
  <div class="pixel-art-editor">
    <h1> pixel art</h1>

    <div id="container">
      <div
        id="board"
        :style="{
          '--width': width,
          '--height': height
        }"
      >
        <div
          v-for="(pixel, index) in pixelArray.flat()"
          :key="index"
          class="pixel"
          :class="{ 'no-border': !showGrid }"
          :style="{ backgroundColor: pixel }"
          @click="handleClick(Math.floor(index / width), index % width)"
          @mousemove="handleMouseMove(Math.floor(index / width), index % width)"
          @mousedown="handleMouseDown"
          @mouseup="handleMouseUp"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
          @touchcancel="handleTouchEnd"
        ></div>
      </div>

      <div id="options">
        <label for="width">
          width:
          <input
            type="number"
            id="width"
            v-model.number="width"
            min="1"
            max="32"
          >
        </label>

        <label for="height">
          height:
          <input
            type="number"
            id="height"
            v-model.number="height"
            min="1"
            max="32"
          >
        </label>

        <label for="tool">
          tool:
          <select id="tool" v-model="toolMode">
            <option value="brush">brush</option>
            <option value="eraser">eraser</option>
          </select>
        </label>

        <label for="color">
          color:
          <input type="color" id="color" v-model="color">
        </label>

        <label for="grid">
          grid:
          <input type="checkbox" id="grid" v-model="showGrid">
        </label>

        <button @click="downloadImage">save image</button>
        <button @click="sendToTelegram" class="telegram-btn">send to telegram</button>
        <button @click="reset">reset</button>
        <button @click="saveData">save data</button>

        <label for="upload" class="button">
          upload data
          <input
            type="file"
            id="upload"
            accept=".json,text/plain"
            @change="uploadData"
          >
        </label>

        <hr>

        <label>demos:</label>
        <button @click="loadDemo('mario')">mario</button>
        <button @click="loadDemo('mushroom')">mushroom</button>
        <button @click="loadDemo('star')">star</button>
        <button @click="loadDemo('goomba')">goomba</button>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

// Реактивные данные
const width = ref(16)
const height = ref(16)
const isClicked = ref(false)
const toolMode = ref('brush')
const color = ref('#000000')
const showGrid = ref(true)

// Массив пикселей
const pixelArray = ref([
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
  ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"]
])
// Временные пустые демо (заполните позже своими данными)
const demos = {
  mario: [
    ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#fc3131","#fc3131","#fc3131","#fc3131","#fc3131","#fc3131","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#ffffff","#fc3131","#fc3131","#fc3131","#fc3131","#fc3131","#fc3131","#fc3131","#fc3131","#fc3131","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#ffffff","#9a6351","#9a6351","#9a6351","#ffbe4d","#ffbe4d","#000000","#ffbe4d","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#9a6351","#ffbe4d","#9a6351","#ffbe4d","#ffbe4d","#ffbe4d","#000000","#ffbe4d","#ffbe4d","#ffbe4d","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#9a6351","#ffbe4d","#9a6351","#9a6351","#ffbe4d","#ffbe4d","#ffbe4d","#000000","#ffbe4d","#ffbe4d","#ffbe4d","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#ffffff","#9a6351","#ffbe4d","#ffbe4d","#ffbe4d","#ffbe4d","#000000","#000000","#000000","#000000","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffbe4d","#ffbe4d","#ffbe4d","#ffbe4d","#ffbe4d","#ffbe4d","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#ffffff","#fc3131","#fc3131","#4d70ff","#fc3131","#fc3131","#4d70ff","#fc3131","#fc3131","#ffffff","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#fc3131","#fc3131","#fc3131","#4d70ff","#fc3131","#fc3131","#4d70ff","#fc3131","#fc3131","#fc3131","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#fc3131","#fc3131","#fc3131","#fc3131","#4d70ff","#4d70ff","#4d70ff","#4d70ff","#fc3131","#fc3131","#fc3131","#fc3131","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffbe4d","#ffbe4d","#fc3131","#4d70ff","#ffbe4d","#4d70ff","#4d70ff","#ffbe4d","#4d70ff","#fc3131","#ffbe4d","#ffbe4d","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffbe4d","#ffbe4d","#ffbe4d","#4d70ff","#4d70ff","#4d70ff","#4d70ff","#4d70ff","#4d70ff","#ffbe4d","#ffbe4d","#ffbe4d","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffbe4d","#ffbe4d","#4d70ff","#4d70ff","#4d70ff","#4d70ff","#4d70ff","#4d70ff","#4d70ff","#4d70ff","#ffbe4d","#ffbe4d","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#ffffff","#4d70ff","#4d70ff","#4d70ff","#ffffff","#ffffff","#4d70ff","#4d70ff","#4d70ff","#ffffff","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#884f30","#884f30","#884f30","#ffffff","#ffffff","#ffffff","#ffffff","#884f30","#884f30","#884f30","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#884f30","#884f30","#884f30","#884f30","#ffffff","#ffffff","#ffffff","#ffffff","#884f30","#884f30","#884f30","#884f30","#ffffff","#ffffff"]
  ],

  mushroom: [
    ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#000000","#000000","#000000","#000000","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#000000","#000000","#ffffff","#ffffff","#e60000","#e60000","#e60000","#e60000","#000000","#000000","#000000","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#e60000","#e60000","#e60000","#e60000","#ffffff","#ffffff","#000000","#ffffff","#ffffff"],
    ["#ffffff","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#e60000","#e60000","#e60000","#e60000","#e60000","#e60000","#ffffff","#ffffff","#000000","#ffffff"],
    ["#ffffff","#000000","#e60000","#e60000","#e60000","#e60000","#e60000","#ffffff","#ffffff","#ffffff","#ffffff","#e60000","#e60000","#ffffff","#000000","#ffffff"],
    ["#000000","#e60000","#ffffff","#ffffff","#e60000","#e60000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#e60000","#e60000","#e60000","#000000"],
    ["#000000","#ffffff","#ffffff","#ffffff","#ffffff","#e60000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#e60000","#e60000","#e60000","#000000"],
    ["#000000","#ffffff","#ffffff","#ffffff","#ffffff","#e60000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#e60000","#e60000","#ffffff","#000000"],
    ["#000000","#ffffff","#ffffff","#ffffff","#ffffff","#e60000","#e60000","#ffffff","#ffffff","#ffffff","#ffffff","#e60000","#e60000","#ffffff","#ffffff","#000000"],
    ["#000000","#e60000","#ffffff","#ffffff","#e60000","#e60000","#e60000","#e60000","#e60000","#e60000","#e60000","#e60000","#e60000","#ffffff","#ffffff","#000000"],
    ["#000000","#e60000","#e60000","#e60000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#e60000","#e60000","#ffffff","#000000"],
    ["#ffffff","#000000","#000000","#000000","#ffffff","#ffffff","#000000","#ffffff","#ffffff","#000000","#ffffff","#ffffff","#000000","#000000","#000000","#ffffff"],
    ["#ffffff","#ffffff","#000000","#ffffff","#ffffff","#ffffff","#000000","#ffffff","#ffffff","#000000","#ffffff","#ffffff","#ffffff","#000000","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#ffffff","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#ffffff","#ffffff","#ffffff","#ffffff"]
  ],

  star: [
    ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#ffde38","#ffde38","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#ffde38","#ffde38","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#ffde38","#ffde38","#ffde38","#ffde38","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
    ["#000000","#000000","#000000","#000000","#000000","#000000","#ffde38","#ffde38","#ffde38","#ffde38","#000000","#000000","#000000","#000000","#000000","#000000"],
    ["#000000","#ffbb00","#ffde38","#ffde38","#ffde38","#ffde38","#ffde38","#ffde38","#ffde38","#ffde38","#ffde38","#ffde38","#ffde38","#ffde38","#ffbb00","#000000"],
    ["#ffffff","#000000","#ffbb00","#ffde38","#ffde38","#ffde38","#000000","#ffde38","#ffde38","#000000","#ffde38","#ffde38","#ffde38","#ffbb00","#000000","#ffffff"],
    ["#ffffff","#ffffff","#000000","#ffbb00","#ffde38","#ffde38","#000000","#ffde38","#ffde38","#000000","#ffde38","#ffde38","#ffbb00","#000000","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#000000","#ffbb00","#ffde38","#000000","#ffde38","#ffde38","#000000","#ffde38","#ffbb00","#000000","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#000000","#ffbb00","#ffde38","#ffde38","#ffde38","#ffde38","#ffde38","#ffde38","#ffbb00","#000000","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#000000","#ffbb00","#ffde38","#ffde38","#ffde38","#ffde38","#ffde38","#ffde38","#ffde38","#ffde38","#ffbb00","#000000","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#000000","#ffbb00","#ffde38","#ffde38","#ffde38","#ffbb00","#ffbb00","#ffde38","#ffde38","#ffde38","#ffbb00","#000000","#ffffff","#ffffff"],
    ["#ffffff","#000000","#ffbb00","#ffde38","#ffde38","#ffbb00","#ffbb00","#000000","#000000","#ffbb00","#ffbb00","#ffde38","#ffde38","#ffbb00","#000000","#ffffff"],
    ["#ffffff","#000000","#ffbb00","#ffbb00","#ffbb00","#000000","#000000","#ffffff","#ffffff","#000000","#000000","#ffbb00","#ffbb00","#ffbb00","#000000","#ffffff"],
    ["#000000","#ffbb00","#ffbb00","#000000","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#000000","#ffbb00","#ffbb00","#000000"],
    ["#000000","#000000","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#000000","#000000"]
  ],
  goomba: [
    ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#de5a21","#de5a21","#de5a21","#de5a21","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#ffffff","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#ffffff","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#de5a21","#000000","#000000","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#000000","#000000","#de5a21","#ffffff","#ffffff"],
    ["#ffffff","#de5a21","#de5a21","#de5a21","#ffe1b8","#000000","#de5a21","#de5a21","#de5a21","#de5a21","#000000","#ffe1b8","#de5a21","#de5a21","#de5a21","#ffffff"],
    ["#ffffff","#de5a21","#de5a21","#de5a21","#ffe1b8","#000000","#000000","#000000","#000000","#000000","#000000","#ffe1b8","#de5a21","#de5a21","#de5a21","#ffffff"],
    ["#de5a21","#de5a21","#de5a21","#de5a21","#ffe1b8","#000000","#ffe1b8","#de5a21","#de5a21","#ffe1b8","#000000","#ffe1b8","#de5a21","#de5a21","#de5a21","#de5a21"],
    ["#de5a21","#de5a21","#de5a21","#de5a21","#ffe1b8","#ffe1b8","#ffe1b8","#de5a21","#de5a21","#ffe1b8","#ffe1b8","#ffe1b8","#de5a21","#de5a21","#de5a21","#de5a21"],
    ["#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#de5a1","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21"],
    ["#ffffff","#de5a21","#de5a21","#de5a21","#de5a21","#de5a21","#ffe1b8","#ffe1b8","#ffe1b8","#ffe1b8","#ffe1b8","#de5a21","#de5a21","#de5a21","#de5a21","#ffffff"],
    ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffe1b8","#ffe1b8","#ffe1b8","#ffe1b8","#ffe1b8","#ffe1b8","#ffe1b8","#ffffff","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#ffffff","#000000","#000000","#000000","#ffe1b8","#ffe1b8","#ffe1b8","#ffe1b8","#ffe1b8","#ffe1b8","#ffe1b8","#ffffff","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#000000","#000000","#000000","#000000","#000000","#ffe1b8","#ffe1b8","#ffe1b8","#ffe1b8","#ffe1b8","#000000","#000000","#ffffff","#ffffff","#ffffff"],
    ["#ffffff","#000000","#000000","#000000","#000000","#000000","#000000","#ffe1b8","#ffe1b8","#ffe1b8","#000000","#000000","#000000","#ffffff","#ffffff","#ffffff"]
  ]}

// Инициализация массива пикселей
const initializePixelArray = () => {
  pixelArray.value = Array.from({ length: height.value }, () =>
    Array.from({ length: width.value }, () => '#ffffff')
  )
}

// Обработчики событий
const handleMouseDown = (event) => {
  isClicked.value = true
  // Для touch устройств
  if (event.type.includes('touch')) {
    event.preventDefault()
  }
}

const handleMouseUp = () => {
  isClicked.value = false
}

const handleClick = (rowIndex, colIndex) => {
  if (toolMode.value === 'eraser') {
    pixelArray.value[rowIndex][colIndex] = '#ffffff'
  } else {
    pixelArray.value[rowIndex][colIndex] = color.value
  }
}

const handleMouseMove = (rowIndex, colIndex) => {
  if (isClicked.value) {
    handleClick(rowIndex, colIndex)
  }
}

// Новые обработчики для touch событий
const handleTouchStart = (event) => {
  isClicked.value = true
  event.preventDefault()

  // Обрабатываем первое касание
  const touch = event.touches[0]
  const element = document.elementFromPoint(touch.clientX, touch.clientY)
  if (element && element.classList.contains('pixel')) {
    const index = Array.prototype.slice.call(element.parentNode.children).indexOf(element)
    const rowIndex = Math.floor(index / width.value)
    const colIndex = index % width.value
    handleClick(rowIndex, colIndex)
  }
}

const handleTouchMove = (event) => {
  if (!isClicked.value) return

  event.preventDefault()

  // Обрабатываем все активные касания
  for (let touch of event.touches) {
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    if (element && element.classList.contains('pixel')) {
      const index = Array.prototype.slice.call(element.parentNode.children).indexOf(element)
      const rowIndex = Math.floor(index / width.value)
      const colIndex = index % width.value
      handleClick(rowIndex, colIndex)
    }
  }
}

const handleTouchEnd = () => {
  isClicked.value = false
}

// Изменение размеров
const changeDimensions = () => {
  // Если массив пустой, инициализируем его
  if (pixelArray.value.length === 0) {
    initializePixelArray()
    return
  }

  const widthDiff = width.value - pixelArray.value[0].length
  const heightDiff = height.value - pixelArray.value.length

  // Корректировка ширины
  pixelArray.value.forEach(row => {
    if (widthDiff > 0) {
      for (let i = 0; i < widthDiff; i++) {
        row.push('#ffffff')
      }
    } else if (widthDiff < 0) {
      for (let i = 0; i < Math.abs(widthDiff); i++) {
        row.pop()
      }
    }
  })

  // Корректировка высоты
  if (heightDiff > 0) {
    for (let i = 0; i < heightDiff; i++) {
      pixelArray.value.push(Array(width.value).fill('#ffffff'))
    }
  } else if (heightDiff < 0) {
    for (let i = 0; i < Math.abs(heightDiff); i++) {
      pixelArray.value.pop()
    }
  }

  // Ограничения
  if (width.value < 1) width.value = 1
  if (width.value > 32) width.value = 32
  if (height.value < 1) height.value = 1
  if (height.value > 32) height.value = 32
}

// Сброс
const reset = () => {
  initializePixelArray()
}

// Демо (временно отключим, пока массивы не заполнены)
const loadDemo = (key) => {
  console.log('Demo loading disabled until arrays are filled')
  width.value = 16
  height.value = 16
  pixelArray.value = JSON.parse(JSON.stringify(demos[key]))
}

// Сохранение данных
const saveData = () => {
  const data = {
    instructions: "upload this file to the pixel art editor",
    width: width.value,
    height: height.value,
    data: pixelArray.value
  }

  const text = JSON.stringify(data, null, 2)
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'pixel-data.json'
  link.click()

  URL.revokeObjectURL(url)
}

// Загрузка данных
const uploadData = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const obj = JSON.parse(e.target.result)
      width.value = obj.width
      height.value = obj.height
      pixelArray.value = obj.data
    } catch (error) {
      console.error('Error parsing file:', error)
      alert('Invalid file format')
    }
  }
  reader.readAsText(file)
  event.target.value = '' // Сброс input
}

// Отправка в Telegram
// Упрощенная версия - только текстовое сообщение
const sendToTelegram = () => {
  const username = 'vismyfriend';
  const message = "Check out my pixel art creation! " +
    "\n\nI drew this for Vincent!";

  const encodedMessage = encodeURIComponent(message)
  const telegramUrl = `https://t.me/${username}?text=${encodedMessage}`

  window.open(telegramUrl, '_blank')
}

// Скачивание изображения с html2canvas
const downloadImage = async () => {
  try {
    await nextTick()

    const board = document.getElementById('board')
    if (!board) {
      alert('Board not found')
      return
    }

    // Импортируем html2canvas
    const html2canvas = (await import('html2canvas')).default

    // Временно убираем границы для чистого скриншота
    const originalBorder = board.style.border
    const originalPixelsBorder = []

    board.style.border = 'none'

    // Сохраняем и убираем границы пикселей
    const pixels = board.getElementsByClassName('pixel')
    for (let pixel of pixels) {
      originalPixelsBorder.push(pixel.style.border)
      pixel.style.border = 'none'
    }

    // Создаем canvas с высоким качеством
    const canvas = await html2canvas(board, {
      scale: 4, // Увеличиваем в 4 раза для качества
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: false,
      logging: false
    })

    // Восстанавливаем стили
    board.style.border = originalBorder
    for (let i = 0; i < pixels.length; i++) {
      pixels[i].style.border = originalPixelsBorder[i]
    }

    // Создаем ссылку для скачивания
    const link = document.createElement('a')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    link.download = `pixel-art-${timestamp}.png`
    link.href = canvas.toDataURL('image/png')

    // Добавляем в DOM, кликаем и удаляем
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log('Image downloaded successfully!')

  } catch (error) {
    console.error('Error generating image:', error)
    alert('Error generating image. Please try again.')
  }
}

// Глобальные горячие клавиши
const handleKeyUp = (event) => {
  if (event.key === 'b') {
    toolMode.value = 'brush'
  } else if (event.key === 'e') {
    toolMode.value = 'eraser'
  } else if (event.key === 'r') {
    reset()
  }
}

// Инициализация
onMounted(() => {
  initializePixelArray()
  document.addEventListener('keyup', handleKeyUp)
  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mouseup', handleMouseUp)
})

// Наблюдатели за размерами
watch([width, height], () => {
  changeDimensions()
})
</script>


<style scoped>
@font-face {
  font-family: "Visitor";
  font-style: normal;
  font-weight: 400;
  src: local("Visitor TT1 BRK"),
  url("https://fonts.cdnfonts.com/s/7338/visitor1.woff") format("woff");
  font-display: block;
}

.pixel-art-editor {
  font-family: "Visitor", monospace;
  padding: 20px;
  margin-top: 50px;
  overflow: hidden;

}

#board {
  width: calc(var(--width) * 1.5rem);
  height: calc(var(--height) * 1.5rem);
  border: 1px solid black;
  display: grid;
  grid-template-columns: repeat(var(--width), 1fr);
  grid-template-rows: repeat(var(--height), 1fr);
  gap: 0;
  /* Ключевое свойство для отключения скролла */
  touch-action: none;
}

.pixel {
  width: 1.5rem;
  height: 1.5rem;
  box-sizing: border-box;
  border: 0.5px solid #aaa;
  cursor: pointer;

}

.pixel.no-border {
  border: none;
}

input[type="number"] {
  width: 32px;
}

input[type="color"] {
  -webkit-appearance: none;
  border: none;
  width: 23px;
  height: 22px;
  background-color: transparent;
  border-style: solid;
  border-width: 1px;
  border-radius: 2px;
  cursor: pointer;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 2px;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 2px;
  margin: 0;
  height: 15px;
  position: relative;
  top: -2px;
}

select {
  width: 75px;
}

input,
select {
  font-size: 14px;
  padding: 3px 1px;
  font-family: "Visitor", monospace;
  vertical-align: middle;
}

label {
  font-size: 16px;
  vertical-align: middle;
  margin-right: 5px;
  height: 23px;
  line-height: 23px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

#options {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
  max-width: 16rem;
  min-width: 254px;
  gap: 20px 10px;
}

h1 {
  margin: 0;
  margin-bottom: 10px;
  font-size: 1.75rem;
  text-align: center;
  width: 100%;
}

.telegram-btn {
  background-color: #0088cc !important;
  color: white !important;
  border-color: #0088cc !important;
}

.telegram-btn:hover {
  background-color: #0077b5 !important;
}

button,
.button {
  background-color: white;
  border: 1px solid gray;
  border-radius: 3px;
  font-family: "Visitor", monospace;
  font-size: 16px;
  cursor: pointer;
  height: 23px;
  vertical-align: middle;
  margin-right: 0;
  line-height: 19px;
  text-align: center;
  padding: 1px 6px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button {
  display: inline-flex;
  cursor: pointer;
}

input[type="checkbox"] {
  height: 18px;
  width: 18px;
  margin: 0;
  padding: 0;
  accent-color: #333;
  box-sizing: border-box;
}

hr {
  width: 100%;
  flex-basis: 100%;
  height: 0;
  margin: 0;
  border: 0;
}

input[type="file"] {
  display: none;
  appearance: none;
}

#container {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 40px;

}

@media (max-width: 773px) {
  #container {
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }

  .pixel-art-editor {
    padding: 50px 0;
  }
}

@media (max-width: 416px) {
  .pixel-art-editor {
    transform: scale(0.8) translatey(-75px);
  }

  h1 {
    font-size: 1.44rem;
  }
}

@media (max-width: 320px) {
  .pixel-art-editor * {
    display: none !important;
  }

  .pixel-art-editor::after {
    content: "Your screen is too small!";
    font-family: "Visitor", monospace;
    display: block !important;
  }
}
</style>
