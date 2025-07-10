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
          <p class="question-text margin-bottom">{{ qi + 1 }}) {{ q.text }}</p>
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

      <!-- Student Input блок -->
      <div v-else-if="task.taskID === 'student_input'" class="student-input-container">
        <div v-for="(q, qi) in task.questions" :key="qi" class="question-container">
          <p class="question-text">
            <template v-for="(part, i) in splitQuestionText(q.text)">
              <template v-if="part.startsWith('_')">
                <input
                  type="text"
                  class="student-input"
                  :class="[
        getInputClass(index, qi, q.correctAnswer, q.almostCorrectAnswers),
        {
          'input-small': part.length === 1,
          'input-medium': part.length === 2,
          'input-large': part.length === 3,
          'input-full': part.length >= 4
        }
      ]"
                  v-model="answers[index][qi]"
                  @keyup.enter="focusNextInput(index, qi)"
                  :disabled="false"
                  :data-task="index"
                  :data-question="qi"
                  ref="inputFields"
                />
              </template>
              <template v-else>
                {{ part }}
              </template>
            </template>
          </p>
          <div v-if="checkedTasks[index]" class="answer-feedback">
      <span v-if="isAnswerCorrect(index, qi, q.correctAnswer, q.almostCorrectAnswers) === 'correct'"
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
            v-if="task.taskID !== 'discussion_task'"
            class="check-button"
            @click="checkAnswers(index)"
            :data-task-type="task.taskID"
          >
            Проверить
          </button>
          <button
            v-else
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
import { ref, onMounted, nextTick } from 'vue'
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
const discussionChecked = ref([]);
const discussionCollapsed = ref([]);
const showTranslation = ref([]);
const isShuffled = ref(false); // Добавляем состояние перемешанности


// Функция для перемешивания вопросов
const toggleShuffle = (taskIndex) => {
  if (!exerciseData.value) return;

  const task = exerciseData.value.tasks[taskIndex];
  if (task.taskID !== 'discussion_task') return;

  if (isShuffled.value) {
    // Если уже перемешано - возвращаем исходный порядок
    task.questions = [...task.originalQuestions];
    isShuffled.value = false;
  } else {
    // Сохраняем исходный порядок и перемешиваем
    if (!task.originalQuestions) {
      task.originalQuestions = [...task.questions];
    }
    task.questions = [...task.questions].sort(() => Math.random() - 0.5);
    isShuffled.value = true;
  }

  // Сбрасываем состояние чекбоксов и свернутых вопросов
  discussionChecked.value[taskIndex] = Array(task.questions.length).fill(false);
  discussionCollapsed.value[taskIndex] = Array(task.questions.length).fill(false);
  showTranslation.value[taskIndex] = Array(task.questions.length).fill(false);
};

