<template>
  <!-- ==================== -->
  <!-- Основной экран игры -->
  <!-- ==================== -->
  <img class="backgroundImg" :src="backgroundImage" alt="Фон игры">

  <div class="game-container" v-if="!gameFinished">
    <div class="detective-board">
      <!-- Polaroid-стиль для фотографии -->
      <div class="polaroid">
        <div class="photo-wrapper">
          <!-- 🔥 ПЛЕЙСХОЛДЕР ВО ВРЕМЯ ЗАГРУЗКИ -->
          <div v-if="isPhotoLoading" class="photo-placeholder">
            <div class="loader-spinner"></div>
            <p class="loader-text">{{ currentLoadingPhrase }}</p>
          </div>

          <!-- Фото -->
          <img
            v-show="!isPhotoLoading && !photoLoadError"
            :src="currentPhoto.picture"
            alt="Историческая фотография"
            class="photo"
            @load="handlePhotoLoad"
            @error="handlePhotoError"
          >

          <!-- 🔥 ОШИБКА ЗАГРУЗКИ -->
          <div v-if="photoLoadError" class="photo-error">
            <span>❌</span>
            <p>Не удалось загрузить фото</p>
          </div>

          <!-- Затемнение и описание поверх фото -->
          <div v-if="isAnswerChecked" class="photo-overlay" :class="{ 'dimmed': isDescriptionDimmed }" @click="toggleDescriptionDim">
            <div class="photo-description-overlay">
              <p class="description-text" :class="{ 'dimmed-text': isDescriptionDimmed }">{{ currentPhoto.description || 'Описание отсутствует' }}</p>
            </div>
          </div>
        </div>
        <div class="polaroid-label">
          <div class="photo-counter">Архивное фото №{{ currentRound }}/5</div>
          <div class="result-info">
            <div>{{ isAnswerChecked ? 'Вы ответили : ' + lastGuess : 'Двигайте указатель и читайте вслух:' }}</div>
            <div class="text-bold highlight">{{ isAnswerChecked ? 'Правильный ответ : ' + currentPhoto.date : currentHint }}</div>            <div>{{ isAnswerChecked ? 'Разница - Difference : ' + Math.abs(lastGuess - parseInt(currentPhoto.date)) + ' лет' : '_________' }}</div>
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

        <!-- ГОД СЛОВАМИ ПОД ЛУПОЙ -->
        <div class="year-words">{{ yearToWords(selectedYear) }}</div>

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
      <div class="controls-row">
        <button
          class="submit-btn"
          :style="{
    backgroundColor: isAnswerChecked ? buttonColor : '#88b9e3',
    color: isAnswerChecked ? buttonTextColor : '#ffffff'
  }"
          @click="isAnswerChecked ? nextPhoto() : checkAnswer()"
          :disabled="isDragging || isPhotoLoading"
        >
          {{ isAnswerChecked ? 'Next Picture (Enter)' : 'Проверить (Enter)' }}
        </button>

        <!-- Кнопка возврата к обычной игре (если перешли по ссылке с photo) -->
<!--        <button v-if="startFromPhotoId" class="back-btn" @click="resetToNormalGame">-->
<!--          🔄 ВСЕ ФОТО-->
<!--        </button>-->
      </div>

      <!-- Отображение текущего счета -->
