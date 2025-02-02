<template>
  <div class="row" v-if="currentGameData">
    <div class="col">
      <!-- Используем v-for для перебора массива ruCards -->
      <div class="wordCard" v-for="(ruWord, index) in ruCards" :key="ruWord.id">
        <div class="word-container">
          <div class="word-column">
            <!-- Отображаем слово на русском языке -->
            <span>{{ ruWord.lang }}</span>
          </div>
          <div class="input-column">
            <!-- Передаем текущий индекс в функцию handleEnter -->
            <input class="userInput" type="text" 
              v-model="translations[index]" 
              @keyup.enter="handleEnter(index)" 
              :class="{ 'correct': correctAnswers[index], 'incorrect': incorrectAnswers[index] }" />
              <!-- Это динамическое добавление классов к элементу в зависимости от значений в массиве correctAnswers и incorrectAnswers. Если перевод правильный, добавляется класс correct, если неправильный — incorrect. -->
          </div>

          <!-- Add a third column if needed -->
          <div class="additional-column">
            <!-- Если захочу сюда добавить картинку или текст или еще что-то, результат -->
            <p>{{ (index + 1) * 10 }}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <button class="check-answers-button" @click="checkAllTranslations">Проверить перевод</button>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import shortWordsData from '../dataForGames/short-words-data';
import { useRoute } from 'vue-router';

const route = useRoute();

const currentGameData = ref([]);
const ruCards = ref([]);
const translations = ref(Array(10).fill('')); // Массив для переводов, теперь на 10 элементов
const correctAnswers = ref(Array(10).fill(false)); // Массив для проверки правильных ответов
const incorrectAnswers = ref(Array(10).fill(false)); // Массив для проверки неправильных ответов

const shuffle = array => array.sort(() => Math.random() - 0.5);

const splitCards = (lang) => {
  let words = currentGameData.value?.map(el => ({
    id: el.id,
    lang: el[lang],
  }));
  return shuffle(words).slice(0, 10); // Берем теперь 8 слов
}

// проверка каждой буквы пока не работает, слово проверяет, а каждую букву хочется подсветить неверную
const checkTranslation = (index, wordId) => {
  // Проверяем перевод для конкретного слова
  const correctTranslation = currentGameData.value.find(el => el.id === wordId).eng; // Предполагается, что перевод на русский
  correctAnswers.value[index] = translations.value[index].toLowerCase() === correctTranslation.toLowerCase();
  incorrectAnswers.value[index] = !correctAnswers.value[index];
}

const checkAllTranslations = () => {
  ruCards.value.forEach((ruWord, index) => {
    const correctTranslation = currentGameData.value.find(el => el.id === ruWord.id).eng;
    if (translations.value[index].toLowerCase() === correctTranslation.toLowerCase()) {
      correctAnswers.value[index] = true;
      incorrectAnswers.value[index] = false;
    } else {
      correctAnswers.value[index] = false;
      incorrectAnswers.value[index] = true;
    }
  });
}
// чтобы нажатие enter с клавиатуры переводило на следующее слово
const handleEnter = (index) => {
  if (index < translations.value.length - 1) {
    // Переход к следующему слову
    const nextInput = document.querySelectorAll('input')[index + 1];
    if (nextInput) {
      nextInput.focus();
    }
  } else {
    // Если это последнее слово, проверяем все переводы
    checkAllTranslations();
  }

  // Снимаем фокус с последнего поля ввода
  const lastInput = document.querySelectorAll('input')[index];
  if (lastInput) {
    lastInput.blur(); // Снимаем фокус
  }
}

onMounted(() => {
  const missionName = route.params.missionName;
  currentGameData.value = shortWordsData[missionName];
  ruCards.value = splitCards("ru");
});
</script>

<style lang="scss" scoped>


.row {
  margin-top: 30px;
}

.col {
  color: wheat;
}

.check-answers-button {
  border-radius: 50px;
  background-color: aqua;
}

.wordCard {
  background-color: #f9f9f9;
  border-radius: 20px;
  padding: 5px 20px;
  height: auto;
  text-align: center;
  justify-content: center;
  margin: 1.5px;
  user-select: none;
  color: black;
  display: flex;
  flex-direction: column;
  /* Keep the word card layout as a column */
}

.word-container {
  display: flex;
  /* Use Flexbox to create a row layout */
  justify-content: space-between;
  /* Distribute the columns evenly */
  align-items: center;
  /* Vertically center the content */
}

.word-column {
  flex-basis: 30%;
  /* Set the width of the word column */
  text-align: right;
  /* Right-align the word text */
  padding-right: 10px;
  /* Add some space between the word and input field */
}

.input-column {
  flex-basis: 60%;
  /* Set the width of the input field column */
}

.additional-column {
  flex-basis: 10%;
  /* Set the width of the additional column (if needed) */
}

.correct {
  border: 2px solid green; /* Цвет рамки */
  box-shadow: 0 0 10px 5px rgba(0, 255, 0, 0.5); /* Зеленое свечение */
  background: rgba(144, 238, 144, 0.3); /* Полупрозрачный зеленый фон */}

.incorrect {
  border: 2px solid red; /* Цвет рамки */
  font-weight: bold;
  box-shadow: 0 0 10px 5px rgba(255, 0, 0, 0.5); /* Красное свечение */
  background: rgba(255, 182, 193, 0.3); /* Полупрозрачный розовый фон */
}
.userInput {
  border-radius: 50px;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  border: 2px solid gray; /* Начальный цвет рамки */
  transition: all 0.3s ease; /* Плавный переход для эффектов */
}
.userInput:focus {
  border: 2px solid blue; /* Цвет рамки по умолчанию */
  box-shadow: 0 0 10px 5px rgba(0, 0, 255, 0.5); /* Синее свечение */
  background: rgba(173, 216, 230, 0.3); /* Полупрозрачный голубой фон */
}
</style>