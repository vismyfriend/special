<template>
  <div class="marginTop75">
    <!-- Прогресс-бар -->
    <div class="progress-container">
      <div class="progress-bar">
        <div
          v-for="(isFirst, index) in firstTryCorrect"
          :key="index"
          class="progress-segment"
          :style="{
            width: `${100 / allQuestions.length}%`,
            'background-color': isFirst === true ? '#34aefa' :
                              isFirst === false ? '#f36f78' : 'transparent'
          }"
        ></div>
      </div>
      <div
        class="progress-text"
        :style="{ opacity: progressPercentage > 75 ? 0 : 1 }"
      >
        {{ Math.round(progressPercentage) }}%
      </div>
    </div>

    <!-- Информация о счете -->
    <div class="score-container">
      <div class="score-display">
        <span class="score-label">🎯 Очки</span>
        <span class="score-value">{{ score }}</span>
      </div>
      <div class="score-divider"></div>
<!--      <div class="score-display">-->
<!--        <span class="score-label">✅ Правильно</span>-->
<!--        <span class="score-value">{{ correctAnswers }}</span>-->
<!--      </div>-->
<!--      <div class="score-divider"></div>-->
<!--      <div class="score-display">-->
<!--        <span class="score-label">❌ Ошибок</span>-->
<!--        <span class="score-value">{{ totalMistakes }}</span>-->
<!--      </div>-->
    </div>

    <!-- Toggle для подсказок -->
    <div class="hint-toggle-container">
      <label class="hint-toggle">
        <span class="hint-toggle-label">💡 Произношение</span>
        <input type="checkbox" v-model="showHints" />
        <span class="hint-toggle-slider"></span>
      </label>
    </div>

    <!-- Игровое поле с дартсом -->
    <div class="game-visual-wrapper">
      <svg class="darts-board" ref="dartsBoard" viewBox="0 0 500 500" overflow="visible">
        <!-- Внешний круг -->
        <circle cx="250" cy="250" r="230" fill="#1a1a2e" stroke="#e94560" stroke-width="3"/>

        <!-- Сектора дартса -->
        <g v-for="(answer, index) in answers" :key="index">
          <!-- Внешнее кольцо (eng) - всегда видимо -->
          <path
            :d="getOuterSectorPath(index)"
            :fill="sectorColors[index % sectorColors.length]"
            stroke="#fff"
            stroke-width="1.5"
            class="sector sector-outer"
            :class="{
      'sector-active': selectedAnswer === answer.eng && !isCorrect,
      'sector-correct': isCorrect && selectedAnswer === answer.eng,
      'sector-wrong': !isCorrect && selectedAnswer === answer.eng && selectedAnswer !== null
    }"
            @click="handleSectorClick(answer.eng, index, $event)"
          />

          <!-- Внутреннее кольцо (hint) - всегда видимо, но текст скрыт если подсказки выключены -->
          <path
            v-if="answer.hint"
            :d="getInnerSectorPath(index)"
            :fill="sectorColors[index % sectorColors.length]"
            stroke="#fff"
            stroke-width="1.5"
            class="sector sector-inner"
            :class="{
      'sector-active': selectedAnswer === answer.eng && !isCorrect,
      'sector-correct': isCorrect && selectedAnswer === answer.eng,
      'sector-wrong': !isCorrect && selectedAnswer === answer.eng && selectedAnswer !== null
    }"
            @click="handleSectorClick(answer.eng, index, $event)"
          />

          <!-- Если нет hint, заполняем внутреннее кольцо тем же цветом -->
          <path
            v-else
            :d="getInnerSectorPath(index)"
            :fill="sectorColors[index % sectorColors.length]"
            stroke="#fff"
            stroke-width="1.5"
            class="sector sector-inner sector-no-hint"
            @click="handleSectorClick(answer.eng, index, $event)"
          />

          <!-- Текст английского слова - всегда на внешнем кольце -->
          <text
            :x="getOuterTextPosition(index).x"
            :y="getOuterTextPosition(index).y"
            :transform="`rotate(${getTextRotation(index)}, ${getOuterTextPosition(index).x}, ${getOuterTextPosition(index).y})`"
            class="sector-text"
            fill="#fff"
            :font-size="getFontSize(answer.eng)"
            font-weight="bold"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            <tspan
              v-for="(line, lineIndex) in splitText(answer.eng, 10)"
              :key="lineIndex"
              :x="getOuterTextPosition(index).x"
              :dy="lineIndex === 0 ? 0 : 18"
            >
              {{ line }}
            </tspan>
          </text>

          <!-- Текст подсказки - скрыт когда подсказки выключены -->
          <text
            v-if="showHints && answer.hint"
            :x="getInnerTextPosition(index).x"
            :y="getInnerTextPosition(index).y"
            :transform="`rotate(${getTextRotation(index)}, ${getInnerTextPosition(index).x}, ${getInnerTextPosition(index).y})`"
            class="sector-hint"
            fill="rgba(255,255,255,0.85)"
            :font-size="getFontSize(answer.hint, true)"
            font-weight="500"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            <tspan
              v-for="(line, lineIndex) in splitText(answer.hint, 8)"
              :key="lineIndex"
              :x="getInnerTextPosition(index).x"
              :dy="lineIndex === 0 ? 0 : 16"
            >
              {{ line }}
            </tspan>
          </text>
        </g>


        <!-- Разделительная линия между кольцами - показываем только если включены подсказки -->
        <circle
          v-if="showHints"
          cx="250"
          cy="250"
          r="130"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          stroke-width="2"
        />

        <!-- Разделительная линия между внутренним кольцом и центром -->
        <circle cx="250" cy="250" r="65" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>

        <!-- Центральный круг с русским словом и картинкой -->
        <defs>
          <clipPath id="centerClip">
            <circle cx="250" cy="250" r="65" />
          </clipPath>
        </defs>

        <circle
          cx="250"
          cy="250"
          r="65"
          fill="#1a1a2e"
          stroke="#e94560"
          stroke-width="3"
          @click="handleCenterClick"
          style="cursor: pointer;"
        />

        <!-- Картинка (если есть) - обрезается маской -->
        <image
          v-if="currentWord.taskPicture"
          :href="currentWord.taskPicture"
          x="185"
          y="185"
          width="130"
          height="130"
          preserveAspectRatio="xMidYMid slice"
          clip-path="url(#centerClip)"
          class="center-image"
          @click="handleCenterClick"
          style="cursor: pointer;"
        />

        <!-- Полупрозрачный оверлей для читаемости текста -->
        <circle
          v-if="currentWord.taskPicture"
          cx="250"
          cy="250"
          r="65"
          fill="rgba(0,0,0,0.4)"
          stroke="none"
          @click="handleCenterClick"
          style="cursor: pointer;"
        />

        <!-- Текст поверх картинки -->
        <text
          x="250"
          y="242"
          class="center-word"
          fill="#fff"
          font-size="20"
          font-weight="bold"
          text-anchor="middle"
          dominant-baseline="middle"
          @click="handleCenterClick"
          style="cursor: pointer;"
        >
          <tspan
            v-for="(line, lineIndex) in splitText(currentWord.ru, 10)"
            :key="lineIndex"
            x="250"
            :dy="lineIndex === 0 ? 0 : 18"
          >
            {{ line }}
          </tspan>
        </text>

        <text
          x="250"
          y="275"
          fill="rgba(255,255,255,0.4)"
          font-size="11"
          text-anchor="middle"
          dominant-baseline="middle"
          @click="handleCenterClick"
          style="cursor: pointer;"
        >
          клик 👆подсказка
        </text>

        <!-- Анимация попадания -->
        <circle
          v-if="showHitAnimation"
          cx="250"
          cy="250"
          r="0"
          :fill="hitColor"
          class="hit-animation"
          :style="{
            '--hit-scale': hitScale
          }"
        />

        <!-- Дротик -->
        <image
          v-if="showDart"
          :href="dartImage"
          :x="dartPosition.x - 90"
          :y="dartPosition.y + 30"
          width="130"
          height="130"
          class="dart-image"
        />
      </svg>

      <!-- Ошибки и правильные ответы -->
      <div v-for="(error, index) in errorTexts" :key="'error-' + index" class="float-text error">
        {{ error }}
      </div>
      <div v-for="(positive, index) in positiveTexts" :key="'positive-' + index" class="float-text positive">
        {{ positive }}
      </div>
    </div>

    <!-- Кнопка для перехода к результатам -->
    <button class="action-button" @click="finishGame" v-if="isGameFinished">
      🎯 Посмотреть результаты
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useGameStore } from 'stores/example-store';
import shortWordsData from '../dataForGames/short-words-data';
import dartImage from '../assets/images/aYellowDart.png';

