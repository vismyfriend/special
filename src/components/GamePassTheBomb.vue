<template>
  <div class="bomb-game-container" :class="theme">
    <SoundManager />
    <QuickNotes />

    <!-- HEADER -->
    <div class="game-header">
      <div class="header-left">
        <h1>Pass it </h1>
      </div>
      <div class="header-center">
        <span class="turn-indicator" v-if="!isGameActive && !isExploded">
          -
        </span>
        <span class="turn-indicator" v-else-if="isGameActive">
          🔥 RUN! 🔥
        </span>
        <span class="turn-indicator exploded" v-else>
          💥 BOOM! 💥
        </span>
      </div>
      <div class="header-right">
        <button
          class="timer-toggle"
          :class="{ 'timer-off': !timerEnabled }"
          @click="toggleTimer"
          :title="timerEnabled ? 'Turn off timer' : 'Turn on timer'"
        >
          {{ timerEnabled ? '⏱️' : '∞' }}
        </button>
        <button class="theme-toggle" @click="toggleTheme">
          {{ theme === 'dark' ? '☀️' : '🌙' }}
        </button>
      </div>
    </div>

    <!-- MAIN GAME AREA -->
    <div class="game-table" v-if="!isExploded">

      <!-- CENTER: QUESTION CARD -->
      <div class="question-center">
        <transition name="card-flip" mode="out-in">
          <div v-if="currentQuestion" :key="currentQuestion.question" class="question-card">
            <div class="question-card-header">
              <span class="q-counter">{{ answeredCount }} / {{ totalQuestions }}</span>
              <button class="speak-btn" @click="speakQuestion" title="Произнести вопрос">
                🔊
              </button>
            </div>
            <div class="question-card-body">
              <p
                class="question-text"
                :class="{ blurred: isBlurred }"
                @click="revealQuestion"
              >
                {{ currentQuestion.question }}
              </p>
            </div>
          </div>
          <div v-else class="question-card empty">
            <p>Press "LIGHT THE FUSE" to start</p>
          </div>
        </transition>
      </div>

      <!-- PLAYERS CIRCLE -->
      <div class="players-circle">
        <div
          v-for="(player, index) in players"
          :key="index"
          class="player-seat"
          :class="{
            'active': activePlayerIndex === index,
            'bomb-holder': activePlayerIndex === index && isGameActive
          }"
          :style="getPlayerPosition(index)"
          @click="moveBombTo(index)"
        >
          <transition name="bomb-pop">
            <div v-if="activePlayerIndex === index" class="bomb-visual">
              <span class="bomb-emoji">{{ selectedItem.emoji }}</span>
              <div class="timer-ring" v-if="isGameActive && timerEnabled">{{ timeLeft }}</div>
            </div>
          </transition>

          <div class="player-avatar-wrapper">
            <img :src="player.avatar" class="player-avatar" />
            <div
              class="player-name"
              @click.stop="editPlayerName(index)"
              title="Click to rename"
            >
              {{ player.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- EXPLOSION MODAL -->
    <div v-if="isExploded" class="explosion-modal">
      <div class="explosion-content">
        <h2>💥 BOOM! 💥</h2>
        <p><strong>{{ players[activePlayerIndex]?.name }}</strong> blew up!</p>
        <div class="explosion-emoji">{{ selectedItem.emoji }}</div>
        <p class="funny-text">{{ explosionMessage }}</p>
        <p class="stats-line">Answered: {{ answeredCount }} questions</p>
        <button class="play-again-btn" @click="resetGame">🔄 Play Again</button>
      </div>
    </div>

    <!-- START CONTROLS (BOTTOM) -->
    <div class="controls-panel" v-if="!isGameActive && !isExploded">
      <div class="item-selector">
        <p>Select what to pass:</p>
        <div class="items-grid">
          <button
            v-for="item in availableItems"
            :key="item.id"
            class="item-btn"
            :class="{ selected: selectedItem.id === item.id }"
            @click="selectedItem = item"
          >
            <span class="item-emoji">{{ item.emoji }}</span>
            <span class="item-label">{{ item.label }}</span>
          </button>
        </div>
      </div>

      <button class="start-fuse-btn" @click="startGame">
        🔥 START speaking 🔥
      </button>
    </div>

    <!-- ANSWER BUTTON (during game) -->
    <div class="answer-panel" v-if="isGameActive && !isExploded">
      <button class="answered-btn" @click="handleAnswered">
        ✅ Answered!
      </button>
      <p class="answer-hint">
        if you see a mistake or if you have an idea - tell Vincent about it
      </p>
    </div>

    <!-- PLAYER MANAGEMENT (BOTTOM) -->
    <div class="players-management" v-if="!isGameActive && !isExploded">
      <div class="players-list">
        <div v-for="(player, index) in players" :key="index" class="mini-player-card">
          <img :src="player.avatar" />
          <span
            class="mini-player-name"
            @click="editPlayerName(index)"
            title="Click to rename"
          >
            {{ player.name }}
          </span>
          <button @click.stop="removePlayer(index)" v-if="players.length > 2">✕</button>
        </div>
        <button class="add-player-btn" @click="addPlayer">+ Add Player</button>
        <button
          class="reset-players-btn"
          @click="resetPlayers"
          title="Reset to 2 default players"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import SoundManager from './KeyboardSoundManager.vue';
import QuickNotes from './QuickNotes.vue';
import randomQuestionsData from '../dataForGames/random-questions-data';
import { useSpeech } from '../composables/useSpeech';

const route = useRoute();
const missionName = ref(route.params.missionName);
const styleParam = ref(route.params.style);
// Тема: если style — это dark/light — берём его, иначе дефолт
const theme = ref(
  styleParam.value === 'light' ? 'light'
    : styleParam.value === 'dark' ? 'dark'
      : 'light'  // дефолт
);


// ============================================================
// 🔧 НАСТРОЙКИ
// ============================================================
const playersRadius = ref(300);

// ============================================================
// LOCALSTORAGE HELPERS
// ============================================================
const STORAGE_KEY = `passTheBomb_players_${missionName.value || 'default'}`;

const savePlayers = () => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(players.value.map(p => ({ name: p.name, avatar: p.avatar })))
    );
  } catch (e) {
    console.warn('[PassTheBomb] Не удалось сохранить игроков:', e);
  }
};

