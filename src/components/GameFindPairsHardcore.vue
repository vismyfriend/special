<template>
    <div class="progress-container">
        <div class="progress-bar" :style="{ width: progressWidth }"></div>
    </div>
    <div class="grid" v-if="currentGameData && cards.length > 0">
        <div 
            class="card"
            :class="{ active: card.visible }" 
            v-for="card in cards" 
            :key="card.id" 
            @click="selectCard(card)"
        >
            {{ card.visible ? card.lang : '?' }}
        </div>
    </div>
    <div v-if="gameFinished" class="result">
        <p>Вы нашли все пары!</p>
        <p>Время выполнения: {{ elapsedTime.minutes }} минут {{ elapsedTime.seconds }} секунд {{ elapsedTime.milliseconds }} миллисекунд</p>
    </div>
    <div v-else-if="!cards.length && currentGameData">
        <p>Недостаточно данных для создания карточек.</p>
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
const currentGameData = ref([]);
const cards = ref([]);
const gameFinished = ref(false);
const startTime = ref(0);
const endTime = ref(0);
const elapsedTime = ref({
    minutes: 0,
    seconds: 0,
    milliseconds: 0
});
const totalPairs = ref(25); // Общее количество пар
const matchedPairs = ref(0); // Количество найденных пар
const progressWidth = computed(() => {
    return `${(matchedPairs.value / (totalPairs.value / 2)) * 100}%`;
});
const selectRandomWords = (data, count) => {
    const shuffled = shuffle(data);
    return shuffled.slice(0, count);
};
const initializeCards = () => {
    const availablePairs = Math.min(Math.floor(currentGameData.value.length / 2), totalPairs.value / 2);
    
    if (availablePairs === 0) {
        console.log("Недостаточно данных для создания карточек.");
        return;
    }
    
    const selectedWords = selectRandomWords(currentGameData.value, availablePairs);
    const pairedWords = [...selectedWords, ...selectedWords]; // Дублируем для пар
    cards.value = shuffle(pairedWords.map((word, index) => ({
        id: index,
        lang: word.eng, // или word.ru в зависимости от языка
        visible: false // Убираем активное состояние
    })));
};
const selectCard = (card) => {
    if (card.visible || gameFinished.value) return; // Если карточка уже открыта или игра завершена
    card.visible = true; // Открываем карточку
    const activeCards = cards.value.filter(c => c.visible);
    
    if (activeCards.length === 2) {
        checkForMatch(activeCards);
    }
};
const checkForMatch = (activeCards) => {
    const [firstCard, secondCard] = activeCards;
    if (firstCard.lang === secondCard.lang) {
        // Если пары совпадают
        matchedPairs.value++;
        if (matchedPairs.value === totalPairs.value / 2) {
            finishGame();
        }
    } else {
        // Если пары не совпадают
        setTimeout(() => {
            firstCard.visible = false;
            secondCard.visible = false;
        }, 1000);
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
    initializeCards(); // Инициализируем карточки
    startTime.value = performance.now(); // Запускаем секундомер
});
</script>
<style lang="scss" scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr); /* 5 колонок */
    gap: 10px; /* Промежуток между карточками */
    margin-top: 30px;
}
.card {
    background-color: #f9f9f9;
    border: 2px solid #e90e0e;
    border-radius: 20px;
    height: 100px; /* Высота карточки */
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    color: black;
    font-size: 24px; /* Увеличиваем размер шрифта */
}
.active {
    background-color: black;
    color: white;
}
.result {
    margin-top: 20px;
    color: black;
    background-color: aqua;
}
.progress-container {
    width: 100%;
    height: 20px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    margin-bottom: 20px;
}
.progress-bar {
    height: 100%;
    background-color: green;
    border-radius: 10px;
    transition: width 0.5s ease;
}
</style>
