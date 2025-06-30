<template>
  <div v-if="exerciseData" class="exercise-container">
    <div class="exercise-header">
      <h2>{{ exerciseData.mainDescription }}</h2>
      <p class="main-description">Special tasks for S.P.E.C.i.A.L. agents</p>

      <!-- Блок управления seed -->
      <div class="seed-control">
        <div class="seed-display">
          Номер варианта:
          <span class="seed-value" @click="isEditingSeed = true" v-if="!isEditingSeed">
            {{ currentSeed }}
          </span>
          <input
            v-else
            v-model="inputSeed"
            @keyup.enter="applySeed"
            @blur="applySeed"
            class="seed-input"
            ref="seedInput"
          >
        </div>
        <button
          class="seed-copy-btn"
          @click="copySeed"
          title="Copy seed to clipboard"
        >
          📋
        </button>
      </div>

    </div>


    <div v-for="(task, index) in shuffledTasks"
         :key="index"
         class="task-container"
         :style="{ backgroundColor: rainbowColors[index % 7] }"
    >
      <h3 class="task-title">{{ task.taskDescription }}</h3>

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
            <th>правда / ТРУ / или / фОлс / ложь :</th>
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

          <!-- Добавленная кнопка Explain и блок с объяснением -->
          <div v-if="checkedTasks[index]" class="explain-container">
            <div v-if="expandedExplanations[index]?.[qi]" class="explanation-content">
              <p>{{ q.explanation }}</p>
            </div>
            <button
              class="explain-button"
              :class="getExplainButtonClass(index, qi, q.correctAnswer)"
              @click="toggleExplanation(index, qi)"
            >
              {{ expandedExplanations[index]?.[qi] ? 'Well, okay... ' : 'Explain it to me' }}
            </button>

          </div>
        </div>
      </div>

      <div class="check-script-wrapper">
        <button class="check-button" @click="checkAnswers(index)">
          Проверить - check
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

        <div v-if="task.textScript" class="script-toggle-wrapper">
          <button class="toggle-script-btn" @click="toggleScript(index)">
            {{ expandedScriptIndex === index ? 'Скрыть текст' : 'Explain it to me' }}
          </button>
        </div>
      </div>

      <div v-if="expandedScriptIndex === index" class="text-script-content">
        <p>{{ task.textScript }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import TestsAndExamsData from '../dataForGames/TestsAndExamsData'

const route = useRoute()
const exerciseData = ref(null)
const answers = ref([])
const checkedTasks = ref([])
const expandedScriptIndex = ref(null)
const taskScores = ref([])
const currentMission = ref('')
const shuffledTasks = ref([])
const expandedExplanations = ref([])

// Добавляем новые refs для seed:
const currentSeed = ref('')
const inputSeed = ref('')
const isEditingSeed = ref(false)
const seedInput = ref(null)

const hasSeedFeature = ref(true) // Включить/выключить seed-функционал
const showUsefulWords = ref(true) // Показывать полезные слова


// Генерация случайного seed (пример: "a1b2c3")
const generateRandomSeed = () => {
  return Math.random().toString(36).slice(2, 8)
}

// Детерминированное перемешивание на основе seed
const seededShuffle = (array, seed) => {
  const shuffled = [...array]
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }

  for (let i = shuffled.length - 1; i > 0; i--) {
    const pseudoRandom = (hash % (i + 1) + i) % (i + 1)
    const j = Math.abs(pseudoRandom)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}


// Обновлённая функция перемешивания теста
const shuffleTest = (tasks, seed) => {
  return tasks.map(task => {
    if (task.taskID !== 'multiple_choice') return {...task}

    // Перемешиваем вопросы с seed
    const shuffledQuestions = seededShuffle([...task.questions], seed + 'questions')

    const processedQuestions = shuffledQuestions.map(question => {
      const correctValue = question.options[question.correctAnswer]
      const optionsEntries = seededShuffle(
        Object.entries(question.options),
        seed + 'options' + question.text
      )

      const newOptions = {}
      let newCorrectKey = 'A'

      optionsEntries.forEach(([oldKey, value], index) => {
        const newKey = String.fromCharCode(65 + index)
        newOptions[newKey] = value
        if (oldKey === question.correctAnswer) {
          newCorrectKey = newKey
        }
      })

      return {
        ...question,
        options: newOptions,
        correctAnswer: newCorrectKey
      }
    })

    return {
      ...task,
      questions: processedQuestions
    }
  })
}

// Применяем новый seed
const applySeed = async () => {
  if (inputSeed.value.trim()) {
    currentSeed.value = inputSeed.value.trim()
  }
  isEditingSeed.value = false

  // Перестраиваем тест с новым seed
  if (exerciseData.value) {
    shuffledTasks.value = shuffleTest(exerciseData.value.tasks, currentSeed.value)
    resetAnswers()
  }
}

// Копируем seed в буфер обмена
const copySeed = () => {
  navigator.clipboard.writeText(currentSeed.value)
  // Можно добавить уведомление об успешном копировании nuvdc1 vfwvlh 11 qc9di4 qc9di4 so2fgq
}

// Сброс ответов при смене seed
const resetAnswers = () => {
  answers.value = shuffledTasks.value.map(task =>
    Array(task.questions.length).fill(null)
  )
  checkedTasks.value = shuffledTasks.value.map(() => false)
  taskScores.value = shuffledTasks.value.map(() => null)
  expandedExplanations.value = shuffledTasks.value.map(task =>
    Array(task.questions.length).fill(false)
  )
}




onMounted(() => {
  currentMission.value = route.params.missionName
  exerciseData.value = TestsAndExamsData[currentMission.value] || null

  // Генерируем начальный seed
  currentSeed.value = generateRandomSeed()
  inputSeed.value = currentSeed.value

  if (exerciseData.value) {
    shuffledTasks.value = shuffleTest(exerciseData.value.tasks, currentSeed.value)
    resetAnswers()
  }

  disableAudioDownload()
})


// Добавленная функция для переключения объяснения
const toggleExplanation = (taskIndex, questionIndex) => {
  if (!expandedExplanations.value[taskIndex]) {
    expandedExplanations.value[taskIndex] = []
  }
  expandedExplanations.value[taskIndex][questionIndex] =
    !expandedExplanations.value[taskIndex][questionIndex]
}

// Добавленная функция для определения класса кнопки Explain
const getExplainButtonClass = (taskIndex, questionIndex, correctAnswer) => {
  if (!checkedTasks.value[taskIndex]) return ''

  const isCorrect = answers.value[taskIndex][questionIndex] === correctAnswer
  return isCorrect ? 'explain-correct' : 'explain-incorrect'
}

const getGrade = (percentage) => {
  if (percentage === 100) return { letter: 'A+', class: 'grade-Aplus' }
  if (percentage >= 85) return { letter: 'A', class: 'grade-A' }
  if (percentage >= 75) return { letter: 'B+', class: 'grade-Bplus' }
  if (percentage >= 60) return { letter: 'B-', class: 'grade-Bminus' }
  if (percentage >= 40) return { letter: 'C', class: 'grade-C' }
  if (percentage >= 20) return { letter: 'D', class: 'grade-D' }
  if (percentage >= 10) return { letter: 'E', class: 'grade-E' }
  return { letter: 'F', class: 'grade-F' }
}

const toggleScript = (index) => {
  expandedScriptIndex.value = expandedScriptIndex.value === index ? null : index
}

const disableAudioDownload = () => {
  document.addEventListener('contextmenu', (e) => {
    if (e.target.classList.contains('audio-player')) {
      e.preventDefault()
      return false
    }
  })

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
    }
  })
}

