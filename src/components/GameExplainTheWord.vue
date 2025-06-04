<template>
  <!-- Стартовая модалка -->
  <div v-if="showStartModal" class="modal-overlay">
    <div class="modal-content">
      <p>Вы играете с мобильного устройства или компьютера?</p>
      <button @click="chooseMobile">📱 С мобильного</button>
      <button @click="chooseDesktop">💻 С компьютера</button>
    </div>
  </div>

  <!-- Основной экран игры -->
  <div class="game-container" v-if="currentGameData.length">
    <!-- Кнопка ⚙ для настроек -->
    <button @click="showSettingsModal = true">⚙</button>

    <!-- Модалка настроек управления наклонами -->
    <div v-if="showSettingsModal" class="modal-overlay">
      <div class="modal-content">
        <p>Режим управления наклонами:</p>
        <label>
          <input type="radio" value="off" v-model="tiltMode" />
          🔕 Отключить
        </label><br />
        <label>
          <input type="radio" value="on" v-model="tiltMode" />
          📲 Включить
        </label><br />
        <button @click="showSettingsModal = false">OK</button>
      </div>
    </div>

    <!-- Модалка окончания времени -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <p>{{ modalMessage }}</p>
        <button @click="closeModal">OK</button>
      </div>
    </div>

    <!-- Карточка со словом -->
    <div class="word-card" @click="toggleTranslation">
      <div class="word">{{ currentWord.eng }}</div>
      <div class="translation">{{ currentWord.ru }}</div>
    </div>

    <!-- Таймер -->
    <div class="timer" @click="startTimer">
      {{ timeLeft > 0 ? `${timeLeft} сек` : 'Старт' }}
    </div>

    <!-- Кнопки управления -->
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

    <!-- Кнопка запроса разрешения на наклоны (только iOS) -->
    <button
      v-if="!isMotionSupported && isIOS"
      @click="initMotionControls"
    >
      Разрешить наклоны
    </button>
  </div>

  <!-- Компонент отладки наклонов (опционально) -->
  <TiltDebugger />
  <!-- Отладка флагов срабатывания -->
  <div class="tilt-flags-debug">
    <p><strong>canTriggerForward:</strong> {{ triggerDebug.canForward ? '✅' : '❌' }}</p>
    <p><strong>canTriggerBackward:</strong> {{ triggerDebug.canBackward ? '✅' : '❌' }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import questionsData from '../dataForGames/questions-data';
import TiltDebugger from '../components/TiltDebugger.vue';

const route = useRoute();
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

const triggerDebug = ref({
  canForward: true,
  canBackward: true,
});

// Данные игры
const currentGameData = ref([]);
const shuffledData = ref([]);
const removedWords = ref([]);
const currentWord = ref({});

// Модалки
const showModal = ref(false);
const showStartModal = ref(true);
const showSettingsModal = ref(false);
const modalMessage = ref('');

// Таймер
const timeLeft = ref(0);
const isTimerRunning = ref(false);
const timer = ref(null);

// Управление
const nextCount = ref(0);
const skipCount = ref(0);

// Ориентация
const orientation = ref('portrait');
const updateOrientation = () => {
  orientation.value = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
};

// Наклоны
const isMotionSupported = ref(false);
const tiltMode = ref('on'); // 'on' или 'off'

// ---------------- Функции ----------------

const closeModal = () => {
  showModal.value = false;
};

const openModal = (message) => {
  modalMessage.value = `${message}\n\nNext: ${nextCount.value} раз\nSkip: ${skipCount.value} раз`;
  showModal.value = true;
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

const toggleTranslation = () => {
  const temp = currentWord.value.ru;
  currentWord.value.ru = currentWord.value.eng;
  currentWord.value.eng = temp;
};

// Загрузка следующего слова
const shuffle = (array) => array.sort(() => Math.random() - 0.5);
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

// Отмена предыдущего слова
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

// Наклоны

let lastTiltTime = 0;
let canTriggerForward = true;
let canTriggerBackward = true;

const handleOrientation = (event) => {
  if (tiltMode.value !== 'on') return;

  const { beta, gamma } = event;
  const now = Date.now();

  const TILT_TRIGGER_ANGLE = 25; // чувствительность
  const TILT_COOLDOWN_MS = 800;

  const isLandscapeLeft = Math.abs(gamma) > 60 && gamma < 0;
  const isLandscapeRight = Math.abs(gamma) > 60 && gamma > 0;
  const isPortrait = !isLandscapeLeft && !isLandscapeRight;

  let tiltDelta = 0;

  if (isPortrait) {
    // В портретном: beta ≈ 90° — нейтраль, >90 — на себя, <90 — от себя
    tiltDelta = beta - 90;
  } else if (isLandscapeLeft) {
    // В landscape left: gamma ≈ -90 — нейтраль, >-90 — на себя, <-90 — от себя
    tiltDelta = gamma + 90;
  } else {
    // В landscape right: gamma ≈ +90 — нейтраль, <+90 — на себя, >+90 — от себя
    tiltDelta = gamma - 90;
  }

  if (tiltDelta > TILT_TRIGGER_ANGLE && canTriggerForward && now - lastTiltTime > TILT_COOLDOWN_MS) {
    // Наклон на себя → Следующее слово
    if (navigator.vibrate) navigator.vibrate(30);
    handleNext();
    lastTiltTime = now;
    canTriggerForward = false;
  }

  if (tiltDelta < -TILT_TRIGGER_ANGLE && canTriggerBackward && now - lastTiltTime > TILT_COOLDOWN_MS) {
    // Наклон от себя → Назад
    if (navigator.vibrate) navigator.vibrate(30);
    handleBack();
    lastTiltTime = now;
    canTriggerBackward = false;
  }

  // Сброс в нейтральной зоне
  if (Math.abs(tiltDelta) < TILT_TRIGGER_ANGLE / 2) {
    canTriggerForward = true;
    canTriggerBackward = true;
  }

  // Отладка
  triggerDebug.value.canForward = canTriggerForward;
  triggerDebug.value.canBackward = canTriggerBackward;
};

const initMotionControls = () => {
  if (window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            isMotionSupported.value = true;
            openModal('Управление наклонами активировано!');
          }
        })
        .catch(err => {
          console.error('Permission denied:', err);
          openModal('Не удалось получить доступ к датчикам');
        });
    } else {
      // Для Android и других устройств
      window.addEventListener('deviceorientation', handleOrientation);
      isMotionSupported.value = true;
    }
  } else {
    openModal('Ваше устройство не поддерживает управление наклонами');
  }
};

