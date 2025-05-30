<template>
    <div class="game-container" v-if="currentGameData.length">
      <div class="side-buttons">
<!--        <button @click="resetGame" class="game-btn">Reset</button>-->
        <button
          @click="undoLastRemoval"
          class="game-btn"
          :disabled="removedWords.length === 0"
        >
          Ctrl + Z
        </button>
        <button @click="startTimer" class="game-btn">{{ timerLabel }}</button>
      </div>
        <div class="deck-of-cards">
            <div class="wordCard" @click="loadQuestion">
                <div class="card-content">
                    <div class="card-text">
                        <div class="word">{{ currentWord.ru }}</div>
                        <div class="translation">{{ currentWord.eng }}</div>
                    </div>
                </div>
            </div>
          <div class="remaining-cards" ref="remainingCardsContainer">
            <div
              class="remaining-card"
              @click="loadQuestion"
              v-for="(card, index) in remainingCards"
              :key="index"
              :style="getCardStyle(index)"
            >
              <div class="card-content">
                <div class="card-text">
                  <div class="word">{{ card.ru }}</div>
                  <div class="translation">{{ card.eng }}</div>
                </div>
              </div>
            </div>

            <!-- Обложка сверху последней карты -->
            <div
              v-if="remainingCards.length > 0"
              :class="['card-back-cover', { tapped: isCardCoverTapped }]"
              :style="getCardStyle(remainingCards.length - 1)"
              @click="handleCardCoverClick"
            >
              <img src="../assets/images/special%20logo%20hat%20square.png" alt="Card Back" />
            </div>
          </div>
        </div>
      <button
        v-if="!isMotionSupported && isIOS"
        @click="initMotionControls"
        class="enable-tilt-btn"
      >
        Нажмите сюда -> разрешить наклоны
      </button>
    </div>

</template>

<script setup>
// ===== ИМПОРТЫ И НАСТРОЙКА =====
import { useRouter, useRoute } from 'vue-router';
import questionsData from '../dataForGames/questions-data';
import { onMounted, ref, computed, onUnmounted } from 'vue';

const router = useRouter();
const route = useRoute();

// Проверка на устройство iOS
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

const currentGameData = ref([]);
const currentWord = ref(null);
let shuffledData = []; // Перемешанные карточки, стек
const removedWords = ref([]); // Удалённые карточки, для отмены (undo)

const isMotionSupported = ref(false); // Показывать кнопку разрешения



// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
const isCardCoverTapped = ref(false);

const handleCardCoverClick = () => {
  isCardCoverTapped.value = true;
  loadQuestion();

  setTimeout(() => {
    isCardCoverTapped.value = false;
  }, 300); // сбросим класс после завершения анимации
};


const timer = ref(null);
const timeLeft = ref(0);
const timerLabel = computed(() =>
  timeLeft.value > 0 ? `You have ${timeLeft.value} seconds` : 'Timer'
);

const startTimer = () => {
  if (timeLeft.value > 0) return; // Уже работает

  timeLeft.value = 77;

  timer.value = setInterval(() => {
    timeLeft.value -= 1;

    if (timeLeft.value <= 0) {
      clearInterval(timer.value);
      timeLeft.value = 0;
      // Показать уведомление о переходе хода
      alert("⏰ Время вышло!\nПереход хода к следующему игроку.");
    }
  }, 1000);
};



// Случайная перестановка карточек
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

// Загрузка следующей карточки
const loadQuestion = () => {
  if (shuffledData.length === 0) {
    finishGame();
    return;
  }

  const nextWord = shuffledData.pop(); // Берём из конца массива

  // Текущая карточка отправляется в историю (если не intro)
  if (currentWord.value && !currentWord.value.isIntro) {
    removedWords.value.push(currentWord.value);
  }

  currentWord.value = nextWord;
};

// Возврат к предыдущей карточке
const undoLastRemoval = () => {
  if (removedWords.value.length === 0) return;

  const lastRemoved = removedWords.value.pop(); // Берём из истории

  if (currentWord.value) {
    shuffledData.push(currentWord.value); // Возвращаем текущую карту обратно в очередь
  }

  currentWord.value = lastRemoved; // Показываем предыдущую
};

// Конец игры
const finishGame = () => {
  alert("Игра окончена! Вы просмотрели все слова.");
};

// Считаем, какие карты ещё остались
const remainingCards = computed(() => shuffledData);

// Для позиционирования стопки карт (смещение по индексам)
const getCardStyle = (index) => ({
  top: `${index * 1.5}px`,
  left: `${index * 1.5}px`,
});

// const resetGame = () => {
//   shuffledData = shuffle([...currentGameData.value]);
//   removedWords.value = [];
//
//   currentWord.value = {
//     ru: "Если вы услышали YES - наклоните телефон вниз",
//     eng: "If you heard YES - tilt your phone down",
//     isIntro: true,
//   };
//
//   // сбрасываем таймер
//   clearInterval(timer.value);
//   timeLeft.value = 0;
// };

// ===== УПРАВЛЕНИЕ НАКЛОНОМ =====

