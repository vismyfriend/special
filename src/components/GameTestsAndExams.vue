<template>
  <div v-if="exerciseData" class="exercise-container">
    <div class="exercise-header">
      <h2>{{ exerciseData.mainDescription }}</h2>
      <div class="header-bottom">
        <p class="main-description">Special tasks for S.P.E.C.i.A.L. agents</p>
        <div class="task-counter">
          {{ currentTaskIndex + 1 }}/{{ shuffledTasks.length }}
        </div>
      </div>


    </div>

    <div v-for="(task, index) in shuffledTasks"
         :key="index"
         class="task-container"
         :style="{
           backgroundColor: rainbowColors[index % 7],
           display: index === currentTaskIndex ? 'block' : 'none'
         }"
    >
      <!-- Аудиоплеер с sticky-позиционированием -->
      <div v-if="task.audio" class="audio-player-sticky-container">
        <audio
          controls
          class="audio-player"
          controlsList="nodownload"
          oncontextmenu="return false;"
        >
          <source :src="task.audio" type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      </div>

      <div class="task-content">
        <!-- Блок для необходимых слов -->
        <div v-if="task?.usefulWords" class="useful-words-container">
          <div class="useful-words">
            <span class="useful-words-title">Useful words:</span>
            <div class="useful-words-content">
              <div v-for="(pair, i) in parseUsefulWords(task.usefulWords)"
                   :key="i"
                   class="word-pair">
                <span class="english-word">{{ pair.english }}</span>
                <span class="separator">-</span>
                <span class="translation">{{ pair.russian }}</span>
                <span v-if="i < parseUsefulWords(task.usefulWords).length - 1" class="comma">,</span>
              </div>
            </div>
          </div>
        </div>

        <h3 class="task-title">{{ task.taskDescription }}</h3>

        <!-- Добавлено отображение картинки, если она есть -->
        <div v-if="task.taskPicture" class="task-image-container">
          <img :src="task.taskPicture" :alt="'Image for task ' + (index + 1)" class="task-image">
        </div>

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
        <!-- Multiple Choice -->
        <div v-else-if="task.taskID === 'multiple_choice'" class="multiple-choice-container">
          <div v-for="(q, qi) in task.questions" :key="qi" class="question-container">
            <p class="question-text margin-bottom">{{ qi + 1 }}) {{ q.text }}</p>

            <!-- Добавлено: отображение картинки для вопроса, если она есть -->
            <div v-if="q.questionPicture" class="question-image-container">
              <img :src="q.questionPicture" :alt="'Image for question ' + (qi + 1)" class="question-image">
            </div>

            <div class="options-container">
              <label
                v-for="(label, key) in q.options"
                :key="key"
                class="option-label"
                :class="getInstantOptionClass(index, qi, key, q.correctAnswer)"
              >
                <input
                  type="radio"
                  :name="'task' + index + 'q' + qi"
                  :value="key"
                  class="option-input"
                  @click="handleMultipleChoiceSelection(index, qi, key, $event)"
                />
                <span class="option-text">{{ key }} : {{ label }}</span>
              </label>
            </div>

            <!-- Кнопка Explain появляется сразу после выбора ответа -->
            <div v-if="answers[index][qi]" class="explain-container">
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
          <!-- Кнопка "Проверить" УДАЛЕНА -->
        </div>
        <!-- Student Input блок -->
        <div v-else-if="task.taskID === 'student_input'" class="student-input-container">
          <div v-for="(q, qi) in task.questions" :key="qi" class="question-container">
            <p class="question-text">
              <template v-for="(part, i) in splitQuestionText(q.text)">
                <template v-if="part.startsWith('_')">
                  <!-- Для коротких ответов (1-3 подчеркивания) оставляем input -->
                  <input
                    v-if="part.length <= 3"
                    type="text"
                    placeholder=". . ."
                    class="student-input"
                    :class="[
      getInputClass(index, qi, q.correctAnswer, q.almostCorrectAnswers),
      {
        'input-small': part.length === 1,
        'input-medium': part.length === 2,
        'input-large': part.length === 3
      }
    ]"
                    v-model="answers[index][qi]"
                    @keyup.enter="focusNextInput(index, qi)"
                    @input="handleSpecialInput(index, qi, $event)"

                  :disabled="false"
                    :data-task="index"
                    :data-question="qi"
                    ref="inputFields"
                  />
                  <!-- Для длинных ответов (4+ подчеркиваний) используем textarea с авто-растяжением -->
                  <textarea
                    v-else
                    class="student-input student-input-textarea"
                    :class="[
      getInputClass(index, qi, q.correctAnswer, q.almostCorrectAnswers),
      'input-full'
    ]"
                    v-model="answers[index][qi]"
                    v-autoresize
                    @input="handleSpecialInput(index, qi, $event)"
                    :disabled="false"
                    :data-task="index"
                    :data-question="qi"
                    ref="inputFields"
                    rows="1"
                    placeholder=". . ."
                  ></textarea>
                </template>                <template v-else>
                  {{ part }}
                </template>
              </template>
            </p>
            <div v-if="checkedTasks[index]" class="answer-feedback">
              <span v-if="q.correctAnswer === 'anyIsOk'"
                    class="correct-answer">✓ Принимается любой ответ, если хотите make sure - отправьте скриншот Винсентику!</span>
              <span v-else-if="isAnswerCorrect(index, qi, q.correctAnswer, q.almostCorrectAnswers) === 'correct'"
                    class="correct-answer">✓ Верно!</span>
              <span v-else-if="isAnswerCorrect(index, qi, q.correctAnswer, q.almostCorrectAnswers) === 'almost'"
                    class="almost-answer">⚠ Вроде тоже норм ответ, но стоит проверить!</span>
              <span v-else class="incorrect-answer">
                ✗ здесь верно будет: <strong>{{ q.correctAnswer }}</strong>
              </span>
            </div>
          </div>
        </div>

        <!-- DropDown Text блок -->
        <div v-else-if="task.taskID === 'drop_down_text'" class="drop-down-text-container">
          <div v-for="(question, qi) in task.questions" :key="qi" class="question-container">
            <div v-for="(paragraph, pi) in splitDropDownText(question.text)" :key="pi" class="paragraph">
              <p>
                <template v-for="(part, i) in paragraph" :key="i">
                  <template v-if="part.type === 'dropdown'">
                    <select
                      class="drop-down-select"
                      v-model="answers[index][qi][part.index]"
                      :class="getDropDownClass(index, qi, part.index, part.correctOptions)"
                    >
                      <option value="" disabled selected>? ? ?</option>
                      <option
                        v-for="(option, oi) in part.options"
                        :key="oi"
                        :value="option.value"
                      >
                        {{ option.value }}
                      </option>
                    </select>
                  </template>
                  <template v-else>
                    {{ part.text }}
                  </template>
                </template>
              </p>
            </div>
            <div v-if="checkedTasks[index] && isDropDownAnswerCorrect(index, qi, question.text) !== ''" class="answer-feedback">
              <span v-if="isDropDownAnswerCorrect(index, qi, question.text) === 'correct'"
                    class="correct-answer">✓ Верно!</span>
              <span v-else class="incorrect-answer">
                ✗ Неверно. Где-то нужно исправить!
              </span>
            </div>
          </div>
        </div>

        <!-- Grid Table блок -->
        <div v-else-if="task.taskID === 'grid_table'" class="grid-table-container">
          <table class="grid-table">
            <thead>
            <tr>
              <th v-for="(header, hi) in task.tableData.headers" :key="hi">{{ header }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, ri) in task.tableData.rows" :key="ri">
              <td v-for="(cell, ci) in row.cells" :key="ci">
                <template v-if="row.editable[ci]">
                  <input
                    type="text"
                    class="grid-table-input"
                    :class="getGridInputClass(index, ri, ci, row.correctAnswers)"
                    v-model="answers[index][ri].cells[ci]"
                    :placeholder="row.correctAnswers?.cells[ci] === 'anyIsOk' ? 'Any answer' : ''"
                  />
                </template>
                <template v-else>
                  {{ cell }}
                </template>
              </td>
            </tr>
            </tbody>
          </table>

          <div v-if="checkedTasks[index]" class="grid-table-feedback">
            <div v-for="(feedback, fi) in gridTableFeedback[index]" :key="fi" class="feedback-item">
              Строка {{ fi + 1 }}:
              <span v-if="feedback.allCorrect" class="correct-feedback">✓ Все верно!</span>
              <template v-else>
                <span v-for="(item, key) in feedback.incorrect" :key="key" class="incorrect-feedback">
                  ✗ ожидалось "{{ item.correct }}"
                </span>
              </template>
            </div>
          </div>
        </div>

        <!-- Discussion Task блок -->
        <div v-else-if="task.taskID === 'discussion_task'" class="discussion-task-container">
          <div v-for="(q, qi) in task.questions" :key="qi" class="discussion-question">
            <div class="question-controls">
              <button
                class="discussion-checkbox"
                @click.stop="toggleDiscussionQuestion(index, qi)"
                :class="{ 'checked': discussionChecked[index]?.[qi] }"
              >
              </button>
            </div>
            <div class="question-content" :class="{ 'collapsed': discussionCollapsed[index]?.[qi] }">
              <div class="question-text">{{ q.text }}</div>
              <div class="translation-section">
                <div
                  v-if="!discussionCollapsed[index]?.[qi]"
                  class="translation-toggle"
                  @click.stop="toggleDiscussionTranslation(index, qi)"
                >
                  <template v-if="!showTranslation[index]?.[qi]">Показать перевод</template>
                  <template v-else>
                    <span class="translation-text">{{ q.translation }}</span>
                  </template>
                </div>
                <div v-if="discussionCollapsed[index]?.[qi]" class="translation-text collapsed-translation">
                  {{ q.translation }}
                </div>
              </div>
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
            <!-- Блок управления seed -->
            <!-- Блок управления seed - показываем ТОЛЬКО для multiple choice -->
            <div
              v-if="task.taskID === 'multiple_choice'"
              class="seed-control"
            >
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
            <div
              class="score-display"
              :class="[
      { 'score-visible': checkedTasks[index] },
      checkedTasks[index] ? getGrade(taskScores[index]).class : ''
    ]"
            >
              {{ checkedTasks[index] ? `${taskScores[index]}% (${getGrade(taskScores[index]).letter})` : '' }}
            </div>

            <!-- НОВАЯ КНОПКА: Статистика для multiple-choice -->
            <button
              v-if="task.taskID === 'multiple_choice'"
              class="stats-button"
              @click="showMultipleChoiceStats(index)"
              title="Посмотреть подробную статистику"
            >
              📊 Статистика
            </button>

            <!-- Кнопка Проверить для остальных заданий -->
            <button
              v-if="task.taskID !== 'discussion_task' && task.taskID !== 'multiple_choice'"
              class="check-button"
              @click="checkAnswers(index)"
              :data-task-type="task.taskID"
            >
              Проверить
            </button>
            <button
              v-else-if="task.taskID === 'discussion_task'"
              class="check-button"
              @click="toggleShuffle(index)"
            >
              {{ isShuffled ? 'Unshuffle' : 'Shuffle' }}
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
              :disabled="currentTaskIndex === shuffledTasks.length - 1"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Модальное окно статистики -->
    <!-- Модальное окно статистики -->
    <div v-if="showStats && currentStats" class="stats-modal-overlay" @click="closeStats">
      <div class="stats-modal" @click.stop>
        <div class="stats-modal-header">
          <h3>📊 Статистика выполнения теста</h3>
          <button class="close-button" @click="closeStats">✕</button>
        </div>

        <div class="stats-modal-content">
          <div class="stats-summary">
            <div class="stat-item">
              <span class="stat-label">Вопросов было:</span>
              <span class="stat-value">{{ currentStats.totalQuestions }}</span>
            </div>

            <!-- НОВОЕ: пропущенные вопросы -->
            <div class="stat-item">
              <span class="stat-label">Вопросов пропущенно:</span>
              <span class="stat-value" :class="{ 'warning': currentStats.skippedQuestions > 0 }">
            {{ currentStats.skippedQuestions }}
          </span>
            </div>

            <div class="stat-item">
              <span class="stat-label">Опыта получено:</span>
              <span class="stat-value">{{ currentStats.totalClicks }}</span>
            </div>


            <!-- НОВОЕ: всего вариантов ответов -->
            <div class="stat-item">
              <span class="stat-label">Рассмотрено ответов:</span>
              <span class="stat-value">{{ currentStats.totalOptions }}</span>
            </div>




            <div class="stat-item">
              <span class="stat-label">Достижений:</span>
              <span class="stat-value correct">{{ currentStats.correctClicks }}</span>
            </div>

            <div class="stat-item">
              <span class="stat-label">Косяков:</span>
              <span class="stat-value incorrect">{{ currentStats.wrongClicks }}</span>
            </div>

            <div class="stat-item">
              <span class="stat-label">Точность:</span>
              <span class="stat-value">{{ currentStats.accuracy }}%</span>
            </div>

            <div class="stat-item highlight">
              <span class="stat-label">Финальный результат:</span>
              <span class="stat-value grade">{{ currentStats.finalScore }}% ({{ currentStats.finalGrade }})</span>
            </div>
          </div>

          <div class="stats-questions" v-if="currentStats.questionsStats.length > 0">
            <h4>Детали по вопросам:</h4>
            <div class="questions-grid">
              <div
                v-for="stat in currentStats.questionsStats"
                :key="stat.questionNumber"
                class="question-stat-card"
                :class="{
              'final-correct': stat.isFinalCorrect,
              'skipped': stat.isSkipped
            }"
              >
                <div class="question-number">{{ stat.questionNumber }})  {{ stat.questionText }} </div>

                <!-- НОВОЕ: индикатор пропущенного вопроса -->
