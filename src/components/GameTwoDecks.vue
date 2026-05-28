<template>
  <div class="game-container" v-if="currentMissionData">
    <h2 class="game-title">{{ currentMissionData.title }}</h2>

    <div class="decks-container" :style="{ gridTemplateColumns: `repeat(${decksCount}, minmax(200px, 1fr))` }">
      <div v-for="(deck, deckKey) in currentMissionData.decks" :key="deckKey" class="deck-section">
        <h3 class="deck-title">
          <span class="deck-icon">{{ deck.icon || '🎴' }}</span>
          {{ deck.name }}
        </h3>

        <div class="deck-cards">
          <!-- Колода (стопка оставшихся карт) -->
          <div class="deck-stack" v-if="remainingCards[deckKey]?.length > 0">
            <div class="stack-card" v-for="i in Math.min(remainingCards[deckKey].length, 3)" :key="i">
              <div class="stack-card-inner"></div>
            </div>
          </div>

          <!-- Активная карта -->
          <div class="card" :class="{ 'card-empty': !activeCards[deckKey] }" @click="drawCard(deckKey)">
            <div class="card-content" v-if="activeCards[deckKey]">
              <div class="card-eng">{{ activeCards[deckKey].eng }}</div>
              <div class="card-hint" v-if="activeCards[deckKey].hint">{{ activeCards[deckKey].hint }}</div>
              <div class="card-ru">{{ activeCards[deckKey].ru }}</div>
            </div>
            <div class="card-placeholder" v-else>
              <span class="placeholder-icon">{{ deck.icon || '🎴' }}</span>
              <span class="placeholder-text">нажми</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопки глобального управления -->
<!--    <div class="global-controls">-->
<!--      <button class="control-btn reset-btn" @click="resetGame">-->
<!--        🔄 Перетасовать всё-->
<!--      </button>-->
<!--    </div>-->

    <!-- Модальное окно -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <p>{{ modalMessage }}</p>
        <button @click="closeModal">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import twoDecksData from '../dataForGames/twoDecks-data';

const route = useRoute();

// Данные игры
const currentMissionData = ref(null);
const decksKeys = ref([]);
const originalDecks = ref({});
const remainingCards = ref({});
const activeCards = ref({});

// Модальное окно
const showModal = ref(false);
const modalMessage = ref('');

// Количество колод
const decksCount = computed(() => decksKeys.value.length);

// Перемешивание массива
const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Инициализация игры
const initGame = () => {
  if (!currentMissionData.value) return;

  const decks = currentMissionData.value.decks;
  decksKeys.value = Object.keys(decks);

  // Сохраняем оригинальные колоды
  originalDecks.value = {};
  decksKeys.value.forEach(key => {
    originalDecks.value[key] = [...decks[key].cards];
  });

  resetGame();
};

// Перетасовать всё
const resetGame = () => {
  decksKeys.value.forEach(key => {
    remainingCards.value[key] = shuffle([...originalDecks.value[key]]);
    activeCards.value[key] = null;
  });
};

// Вытянуть карту из колоды
const drawCard = (deckKey) => {
  if (!remainingCards.value[deckKey]?.length) {
    openModal(`📭 В колоде "${currentMissionData.value.decks[deckKey].name}" закончились карты!`);
    return;
  }

  // Если есть активная карта — возвращаем её в колоду (в конец)
  if (activeCards.value[deckKey]) {
    remainingCards.value[deckKey].push(activeCards.value[deckKey]);
  }

  // Достаём новую карту
  const newCard = remainingCards.value[deckKey].shift();
  activeCards.value[deckKey] = newCard;
};

// Модальное окно
const openModal = (message) => {
  modalMessage.value = message;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// Загрузка данных по маршруту
onMounted(() => {
  const missionName = route.params.missionName;
  const missionData = twoDecksData[missionName];

  if (!missionData) {
    console.error(`Миссия "${missionName}" не найдена`);
    openModal(`❌ Миссия "${missionName}" не найдена!`);
    return;
  }

  currentMissionData.value = missionData;
  initGame();
});
</script>

<style lang="scss" scoped>
.game-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.game-title {
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin-bottom: 24px;
}

.decks-container {
  display: grid;
  gap: 20px;
  margin-bottom: 30px;
}

.deck-section {
  background: #f5f5f5;
  border-radius: 16px;
  padding: 16px 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.deck-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #444;
}

.deck-icon {
  font-size: 20px;
}

.deck-cards {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* СТОПКА КАРТ (колода) */
.deck-stack {
  position: relative;
  width: 180px;
  height: 110px;
  margin-bottom: -70px;
  z-index: 1;
}

.stack-card {
  position: absolute;
  width: 180px;
  height: 110px;
  left: 0;
  background: #2c3e50;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.stack-card:nth-child(1) { top: -6px; left: 4px; background: #34495e; }
.stack-card:nth-child(2) { top: -3px; left: 2px; background: #3d5a73; }
.stack-card:nth-child(3) { top: 0; left: 0; background: #2c3e50; }

.stack-card-inner {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: repeating-linear-gradient(
      45deg,
      rgba(255,255,255,0.08) 0px,
      rgba(255,255,255,0.08) 8px,
      transparent 8px,
      transparent 16px
  );
}

/* АКТИВНАЯ КАРТА */
.card {
  width: 180px;
  min-height: 110px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;
  position: relative;
  z-index: 10;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
}

.card-empty {
  background: #fafafa;
  border: 1px dashed #ccc;

  &:hover {
    transform: translateY(-2px);
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  padding: 12px 10px;
  text-align: center;
  gap: 6px;
}

.card-eng {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.3;
}

.card-hint {
  font-size: 11px;
  color: #999;
  font-style: italic;
  letter-spacing: 0.3px;
}

.card-ru {
  font-size: 13px;
  color: #555;
  padding-top: 4px;
  border-top: 1px solid #eee;
  margin-top: 2px;
}

.card-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 110px;
  gap: 6px;
}

.placeholder-icon {
  font-size: 28px;
  opacity: 0.5;
}

.placeholder-text {
  font-size: 11px;
  color: #aaa;
  font-weight: 400;
}

/* Глобальные кнопки */
.global-controls {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.control-btn {
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #e0e0e0;
  color: #333;

  &:hover {
    transform: translateY(-1px);
    background: #d0d0d0;
  }
}

.reset-btn {
  background: #4a90e2;
  color: white;

  &:hover {
    background: #3a7bc8;
  }
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  max-width: 280px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-content p {
  font-size: 15px;
  margin-bottom: 20px;
  color: #333;
}

.modal-content button {
  padding: 8px 20px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 14px;
}

/* Адаптация под маленькие экраны */
@media (max-width: 700px) {
  .decks-container {
    grid-template-columns: 1fr !important;
    gap: 16px;
  }

  .deck-section {
    padding: 12px;
  }

  .card, .stack-card {
    width: 160px;
    height: 100px;
  }

  .stack-card {
    height: 100px;
  }

  .card-content {
    padding: 10px 8px;
  }

  .card-eng {
    font-size: 14px;
  }

  .card-ru {
    font-size: 12px;
  }

  .card-hint {
    font-size: 10px;
  }

  .deck-stack {
    width: 160px;
    height: 100px;
    margin-bottom: -65px;
  }
}
</style>
