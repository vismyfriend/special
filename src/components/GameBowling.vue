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
        <span class="score-label">🎳 Очки</span>
        <span class="score-value">{{ score }}</span>
      </div>
      <div class="score-divider"></div>
    </div>

    <!-- Управление -->
    <div class="controls-container">
      <!-- Toggle для подсказок -->
      <label class="hint-toggle">
        <span class="hint-toggle-label">💡 Произношение</span>
        <input type="checkbox" v-model="showHints" />
        <span class="hint-toggle-slider"></span>
      </label>

      <!-- Dropdown для выбора режима -->
      <div class="mode-selector">
        <select v-model="displayMode" class="mode-select">
          <option value="pins">🎳 На кеглях</option>
          <option value="list">📋 Список слева</option>
        </select>
      </div>
    </div>

    <!-- Игровое поле -->
    <div class="game-layout">
      <!-- Список слов слева (только в режиме list) -->
      <div v-if="displayMode === 'list'" class="words-list">
        <div
          v-for="(answer, index) in answers"
          :key="index"
          class="word-item"
          :class="{
            'word-active': hoveredPin === index,
            'word-correct': isFallen[index],
            'word-wrong': !isCorrect && selectedAnswer === answer.eng && selectedAnswer !== null
          }"
          @mouseenter="hoveredPin = index"
          @mouseleave="hoveredPin = null"
          @click="handlePinClick(answer.eng, index, $event)"
        >
          <span class="word-number">{{ index + 1 }}.</span>
          <span class="word-text">{{ answer.eng }}</span>
          <span v-if="showHints && answer.hint" class="word-hint">{{ answer.hint }}</span>
        </div>
      </div>

      <!-- Дорожка с кеглями -->
      <div class="game-visual-wrapper">
        <svg class="bowling-lane" ref="bowlingLane" viewBox="0 0 500 500" overflow="visible">
          <!-- Фон дорожки -->
          <rect x="0" y="0" width="500" height="500" fill="#1a1a2e" rx="20"/>

          <!-- Линии дорожки -->
          <line x1="50" y1="0" x2="50" y2="500" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
          <line x1="450" y1="0" x2="450" y2="500" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
          <line x1="250" y1="0" x2="250" y2="500" stroke="rgba(255,255,255,0.03)" stroke-width="1" stroke-dasharray="5,5"/>

          <!-- Кегли -->
          <g v-for="(answer, index) in answers" :key="index">
            <!-- Группа кегли -->
            <g
              @click="handlePinClick(answer.eng, index, $event)"
              @mouseenter="hoveredPin = index"
              @mouseleave="hoveredPin = null"
              class="pin-group"
              :class="{
                'pin-active': hoveredPin === index && !isFallen[index],
                'pin-correct': isCorrect && selectedAnswer === answer.eng,
                'pin-wrong': !isCorrect && selectedAnswer === answer.eng && selectedAnswer !== null,
                'pin-fallen': isFallen[index]
              }"
              :transform="`translate(${getPinPosition(index).x}, ${getPinPosition(index).y})`"
              :style="{
                '--fall-angle': isFallen[index] ? getFallAngle(index) : 0,
                '--fall-delay': index * 50 + 'ms'
              }"
            >
              <!-- Тень кегли -->
              <ellipse
                cx="2"
                cy="2"
                rx="20"
                ry="24"
                fill="rgba(0,0,0,0.3)"
              />

              <!-- Тело кегли -->
              <ellipse
                cx="0"
                cy="0"
                rx="20"
                ry="24"
                :fill="sectorColors[index % sectorColors.length]"
                stroke="#fff"
                stroke-width="1.5"
                class="pin-body"
              />

              <!-- Головка кегли -->
              <circle
                cx="0"
                cy="-24"
                r="12"
                :fill="sectorColors[index % sectorColors.length]"
                stroke="#fff"
                stroke-width="1.5"
                class="pin-head"
              />

              <!-- Блик на кегле -->
              <ellipse
                cx="-6"
                cy="-6"
                rx="6"
                ry="10"
                fill="rgba(255,255,255,0.2)"
              />

              <!-- Английское слово на кегле (только в режиме pins) -->
              <text
                v-if="displayMode === 'pins'"
                x="0"
                y="4"
                class="pin-word"
                fill="#fff"
                :font-size="getFontSize(answer.eng)"
                font-weight="bold"
                text-anchor="middle"
                dominant-baseline="middle"
              >
                <tspan
                  v-for="(line, lineIndex) in splitText(answer.eng, 6)"
                  :key="lineIndex"
                  x="0"
                  :dy="lineIndex === 0 ? 0 : 16"
                >
                  {{ line }}
                </tspan>
              </text>

              <!-- Номер на кегле (в режиме list) -->
              <text
                v-else
                x="0"
                y="4"
                class="pin-number"
                fill="rgba(255,255,255,0.7)"
                font-size="18"
                font-weight="bold"
                text-anchor="middle"
                dominant-baseline="middle"
              >
                {{ index + 1 }}
              </text>

              <!-- Подсказка под кеглей -->
              <text
                v-if="showHints && answer.hint && displayMode === 'pins'"
                x="0"
                y="36"
                class="pin-hint"
                fill="rgba(255,255,255,0.6)"
                font-size="11"
                text-anchor="middle"
                dominant-baseline="middle"
              >
                {{ answer.hint }}
              </text>
            </g>
          </g>

          <!-- Боулинговый шар -->
          <g @click="handleBallClick" style="cursor: pointer;">
            <!-- Тень шара -->
            <circle cx="250" cy="440" r="32" fill="rgba(0,0,0,0.3)" />

            <!-- Шар -->
            <circle
              cx="250"
              cy="430"
              r="30"
              fill="#2d4059"
              stroke="#fff"
              stroke-width="2"
              class="bowling-ball"
            />

            <!-- Отверстия для пальцев -->
            <circle cx="240" cy="420" r="6" fill="#1a1a2e" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
            <circle cx="260" cy="420" r="6" fill="#1a1a2e" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
            <circle cx="250" cy="435" r="6" fill="#1a1a2e" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>

            <!-- Блик на шаре -->
            <ellipse cx="240" cy="420" rx="10" ry="8" fill="rgba(255,255,255,0.15)" />

            <!-- Русское слово на шаре -->
            <text
              x="250"
              y="433"
              class="ball-word"
              fill="#fff"
              font-size="16"
              font-weight="bold"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              <tspan
                v-for="(line, lineIndex) in splitText(currentWord.ru, 6)"
                :key="lineIndex"
                x="0"
                :dy="lineIndex === 0 ? 0 : 16"
              >
                {{ line }}
              </tspan>
            </text>

            <text
              x="250"
              y="470"
              fill="rgba(255,255,255,0.3)"
              font-size="10"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              👆 кликни для подсказки
            </text>
          </g>

          <!-- Анимация попадания -->
          <circle
            v-if="showHitAnimation"
            cx="250"
            cy="250"
            r="0"
            :fill="hitColor"
            class="hit-animation"
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
    </div>

    <!-- Кнопка для перехода к результатам -->
    <button class="action-button" @click="finishGame" v-if="isGameFinished">
      🎳 Посмотреть результаты
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useGameStore } from 'stores/example-store';
import shortWordsData from '../dataForGames/short-words-data';

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
const displayMode = ref('pins'); // 'pins' или 'list'
const MAX_PINS = 10;
const isFallen = ref([]);
const hoveredPin = ref(null);

