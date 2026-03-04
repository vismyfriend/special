<template>
  <div class="verbs-slot-machine">
    <!-- Компактный заголовок с балансом -->
    <div class="slot-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">←</button>
        <h2 class="game-title">🎰 IRREGULAR VERBS</h2>
      </div>
      <div class="balance-container" :class="{ 'balance-low': balance < 100 }">
        <span class="balance-icon">💰</span>
        <span class="balance-value">${{ balance }}</span>
      </div>
    </div>

    <!-- Счетчик спинов -->
    <div class="stats-row">
      <div v-if="isJackpotSpin" class="jackpot-indicator">
        <span class="jackpot-star">⭐</span>
        <span class="jackpot-text">JACKPOT SPIN!</span>
        <span class="jackpot-star">⭐</span>
      </div>
    </div>

    <!-- Три барабана -->
    <div class="reels-container" v-if="reels.length > 0">
      <div class="reel-wrapper" v-for="(reel, index) in reels" :key="index">
        <div class="reel-label">
          <span class="form-badge">{{ reel.form }}</span>
        </div>

        <!-- Барабан с простой анимацией -->
        <div
          class="reel"
          :class="{
            'spinning': spinningStates[index],
            'match-highlight': matchHighlights[index]
          }"
        >
          <div class="reel-window">
            <div class="reel-content">
              <span class="word-en">{{ reel.currentWord }}</span>
              <span class="word-pron">{{ reel.currentPron }}</span>
              <span class="word-ru">{{ reel.currentRu }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Информация о совпадениях и выигрыше -->
    <div class="matches-info" :class="{ 'visible': hasSpunOnce }">
      <div class="match-badges">
        <div class="match-badge" :class="{ active: matchTypes.v1v2 }">
          <span class="match-icon">①→②</span>
          <span class="match-value">+$10</span>
        </div>
        <div class="match-badge" :class="{ active: matchTypes.v1v3 }">
          <span class="match-icon">①→③</span>
          <span class="match-value">+$20</span>
        </div>
        <div class="match-badge" :class="{ active: matchTypes.v2v3 }">
          <span class="match-icon">②→③</span>
          <span class="match-value">+$30</span>
        </div>
        <div class="match-badge jackpot" :class="{ active: matchTypes.all }">
          <span class="match-icon">🎰 JACKPOT</span>
          <span class="match-value">+$60</span>
        </div>
      </div>

      <!-- Анимация выигрыша -->
      <div v-if="winAmount > 0" class="win-animation" :key="winAmount">
        <span class="win-plus">+${{ winAmount }}</span>
        <span class="win-emoji" v-if="matchTypes.all">🌟🌟🌟</span>
        <span class="win-emoji" v-else-if="matchTypes.v2v3">✨✨</span>
        <span class="win-emoji" v-else>✨</span>
      </div>
    </div>

    <!-- Таблица всех глаголов -->
    <div class="verbs-table" :class="{ 'visible': hasSpunTwice }" v-if="verbsData.length > 0">
      <div class="table-body" ref="tableBodyRef">
        <div
          v-for="(verb, index) in verbsData"
          :key="index"
          class="table-row"
          :class="{
            'jackpot-row':
              verb.v1 === currentWords?.v1 &&
              verb.v2 === currentWords?.v2 &&
              verb.v3 === currentWords?.v3
          }"
        >
          <div
            class="table-cell"
            :class="{
              'highlight-cell': verb.v1 === currentWords?.v1,
              'jackpot-cell':
                verb.v1 === currentWords?.v1 &&
                verb.v2 === currentWords?.v2 &&
                verb.v3 === currentWords?.v3
            }"
          >
            {{ verb.v1 }}
          </div>
          <div
            class="table-cell"
            :class="{
              'highlight-cell': verb.v2 === currentWords?.v2,
              'jackpot-cell':
                verb.v1 === currentWords?.v1 &&
                verb.v2 === currentWords?.v2 &&
                verb.v3 === currentWords?.v3
            }"
          >
            {{ verb.v2 }}
          </div>
          <div
            class="table-cell"
            :class="{
              'highlight-cell': verb.v3 === currentWords?.v3,
              'jackpot-cell':
                verb.v1 === currentWords?.v1 &&
                verb.v2 === currentWords?.v2 &&
                verb.v3 === currentWords?.v3
            }"
          >
            {{ verb.v3 }}
          </div>
          <div class="table-cell">{{ verb.ru }}</div>
        </div>
      </div>
    </div>

    <!-- Кнопка вращения -->
    <button
      class="spin-btn"
      @click="spin"
      :disabled="isAnySpinning || balance < 3 || verbsData.length === 0"
      :class="{
        'jackpot-mode': isJackpotSpin,
        'no-money': balance < 3
      }"
    >
      <span class="spin-icon">{{ isAnySpinning ? '🌀' : (isJackpotSpin ? '⭐' : '🎰') }}</span>
      <span class="spin-text">{{ spinButtonText }}</span>
      <span class="spin-cost">$3</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { gameSlotMachineData } from '../dataForGames/GameSlotMachineData';