<!--      <div class="score-display">-->
<!--        Текущий счет: {{ currentScore }}-->
<!--      </div>-->
    </div>
  </div>

  <!-- ==================== -->
  <!-- Экран результатов -->
  <!-- ==================== -->
  <div class="results-container" v-if="gameFinished">
    <h2 class="h2">You are a great detective!</h2>
    <div class="final-score">Ваш итоговый score: {{ currentScore }}</div>
    <div class="final-score">Какую фотографию ещё вы бы хотели добавить в этот список? Поделитесь с Винсентиком!</div>

    <div class="photo-results">
      <div v-for="(result, index) in gameResults" :key="index" class="result-item">
        <div class="result-polaroid">
          <img :src="result.photo.picture" :alt="'Фото ' + (index + 1)">
          <div class="result-info">
            <p><strong>Ваш ответ:</strong> {{ result.guess }} год</p>
            <p><strong>Правильный ответ:</strong> {{ result.photo.date }} год</p>
            <p><strong>Очков получено:</strong> +{{ result.points }}</p>
            <div class="description-wrapper">
              <p class="photo-description"
                 :class="{ 'blurred': !revealedDescriptions[index] }"
                 @click="toggleDescriptionReveal(index)">
                {{ result.photo.description || 'Описание отсутствует' }}
              </p>
              <span class="click-hint" v-if="!revealedDescriptions[index]">👆 кликни, чтобы прочитать</span>
            </div>
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
import { useRoute, useRouter } from 'vue-router';
import { getShuffledData, getAllData } from '../dataForGames/yearGuesserData';

// ==================== //
// Router
// ==================== //
const route = useRoute();
const router = useRouter();
const startFromPhotoId = route.params.id ? parseInt(route.params.id) : null;

// ==================== //
// Состояние игры
// ==================== //
const selectedYear = ref(1965);
const sliderPosition = ref('50%');
const currentRound = ref(1);
const currentScore = ref(0);
const gameFinished = ref(false);
const gameResults = ref([]);
const rulerTrack = ref(null);
const isDragging = ref(false);
const isAnswerChecked = ref(false);
const lastGuess = ref(0);
const lastPoints = ref(0);
const correctYear = ref(0);
const showRangeHighlight = ref(false);
const backgroundImage = new URL("../assets/images/background1.jpg", import.meta.url).href;

const isPhotoLoading = ref(false);
const photoLoadError = ref(false);

const isDescriptionDimmed = ref(false);
const revealedDescriptions = ref([]);

const isFirstVisit = ref(true);


// ==================== //
// Фразы для загрузки
// ==================== //
const loadingPhrases = [
  '🕵️ Ищем фотографию специально для вас...',
  '📸 Достаём фото из архивов...',
  '🔍 Сканируем исторические хроники...',
  '📖 Перелистываем страницы истории...',
  '🕰️ Переносимся в прошлое...',
  '🧐 Увеличиваем детали...',
  '✨ Почти готово...',
];

const currentLoadingPhrase = ref(loadingPhrases[0]);
const loadingStartTime = ref(0);
const MIN_LOADING_TIME = 2000; // 2 секунды
// ==================== //
// Смена фразы загрузки
// ==================== //
const updateLoadingPhrase = () => {
  const randomIndex = Math.floor(Math.random() * loadingPhrases.length);
  currentLoadingPhrase.value = loadingPhrases[randomIndex];
};
// ==================== //
// Обработка загрузки фото
// ==================== //
const handlePhotoLoad = () => {
  const elapsed = Date.now() - loadingStartTime.value;
  const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

  // 🔥 ЖДЁМ МИНИМУМ 2 СЕКУНДЫ
  setTimeout(() => {
    isPhotoLoading.value = false;
    photoLoadError.value = false;

    const photoUrl = currentPhoto.value.picture;
    const fileName = photoUrl.substring(photoUrl.lastIndexOf('/') + 1);
    console.log(`📸 Photo loaded: ${fileName} (Round ${currentRound.value}/5)`);
  }, remaining);
};

const handlePhotoError = () => {
  isPhotoLoading.value = false;
  photoLoadError.value = true;
};

