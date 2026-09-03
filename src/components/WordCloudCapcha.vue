<template>
  <div class="word-cloud-container">
    <!-- Прогресс -->
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: progressWidth }"></div>
      <div class="progress-text" :class="{ hidden: learnedWords > 0 }">
        Переведи вслух и нажми на слово или фразу
      </div>
      <div class="progress-percentage" v-if="learnedWords > 0">
        {{ animatedPercentage }}%
      </div>
    </div>

    <!-- Заголовок -->
    <div class="cloud-header">
      <div class="header-left">
<!--        <button class="back-btn" @click="goBack">← Back</button>-->
<!--        <span class="cloud-title">{{ title }}</span>-->
      </div>
      <div class="header-right">
        <button
          class="settings-btn"
          @click="cycleShape"
          :title="`Layout: ${currentShapeLabel}`"
        >
          {{ currentShapeIcon }}
        </button>
<!--        <span class="word-count">📚 {{ totalWords }} words</span>-->
      </div>
    </div>

    <!-- Облако слов -->
    <div class="cloud-wrapper" ref="cloudWrapper">
      <div
        v-for="word in displayedWords"
        :key="word.id"
        class="word-item"
        :class="{ 'long-word': word.lang && word.lang.length > 14 }"
        :style="getWordStyle(word)"
        @mouseenter="onWordHover(word)"
        @mouseleave="onWordLeave(word)"
        @click="onWordClick(word)"
      >
        <span class="word-text">{{ word.lang }}</span>
        <span v-if="word.showHint" class="word-hint">{{ word.hint }}</span>
      </div>
    </div>

    <!-- Тултип -->
    <div v-if="hoveredWord" class="word-tooltip" :style="tooltipStyle">
<!--      <div class="tooltip-word">{{ hoveredWord.lang }}</div>-->
      <div class="tooltip-translation">{{ hoveredWord.ru }}</div>
      <div v-if="hoveredWord.hint" class="tooltip-hint">🗣️ {{ hoveredWord.hint }}</div>
<!--      <div class="tooltip-status">{{ hoveredWord.learned ? '✅ Learned' : '🔄 Click to learn' }}</div>-->
    </div>

    <!-- Статистика -->
<!--    <div class="stats">-->
<!--      <span>✅ Learned: {{ learnedWords }}</span>-->
<!--      <span>⏳ Remaining: {{ totalWords - learnedWords }}</span>-->
<!--      <button v-if="learnedWords === totalWords && totalWords > 0" class="reset-btn" @click="resetAll">-->
<!--        🔄 Play Again-->
<!--      </button>-->
<!--    </div>-->

    <!-- Кнопка Finish -->
    <div class="finish-section" v-if="showFinishButton">
      <button class="finish-btn" @click="finishGame">
        🏁 Finish ({{ learnedWords }} words learned)
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import shortWordsData from '../dataForGames/short-words-data';

const route = useRoute();
const router = useRouter();

// ============ ДЕФОЛТНЫЕ СЛОВА (ЭМОДЗИ) ============
const defaultWords = [
  { id: 1, eng: "👉 finger", ru: "палец", hint: "/ фингер /" },
  { id: 2, eng: "👀 eyes", ru: "глаза", hint: "/ айз /" },
  { id: 3, eng: "👂 ear", ru: "ухо", hint: "/ иа /" },
  { id: 4, eng: "👃 nose", ru: "нос", hint: "/ ноуз /" },
  { id: 5, eng: "👄 mouth", ru: "рот", hint: "/ мауф /" },
  { id: 6, eng: "🫵 you", ru: "ты", hint: "/ ю /" },
  { id: 7, eng: "👍 thumbs up", ru: "одобряю", hint: "/ самс ап /" },
  { id: 8, eng: "👎 thumbs down", ru: "не одобряю", hint: "/ самс даун /" },
  { id: 9, eng: "👌 okay", ru: "окей", hint: "/ окей /" },
  { id: 10, eng: "✌️ victory", ru: "победа", hint: "/ виктори /" },
  { id: 11, eng: "🤞 fingers crossed", ru: "на удачу", hint: "/ фингерс кроссд /" },
  { id: 12, eng: "🖐️ hand", ru: "рука (ладонь)", hint: "/ хэнд /" },
  { id: 13, eng: "✋ stop", ru: "стоп", hint: "/ стоп /" },
  { id: 14, eng: "🖖 live long", ru: "жить долго", hint: "/ лив лонг /" },
  { id: 15, eng: "👋 wave", ru: "махать", hint: "/ вейв /" },
  { id: 16, eng: "🤚 raised hand", ru: "поднятая рука", hint: "/ рэйзд хэнд /" },
  { id: 17, eng: "🦾 robotic arm", ru: "роботизированная рука", hint: "/ роботик арм /" },
  { id: 18, eng: "🦿 robotic leg", ru: "роботизированная нога", hint: "/ роботик лег /" },
  { id: 19, eng: "🦴 bone", ru: "кость", hint: "/ боун /" },
  { id: 20, eng: "💪 muscle", ru: "мышца", hint: "/ масал /" },
  { id: 21, eng: "🫀 heart", ru: "сердце", hint: "/ харт /" },
  { id: 22, eng: "🫁 lungs", ru: "лёгкие", hint: "/ лангз /" },
  { id: 23, eng: "🧠 brain", ru: "мозг", hint: "/ брейн /" },
  { id: 24, eng: "🦷 tooth", ru: "зуб", hint: "/ тус /" },
  { id: 25, eng: "🦶 foot", ru: "нога (ступня)", hint: "/ фут /" },
  { id: 26, eng: "👣 footprints", ru: "следы", hint: "/ футпринтс /" },
  { id: 27, eng: "👁️ eye", ru: "глаз", hint: "/ ай /" },
  { id: 28, eng: "👁️‍🗨️ eye speech", ru: "глаз говорит", hint: "/ ай спич /" },
  { id: 29, eng: "🧑‍🦰 person", ru: "человек", hint: "/ пёсон /" },
  { id: 30, eng: "👩‍🦰 woman", ru: "женщина", hint: "/ вуман /" },
];

