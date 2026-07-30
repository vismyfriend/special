<template>
  <div v-if="isVisible" class="preloader-overlay">

    <!-- ЛОГОТИП С КУБИКАМИ -->
    <div class="logo-loader" :class="{ 'fade-out': isFadingOut }">
      <!-- Верхняя строка: 0 1 1 0 0 0 0 (кубики на позициях 2 и 3) -->
      <div class="cube-row row-2">
        <span v-for="n in 7" :key="'r1-'+n"
              class="cube"
              :class="{
                'cube-empty': ![2, 3].includes(n)
              }"
              :style="{
                animationDelay: (n * 0.08 + 0.6) + 's',
                background: `linear-gradient(135deg, ${capColors.top}, ${lightenColor(capColors.top, 30)})`,
                boxShadow: `0 0 10px ${capColors.top}33`
              }">
        </span>
      </div>

      <!-- Средняя строка: 1 1 1 1 0 0 0 (кубики на позициях 1-4) -->
      <div class="cube-row row-4">
        <span v-for="n in 7" :key="'r2-'+n"
              class="cube"
              :class="{
                'cube-empty': ![1, 2, 3, 4].includes(n)
              }"
              :style="{
                animationDelay: (n * 0.08 + 0.3) + 's',
                background: `linear-gradient(135deg, ${capColors.top}, ${lightenColor(capColors.top, 30)})`,
                boxShadow: `0 0 10px ${capColors.top}33`
              }">
        </span>
      </div>

      <!-- Нижняя строка: 1 1 1 1 1 1 1 (все кубики) -->
      <div class="cube-row row-7">
        <span v-for="n in 7" :key="'r3-'+n"
              class="cube"
              :style="{
                animationDelay: (n * 0.08) + 's',
                background: `linear-gradient(135deg, ${capColors.bottom}, ${lightenColor(capColors.bottom, 30)})`,
                boxShadow: `0 0 10px ${capColors.bottom}4D`
              }">
        </span>
      </div>

      <!-- Отдельная строка для букв под кубиками -->
      <div class="letter-row">
        <span v-for="n in 7" :key="'l-'+n"
              class="letter"
              :class="{ 'letter-visible': showLetters }"
              :style="{
                animationDelay: (n * 0.08 + 2.2) + 's'
              }">
          {{ getLetter(n, currentWord) }}
        </span>
      </div>
    </div>

    <!-- ФРАЗЫ ВЫНЕСЕНЫ ЗА ПРЕДЕЛЫ LOGO-LOADER -->
    <div class="phrases-wrapper">
      <TransitionGroup
        name="phrase"
        tag="div"
        class="phrase-container"
        :css="false"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
      >
        <div
          v-if="showPhrase"
          :key="currentPhrase"
          class="phrase"
        >
          {{ currentPhrase }}
        </div>
      </TransitionGroup>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// ============================================================
//  НАСТРОЙКИ ВРЕМЕНИ ПРЕЛОАДЕРА (меняй здесь!)
// ============================================================
const TIMING = {
  CUBE_FALL_DURATION: 0.95,
  LETTERS_DELAY: 0.7,
  FADE_OUT_DELAY: 3.0,
  FADE_DURATION: 0.8,
  CYCLES_BEFORE_HIDE: 2,
  INITIAL_DELAY: 0.3,
  CYCLE_PAUSE: 0.3,
  PHRASE_INTERVAL: 0.6 // Интервал смены фраз (в секундах)
};
// ============================================================

// Слова для каждого цикла
const WORDS = ['you `re', 'special', 'loading'];

// Фразы для нижнего блока
const PHRASES = [
  'загружаю слова',
  'загружаю произношение',
  'выбираю кепку',
  'подключаю аудио',
  'вспоминаем прошлый урок',
  'наводим порядок',
  'проверяю домашку',
  'вспоминаем времена',
  'приветики от Винсентика',
  'настраиваем звук',
  'убираем посторонние шумы',
  'тренируем / про нан си эй шэн /',
  '@ohpolich is awesome ',
  'fallout is the best',
];

const emit = defineEmits(['loaded']);

// ============================================================
//  СОСТОЯНИЕ ПРЕЛОАДЕРА
// ============================================================
const isVisible = ref(true);
const showLetters = ref(false);
const isFadingOut = ref(false);
const currentWord = ref('special');
const cycleCount = ref(0);

