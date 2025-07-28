<template>
  <!-- ==================== -->
  <!-- Основной экран игры -->
  <!-- ==================== -->
  <img class="backgroundImg" :src="backgroundImage" alt="Фон игры">

  <div class="game-container" v-if="!gameFinished">
    <div class="detective-board">
      <!-- Polaroid-стиль для фотографии -->
      <div class="polaroid">
        <img :src="currentPhoto.picture" alt="Историческая фотография" class="photo">
        <div class="polaroid-label">
          <div class="photo-counter">Архивное фото №{{ currentRound }}/5</div>
          <div class="result-info">
            <div>{{ isAnswerChecked ? 'Вы ответили : ' + lastGuess : 'Предположите какой это год' }}</div>
            <div>{{ isAnswerChecked ? 'Правильный ответ : ' + currentPhoto.date : 'It looks like the year .... because... ' }}</div>
            <div>{{ isAnswerChecked ? 'Разница - Difference : ' + Math.abs(lastGuess - parseInt(currentPhoto.date)) + ' лет' : '????' }}</div>
            <div>{{ isAnswerChecked ? 'Очков за догадку + ' + lastPoints : 'двигайте лупу 🔎 влево/вправо' }}</div>
          </div>
        </div>
      </div>
      <!-- ==================== -->
      <!-- Линейка выбора года -->
      <!-- ==================== -->
      <div class="timeline-ruler">
        <!-- Лупа с текущим годом -->
        <div class="magnifier" :style="{ left: sliderPosition }"
             @mousedown="startDrag" @touchstart="startDrag">
          <div class="magnifier-glass"><<<
            <div class="current-year">{{ selectedYear }}</div>
          >>></div>
          <div class="magnifier-handle"></div>
        </div>

        <!-- Линейка с делениями -->
        <div class="ruler-track" ref="rulerTrack">
          <!-- Подсветка диапазона между ответом и правильным ответом -->
          <div v-if="showRangeHighlight" class="range-highlight"
               :style="rangeHighlightStyle"></div>

          <!-- Деления для каждого года -->
          <div v-for="year in allYears" :key="year" class="ruler-mark"
               :class="{
                 'decade-mark': year % 10 === 0,
                 'half-decade-mark': year % 5 === 0 && year % 10 !== 0,
                 'year-mark': year % 5 !== 0,
                 'first-mark': year === 1900,
                 'last-mark': year === 2030
               }"
               :style="{ left: `${(year - 1900) * 100 / 130}%` }"></div>

          <!-- Подписи годов -->
          <div v-for="mark in labeledMarks" :key="'label-' + mark" class="year-label"
               :class="{
                 'decade-label': mark % 10 === 0,
                 'half-decade-label': mark % 5 === 0 && mark % 10 !== 0,
                 'first-label': mark === 1900,
                 'last-label': mark === 2030
               }"
               :style="{ left: `${(mark - 1900) * 100 / 130}%` }">
            {{ mark }}
          </div>
        </div>
      </div>

      <!-- ==================== -->
      <!-- Управление игрой -->
      <!-- ==================== -->
      <!-- Кнопка подтверждения/перехода -->
      <button class="submit-btn"
              @click="isAnswerChecked ? nextPhoto() : checkAnswer()"
              :disabled="isDragging">
        {{ isAnswerChecked ? 'Next Picture (Enter)' : 'Проверить (Enter)' }}
      </button>

      <!-- Отображение текущего счета -->
      <div class="score-display">
        Текущий счет: {{ currentScore }}
      </div>
    </div>
  </div>

  <!-- ==================== -->
  <!-- Экран результатов -->
  <!-- ==================== -->
  <div class="results-container" v-if="gameFinished">
    <h2 class="h2">Расследование завершено!</h2>
    <div class="final-score">Ваш итоговый счет: {{ currentScore }}</div>

    <div class="photo-results">
      <div v-for="(result, index) in gameResults" :key="index" class="result-item">
        <div class="result-polaroid">
          <img :src="result.photo.picture" :alt="'Фото ' + (index + 1)">
          <div class="result-info">
            <p><strong>Ваш ответ:</strong> {{ result.guess }} год</p>
            <p><strong>Правильный ответ:</strong> {{ result.photo.date }} год</p>
            <p><strong>Очков получено:</strong> +{{ result.points }}</p>
            <p class="photo-description">{{ result.photo.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <button class="play-again-btn" @click="resetGame">
      Играть снова
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { getShuffledData } from '../dataForGames/yearGuesserData';

// ==================== //
// Состояние игры       //
// ==================== //
const selectedYear = ref(1965);          // Выбранный пользователем год
const sliderPosition = ref('50%');       // Позиция ползунка на линейке
const currentRound = ref(1);             // Текущий раунд (1-5)
const currentScore = ref(0);             // Текущий счет
const gameFinished = ref(false);         // Флаг завершения игры
const gameResults = ref([]);             // Результаты всех раундов
const rulerTrack = ref(null);            // Ссылка на элемент линейки
const isDragging = ref(false);           // Флаг перетаскивания ползунка
const isAnswerChecked = ref(false);      // Флаг проверки ответа
const lastGuess = ref(0);                // Последний ответ пользователя
const lastPoints = ref(0);               // Очки за последний ответ
const correctYear = ref(0);              // Правильный год для текущей фотографии
const showRangeHighlight = ref(false);   // Показывать подсветку диапазона
const backgroundImage = new URL("../assets/images/background1.jpg", import.meta.url).href;

// ==================== //
// Вычисляемые свойства //
// ==================== //
// Все года для делений (1900-2030)
const allYears = computed(() => Array.from({length: 131}, (_, i) => 1900 + i));

// Годы, которые будут подписаны (каждые 5 лет + первый/последний)
const labeledMarks = computed(() =>
  allYears.value.filter(year => year % 5 === 0 || year === 1900 || year === 2030)
);

// Стиль для подсветки диапазона между ответом и правильным ответом
const rangeHighlightStyle = computed(() => {
  if (!isAnswerChecked.value) return {};

  const correct = correctYear.value;
  const guessed = lastGuess.value;
  const left = Math.min(correct, guessed);
  const right = Math.max(correct, guessed);
  const leftPos = ((left - 1900) / 130) * 100;
  const rightPos = ((right - 1900) / 130) * 100;
  const width = rightPos - leftPos;

  // Цвет зависит от разницы в годах
  const diff = Math.abs(correct - guessed);
  let color;
  if (diff <= 2) color = '#4CAF50';      // Зеленый
  else if (diff <= 5) color = '#8BC34A'; // Светло-зеленый
  else if (diff <= 10) color = '#FFEB3B';// Желтый
  else if (diff <= 20) color = '#FF9800';// Оранжевый
  else color = '#F44336';                // Красный

  return {
    left: `${leftPos}%`,
    width: `${width}%`,
    backgroundColor: color,
    opacity: 0.7
  };
});

// Текущая фотография
const photos = ref(getShuffledData());
const currentPhoto = computed(() => photos.value[currentRound.value - 1]);

// ==================== //
// Методы игры          //
// ==================== //
// Обновление позиции ползунка
const updatePosition = (clientX) => {
  const trackRect = rulerTrack.value.getBoundingClientRect();
  let percentage = (clientX - trackRect.left) / trackRect.width;
  percentage = Math.max(0, Math.min(1, percentage));
  selectedYear.value = Math.round(1900 + percentage * 130);
  sliderPosition.value = `${percentage * 100}%`;
};

// Обработчики перетаскивания ползунка
const startDrag = (e) => {
  isDragging.value = true;
  updatePosition(e.touches?.[0].clientX ?? e.clientX);
  ['mousemove', 'touchmove', 'mouseup', 'touchend'].forEach(event =>
    document.addEventListener(event, event.includes('move') ? handleDrag : stopDrag)
  );
};

const handleDrag = (e) => {
  if (isDragging.value) {
    updatePosition(e.touches?.[0].clientX ?? e.clientX);
  }
};

const stopDrag = () => {
  isDragging.value = false;
  ['mousemove', 'touchmove', 'mouseup', 'touchend'].forEach(event =>
    document.removeEventListener(event, event.includes('move') ? handleDrag : stopDrag)
  );
};

// Обработка клика по треку
const handleTrackClick = (e) => updatePosition(e.clientX);

// Расчет очков за ответ
const calculatePoints = (correctYear, guessedYear) => {
  const diff = Math.abs(correctYear - guessedYear);

  // Максимальные очки за точный ответ
  if (diff === 0) return 1000;
  if (diff === 1) return 929;
  if (diff === 2) return 888;
  if (diff === 3) return 812;
  if (diff === 4) return 777;
  if (diff === 5) return 666;
  if (diff === 6) return 602;
  if (diff === 7) return 550;
  if (diff === 8) return 505;
  if (diff === 9) return 414;
  if (diff === 10) return 330;
  if (diff === 11) return 300;
  if (diff === 12) return 212;
  if (diff === 13) return 130;
  if (diff === 14) return 114;
  if (diff === 15) return 98;
  if (diff === 16) return 89;
  if (diff === 17) return 77;
  if (diff === 18) return 66;
  if (diff === 19) return 55;
  if (diff === 20) return 44;
  if (diff === 21) return 33;
  if (diff === 22) return 22;
  if (diff === 23) return 11;
  return 0;
};

// Проверка ответа
const checkAnswer = () => {
  correctYear.value = parseInt(currentPhoto.value.date);
  lastGuess.value = parseInt(selectedYear.value);
  lastPoints.value = calculatePoints(correctYear.value, lastGuess.value);

  currentScore.value += lastPoints.value;
  gameResults.value.push({
    photo: currentPhoto.value,
    guess: lastGuess.value,
    points: lastPoints.value
  });

  isAnswerChecked.value = true;
  showRangeHighlight.value = true;
};

// Переход к следующей фотографии
const nextPhoto = () => {
  if (currentRound.value < 5) {
    currentRound.value++;
    selectedYear.value = 1965;
    sliderPosition.value = '50%';
    isAnswerChecked.value = false;
    showRangeHighlight.value = false;
  } else {
    gameFinished.value = true;
  }
};

// Обработка нажатия клавиш
const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    isAnswerChecked.value ? nextPhoto() : checkAnswer();
  }
};