// Анимации
const showHitAnimation = ref(false);
const hitColor = ref('#00ff00');
const errorTexts = ref([]);
const positiveTexts = ref([]);

// Данные для кеглей
const sectorColors = [
  '#e94560', '#533483', '#0f3460', '#16213e',
  '#1a1a2e', '#2d4059', '#ea5455', '#f07b3e',
  '#ff6b6b', '#4ecdc4'
];

// Слова для флоатов
const errorWords = ['💥 Мимо!', '😅 Не угадал!', '🤔 Подумай еще!', '🎳 В другую кеглю!', '😬 Ой!'];
const positiveWords = ['🎳 Страйк!', '💯 Отлично!', '🌟 Супер!', '🎉 Правильно!', '🏆 Гениально!'];

const startTime = ref(null);
const questionStartTime = ref(null);

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

// Позиции кеглей (треугольник для 10 кеглей)
const getPinPosition = (index) => {
  let row = 0;
  let cumulative = 0;
  let pinsInRow = 4;

  for (let i = 0; i < 4; i++) {
    if (index < cumulative + pinsInRow) {
      row = i;
      break;
    }
    cumulative += pinsInRow;
    pinsInRow--;
  }

  if (index >= 10) {
    row = Math.floor(Math.sqrt(index * 2 + 0.25) - 0.5);
    const rowStart = row * (row + 1) / 2;
    const posInRow = index - rowStart;
    pinsInRow = row + 1;
    const x = 250 + (posInRow - (pinsInRow - 1) / 2) * 45;
    const y = 100 + row * 45;
    return { x, y };
  }

  const posInRow = index - cumulative;
  const rowWidth = pinsInRow * 45;
  const startX = 250 - rowWidth / 2 + 22.5;

  const x = startX + posInRow * 45;
  const y = 100 + row * 45;

  return { x, y };
};

