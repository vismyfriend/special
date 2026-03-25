<template>

<!--  http://192.168.0.43:9000/special/  для просмотра с телефона-->
  <div>
    <div
      v-if="showOverlay"
      class="overlay"
    ></div>

    <!-- Сворачиваемое меню -->
    <div class="top-menu-wrapper" :class="{ collapsed: isMenuCollapsed }">
      <div class="top-menu-bar">
        <button class="menu-button" @click="showAboutGame">⚙️</button>
        <button class="menu-button" @click="otherGames">Задание</button>
        <button class="menu-button" @click="restartGame">Обновить</button>
        <button class="menu-button" @click="changeSet">Миссии</button>

        <!-- Кнопка с визуалом LegendaryMode -->
        <button class="menu-button legendary-button" @click="showLegendaryModal = true">
            <span class="legendary-visual">
              <span class="flame">🔥</span>
              <span class="days-counter">{{ legendaryDays }}</span>
            </span>
        </button>

        <!-- Кнопка свернуть/развернуть -->
        <button class="collapse-button">
          {{ isMenuCollapsed ? 's.p.e.c.i.a.l.' : '...' }}
        </button>
      </div>
    </div>

    <!-- Модальное окно LegendaryMode с передачей пропсов -->
    <div v-if="showLegendaryModal" class="legendary-modal-overlay" @click.self="showLegendaryModal = false">
      <div class="legendary-modal-content">
        <LegendaryMode
          :current-days="legendaryDays"
          @update-days="updateLegendaryDays"
        />
        <button @click="showLegendaryModal = false" class="close-legendary-modal">Закрыть</button>
      </div>
    </div>

    <!-- Модалка с сообщением -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <p v-html="modalMessage"></p>
        <button @click="closeModal">закрыть</button>
      </div>
    </div>

    <!-- Модальное окно игрального кубика -->
    <div v-if="showDiceModal" class="dice-modal-overlay" @click.self="closeDiceModal">
      <div class="dice-modal-content">
        <!-- Кнопка закрытия -->
        <button class="dice-close-button" @click="closeDiceModal">×</button>

        <!-- Контент кубика -->
        <div class="dice-container">
          <div
            class="dice-roll-area"
            @click="rollDice"
            :class="{ rolling: isRolling }"
          >
            <div class="dice-text">
              {{ isRolling ? 'I am rolling the dice..' : 'Roll the dice' }}
              <!-- Добавляем псевдо-линию и перевод -->
              <div class="translation-line">
                <span class="translation-text">бросить кубик</span>
              </div>
            </div>

            <!-- Отображение текущего числа во время броска -->
            <div v-if="isRolling && currentDiceNumber !== null" class="dice-number-rolling">
              {{ currentDiceNumber }}
            </div>

            <!-- Результат -->
            <div v-if="showResult" class="dice-result">
              <div class="result-number">{{ diceResult }}</div>
              <div class="result-text">Выпало:</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <router-view />

    <!-- Контейнер для кнопок справа -->
    <div class="right-buttons-container">
      <button class="infoButton" @click="showInstructions"></button>
      <button class="diceButton" @click="showDiceModal = true"></button>
    </div>

    <div v-if="isInstructionsVisible" class="overlay" @click="hideInstructions">
      <div class="instructions">
        <h3>what do u wanna do?</h3>
        <q-btn class="q-mb-sm zoomIn" label="Попробовать ещё раз  " push color="green" @click="$router.go(0)" >
                  <span class="star-icons">
                      <q-icon name="star" color="yellow" />
                      <q-icon name="star" color="yellow" />
                      <q-icon name="star" color="yellow" />
                      <q-icon name="star" color="yellow" />
                      <q-icon name="star" color="yellow" />
                  </span>
        </q-btn>
        <q-btn class="q-mb-sm zoomIn" icon="search" label="Другой набор слов" push color="primary" @click="backToAllSets" />

        <q-btn class="q-mb-sm zoomIn" icon="fingerprint" label="QUIT S.P.E.C.I.A.L App"
               stack glossy color="purple" @click="backToIntroPage" />
        <!-- Кнопка показывается только если есть missionName -->
        <q-btn
          v-if="hasMissionName"
          push
          color="brown-5"
          @click="backToSameSet"
          label="Этот же набор, другое задание"
        >
          🔎
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, inject, onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import LegendaryMode from '../components/LegendaryMode.vue';

