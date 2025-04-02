<template>
  <div>
    <button class="closeThisPage" @click="backToIntroPage">close Special App ❌</button>
    <canvas ref="myCanvas" width="800" height="400"></canvas>
    <div v-if="isSorted" class="success-message">
      Радуга собрана правильно! 🌈
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const myCanvas = ref(null);
const router = useRouter();

const rainbowColors = [
  { text: "Красный", color: "#FF0000" },
  { text: "Оранжевый", color: "#FF7F00" },
  { text: "Желтый", color: "#FFFF00" },
  { text: "Зеленый", color: "#00FF00" },
  { text: "Голубой", color: "#00FFFF" },
  { text: "Синий", color: "#0000FF" },
  { text: "Фиолетовый", color: "#8B00FF" }
];

// Настройки
const rectWidth = 100;
const rectHeight = 60;
const cornerRadius = 15;
const minSpacing = 20;
const rowSpacing = 80;
const animationSpeed = 0.2;

// Состояние
let items = [...rainbowColors];
let draggedItem = null;
const isSorted = ref(false);
let rectangles = [];
let animationId = null;

// Инициализация
const initRectangles = () => {
  const maxInRow = Math.floor(myCanvas.value.width / (rectWidth + minSpacing));
  const rows = Math.ceil(items.length / maxInRow);

  rectangles = items.map((item, index) => {
    const row = Math.floor(index / maxInRow);
    const col = index % maxInRow;
    const rowWidth = Math.min(items.length - row * maxInRow, maxInRow) * rectWidth +
      (Math.min(items.length - row * maxInRow, maxInRow) - 1) * minSpacing;
    const startX = (myCanvas.value.width - rowWidth) / 2;
    const startY = 50 + row * (rectHeight + rowSpacing);

    return {
      ...item,
      x: startX + col * (rectWidth + minSpacing),
      y: startY,
      width: rectWidth,
      height: rectHeight,
      targetX: startX + col * (rectWidth + minSpacing),
      targetY: startY,
      row,
      col,
      zIndex: index
    };
  });
};

// Перемешивание
const shuffleColors = () => {
  items = [...rainbowColors];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  initRectangles();
};

// Отрисовка
const drawFrame = () => {
  const ctx = myCanvas.value.getContext('2d');
  ctx.clearRect(0, 0, myCanvas.value.width, myCanvas.value.height);

  // Анимация к целевым позициям
  rectangles.forEach(rect => {
    if (rect !== draggedItem) {
      rect.x += (rect.targetX - rect.x) * animationSpeed;
      rect.y += (rect.targetY - rect.y) * animationSpeed;

      if (Math.abs(rect.targetX - rect.x) < 0.5) rect.x = rect.targetX;
      if (Math.abs(rect.targetY - rect.y) < 0.5) rect.y = rect.targetY;
    }
  });

  // Отрисовка всех карточек (сортировка по zIndex)
  [...rectangles].sort((a, b) => a.zIndex - b.zIndex).forEach(rect => {
    if (rect === draggedItem) {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetY = 5;
    }

    // Рисуем прямоугольник
    ctx.beginPath();
    ctx.moveTo(rect.x + cornerRadius, rect.y);
    ctx.lineTo(rect.x + rect.width - cornerRadius, rect.y);
    ctx.quadraticCurveTo(rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + cornerRadius);
    ctx.lineTo(rect.x + rect.width, rect.y + rect.height - cornerRadius);
    ctx.quadraticCurveTo(rect.x + rect.width, rect.y + rect.height, rect.x + rect.width - cornerRadius, rect.y + rect.height);
    ctx.lineTo(rect.x + cornerRadius, rect.y + rect.height);
    ctx.quadraticCurveTo(rect.x, rect.y + rect.height, rect.x, rect.y + rect.height - cornerRadius);
    ctx.lineTo(rect.x, rect.y + cornerRadius);
    ctx.quadraticCurveTo(rect.x, rect.y, rect.x + cornerRadius, rect.y);
    ctx.closePath();
    ctx.fillStyle = rect.color;
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Текст
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const words = rect.text.split(' ');
    if (words.length > 1) {
      ctx.fillText(words[0], rect.x + rect.width/2, rect.y + rect.height/2 - 10);
      ctx.fillText(words[1], rect.x + rect.width/2, rect.y + rect.height/2 + 10);
    } else {
      ctx.fillText(rect.text, rect.x + rect.width/2, rect.y + rect.height/2);
    }

    if (rect === draggedItem) ctx.restore();
  });

  animationId = requestAnimationFrame(drawFrame);
};

