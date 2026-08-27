<template>
  <div class="marginTop75">

    <!-- Информация о счете -->
    <!-- <div class="score-container">
      <div class="score-display">
        <span class="score-label">🏆 Очки</span>
        <span class="score-value">{{ score }}</span>
      </div>
      <div class="score-divider"></div>
      <div class="score-display">
        <span class="score-label">✅ Найдено пар</span>
        <span class="score-value">{{ matchedPairs }}</span>
      </div>
      <div class="score-divider"></div>
      <div class="score-display">
        <span class="score-label">❌ Попыток</span>
        <span class="score-value">{{ totalAttempts }}</span>
      </div>
    </div> -->

    <!-- Управление -->
    <div class="controls-row">
      <!-- Выпадающий список обложек -->
      <div class="back-style-selector">
        <span class="selector-label">🎴 Обложка (cover)</span>
        <div class="custom-select" @click="toggleDropdown">
          <div class="selected-option">
            <span class="style-preview" v-html="getCurrentStylePreview()"></span>
            <span class="style-name">{{ getCurrentStyleName() }}</span>
            <span class="dropdown-arrow">▼</span>
          </div>
          <div class="dropdown-options" v-if="isDropdownOpen">
            <div
              v-for="style in backStyles"
              :key="style.id"
              class="dropdown-option"
              :class="{ active: currentBackStyle === style.id }"
              @click.stop="selectStyle(style.id)"
            >
              <span class="style-preview" v-html="style.preview"></span>
              <span class="style-name">{{ style.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Игровое поле -->
    <div class="game-board" :class="`grid-${gridCols}`">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="card-container"
        :style="{
          width: cardWidth,
          height: cardHeight
        }"
      >
        <div
          class="card"
          :class="{
            'card-flipped': card.isFlipped || card.isMatched,
            'card-matched': card.isMatched,
            'card-wrong': card.isWrong,
            'card-hint-blink': startBlinkHint && hintPairs.includes(index)
          }"
          @click="flipCard(index)"
        >
          <!-- Лицевая сторона -->
          <div class="card-front">
            <!-- Если есть картинка -->
            <template v-if="card.taskPicture && card.taskPicture !== 'null' && card.taskPicture !== 'undefined'">
              <img
                :src="card.taskPicture"
                alt="card image"
                class="card-image"
                @error="handleImageError(index)"
              />
            </template>
            <!-- Если картинки нет - показываем текст -->
            <template v-else>
              <span class="card-text">{{ card.text }}</span>
              <span v-if="card.hint && showHints" class="card-hint">{{ card.hint }}</span>
            </template>
          </div>
          <!-- Обратная сторона (рубашка) -->
          <div class="card-back" :class="`back-style-${currentBackStyle}`">
            <!-- Основные стили -->
            <span v-if="currentBackStyle === 'emoji'" class="card-emoji">{{ card.backEmoji }}</span>
            <span v-else-if="currentBackStyle === '?'" class="card-back-icon">?</span>
            <span v-else-if="currentBackStyle === 'v'" class="card-back-text">Vincent</span>
            <span v-else-if="currentBackStyle === '100'" class="card-back-number">{{ card.displayNumber }}</span>
            <span v-else-if="currentBackStyle === '24'" class="card-back-number">{{ card.number0_24 }}</span>
            <span v-else-if="currentBackStyle === '99'" class="card-back-number">{{ card.number11_99 }}</span>
            <span v-else-if="currentBackStyle === 'l'" class="card-back-letters">{{ card.letters }}</span>
            <span v-else-if="currentBackStyle === 'n'" class="card-back-empty"></span>

            <!-- Полные названия для совместимости -->
            <span v-else-if="currentBackStyle === 'question'" class="card-back-icon">?</span>
            <span v-else-if="currentBackStyle === 'vincent'" class="card-back-text">Vincent</span>
            <span v-else-if="currentBackStyle === 'number'" class="card-back-number">{{ card.displayNumber }}</span>
            <span v-else-if="currentBackStyle === 'number-0-24'" class="card-back-number">{{ card.number0_24 }}</span>
            <span v-else-if="currentBackStyle === 'number-11-99'" class="card-back-number">{{ card.number11_99 }}</span>
            <span v-else-if="currentBackStyle === 'letters'" class="card-back-letters">{{ card.letters }}</span>
            <span v-else-if="currentBackStyle === 'none'" class="card-back-empty"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопки управления -->
    <div class="controls">
      <!-- <button class="action-button" @click="finishGame">
        🏆 Посмотреть результаты
      </button> -->
    </div>

    <!-- Флоаты -->
    <div v-for="(text, idx) in feedbackTexts" :key="'feedback-' + idx" class="float-text" :class="feedbackType">
      {{ text }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useGameStore } from 'stores/example-store';
