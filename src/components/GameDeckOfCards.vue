<template>
    <div class="game-container" v-if="currentGameData.length">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <p>{{ modalMessage }}</p>
          <button @click="closeModal">OK</button>
        </div>
      </div>
      <div class="side-buttons">
<!--        <button @click="resetGame" class="game-btn">Reset</button>-->
        <button
          @click="undoLastRemoval"
          class="game-btn"
          :disabled="removedWords.length === 0"
        >
          Ctrl + Z
        </button>
      </div>
        <div class="deck-of-cards">
          <div class="wordCard" @click="toggleTranslation" >
                <div class="card-content">
                  <div class="card-text">
                    <!-- ИСПРАВЛЕНО: используем computed для отображения в зависимости от languageMode -->
                    <div class="word">{{ displayWord }}</div>
                    <div class="translation"
                         :class="{ blurred: !showTranslation && !currentWord.isIntro }"
                    >{{ displayTranslation }}</div>
                  </div>
                </div>
          </div>

          <!-- НОВАЯ КНОПКА: переключатель языка -->
          <div class="language-switcher-container">
            <button
              class="lang-switcher-btn"
              @click="toggleLanguage"
              :class="{ 'lang-switcher-active': languageMode === 'ru' }"
            >
              {{ languageMode === 'en' ? 'EN' : 'RU' }}
            </button>
            <div class="timer-block" @click="startTimer" role="button">
              <span class="timer-text">{{ timeLeft > 0 ? `${timeLeft} seconds` : 'Start' }}</span>
            </div>
          </div>

          <div class="remaining-cards" ref="remainingCardsContainer">
            <div
              class="remaining-card"
              @click="loadQuestion"
              v-for="(card, index) in remainingCards"
              :key="index"
              :style="getCardStyle(index)"
              role="button"

            >
              <div class="card-content">
                <div class="card-text">
                  <div class="word">{{ card.eng }}</div>
                  <div class="translation">{{ card.ru }}</div>
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
              <img src="../assets/images/nextCard.png" alt="Card Back" role="button"/>
            </div>
          </div>
        </div>
<!--      <button-->
<!--        v-if="!isMotionSupported && isIOS"-->
<!--        @click="initMotionControls"-->
<!--        class="enable-tilt-btn"-->
<!--      >-->
<!--        Нажмите сюда -> разрешить наклоны-->
<!--      </button>-->
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
// НОВОЕ: счетчик переведенных карточек
const cardsTranslated = ref(0)
const isMotionSupported = ref(false); // Показывать кнопку разрешения



// НОВОЕ: режим отображения языка
const languageMode = ref('en') // 'en' или 'ru'

// НОВОЕ: переключение языка
const toggleLanguage = () => {
  languageMode.value = languageMode.value === 'en' ? 'ru' : 'en'
}

// НОВОЕ: вычисляемые поля для отображения
const displayWord = computed(() => {
  if (!currentWord.value) return ''
  return languageMode.value === 'en' ? currentWord.value.eng : currentWord.value.ru
})

const displayTranslation = computed(() => {
  if (!currentWord.value) return ''
  return languageMode.value === 'en' ? currentWord.value.ru : currentWord.value.eng
})

const showModal = ref(false);
const modalMessage = ref('');

