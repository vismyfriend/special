<template>
    <div class="game-container" v-if="currentGameData">
        <div class="wordCard">
            {{ currentWord.ru }}
        </div>
        <div class="answers-container">
            <div 
                class="wordCard"
                v-for="(answer, index) in answers" 
                :key="index" 
                :draggable="true"
                @dragstart="onDragStart(answer, index)"
                @dragover.prevent
                @drop="onDrop(index)"
                :class="{ 
                    active: selectedAnswer === answer && !isCorrect, 
                    correct: isCorrect && selectedAnswer === answer, 
                    fade: isFading[index] 
                }"
                :style="{ opacity: isFading[index] ? 0 : 1 }"
            >
                {{ answer }}
            </div>
        </div>
        <button @click="checkOrder">Проверить порядок</button>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import wordOrderNewGameData from '../dataForGames/word-order-new-data';
import { computed, onMounted, ref } from 'vue';

const router = useRouter();
const route = useRoute();

const currentMission = ref();
const currentGameData = ref([]);
const currentWord = ref({});
const answers = ref([]);
const selectedAnswer = ref(null);
const isCorrect = ref(false);
const currentQuestionIndex = ref(0);
const isFading = ref([]); 

const shuffle = (array) => array.sort(() => Math.random() - 0.5);

let shuffledData = []; 

const loadQuestion = () => {
    if (shuffledData.length === 0) {
        console.error("Нет данных для игры.");
        return;
    }

    if (currentQuestionIndex.value >= shuffledData.length) {
        finishGame();
        return;
    }

    const wordData = shuffledData[currentQuestionIndex.value];
    currentWord.value = wordData;

    const correctAnswer = wordData.eng.split(" "); // Разделяем правильный ответ на слова
    answers.value = [...correctAnswer]; // Слова для перетаскивания
    isFading.value = Array(answers.value.length).fill(false); 
};

let draggedWord = null;
let draggedIndex = null;

const onDragStart = (answer, index) => {
    draggedWord = answer;
    draggedIndex = index;
};

const onDrop = (index) => {
    if (draggedIndex !== null && draggedIndex !== index) {
        // Меняем местами слова
        const temp = answers.value[index];
        answers.value[index] = answers.value[draggedIndex];
        answers.value[draggedIndex] = temp;
    }
};

const checkOrder = () => {
    const correctOrder = currentWord.value.eng.split(" ");
    isCorrect.value = JSON.stringify(answers.value) === JSON.stringify(correctOrder);
    
    if (isCorrect.value) {
        setTimeout(() => {
            currentQuestionIndex.value++;
            if (currentQuestionIndex.value < currentGameData.value.length) {
                loadQuestion();
            } else {
                finishGame();
            }
        }, 1000);
    } else {
        // Логика для неверного ответа
        alert("Неправильный порядок. Попробуйте снова!");
    }
};

const finishGame = () => {
    alert("Вы нашли все пары, готовьте Ризотто!");
}

// В onMounted перемешиваем данные
onMounted(() => {
    currentMission.value = route.params.missionName;
    currentGameData.value = wordOrderNewGameData[currentMission.value] || [];
    shuffledData = shuffle([...currentGameData.value]);
    loadQuestion();
});
</script>

<style lang="scss" scoped>
.game-container {
    display: flex;
    flex-direction: column;
    align-items: center; 
    margin-top: 30px;
}

.wordCard {
    background-color: #f9f9f9; 
    border: 2px solid #e90e0e; 
    border-radius: 20px; 
    padding: 5px 20px; 
    height: 50px;
    text-align: center;
    cursor: pointer; 
    margin: 1.5px;
    user-select: none;
    color: black;
    transition: opacity 0.5s ease; 
    width: 120px;   
}

.answers-container {
    margin-top: 20px; 
}

.active {
    background-color: black;
    color: white;
}

.correct {
    background-color: green; 
}

.fade {
    opacity: 0; 
    transition: opacity 0.9s ease; 
}
</style>
