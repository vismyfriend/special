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

let mistakes = 0

const checkAnswer = (answer, index) => {
    selectedAnswer.value = answer;
    const correctAnswer = currentWord.value.eng; // Правильный ответ
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
        mistakes +=1

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
    alert("Вы нашли все пары, готовьте Ризотто!"); // Уведомление для пользователя
    console.log("mistakes",mistakes)

}

// В onMounted перемешиваем данные
onMounted(() => {
    currentMission.value = route.params.missionName;
    currentGameData.value = shortWordsData[currentMission.value] || [];
    
    // Перемешиваем данные один раз
    shuffledData = shuffle([...currentGameData.value]);
    
    loadQuestion();
});
</script>

<style lang="scss" scoped>
.game-container {
    display: flex;
    flex-direction: column;
    align-items: center; /* Центрируем содержимое по горизонтали */
    margin-top: 30px;
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
    transition: opacity 0.5s ease; /* Плавный переход для анимации */
}

.answers-container {
    margin-top: 20px; /* Отступ сверху для контейнера с ответами */
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
    transition: opacity 2s ease; /* Плавная анимация исчезновения */
}
</style>
