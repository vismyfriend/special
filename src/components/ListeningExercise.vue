<template>
  <div v-if="exerciseData" class="exercise-container">
    <div class="exercise-header">
      <h2>{{ exerciseData.mainDescription }}</h2>
      <p class="main-description">for s.p.e.c.i.a.l. agents</p>
    </div>

    <div v-for="(task, index) in exerciseData.tasks" :key="index" class="task-container">
      <h3 class="task-title">{{ task.taskDescription }}</h3>

      <!-- Добавлено отображение картинки, если она есть -->
      <div v-if="task.taskPicture" class="task-image-container">
        <img :src="task.taskPicture" :alt="'Image for task ' + (index + 1)" class="task-image">
      </div>

      <audio controls class="audio-player">
        <source :src="task.audio" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      <!-- True / False -->
      <div v-if="task.taskID === 'true_false'" class="true-false-container">
        <table class="true-false-table">
          <thead>
          <tr>
            <th>(#vismyfriend text me if u find mistakes)</th>
            <th class="true-header">True</th>
            <th class="false-header">False</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(q, qi) in task.questions" :key="qi">
            <td>{{ q.text }}</td>
            <td>
              <label class="radio-label">
                <input
                  type="radio"
                  :name="'task' + index + 'q' + qi"
                  value="true"
                  v-model="answers[index][qi]"
                />
                <span class="radio-custom" :class="getRadioClass(index, qi, 'true', q.correctAnswer)"></span>
              </label>
            </td>
            <td>
              <label class="radio-label">
                <input
                  type="radio"
                  :name="'task' + index + 'q' + qi"
                  value="false"
                  v-model="answers[index][qi]"
                />
                <span class="radio-custom" :class="getRadioClass(index, qi, 'false', q.correctAnswer)"></span>
              </label>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Multiple Choice -->
      <div v-else-if="task.taskID === 'multiple_choice'" class="multiple-choice-container">
        <div v-for="(q, qi) in task.questions" :key="qi" class="question-container">
          <p class="question-text">{{ qi + 1 }}) {{ q.text }}</p>
          <div class="options-container">
            <label
              v-for="(label, key) in q.options"
              :key="key"
              class="option-label"
              :class="getOptionClass(index, qi, key, q.correctAnswer)"
            >
              <input
                type="radio"
                :name="'task' + index + 'q' + qi"
                :value="key"
                v-model="answers[index][qi]"
                class="option-input"
              />
              <span class="option-text">{{ key }}: {{ label }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="check-button-container">
        <button
          class="check-button"
          @click="checkAnswers(index)"
        >
          Проверить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import rawData from '../dataForGames/ListeningExerciseData'

const exerciseData = ref(null)
const answers = ref([])
const checkedTasks = ref([])

onMounted(() => {
  exerciseData.value = rawData
  answers.value = rawData.tasks.map((task) =>
    Array(task.questions.length).fill(null)
  )
  checkedTasks.value = rawData.tasks.map(() => false)
})

const checkAnswers = (taskIndex) => {
  checkedTasks.value[taskIndex] = true
}

const getRadioClass = (taskIndex, questionIndex, optionValue, correctAnswer) => {
  if (!checkedTasks.value[taskIndex]) return '';

  const selected = answers.value[taskIndex][questionIndex];

  if (optionValue === correctAnswer) {
    return selected === optionValue ? 'correct-selected' : 'correct-not-selected';
  } else if (selected === optionValue) {
    return 'incorrect-selected';
  }
  return '';
};

const getOptionClass = (taskIndex, questionIndex, optionValue, correctAnswer) => {
  if (!checkedTasks.value[taskIndex]) return ''

  const selected = answers.value[taskIndex][questionIndex]

  if (optionValue === correctAnswer) {
    return selected === optionValue ? 'option-correct-selected' : 'option-correct-not-selected'
  } else if (selected === optionValue) {
    return 'option-incorrect-selected'
  }
  return ''
}
</script>

<style scoped>
/* Base styles */
.exercise-container {
  max-width: 56rem; /* Ограничение ширины блока */
  margin: 2px 2px; /* Центрирование */
  padding: 15px; /* Внутренний отступ */
  background-color: white; /* Фон */
  border-radius: 15px; /* Скругление углов */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); /* Тень */
}

