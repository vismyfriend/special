<template>
  <div class="detective-dashboard">
    <!-- Фоновое затемнение -->
    <div class="background-overlay"></div>

    <!-- Главный контент -->
    <div class="detective-content">
      <!-- Шапка -->
      <div class="case-header">
        <div class="case-badge">⚡ S.P.E.C.I.A.L.</div>
        <div class="case-stamp">{{ currentDate }}</div>
      </div>

      <!-- Центральная секция с агентом -->
      <div class="agent-showcase">
        <!-- Крупная картинка агента -->
        <div class="agent-figure">
          <img
            src="../assets/images/special logo detective girl.png"
            alt="agent"
            class="agent-image"
          />
          <div class="speech-bubble" :class="{ visible: isBubbleVisible }">
            <p class="bubble-text">
              {{ bubbleMessage }}
            </p>
          </div>
        </div>

        <!-- Действия агента -->
        <div class="agent-actions">
          <button class="case-btn primary" @click="goToRegistration">
            {{ registrationButtonText }}
          </button>
          <div class="action-icons">
            <template v-if="hasName">
              <button class="icon-btn switch" title="сменить имя" @click="onAccept">⇄</button>
              <button class="icon-btn accept" title="войти" @click="onQuestionClick">✓</button>
            </template>
            <template v-else>
              <button class="icon-btn decline" title="отказаться" @click="onDecline">✕</button>
              <button class="icon-btn accept" title="согласен" @click="onAccept">✓</button>
            </template>
          </div>
        </div>
      </div>

      <!-- Сетка игр (папки) -->
      <div class="cases-grid">
        <div
          class="case-file"
          v-for="game in availableGames"
          :key="game.id"
          @click="goToGameSelection(game)"
        >
          <div class="file-folder">
            <div class="folder-tab"></div>
            <div class="folder-content">
              <div class="file-icon" :style="{'background-image': `url(${getImagePath(game.icon)})`}"></div>
              <div class="file-label">{{ game.name }}</div>
              <div class="file-tag" v-if="game.description">📎 {{ game.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Подвал -->
      <div class="case-footer">
        <span class="footer-text">🔍 Classified • For Agents Only</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { AllGames } from "src/dataForGames/allGamesAndSetsOfWordsList";
import { api } from "src/api";
import { useGameStore } from "stores/example-store";

const router = useRouter();
const gameStore = useGameStore();

const hasName = computed(() => {
  const name = localStorage.getItem('agentName');
  return name && name !== 'nonameYet';
});

const currentDate = computed(() => {
  return new Date().toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
});

const registrationButtonText = computed(() => {
  return hasName.value
    ? `Привет, агент ${localStorage.getItem('agentName')}`
    : '📋 Создать личное дело';
});

// ===== ЧАТ БАБЛ =====
const bubbleMessages = [
  'Выбери задание, агент 🕵️‍♀️',
  'Готова к миссии? 🎯',
  'Дела ждут! 📁',
  'Твой выбор — твоя судьба 🔮',
  'Давай, не тормози! 🚀',
  'Здесь твой шанс ✨',
  'Что выберешь? 🤔'
];

const bubbleMessage = ref('Выбери задание, агент 🕵️‍♀️');
const isBubbleVisible = ref(true);
let messageInterval = null;

// Функция обновления сообщения
const rotateMessage = () => {
  const currentIndex = bubbleMessages.indexOf(bubbleMessage.value);
  const nextIndex = (currentIndex + 1) % bubbleMessages.length;
  bubbleMessage.value = bubbleMessages[nextIndex];
};

const onQuestionClick = async () => {
  const savedName = localStorage.getItem('agentName');
  if (!savedName) return;
  if (!localStorage.getItem('token')) {
    try {
      const res = await api.auth.post(savedName);
      localStorage.setItem('token', res.data.token);
    } catch (error) {
      console.error('Ошибка токена:', error);
    }
  }
  gameStore.setAgentName(savedName);
  await router.push("/see-all-sets-of-words/");
};

const onAccept = () => goToRegistration();
const onDecline = () => {
  const actions = document.querySelector(".agent-actions");
  if (actions) actions.style.display = "none";
};

const getImagePath = (iconName) => {
  return new URL(`../assets/images/${iconName}`, import.meta.url).href;
};

const availableGames = ref(AllGames);

const goToGameSelection = (game) => {
  if (game.externalUrl) {
    window.open(game.externalUrl, "_blank");
  } else {
    router.push({ path: game.route });
  }
};

const goToRegistration = () => {
  router.push("/registration");
};

onMounted(() => {
  console.log("🔍 Детективное досье загружено");
  // Меняем сообщение каждые 5 секунд
  messageInterval = setInterval(rotateMessage, 5000);
});

onUnmounted(() => {
  if (messageInterval) clearInterval(messageInterval);
});
</script>

<style lang="scss" scoped>
/* ============================================================
   ДЕТЕКТИВНАЯ ТЕМА — с большим агентом
   ============================================================ */

.detective-dashboard {
  position: relative;
  min-height: 100vh;
  padding: 20px 20px 30px;
  background: #1a1410;
  font-family: 'Courier New', 'Special Elite', monospace;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-x: hidden;
}

.background-overlay {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 30%, rgba(60, 40, 30, 0.2) 0%, transparent 70%),
    radial-gradient(ellipse at 20% 80%, rgba(40, 30, 25, 0.15) 0%, transparent 60%),
    repeating-linear-gradient(45deg,
      rgba(255, 200, 150, 0.015) 0px,
      rgba(255, 200, 150, 0.015) 2px,
      transparent 2px,
      transparent 8px);
  pointer-events: none;
  z-index: 0;
}

.detective-content {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  width: 100%;
}

/* ===== ШАПКА ===== */
.case-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0 16px;
  border-bottom: 2px solid rgba(200, 160, 120, 0.1);
  flex-wrap: wrap;
  gap: 8px;
}

