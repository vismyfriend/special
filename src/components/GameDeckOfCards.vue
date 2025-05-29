<template>
    <div class="game-container" v-if="currentGameData.length">
      <button
        class="goBackPage"
        @click="undoLastRemoval"
        :disabled="removedWords.length === 0"
      >
        ctrl + z
      </button>
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
                    class="remaining-card" @click="loadQuestion"
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
            </div>
        </div>
      <button
        v-if="!isMotionSupported && isIOS"
        @click="initMotionControls"
        class="enable-tilt-btn"
      >
        Разрешить управление наклоном
      </button>
    </div>

</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import questionsData from '../dataForGames/questions-data';
import { onMounted, ref, computed, onUnmounted } from 'vue';

const router = useRouter();
const route = useRoute();

// Добавляем проверку на iOS
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

// Кнопка будет видна только если:
// - Устройство iOS
// - Датчики не разрешены (isMotionSupported === false)

const currentGameData = ref([]);
const currentWord = ref(null);
let shuffledData = [];
const removedWords = ref([]);

// Добавляем флаг для отслеживания поддержки датчиков
const isMotionSupported = ref(false);

// Функция перемешивания
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

// Загрузка нового слова
const loadQuestion = () => {
  if (shuffledData.length === 0) {
    finishGame();
    return;
  }

  const nextWord = shuffledData.pop();
  // Не добавляем intro-карточку в историю
  if (currentWord.value && !currentWord.value.isIntro) {
    removedWords.value.push(currentWord.value);
  }

  currentWord.value = nextWord;
};

// Отмена последнего действия
const undoLastRemoval = () => {
  if (removedWords.value.length === 0) return;

  const lastRemoved = removedWords.value.pop();

  if (currentWord.value) {
    shuffledData.push(currentWord.value);
  }

  currentWord.value = lastRemoved;
};

// Конец игры
const finishGame = () => {
  alert("Игра окончена! Вы просмотрели все слова.");
};

// Оставшиеся карточки
const remainingCards = computed(() => shuffledData);

// Стиль оставшихся карт
const getCardStyle = (index) => ({
  top: `${index * 1.5}px`,
  left: `${index * 1.5}px`,
});

// ===== НОВЫЙ КОД: Управление наклоном =====

// Защита от частых срабатываний
let lastTiltTime = 0;
let canTrigger = true; // новый флаг
const TILT_COOLDOWN_MS = 1000;

const handleOrientation = (event) => {
  const { beta } = event;
  const now = Date.now();

  const TILT_DOWN_THRESHOLD = 135;
  // 	•	Когда пользователь наклоняет телефон от себя (вниз) на угол больше 45° → срабатывает loadQuestion() (вперёд).

  const TILT_UP_THRESHOLD = 55;
  // 	•	Когда пользователь наклоняет телефон на себя (вверх) больше 30° вверх → срабатывает undoLastRemoval() (назад).

  const NEUTRAL_ZONE = 90;
  // 	•	NEUTRAL_ZONE = 90° — защита от дрожаний: пока телефон не вернулся в зону ±90°, новая команда не сработает.


  // Разрешаем следующую прокрутку только если телефон вернулся в нейтральную зону
  if (Math.abs(beta) < NEUTRAL_ZONE) {
    canTrigger = true;
  }

  if (!canTrigger) return;

  if (beta > TILT_DOWN_THRESHOLD && now - lastTiltTime > TILT_COOLDOWN_MS) {
    if (navigator.vibrate) navigator.vibrate(30);
    loadQuestion();
    lastTiltTime = now;
    canTrigger = false;
  }
  else if (beta < TILT_UP_THRESHOLD && now - lastTiltTime > TILT_COOLDOWN_MS) {
    if (navigator.vibrate) navigator.vibrate(30);
    undoLastRemoval();
    lastTiltTime = now;
    canTrigger = false;
  }
};

// Проверяем поддержку вибрации (опционально)
const isVibrationSupported = navigator.vibrate ? true : false;


// Проверяем поддержку датчиков и подписываемся
const initMotionControls = () => {
  if (window.DeviceOrientationEvent) {
    // iOS 13+ требует разрешения
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
      // Android и другие браузеры
      window.addEventListener('deviceorientation', handleOrientation);
      isMotionSupported.value = true;
    }
  }
};

// Отписываемся при размонтировании
onUnmounted(() => {
  window.removeEventListener('deviceorientation', handleOrientation);
});

// Загрузка игры
onMounted(() => {
  const missionName = route.params.missionName;
  currentGameData.value = questionsData[missionName] || [];
  shuffledData = shuffle([...currentGameData.value]);

  // 👉 Добавим приветственную карточку
  currentWord.value = {
    ru: "Наклоните телефон от себя, чтобы начать игру",
    eng: "Tilt the phone away from you to begin",
    isIntro: true // специальный флаг
  };


  // Инициализируем управление наклоном
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
    font-size: 15px; /* Размер шрифта */
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
</style>
