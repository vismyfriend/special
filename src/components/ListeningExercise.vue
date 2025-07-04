<template>
  <div v-if="exerciseData" class="exercise-container">
    <div class="exercise-header">
      <h2>{{ exerciseData.mainDescription }}</h2>
      <div class="header-bottom">
        <p class="main-description">Special tasks for S.P.E.C.i.A.L. agents</p>
        <div class="task-counter">
          {{ currentTaskIndex + 1 }}/{{ exerciseData.tasks.length }}
        </div>
      </div>
    </div>

    <div v-for="(task, index) in exerciseData.tasks"
         :key="index"
         class="task-container"
         :style="{
           backgroundColor: rainbowColors[index % 7],
           display: index === currentTaskIndex ? 'block' : 'none'
         }"
    >

      <!-- Блок для необходимых слов -->
      <div v-if="exerciseData?.tasks?.[index]?.usefulWords" class="useful-words-container">
        <div class="useful-words">
          <span class="useful-words-title">Useful words:</span>
          <div class="useful-words-content">
            <div v-for="(pair, i) in parseUsefulWords(exerciseData.tasks[index].usefulWords)"
                 :key="i"
                 class="word-pair">
              <span class="english-word">{{ pair.english }}</span>
              <span class="separator">-</span>
              <span class="translation">{{ pair.russian }}</span>
              <span v-if="i < parseUsefulWords(exerciseData.tasks[index].usefulWords).length - 1" class="comma">,</span>
            </div>
          </div>
        </div>
      </div>
      <h3 class="task-title">{{ task.taskDescription }}</h3>

      <!-- Добавлено отображение картинки, если она есть -->
      <div v-if="task.taskPicture" class="task-image-container">
        <img :src="task.taskPicture" :alt="'Image for task ' + (index + 1)" class="task-image">
      </div>

      <audio
        v-if="task.audio"
        controls
        class="audio-player"
        controlsList="nodownload"
        oncontextmenu="return false;"
      >
        <source :src="task.audio" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      <!-- True / False -->
      <div v-if="task.taskID === 'true_false'" class="true-false-container">
        <table class="true-false-table">
          <thead>
          <tr>
            <th>правда / ТРУ /  или / фОлс /  ложь :</th>
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
              :class="[
  getOptionClass(index, qi, key, q.correctAnswer),
  answers[index][qi] === key && !checkedTasks[index] ? 'option-selected' : ''
]"
            >
              <input
                type="radio"
                :name="'task' + index + 'q' + qi"
                :value="key"
                v-model="answers[index][qi]"
                class="option-input"
              />
              <span class="option-text">{{ key }} : {{ label }}</span>
            </label>
          </div>

        </div>
      </div>


      <div class="task-footer">
        <!-- Верхняя строка: управление проверкой -->
        <div class="task-controls">
          <button
            v-if="task.textScript"
            class="toggle-script-btn"
            @click="toggleScript(index)"
          >
            {{ expandedScriptIndex === index ? 'Скрыть подсказки' : 'Показать подсказки' }}
          </button>

          <div
            class="score-display"
            :class="[
        { 'score-visible': checkedTasks[index] },
        checkedTasks[index] ? getGrade(taskScores[index]).class : ''
      ]"
          >
            {{ checkedTasks[index] ? `${taskScores[index]}% (${getGrade(taskScores[index]).letter})` : '' }}
          </div>

          <button
            class="check-button"
            @click="checkAnswers(index)"
          >
            Проверить
          </button>

        </div>
        <!-- Текст скрипта (если открыт) -->
        <div v-if="expandedScriptIndex === index" class="text-script-content">
          <p>{{ task.textScript }}</p>
        </div>
        <!-- Нижняя строка: навигация (компактная) -->
        <div class="task-navigation">
          <button
            class="nav-button prev-button"
            @click="goToPrevTask"
            :disabled="currentTaskIndex === 0"
          >
            ←
          </button>

          <button
            class="nav-button next-button"
            @click="goToNextTask"
            :disabled="currentTaskIndex === exerciseData.tasks.length - 1"
          >
            →
          </button>

        </div>


      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ListeningExerciseData from '../dataForGames/ListeningExerciseData' // Импортируем данные

const route = useRoute()
const exerciseData = ref(null)
const answers = ref([])
const checkedTasks = ref([])
const expandedScriptIndex = ref(null)
const taskScores = ref([]); // Хранит проценты для каждого задания
const currentMission = ref('')
const currentTaskIndex = ref(0) // Добавляем отслеживание текущего задания

