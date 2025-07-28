<template>
  <div class="game-container" v-if="currentGameData.length">
    <!-- Сворачиваемое меню -->
    <div class="top-menu-wrapper" :class="{ collapsed: isMenuCollapsed }">
      <div class="top-menu-bar">
        <button class="menu-button" @click="showAboutGame">Об игре</button>
        <button class="menu-button" @click="restartGame">Заново</button>
        <button class="menu-button" @click="changeSet">Другой набор</button>
        <button class="menu-button" @click="otherGames">Другие игры</button>
        <!-- Кнопка свернуть/развернуть -->
        <button class="collapse-button" @click="toggleMenu">
          {{ isMenuCollapsed ? 's.p.e.c.i.a.l.' : '...' }}
        </button>
      </div>


    </div>

    <!-- Модалка с сообщением -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <p v-html="modalMessage"></p>
        <button @click="closeModal">OK</button>
      </div>
    </div>

    <div class="game-content-wrapper">
      <!-- Кнопка назад -->
      <button class="nav-button prev-button" @click="handleBack">‹</button>

      <!-- Центральный блок с карточкой -->
      <div class="main-content">
        <!-- Универсальная карточка с контентом -->
        <div class="content-card" @click="toggleTranslation">
          <!-- Изображение -->
          <img v-if="shouldShowImage"
               :src="currentWord.taskPicture"
               :alt="currentWord.eng"
               class="content-image">

          <!-- Текст/вопрос (показывается для мультивыбора если не изображение) -->
          <div v-if="shouldShowText" class="text-content">
            {{ currentWord.taskPicture }}
          </div>

          <!-- Эмодзи -->
          <div v-else-if="currentContentType === 'emoji'" class="emoji-content">
            <span class="emoji">{{ currentWord.taskPicture }}</span>
          </div>

          <!-- Текст -->
          <div v-else-if="currentContentType === 'text'" class="text-content">
            {{ currentWord.taskPicture }}
          </div>

          <!-- Оверлей с переводом -->
          <div class="translation-overlay" v-if="isShowingTranslation">
            {{ currentWord.rus }}
          </div>
        </div>

        <!-- Блок с вариантами ответов (теперь вне content-card) -->
        <div v-if="currentContentType === 'multipleChoice'" class="multiple-choice-answers">
          <div class="options-container">
            <button
              v-for="(option, index) in multipleChoiceOptions"
              :key="index"
              @click="checkAnswer(option)"
              :class="{ correct: option.isCorrect }"
            >
              {{ option.text }}
            </button>
          </div>
        </div>

        <!-- Блок с подсказками -->
        <div class="hint-container" v-if="!currentWord.multipleChoice && currentWord.eng">
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
      </div>

      <!-- Кнопка вперед -->
      <button class="nav-button next-button" @click="handleNext">›</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import {useRoute, useRouter} from 'vue-router';
import shortPicturesData from '../dataForGames/short-pictures-data';

const router = useRouter()
const route = useRoute()

// Данные игры
const currentGameData = ref([]);
const shuffledData = ref([]);
const removedWords = ref([]);
const currentWord = ref({});

// Состояния
const showModal = ref(false);
const modalMessage = ref('');
const isShowingTranslation = ref(false);
const revealedLetters = ref([]);
const isMenuCollapsed = ref(false);

// Определяем тип контента
const currentContentType = computed(() => {
  if (currentWord.value?.multipleChoice) return 'multipleChoice';

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

  return 'text';
});

// Методы для меню
const toggleMenu = () => {
  isMenuCollapsed.value = !isMenuCollapsed.value;
};

const showAboutGame = () => {
  openModal('Это игра для практики английского,<br> составляй предложения с разными словами,<br>тренируй память и воображение.');
};

const restartGame = () => {
  shuffledData.value = shuffle([...currentGameData.value]);
  removedWords.value = [];
  loadNextWord();
};

const changeSet = () => {
  router.push("/see-all-sets-of-words/")
};

