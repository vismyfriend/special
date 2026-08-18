<template>
  <!-- Основной экран игры -->
  <div class="game-container" v-if="currentGameData.length">
    <!-- Модалка с сообщением -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <p v-html="modalMessage"></p>

        <!-- Поля ввода для сложных слов (появляются только в финальной модалке) -->
        <div v-if="showWordInputs" class="word-inputs">
          <input
            v-model="difficultWord1"
            type="text"
            placeholder="Впиши слово или фразу"
            class="word-input"
          >
          <input
            v-model="difficultWord2"
            type="text"
            placeholder="Впиши слово или фразу"
            class="word-input"
          >
        </div>

        <button @click="closeModal">OK</button>
      </div>
    </div>

    <div class="game-content-wrapper">
      <!-- Кнопка назад -->
      <button class="nav-button prev-button" @click="handleBack">‹</button>

      <!-- Центральный блок с карточкой -->
      <div class="main-content">
        <!-- Карточка со словом -->
        <div class="word-card" @click="toggleGameMode">
          <div class="word-wrapper">
            <div class="word" ref="wordText" :style="wordStyle">
              {{ displayWord }}
            </div>
          </div>
          <!-- Блок с произношением -->
          <div v-if="currentHint" class="pronunciation-hint">
            {{ currentHint }}
          </div>
        </div>

        <!-- Блок с подсказками-буквами -->
        <div class="hint-container">
          <template v-for="(word, wordIndex) in wordsArray" :key="wordIndex">
            <div
              class="word-group"
              :data-length="word.length > 9 ? 'many' : 'normal'"
            >
              <div
                v-for="(letter, letterIndex) in word.split('')"
                :key="`${wordIndex}-${letterIndex}`"
                class="hint-box"
                :class="{ revealed: isLetterRevealed(wordIndex, letterIndex) }"
                @click="revealLetter(wordIndex, letterIndex)"
              >
                {{ isLetterRevealed(wordIndex, letterIndex) ? letter : '?' }}
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Кнопка вперед -->
      <button
        class="nav-button next-button"
        @click="handleNextWithReveal"
        :disabled="isWaitingForNext"
      >›</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
import { useRoute } from 'vue-router';
import shortWordsData from '../dataForGames/short-words-data';

const getWordSet = (name) => {
  if (shortWordsData[name]) return shortWordsData[name];
  for (const level in shortWordsData) {
    if (shortWordsData[level] && shortWordsData[level][name]) {
      return shortWordsData[level][name];
    }
  }
  return [];
};

const route = useRoute();

// ==================== ПАРСИНГ НАПРАВЛЕНИЯ ИЗ URL ====================

const parseDirectionFromRoute = () => {
  const directionParam = route.params.direction;

  if (!directionParam) return 'EngRu';

  const direction = directionParam.toString().toLowerCase();

  const directionMap = {
    'er': 'EngRu',
    're': 'RuEng',
    'engru': 'EngRu',
    'enru': 'EngRu',
    'eng-ru': 'EngRu',
    'en-ru': 'EngRu',
    'eng_ru': 'EngRu',
    'en_ru': 'EngRu',
    'rueng': 'RuEng',
    'ruen': 'RuEng',
    'ru-eng': 'RuEng',
    'ru-en': 'RuEng',
    'ru_eng': 'RuEng',
    'ru_en': 'RuEng'
  };

  return directionMap[direction] || 'EngRu';
};

// ==================== СОСТОЯНИЯ ====================

const gameDirection = ref(parseDirectionFromRoute());

const currentGameData = ref([]);
const shuffledData = ref([]);
const removedWords = ref([]);
const currentWord = ref({});

const showModal = ref(false);
const modalMessage = ref('');
const showWordInputs = ref(false);

const difficultWord1 = ref('');
const difficultWord2 = ref('');

const nextCount = ref(0);
const skipCount = ref(0);

const gameMode = ref(gameDirection.value === 'RuEng');

const revealedLetters = ref([]);

const isWaitingForNext = ref(false);
const nextTimeout = ref(null);

const wordText = ref(null);

// ==================== COMPUTED ====================

const displayWord = computed(() => {
  return gameMode.value ? currentWord.value.ru : currentWord.value.eng;
});

const displayRu = computed(() => {
  return gameMode.value ? currentWord.value.eng : currentWord.value.ru;
});

