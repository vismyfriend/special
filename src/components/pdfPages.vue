<template>
  <div class="pdf-page-container">
    <!-- PDF Viewer -->
    <div class="pdf-viewer">
      <iframe
        :src="pdfUrl"
        width="100%"
        height="500px"
        frameborder="0"
      ></iframe>
    </div>

    <!-- Simple Questions -->
    <div class="q-pa-md tasks-section">
      <q-card v-for="(task, index) in currentTasks" :key="index" class="q-mb-md">
        <q-card-section>
          <div class="text-h6">{{ task.taskDescription }}</div>
        </q-card-section>

        <q-card-section>
          <div v-for="(question, qIndex) in task.questions" :key="qIndex" class="q-mb-sm">
            <div class="question">{{ question }}</div>
            <q-input v-model="answers[index][qIndex]" outlined dense />
          </div>
        </q-card-section>
      </q-card>

      <q-btn
        color="primary"
        label="Проверить ответы"
        @click="checkAnswers"
        class="submit-btn"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import pdfPagesData from '../dataForGames/pdfPagesData';

const route = useRoute();
const answers = ref([]);

// Get current PDF data
const currentPdf = computed(() => {
  return pdfPagesData[route.params.pdfId] || {};
});

const pdfUrl = computed(() => {
  return currentPdf.value.pdfUrl || '';
});

const currentTasks = computed(() => {
  return currentPdf.value.tasks || [];
});

// Initialize answers array
onMounted(() => {
  answers.value = currentTasks.value.map(task => {
    return Array(task.questions?.length || 0).fill('');
  });
});

const checkAnswers = () => {
  q.notify({
    message: 'Ответы сохранены!',
    color: 'positive'
  });
};
</script>

<style scoped>
.pdf-page-container {
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  margin: 0 auto;
}

.pdf-viewer {
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.tasks-section {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.question {
  margin-bottom: 5px;
  font-weight: 500;
}

.submit-btn {
  margin-top: 20px;
  width: 100%;
}

@media (max-width: 600px) {
  .pdf-viewer {
    height: 300px;
  }
}
</style>