<!--                <div v-if="stat.isSkipped" class="skipped-badge">-->
<!--                  ⏭️ Пропущен-->
<!--                </div>-->

<!--                <div class="question-options">-->
<!--                  Вариантов: {{ stat.optionsCount }}-->
<!--                </div>-->

<!--                <div class="question-clicks">Кликов: {{ stat.clicks }}</div>-->

                <div class="question-breakdown">
                  <span class="correct">✓ {{ stat.correctClicks }}</span>
                  <span class="incorrect">✗ {{ stat.wrongClicks }}</span>
                </div>

<!--                <div-->
<!--                  class="question-final"-->
<!--                  :class="{-->
<!--                'correct': stat.isFinalCorrect,-->
<!--                'incorrect': stat.isFinalCorrect === false,-->
<!--                'skipped': stat.isSkipped-->
<!--              }"-->
<!--                >-->
<!--&lt;!&ndash;                  <span v-if="stat.isSkipped">⏭️ Нет ответа</span>&ndash;&gt;-->
<!--&lt;!&ndash;                  <span v-else-if="stat.isFinalCorrect">✓ Верно</span>&ndash;&gt;-->
<!--&lt;!&ndash;                  <span v-else>✗ Неверно</span>&ndash;&gt;-->
<!--                </div>-->
              </div>
            </div>
          </div>
        </div>

        <div class="stats-modal-footer">
          <div class="footer-buttons">
            <button class="send-button" @click="sendToTeacher">
              📤 Отправить учителю
            </button>
            <button class="close-button" @click="closeStats">
              Закрыть
            </button>
          </div>
        </div>
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
const currentTaskIndex = ref(0)
const discussionChecked = ref([])
const discussionCollapsed = ref([])
const showTranslation = ref([])
const isShuffled = ref(false)
const gridTableFeedback = ref([])
const inputFields = ref([])