const wordsArray = computed(() => {
  return displayRu.value ? displayRu.value.split(' ') : [];
});

const currentHint = computed(() => {
  return !gameMode.value ? currentWord.value.hint : '';
});

// 🆕 ВЫЧИСЛЯЕМ РАЗМЕР ШРИФТА НА ОСНОВЕ ДЛИНЫ СЛОВА
const wordStyle = computed(() => {
  const text = displayWord.value || '';
  const length = text.length;
  const isMobile = window.innerWidth <= 600;

  // Базовая логика размера
  let fontSize;

  if (isMobile) {
    if (length <= 4) fontSize = 'clamp(28px, 10vw, 42px)';
    else if (length <= 8) fontSize = 'clamp(24px, 8vw, 36px)';
    else if (length <= 12) fontSize = 'clamp(20px, 6vw, 30px)';
    else if (length <= 16) fontSize = 'clamp(18px, 5vw, 26px)';
    else if (length <= 20) fontSize = 'clamp(16px, 4vw, 22px)';
    else fontSize = 'clamp(14px, 3.5vw, 20px)';
  } else {
    if (length <= 4) fontSize = 'clamp(40px, 6vw, 70px)';
    else if (length <= 8) fontSize = 'clamp(34px, 5vw, 58px)';
    else if (length <= 12) fontSize = 'clamp(28px, 4.5vw, 48px)';
    else if (length <= 16) fontSize = 'clamp(24px, 4vw, 40px)';
    else if (length <= 20) fontSize = 'clamp(20px, 3.5vw, 34px)';
    else fontSize = 'clamp(18px, 3vw, 28px)';
  }

  return {
    fontSize: fontSize,
    lineHeight: '1.1'
  };
});

// Проверяем, открыта ли буква
const isLetterRevealed = (wordIndex, letterIndex) => {
  return revealedLetters.value[wordIndex]?.[letterIndex] || false;
};

// Функция для открытия всех букв
const revealAllHintBoxes = () => {
  revealedLetters.value = wordsArray.value.map(word =>
    Array(word.length).fill(true)
  );
};

// 🆕 УПРОЩЁННАЯ ВЕРСИЯ fitText (только для крайних случаев)
const fitText = () => {
  nextTick(() => {
    const container = wordText.value?.parentNode;
    const textEl = wordText.value;

    if (!container || !textEl) return;

    // Проверяем, не вылезает ли текст даже с CSS-адаптацией
    // Это страховка на случай очень длинных слов
    const maxHeight = container.clientHeight * 0.95;
    const maxWidth = container.clientWidth * 0.95;

    // Если текст всё ещё вылезает — уменьшаем шрифт принудительно
    if (textEl.scrollHeight > maxHeight || textEl.scrollWidth > maxWidth) {
      let currentSize = parseFloat(textEl.style.fontSize) || 58;
      let attempts = 0;

      while (
        (textEl.scrollHeight > maxHeight || textEl.scrollWidth > maxWidth) &&
        currentSize > 12 &&
        attempts < 30
        ) {
        currentSize -= 0.5;
        textEl.style.fontSize = `${currentSize}px`;
        attempts++;
      }
    }
  });
};

// Функция для получения случайных слов из данных
const getRandomWords = (count) => {
  const allWords = [...currentGameData.value];
  const shuffled = shuffle([...allWords]);
  return shuffled.slice(0, count).map(word => word.eng);
};

// Обновленная функция открытия модалки
const openFinalModal = () => {
  showWordInputs.value = true;
  difficultWord1.value = '';
  difficultWord2.value = '';
  modalMessage.value = 'Какие слова были сложными?<br>🎉<br>What words were difficult?';
  showModal.value = true;
};

// Обновленная функция закрытия модалки
const closeModal = () => {
  const hasUserInput = difficultWord1.value.trim() || difficultWord2.value.trim();

  if (hasUserInput) {
    modalMessage.value = 'Good job <br>💪<br> special agent!';
  } else {
    const randomWords = getRandomWords(2);
    difficultWord1.value = randomWords[0];
    difficultWord2.value = randomWords[1];

    modalMessage.value = 'Многим вот эти кажутся сложными<br>📚<br>these seem difficult to many';
  }

  setTimeout(() => {
    showModal.value = false;
    showWordInputs.value = false;
  }, 7000);
};