// ============ ОПРЕДЕЛЯЕМ РЕЖИМ ============
const missionName = route.params.missionName;

const isDefaultMode = computed(() => {
  return !missionName || missionName === 'wordCloud';
});

// ============ ЗАГРУЗКА ДАННЫХ ============
const getWordSet = (name) => {
  if (shortWordsData[name]) return shortWordsData[name];
  for (const level in shortWordsData) {
    if (shortWordsData[level] && shortWordsData[level][name]) {
      return shortWordsData[level][name];
    }
  }
  return [];
};

// ============ СОСТОЯНИЯ ============
const allWords = ref([]);
const displayedWords = ref([]);
const hoveredWord = ref(null);
const learnedWords = ref(0);
const totalWords = ref(0);
const cloudWrapper = ref(null);

// ============ ПЕРЕКЛЮЧЕНИЕ РЕЖИМОВ ============
const shapes = [
  { value: 'random', label: 'Random', icon: '🌀' },
  { value: 'grid', label: 'Grid', icon: '🔲' },
  { value: 'circle', label: 'Circle', icon: '⭕' },
];

const currentShapeIndex = ref(0);

const currentShape = computed(() => shapes[currentShapeIndex.value].value);
const currentShapeIcon = computed(() => shapes[currentShapeIndex.value].icon);
const currentShapeLabel = computed(() => shapes[currentShapeIndex.value].label);

const cycleShape = () => {
  currentShapeIndex.value = (currentShapeIndex.value + 1) % shapes.length;
  displayedWords.value = prepareWords(allWords.value, currentShape.value);
};

// ============ ЗАГОЛОВОК ============
const title = computed(() => {
  if (isDefaultMode.value) {
    return '✨ Word Cloud ✨';
  }
  return `📚 ${missionName}`;
});

