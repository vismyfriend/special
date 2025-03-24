<template>
  <div class="progress-container">
    <div class="progress-bar" :style="{ width: progressWidth }"></div>
  </div>
  <div class="row" v-if="currentGameData">
    <div class="col">
      <div
        class="flex direction-column wordCard"
        :class="[engWord.active ? 'active':'', engWord.visible ? '':'invisible']"
        v-for="engWord in engCards"
        :key="engWord.id"
        @click="changeActive(engWord.id, 'left')"
      >
        {{ engWord.lang }}
      </div>
    </div>
    <div class="col">
      <div
        class="flex direction-column wordCard"
        :class="[ruWord.active ? 'active':'', ruWord.visible ? '':'invisible']"
        v-for="ruWord in ruCards"
        :key="ruWord.id"
        @click="changeActive(ruWord.id, 'right')"
      >
        {{ ruWord.lang }}
      </div>
    </div>
    <div v-if="gameFinished" class="result">
      <p>Поздравляем! Агент X нашел все пары!</p>

      <!-- Здесь выводим результаты времени -->
      <p>Время выполнения: {{ elapsedTime.minutes }} min {{ elapsedTime.seconds }} sec {{ elapsedTime.milliseconds }} миллисекунд</p>

      <!-- Таблица результатов -->
      <div class="leaderboard">
        <h3>Таблица SPECIAL :</h3>
        <table>
          <thead>
          <tr>
            <th>Место</th>
            <th>Игрок</th>
            <th>Время</th>
          </tr>
          </thead>
          <tbody>
          <!-- Динамически генерируем 7 мест -->
          <tr v-for="(player, index) in topPlayers.slice(0, 7)" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ player.name }}</td>
            <td>{{ player.time }}</td>
          </tr>

          <!-- 8-е место для текущего игрока -->
          <tr :class="'highlight-row'">
            <td>8</td>
            <td>Вы (Агент X)</td>
            <td>{{ elapsedTime.minutes }} min {{ elapsedTime.seconds }} sec</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script setup>
import { useRouter, useRoute } from 'vue-router';
import shortWordsData from '../dataForGames/short-words-data';
import { ref, onMounted, computed } from 'vue';

const router = useRouter();
const route = useRoute();

const shuffle = array => array.sort(() => Math.random() - 0.5);

const currentMission = ref();
const currentGameData = ref();
const engCards = ref([]);
const ruCards = ref([]);

const gameFinished = ref(false);
const startTime = ref(0);
const endTime = ref(0);


// Пример массива с данными игроков, который можно будет потом заменить на реальные данные с бэкенда
const topPlayers = ref([
  { name: "Агент A", time: "1 min 30 sec" },
  { name: "Агент B", time: "2:15:187" },
  { name: "Агент C", time: "3 мин 5 сек" },
  { name: "Агент D", time: "3 мин 50 сек" },
  { name: "Агент E", time: "6 мин 0 сек" },
  { name: "Агент F", time: "7 мин 20 сек" },
  { name: "Агент G", time: "10 часов" },
]);

const elapsedTime = ref({
    minutes: 0,
    seconds: 0,
    milliseconds: 0
});

const sliceMin = ref(0);
const sliceMax = ref(5);

const matchedPairs = ref(0); // Количество найденных пар для запонения статус бара

const totalPairs = ref(20); // Общее количество пар для статус бара

// как тут указать меньше значение? если в массиве всего 4 пары например
// const totalPairs = computed(() => {
//   // Просто берем количество пар, которое равно длине массива
//   return currentGameData.value.length;

const progressWidth = computed(() => {
    return `${(matchedPairs.value / totalPairs.value) * 100}%`;
});

const selectRandomWords = (data, count) => {
    const shuffled = shuffle(data);
    return shuffled.slice(0, count);
};

const splitCards = (lang) => {
    let words = currentGameData.value?.map(el => ({
        id: el.id,
        lang: el[lang],
        active: false,
        visible: true
    }));

    words = words.slice(sliceMin.value, sliceMax.value); // Отображаем только часть слов
    return shuffle(words);
};