const route = useRoute()
const router = useRouter();

const showModal = ref(false);
const modalMessage = ref('');
const isMenuCollapsed = ref(false);
const showLegendaryModal = ref(false);
const showOverlay = ref(true);
const showDiceModal = ref(false);
const isRolling = ref(false);
const currentDiceNumber = ref(null);
const showResult = ref(false);
const diceResult = ref(1);

// -------------------------
// УПРОЩЕННЫЙ ТРЕКЕР ПОСЕЩЕНИЙ
// -------------------------

const legendaryDays = ref(1);

// Функция для получения сегодняшней даты в формате YYYY-MM-DD
function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

// Функция проверки и обновления streak
function updateStreak() {
  const today = getTodayISO();

  // Загружаем сохраненные данные
  const lastVisit = localStorage.getItem('lastVisitDate');
  const currentStreak = parseInt(localStorage.getItem('currentStreak')) || 1;
  const allVisits = JSON.parse(localStorage.getItem('allVisits') || '[]');

  // Если сегодня уже отмечали - ничего не делаем
  if (lastVisit === today) {
    legendaryDays.value = currentStreak;
    return;
  }

  // Проверяем разницу в днях
  if (lastVisit) {
    const lastDate = new Date(lastVisit);
    const todayDate = new Date(today);
    const diffTime = todayDate - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Посещение подряд - увеличиваем streak
      legendaryDays.value = currentStreak + 1;
    } else if (diffDays > 1) {
      // Пропущен день - сбрасываем streak
      legendaryDays.value = 1;
    }
  } else {
    // Первое посещение
    legendaryDays.value = 1;
  }

  // Сохраняем обновленные данные
  localStorage.setItem('lastVisitDate', today);
  localStorage.setItem('currentStreak', legendaryDays.value.toString());

  // Добавляем сегодняшний день в историю посещений (если его еще нет)
  if (!allVisits.includes(today)) {
    allVisits.push(today);
    localStorage.setItem('allVisits', JSON.stringify(allVisits));
  }

  console.log('Streak updated:', {
    today,
    lastVisit,
    newStreak: legendaryDays.value,
    allVisits: allVisits.length
  });
}

// Функция для получения всех дат посещений
function getAllVisitDates() {
  return JSON.parse(localStorage.getItem('allVisits') || '[]');
}

// Функция для очистки старых записей (старше 365 дней)
function cleanupOldVisits() {
  const allVisits = getAllVisitDates();
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setDate(oneYearAgo.getDate() - 365);

  const filteredVisits = allVisits.filter(dateStr => {
    const date = new Date(dateStr);
    return date >= oneYearAgo;
  });

  localStorage.setItem('allVisits', JSON.stringify(filteredVisits));
  return filteredVisits;
}

// Методы для игрального кубика
const closeDiceModal = () => {
  showDiceModal.value = false;
  resetDice();
};

const resetDice = () => {
  isRolling.value = false;
  currentDiceNumber.value = null;
  showResult.value = false;
  diceResult.value = 1;
};