import shortWordsData from '../dataForGames/short-words-data';

const router = useRouter();
const route = useRoute();
const gameStore = useGameStore();

// Пропсы
const props = defineProps({
  cover: {
    type: String,
    default: null
  }
});

// Коллекция эмодзи для рубашек
const BACK_EMOJI_SET = [
  '🍦', '🍔', '🐒', '🐘', '🕵️', '🚀', '🍈', '🎯',
  '🎨', '🎵', '🎮', '🏀', '⚽', '🎸', '🚗', '✈️',
  '🚢', '🏰', '🗼', '🌋', '🏝️', '🌊', '🌺', '🌻',
  '🌹', '🌷', '🌸', '🌳', '🌲', '🌵', '🐶', '🐱',
  '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁',
  '🐯', '🦒', '🦘', '🦄', '🐉', '🐲', '🦋', '🐝',
  '🐞', '🦗', '🐙', '🦑', '🐠', '🐟', '🐬', '🐳',
  '🐊', '🦕', '🦖', '🎪', '🎭', '🎼', '🎹', '🥁'
];

// Стили обложек с алиасами
const backStyles = [
  { id: '24', name: '→ to 23', preview: '0' },
  { id: '99', name: '→ to 99', preview: '11' },
  { id: '100', name: 'thousand', preview: '1k' },
  { id: 'n', name: 'nothing', preview: '⬜' },
  { id: 'emoji', name: 'Эмодзи', preview: '🍦' },
  { id: 'l', name: 'letters (лэтэрз)', preview: 'L' },
  { id: '?', name: 'Вопросы', preview: '?' },
  { id: 'v', name: 'Vincent', preview: 'V' },
];

// Игровые переменные
const currentMission = ref();
const currentGameData = ref([]);
const cards = ref([]);
const flippedCards = ref([]);
const matchedPairs = ref(0);
const totalAttempts = ref(0);
const isProcessing = ref(false);
const totalMistakes = ref(0);
const startBlinkHint = ref(false);
const hintPairs = ref([]);

// Переменные для счета
const score = ref(0);
const startTime = ref(null);

// Настройки
const showHints = ref(true);
const currentBackStyle = ref('emoji');
const isDropdownOpen = ref(false);

// Количество пар
const CARD_PAIRS = 12;

// Сетка
const gridCols = ref(6);

// Анимации
const feedbackTexts = ref([]);
const feedbackType = ref('positive');

// Слова для флоатов
const positiveWords = ['🎉 Отлично!', '🌟 Супер!', '💯 Нашёл!', '🏆 Гениально!', '👏 Молодец!'];
const errorWords = ['😅 Попробуй еще!', '🤔 Хе хе хе!', '🔄 Не совпало!', '😬 Ой!'];

// Нормализация стиля из URL
const normalizeStyle = (style) => {
  if (!style) return null;

  const styleMap = {
    'emoji': 'emoji',
    'question': '?',
    'special': 's',
    'number': '100',
    'number-0-24': '24',
    'number-11-99': '99',
    'letters': 'l',
    'none': 'n'
  };

  if (styleMap[style]) return styleMap[style];

  const validStyles = backStyles.map(s => s.id);
  if (validStyles.includes(style)) return style;

  return null;
};