const router = useRouter();
const route = useRoute();
const gameStore = useGameStore();

// Игровые переменные
const currentMission = ref();
const currentGameData = ref([]);
const currentWord = ref({});
const answers = ref([]);
const selectedAnswer = ref(null);
const isCorrect = ref(false);
const currentQuestionIndex = ref(0);
const allQuestions = ref([]);
const failedWords = ref([]);
const firstTryCorrect = ref([]);
const progressPercentage = ref(0);
const matchedPairs = ref(0);
const isProcessing = ref(false);
const totalMistakes = ref(0);

// Переменные для счета
const score = ref(0);
const correctAnswers = ref(0);
const mistakes = ref(0);
const isGameFinished = ref(false);

// Настройки
const showHints = ref(false);
const MAX_SECTORS = 8;

// Анимации
const showHitAnimation = ref(false);
const hitColor = ref('#00ff00');
const hitScale = ref(1);
const errorTexts = ref([]);
const positiveTexts = ref([]);

// Дротик
const showDart = ref(false);
const dartPosition = ref({ x: 0, y: 0 });

// Данные для дартса
const sectorColors = [
  '#e94560', '#533483', '#0f3460', '#16213e',
  '#1a1a2e', '#2d4059', '#ea5455', '#f07b3e'
];

// Слова для флоатов
const errorWords = ['💥 Мимо!', '😅 Не угадал!', '🤔 Подумай еще!', '🎯 В другой сектор!', '😬 Ой!'];
const positiveWords = ['🎯 Точное попадание!', '💯 Отлично!', '🌟 Супер!', '🎉 Правильно!', '🏆 Гениально!'];