const normalizeAnswer = (answer) => {
  if (!answer || typeof answer !== 'string') return '';

  return answer
    // Базовые преобразования
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

    // Обработка пунктуации (универсальная)
    .replace(/[.,!?;:…–—]+$/g, '')      // Удаление в конце строки
    .replace(/[.,!?;:…–—]/g, ' ')       // Замена внутри строки
    .replace(/\s+/g, ' ')               // Фиксация пробелов

    // Нормализация апострофов и кавычек
    .replace(/[`'‘’´]/g, "'")

    // Специальные формы глагола "to be"
    // Для he/she/it
    .replace(/(\b(?:he|she|it))'?s not\b/g, "$1 is not")   // "she's not" → "she is not"
    .replace(/(\b(?:he|she|it)) isn'?t\b/g, "$1 is not")   // "she isn't" → "she is not"

    // Для you/we/they/I
    .replace(/(\b(?:you|we|they|i))'?re not\b/g, "$1 are not")  // "they're not" → "they are not"
    .replace(/(\b(?:you|we|they|i)) aren'?t\b/g, "$1 are not")  // "you aren't" → "you are not"
    .replace(/\bi'?m not\b/g, "i am not")                      // "I'm not" → "i am not"

    // Остальные глаголы
    .replace(/\bdo not\b/g, "don't")
    .replace(/\bdoes not\b/g, "doesn't")
    .replace(/\bdid not\b/g, "didn't")
    .replace(/\bwill not\b/g, "won't")
    .replace(/\bcan not\b/g, "can't")
    .replace(/\bmust not\b/g, "mustn't")
    .replace(/\bshould not\b/g, "should't")
    .replace(/\bwould not\b/g, "wouldn't")

    // Исправление частых ошибок
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

    // Контракции утвердительных форм
    .replace(/\b(?:i am|im)\b/g, "i'm")
    .replace(/\b(?:you are|youre)\b/g, "you're")
    .replace(/\b(?:we are|were)\b/g, "we're")
    .replace(/\b(?:they are|theyre)\b/g, "they're")
    .replace(/\b(?:she is|shes)\b/g, "she's")
    .replace(/\b(?:he is|hes)\b/g, "he's")
    .replace(/\b(?:it is|its)\b/g, "it's")
    .replace(/(\b[a-z]+)'ll\b/gi, "$1 will")  // Универсальная замена для любых слов
    .replace(/(\b(?:i|you|he|she|we|they|it))'?d\b/g, "$1 would")


    // Орфографические ошибки
    .replace(/\brecieve\b/g, "receive")
    .replace(/\bdefinately\b/g, "definitely")
    .replace(/\bpractice\b/g, "practise")

    // Финальная очистка
    .replace(/\s+/g, ' ')
    .trim();
};


// Фокусировка на следующем поле по Enter
const inputFields = ref([]);
const focusNextInput = (taskIndex, questionIndex) => {
  const nextIndex = questionIndex + 1;
  if (nextIndex < exerciseData.value.tasks[taskIndex].questions.length) {
    nextTick(() => {
      const nextInput = inputFields.value.find(el =>
        Number(el.dataset.task) === taskIndex &&
        Number(el.dataset.question) === nextIndex
      );
      nextInput?.focus();
    });
  }
};

// Определение типа ответа (correct/almost/incorrect)
const isAnswerCorrect = (taskIndex, questionIndex, correctAnswer, almostCorrectAnswers) => {
  if (!checkedTasks.value[taskIndex] ||
    exerciseData.value.tasks[taskIndex].taskID !== 'student_input') return '';

  const userAnswer = normalizeAnswer(answers.value[taskIndex][questionIndex]);
  const normalizedCorrect = normalizeAnswer(correctAnswer);

  if (userAnswer === normalizedCorrect) return 'correct';
  if (almostCorrectAnswers?.some(alt => normalizeAnswer(alt) === userAnswer)) return 'almost';
  return 'incorrect';
};

const getInputClass = (taskIndex, questionIndex, correctAnswer, almostCorrectAnswers) => {
  if (!checkedTasks.value[taskIndex]) return '';

  // Только для student_input применяем нормализацию
  if (exerciseData.value.tasks[taskIndex].taskID === 'student_input') {
    const userAnswer = normalizeAnswer(answers.value[taskIndex][questionIndex]);
    const normalizedCorrect = normalizeAnswer(correctAnswer);

    if (userAnswer === normalizedCorrect) {
      return 'student-input-correct';
    }

    if (almostCorrectAnswers &&
      almostCorrectAnswers.some(alt => normalizeAnswer(alt) === userAnswer)) {
      return 'student-input-almost-correct';
    }

    return 'student-input-incorrect';
  }

  // Для других типов заданий - стандартная проверка
  return answers.value[taskIndex][questionIndex] === correctAnswer
    ? 'student-input-correct'
    : 'student-input-incorrect';
};

const splitQuestionText = (text) => {
  // Регулярное выражение для поиска подчеркиваний разной длины
  return text.split(/(_{1,4})/); // Разбиваем текст по _, __, ___ или ____, сохраняя разделитель
};
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

const checkedStudentInputs = ref([]);
const checkedGridTables = ref([]);

onMounted(() => {
  currentMission.value = route.params.missionName;
  exerciseData.value = ListeningExerciseData[currentMission.value] || null;

  if (exerciseData.value) {
    // Сохраняем оригинальный порядок И сразу перемешиваем вопросы для discussion_task
    exerciseData.value.tasks.forEach(task => {
      if (task.taskID === 'discussion_task') {
        // 1. Сохраняем оригинальный порядок
        task.originalQuestions = [...task.questions];

        // 2. Перемешиваем текущие вопросы
        task.questions = [...task.questions].sort(() => Math.random() - 0.5);

        // 3. Устанавливаем флаг, что вопросы перемешаны
        isShuffled.value = true;
      }
    });

    answers.value = exerciseData.value.tasks.map(task => {
      if (task.taskID === 'grid_table') {
        return initializeGridTableAnswers(task);
      } else if (task.taskID === 'drop_down_text') {
        return task.questions.map(q => {
          const dropdownCount = (q.text.match(/\(/g) || []).length;
          return Array(dropdownCount).fill('');
        });
      } else if (task.taskID === 'discussion_task') {
        return []; // Для discussion_task не нужны ответы
      } else {
        return Array(task.questions.length).fill(null);
      }
    });
    gridTableFeedback.value = exerciseData.value.tasks.map(() => []);
    checkedTasks.value = exerciseData.value.tasks.map(() => false);
    taskScores.value = exerciseData.value.tasks.map(() => null);

    // Инициализация
    if (exerciseData.value) {
      checkedStudentInputs.value = exerciseData.value.tasks.map(
        task => task.taskID === 'student_input' ? false : null
      );
      checkedGridTables.value = exerciseData.value.tasks.map(
        task => task.taskID === 'grid_table' ? false : null
      );
    }
  }

  disableAudioDownload();

  if (exerciseData.value) {
    discussionChecked.value = exerciseData.value.tasks.map(task =>
      task.taskID === 'discussion_task' ? Array(task.questions.length).fill(false) : null
    );
    discussionCollapsed.value = exerciseData.value.tasks.map(task =>
      task.taskID === 'discussion_task' ? Array(task.questions.length).fill(false) : null
    );
    showTranslation.value = exerciseData.value.tasks.map(task =>
      task.taskID === 'discussion_task' ? Array(task.questions.length).fill(false) : null
    );
  }
});



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

  const task = exerciseData.value.tasks[taskIndex];
  if (task.taskID === 'discussion_task') {
    return; // Не проверяем discussion task
  }
  checkedTasks.value[taskIndex] = true;
  let percentage = 0;

  if (task.taskID === 'grid_table') {
    percentage = checkGridTableAnswers(taskIndex);
  } else {
    let correctCount = 0;
    let totalQuestions = 0;

    task.questions.forEach((q, qi) => {
      if (task.taskID === 'student_input') {
        // Лояльная проверка только для student_input
        const userAnswer = normalizeAnswer(answers.value[taskIndex][qi]);
        const correctAnswer = normalizeAnswer(q.correctAnswer);

        if (userAnswer === correctAnswer ||
          (q.almostCorrectAnswers &&
            q.almostCorrectAnswers.some(alt => normalizeAnswer(alt) === userAnswer))) {
          correctCount++;
        }
        totalQuestions++;
      } else if (task.taskID === 'drop_down_text') {
        const questionParts = splitDropDownText(q.text);
        const dropdownParts = questionParts.filter(p => p.type === 'dropdown');

        dropdownParts.forEach((part, di) => {
          const userAnswer = answers.value[taskIndex][qi][di];
          if (part.correctOptions.includes(userAnswer)) {
            correctCount++;
          }
          totalQuestions++;
        });
      } else {
        // Стандартная строгая проверка для других типов заданий
        if (answers.value[taskIndex][qi] === q.correctAnswer) {
          correctCount++;
        }
        totalQuestions++;
      }
    });

    percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  }

  taskScores.value[taskIndex] = percentage;
};


const toggleDiscussionQuestion = (taskIndex, questionIndex) => {
  if (!discussionChecked.value[taskIndex]) return;

  // Всегда переключаем состояние галочки
  discussionChecked.value[taskIndex][questionIndex] =
    !discussionChecked.value[taskIndex][questionIndex];

  // Сворачиваем/разворачиваем вопрос
  discussionCollapsed.value[taskIndex][questionIndex] =
    discussionChecked.value[taskIndex][questionIndex];
};

const toggleDiscussionTranslation = (taskIndex, questionIndex) => {
  if (!showTranslation.value[taskIndex]) return;
  showTranslation.value[taskIndex][questionIndex] = !showTranslation.value[taskIndex][questionIndex];
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


// Функция для разбора текста с dropdown-ами
const splitDropDownText = (text) => {
  if (!text) return [];

  // Сначала разбиваем текст на абзацы по символу новой строки
  const paragraphs = text.split('\n').filter(p => p.trim() !== '');

  let dropdownIndex = 0; // Общий счетчик для всех dropdown в тексте
  const result = [];

  for (const paragraph of paragraphs) {
    const parts = [];
    let lastIndex = 0;
    let match;

    // Регулярное выражение для поиска вариантов в скобках
    const regex = /\(([^)]+)\)/g;

    while ((match = regex.exec(paragraph)) !== null) {
      // Добавляем текст перед скобками
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          text: paragraph.substring(lastIndex, match.index)
        });
      }

      // Обрабатываем варианты внутри скобок
      const optionsText = match[1];
      const options = optionsText.split(',').map(opt => {
        const trimmed = opt.trim();
        const isCorrect = trimmed.endsWith('*');
        return {
          value: isCorrect ? trimmed.replace(/\*$/, '') : trimmed,
          isCorrect
        };
      });

      parts.push({
        type: 'dropdown',
        options,
        index: dropdownIndex++, // Используем общий счетчик
        correctOptions: options.filter(o => o.isCorrect).map(o => o.value)
      });

      lastIndex = match.index + match[0].length;
    }

    // Добавляем оставшийся текст после последних скобок
    if (lastIndex < paragraph.length) {
      parts.push({
        type: 'text',
        text: paragraph.substring(lastIndex)
      });
    }

    // Добавляем абзац в результат только если в нем есть содержимое
    if (parts.length > 0) {
      result.push(parts);
    }
  }

  return result;
};

// Проверка правильности ответов для dropdown
const isDropDownAnswerCorrect = (taskIndex, questionIndex, originalText) => {
  if (!checkedTasks.value[taskIndex]) return '';

  const questionParts = splitDropDownText(originalText);
  const dropdownParts = questionParts.filter(p => p.type === 'dropdown');

  // Проверяем, что все dropdown были заполнены
  const allAnswered = dropdownParts.every(part =>
    answers.value[taskIndex][questionIndex][part.index] !== ''
  );

  if (!allAnswered) return '';

  const allCorrect = dropdownParts.every(part => {
    const userAnswer = answers.value[taskIndex][questionIndex][part.index];
    return part.correctOptions.includes(userAnswer);
  });

  return allCorrect ? 'correct' : 'incorrect';
};

// Получение класса для dropdown

const getDropDownClass = (taskIndex, questionIndex, dropdownIndex, correctOptions) => {
  if (!checkedTasks.value[taskIndex]) return '';

  const userAnswer = answers.value[taskIndex][questionIndex][dropdownIndex];

  // Если ответ не выбран - не применяем стили
  if (userAnswer === '') return '';

  return correctOptions.includes(userAnswer)
    ? 'drop-down-correct'
    : 'drop-down-incorrect';
};


// Инициализация ответов для grid_table
const gridTableFeedback = ref([]);

const initializeGridTableAnswers = (task) => {
  return task.tableData.rows.map(row => {
    const answerObj = { cells: [] };
    row.cells.forEach((cell, index) => {
      answerObj.cells.push(row.editable[index] ? '' : cell);
    });
    return answerObj;
  });
};

// Проверка ответов для grid_table
const checkGridTableAnswers = (taskIndex) => {
  const task = exerciseData.value.tasks[taskIndex];
  const feedback = [];

  task.tableData.rows.forEach((row, ri) => {
    const rowFeedback = {
      allCorrect: true,
      incorrect: {}
    };

    if (!row.correctAnswers) {
      feedback.push(rowFeedback);
      return;
    }

    row.editable.forEach((isEditable, ci) => {
      if (!isEditable) return;

      // Если правильный ответ "any" - пропускаем проверку
      if (row.correctAnswers.cells[ci] === "anyIsOk") return;

      const userAnswer = normalizeAnswer(answers.value[taskIndex][ri].cells[ci]);
      const correctAnswer = normalizeAnswer(row.correctAnswers.cells[ci]);
      const almostCorrect = row.correctAnswers.almostCorrect?.[ci];

      if (userAnswer !== correctAnswer &&
        (!almostCorrect || !almostCorrect.some(alt => normalizeAnswer(alt) === userAnswer))) {
        rowFeedback.allCorrect = false;
        rowFeedback.incorrect[ci] = {
          correct: row.correctAnswers.cells[ci],
          userAnswer: answers.value[taskIndex][ri].cells[ci]
        };
      }
    });

    feedback.push(rowFeedback);
  });

  gridTableFeedback.value[taskIndex] = feedback;
  const correctRows = feedback.filter(row => row.allCorrect).length;
  return Math.round((correctRows / task.tableData.rows.length) * 100);
};

// Получение класса для input в grid_table
const getGridInputClass = (taskIndex, rowIndex, cellIndex, correctAnswers) => {
  if (!checkedTasks.value[taskIndex] || !correctAnswers) return '';

  // Если ответ любой подходит - всегда верный
  if (correctAnswers.cells[cellIndex] === "anyIsOk") return 'grid-input-correct';

  const userAnswer = normalizeAnswer(answers.value[taskIndex][rowIndex].cells[cellIndex]);
  const normalizedCorrect = normalizeAnswer(correctAnswers.cells[cellIndex]);
  const almostCorrect = correctAnswers.almostCorrect?.[cellIndex];

  if (userAnswer === normalizedCorrect) return 'grid-input-correct';
  if (almostCorrect && almostCorrect.some(alt => normalizeAnswer(alt) === userAnswer)) {
    return 'grid-input-almost-correct';
  }
  return 'grid-input-incorrect';
};

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
/* Grid Table стили */
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



/* Добавляем новые стили для student_input */
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
  text-align: left;

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
.student-input-almost-correct {
  border-color: #f59e0b;
  background-color: #fef3c7;
  color: #92400e;
}

.almost-answer {
  color: #f59e0b;
  font-weight: 500;
}

.student-input:disabled {
  opacity: 1;
  cursor: none;
  background-color: inherit;
}
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
  cursor: none;
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
  line-height: 25px;

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
  max-height: 400px;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  justify-content: center;
  display: flex
;

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

.check-button {
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: none;
  transition: background 0.2s;
}

.check-button:hover {
  background-color: #2563eb;
}

.toggle-script-btn {
  background-color: rgba(220, 43, 250, 0.56);
  border: none;
  color: #6b7280;
  cursor: none;
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
  .grid-table {
    font-size: 11px;
  }
  .score-display {
    order: 1;
    width: 100%;
    text-align: center;
    margin: 5px 0;
  }
}

/* DropDown Text стили */
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

.correct-option {
  font-weight: bold;
  color: #10b981;
}

.selected-option {
  background-color: #f0f7ff;
}

.answer-feedback {
  margin-top: 8px;
  font-size: 0.9rem;
}

.correct-answer {
  color: #10b981;
  font-weight: 500;
}

.incorrect-answer {
  color: #ef4444;
}
/* Discussion Task стили */
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

.question-text {
  font-size: 1.1rem;
  font-weight: 500;
}

.margin-bottom {
  margin-bottom: 6px;
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

.hide-translation-hint {
  font-size: 0.8em;
  color: #9ca3af;
  margin-left: 5px;
}

/* Скрываем только текст вопроса при свертывании */
.collapsed .question-text {
  display: none;
}

/* Скрываем кнопку "Проверить" для discussion_task */
.task-controls .check-button[data-task-type="discussion_task"] {
  display: none;
}

/* Добавим в стили */
.check-button[data-task-type="discussion_task"] {
  background-color: #8b5cf6; /* Фиолетовый цвет для Shuffle */
}

.check-button[data-task-type="discussion_task"]:hover {
  background-color: #7c3aed;
}
</style>
