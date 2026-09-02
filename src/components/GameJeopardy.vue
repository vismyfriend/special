<template>
  <div class="jeopardy-container" :class="theme">
    <SoundManager />

    <div class="jeopardy-header">
      <div class="header-left">
<!--        <button class="back-btn" @click="goBack">← Back</button>-->
        <h1>🎯 {{ gameData?.mainDescription || 'Выбирай тему и кликай'}} </h1>
      </div>
      <div class="header-center">
        <span class="turn-indicator">
          Whose turn?
          <strong class="active-player-name">{{ players[activePlayer]?.name || 'No player' }}</strong>
        </span>
      </div>
      <div class="header-right">
        <button class="theme-toggle" @click="toggleTheme">
          {{ theme === 'dark' ? '☀️' : '🌙' }}
        </button>
      </div>
    </div>

    <div class="level-info" v-if="gameData">
      <span class="level-badge">{{ gameData.level || 'S.P.E.C.I.A.L.' }}</span>
<!--      <span class="game-name">{{ missionName }}</span>-->
      <span class="game-desc">{{ gameData?.extraDescription || gameData?.mainDescription || 'Jeopardy' }}</span>
    </div>

    <div v-if="!gameData" class="error-message">
      <h2>⚠️ Game not found</h2>
      <p>Looking for mission: "{{ missionName }}"</p>
      <p>Available games: {{ availableGames.join(', ') }}</p>
    </div>

    <!-- Игровая доска -->
    <div v-else class="jeopardy-board" :style="{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }">
      <div
        v-for="(category, catIndex) in categories"
        :key="catIndex"
        class="category-column"
      >
        <div class="category-header">
          {{ category.name }}
        </div>
        <div
          v-for="(question, qIndex) in category.questions"
          :key="qIndex"
          class="question-cell"
          :class="{
            'used': question.used,
            'active': selectedQuestion === question
          }"
          @click="selectQuestion(question)"
        >
          ${{ question.value }}
        </div>
      </div>
    </div>

    <!-- Игроки -->
    <div class="players-section" v-if="gameData">
      <div class="players-container">
        <div
          v-for="(player, index) in players"
          :key="index"
          class="player-card"
          :class="{ active: activePlayer === index }"
          @click="setActivePlayer(index)"
        >
          <div class="player-avatar-wrapper">
            <img
              :src="player.avatar"
              :alt="player.name"
              class="player-avatar"
            />
            <div class="player-score-badge">${{ player.score }}</div>
            <button
              class="player-menu-btn"
              @click.stop="togglePlayerMenu(index)"
            >
              ⚙️
            </button>

            <!-- Меню игрока -->
            <div v-if="playerMenuOpen === index" class="player-menu-dropdown">
              <button @click.stop="editPlayerName(index)">✏️ Change Name</button>
              <button @click.stop="changePlayerAvatar(index)">🖼️ Change Avatar</button>
              <button @click.stop="editPlayerScore(index)">💰 Edit Score</button>
              <button
                v-if="players.length > 1"
                @click.stop="removePlayer(index)"
                class="danger"
              >
                🗑️ Remove Player
              </button>
            </div>
          </div>
          <div class="player-name">{{ player.name }}</div>
