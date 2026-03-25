<template>
  <div v-if="currentGrammarData">
    <GrammarTable :data="currentGrammarData" />
  </div>
  <div v-else class="loading">
    Загрузка...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import GrammarTable from '../pages/GrammarChartPattern.vue';
import { grammarTables } from '../dataForGames/grammarTables.js';

const route = useRoute();
const currentGrammarData = ref(null);

onMounted(() => {
  const tableId = route.params.tableId;
  currentGrammarData.value = grammarTables[tableId];

  if (!currentGrammarData.value) {
    console.error('Grammar table not found:', tableId);
  }
});
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #111;
  color: #FFD700;
  font-family: 'Courier New', monospace;
  font-size: 1.5rem;
}
</style>