// Сброс игры
const resetGame = () => {
  currentRound.value = 1;
  currentScore.value = 0;
  gameFinished.value = false;
  gameResults.value = [];
  selectedYear.value = 1965;
  sliderPosition.value = '50%';
  isAnswerChecked.value = false;
  showRangeHighlight.value = false;
  photos.value = getShuffledData();
};

const preventScroll = (e) => {
  if (isDragging.value) {
    e.preventDefault();
  }
};

// ==================== //
// Хуки жизненного цикла //
// ==================== //
onMounted(() => {
  window.addEventListener('keypress', handleKeyPress);
  rulerTrack.value.addEventListener('click', handleTrackClick);
  updatePosition(window.innerWidth / 2); // Центрируем лупу при загрузке
  window.addEventListener('touchmove', preventScroll, { passive: false });

});

onBeforeUnmount(() => {
  window.removeEventListener('keypress', handleKeyPress);
  rulerTrack.value?.removeEventListener('click', handleTrackClick);
  stopDrag();
  window.removeEventListener('touchmove', preventScroll);

});
</script>

<style scoped>
/* ==================== */
/* Основные стили       */
/* ==================== */

.backgroundImg {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  object-fit: cover;
  z-index: -1;
  filter: brightness(0.7) blur(4px); /* Затемнение + лёгкое размытие самого фона */
  transform: scale(1.02); /* Убирает тёмные края от blur */

}