// Угол падения кегли
const getFallAngle = (index) => {
  const pos = getPinPosition(index);
  const centerX = 250;
  const centerY = 150;

  const dx = pos.x - centerX;
  const dy = pos.y - centerY;

  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  return 90 + angle + (Math.random() - 0.5) * 20;
};

// Генерация ответов
const generateAnswers = (correctAnswer) => {
  const allItems = currentGameData.value;
  const correctItem = allItems.find(item => item.eng === correctAnswer);

  const otherItems = allItems.filter(item => item.eng !== correctAnswer);
  const shuffledOthers = shuffle([...otherItems]);

  const incorrectCount = Math.min(MAX_PINS - 1, shuffledOthers.length);
  const randomIncorrect = shuffledOthers.slice(0, incorrectCount);

  let allAnswers = [...randomIncorrect, correctItem];

  while (allAnswers.length < MAX_PINS) {
    const remaining = allItems.filter(item => !allAnswers.includes(item));
    if (remaining.length === 0) break;
    allAnswers.push(remaining[Math.floor(Math.random() * remaining.length)]);
  }

  return shuffle(allAnswers);
};

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

// Определение размера шрифта
const getFontSize = (text) => {
  if (!text) return 13;
  const length = text.length;

  if (length <= 4) return 13;
  if (length <= 6) return 12;
  if (length <= 8) return 11;
  if (length <= 10) return 10;
  return 9;
};

// Обработка клика по шару (подсказка)
const handleBallClick = (event) => {
  event.stopPropagation();
  if (isProcessing.value || selectedAnswer.value !== null) return;

  const hintText = currentWord.value.hint || `Попробуй найти "${currentWord.value.eng}"`;
  positiveTexts.value = [hintText];
  score.value += 5;

  hitColor.value = '#00ff00';
  showHitAnimation.value = true;
  setTimeout(() => {
    showHitAnimation.value = false;
  }, 600);

  setTimeout(() => {
    positiveTexts.value = [];
  }, 1500);
};

// Обработка клика по кегле
const handlePinClick = (answer, index, event) => {
  if (isProcessing.value || selectedAnswer.value !== null) return;
  checkAnswer(answer, index);
};

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
    }

    matchedPairs.value++;
    correctAnswers.value++;

    const timeBonus = calculateTimeBonus();
    const totalPoints = 100 + timeBonus;
    score.value += totalPoints;

    isFallen.value[index] = true;

    hitColor.value = '#00ff00';
    showHitAnimation.value = true;
    setTimeout(() => {
      showHitAnimation.value = false;
    }, 500);

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
    score.value += 10;

    hitColor.value = '#ff0000';
    showHitAnimation.value = true;
    setTimeout(() => {
      showHitAnimation.value = false;
    }, 500);

    const errorText = errorWords[Math.floor(Math.random() * errorWords.length)];
    errorTexts.value[index] = errorText;
    setTimeout(() => {
      errorTexts.value[index] = '';
    }, 1500);

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
  isFallen.value = Array(answers.value.length).fill(false);
  hoveredPin.value = null;

  questionStartTime.value = Date.now();
  await nextTick();
};

// Функция для расчета timeBonus
const calculateTimeBonus = () => {
  if (!questionStartTime.value) return 0;

  const elapsedMs = Date.now() - questionStartTime.value;

  if (elapsedMs <= 2000) return 30;
  if (elapsedMs <= 17000) {
    const steps = Math.floor((elapsedMs - 2000) / 500);
    const bonus = Math.max(0, 30 - steps);
    return bonus;
  }
  return 0;
};