const rollDice = async () => {
  if (isRolling.value) return;

  isRolling.value = true;
  showResult.value = false;
  currentDiceNumber.value = null;

  // Фаза 1: Быстрая смена цифр (1 секунда)
  const fastPhaseDuration = 1000; // 1 секунда быстрой смены
  const fastInterval = 80; // очень быстро - 80ms между сменами

  let fastPhaseStart = Date.now();

  while (Date.now() - fastPhaseStart < fastPhaseDuration) {
    currentDiceNumber.value = Math.floor(Math.random() * 6) + 1;
    await new Promise(resolve => setTimeout(resolve, fastInterval));
  }

  // Фаза 2: Постепенное замедление (2 секунды)
  const slowPhaseDuration = 2000; // 2 секунды замедления
  const slowPhaseStart = Date.now();

  // Начальный интервал для замедления (быстрый)
  let currentInterval = 100;
  // Конечный интервал (медленный)
  const finalInterval = 400;

  while (Date.now() - slowPhaseStart < slowPhaseDuration) {
    currentDiceNumber.value = Math.floor(Math.random() * 6) + 1;

    // Увеличиваем интервал постепенно
    const progress = (Date.now() - slowPhaseStart) / slowPhaseDuration;
    currentInterval = 100 + (progress * (finalInterval - 100));

    await new Promise(resolve => setTimeout(resolve, currentInterval));
  }

  // Финальная цифра
  diceResult.value = Math.floor(Math.random() * 6) + 1;
  currentDiceNumber.value = diceResult.value;
  showResult.value = true;


    isRolling.value = false;

};


// Остальные методы остаются без изменений
const showAboutGame = () => {
  openModal(`
    <div style="text-align: center;">
      <p>Подробнее про <br>S.P.E.C.I.A.L.<br>и vismyfriend</p>
      <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
        <button id="vismyfriend-btn"
           style="padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Vismyfriend
        </button>
        <button id="mysite-btn"
           style="padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
          my site
        </button>
      </div>
    </div>
  `);

  // Добавляем обработчики после отрисовки модального окна
  setTimeout(() => {
    document.getElementById('vismyfriend-btn')?.addEventListener('click', () => {
      router.push('/v-is-my-friend/');
      closeModal();
    });

    document.getElementById('mysite-btn')?.addEventListener('click', () => {
      router.push('/landing/');
      closeModal();
    });
  }, 100);
};

const restartGame = () => {
  router.go(0);
};

const changeSet = () => {
  router.push("/see-all-sets-of-words/")
};

const otherGames = () => {
  if (route.params.missionName) {
    router.push(`/see-all-sets-of-words/${route.params.missionName}`);
  } else {
    router.push("/see-all-sets-of-words/");
  }
};