const handleNextWithReveal = () => {
  if (isWaitingForNext.value) return;
  revealAllHintBoxes();
  isWaitingForNext.value = true;

  if (nextTimeout.value) {
    clearTimeout(nextTimeout.value);
  }

  nextTimeout.value = setTimeout(() => {
    nextCount.value += 1;
    loadNextWord();
    isWaitingForNext.value = false;
    nextTimeout.value = null;
  }, 700);
};

const handleSkip = () => {
  skipCount.value += 1;
  loadNextWord();
};

const handleBack = () => {
  if (isWaitingForNext.value) return;
  undoLastWord();
};

const shuffle = (array) => array.sort(() => Math.random() - 0.5);

const loadNextWord = () => {
  if (shuffledData.value.length === 0) {
    openFinalModal();
    return;
  }

  if (currentWord.value && Object.keys(currentWord.value).length > 0) {
    removedWords.value.push({
      ...currentWord.value
    });
  }

  currentWord.value = { ...shuffledData.value.pop() };
  resetRevealedLetters();
  fitText();
};

const undoLastWord = () => {
  if (removedWords.value.length === 0) return;

  if (currentWord.value && Object.keys(currentWord.value).length > 0) {
    shuffledData.value.push({ ...currentWord.value });
  }

  const lastWord = removedWords.value.pop();
  currentWord.value = {
    eng: lastWord.eng,
    ru: lastWord.ru,
    hint: lastWord.hint
  };

  resetRevealedLetters();
  fitText();
};

const toggleGameMode = () => {
  gameMode.value = !gameMode.value;
  resetRevealedLetters();
  fitText();
};

const revealLetter = (wordIndex, letterIndex) => {
  if (revealedLetters.value[wordIndex]) {
    revealedLetters.value[wordIndex][letterIndex] = true;
  }
};

const resetRevealedLetters = () => {
  revealedLetters.value = wordsArray.value.map(word =>
    Array(word.length).fill(false)
  );
};

// Предотвращение зума
const preventZoom = (e) => {
  if (e.touches && e.touches.length > 1) {
    e.preventDefault();
    e.stopPropagation();
  }
};

// Следим за изменением отображаемого слова
watch([displayWord, displayRu], () => {
  nextTick(() => {
    fitText();
    resetRevealedLetters();
  });
});

onMounted(() => {
  fitText();
  window.addEventListener('resize', fitText);

  const missionName = route.params.missionName;
  currentGameData.value = getWordSet(missionName);
  shuffledData.value = shuffle([...currentGameData.value]);

  if (shuffledData.value.length > 0) {
    currentWord.value = { ...shuffledData.value.pop() };
    resetRevealedLetters();
  }

  document.addEventListener('dblclick', preventZoom);
  document.addEventListener('touchstart', preventZoom, { passive: false });

  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
  document.head.appendChild(meta);
});

onUnmounted(() => {
  window.removeEventListener('resize', fitText);
  document.removeEventListener('dblclick', preventZoom);
  document.removeEventListener('touchstart', preventZoom);

  if (nextTimeout.value) {
    clearTimeout(nextTimeout.value);
  }
});
</script>

<style scoped>
/* Добавляем глобальные стили для предотвращения зума */
html {
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

/* Основные стили */
.game-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  z-index: 100;
  touch-action: manipulation;
}

.game-content-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 800px;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 500px;
}

/* ======================================== */
/* 🆕 ОБНОВЛЁННАЯ КАРТОЧКА СЛОВА */
/* ======================================== */
.word-card {
  width: 500px;
  height: 200px;
  border-radius: 16px;
  padding: 20px;
  background: linear-gradient(145deg, #ffffff 0%, #e6e9f0 100%);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: none;
  transition: all 0.3s ease;
  border: none;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  position: relative;
}

/* 🆕 ОБЁРТКА ДЛЯ ТЕКСТА — ГЛАВНЫЙ КОНТРОЛЛЁР РАЗМЕРА */
.word-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 5px;
}

/* 🆕 ОБНОВЛЁННЫЙ ТЕКСТ — ТЕПЕРЬ НИКОГДА НЕ ОБРЕЗАЕТСЯ */
.word {
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  line-height: 1.1;

  /* === ГЛАВНАЯ МАГИЯ === */
  max-width: 100%;
  max-height: 100%;

  /* Переносим длинные слова */
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  hyphens: auto;

  /* Защита от обрезания */
  overflow: visible;
}

