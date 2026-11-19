<template>
  <div class="reg-page">
    <div class="reg-card">
      <!-- Приветствие -->
      <div class="reg-header">
        <h1 class="reg-title">{{ currentQuestion }}</h1>
        <p class="reg-subtitle">Выбери имя и аватар, чтобы начать</p>
      </div>

      <!-- Ввод имени -->
      <div class="input-group">
        <label class="input-label">Твоё имя</label>
        <input
          v-model="userName"
          type="text"
          placeholder="Например, Vincent"
          class="name-input"
          @keyup.enter="submitName"
        />
        <!-- Предложенные имена -->
        <div v-if="suggestedNames.length > 0" class="suggestions">
          <button
            v-for="name in suggestedNames"
            :key="name"
            class="suggestion-chip"
            @click="userName = name"
          >
            {{ name }}
          </button>
        </div>
      </div>

      <!-- Выбор аватара -->
      <div class="input-group">
        <label class="input-label">Выбери аватар</label>
        <div class="avatar-grid">
          <button
            v-for="avatar in avatars"
            :key="avatar.id"
            class="avatar-btn"
            :class="{ selected: selectedAvatar === avatar.id }"
            @click="selectedAvatar = avatar.id"
          >
            {{ avatar.emoji }}
          </button>
        </div>
      </div>

      <!-- Кнопка входа -->
      <button
        class="submit-btn"
        :class="{ 'is-loading': isLoading }"
        :disabled="!isInputFilled || isLoading"
        @click="submitName"
      >
        <span v-if="!isLoading">Войти в игру 🚀</span>
        <span v-else>Загрузка...</span>
      </button>

      <!-- Ссылка на список агентов (опционально) -->
      <button class="agents-link" @click="showAgentsModal = true">
        👥 Посмотреть всех агентов
      </button>

      <!-- Модальное окно со списком агентов (оставил как было) -->
      <div v-if="showAgentsModal" class="agents-modal-overlay" @click="closeAgentsModal">
        <div class="agents-modal" @click.stop>
          <div class="agents-modal-header">
            <h3>👥 ВСЕ АГЕНТЫ</h3>
            <button class="close-modal-btn" @click="closeAgentsModal">✕</button>
          </div>
          <div class="agents-modal-body">
            <div v-if="agentsList.length === 0" class="no-agents">
              Скоро можно будет посмотреть всех остальных агентов 😢
            </div>
            <div v-else class="agents-list">
              <div v-for="(agent, index) in agentsList" :key="index" class="agent-item">
                <span class="agent-number">{{ index + 1 }}</span>
                <span class="agent-name-modal">{{ agent }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from "src/api";
import { useQuasar } from "quasar";
import { useGameStore } from "stores/example-store";

const router = useRouter();
const $q = useQuasar();
const gameStore = useGameStore();

const userName = ref("");
const isLoading = ref(false);
const isSubmitting = ref(false);
const suggestedNames = ref([]);
const showAgentsModal = ref(false);
const agentsList = ref([]);

// Вопросы для приветствия
const introQuestions = [
  "What is your name?",
  "And your name is...?",
  "Who are you?",
  "Do I know you?",
  "Tell me your name?",
  "Agent... who?",
  "I'm Alex, and you are...",
];
const currentQuestion = ref("");

// Аватары (эмодзи для простоты, но можно заменить на картинки)
const avatars = [
  { id: 1, emoji: "🕵️‍♂️" },
  { id: 2, emoji: "👩‍🚀" },
  { id: 3, emoji: "🦊" },
  { id: 4, emoji: "🐱" },
  { id: 5, emoji: "🐼" },
  { id: 6, emoji: "🦁" },
  { id: 7, emoji: "🐸" },
  { id: 8, emoji: "👾" },
];
const selectedAvatar = ref(1); // По умолчанию первый

const isInputFilled = computed(() => userName.value && userName.value.trim().length > 0);

const setNotify = (message, color = 'black') => {
  $q.notify({ color, position: 'top', message, textColor: 'white' });
};

// Генерация уникального суффикса
const generateUniqueSuffix = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${timestamp}${random}`;
};

const submitName = async () => {
  if (!isInputFilled.value) return;
  isSubmitting.value = true;
  isLoading.value = true;

  const uniqueSuffix = generateUniqueSuffix();
  const uniqueAgentName = `${userName.value}#${uniqueSuffix}`;

  // Сохраняем локально
  localStorage.setItem('agentName', userName.value);
  localStorage.setItem('fullAgentName', uniqueAgentName);
  localStorage.setItem('avatarId', selectedAvatar.value);
  localStorage.setItem('agentNamePending', 'true');
  gameStore.setAgentName(uniqueAgentName);

  try {
    const res = await api.auth.post(uniqueAgentName);
    localStorage.setItem('token', res.data.token);
    localStorage.removeItem('agentNamePending');
    setNotify(`Привет, ${userName.value}! 🎉`, 'green');
  } catch (error) {
    console.error('❌ Ошибка регистрации:', error);
    setNotify(`👋 Привет, ${userName.value}! (сервер недоступен)`, 'orange');
  } finally {
    isSubmitting.value = false;
    isLoading.value = false;
  }

  await router.push("/see-all-sets-of-words/");
};