const checkAnswers = (taskIndex) => {
  checkedTasks.value[taskIndex] = true
  const task = shuffledTasks.value[taskIndex]
  let correctCount = 0

  task.questions.forEach((q, qi) => {
    if (answers.value[taskIndex][qi] === q.correctAnswer) {
      correctCount++
    }
  })

  const percentage = Math.round((correctCount / task.questions.length) * 100)
  taskScores.value[taskIndex] = percentage
}

const getRadioClass = (taskIndex, questionIndex, optionValue, correctAnswer) => {
  if (!checkedTasks.value[taskIndex]) return ''

  const selected = answers.value[taskIndex][questionIndex]

  if (optionValue === correctAnswer) {
    return selected === optionValue ? 'correct-selected' : 'correct-not-selected'
  } else if (selected === optionValue) {
    return 'incorrect-selected'
  }
  return ''
}

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
  '#cff0ff',
  '#e0c0ff',
  '#ffc0cb',
  '#ffd700',
  '#98fb98',
  '#ffa07a',
  '#ff6347'
]
</script>

<style scoped>

/* Добавляем стили для seed-блока */
.seed-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  padding: 8px 12px;
  background-color: #f3f4f6;
  border-radius: 8px;
}

.seed-display {
  font-size: 0.9rem;
  color: #4b5563;
}

