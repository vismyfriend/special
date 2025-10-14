<template>
  <!-- Основной контейнер результатов -->
  <div class="result">
    <!-- Упрощенный вид результатов -->
    <div class="simple-results" v-if="!showDetailed">
      <div class="simple-container">
        <h2 class="simple-title">Скажи вслух :</h2>
        <div class="stat-item time-words">
          <span class="stat-value time-words-value">{{ timeInWords }} seconds</span>
        </div>
        <div class="simple-stats">
          <div class="stat-item">
            <span class="stat-label">My time is:</span>
            <span class="stat-value time-value">{{ (gameStore.lastGameResults.time / 1000).toFixed(2) }}s</span>
          </div>
<!--          <div class="stat-item">-->
<!--            <span class="stat-label">mistakes :</span>-->
<!--            <span class="stat-value mistakes-value">{{ gameStore.lastGameResults.mistakes }}</span>-->
<!--          </div>-->

        </div>

        <div class="simple-buttons">
          <button class="simple-btn details-btn" @click="showDetailed = true">
            и так сойдёт
          </button>
          <button class="simple-btn try-again" @click="tryAgain">хочу лучше !</button>
<!--          <button class="simple-btn next-mission" @click="backToSameSet">Next Mission</button>-->

        </div>
      </div>
    </div>

    <!-- Подробный вид (как было раньше) -->
    <div class="detailed-results" v-else>
      <!-- Блок с результатами игры -->
      <div class="congratulations-container">
        <h2 class="congratulations-title">Отправь скриншот Винсентику</h2>

        <div class="result-card">
          <!-- Строки с результатами -->
          <div class="result-row">
            <span class="result-label">Время выполнения:</span>
            <span class="result-value time-value">{{ (gameStore.lastGameResults.time / 1000).toFixed(2) }} сек.</span>
          </div>
          <div class="result-row time-spelling">
            <span class="result-label"></span>
            <span class="result-value time-spelling-value">{{ timeInWords }} seconds</span>
          </div>
          <div class="result-row">
            <span class="result-label">Ошибок:</span>
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
                  <span v-if="getDisplayName(gameStore.$state.agentName).id" class="unique-id">
                    ({{ getDisplayName(gameStore.$state.agentName).id }})
                  </span>
                </template>
              </span>
              <button v-if="showChangeNameButton" @click="handleChangeName" class="change-name-btn">
                Сменить никнейм
              </button>
            </div>
          </div>
        </div>

        <p class="share-message">Отправь скриншот тичеру, чтобы он гордился! 🎉</p>
      </div>

      <!-- Кнопки управления -->
      <div class="buttons-container">
        <button
          v-if="shouldShowToggleButton"
          class="toggle-btn"
          @click="toggleExpand"
        >
          {{ isExpanded ? 'Свернуть ▲' : 'Посмотреть всех ▼' }}
        </button>
        <button class="try-again-btn" @click="tryAgain">Улучшить результат</button>
        <button class="close-btn" @click="backToSameSet">Следующее задание</button>
        <button class="games-btn" @click="goToGames">Другой набор слов</button>
<!--        <button class="simple-view-btn" @click="showDetailed = false">-->
<!--          Simple View ▲-->
<!--        </button>-->
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
                <th>⚠️</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(player, index) in visiblePlayers" :key="index" :class="{'highlight-row': yourPlace === index + 1}">
                <td>{{ index + 1 }}</td>
                <td>
                    <span class="player-name">
                      {{ getDisplayName(player.agent).name }}
                      <span v-if="getDisplayName(player.agent).id" class="unique-id">
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
                      <span v-if="getDisplayName(gameStore.agentName).id" class="unique-id">
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
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { api } from "src/api";
import { useGameStore } from "stores/example-store";
import { useRoute, useRouter } from 'vue-router'
import { allGamesAndSetsOfWordsList } from "src/dataForGames/allGamesAndSetsOfWordsList";

// Инициализация хранилища и роутера
const router = useRouter();
const route = useRoute();
const gameStore = useGameStore();