// Функция для показа подсказки в начале игры
const showStartHint = () => {
  const totalPairs = cards.value.length / 2;
  if (totalPairs === 0) return;

  const randomPairIndex = Math.floor(Math.random() * totalPairs);

  const pairIndices = [];
  cards.value.forEach((card, index) => {
    if (card.pairId === randomPairIndex) {
      pairIndices.push(index);
    }
  });

  hintPairs.value = pairIndices;
  startBlinkHint.value = true;

  setTimeout(() => {
    startBlinkHint.value = false;
    hintPairs.value = [];
  }, 1500);
};

// Функция обновления URL через query параметр
const updateUrl = (styleId) => {
  const missionName = route.params.missionName;
  const query = styleId === 'emoji' ? {} : { cover: styleId };

  router.push({
    path: `/see-all-sets-of-words/${missionName}/flipCards`,
    query: query
  });
};

// Получаем стиль из query параметра cover
const coverFromUrl = route.query.cover || null;
const normalizedStyle = normalizeStyle(coverFromUrl);
if (normalizedStyle) {
  currentBackStyle.value = normalizedStyle;
}

// Вычисляем размер карточек
const cardWidth = computed(() => {
  const containerWidth = Math.min(700, window.innerWidth - 40);
  const cols = gridCols.value;
  const gap = 10;
  return `${(containerWidth - (cols - 1) * gap) / cols - 2}px`;
});

const cardHeight = computed(() => {
  return cardWidth.value;
});

// Определяем сетку по ширине экрана
const updateGrid = () => {
  const width = window.innerWidth;
  if (width < 500) {
    gridCols.value = 4;
  } else {
    gridCols.value = 6;
  }
};

// Перемешивание
const shuffle = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Очистка hint
const cleanHint = (hint) => {
  if (!hint) return '';
  let cleaned = hint.replace(/^\/+|\/+$/g, '');
  cleaned = cleaned.trim();
  cleaned = cleaned.replace(/\s+/g, ' ');
  return cleaned;
};

// Выбор уникальных эмодзи для каждой карточки
const getUniqueBackEmojis = (count) => {
  const shuffled = shuffle([...BACK_EMOJI_SET]);
  return shuffled.slice(0, count);
};

// Генерация букв (Aa, Bb, Cc, ...)
const generateLetters = (count) => {
  const letters = [];
  for (let i = 0; i < count; i++) {
    const letter = String.fromCharCode(65 + (i % 26));
    const pair = i % 2 === 0 ? letter + letter.toLowerCase() : letter.toLowerCase() + letter;
    letters.push(pair);
  }
  return shuffle(letters);
};

// ===== НОВЫЕ ФУНКЦИИ ДЛЯ НОВОЙ СТРУКТУРЫ DATA =====

// Функция для получения картинки для конкретной стороны
const getCardPicture = (word, side) => {
  if (side === 'eng' && word.engPicture) {
    return word.engPicture;
  }
  if (side === 'ru' && word.rusPicture) {
    return word.rusPicture;
  }
  return null;
};

// Функция для получения текста для конкретной стороны
const getCardText = (word, side) => {
  if (side === 'eng') {
    return word.eng || null;
  }
  if (side === 'ru') {
    return word.ru || null;
  }
  return null;
};

// Функция для обработки ошибок загрузки картинок
const handleImageError = (index) => {
  const card = cards.value[index];
  if (card) {
    card.taskPicture = null;
    // Если картинка не загрузилась, показываем текст
    if (card.originalEng) {
      card.text = card.originalEng;
    } else if (card.originalRu) {
      card.text = card.originalRu;
    } else {
      card.text = '?';
    }
  }
};

