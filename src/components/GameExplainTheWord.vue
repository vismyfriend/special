<template>

  <!-- Стартовая модалка -->
  <div v-if="showStartModal" class="modal-overlay">
    <div class="modal-content">
      <p>Вы играете с мобильного устройства или компьютера?</p>
      <button @click="chooseMobile">📱 С мобильного</button>
      <button @click="chooseDesktop">💻 С компьютера</button>
    </div>
  </div>
  <div class="game-container" v-if="currentGameData.length">

    <!-- Модалка, показывается при окончании времени -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <p>{{ modalMessage }}</p>
        <button @click="closeModal">OK</button>
      </div>
    </div>

    <!-- Основная карточка -->
    <div class="word-card" @click="toggleTranslation">
      <div class="word">{{ currentWord.eng }}</div>
      <div class="translation">{{ currentWord.ru }}</div>
    </div>

    <!-- Таймер -->
    <div class="timer" @click="startTimer">
      {{ timeLeft > 0 ? `${timeLeft} сек` : 'Старт' }}
    </div>
    <!-- Управляющие кнопки -->
    <div class="button-row">
      <button @click="handleBack">← Back</button>
      <button @click="handleNext">→ Next</button>
      <button @click="handleSkip">⏭ Skip</button>
    </div>

    <!-- Счётчики -->
    <div class="counter-row">
      <span>Next: {{ nextCount }}</span>
      <span>Skip: {{ skipCount }}</span>
    </div>
    <!-- Кнопка разрешения наклонов (только для iOS) -->
    <button
      v-if="!isMotionSupported && isIOS"
      @click="initMotionControls"
    >
      Разрешить наклоны
    </button>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import questionsData from '../dataForGames/questions-data';

// Получаем маршрут (например, missionName)
const route = useRoute();

// Проверка на iOS (для запроса разрешения на сенсоры)
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

// Состояния игры
const currentGameData = ref([]);
const shuffledData = ref([]);
const removedWords = ref([]);
const currentWord = ref({});
const showModal = ref(false);
const modalMessage = ref('');
const timeLeft = ref(0);
const isTimerRunning = ref(false);
const timer = ref(null);

// Показываем/скрываем перевод (в этой версии всегда виден)
const toggleTranslation = () => {
  // можно использовать позже, если нужен автопоказ
};

// Показ модального окна 1
//



const closeModal = () => {
  showModal.value = false;
};
// Счётчики
const nextCount = ref(0);
const skipCount = ref(0);

// Обновляем openModal, чтобы показывать статистику
const openModal = (message) => {
  modalMessage.value = `${message}\n\nNext: ${nextCount.value} раз\nSkip: ${skipCount.value} раз`;
  showModal.value = true;
};

// Показ модального окна 2
const showStartModal = ref(true); // Стартовая модалка

// Пользователь нажал "С компьютера"
const chooseDesktop = () => {
  showStartModal.value = false;
};

// Пользователь нажал "С мобильного"
const chooseMobile = async () => {
  showStartModal.value = false;

  updateOrientation(); // определить текущую ориентацию

  const motionMessagePortrait = `✅ Разрешение получено!\n\n▶ Наклоните телефон **на себя** — следующее слово\n◀ Наклоните **от себя** — предыдущее слово`;
  const motionMessageLandscape = `✅ Разрешение получено!\n\n▶ Наклоните телефон **вправо** — следующее слово\n◀ Наклоните **влево** — предыдущее слово`;

  const showInstruction = () => {
    modalMessage.value = orientation.value === 'portrait'
      ? motionMessagePortrait
      : motionMessageLandscape;
    showModal.value = true;
  };

  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permissionState = await DeviceOrientationEvent.requestPermission();
      if (permissionState === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation);
        isMotionSupported.value = true;
        showInstruction();
      }
    } catch (err) {
      console.warn('Permission denied', err);
    }
  } else {
    // Android
    window.addEventListener('deviceorientation', handleOrientation);
    isMotionSupported.value = true;
    showInstruction();
  }
};
// Обработчики кнопок
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
// Перемешать массив (чтобы слова шли в случайном порядке)
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