// Получение предыдущего имени
const getPreviousAgentName = () => {
  const savedName = localStorage.getItem('agentName');
  if (savedName) return savedName;
  return null;
};

// Загрузка предложенных имён
const loadSuggestedNames = () => {
  const previousName = getPreviousAgentName();
  const suggestions = [];
  if (previousName) {
    suggestions.push(previousName);
    const suffixVariant = `${previousName.split(/#|_/)[0]}_Great`;
    if (suffixVariant !== previousName) suggestions.push(suffixVariant);
  }
  if (suggestions.length === 0) {
    suggestions.push('Blondie', 'Аноним 007');
  }
  suggestedNames.value = suggestions;
};

// Загрузка агентов для модалки (оставил старую логику)
const showAllAgents = async () => {
  try {
    const res = await api.scores.get();
    let scores = res.data;
    if (res.data && res.data.data && Array.isArray(res.data.data)) scores = res.data.data;
    else if (!Array.isArray(scores)) scores = [];

    const uniqueAgents = [];
    const agentMap = new Map();
    if (Array.isArray(scores)) {
      scores.forEach(score => {
        if (score.agent && !agentMap.has(score.agent)) {
          agentMap.set(score.agent, true);
          uniqueAgents.push(score.agent);
        }
      });
    }
    agentsList.value = uniqueAgents;
    showAgentsModal.value = true;
  } catch (error) {
    console.error('Ошибка при получении агентов:', error);
    agentsList.value = ['Vincent 007', 'Don Carleone', 'Russel', 'Shally'];
    showAgentsModal.value = true;
  }
};

const closeAgentsModal = () => {
  showAgentsModal.value = false;
  agentsList.value = [];
};

onMounted(() => {
  // Случайный вопрос
  const randomIndex = Math.floor(Math.random() * introQuestions.length);
  currentQuestion.value = introQuestions[randomIndex];

  // Загрузка предложенных имён
  loadSuggestedNames();

  // Если есть сохранённый аватар, выбираем его
  const savedAvatar = localStorage.getItem('avatarId');
  if (savedAvatar) selectedAvatar.value = parseInt(savedAvatar);
});
</script>

<style scoped>
/* Фон страницы */
.reg-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e1e2f 0%, #2a2a40 100%);
  padding: 20px;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* Карточка */
.reg-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 40px 30px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

/* Заголовок */
.reg-header {
  text-align: center;
  margin-bottom: 30px;
}
.reg-title {
  font-size: 26px;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0 0 8px;
  line-height: 1.2;
}
.reg-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* Группы ввода */
.input-group {
  margin-bottom: 24px;
}
.input-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #444;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.name-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s;
  outline: none;
  box-sizing: border-box;
}
.name-input:focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.15);
}

/* Чипы предложенных имён */
.suggestions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}
.suggestion-chip {
  background: #f0f0f5;
  border: none;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
}
.suggestion-chip:hover {
  background: #e0e0f0;
  color: #6c5ce7;
}

/* Сетка аватаров */
.avatar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.avatar-btn {
  aspect-ratio: 1;
  border-radius: 16px;
  border: 3px solid transparent;
  background: #f8f8fc;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}
.avatar-btn:hover {
  background: #f0f0f5;
  transform: scale(1.05);
}
.avatar-btn.selected {
  border-color: #6c5ce7;
  background: #f0f0ff;
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2);
}

/* Кнопка входа */
.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 16px;
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(108, 92, 231, 0.4);
}
.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Ссылка на агентов */
.agents-link {
  width: 100%;
  background: none;
  border: none;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
  padding: 8px;
}
.agents-link:hover {
  color: #6c5ce7;
}

/* --- Стили для модалки агентов (оставил старые, они хорошие) --- */
.agents-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}
.agents-modal {
  background: #fff;
  border-radius: 20px;
  width: 90%;
  max-width: 320px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}
.agents-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}
.agents-modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: #1a1a2e;
}
.close-modal-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}
.agents-modal-body {
  padding: 12px;
  max-height: 50vh;
  overflow-y: auto;
}
.agent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 10px;
  transition: background 0.2s;
}
.agent-item:hover {
  background: #f5f5f5;
}
.agent-number {
  color: #6c5ce7;
  font-weight: 700;
  min-width: 24px;
}
.agent-name-modal {
  color: #333;
  font-size: 14px;
}
.no-agents {
  text-align: center;
  padding: 30px;
  color: #999;
  font-size: 14px;
}
</style>
