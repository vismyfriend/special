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
<!--          <input-->
<!--            v-model="difficultWord3"-->
<!--            type="text"-->
<!--            placeholder="Впиши слово или фразу"-->
<!--            class="word-input"-->
<!--          >-->

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
          <div class="word" ref="wordText">{{ displayWord }}</div>
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

const route = useRoute();

// Данные игры
const currentGameData = ref([]);
const shuffledData = ref([]);
const removedWords = ref([]);
const currentWord = ref({});

// Модалки
const showModal = ref(false);
const modalMessage = ref('');
const showWordInputs = ref(false); // Показывать ли поля ввода

// Поля для сложных слов
const difficultWord1 = ref('');
const difficultWord2 = ref('');
const difficultWord3 = ref('');

// Управление
const nextCount = ref(0);
const skipCount = ref(0);

// Глобальный режим игры (true - показываем русский, false - показываем английский)
const gameMode = ref(false);

// Подсказки с буквами - теперь храним как массив для каждого слова
const revealedLetters = ref([]);

// Состояние для задержки перед следующим словом
const isWaitingForNext = ref(false);
const nextTimeout = ref(null);

const wordText = ref(null);

// Вычисляемые поля для отображения
const displayWord = computed(() => {
  return gameMode.value ? currentWord.value.ru : currentWord.value.eng;
});

const displayRu = computed(() => {
  return gameMode.value ? currentWord.value.eng : currentWord.value.ru;
});

// Разбиваем текст на массив слов
const wordsArray = computed(() => {
  return displayRu.value ? displayRu.value.split(' ') : [];
});

const currentHint = computed(() => {
  // Показываем подсказку только когда отображается английское слово
  return !gameMode.value ? currentWord.value.hint : '';
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

const fitText = () => {
  nextTick(() => {
    const container = wordText.value?.parentNode;
    const textEl = wordText.value;

    if (!container || !textEl) return;

    const isMobile = window.innerWidth <= 600;
    let fontSize = isMobile ? 36 : 58;
    const lineHeight = isMobile ? 0.85 : 0.8;
    const padding = isMobile ? 5 : 10;

    textEl.style.fontSize = `${fontSize}px`;
    textEl.style.lineHeight = lineHeight;
    textEl.style.padding = `${padding}px`;

    while (
      (textEl.scrollWidth > container.clientWidth ||
        textEl.scrollHeight > container.clientHeight) &&
      fontSize > 12
      ) {
      fontSize -= 1;
      textEl.style.fontSize = `${fontSize}px`;

      if (isMobile && fontSize < 24) {
        fontSize -= 0.5;
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
  difficultWord3.value = '';
  modalMessage.value = 'Какие слова были сложными?<br>🎉<br>What words were difficult?';
  showModal.value = true;
};

// Обновленная функция закрытия модалки
const closeModal = () => {
  // Проверяем, были ли введены слова
  const hasUserInput = difficultWord1.value.trim() || difficultWord2.value.trim() || difficultWord3.value.trim();

  if (hasUserInput) {
    // Если пользователь что-то ввел
    modalMessage.value = 'Good job <br>💪<br> special agent!';
  } else {
    // Если поля пустые, заполняем случайными словами
    const randomWords = getRandomWords(3);
    difficultWord1.value = randomWords[0];
    difficultWord2.value = randomWords[1];
    difficultWord3.value = randomWords[2];

    modalMessage.value = 'Многим вот эти кажутся сложными<br>📚<br>these seem difficult to many';
  }

  // Показываем обновленное сообщение еще на секунду, потом закрываем
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

// Добавляем предотвращение зума
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
  currentGameData.value = shortWordsData[missionName] || [];
  shuffledData.value = shuffle([...currentGameData.value]);

  if (shuffledData.value.length > 0) {
    currentWord.value = { ...shuffledData.value.pop() };
    gameMode.value = false;
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

/* Фиксированные стили карточки слова */
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

.word {
  font-size: 58px;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  user-select: none;
  white-space: normal;
  word-break: normal;
  overflow-wrap: normal;
  max-height: 100%;
  padding: 10px;
  line-height: 0.8;
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
}

/* Добавляем пунктирную линию */
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
  /* Адаптивная ширина для длинных слов */
  max-width: 100%;
}



/* Буква-подсказка с адаптивным размером */
.hint-box {
  /* Используем flex-basis для более гибкого управления */
  flex: 1 1 auto;
  min-width: 30px; /* Уменьшили минимальную ширину */
  width: auto; /* Автоматическая ширина */
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: none;
  font-size: clamp(14px, 3vw, 20px); /* Адаптивный размер шрифта */
  font-weight: 600;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #e0e5ec 0%, #ffffff 100%);
  box-shadow: 5px 5px 10px #b8b9be, -5px -5px 10px #ffffff;
  color: #7f8c8d;
  -webkit-tap-highlight-color: transparent;
  margin: 0;
  /* Добавляем отступы для длинных букв (например, Щ) */
  padding: 0 2px;
}

/* Для очень длинных слов делаем буквы еще меньше */
.word-group[data-length="many"] .hint-box {
  min-width: 25px;
  font-size: clamp(12px, 2.5vw, 16px);
}

.hint-box.revealed {
  background: linear-gradient(145deg, #a5ffd6 0%, #79b4a9 100%);
  background: transparent;
  color: #2c3e50;
  font-size: clamp(16px, 4vw, 28px); /* Адаптивный размер для открытых букв */
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

/* Адаптивность для мобильных устройств */
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
  }

  .word {
    font-size: 36px;
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
    gap: 6px;
  }

  .hint-box {
    min-width: 20px; /* Еще меньше для мобильных */
    height: 35px;
    font-size: clamp(10px, 3.5vw, 18px);
  }

  .hint-box.revealed {
    font-size: clamp(10px, 3.5vw, 24px);
  }

  /* Для очень длинных слов на мобильных */
  .word-group[data-length="many"] .hint-box {
    min-width: 16px;
    font-size: clamp(10px, 3vw, 14px);
  }
}

/* Добавляем стили для полей ввода */
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

/* Адаптивность для мобильных */
@media (max-width: 600px) {
  .word-input {
    font-size: 14px;
    padding: 8px 12px;
  }
}
</style>