.game-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Courier New', monospace;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* отключаем гориз. скроллинг  */

}

.detective-board {
  background-color: #e8e8e8;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #d0d0d0;
  position: relative;

}

/* ==================== */
/* Стили Polaroid       */
/* ==================== */
.polaroid {
  background: white;
  padding: 15px 15px 40px 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: rotate(-1deg);
  margin: 0 auto 30px;
  width: fit-content;
  position: relative;
}

.polaroid:before {
  content: '';
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  background: #f5f5f5;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}

.photo {
  width: auto;
  max-height: 500px;
  display: block;
  border: 1px solid #ddd;
}

.polaroid-label {
  text-align: center;
  color: #666;
  margin-top: 10px;
  font-size: 14px;
  padding: 5px;
}

.photo-counter {
  font-weight: bold;
  margin-bottom: 8px;
}

.result-info {
  margin-top: 5px;
  font-size: 13px;
  line-height: 1.4;
  color: #444;
}

.result-info div {
  margin: 2px 0;
}

.answer-placeholder {
  color: #999;
  font-style: italic;
}

.actual-result div {
  margin: 2px 0;
}

/* ==================== */
/* Стили временной шкалы */
/* ==================== */
.timeline-ruler {
  position: relative;
  margin: 100px 0 1px;
  height: 120px;
  cursor: pointer;
}

.ruler-track {
  height: 20px;
  background: linear-gradient(to right, #8B4513, #A0522D);
  border-radius: 3px;
  position: relative;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);
  margin-top: 80px;
}

.range-highlight {
  position: absolute;
  height: 100%;
  top: 0;
  z-index: 1;
  transition: all 0.3s ease;
}

/* Лупа с годом */
.magnifier {
  position: absolute;
  top: -30px;
  transform: translateX(-50%);
  z-index: 4;
  cursor: grab;
  user-select: none;
}

.magnifier:active {
  cursor: grabbing;
}

.magnifier-glass {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 3px solid #5D2906;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.9);
  position: relative;
  color: white;
}

.magnifier-glass:before {
  content: '';
  position: absolute;
  width: 70%;
  height: 70%;
  border-radius: 50%;
  border: 2px solid rgba(93, 41, 6, 0.3);
}

.magnifier-handle {
  width: 4px;
  height: 60px;
  background: #5D2906;
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
}

.magnifier-handle:after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 15px;
  height: 15px;
  background: #5D2906;
  border-radius: 50%;
}

