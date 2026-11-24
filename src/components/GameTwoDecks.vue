<template>
  <div class="game-container" v-if="currentMissionData">
    <h2 class="game-title">{{ currentMissionData.title }}</h2>

    <div class="decks-container">
      <div v-for="(deck, deckKey) in currentMissionData.decks" :key="deckKey" class="deck-section">
        <!-- Шестерёнка -->
        <button
          class="settings-btn"
          :class="{ active: openSettings[deckKey] }"
          @click.stop="toggleSettings(deckKey)"
          aria-label="Настройки колоды"
        >
          ⚙️
        </button>

        <!-- Меню настроек -->
        <div v-if="openSettings[deckKey]" class="settings-menu" @click.stop>
          <div class="direction-toggle">
            <button
              class="direction-option"
              :class="{ active: languageModes[deckKey] === 'en-ru' }"
              @click="setLanguageMode(deckKey, 'en-ru')"
            >
              EN
            </button>
            <button
              class="direction-option"
              :class="{ active: languageModes[deckKey] === 'ru-en' }"
              @click="setLanguageMode(deckKey, 'ru-en')"
            >
              RU
            </button>
          </div>

          <div class="settings-divider"></div>

          <button
            class="settings-action"
            :disabled="!canGoBack(deckKey)"
            @click="previousCard(deckKey)"
          >
            ← карта до этой
          </button>
        </div>

        <h3 class="deck-title">
          <span class="deck-icon">{{ deck.icon || '🎴' }}</span>
          {{ deck.name }}
        </h3>

        <div class="deck-cards">
          <!-- Спиральная стопка -->
          <div class="deck-stack" v-if="remainingCards[deckKey]?.length > 0">
            <div
              v-for="(card, index) in remainingCards[deckKey]"
              :key="card.id ?? index"
              class="stack-card"
              :class="{
                'is-top': index === remainingCards[deckKey].length - 1,
                'has-shadow': index >= remainingCards[deckKey].length - 5,
              }"
              :style="cardStyles[deckKey]?.[index]"
              @click="index === remainingCards[deckKey].length - 1 && drawCard(deckKey)"
            >
              <img
                v-if="!coverImageFailed[deckKey]"
                src="../assets/images/nextCard.png"
                alt="Card Back"
                class="stack-card-img"
                decoding="async"
                @error="onCoverImageError(deckKey)"
              />
              <div v-else class="stack-card-inner cover-fallback"></div>
            </div>
          </div>

          <!-- Активная карта -->
          <div
            class="card"
            :class="{ 'card-empty': !activeCards[deckKey] }"
            @click="drawCard(deckKey)"
          >
            <div class="card-content" v-if="activeCards[deckKey]">
              <div class="card-word-row">
                <span class="card-word">{{ getWord(activeCards[deckKey], deckKey) }}</span>
                <span
                  v-if="isMainWordEnglish(deckKey) && activeCards[deckKey].hint"
                  class="card-hint"
                >
                  {{ activeCards[deckKey].hint }}
                </span>
              </div>

              <div
                class="card-translation"
                :class="{ blurred: !revealed[deckKey] }"
                @click.stop="onTranslationClick(deckKey)"
              >
                <span>{{ getTranslation(activeCards[deckKey], deckKey) }}</span>
                <span
                  v-if="!isMainWordEnglish(deckKey) && activeCards[deckKey].hint"
                  class="card-hint card-hint-inline"
                >
                  {{ activeCards[deckKey].hint }}
                </span>
              </div>
            </div>
            <div class="card-placeholder" v-else>
              <span class="placeholder-icon">{{ deck.icon || '🎴' }}</span>
              <span class="placeholder-text">тяни карту</span>
            </div>
          </div>
        </div>
      </div>
    </div>

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
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import twoDecksData from '../dataForGames/twoDecks-data';

const route = useRoute();

const currentMissionData = ref(null);
const decksKeys = ref([]);
const originalDecks = ref({});
const remainingCards = ref({});
const activeCards = ref({});
const usedCards = ref({});

const languageModes = reactive({});
const revealed = reactive({});
const openSettings = reactive({});
const coverImageFailed = reactive({});

const onCoverImageError = (deckKey) => {
  coverImageFailed[deckKey] = true;
};

