<template>
<!-- Не удалять этот коммент, добавить кнопку правила, настройки, три точки вверху  -->
<div class="progress-container">
    <div class="progress-bar" :style="{ width: progressWidth }"></div>
</div>
    <div class="game-container" v-if="currentGameData">
        <div class="wordCard">
            {{ currentWord.ru }}
        </div>
        <div class="answers-container">
            <div 
                class="wordCard"
                v-for="(answer, index) in answers" 
                :key="index" 
                @click="checkAnswer(answer, index)"
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
const isFading = ref([]); // Массив для отслеживания состояния анимации


const totalPairs = ref(12); // Общее количество пар для статус бара
const matchedPairs = ref(0); // Количество найденных пар для запонения статус бара
const progressWidth = computed(() => {
    return `${(matchedPairs.value / totalPairs.value) * 100}%`;
});

let startTime = null; // Время начала игры



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

    const correctAnswer = wordData.eng; // Правильный ответ на русском
    answers.value = generateAnswers(correctAnswer);
    selectedAnswer.value = null;
    isCorrect.value = false;
    isFading.value = Array(answers.value.length).fill(false); // Сброс состояния анимации
};

const generateAnswers = (correctAnswer) => {
    const allAnswers = currentGameData.value.map(item => item.eng); // Получаем все ответы
    const uniqueAnswers = [...new Set(allAnswers)];

    // Если меньше 4 уникальных ответов, возвращаем все уникальные
    if (uniqueAnswers.length < 4) {
        return uniqueAnswers; // Или можно добавить дополнительные случайные ответы
    }

    const incorrectAnswers = uniqueAnswers.filter(ans => ans !== correctAnswer).slice(0, 3);
    incorrectAnswers.push(correctAnswer); // Добавляем правильный ответ
    return shuffle(incorrectAnswers); // Перемешиваем ответы
}

let mistakes = 0;

const checkAnswer = (answer, index) => {
    selectedAnswer.value = answer;
    const correctAnswer = currentWord.value.eng; // Правильный ответ
    isCorrect.value = (answer === correctAnswer);

    if (isCorrect.value) {
        matchedPairs.value++; // Увеличиваем количество найденных пар для прогрес бара
        setTimeout(() => {
            currentQuestionIndex.value++;


            if (currentQuestionIndex.value < currentGameData.value.length) {
                loadQuestion();
            } else {
                finishGame();
            }
        }, 800);
    } else {
        mistakes += 1;

        // Устанавливаем анимацию только для неверного ответа
        isFading.value[index] = true; // Устанавливаем состояние анимации

        // Убираем элемент через 500 мс, когда анимация завершится
        setTimeout(() => {
            // Здесь мы можем просто оставить элемент в массиве, но скрыть его
            // answers.value.splice(index, 1); // Удаление больше не требуется
        }, 500); // Время должно совпадать с длительностью анимации
    }
}

const finishGame = () => {
    const endTime = Date.now();
    const duration = endTime - startTime; // Время в миллисекундах
    const minutes = Math.floor((duration / 1000) / 60);
    const seconds = Math.floor((duration / 1000) % 60);
    const milliseconds = duration % 1000;

    alert(`Вы нашли все пары, готовьте Ризотто! Время выполнения: ${minutes} мин ${seconds} сек ${milliseconds} мс`);
    console.log("mistakes", mistakes);
}

// В onMounted перемешиваем данные
onMounted(() => {
    currentMission.value = route.params.missionName;
    currentGameData.value = shortWordsData[currentMission.value] || [];
    
    // Перемешиваем данные один раз и выбираем 12 случайных
    shuffledData = shuffle([...currentGameData.value]).slice(0, 12);
    
    startTime = Date.now(); // Запоминаем время начала игры
    loadQuestion();
});
</script>

<style lang="scss" scoped>


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
.game-container {
    display: flex;
    flex-direction: row;
    align-items: center; /* Центрируем содержимое по горизонтали */
    margin-top: 30px;
    justify-content: center;
}

.wordCard {
    background-color: #f9f9f9; /* Цвет фона карточки */
    border: 2px solid #e90e0e; /* Цвет границы */
    border-radius: 20px; /* Закругление углов */
    height: 50px;
    padding: 5px;
    display: flex; /* Используем flexbox */
    justify-content: center; /* Горизонтальное выравнивание по центру */
    align-items: center; /* Вертикальное выравнивание по центру */
    cursor: pointer; /* Указатель мыши при наведении */
    margin: 1.5px;
    user-select: none;
    color: black;
    transition: opacity 0.5s ease; /* Плавный переход для анимации */
    margin-right: 25px;
    width: 120px;   
}

.answers-container {
    margin-top: 20px; /* Отступ сверху для контейнера с ответами */
    width: 120px;   
}

.active {
    background-color: black;
    color: white;
}

.correct {
    background-color: green; /* Цвет для правильного ответа */
}

.fade {
    opacity: 0; /* Применяется через стиль, а не через класс */
    transition: opacity 0.9s ease; /* Плавная анимация исчезновения */
}
</style>