// Получаем missionName из query параметров
const missionName = ref(route.query.missionName || gameStore.$state.wordSet);

// Реактивные переменные
const topPlayers = ref([]);
const yourPlace = ref();
const isExpanded = ref(false);
const showChangeNameButton = ref(gameStore.$state.agentName === null);
const showDetailed = ref(false); // Управление отображением подробного вида

// Запасные данные для таблицы лидеров
const fallbackPlayers = [
  { agent: "Проблема с сервером", time: "000.00", mistakes: 0 },
  { agent: "результаты агентов", time: "1234.5", mistakes: 6 },
  { agent: "можно увидеть позже", time: "999999", mistakes: 999 },


];


// Добавляем функцию для преобразования числа в слова
// Обновленная функция для преобразования числа в слова с правильным форматом десятичной части
const numberToWords = (num) => {
  const digitWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  num = parseFloat(num).toFixed(2); // Фиксируем 2 знака после запятой
  const [integerPart, decimalPart] = num.split('.');
  let result = '';

  // Обрабатываем целую часть
  const intNum = parseInt(integerPart);
  if (intNum >= 100) {
    result += digitWords[Math.floor(intNum / 100)] + ' hundred ';
    const remainder = intNum % 100;
    if (remainder > 0) {
      if (remainder < 10) {
        result += digitWords[remainder];
      } else if (remainder >= 10 && remainder < 20) {
        result += teens[remainder - 10];
      } else {
        result += tens[Math.floor(remainder / 10)];
        if (remainder % 10 > 0) {
          result += '-' + digitWords[remainder % 10];
        }
      }
    }
  } else if (intNum > 0) {
    if (intNum < 10) {
      result += digitWords[intNum];
    } else if (intNum >= 10 && intNum < 20) {
      result += teens[intNum - 10];
    } else {
      result += tens[Math.floor(intNum / 10)];
      if (intNum % 10 > 0) {
        result += '-' + digitWords[intNum % 10];
      }
    }
  } else {
    result += digitWords[0]; // zero
  }

  // Обрабатываем десятичную часть как двузначное число
  if (decimalPart && parseInt(decimalPart) > 0) {
    const decimalNum = parseInt(decimalPart);
    result += ' point ';

    if (decimalNum < 10) {
      result += digitWords[decimalNum];
    } else if (decimalNum >= 10 && decimalNum < 20) {
      result += teens[decimalNum - 10];
    } else {
      result += tens[Math.floor(decimalNum / 10)];
      if (decimalNum % 10 > 0) {
        result += '-' + digitWords[decimalNum % 10];
      }
    }
  }

  return result;
};

// Вычисляемое свойство для времени прописью
const timeInWords = computed(() => {
  const timeInSeconds = (gameStore.lastGameResults.time / 1000).toFixed(2);
  return numberToWords(timeInSeconds);
});


/**
 * Генерация уникального ID на основе текущей даты и времени
 */
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

/**
 * Видимые игроки в таблице лидеров (зависит от состояния isExpanded)
 */
const visiblePlayers = computed(() => {
  return isExpanded.value
    ? topPlayers.value.slice(0, 100)
    : topPlayers.value.slice(0, 8);
});

// стоит ли показать кнопку Увидеть всех игроков

const shouldShowToggleButton = computed(() => {
  return topPlayers.value && topPlayers.value.length > 8;
});
// Методы

/**
 * Получение и сохранение токена
 */

const goToGames = () => router.push("/see-all-sets-of-words");

const fetchAndStoreToken = async (agentName) => {
  try {
    const response = await api.auth.getToken(agentName);
    const token = response.data.token;

    localStorage.setItem('token', token);
    localStorage.setItem('agentName', agentName);
    gameStore.setAgentName(agentName);

    return token;
  } catch (error) {
    console.error("Ошибка при получении токена:", error);
    throw error;
  }
};

/**
 * Разделение имени агента на основное имя и ID
 */