const openModal = (message) => {
  modalMessage.value = message;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const isInstructionsVisible = ref(false);

const backToSameSet = () => {
  if (hasMissionName.value) {
    router.push(`/see-all-sets-of-words/${route.params.missionName}`);
  } else {
    console.error("missionName is undefined");
    router.push("/see-all-sets-of-words/");
  }
}

const backToAllSets = () => {
  router.push("/see-all-sets-of-words/");
}

const hasMissionName = computed(() => {
  return !!route.params.missionName;
});

const backToIntroPage = () => {
  router.push("/");
}

const showInstructions = () => {
  isInstructionsVisible.value = true;
}

const hideInstructions = () => {
  isInstructionsVisible.value = false;
}

onMounted(() => {
  // Инициализируем трекер при загрузке
  updateStreak();
  cleanupOldVisits();

  // Для отладки
  console.log('Current streak:', legendaryDays.value);
  console.log('All visits:', getAllVisitDates());
});

</script>

<style lang="scss" scoped>
.star-icons {
  display: inline-flex;
  gap: 1px;
  align-items: center;
  margin-right: 5px;
}

.q-btn {
  display: flex;
  align-items: center;
}

.closeThisPage {
  display: block;
  margin: 0 auto;
  border-radius: 30px;
  background-color: transparent;
}

.goToMissions {
  color: green;
  border-radius: 50px;
}

.goBackPage {
  color: green;
  border-radius: 50px;
}

/* Контейнер для кнопок справа */
.right-buttons-container {
  position: absolute;
  top: 20px;
  right: -35px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 999;
}

.infoButton, .diceButton {
  width: 50px;
  height: 50px;
  background-size: cover;
  background-position: center;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.infoButton {
  background-image: url('../assets/images/ApyGlassEmoji2.png');
  display: none;
}

.diceButton {
  background-image: url('../assets/images/dice-image.png'); /* Путь к вашему изображению кубика */
}

.infoButton:hover, .diceButton:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.instructions {
  background: white;
  padding: 20px;
  margin: 10px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
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
  pointer-events: auto;
}

.top-menu-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 5px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transform: translateY(0);
  transition: all 0.3s ease;
  position: relative;
  pointer-events: auto;
}

.collapsed .top-menu-bar {
  transform: translateY(-80%);
}

.collapse-button {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90px;
  height: 20px;
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

/* Свернутое состояние */
.top-menu-wrapper.collapsed .top-menu-bar {
  transform: translateY(-80%);
  pointer-events: none;
}

.top-menu-wrapper.collapsed:hover .top-menu-bar {
  transform: translateY(0);
  pointer-events: auto;
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

  .right-buttons-container {
    top: 10px;
    right: -10px;
  }

  .infoButton, .diceButton {
    width: 40px;
    height: 40px;
  }
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
  display: flex;
  flex-direction: column;
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

.menu-button:disabled {
  pointer-events: none;
}

/* Стили для игрального кубика */
.dice-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
}

.dice-modal-content {
  background: white;
  padding: 30px;
  border-radius: 15px;
  width: 350px;
  height: 350px;
  position: relative;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.dice-close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.dice-close-button:hover {
  background-color: #f0f0f0;
}

.dice-container {
  margin-top: 20px;
}

.dice-roll-area {
  padding: 30px 20px;
  border: 2px dashed #ddd;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.dice-roll-area:hover {
  border-color: #4CAF50;
  background-color: #f9f9f9;
}

.dice-roll-area.rolling {
  border-color: #FF9800;
  background-color: #FFF3E0;
  animation: shake 0.5s ease-in-out;
}
.dice-text {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  min-height: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* Стили для перевода */
.translation-line {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 200px;
}

.translation-line::before,
.translation-line::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #ddd;
}

.translation-text {
  font-size: 14px;
  color: #666;
  font-style: italic;
  font-weight: normal;
  white-space: nowrap;
}

/* Скрываем перевод во время броска и при результате */
.dice-roll-area.rolling .translation-line,
.dice-result ~ .translation-line {
  display: none;
}

.countdown {
  font-size: 48px;
  font-weight: bold;
  color: #FF9800;
  animation: pulse 0.5s infinite alternate;
}

.dice-result {
  text-align: center;
}



.result-text {
  font-size: 18px;
  color: #666;
  margin-top: 10px;
}

/* Стили для игрального кубика */
.dice-number-rolling {
  font-size: 64px;
  font-weight: bold;
  color: #FF9800;
  animation: numberFlash 0.1s ease;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes numberFlash {
  0% { opacity: 0.7; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.8; transform: scale(1); }
}

.dice-roll-area.rolling .dice-number-rolling {
  animation: numberFlash 0.08s ease infinite;
}

/* Остальные стили остаются без изменений */
.dice-roll-area.rolling {
  border-color: #FF9800;
  background-color: #FFF3E0;
  animation: shake 0.8s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(-5px) rotate(-2deg); }
  50% { transform: translateX(5px) rotate(2deg); }
  75% { transform: translateX(-3px) rotate(-1deg); }
}

.result-number {
  font-size: 72px;
  font-weight: bold;
  color: #4CAF50;
  animation: bounce 0.5s ease;
}

@keyframes pulse {
  0% { opacity: 0.6; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1.1); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
  40% {transform: translateY(-10px);}
  60% {transform: translateY(-5px);}
}

/* Стили LegendaryMode */
.legendary-button {
  position: relative;
  padding-left: 40px !important;
}

.legendary-visual {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flame {
  font-size: 16px;
  line-height: 1;
  animation: flame-flicker 1.5s infinite alternate;
}

.days-counter {
  font-size: 10px;
  font-weight: bold;
  color: #090909;
  margin-top: -3px;
}

@keyframes flame-flicker {
  0%, 100% { opacity: 1; }
  25% { opacity: 0.8; }
  50% { opacity: 0.9; }
  75% { opacity: 0.7; }
}

.legendary-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
}

.legendary-modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-legendary-modal {
  margin-top: 15px;
  padding: 8px 15px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}


</style>
