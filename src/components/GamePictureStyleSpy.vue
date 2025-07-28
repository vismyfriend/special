<template>
  <img class="backgroundImg" :src="backgroundImage" alt="Фон игры">

  <div class="game-container" v-if="!showModal && initialized">
    <div class="detective-board">
      <!-- Polaroid-стиль для контента -->
      <div class="polaroid" v-if="currentWord">
        <!-- Изображение -->
        <img v-if="currentContentType === 'image' && currentWord.taskPicture"
             :src="currentWord.taskPicture"
             :alt="currentWord.eng || 'Image'"
             class="photo">

        <!-- Эмодзи -->
        <div v-else-if="currentContentType === 'emoji' && currentWord.taskPicture" class="emoji-content">
          <span class="emoji">{{ currentWord.taskPicture }}</span>
        </div>

        <!-- Текст -->
        <div v-else-if="currentContentType === 'text' && currentWord.taskPicture" class="text-content">
          {{ currentWord.taskPicture }}
        </div>

        <div class="polaroid-label">
          <div class="photo-counter">Архивное дело №{{ removedWords.length + 1 }}</div>
          <div class="result-info">
            <div>{{ isShowingTranslation && currentWord.rus ? 'Перевод: ' + currentWord.rus : 'Что это значит?' }}</div>
          </div>
        </div>
      </div>

      <!-- Блок с подсказками -->
      <div class="hint-container" v-if="currentWord && currentWord.eng">
        <div
          class="hint-box"
          v-for="(letter, index) in currentWord.eng.split('')"
          :key="index"
          @click="revealLetter(index)"
          :class="{ revealed: revealedLetters[index] }"
        >
          {{ revealedLetters[index] ? letter : '?' }}
        </div>
      </div>

      <!-- Управление игрой -->
      <div class="game-controls" v-if="currentWord">
        <button class="submit-btn" @click="toggleTranslation">
          {{ isShowingTranslation ? 'Скрыть перевод' : 'Показать перевод' }}
        </button>

        <div class="nav-buttons">
          <button class="nav-button prev-button" @click="handleBack">‹ Назад</button>
          <button class="nav-button next-button" @click="handleNext">Вперед ›</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Модалка с сообщением -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <p>{{ modalMessage }}</p>
      <button @click="closeModal">OK</button>
    </div>
  </div>

  <!-- Загрузочный экран -->
  <div v-if="!initialized" class="loading-screen">
    <div class="loading-spinner"></div>
    <p>Загружаем архивные материалы...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import shortPicturesData from '../dataForGames/short-pictures-data';

const route = useRoute();

// Данные игры
const currentGameData = ref([]);
const shuffledData = ref([]);
const removedWords = ref([]);
const currentWord = ref(null);
const initialized = ref(false);

// Состояния
const showModal = ref(false);
const modalMessage = ref('');
const isShowingTranslation = ref(false);
const revealedLetters = ref([]);
const backgroundImage = new URL("../assets/images/background1.jpg", import.meta.url).href;

// Определяем тип контента
const currentContentType = computed(() => {
  if (!currentWord.value?.taskPicture) return 'text';

  const content = currentWord.value.taskPicture;

  // Проверяем, является ли content URL изображения
  if (typeof content === 'string' &&
    (content.startsWith('http') || content.startsWith('/') || content.includes('assets'))) {
    return 'image';
  }

  // Проверяем, является ли content эмодзи
  const emojiRegex = /\p{Emoji}/u;
  if (emojiRegex.test(content)) {
    return 'emoji';
  }

  // По умолчанию считаем текстом
  return 'text';
});

// Основные функции
const handleNext = () => {
  try {
    loadNextWord();
  } catch (error) {
    console.error('Error in handleNext:', error);
    openModal('Ошибка при загрузке следующего слова');
  }
};

const handleBack = () => {
  try {
    undoLastWord();
  } catch (error) {
    console.error('Error in handleBack:', error);
    openModal('Ошибка при возврате к предыдущему слову');
  }
};

const shuffle = (array) => {
  try {
    return array.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error('Error shuffling array:', error);
    return array;
  }
};

const loadNextWord = () => {
  try {
    if (shuffledData.value.length === 0) {
      openModal('🎉 Расследование завершено! Все улики изучены.');
      return;
    }

    if (currentWord.value && !currentWord.value.isIntro) {
      removedWords.value.push({
        ...currentWord.value,
        isShowingTranslation: isShowingTranslation.value
      });
    }

    currentWord.value = shuffledData.value.pop() || {};
    resetRevealedLetters();
  } catch (error) {
    console.error('Error in loadNextWord:', error);
    throw error;
  }
};

