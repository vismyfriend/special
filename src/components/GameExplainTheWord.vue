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

const route = useRoute();

// iOS-проверка
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

// Основные состояния
const currentGameData = ref([]);
const shuffledData = ref([]);
const removedWords = ref([]);
const currentWord = ref({});
const showModal = ref(false);
const modalMessage = ref('');
const timeLeft = ref(0);
const isTimerRunning = ref(false);
const timer = ref(null);

// Стартовая модалка
const showStartModal = ref(true);
const isMotionSupported = ref(false);

// Счётчики
const nextCount = ref(0);
const skipCount = ref(0);

// Сброс модалки
const closeModal = () => {
  showModal.value = false;
};

// Показ модалки со статистикой
const openModal = (message) => {
  modalMessage.value = `${message}\n\nNext: ${nextCount.value} раз\nSkip: ${skipCount.value} раз`;
  showModal.value = true;
};

// Кнопки управления
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

// Случайная сортировка
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

// Следующее слово
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

// Назад к предыдущему слову
const undoLastWord = () => {
  if (removedWords.value.length === 0) return;

  if (currentWord.value) {
    shuffledData.value.push(currentWord.value);
  }

  currentWord.value = removedWords.value.pop();
};

// Таймер
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

// Определяем портрет или ландшафт
const orientation = ref('portrait');
const updateOrientation = () => {
  orientation.value = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
};

// Cooldown — защита от случайных повторов
let lastTiltTime = 0;
const TILT_COOLDOWN = 1000;

// Обработка сенсоров
const handleOrientation = (event) => {
  const now = Date.now();
  if (now - lastTiltTime < TILT_COOLDOWN) return;

  updateOrientation(); // уточняем ориентацию

  let angle = 0;

  // Унификация "наклон на себя / от себя" независимо от ориентации
  if (orientation.value === 'portrait') {
    angle = event.beta; // beta в портрете — вверх/вниз
  } else {
    angle = -event.gamma; // gamma в landscape нужно инвертировать
  }

  // Наклон "на себя" — дальше
  if (angle > 30) {
    loadNextWord();
    lastTiltTime = now;
  }

  // Наклон "от себя" — назад
  if (angle < -30) {
    undoLastWord();
    lastTiltTime = now;
  }
};

// Инициализация доступа к сенсорам (например, по кнопке или на старте)
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
      window.addEventListener('deviceorientation', handleOrientation);
      isMotionSupported.value = true;
    }
  }
};

// Кнопка выбора "С компьютера"
const chooseDesktop = () => {
  showStartModal.value = false;
};

// Кнопка выбора "С мобильного"
const chooseMobile = async () => {
  showStartModal.value = false;

  updateOrientation(); // определим ориентацию один раз

  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permissionState = await DeviceOrientationEvent.requestPermission();
      if (permissionState === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation);
        isMotionSupported.value = true;

        modalMessage.value = `✅ Разрешение получено!\n\n▶ Наклоните телефон **на себя** — следующее слово\n◀ Наклоните **от себя** — предыдущее слово`;
        showModal.value = true;
      }
    } catch (err) {
      console.warn('Permission denied', err);
    }
  } else {
    // Android
    window.addEventListener('deviceorientation', handleOrientation);
    isMotionSupported.value = true;

    modalMessage.value = `✅ Наклоны включены!\n\n▶ Наклоните телефон **на себя** — следующее слово\n◀ Наклоните **от себя** — предыдущее слово`;
    showModal.value = true;
  }
};

// Инициализация при загрузке
onMounted(() => {
  const missionName = route.params.missionName;
  currentGameData.value = questionsData[missionName] || [];
  shuffledData.value = shuffle([...currentGameData.value]);

  currentWord.value = {
    ru: 'Объясни это мне',
    eng: 'Explain it to me',
    isIntro: true,
  };

  updateOrientation(); // установить изначальную ориентацию
  window.addEventListener('resize', updateOrientation); // отслеживаем поворот
});

// Очистка
onUnmounted(() => {
  clearInterval(timer.value);
  window.removeEventListener('deviceorientation', handleOrientation);
  window.removeEventListener('resize', updateOrientation);
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
