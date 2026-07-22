<template>
  <div class="relative">
    <div id="phoneFrame">
      <div class="inside-phone-frame">
        <div class="game-container" v-if="currentGameData">
          <div class="toggle-container">
            <label class="toggle-switch">
              <input type="checkbox" v-model="isEnglish" @change="toggleLanguage" />
              <span class="slider"></span>
            </label>
            <span :class="{'english-text': isEnglish, 'russian-text': !isEnglish}">
              {{ isEnglish ? 'напиши русский перевод :' : 'напиши английский перевод:' }}
            </span>

          </div>

            <p class="info">можно нажимать знаки с вопросами, чтобы подсказать какие-нибудь буквы</p>

          <div class="word-navigation-container">
            <button
              class="nav-button"
              :class="{
    'first-word': isFirstWord
  }"
              @click="prevWord"
              v-if="!userInput.length"
            >‹</button>

            <div class="wordCard">
              {{ currentWordDisplay }}
            </div>

            <button
              class="nav-button"
              :class="{
    'last-word': isLastWord  }"
              @click="nextWord"
              v-if="!userInput.length"
            >›</button>
          </div>
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
          <input
            type="text"
            v-model="userInput"
            @keyup.enter="checkAnswer"
            placeholder="👇"
            class="answer-input"
          />




          <div v-if="feedbackMessage" class="feedback-message">
            {{ feedbackMessage }}
          </div>

          <!-- Виртуальная клавиатура -->
          <div class="virtual-keyboard" :class="currentLayout">
            <div class="keyboard-row">
              <button class="kboardbutton" v-for="key in currentKeyboard[0]" :key="key" @click="addCharacter(key)">
                {{ key }}
              </button>
            </div>
            <div class="keyboard-row">
              <button class="kboardbutton" v-for="key in currentKeyboard[1]" :key="key" @click="addCharacter(key)">
                {{ key }}
              </button>
            </div>
            <div class="keyboard-row">
              <button class="kboardbutton" v-for="key in currentKeyboard[2]" :key="key" @click="addCharacter(key)">
                {{ key }}
              </button>
            </div>
            <div class="keyboard-row">
              <button class="kboardbutton switch-layout" @click="switchKeyboardLayout">
                {{ layoutButtonText }}
              </button>
              <button class="kboardbutton" @click="addCharacter(' ')">Space</button>
              <button class="kboardbutton" @click="deleteLastCharacter">⌫</button>

              <button class="kboardbutton" @click="checkAnswer">Enter</button>
            </div>

          </div>
        </div>
        <div v-if="showModal" class="modal-overlay">
          <div class="modal-content">
            <h3>Results:</h3>

            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label">Перевели : </span>
                <span class="stat-value">{{ stats.correctAnswers }}/{{ stats.totalWords }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label"> Опечатки :</span>
                <span class="stat-value">{{ stats.mistakes }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Подсказок :</span>
                <span class="stat-value">{{ stats.hintsUsed }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label"></span>
                <span class="stat-value">...</span>
              </div>
            </div>

            <div class="words-list">
              <button @click="closeModal" class="modal-button">check your pronunciation</button>

              <div v-for="(word, index) in stats.wordsList" :key="index" class="word-pair">
                <div class="word-row">
                  <span class="english-word">{{ word.eng }}</span>
                  <span v-if="word.hint" class="pronunciation">{{ word.hint }}</span>

<!--                  <span class="separator">—</span>-->
                  <span class="russian-word">{{ word.ru }}</span>

                </div>

              </div>
              <button @click="closeModal" class="modal-button">Ok</button>

            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import shortWordsData from '../dataForGames/short-words-data';
import { computed, onMounted, ref } from 'vue';

const getWordSet = (name) => {
  if (shortWordsData[name]) return shortWordsData[name];
  for (const level in shortWordsData) {
    if (shortWordsData[level] && shortWordsData[level][name]) {
      return shortWordsData[level][name];
    }
  }
  return [];
};

const router = useRouter();
const route = useRoute();

// Раскладки клавиатуры
const keyboardLayouts = {
  en: [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["'", "Z", "X", "C", "V", "B", "N", "M", "?"]
  ],
  ru: [
    ["Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х"],
    ["Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э"],
    ["Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", "Ё"]
  ],
  emoji: [
    ["😀", "😂", "🤣", "😍", "🤩", "😎", "🥳", "🤯", "👻", "💀"],
    ["🐶", "🐱", "🦊", "🐻", "🐼", "🦁", "🐮", "🐷", "🐸"],
    ["🍎", "🍕", "🍔", "🍟", "🍦", "🍩", "🍭", "❓","❓"]
  ]
};

const currentLayout = ref('en');
const currentKeyboard = ref(keyboardLayouts.en);
const layoutButtonText = ref('РУС');

const switchKeyboardLayout = () => {
  if (currentLayout.value === 'en') {
    currentLayout.value = 'ru';
    currentKeyboard.value = keyboardLayouts.ru;
    layoutButtonText.value = 'ENG';
  } else if (currentLayout.value === 'ru') {
    currentLayout.value = 'emoji';
    currentKeyboard.value = keyboardLayouts.emoji;
    layoutButtonText.value = 'ENG';
  } else {
    currentLayout.value = 'en';
    currentKeyboard.value = keyboardLayouts.en;
    layoutButtonText.value = 'РУС';
  }
};
const currentMission = ref();
const currentGameData = ref([]);
const currentWord = ref({});
const userInput = ref('');
const feedbackMessage = ref('');
const currentQuestionIndex = ref(0);
let mistakes = 0;

const revealedLetters = ref([]);
let correctAnswerLetters = [];
const isEnglish = ref(false);




const showModal = ref(false);
const modalMessage = ref('');

// Функции для работы с клавиатурой
const addCharacter = (char) => {
  userInput.value += char.toLowerCase();
};

const deleteLastCharacter = () => {
  userInput.value = userInput.value.slice(0, -1);
};

const clearInput = () => {
  userInput.value = "";
};

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
  userInput.value = '';
  feedbackMessage.value = '';

  correctAnswerLetters = isEnglish.value ? wordData.ru.split('') : wordData.eng.split('');
  revealedLetters.value = Array(correctAnswerLetters.length).fill(false);
};

let revealedLettersCounter = 0;

const revealLetter = (index) => {
  if (!revealedLetters.value[index]) {
    revealedLetters.value[index] = true;
    revealedLettersCounter += 1;
    console.log(revealedLettersCounter)
  }
};

const checkAnswer = () => {
  const correctAnswer = isEnglish.value ? currentWord.value.ru : currentWord.value.eng;
  if (userInput.value.trim().toLowerCase() === correctAnswer.toLowerCase()) {
    feedbackMessage.value = 'Правильно!';
    correctlyAnsweredWords.value++; // Увеличиваем счетчик правильных ответов

    setTimeout(() => {
      currentQuestionIndex.value++;
      loadQuestion();
    }, 1000);
  } else {
    mistakes += 1;
    feedbackMessage.value = `Наверное случайно опечатались: \n Правильный ответ: ${correctAnswer}`;
  }
};
const isFirstWord = computed(() => currentQuestionIndex.value === 0);
const isLastWord = computed(() => currentQuestionIndex.value === shuffledData.length - 1);
const prevWord = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
    loadQuestion();
  } else {
    // Если это первое слово, можно перейти к последнему (зациклить)
    currentQuestionIndex.value = shuffledData.length - 1;
    loadQuestion();
  }
};