const startTime = ref(null);

const questionStartTime = ref(null); // Время начала текущего вопроса


// Вычисление прогресса
const animateProgress = (target) => {
  const duration = 500;
  const start = progressPercentage.value;
  const startTime = performance.now();

  const updateProgress = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    progressPercentage.value = start + (target - start) * progress;

    if (progress < 1) {
      requestAnimationFrame(updateProgress);
    }
  };

  requestAnimationFrame(updateProgress);
};

// Перемешивание массива
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

// Генерация секторов (всегда MAX_SECTORS)
const generateAnswers = (correctAnswer) => {
  const allItems = currentGameData.value;
  const correctItem = allItems.find(item => item.eng === correctAnswer);

  const otherItems = allItems.filter(item => item.eng !== correctAnswer);
  const shuffledOthers = shuffle([...otherItems]);

  const incorrectCount = Math.min(MAX_SECTORS - 1, shuffledOthers.length);
  const randomIncorrect = shuffledOthers.slice(0, incorrectCount);

  let allAnswers = [...randomIncorrect, correctItem];

  while (allAnswers.length < MAX_SECTORS) {
    const remaining = allItems.filter(item => !allAnswers.includes(item));
    if (remaining.length === 0) break;
    allAnswers.push(remaining[Math.floor(Math.random() * remaining.length)]);
  }

  return shuffle(allAnswers);
};

// Функции для SVG секторов
const getFullSectorPath = (index) => {
  const total = answers.value.length || MAX_SECTORS;
  const angle = (2 * Math.PI) / total;
  const offset = -Math.PI / 2;
  const startAngle = offset + index * angle;
  const endAngle = startAngle + angle;

  const r1 = 65;
  const r2 = 230;

  const x1 = 250 + r1 * Math.cos(startAngle);
  const y1 = 250 + r1 * Math.sin(startAngle);
  const x2 = 250 + r2 * Math.cos(startAngle);
  const y2 = 250 + r2 * Math.sin(startAngle);
  const x3 = 250 + r2 * Math.cos(endAngle);
  const y3 = 250 + r2 * Math.sin(endAngle);
  const x4 = 250 + r1 * Math.cos(endAngle);
  const y4 = 250 + r1 * Math.sin(endAngle);

  return `M ${x1} ${y1} L ${x2} ${y2} A 230 230 0 0 1 ${x3} ${y3} L ${x4} ${y4} A 65 65 0 0 0 ${x1} ${y1} Z`;
};