// Инициализация
const initGame = () => {
  const allItems = currentGameData.value;
  const shuffledItems = shuffle([...allItems]);

  const selectedWords = shuffledItems.slice(0, CARD_PAIRS);

  const totalCards = selectedWords.length * 2;
  const backEmojis = getUniqueBackEmojis(totalCards);
  const letters = generateLetters(totalCards);

  let deck = [];
  let emojiIndex = 0;

  selectedWords.forEach((word, index) => {
    // Первая карточка (eng сторона)
    const engText = getCardText(word, 'eng');
    const engPicture = getCardPicture(word, 'eng');

    deck.push({
      id: index * 2,
      pairId: index,
      text: engText,
      hint: word.hint ? cleanHint(word.hint) : null,
      type: 'eng',
      taskPicture: engPicture,
      originalEng: word.eng || null,
      originalRu: word.ru || null,
      backEmoji: backEmojis[emojiIndex],
      letters: letters[emojiIndex],
      isFlipped: false,
      isMatched: false,
      isWrong: false
    });
    emojiIndex++;

    // Вторая карточка (ru сторона)
    const ruText = getCardText(word, 'ru');
    const ruPicture = getCardPicture(word, 'ru');

    deck.push({
      id: index * 2 + 1,
      pairId: index,
      text: ruText,
      hint: null,
      type: 'ru',
      taskPicture: ruPicture,
      originalEng: word.eng || null,
      originalRu: word.ru || null,
      backEmoji: backEmojis[emojiIndex],
      letters: letters[emojiIndex],
      isFlipped: false,
      isMatched: false,
      isWrong: false
    });
    emojiIndex++;
  });

  startBlinkHint.value = false;
  hintPairs.value = [];

  cards.value = shuffle(deck);

  const total = cards.value.length;

  const numbers0_24 = [];
  const used0_24 = new Set();
  for (let i = 0; i < total; i++) {
    let num;
    let attempts = 0;
    do {
      num = Math.floor(Math.random() * 24);
      attempts++;
    } while (used0_24.has(num) && attempts < 1000);
    used0_24.add(num);
    numbers0_24.push(num);
  }
  numbers0_24.sort((a, b) => a - b);

  const numbers11_99 = [];
  const used11_99 = new Set();
  for (let i = 0; i < total; i++) {
    let num;
    let attempts = 0;
    do {
      num = Math.floor(Math.random() * 89) + 11;
      attempts++;
    } while (used11_99.has(num) && attempts < 1000);
    used11_99.add(num);
    numbers11_99.push(num);
  }
  numbers11_99.sort((a, b) => a - b);

  const randomNumbers = [];
  const usedRandom = new Set();
  for (let i = 0; i < total; i++) {
    let num;
    let attempts = 0;
    do {
      num = Math.floor(Math.random() * 1100) + 100;
      attempts++;
    } while (usedRandom.has(num) && attempts < 1000);
    usedRandom.add(num);
    randomNumbers.push(num);
  }
  randomNumbers.sort((a, b) => a - b);

  cards.value.forEach((card, index) => {
    card.number0_24 = numbers0_24[index];
    card.number11_99 = numbers11_99[index];
    card.displayNumber = randomNumbers[index];
  });

  flippedCards.value = [];
  matchedPairs.value = 0;
  totalAttempts.value = 0;
  totalMistakes.value = 0;
  score.value = 0;
  feedbackTexts.value = [];

  setTimeout(() => {
    showStartHint();
  }, 600);
};

// Переворот карточки
const flipCard = (index) => {
  if (isProcessing.value) return;
  if (cards.value[index].isFlipped) return;
  if (cards.value[index].isMatched) return;
  if (flippedCards.value.length >= 2) return;

  cards.value[index].isFlipped = true;
  flippedCards.value.push(index);

  if (flippedCards.value.length === 2) {
    isProcessing.value = true;
    totalAttempts.value++;
    checkMatch();
  }
};

// Проверка совпадения
const checkMatch = () => {
  const [index1, index2] = flippedCards.value;
  const card1 = cards.value[index1];
  const card2 = cards.value[index2];

  if (card1.pairId === card2.pairId && card1.type !== card2.type) {
    setTimeout(() => {
      card1.isMatched = true;
      card2.isMatched = true;
      matchedPairs.value++;

      const timeBonus = calculateTimeBonus();
      const points = 50 + timeBonus;
      score.value += points;

      const feedbackText = positiveWords[Math.floor(Math.random() * positiveWords.length)];
      feedbackTexts.value = [feedbackText];
      feedbackType.value = 'positive';

      setTimeout(() => {
        feedbackTexts.value = [];
      }, 1000);

      flippedCards.value = [];
      isProcessing.value = false;

      const totalPairs = cards.value.length / 2;
      if (matchedPairs.value === totalPairs) {
        finishGame();
      }
    }, 500);
  } else {
    setTimeout(() => {
      card1.isWrong = true;
      card2.isWrong = true;

      const errorText = errorWords[Math.floor(Math.random() * errorWords.length)];
      feedbackTexts.value = [errorText];
      feedbackType.value = 'error';

      setTimeout(() => {
        card1.isFlipped = false;
        card2.isFlipped = false;
        card1.isWrong = false;
        card2.isWrong = false;
        flippedCards.value = [];
        isProcessing.value = false;
        feedbackTexts.value = [];
        totalMistakes.value++;
      }, 800);
    }, 600);
  }
};

