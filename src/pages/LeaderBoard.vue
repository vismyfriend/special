<template>
  <div class="result">
    <p>Поздравляем! Special Agent <br> {{ gameStore.$state.agentName }} вошел в историю!</p>

    <!-- Здесь выводим результаты времени -->
    <p>сделай скриншот и похвастуйся тичеру!</p>
    <!-- Таблица результатов -->

    <div v-if="topPlayers" class="leaderboard-wrapper">
      <div class="leaderboard-container">
        <div class="leaderboard">
          <table>
            <thead>
            <tr>
              <th>🏆</th>
              <th>agent</th>
              <th>time</th>
              <th>fails</th>
            </tr>
            </thead>
            <tbody>
            <!-- Динамически генерируем 7 мест -->
            <tr
              v-for="(player, index) in visiblePlayers"
              :key="index"
              :class="{'highlight-row': yourPlace === index + 1}"
            >
              <!-- выше динамический класс потому что есть логика-->
              <td>{{ index + 1 }}</td>
              <td>{{ player.agent }}</td>
              <td>{{ player.time }}</td>
              <td>{{ player.mistakes }}</td>
            </tr>

            <!-- 8-е место для текущего игрока -->
            <tr v-if="yourPlace > visiblePlayers.length" class="highlight-row">
              <td>{{yourPlace}}</td>
              <td>{{ gameStore.agentName }} (you)</td>
              <td>{{ (gameStore.lastGameResults.time / 1000).toFixed(2) }}</td>
              <td>{{ gameStore.lastGameResults.mistakes }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="buttons-container">
        <button class="close-btn" @click="goToMain">
          X
        </button>
        <button class="try-again-btn" @click="tryAgain">
          Try Again
        </button>
        <button class="toggle-btn" @click="toggleExpand">
          {{ isExpanded ? 'Свернуть ▲' : 'Развернуть ▼' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>




// Массив с резервными данными если с Бэка не поддятулись результаты
import {onMounted, ref, computed} from "vue";
import {api} from "src/api";
import {useGameStore} from "stores/example-store";
import { useRouter } from 'vue-router'
const router = useRouter()
const goToMain = () => {
  router.push("/special-app/")
}

const tryAgain = () => {
  router.go(-1) // Возврат на предыдущую страницу
}
const gameStore = useGameStore()
// topPlayers, который будет заполняться либо с бэкенда, либо запасными данными
const topPlayers = ref([]);
// const topPlayers = ref();


const yourPlace = ref();
const isExpanded = ref(false);


const visiblePlayers = computed(() => {
  return isExpanded.value
    ? topPlayers.value.slice(0, 100)
    : topPlayers.value.slice(0, 7);
});

const fallbackPlayers = [
  { agent: "TurboAgent", time: "2.00", mistakes: 0 },
  { agent: "FlashSpeed", time: "2.15", mistakes: 1 },
  { agent: "Bond007", time: "2.61", mistakes: 0 },
  { agent: "Godzilla", time: "2.62", mistakes: 2 },
  { agent: "Mike", time: "2.63", mistakes: 3 },
  { agent: "Polina", time: "3.00", mistakes: 0 },
  { agent: "Monkey", time: "3.01", mistakes: 1 },
];


const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

// Функция для загрузки таблицы победителей с сервера
const fetchLeaderboard = async () => {
  try {
    const res = await api.scores.get(); // Запрос на получение данных с бэкенда
    const response = res.data[gameStore.gameName];
    console.log(response);

    if (Array.isArray(response)) {
      topPlayers.value = response; // Обновляем массив игроков с сервера
    } else {
      console.warn("Полученные данные не являются массивом! использую запасные данные", response);
      topPlayers.value = fallbackPlayers; // Используем запасные данные, если данные не массив
    }
  } catch (error) {
    console.error("Ошибка при загрузке таблицы победителей, использую запасные данные", error);
    topPlayers.value = fallbackPlayers; // Используем запасные данные в случае ошибки
  }
};

const formatResult = () => {
  topPlayers.value = topPlayers.value.sort((a, b) => a.time - b.time);
  //смутируем (мутация массива)
  topPlayers.value.forEach((player,index) => {
    player.time = player.time / 1000
    if (player.agent === gameStore.$state.agentName) {
      yourPlace.value = index + 1;
    }
  })
}


const setLeaderBoard = async () => {
  const res = await api.scores.post(
    gameStore.$state.gameName,
    gameStore.$state.lastGameResults.time,
    gameStore.$state.lastGameResults.mistakes,
    gameStore.$state.agentName
  )
}



onMounted( async () => {
  await setLeaderBoard();
  await fetchLeaderboard();
  formatResult()
})

</script>

<style lang="scss" scoped>
/* Таблица лидеров */

/* Стили для финального блока с результатами */
.result {
  margin-top: 30px;
  padding: 20px 10px;
  background: linear-gradient(145deg, #0870b5, #4096d3); /* Градиентный фон */
  color: white;
  border-radius: 15px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2); /* Тень для глубины */
  text-align: center;
  font-family: 'Arial', sans-serif;
}

.result p {
  font-size: 18px;
  margin-bottom: 15px;
}

.result p:first-of-type {
  font-weight: bold;
  font-size: 24px;
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
  max-height: 450px; /* Фиксированная высота контейнера */
  overflow-y: auto; /* Вертикальный скролл */
  margin-bottom: 10px;

  table {
    width: 100%;
    border-collapse: collapse;
    color: black;
    display: grid;
    grid-template-columns: 1fr 3fr 1fr 1fr; /* первый столбец 50px, остальные равные */

    thead, tbody, tr {
      display: contents; /* важно для правильного отображения */
    }

    th, td {
      padding: 10px;
      text-align: center;
      border: 1px solid #ddd;
      word-wrap: break-word; /* Перенос длинных слов */
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

/* Новый стиль для выделения строки текущего игрока */
.highlight-row td {
  border: 2px solid orange !important;
  background-color: #fff8e1;
  font-weight: bold;
}

.toggle-btn {
  width: 210px; /* Самая широкая */
  padding: 10px 0;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;

  &:hover {
    background-color: #3e8e41;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}


.buttons-container {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 20px;
  width: 100%;
}
/* Общие стили для всех кнопок */
.close-btn,
.try-again-btn,
.toggle-btn {
  box-shadow:
  0 4px 6px rgba(0, 0, 0, 0.1),
  0 1px 3px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 7px 14px rgba(0, 0, 0, 0.1),
      0 3px 6px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(1px);
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 1px 2px rgba(0, 0, 0, 0.08);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 8px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::after {
    opacity: 0.1;
  }

}
.close-btn {
  width: 50px; /* Узкая кнопка */
  padding: 10px 0;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s;

  &:hover {
    background-color: #cc0000;
    transform: scale(1.05);
  }
}

.try-again-btn {
  width: 100px; /* Средняя ширина */
  padding: 10px 0;
  background-color: #ffbb33;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;

  &:hover {
    background-color: #ff8800;
    transform: scale(1.05);
  }
}

@media (max-width: 600px) {
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
    flex-wrap: wrap; /* Перенос на узких экранах */

  }

  .close-btn,
  .try-again-btn,
  .toggle-btn {
    //width: 80%;
    width: auto; /* Автоширина */
    padding: 10px 15px; /* Горизонтальные отступы */
    margin-bottom: 0;
    flex-grow: 1; /* Равномерное растяжение */
  }

  .toggle-btn {
    flex-grow: 2; /* Шире других на мобилках */
  }
}
</style>