const getOuterSectorPath = (index) => {
  const total = answers.value.length || MAX_SECTORS;
  const angle = (2 * Math.PI) / total;
  const offset = -Math.PI / 2;
  const startAngle = offset + index * angle;
  const endAngle = startAngle + angle;

  const r1 = 130;
  const r2 = 230;

  const x1 = 250 + r1 * Math.cos(startAngle);
  const y1 = 250 + r1 * Math.sin(startAngle);
  const x2 = 250 + r2 * Math.cos(startAngle);
  const y2 = 250 + r2 * Math.sin(startAngle);
  const x3 = 250 + r2 * Math.cos(endAngle);
  const y3 = 250 + r2 * Math.sin(endAngle);
  const x4 = 250 + r1 * Math.cos(endAngle);
  const y4 = 250 + r1 * Math.sin(endAngle);

  return `M ${x1} ${y1} L ${x2} ${y2} A 230 230 0 0 1 ${x3} ${y3} L ${x4} ${y4} A 130 130 0 0 0 ${x1} ${y1} Z`;
};

const getInnerSectorPath = (index) => {
  const total = answers.value.length || MAX_SECTORS;
  const angle = (2 * Math.PI) / total;
  const offset = -Math.PI / 2;
  const startAngle = offset + index * angle;
  const endAngle = startAngle + angle;

  const r1 = 65;
  const r2 = 130;

  const x1 = 250 + r1 * Math.cos(startAngle);
  const y1 = 250 + r1 * Math.sin(startAngle);
  const x2 = 250 + r2 * Math.cos(startAngle);
  const y2 = 250 + r2 * Math.sin(startAngle);
  const x3 = 250 + r2 * Math.cos(endAngle);
  const y3 = 250 + r2 * Math.sin(endAngle);
  const x4 = 250 + r1 * Math.cos(endAngle);
  const y4 = 250 + r1 * Math.sin(endAngle);

  return `M ${x1} ${y1} L ${x2} ${y2} A 130 130 0 0 1 ${x3} ${y3} L ${x4} ${y4} A 65 65 0 0 0 ${x1} ${y1} Z`;
};

const getFullTextPosition = (index) => {
  const total = answers.value.length || MAX_SECTORS;
  const angle = (2 * Math.PI) / total;
  const offset = -Math.PI / 2;
  const midAngle = offset + index * angle + angle / 2;
  const radius = 147;

  return {
    x: 250 + radius * Math.cos(midAngle),
    y: 250 + radius * Math.sin(midAngle)
  };
};

const getOuterTextPosition = (index) => {
  const total = answers.value.length || MAX_SECTORS;
  const angle = (2 * Math.PI) / total;
  const offset = -Math.PI / 2;
  const midAngle = offset + index * angle + angle / 2;
  const radius = 180;

  return {
    x: 250 + radius * Math.cos(midAngle),
    y: 250 + radius * Math.sin(midAngle)
  };
};

const getInnerTextPosition = (index) => {
  const total = answers.value.length || MAX_SECTORS;
  const angle = (2 * Math.PI) / total;
  const offset = -Math.PI / 2;
  const midAngle = offset + index * angle + angle / 2;
  const radius = 97;

  return {
    x: 250 + radius * Math.cos(midAngle),
    y: 250 + radius * Math.sin(midAngle)
  };
};

const getTextRotation = (index) => {
  const total = answers.value.length || MAX_SECTORS;
  const angle = (2 * Math.PI) / total;
  const offset = -Math.PI / 2;
  const midAngle = offset + index * angle + angle / 2;

  let rotation = midAngle * 180 / Math.PI + 90;

  if (rotation > 90 && rotation < 270) {
    rotation += 180;
  }

  return rotation;
};


// Добавь эти функции в script