<!--          <div class="player-score">${{ player.score }}</div>-->
<!--          <div v-if="activePlayer === index" class="active-indicator">◀</div>-->
        </div>

        <!-- Кнопка добавления игрока -->
        <div class="add-player-btn" @click="addPlayer">
          <div class="add-icon">+</div>
          <span>Add Player</span>
        </div>
      </div>
    </div>

    <!-- Модальное окно с вопросом -->
    <div v-if="selectedQuestion" class="question-modal" @click.self="closeQuestion">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close-btn" @click="closeQuestion">✕</button>
          <span class="question-value"
                v-if="!showAnswer"

          >${{ selectedQuestion.value }}</span>
        </div>

        <div class="question-body">
          <div v-if="activePlayer !== null" class="current-player-indicator">
            🎯 {{ players[activePlayer]?.name }} is answering
          </div>

          <img
            v-if="selectedQuestion.image"
            :src="selectedQuestion.image"
            class="question-image"
          />
          <audio
            v-if="selectedQuestion.audio"
            controls
            :src="selectedQuestion.audio"
            class="question-audio"
          ></audio>

          <p class="question-text">{{ selectedQuestion.question }}</p>

          <div class="answer-section">
            <button
              v-if="!showAnswer"
              class="show-answer-btn"
              @click="showAnswer = true"
            >
              Show Answer
            </button>

            <div v-else class="answer-display">
              <p class="answer-text">(answer:) {{ selectedQuestion.answer }}</p>



              <div class="action-buttons">
                <button
                  class="correct-btn"
                  @click="handleCorrect"
                >
                  ✅ Guessed !!!
                </button>
                <button
                  class="wrong-btn"
                  @click="handleWrong"
                >
                  ❌ Oops
                </button>
              </div>
              <!-- Поле для ввода очков -->
              <div class="score-input-group">
                <label for="scoreInput"> + $</label>
                <input
                  id="scoreInput"
                  v-model.number="customScoreValue"
                  type="number"
                  class="score-input"
                  min="0"
                  step="10"
                  @focus="$event.target.select()"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка для смены имени -->
    <div v-if="showNameEdit" class="modal-overlay" @click.self="showNameEdit = false">
      <div class="modal-content small">
        <h3>✏️ Change Name</h3>
        <input
          v-model="editNameValue"
          type="text"
          class="name-input"
          @keyup.enter="savePlayerName"
          placeholder="Enter new name..."
        />
        <div class="modal-actions">
          <button @click="showNameEdit = false">Cancel</button>
          <button class="primary" @click="savePlayerName">Save</button>
        </div>
      </div>
    </div>

    <!-- Модалка для смены аватара (обновленная) -->
    <div v-if="showAvatarSelect" class="modal-overlay" @click.self="showAvatarSelect = false">
      <div class="modal-content small">
        <h3>🖼️ Select Avatar</h3>

        <!-- Кнопка загрузки своего аватара -->
        <div class="upload-avatar-area">
          <label class="upload-btn">
            📁 Upload your avatar
            <input
              type="file"
              accept="image/*"
              @change="handleAvatarUpload"
              style="display: none"
            />
          </label>
          <span class="upload-hint">or drag & drop image here</span>
          <div
            class="drag-drop-zone"
            @dragover.prevent
            @drop.prevent="handleAvatarDrop"
          >
            Drop your image here
          </div>
        </div>

        <div class="avatar-grid">
          <div
            v-for="(avatar, idx) in availableAvatars"
            :key="idx"
            class="avatar-option"
            :class="{ selected: avatar === editAvatarValue }"
            @click="editAvatarValue = avatar"
          >
            <img :src="avatar" alt="Avatar" />
          </div>
        </div>
        <div class="modal-actions">
          <button @click="showAvatarSelect = false">Cancel</button>
          <button class="primary" @click="savePlayerAvatar">Save</button>
        </div>
      </div>
    </div>

    <!-- Модалка для изменения очков -->
    <div v-if="showScoreEdit" class="modal-overlay" @click.self="showScoreEdit = false">
      <div class="modal-content small">
        <h3>💰 Edit Score</h3>
        <p class="player-name-display">Player: <strong>{{ editingPlayerName }}</strong></p>
        <p class="current-score-display">Current score: <strong>${{ currentPlayerScore }}</strong></p>
        <input
          v-model.number="editScoreValue"
          type="number"
          class="name-input"
          @keyup.enter="savePlayerScore"
          placeholder="Enter new score..."
          min="0"
        />
        <div class="modal-actions">
          <button @click="showScoreEdit = false">Cancel</button>
          <button class="primary" @click="savePlayerScore">Save Score</button>
        </div>
      </div>
    </div>

    <!-- Модалка победителя -->
    <div v-if="showWinnerModal" class="winner-modal-overlay" @click.self="closeWinnerModal">
      <div class="winner-modal-content">
        <div class="winner-confetti">
          <div v-for="i in 50" :key="i" class="confetti-piece" :style="getConfettiStyle(i)"></div>
        </div>
        <div class="winner-header">
          <span class="winner-emoji">🏆</span>
          <h2> That's it !</h2>
        </div>

        <div class="winner-avatar-container">
          <img :src="winnerPlayer?.avatar" :alt="winnerPlayer?.name" class="winner-avatar-large" />
          <div class="winner-name">{{ winnerPlayer?.name }}</div>
        </div>

        <div class="winner-check-container">
          <div class="winner-check">
            <div class="check-header">
              <span>🏦 Vincent's BANK</span>
            </div>
            <div class="check-body">
              <div class="check-pay-to">
                <span class="check-label">PAY TO:</span>
                <span class="check-value">{{ winnerPlayer?.name }}</span>
              </div>
              <div class="check-amount">
                <span class="check-label">AMOUNT:</span>
                <span class="check-value winner-amount">${{ winnerPlayer?.score }}</span>
              </div>
              <div class="check-signature">
                <span>Authorized Signature</span>
                <div class="signature-line">_________________</div>
              </div>
            </div>
            <div class="check-stamp">⭐ WINNER ⭐</div>
          </div>
        </div>

        <div class="winner-stats">
          <div class="stat-item">
            <span class="stat-label">Questions Answered</span>
            <span class="stat-value">{{ totalQuestionsUsed }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Final Score</span>
            <span class="stat-value winner-amount">${{ winnerPlayer?.score }}</span>
          </div>
        </div>

        <div class="winner-actions">
          <button class="play-again-btn" @click="resetGame">🔄 Play Again</button>
          <button class="close-winner-btn" @click="closeWinnerModal">✕ Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SoundManager from '../components/KeyboardSoundManager.vue';

import gameJeopardyData from '../dataForGames/GameJeopardyData';

const route = useRoute();
const router = useRouter();

// Получаем параметры из URL
const missionName = route.params.missionName;
const styleParam = route.params.style || 'dark';

// Состояния
const selectedQuestion = ref(null);
const showAnswer = ref(false);
const theme = ref(styleParam);
const activePlayer = ref(0); // 0 - это Vincent,  1 - Polina
const playerMenuOpen = ref(null);
const showWinnerModal = ref(false);
const winnerPlayer = ref(null);
const customScoreValue = ref(0);


// Модалки
const showNameEdit = ref(false);
const showAvatarSelect = ref(false);
const showScoreEdit = ref(false);
const editNameValue = ref('');
const editAvatarValue = ref('');
const editScoreValue = ref(0);
const editingPlayerIndex = ref(null);
const editingPlayerName = ref('');
const currentPlayerScore = ref(0);

// Получаем данные игры
const gameData = computed(() => {
  return gameJeopardyData[missionName] || null;
});

const categories = computed(() => {
  return gameData.value?.categories || [];
});

const availableGames = computed(() => {
  return Object.keys(gameJeopardyData);
});

// Стандартные аватары
const defaultAvatars = [
  new URL("../assets/images/ancient_man.jpeg", import.meta.url).href,
  new URL("../assets/images/choose missions snowman.jpg", import.meta.url).href,
  new URL("../assets/images/vampire.jpeg", import.meta.url).href,
  new URL("../assets/images/aRedDart.png", import.meta.url).href,
];

const fallbackAvatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Vincent',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
];

