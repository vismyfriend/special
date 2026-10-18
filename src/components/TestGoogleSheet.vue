<template>

  <!--  библиотека public-google-sheets-parser — она zero-dependency и не требует API-ключей для публичных таблиц-->

  <div style="padding: 40px; font-family: sans-serif;">
    <h1>Test Google Sheet Loader</h1>

    <button @click="loadData" :disabled="loading">
      {{ loading ? 'Загрузка...' : 'Загрузить слова' }}
    </button>

    <p v-if="error" style="color: red;">Ошибка: {{ error }}</p>

    <div v-if="words.length" style="margin-top: 20px;">
      <p><strong>Загружено слов: {{ words.length }}</strong></p>
      <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%;">
        <thead>
        <tr style="background: #f0f0f0;">
          <th>Word</th>
          <th>Transcription</th>
          <th>Translation</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(word, index) in words" :key="index">
          <td>{{ word.word }}</td>
          <td>{{ word.transcription }}</td>
          <td>{{ word.translation }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import PublicGoogleSheetsParser from 'public-google-sheets-parser';

// ID твоей таблицы (из ссылки)
const SPREADSHEET_ID = '1DfstM9cBffsyCKmE2RxzWRq5rENDWhRd1aWAoB5O6XA';

const words = ref([]);
const loading = ref(false);
const error = ref(null);

const loadData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const parser = new PublicGoogleSheetsParser(SPREADSHEET_ID);
    const data = await parser.parse();

    // data — массив объектов, где ключи = заголовки из первой строки
    // Например: { word: "dog", transcription: "[dɒɡ]", translation: "собака" }
    words.value = data;
    console.log('Загруженные данные:', data);
  } catch (e) {
    console.error(e);
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};
// 🔥 Автозагрузка при открытии страницы
onMounted(() => {
  loadData();
});
</script>
