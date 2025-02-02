<template>
    <div class="game-container" v-if="currentGameData.length">
        <button class="goBackPage" @click="undoLastRemoval">ctrl + z</button> 
        <div class="deck-of-cards">
            <div class="wordCard" @click="loadQuestion">
                <div class="card-content">
                    <div class="card-text">
                        <div class="word">{{ currentWord.ru }}</div>
                        <div class="translation">{{ currentWord.eng }}</div>
                    </div>
                </div>
            </div>
            <div class="remaining-cards" ref="remainingCardsContainer">
                <div 
                    class="remaining-card" @click="loadQuestion" 
                    v-for="(card, index) in remainingCards" 
                    :key="index"
                    :style="getCardStyle(index)" 
                >
                    <div class="card-content">
                        <div class="card-text">
                            <div class="word">{{ card.ru }}</div>
                            <div class="translation">{{ card.eng }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router';
import questionsData from '../dataForGames/questions-data';
import { onMounted, ref, computed } from 'vue';

const router = useRouter();
const route = useRoute();

const currentGameData = ref([]);
const currentWord = ref({});
let shuffledData = [];
const removedWords = []; // Массив для хранения удаленных элементов

const shuffle = (array) => array.sort(() => Math.random() - 0.5);

const loadQuestion = () => {
    if (shuffledData.length === 0) {
        finishGame();
        return;
    }

    // Берем последний элемент из перемешанного массива
    const lastWord = shuffledData.pop(); // Удаляем последний элемент
    currentWord.value = lastWord; // Обновляем текущее слово
    removedWords.push(lastWord); // Добавляем удаленный элемент в массив
    console.log("Удалено слово:", lastWord); // Для отладки
};

const undoLastRemoval = () => {
    // Проверяем, есть ли удаленные слова для восстановления
    if (removedWords.length === 0) {
        console.log("Нет удаленных элементов для восстановления.");
        return;
    }

    // Восстанавливаем последний удаленный элемент
    const lastRemovedWord = removedWords.pop();
    shuffledData.push(lastRemovedWord); // Добавляем его обратно в shuffledData
    currentWord.value = lastRemovedWord; // Обновляем текущее слово
    console.log("Восстановлено слово:", lastRemovedWord); // Для отладки
};

const finishGame = () => {
    alert("Игра окончена! Вы просмотрели все слова.");
};

onMounted(() => {
    const missionName = route.params.missionName;
    currentGameData.value = questionsData[missionName] || [];
    
    // Перемешиваем данные один раз
    shuffledData = shuffle([...currentGameData.value]);

    loadQuestion();
    
});

// Вычисляем оставшиеся карты
const remainingCards = computed(() => {
    return shuffledData;
});

// Метод для получения стилей карты
const getCardStyle = (index) => {
    return {
        top: `${index * 1.5}px`, // Смещение по вертикали
        left: `${index * 1.5}px`, // Смещение по горизонтали
    };
};
</script>



<style lang="scss" scoped>
.game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    height: 400px;
}

.deck-of-cards {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.wordCard {
    width: 260px; /* Ширина карточки */
    height: 160px; /* Высота карточки */
    background-color: white; /* Цвет фона карточки */
    border: 1px solid #e90e0e; /* Цвет границы */
    border-radius: 8px; /* Закругление углов */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Тень для эффекта карты */
    margin: 10px; /* Отступ между картами */
    cursor: pointer; /* Указатель мыши при наведении */
    transition: transform 0.2s ease, box-shadow 0.2s ease; /* Плавный переход для анимации */
}

.wordCard:hover {
    transform: scale(1.05); /* Увеличение карточки при наведении */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Увеличение тени при наведении */
}

.card-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.card-text {
    font-size: 15px; /* Размер шрифта */
    color: black; /* Цвет текста */
    text-align: center; /* Центрирование текста */
    padding: 10px;
    line-height: 1.2;
}

.word {
    font-weight: bold; /* Выделение русского слова */
}
.word::after {
    content: ""; /* Псевдоэлемент требует контент */
    display: block; /* Делаем его блочным элементом */
    width: 100%; /* Ширина линии равна ширине текста */
    height: 1px; /* Высота линии */
    border-bottom: 1px dashed #000; /* Пунктирная линия */
    margin: 5px 0; /* Отступы сверху и снизу для линии */
}
.translation {
    font-style: italic; /* Курсив для перевода */
    color: #555; /* Более светлый цвет для перевода */
}

.remaining-cards {
    position: relative; /* Устанавливаем относительное позиционирование для контейнера */
    width: 260px; /* Ширина первой карты */
    height: 160px; /* Высота первой карты */
    margin-top: 10px; /* Отступ сверху для общего контейнера */
}

.remaining-card {
    position: absolute; /* Устанавливаем абсолютное позиционирование для карт */
    width: 260px; /* Ширина карты, равная первой карте */
    height: 160px; /* Высота карты, равная первой карте */
    background-color: white; /* Цвет фона карточки */
    border: 1px solid #e90e0e; /* Цвет границы */
    border-radius: 8px; /* Закругление углов */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Тень для эффекта карты */
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: default; /* Указатель мыши по умолчанию */
}

</style>
