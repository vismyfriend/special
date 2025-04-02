<template>
  <div>
    <button class="closeThisPage" @click="backToIntroPage">close Special App ❌</button>

    <div
      class="game-container"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
      ref="gameContainer"
    >
      <div
        v-for="(color, index) in colorItems"
        :key="color.text"
        class="color-card"
        :style="{
          backgroundColor: color.color,
          transform: `translate(${color.x}px, ${color.y}px)`,
          zIndex: color.zIndex,
          transition: color.isDragging ? 'none' : 'transform 0.3s ease'
        }"
        @mousedown="startDrag($event, color, index)"
      >
        <div class="color-text">{{ color.text }}</div>
      </div>
    </div>

    <div v-if="isSorted" class="success-message">
      Радуга собрана правильно! 🌈
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const gameContainer = ref(null);

const rainbowColors = [
  { text: "Красный", color: "#FF0000" },
  { text: "Оранжевый", color: "#FF7F00" },
  { text: "Желтый", color: "#FFFF00" },
  { text: "Зеленый", color: "#00FF00" },
  { text: "Голубой", color: "#00FFFF" },
  { text: "Синий", color: "#0000FF" },
  { text: "Фиолетовый", color: "#8B00FF" }
];

const colorItems = ref([]);
const draggedItem = ref(null);
const dragOffset = ref({ x: 0, y: 0 });
const isSorted = ref(false);

// Инициализация карточек
const initCards = () => {
  const cardWidth = 100;
  const cardHeight = 60;
  const spacing = 20;
  const containerPadding = 200; // отступ со всех сторон
  const containerWidth = 800;
  const containerHeight = 400;
  const innerWidth = containerWidth - containerPadding * 2;
  const innerHeight = containerHeight - containerPadding * 2;

  const itemsPerRow = Math.floor(containerWidth / (cardWidth + spacing));
  const rows = Math.ceil(rainbowColors.length / itemsPerRow);

  colorItems.value = rainbowColors.map((color, index) => {
    const row = Math.floor(index / itemsPerRow);
    const col = index % itemsPerRow;
    const rowWidth = Math.min(rainbowColors.length - row * itemsPerRow, itemsPerRow) * cardWidth +
      (Math.min(rainbowColors.length - row * itemsPerRow, itemsPerRow) - 1) * spacing;

    return {
      ...color,
      x: col * (cardWidth + spacing) + (containerWidth - rowWidth) / 2,
      y: row * (cardHeight + 40),
      width: cardWidth,
      height: cardHeight,
      zIndex: index,
      isDragging: false,
      targetX: col * (cardWidth + spacing) + (containerWidth - rowWidth) / 2,
      targetY: row * (cardHeight + 40)
    };
  });
};

// Перемешивание карточек
const shuffleColors = () => {
  const shuffled = [...rainbowColors];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  colorItems.value = shuffled.map((color, index) => {
    const cardWidth = 100;
    const cardHeight = 60;
    const spacing = 20;
    const containerWidth = 800;
    const itemsPerRow = Math.floor(containerWidth / (cardWidth + spacing));
    const row = Math.floor(index / itemsPerRow);
    const col = index % itemsPerRow;
    const rowWidth = Math.min(shuffled.length - row * itemsPerRow, itemsPerRow) * cardWidth +
      (Math.min(shuffled.length - row * itemsPerRow, itemsPerRow) - 1) * spacing;

    return {
      ...color,
      x: col * (cardWidth + spacing) + (containerWidth - rowWidth) / 2,
      y: row * (cardHeight + 40),
      width: cardWidth,
      height: cardHeight,
      zIndex: index,
      isDragging: false,
      targetX: col * (cardWidth + spacing) + (containerWidth - rowWidth) / 2,
      targetY: row * (cardHeight + 40)
    };
  });
};

// Начало перетаскивания
const startDrag = (event, color, index) => {
  const containerRect = gameContainer.value.getBoundingClientRect();
  const cardRect = event.currentTarget.getBoundingClientRect();

  // Правильно рассчитываем смещение относительно контейнера
  dragOffset.value = {
    x: event.clientX - containerRect.left - color.x,
    y: event.clientY - containerRect.top - color.y
  };

  draggedItem.value = color;
  color.isDragging = true;

  // Поднимаем карточку поверх остальных
  colorItems.value.forEach(item => {
    if (item.zIndex > color.zIndex) item.zIndex--;
  });
  color.zIndex = colorItems.value.length;
};