const switchState = (side) => {
    switch (side) {
        case "left":
            engCards.value.forEach(el => el.active = false);
            break;
        case "right":
            ruCards.value.forEach(el => el.active = false);
            break;
        default:
            engCards.value.forEach(el => el.active = false);
            ruCards.value.forEach(el => el.active = false);
            break;
    }
};

const changeActive = (id, side) => {
    let engActive, ruActive;

    if (side === "left") {
        switchState(side);
        engActive = engCards.value.find(el => el.id === id);
        engActive.active = true;

        ruActive = ruCards.value.find(el => el.active);
        if (!ruActive) return;
    } else {
        switchState(side);
        ruActive = ruCards.value.find(el => el.id === id);
        ruActive.active = true;

        engActive = engCards.value.find(el => el.active);
        if (!engActive) return;
    }

    const matched = engActive.id === ruActive.id;

    if (matched) deleteCards(ruActive, engActive);
    switchState();
};

const deleteCards = (ru, eng) => {
    ru.visible = false;
    eng.visible = false;
    matchedPairs.value++; // Увеличиваем количество найденных пар для прогрес бара

    const allInvisible = engCards.value.every(el => el.visible === false);
    if (allInvisible) {
        sliceMax.value += 5;
        sliceMin.value += 5;

        if (sliceMin.value < currentGameData.value.length) {
            ruCards.value = splitCards("ru");
            engCards.value = splitCards("eng");
        } else {
            finishGame();
        }
    }
};

const finishGame = () => {
    if (!gameFinished.value) {
        gameFinished.value = true;
        endTime.value = performance.now();
        calculateElapsedTime();
    }
};

const calculateElapsedTime = () => {
    const totalTime = endTime.value - startTime.value;

    elapsedTime.value.minutes = Math.floor(totalTime / 60000);
    elapsedTime.value.seconds = Math.floor((totalTime % 60000) / 1000);
    elapsedTime.value.milliseconds = (totalTime % 1000).toFixed(0).replace('.', '');
};

onMounted(() => {
    currentMission.value = route.params.missionName;
    currentGameData.value = shortWordsData[currentMission.value];
    currentGameData.value = selectRandomWords(currentGameData.value, 20); // Выбираем 20 случайных слов

    ruCards.value = splitCards("ru");
    engCards.value = splitCards("eng");

    startTime.value = performance.now(); // Запускаем секундомер
});
</script>

<style lang="scss" scoped>
.row {
    margin-top: 30px;
}
.col {
    color: wheat;
}
.wordCard {
    background-color: #f9f9f9; /* Цвет фона карточки */
    border: 2px solid #e90e0e; /* Цвет границы */
    border-radius: 20px; /* Закругление углов */
    height: 50px;
    display: flex; /* Используем flexbox */
    justify-content: center; /* Горизонтальное выравнивание по центру */
    align-items: center; /* Вертикальное выравнивание по центру */
    cursor: pointer; /* Указатель мыши при наведении */
    margin: 1.5px;
    user-select: none;
    color: black;
}

.active {
    background-color: black;
    color: white;
}
.invisible {
    opacity: 0;
    user-select: none;
}

  /* Стили для финального блока с результатами */
.result {
  margin-top: 30px;
  padding: 20px;
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

.progress-container {
    width: 100%;
    height: 20px; /* Высота полоски прогресса */
    background-color: rgba(0, 0, 0, 0.1); /* Полупрозрачный фон */
    border-radius: 10px; /* Закругление углов */
    margin-bottom: 20px; /* Отступ снизу */
}

.progress-bar {
    height: 100%;
    background-color: green; /* Цвет заполнения */
    border-radius: 10px; /* Закругление углов */
    transition: width 0.5s ease; /* Плавное заполнение */
}


/* Таблица лидеров */
.leaderboard {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  color: black;

}

table {
  width: 100%;
  border-collapse: collapse;
  color: black;
}

table th, table td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
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
</style>
