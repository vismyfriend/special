<template>
  <div class="progress-container">
    <div class="progress-bar" :style="{ width: progressWidth }"></div>
    <!-- Добавляем текст с процентами -->
    <div class="progress-text" v-if="matchedPairs > 0">{{ progressPercentage }}%</div>
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

  </div>
</template>


<script setup>
import { useRouter, useRoute } from 'vue-router';
import shortWordsData from '../dataForGames/short-words-data';
import { ref, onMounted, computed, watch } from 'vue';
import {useGameStore} from "stores/example-store";

const router = useRouter();
const route = useRoute();
const gameStore = useGameStore()

const shuffle = array => array.sort(() => Math.random() - 0.5);

const currentMission = ref();
const currentGameData = ref();
const engCards = ref([]);
const ruCards = ref([]);

const time = ref(0);






const sliceMin = ref(0);
const sliceMax = ref(5);

const matchedPairs = ref(0); // Количество найденных пар для запонения статус бара

const totalPairs = computed(() => {
  return currentGameData.value?.length || 0; // Получаем количество пар, если массив не пуст
});

const progressWidth = computed(() => {
    return `${(matchedPairs.value / totalPairs.value) * 100}%`;
});
const progressPercentage = ref(0);  // Начальный процент

// Функция для плавного увеличения процентов
const animateProgress = () => {
  const targetPercentage = Math.round((matchedPairs.value / totalPairs.value) * 100);

  // Если текущий процент меньше целевого
  if (progressPercentage.value < targetPercentage) {
    progressPercentage.value += 1;  // Увеличиваем на 1% за каждый кадр
    requestAnimationFrame(animateProgress);  // Запрашиваем следующий кадр анимации
  } else {
    progressPercentage.value = targetPercentage;  // Когда достигаем целевого, устанавливаем точно
  }
};

// Вызываем анимацию каждый раз, когда количество найденных пар изменяется
watch(matchedPairs, animateProgress);

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

  gameStore.setLastGameResults(time.value, 20)
  gameStore.setGameName("FindPairsHard")
  router.push("/leader-board/");

};

onMounted(() => {

    currentMission.value = route.params.missionName;
    currentGameData.value = shortWordsData[currentMission.value];
    currentGameData.value = selectRandomWords(currentGameData.value, 20); // Выбираем 20 случайных слов

    ruCards.value = splitCards("ru");
    engCards.value = splitCards("eng");

    // Запускаем секундомер
    setInterval(() => {time.value+= 10}, 10)



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


.progress-container {
  width: 100%;
  height: 20px; /* Высота полоски прогресса */
  background-color: rgba(0, 0, 0, 0.1); /* Полупрозрачный фон */
  border-radius: 10px; /* Закругление углов */
  margin-bottom: 20px; /* Отступ снизу */
  position: relative; /* Для позиционирования текста */
}

.progress-bar {
  height: 100%;
  background-color: green; /* Цвет заполнения */
  border-radius: 10px; /* Закругление углов */
  transition: width 0.5s ease; /* Плавное заполнение */
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.6); /* Полупрозрачный белый */
  font-size: 12px;
  font-weight: bold;
}


</style>