// Добавляем функцию для перехода к следующему заданию
const goToNextTask = () => {
  if (currentTaskIndex.value < exerciseData.value.tasks.length - 1) {
    currentTaskIndex.value++
    // Прокручиваем страницу вверх для удобства
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Добавляем функцию для перехода к предыдущему заданию (по желанию)
const goToPrevTask = () => {
  if (currentTaskIndex.value > 0) {
    currentTaskIndex.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
const getGrade = (percentage) => {
  if (percentage === 100) return { letter: 'A+', class: 'grade-Aplus' };
  if (percentage >= 85) return { letter: 'A', class: 'grade-A' };
  if (percentage >= 75) return { letter: 'B+', class: 'grade-Bplus' };
  if (percentage >= 60) return { letter: 'B-', class: 'grade-Bminus' };
  if (percentage >= 40) return { letter: 'C', class: 'grade-C' };
  if (percentage >= 20) return { letter: 'D', class: 'grade-D' };
  if (percentage >= 10) return { letter: 'E', class: 'grade-E' };
  return { letter: 'F', class: 'grade-F' };
};
const toggleScript = (index) => {
  expandedScriptIndex.value = expandedScriptIndex.value === index ? null : index
}

onMounted(() => {
  currentMission.value = route.params.missionName
  exerciseData.value = ListeningExerciseData[currentMission.value] || null

  if (exerciseData.value) {
    answers.value = exerciseData.value.tasks.map(task =>
      Array(task.questions.length).fill(null)
    )
    checkedTasks.value = exerciseData.value.tasks.map(() => false)
    taskScores.value = exerciseData.value.tasks.map(() => null)
  }

  disableAudioDownload()
})



const disableAudioDownload = () => {
  // 1. Блокировка контекстного меню
  document.addEventListener('contextmenu', (e) => {
    if (e.target.classList.contains('audio-player')) {
      e.preventDefault();
      return false;
    }
  });

  // 2. Блокировка горячих клавиш
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
    }
  });
};
const parseUsefulWords = (wordsString) => {
  if (!wordsString) return [];

  // Разбиваем строку по запятым, затем каждую пару по дефису
  return wordsString.split(',').map(pair => {
    const [english, russian] = pair.split('-').map(s => s.trim());
    return { english, russian };
  });
};
const checkAnswers = (taskIndex) => {
  checkedTasks.value[taskIndex] = true;

  // Рассчитываем процент правильных ответов
  const task = exerciseData.value.tasks[taskIndex];
  let correctCount = 0;

  task.questions.forEach((q, qi) => {
    if (answers.value[taskIndex][qi] === q.correctAnswer) {
      correctCount++;
    }
  });

  const percentage = Math.round((correctCount / task.questions.length) * 100);
  taskScores.value[taskIndex] = percentage;
};






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

const rainbowColors = [
  '#cff0ff', // 1 - светло-голубой
  '#e0c0ff', // 2 - светло-фиолетовый
  '#ffc0cb', // 3 - розовый
  '#ffd700', // 4 - золотой
  '#98fb98', // 5 - светло-зеленый
  '#ffa07a', // 6 - светло-оранжевый
  '#ff6347'  // 7 - красный
];
</script>

<style scoped>

/* Добавляем стили для счетчика заданий и кнопки Next Task */
.header-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.task-counter {
  font-size: 0.9rem;
  color: #5a5a5a;
  font-weight: 500;
  padding: 4px 10px;
  background-color: #f0f7ff; /* Пастельный голубой */
  border-radius: 12px;
  border: 1px solid #e0e7ff;
  min-width: 50px;
  text-align: center;
}
.next-task-wrapper {
  display: flex;
  justify-content: space-between; /* Распределяем кнопки по краям */
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px solid #e5e7eb;
}

.prev-task-button,
.next-task-button {
  padding: 8px 16px;
  color: white;
  font-weight: 500;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.prev-task-button {
  background-color: #6b7280; /* Серый цвет для предыдущей кнопки */
}

.prev-task-button:hover:not(:disabled) {
  background-color: #4b5563;
}

.next-task-button {
  background-color: #4f46e5; /* Синий цвет для следующей кнопки */
}

.next-task-button:hover:not(:disabled) {
  background-color: #4338ca;
}

/* Стили для disabled кнопок */
.prev-task-button:disabled,
.next-task-button:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
  opacity: 0.7;
}

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

/* Добавляем стили для seed-блока */
.useful-words-container {
  margin: 15px 0;
  width: 100%;
}

.useful-words {
  display: flex;
  flex-direction: column; /* Меняем направление на колонку */
  gap: 8px;
  padding: 12px 15px;
  background-color: #f3f4f6;
  border-radius: 8px;
  font-size: 0.9rem;
}

.useful-words-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 5px;
}

.useful-words-content {
  display: flex;
  flex-direction: column; /* Каждое слово на новой строке */
  gap: 6px;
}

.word-pair {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
}

.english-word {
  font-style: italic;
  color: #3b82f6;
  font-weight: 500;
}

.translation {
  color: #4b5563;
}

.separator {
  color: #9ca3af;
}

/* Убираем запятые, так как теперь каждое слово на новой строке */
.comma {
  display: none;
}