// Завершение игры
const finishGame = () => {
  const duration = Date.now() - startTime.value;

  gameStore.setLastGameResults(duration, totalMistakes.value);
  gameStore.setGameName("BowlingGame");
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

.controls-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
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

.mode-selector {
  display: flex;
  align-items: center;
}

.mode-select {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
  }

  &:focus {
    border-color: #e94560;
    box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.2);
  }

  option {
    background: #1a1a2e;
    color: #fff;
    padding: 4px;
  }
}

.game-layout {
  display: flex;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
  align-items: flex-start;
}

.words-list {
  flex: 0 0 200px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  max-height: 500px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
}

.word-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  border-left: 3px solid transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }

  .word-number {
    color: rgba(255, 255, 255, 0.3);
    font-size: 12px;
    min-width: 24px;
  }

  .word-text {
    font-weight: 500;
    flex: 1;
  }

  .word-hint {
    color: rgba(255, 255, 255, 0.4);
    font-size: 11px;
    font-style: italic;
  }
}

.word-active {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border-left-color: #e94560;
  transform: scale(1.02);
}

.word-correct {
  background: rgba(0, 255, 0, 0.1);
  color: #51cf66;
  border-left-color: #51cf66;
  opacity: 0.6;
  text-decoration: line-through;
}

.word-wrong {
  background: rgba(255, 0, 0, 0.1);
  color: #ff6b6b;
  border-left-color: #ff6b6b;
  animation: shake 0.5s ease;
}

.game-visual-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  overflow: visible;
}

.bowling-lane {
  width: 100%;
  height: auto;
  max-width: 550px;
  aspect-ratio: 1;
  background: radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0f0f1a 100%);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  overflow: visible;
}

.pin-group {
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
  will-change: transform;

  &:not(.pin-fallen):not(.pin-correct) {
    &:hover {
      transform: scale(1.08) !important;
      filter: brightness(1.2);
    }
  }
}

.pin-active {
  transform: scale(1.08) !important;
  filter: brightness(1.2);
}

.pin-correct {
  animation: pinFall 0.8s ease forwards;
  animation-delay: var(--fall-delay);
}

.pin-fallen {
  animation: pinFall 0.8s ease forwards;
}

.pin-wrong {
  animation: pinShake 0.5s ease;
}

.pin-number {
  pointer-events: none;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  font-family: 'Inter', sans-serif;
}

.pin-word {
  pointer-events: none;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  font-family: 'Inter', sans-serif;
  font-weight: 700;
}

.pin-hint {
  pointer-events: none;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.bowling-ball {
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.ball-word {
  pointer-events: none;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  font-family: 'Inter', sans-serif;
  font-weight: 800;
}

.hit-animation {
  animation: hitPulse 0.6s ease forwards;
  opacity: 0.6;
}

@keyframes pinFall {
  0% {
    transform: rotate(0deg) translate(0, 0);
    opacity: 1;
  }
  30% {
    transform: rotate(var(--fall-angle)) translate(0, 0);
    opacity: 1;
  }
  100% {
    transform: rotate(90deg) translate(0, 80px);
    opacity: 0;
  }
}

@keyframes pinShake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-8deg); }
  75% { transform: rotate(8deg); }
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
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
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
  .game-layout {
    flex-direction: column;
    align-items: center;
  }

  .words-list {
    flex: none;
    width: 100%;
    max-width: 550px;
    max-height: 150px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 10px;

    .word-item {
      flex: 0 0 calc(50% - 4px);
      padding: 4px 8px;
      font-size: 12px;
    }
  }

  .bowling-lane {
    max-width: 450px;
  }

  .score-value {
    font-size: 20px;
  }

  .controls-container {
    gap: 12px;
    flex-direction: column;
  }
}

// Адаптивность для мобильных
@media (max-width: 480px) {
  .marginTop75 {
    margin-top: 60px;
    padding: 0 5px;
  }

  .words-list {
    max-height: 120px;

    .word-item {
      flex: 0 0 100%;
      font-size: 11px;
      padding: 3px 8px;
    }
  }

  .bowling-lane {
    max-width: 340px;
  }

  .score-container {
    padding: 10px 15px;
    gap: 15px;
  }

  .score-value {
    font-size: 18px;
  }

  .score-label {
    font-size: 10px;
  }

  .float-text {
    font-size: 24px;
  }

  .action-button {
    padding: 14px 30px;
    font-size: 16px;
  }


  .mode-select {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