// Обновление позиций при перетаскивании
const updatePositions = () => {
  if (!draggedItem) return;

  // Определяем ближайшую строку
  const rows = [...new Set(rectangles.map(r => r.row))];
  let closestRow = draggedItem.row;
  let minDist = Infinity;

  rows.forEach(row => {
    const rowY = rectangles.find(r => r.row === row).targetY;
    const dist = Math.abs(draggedItem.y - rowY);
    if (dist < minDist) {
      minDist = dist;
      closestRow = row;
    }
  });

  // Элементы текущей строки (без перетаскиваемого)
  const rowItems = rectangles
    .filter(r => r.row === closestRow && r !== draggedItem)
    .sort((a, b) => a.targetX - b.targetX);

  // Определяем новую позицию в строке
  let insertIndex = rowItems.findIndex(r => draggedItem.x < r.targetX);
  if (insertIndex === -1) insertIndex = rowItems.length;

  // Рассчитываем новые позиции
  const rowWidth = (rowItems.length + 1) * rectWidth + rowItems.length * minSpacing;
  const startX = (myCanvas.value.width - rowWidth) / 2;

  // Обновляем позиции
  let currentPos = startX;
  let currentIndex = 0;

  for (let i = 0; i <= rowItems.length; i++) {
    if (i === insertIndex) {
      // Позиция для перетаскиваемого элемента
      draggedItem.targetX = currentPos;
      draggedItem.targetY = rectangles.find(r => r.row === closestRow)?.targetY ||
        50 + closestRow * (rectHeight + rowSpacing);
      draggedItem.row = closestRow;
      currentPos += rectWidth + minSpacing;
    } else if (currentIndex < rowItems.length) {
      // Позиции для других элементов строки
      rowItems[currentIndex].targetX = currentPos;
      currentPos += rectWidth + minSpacing;
      currentIndex++;
    }
  }

  // Обновляем zIndex чтобы перетаскиваемый был поверх
  rectangles.forEach(r => {
    if (r !== draggedItem && r.zIndex >= draggedItem.zIndex) {
      r.zIndex--;
    }
  });
  draggedItem.zIndex = rectangles.length - 1;
};

// Обработчики мыши
const handleMouseDown = (e) => {
  const rect = myCanvas.value.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  for (let i = 0; i < rectangles.length; i++) {
    const r = rectangles[i];
    if (mouseX > r.x && mouseX < r.x + r.width &&
      mouseY > r.y && mouseY < r.y + r.height) {
      draggedItem = r;
      draggedItem.offsetX = mouseX - r.x;
      draggedItem.offsetY = mouseY - r.y;
      break;
    }
  }
};

const handleMouseMove = (e) => {
  if (draggedItem) {
    const rect = myCanvas.value.getBoundingClientRect();
    draggedItem.x = e.clientX - rect.left - draggedItem.offsetX;
    draggedItem.y = e.clientY - rect.top - draggedItem.offsetY;
    updatePositions();
  }
};

const handleMouseUp = () => {
  if (draggedItem) {
    // Фиксируем позицию
    draggedItem.x = draggedItem.targetX;
    draggedItem.y = draggedItem.targetY;

    // Проверяем порядок
    checkSorted();
    draggedItem = null;
  }
};

// Проверка правильного порядка
const checkSorted = () => {
  const currentOrder = [...rectangles]
    .sort((a, b) => a.row - b.row || a.targetX - b.targetX)
    .map(r => r.text);

  isSorted.value = currentOrder.every((text, i) => text === rainbowColors[i].text);
};

// Инициализация
onMounted(() => {
  shuffleColors();
  drawFrame();

  const canvas = myCanvas.value;
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mouseleave", handleMouseUp);
});

// Очистка
onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);

  const canvas = myCanvas.value;
  canvas.removeEventListener("mousedown", handleMouseDown);
  canvas.removeEventListener("mousemove", handleMouseMove);
  canvas.removeEventListener("mouseup", handleMouseUp);
  canvas.removeEventListener("mouseleave", handleMouseUp);
});
</script>


<style lang="scss" scoped>
.closeThisPage {
  display: block;
  margin: 10px auto;
  border-radius: 30px;
  background-color: transparent;
  padding: 5px 15px;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f0f0;
    transform: scale(1.05);
  }
}

canvas {
  display: block;
  margin: 20px auto;
  border: 2px solid #ddd;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

.success-message {
  text-align: center;
  font-size: 28px;
  color: #4CAF50;
  margin-top: 20px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  animation: rainbow 2s linear infinite, pulse 1.5s ease infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes rainbow {
  0% { color: #FF0000; }
  14% { color: #FF7F00; }
  28% { color: #FFFF00; }
  42% { color: #00FF00; }
  57% { color: #00FFFF; }
  71% { color: #0000FF; }
  85% { color: #8B00FF; }
  100% { color: #FF0000; }
}
</style>