.exercise-header {
  margin-bottom: 10px;
}

.exercise-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.main-description {
  font-size: 1.125rem;
  color: #4b5563;
}

/* Task styles */
.task-container {
  padding: 5px;
  background-color: #cff0ff; /* Светло-голубой фон */
  border-radius: 1rem;
  margin-bottom: 0.5rem;
}

.task-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
}

.audio-player {
  width: 100%;
  border-radius: 0.5rem;
}

/* True/False table styles */
.true-false-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.true-false-table th {
  font-weight: 500;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.true-false-table td {
  padding: 3px;
  border-bottom: 1px solid #f3f4f6;
  color: #1f2937;
  line-height: 15px;
}

.true-false-table tr:hover {
  background-color: #f3f4f6;
}

.true-header {
  color: #10b981; /* Зеленый */
  text-align: center;
}

.false-header {
  color: #ef4444; /* Красный */
  text-align: center;
}

.radio-label {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.radio-custom {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 2px solid #d1d5db; /* серый */
  position: relative;
  transition: all 0.2s;
}

.radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: transparent;
  transition: all 0.2s;
}

input[type="radio"] {
  position: absolute;
  opacity: 0;
}

input[type="radio"]:checked + .radio-custom {
  border-color: #3b82f6;
}

input[type="radio"]:checked + .radio-custom::after {
  background-color: #3b82f6;
}

/* ✅❌ Стили выбора ответов (True/False) */

.radio-custom.correct-selected {
  border-color: #10b981;
}

.radio-custom.correct-selected::after {
  background-color: #10b981;
}

.radio-custom.correct-not-selected {
  border-color: #10b981;
}

.radio-custom.correct-not-selected::after {
  background-color: #10b981;
  opacity: 0.3; /* Затушенный зеленый */
}

.radio-custom.incorrect-selected {
  border-color: #ef4444;
}

.radio-custom.incorrect-selected::after {
  background-color: #ef4444;
}



/* Multiple choice styles */
.multiple-choice-container {
  display: grid;
  gap: 5px;
}

.question-container {
  padding: 5px;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.question-text {
  font-size: 1.125rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 5px;
}

.options-container {
  display: grid;
  gap: 5px;
  padding-left: 0.5rem;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  line-height: 15px;

  transition: all 0.2s;
}

.option-label:hover {
  background-color: #f3f4f6;
}

.option-input {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  transition: all 0.2s;
  cursor: pointer;
}

.option-input:checked {
  border-color: #3b82f6;
  background-color: #3b82f6;
}

.option-text {
  flex: 1;
  padding: 2px;
}

/* Option states */

.option-correct-selected {
  background-color: #ecfdf5; /* Светло-зеленый фон */
  border: 2px solid #10b981;
}

.option-correct-selected .option-input {
  border-color: #10b981;
  background-color: #10b981;
}

.option-correct-not-selected {
  background-color: #ecfdf5;
}

.option-correct-not-selected .option-input {
  border-color: #10b981;
  background-color: #10b981;
  opacity: 0.3;
}

.option-incorrect-selected {
  background-color: #fee2e2;
  border: 2px solid #ef4444;
}

.option-incorrect-selected .option-input {
  border-color: #ef4444;
  background-color: #ef4444;
}



/* Button styles */
.check-button-container {
  display: flex;
  justify-content: flex-end;
  padding-top: 5px;
}

.check-button {
  padding: 5px 5px;
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

}

.check-button:hover {
  background-color: #2563eb;
}


/* Task image styles */
.task-image-container {
  margin: 10px 0;
  text-align: center;
}

.task-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

</style>