const getDisplayName = (fullName) => {
  if (!fullName) return { name: '', id: '' };

  const match = fullName.match(/^(.*?)(?:\s*\(([^)]+)\))?$/);
  return {
    name: match[1] || fullName,
    id: match[2] || ''
  };
};

/**
 * Возврат к играм того же набора
 */
const backToSameSet = () => {
  if (missionName.value) {
    router.push(`/see-all-sets-of-words/${missionName.value}`);
  } else {
    console.error("missionName is not available");
    router.push("/see-all-sets-of-words/");
  }
};

const tryAgain = () => router.go(-1);
const toggleExpand = () => isExpanded.value = !isExpanded.value;
const handleChangeName = () => router.push("/registration");

/**
 * Поиск описания набора слов по имени
 */
const wordSetNameSearch = (name) => {
  const currentWordSet = allGamesAndSetsOfWordsList.find(word => word.missionName === name);
  return currentWordSet?.missionDescription || name;
};

/**
 * Загрузка таблицы лидеров
 */
const fetchLeaderboard = async () => {
  try {
    const res = await api.scores.get(gameStore.gameName);
    const response = res.data.filter(el => el.wordSet === gameStore.$state.wordSet);
    topPlayers.value = Array.isArray(response) && response.length > 0 ? response : fallbackPlayers;
  } catch (error) {
    console.error("Ошибка при загрузке таблицы победителей:", error);
    topPlayers.value = fallbackPlayers;
  }
};

/**
 * Форматирование результатов таблицы лидеров
 */
const formatResult = () => {
  topPlayers.value = topPlayers.value.sort((a, b) => a.time - b.time);

  topPlayers.value.forEach((player, index) => {
    player.time = player.time / 1000;
    if (player.agent === gameStore.$state.agentName) {
      yourPlace.value = index + 1;
    }
  });
};