const loadPlayers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 2) {
      return parsed;
    }
  } catch (e) {
    console.warn('[PassTheBomb] Не удалось загрузить игроков:', e);
  }
  return null;
};

// ============================================================
// SPEECH
// ============================================================
const questionSpeech = useSpeech({
  defaultVoice: 'albert',
  randomByDefault: false,
  filterLang: 'en',
  rate: 0.9,
});

let speakCount = 0;

const speakQuestion = () => {
  if (!currentQuestion.value) return;

  speakCount++;

  if (speakCount <= 2) {
    questionSpeech.speak(currentQuestion.value.question, {
      voice: 'albert',
      lang: 'en-US',
    });
  } else {
    questionSpeech.speak(currentQuestion.value.question, {
      random: true,
      lang: 'en-US',
    });
  }
};

// ============================================================
// ВОПРОСЫ
// ============================================================
const rawQuestions = computed(() => {
  if (randomQuestionsData && randomQuestionsData[missionName.value]) {
    return randomQuestionsData[missionName.value];
  }
  return randomQuestionsData.halloween || [];
});

const allQuestions = computed(() => {
  return rawQuestions.value.map(q => ({
    question: q.eng || q.question || 'No question',
    answer: q.ru || q.answer || 'No answer'
  }));
});

const totalQuestions = computed(() => allQuestions.value.length);

// ============================================================
// ИГРОКИ
// ============================================================
// Дефолтные аватарки теперь PNG (квадратные)
const DEFAULT_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/png?seed=Felix&size=200',
  'https://api.dicebear.com/7.x/avataaars/png?seed=Aneka&size=200',
  'https://api.dicebear.com/7.x/avataaars/png?seed=Bob&size=200',
  'https://api.dicebear.com/7.x/avataaars/png?seed=Alice&size=200',
  'https://api.dicebear.com/7.x/avataaars/png?seed=Charlie&size=200',
  'https://api.dicebear.com/7.x/avataaars/png?seed=Diana&size=200',
  'https://api.dicebear.com/7.x/avataaars/png?seed=Eve&size=200',
  'https://api.dicebear.com/7.x/avataaars/png?seed=Frank&size=200',
];

