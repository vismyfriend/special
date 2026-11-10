<template>
  <div class="casino-table-wrapper" :class="tableTheme">
    <SoundManager />
    <QuickNotes />

    <!-- ===== HEADER ===== -->
    <div class="casino-header">
      <div class="header-side left">
        <button class="hdr-btn" @click="resetRound" title="Reset round">
          ♻️
        </button>
      </div>

      <div class="header-center">
        <!-- Баннер о пересборке колоды ответов -->
        <transition name="notice-fade">
          <div v-if="reshuffleMessage" class="reshuffle-notice">
            {{ reshuffleMessage }}
          </div>
        </transition>

        <span class="turn-indicator" v-if="gameState === 'idle'">
          🎤 <strong>{{ currentQuestioner?.name }}</strong> picks a Question
        </span>
        <span class="turn-indicator" v-else-if="gameState === 'awaitingAnswers'">
          💬 Everyone answers! (click a player to give them an Answer card)
        </span>
        <span class="turn-indicator" v-else-if="gameState === 'awaitingLike'">
          ❤️ <strong>{{ currentQuestioner?.name }}</strong> — whose answer was best?
        </span>
        <span class="turn-indicator finished" v-else-if="gameState === 'finished'">
          🎉 All questions are used! Great talk!
        </span>
      </div>

      <div class="header-side right">
        <button class="hdr-btn" @click="toggleTheme" :title="tableTheme === 'dark' ? 'Light' : 'Dark'">
          {{ tableTheme === 'dark' ? '☀️' : '🌙' }}
        </button>
      </div>
    </div>

    <!-- ===== TABLE AREA ===== -->
    <div class="table-area">
      <!-- Decks in the middle -->
      <div class="decks-center">
        <!-- Questions deck -->
        <div
          class="deck-stack question-deck"
          :class="{ 'is-active': canDrawQuestion, 'is-empty': questionDeck.length === 0 }"
          @click="drawQuestionCard"
        >
          <div class="deck-card-back" v-for="n in visibleBackLayers(questionDeck.length)" :key="'q'+n"
               :style="backLayerStyle(n)"></div>
          <div class="deck-label">{{ dataDeck?.backTitleOne || 'Questions' }}</div>
          <div class="deck-counter">{{ questionDeck.length }}</div>
        </div>

        <!-- Answers deck -->
        <div
          class="deck-stack answer-deck"
          :class="{ 'is-active': canDrawAnswer, 'is-empty': answerDeck.length === 0 && discardedAnswers.length === 0 }"
          @click="drawAnswerCardForCurrent"
        >
          <div class="deck-card-back" v-for="n in visibleBackLayers(answerDeck.length || discardedAnswers.length)" :key="'a'+n"
               :style="backLayerStyle(n)"></div>
          <div class="deck-label">{{ dataDeck?.backTitleTwo || 'Answers' }}</div>
          <div class="deck-counter">{{ answerDeck.length }}</div>
        </div>
      </div>

      <!-- Players around -->
      <div class="players-ring" :style="ringStyle">
        <div
          v-for="(player, index) in players"
          :key="player.uid"
          class="seat"
          :class="seatClass(player, index)"
          :style="seatPosition(index)"
          @click="onPlayerClick(player, index)"
        >
          <!-- Flying card attached to this player -->
          <transition name="card-fly">
            <div
              v-if="player.currentCard"
              class="flying-card"
              :class="player.cardType"
              :style="cardOffset(index)"
            >
              <div class="fc-header">
                <span class="fc-type">{{ player.cardType === 'question' ? 'Q' : 'A' }}</span>
              </div>
              <div class="fc-body">
                <p class="fc-eng">{{ player.currentCard.eng }}</p>
                <p class="fc-hint" v-if="player.currentCard.hint">{{ player.currentCard.hint }}</p>
                <p class="fc-ru">{{ player.currentCard.ru }}</p>
              </div>
            </div>
          </transition>

          <!-- Avatar -->
          <div class="avatar-wrap">
            <img :src="player.avatar" class="avatar" :alt="player.name" />
            <span v-if="player.isQuestioner" class="badge badge-asker">🎤</span>
            <span v-else-if="player.likeState === 'liked'" class="badge badge-liked">✅</span>
            <span v-else-if="player.likeState === 'disliked'" class="badge badge-disliked">❌</span>
            <span v-else-if="player.cardType === 'answer' && player.currentCard" class="badge badge-answered">💬</span>
          </div>

          <div class="player-name" @click.stop="editName(player, index)" title="Click to rename">
            {{ player.name }}
          </div>

          <!-- Like picker near the questioner in awaitingLike state -->