// Стартовая модалка
const chooseDesktop = () => {
  showStartModal.value = false;
};

const chooseMobile = async () => {
  showStartModal.value = false;
  updateOrientation();

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
    window.addEventListener('deviceorientation', handleOrientation);
    isMotionSupported.value = true;
    modalMessage.value = `✅ Наклоны включены!\n\n▶ Наклоните телефон **на себя** — следующее слово\n◀ Наклоните **от себя** — предыдущее слово`;
    showModal.value = true;
  }
};

// Монтирование
onMounted(() => {
  const missionName = route.params.missionName;
  currentGameData.value = questionsData[missionName] || [];
  shuffledData.value = shuffle([...currentGameData.value]);
  currentWord.value = {
    ru: 'Объясни это мне',
    eng: 'Explain it to me',
    isIntro: true,
  };
  updateOrientation();
  window.addEventListener('resize', updateOrientation);
});
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
button:last-of-type {
  background-color: #888;
}
.counter-row {
  display: flex;
  gap: 20px;
  font-size: 16px;
  color: #333;
}

.tilt-flags-debug {
  margin-top: 20px;
  background: #f3f3f3;
  border: 1px solid #ccc;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  text-align: left;
  width: fit-content;
}
.tilt-flags-debug p {
  margin: 4px 0;
}
</style>
