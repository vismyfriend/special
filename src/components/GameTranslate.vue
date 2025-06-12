<template>
  <!-- Основной экран игры -->
  <div class="game-container" v-if="currentGameData.length">
    <!-- Модалка с сообщением -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <p>{{ modalMessage }}</p>
        <button @click="closeModal">OK</button>
      </div>
    </div>

    <div class="game-content-wrapper">
      <!-- Кнопка назад -->
      <button class="nav-button prev-button" @click="handleBack">‹</button>

      <!-- Центральный блок с карточкой -->
      <div class="main-content">
        <!-- Карточка со словом -->
        <div class="word-card" @click="toggleTranslation">
          <div class="word" ref="wordText">{{ currentWord.eng }}</div>
        </div>
<!--        <p class="hint-info">Нажми на букву, чтобы увидеть подсказку</p>-->

        <!-- Блок с подсказками-буквами -->
        <div class="hint-container">
          <div
            class="hint-box"
            v-for="(letter, index) in currentWord.ru.split('')"
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

    <!-- Кнопка пропуска внизу -->
<!--    <button class="skip-button" @click="handleSkip">⏭ Пропустить</button>-->
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import questionsData from '../dataForGames/questions-data';

const route = useRoute();

// Данные игры
const currentGameData = ref([]);
const shuffledData = ref([]);
const removedWords = ref([]);
const currentWord = ref({});

// Модалки
const showModal = ref(false);
const modalMessage = ref('');
const isShowingTranslation = ref(false); // Добавляем состояние для отслеживания языка

// Управление
const nextCount = ref(0);
const skipCount = ref(0);

// Подсказки с буквами
const revealedLetters = ref([]);


const wordText = ref(null);

const fitText = () => {
  nextTick(() => {
    const container = wordText.value?.parentNode;
    const textEl = wordText.value;

    if (!container || !textEl) return;

    let fontSize = 58;
    textEl.style.fontSize = fontSize + 'px';

    // Уменьшаем шрифт, пока не влезает по ширине или высоте
    while (
      (textEl.scrollWidth > container.clientWidth ||
        textEl.scrollHeight > container.clientHeight) &&
      fontSize > 12
      ) {
      fontSize -= 1;
      textEl.style.fontSize = fontSize + 'px';
    }
  });
};


const handleNext = () => {
  nextCount.value += 1;
  loadNextWord();
};

const handleSkip = () => {
  skipCount.value += 1;
  loadNextWord();
};

const handleBack = () => {
  undoLastWord();
};



const shuffle = (array) => array.sort(() => Math.random() - 0.5);

const loadNextWord = () => {
  if (shuffledData.value.length === 0) {
    openModal('🎉 Вы просмотрели все слова!');
    return;
  }
  if (currentWord.value && !currentWord.value.isIntro) {
    removedWords.value.push({
      ...currentWord.value,
      isShowingTranslation: isShowingTranslation.value // Сохраняем состояние языка
    });
  }
  currentWord.value = shuffledData.value.pop();

  // Если предыдущее слово было показано на русском, переворачиваем новое слово
  if (isShowingTranslation.value) {
    const tempWord = currentWord.value.eng;
    const tempTranslation = currentWord.value.ru;
    currentWord.value.eng = tempTranslation;
    currentWord.value.ru = tempWord;
  }

  resetRevealedLetters();
  fitText();

};

const undoLastWord = () => {
  if (removedWords.value.length === 0) return;
  if (currentWord.value) {
    shuffledData.value.push(currentWord.value);
  }
  const lastWord = removedWords.value.pop();
  currentWord.value = {
    eng: lastWord.eng,
    ru: lastWord.ru
  };

  // Восстанавливаем состояние языка
  if (lastWord.isShowingTranslation) {
    const tempWord = currentWord.value.eng;
    const tempTranslation = currentWord.value.ru;
    currentWord.value.eng = tempTranslation;
    currentWord.value.ru = tempWord;
    isShowingTranslation.value = true;
  } else {
    isShowingTranslation.value = false;
  }

  resetRevealedLetters();
};