// ==================== //
// Преобразование года в текст
// ==================== //
const yearToWords = (year) => {
  const num = parseInt(year);
  if (isNaN(num) || num < 1900 || num > 2030) return String(year);

  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  // 1900-1999 — "nineteen ninety"
  if (num >= 1900 && num < 2000) {
    const rest = num - 1900;
    if (rest === 0) return 'nineteen hundred';
    if (rest < 20) return 'nineteen ' + ones[rest];
    const ten = Math.floor(rest / 10);
    const one = rest % 10;
    return 'nineteen ' + tens[ten] + (one > 0 ? '-' + ones[one] : '');
  }

  // 2000-2009 — "two thousand and X"
  if (num >= 2000 && num < 2010) {
    const rest = num - 2000;
    if (rest === 0) return 'two thousand';
    return 'two thousand and ' + ones[rest];
  }

  // 2010-2099 — "twenty X"
  if (num >= 2010 && num < 2100) {
    const rest = num - 2000;
    // 🔥 ДЛЯ 2010-2019 ИСПОЛЬЗУЕМ ones
    if (rest < 20) {
      return 'twenty ' + ones[rest];
    }
    const ten = Math.floor(rest / 10);
    const one = rest % 10;
    return 'twenty ' + tens[ten] + (one > 0 ? '-' + ones[one] : '');
  }

  return String(year);
};

// ==================== //
// Анимация лупы при первом посещении
// ==================== //
const animateMagnifier = () => {
  // Стартуем с середины
  selectedYear.value = 1965;
  sliderPosition.value = '50%';

  // Анимация: влево на 30 лет → вправо → обратно в середину
  const steps = [
    { year: 1935, duration: 900, easing: 'ease-out' },    // влево на 30 лет
    { year: 1995, duration: 700, easing: 'ease-in-out' },  // вправо на 60 лет (быстрее)
    { year: 1965, duration: 300, easing: 'ease-in' }       // обратно в середину
  ];

  let currentStep = 0;

  const animateStep = () => {
    if (currentStep >= steps.length || !isFirstVisit.value) {
      isFirstVisit.value = false;
      return;
    }

    const step = steps[currentStep];
    const startYear = selectedYear.value;
    const endYear = step.year;
    const startTime = Date.now();
    const duration = step.duration;

    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Применяем easing
      let easedProgress;
      switch (step.easing) {
        case 'ease-out':
          easedProgress = 1 - Math.pow(1 - progress, 3);
          break;
        case 'ease-in':
          easedProgress = Math.pow(progress, 3);
          break;
        default:
          easedProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      }

      const currentYear = startYear + (endYear - startYear) * easedProgress;
      selectedYear.value = Math.round(currentYear);
      const percentage = (selectedYear.value - 1900) / 130;
      sliderPosition.value = `${percentage * 100}%`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        selectedYear.value = endYear;
        const finalPercentage = (selectedYear.value - 1900) / 130;
        sliderPosition.value = `${finalPercentage * 100}%`;
        currentStep++;
        // Небольшая пауза между шагами
        setTimeout(animateStep, 150);
      }
    };

    update();
  };

  // Запускаем анимацию
  setTimeout(animateStep, 300);
};
// ==================== //
// Цвет кнопки в зависимости от разницы
// ==================== //
const buttonColor = computed(() => {
  if (!isAnswerChecked.value) return '#5D2906'; // Стандартный коричневый

  const diff = Math.abs(lastGuess.value - parseInt(currentPhoto.value.date));
  if (diff <= 2) return '#4CAF50';      // Зеленый
  else if (diff <= 5) return '#8BC34A'; // Светло-зеленый
  else if (diff <= 10) return '#FFEB3B';// Желтый
  else if (diff <= 20) return '#FF9800';// Оранжевый
  else return '#F44336';                // Красный
});
const buttonTextColor = computed(() => {
  // Только для стандартной коричневой кнопки — белый текст
  if (!isAnswerChecked.value) return '#ffffff';
  // Для всех цветных вариантов — чёрный текст
  return '#2d3436';
});
// ==================== //
// Фразы-подсказки для разных раундов
// ==================== //
const hintPhrases = [
  'It looks like the year .... because...',
  'I\'d suggest it is the year .... because...',
  'This photo was probably taken in .... because...',
  'I think this is from the year .... because...',
  'I guess it is the year .... because...',
  'This could be the year .... because...',
  'I\'m not sure, maybe the year is .... because...',
  'This gives me the vibe of .... because...',
  'It seems like the year .... because...',
  'I\'m going to choose the year .... because...',

];