const otherGames = () => {
  router.push("/games")
};

// Разбираем варианты ответов
const multipleChoiceOptions = computed(() => {
  if (!currentWord.value?.multipleChoice) return [];

  return currentWord.value.multipleChoice.split(',').map(opt => {
    const trimmed = opt.trim();
    return {
      text: trimmed.replace('*', ''),
      isCorrect: trimmed.includes('*'),
      original: trimmed
    };
  });
});

// Проверка ответа
const checkAnswer = (option) => {
  if (option.isCorrect) {
    openModal('Правильно! ✅');
    // Автоматически переходим к следующему слову через 1 секунду
    setTimeout(loadNextWord, 1000);
  } else {
    openModal('Попробуйте ещё раз! ❌');
  }
};

// Основные функции игры
const handleNext = () => {
  loadNextWord();
};

const handleBack = () => {
  undoLastWord();
};

const shuffle = (array) => array.sort(() => Math.random() - 0.5);

const loadNextWord = () => {
  if (shuffledData.value.length === 0) {
    openModal('🎉 Вы просмотрели все карточки <br> #vismyfriend is proud of you!');
    return;
  }

  if (currentWord.value && !currentWord.value.isIntro) {
    removedWords.value.push({
      ...currentWord.value,
      isShowingTranslation: isShowingTranslation.value
    });
  }

  currentWord.value = shuffledData.value.pop();
  resetRevealedLetters();

  // Скрываем перевод для новых карточек
  isShowingTranslation.value = false;
};

const undoLastWord = () => {
  if (removedWords.value.length === 0) return;

  if (currentWord.value) {
    shuffledData.value.push(currentWord.value);
  }

  const lastWord = removedWords.value.pop();
  currentWord.value = lastWord;
  isShowingTranslation.value = lastWord.isShowingTranslation;
  resetRevealedLetters();
};

const toggleTranslation = () => {
  isShowingTranslation.value = !isShowingTranslation.value;
};

const revealLetter = (index) => {
  revealedLetters.value[index] = true;
};

const resetRevealedLetters = () => {
  if (currentWord.value.eng) {
    revealedLetters.value = Array(currentWord.value.eng.length).fill(false);
  } else {
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
const showImageForMultipleChoice = computed(() => {
  return currentContentType.value === 'multipleChoice' &&
    currentWord.value?.taskPicture &&
    (currentWord.value.taskPicture.startsWith('http') ||
      currentWord.value.taskPicture.startsWith('/') ||
      currentWord.value.taskPicture.includes('assets'));
});

const shouldShowImage = computed(() => {
  return (currentContentType.value === 'image') ||
    (currentContentType.value === 'multipleChoice' &&
      isImageUrl(currentWord.value?.taskPicture));
});

const shouldShowText = computed(() => {
  return currentContentType.value === 'text' ||
    (currentContentType.value === 'multipleChoice' &&
      !isImageUrl(currentWord.value?.taskPicture));
});

// Вспомогательная функция для проверки URL изображения
const isImageUrl = (url) => {
  return url && (url.startsWith('http') || url.startsWith('/') || url.includes('assets'));
};
// Инициализация
onMounted(() => {
  const missionName = route.params.missionName;
  currentGameData.value = shortPicturesData[missionName] || [];
  shuffledData.value = shuffle([...currentGameData.value]);
  currentWord.value = {
    taskPicture: new URL("../assets/images/testPic1.png", import.meta.url).href,
    eng: "Guess the animal",
    rus: "Угадай животное",
    isIntro: true,
  };
  resetRevealedLetters();
});
</script>

<style scoped>
/* Базовые стили */
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
  padding-top: 60px;
  z-index: 100;
  touch-action: manipulation;
  transition: padding-top 0.3s ease;
}

/* Стили меню */
.top-menu-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  overflow: visible;
  height: auto;
}

.top-menu-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transform: translateY(0);
  transition: all 0.3s ease;
  position: relative;
}

.collapsed .top-menu-bar {
  transform: translateY(-80%);
}

