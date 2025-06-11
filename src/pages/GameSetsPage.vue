<template>
  <div class="q-pa-md">
    <h2>Наборы слов для игры: {{ gameName }}</h2>
    <div class="v-cards-choose">
      <div
        v-for="set in filteredSets"
        :key="set.id"
        class="v-card-choose"
        @click="goToGame(set.missionName)"
      >
        {{ set.missionDescription }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AllSetsOfWords } from 'src/data/setsOfWords' // Предполагается, что вы вынесете данные в отдельный файл

const route = useRoute()
const router = useRouter()
const gameName = ref(route.params.gameName)
const AllSetsOfWords = ref(JSON.parse(route.query.sets || '[]'))
// Фильтруем наборы слов, которые доступны для этой игры

const filteredSets = computed(() => {
  return AllSetsOfWords.value.filter(set => {
    // Здесь должна быть логика определения, какие наборы подходят для этой игры
    // Например, можно добавить поле games в объект набора слов
    return set.games?.includes(gameName.value)
  })
})


const goToGame = (missionName) => {
  router.push(`/see-all-sets-of-words/${missionName}/${gameName.value}`)
}
</script>

<style scoped>
/* Используем существующие стили */
.v-cards-choose {
  display: flex;
  flex-wrap: wrap;
}

.v-card-choose {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 5px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin: 1.5px;
  cursor: pointer;
}

.v-card-choose:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