const nextWord = () => {
  if (currentQuestionIndex.value < shuffledData.length - 1) {
    currentQuestionIndex.value++;
    loadQuestion();
  } else {
    // Если это последнее слово, можно перейти к первому (зациклить)
    currentQuestionIndex.value = 0;
    loadQuestion();
  }
};

const stats = ref({
  totalWords: 0,
  correctAnswers: 0,
  mistakes: 0,
  hintsUsed: 0,
  wordsList: []
});

const correctlyAnsweredWords = ref(0); // Счетчик правильно переведенных слов

// Обновим функцию finishGame
const finishGame = () => {
  stats.value = {
    totalWords: shuffledData.length,
    correctAnswers: correctlyAnsweredWords.value, // Используем новый счетчик
    mistakes: mistakes,
    hintsUsed: revealedLettersCounter,
    wordsList: shuffledData.map(word => ({
      eng: word.eng,
      ru: word.ru,
      hint: word.hint // Добавляем произношение

    }))
  };
  openModal();
};

const openModal = (message) => {
  modalMessage.value = message;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  // Можно добавить сброс игры или другие действия
};

const toggleLanguage = () => {
  currentQuestionIndex.value = 0;
  loadQuestion();
};

const currentWordDisplay = computed(() => {
  return isEnglish.value ? currentWord.value.eng : currentWord.value.ru;
});