// Загрузить следующее слово
const loadNextWord = () => {
  if (shuffledData.value.length === 0) {
    openModal('🎉 Вы просмотрели все слова!');
    return;
  }

  if (currentWord.value && !currentWord.value.isIntro) {
    removedWords.value.push(currentWord.value);
  }

  currentWord.value = shuffledData.value.pop();
};

// Вернуться к предыдущему слову
const undoLastWord = () => {
  if (removedWords.value.length === 0) return;

  if (currentWord.value) {
    shuffledData.value.push(currentWord.value);
  }

  currentWord.value = removedWords.value.pop();
};

// Запуск таймера
const startTimer = () => {
  if (isTimerRunning.value) {
    clearInterval(timer.value);
    timeLeft.value = 0;
    isTimerRunning.value = false;
    return;
  }

  loadNextWord();
  timeLeft.value = 10;
  isTimerRunning.value = true;

  timer.value = setInterval(() => {
    timeLeft.value -= 1;

    if (timeLeft.value <= 0) {
      clearInterval(timer.value);
      isTimerRunning.value = false;
      openModal('⏰ Время вышло!');
    }
  }, 1000);
};

// Управление наклонами
const isMotionSupported = ref(false);
let lastTiltTime = 0;
const TILT_COOLDOWN = 1000;
const orientation = ref('portrait'); // 'portrait' или 'landscape'

// Проверка текущей ориентации
const updateOrientation = () => {
  orientation.value = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
};

// Обновим при повороте экрана
window.addEventListener('resize', updateOrientation);

// Новая логика обработки наклонов
const handleOrientation = (event) => {
  const now = Date.now();
  if (now - lastTiltTime < TILT_COOLDOWN) return;

  updateOrientation(); // на всякий случай

  if (orientation.value === 'portrait') {
    const { beta } = event;
    if (beta > 135) {
      loadNextWord();
      lastTiltTime = now;
    } else if (beta < 45) {
      undoLastWord();
      lastTiltTime = now;
    }
  } else {
    const { gamma } = event;
    if (gamma > 30) {
      loadNextWord();
      lastTiltTime = now;
    } else if (gamma < -30) {
      undoLastWord();
      lastTiltTime = now;
    }
  }
};

// Разрешить доступ к сенсорам (для iOS)
const initMotionControls = () => {
  if (window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().then((permissionState) => {
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          isMotionSupported.value = true;
        }
      });
    } else {
      // Android
      window.addEventListener('deviceorientation', handleOrientation);
      isMotionSupported.value = true;
    }
  }
};

// Подключаем всё при загрузке
onMounted(() => {
  const missionName = route.params.missionName;
  currentGameData.value = questionsData[missionName] || [];
  shuffledData.value = shuffle([...currentGameData.value]);

  // Первая карточка-инструкция
  currentWord.value = {
    ru: 'Объясни это мне',
    eng: 'Explain it to me',
    isIntro: true,
  };

  clearInterval(timer.value);
  window.removeEventListener('deviceorientation', handleOrientation);
  window.removeEventListener('resize', updateOrientation);

  initMotionControls();
});

// Очистка при уходе
onUnmounted(() => {
  clearInterval(timer.value);
  window.removeEventListener('deviceorientation', handleOrientation);
});
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  font-family: sans-serif;
}

.word-card {
  width: 280px;
  height: 160px;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
  text-align: center;
  margin-bottom: 20px;
}

.word {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 12px;
}

.translation {
  font-size: 22px;
  color: #555;
}

.timer {
  background: #000;
  color: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 15px;
}

button {
  padding: 10px 20px;
  border-radius: 6px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
button + button {
  margin-left: 10px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px 30px;
  border-radius: 8px;
  text-align: center;
}

.button-row {
  display: flex;
  gap: 12px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.counter-row {
  display: flex;
  gap: 20px;
  font-size: 16px;
  color: #333;
}
</style>