// Перетаскивание
const handleMouseMove = (event) => {
  if (!draggedItem.value) return;

  const containerRect = gameContainer.value.getBoundingClientRect();

  // Обновляем позицию перетаскиваемой карточки относительно контейнера
  draggedItem.value.x = event.clientX - containerRect.left - dragOffset.value.x;
  draggedItem.value.y = event.clientY - containerRect.top - dragOffset.value.y;

  // Обновляем позиции остальных карточек
  updatePositions();
};

// Обновление позиций карточек
const updatePositions = () => {
  if (!draggedItem.value) return;

  // Сортируем карточки по текущей позиции X
  const sortedCards = [...colorItems.value].sort((a, b) => a.x - b.x);
  const draggedIndex = sortedCards.findIndex(card => card === draggedItem.value);

  // Рассчитываем новые позиции
  const cardWidth = 100;
  const spacing = 20;
  const containerWidth = 800;

  // Определяем строку для перетаскиваемой карточки
  const rowHeight = 60 + 40; // cardHeight + rowSpacing
  const row = Math.round(draggedItem.value.y / rowHeight);
  const rowItems = colorItems.value.filter(card =>
    Math.round(card.y / rowHeight) === row && card !== draggedItem.value
  ).sort((a, b) => a.x - b.x);

  // Находим позицию в строке
  let insertIndex = rowItems.findIndex(card => draggedItem.value.x < card.x);
  if (insertIndex === -1) insertIndex = rowItems.length;

  // Рассчитываем ширину строки
  const rowWidth = (rowItems.length + 1) * cardWidth + rowItems.length * spacing;
  let startX = (containerWidth - rowWidth) / 2;

  // Обновляем позиции карточек в строке
  let currentIndex = 0;
  for (let i = 0; i <= rowItems.length; i++) {
    if (i === insertIndex) {
      // Позиция для перетаскиваемой карточки
      draggedItem.value.targetX = startX;
      draggedItem.value.targetY = row * rowHeight;
      startX += cardWidth + spacing;
    } else if (currentIndex < rowItems.length) {
      // Позиции для остальных карточек
      rowItems[currentIndex].targetX = startX;
      rowItems[currentIndex].targetY = row * rowHeight;
      startX += cardWidth + spacing;
      currentIndex++;
    }
  }

  // Плавное перемещение к целевым позициям
  colorItems.value.forEach(card => {
    if (card !== draggedItem.value) {
      const dx = card.targetX - card.x;
      const dy = card.targetY - card.y;

      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        card.x += dx * 0.2;
        card.y += dy * 0.2;
      } else {
        card.x = card.targetX;
        card.y = card.targetY;
      }
    }
  });
};

// Окончание перетаскивания
const handleMouseUp = () => {
  if (!draggedItem.value) return;

  // Фиксируем позицию перетаскиваемой карточки
  draggedItem.value.x = draggedItem.value.targetX;
  draggedItem.value.y = draggedItem.value.targetY;
  draggedItem.value.isDragging = false;
  draggedItem.value = null;

  // Проверяем правильный порядок
  checkSorted();
};

// Проверка правильного порядка
const checkSorted = () => {
  const currentOrder = [...colorItems.value]
    .sort((a, b) => a.y - b.y || a.x - b.x)
    .map(card => card.text);

  isSorted.value = currentOrder.every((text, i) => text === rainbowColors[i].text);
};

onMounted(() => {
  shuffleColors();
});

const backToIntroPage = () => {
  router.push('/');
};
</script>

<style scoped>
.game-container {
  position: relative;
  width: 800px;
  height: 400px;
  margin: 20px auto;
  border: 2px solid #ddd;
  background-color: #f8f8f8;
  border-radius: 8px;
  overflow: hidden;
}

.color-card {
  position: absolute;
  width: 100px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial;
  font-size: 14px;
  color: black;
  cursor: grab;
  user-select: none;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  border: 2px solid #333;
  will-change: transform;
  left: 0;
  top: 0;
}

.color-card:active {
  cursor: grabbing;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.color-text {
  text-align: center;
  padding: 5px;
}

.success-message {
  text-align: center;
  font-size: 28px;
  color: #4CAF50;
  margin-top: 20px;
  font-weight: bold;
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

.closeThisPage {
  display: block;
  margin: 10px auto;
  border-radius: 30px;
  background-color: transparent;
  padding: 5px 15px;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: all 0.2s;
}

.closeThisPage:hover {
  background-color: #f0f0f0;
  transform: scale(1.05);
}
</style>