// Перемешанные фразы (без первой)
const shuffledHints = ref([]);

// Функция для перемешивания фраз
const shuffleHints = () => {
  const shuffled = [...hintPhrases];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Текущая фраза-подсказка
const currentHint = computed(() => {
  // Первый раунд — всегда первая фраза
  if (currentRound.value === 1) {
    return 'It looks like the year .... because...';
  }
  // Для остальных раундов — из перемешанного списка
  const index = (currentRound.value - 2) % shuffledHints.value.length;
  return shuffledHints.value[index] || 'It looks like the year .... because...';
});
// Обновляем перемешанные фразы при старте игры
const updateShuffledHints = () => {
  shuffledHints.value = shuffleHints();
};
// ==================== //
// Данные
// ==================== //
const allPhotos = ref(getAllData());

// 🔥 Формируем массив из 5 фотографий для игры
const gamePhotos = computed(() => {
  // Если есть стартовый ID
  if (startFromPhotoId) {
    const startIndex = allPhotos.value.findIndex(p => p.id === startFromPhotoId);
    if (startIndex !== -1) {
      const remaining = allPhotos.value.filter((_, i) => i !== startIndex);
      const shuffledRemaining = [...remaining].sort(() => Math.random() - 0.5);
      const selected = shuffledRemaining.slice(0, 4);
      return [allPhotos.value[startIndex], ...selected];
    }
  }
  // Обычная игра — первые 5 из перемешанного массива
  return allPhotos.value.slice(0, 5);
});

// ==================== //
// Вычисляемые свойства
// ==================== //
const allYears = computed(() => Array.from({length: 131}, (_, i) => 1900 + i));

const labeledMarks = computed(() =>
  allYears.value.filter(year => year % 5 === 0 || year === 1900 || year === 2030)
);

const rangeHighlightStyle = computed(() => {
  if (!isAnswerChecked.value) return {};

  const correct = correctYear.value;
  const guessed = lastGuess.value;
  const left = Math.min(correct, guessed);
  const right = Math.max(correct, guessed);
  const leftPos = ((left - 1900) / 130) * 100;
  const rightPos = ((right - 1900) / 130) * 100;
  const width = rightPos - leftPos;

  const diff = Math.abs(correct - guessed);
  let color;
  if (diff <= 2) color = '#4CAF50';
  else if (diff <= 5) color = '#8BC34A';
  else if (diff <= 10) color = '#FFEB3B';
  else if (diff <= 20) color = '#FF9800';
  else color = '#F44336';

  return {
    left: `${leftPos}%`,
    width: `${width}%`,
    backgroundColor: color,
    opacity: 0.7
  };
});

const currentPhoto = computed(() => {
  return gamePhotos.value[currentRound.value - 1];
});

// ==================== //
// Методы игры
// ==================== //
const updatePosition = (clientX) => {
  const trackRect = rulerTrack.value.getBoundingClientRect();
  let percentage = (clientX - trackRect.left) / trackRect.width;
  percentage = Math.max(0, Math.min(1, percentage));
  selectedYear.value = Math.round(1900 + percentage * 130);
  sliderPosition.value = `${percentage * 100}%`;
};

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

const handleTrackClick = (e) => updatePosition(e.clientX);

const calculatePoints = (correctYear, guessedYear) => {
  const diff = Math.abs(correctYear - guessedYear);
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

const checkAnswer = () => {
  isPhotoLoading.value = false; // 🔥 СКРЫВАЕМ ПЛЕЙСХОЛДЕР

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
  isDescriptionDimmed.value = false;
};

const toggleDescriptionDim = () => {
  isDescriptionDimmed.value = !isDescriptionDimmed.value;
};

const toggleDescriptionReveal = (index) => {
  revealedDescriptions.value[index] = !revealedDescriptions.value[index];
};

const nextPhoto = () => {
  if (currentRound.value < 5) {
    currentRound.value++;

    // 🔥 ОБНОВЛЯЕМ ФРАЗУ И ЗАПОМИНАЕМ ВРЕМЯ
    updateLoadingPhrase();
    loadingStartTime.value = Date.now();
    isPhotoLoading.value = true; // 🔥 ПОКАЗЫВАЕМ ЗАГРУЗКУ

    selectedYear.value = 1965;
    sliderPosition.value = '50%';
    isAnswerChecked.value = false;
    showRangeHighlight.value = false;
    isDescriptionDimmed.value = false;
  } else {
    gameFinished.value = true;
    revealedDescriptions.value = gameResults.value.map(() => false);
  }
};

const resetToNormalGame = () => {
  // Убираем параметр photo из URL и перезагружаем страницу
  router.push('/yearGuesser');
  // Небольшая задержка для обновления
  setTimeout(() => {
    window.location.reload();
  }, 100);
};

const handleKeyPress = (e) => {
  // 🔥 ЛОГ ДЛЯ ОТЛАДКИ
  console.log('🔑 Key pressed:', e.key);
  // 🔥 УПРАВЛЕНИЕ СТРЕЛКАМИ ВЛЕВО/ВПРАВО
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();

    // Shift + стрелка = шаг 5 лет
    const step = e.shiftKey ? 5 : 1;

    if (e.key === 'ArrowLeft') {
      selectedYear.value = Math.max(1900, selectedYear.value - step);
    } else {
      selectedYear.value = Math.min(2030, selectedYear.value + step);
    }

    // Обновляем позицию ползунка
    const percentage = (selectedYear.value - 1900) / 130;
    sliderPosition.value = `${percentage * 100}%`;
    return;
  }

  // 🔥 ENTER — проверка или следующее фото
  if (e.key === 'Enter') {
    isAnswerChecked.value ? nextPhoto() : checkAnswer();
  }
};

const resetGame = () => {
  currentRound.value = 1;
  currentScore.value = 0;
  gameFinished.value = false;
  gameResults.value = [];
  selectedYear.value = 1965;
  sliderPosition.value = '50%';
  isAnswerChecked.value = false;
  showRangeHighlight.value = false;
  isDescriptionDimmed.value = false;
  revealedDescriptions.value = [];

  // 🔥 ПЕРЕМЕШИВАЕМ ВСЕ ФОТО
  const allData = getAllData();
  allPhotos.value = allData.sort(() => Math.random() - 0.5);

  updateShuffledHints();
  updateLoadingPhrase();
  loadingStartTime.value = Date.now();
  isPhotoLoading.value = true; // 🔥 ПОКАЗЫВАЕМ ЗАГРУЗКУ
  photoLoadError.value = false;
};

const preventScroll = (e) => {
  if (isDragging.value) {
    e.preventDefault();
  }
};

// ==================== //
// Хуки жизненного цикла
// ==================== //
onMounted(() => {
  // 🔥 ПЕРЕМЕШИВАЕМ ВСЕ ФОТО ПРИ ЗАГРУЗКЕ
  const allData = getAllData();
  allPhotos.value = allData.sort(() => Math.random() - 0.5);


  updateLoadingPhrase();
  loadingStartTime.value = Date.now();
  isPhotoLoading.value = true; // 🔥 ПОКАЗЫВАЕМ ЗАГРУЗКУ


  updateShuffledHints();

  window.addEventListener('keydown', handleKeyPress);
  rulerTrack.value.addEventListener('click', handleTrackClick);
  updatePosition(window.innerWidth / 2);
  window.addEventListener('touchmove', preventScroll, { passive: false });


  // 🔥 ЗАПУСКАЕМ АНИМАЦИЮ ЛУПЫ
  animateMagnifier();
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress); // ✅
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
  filter: brightness(0.7) blur(4px);
  transform: scale(1.02);
}

.game-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Courier New', monospace;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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

/* ==================== */
/* Обёртка для фото с оверлеем */
/* ==================== */
.photo-wrapper {
  position: relative;
  display: inline-block;
  max-width: 100%;
  display: flex; /* 🔥 МЕНЯЕМ НА FLEX */
  justify-content: center; /* 🔥 ЦЕНТРИРУЕМ ПО ГОРИЗОНТАЛИ */
  align-items: center; /* 🔥 ЦЕНТРИРУЕМ ПО ВЕРТИКАЛИ */
}

.photo {
  width: auto;
  max-height: 400px;
  max-width: 100%;
  display: block;
  border: 1px solid #ddd;
  object-fit: contain; /* 🔥 СОХРАНЯЕМ ПРОПОРЦИИ */

}

/* ==================== */
/* Оверлей с описанием поверх фото */
/* ==================== */
.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  opacity: 0;
  animation: fadeInOverlay 0.5s ease forwards;
  cursor: pointer;
  transition: background 0.3s ease;
}