const undoLastWord = () => {
  try {
    if (removedWords.value.length === 0) return;

    if (currentWord.value) {
      shuffledData.value.push(currentWord.value);
    }

    const lastWord = removedWords.value.pop() || {};
    currentWord.value = lastWord;
    isShowingTranslation.value = lastWord.isShowingTranslation || false;
    resetRevealedLetters();
  } catch (error) {
    console.error('Error in undoLastWord:', error);
    throw error;
  }
};

const toggleTranslation = () => {
  isShowingTranslation.value = !isShowingTranslation.value;
};

const revealLetter = (index) => {
  if (revealedLetters.value && index >= 0 && index < revealedLetters.value.length) {
    revealedLetters.value[index] = true;
  }
};

const resetRevealedLetters = () => {
  try {
    if (currentWord.value?.eng) {
      revealedLetters.value = Array(currentWord.value.eng.length).fill(false);
    } else {
      revealedLetters.value = [];
    }
  } catch (error) {
    console.error('Error resetting revealed letters:', error);
    revealedLetters.value = [];
  }
};

const openModal = (message) => {
  modalMessage.value = message;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// Инициализация
onMounted(async () => {
  try {
    const missionName = route.params.missionName;
    currentGameData.value = shortPicturesData[missionName] || [];
    shuffledData.value = shuffle([...currentGameData.value]);

    currentWord.value = {
      taskPicture: new URL("../assets/images/testPic1.png", import.meta.url).href,
      eng: "Secret message",
      rus: "Секретное сообщение",
      isIntro: true,
    };

    resetRevealedLetters();
    initialized.value = true;
  } catch (error) {
    console.error('Initialization error:', error);
    openModal('Ошибка при загрузке игры. Пожалуйста, попробуйте позже.');
  }
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
}

.detective-board {
  background-color: #e8e8e8;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #d0d0d0;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
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
  max-width: 100%;
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
  max-height: 400px;
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
  color: #5D2906;
}

.result-info {
  margin-top: 5px;
  font-size: 13px;
  line-height: 1.4;
  color: #444;
}

/* ==================== */
/* Стили контента       */
/* ==================== */
.emoji-content {
  font-size: 120px;
  text-align: center;
  padding: 20px;
}

.text-content {
  padding: 20px;
  font-size: 24px;
  text-align: center;
  word-break: break-word;
  max-width: 500px;
}

/* ==================== */
/* Блок с подсказками   */
/* ==================== */
.hint-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  padding: 0 10px;
  margin: 20px 0;
}

.hint-box {
  min-width: 18px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #e0e5ec 0%, #ffffff 100%);
  box-shadow: 5px 5px 10px #b8b9be, -5px -5px 10px #ffffff;
  color: #7f8c8d;
  flex-grow: 1;
  max-width: 60px;
  font-family: 'Courier New', monospace;
}

.hint-box.revealed {
  background: linear-gradient(145deg, #5D2906 0%, #8B4513 100%);
  color: white;
  font-size: 28px;
}

/* ==================== */
/* Управление игрой     */
/* ==================== */
.game-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.submit-btn {
  display: block;
  margin: 0 auto;
  padding: 12px 30px;
  background: #5D2906;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s;
  font-family: 'Courier New', monospace;
}

.submit-btn:hover {
  background: #8B4513;
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.nav-button {
  padding: 10px 20px;
  background: #5D2906;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
  font-family: 'Courier New', monospace;
}

.nav-button:hover {
  background: #8B4513;
}

/* ==================== */
/* Модальное окно       */
/* ==================== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #e8e8e8;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  font-family: 'Courier New', monospace;
}

.modal-content button {
  margin-top: 20px;
  padding: 10px 25px;
  background: #5D2906;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.modal-content button:hover {
  background: #8B4513;
}

/* ==================== */
/* Адаптация для мобильных */
/* ==================== */
@media (max-width: 768px) {
  .game-container {
    padding: 10px;
  }

  .polaroid {
    padding: 10px 10px 30px 10px;
    margin-bottom: 20px;
  }

  .photo {
    max-height: 300px;
  }

  .emoji-content {
    font-size: 80px;
  }

  .text-content {
    font-size: 18px;
  }

  .hint-box {
    height: 35px;
    font-size: 16px;
    max-width: 40px;
  }

  .hint-box.revealed {
    font-size: 20px;
  }

  .submit-btn {
    padding: 10px 20px;
    font-size: 16px;
  }

  .nav-button {
    padding: 8px 15px;
    font-size: 14px;
  }
}


/* Новые стили для загрузочного экрана */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-family: 'Courier New', monospace;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #5D2906;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
