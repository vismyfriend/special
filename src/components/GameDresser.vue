<template>
  <div class="game-container" v-if="currentGameData">
    <h1>Special</h1>

    <div class="suspect-board">
      <!-- Фон доски с мерной линейкой -->
      <img src="../assets/images/backgroundIsland.jpg" alt="Police board" class="board-background">

      <!-- Слой подозреваемого с изменяемыми частями -->
      <div class="suspect-layers">
        <img :src="currentParts.base" alt="Base suspect" class="suspect-base">
        <img :src="currentParts.head" alt="Headwear" class="suspect-head">
        <img :src="currentParts.body" alt="Body" class="suspect-body">
        <img :src="currentParts.legs" alt="Legs" class="suspect-legs">
        <img :src="currentParts.feet" alt="Feet" class="suspect-feet">
        <img :src="currentParts.soil" alt="Soil" class="suspect-soil">
      </div>

      <!-- Элементы управления -->
      <div class="controls">
        <div class="control-group" v-for="(category, index) in categories" :key="category.name"
             :style="{ top: `${20 + index * 15}%` }">
          <button @click="prevPart(category.name)" class="control-btn">◀</button>
          <span class="category-label">{{ category.label }}</span>
          <button @click="nextPart(category.name)" class="control-btn">▶</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import dresserGameData from '../dataForGames/dresserGameData'

const route = useRoute()
const currentGameData = ref(null)

// Инициализация данных игры
onMounted(() => {
  const missionName = route.params.missionName
  currentGameData.value = dresserGameData[missionName]
  initParts()
})

// Реактивные данные
const parts = computed(() => currentGameData.value?.parts || {})
const categories = computed(() => currentGameData.value?.categories || [])

const currentIndices = ref({})
const currentParts = ref({})

// Инициализация частей одежды
const initParts = () => {
  Object.keys(parts.value).forEach(category => {
    currentIndices.value[category] = 0
    currentParts.value[category] = parts.value[category][0]
  })
}

// Переключение частей одежды
const nextPart = (category) => {
  currentIndices.value[category] =
    (currentIndices.value[category] + 1) % parts.value[category].length
  currentParts.value[category] = parts.value[category][currentIndices.value[category]]
}

const prevPart = (category) => {
  currentIndices.value[category] =
    (currentIndices.value[category] - 1 + parts.value[category].length) % parts.value[category].length
  currentParts.value[category] = parts.value[category][currentIndices.value[category]]
}
</script>

<style lang="scss" scoped>
/* Стили остаются такими же, как в предыдущем варианте */
.game-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
}

.suspect-board {
  position: relative;
  width: 100%;
  height: 600px;
  margin-top: 20px;
  border: 3px solid #333;
  background-color: #f5f5f5;
  overflow: hidden;
}

.board-background {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
}

.suspect-layers {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Базовое изображение подозреваемого */
.suspect-base {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  max-height: 80%;
  z-index: 1;
}

/* Головной убор */
.suspect-head {
  position: absolute;
  bottom: 55%;
  left: 50%;
  transform: translateX(-50%);
  width: 30%;
  z-index: 2;
  border: 1px solid #0ae336; /* Временная рамка для отладки */
}

/* Верхняя часть тела */
.suspect-body {
  position: absolute;
  bottom: 35%;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  z-index: 3;
  border: 1px solid #61b7dc;
}

/* Ноги */
.suspect-legs {
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 35%;
  z-index: 4;
  border: 1px solid red;
}

/* Обувь */
.suspect-feet {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 35%;
  z-index: 5;
  border: 1px solid #ddd765;
}
/* Подошваь */
.suspect-soil {
  position: absolute;
  bottom: 0%;
  left: 50%;
  transform: translateX(-50%);
  width: 35%;
  z-index: 5;
  border: 1px solid #a80ce6;
}

.controls {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.control-group {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.7);
  padding: 5px 10px;
  border-radius: 20px;
  z-index: 10;
}

.control-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #333;
  background: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #333;
    color: white;
  }
}

.category-label {
  font-weight: bold;
  min-width: 100px;
}
</style>