// Разбивка текста на строки
const splitText = (text, maxLength) => {
  if (!text) return [''];
  if (text.length <= maxLength) return [text];

  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      // Если слово само по себе длиннее maxLength, разбиваем его
      if (word.length > maxLength) {
        for (let i = 0; i < word.length; i += maxLength) {
          lines.push(word.slice(i, i + maxLength));
        }
      } else {
        currentLine = word;
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

const FONT_SIZE_CONFIG = {
  default: 25,      // Базовый размер для eng слов
  hint: 20,         // Базовый размер для подсказок
  minSize: 18,      // Минимальный размер
  maxLines: 10      // Максимальное количество символов в строке
};

// Определение размера шрифта
const getFontSize = (text, isHint = false) => {
  if (!text) return isHint ? FONT_SIZE_CONFIG.hint : FONT_SIZE_CONFIG.default;

  const baseSize = isHint ? FONT_SIZE_CONFIG.hint : FONT_SIZE_CONFIG.default;
  const length = text.length;

  // Плавное уменьшение размера
  if (length <= 5) return baseSize;
  if (length <= 8) return baseSize - 1;
  if (length <= 12) return baseSize - 2;
  if (length <= 16) return baseSize - 3;
  if (length <= 20) return baseSize - 4;
  return Math.max(FONT_SIZE_CONFIG.minSize, baseSize - 5);
};

// Обработка клика по центру (подсказка)
const handleCenterClick = (event) => {
  event.stopPropagation();
  if (isProcessing.value || selectedAnswer.value !== null) return;

  // Показываем дротик в центре
  showDart.value = true;
  dartPosition.value = {
    x: 250,
    y: 250 - 10
  };

  // Показываем подсказку
  const hintText = currentWord.value.hint || `Попробуй найти "${currentWord.value.eng}"`;
  positiveTexts.value = [hintText];

  // Добавляем очки за подсказку
  score.value += 5;

  // Показываем зеленую анимацию
  hitColor.value = '#00ff00';
  showHitAnimation.value = true;
  hitScale.value = 1;
  setTimeout(() => {
    hitScale.value = 3;
    setTimeout(() => {
      showHitAnimation.value = false;
    }, 500);
  }, 100);

  setTimeout(() => {
    showDart.value = false;
    positiveTexts.value = [];
  }, 1500);
};

// Обработка клика по сектору с анимацией дротика
const handleSectorClick = (answer, index, event) => {
  if (isProcessing.value || selectedAnswer.value !== null) return;

  // Получаем позицию текста по индексу
  const textPos = showHints.value ? getOuterTextPosition(index) : getFullTextPosition(index);

  // Показываем дротик над текстом
  showDart.value = true;
  dartPosition.value = {
    x: textPos.x,
    y: textPos.y - 10
  };

  // Скрываем дротик через 2 секунды
  setTimeout(() => {
    showDart.value = false;
  }, 900);

  // Вызываем проверку ответа
  checkAnswer(answer, index);
};

// Проверка ответа
// Проверка ответа
const checkAnswer = (answer, index) => {
  if (isProcessing.value || selectedAnswer.value !== null) return;

  isProcessing.value = true;
  selectedAnswer.value = answer;
  const correctAnswer = currentWord.value.eng;
  isCorrect.value = (answer === correctAnswer);

  const isFirstAnswer = firstTryCorrect.value[currentQuestionIndex.value] === null;

  if (isCorrect.value) {
    if (isFirstAnswer) {
      firstTryCorrect.value[currentQuestionIndex.value] = true;
    } else {
      firstTryCorrect.value[currentQuestionIndex.value] = true;
    }

    matchedPairs.value++;
    correctAnswers.value++;

    // Расчет бонуса за скорость
    const timeBonus = calculateTimeBonus();
    const totalPoints = 100 + timeBonus;
    score.value += totalPoints;

    hitColor.value = '#00ff00';
    showHitAnimation.value = true;
    hitScale.value = 1;
    setTimeout(() => {
      hitScale.value = 3;
      setTimeout(() => {
        showHitAnimation.value = false;
      }, 500);
    }, 100);

    const positiveText = positiveWords[Math.floor(Math.random() * positiveWords.length)];
    positiveTexts.value[index] = positiveText;
    setTimeout(() => {
      positiveTexts.value[index] = '';
    }, 1200);

    setTimeout(() => {
      currentQuestionIndex.value++;
      loadQuestion();
    }, 900);

  } else {
    totalMistakes.value++;

    if (isFirstAnswer) {
      firstTryCorrect.value[currentQuestionIndex.value] = false;
    }

    const alreadyFailed = failedWords.value.some(
      (word) => word.ru === currentWord.value.ru
    );
    if (!alreadyFailed) {
      failedWords.value.push({ ...currentWord.value });
    }

    mistakes.value++;
    // За неправильный ответ только 10 очков, без бонуса
    score.value += 10;

    hitColor.value = '#ff0000';
    showHitAnimation.value = true;
    hitScale.value = 1;
    setTimeout(() => {
      hitScale.value = 2.5;
      setTimeout(() => {
        showHitAnimation.value = false;
      }, 500);
    }, 100);

    const errorText = errorWords[Math.floor(Math.random() * errorWords.length)];
    errorTexts.value[index] = errorText;
    setTimeout(() => {
      errorTexts.value[index] = '';
    }, 1500);

    const sectors = document.querySelectorAll('.sector');
    if (sectors[index]) {
      sectors[index].classList.add('sector-shake');
      setTimeout(() => {
        sectors[index].classList.remove('sector-shake');
      }, 500);
    }

    setTimeout(() => {
      selectedAnswer.value = null;
      isCorrect.value = false;
      isProcessing.value = false;
      loadQuestion();
    }, 900);
  }
};
// Загрузка вопроса
const loadQuestion = async () => {
  if (currentQuestionIndex.value >= allQuestions.value.length && failedWords.value.length === 0) {
    finishGame();
    return;
  }

  if (currentQuestionIndex.value >= allQuestions.value.length && failedWords.value.length > 0) {
    allQuestions.value = [...allQuestions.value, ...failedWords.value];
    const newEntries = Array(failedWords.value.length).fill(null);
    firstTryCorrect.value = [...firstTryCorrect.value, ...newEntries];
    failedWords.value = [];
  }

  const wordData = allQuestions.value[currentQuestionIndex.value];
  currentWord.value = wordData;

  const correctAnswer = wordData.eng;
  answers.value = generateAnswers(correctAnswer);

  selectedAnswer.value = null;
  isCorrect.value = false;
  isProcessing.value = false;
  errorTexts.value = [];
  positiveTexts.value = [];

  // Сохраняем время начала вопроса
  questionStartTime.value = Date.now();
  await nextTick();
};


// Функция для расчета timeBonus
const calculateTimeBonus = () => {
  if (!questionStartTime.value) return 0;

  const elapsedMs = Date.now() - questionStartTime.value;

  // Если ответ быстрее 2000 мс - максимальный бонус 30
  if (elapsedMs <= 2000) return 30;

  // Если от 2000 до 17000 мс (2000 + 30*500 = 17000)
  if (elapsedMs <= 17000) {
    // (elapsedMs - 2000) / 500 - сколько шагов по 500мс прошло
    // 30 - Math.floor(шагов) - уменьшаем бонус
    const steps = Math.floor((elapsedMs - 2000) / 500);
    const bonus = Math.max(0, 30 - steps);
    return bonus;
  }

  // Больше 17 секунд - бонуса нет
  return 0;
};

// Завершение игры
const finishGame = () => {
  const duration = Date.now() - startTime.value;

  gameStore.setLastGameResults(duration, totalMistakes.value);
  gameStore.setGameName("DartsGame");
  gameStore.setWordSet(currentMission.value);

  isGameFinished.value = true;

  router.push({
    path: "/leader-board/",
    query: {
      missionName: currentMission.value
    }
  });
};

// Наблюдение за прогрессом
watch([matchedPairs, allQuestions], ([newMatched, allQuestionsList]) => {
  const totalQuestions = allQuestionsList.length;
  if (totalQuestions === 0) {
    progressPercentage.value = 0;
    return;
  }
  const percentage = (newMatched / totalQuestions) * 100;
  animateProgress(Math.min(percentage, 100));
}, { immediate: true });

// Инициализация
onMounted(() => {
  currentMission.value = route.params.missionName;

  const getWordSet = (name) => {
    if (shortWordsData[name]) return shortWordsData[name];
    for (const level in shortWordsData) {
      if (shortWordsData[level] && shortWordsData[level][name]) {
        return shortWordsData[level][name];
      }
    }
    return [];
  };

  currentGameData.value = getWordSet(currentMission.value);
  const shuffledData = shuffle([...currentGameData.value]).slice(0, 12);
  allQuestions.value = [...shuffledData];
  startTime.value = Date.now();
  firstTryCorrect.value = Array(allQuestions.value.length).fill(null);
  loadQuestion();
});
</script>

<style lang="scss" scoped>
.marginTop75 {
  margin-top: 75px;
  padding: 0 10px;
}

.progress-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 20px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.progress-bar {
  height: 100%;
  display: flex;
  transition: width 0.5s ease;
}

.progress-segment {
  height: 100%;
  transition: background-color 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: bold;
  pointer-events: none;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.score-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
  max-width: 500px;
  margin: 0 auto 15px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
}

.score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.score-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.score-value {
  color: #fff;
  font-weight: bold;
  font-size: 24px;
  line-height: 1.2;
}

.score-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.1);
}