const availableAvatars = ref(defaultAvatars.length > 0 ? defaultAvatars : fallbackAvatars);

// Функция создания игрока
const createPlayer = (name, avatarIndex) => ({
  name: name,
  avatar: availableAvatars.value[avatarIndex] || fallbackAvatars[avatarIndex] || fallbackAvatars[0],
  score: 0
});

// Создаем двух игроков по умолчанию
const players = ref([
  createPlayer('Vincent', 0),
  createPlayer('Polina', 1)
]);

// Проверка завершения игры
const checkGameComplete = () => {
  let used = 0;
  let total = 0;

  categories.value.forEach(category => {
    category.questions.forEach(q => {
      total++;
      if (q.used) used++;
    });
  });

  if (used === total && total > 0) {
    const winner = players.value.reduce((a, b) => Number(a.score) > Number(b.score) ? a : b);
    winnerPlayer.value = winner;
    showWinnerModal.value = true;
  }
};


// Загрузка аватарки через файл
const handleAvatarUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      // Добавляем новую аватарку в список доступных
      availableAvatars.value.push(imageUrl);
      // Выбираем ее
      editAvatarValue.value = imageUrl;
    };
    reader.readAsDataURL(file);
  }
};

// Перетаскивание файла (Drag & Drop)
const handleAvatarDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      availableAvatars.value.push(imageUrl);
      editAvatarValue.value = imageUrl;
    };
    reader.readAsDataURL(file);
  }
};

// Методы игроков
const setActivePlayer = (index) => {
  activePlayer.value = index;
  playerMenuOpen.value = null;
};

const addPlayer = () => {
  const avatarIndex = players.value.length % availableAvatars.value.length;
  const newPlayer = {
    name: `Player ${players.value.length + 1}`,
    avatar: availableAvatars.value[avatarIndex] || fallbackAvatars[0],
    score: 0
  };
  players.value.push(newPlayer);
  activePlayer.value = players.value.length - 1;
};

const removePlayer = (index) => {
  if (players.value.length <= 1) return;
  if (confirm(`Remove ${players.value[index].name} from the game?`)) {
    players.value.splice(index, 1);
    if (activePlayer.value >= players.value.length) {
      activePlayer.value = players.value.length - 1;
    }
  }
};