const createDefaultPlayers = () => [
  { name: 'Player 1', avatar: DEFAULT_AVATARS[0] },
  { name: 'Player 2', avatar: DEFAULT_AVATARS[1] },
];

const players = ref(createDefaultPlayers());

const addPlayer = () => {
  const idx = players.value.length % DEFAULT_AVATARS.length;
  players.value.push({
    name: `Player ${players.value.length + 1}`,
    avatar: DEFAULT_AVATARS[idx]
  });
};

const removePlayer = (index) => {
  if (players.value.length <= 2) return;
  players.value.splice(index, 1);
};

const editPlayerName = (index) => {
  const current = players.value[index]?.name || '';
  const newName = window.prompt('Введите имя игрока:', current);
  if (newName === null) return; // отмена
  const trimmed = newName.trim();
  if (!trimmed) return;
  players.value[index].name = trimmed;
  // watch(players) автоматически сохранит в localStorage
};

const resetPlayers = () => {
  if (!confirm('Сбросить игроков к стандартным двум?')) return;
  players.value = createDefaultPlayers();
};

const getPlayerPosition = (index) => {
  const total = players.value.length;
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  const radius = playersRadius.value;

  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return {
    transform: `translate(${x}px, ${y}px)`
  };
};

// ============================================================
// ПРЕДМЕТЫ
// ============================================================
const availableItems = [
  { id: 'bomb', emoji: '💣', label: 'Bomb' },
  { id: 'pizza', emoji: '🍕', label: 'Pizza' },
  { id: 'cow', emoji: '🐄', label: 'Cow' },
  { id: 'burger', emoji: '🍔', label: 'Burger' },
  { id: 'virus', emoji: '🦠', label: 'Virus' },
  { id: 'poop', emoji: '💩', label: 'Poop' }
];

// Определяем, что пришло в :style
const styleIsItem = availableItems.some(item => item.id === styleParam.value);

// Предмет по умолчанию: если style — это id предмета, выбираем его
const selectedItem = ref(
  styleIsItem
    ? availableItems.find(i => i.id === styleParam.value)
    : availableItems[0]
);
// ============================================================
// ЛОГИКА ИГРЫ
// ============================================================
const isGameActive = ref(false);
const isExploded = ref(false);
const activePlayerIndex = ref(0);
const timeLeft = ref(0);
const explosionMessage = ref('');
const currentQuestion = ref(null);
const answeredCount = ref(0);
const timerEnabled = ref(true);
const isBlurred = ref(true);

let timerInterval = null;
const questionQueue = ref([]);

const pickNextQuestion = () => {
  if (questionQueue.value.length === 0) {
    questionQueue.value = [...allQuestions.value].sort(() => Math.random() - 0.5);
  }
  currentQuestion.value = questionQueue.value.pop() || null;
  isBlurred.value = true;
};

const revealQuestion = () => {
  isBlurred.value = false;
};

const pickRandomPlayerIndex = () => {
  if (players.value.length <= 1) return 0;
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * players.value.length);
  } while (nextIndex === activePlayerIndex.value && players.value.length > 1);
  return nextIndex;
};

const startTimer = () => {
  clearInterval(timerInterval);
  if (!timerEnabled.value) return;

  timeLeft.value = Math.floor(Math.random() * 20) + 10;
  timerInterval = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) explode();
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timerInterval);
  timerInterval = null;
};

const toggleTimer = () => {
  timerEnabled.value = !timerEnabled.value;
  if (!timerEnabled.value) {
    stopTimer();
    timeLeft.value = 0;
  } else if (isGameActive.value) {
    startTimer();
  }
};

const startGame = () => {
  if (players.value.length < 2) return;
  if (allQuestions.value.length === 0) {
    alert('Нет вопросов для этой миссии!');
    return;
  }

  isGameActive.value = true;
  isExploded.value = false;
  answeredCount.value = 0;
  speakCount = 0;

  activePlayerIndex.value = Math.floor(Math.random() * players.value.length);

  questionQueue.value = [...allQuestions.value].sort(() => Math.random() - 0.5);
  pickNextQuestion();

  if (timerEnabled.value) startTimer();

  setTimeout(() => {
    speakQuestion();
  }, 400);
};