// Расчет бонуса
const calculateTimeBonus = () => {
  const baseBonus = 20;
  const randomBonus = Math.floor(Math.random() * 10);
  return baseBonus + randomBonus;
};

// Сброс игры
const resetGame = () => {
  initGame();
  startTime.value = Date.now();
};

// Завершение
const finishGame = () => {
  const duration = Date.now() - startTime.value;

  gameStore.setLastGameResults(duration, totalMistakes.value);
  gameStore.setGameName("FlipCardsGame");
  gameStore.setWordSet(currentMission.value);

  router.push({
    path: "/leader-board/",
    query: {
      missionName: currentMission.value
    }
  });
};

// UI для dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectStyle = (styleId) => {
  currentBackStyle.value = styleId;
  isDropdownOpen.value = false;
  updateUrl(styleId);
  initGame();
};

const getCurrentStyleName = () => {
  const style = backStyles.find(s => s.id === currentBackStyle.value);
  return style ? style.name : 'Эмодзи';
};

const getCurrentStylePreview = () => {
  const style = backStyles.find(s => s.id === currentBackStyle.value);
  return style ? style.preview : '🍦';
};

// Закрываем dropdown при клике вне его
const handleClickOutside = (event) => {
  const selector = document.querySelector('.back-style-selector');
  if (selector && !selector.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

// Слушаем изменение размера окна
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

  updateGrid();
  window.addEventListener('resize', updateGrid);
  document.addEventListener('click', handleClickOutside);

  startTime.value = Date.now();
  initGame();
});
</script>

<style lang="scss" scoped>

.marginTop75 {
  position: fixed;
  top: 75px;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px;
  overflow-y: auto;
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
  max-width: 600px;
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

.controls-row {
  max-width: 700px;
  margin: 0 auto 15px;
  padding: 0 10px;
}

.back-style-selector {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.05);
  padding: 10px 15px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.selector-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.custom-select {
  position: relative;
  min-width: 180px;
  cursor: pointer;
}

.selected-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
}

.dropdown-arrow {
  margin-left: auto;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  transition: transform 0.2s ease;
}

.custom-select.open .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 4px;
  z-index: 100;
  max-height: 250px;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.dropdown-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.7);

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }

  &.active {
    background: rgba(233, 69, 96, 0.15);
    color: #fff;
  }
}

.style-preview {
  font-size: 18px;
  line-height: 1;
  min-width: 24px;
  text-align: center;
}

.style-name {
  font-size: 12px;
  font-weight: 500;
}

.game-board {
  display: grid;
  gap: 10px;
  max-width: 700px;
  margin: 0 auto;
  padding: 10px;
}

.grid-6 {
  grid-template-columns: repeat(6, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

.card-container {
  aspect-ratio: 1;
  perspective: 1000px;
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  cursor: pointer;
}

.card-flipped {
  transform: rotateY(180deg);
}

.card-matched {
  transform: rotateY(180deg);
  cursor: default;

  .card-front {
    border-color: #51cf66;
    box-shadow: 0 0 20px rgba(81, 207, 102, 0.3);
    background: linear-gradient(135deg, #1a3a2e, #0d1f18);
  }
}

.card-wrong {
  animation: shake 0.5s ease;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;
  text-align: center;
}

.card-front {
  background: linear-gradient(135deg, #2d4059, #1a1a2e);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transform: rotateY(180deg);
  color: #fff;
}

.card-image {
  width: 90%;
  height: 90%;
  object-fit: contain;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
}

.card-text {
  font-size: 16px;
  font-weight: bold;
  word-break: break-word;
  line-height: 1.3;
}

.card-hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
  font-style: italic;
}

.card-back {
  background: linear-gradient(135deg, #2d4059, #1a1a2e);
  border: 2px solid rgba(255, 255, 255, 0.15);
  transform: rotateY(0deg);
  color: #fff;
}

.card-emoji {
  font-size: 48px;
  line-height: 1;
  user-select: none;
}

.card-back-icon {
  font-size: 56px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.3);
  user-select: none;
}

.card-back-text {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.4);
  user-select: none;
  text-align: center;
  line-height: 1.2;
}

.card-back-number {
  font-size: 36px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.3);
  user-select: none;
}

.card-back-letters {
  font-size: 24px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.4);
  user-select: none;
  letter-spacing: 2px;
}