// ============ ПОДГОТОВКА СЛОВ ============
const prepareWords = (words, shape = 'random') => {
  const withSizes = words.map((word, index) => {
    const text = word.eng || word.ru || 'word';
    const length = text.length;

    let size;
    if (length <= 4) size = 34 + Math.random() * 24;
    else if (length <= 8) size = 28 + Math.random() * 20;
    else if (length <= 12) size = 22 + Math.random() * 16;
    else size = 18 + Math.random() * 12;

    return {
      id: word.id || index,
      lang: text,
      ru: word.ru || word.eng || 'translation',
      hint: word.hint || null,
      size: size,
      x: 0,
      y: 0,
      hover: false,
      learned: false,
    };
  });

  let positioned;

  if (shape === 'grid') {
    const cols = Math.ceil(Math.sqrt(withSizes.length));
    const rows = Math.ceil(withSizes.length / cols);
    positioned = withSizes.map((word, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      return {
        ...word,
        x: 12 + (col / (cols - 1 || 1)) * 76 + (Math.random() - 0.5) * 6,
        y: 12 + (row / (rows - 1 || 1)) * 76 + (Math.random() - 0.5) * 6,
      };
    });
  } else if (shape === 'circle') {
    const centerX = 50;
    const centerY = 50;
    const radius = 40;
    positioned = withSizes.map((word, index) => {
      const angle = (index / withSizes.length) * 2 * Math.PI;
      const r = radius * Math.sqrt(index / withSizes.length) * 0.9;
      return {
        ...word,
        x: centerX + r * Math.cos(angle) + (Math.random() - 0.5) * 8,
        y: centerY + r * Math.sin(angle) + (Math.random() - 0.5) * 8,
      };
    });
  } else {
    positioned = withSizes.map((word) => {
      const length = word.lang.length;
      let maxX;
      if (length > 14) maxX = 75;
      else if (length > 10) maxX = 82;
      else if (length > 6) maxX = 88;
      else maxX = 92;
      return {
        ...word,
        x: 8 + Math.random() * (maxX - 8),
        y: 8 + Math.random() * 84,
      };
    });
  }

  return shuffleArray(positioned);
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// ============ СТИЛИ СЛОВА ============
const getWordStyle = (word) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#F8A5C2', '#74B9FF', '#A29BFE', '#FD79A8',
    '#FDCB6E', '#00CEC9', '#6C5CE7', '#FD79A8', '#00B894'
  ];
  const color = colors[word.id % colors.length];

  return {
    fontSize: `${word.size}px`,
    left: `${word.x}%`,
    top: `${word.y}%`,
    color: color,
    opacity: word.learned ? 0.15 : 1,
    transform: word.hover ? 'scale(1.4)' : 'scale(1)',
    zIndex: word.hover ? 10 : 1,
    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    cursor: word.learned ? 'default' : 'pointer',
    textShadow: word.hover ? '0 4px 30px rgba(0,0,0,0.5)' : '0 2px 10px rgba(0,0,0,0.2)',
    pointerEvents: word.learned ? 'none' : 'auto',
  };
};

// ============ ВЗАИМОДЕЙСТВИЕ ============
const onWordHover = (word) => {
  if (word.learned) return;
  hoveredWord.value = word;
  const index = displayedWords.value.findIndex(w => w.id === word.id);
  if (index !== -1) {
    displayedWords.value[index].hover = true;
  }
};

const onWordLeave = (word) => {
  hoveredWord.value = null;
  const index = displayedWords.value.findIndex(w => w.id === word.id);
  if (index !== -1) {
    displayedWords.value[index].hover = false;
  }
};

const onWordClick = (word) => {
  if (word.learned) return;

  const index = displayedWords.value.findIndex(w => w.id === word.id);
  if (index !== -1) {
    displayedWords.value[index].learned = true;
    learnedWords.value++;
  }
};

// ============ ТУЛТИП ============
const tooltipStyle = computed(() => {
  if (!hoveredWord.value) return { display: 'none' };
  return {
    display: 'inline-table',
    position: 'fixed',
    top: '70px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(10, 10, 30, 0.95)',
    backdropFilter: 'blur(20px)',
    padding: '20px 30px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    textAlign: 'center',
    zIndex: 100,
    minWidth: '200px',
    animation: 'fadeInUp 0.3s ease',
    pointerEvents: 'none',
  };
});

// ============ ПОКАЗАТЬ КНОПКУ FINISH ============
const showFinishButton = computed(() => {
  const minWordsToFinish = Math.min(10, totalWords.value);
  return learnedWords.value >= minWordsToFinish && totalWords.value > 0;
});

// ============ ПРОГРЕСС ============
const progressPercentage = computed(() => {
  if (totalWords.value === 0) return 0;
  return Math.round((learnedWords.value / totalWords.value) * 100);
});

const progressWidth = computed(() => {
  return `${progressPercentage.value}%`;
});

// ============ ПЛАВНАЯ АНИМАЦИЯ ПРОЦЕНТОВ ============
const animatedPercentage = ref(0);
let animationInterval = null;

watch(progressPercentage, (newValue) => {
  if (animationInterval) {
    clearInterval(animationInterval);
  }

  const start = animatedPercentage.value;
  const steps = 15;
  let currentStep = 0;
  const diff = newValue - start;

  if (diff === 0) return;

  animationInterval = setInterval(() => {
    currentStep++;
    const progress = currentStep / steps;
    // Плавное замедление в конце
    const eased = 1 - Math.pow(1 - progress, 3);
    animatedPercentage.value = Math.round(start + diff * eased);

    if (currentStep >= steps) {
      animatedPercentage.value = newValue;
      clearInterval(animationInterval);
      animationInterval = null;
    }
  }, 40);
}, { immediate: true });

// ============ СБРОС ============
const resetAll = () => {
  displayedWords.value.forEach(w => {
    w.learned = false;
    w.hover = false;
  });
  learnedWords.value = 0;
};

// ============ ЗАВЕРШЕНИЕ ============
const finishGame = () => {
  console.log(`🏁 WordCloud завершен! Выучено слов: ${learnedWords.value} из ${totalWords.value}`);
  router.push('/see-all-sets-of-words');
};