// Таймер защиты от слишком частых наклонов
let lastTiltTime = 0;
// Флаг для отслеживания, вернулся ли телефон в нейтральную зону
let canTriggerForward = true;
let canTriggerBackward = true;
const TILT_COOLDOWN_MS = 1000; // Задержка между действиями
const handleOrientation = (event) => {
  const { beta } = event;
  const now = Date.now();

  const TILT_DOWN_THRESHOLD = 125;
  const TILT_UP_THRESHOLD = 30;
  const NEUTRAL_ZONE = 90;

  // Вернулись в нейтральную зону → можно снова активировать
  if (beta > TILT_UP_THRESHOLD && beta < NEUTRAL_ZONE) {
    canTriggerBackward = true;
  }

  if (beta < TILT_DOWN_THRESHOLD && beta > NEUTRAL_ZONE) {
    canTriggerForward = true;
  }

  if (
    beta > TILT_DOWN_THRESHOLD &&
    now - lastTiltTime > TILT_COOLDOWN_MS &&
    canTriggerForward
  ) {
    if (navigator.vibrate) navigator.vibrate(30);
    loadQuestion();
    lastTiltTime = now;
    canTriggerForward = false;
  } else if (
    beta < TILT_UP_THRESHOLD &&
    now - lastTiltTime > TILT_COOLDOWN_MS &&
    canTriggerBackward
  ) {
    if (navigator.vibrate) navigator.vibrate(30);
    undoLastRemoval();
    lastTiltTime = now;
    canTriggerBackward = false;
  }
};


// Разрешение на использование датчиков (для iOS)
const initMotionControls = () => {
  if (window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            isMotionSupported.value = true;
          }
        })
        .catch(console.error);
    } else {
      // Для Android
      window.addEventListener('deviceorientation', handleOrientation);
      isMotionSupported.value = true;
    }
  }
};

// Отписка при уходе со страницы
onUnmounted(() => {
  window.removeEventListener('deviceorientation', handleOrientation);
});

// Загрузка данных при запуске
onMounted(() => {
  const missionName = route.params.missionName;
  currentGameData.value = questionsData[missionName] || [];
  shuffledData = shuffle([...currentGameData.value]);

  // Первая карточка-инструкция
  currentWord.value = {
    ru: "Если вы услышали YES - наклоните телефон вниз",
    eng: "If you heard YES - tilt your phone down",
    isIntro: true
  };

  // Активируем управление наклоном
  initMotionControls();
});
</script>



<style lang="scss" scoped>
.game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    height: 400px;
}
.side-buttons {
  display: flex;
  flex-direction: row;
  left: 20px;
  top: 50px;
  gap: 10px;
}

.game-btn {
  background-color: #e90e0e;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.game-btn:hover {
  background-color: #c50b0b;
}

.game-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.deck-of-cards {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.wordCard {
    width: 260px; /* Ширина карточки */
    height: 160px; /* Высота карточки */
    background-color: white; /* Цвет фона карточки */
    border: 1px solid #e90e0e; /* Цвет границы */
    border-radius: 8px; /* Закругление углов */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Тень для эффекта карты */
    margin: 10px; /* Отступ между картами */
    cursor: pointer; /* Указатель мыши при наведении */
    transition: transform 0.2s ease, box-shadow 0.2s ease; /* Плавный переход для анимации */
}

.wordCard:hover {
    transform: scale(1.05); /* Увеличение карточки при наведении */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Увеличение тени при наведении */
}

.card-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.card-text {
    font-size: 20px; /* Размер шрифта */
    color: black; /* Цвет текста */
    text-align: center; /* Центрирование текста */
    padding: 10px;
    line-height: 1.2;
}

.word {
    font-weight: bold; /* Выделение русского слова */
}
.word::after {
    content: ""; /* Псевдоэлемент требует контент */
    display: block; /* Делаем его блочным элементом */
    width: 100%; /* Ширина линии равна ширине текста */
    height: 1px; /* Высота линии */
    border-bottom: 1px dashed #000; /* Пунктирная линия */
    margin: 5px 0; /* Отступы сверху и снизу для линии */
}
.translation {
    font-style: italic; /* Курсив для перевода */
    color: #555; /* Более светлый цвет для перевода */
}

.remaining-cards {
    position: relative; /* Устанавливаем относительное позиционирование для контейнера */
    width: 260px; /* Ширина первой карты */
    height: 160px; /* Высота первой карты */
    margin-top: 10px; /* Отступ сверху для общего контейнера */
}

.remaining-card {
    position: absolute; /* Устанавливаем абсолютное позиционирование для карт */
    width: 260px; /* Ширина карты, равная первой карте */
    height: 160px; /* Высота карты, равная первой карте */
    background-color: white; /* Цвет фона карточки */
    border: 1px solid #e90e0e; /* Цвет границы */
    border-radius: 8px; /* Закругление углов */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Тень для эффекта карты */
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: default; /* Указатель мыши по умолчанию */
}
.goBackPage:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.enable-tilt-btn {
  background: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;
}

.card-back-cover {
  position: absolute;

  background-color: white; /* Цвет фона карточки */
  border: 1px solid #e90e0e; /* Цвет границы */
  border-radius: 8px; /* Закругление углов */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Тень для эффекта карты */


  top: 0;
  left: 0;
  width: 260px;
  height: 160px;
  z-index: 100; // чтобы всегда быть поверх остальных
  //pointer-events: none; // чтобы клик проходил сквозь
  pointer-events: auto; // Нужно включить, чтобы "hover" работал


  transition: transform 0.3s ease;

  // Желаемый эффект при наведении
  &:hover {
    transform: scale(1.02) translateY(-10px) translateX(10px);
  }
}

.card-back-cover.tapped {
  transform: scale(1.02) translateY(-10px) translateX(10px);
}

.card-back-cover img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}
</style>