// Хук жизненного цикла
onMounted(async () => {
  // Проверка и инициализация имени агента
  const savedName = localStorage.getItem('agentName');
  const savedToken = localStorage.getItem('token');

  if (savedName && savedName !== gameStore.$state.agentName) {
    gameStore.setAgentName(savedName);
  }

  if (!gameStore.$state.agentName && !savedName) {
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
  else if (gameStore.$state.agentName && !savedToken) {
    let agentName = gameStore.$state.agentName;
    if (!agentName.includes('(')) {
      const uniqueId = generateUniqueId();
      agentName = `${agentName} (${uniqueId})`;
      gameStore.setAgentName(agentName);
    }

    await fetchAndStoreToken(agentName);
  }

  // Отправка результатов и загрузка таблицы лидеров

  try {
    await api.scores.post(
      gameStore.$state.gameName,
      gameStore.$state.lastGameResults.time,
      gameStore.$state.lastGameResults.mistakes,
      gameStore.$state.agentName,
      gameStore.$state.wordSet,
    );
  } catch (error) {
    console.error("Ошибка при отправке результатов:", error);
    // Продолжаем выполнение, даже если не удалось отправить результаты
  }

  await fetchLeaderboard();
  formatResult();
});
</script>

<style lang="scss" scoped>
/* Основные стили контейнера */
.result {
  padding: 20px 10px;
  background: linear-gradient(145deg, #0870b5, #4096d3);
  color: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-family: 'Arial', sans-serif;
  line-height: 1.1;
  min-height: 400px;
}

/* Стили для упрощенного вида */
.simple-results {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 350px;
}

.simple-container {
  background: linear-gradient(135deg, #2c3e50, #4ca1af);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  color: white;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.simple-title {
  font-size: 32px;
  font-family: Special_f1;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  font-weight: bold;
}

.simple-stats {
  margin-bottom: 30px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  &:last-child {
    border-bottom: none;
  }
}

.stat-label {
  font-size: 20px;
  font-weight: 600;
  opacity: 0.9;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
}

.time-value {
  color: #faf624;
}

.mistakes-value {
  color: #ff6b6b;
}

.time-words {
  justify-content: center;
  margin-top: 10px;
}

.time-words-value {
  font-size: 18px;
  color: #faf624;
  font-style: italic;
  opacity: 0.9;
}

.simple-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.simple-btn {
  padding: 15px 20px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

.try-again {
  background: linear-gradient(145deg, #FFC107, #FF9800);
  color: white;
  font-family: Special_f1;
}

.next-mission {
  background: linear-gradient(145deg, #4CAF50, #2E7D32);
  color: white;
}

.details-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

.simple-view-btn {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
}

/* Стили для подробного вида (остаются как были) */
.detailed-results {
  padding: 20px 10px;
  background: linear-gradient(145deg, #0870b5, #4096d3);
  color: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-family: 'Arial', sans-serif;
  line-height: 1.1;
}


/* Стили блока с поздравлением */
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

/* Добавляем стили для отображения времени прописью */
.time-spelling {
  margin-top: -10px;
  margin-bottom: 5px;

  .time-spelling-value {
    font-size: 19px;
    color: #faf624;
    font-style: italic;
    opacity: 0.9;
  }
}
/* Стили карточки с результатами */
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

/* Стили для имени агента */
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

/* Стили для кнопки смены имени */
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

/* Стили сообщения о расшаривании */
.share-message {
  margin-top: 5px;
  font-style: italic;
  font-size: 12px;
  opacity: 0.9;
  color: #f9d423;
  animation: pulse 2s infinite;
}


/* Стили таблицы лидеров */
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

/* Стили для имени игрока в таблице */
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
  }

  .you-badge {
    font-size: 12px;
    color: #4caf50;
    margin-left: 5px;
    font-weight: bold;
  }
}

/* Стили контейнера кнопок */
.buttons-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px auto 0;
  width: 100%;
  max-width: 800px;
}

/* Общие стили для кнопок */
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

/* Стили конкретных кнопок */
.close-btn {
  width: 180px;
  padding: 12px 0;
  background: linear-gradient(145deg, #4CAF50, #2E7D32);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(46, 125, 50, 0.4);
    background: linear-gradient(145deg, #2E7D32, #4CAF50);
  }

  &:active {
    transform: translateY(1px);
  }
}
.games-btn {

  padding: 12px 0;
  background: linear-gradient(145deg, #9C27B0, #673AB7);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 4px 15px rgba(156, 39, 176, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 20px rgba(156, 39, 176, 0.6);
    background: linear-gradient(145deg, #673AB7, #9C27B0);
  }

  &:active {
    transform: translateY(1px);
  }
}
.try-again-btn {
  width: 180px;
  padding: 12px 0;
  background: linear-gradient(145deg, #FFC107, #FF9800);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4);

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -60%;
    width: 20%;
    height: 200%;
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(30deg);
    animation: shine 6s infinite ease-in-out;
    animation-delay: 3s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 20px rgba(255, 152, 0, 0.6);
    background: linear-gradient(145deg, #FF9800, #FFC107);
  }

  &:active {
    transform: translateY(1px);
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
.mistakes-amount {
  color: aqua;
}
.time-value{
color: #faf624;
}
/* Анимации */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes shine {
  0% { left: -60%; opacity: 0; }
  20% { left: 120%; opacity: 0.6; }
  100% { left: 120%; opacity: 0; }
}

/* Адаптивные стили */
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

  .change-name-btn {
    padding: 6px 12px;
    font-size: 14px;
  }

  .leaderboard {
    max-height: 158vh;
    padding: 10px;

    table {
      th, td {
        padding: 8px 4px;
        font-size: 0.9em;
      }
    }
  }

  .player-name {
    .unique-id {
      font-size: 8px;
    }
    .you-badge {
      font-size: 10px;
    }
  }

  .buttons-container {
    flex-direction: column;
  }


  .try-again-btn,
  .close-btn,
  .toggle-btn {
    width: 100%;
    padding: 10px 0;
    margin-bottom: 10px;
  }

  .toggle-btn {
    order: -1; /* Перемещаем кнопку в начало на мобильных */
  }
}
</style>