/* Деления на шкале */
.ruler-mark {
  position: absolute;
  transform: translateX(-50%);
  bottom: 100%;
  z-index: 2;
}

.decade-mark {  /* Каждые 10 лет */
  height: 40px;
  width: 3px;
  background: #000;
}

.half-decade-mark {  /* Каждые 5 лет */
  height: 30px;
  width: 2px;
  background: #444;
}

.year-mark {  /* Остальные года */
  height: 20px;
  width: 1px;
  background: #666;
}

.first-mark, .last-mark {  /* Первое и последнее деление */
  height: 70px;
  width: 4px;
  background: #000;
  margin-bottom: -20px;
}

/* Подписи годов */
.year-label {
  position: absolute;
  top: -90px;
  transform: translateX(-50%);
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  z-index: 2;
}

.decade-label {
  font-size: 14px;
  font-weight: bold;
  top: -60px;
}

.half-decade-label {
  font-size: 12px;
  top: -45px;
}

.first-label, .last-label {
  font-size: 16px;
  font-weight: bold;
  top: -75px;
}

/* Текущий год в лупе */
.current-year {
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bolder;
  font-size: 20px;
  min-width: 70px;
  text-align: center;
  margin-bottom: -1px;
}

/* ==================== */
/* Управление игрой     */
/* ==================== */
.submit-btn {
  display: block;
  margin: 4px auto 20px;
  padding: 12px 30px;
  background: #5D2906;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover {
  background: #8B4513;
}

.submit-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.score-display {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #5D2906;
  margin-top: 20px;
}

/* ==================== */
/* Экран результатов    */
/* ==================== */
.results-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Courier New', monospace;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.final-score {
  font-size: 24px;
  margin: 20px 0;
  color: #5D2906;
  font-weight: bold;
}

.photo-results {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 30px;
}

.result-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.result-polaroid {
  display: flex;
  gap: 20px;
  align-items: center;
  text-align: left;
}

.result-polaroid img {
  max-width: 200px;
  border: 1px solid #ddd;
}

.photo-description {
  font-style: italic;
  font-size: 15px;
  margin-top: 10px;
  color: #000000;
  line-height: 14px;
}

.play-again-btn {
  margin-top: 30px;
  padding: 12px 30px;
  background: #5D2906;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s;
}

.play-again-btn:hover {
  background: #8B4513;
}

/* ==================== */
/* Адаптация для мобильных */
/* ==================== */
@media (max-width: 768px) {
  .game-container{
    padding: 0;
  }
  .polaroid {
    margin-bottom: -20px;
    padding: 5px 5px;
  }
  .polaroid::before {
  display: none;
  }

  .polaroid-label {
    font-size: 12px;
    padding: 3px;
  }

  .photo {
    max-height: 300px;
  }
  .result-info, .actual-result {
    font-size: 11px;
  }



  .timeline-ruler {
    height: 40px;
  }

  .ruler-track {
    margin-top: 60px;
  }

  .magnifier-glass {
    width: 60px;
    height: 60px;
    top: 10px;
  }

  .magnifier-handle {
    width: 4px;
    height: 6px;
    background: #5D2906;
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
  }

  .magnifier-handle:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 15px;
    height: 5px;
    background: #5D2906;
    border-radius: 50%;
  }

  .current-year {
    font-size: 16px;
    padding: 4px 8px;
  }

  .year-label {
    font-size: 1px;
    top: -70px;
  }

  .decade-label {
    font-size: 3px;
    top: -50px;
  }

  .first-label, .last-label {
    font-size: 14px;
    top: -65px;
  }
  .submit-btn {
    display: block;
    margin: 20px auto 20px;
    padding: 6px 10px;
    background: #5D2906;

    font-size: 15px;

  }
  .result-polaroid {
    display: flex;
    gap: 10px;
    align-items: center;
    text-align: left;
  }
  .result-polaroid img {
    width: 100px;
  }
.h2 {
  font-size: 20px;
}
}
</style>
}