const openModal = (message) => {
  modalMessage.value = message;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
const showTranslation = ref(false);
let translationTimeout = null;

const toggleTranslation = () => {
  if (translationTimeout) clearTimeout(translationTimeout);

  showTranslation.value = true;
  translationTimeout = setTimeout(() => {
    showTranslation.value = false;
  }, 8000);
};


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

const isTimerRunning = ref(false);

const startTimer = () => {
  if (isTimerRunning.value) {
    clearInterval(timer.value);
    timer.value = null;
    timeLeft.value = 0;
    isTimerRunning.value = false;
    cardsTranslated.value = 0; // НОВОЕ: сбрасываем счетчик

    return;
  }
  cardsTranslated.value = 0; // НОВОЕ: сбрасываем счетчик при старте

  loadQuestion();
  timeLeft.value = 77;
  isTimerRunning.value = true;

  timer.value = setInterval(() => {
    if (!isTimerRunning.value) return; // защита

    timeLeft.value -= 1;

    if (timeLeft.value <= 0) {
      clearInterval(timer.value);
      timer.value = null;
      isTimerRunning.value = false;
      timeLeft.value = 0;
      openModal(`⏰ Время вышло!\nПереход хода к следующему игроку.\n\nВы перевели ${cardsTranslated.value} карточек ✨`);
      cardsTranslated.value = 0; // НОВОЕ: сбрасываем после показа

    }
  }, 1000);
};

// Случайная перестановка карточек
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

// Загрузка следующей карточки
let isLoading = false;

const loadQuestion = async () => {
  if (isLoading) return; // если уже идет загрузка, ничего не делаем
  isLoading = true;

  // НОВОЕ: увеличиваем счетчик, если это не инструкция и не первая карта
  if (currentWord.value && !currentWord.value.isIntro) {
    cardsTranslated.value++
  }

  if (shuffledData.length === 1) {
    finishGame();
    isLoading = false;

    return;
  }

  if (currentWord.value && !currentWord.value.isIntro) {
    // 1. Покажем перевод перед уходом
    showTranslation.value = true;

    // 2. Подождём 500 мс, чтобы пользователь успел увидеть перевод
    await new Promise(resolve => setTimeout(resolve, 500));

    // 3. Добавим карточку в историю
    removedWords.value.push(currentWord.value);
  }

  // 4. Загружаем следующее слово
  const nextWord = shuffledData.pop();
  currentWord.value = nextWord;

  // 5. Скрываем перевод обратно
  showTranslation.value = false;

  isLoading = false;

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
  // ИСПРАВЛЕНО: добавляем счетчик в сообщение
  openModal(`Игра окончена! Вы просмотрели все слова.\n\nВсего переведено: ${cardsTranslated.value} карточек 🎯`);
  cardsTranslated.value = 0; // НОВОЕ: сбрасываем счетчик
};

// Считаем, какие карты ещё остались
const remainingCards = computed(() => shuffledData);

// Для позиционирования стопки карт (смещение по индексам)

// 1 - вариант простого смещения по диагонали

// const getCardStyle = (index) => ({
//   top: `${index * 1.5}px`,
//   left: `${index * 1.5}px`,
// });

// 2 - вариант спирали небольшой

// const getCardStyle = (index) => {
//   const offset = 1.5 * index;
//   const maxOffset = 20;
//
//
//   return {
//     top: `${Math.min(offset, maxOffset)}px`,
//     left: `${Math.min(offset, maxOffset)}px`,
//     transform: `rotate(${Math.min(index * 0.3, 5)}deg)`
//   };
// };

// 3 - вариант спираль бесконечная
const getCardStyle = (index) => {
  const angleStep = 4; // угол поворота между картами
  const radius = 10; // радиус спирали

  const angle = index * angleStep;
  const x = radius * Math.cos((angle * Math.PI) / 180);
  const y = radius * Math.sin((angle * Math.PI) / 180);

  return {
    '--x': `${x}px`,
    '--y': `${y}px`,
    '--angle': `${angle}deg`,
    transform: `translate(var(--x), var(--y)) rotate(var(--angle))`,
    zIndex: index,
  };
};

const handleKeyDown = (event) => {
  if (event.key === 'ArrowDown') {
    loadQuestion();
  } else if (event.key === 'ArrowUp') {
    undoLastRemoval();
  }
};

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
//
// // Таймер защиты от слишком частых наклонов
// let lastTiltTime = 0;
// // Флаг для отслеживания, вернулся ли телефон в нейтральную зону
// let canTriggerForward = true;
// let canTriggerBackward = true;
// const TILT_COOLDOWN_MS = 1000; // Задержка между действиями
// const handleOrientation = (event) => {
//   const { beta } = event;
//   const now = Date.now();
//
//   const TILT_DOWN_THRESHOLD = 125;
//   const TILT_UP_THRESHOLD = 30;
//   const NEUTRAL_ZONE = 90;
//
//   // Вернулись в нейтральную зону → можно снова активировать
//   if (beta > TILT_UP_THRESHOLD && beta < NEUTRAL_ZONE) {
//     canTriggerBackward = true;
//   }
//
//   if (beta < TILT_DOWN_THRESHOLD && beta > NEUTRAL_ZONE) {
//     canTriggerForward = true;
//   }
//
//   if (
//     beta > TILT_DOWN_THRESHOLD &&
//     now - lastTiltTime > TILT_COOLDOWN_MS &&
//     canTriggerForward
//   ) {
//     if (navigator.vibrate) navigator.vibrate(30);
//     loadQuestion();
//     lastTiltTime = now;
//     canTriggerForward = false;
//   } else if (
//     beta < TILT_UP_THRESHOLD &&
//     now - lastTiltTime > TILT_COOLDOWN_MS &&
//     canTriggerBackward
//   ) {
//     if (navigator.vibrate) navigator.vibrate(30);
//     undoLastRemoval();
//     lastTiltTime = now;
//     canTriggerBackward = false;
//   }
// };
//
//
// // Разрешение на использование датчиков (для iOS)
// const initMotionControls = () => {
//   if (window.DeviceOrientationEvent) {
//     if (typeof DeviceOrientationEvent.requestPermission === 'function') {
//       DeviceOrientationEvent.requestPermission()
//         .then(permissionState => {
//           if (permissionState === 'granted') {
//             window.addEventListener('deviceorientation', handleOrientation);
//             isMotionSupported.value = true;
//           }
//         })
//         .catch(console.error);
//     } else {
//       // Для Android
//       window.addEventListener('deviceorientation', handleOrientation);
//       isMotionSupported.value = true;
//     }
//   }
// };
//


// Отписка при уходе со страницы
onUnmounted(() => {
  clearInterval(timer.value);
  timer.value = null;
  // window.removeEventListener('deviceorientation', handleOrientation);
  window.removeEventListener('keydown', handleKeyDown); // ← добавлено

});

// Загрузка данных при запуске
onMounted(() => {
  const missionName = route.params.missionName;
  currentGameData.value = questionsData[missionName] || [];
  shuffledData = shuffle([...currentGameData.value]);

  // Первая карточка-инструкция
  currentWord.value = {
    ru: "нажимай на колоду",
    eng: "Click the deck",
    isIntro: true
  };



  // Активируем управление наклоном
  // initMotionControls();
  window.addEventListener('keydown', handleKeyDown); // ← добавлено

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
  display: none;
}

.game-btn {
  background-color: #e90e0e;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: none;
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
  user-select: none;
}

.wordCard {
    width: 260px; /* Ширина карточки */
    height: 160px; /* Высота карточки */
    background-color: white; /* Цвет фона карточки */
    border: 1px solid rgba(106, 106, 106, 0.73); /* Цвет границы */
    border-radius: 8px; /* Закругление углов */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.85); /* Тень для эффекта карты */
    margin: 10px; /* Отступ между картами */
    cursor: none; /* Указатель мыши при наведении отключен, чтобы кастомный работал */
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
  font-size: 20px;
  line-height: 0.9;
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
  font-size: 20px;
  line-height: 0.9;


}

.remaining-cards {
    position: relative; /* Устанавливаем относительное позиционирование для контейнера */
    width: 260px; /* Ширина первой карты */
    height: 160px; /* Высота первой карты */
    margin-top: 75px; /* Отступ сверху для общего контейнера */
}

.remaining-card {
    position: absolute; /* Устанавливаем абсолютное позиционирование для карт */
    width: 260px; /* Ширина карты, равная первой карте */
    height: 160px; /* Высота карты, равная первой карте */
    background-color: white; /* Цвет фона карточки */
    border: 1px solid rgba(106, 106, 106, 0.73); /* Цвет границы */
    border-radius: 8px; /* Закругление углов */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Тень для эффекта карты */
    display: flex;
    justify-content: center;
    align-items: center;
  cursor: default; /* чтобы видно было какую карту тянет */

  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translate(var(--x), var(--y)) rotate(var(--angle)) translateY(-5px) translateX(5px);
    box-shadow: 0 -6px 12px rgba(0, 0, 0, 0.3);
    z-index: 200; // Поверх всех
  }

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
  cursor: none; /* Указатель мыши при наведении отключен, чтобы кастомный работал */
  z-index: 9999;
}