const router = useRouter();

// Получаем данные из пропсов или роута
const props = defineProps({
  missionName: {
    type: String,
    default: ''
  }
});

// Данные игры
const currentGameData = ref(null);
const verbsData = ref([]);

// Состояния
const balance = ref(112);
const spinCount = ref(0);
const winAmount = ref(0);
const spinningStates = ref([false, false, false]);
const tableBodyRef = ref(null);
// Добавь после других состояний
const hasSpunOnce = ref(false);
const hasSpunTwice = ref(false);


// Типы совпадений
const matchTypes = ref({
  v1v2: false,
  v1v3: false,
  v2v3: false,
  all: false
});

// Текущие слова на барабанах (изначально null)
const currentWords = ref(null);

// Конфигурация барабанов (изначально пустой массив)
const reels = ref([]);

// Таймеры
let spinTimeout = null;

// Вычисляемое свойство - джекпот только на 7 и 21 вращении
const isJackpotSpin = computed(() => {
  return spinCount.value === 7 || spinCount.value === 21;
});

// Вычисляемое свойство - крутится ли хоть один барабан
const isAnySpinning = computed(() => {
  return spinningStates.value.some(state => state === true);
});

// Подсветка совпавших барабанов
const matchHighlights = computed(() => {
  const highlights = [false, false, false];

  if (!matchTypes.value) return highlights;

  if (matchTypes.value.all) {
    return [true, true, true];
  }

  if (matchTypes.value.v1v2) {
    highlights[0] = true;
    highlights[1] = true;
  }
  if (matchTypes.value.v1v3) {
    highlights[0] = true;
    highlights[2] = true;
  }
  if (matchTypes.value.v2v3) {
    highlights[1] = true;
    highlights[2] = true;
  }

  return highlights;
});

// Поиск глагола по форме
const findVerbByForm = (form, type) => {
  if (!verbsData.value.length) return null;

  if (type === 'v1') {
    return verbsData.value.find(v => v.v1 === form);
  } else if (type === 'v2') {
    return verbsData.value.find(v => v.v2 === form);
  } else {
    return verbsData.value.find(v => v.v3 === form);
  }
};