const handleAnswered = () => {
  if (!isGameActive.value) return;
  answeredCount.value++;
  activePlayerIndex.value = pickRandomPlayerIndex();
  pickNextQuestion();

  setTimeout(() => {
    speakQuestion();
  }, 400);
};

const moveBombTo = (index) => {
  if (!isGameActive.value) return;
  activePlayerIndex.value = index;
};

const explode = () => {
  stopTimer();
  isGameActive.value = false;
  isExploded.value = true;

  const messages = [
    "Oh no! That's gonna leave a mark.",
    "Clean up on aisle 4!",
    "Should have answered faster!",
    "Better luck next time!",
    "That's what you get for hesitating!"
  ];
  explosionMessage.value = messages[Math.floor(Math.random() * messages.length)];
};

const resetGame = () => {
  stopTimer();
  isExploded.value = false;
  isGameActive.value = false;
  timeLeft.value = 0;
  activePlayerIndex.value = 0;
  currentQuestion.value = null;
  answeredCount.value = 0;
  questionQueue.value = [];
  speakCount = 0;
};

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
};

// ============================================================
// ГОРЯЧИЕ КЛАВИШИ
// ============================================================
const handleKeyDown = (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (e.key === '+' || e.key === '=') {
    playersRadius.value += 20;
    console.log('🔧 playersRadius:', playersRadius.value);
  } else if (e.key === '-') {
    playersRadius.value = Math.max(100, playersRadius.value - 20);
    console.log('🔧 playersRadius:', playersRadius.value);
  }
};

// ============================================================
// WATCH: сохраняем игроков при любом изменении
// ============================================================
watch(players, savePlayers, { deep: true });

// ============================================================
// LIFECYCLE
// ============================================================
onMounted(async () => {
  // Пытаемся загрузить сохранённых игроков
  const saved = loadPlayers();
  if (saved) {
    players.value = saved;
    console.log('[PassTheBomb] Игроки восстановлены из localStorage:', saved.length);
  } else {
    console.log('[PassTheBomb] Нет сохранённых игроков — используются стандартные');
  }

  await questionSpeech.loadVoices();
  console.log('[PassTheBomb] Voices loaded:', questionSpeech.availableVoices.value.length);
  console.log('💡 Нажми "+" или "-" для настройки радиуса игроков');
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  stopTimer();
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style lang="scss" scoped>
/* ===== КОНТЕЙНЕР ===== */
.bomb-game-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', sans-serif;
  transition: background 0.3s ease;
}

.bomb-game-container.dark {
  background: radial-gradient(circle at center, #1a1a2e 0%, #0a0a1a 100%);
  color: #fff;
}
.bomb-game-container.light {
  background: radial-gradient(circle at center, #f0f0f0 0%, #d0d0d0 100%);
  color: #333;
}

/* ===== HEADER ===== */
.game-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  padding-top: 30px;
  z-index: 100;
  font-family: Special_f1;
}


.header-center {
  flex: 1;
  text-align: center;
}

.turn-indicator {
  font-size: 20px;
  font-weight: bold;
}

.turn-indicator.exploded {
  color: #ff4757;
  animation: shake 0.5s infinite;
}

.header-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.theme-toggle,
.timer-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: inherit;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }
}

.timer-toggle.timer-off {
  background: rgba(255, 71, 87, 0.3);
  border-color: #ff4757;
}

/* ===== ИГРОВОЕ ПОЛЕ ===== */
.game-table {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ===== ВОПРОС В ЦЕНТРЕ ===== */
.question-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  width: 480px;
  max-width: 90vw;
}

.question-card {
  background: #fff;
  color: #1a1a2e;
  border-radius: 20px;
  padding: 25px 30px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6);
  border: 4px solid #ffd93d;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.question-card.empty {
  opacity: 0.7;
  color: #666;
  align-items: center;
  justify-content: center;
  border-color: #666;
  text-align: center;
  font-size: 18px;
}

.question-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.q-counter {
  font-size: 14px;
  font-weight: bold;
  color: #999;
  background: #f0f0f0;
  padding: 4px 12px;
  border-radius: 12px;
}

