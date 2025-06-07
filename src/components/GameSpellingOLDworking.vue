<template>
  <div class="game-container" v-if="currentGameData">
    <div class="toggle-container">
      <label class="toggle-switch">
        <input type="checkbox" v-model="isEnglish" @change="toggleLanguage" />
        <span class="slider"></span>
      </label>
      <span :class="{'english-text': isEnglish, 'russian-text': !isEnglish}">
                {{ isEnglish ? 'напиши русский перевод:' : 'напиши английский перевод:' }}
            </span>
    </div>
    <div class="wordCard">
      {{ currentWordDisplay }} <!-- Используем вычисляемое свойство для отображения слова -->
    </div>
    <input
      type="text"
      v-model="userInput"
      @keyup.enter="checkAnswer"
      placeholder="Введите ответ"
      class="answer-input"
    />



    <div class="hint-container">
      <div
        class="hint-box"
        v-for="(letter, index) in correctAnswerLetters"
        :key="index"
        @click="revealLetter(index)"
        :class="{ revealed: revealedLetters[index] }"
      >
        {{ revealedLetters[index] ? letter : '?' }}
      </div>
    </div>

    <p class="info"> Какую букву подсказать?</p>

    <div v-if="feedbackMessage" class="feedback-message">
      {{ feedbackMessage }}
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
const userInput = ref('');
const feedbackMessage = ref('');
const currentQuestionIndex = ref(0);
let mistakes = 0;

const revealedLetters = ref([]); // Массив для отслеживания открытых букв
let correctAnswerLetters = []; // Правильный ответ в виде массива букв
const isEnglish = ref(true); // Переключатель языка

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
  userInput.value = ''; // Сброс поля ввода
  feedbackMessage.value = ''; // Сброс сообщения обратной связи

  // Инициализация массива букв и скрытых букв
  correctAnswerLetters = isEnglish.value ? wordData.ru.split('') : wordData.eng.split('');
  revealedLetters.value = Array(correctAnswerLetters.length).fill(false); // Все буквы скрыты
};
let revealedLettersCounter = 0

const revealLetter = (index) => {
  if (!revealedLetters.value[index]) {
    revealedLetters.value[index] = true; // Открываем букву
    revealedLettersCounter += 1;
    console.log(revealedLettersCounter)
  }
};

const checkAnswer = () => {
  const correctAnswer = isEnglish.value ? currentWord.value.ru : currentWord.value.eng; // Правильный ответ в зависимости от языка
  if (userInput.value.trim().toLowerCase() === correctAnswer.toLowerCase()) {
    feedbackMessage.value = 'Правильно!';
    setTimeout(() => {
      currentQuestionIndex.value++;
      loadQuestion();
    }, 1000);
  } else {
    mistakes += 1;
    feedbackMessage.value = `Неправильно! Попробуйте снова. Правильный ответ: ${correctAnswer}`;
  }
};

const finishGame = () => {
  alert("Вы завершили игру! Количество ошибок: " + mistakes);
  console.log("mistakes", mistakes);
};

const toggleLanguage = () => {
  currentQuestionIndex.value = 0; // Сброс индекса вопроса при смене языка
  loadQuestion(); // Загрузить новый вопрос
};

// Вычисляемое свойство для отображения текущего слова в зависимости от языка
const currentWordDisplay = computed(() => {
  return isEnglish.value ? currentWord.value.eng : currentWord.value.ru;
});

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
.english-text {
  color: rgb(255, 255, 255); /* Цвет для английского */
}

.russian-text {
  color: red; /* Цвет для русского */
}

.info {
  color: #f9f9f9;
  font-size: 20px;
}
.wordCard {
  background-color: #f9f9f9; /* Цвет фона карточки */
  border: 2px solid #e90e0e; /* Цвет границы */
  border-radius: 20px; /* Закругление углов */
  padding: 5px 20px; /* Внутренние отступы */
  height: 50px;
  text-align: center;
  justify-content: center;
  margin: 1.5px;
  user-select: none;
  color: black;
}

.hint-container {
  display: flex;
  margin-top: 10px;
}

.hint-box {
  width: 30px; /* Ширина контейнера для буквы */
  height: 30px; /* Высота контейнера для буквы */
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  cursor: pointer; /* Указатель мыши при наведении */
  font-size: 20px;
  background-color: #ccc;
}

.revealed {
  background-color: #e0f7fa; /* Цвет для открытой буквы */
}

.answer-input {
  margin-top: 20px;
  padding: 10px;
  width: 300px; /* Ширина поля ввода */
  border: 1px solid #ccc;
  border-radius: 5px;
}

.feedback-message {
  margin-top: 10px;
  font-weight: bold;
}

.toggle-container {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}
</style>