<!--          <transition name="pop">-->
<!--            <div-->
<!--              v-if="gameState === 'awaitingLike' && currentQuestionerIndex === index"-->
<!--              class="like-picker"-->
<!--              @click.stop-->
<!--            >-->
<!--              <p class="lp-title">Best answer?</p>-->
<!--              <div class="lp-list">-->
<!--                <template v-for="(p, i) in players" :key="p.uid">-->
<!--                  <button-->
<!--                    v-if="i !== index"-->
<!--                    class="lp-btn"-->
<!--                    @click.stop="pickLiked(i)"-->
<!--                  >-->
<!--                    <img :src="p.avatar" class="lp-avatar" />-->
<!--                    <span class="lp-name">{{ p.name }}</span>-->
<!--                  </button>-->
<!--                </template>-->
<!--              </div>-->
<!--            </div>-->
<!--          </transition>-->
        </div>
      </div>
    </div>

    <!-- ===== PLAYER MANAGEMENT ===== -->
    <div class="management-bar" v-if="!hasStarted  || gameState === 'finished'">
      <div class="mini-players">
        <div v-for="(p, i) in players" :key="p.uid" class="mini-card">
          <img :src="p.avatar" class="mini-avatar" />
          <span class="mini-name" @click.stop="editName(p, i)">{{ p.name }}</span>
          <button
            v-if="players.length > MIN_PLAYERS && !isGameInProgress"
            class="mini-remove"
            @click.stop="removePlayer(i)"
            title="Remove"
          >✕</button>
        </div>

        <button
          v-if="players.length < MAX_PLAYERS"
          class="add-player"
          @click="addPlayer"
        >+ Add Player</button>
      </div>

      <div class="management-actions">
        <button
          v-if="gameState === 'finished'"
          class="restart-btn"
          @click="restartGame"
        >🔄 Play Again</button>
<!--        <button-->
<!--          v-else-if="!isGameInProgress"-->
<!--          class="start-btn"-->
<!--          :disabled="players.length < MIN_PLAYERS"-->
<!--          @click="startGame"-->
<!--        >▶ Start (first player: {{ players[0]?.name }})</button>-->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import SoundManager from './KeyboardSoundManager.vue';
import QuickNotes from './QuickNotes.vue';
import gameDecksManyPlayersData from '../dataForGames/gameDecksManyPlayersData';

/* ============================================================
   ROUTE / DATA
   ============================================================ */
const route = useRoute();
const missionName = ref(route.params.missionName || 'developerSet');
const styleParam = ref(route.params.style);
const tableTheme = ref(
  styleParam.value === 'light' ? 'light'
    : styleParam.value === 'dark' ? 'dark'
      : 'dark'
);

const dataDeck = computed(() => gameDecksManyPlayersData[missionName.value] || gameDecksManyPlayersData.developerSet);

/* ============================================================
   CONSTANTS
   ============================================================ */
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 5;
const RING_RADIUS = 300;
const ringRadius = ref(RING_RADIUS);

// Адаптивный радиус: на узких экранах — меньше
const updateRingRadiusForScreen = () => {
  const w = window.innerWidth;
  if (w < 600) {
    ringRadius.value = 150;
  } else if (w < 900) {
    ringRadius.value = 190;
  } else {
    ringRadius.value = RING_RADIUS;
  }
};

/* ============================================================
   PLAYERS
   ============================================================ */
let uidCounter = 1;

const AVATAR_SEEDS = [
  'Vincent', 'Polina', 'Bob', 'Alice', 'Charlie',
  'Diana', 'Eve', 'Frank', 'Grace', 'Hugo',
];

const makeAvatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(seed)}&size=200`;

const randomSeed = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
};

const makePlayer = (name, avatarIdx) => ({
  uid: uidCounter++,
  name,
  avatar: makeAvatarUrl(AVATAR_SEEDS[avatarIdx % AVATAR_SEEDS.length]),
  currentCard: null,
  cardType: null,
  isQuestioner: false,
  likeState: null,
});

const players = ref([
  makePlayer('Player 1', 0),
  makePlayer('Player 2', 1),
  makePlayer('Player 3', 2),
  makePlayer('Player 4', 3),
]);

const currentQuestionerIndex = ref(0);
const currentQuestioner = computed(() => players.value[currentQuestionerIndex.value]);

const refreshAllAvatars = () => {
  players.value.forEach((p) => {
    p.avatar = makeAvatarUrl(randomSeed());
  });
};

/* ============================================================
   DECKS (runtime state)
   ============================================================ */
const questionDeck = ref([]);
const answerDeck = ref([]);
const discardedAnswers = ref([]);        // отбой использованных карт ответов

/* ============================================================
   RESHUFFLE NOTICE
   ============================================================ */
const reshuffleMessage = ref('');
let reshuffleTimer = null;

const showReshuffleNotice = () => {
  reshuffleMessage.value = '🔀 deck 2 was reshuffled';
  if (reshuffleTimer) clearTimeout(reshuffleTimer);
  reshuffleTimer = setTimeout(() => {
    reshuffleMessage.value = '';
    reshuffleTimer = null;
  }, 2500);
};

/* ============================================================
   LOAD DECKS
   ============================================================ */
const loadDecks = () => {
  questionDeck.value = [...(dataDeck.value.deckOne || [])];
  answerDeck.value = [...(dataDeck.value.deckTwo || [])];
  discardedAnswers.value = [];
  reshuffleMessage.value = '';
};

/* ============================================================
   GAME STATE
   ============================================================ */
const gameState = ref('idle');
const hasStarted = ref(false);   // ← новое: игра уже началась (Start нажат)

const isGameInProgress = computed(() =>
  gameState.value === 'awaitingAnswers' || gameState.value === 'awaitingLike'
);

const canDrawQuestion = computed(() =>
  gameState.value === 'idle' && questionDeck.value.length > 0 && !currentQuestioner.value?.currentCard
);

const canDrawAnswer = computed(() =>
  gameState.value === 'awaitingAnswers' &&
  (answerDeck.value.length > 0 || discardedAnswers.value.length > 0)
);

/* ============================================================
   HELPERS: POSITIONS
   ============================================================ */
const ringStyle = computed(() => {
  const size = ringRadius.value * 2 + 260;
  return { width: `${size}px`, height: `${size}px` };
});

const seatPosition = (index) => {
  const total = players.value.length;
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  const x = Math.cos(angle) * ringRadius.value;
  const y = Math.sin(angle) * ringRadius.value;
  return { transform: `translate(${x}px, ${y}px)` };
};

const cardOffset = (index) => {
  const total = players.value.length;
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;

  // Расстояние зависит от радиуса кольца:
  // десктоп (300) → 145px, планшет (190) → ~115px, телефон (130) → ~90px
  const distance = Math.round(ringRadius.value * 0.48);

  const x = -Math.cos(angle) * distance;
  const y = -Math.sin(angle) * distance;
  return {
    '--card-x': `${x}px`,
    '--card-y': `${y}px`,
  };
};

/* ============================================================
   DECK VISUALS
   ============================================================ */
const visibleBackLayers = (count) => Math.min(Math.max(count, 0), 4);

const backLayerStyle = (n) => ({
  transform: `translate(${n * 1.5}px, ${-n * 1.5}px)`,
  zIndex: n,
});

/* ============================================================
   SEAT CLASSES
   ============================================================ */
const seatClass = (player, index) => ({
  'is-questioner': index === currentQuestionerIndex.value && gameState.value !== 'finished',
  'is-clickable':
    (gameState.value === 'awaitingAnswers' && index !== currentQuestionerIndex.value && !player.currentCard) ||
    (gameState.value === 'awaitingLike' && index !== currentQuestionerIndex.value),
  'is-answered': player.cardType === 'answer' && player.currentCard,
  'is-liked': player.likeState === 'liked',
  'is-disliked': player.likeState === 'disliked',
});

/* ============================================================
   START / RESET
   ============================================================ */
const startGame = () => {
  if (players.value.length < MIN_PLAYERS) return;
  refreshAllAvatars();
  loadDecks();
  resetPlayersCards();
  currentQuestionerIndex.value = 0;
  players.value[0].isQuestioner = true;
  gameState.value = 'idle';
  hasStarted.value = true;              // ← добавили

};

const resetPlayersCards = () => {
  players.value.forEach(p => {
    p.currentCard = null;
    p.cardType = null;
    p.likeState = null;
    p.isQuestioner = false;
  });
};

const restartGame = () => {
  resetPlayersCards();
  startGame();
};

// ============================================================
// LOCALSTORAGE — сохраняем только имена игроков
// ============================================================
const playersStorageKey = computed(() =>
  `decksManyPlayers_players_${missionName.value || 'developerSet'}`
);

const savePlayerNames = () => {
  try {
    const names = players.value.map(p => p.name);
    localStorage.setItem(playersStorageKey.value, JSON.stringify(names));
  } catch (e) {
    console.warn('[DECKS] savePlayers failed:', e);
  }
};

const loadPlayerNames = () => {
  try {
    const raw = localStorage.getItem(playersStorageKey.value);
    if (!raw) return null;
    const names = JSON.parse(raw);
    if (!Array.isArray(names)) return null;
    // Отсеиваем невалидные
    const clean = names
      .filter(n => typeof n === 'string' && n.trim().length > 0)
      .map(n => n.trim());
    if (clean.length < MIN_PLAYERS || clean.length > MAX_PLAYERS) return null;
    return clean;
  } catch (e) {
    console.warn('[DECKS] loadPlayers failed:', e);
    return null;
  }
};

const resetRound = () => {
  // 1) спрашиваем подтверждение (опционально — убери, если не нужно)
  if (!confirm('Сбросить игру и имена игроков к стандартным?')) return;

  // 2) чистим localStorage
  try {
    localStorage.removeItem(playersStorageKey.value);
  } catch (e) {
    console.warn('[DECKS] localStorage cleanup failed:', e);
  }

  // 3) возвращаем дефолтных игроков (4 штуки с рандомными аватарами)
  players.value = [
    makePlayer('Player 1', 0),
    makePlayer('Player 2', 1),
    makePlayer('Player 3', 2),
    makePlayer('Player 4', 3),
  ];
  refreshAllAvatars();

  // 4) сбрасываем состояние игры
  currentQuestionerIndex.value = 0;
  players.value[0].isQuestioner = true;
  gameState.value = 'idle';
  hasStarted.value = false;
  loadDecks();
  resetPlayersCards();
};

/* ============================================================
   DRAWING
   ============================================================ */
const drawQuestionCard = () => {
  if (!canDrawQuestion.value) return;
  hasStarted.value = true;            // начали игру

  const card = questionDeck.value.shift();
  if (!card) return;

  const q = currentQuestioner.value;
  q.currentCard = card;
  q.cardType = 'question';
  q.likeState = null;

  gameState.value = 'awaitingAnswers';
};

const onPlayerClick = (player, index) => {
  if (gameState.value === 'awaitingAnswers') {
    if (index === currentQuestionerIndex.value) return;
    if (player.currentCard) return;
    drawAnswerCardFor(player);
    return;
  }

  if (gameState.value === 'awaitingLike') {
    if (index === currentQuestionerIndex.value) return;
    if (player.cardType !== 'answer') return;
    pickLiked(index);
    return;
  }
};

const drawAnswerCardFor = (player) => {
  // Если основная колода ответов пуста — пробуем пересобрать из отбоя
  if (answerDeck.value.length === 0) {
    if (discardedAnswers.value.length === 0) return;   // вообще нечего давать

    // Пересобираем колоду ответов из отбоя и перемешиваем
    answerDeck.value = [...discardedAnswers.value].sort(() => Math.random() - 0.5);
    discardedAnswers.value = [];
    showReshuffleNotice();
    console.log('[DECKS] ♻️ answerDeck reshuffled from discard pile:', answerDeck.value.length);
  }

  const card = answerDeck.value.shift();
  player.currentCard = card;
  player.cardType = 'answer';
  player.likeState = null;

  const everyoneAnswered = players.value.every((p, i) => {
    if (i === currentQuestionerIndex.value) return true;
    return p.cardType === 'answer' && p.currentCard;
  });

  if (everyoneAnswered) {
    gameState.value = 'awaitingLike';
  }
};

// Клик по правой колоде — «пассивный», просто пересобрать если пусто
const drawAnswerCardForCurrent = () => {
  if (answerDeck.value.length === 0 && discardedAnswers.value.length > 0) {
    answerDeck.value = [...discardedAnswers.value].sort(() => Math.random() - 0.5);
    discardedAnswers.value = [];
    showReshuffleNotice();
    console.log('[DECKS] ♻️ answerDeck reshuffled from discard pile (via deck click):', answerDeck.value.length);
  }
};

/* ============================================================
   LIKE / DISLIKE
   ============================================================ */
const pickLiked = (likedIndex) => {
  if (gameState.value !== 'awaitingLike') return;
  if (likedIndex === currentQuestionerIndex.value) return;

  const likedPlayer = players.value[likedIndex];
  if (likedPlayer.cardType !== 'answer') return;

  players.value.forEach((p, i) => {
    if (i === currentQuestionerIndex.value) return;
    p.likeState = i === likedIndex ? 'liked' : 'disliked';
  });

  setTimeout(() => {
    advanceToNextQuestioner(likedIndex);
  }, 900);
};

const advanceToNextQuestioner = (nextIndex) => {
  // карты ответов → в отбой, карты вопросов просто теряем
  players.value.forEach(p => {
    if (p.cardType === 'answer' && p.currentCard) {
      discardedAnswers.value.push(p.currentCard);
    }
    p.currentCard = null;
    p.cardType = null;
    p.likeState = null;
    p.isQuestioner = false;
  });

  currentQuestionerIndex.value = nextIndex;
  players.value[nextIndex].isQuestioner = true;

  if (questionDeck.value.length === 0) {
    gameState.value = 'finished';
  } else {
    gameState.value = 'idle';
  }
};

/* ============================================================
   PLAYER MANAGEMENT
   ============================================================ */
const addPlayer = () => {
  if (players.value.length >= MAX_PLAYERS) return;
  if (isGameInProgress.value) return;
  const newPlayer = makePlayer(`Player ${players.value.length + 1}`, players.value.length);
  newPlayer.avatar = makeAvatarUrl(randomSeed());
  players.value.push(newPlayer);
};

const removePlayer = (index) => {
  if (players.value.length <= MIN_PLAYERS) return;
  if (isGameInProgress.value) return;

  const wasQuestioner = index === currentQuestionerIndex.value;
  players.value.splice(index, 1);

  if (wasQuestioner) {
    currentQuestionerIndex.value = 0;
  } else if (currentQuestionerIndex.value > index) {
    currentQuestionerIndex.value -= 1;
  }
  if (players.value[currentQuestionerIndex.value]) {
    players.value[currentQuestionerIndex.value].isQuestioner = true;
  }
};

const editName = (player, index) => {
  const newName = window.prompt('Enter player name:', player.name);
  if (newName === null) return;
  const trimmed = newName.trim();
  if (!trimmed) return;
  players.value[index].name = trimmed;
};

/* ============================================================
   THEME
   ============================================================ */
const toggleTheme = () => {
  tableTheme.value = tableTheme.value === 'dark' ? 'light' : 'dark';
};

/* ============================================================
   HOTKEYS
   ============================================================ */
const handleKeyDown = (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === '+' || e.key === '=') {
    ringRadius.value += 20;
    console.log('[GameDecksManyPlayers] radius:', ringRadius.value);
  } else if (e.key === '-') {
    ringRadius.value = Math.max(150, ringRadius.value - 20);
    console.log('[GameDecksManyPlayers] radius:', ringRadius.value);
  }
};
/* ============================================================
   LIFECYCLE
   ============================================================ */
onMounted(() => {
  // 1) восстанавливаем имена игроков, если были
  const savedNames = loadPlayerNames();
  if (savedNames) {
    const newPlayers = [];
    for (let i = 0; i < savedNames.length; i++) {
      const p = makePlayer(savedNames[i], i);
      p.avatar = makeAvatarUrl(randomSeed());
      newPlayers.push(p);
    }
    players.value = newPlayers;
    console.log('[DECKS] ♻️ players restored from localStorage:', savedNames);
  }

  loadDecks();
  refreshAllAvatars();
  players.value[0].isQuestioner = true;

  updateRingRadiusForScreen();
  window.addEventListener('resize', updateRingRadiusForScreen);
  window.addEventListener('keydown', handleKeyDown);

  console.log('🎲 GameDecksManyPlayers loaded. Mission:', missionName.value);
  console.log('💡 Use + / - to adjust player ring radius');
});

// Сохраняем имена при любом изменении массива players
watch(players, savePlayerNames, { deep: true });

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('resize', updateRingRadiusForScreen);
  if (reshuffleTimer) clearTimeout(reshuffleTimer);
});
</script>

<style lang="scss" scoped>
/* ============================================================
   WRAPPER
   ============================================================ */
.casino-table-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', sans-serif;
  transition: background 0.3s ease;
}

.casino-table-wrapper.dark {
  background: radial-gradient(ellipse at center, #1c6b3a 0%, #0d4a26 55%, #08321a 100%);
  color: #f1f7f2;
}
.casino-table-wrapper.light {
  background: radial-gradient(ellipse at center, #2fbf6c 0%, #1e8f4f 55%, #146b39 100%);
  color: #ffffff;
}

.casino-table-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 4px);
  opacity: 0.25;
  z-index: 0;
}

/* ============================================================
   HEADER
   ============================================================ */
.casino-header {
  position: relative;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  margin-top: 70px;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.header-side { flex: 1; display: flex; }
.header-side.right { justify-content: flex-end; }
.header-center { flex: 3; text-align: center; }

/* 🔀 Баннер пересборки колоды */
.reshuffle-notice {
  display: inline-block;
  background: linear-gradient(135deg, #ffe066, #ffc400);
  color: #1a1a1a;
  font-weight: 800;
  font-size: 15px;
  padding: 8px 18px;
  border-radius: 12px;
  margin-bottom: 8px;
  box-shadow: 0 4px 16px rgba(255, 196, 0, 0.5);
  animation: noticeShake 0.4s ease;
}

@keyframes noticeShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px) rotate(-1deg); }
  75% { transform: translateX(6px) rotate(1deg); }
}

.notice-fade-enter-active { transition: all 0.3s ease; }
.notice-fade-leave-active { transition: all 0.3s ease; }
.notice-fade-enter-from,
.notice-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.9);
}

.turn-indicator {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.2px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
.turn-indicator strong { color: #ffe066; }
.turn-indicator.finished { color: #ffe066; animation: pulse 1.6s ease-in-out infinite; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}

.hdr-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: inherit;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.2s ease;
}
.hdr-btn:hover { transform: scale(1.08); background: rgba(255, 255, 255, 0.18); }

/* ============================================================
   TABLE AREA
   ============================================================ */
.table-area {
  position: relative;
  flex: 1;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

/* ============================================================
   DECKS
   ============================================================ */
.decks-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 60px;
  z-index: 5;
}

.deck-stack {
  position: relative;
  width: 140px;
  height: 190px;
  border-radius: 14px;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.deck-stack.is-active {
  cursor: pointer;
  box-shadow: 0 0 0 3px #ffe066, 0 10px 30px rgba(0, 0, 0, 0.5);
  transform: translateY(-6px) scale(1.03);
}
.deck-stack.is-active:hover { transform: translateY(-10px) scale(1.06); }

.deck-stack.is-empty {
  opacity: 0.35;
  cursor: not-allowed;
  filter: grayscale(0.7);
}

.deck-stack:not(.is-active):not(.is-empty) {
  cursor: default;
}

.deck-card-back {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  border: 2px solid rgba(0, 0, 0, 0.35);
  pointer-events: none;
}

.question-deck .deck-card-back {
  background: repeating-linear-gradient(45deg, #7b1e2e 0 10px, #a8283d 10px 20px);
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.08);
}
.answer-deck .deck-card-back {
  background: repeating-linear-gradient(45deg, #1e3d7b 0 10px, #2850a8 10px 20px);
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.08);
}

.deck-label {
  position: relative;
  z-index: 10;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  font-size: 13px;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  background: rgba(0, 0, 0, 0.25);
  padding: 6px 12px;
  border-radius: 8px;
  text-align: center;
  max-width: 120px;
  word-break: break-word;
  pointer-events: none;
}

.deck-counter {
  position: absolute;
  top: -12px;
  right: -12px;
  z-index: 11;
  background: #ffe066;
  color: #1a1a1a;
  font-weight: 800;
  font-size: 13px;
  min-width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

/* ============================================================
   PLAYERS RING
   ============================================================ */
.players-ring {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  pointer-events: none;
}

.seat {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -70px;
  margin-left: -70px;
  width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.35s ease;
  pointer-events: auto;
}

.seat.is-clickable {
  cursor: pointer;
}
.seat.is-clickable:hover .avatar {
  transform: scale(1.08);
  border-color: #ffe066;
}

.avatar-wrap {
  position: relative;
  width: 110px;
  height: 110px;
}

.avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.3);
  background: #0d4a26;
  transition: all 0.3s ease;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
}

.seat.is-questioner .avatar {
  border-color: #ffe066;
  box-shadow: 0 0 0 4px rgba(255, 224, 102, 0.35), 0 0 30px rgba(255, 224, 102, 0.6);
  transform: scale(1.06);
}

.seat.is-liked .avatar {
  border-color: #4ade80;
  box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.3), 0 0 28px rgba(74, 222, 128, 0.55);
}

.seat.is-disliked .avatar {
  border-color: #f87171;
  filter: grayscale(0.55);
  opacity: 0.8;
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  font-size: 22px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6));
  z-index: 5;
  pointer-events: none;
}
.badge-asker { font-size: 26px; }

.player-name {
  margin-top: 8px;
  font-size: 15px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
  white-space: nowrap;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 6px;
  transition: background 0.2s ease;
}
.player-name:hover { background: rgba(255, 224, 102, 0.2); }

/* ============================================================
   FLYING CARD
   ============================================================ */
.flying-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(
      calc(-50% + var(--card-x, 0px)),
      calc(-50% + var(--card-y, -180px))
  );
  width: 150px;
  min-height: 130px;
  border-radius: 12px;
  padding: 10px 10px 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55);
  z-index: 30;
  pointer-events: none;
  transition: transform 0.25s ease;
}

.flying-card.question {
  background: linear-gradient(160deg, #fff7d6, #ffe066);
  color: #5a3b00;
  border: 2px solid #d4a800;
}
.flying-card.answer {
  background: linear-gradient(160deg, #dceeff, #8cc4ff);
  color: #062a5c;
  border: 2px solid #2f6fd6;
}

.fc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  opacity: 0.6;
}
.fc-type { font-size: 14px; }

.fc-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  gap: 4px;
  margin-top: 4px;
}
.fc-eng {
  font-size: 17px;
  font-weight: 800;
  line-height: 1.2;
  margin: 0;
  word-break: break-word;
}
.fc-hint {
  font-size: 11px;
  font-style: italic;
  opacity: 0.7;
  margin: 0;
}
.fc-ru {
  font-size: 13px;
  opacity: 0.85;
  margin: 0;
}

.card-fly-enter-active {
  animation: cardFlyIn 0.45s cubic-bezier(0.2, 1.1, 0.4, 1);
}
.card-fly-leave-active {
  transition: opacity 0.25s ease;
}
.card-fly-leave-to { opacity: 0; }

@keyframes cardFlyIn {
  0% {
    opacity: 0;
    transform: translate(
        calc(-50% + var(--card-x, 0px) * 0.25),
        calc(-50% + var(--card-y, 0px) * 0.25)
    ) rotate(-10deg) scale(0.5);
  }
  60% {
    opacity: 1;
    transform: translate(
        calc(-50% + var(--card-x, 0px) * 1.1),
        calc(-50% + var(--card-y, 0px) * 1.1)
    ) rotate(4deg) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translate(
        calc(-50% + var(--card-x, 0px)),
        calc(-50% + var(--card-y, 0px))
    ) rotate(0deg) scale(1);
  }
}

/* ============================================================
   LIKE PICKER
   ============================================================ */
.like-picker {
  position: absolute;
  top: -230px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 30, 20, 0.96);
  border: 2px solid #ffe066;
  border-radius: 14px;
  padding: 12px 14px;
  min-width: 260px;
  z-index: 40;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7);
  pointer-events: auto;
}
.lp-title {
  text-align: center;
  font-weight: 800;
  color: #ffe066;
  margin: 0 0 10px 0;
  font-size: 13px;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.lp-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lp-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  font-weight: 600;
}
.lp-btn:hover {
  background: rgba(255, 224, 102, 0.2);
  border-color: #ffe066;
  transform: translateX(3px);
}
.lp-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.lp-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.pop-enter-active { animation: popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.pop-leave-active { transition: opacity 0.2s ease; }
.pop-leave-to { opacity: 0; }

@keyframes popIn {
  from { opacity: 0; transform: translateX(-50%) scale(0.5); }
  to   { opacity: 1; transform: translateX(-50%) scale(1); }
}

/* ============================================================
   MANAGEMENT BAR
   ============================================================ */
.management-bar {
  position: relative;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(6px);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  flex-wrap: wrap;
}

.mini-players {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.mini-card {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.mini-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.mini-name { cursor: pointer; padding: 1px 4px; border-radius: 4px; transition: background 0.2s; }
.mini-name:hover { background: rgba(255, 224, 102, 0.2); }
.mini-remove {
  background: none;
  border: none;
  color: #ff9e9e;
  cursor: pointer;
  font-weight: 800;
  font-size: 13px;
  padding: 0 2px;
}
.mini-remove:hover { color: #ff6b6b; }

.add-player {
  background: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.35);
  color: inherit;
  padding: 5px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  transition: all 0.2s ease;
}
.add-player:hover { background: rgba(255, 255, 255, 0.2); border-color: #ffe066; }

.management-actions { display: flex; gap: 10px; }

.start-btn,
.restart-btn {
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.5px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #0d3b1f;
}
.start-btn {
  background: linear-gradient(135deg, #ffe066, #ffc400);
  box-shadow: 0 4px 16px rgba(255, 196, 0, 0.4);
}
.start-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(255, 196, 0, 0.6); }
.start-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.restart-btn {
  background: linear-gradient(135deg, #6ee7b7, #34d399);
  color: #0d3b1f;
  box-shadow: 0 4px 16px rgba(52, 211, 153, 0.4);
}
.restart-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(52, 211, 153, 0.6); }

/* ============================================================
   ADAPTIVE
   ============================================================ */
@media (max-width: 900px) {
  .decks-center { gap: 30px; }
  .deck-stack { width: 110px; height: 150px; }
  .deck-label { font-size: 12px; }
  .avatar, .avatar-wrap { width: 80px; height: 80px; }
  .seat { margin-top: -55px; margin-left: -55px; width: 110px; }
  .flying-card { width: 120px; min-height: 110px; }
  .fc-eng { font-size: 14px; }
  .like-picker { min-width: 220px; top: -200px; }
  .reshuffle-notice { font-size: 13px; padding: 6px 14px; }
}

@media (max-width: 600px) {
  .decks-center { gap: 18px; }
  .deck-stack { width: 88px; height: 120px; }
  .deck-label { font-size: 10px; padding: 4px 8px; max-width: 80px; }
  .deck-counter { min-width: 22px; height: 22px; font-size: 11px; }
  .avatar, .avatar-wrap { width: 64px; height: 64px; }
  .seat { margin-top: -45px; margin-left: -45px; width: 90px; }
  .player-name { font-size: 12px; }
  .flying-card { width: 100px; min-height: 95px; padding: 7px; }
  .fc-eng { font-size: 12px; }
  .fc-ru { font-size: 11px; }
  .turn-indicator { font-size: 14px; }
  .reshuffle-notice { font-size: 11px; padding: 5px 10px; }
}
</style>