const togglePlayerMenu = (index) => {
  playerMenuOpen.value = playerMenuOpen.value === index ? null : index;
};

const editPlayerName = (index) => {
  editingPlayerIndex.value = index;
  editNameValue.value = players.value[index].name;
  showNameEdit.value = true;
  playerMenuOpen.value = null;
};

const savePlayerName = () => {
  if (editingPlayerIndex.value !== null && editNameValue.value.trim()) {
    players.value[editingPlayerIndex.value].name = editNameValue.value.trim();
  }
  showNameEdit.value = false;
  editingPlayerIndex.value = null;
};

const changePlayerAvatar = (index) => {
  editingPlayerIndex.value = index;
  editAvatarValue.value = players.value[index].avatar;
  showAvatarSelect.value = true;
  playerMenuOpen.value = null;
};

const savePlayerAvatar = () => {
  if (editingPlayerIndex.value !== null && editAvatarValue.value) {
    players.value[editingPlayerIndex.value].avatar = editAvatarValue.value;
  }
  showAvatarSelect.value = false;
  editingPlayerIndex.value = null;
};

const editPlayerScore = (index) => {
  editingPlayerIndex.value = index;
  editingPlayerName.value = players.value[index].name;
  currentPlayerScore.value = Number(players.value[index].score) || 0;
  editScoreValue.value = Number(players.value[index].score) || 0;
  showScoreEdit.value = true;
  playerMenuOpen.value = null;
};

const savePlayerScore = () => {
  if (editingPlayerIndex.value !== null && !isNaN(editScoreValue.value)) {
    players.value[editingPlayerIndex.value].score = Math.max(0, Number(editScoreValue.value));
  }
  showScoreEdit.value = false;
  editingPlayerIndex.value = null;
};

// Методы игры
const selectQuestion = (question) => {
  if (question.used) return;
  if (players.value.length === 0) {
    alert('Please add at least one player first!');
    return;
  }
  selectedQuestion.value = question;
  showAnswer.value = false;
  customScoreValue.value = question.value; // 👈 Устанавливаем значение по умолчанию = полная стоимость вопроса
};

const closeQuestion = () => {
  selectedQuestion.value = null;
  showAnswer.value = false;
};

const handleCorrect = () => {
  if (!selectedQuestion.value || activePlayer.value === null) return;

  const question = selectedQuestion.value;
  const player = players.value[activePlayer.value];

  if (player) {
    const currentScore = Number(player.score) || 0;
    const addValue = Number(customScoreValue.value) || 0; // 👈 Используем customScoreValue
    player.score = currentScore + addValue;
  }

  question.used = true;
  closeQuestion();
  checkGameComplete();
};

const handleWrong = () => {
  if (!selectedQuestion.value) return;
  selectedQuestion.value.used = true;
  closeQuestion();
  checkGameComplete();
};

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  router.push({
    path: `/see-all-sets-of-words/${missionName}/jeopardy/${theme.value}`
  });
};

const goBack = () => {
  router.back();
};

const closeWinnerModal = () => {
  showWinnerModal.value = false;
};

const resetGame = () => {
  categories.value.forEach(category => {
    category.questions.forEach(q => {
      q.used = false;
    });
  });

  players.value.forEach(p => {
    p.score = 0;
  });

  activePlayer.value = 0;
  showWinnerModal.value = false;
  selectedQuestion.value = null;
  showAnswer.value = false;
  winnerPlayer.value = null;
};