onMounted(() => {
  const missionName = route.params.missionName; // ✅ определяем переменную
  currentMission.value = missionName;
  currentGameData.value = getWordSet(missionName);
  shuffledData = shuffle([...currentGameData.value]);
  loadQuestion();
});

</script>

<style lang="scss" scoped>
.relative {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin-top: 75px;
}

#phoneFrame {
  position: relative;
  height: 655px;
  width: 310px;
  background:
    linear-gradient(
        to top,
        #fff -250%,
        #000000 150%
    );
  margin: 5px auto;
  border-radius: 2em;
  border: solid 5px #6a6a6a;
  box-shadow:
    inset 0 0 2px 7px #000,
    inset 0 0 3px 7px #000,
    0 150px 200px -80px #000;
  overflow: auto;
}

.inside-phone-frame {
  padding: 15px;

}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.english-text {
  color: #31e2ff;
}

.russian-text {
  color: #60ea1a;
}

.info {
  color: #f9f9f9;
  font-size: 14px;
  margin: 10px 0;
}

.wordCard {
  background-color: #f9f9f9;
  border: 2px solid #60ea1a;
  border-radius: 20px;
  padding: 10px 20px;
  margin: 10px 0;
  text-align: center;
  color: black;
  width: 80%;
  font-size: 18px;
}
.word-navigation-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  margin: 10px 0;
}

.nav-button {
  background: none;
  border: none;
  color: #31e2ff;
  font-size: 24px;
  cursor: none;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.2s, color 0.3s, opacity 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: scale(0.95);
  }
}

/* Стиль для первой кнопки на первом слове */
.nav-button.first-word {
  color:white; /*  */
  text-shadow: 0 0 5px rgb(50, 141, 245);
}

/* Стиль для последней кнопки на последнем слове */
.nav-button.last-word {
  color: #89ff28; /*  */
  text-shadow: 0 0 5px rgb(51, 175, 17);
}
.hint-container {
  display: flex;
  margin: 10px 0;
  flex-wrap: wrap;
  justify-content: center;
}

.hint-box {
  width: 27px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2px;
  cursor: none;
  font-size: 16px;
  background-color: #ccc;
}

.revealed {
  background-color: rgba(224, 247, 250, 0);
  color: white;
}

.answer-input {

  width: 90%;
  text-align: center;
  border: 1px solid rgba(204, 204, 204, 0);
  border-radius: 5px;
  font-size: 26px;
  letter-spacing: 3px;
  background-color: rgba(255, 255, 255, 0);
  color: #60ea1a;
}

.feedback-message {
  margin: 10px 0;
  font-weight: bold;
  color: white;
  text-align: center;
}

.toggle-container {
  margin: 10px 0;
  display: flex;
  align-items: center;
  align-self: baseline;
  gap: 10px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: none;
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
  height: 16px;
  width: 16px;
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

/* Стили для виртуальной клавиатуры */
.virtual-keyboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  margin-top: 15px;
  width: 100%;
  background: #d1d3d6;
  padding: 5px 0 5px 0;
  border-radius: 8px;
  box-sizing: border-box;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 3px;
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }
}

/* Общие стили кнопок */
.kboardbutton {
  height: 42px;
  min-width: 8%;
  flex: 1;
  max-width: 32px;
  border-radius: 4px;
  background-color: #ffffff;
  color: #000000;
  border: none;
  font-size: 16px;
  font-weight: 500;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 1px rgba(0,0,0,0.3);
  cursor: none;
  user-select: none;

  &:active {
    background-color: #e0e0e0;
    transform: scale(0.95);
  }
}

/* Специальные стили для каждой строки */
.keyboard-row:first-child {
  /* Первая строка (шире остальных) */
  padding-left: 8px;
  padding-right: 8px;

  .kboardbutton {
    flex: 1;
    max-width: 30px;
  }
}

.keyboard-row:nth-child(2) {
  /* Вторая строка (сдвинута вправо) */
  padding-left: 20px;
  padding-right: 20px;

  .kboardbutton {
    flex: 1;
    max-width: 30px;
  }
}

/* Только для русской раскладки — уменьшаем паддинги */
.virtual-keyboard.ru .keyboard-row:nth-child(2) {
  padding-left: 8px;
  padding-right: 8px;
}