.photo-description-overlay {
  max-width: 90%;
  max-height: 85%;
  overflow-y: auto;
  box-sizing: border-box;
  scroll-behavior: smooth;
}

.photo-description-overlay::-webkit-scrollbar {
  width: 4px;
}

.photo-description-overlay::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.photo-description-overlay::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.photo-description-overlay::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

@keyframes fadeInOverlay {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.photo-overlay.dimmed {
  background: rgba(0, 0, 0, 0.05) !important;
}

.photo-overlay.dimmed::after,
.photo-overlay.dimmed:after {
  display: none !important;
  content: none !important;
  background: transparent !important;
  opacity: 0 !important;
}

.description-text {
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  line-height: 1.6;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  margin: 0;
  font-family: 'Courier New', monospace;
  transition: all 0.3s ease;
  word-wrap: break-word;
}

.description-text.dimmed-text {
  color: rgba(255, 255, 255, 0.15);
  text-shadow: none;
}

.description-text.dimmed-text::after,
.description-text.dimmed-text:after {
  display: none !important;
  content: none !important;
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

/* ============================================ */
/* 🔥 ВРЕМЕННАЯ ШКАЛА — ИСПРАВЛЕННАЯ ВЕРСИЯ */
/* ============================================ */
.timeline-ruler {
  position: relative;
  height: 100px; /* 🔥 ВЫСОТА ДЛЯ ЛУПЫ + ТЕКСТА */
  cursor: pointer;
}

/* ==================== */
/* ГОД СЛОВАМИ ПОД ЛУПОЙ */
/* ==================== */
.year-words {
  position: absolute;
  bottom: 0; /* 🔥 ПРИЖИМАЕМ К НИЖНЕЙ ЧАСТИ КОНТЕЙНЕРА */
  left: 0;
  right: 0;
  text-align: center;
  font-size: 14px;
  font-family: 'Courier New', monospace;
  color: #5D2906;
  letter-spacing: 1px;
  font-weight: 600;
  min-height: 24px;
  transition: all 0.2s ease;
  padding: 0 10px;
  pointer-events: none; /* 🔥 ЧТОБЫ НЕ МЕШАЛ КЛИКАМ ПО ШКАЛЕ */
}

.ruler-track {
  height: 20px;
  background: linear-gradient(to right, #8B4513, #A0522D);
  border-radius: 3px;
  position: relative;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);
  margin-top: 75px; /* 🔥 РАССТОЯНИЕ ОТ ЛУПЫ ДО ШКАЛЫ */
}

.range-highlight {
  position: absolute;
  height: 100%;
  top: 0;
  z-index: 1;
  transition: all 0.3s ease;
}

.magnifier {
  position: absolute;
  top: -30px; /* 🔥 ЛУПА НА ШКАЛЕ */
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
  height: 20px; /* 🔥 УМЕНЬШИЛ ДЛИНУ РУЧКИ */
  background: #5D2906;
  position: absolute;
  bottom: -20px;
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

/* ============================================ */
/* 🔥 ДЕЛЕНИЯ НА ШКАЛЕ */
/* ============================================ */
.ruler-mark {
  position: absolute;
  transform: translateX(-50%);
  bottom: 100%;
  z-index: 2;
}

.decade-mark {
  height: 40px;
  width: 3px;
  background: #000;
}

.half-decade-mark {
  height: 30px;
  width: 2px;
  background: #444;
}

.year-mark {
  height: 20px;
  width: 1px;
  background: #666;
}

.first-mark, .last-mark {
  height: 70px;
  width: 4px;
  background: #000;
  margin-bottom: -20px;
}

/* ============================================ */
/* 🔥 ПОДПИСИ ГОДОВ */
/* ============================================ */
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

/* ==================== */
/* Управление игрой     */
/* ==================== */
.controls-row {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.submit-btn {
  display: block;
  margin: 4px auto 20px;
  padding: 12px 30px;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.5s ease;
}

.submit-btn:hover {
  filter: brightness(0.85);
}

.submit-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.back-btn {
  display: block;
  margin: 4px auto 20px;
  padding: 12px 30px;
  background: #2d3436;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s;
}

.back-btn:hover {
  background: #636e72;
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
  line-height: 18px;
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
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 4px;
  position: relative;
}

.photo-description.blurred {
  filter: blur(5px);
  user-select: none;
  background: rgba(0, 0, 0, 0.03);
  padding: 4px 8px;
  border-radius: 4px;
}

.photo-description.blurred:hover {
  background: rgba(0, 0, 0, 0.06);
}

.photo-description:not(.blurred) {
  filter: blur(0);
}

.highlight {
  background-color: rgba(52, 152, 219, 0.25);
  padding: 2px 6px;
  border-radius: 4px;
}

.click-hint {
  font-size: 15px;
  color: #999;
  display: block;
  margin-top: 4px;
  font-style: normal;
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

.h2 {
  font-size: 50px;
  color: palevioletred;
  font-family: Special_f1;
}

/* ==================== */
/* Плейсхолдер загрузки фото */
/* ==================== */
.photo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 500px;
  width: 500px;
  background: linear-gradient(135deg, #2d3436, #636e72);
  border-radius: 4px;
  padding: 40px;
  box-sizing: border-box;
}

.loader-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #fdcb6e;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loader-text {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Courier New', monospace;
  font-size: 16px;
  text-align: center;
  animation: pulseText 1.5s ease-in-out infinite;
}

@keyframes pulseText {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* ==================== */
/* Ошибка загрузки фото */
/* ==================== */
.photo-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  max-height: 500px;
  width: 100%;
  background: #2d3436;
  border-radius: 4px;
  padding: 40px;
  box-sizing: border-box;
  color: #ff6b6b;
  font-family: 'Courier New', monospace;
  font-size: 18px;
}

.photo-error span {
  font-size: 48px;
  margin-bottom: 12px;
}

/* ==================== */
/* Адаптация для мобильных */
/* ==================== */
@media (max-width: 768px) {
  .game-container {
    padding: 0;
  }
  .polaroid {
    padding: 5px 5px;
  }
  .polaroid::before {
    display: none;
  }

  .polaroid-label {
    font-size: 12px;
    padding: 3px;
  }

  .photo-wrapper {
    display: flex;
    justify-content: center; /* 🔥 ЦЕНТРИРУЕМ ФОТО ВНУТРИ ОБЁРТКИ */
  }
  .photo {
    max-height: 300px;

  }
  .result-info, .actual-result {
    font-size: 11px;
  }
  .final-score {
    font-size: 18px;

  }

  .photo-placeholder {

    height: 270px;
    width: 270px;

  }

  .photo-description {

    line-height: 16px;

  }
  .description-text {
    font-size: 14px;
    line-height: 14px;
  }

  .timeline-ruler {
    height: 75px;
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
    padding: 6px 10px;
    background: #5D2906;
    font-size: 15px;
  }
  .back-btn {
    display: block;
    margin: 20px auto 20px;
    padding: 6px 10px;
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
