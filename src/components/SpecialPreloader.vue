<template>
  <div v-if="isVisible" class="preloader-overlay">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

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
  CYCLE_PAUSE: 0.3
};
// ============================================================

// Слова для каждого цикла
const WORDS = ['loading', 'special', 'english'];

const emit = defineEmits(['loaded']);

const isVisible = ref(true);
const showLetters = ref(false);
const isFadingOut = ref(false);
const currentWord = ref('special');
const cycleCount = ref(0);

// ============================================================
//  ЦВЕТА КЕПКИ
// ============================================================
const getRandomColor = () => {
  const colors = [
    '#EE4040', // красный
    '#2196F3', // синий
    '#4CAF50', // зеленый
    '#FF9800', // оранжевый
    '#9C27B0', // фиолетовый
    '#00BCD4', // голубой
    '#FF5722', // оранжево-красный
    '#E91E63', // розовый
    '#3F51B5', // индиго
    '#009688', // бирюзовый
    '#ffffff', // белый
    '#fffb00', // желтый
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

const generateNewCapColors = () => {
  // Первый цикл — всегда красный + серый
  if (cycleCount.value === 0) {
    capColors.value = {
      bottom: '#EE4040',
      top: '#888888'
    };
    return;
  }

  // Для остальных — рандом
  const bottomColor = getRandomColor();
  let topColor;
  do {
    topColor = getRandomColor();
  } while (topColor === bottomColor);

  capColors.value = {
    bottom: bottomColor,
    top: topColor
  };
};

const getLetter = (position, word) => {
  const letters = word.split('');
  return letters[position - 1] || '';
};

// Запуск анимационной последовательности
const startAnimationSequence = () => {
  isFadingOut.value = false;
  showLetters.value = false;

  // ✅ Генерируем цвета ДО увеличения cycleCount
  // Проверяем: если это первый запуск (cycleCount === 0) — красный + серый
  if (cycleCount.value === 0) {
    capColors.value = {
      bottom: '#EE4040',
      top: '#888888'
    };
    console.log(`🎨 Цикл #${cycleCount.value + 1} — КЛАССИКА: красный + серый`);
  } else {
    // Для остальных — рандом
    const bottomColor = getRandomColor();
    let topColor;
    do {
      topColor = getRandomColor();
    } while (topColor === bottomColor);

    capColors.value = {
      bottom: bottomColor,
      top: topColor
    };
    console.log(`🎨 Цикл #${cycleCount.value + 1} — РАНДОМ: ${capColors.value.bottom} + ${capColors.value.top}`);
  }

  // Теперь увеличиваем счетчик
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

onMounted(() => {
  console.log('🚀 Прелоадер запущен');
  setTimeout(startAnimationSequence, TIMING.INITIAL_DELAY * 1000);
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
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(12px);
  z-index: 9999;
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

// Пустые позиции (невидимые кубики)
.cube-empty {
  background: transparent !important;
  box-shadow: none !important;
  animation: none !important;
  opacity: 0 !important;
  transform: none !important;
  pointer-events: none;
}

// Отдельная строка для букв
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

// Плавное исчезновение букв
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

// Плавное исчезновение кубиков
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

// Адаптация размера кубиков под экран
@media (max-width: 600px) {
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
}

</style>