.card-back-empty {
  width: 100%;
  height: 100%;
  background: transparent;
}

// Стили для разных обложек
.back-style-question .card-back {
  background: linear-gradient(135deg, #2d4059, #1a1a2e);
}

.back-style-special .card-back {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
}

.back-style-number .card-back {
  background: linear-gradient(135deg, #1a1a2e, #0f3460);
}

.back-style-number-0-24 .card-back {
  background: linear-gradient(135deg, #1a1a2e, #0f3460);
}

.back-style-number-11-99 .card-back {
  background: linear-gradient(135deg, #1a1a2e, #0f3460);
}

.back-style-letters .card-back {
  background: linear-gradient(135deg, #1a1a2e, #2d1b3d);
}

.back-style-none .card-back {
  background: linear-gradient(135deg, #1a1a2e, #1a1a2e);
  border-color: rgba(255, 255, 255, 0.05);
}

.back-style-emoji .card-back {
  background: linear-gradient(135deg, #2d4059, #1a1a2e);
}

.controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.action-button {
  padding: 12px 30px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #e94560, #c73652);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(233, 69, 96, 0.3);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(233, 69, 96, 0.4);
}

.action-button:active {
  transform: translateY(0);
}

.float-text {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  font-weight: bold;
  pointer-events: none;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
  animation: floatUpCenter 1.5s ease forwards;
  z-index: 1000;
  text-align: center;
}

.float-text.positive {
  color: #51cf66;
}

.float-text.error {
  color: #ff6b6b;
}

@keyframes floatUpCenter {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.5);
  }
  30% {
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -80%) scale(1);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0) rotateY(180deg); }
  25% { transform: translateX(-10px) rotateY(180deg); }
  75% { transform: translateX(10px) rotateY(180deg); }
}

.card-hint-blink {
  animation: hintBlink 1.5s ease 2;
  .card-back {
    border-color: #ffd93d;
    box-shadow: 0 0 30px rgba(255, 217, 61, 0.6);
  }
}

@keyframes hintBlink {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 217, 61, 0);
  }
  30% {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(255, 217, 61, 0.8);
  }
  60% {
    transform: scale(0.95);
    box-shadow: 0 0 15px rgba(255, 217, 61, 0.4);
  }
}

// Адаптивность
@media (max-width: 600px) {
  .game-board {
    gap: 4px;
    padding: 4px;
  }

  .card-text {
    font-size: 12px;
    line-height: 11px;
  }

  .card-hint {
    font-size: 10px;
    line-height: 10px;
  }

  .card-emoji {
    font-size: 32px;
  }

  .card-back-icon {
    font-size: 40px;
  }

  .card-back-number {
    font-size: 28px;
  }

  .card-back-text {
    font-size: 12px;
  }

  .card-front {
    padding: 2px;
  }

  .card-back-letters {
    font-size: 18px;
  }

  .card-image {
    width: 85%;
    height: 85%;
  }

  .score-container {
    gap: 15px;
    padding: 10px 15px;
  }

  .score-value {
    font-size: 20px;
  }

  .back-style-selector {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .selector-options {
    justify-content: center;
  }

  .style-option {
    padding: 4px 8px;
    font-size: 11px;
  }

  .style-preview {
    font-size: 16px;
    min-width: 20px;
  }

  .custom-select {
    min-width: 140px;
  }
}

</style>