.keyboard-row:nth-child(3) {
  /* Третья строка (сдвинута вправо) */
  padding-left: 20px;
  padding-right: 20px;

  .kboardbutton {
    flex: 1;
    max-width: 30px;
  }
}

/* Стили для специальных кнопок */
.switch-layout {
  flex: 1.5;
  max-width: 40px !important;
  font-size: 14px;
}

.kboardbutton:nth-last-child(3) { /* Space */
  flex: 4;
  max-width: 120px !important;
}

.kboardbutton:nth-last-child(2) { /* Clear */
  flex: 1.5;
  max-width: 30px !important;
}
.kboardbutton:nth-last-child(1) { /* Clear */
  flex: 1.5;
  max-width: 60px !important;
}


/* Стили для эмодзи */
.emoji-key {
  font-size: 22px;
  line-height: 1;
}

/* Адаптация для русской раскладки */
.ru .kboardbutton {
  font-size: 15px;
}

/* Адаптация под маленькие экраны */
@media (max-width: 350px) {
  .kboardbutton {
    height: 36px;
    font-size: 14px;
    max-width: 28px;
  }

  .ru .kboardbutton {
    font-size: 13px;
  }

  .switch-layout {
    max-width: 50px !important;
    font-size: 12px;
  }

  .emoji-key {
    font-size: 18px;
  }

  .keyboard-row:nth-child(2) {
    padding-left: 15px;
    padding-right: 15px;
  }

  .keyboard-row:nth-child(3) {
    padding-left: 20px;
    padding-right: 20px;
  }
}
.modal-overlay {
  position: absolute; /* Меняем fixed на absolute */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100; /* Уменьшаем z-index */
  border-radius: 2em; /* Такие же скругления как у phoneFrame */
}

.modal-content {
  width: 305px;
  height: 100%;
  overflow-y: auto;
  background-color: #1a1a1a;
  border-radius: 20px;
  padding: 10px;
  box-shadow: 0 0 20px rgba(49, 226, 255, 0.3);


  /* Стилизация скроллбара */
  scrollbar-width: thin; /* Для Firefox */
  scrollbar-color: #888888 #2a2a2a; /* Для Firefox */

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #2a2a2a;
    border-radius: 10px;
    margin: 10px 0;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888888;
    border-radius: 10px;
    border: 2px solid #2a2a2a;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #888888;
  }
}

/* Анимация появления */
.modal-overlay {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}


.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 15px 0;
  background: rgba(255,255,255,0.1);
  padding: 12px;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
}

.stat-label {
  color: #aaa;
}

.stat-value {
  font-weight: bold;
  color: #31e2ff;
}

.words-list {
  margin-top: 20px;
  border-top: 1px solid #444;
  padding-top: 15px;
}

.word-pair {
  margin: 8px 0;
  padding: 1px;
  border-radius: 4px;
  background: rgba(255,255,255,0.05);
}

.word-row {
  display: flex;
  align-items: center;
  gap: 2px;
  justify-content: space-between;
}

.separator {
  color: #666;
}

.pronunciation {
  margin-top: 4px;
  font-size: 14px;
  color: #ffffff;
  font-style: italic;
  padding-left: 10px;
}
.english-word {
  color: #4fc3f7;
}

.russian-word {
  color: #81c784;
}

h3, h4 {
  color: white;
  margin: 0 0 10px 0;
  text-align: center;
}

h4 {
  margin-bottom: 15px;
  color: #ddd;
}
.modal-content p {
  font-size: 18px;
  margin-bottom: 20px;
  white-space: pre-line;
}

.modal-content button {
  padding: 10px 20px;
  font-weight: bold;
  background-color: #31e2ff;
  border: none;
  border-radius: 8px;
  color: #2c3e50;
  cursor: none;
  transition: all 0.3s;
}

.modal-content button:hover {
  background-color: #1ac7e6;
  transform: scale(1.05);
}

.modal-content button:active {
  transform: scale(0.95);
}
.modal-content button {
  display: block; /* Делаем кнопку блочным элементом */
  margin: 0 auto 0; /* Автоматические отступы по бокам + отступ сверху */
  margin-bottom: 10px;
  padding: 10px 20px;
  font-weight: bold;
  background-color: #31e2ff;
  border: none;
  border-radius: 8px;
  color: #2c3e50;
  cursor: none;
  transition: all 0.3s;
}
</style>
