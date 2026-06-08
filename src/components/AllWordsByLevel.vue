<template>
  <div class="words-container">
    <h1>Все слова уровня {{ level }}</h1>
    <p class="total-count">Всего слов: {{ totalWordsCount }}</p>

    <div v-for="(set, setName) in currentLevelData" :key="setName" class="word-set">
      <h2 class="set-title">{{ getSetTitle(setName) }}</h2>
      <div class="words-grid">
        <div v-for="word in set" :key="word.id" class="word-card">
          <div class="eng-word">{{ word.eng }}</div>
          <div class="ru-word">{{ word.ru }}</div>
          <div v-if="word.hint" class="hint">{{ word.hint }}</div>
        </div>
      </div>
    </div>

    <div v-if="!currentLevelData" class="error">
      <p>Уровень {{ level }} не найден</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import shortWordsData from '../dataForGames/short-words-data';

const route = useRoute();
const router = useRouter();

const level = ref(route.params.level || 'A0');
const currentLevelData = ref(null);

// Подсчет общего количества слов
const totalWordsCount = computed(() => {
  if (!currentLevelData.value) return 0;
  let total = 0;
  for (const set in currentLevelData.value) {
    total += currentLevelData.value[set].length;
  }
  return total;
});

// Человеческие названия для наборов
const getSetTitle = (setName) => {
  const titles = {
    'pronouns0': '📖 Местоимения',
    'greetings': '👋 Приветствия',
    'numbers': '🔢 Числа',
    'colors': '🎨 Цвета',
    // добавьте другие
  };
  return titles[setName] || setName;
};

onMounted(() => {
  const levelName = route.params.level || 'A0';
  const data = shortWordsData[levelName];

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    currentLevelData.value = data;
  } else {
    console.error(`Level "${levelName}" not found`);
    currentLevelData.value = null;
  }
});
</script>

<style scoped>
.words-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.total-count {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
}

.word-set {
  margin-bottom: 40px;
  background: #f5f5f5;
  border-radius: 16px;
  padding: 20px;
}

.set-title {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #4a90e2;
  padding-bottom: 10px;
}

.words-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

.word-card {
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.word-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.eng-word {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
}

.ru-word {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 5px;
}

.hint {
  font-size: 12px;
  color: #95a5a6;
  font-style: italic;
  margin-top: 5px;
}

.error {
  text-align: center;
  padding: 50px;
  color: red;
}
</style>
