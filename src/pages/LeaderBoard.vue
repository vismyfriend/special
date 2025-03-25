<template>
  <div class="result">
    <p>Поздравляем! {{ gameStore.$state.agentName }} <br> вошел в историю!!</p>

    <!-- Здесь выводим результаты времени -->
<!--    <p>Время выполнения: {{ elapsedTime.minutes }} min {{ elapsedTime.seconds }} sec {{ elapsedTime.milliseconds }} миллисекунд</p>-->
<p>сделай скриншот и похвастуйся тичеру!</p>
    <!-- Таблица результатов -->

    <div v-if="topPlayers" class="leaderboard">

      <h3>Таблица SPECIAL :</h3>
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
          v-for="(player, index) in topPlayers.slice(0, 7)"
          :key="index"
          :class="{'highlight-row': yourPlace === index + 1}"
        >
          <!-- выше динамический класс потому что есть логика-->

          <td>{{ index + 1 }}</td>
          <td>{{ player.agent }}</td>
          <td>{{ player.time }}</td>
          <td>{{ player.mistakes }}</td>
        </tr>

<!--         8-е место для текущего игрока -->
        <tr v-if="yourPlace > 7" class="highlight-row">
          <td>{{yourPlace}}</td>
          <td>Вы: {{ gameStore.agentName }}</td>
          <td>{{ gameStore.lastGameResults.time / 1000 }}</td>
          <td>{{ gameStore.lastGameResults.mistakes }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>




// Массив с резервными данными если с Бэка не поддятулись результаты
import {onMounted, ref} from "vue";
import {api} from "src/api";
import {useRoute} from "vue-router";
import {useGameStore} from "stores/example-store";
const route = useRoute()
const gameStore = useGameStore()
const elapsedTime = ref({
  minutes: 0,
  seconds: 0,
  mistakes: 0
});


const fallbackPlayers = [
  { agent: "Агент A", time: "1 min 30 sec" },
  { agent: "Агент B", time: "2:15:187" },
  { agent: "Агент C", time: "3 мин 5 сек" },
  { agent: "Агент D", time: "3 мин 50 сек" },
  { agent: "Агент E", time: "6 мин 0 сек", mistakes: "20" },
  { agent: "Агент F", time: "7 мин 20 сек" },
  { agent: "Агент G", time: "10 часов" },
];

// topPlayers, который будет заполняться либо с бэкенда, либо запасными данными
const topPlayers = ref();
const yourPlace = ref();

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

.leaderboard {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 20px 10px;
  border-radius: 10px;
  color: black;
  width: 100%; /* Контейнер таблицы займет всю доступную ширину */
  max-width: 1000px; /* Максимальная ширина */
  margin-left: auto; /* Центрируем таблицу */
  margin-right: auto; /* Центрируем таблицу */
}

table {
  width: 100%;
  border-collapse: collapse;
  color: black;
  table-layout: fixed; /* Фиксированная ширина для предотвращения растягивания таблицы */
}

table th, table td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
  word-wrap: break-word; /* Перенос длинных слов */
}

table th {
  background-color: #4caf50;
  color: black;
}

table tr:nth-child(even) {
  background-color: #f2f2f2;
}

table tr:hover {
  background-color: #ddd;
  transition: background-color 0.3s ease;
}

/* Новый стиль для выделения 8-й строки */
.highlight-row td {
  border: 5px solid orange; /* Увеличиваем толщину границы */
  background-color: #fff8e1; /* Легкий желтый фон */
}

/* Добавление горизонтальной прокрутки для таблицы */
.leaderboard {
  overflow-x: auto; /* Добавляем прокрутку по оси X */
}

table {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr 1fr; // первый столбец 50px, остальные равные
}

thead, tbody, tr {
  display: contents; // важно для правильного отображения
}

th, td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}
table th:first-child {
  font-size: 1.2em; // увеличим эмодзи
}
</style>