/* Task styles */
.task-container {
  padding: 5px;
  border-radius: 1rem;
  margin-bottom: 2.5rem;
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
  cursor: none;
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



input[type="radio"]:checked + .radio-custom::after {
  background-color: #5693f4;
}

/* ✅❌ Стили выбора ответов (True/False) */

.radio-custom.correct-selected {
  border-color: #10b981;
}

.radio-custom.correct-selected::after {
  background-color: #10b981;
}
/*
.radio-custom.correct-not-selected {
  border-color: #10b981;
} */

/*
.radio-custom.correct-not-selected::after {
  background-color: #10b981;
  opacity: 0.3;
}
*/

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
  cursor: none;
  line-height: 15px;

  transition: all 0.2s;
}

.option-label:hover {
  background-color: #ceced1;
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
  cursor: none;
}

.option-input:checked {
  border-color: #3b82f6;
  background-color: #3b82f6;
}

.option-text {
  flex: 1;
  padding: 2px;
  background: rgba(240, 248, 255, 0.52);
  border-radius: 15px;
}

/* Новый стиль для буквы варианта */
.option-text::first-letter {
  font-weight: 750; /*  жирный */
  color: #1f2937; /* Темный цвет для лучшей читаемости */
  font-style: italic;
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
  background-color: rgba(236, 253, 245, 0);

}

.option-correct-not-selected .option-input {
  border-color: #10b981;
  background-color: #10b981;
  opacity: 0;
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
  cursor: none;
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

  /* Эффект "виньетки" - затемнение краев
  mask-image: radial-gradient(

    circle at center,
    white 0%,
    white 70%,
    transparent 100%
  );  */
}

.text-script-container {
  margin-top: 10px;
  text-align: left;
}

.toggle-script-btn {
  background-color: #f59e0b; /* Желтая кнопка */
  color: white;
  padding: 6px 10px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: none;
  transition: background-color 0.2s;
}

.toggle-script-btn:hover {
  background-color: #d97706;
}


.text-script-content {
  margin-top: 10px;
  padding: 10px;
  background-color: #fefce8;
  border-left: 4px solid #facc15;
  border-radius: 6px;
  white-space: pre-line;
  font-size: 1rem;
  color: #1f2937;
}

.check-script-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap; /* Чтобы на мобильных не ломалось */
  margin-top: 10px;
}

.script-toggle-wrapper {
  display: flex;
  align-items: center;
}
/* Новый стиль для выбранного, но еще не проверенного варианта */
.option-selected {
  background-color: rgba(162, 195, 251, 0.87); /* Светло-серый */
}

.option-selected .option-input {
  border-color: #6b7280;
  background-color: #6b7280;
}

/* Скрываем стандартную кнопку скачивания в некоторых браузерах */
.audio-player::-webkit-media-controls-enclosure {
  overflow: hidden;
}
.audio-player::-webkit-media-controls-panel {
  -webkit-user-select: none;
}

.score-display {
  font-size: 1rem;
  color: #6b7280; /* Серый цвет для "?%" */
  padding: 0 10px;
  transition: all 0.3s ease;
}

.score-visible {
  color: #1f2937; /* Основной цвет для процентов */
  font-weight: bold;
  animation: fadeIn 0.5s ease;
}

.score-visible::after {
  content: attr(data-grade);
  color: #ef4444; /* Красный цвет для оценки */
  margin-left: 2px;
}

/* Цветовые акценты для разных оценок */
.grade-Aplus { color: #10b981 !important; } /* A+ - зеленый */
.grade-A { color: #10b981 !important; }     /* A - зеленый */
.grade-Bplus { color: #0e9e6f !important; } /* B+ - желтый */
.grade-Bminus { color: #f97316 !important; }/* B- - желтый */
.grade-C { color: #f97316 !important; }     /* C - оранжевый */
.grade-D { color: #ef4444 !important; }     /* D - красный */
.grade-E { color: #dc2626 !important; }     /* E - темно-красный */
.grade-F { color: #991b1b !important; }     /* F - очень темно-красный */

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Адаптация для мобильных */
@media (max-width: 768px) {
  .check-script-wrapper {
    flex-direction: column;
    gap: 8px;
  }
  .score-display {
    order: 1; /* Помещаем проценты между кнопками */
  }
}
.task-footer {
  margin-top: 20px;
  border-top: 1px solid #e5e7eb;
  padding-top: 15px;
}

.task-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.score-display {
  margin: 0 auto; /* Центрируем проценты */
  font-weight: 500;
}

.task-navigation {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
}

.nav-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
  background: white;
  font-size: 1.1rem;
}

.prev-button:not(:disabled):hover {
  background-color: #f3f4f6;
}

.next-button:not(:disabled):hover {
  background-color: #f3f4f6;
}

.nav-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.check-button {
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.check-button:hover {
  background-color: #2563eb;
}

.toggle-script-btn {
  background-color: rgba(220, 43, 250, 0.56);
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 5px;
  font-size: 0.9rem;
  white-space: nowrap;
}

.toggle-script-btn:hover {
  color: #3b82f6;
  text-decoration: underline;
}

/* Адаптация для мобильных */
@media (max-width: 768px) {
  .task-controls {
    flex-wrap: wrap;
  }

  .score-display {
    order: 1;
    width: 100%;
    text-align: center;
    margin: 5px 0;
  }
}
</style>
