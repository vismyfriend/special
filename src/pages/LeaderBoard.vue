<template>
  <div class="result">
    <!-- Блок с результатами игры -->
    <div class="congratulations-container">
      <h2 class="congratulations-title">Congratulations!</h2>

      <div class="result-card">


        <div class="result-row">
          <span class="result-label">Время выполнения:</span>
          <span class="result-value time-value">{{ (gameStore.lastGameResults.time / 1000).toFixed(2) }} сек.</span>
        </div>
        <div class="result-row">
          <span class="result-label ">Ошибок:</span>
          <span class="result-value mistakes-amount">{{ gameStore.lastGameResults.mistakes }} mistake(s)</span>
        </div>

        <div class="result-row">
          <span class="result-label">Миссия:</span>
          <span class="result-value">"{{ wordSetNameSearch(gameStore.$state.wordSet) }}"</span>
        </div>

        <div class="result-row">
          <span class="result-label">Задание:</span>
          <span class="result-value">"{{ gameStore.$state.gameName }}"</span>
        </div>


        <div class="result-row">
          <span class="result-label">Ваш никнейм:</span>
          <div class="name-wrapper">
    <span class="result-value agent-name">
      <template v-if="gameStore.$state.agentName">
        {{ getDisplayName(gameStore.$state.agentName).name }}
        <span
          v-if="getDisplayName(gameStore.$state.agentName).id"
          class="unique-id"
        >
          ({{ getDisplayName(gameStore.$state.agentName).id }})
        </span>
      </template>
    </span>
            <button
              v-if="showChangeNameButton"
              @click="handleChangeName"
              class="change-name-btn"
            >
              Сменить никнейм
            </button>
          </div>
        </div>
      </div>

      <p class="share-message">Отправь скриншот тичеру, чтобы он гордился! 🎉</p>
    </div>

    <!-- Таблица лидеров -->
    <div v-if="topPlayers" class="leaderboard-wrapper">
      <div class="leaderboard-container">
        <div class="leaderboard">
          <table>
            <thead>
            <tr>
              <th>🏆</th>
              <th>лучшие за всё время :</th>
              <th>time</th>
              <th>fails</th>
            </tr>
            </thead>
            <tbody>
            <tr
              v-for="(player, index) in visiblePlayers"
              :key="index"
              :class="{'highlight-row': yourPlace === index + 1}"
            >
              <td>{{ index + 1 }}</td>
              <td>
        <span class="player-name">
          {{ getDisplayName(player.agent).name }}
          <span
            v-if="getDisplayName(player.agent).id"
            class="unique-id"
          >
            ({{ getDisplayName(player.agent).id }})
          </span>
        </span>
              </td>
              <td>{{ player.time }}</td>
              <td>{{ player.mistakes }}</td>
            </tr>

            <tr v-if="yourPlace > visiblePlayers.length" class="highlight-row">
              <td>{{yourPlace}}</td>
              <td>
        <span class="player-name">
          {{ getDisplayName(gameStore.agentName).name }}
          <span
            v-if="getDisplayName(gameStore.agentName).id"
            class="unique-id"
          >
            ({{ getDisplayName(gameStore.agentName).id }})
          </span>
          <span class="you-badge">(you)</span>
        </span>
              </td>
              <td>{{ (gameStore.lastGameResults.time / 1000).toFixed(2) }}</td>
              <td>{{ gameStore.lastGameResults.mistakes }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Кнопки управления -->
    <div class="buttons-container">
      <button class="close-btn" @click="goToMain">X</button>
      <button class="try-again-btn" @click="tryAgain">Try Again</button>
      <button class="toggle-btn" @click="toggleExpand">
        {{ isExpanded ? 'Свернуть ▲' : 'Развернуть ▼' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { api } from "src/api";
import { useGameStore } from "stores/example-store";
import { useRouter } from 'vue-router'
import { allSetsOfWordsList } from "src/dataForGames/allSetsOfWordsList";

const router = useRouter();
const gameStore = useGameStore();

// Реактивные переменные
const topPlayers = ref([]);
const yourPlace = ref();
const isExpanded = ref(false);
const showChangeNameButton = ref(gameStore.$state.agentName === null);

// Функция для получения и сохранения токена
const fetchAndStoreToken = async (agentName) => {
  try {
    // Получаем токен с сервера
    const response = await api.auth.getToken(agentName);
    const token = response.data.token;

    // Сохраняем токен и имя агента
    localStorage.setItem('token', token);
    localStorage.setItem('agentName', agentName);
    gameStore.setAgentName(agentName);

    return token;
  } catch (error) {
    console.error("Ошибка при получении токена:", error);
    throw error;
  }
};


// Запасные данные для таблицы лидеров
const fallbackPlayers = [
  { agent: "TurboAgent", time: "2.00", mistakes: 0 },
  { agent: "FlashSpeed", time: "2.15", mistakes: 1 },
  { agent: "Bond007", time: "2.61", mistakes: 0 },
  { agent: "Godzilla", time: "2.62", mistakes: 2 },
  { agent: "Mike", time: "2.63", mistakes: 3 },
  { agent: "Polina", time: "3.00", mistakes: 0 },
  { agent: "Monkey", time: "3.01", mistakes: 1 },
];

const generateUniqueId = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${day}${month}${year}${minutes}${seconds}`;
};

// Вычисляемые свойства
const visiblePlayers = computed(() => {
  return isExpanded.value
    ? topPlayers.value.slice(0, 100)
    : topPlayers.value.slice(0, 7);
});

// Методы

const getDisplayName = (fullName) => {
  if (!fullName) return { name: '', id: '' };

  const match = fullName.match(/^(.*?)(?:\s*\(([^)]+)\))?$/);
  return {
    name: match[1] || fullName,
    id: match[2] || ''
  };
};
const goToMain = () => router.push("/see-all-sets-of-words/");
const tryAgain = () => router.go(-1);
const toggleExpand = () => isExpanded.value = !isExpanded.value;

const wordSetNameSearch = (name) => {
  const currentWordSet = allSetsOfWordsList.find(word => word.missionName === name);
  return currentWordSet?.missionDescription || name;
};

const fetchLeaderboard = async () => {
  try {
    const res = await api.scores.get(gameStore.gameName);
    const response = res.data.filter(el => el.wordSet === gameStore.$state.wordSet);

    topPlayers.value = Array.isArray(response)
      ? response
      : fallbackPlayers;
  } catch (error) {
    console.error("Ошибка при загрузке таблицы победителей:", error);
    topPlayers.value = fallbackPlayers;
  }
};

const formatResult = () => {
  topPlayers.value = topPlayers.value.sort((a, b) => a.time - b.time);

  topPlayers.value.forEach((player, index) => {
    player.time = player.time / 1000;
    if (player.agent === gameStore.$state.agentName) {
      yourPlace.value = index + 1;
    }
  });
};


const handleChangeName = () => {
router.push("/registration");
};
const setLeaderBoard = async () => {


  if (!gameStore.$state.agentName) {
    const randomNames = [
      "Секретный парниша",
      "Анонимный аноним",
      "Отчаянные домохозяйки",
      "Агент 69",
      "студент без имени",
      "Patrick",
      "Alex",
      "NONAME",
      "test",
      "Professor"
    ];
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const uniqueId = generateUniqueId();
    const agentNameWithId = `${randomName} (${uniqueId})`;

    gameStore.setAgentName(agentNameWithId);
    await fetchAndStoreToken(agentNameWithId);
  }

  await api.scores.post(
    gameStore.$state.gameName,
    gameStore.$state.lastGameResults.time,
    gameStore.$state.lastGameResults.mistakes,
    gameStore.$state.agentName,
    gameStore.$state.wordSet,
  );
};



// Проверка аутентификации при монтировании
onMounted(async () => {
  // Если есть имя агента, но нет токена, запрашиваем токен
  if (gameStore.$state.agentName && !localStorage.getItem('token')) {
    // Проверяем, есть ли уже ID в имени
    let agentName = gameStore.$state.agentName;
    if (!agentName.includes('(')) {
      const uniqueId = generateUniqueId();
      agentName = `${agentName} (${uniqueId})`;
      gameStore.setAgentName(agentName);
    }

    await fetchAndStoreToken(agentName);
  }

  await setLeaderBoard();
  await fetchLeaderboard();
  formatResult();
});
</script>

<style lang="scss" scoped>
.result {
  padding: 20px 10px;
  background: linear-gradient(145deg, #0870b5, #4096d3);
  color: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-family: 'Arial', sans-serif;
  line-height: 1.1;
}

.congratulations-container {
  background: linear-gradient(135deg, #2c3e50, #4ca1af);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    transform: rotate(30deg);
  }
}

.congratulations-title {
  font-size: 28px;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.result-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 10px 10px;
  margin: 0 auto;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.result-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
}

.result-label {
  font-weight: 600;
  opacity: 0.8;
  font-size: 16px;
}

.result-value {
  font-weight: 700;
  font-size: 18px;
  text-align: right;
}
.agent-name {
  color: #f9d423;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-flex;
  align-items: baseline;
  flex-wrap: wrap;
  justify-content: flex-end;
  max-width: 100%;
  word-break: break-word;

  .unique-id {
    font-size: 10px;
    color: #aaaaaa;
    opacity: 0.8;
    letter-spacing: 0;
    text-transform: none;
    font-weight: normal;
    margin-left: 3px;
    align-self: flex-end;
  }
}

.name-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 60%;
  flex-wrap: wrap;
  justify-content: flex-end;
}

@media (max-width: 600px) {
  .name-wrapper {
    flex-direction: column;
    align-items: flex-end;
    max-width: 100%;
  }

  .agent-name {
    text-align: right;
    justify-content: flex-start;

    .unique-id {
      font-size: 8px;
    }
  }
}

.mistakes-amount {
  color: #f887ee;

}

.time-value {
  color: #00ff9d;
  font-family: 'Courier New', monospace;
}

.share-message {
  margin-top: 5px;
  font-style: italic;
  font-size: 12px;
  opacity: 0.9;
  color: #f9d423;
  animation: pulse 2s infinite;
}

.leaderboard-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto;
  width: 100%;
  max-width: 800px;
}

.leaderboard-container {
  width: 100%;
  position: relative;
}

.leaderboard {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  color: black;
  width: 100%;
  max-height: 450px;
  overflow-y: auto;
  margin-bottom: 10px;

  table {
    width: 100%;
    border-collapse: collapse;
    color: black;
    display: grid;
    grid-template-columns: 1fr 3fr 1fr 1fr;

    thead, tbody, tr {
      display: contents;
    }

    th, td {
      padding: 10px;
      text-align: center;
      border: 1px solid #ddd;
      word-wrap: break-word;
    }

    th {
      background-color: #4caf50;
      color: black;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    tr:hover {
      background-color: #ddd;
      transition: background-color 0.3s ease;
    }
  }
}

.highlight-row td {
  border: 2px solid orange !important;
  background-color: #fff8e1;
  font-weight: bold;
}

.buttons-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px auto 0;
  width: 100%;
  max-width: 800px;
}

.close-btn,
.try-again-btn,
.toggle-btn {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 14px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08);
  }
}

.close-btn {
  width: 50px;
  padding: 10px 0;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;

  &:hover {
    background-color: #cc0000;
    transform: scale(1.05);
  }
}

.try-again-btn {
  width: 100px;
  padding: 10px 0;
  background-color: #ffbb33;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;

  &:hover {
    background-color: #ff8800;
    transform: scale(1.05);
  }
}

.toggle-btn {
  width: 210px;
  padding: 10px 0;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;

  &:hover {
    background-color: #3e8e41;
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@media (max-width: 600px) {
  .congratulations-container {
    padding: 15px;
  }

  .congratulations-title {
    font-size: 22px;
  }

  .result-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .result-label, .result-value {
    font-size: 14px;
  }

  .leaderboard {
    max-height: 58vh;
    padding: 10px;

    table {
      th, td {
        padding: 8px 4px;
        font-size: 0.9em;
      }
    }
  }

  .buttons-container {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  .close-btn,
  .try-again-btn,
  .toggle-btn {
    width: auto;
    padding: 10px 15px;
    margin-bottom: 0;
    flex-grow: 1;
  }

  .toggle-btn {
    flex-grow: 2;
  }
}
.name-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.change-name-btn {
  padding: 4px 8px;
  font-size: 12px;
  background: linear-gradient(145deg, #6a3093, #a044ff);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }

  &:active {
    transform: translateY(1px);
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -60%;
    width: 20%;
    height: 200%;
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(30deg);
    animation: shine 3s infinite;
  }
}

@keyframes shine {
  0% { left: -60%; }
  20% { left: 120%; }
  100% { left: 120%; }
}

/* Для мобильных устройств сделаем кнопку больше */
@media (max-width: 600px) {
  .change-name-btn {
    padding: 6px 12px;
    font-size: 14px;
  }
}

.player-name {
  display: inline-flex;
  align-items: baseline;
  flex-wrap: wrap;
  justify-content: center;

  .unique-id {
    font-size: 10px;
    color: #888;
    opacity: 0.8;
    letter-spacing: 0;
    text-transform: none;
    font-weight: normal;
    margin-left: 2px;
    //display: none;
  }

  .you-badge {
    font-size: 12px;
    color: #4caf50;
    margin-left: 5px;
    font-weight: bold;
  }
}

/* Для мобильных устройств */
@media (max-width: 600px) {
  .player-name {
    .unique-id {
      font-size: 8px;
    }
    .you-badge {
      font-size: 10px;
    }
  }
}
</style>