// ============ НАВИГАЦИЯ ============
const goBack = () => {
  router.back();
};

// ============ ОЧИСТКА ПРИ РАЗМОНТИРОВАНИИ ============
onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval);
  }
});

// ============ ИНИЦИАЛИЗАЦИЯ ============
onMounted(() => {
  let words = [];

  if (isDefaultMode.value) {
    words = defaultWords;
    console.log('🎨 WordCloud: Default mode (emojis)');
  } else {
    const allWordsArray = getWordSet(missionName);
    console.log(`📚 Всего слов в наборе: ${allWordsArray.length}`);

    // 🔥 Берем случайные 50 слов (или все, если их меньше)
    const shuffled = shuffleArray([...allWordsArray]);
    words = shuffled.slice(0, 50);
    console.log(`✂️ Отображаем ${words.length} случайных слов`);
  }

  allWords.value = words;
  totalWords.value = words.length;
  displayedWords.value = prepareWords(words, currentShape.value);
});
</script>

<style lang="scss" scoped>
.word-cloud-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0a0a1a;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow: hidden;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

// ===== ПРОГРЕСС =====
.progress-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 32px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  margin: 0 auto 15px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4ECDC4, #44B39D);
  border-radius: 16px;
  transition: width 0.5s ease;
  position: relative;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.5px;
  white-space: nowrap;
  transition: opacity 0.5s ease;
  pointer-events: none;
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);

  &.hidden {
    opacity: 0;
  }
}

.progress-percentage {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
  transition: opacity 0.3s ease;
  font-variant-numeric: tabular-nums;
}

// ===== ЗАГОЛОВОК =====
.cloud-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 0 15px;
  flex-shrink: 0;

  .header-left {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .back-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.3);
    font-size: 14px;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .settings-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.4);
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 4px 10px;
    border-radius: 8px;
    min-width: 38px;
    text-align: center;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.8);
      border-color: rgba(255, 255, 255, 0.2);
    }
  }

  .cloud-title {
    font-size: 20px;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 1px;
    margin-right: 25px;
  }

  .word-count {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.2);
  }
}

// ===== ОБЛАКО СЛОВ =====
.cloud-wrapper {
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
  overflow: hidden;
}

.word-item {
  will-change: transform, opacity;  // 👈 Добавь

  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
  transform: translate(-50%, -50%);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  max-width: 85%;
  font-family: Special_f1;

  &.long-word {
    white-space: normal;
    word-break: break-word;
    text-align: center;
    line-height: 1.2;
    max-width: 80%;
  }

  .word-text {
    font-weight: 600;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 20px rgba(0,0,0,0.3);
  }

  .word-hint {
    font-size: 10px;
    opacity: 0.3;
    margin-top: 2px;
    font-weight: 300;
  }
}

// ===== ТУЛТИП =====
.word-tooltip {
  pointer-events: none;

  .tooltip-word {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
  }

  .tooltip-translation {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 300;
  }

  .tooltip-hint {
    font-size: 22px;
    color: rgba(248, 248, 248, 0.92);
    margin-top: 8px;
    font-style: italic;
  }

  .tooltip-status {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.2);
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
}

// ===== СТАТИСТИКА =====
.stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
  padding: 10px 0;
  color: rgba(255, 255, 255, 0.2);
  font-size: 13px;
  font-weight: 300;
  flex-shrink: 0;
  flex-wrap: wrap;

  .reset-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.4);
    padding: 6px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

// ===== FINISH BUTTON =====
.finish-section {
  display: flex;
  justify-content: center;
  padding: 10px 0;
  flex-shrink: 0;

  .finish-btn {
    background: linear-gradient(135deg, #4ECDC4, #44B39D);
    border: none;
    color: #fff;
    padding: 10px 30px;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(78, 205, 196, 0.3);

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 30px rgba(78, 205, 196, 0.5);
    }
  }
}

// ===== АНИМАЦИИ =====
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

// ===== АДАПТИВНОСТЬ =====
@media (max-width: 768px) {
  .word-item .word-text {
    font-size: 14px !important;
  }

  .word-tooltip {
    min-width: 150px !important;
    padding: 15px 20px !important;
    bottom: 100px !important;

    .tooltip-word {
      font-size: 22px !important;
    }

    .tooltip-translation {
      font-size: 16px !important;
    }
  }

  .cloud-header {
    flex-wrap: wrap;
    gap: 10px;

    .header-left, .header-right {
      flex: 1 1 100%;
      justify-content: center;
    }

    .cloud-title {
      font-size: 16px;
    }
  }

  .stats {
    gap: 15px;
    font-size: 11px;
  }
}
</style>
