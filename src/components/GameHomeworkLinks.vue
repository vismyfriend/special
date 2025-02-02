<template>
    <div class="row" v-if="currentGameData">
        <div class="col">
            <div class="wordCard">
                {{ currentWord.eng }}
            </div>
        </div>
        <div class="col">
            <div 
                class="wordCard"
                v-for="(answer, index) in answers" 
                :key="index" 
                @click="checkAnswer(answer)"
                :class="{ active: selectedAnswer === answer && !isCorrect, correct: isCorrect && selectedAnswer === answer }"
            >
                {{ answer }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import shortWordsData from '../dataForGames/short-words-data';
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

// Функция для перемешивания массива
// Функция для перемешивания массива
// Функция для перемешивания массива
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

let shuffledData = []; // Перемешанные данные

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

    console.log(currentWord.value); // Проверка, что текущее слово загружено

    const correctAnswer = wordData.ru; // Правильный ответ на русском
    answers.value = generateAnswers(correctAnswer);
    selectedAnswer.value = null;
    isCorrect.value = false;
};





const generateAnswers = (correctAnswer) => {
    const allAnswers = currentGameData.value.map(item => item.ru); // Получаем все ответы
    const uniqueAnswers = [...new Set(allAnswers)];

    // Если меньше 4 уникальных ответов, возвращаем все уникальные
    if (uniqueAnswers.length < 4) {
        return uniqueAnswers; // Или можно добавить дополнительные случайные ответы
    }

    const incorrectAnswers = uniqueAnswers.filter(ans => ans !== correctAnswer).slice(0, 3);
    incorrectAnswers.push(correctAnswer); // Добавляем правильный ответ
    return shuffle(incorrectAnswers); // Перемешиваем ответы
}

const checkAnswer = (answer) => {
    selectedAnswer.value = answer;
    const correctAnswer = currentWord.value.ru; // Правильный ответ
    isCorrect.value = (answer === correctAnswer);

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
        // Необходимо скрыть неправильный ответ
        answers.value = answers.value.filter(ans => ans !== answer);
    }
}

const finishGame = () => {
    alert("Вы нашли все пары, готовьте Ризотто!"); // Уведомление для пользователя
}


// В onMounted перемешиваем данные
onMounted(() => {
    currentMission.value = route.params.missionName;
    currentGameData.value = shortWordsData[currentMission.value] || [];
    
    console.log(currentGameData.value); // Выводим данные в консоль для проверки

    // Перемешиваем данные один раз
    shuffledData = shuffle([...currentGameData.value]);
    
    loadQuestion();
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
    padding: 5px 20px; /* Внутренние отступы */
    height: 50px;
    text-align: center;
    justify-content: center;
    cursor: pointer; /* Указатель мыши при наведении */
    margin: 1.5px;
    user-select: none;
    color: black;
}
.active {
    background-color: black;
    color: white;
}
.correct {
    background-color: green; /* Цвет для правильного ответа */
}
.invisible {
    opacity: 0;
    user-select: none;
}
</style>