const toggleTranslation = () => {
  // Меняем местами слово и перевод
  const tempWord = currentWord.value.eng;
  const tempTranslation = currentWord.value.ru;

  currentWord.value.eng = tempTranslation;
  currentWord.value.ru = tempWord;

  // Переключаем состояние языка
  isShowingTranslation.value = !isShowingTranslation.value;

  // Сбрасываем открытые буквы
  resetRevealedLetters();
};
const revealLetter = (index) => {
  revealedLetters.value[index] = true;
};

const resetRevealedLetters = () => {
  if (currentWord.value.ru) {
    revealedLetters.value = Array(currentWord.value.ru.length).fill(false);
  }
};

const openModal = (message) => {
  modalMessage.value = message;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// Добавляем предотвращение зума
const preventZoom = (e) => {
  if (e.touches && e.touches.length > 1) {
    e.preventDefault();
    e.stopPropagation();
  }
};

watch(() => currentWord.value.eng, () => {
  fitText();
});



onMounted(() => {
  fitText();
  window.addEventListener('resize', fitText);

  const missionName = route.params.missionName;
  currentGameData.value = questionsData[missionName] || [];
  shuffledData.value = shuffle([...currentGameData.value]);
  currentWord.value = {
    eng: 'Листай и переводи',
    ru: 'подсказки',
    isIntro: true,
  };
  resetRevealedLetters();

  // Добавляем обработчики для предотвращения зума
  document.addEventListener('dblclick', preventZoom);
  document.addEventListener('touchstart', preventZoom, { passive: false });

  // Добавляем meta-тег для viewport (предотвращение зума)
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
  document.head.appendChild(meta);

});

onUnmounted(() => {
  window.removeEventListener('resize', fitText);
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
  touch-action: manipulation; /* для предотвращения зума*/

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
  width: 500px; /* Фиксированная ширина центрального блока */
}

/* Фиксированные стили карточки слова */
.word-card {
  width: 500px; /* Фиксированная ширина */
  height: 200px; /* Фиксированная высота */
  border-radius: 16px;
  padding: 20px;
  background: linear-gradient(145deg, #ffffff 0%, #e6e9f0 100%);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  overflow: hidden; /* Обрезаем длинные слова */
  -webkit-tap-highlight-color: transparent; /* для предотвращения зума*/

}

.word {
  font-size: 58px;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  user-select: none;
  /* word-break: break-word;  Перенос длинных слов */
  white-space: normal;
  word-break: normal;
  overflow-wrap: normal;
  max-height: 100%;
  padding: 10px;
  line-height: 0.8;
}

/* Адаптивные подсказки */
.hint-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  padding: 0 10px;
  height: 120px;
}

.hint-box {
  /* Размер будет адаптироваться автоматически */
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
  flex-grow: 1; /* Растягиваемся по доступному месту */
  max-width: 60px; /* Максимальный размер */
  -webkit-tap-highlight-color: transparent;

}

.hint-box.revealed {
  background: linear-gradient(145deg, #a5ffd6 0%, #79b4a9 100%);
  color: #2c3e50;
  font-size: 28px;

}

.hint-box:hover {
  transform: scale(1.05);
}

/* Фиксированные стили кнопок навигации */
.nav-button {
  width: 60px; /* Фиксированная ширина */
  height: 300px; /* Фиксированная высота */
  border-radius: 16px;
  border: none;
  background: linear-gradient(145deg, #ffffff 0%, #e6e9f0 100%);
  box-shadow: 5px 5px 10px #b8b9be, -5px -5px 10px #ffffff;
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  cursor: pointer;
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
  cursor: pointer;
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

  .nav-button {
    width: 100%;
    height: 60px;
    order: 1; /* Перемещаем кнопки вниз на мобильных */
  }

  .hint-box {
    min-width: 35px;
    height: 35px;
    font-size: 18px;
  }
}
.skip-button {
  margin-top: 30px;
  padding: 12px 25px;
  border-radius: 30px;
  border: none;
  background: linear-gradient(145deg, #ff9a9e 0%, #fad0c4 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(250, 208, 196, 0.4);
}

.skip-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(250, 208, 196, 0.6);
}
</style>