// ============================================================
//  СОСТОЯНИЕ ФРАЗ (ПОЛНОСТЬЮ НЕЗАВИСИМО)
// ============================================================
const currentPhrase = ref(PHRASES[0]);
const showPhrase = ref(false);
let phraseInterval = null;
let remainingPhrases = [];
let lastPhrase = null;

// Функция для перемешивания массива
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Инициализация очереди фраз
const initPhraseQueue = () => {
  let shuffled = shuffleArray(PHRASES);

  // Если есть последняя фраза, убеждаемся что она не будет первой
  if (lastPhrase && shuffled[0] === lastPhrase) {
    const swapIndex = Math.floor(Math.random() * (shuffled.length - 1)) + 1;
    [shuffled[0], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[0]];
    console.log(`🔄 Защита от повтора: "${lastPhrase}" перемещена`);
  }

  remainingPhrases = shuffled;
  console.log('🔄 Новая очередь фраз:', remainingPhrases);
};

// Получение следующей фразы с гарантией уникальности в текущем цикле
const getNextPhrase = () => {
  // Если очередь пуста - создаем новую
  if (remainingPhrases.length === 0) {
    initPhraseQueue();
    console.log('🔄 Новый цикл фраз начат');
  }

  // Берем следующую фразу
  const nextPhrase = remainingPhrases.shift();
  lastPhrase = nextPhrase;

  return nextPhrase;
};

// ============================================================
//  УПРАВЛЕНИЕ ФРАЗАМИ
// ============================================================
const startPhraseRotation = () => {
  if (phraseInterval) {
    clearInterval(phraseInterval);
    phraseInterval = null;
  }

  // Сбрасываем при первом запуске
  lastPhrase = null;
  initPhraseQueue();

  // Показываем первую фразу
  currentPhrase.value = getNextPhrase();
  showPhrase.value = true;
  console.log(`📝 Фраза: "${currentPhrase.value}" (осталось: ${remainingPhrases.length})`);

  // Запускаем ротацию
  phraseInterval = setInterval(() => {
    const nextPhrase = getNextPhrase();
    currentPhrase.value = nextPhrase;

    showPhrase.value = false;
    setTimeout(() => {
      showPhrase.value = true;
    }, 50);

    console.log(`📝 Фраза: "${nextPhrase}" (осталось: ${remainingPhrases.length})`);
  }, TIMING.PHRASE_INTERVAL * 1000);
};

const stopPhraseRotation = () => {
  if (phraseInterval) {
    clearInterval(phraseInterval);
    phraseInterval = null;
    console.log('⏹ Ротация фраз остановлена');
  }
};

// Анимации для TransitionGroup
const onBeforeEnter = (el) => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(15px) scale(0.95)';
};

const onEnter = (el, done) => {
  el.offsetHeight;
  el.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
  el.style.opacity = 1;
  el.style.transform = 'translateY(0) scale(1)';
  setTimeout(done, 400);
};

const onLeave = (el, done) => {
  el.style.transition = 'all 0.3s ease-in';
  el.style.opacity = 0;
  el.style.transform = 'translateY(-15px) scale(0.95)';
  setTimeout(done, 300);
};