.case-badge {
  background: rgba(200, 160, 120, 0.08);
  color: #c4b09a;
  padding: 4px 14px;
  border-radius: 4px;
  font-size: 13px;
  letter-spacing: 2px;
  border: 1px solid rgba(200, 160, 120, 0.08);
}

.case-stamp {
  font-size: 13px;
  color: rgba(200, 160, 120, 0.25);
  letter-spacing: 1px;
  padding: 4px 12px;
  border: 1px dashed rgba(200, 160, 120, 0.08);
  border-radius: 4px;
}

/* ===== ЦЕНТРАЛЬНАЯ СЕКЦИЯ ===== */
.agent-showcase {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 20px;
  gap: 16px;
}

/* ===== ФИГУРА АГЕНТА ===== */
.agent-figure {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 320px;
}

.agent-image {
  width: 100%;
  max-width: 280px;
  height: auto;
  display: block;
  filter: drop-shadow(0 10px 40px rgba(0, 0, 0, 0.6));
  transition: transform 0.3s ease;
}

.agent-figure:hover .agent-image {
  transform: scale(1.02);
}

/* ===== ЧАТ-БАБЛ ===== */
.speech-bubble {
  position: absolute;
  top: -10px;
  right: -20px;
  background: rgba(30, 25, 22, 0.92);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(200, 160, 120, 0.2);
  border-radius: 16px;
  padding: 12px 18px;
  max-width: 180px;
  min-width: 100px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.02);
  animation: bubbleFade 0.5s ease;
  transition: all 0.3s ease;
}

.speech-bubble::before {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 30px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 12px solid rgba(30, 25, 22, 0.92);
}

.speech-bubble .bubble-text {
  margin: 0;
  font-size: 14px;
  color: #e8d5b8;
  line-height: 1.4;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
  min-height: 20px;
}

@keyframes bubbleFade {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ===== КНОПКИ АГЕНТА ===== */
.agent-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 4px;
}