.card-back-cover {
  position: absolute;

  background-color: white; /* Цвет фона карточки */
  border: 1px solid rgba(106, 106, 106, 0.73); /* Цвет границы */
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
  //object-fit: contain;
  object-fit: fill;
}

.translation.blurred {
  filter: blur(5px);
  cursor: none; /* Указатель мыши при наведении отключен, чтобы кастомный работал */
  user-select: none;
  transition: filter 0.2s ease;
}

.language-switcher-container {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 260px;
  margin: 10px 0;
}

.lang-switcher-btn {
  width: 60px;
  height: 60px;
  background-color: rgba(76, 175, 80, 0);
  color: white;
  border: 1px solid rgba(106, 106, 106, 0.73);
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  cursor: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: 0;
}

.lang-switcher-btn:hover {
  transform: scale(1.05);
  background-color: rgba(106, 106, 106, 0.73);
}

.lang-switcher-btn.lang-switcher-active {
  background-color: #4096d3;
}

.lang-switcher-btn.lang-switcher-active:hover {
  background-color: rgba(106, 106, 106, 0.73);
}

// Обновляем timer-block для работы в flex контейнере
.timer-block {
  width: 190px; // 260px - 60px - 10px gap
  height: 60px;
  margin: 0;
  background-color: rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(106, 106, 106, 0.73);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
  flex: 1;
}

.timer-text {
  font-size: 20px; // немного уменьшил
  font-weight: bold;
  color: #dddddd;
  user-select: none;
}

.timer-block:hover {
  transform: scale(1.03);
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); // затемнение
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  max-width: 300px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.modal-content p {
  font-size: 18px;
  margin-bottom: 20px;
}

.modal-content button {
  padding: 8px 16px;
  font-weight: bold;
  background-color: #4CAF50;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}
</style>