.hint-toggle-container {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.hint-toggle {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.hint-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.hint-toggle-slider {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 26px;
  transition: 0.3s;
  flex-shrink: 0;
}

.hint-toggle-slider::before {
  content: '';
  position: absolute;
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background: #fff;
  border-radius: 50%;
  transition: 0.3s;
}

.hint-toggle input:checked + .hint-toggle-slider {
  background: #e94560;
}

.hint-toggle input:checked + .hint-toggle-slider::before {
  transform: translateX(22px);
}

.hint-toggle-label {
  font-weight: 500;
  letter-spacing: 0.3px;
}

.game-visual-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: 600px;
  overflow: visible;
}

.darts-board {
  width: 100%;
  height: auto;
  max-width: 550px;
  aspect-ratio: 1;
  background: radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0f0f1a 100%);
  border-radius: 50%;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.6),
    inset 0 2px 0 rgba(255, 255, 255, 0.05);
  cursor: pointer;
  overflow: visible;
}

.dart-image {
  animation: dartThrow 0.3s ease-out forwards;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
  overflow: visible;
  pointer-events: none;
}

.sector {
  transition: all 0.15s ease;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
    filter: brightness(1.1);
  }
}

.sector-active {
  opacity: 0.7;
}

.sector-correct {
  animation: sectorCorrect 0.6s ease;
}