// Функция для скролла к V2 форме
const scrollToV2 = () => {
  nextTick(() => {
    if (!tableBodyRef.value || !verbsData.value.length || !currentWords.value) return;

    const targetIndex = verbsData.value.findIndex(v => v.v2 === currentWords.value.v2);

    if (targetIndex !== -1) {
      const tableBody = tableBodyRef.value;
      const rows = tableBody.children;

      if (rows[targetIndex]) {
        rows[targetIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  });
};

// Проверка совпадений и расчет выигрыша
const checkMatchesAndCalculateWin = () => {
  if (!currentWords.value) return 0;

  // Находим глаголы для каждой формы
  const v1Verb = findVerbByForm(currentWords.value.v1, 'v1');
  const v2Verb = findVerbByForm(currentWords.value.v2, 'v2');
  const v3Verb = findVerbByForm(currentWords.value.v3, 'v3');

  // Проверяем совпадения
  const v1v2Match = v1Verb && v2Verb && v1Verb.v1 === v2Verb.v1;
  const v1v3Match = v1Verb && v3Verb && v1Verb.v1 === v3Verb.v1;
  const v2v3Match = v2Verb && v3Verb && v2Verb.v1 === v3Verb.v1;
  const allMatch = v1v2Match && v1v3Match && v2v3Match;

  // Обновляем типы совпадений
  matchTypes.value = {
    v1v2: v1v2Match,
    v1v3: v1v3Match,
    v2v3: v2v3Match,
    all: allMatch
  };

  // Рассчитываем выигрыш
  let win = 0;
  if (allMatch) {
    win = 60;
  } else {
    if (v1v2Match) win += 10;
    if (v1v3Match) win += 20;
    if (v2v3Match) win += 30;
  }

  return win;
};

// Обновление баланса с анимацией
const updateBalanceWithWin = (win) => {
  if (win > 0) {
    winAmount.value = win;
    balance.value += win;

    setTimeout(() => {
      winAmount.value = 0;
    }, 2000);
  }
};

// Текст кнопки
const spinButtonText = computed(() => {
  if (verbsData.value.length === 0) return 'LOADING...';
  if (isAnySpinning.value) return 'It iS SPINNING - вращается ';
  if (balance.value < 3) return 'NO MONEY = NO HONEY, honey';
  if (isJackpotSpin.value) return 'Vincent loves you!';
  return 'CLICK TO SPIN (чтобы вращать)';
});

// Функция вращения
const spin = () => {
  if (isAnySpinning.value || balance.value < 3 || !verbsData.value.length) return;

  // При первом спине показываем таблицу и информацию
  // Логика поэтапного появления
  if (!hasSpunOnce.value) {
    hasSpunOnce.value = true; // После первого спина показываем matches-info
  } else if (!hasSpunTwice.value) {
    hasSpunTwice.value = true; // После второго спина показываем verbs-table
  }

  balance.value -= 3;
  if (spinTimeout) clearTimeout(spinTimeout);

  spinCount.value++;
  spinningStates.value = [true, true, true];

  let spinIterations = 0;
  const maxIterations = 15;

  const spinInterval = setInterval(() => {
    const randomVerb = verbsData.value[Math.floor(Math.random() * verbsData.value.length)];

    if (spinningStates.value[0]) {
      reels.value[0].currentWord = randomVerb.v1;
      reels.value[0].currentPron = randomVerb.v1Pron;
      reels.value[0].currentRu = randomVerb.v1ru;
    }
    if (spinningStates.value[1]) {
      reels.value[1].currentWord = randomVerb.v2;
      reels.value[1].currentPron = randomVerb.v2Pron;
      reels.value[1].currentRu = randomVerb.v2ru;
    }
    if (spinningStates.value[2]) {
      reels.value[2].currentWord = randomVerb.v3;
      reels.value[2].currentPron = randomVerb.v3Pron;
      reels.value[2].currentRu = randomVerb.v3ru;
    }

    spinIterations++;

    if (spinIterations >= maxIterations) {
      clearInterval(spinInterval);

      if (isJackpotSpin.value) {
        const jackpotVerb = verbsData.value[Math.floor(Math.random() * verbsData.value.length)];
        currentWords.value = {
          v1: jackpotVerb.v1,
          v2: jackpotVerb.v2,
          v3: jackpotVerb.v3,
          ru: jackpotVerb.ru
        };
      } else {
        const v1Verb = verbsData.value[Math.floor(Math.random() * verbsData.value.length)];
        const v2Verb = verbsData.value[Math.floor(Math.random() * verbsData.value.length)];
        const v3Verb = verbsData.value[Math.floor(Math.random() * verbsData.value.length)];

        currentWords.value = {
          v1: v1Verb.v1,
          v2: v2Verb.v2,
          v3: v3Verb.v3,
          ru: 'mixed'
        };
      }

      const stopDelays = [0, 100, 200];

      stopDelays.forEach((delay, index) => {
        setTimeout(() => {
          spinningStates.value[index] = false;

          if (index === 0) {
            const v1Verb = verbsData.value.find(v => v.v1 === currentWords.value.v1);
            reels.value[0].currentWord = currentWords.value.v1;
            reels.value[0].currentPron = v1Verb?.v1Pron || '';
            reels.value[0].currentRu = v1Verb?.v1ru || '';
          } else if (index === 1) {
            const v2Verb = verbsData.value.find(v => v.v2 === currentWords.value.v2);
            reels.value[1].currentWord = currentWords.value.v2;
            reels.value[1].currentPron = v2Verb?.v2Pron || '';
            reels.value[1].currentRu = v2Verb?.v2ru || '';
          } else {
            const v3Verb = verbsData.value.find(v => v.v3 === currentWords.value.v3);
            reels.value[2].currentWord = currentWords.value.v3;
            reels.value[2].currentPron = v3Verb?.v3Pron || '';
            reels.value[2].currentRu = v3Verb?.v3ru || '';
          }

          if (index === 2) {
            const win = checkMatchesAndCalculateWin();
            updateBalanceWithWin(win);
            scrollToV2();
          }
        }, delay);
      });
    }
  }, 60);
};

// Навигация назад
const goBack = () => {
  if (spinTimeout) clearTimeout(spinTimeout);
  router.back();
};

// Функция инициализации игры
const initGame = () => {
  if (!verbsData.value.length) return;

  currentWords.value = {
    v1: verbsData.value[0].v1,
    v2: verbsData.value[0].v2,
    v3: verbsData.value[0].v3,
    ru: verbsData.value[0].ru
  };

  reels.value = [
    {
      form: 'V1',
      currentWord: verbsData.value[0].v1,
      currentPron: verbsData.value[0].v1Pron,
      currentRu: verbsData.value[0].v1ru
    },
    {
      form: 'V2',
      currentWord: verbsData.value[0].v2,
      currentPron: verbsData.value[0].v2Pron,
      currentRu: verbsData.value[0].v2ru
    },
    {
      form: 'V3',
      currentWord: verbsData.value[0].v3,
      currentPron: verbsData.value[0].v3Pron,
      currentRu: verbsData.value[0].v3ru
    }
  ];
};

// Инициализация
onMounted(() => {
  // Определяем название миссии (из пропсов или роута)
  const missionName = props.missionName || router.currentRoute.value.params.missionName;

  if (missionName && gameSlotMachineData[missionName]) {
    currentGameData.value = gameSlotMachineData[missionName];
    verbsData.value = currentGameData.value.verbsData || [];

    // Инициализируем игру только если есть данные
    if (verbsData.value.length > 0) {
      initGame();
    } else {
      console.error('Нет данных для миссии:', missionName);
    }
  } else {
    console.error('Миссия не найдена:', missionName);
    // Добавляем fallback на дефолтные данные для тестирования
    if (gameSlotMachineData.irregularVerbsAllOfThem) {
      verbsData.value = gameSlotMachineData.irregularVerbsAllOfThem.verbsData;
      initGame();
    }
  }
});
</script>

<style scoped>
.verbs-slot-machine {
  max-width: 500px;
  width: 100%;
  margin: 5px auto;
  padding: 12px;
  background: linear-gradient(145deg, #1a2639, #0f172a);
  border-radius: 28px;
  border: 2px solid #ffd700;
  box-shadow: 0 8px 0 #b8860b, 0 15px 25px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
}

.slot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 5px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(145deg, #ffffff, #e6e9f0);
  border: 2px solid #ffd700;
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 0 #b8860b;
  transition: 0.05s linear;
  flex-shrink: 0;
}

.back-btn:active {
  transform: translateY(3px);
  box-shadow: none;
}

.game-title {
  font-size: 16px;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
  margin: 0;
  white-space: nowrap;
}

.balance-container {
  background: linear-gradient(145deg, #2a3a4a, #1a2a3a);
  border: 2px solid #ffd700;
  border-radius: 30px;
  padding: 6px 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 0 #b8860b;
}

.balance-container.balance-low {
  border-color: #ff6b6b;
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.balance-icon {
  font-size: 18px;
}

.balance-value {
  font-size: 18px;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
  min-width: 60px;
  text-align: right;
}

.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 5px;
}

.spin-counter {
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #ffd700;
  border-radius: 30px;
  padding: 4px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(4px);
}

.spin-counter.jackpot-glow {
  border-color: #ff69b4;
  box-shadow: 0 0 15px #ff69b4;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.counter-number {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 8px #ffd700;
  min-width: 30px;
  text-align: center;
}

.counter-label {
  font-size: 11px;
  color: #aaa;
  text-transform: uppercase;
}

.jackpot-indicator {
  font-size: 12px;
  font-weight: bold;
  color: #ffd700;
  background: rgba(255, 215, 0, 0.15);
  padding: 4px 10px;
  border-radius: 30px;
  border: 2px solid #ffd700;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  gap: 5px;
}

.jackpot-star {
  animation: twinkle 1s infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.reels-container {
  display: grid;
  grid-template-columns: repeat(3, 110px); /* Фиксированная ширина колонок */
  justify-content: center;
  gap: 6px;
  margin-bottom: 10px;
  background: linear-gradient(145deg, #0a0f1a, #151f2f);
  padding: 12px 6px;
  border-radius: 24px;
  border: 2px solid #ffd700;
}

.reel-wrapper {
  text-align: center;
  min-width: 0;
  flex: 0 0 auto; /* Запрещаем растягивание */

}

.reel-label {
  margin-bottom: 6px;
}

.form-badge {
  background: #ffd700;
  color: #0f172a;
  padding: 3px 8px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  box-shadow: 0 2px 0 #b8860b;
}

.reel {
  background: linear-gradient(145deg, #f0e6d2, #d4c4a8);
  border-radius: 12px;
  padding: 3px;
  border: 2px solid #ffd700;
  box-shadow: 0 4px 0 #b8860b, inset 0 0 10px rgba(255, 215, 0, 0.3);
  transition: all 0.3s ease;
}

.reel.spinning {
  animation: spinGlow 0.3s infinite;
}

@keyframes spinGlow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.3); }
}

.reel.match-highlight {
  border-color: #4caf50;
  box-shadow: 0 4px 0 #2e7d32, 0 0 20px #4caf50;
}

.reel-window {
  background: linear-gradient(145deg, #fff9e6, #f0e0b0);
  border-radius: 10px;
  padding: 12px 4px;
  border: 1px solid #b8860b;
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 10px;
}

.reel-content {
  text-align: center;
}

.word-pron {
  font-size: 12px;
  color: #4a5568;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
  background: rgba(255, 215, 0, 0.1);
  padding: 1px 4px;
  border-radius: 4px;
  margin: 2px 0;
}
.word-en {
  font-size: 18px;
  font-weight: bold;
  color: #0f172a;
  text-transform: lowercase;
  display: block;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.word-ru {
  font-size: 10px;
  color: #4a5568;
  margin-top: 2px;
  opacity: 0.8;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.matches-info {
  margin-bottom: 10px;
  position: relative;
  opacity: 0;
  transition: opacity 0.5s ease;


}

.match-badges {
  display: flex;
  gap: 4px;
  justify-content: center;
  flex-wrap: wrap;
}

.match-badge {
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #4a5568;
  border-radius: 20px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #aaa;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.match-badge.active {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.2);
  color: #fff;
  box-shadow: 0 0 10px #4caf50;
}

.match-badge.jackpot.active {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
  box-shadow: 0 0 15px #ffd700;
}

.match-icon {
  font-weight: bold;
}

.match-value {
  font-weight: bold;
}

.win-animation {
  position: absolute;
  top: 255px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(145deg, #ffd700, #ffa500);
  padding: 8px 20px;
  border-radius: 30px;
  border: 2px solid #fff;
  box-shadow: 0 4px 0 #b8860b, 0 0 30px #ffd700;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: winSlide 0.3s ease-out, winPulse 1s infinite;
  z-index: 10;
  white-space: nowrap;
}

@keyframes winSlide {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes winPulse {
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.05); }
}

.win-plus {
  font-size: 16px;
  font-weight: bold;
  color: #0f172a;
}

.win-emoji {
  font-size: 16px;
  animation: spin 2s infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin-btn {
  width: 100%;
  background: linear-gradient(180deg, #ffd700, #b8860b);
  border: none;
  border-radius: 40px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 6px 0 #7a5c00, 0 8px 15px rgba(0, 0, 0, 0.5);
  transition: 0.05s linear;
  border: 2px solid #fff;
  margin: 15px 0 10px 0;
  position: relative;
}

.spin-btn.jackpot-mode {
  background: linear-gradient(180deg, #ff69b4, #c71585);
  box-shadow: 0 6px 0 #8b008b, 0 8px 20px rgba(255, 105, 180, 0.5);
  animation: jackpotGlow 1s infinite;
}

.spin-btn.no-money {
  background: linear-gradient(180deg, #808080, #4a4a4a);
  box-shadow: 0 6px 0 #2d2d2d;
  cursor: not-allowed;
  opacity: 0.7;
}

@keyframes jackpotGlow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

.spin-btn:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #7a5c00, 0 5px 10px rgba(0, 0, 0, 0.5);
}

.spin-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: translateY(2px);
  box-shadow: 0 3px 0 #7a5c00;
}

.spin-icon {
  font-size: 22px;
  animation: bounce 0.5s infinite;
  flex-shrink: 0;
}

@keyframes bounce {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg) scale(1.1); }
}

.spin-text {
  color: #0f172a;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
  white-space: nowrap;
}

.spin-cost {
  position: absolute;
  right: 12px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  border: 1px solid #fff;
}

/* Таблица глаголов */
.verbs-table {
  background: linear-gradient(145deg, #1e293b, #0f172a);
  border: 2px solid #ffd700;
  border-radius: 16px;
  overflow: hidden;
  max-height: 230px;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transition: opacity 0.5s ease;


}

/* Классы для показа элементов */
.matches-info.visible,
.verbs-table.visible {
  opacity: 1;

}


.table-body {
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.05);
  scroll-behavior: smooth; /* Плавный скролл */
}

.table-body::-webkit-scrollbar {
  width: 6px;
}

.table-body::-webkit-scrollbar-track {
  background: rgba(255, 215, 0, 0.1);
}

.table-body::-webkit-scrollbar-thumb {
  background: #ffd700;
  border-radius: 3px;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 6px 4px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  transition: all 0.3s ease;
}

.table-row.jackpot-row {
  background: rgba(255, 215, 0, 0.2);
  border-left: 4px solid #ffd700;
  border-right: 4px solid #ffd700;
  animation: jackpotRowPulse 1s infinite;
}

@keyframes jackpotRowPulse {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

.table-cell {
  overflow: hidden;
  align-content: center;
  padding: 0 2px;
  transition: all 0.3s ease;
}

.table-cell.highlight-cell {
  background: rgba(76, 175, 80, 0.3);
  border-radius: 4px;
  font-weight: bold;
  color: #ffd700;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.table-cell.jackpot-cell {
  background: rgba(255, 215, 0, 0.4);
  border-radius: 4px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 8px #ffd700;
  box-shadow: 0 0 15px #ffd700;
  animation: jackpotCellPulse 1s infinite;
}

@keyframes jackpotCellPulse {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.3); }
}

@media (max-width: 500px) {
  .verbs-slot-machine {
    max-width: 100%;
    padding: 8px;
  }

  .word-en {
    font-size: 16px;
  }



  .spin-text {
    font-size: 12px;
  }

  .table-header {
    font-size: 11px;
  }

  .table-row {
    padding: 4px 2px;
    font-size: 12px;
  }
}
</style>