// ============================================================
//  ЦВЕТА КЕПКИ
// ============================================================
const getRandomColor = () => {
  const colors = [
    '#EE4040', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0',
    '#00BCD4', '#FF5722', '#E91E63', '#3F51B5', '#009688',
    '#ffffff', '#fffb00',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const lightenColor = (hex, percent) => {
  let r = parseInt(hex.slice(1,3), 16);
  let g = parseInt(hex.slice(3,5), 16);
  let b = parseInt(hex.slice(5,7), 16);
  r = Math.min(255, r + percent);
  g = Math.min(255, g + percent);
  b = Math.min(255, b + percent);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
};

const capColors = ref({
  bottom: '#EE4040',
  top: '#888888'
});

const getLetter = (position, word) => {
  const letters = word.split('');
  return letters[position - 1] || '';
};

// ============================================================
//  ЛОГИКА ПРЕЛОАДЕРА
// ============================================================
const startAnimationSequence = () => {
  isFadingOut.value = false;
  showLetters.value = false;

  if (cycleCount.value === 0) {
    capColors.value = {
      bottom: '#EE4040',
      top: '#888888'
    };
    console.log(`🎨 Цикл #${cycleCount.value + 1} — КЛАССИКА`);
  } else {
    const bottomColor = getRandomColor();
    let topColor;
    do {
      topColor = getRandomColor();
    } while (topColor === bottomColor);

    capColors.value = {
      bottom: bottomColor,
      top: topColor
    };
    console.log(`🎨 Цикл #${cycleCount.value + 1} — РАНДОМ`);
  }

  cycleCount.value++;

  const wordIndex = (cycleCount.value - 1) % WORDS.length;
  currentWord.value = WORDS[wordIndex];

  setTimeout(() => {
    setTimeout(() => {
      showLetters.value = true;
    }, TIMING.LETTERS_DELAY * 1000);

    setTimeout(() => {
      isFadingOut.value = true;

      setTimeout(() => {
        if (cycleCount.value >= TIMING.CYCLES_BEFORE_HIDE) {
          stopPhraseRotation();
          isVisible.value = false;
          emit('loaded');
        } else {
          setTimeout(() => {
            startAnimationSequence();
          }, TIMING.CYCLE_PAUSE * 1000);
        }
      }, TIMING.FADE_DURATION * 1000);
    }, TIMING.FADE_OUT_DELAY * 1000);
  }, TIMING.INITIAL_DELAY * 1000);
};

// ============================================================
//  ЖИЗНЕННЫЙ ЦИКЛ
// ============================================================
onMounted(() => {
  console.log('🚀 Прелоадер запущен');
  startPhraseRotation();
  setTimeout(startAnimationSequence, TIMING.INITIAL_DELAY * 1000);
});

onBeforeUnmount(() => {
  stopPhraseRotation();
});
</script>

<style scoped lang="scss">
.preloader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(12px);
  z-index: 9999;
  gap: 20px;
}

.logo-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  position: relative;
}

.logo-loader.fade-out .cube {
  animation: fadeAway v-bind('TIMING.FADE_DURATION + "s"') ease forwards !important;
}

.logo-loader.fade-out .letter {
  animation: letterFadeAway v-bind('TIMING.FADE_DURATION + "s"') ease forwards !important;
}

.cube-row {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.cube {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #EE4040, #FF6B6B);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(238, 64, 64, 0.3);
  animation: cubeFall v-bind('TIMING.CUBE_FALL_DURATION + "s"') cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
  transform: translateY(-300px) rotate(0deg);
  position: relative;
}

.cube-empty {
  background: transparent !important;
  box-shadow: none !important;
  animation: none !important;
  opacity: 0 !important;
  transform: none !important;
  pointer-events: none;
}

.letter-row {
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-top: 8px;
}

.letter {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  color: white;
  font-family: -apple-system, 'Helvetica Neue', 'Segoe UI', Roboto, sans-serif;
  font-weight: 700;
  font-size: 18px;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  opacity: 0;
  transform: translateY(-10px) scale(0.5);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-transform: lowercase;
}

.letter-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.phrases-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  position: relative;
}

.phrase-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  margin-top: 135px;
}

.phrase {
  color: rgba(255, 255, 255, 0.7);
  font-family: -apple-system, 'Helvetica Neue', 'Segoe UI', Roboto, sans-serif;
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 0.5px;
  text-align: center;
  position: absolute;
  white-space: nowrap;
}

@keyframes letterFadeAway {
  0% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: scale(0.5) rotate(-10deg) translateY(-20px);
  }
}

@keyframes fadeAway {
  0% {
    opacity: 1;
    transform: translateY(0) rotate(0deg) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px) rotate(10deg) scale(0.7);
  }
}

@keyframes cubeFall {
  0% {
    opacity: 0;
    transform: translateY(-300px) rotate(-45deg) scale(0.5);
  }
  60% {
    opacity: 1;
    transform: translateY(10px) rotate(10deg) scale(1.1);
  }
  80% {
    transform: translateY(-5px) rotate(-5deg) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotate(0deg) scale(1);
  }
}

@media (max-width: 600px) {
  .preloader-overlay {
    gap: 15px;
  }

  .cube {
    width: 24px;
    height: 24px;
  }
  .cube-row {
    gap: 3px;
  }
  .logo-loader {
    gap: 3px;
  }

  .letter {
    width: 24px;
    height: 24px;
    font-size: 15px;
  }
  .letter-row {
    gap: 3px;
    margin-top: 6px;
  }

  .phrases-wrapper {
    height: 24px;
  }

  .phrase {
    font-size: 13px;
  }
}
</style>