.collapse-button {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  width: 90px;
  height: 25px;
  border: none;
  border-radius: 0 0 10px 10px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #2c3e50;
  z-index: 1001;
  transition: all 0.3s ease;
}

.collapse-button:hover {
  background: #f1f3f6;
}

.menu-button {
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff 0%, #f1f3f6 100%);
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.05);
  color: #2c3e50;
  font-size: 14px;
  font-weight: 500;
  cursor: none;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.menu-button:hover {
  background: linear-gradient(145deg, #f1f3f6 0%, #e6e9f0 100%);
  transform: translateY(-1px);
}

/* Основные стили игры */
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
  width: 100%;
  max-width: 500px;
}

.content-card {
  width: 100%;
  height: 300px;
  max-height: 50vh;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  cursor: none;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.content-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.emoji-content {
  font-size: 120px;
  text-align: center;
}

.text-content {
  padding: 20px;
  font-size: 24px;
  text-align: center;
  word-break: break-word;
  width: 100%;
}

.translation-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  font-size: 24px;
  text-align: center;
  font-weight: bold;
}

/* Стили для подсказок */
.hint-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  padding: 0 10px;
}

.hint-box {
  min-width: 18px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: none;
  font-size: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #e0e5ec 0%, #ffffff 100%);
  box-shadow: 5px 5px 10px #b8b9be, -5px -5px 10px #ffffff;
  color: #7f8c8d;
  flex-grow: 1;
  max-width: 60px;
}

.hint-box.revealed {
  background: linear-gradient(145deg, #a5ffd6 0%, #79b4a9 100%);
  color: #2c3e50;
  font-size: 28px;
}

/* Стили для навигации */
.nav-button {
  width: 60px;
  height: 300px;
  max-height: 50vh;
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
}

.nav-button:hover {
  background: rgba(140, 202, 251, 0.28);
}

/* Стили для мультивыбора */
.multiple-choice-answers {
  width: 100%;
  padding: 0 20px;
}

.options-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 0;
  line-height: 22px;
}

.options-container button {
  padding: 10px;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  background: #f0f0f0;
  cursor: none;
  transition: all 0.3s;
}

.options-container button:hover {
  background: #8ccafb;
}



/* Стили модального окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 80%;
  text-align: center;
}

.modal-content button {
  margin-top: 15px;
  padding: 8px 15px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: none;
}

/* Адаптивные стили */
@media (max-width: 768px) {
  .top-menu-bar {
    flex-wrap: wrap;
    padding: 8px;
    gap: 6px;
  }

  .menu-button {
    padding: 6px 10px;
    font-size: 12px;
  }

  .collapse-button {
    bottom: -17px;
    height: 20px;
    width: 70px;
    font-size: 10px;
  }

  .content-card {
    height: 250px;
  }

  .emoji-content {
    font-size: 80px;
  }

  .text-content {
    font-size: 18px;
    padding: 15px;
  }

  .translation-overlay {
    font-size: 18px;
    padding: 10px;
  }
}

@media (max-width: 600px) and (orientation: portrait) {
  .game-content-wrapper {
    flex-direction: column;
    gap: 15px;
    justify-content: flex-start;
    padding-top: 20px;
  }

  /* Делаем кнопки горизонтальными */
  .nav-button {
    width: 45%;
    height: 40px;
    order: 1; /* Перемещаем после основного контента */
  }

  /* Контейнер для кнопок (создаем "виртуальный" контейнер через flex) */
  .game-content-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  /* Основной контент - на всю ширину */
  .main-content {
    width: 100%;
    order: 0;
  }

  /* Располагаем кнопки в одну строку */
  .prev-button {
    order: 1;
  }

  .next-button {
    order: 2;
  }

  .content-card {
    height: 40vh;
    max-height: none;
  }
}

@media (max-height: 600px) and (orientation: landscape) {
  .content-card {
    height: 60vh;
  }

  .game-content-wrapper {
    height: auto;
  }
}
</style>