// Seed-related refs
const currentSeed = ref('')
const inputSeed = ref('')
const isEditingSeed = ref(false)
const seedInput = ref(null)

// Функция отправки в Telegram
// Функция отправки в Telegram
const sendToTeacher = async () => {
  if (!currentStats.value || !exerciseData.value) return;

  const username = 'vismyfriend'; // Ваш username в Telegram
  const taskName = exerciseData.value.mainDescription; // <-- ИСПОЛЬЗУЕМ mainDescription
  const finalScore = currentStats.value.finalScore;
  const finalGrade = currentStats.value.finalGrade;

  // Формируем сообщение
  const message = `привет Винсент, я выполнил задание "${taskName}" и мой результат ${finalScore}% (${finalGrade})`;

  // Копируем в буфер обмена
  try {
    await navigator.clipboard.writeText(message);

    // Показываем уведомление
    alert(`✅ Скопировано!\n\nОтправляю учителю...\n\nТекст сообщения:\n"${message}"`);

    // Открываем Telegram
    const telegramUrl = `https://t.me/${username}?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  } catch (err) {
    console.error('Failed to copy:', err);
    alert('❌ Не удалось скопировать, скажите об это Винсенту');

    // Всё равно открываем Telegram
    const telegramUrl = `https://t.me/${username}?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  }
};
// НОВОЕ: История выбранных ответов для каждого вопроса
const selectedAnswersHistory = ref([])

// НОВАЯ ФУНКЦИЯ: Подсчет статистики для multiple-choice
const calculateMultipleChoiceStats = (taskIndex) => {
  const task = shuffledTasks.value[taskIndex]
  if (!task || task.taskID !== 'multiple_choice') return null

  let totalClicks = 0
  let correctClicks = 0
  let wrongClicks = 0
  let totalOptions = 0  // НОВОЕ: всего вариантов ответов
  let skippedQuestions = 0  // НОВОЕ: пропущенные вопросы
  let questionsStats = []

  task.questions.forEach((q, qi) => {
    const history = selectedAnswersHistory.value[taskIndex]?.[qi] || []
    const finalAnswer = answers.value[taskIndex]?.[qi]

    // Подсчет общего количества вариантов ответов для этого вопроса
    const optionsCount = Object.keys(q.options).length
    totalOptions += optionsCount

    // Проверка, пропущен ли вопрос (нет финального ответа)
    if (!finalAnswer) {
      skippedQuestions++
    }

    // Подсчет кликов по этому вопросу
    const questionClicks = history.length
    totalClicks += questionClicks

    // Подсчет правильных и неправильных кликов
    let questionCorrectClicks = 0
    let questionWrongClicks = 0

    history.forEach(answer => {
      const isAnswerCorrect = Array.isArray(q.correctAnswer)
        ? q.correctAnswer.includes(answer)
        : answer === q.correctAnswer

      if (isAnswerCorrect) {
        questionCorrectClicks++
      } else {
        questionWrongClicks++
      }
    })

    correctClicks += questionCorrectClicks
    wrongClicks += questionWrongClicks

    // Статистика по конкретному вопросу
    questionsStats.push({
      questionNumber: qi + 1,
      questionText: q.text, // текст вопроса
      clicks: questionClicks,
      correctClicks: questionCorrectClicks,
      wrongClicks: questionWrongClicks,
      finalAnswer: finalAnswer,
      isFinalCorrect: finalAnswer && (Array.isArray(q.correctAnswer)
        ? q.correctAnswer.includes(finalAnswer)
        : finalAnswer === q.correctAnswer),
      optionsCount: optionsCount,  // НОВОЕ: количество вариантов в вопросе
      isSkipped: !finalAnswer  // НОВОЕ: пропущен ли вопрос
    })
  })

  return {
    totalQuestions: task.questions.length,
    totalOptions,  // НОВОЕ
    totalClicks,
    correctClicks,
    wrongClicks,
    skippedQuestions,  // НОВОЕ
    accuracy: totalClicks > 0 ? Math.round((correctClicks / totalClicks) * 100) : 0,
    finalScore: taskScores.value[taskIndex] || 0,
    finalGrade: getGrade(taskScores.value[taskIndex] || 0).letter,
    questionsStats
  }
}
// НОВАЯ ПЕРЕМЕННАЯ: для хранения состояния показа статистики
const showStats = ref(false)
const currentStats = ref(null)

// НОВАЯ ФУНКЦИЯ: Показать статистику
const showMultipleChoiceStats = (taskIndex) => {
  currentStats.value = calculateMultipleChoiceStats(taskIndex)
  showStats.value = true
}

// НОВАЯ ФУНКЦИЯ: Закрыть статистику
const closeStats = () => {
  showStats.value = false
  currentStats.value = null
}




// Генерация случайного seed
const generateRandomSeed = () => {
  return Math.random().toString(36).slice(2, 8)
}

// Детерминированное перемешивание на основе seed
const seededShuffle = (array, seed) => {
  const shuffled = [...array]
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
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

    const shuffledQuestions = seededShuffle([...task.questions], seed + 'questions')

    const processedQuestions = shuffledQuestions.map(question => {
      const optionsEntries = seededShuffle(
        Object.entries(question.options),
        seed + 'options' + question.text
      )

      const newOptions = {}
      const oldToNewKeyMap = {}

      optionsEntries.forEach(([oldKey, value], index) => {
        const newKey = String.fromCharCode(65 + index)
        newOptions[newKey] = value
        oldToNewKeyMap[oldKey] = newKey
      })

      let newCorrectAnswer
      if (Array.isArray(question.correctAnswer)) {
        newCorrectAnswer = question.correctAnswer.map(oldKey => oldToNewKeyMap[oldKey])
      } else {
        newCorrectAnswer = oldToNewKeyMap[question.correctAnswer]
      }

      return {
        ...question,
        options: newOptions,
        correctAnswer: newCorrectAnswer
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

  if (exerciseData.value) {
    shuffledTasks.value = shuffleTest(exerciseData.value.tasks, currentSeed.value)
    resetAnswers()
  }
}

// Копируем seed в буфер обмена
const copySeed = () => {
  navigator.clipboard.writeText(currentSeed.value)
}

// Сброс ответов при смене seed
// Сброс ответов при смене seed
const resetAnswers = () => {
  answers.value = shuffledTasks.value.map(task => {
    if (task.taskID === 'grid_table') {
      return initializeGridTableAnswers(task)
    } else if (task.taskID === 'drop_down_text') {
      return task.questions.map(q => {
        const dropdownCount = (q.text.match(/\(/g) || []).length
        return Array(dropdownCount).fill('')
      })
    } else if (task.taskID === 'discussion_task') {
      return []
    } else {
      return Array(task.questions.length).fill(null)
    }
  })

  // ИСПРАВЛЕНО: Инициализируем историю с отдельными массивами для каждого вопроса
  selectedAnswersHistory.value = shuffledTasks.value.map(task => {
    if (task.taskID === 'multiple_choice') {
      // Создаем отдельный массив для каждого вопроса
      return Array(task.questions.length).fill().map(() => [])
    }
    return null
  })

  checkedTasks.value = shuffledTasks.value.map(() => false)
  taskScores.value = shuffledTasks.value.map(() => null)
  expandedExplanations.value = shuffledTasks.value.map(task =>
    Array(task.questions.length).fill(false)
  )
  gridTableFeedback.value = shuffledTasks.value.map(() => [])
  discussionChecked.value = shuffledTasks.value.map(task =>
    task.taskID === 'discussion_task' ? Array(task.questions.length).fill(false) : null
  )
  discussionCollapsed.value = shuffledTasks.value.map(task =>
    task.taskID === 'discussion_task' ? Array(task.questions.length).fill(false) : null
  )
  showTranslation.value = shuffledTasks.value.map(task =>
    task.taskID === 'discussion_task' ? Array(task.questions.length).fill(false) : null
  )
  currentTaskIndex.value = 0

  // Обновляем счет для первого задания, если это multiple-choice
  nextTick(() => {
    if (shuffledTasks.value[0]?.taskID === 'multiple_choice') {
      updateMultipleChoiceScore(0)
    }
  })
}

// Функции навигации
const goToNextTask = () => {
  if (currentTaskIndex.value < shuffledTasks.value.length - 1) {
    currentTaskIndex.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToPrevTask = () => {
  if (currentTaskIndex.value > 0) {
    currentTaskIndex.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Функция для перемешивания discussion вопросов
const toggleShuffle = (taskIndex) => {
  if (!shuffledTasks.value) return

  const task = shuffledTasks.value[taskIndex]
  if (task.taskID !== 'discussion_task') return

  if (isShuffled.value) {
    task.questions = [...task.originalQuestions]
    isShuffled.value = false
  } else {
    if (!task.originalQuestions) {
      task.originalQuestions = [...task.questions]
    }
    task.questions = [...task.questions].sort(() => Math.random() - 0.5)
    isShuffled.value = true
  }

  discussionChecked.value[taskIndex] = Array(task.questions.length).fill(false)
  discussionCollapsed.value[taskIndex] = Array(task.questions.length).fill(false)
  showTranslation.value[taskIndex] = Array(task.questions.length).fill(false)
}

// Нормализация ответов
const normalizeAnswer = (answer) => {
  if (!answer || typeof answer !== 'string') return ''

  return answer
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.,!?;:…–—]+$/g, '')
    .replace(/[.,!?;:…–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[`'‘’´]/g, "'")
    .replace(/(\b(?:he|she|it))'?s not\b/g, "$1 is not")
    .replace(/(\b(?:he|she|it)) isn'?t\b/g, "$1 is not")
    .replace(/(\b(?:you|we|they|i))'?re not\b/g, "$1 are not")
    .replace(/(\b(?:you|we|they|i)) aren'?t\b/g, "$1 are not")
    .replace(/\bi'?m not\b/g, "i am not")
    .replace(/\bdo not\b/g, "don't")
    .replace(/\bdoes not\b/g, "doesn't")
    .replace(/\bdid not\b/g, "didn't")
    .replace(/\bwill not\b/g, "won't")
    .replace(/\bcan not\b/g, "can't")
    .replace(/\bmust not\b/g, "mustn't")
    .replace(/\bshould not\b/g, "should't")
    .replace(/\bwould not\b/g, "wouldn't")
    .replace(/\b(?:dont|doesnt|didnt|wont|cant|hadnt|hasnt|mustnt|shouldnt|wouldnt)\b/g, match =>
      ({
        dont: "don't",
        doesnt: "doesn't",
        didnt: "didn't",
        wont: "won't",
        cant: "can't",
        hasnt: "hasn't",
        hadnt: "hadn't",
        mustnt: "mustn't",
        shouldnt: "shouldn't",
        wouldnt: "wouldn't"
      }[match]))
    .replace(/\b(?:i am|im)\b/g, "i'm")
    .replace(/\b(?:you are|youre)\b/g, "you're")
    .replace(/\b(?:we are|were)\b/g, "we're")
    .replace(/\b(?:they are|theyre)\b/g, "they're")
    .replace(/\b(?:she is|shes)\b/g, "she's")
    .replace(/\b(?:he is|hes)\b/g, "he's")
    .replace(/\b(?:it is|its)\b/g, "it's")
    .replace(/(\b[a-z]+)'ll\b/gi, "$1 will")
    .replace(/(\b(?:i|you|he|she|we|they|it))'?d\b/g, "$1 would")
    .replace(/\brecieve\b/g, "receive")
    .replace(/\bdefinately\b/g, "definitely")
    .replace(/\bpractice\b/g, "practise")
    .replace(/\s+/g, ' ')
    .trim()
}

// Фокусировка на следующем поле по Enter
const focusNextInput = (taskIndex, questionIndex) => {
  const nextIndex = questionIndex + 1
  if (nextIndex < shuffledTasks.value[taskIndex].questions.length) {
    nextTick(() => {
      const nextInput = inputFields.value.find(el =>
        Number(el.dataset.task) === taskIndex &&
        Number(el.dataset.question) === nextIndex
      )
      if (nextInput) {
        nextInput.focus()
        // Если следующее поле - textarea, ставим курсор в конец
        if (nextInput.tagName === 'TEXTAREA') {
          const length = nextInput.value.length
          nextInput.setSelectionRange(length, length)
        }
      }
    })
  }
}

// Обработка специальных символов в student_input
// Обработка специальных символов в student_input
const handleSpecialInput = (taskIndex, questionIndex, event) => {
  const input = event.target
  const value = input.value

  // Шаблоны для разных спецсимволов
  const specialTemplates = {
    '?': '+ \u00A0\u00A0\u00A0 \n- \u00A0\u00A0\u00A0\u00A0 \n? \u00A0\u00A0\u00A0\u00A0 \no? \u00A0 ',

    '+': '+ \n- \n? \n! ',
    '!': '! \n? \n- \n+ ',
    '*': '1. \n2. \n3. \n4. ',
    ' ': '+ \u00A0\u00A0\u00A0 \n- \u00A0\u00A0\u00A0\u00A0 \n? \u00A0\u00A0\u00A0\u00A0 \no? \u00A0 ',
  }

  // Проверяем каждый спецсимвол
  for (const [symbol, template] of Object.entries(specialTemplates)) {
    if (value === symbol) {
      // Устанавливаем значение
      answers.value[taskIndex][questionIndex] = template

      // Принудительно вызываем resize для textarea
      nextTick(() => {
        if (input.tagName === 'TEXTAREA' && input._resizeHandler) {
          input._resizeHandler()
        }

        // Находим конец первой строки (позиция перед \n)
        const firstLineEnd = template.indexOf('\n')

        // Ставим курсор в конец первой строки
        input.setSelectionRange(firstLineEnd, firstLineEnd)
        input.focus()
      })
      break
    }
  }
}
// Определение типа ответа для student_input
const isAnswerCorrect = (taskIndex, questionIndex, correctAnswer, almostCorrectAnswers) => {
  if (!checkedTasks.value[taskIndex] ||
    shuffledTasks.value[taskIndex].taskID !== 'student_input') return ''

  // ДОБАВЛЕНО: если anyIsOk - всегда correct
  if (correctAnswer === 'anyIsOk') {
    return 'correct'
  }

  const userAnswer = normalizeAnswer(answers.value[taskIndex][questionIndex])
  const normalizedCorrect = normalizeAnswer(correctAnswer)

  if (userAnswer === normalizedCorrect) return 'correct'
  if (almostCorrectAnswers?.some(alt => normalizeAnswer(alt) === userAnswer)) return 'almost'
  return 'incorrect'
}

const getInputClass = (taskIndex, questionIndex, correctAnswer, almostCorrectAnswers) => {
  if (!checkedTasks.value[taskIndex]) return ''

  if (shuffledTasks.value[taskIndex].taskID === 'student_input') {
    if (correctAnswer === 'anyIsOk') {
      return 'student-input-any-ok'
    }
    const userAnswer = normalizeAnswer(answers.value[taskIndex][questionIndex])
    const normalizedCorrect = normalizeAnswer(correctAnswer)

    if (userAnswer === normalizedCorrect) {
      return 'student-input-correct'
    }

    if (almostCorrectAnswers &&
      almostCorrectAnswers.some(alt => normalizeAnswer(alt) === userAnswer)) {
      return 'student-input-almost-correct'
    }

    return 'student-input-incorrect'
  }

  return answers.value[taskIndex][questionIndex] === correctAnswer
    ? 'student-input-correct'
    : 'student-input-incorrect'
}

const splitQuestionText = (text) => {
  return text.split(/(_{1,4})/)
}

// Директива для автоматического изменения высоты textarea
// Директива для автоматического изменения высоты textarea
const vAutoresize = {
  mounted: (el) => {
    // Создаем вспомогательный элемент для измерения
    const measureEl = document.createElement('div')
    measureEl.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      visibility: hidden;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-wrap: break-word;
      font-family: ${getComputedStyle(el).fontFamily};
      font-size: ${getComputedStyle(el).fontSize};
      font-weight: ${getComputedStyle(el).fontWeight};
      line-height: ${getComputedStyle(el).lineHeight};
      padding: ${getComputedStyle(el).padding};
      width: ${el.offsetWidth}px;
      border: ${getComputedStyle(el).border};
      box-sizing: border-box;
    `
    document.body.appendChild(measureEl)

    const resize = () => {
      if (el.value) {
        measureEl.textContent = el.value + ' '
      } else {
        measureEl.textContent = el.placeholder || ''
      }

      const height = measureEl.offsetHeight + 2 // небольшой запас
      el.style.height = 'auto'
      el.style.height = height + 'px'
    }

    el.addEventListener('input', resize)

    // Сохраняем для очистки
    el._resizeHandler = resize
    el._measureEl = measureEl

    // Первоначальный resize
    setTimeout(resize, 0)
  },

  updated: (el) => {
    // Добавляем updated hook для реакции на изменения v-model
    if (el._resizeHandler) {
      setTimeout(el._resizeHandler, 0)
    }
  },

  unmounted: (el) => {
    if (el._resizeHandler) {
      el.removeEventListener('input', el._resizeHandler)
    }
    if (el._measureEl) {
      document.body.removeChild(el._measureEl)
    }
  }
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

const toggleExplanation = (taskIndex, questionIndex) => {
  if (!expandedExplanations.value[taskIndex]) {
    expandedExplanations.value[taskIndex] = []
  }
  expandedExplanations.value[taskIndex][questionIndex] =
    !expandedExplanations.value[taskIndex][questionIndex]
}

const toggleDiscussionQuestion = (taskIndex, questionIndex) => {
  if (!discussionChecked.value[taskIndex]) return

  discussionChecked.value[taskIndex][questionIndex] =
    !discussionChecked.value[taskIndex][questionIndex]

  discussionCollapsed.value[taskIndex][questionIndex] =
    discussionChecked.value[taskIndex][questionIndex]
}

const toggleDiscussionTranslation = (taskIndex, questionIndex) => {
  if (!showTranslation.value[taskIndex]) return
  showTranslation.value[taskIndex][questionIndex] = !showTranslation.value[taskIndex][questionIndex]
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

const parseUsefulWords = (wordsString) => {
  if (!wordsString) return []
  return wordsString.split(',').map(pair => {
    const [english, russian] = pair.split('-').map(s => s.trim())
    return { english, russian }
  })
}

const checkAnswers = (taskIndex) => {
  const task = shuffledTasks.value[taskIndex]
  if (task.taskID === 'discussion_task') return

  checkedTasks.value[taskIndex] = true
  let percentage = 0

  if (task.taskID === 'grid_table') {
    percentage = checkGridTableAnswers(taskIndex)
  } else {
    let correctCount = 0
    let totalQuestions = 0

    task.questions.forEach((q, qi) => {
      if (task.taskID === 'student_input') {
        // ДОБАВЛЕНО: проверка на anyIsOk
        if (q.correctAnswer === 'anyIsOk') {
          correctCount++
        } else {
          const userAnswer = normalizeAnswer(answers.value[taskIndex][qi])
          const correctAnswer = normalizeAnswer(q.correctAnswer)

          if (userAnswer === correctAnswer ||
            (q.almostCorrectAnswers &&
              q.almostCorrectAnswers.some(alt => normalizeAnswer(alt) === userAnswer))) {
            correctCount++
          }
        }
        totalQuestions++
      } else if (task.taskID === 'drop_down_text') {
        const questionParts = splitDropDownText(q.text)
        const dropdownParts = questionParts.filter(p => p.type === 'dropdown')

        dropdownParts.forEach((part, di) => {
          const userAnswer = answers.value[taskIndex][qi][di]
          if (part.correctOptions.includes(userAnswer)) {
            correctCount++
          }
          totalQuestions++
        })
      } else {
        const userAnswer = answers.value[taskIndex][qi]
        if (Array.isArray(q.correctAnswer)) {
          if (q.correctAnswer.includes(userAnswer)) {
            correctCount++
          }
        } else {
          if (userAnswer === q.correctAnswer) {
            correctCount++
          }
        }
        totalQuestions++
      }
    })

    percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
  }

  taskScores.value[taskIndex] = percentage
}

const getRadioClass = (taskIndex, questionIndex, optionValue, correctAnswer) => {
  if (!checkedTasks.value[taskIndex]) return ''

  const selected = answers.value[taskIndex][questionIndex]

  const isCorrect = Array.isArray(correctAnswer)
    ? correctAnswer.includes(optionValue)
    : optionValue === correctAnswer

  if (isCorrect) {
    return selected === optionValue ? 'correct-selected' : 'correct-not-selected'
  } else if (selected === optionValue) {
    return 'incorrect-selected'
  }
  return ''
}

const getOptionClass = (taskIndex, questionIndex, optionValue, correctAnswer) => {
  if (!checkedTasks.value[taskIndex]) return ''

  const selected = answers.value[taskIndex][questionIndex]

  const isCorrect = Array.isArray(correctAnswer)
    ? correctAnswer.includes(optionValue)
    : optionValue === correctAnswer

  if (isCorrect) {
    return selected === optionValue ? 'option-correct-selected' : 'option-correct-not-selected'
  } else if (selected === optionValue) {
    return 'option-incorrect-selected'
  }
  return ''
}

const getInstantOptionClass = (taskIndex, questionIndex, optionValue, correctAnswer) => {
  const finalAnswer = answers.value[taskIndex][questionIndex]
  const history = selectedAnswersHistory.value[taskIndex]?.[questionIndex] || []

  const isCorrect = Array.isArray(correctAnswer)
    ? correctAnswer.includes(optionValue)
    : optionValue === correctAnswer

  const isFinalSelected = finalAnswer === optionValue

  // СВЯЩЕННОЕ ПРАВИЛО: Если ответ правильный и был когда-либо выбран - он всегда зеленый!
  if (isCorrect && history.includes(optionValue)) {
    return 'option-correct-selected'
  }

  // Для неправильных ответов
  if (!isCorrect) {
    // Если это текущий выбранный ответ - красный
    if (isFinalSelected) {
      return 'option-incorrect-selected'
    }

    // Если ответ был в истории (любой предыдущий неправильный) - розовый
    if (history.includes(optionValue)) {
      return 'option-wrong-history'
    }
  }

  // Все остальные варианты без подсветки
  return ''
}

const getExplainButtonClass = (taskIndex, questionIndex, correctAnswer) => {
  const userAnswer = answers.value[taskIndex][questionIndex]

  // Если ответ еще не выбран - не применяем никакого класса
  if (!userAnswer) return ''

  const isCorrect = Array.isArray(correctAnswer)
    ? correctAnswer.includes(userAnswer)
    : userAnswer === correctAnswer

  return isCorrect ? 'explain-correct' : 'explain-incorrect'
}

// НОВАЯ ФУНКЦИЯ: Подсчет процентов только для multiple-choice
const calculateMultipleChoicePercentage = (taskIndex) => {
  const task = shuffledTasks.value[taskIndex]
  if (!task || task.taskID !== 'multiple_choice') return 0

  let correctCount = 0
  let totalQuestions = task.questions.length

  task.questions.forEach((q, qi) => {
    const userAnswer = answers.value[taskIndex]?.[qi]
    if (userAnswer) {
      if (Array.isArray(q.correctAnswer)) {
        if (q.correctAnswer.includes(userAnswer)) {
          correctCount++
        }
      } else {
        if (userAnswer === q.correctAnswer) {
          correctCount++
        }
      }
    }
  })

  return totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
}

// НОВАЯ ФУНКЦИЯ: Обновление счета при выборе ответа в multiple-choice
const updateMultipleChoiceScore = (taskIndex) => {
  // Отмечаем задание как "проверенное", чтобы показать счет
  checkedTasks.value[taskIndex] = true

  // Рассчитываем и сохраняем процент
  const percentage = calculateMultipleChoicePercentage(taskIndex)
  taskScores.value[taskIndex] = percentage
}

// НОВАЯ ФУНКЦИЯ: Обработка выбора с историей
// ИСПРАВЛЕННАЯ ФУНКЦИЯ: Обработка выбора с историей
// ИСПРАВЛЕННАЯ ФУНКЦИЯ: Обработка выбора с историей (через click)
const handleMultipleChoiceSelection = (taskIndex, questionIndex, selectedValue, event) => {
  // Отмена стандартного поведения, чтобы самим управлять
  event.preventDefault();

  console.log('Selected:', selectedValue);
  console.log('History before:', selectedAnswersHistory.value[taskIndex]?.[questionIndex]);
  console.log('Final answer before:', answers.value[taskIndex][questionIndex]);

  // Получаем текущий финальный ответ
  const currentFinalAnswer = answers.value[taskIndex][questionIndex]

  // Убеждаемся, что массив истории существует
  if (!selectedAnswersHistory.value[taskIndex][questionIndex]) {
    selectedAnswersHistory.value[taskIndex][questionIndex] = []
  }

  const history = selectedAnswersHistory.value[taskIndex][questionIndex]

  // Если это первый выбор (финальный ответ был null)
  if (currentFinalAnswer === null) {
    // Добавляем в историю
    history.push(selectedValue)
    // Устанавливаем финальный ответ
    answers.value[taskIndex][questionIndex] = selectedValue
  }
  // Если выбрали другой ответ
  else if (currentFinalAnswer !== selectedValue) {
    // Добавляем текущий финальный в историю, если там еще нет
    if (!history.includes(currentFinalAnswer)) {
      history.push(currentFinalAnswer)
    }
    // Добавляем новый выбранный в историю, если там еще нет
    if (!history.includes(selectedValue)) {
      history.push(selectedValue)
    }
    // Обновляем финальный ответ
    answers.value[taskIndex][questionIndex] = selectedValue
  }
  // Если выбрали тот же ответ (кликнули на уже выбранный)
  else {
    // Ничего не делаем, оставляем как есть
    console.log('Same answer selected, ignoring');
  }

  console.log('History after:', selectedAnswersHistory.value[taskIndex]?.[questionIndex]);
  console.log('Final answer after:', answers.value[taskIndex][questionIndex]);

  // Обновляем счет
  updateMultipleChoiceScore(taskIndex)
}
// DropDown функции
const splitDropDownText = (text) => {
  if (!text) return []

  const paragraphs = text.split('\n').filter(p => p.trim() !== '')
  let dropdownIndex = 0
  const result = []

  for (const paragraph of paragraphs) {
    const parts = []
    let lastIndex = 0
    let match
    const regex = /\(([^)]+)\)/g

    while ((match = regex.exec(paragraph)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          text: paragraph.substring(lastIndex, match.index)
        })
      }

      const optionsText = match[1]
      const options = optionsText.split(',').map(opt => {
        const trimmed = opt.trim()
        const isCorrect = trimmed.endsWith('*')
        return {
          value: isCorrect ? trimmed.replace(/\*$/, '') : trimmed,
          isCorrect
        }
      })

      parts.push({
        type: 'dropdown',
        options,
        index: dropdownIndex++,
        correctOptions: options.filter(o => o.isCorrect).map(o => o.value)
      })

      lastIndex = match.index + match[0].length
    }

    if (lastIndex < paragraph.length) {
      parts.push({
        type: 'text',
        text: paragraph.substring(lastIndex)
      })
    }

    if (parts.length > 0) {
      result.push(parts)
    }
  }

  return result
}

const isDropDownAnswerCorrect = (taskIndex, questionIndex, originalText) => {
  if (!checkedTasks.value[taskIndex]) return ''

  const questionParts = splitDropDownText(originalText)
  const dropdownParts = questionParts.filter(p => p.type === 'dropdown')

  const allAnswered = dropdownParts.every(part =>
    answers.value[taskIndex][questionIndex][part.index] !== ''
  )

  if (!allAnswered) return ''

  const allCorrect = dropdownParts.every(part => {
    const userAnswer = answers.value[taskIndex][questionIndex][part.index]
    return part.correctOptions.includes(userAnswer)
  })

  return allCorrect ? 'correct' : 'incorrect'
}

const getDropDownClass = (taskIndex, questionIndex, dropdownIndex, correctOptions) => {
  if (!checkedTasks.value[taskIndex]) return ''

  const userAnswer = answers.value[taskIndex][questionIndex][dropdownIndex]

  if (userAnswer === '') return ''

  return correctOptions.includes(userAnswer)
    ? 'drop-down-correct'
    : 'drop-down-incorrect'
}

// Grid Table функции
const initializeGridTableAnswers = (task) => {
  return task.tableData.rows.map(row => {
    const answerObj = { cells: [] }
    row.cells.forEach((cell, index) => {
      answerObj.cells.push(row.editable[index] ? '' : cell)
    })
    return answerObj
  })
}

const checkGridTableAnswers = (taskIndex) => {
  const task = shuffledTasks.value[taskIndex]
  const feedback = []

  task.tableData.rows.forEach((row, ri) => {
    const rowFeedback = {
      allCorrect: true,
      incorrect: {}
    }

    if (!row.correctAnswers) {
      feedback.push(rowFeedback)
      return
    }

    row.editable.forEach((isEditable, ci) => {
      if (!isEditable) return

      if (row.correctAnswers.cells[ci] === "anyIsOk") return

      const userAnswer = normalizeAnswer(answers.value[taskIndex][ri].cells[ci])
      const correctAnswer = normalizeAnswer(row.correctAnswers.cells[ci])
      const almostCorrect = row.correctAnswers.almostCorrect?.[ci]

      if (userAnswer !== correctAnswer &&
        (!almostCorrect || !almostCorrect.some(alt => normalizeAnswer(alt) === userAnswer))) {
        rowFeedback.allCorrect = false
        rowFeedback.incorrect[ci] = {
          correct: row.correctAnswers.cells[ci],
          userAnswer: answers.value[taskIndex][ri].cells[ci]
        }
      }
    })

    feedback.push(rowFeedback)
  })

  gridTableFeedback.value[taskIndex] = feedback
  const correctRows = feedback.filter(row => row.allCorrect).length
  return Math.round((correctRows / task.tableData.rows.length) * 100)
}

const getGridInputClass = (taskIndex, rowIndex, cellIndex, correctAnswers) => {
  if (!checkedTasks.value[taskIndex] || !correctAnswers) return ''

  if (correctAnswers.cells[cellIndex] === "anyIsOk") return 'grid-input-correct'

  const userAnswer = normalizeAnswer(answers.value[taskIndex][rowIndex].cells[cellIndex])
  const normalizedCorrect = normalizeAnswer(correctAnswers.cells[cellIndex])
  const almostCorrect = correctAnswers.almostCorrect?.[cellIndex]

  if (userAnswer === normalizedCorrect) return 'grid-input-correct'
  if (almostCorrect && almostCorrect.some(alt => normalizeAnswer(alt) === userAnswer)) {
    return 'grid-input-almost-correct'
  }
  return 'grid-input-incorrect'
}

onMounted(() => {
  currentMission.value = route.params.missionName
  exerciseData.value = TestsAndExamsData[currentMission.value] || null

  currentSeed.value = generateRandomSeed()
  inputSeed.value = currentSeed.value

  if (exerciseData.value) {
    shuffledTasks.value = shuffleTest(exerciseData.value.tasks, currentSeed.value)

    // Сохраняем оригинальный порядок для discussion_task
    shuffledTasks.value.forEach(task => {
      if (task.taskID === 'discussion_task') {
        task.originalQuestions = [...task.questions]
      }
    })

    resetAnswers()
  }

  disableAudioDownload()
})

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
/* Seed control styles */
.seed-control {
  display: flex;
  align-items: center;
  gap: 10px;
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

/* Header styles */
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
  background-color: #f0f7ff;
  border-radius: 12px;
  border: 1px solid #e0e7ff;
  min-width: 50px;
  text-align: center;
}

/* Base container */
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

/* Task container */
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

/* Sticky audio player */
.audio-player-sticky-container {
  position: sticky;
  top: 70px;
  z-index: 100;
  //background: white;
  padding: 10px 0;
  margin-bottom: 15px;
  //border-bottom: 1px solid #e5e7eb;
  //box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.audio-player {
  width: 100%;
  border-radius: 0.5rem;
  position: relative;
  z-index: 101;
}

/* Useful words */
.useful-words-container {
  margin: 15px 0;
  width: 100%;
}

.useful-words {
  display: flex;
  flex-direction: column;
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
  flex-direction: column;
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

.comma {
  display: none;
}

/* Task image */
.task-image-container {
  margin: 10px 0;
  text-align: center;
}

.task-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.question-image-container {
  margin: 10px 0;
  text-align: center;
}

.question-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

/* True/False */
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
/* Multiple Choice */
.multiple-choice-container {
  display: grid;
  gap: 15px;
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
  line-height: 25px;
}

.margin-bottom {
  margin-bottom: 6px;
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

/* Стили для финального выбора */
.option-correct-selected {
  background-color: #ecfdf5;
  border: 2px solid #10b981;
  opacity: 1;
}

.option-correct-selected .option-input {
  border-color: #10b981;
  background-color: #10b981;
}

.option-incorrect-selected {
  background-color: #fee2e2;
  border: 2px solid #ef4444;
  opacity: 1;
}

.option-incorrect-selected .option-input {
  border-color: #ef4444;
  background-color: #ef4444;
}

/* Стили для истории выбора */
.option-wrong-history {
  background-color: #fff0f0;  /* Розовый/светло-красный */
  border: 2px solid #ffb6c1;
  opacity: 0.8;
}

.option-wrong-history .option-input {
  border-color: #ffb6c1;
  background-color: #ffb6c1;
  opacity: 0.5;
}

.option-correct-then-wrong {
  background-color: #fff3e0;  /* Светло-оранжевый */
  border: 2px solid #ffb347;
}

.option-correct-then-wrong .option-input {
  border-color: #ffb347;
  background-color: #ffb347;
  opacity: 0.5;
}

/* Стили для невыбранных правильных ответов (если понадобятся в будущем) */
.option-correct-not-selected {
  background-color: rgba(236, 253, 245, 0);
}

.option-correct-not-selected .option-input {
  border-color: #10b981;
  background-color: #10b981;
  opacity: 0;
}

.option-selected {
  background-color: rgba(162, 195, 251, 0.87);
}

.option-selected .option-input {
  border-color: #6b7280;
  background-color: #6b7280;
}

/* Explain button */
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
  background-color: #8b5cf6;
  color: white;
}

.explain-button.explain-correct {
  background-color: #10b981;
  color: white;
}

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


/* Student Input */
.student-input-container {
  display: grid;
  gap: 15px;
  padding: 1px;
}

.student-input {
  padding: 1px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  transition: all 0.2s;
  text-align: center;
  color: #3b82f6;
}

.input-small {
  width: 50px;
}

.input-medium {
  width: 100px;
}

.input-large {
  width: 150px;
}

.input-full {
  width: 100%;
  min-width: 250px;
  text-align: left;
  white-space: normal;        /* разрешаем перенос текста */
  word-wrap: break-word;      /* старый стандарт */
  overflow-wrap: break-word;  /* новый стандарт - перенос длинных слов */
  word-break: break-word;     /* для поддержки разных браузеров */
  height: auto;               /* автоматическая высота */
  min-height: 30px;           /* минимальная высота */
  padding: 8px 10px;          /* чуть больше отступы для комфорта */
  line-height: 1.4;           /* нормальный межстрочный интервал */
  resize: vertical;           /* разрешаем пользователю растягивать поле по вертикали */
}

.student-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.student-input-correct {
  border-color: #10b981;
  background-color: #ecfdf5;
  color: #10b981;
}

.student-input-incorrect {
  border-color: #ef4444;
  background-color: #fee2e2;
  color: #ef4444;
}

.student-input-almost-correct {
  border-color: #f59e0b;
  background-color: #fef3c7;
  color: #92400e;
}

.answer-feedback {
  margin-top: 5px;
  font-size: 0.9rem;
}

.correct-answer {
  color: #10b981;
  font-weight: 500;
}

.incorrect-answer {
  color: #ef4444;
}

.almost-answer {
  color: #f59e0b;
  font-weight: 500;
}

/* DropDown */
.drop-down-text-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.paragraph {
  margin-bottom: 10px;
  line-height: 1.5;
}

.drop-down-select {
  padding: 1px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
  color: #3b82f6;
  cursor: none;
  min-width: 80px;
  transition: all 0.2s;
  margin: 1px;
  width: 155px;
  text-align: center;
}

.drop-down-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.drop-down-correct {
  border-color: #10b981;
  background-color: #ecfdf5;
}

.drop-down-incorrect {
  border-color: #ef4444;
  background-color: #fee2e2;
  color: #ef4444;
}

/* Grid Table */
.grid-table-container {
  margin: 20px 0;
}

.grid-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
  background-color: cornsilk;
}

.grid-table th, .grid-table td {
  border: 1px solid #e5e7eb;
  padding: 1px;
  text-align: left;
}

.grid-table th {
  background-color: #f3f4f6;
  font-weight: 500;
}

.grid-table tr:nth-child(even) {
  background-color: #daf8f1;
}

.grid-table-input {
  width: 100%;
  padding: 5px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.grid-input-correct {
  border-color: #10b981;
  background-color: #ecfdf5;
}

.grid-input-incorrect {
  border-color: #ef4444;
  background-color: #fee2e2;
}

.grid-input-almost-correct {
  border-color: #f59e0b;
  background-color: #fef3c7;
}

.grid-table-feedback {
  margin-top: 10px;
  padding: 10px;
  background-color: #f8fafc;
  border-radius: 6px;
}

.feedback-item {
  margin-bottom: 5px;
}

.correct-feedback {
  color: #10b981;
  font-weight: 500;
}

.incorrect-feedback {
  display: inline-block;
  margin-right: 10px;
  color: #ef4444;
  font-size: 0.9rem;
}

/* Discussion Task */
.discussion-task-container {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.discussion-question {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.question-controls {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.discussion-checkbox {
  width: 24px;
  height: 40px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.discussion-checkbox.checked {
  background-color: #10b981;
  color: white;
  border-color: #10b981;
}

.question-content {
  flex: 1;
  transition: all 0.3s ease;
}

.question-content.collapsed {
  opacity: 0.8;
}

.question-content.collapsed .question-text {
  display: none;
}

.translation-toggle {
  color: #6b7280;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-block;
  padding: 1px 3px;
  border-radius: 4px;
  transition: all 0.2s;
}

.translation-toggle:hover {
  background-color: #f3f4f6;
}

.translation-text {
  display: inline-block;
  background-color: #f8fafc;
  border-radius: 4px;
  color: #4b5563;
  font-style: italic;
  width: 100%;
  box-sizing: border-box;
}

.collapsed-translation {
  margin-top: 0;
  background-color: rgba(248, 250, 252, 0.7);
}

/* Task footer */
.task-footer {
  margin-top: 20px;
  border-top: 1px solid #e5e7eb;
  padding-top: 15px;
}

.task-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  gap: 10px;
}

.score-display {
  font-size: 1rem;
  color: #6b7280;
  padding: 0 10px;
  transition: all 0.3s ease;
  display: flex;           /* добавляем flex */
  align-items: center;     /* выравниваем по центру вертикально */
  min-height: 38px;        /* фиксируем минимальную высоту как у кнопок */
  justify-content: flex-end;
}

.score-visible {
  color: #1f2937;
  font-weight: bold;
  animation: fadeIn 0.5s ease;
}

/* Navigation */
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
  cursor: none;
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

/* Buttons */
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

.check-button[data-task-type="discussion_task"] {
  background-color: #8b5cf6;
}

.check-button[data-task-type="discussion_task"]:hover {
  background-color: #7c3aed;
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

/* Audio player download protection */
.audio-player::-webkit-media-controls-enclosure {
  overflow: hidden;
}

.audio-player::-webkit-media-controls-panel {
  -webkit-user-select: none;
}

/* Grade colors */
.grade-Aplus { color: #10b981 !important; }
.grade-A { color: #10b981 !important; }
.grade-Bplus { color: #0e9e6f !important; }
.grade-Bminus { color: #f97316 !important; }
.grade-C { color: #f97316 !important; }
.grade-D { color: #ef4444 !important; }
.grade-E { color: #dc2626 !important; }
.grade-F { color: #991b1b !important; }

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 768px) {
  .audio-player-sticky-container {
    top: 60px;
    padding: 8px 0;
  }

  .audio-player {
    font-size: 14px;
  }

  .text-script-content {
    //margin-top: 60px;
  }

  .task-controls {
    flex-wrap: wrap;
  }

  .grid-table {
    font-size: 11px;
  }

  .score-display {
    order: 1;
    width: 100%;
    text-align: center;
    margin: 5px 0;
  }

  .check-script-wrapper {
    flex-direction: column;
    gap: 8px;
  }

  .question-image {
    max-height: 200px;
  }
}

/* Кнопка статистики */
.stats-button {
  padding: 5px 10px;
  background-color: #8b5cf6;
  color: white;
  font-weight: 500;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 5px;
}

.stats-button:hover {
  background-color: #7c3aed;
  transform: translateY(-1px);
}
/* Дополнительные стили для статистики */
.stat-value.warning {
  color: #f59e0b;
  font-weight: 600;
}

.question-stat-card.skipped {
  border-left: 3px solid #f59e0b;
  background-color: #fffbeb;
}

.skipped-badge {
  font-size: 0.75rem;
  color: #f59e0b;
  font-weight: 500;
  margin-bottom: 0.25rem;
  padding: 0.125rem 0;
}

.question-options {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.question-final.skipped {
  background-color: #fffbeb;
  color: #f59e0b;
}
/* Модальное окно */
.stats-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.stats-modal {
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.stats-modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  border-radius: 1rem 1rem 0 0;
}

.stats-modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.stats-modal-header .close-button {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.stats-modal-header .close-button:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.stats-modal-content {
  padding: 1.5rem;
}

.stats-summary {
  background-color: #f9fafb;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.stat-value.correct {
  color: #10b981;
}

.stat-value.incorrect {
  color: #ef4444;
}

.stat-item.highlight {
  grid-column: 1 / -1;
  background-color: #e0f2fe;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
}

.stat-value.grade {
  color: #3b82f6;
}

.stats-questions h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.questions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
}

.question-stat-card {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
}

.question-stat-card.final-correct {
  border-left: 3px solid #10b981;
}

.question-number {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.question-clicks {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.question-breakdown {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.question-breakdown .correct {
  color: #10b981;
}

.question-breakdown .incorrect {
  color: #ef4444;
}

.question-final {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  text-align: center;
  background-color: #f3f4f6;
}

.question-final.correct {
  background-color: #ecfdf5;
  color: #10b981;
}

.question-final.incorrect {
  background-color: #fee2e2;
  color: #ef4444;
}

.stats-modal-footer {
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.stats-modal-footer .close-button {
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  color: #1f2937;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.stats-modal-footer .close-button:hover {
  background-color: #e5e7eb;
}
.question-text-preview {
  font-size: 0.9rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0;
  border-bottom: 1px dashed #e5e7eb;
  max-height: 60px;
  overflow-y: auto;
  word-break: break-word;
}
.stats-modal-footer {
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.footer-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.send-button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.send-button:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.send-button:active {
  transform: translateY(0);
}

.stats-modal-footer .close-button {
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  color: #1f2937;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.stats-modal-footer .close-button:hover {
  background-color: #e5e7eb;
}

.student-input-any-ok {
  border-color: #3b82f6;
  background-color: #eff6ff;
  color: #1e40af;
}


/* Стили для textarea с авто-растяжением */
.student-input-textarea {
  width: 100%;
  min-width: 300px;
  max-width: 800px;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  font-family: inherit;
  font-size: inherit;
  line-height: 1.5;
  padding: 8px 12px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  background-color: white;
  resize: none; /* отключаем стандартное растягивание */
  overflow: hidden; /* скрываем скролл */
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.student-input-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

/* Адаптация для мобильных */
@media (max-width: 768px) {
  .student-input-textarea {
    min-width: 100%;
    max-width: 100%;
    font-size: 16px; /* предотвращает зум на мобильных */
  }
}

/* Стили для разных состояний (переопределяем цвета для textarea) */
.student-input-textarea.student-input-correct {
  border-color: #10b981;
  background-color: #ecfdf5;
}

.student-input-textarea.student-input-incorrect {
  border-color: #ef4444;
  background-color: #fee2e2;
}

.student-input-textarea.student-input-almost-correct {
  border-color: #f59e0b;
  background-color: #fef3c7;
}

.student-input-textarea.student-input-any-ok {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

/* Уменьшаем размер шрифта placeholder */
.student-input-textarea::placeholder {
  font-size: 0.85rem;  /* уменьшенный размер */
  color: #9ca3af;      /* более светлый цвет */
  opacity: 0.8;        /* легкая прозрачность */
  font-style: italic;  /* курсив для большей незаметности */
}

/* Для обычных input тоже уменьшим placeholder */
.student-input::placeholder {
  font-size: 0.85rem;
  color: #9ca3af;
  opacity: 0.8;
  font-style: italic;
}


</style>