// Функция для генерации стилей конфетти
const getConfettiStyle = (index) => {
  const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bd6', '#ff9f43', '#00d2d3'];
  const color = colors[index % colors.length];
  const left = Math.random() * 100;
  const delay = Math.random() * 2;
  const duration = 2 + Math.random() * 2;
  const size = 6 + Math.random() * 8;
  const rotation = Math.random() * 360;

  return {
    left: `${left}%`,
    backgroundColor: color,
    width: `${size}px`,
    height: `${size * 0.6}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    transform: `rotate(${rotation}deg)`,
    '--x': `${(Math.random() - 0.5) * 200}px`,
    '--y': `${-(Math.random() * 300 + 200)}px`
  };
};

onMounted(() => {
  console.log('🎯 Jeopardy loaded:', {
    missionName,
    style: styleParam,
    data: gameData.value ? '✅ Found' : '❌ Not found'
  });
});
</script>

<style lang="scss" scoped>
.jeopardy-container {
  max-width: 1200px;
  margin: 80px auto 20px;
  padding: 20px;
  min-height: calc(100vh - 100px);
  transition: all 0.3s ease;
}

// Стили для загрузки аватара
.upload-avatar-area {
  text-align: center;
  margin: 10px 0;
  padding: 15px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ffd93d;
    background: rgba(255, 217, 61, 0.05);
  }
}

.upload-btn {
  display: inline-block;
  padding: 8px 20px;
  background: #ffd93d;
  color: #1a1a2e;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  margin-bottom: 8px;

  &:hover {
    transform: scale(1.05);
  }
}

.upload-hint {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 8px;
}

.drag-drop-zone {
  padding: 15px;
  border: 2px dashed rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #ffd93d;
    background: rgba(255, 217, 61, 0.05);
  }
}

// Стили для светлой темы
.jeopardy-container.light {
  .upload-avatar-area {
    border-color: rgba(0, 0, 0, 0.15);

    &:hover {
      border-color: #4a6fa5;
      background: rgba(74, 111, 165, 0.05);
    }
  }

  .upload-btn {
    background: #4a6fa5;
    color: #fff;
  }


  .drag-drop-zone {
    border-color: rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.4);

    &:hover {
      border-color: #4a6fa5;
      background: rgba(74, 111, 165, 0.05);
    }
  }

  .upload-hint {
    color: rgba(0, 0, 0, 0.4);
  }
}

// ===== ТЕМНАЯ ТЕМА =====
.jeopardy-container.dark {
  background: #0a0a1a;
  color: #fff;

  .jeopardy-board {
    background: #1a1a2e;
  }

  .category-header {
    background: #2d4059;
    color: #fff;
  }

  .question-cell {
    background: #0f3460;
    color: #ffd93d;

    &:hover:not(.used) {
      background: #1a4a7a;
    }

    &.used {
      background: #1a1a2e;
      color: #4a4a6a;
    }
  }

  .modal-content {
    background: #2d4059;
    color: #fff;
  }

  .player-card {
    background: rgba(255, 255, 255, 0.05);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &.active {
      border-color: #ffd93d;
      background: rgba(255, 217, 61, 0.1);
    }
  }

  .player-menu-dropdown {
    background: #1a1a2e;
  }

  .name-input {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    border-color: rgba(255, 255, 255, 0.2);
  }

  .turn-indicator {
    color: rgba(255, 255, 255, 0.8);

    .active-player-name {
      color: #18d103;
    }
  }

  .level-info {
    background: rgba(255, 255, 255, 0.05);
  }

  .players-container {
    background: rgba(255, 255, 255, 0.05);
  }

  .jeopardy-header {
    background: rgba(255, 255, 255, 0.05);
  }

  .back-btn {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: #fff;
  }

  .theme-toggle {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: #fff;
  }

  .close-btn {
    color: #fff;
  }

  .question-value {
    color: #ffd93d;
  }

  .player-score {
    color: #ffd93d;
  }

  .active-indicator {
    color: #ffd93d;
  }

  .add-player-btn {
    border-color: rgba(255, 255, 255, 0.3);

    &:hover {
      border-color: #ffd93d;
      background: rgba(255, 217, 61, 0.1);
    }

    .add-icon {
      color: #ffd93d;
    }
  }
}

// ===== СВЕТЛАЯ ТЕМА =====
.jeopardy-container.light {
  background: #f5f5f5;
  color: #1a1a2e;

  .jeopardy-board {
    background: #e8e8e8;
  }

  .category-header {
    background: #4a6fa5;
    color: #fff;
  }

  .question-cell {
    background: #6b9fd4;
    color: #fff;

    &:hover:not(.used) {
      background: #7fb0e0;
    }

    &.used {
      background: #d0d0d0;
      color: #999;
    }
  }

  .modal-content {
    background: #fff;
    color: #1a1a2e;
  }

  .player-card {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(0, 0, 0, 0.1);

    &:hover {
      border-color: #6b9fd4;
    }

    &.active {
      border-color: #4a6fa5;
      background: rgba(74, 111, 165, 0.1);
    }
  }

  .player-menu-dropdown {
    background: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  .name-input {
    background: #f5f5f5;
    color: #1a1a2e;
    border-color: #ddd;

    &:focus {
      border-color: #4a6fa5;
    }
  }

  .turn-indicator {
    color: #1a1a2e;

    .active-player-name {
      color: #4a6fa5;
    }
  }

  .level-info {
    background: rgba(0, 0, 0, 0.05);
  }

  .players-container {
    background: rgba(0, 0, 0, 0.05);
  }

  .jeopardy-header {
    background: rgba(0, 0, 0, 0.05);
  }

  .back-btn {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.15);
    color: #1a1a2e;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }

  .theme-toggle {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.15);
    color: #1a1a2e;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }

  .close-btn {
    color: #1a1a2e;
  }

  .question-value {
    color: #4a6fa5;
  }

  .player-score {
    color: #4a6fa5;
  }

  .active-indicator {
    color: #4a6fa5;
  }

  .add-player-btn {
    border-color: rgba(0, 0, 0, 0.2);

    &:hover {
      border-color: #4a6fa5;
      background: rgba(74, 111, 165, 0.1);
    }

    .add-icon {
      color: #4a6fa5;
    }
  }

  .error-message {
    background: rgba(255, 0, 0, 0.1);
    color: #1a1a2e;
  }

  .modal-actions button {
    color: #1a1a2e;
  }

  .modal-actions button.primary {
    background: #4a6fa5;
    color: #fff;
  }

  .show-answer-btn {
    background: #4a6fa5;
    color: #fff;
  }

  .correct-btn {
    background: #51cf66;
    color: #fff;
  }

  .wrong-btn {
    background: #ff6b6b;
    color: #fff;
  }

  .current-player-indicator {
    color: #4a6fa5;
  }

  .player-score-badge {
    background: #4a6fa5;
    color: #fff;
  }

  .level-badge {
    background: #4a6fa5;
  }

  .player-name-display,
  .current-score-display {
    color: #1a1a2e;
  }
}

// ===== ОБЩИЕ СТИЛИ =====
.jeopardy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  margin-bottom: 20px;
  border-radius: 12px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .header-center {
    flex: 2;
    text-align: center;
  }

  .header-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
  }

  h1 {
    margin: 0;
    font-size: 24px;
  }
}

.turn-indicator {
  font-size: 18px;

  .active-player-name {
    font-size: 22px;
    margin-left: 5px;
    animation: pulse 1.5s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.back-btn {
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid;

  &:hover {
    transform: translateX(-2px);
  }
}

.theme-toggle {
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid;

  &:hover {
    transform: scale(1.05);
  }
}

.level-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 10px 15px;
  border-radius: 8px;

  .level-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 14px;
    background: #ffd93d;
    color: #1a1a2e;
  }

  .game-name {
    opacity: 0.7;
    font-size: 14px;
  }

  .game-desc {
    font-weight: bold;
    font-size: 16px;
  }
}

.error-message {
  text-align: center;
  padding: 40px;
  border-radius: 12px;
  margin: 20px 0;
}

// ===== ИГРОВАЯ ДОСКА =====
.jeopardy-board {
  display: grid;
  gap: 8px;
  padding: 15px;
  border-radius: 16px;
  margin-bottom: 20px;
}

.category-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-header {
  padding: 15px 10px;
  text-align: center;
  font-weight: bold;
  border-radius: 8px;
  font-size: 14px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  word-break: break-word;
}

.question-cell {
  padding: 20px;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(.used) {
    transform: scale(1.05);
  }

  &.used {
    cursor: default;
    opacity: 0.5;
  }
}

// ===== СЕКЦИЯ ИГРОКОВ (ОБНОВЛЕННАЯ) =====
.players-section {
  margin-top: 20px;
}

.players-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 30px 15px 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  position: relative;
}

.player-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 10px 15px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-width: 100px;
  border: 2px solid transparent;
  padding-top: 30px;

  &.active {
    transform: scale(1.05);
    border-color: #ffd93d;
    box-shadow: 0 4px 20px rgba(255, 217, 61, 0.3);
  }
}

.player-avatar-wrapper {
  position: relative;
  width: 105px;
  height: 105px;
  flex-shrink: 0;
  margin-top: -60px;
  margin-bottom: 5px;
}

.player-avatar {
  width: 105px;
  height: 105px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.player-card.active .player-avatar {
  border-color: #ffd93d;
  box-shadow: 0 0 30px rgba(255, 217, 61, 0.5);
}

.player-score-badge {
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: #ffd93d;
  color: #1a1a2e;
  font-size: 13px;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 12px;
  min-width: 25px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.player-menu-btn {
  position: absolute;
  top: -5px;
  left: -5px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 10;
}

.player-card:hover .player-menu-btn {
  opacity: 1;
}

.player-menu-dropdown {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 8px;
  padding: 5px 0;
  min-width: 140px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 100;

  button {
    display: block;
    width: 100%;
    padding: 8px 15px;
    background: none;
    border: none;
    color: inherit;
    text-align: left;
    cursor: pointer;
    font-size: 13px;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &.danger {
      color: #ff6b6b;

      &:hover {
        background: rgba(255, 0, 0, 0.1);
      }
    }
  }
}

.player-name {
  font-weight: bold;
  font-size: 14px;
  margin-top: 2px;
}

.player-score {
  font-size: 16px;
  font-weight: bold;
  color: #ffd93d;
  min-width: 50px;
  text-align: center;
}

.active-indicator {
  color: #ffd93d;
  font-size: 12px;
  animation: pulse 1s ease-in-out infinite;
  margin-left: 5px;
}

.add-player-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px 20px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  justify-content: center;
  padding-top: 30px;
  margin-top: -5px;

  &:hover {
    border-color: #ffd93d;
    background: rgba(255, 217, 61, 0.1);
  }

  .add-icon {
    font-size: 28px;
    font-weight: bold;
    color: #ffd93d;
  }

  span {
    font-size: 12px;
    opacity: 0.7;
  }
}

// ===== МОДАЛЬНЫЕ ОКНА =====
.question-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  animation: slideUp 0.3s ease;

  &.small {
    max-width: 400px;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.question-value {
  font-size: 24px;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  padding: 0 8px;
  color: inherit;
}

.current-player-indicator {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

.question-body {
  text-align: center;
}

.question-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.question-audio {
  width: 100%;
  margin-bottom: 15px;
}

.question-text {
  font-size: 24px;
  margin: 20px 0;
  line-height: 1.5;
  white-space: pre-line;

}

.answer-section {
  margin-top: 20px;
  white-space: pre-line;
}

.show-answer-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.answer-display {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.answer-text {
  font-size: 20px;
  font-weight: bold;
  color: #51cf66;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.correct-btn,
.wrong-btn {
  padding: 10px 25px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.correct-btn {
  background: #51cf66;
  color: white;
}

.wrong-btn {
  background: #ff6b6b;
  color: white;
}

.name-input {
  width: 100%;
  padding: 10px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 16px;
  margin: 10px 0;

  &:focus {
    outline: none;
    border-color: #ffd93d;
  }
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 15px;

  button {
    padding: 8px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }

    &.primary {
      background: #ffd93d;
      color: #1a1a2e;
    }
  }
}

.player-name-display,
.current-score-display {
  margin: 5px 0;
  text-align: center;
}

// ===== СЕТКА АВАТАРОВ =====
.avatar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 10px 0;
}

.avatar-option {
  border: 3px solid transparent;
  border-radius: 12px;
  padding: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 8px;
  }

  &:hover {
    transform: scale(1.05);
  }

  &.selected {
    border-color: #ffd93d;
    background: rgba(255, 217, 61, 0.1);
  }
}
.score-input-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 10px 0;
  flex-wrap: wrap;

  label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }

  .score-input {
    width: 80px;
    padding: 6px 10px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #ffd93d;
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .max-score-hint {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
  }
}

.jeopardy-container.light {
  .score-input-group {
    label {
      color: #1a1a2e;
    }

    .score-input {
      background: #f5f5f5;
      color: #1a1a2e;
      border-color: #ddd;

      &:focus {
        border-color: #4a6fa5;
      }
    }

    .max-score-hint {
      color: rgba(0, 0, 0, 0.4);
    }
  }
}

// ===== МОДАЛКА ПОБЕДИТЕЛЯ =====
.winner-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.5s ease;
}

.winner-modal-content {
  background: linear-gradient(135deg, #1a1a2e, #2d4059);
  border-radius: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 40px 30px;
  position: relative;
  border: 3px solid #ffd93d;
  box-shadow: 0 0 60px rgba(255, 217, 61, 0.3);
  animation: winnerSlideUp 0.6s ease;
}

.winner-confetti {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  border-radius: 24px;
}

.confetti-piece {
  position: absolute;
  top: -20px;
  border-radius: 2px;
  animation: confettiFall linear forwards;
}

@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(calc(100vh)) rotate(720deg);
    opacity: 0;
  }
}

.winner-header {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;

  .winner-emoji {
    font-size: 48px;
    display: block;
  }

  h2 {
    font-size: 36px;
    font-weight: 900;
    background: linear-gradient(135deg, #ffd93d, #ff6b6b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 5px 0;
    letter-spacing: 4px;
  }
}

.winner-avatar-container {
  text-align: center;
  position: relative;
  z-index: 1;
  margin: 15px 0;

  .winner-avatar-large {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 4px solid #ffd93d;
    box-shadow: 0 0 30px rgba(255, 217, 61, 0.5);
    object-fit: cover;
  }

  .winner-name {
    font-size: 24px;
    font-weight: bold;
    color: #fff;
    margin-top: 10px;
  }
}

.winner-check-container {
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
  margin: 20px 0;
}

.winner-check {
  background: #fff;
  border-radius: 16px;
  padding: 20px 25px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;

  .check-header {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: #1a1a2e;
    border-bottom: 2px dashed #ddd;
    padding-bottom: 10px;
    margin-bottom: 15px;
    letter-spacing: 2px;
  }

  .check-body {
    .check-pay-to,
    .check-amount {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;

      .check-label {
        color: #666;
        font-size: 13px;
        font-weight: 600;
      }

      .check-value {
        color: #1a1a2e;
        font-weight: bold;
        font-size: 16px;

        &.winner-amount {
          color: #e94560;
          font-size: 24px;
        }
      }
    }

    .check-signature {
      margin-top: 15px;
      text-align: right;

      span {
        font-size: 11px;
        color: #999;
        display: block;
      }

      .signature-line {
        border-bottom: 2px solid #1a1a2e;
        width: 150px;
        margin-left: auto;
        height: 20px;
      }
    }
  }

  .check-stamp {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-25deg);
    font-size: 32px;
    font-weight: 900;
    color: #ffd93d;
    opacity: 0.3;
    border: 4px solid #ffd93d;
    padding: 8px 15px;
    border-radius: 8px;
    pointer-events: none;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
}

.winner-stats {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  position: relative;
  z-index: 1;

  .stat-item {
    text-align: center;

    .stat-label {
      display: block;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .stat-value {
      display: block;
      font-size: 28px;
      font-weight: bold;
      color: #fff;

      &.winner-amount {
        color: #ffd93d;
      }
    }
  }
}

.winner-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  position: relative;
  z-index: 1;
  margin-top: 10px;

  button {
    padding: 12px 30px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  .play-again-btn {
    background: #ffd93d;
    color: #1a1a2e;

    &:hover {
      box-shadow: 0 0 30px rgba(255, 217, 61, 0.4);
    }
  }

  .close-winner-btn {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

@keyframes winnerSlideUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// ===== АНИМАЦИИ =====
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ===== АДАПТИВНОСТЬ =====
@media (max-width: 1024px) {
  .jeopardy-board {
    gap: 6px;
    padding: 10px;
  }
}

@media (max-width: 768px) {
  .jeopardy-board {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 5px;
    padding: 8px;
  }

  .category-header {
    font-size: 11px;
    min-height: 45px;
    padding: 10px 5px;
  }

  .question-cell {
    font-size: 16px;
    padding: 15px;
    min-height: 45px;
  }

  .question-text {
    font-size: 20px;

  }

  .jeopardy-header {
    flex-wrap: wrap;
    gap: 10px;

    .header-left,
    .header-center,
    .header-right {
      flex: 1 1 100%;
      text-align: center;
      justify-content: center;
    }

    h1 {
      font-size: 18px;
    }

    .turn-indicator {
      font-size: 16px;

      .active-player-name {
        font-size: 18px;
      }
    }
  }

  .players-container {
    gap: 15px;
    padding: 25px 10px 10px;
  }

  .player-card {
    min-width: 80px;
    padding: 8px 10px 10px;
    padding-top: 25px;
  }

  .player-avatar-wrapper {
    width: 50px;
    height: 50px;
    margin-top: -28px;
  }

  .player-avatar {
    width: 50px;
    height: 50px;
  }

  .player-name {
    font-size: 12px;
  }

  .player-score {
    font-size: 14px;
    min-width: 30px;
  }

  .add-player-btn {
    min-width: 80px;
    padding: 8px 12px;
    padding-top: 25px;

    .add-icon {
      font-size: 22px;
    }

    span {
      font-size: 11px;
    }
  }

  .winner-modal-content {
    padding: 25px 15px;
  }

  .winner-check {
    padding: 15px;

    .check-body .check-amount .check-value.winner-amount {
      font-size: 18px;
    }

    .check-stamp {
      font-size: 22px;
    }
  }

  .winner-avatar-large {
    width: 80px !important;
    height: 80px !important;
  }

  .winner-header h2 {
    font-size: 28px;
  }

  .winner-stats .stat-item .stat-value {
    font-size: 22px;
  }

  .winner-actions {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}

@media (max-width: 480px) {
  .jeopardy-board {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 4px;
    padding: 5px;
  }

  .question-cell {
    font-size: 14px;
    padding: 10px;
    min-height: 40px;
  }

  .modal-content {
    padding: 15px;
  }

  .question-text {
    font-size: 18px;
  }

  .avatar-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