.sector-wrong {
  animation: sectorWrong 0.6s ease;
}

.sector-shake {
  animation: shake 0.5s ease;
}

.sector-text {
  pointer-events: none;
  text-shadow:
    0 2px 8px rgba(0, 0, 0, 0.8),
    0 0 20px rgba(0, 0, 0, 0.5);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 700;
  letter-spacing: 0.3px;
  line-height: 1.2;

  tspan {
    display: block;
  }
}

.sector-hint {
  pointer-events: none;
  text-shadow:
    0 2px 8px rgba(0, 0, 0, 0.8),
    0 0 15px rgba(0, 0, 0, 0.4);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 500;
  letter-spacing: 0.2px;
  line-height: 1.2;

  tspan {
    display: block;
  }
}

.center-word {
  text-shadow:
    0 4px 20px rgba(233, 69, 96, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.5);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: transform 0.2s;
  transform-origin: center; // чтобы по диагонали не смещалось привязываем к центру

  &:hover {
    transform: scale(1.15);
  }
}
.center-image {
  pointer-events: none;
  object-fit: cover;
}

// Убедись, что круг не мешает кликам
circle {
  pointer-events: none;
}

// А кликабельным делаем только внешний g
g[style*="cursor: pointer;"] {
  cursor: pointer;
}
.hit-animation {
  animation: hitPulse 0.6s ease forwards;
  opacity: 0.6;
}

@keyframes dartThrow {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes hitPulse {
  0% {
    r: 0;
    opacity: 0.8;
  }
  100% {
    r: 200px;
    opacity: 0;
  }
}

@keyframes sectorCorrect {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); filter: brightness(1.4); }
}

@keyframes sectorWrong {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(0.95) rotate(-3deg); }
  75% { transform: scale(0.95) rotate(3deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

.float-text {
  position: absolute;
  font-size: 32px;
  font-weight: bold;
  pointer-events: none;
  text-shadow:
    0 4px 20px rgba(0, 0, 0, 0.8),
    0 2px 8px rgba(0, 0, 0, 0.5);
  animation: floatUp 1.2s ease forwards;
  z-index: 10;
}

.float-text.error {
  color: #ff6b6b;
}

.float-text.positive {
  color: #51cf66;
}

@keyframes floatUp {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-80px) scale(1.5);
  }
}

.action-button {
  display: block;
  margin: 25px auto 0;
  padding: 16px 40px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #e94560, #c73652);
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(233, 69, 96, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 30px rgba(233, 69, 96, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

// Адаптивность для планшетов
@media (max-width: 768px) {
  .darts-board {
    max-width: 450px;
  }

  .sector-text {
    font-size: 20px !important;
  }

  .sector-hint {
    font-size: 12px !important;
  }

  .center-word {
    font-size: 18px !important;
  }

  .score-value {
    font-size: 20px;
  }
}

</style>