.speak-btn {
  background: #ffd93d;
  border: none;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.15);
    background: #ffed4a;
  }

  &:active {
    transform: scale(0.95);
  }
}

.question-card-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.question-text {
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  line-height: 1.4;
  margin: 0;
  cursor: pointer;
  user-select: none;
  transition: filter 0.4s ease;

  &.blurred {
    filter: blur(12px);
    cursor: pointer;

    &:hover {
      filter: blur(10px);
    }
  }
}

/* ===== ИГРОКИ ПО КРУГУ ===== */
.players-circle {
  position: relative;
  width: calc(2 * v-bind(playersRadius) + 250px);
  height: calc(2 * v-bind(playersRadius) + 250px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.player-seat {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 50%;
  left: 50%;
  margin-top: -60px;
  margin-left: -60px;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 5px;
  border-radius: 15px;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 217, 61, 0.1);
  }
}

.player-avatar-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 🔥 ГЛАВНОЕ ИСПРАВЛЕНИЕ: PNG + aspect-ratio + object-fit */
.player-avatar {
  width: 110px;
  height: 110px;
  min-width: 110px;
  min-height: 110px;
  max-width: 110px;
  max-height: 110px;
  aspect-ratio: 1 / 1;
  flex-shrink: 0;
  flex-grow: 0;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.2);
  object-fit: cover;
  object-position: center;
  transition: all 0.3s ease;
  background: #2d4059;
  display: block;
}

.player-name {
  text-align: center;
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0 0 5px #000;
  white-space: nowrap;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 217, 61, 0.25);
  }
}

.player-seat.bomb-holder {
  z-index: 50;

  .player-avatar {
    border-color: #ff4757;
    box-shadow: 0 0 35px #ff4757;
    transform: scale(1.15);
  }
}

/* ===== БОМБА ===== */
.bomb-visual {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: bounce 0.5s infinite alternate;
  z-index: 100;
}

.bomb-emoji {
  font-size: 65px;
  filter: drop-shadow(0 0 15px rgba(255, 71, 87, 0.9));
}

.timer-ring {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4757;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  font-weight: bold;
  border: 3px solid #fff;
  box-shadow: 0 0 10px rgba(255, 71, 87, 0.8);
}

@keyframes bounce {
  from { transform: translateX(-50%) translateY(0); }
  to { transform: translateX(-50%) translateY(-12px); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* ===== ПАНЕЛЬ УПРАВЛЕНИЯ ===== */
.controls-panel {
  position: absolute;
  width: 100%;
  max-width: 700px;
  height: 260px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  z-index: 100;
}

.item-selector {
  text-align: center;
  width: 100%;

  p {
    margin-bottom: 10px;
    opacity: 0.8;
    font-size: 14px;
  }
}

.items-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.item-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  transition: all 0.2s;
  color: inherit;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  &.selected {
    border-color: #ffd93d;
    background: rgba(255, 217, 61, 0.2);
    box-shadow: 0 0 15px rgba(255, 217, 61, 0.4);
  }
}

.item-emoji {
  font-size: 26px;
}

.item-label {
  font-size: 11px;
  font-weight: bold;
}

.start-fuse-btn {
  padding: 15px 40px;
  font-size: 20px;
  font-weight: bold;
  background: linear-gradient(45deg, #ff4757, #ff6b81);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(255, 71, 87, 0.5);
  transition: all 0.2s;
  letter-spacing: 1px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 30px rgba(255, 71, 87, 0.7);
  }

  &:active {
    transform: scale(0.95);
  }
}

/* ===== ПАНЕЛЬ ОТВЕТА ===== */
.answer-panel {
  position: absolute;
  bottom: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 100;
}

.answered-btn {
  padding: 18px 50px;
  font-size: 22px;
  font-weight: bold;
  background: linear-gradient(45deg, #28a745, #51cf66);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(40, 167, 69, 0.5);
  transition: all 0.2s;
  letter-spacing: 1px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 30px rgba(40, 167, 69, 0.7);
  }

  &:active {
    transform: scale(0.95);
  }
}

.answer-hint {
  font-size: 12px;
  opacity: 0.6;
  text-align: center;
  margin: 0;
}

/* ===== УПРАВЛЕНИЕ ИГРОКАМИ ===== */
.players-management {
  position: absolute;
  bottom: 15px;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 90;
}

.players-list {
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 15px;
  border-radius: 30px;
  align-items: center;
  flex-wrap: wrap;
  max-width: 90%;
  justify-content: center;
}

.mini-player-card {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;

  img {
    width: 22px;
    height: 22px;
    min-width: 22px;
    min-height: 22px;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .mini-player-name {
    cursor: pointer;
    padding: 1px 4px;
    border-radius: 4px;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 217, 61, 0.25);
    }
  }

  button {
    background: none;
    border: none;
    color: #ff4757;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    padding: 0 3px;

    &:hover {
      color: #ff6b81;
    }
  }
}