.seed-value {
  font-family: monospace;
  font-weight: bold;
  color: #3b82f6;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: #e0e7ff;
}

.seed-value:hover {
  background-color: #d1d8ff;
}

.seed-input {
  font-family: monospace;
  padding: 2px 6px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  width: 80px;
}

.seed-copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;
  border-radius: 4px;
}

.seed-copy-btn:hover {
  background-color: #e5e7eb;
}


.explain-container {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #e5e7eb;
}

.explain-button {
  padding: 4px 8px;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

/* Базовый цвет (если что-то пойдет не так) */
.explain-button {
  background-color: #8b5cf6;
  color: white;
}

/* Если ответ правильный */
.explain-button.explain-correct {
  background-color: #10b981;
  color: white;
}

/* Если ответ неправильный */
.explain-button.explain-incorrect {
  background-color: #ef4444;
  color: white;
}

.explain-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
.explanation-content {
  margin-top: 8px;
  padding: 8px;
  background-color: #f5f3ff;
  border-left: 3px solid #8b5cf6;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #1f2937;
}


.exercise-container {
  max-width: 56rem;
  margin: 2px 2px;
  padding: 15px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
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
  color: #10b981;
  text-align: center;
}

.false-header {
  color: #ef4444;
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
  border: 2px solid #d1d5db;
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

.radio-custom.correct-selected {
  border-color: #10b981;
}

.radio-custom.correct-selected::after {
  background-color: #10b981;
}

.radio-custom.incorrect-selected {
  border-color: #ef4444;
}

.radio-custom.incorrect-selected::after {
  background-color: #ef4444;
}

.multiple-choice-container {
  display: grid;
  gap: 25px;
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

.option-text::first-letter {
  font-weight: 750;
  color: #1f2937;
  font-style: italic;
}

.option-correct-selected {
  background-color: #ecfdf5;
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

.text-script-container {
  margin-top: 10px;
  text-align: left;
}

.toggle-script-btn {
  background-color: #f59e0b;
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
  flex-wrap: wrap;
  margin-top: 10px;
}

.script-toggle-wrapper {
  display: flex;
  align-items: center;
}

.option-selected {
  background-color: rgba(162, 195, 251, 0.87);
}

.option-selected .option-input {
  border-color: #6b7280;
  background-color: #6b7280;
}

.audio-player::-webkit-media-controls-enclosure {
  overflow: hidden;
}

.audio-player::-webkit-media-controls-panel {
  -webkit-user-select: none;
}

.score-display {
  font-size: 1rem;
  color: #6b7280;
  padding: 0 10px;
  transition: all 0.3s ease;
}

.score-visible {
  color: #1f2937;
  font-weight: bold;
  animation: fadeIn 0.5s ease;
}

.score-visible::after {
  content: attr(data-grade);
  color: #ef4444;
  margin-left: 2px;
}

.grade-Aplus { color: #10b981 !important; }
.grade-A { color: #10b981 !important; }
.grade-Bplus { color: #0e9e6f !important; }
.grade-Bminus { color: #f97316 !important; }
.grade-C { color: #f97316 !important; }
.grade-D { color: #ef4444 !important; }
.grade-E { color: #dc2626 !important; }
.grade-F { color: #991b1b !important; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .check-script-wrapper {
    flex-direction: column;
    gap: 8px;
  }
  .score-display {
    order: 1;
  }
}
</style>