const showModal = ref(false);
const modalMessage = ref('');

const decksCount = computed(() => decksKeys.value.length);

const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const initGame = () => {
  if (!currentMissionData.value) return;

  const decks = currentMissionData.value.decks;
  decksKeys.value = Object.keys(decks);

  originalDecks.value = {};
  decksKeys.value.forEach(key => {
    originalDecks.value[key] = [...decks[key].cards];
    coverImageFailed[key] = false;
    languageModes[key] = 'en-ru';
    revealed[key] = false;
    openSettings[key] = false;
  });

  resetGame();
};

const resetGame = () => {
  decksKeys.value.forEach(key => {
    remainingCards.value[key] = shuffle([...originalDecks.value[key]]);
    activeCards.value[key] = null;
    usedCards.value[key] = [];
    revealed[key] = false;
  });
};

const toggleSettings = (deckKey) => {
  const willOpen = !openSettings[deckKey];
  decksKeys.value.forEach(key => { openSettings[key] = false; });
  openSettings[deckKey] = willOpen;
};

const setLanguageMode = (deckKey, mode) => {
  languageModes[deckKey] = mode;
  revealed[deckKey] = false;
  openSettings[deckKey] = false;
};

const getWord = (card, deckKey) => {
  if (!card) return '';
  return languageModes[deckKey] === 'en-ru' ? card.eng : card.ru;
};

const getTranslation = (card, deckKey) => {
  if (!card) return '';
  return languageModes[deckKey] === 'en-ru' ? card.ru : card.eng;
};

const isMainWordEnglish = (deckKey) => languageModes[deckKey] === 'en-ru';

const onTranslationClick = (deckKey) => {
  if (!revealed[deckKey]) {
    revealed[deckKey] = true;
  } else {
    drawCard(deckKey);
  }
};

const canGoBack = (deckKey) => (usedCards.value[deckKey]?.length || 0) > 0;

const previousCard = (deckKey) => {
  if (!canGoBack(deckKey)) return;

  if (activeCards.value[deckKey]) {
    remainingCards.value[deckKey].unshift(activeCards.value[deckKey]);
  }

  activeCards.value[deckKey] = usedCards.value[deckKey].pop();
  revealed[deckKey] = false;
};

const drawCard = (deckKey) => {
  if (!remainingCards.value[deckKey]?.length) {
    remainingCards.value[deckKey] = shuffle([...originalDecks.value[deckKey]]);
    usedCards.value[deckKey] = [];
    activeCards.value[deckKey] = null;
  }

  if (activeCards.value[deckKey]) {
    usedCards.value[deckKey].push(activeCards.value[deckKey]);
    activeCards.value[deckKey] = null;
  }

  activeCards.value[deckKey] = remainingCards.value[deckKey].shift();
  revealed[deckKey] = false;
  openSettings[deckKey] = false;
};