.case-btn {
  padding: 10px 28px;
  border: 1px solid rgba(200, 160, 120, 0.15);
  border-radius: 8px;
  background: rgba(200, 160, 120, 0.04);
  color: #d4c5b0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.case-btn:hover {
  background: rgba(200, 160, 120, 0.08);
  border-color: rgba(200, 160, 120, 0.25);
  transform: translateY(-1px);
}

.case-btn.primary {
  background: rgba(200, 160, 120, 0.06);
  border-color: rgba(200, 160, 120, 0.15);
}

.case-btn.primary:hover {
  background: rgba(200, 160, 120, 0.12);
  box-shadow: 0 0 30px rgba(200, 160, 120, 0.03);
}

.action-icons {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(200, 160, 120, 0.1);
  background: rgba(200, 160, 120, 0.03);
  color: #b8a690;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: rgba(200, 160, 120, 0.1);
  border-color: rgba(200, 160, 120, 0.2);
  transform: scale(1.05);
}

.icon-btn.accept:hover {
  border-color: #6b9f7a;
  color: #8bc34a;
}

.icon-btn.decline:hover {
  border-color: #9f6b6b;
  color: #e57373;
}

.icon-btn.switch:hover {
  border-color: #c4a05a;
  color: #ffd54f;
}

/* ===== СЕТКА ИГР ===== */
.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 18px;
  margin: 16px 0 20px;
}

.case-file {
  cursor: pointer;
  transition: all 0.3s ease;
}

.case-file:hover {
  transform: translateY(-4px);
}

.file-folder {
  background: rgba(40, 32, 28, 0.7);
  border: 1px solid rgba(200, 160, 120, 0.08);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  min-height: 140px;
  display: flex;
  flex-direction: column;
}

.file-folder:hover {
  border-color: rgba(200, 160, 120, 0.2);
  background: rgba(50, 40, 35, 0.7);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.folder-tab {
  height: 4px;
  background: linear-gradient(90deg, rgba(200, 160, 120, 0.15), rgba(200, 160, 120, 0.03));
  flex-shrink: 0;
}

.folder-content {
  padding: 14px 12px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  text-align: center;
}

.file-icon {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 8px;
  border: 1px solid rgba(200, 160, 120, 0.06);
  flex-shrink: 0;
}

.file-label {
  font-size: 13px;
  font-weight: 500;
  color: #d4c5b0;
  letter-spacing: 0.3px;
  font-family: 'Courier New', monospace;
}

.file-tag {
  font-size: 10px;
  color: rgba(200, 160, 120, 0.3);
  font-family: 'Courier New', monospace;
  line-height: 1.3;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== ПОДВАЛ ===== */
.case-footer {
  display: flex;
  justify-content: center;
  padding: 12px 0 4px;
  border-top: 1px solid rgba(200, 160, 120, 0.04);
  font-size: 11px;
  color: rgba(200, 160, 120, 0.12);
  letter-spacing: 2px;
}

/* ===== АДАПТИВ ===== */
@media (max-width: 700px) {
  .agent-image {
    max-width: 200px;
  }

  .speech-bubble {
    top: -6px;
    right: -10px;
    padding: 10px 14px;
    max-width: 130px;
    min-width: 70px;
  }

  .speech-bubble .bubble-text {
    font-size: 12px;
  }

  .cases-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 12px;
  }

  .case-header {
    flex-direction: row;
  }

  .case-btn {
    font-size: 13px;
    padding: 8px 18px;
  }
}

@media (max-width: 450px) {
  .agent-image {
    max-width: 160px;
  }

  .speech-bubble {
    top: -4px;
    right: -4px;
    padding: 8px 12px;
    max-width: 100px;
    min-width: 60px;
  }

  .speech-bubble .bubble-text {
    font-size: 11px;
  }

  .cases-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .file-folder {
    min-height: 110px;
  }

  .file-icon {
    width: 36px;
    height: 36px;
  }

  .file-label {
    font-size: 11px;
  }

  .agent-actions {
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .case-btn {
    width: 100%;
  }

  .action-icons {
    justify-content: center;
  }
}
</style>