/* Стили для блока произношения */
.pronunciation-hint {
  font-size: 21px;
  color: #7f8c8d;
  font-style: italic;
  margin-top: 8px;
  text-align: center;
  position: relative;
  padding: 4px 12px;
  flex-shrink: 0; /* Не даём сжиматься */
}

/* Пунктирная линия */
.pronunciation-hint::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg,
  transparent 0%, transparent 10%, #bdc3c7 10%, #bdc3c7 20%,
  transparent 20%, transparent 30%, #bdc3c7 30%, #bdc3c7 40%,
  transparent 40%, transparent 50%, #bdc3c7 50%, #bdc3c7 60%,
  transparent 60%, transparent 70%, #bdc3c7 70%, #bdc3c7 80%,
  transparent 80%, transparent 90%, #bdc3c7 90%, #bdc3c7 100%);
  opacity: 0.7;
}

/* Блок с подсказками */
.hint-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0;
  width: 100%;
  padding: 0 10px;
  min-height: 120px;
}

/* Группа букв одного слова */
.word-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-right: 20px;
  margin-left: 20px;
  margin-bottom: 8px;
  max-width: 100%;
}

/* Буква-подсказка с адаптивным размером */
.hint-box {
  flex: 1 1 auto;
  min-width: 30px;
  width: auto;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: none;
  font-size: clamp(14px, 3vw, 20px);
  font-weight: 600;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #e0e5ec 0%, #ffffff 100%);
  box-shadow: 5px 5px 10px #b8b9be, -5px -5px 10px #ffffff;
  color: #7f8c8d;
  -webkit-tap-highlight-color: transparent;
  margin: 0;
  padding: 0 2px;
}

/* Для очень длинных слов делаем буквы меньше */
.word-group[data-length="many"] .hint-box {
  min-width: 25px;
  font-size: clamp(12px, 2.5vw, 16px);
}

.hint-box.revealed {
  background: linear-gradient(145deg, #a5ffd6 0%, #79b4a9 100%);
  background: transparent;
  color: #2c3e50;
  font-size: clamp(16px, 4vw, 28px);
  box-shadow: none;
}

.hint-box:hover {
  transform: scale(1.05);
}

/* Кнопки навигации */
.nav-button {
  width: 60px;
  height: 300px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(145deg, #ffffff 0%, #e6e9f0 100%);
  box-shadow: 5px 5px 10px #b8b9be, -5px -5px 10px #ffffff;
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  cursor: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.nav-button:hover {
  transform: scale(1.05);
  background: linear-gradient(145deg, #e6e9f0 0%, #ffffff 100%);
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-content p {
  font-size: 18px;
  margin-bottom: 20px;
  color: #2c3e50;
}

.modal-content button {
  padding: 10px 25px;
  border-radius: 30px;
  border: none;
  background: linear-gradient(145deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: none;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
}

.modal-content button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 242, 254, 0.3);
}

/* Поля ввода */
.word-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
}

.word-input {
  padding: 10px 15px;
  border-radius: 8px;
  border: 2px solid #e0e5ec;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #f5f7fa;
}

.word-input:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2);
}

/* ======================================== */
/* 🆕 АДАПТИВНОСТЬ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ */
/* ======================================== */
@media (max-width: 600px) {
  .game-content-wrapper {
    flex-direction: column;
    gap: 15px;
  }

  .main-content {
    width: 100%;
    padding: 0 15px;
  }

  .word-card {
    width: 100%;
    height: 180px;
    padding: 15px;
  }

  .word-wrapper {
    padding: 3px;
  }

  .pronunciation-hint {
    font-size: 14px;
    margin-top: 6px;
    padding: 3px 8px;
  }

  .nav-button {
    width: 100%;
    height: 60px;
    order: 1;
  }

  .hint-container {
    min-height: 100px;
  }

  .word-group {
    margin-right: 20px;
    margin-left: 20px;
    margin-bottom: 6px;
  }

  .hint-box {
    min-width: 20px;
    height: 35px;
    font-size: clamp(10px, 3.5vw, 18px);
  }

  .hint-box.revealed {
    font-size: clamp(10px, 3.5vw, 24px);
  }

  .word-group[data-length="many"] .hint-box {
    min-width: 16px;
    font-size: clamp(10px, 3vw, 14px);
  }

  .word-input {
    font-size: 14px;
    padding: 8px 12px;
  }
}

</style>