.add-player-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  color: inherit;
  padding: 5px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.reset-players-btn {
  background: rgba(255, 71, 87, 0.15);
  border: 1px solid rgba(255, 71, 87, 0.4);
  color: inherit;
  padding: 5px 10px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;

  &:hover {
    background: rgba(255, 71, 87, 0.3);
  }
}

/* ===== МОДАЛКА ВЗРЫВА ===== */
.explosion-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.explosion-content {
  background: linear-gradient(135deg, #2d4059, #1a1a2e);
  padding: 40px 50px;
  border-radius: 20px;
  text-align: center;
  border: 3px solid #ff4757;
  box-shadow: 0 0 60px rgba(255, 71, 87, 0.6);
  max-width: 500px;

  h2 {
    font-size: 52px;
    color: #ff4757;
    margin: 0 0 20px 0;
    text-shadow: 0 0 25px rgba(255, 71, 87, 0.9);
    animation: shake 0.3s infinite;
  }

  p {
    font-size: 18px;
    color: #fff;
    margin: 10px 0;
  }

  .explosion-emoji {
    font-size: 90px;
    margin: 20px 0;
    animation: bounce 0.4s infinite alternate;
  }

  .funny-text {
    font-size: 16px;
    font-style: italic;
    opacity: 0.8;
    margin-bottom: 15px;
  }

  .stats-line {
    font-size: 14px;
    color: #ffd93d;
    margin-bottom: 25px;
    font-weight: bold;
  }

  .play-again-btn {
    padding: 14px 35px;
    font-size: 18px;
    background: #ffd93d;
    color: #1a1a2e;
    border: none;
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #ffed4a;
      transform: scale(1.05);
    }
  }
}

/* ===== АНИМАЦИИ ===== */
.bomb-pop-enter-active {
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from {
    transform: translateX(-50%) scale(0);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
}

.card-flip-enter-active,
.card-flip-leave-active {
  transition: all 0.4s ease;
}

.card-flip-enter-from {
  opacity: 0;
  transform: translateY(20px) rotateX(90deg);
}

.card-flip-leave-to {
  opacity: 0;
  transform: translateY(-20px) rotateX(-90deg);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ===== АДАПТИВ ===== */
@media (max-width: 900px) {
  .player-avatar {
    width: 80px;
    height: 80px;
    min-width: 80px;
    min-height: 80px;
    max-width: 80px;
    max-height: 80px;
    aspect-ratio: 1 / 1;
  }

  .player-name {
    font-size: 13px;
  }

  .player-seat {
    margin-top: -50px;
    margin-left: -50px;
  }

  .question-center {
    width: 380px;
  }

  .question-text {
    font-size: 20px;
  }

  .bomb-emoji {
    font-size: 50px;
  }
}

@media (max-width: 600px) {
  .player-avatar {
    width: 65px;
    height: 65px;
    min-width: 65px;
    min-height: 65px;
    max-width: 65px;
    max-height: 65px;
    aspect-ratio: 1 / 1;
  }

  .player-name {
    font-size: 11px;
  }

  .player-seat {
    margin-top: -42px;
    margin-left: -42px;
  }

  .bomb-emoji {
    font-size: 40px;
  }

  .question-center {
    width: 300px;
  }

  .question-text {
    font-size: 16px;
  }

  .explosion-content h2 {
    font-size: 36px;
  }

  .explosion-emoji {
    font-size: 60px;
  }
}
</style>