const getCardStyle = (index) => {
  const angleStep = 4;
  const radius = 10;

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

const cardStyles = computed(() => {
  const result = {};
  for (const key of decksKeys.value) {
    const arr = remainingCards.value[key] || [];
    result[key] = arr.map((_, i) => getCardStyle(i));
  }
  return result;
});

const openModal = (message) => {
  modalMessage.value = message;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

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

/* DESKTOP: 2 колонки, крупные карточки */
.decks-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

.deck-section {
  position: relative;
  background: #f5f5f5;
  border-radius: 16px;
  padding: 24px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

}

/* Шестерёнка */
.settings-btn {
  opacity: 0.4;
  position: absolute;
  top: -5px;
  right: -5px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  font-size: 18px;
  cursor: pointer;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, background 0.15s ease, opacity 0.15s ease;

  &:hover {
    transform: scale(1.08);
    background: #f0f0f0;
    opacity: 1;
  }

  &.active {
    background: #4a90e2;
    color: white;
    opacity: 1;
  }
}

/* Меню настроек */
.settings-menu {
  position: absolute;
  top: 38px;
  right: 4px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
  padding: 12px;
  z-index: 20;
  min-width: 200px;
  text-align: left;
}

.direction-toggle {
  display: flex;
  background: #eef2f7;
  border-radius: 8px;
  padding: 3px;
  gap: 3px;
}

.direction-option {
  flex: 1;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7785;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
  white-space: nowrap;

  &:hover {
    color: #4a90e2;
  }

  &.active {
    background: white;
    color: #1a1a2e;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }
}

.settings-divider {
  height: 1px;
  background: #eee;
  margin: 10px 0;
}

.settings-action {
  display: block;
  width: 100%;
  padding: 10px 12px;
  background: #f0f4f9;
  color: #333;
  border: 1px solid #d8e2ee;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover:not(:disabled) {
    background: #e1ebf6;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

.deck-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  padding-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 8px;
  color: #444;
}

.deck-icon {
  font-size: 24px;
}

.deck-cards {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* СТОПКА — крупнее на десктопе */
.deck-stack {
  position: relative;
  width: 240px;
  height: 150px;
  margin-bottom: -90px;
  z-index: 1;
}

.stack-card {
  position: absolute;
  width: 240px;
  height: 150px;
  top: 0;
  left: 0;
  border-radius: 12px;
  background: white;
  border: 1px solid rgba(106, 106, 106, 0.73);
  overflow: hidden;
}

.stack-card.has-shadow {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.stack-card.is-top {
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  will-change: transform;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translate(var(--x), var(--y)) rotate(var(--angle)) scale(1.02) translateY(-12px) translateX(12px);
    box-shadow: 0 8px 14px rgba(0, 0, 0, 0.18);
  }
}

.stack-card-img {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: fill;
  display: block;
}

.cover-fallback {
  background: #2c3e50;
  background-image: repeating-linear-gradient(
      45deg,
      rgba(255,255,255,0.08) 0px,
      rgba(255,255,255,0.08) 8px,
      transparent 8px,
      transparent 16px
  );
}

.stack-card-inner {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

/* АКТИВНАЯ КАРТА — крупнее на десктопе */
.card {
  width: 240px;
  min-height: 150px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;
  position: relative;
  z-index: 10;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
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
  padding: 18px 14px;
  text-align: center;
  gap: 8px;
}

.card-word-row {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-word {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.3;
}

.card-hint {
  font-size: 15px;
  color: #999;
  font-style: italic;
  letter-spacing: 0.3px;
}

.card-translation {
  font-size: 16px;
  color: #555;
  padding-top: 6px;
  border-top: 1px solid #eee;
  margin-top: 4px;
  cursor: pointer;
  transition: filter 0.2s ease;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  &.blurred {
    filter: blur(5px);
  }
  &:hover {
    filter: blur(0);

  }
}

.card-hint-inline {
  display: block;
}

.card-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px;
  gap: 8px;
}

.placeholder-icon {
  font-size: 36px;
  opacity: 0.5;
}

.placeholder-text {
  font-size: 13px;
  color: #aaa;
  font-weight: 400;
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

/* ===== ПЛАНШЕТ: одна колонка, средний размер ===== */
@media (max-width: 900px) {
  .decks-container {
    grid-template-columns: 1fr;
  }

  .deck-stack {
    width: 200px;
    height: 125px;
    margin-bottom: -78px;
  }

  .stack-card {
    width: 200px;
    height: 125px;
  }

  .card {
    width: 200px;
    min-height: 125px;
  }

  .card-word {
    font-size: 18px;
  }

  .card-translation {
    font-size: 14px;
  }

  .card-placeholder {
    height: 125px;
  }
}

/* ===== МОБИЛЬНАЯ: как было, всё компактное ===== */
@media (max-width: 700px) {
  .decks-container {
    grid-template-columns: 1fr !important;
    gap: 6px;
    margin-bottom: 12px;
  }

  .deck-section {
    padding: 5px;
  }

  .deck-title {
    font-size: 16px;
    margin-bottom: 16px;
    padding-bottom: 15px;
  }

  .card-content {
    padding: 10px 8px;
  }

  .card-word {
    font-size: 14px;
  }

  .card-translation {
    font-size: 12px;
  }

  .deck-stack {
    width: 160px;
    height: 100px;
    margin-bottom: -65px;
  }

  .stack-card {
    width: 160px;
    height: 100px;
  }

  .card {
    width: 160px;
    min-height: 100px;
  }

  .card-placeholder {
    height: 100px;
  }

  .settings-btn {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
}
</style>
