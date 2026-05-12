<template>
  <div class="game-wrapper" :style="{ backgroundImage: 'url(/background.jpg)' }">
    <!-- Подсказка о вводе с клавиатуры -->
    <div class="keyboard-hint">
      💡 Заметите ошибку - сообщите вИнсэту, ok?
    </div>
    <!-- Прогресс-бар -->
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: progressWidth }"></div>
      <div class="progress-text" v-if="currentWordIndex > 0">{{ progressPercentage }}%</div>
    </div>

    <div class="game-container" v-if="currentWord && !isGameFinished" :class="{ 'earthquake': earthquakeEffect }">
      <div class="control-panel">
        <!-- Кнопка прослушать аудио вместо выбора уровня сложности -->
        <button class="audio-button" @click="handleAudioButtonClick" :disabled="!currentWord?.audio">
          🔊 Прослушать произношение
        </button>
      </div>

      <!-- Русский перевод -->
      <div class="translation" :class="{ 'blurred': isTranslationBlurred }">
        {{ currentWord.ru }}
      </div>

      <!-- Картинка (если есть) -->
      <div class="picture-section" v-if="currentWord.pic">
        <img :src="currentWord.pic" alt="Illustration" class="word-picture" />
      </div>

      <!-- Пустые квадратики для букв -->
      <div class="word-slots">
        <div
          v-for="(item, index) in wordStructure"
          :key="index"
          class="letter-slot"
          :class="getSlotClass(index, item)"
          @click="removeLetterFromSlot(index)"
        >
          {{ filledSlots[index] || (item.isSpace ? ' ' : '') }}
        </div>
      </div>

      <!-- Подсказка (произношение) -->
      <div class="hint-section" v-if="currentWord.hint">
        <div
          class="pronunciation"
          :class="{ 'blurred': isHintBlurred }"
          @click="handleHintClick"
        >
          {{ currentWord.hint }}
        </div>
      </div>

      <!-- Буквы для выбора -->
      <div class="letters-grid">
        <div
          v-for="(letter, index) in availableLetters"
          :key="index"
          class="letter-card"
          :class="{ 'letter-disabled': letter.used }"
          @click="selectLetter(letter)"
        >
          {{ letter.value }}
        </div>
      </div>

      <!-- Панель управления (оставляем только check для 3 уровня, но т.к. теперь только средний - можно убрать) -->
      <div class="control-panel-bottom">
<!--        <button class="reset-button" @click="resetCurrentWord">-->
<!--          🔄 Сбросить слово-->
<!--        </button>-->
      </div>
    </div>

    <!-- Сообщение о завершении игры -->
    <div v-if="isGameFinished" class="game-overlay">
      <div class="game-over-modal">
        <div class="modal-header">
          <h2 class="special-font">🎉 Поздравляю! 🎉</h2>
        </div>

        <div class="modal-body">
          <div class="result-stats">
            <div class="stat-item">
              <span class="stat-label">Время:</span>
              <span class="stat-value">{{ formatTime(finalTime) }}</span>
            </div>
            <div class="stat-item" v-if="mistakesCount > 0">
              <span class="stat-label">Ошибок:</span>
              <span class="stat-value">{{ mistakesCount }}</span>
            </div>
            <div class="stat-item" v-if="mistakesCount === 0">
              <span class="stat-label">Идеально!</span>
              <span class="stat-value">Без ошибок</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-btn improve-btn" @click="improveResult">
            📈 Улучшить результат
          </button>
          <button class="modal-btn backend-btn" @click="finishGame">
            🌎 Поделиться с миром
          </button>
          <button class="modal-btn finish-btn" @click="goToAllSets">
            🏁 К другим миссиям
          </button>
        </div>
      </div>
    </div>
    <!-- Модальное окно с инструкцией -->
    <!-- Модальное окно с инструкцией -->
    <div v-if="showInstructions" class="instructions-overlay" @click="closeInstructions">
<!--      <div class="instructions-modal" @click.stop> &lt;!&ndash; .stop предотвращает закрытие при клике внутри модалки &ndash;&gt;-->
      <div class="instructions-modal"> <!-- .stop предотвращает закрытие при клике внутри модалки -->
        <div class="instructions-header">
          <h2>🎯 Что делать ?</h2>
        </div>

        <div class="instructions-body">
          <div class="instruction-step">
            <span class="step-number">1</span>
            <span class="step-text">🎧 Слушай слово</span>
          </div>
          <div class="instruction-step">
            <span class="step-number">2</span>
            <span class="step-text">🗣️ Повторяй вслух</span>
          </div>
          <div class="instruction-step">
            <span class="step-number">3</span>
            <span class="step-text">⌨️ Вводи, что слышишь или слушай снова</span>
          </div>
        </div>

        <div class="instructions-footer">
          <button class="start-game-btn" @click="startGame">
            🚀 Понятно! Start!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import shortWordsData from '../dataForGames/short-words-data';
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { useGameStore } from "stores/example-store";

const router = useRouter();
const route = useRoute();
const gameStore = useGameStore();

const isTranslationBlurred = ref(true);
const showInstructions = ref(true);
// Фиксированный уровень сложности - средний (как был уровень 2)
const DIFFICULTY_LEVEL = 2; // средний уровень

const closeInstructions = () => {
  if (showInstructions.value) {
    showInstructions.value = false;
    // Запускаем таймер
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => { time.value += 10; }, 10);
    // Воспроизводим первое слово, но НЕ разблюриваем
    if (currentWord.value?.audio) {
      setTimeout(() => {
        const audio = new Audio(currentWord.value.audio);
        audio.play().catch(e => console.log('Audio play failed:', e));
      }, 100);
    }
  }
};

const showFeedback = ref(false);
let feedbackTimeout = null;

// Гласные и согласные
const vowels = ['A', 'E', 'I', 'O', 'U'];
const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];

// Маппинг символов
const symbolMapping = {
  "'": ["'", "`", "´", "’", "‘", "§", "±", ".", ",", "?"],
  '"': ['"', '“', '”'],
  '-': ['-', '–', '—']
};

// Маппинг русских букв на английские
const russianToEnglishMap = {
  'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p',
  'ф': 'a', 'ы': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k', 'д': 'l',
  'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'm', 'б': ',', 'ю': '.', 'ё': '`',
  'Й': 'Q', 'Ц': 'W', 'У': 'E', 'К': 'R', 'Е': 'T', 'Н': 'Y', 'Г': 'U', 'Ш': 'I', 'Щ': 'O', 'З': 'P', 'Х': '[', 'Ъ': ']',
  'Ф': 'A', 'Ы': 'S', 'В': 'D', 'А': 'F', 'П': 'G', 'Р': 'H', 'О': 'J', 'Л': 'K', 'Д': 'L', 'Ж': ';', 'Э': "'",
  'Я': 'Z', 'Ч': 'X', 'С': 'C', 'М': 'V', 'И': 'B', 'Т': 'N', 'Ь': 'M', 'Б': ',', 'Ю': '.', 'Ё': '`'
};

const convertToEnglish = (char) => {
  if (russianToEnglishMap[char]) return russianToEnglishMap[char];
  return char;
};

const getRandomLetters = (count, isVowel) => {
  const source = isVowel ? vowels : consonants;
  const result = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * source.length);
    result.push(source[randomIndex]);
  }
  return result;
};

const currentMission = ref();
const gameWords = ref([]);
const currentWordIndex = ref(0);
const currentWord = ref(null);
const wordStructure = ref([]);
const filledSlots = ref([]);
const availableLetters = ref([]);
const mistakesCount = ref(0);
const time = ref(0);

let timerInterval = null;

const isGameFinished = ref(false);
const earthquakeEffect = ref(false);
const isWaveAnimating = ref(false);

const isHintBlurred = ref(true);

// Массив со звуками ошибок
const wrongAnswerSounds = ref([
  new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no.mp3', import.meta.url).href,
  new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no1.mp3', import.meta.url).href,
  new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no2.mp3', import.meta.url).href,
  new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no3.mp3', import.meta.url).href,
  new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no4.mp3', import.meta.url).href,
  new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no5.mp3', import.meta.url).href,
  new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no6.mp3', import.meta.url).href,
]);

// Computed свойства для прогресса
const totalWords = computed(() => gameWords.value.length);
const matchedPairs = computed(() => currentWordIndex.value);
const progressWidth = computed(() => `${(matchedPairs.value / totalWords.value) * 100}%`);
const progressPercentage = computed(() => Math.round((matchedPairs.value / totalWords.value) * 100));
const finalTime = computed(() => time.value);

const formatTime = (ms) => {
  if (typeof ms !== 'number' || isNaN(ms)) return '0 sec';
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const getMinuteText = (num) => num === 1 ? 'minute' : 'minutes';
  const getSecondText = (num) => num === 1 ? 'second' : 'seconds';
  if (minutes === 0) return `${seconds} ${getSecondText(seconds)} only !`;
  if (seconds === 0) return `${minutes} ${getMinuteText(minutes)} sharp !`;
  return `${minutes} ${getMinuteText(minutes)} ${seconds} ${getSecondText(seconds)}`;
};

// Анимация волны
const startWaveAnimation = () => {
  if (isWaveAnimating.value) return;
  isWaveAnimating.value = true;
  const slots = document.querySelectorAll('.letter-slot');
  const filledSlotsArray = Array.from(slots).filter((_, index) => filledSlots.value[index] !== null);
  filledSlotsArray.forEach((slot, index) => {
    setTimeout(() => {
      slot.classList.add('wave-animation');
      setTimeout(() => {
        slot.classList.remove('wave-animation');
      }, 100);
    }, index * (1500 / Math.max(filledSlotsArray.length, 1)));
  });
  setTimeout(() => {
    isWaveAnimating.value = false;
  }, 1500);
};

// Звук ошибки
const playRandomWrongAnswerSound = () => {
  if (wrongAnswerSounds.value.length === 0) return;
  const randomIndex = Math.floor(Math.random() * wrongAnswerSounds.value.length);
  const audio = new Audio(wrongAnswerSounds.value[randomIndex]);
  audio.volume = 0.3;
  audio.play().catch(e => console.log('Sound play failed:', e));
};

const isSpace = (char) => char === ' ';
const isLetter = (char) => /[A-Za-z]/i.test(char);
const isDigit = (char) => /[0-9]/.test(char);

const parseWordStructure = (word) => {
  const structure = [];
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    if (isSpace(char)) {
      structure.push({ char: ' ', isSpace: true });
    } else {
      structure.push({ char: char.toUpperCase(), isSpace: false });
    }
  }
  return structure;
};

const isCharMatch = (inputChar, expectedChar) => {
  if (inputChar === expectedChar) return true;
  const mapping = symbolMapping[expectedChar];
  if (mapping && mapping.includes(inputChar)) return true;
  return false;
};

const isSlotCorrect = (index) => {
  const expectedItem = wordStructure.value[index];
  let expectedValue = expectedItem.char;
  if (isLetter(expectedValue)) expectedValue = expectedValue.toUpperCase();
  return isCharMatch(filledSlots.value[index], expectedValue);
};

// Генерация доступных букв (механика среднего уровня)
const generateAvailableItems = (word) => {
  const itemsOnly = [];
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    if (!isSpace(char)) {
      itemsOnly.push(char.toUpperCase());
    }
  }
  let firstLetter = null;
  for (let i = 0; i < word.length; i++) {
    if (!isSpace(word[i])) {
      firstLetter = word[i].toUpperCase();
      break;
    }
  }

  // Механика среднего уровня (как было в уровне 2)
  const extraLetters = [
    ...getRandomLetters(2, true),
    ...getRandomLetters(2, false)
  ];
  const allItems = [...itemsOnly, ...extraLetters];
  const shuffledItems = smartShuffle(allItems, firstLetter);
  return shuffledItems.map(item => ({ value: item, used: false }));
};

// "Умное" перемешивание
const smartShuffle = (array, firstLetter = null) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  if (firstLetter && newArray.includes(firstLetter)) {
    if (newArray[0] === firstLetter) {
      const firstLetterIndex = newArray.indexOf(firstLetter);
      if (newArray.length > 1) {
        const swapIndex = 1;
        [newArray[firstLetterIndex], newArray[swapIndex]] = [newArray[swapIndex], newArray[firstLetterIndex]];
      }
    }
  }
  return newArray;
};

// Перемешивание для списка слов
const simpleShuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const selectRandomWords = (data, count) => {
  const shuffled = simpleShuffle(data);
  return shuffled.slice(0, count);
};

// Загрузка слова
const loadWord = () => {
  if (currentWordIndex.value >= gameWords.value.length) {
    isGameFinished.value = true;
    if (timerInterval) clearInterval(timerInterval);
    return;
  }

  currentWord.value = gameWords.value[currentWordIndex.value];
  const englishWord = currentWord.value.eng;

  wordStructure.value = parseWordStructure(englishWord);
  filledSlots.value = wordStructure.value.map(item => item.isSpace ? ' ' : null);
  availableLetters.value = generateAvailableItems(englishWord);
  showFeedback.value = false;

  // Всегда показываем подсказку и перевод размытыми для нового слова
  isHintBlurred.value = true;
  isTranslationBlurred.value = true;
};

const startGame = () => {
  showInstructions.value = false;
  // Запускаем таймер
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => { time.value += 10; }, 10);
  // Воспроизводим первое слово, но НЕ разблюриваем
  if (currentWord.value?.audio) {
    setTimeout(() => {
      const audio = new Audio(currentWord.value.audio);
      audio.play().catch(e => console.log('Audio play failed:', e));
      // Не разблюриваем при первом воспроизведении
    }, 100);
  }
};

const triggerEarthquake = () => {
  earthquakeEffect.value = true;
  setTimeout(() => earthquakeEffect.value = false, 500);
};

const highlightItem = (itemValue) => {
  const itemElements = document.querySelectorAll('.letter-card');
  itemElements.forEach(el => {
    if (el.innerText === itemValue && !el.classList.contains('letter-disabled')) {
      el.classList.add('wrong-pulse');
      setTimeout(() => el.classList.remove('wrong-pulse'), 600);
    }
  });
};

// Удаление буквы из слота
const removeLetterFromSlot = (slotIndex) => {
  if (showFeedback.value) return;
  if (wordStructure.value[slotIndex].isSpace) return;

  const currentLetter = filledSlots.value[slotIndex];
  if (currentLetter === null || currentLetter === ' ') return;

  const letterToReturn = availableLetters.value.find(
    letter => letter.value === currentLetter && letter.used === true
  );

  if (letterToReturn) {
    letterToReturn.used = false;
    filledSlots.value[slotIndex] = null;
  }
};

// Выбор буквы
const selectLetter = (itemObj) => {
  if (isGameFinished.value || itemObj.used || showFeedback.value) return;

  const firstEmptyIndex = filledSlots.value.findIndex(slot => slot === null);
  if (firstEmptyIndex === -1) return;

  const expectedItem = wordStructure.value[firstEmptyIndex];
  let expectedValue = expectedItem.char;
  if (isLetter(expectedValue)) expectedValue = expectedValue.toUpperCase();

  if (isCharMatch(itemObj.value, expectedValue)) {
    filledSlots.value[firstEmptyIndex] = itemObj.value;
    itemObj.used = true;
    if (filledSlots.value.every(slot => slot !== null)) {
      // НЕМЕДЛЕННО применяем размытие к текущему слову
      isHintBlurred.value = true;
      isTranslationBlurred.value = true;

      setTimeout(() => {
        currentWordIndex.value++;
        loadWord();
        // Автоматически воспроизводим следующее слово
        if (currentWordIndex.value < gameWords.value.length && gameWords.value[currentWordIndex.value]?.audio) {
          setTimeout(() => {
            const audio = new Audio(gameWords.value[currentWordIndex.value].audio);
            audio.play().catch(e => console.log('Audio play failed:', e));
          }, 300);
        }
      }, 500);
    }
  } else {
    mistakesCount.value++;
    const itemExists = availableLetters.value.some(l => l.value === itemObj.value && !l.used);
    if (itemExists) {
      highlightItem(itemObj.value);
    } else {
      triggerEarthquake();
    }
  }
};

const handleAudioButtonClick = () => {
  if (currentWord.value?.audio) {
    playAudio();
    // При клике на кнопку "Прослушать аудио" снимаем blur с произношения и перевода
    isHintBlurred.value = false;
    isTranslationBlurred.value = false;
  }
};

const handleHintClick = () => {
  // При клике на произношение - проигрываем аудио и снимаем blur со всего
  if (currentWord.value?.audio) {
    playAudio();
  }
  // Снимаем blur с произношения и перевода при клике
  isHintBlurred.value = false;
  isTranslationBlurred.value = false;
};

// Обработка клавиатуры
const handleKeyPress = (event) => {
  if (isGameFinished.value || showFeedback.value) return;

  if (event.key === 'Backspace') {
    event.preventDefault();
    let lastFilledIndex = -1;
    for (let i = filledSlots.value.length - 1; i >= 0; i--) {
      if (filledSlots.value[i] !== null && filledSlots.value[i] !== ' ') {
        lastFilledIndex = i;
        break;
      }
    }

    if (lastFilledIndex !== -1) {
      const currentLetter = filledSlots.value[lastFilledIndex];
      const letterToReturn = availableLetters.value.find(
        letter => letter.value === currentLetter && letter.used === true
      );
      if (letterToReturn) {
        letterToReturn.used = false;
        filledSlots.value[lastFilledIndex] = null;
        const slotElement = document.querySelectorAll('.letter-slot')[lastFilledIndex];
        if (slotElement) {
          slotElement.classList.add('remove-pulse');
          setTimeout(() => slotElement.classList.remove('remove-pulse'), 200);
        }
      }
    }
    return;
  }

  let key = event.key;
  if (key === ' ' || key === 'Space') key = ' ';
  if (key === '§' || key === '±') key = "'";
  if (key === '`' || key === "'" || key === '´' || key === '’' || key === '‘') key = "'";
  key = convertToEnglish(key);

  const isValidChar = /[A-Za-z0-9\s'`´"\-!@#$%&*()+=?/\\|,.;:§±~]/.test(key);
  if (isValidChar && key.length === 1) {
    event.preventDefault();
    let processedKey = key;
    if (isLetter(key)) processedKey = key.toUpperCase();

    const itemToSelect = availableLetters.value.find(item => !item.used && isCharMatch(processedKey, item.value));
    if (itemToSelect) {
      selectLetter(itemToSelect);
    } else {
      mistakesCount.value++;
      const itemExists = availableLetters.value.some(item => isCharMatch(processedKey, item.value));
      if (itemExists) {
        const existingItem = availableLetters.value.find(item => isCharMatch(processedKey, item.value));
        if (existingItem) highlightItem(existingItem.value);
      } else {
        triggerEarthquake();
      }
    }
  }
};

const resetCurrentWord = () => {
  if (currentWord.value) {
    const englishWord = currentWord.value.eng;
    wordStructure.value = parseWordStructure(englishWord);
    filledSlots.value = wordStructure.value.map(item => item.isSpace ? ' ' : null);
    availableLetters.value = generateAvailableItems(englishWord);
    showFeedback.value = false;
  }
};

const playAudio = () => {
  if (currentWord.value?.audio) {
    const audio = new Audio(currentWord.value.audio);
    audio.play().catch(e => console.log('Audio play failed:', e));
    // Разблуриваем только если пользователь сам нажал на кнопку прослушать
    // Заметка: isHintBlurred и isTranslationBlurred снимаются только по клику на кнопку или произношение
  }
};

const finishGame = () => {
  gameStore.setLastGameResults(time.value, mistakesCount.value);
  gameStore.setGameName(`SpellingAgent_Средний`);
  gameStore.setWordSet(currentMission.value);
  router.push("/leader-board/");
};

const goToAllSets = () => {
  gameStore.setLastGameResults(time.value, mistakesCount.value);
  gameStore.setGameName(`SpellingAgent_Средний`);
  gameStore.setWordSet(currentMission.value);
  router.push("/see-all-sets-of-words/");
};

// Улучшить результат - перезапустить игру
const improveResult = () => {
  isGameFinished.value = false;
  currentWordIndex.value = 0;
  mistakesCount.value = 0;
  time.value = 0;
  isHintBlurred.value = true;
  isTranslationBlurred.value = true;  // Добавляем эту строку
  showInstructions.value = true;

  const allWords = shortWordsData[currentMission.value];
  if (allWords?.length > 0) {
    gameWords.value = selectRandomWords(allWords, 10);
    loadWord();
  }

  if (timerInterval) clearInterval(timerInterval);
};
// Функция для получения класса слота
const getSlotClass = (index, item) => {
  if (item.isSpace) return 'space';
  if (!filledSlots.value[index]) return '';
  if (showFeedback.value) {
    return isSlotCorrect(index) ? 'correct-highlight' : 'wrong-highlight';
  }
  return 'filled';
};

onMounted(() => {
  currentMission.value = route.params.missionName;
  const allWords = shortWordsData[currentMission.value];
  if (allWords?.length > 0) {
    gameWords.value = selectRandomWords(allWords, 10);
    currentWordIndex.value = 0;
    mistakesCount.value = 0;
    time.value = 0;
    loadWord();
    // Не запускаем таймер, пока игра не начнется
    // timerInterval = setInterval(() => { time.value += 10; }, 10);
  }
  window.addEventListener('keydown', handleKeyPress);
});

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval);
  window.removeEventListener('keydown', handleKeyPress);
  if (feedbackTimeout) clearTimeout(feedbackTimeout);
});
</script>

<style lang="scss" scoped>
/* Все стили остаются теми же, добавляем только стиль для новой панели */
.control-panel {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.control-panel-bottom {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 10px;
}

.audio-button {
  background: #4a90e2;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #357abd;
    transform: scale(1.05);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.reset-button {
  padding: 10px 24px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 40px;
  font-size: 16px;
  cursor: none;
  transition: all 0.3s ease;

  &:hover {
    background: #f57c00;
    transform: scale(1.02);
  }
}

/* Остальные стили остаются без изменений */
.game-wrapper {
  background-size: cover;
  background-position: center;
  padding: 20px;
  min-height: 100vh;
}

.progress-container {
  width: 100%;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #3ec46d;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 13px;
  font-weight: bold;
}

.game-container {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  padding: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: transform 0.1s ease;

  &.earthquake {
    animation: earthquake 0.5s ease-in-out;
  }
}

.hint-section {
  text-align: center;
  margin-bottom: 2px;
}

.pronunciation {
  font-size: 25px;
  font-weight: bold;
  color: #4a90e2;
  background: #f0f4fa;
  display: inline-block;
  padding: 8px 15px;
  border-radius: 40px;
  font-family: monospace;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  cursor: pointer;

  &.blurred {
    filter: blur(5px);

    &:hover {
      filter: blur(4px);
    }
  }
}
.translation {
  text-align: center;
  line-height: 25px;
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  padding: 2px;
  background: #f5f5f5;
  border-radius: 16px;
  transition: all 0.3s ease;

  &.blurred {
    filter: blur(6px);
  }
}

.picture-section {
  text-align: center;
  margin-bottom: 10px;
  align-items: center;
  display: flex;
  justify-content: center;
}

.word-picture {
  max-width: 200px;
  max-height: 150px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.keyboard-hint {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  padding: 8px;
  background: #f0f4fa;
  border-radius: 20px;
  display: none;
  width: auto;
  margin-left: auto;
  margin-right: auto;
}

.word-slots {
  display: flex;
  justify-content: center;
  gap: 1px;
  margin-bottom: 20px;
}

.special-font {
  font-family: Special_f1;
  display: flex;
  justify-content: center;
  font-size: 25px;
}

.letter-slot {
  font-family: Special_f1;
  width: 60px;
  height: 60px;
  border: 3px solid #4a90e2;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  background: white;
  transition: all 0.3s ease;
  cursor: none;

  &.filled {
    background: #e8f5e9;
    border-color: #3ec46d;
    color: #2e7d32;
    animation: fillPulse 0.3s ease;
  }

  &.space {
    background: #f5f5f5;
    border-color: #ddd;
    border-style: dashed;
    color: #999;
    opacity: 0.6;
    cursor: none;
  }

  &.correct-highlight {
    background: #c8e6c9 !important;
    border-color: #3ec46d !important;
    animation: correctPulse 0.5s ease;
  }

  &.wrong-highlight {
    background: #ffcdd2 !important;
    border-color: #f44336 !important;
    animation: wrongPulse 0.5s ease;
  }
}

.letters-grid {
  display: flex;
  justify-content: center;
  gap: 1px;
  flex-wrap: wrap;
  margin-bottom: 2px;
}

.letter-card {
  width: 60px;
  height: 60px;
  background: #f0f4fa;
  border: 2px solid #ccc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  cursor: none;
  transition: all 0.2s ease;

  &:hover:not(.letter-disabled) {
    background: #e0e7ff;
    transform: scale(1.05);
    border-color: #4a90e2;
  }

  &:active:not(.letter-disabled) {
    transform: scale(0.95);
  }

  &.letter-disabled {
    opacity: 0;
    cursor: none;
    pointer-events: none;
    transform: scale(0.8);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
}

/* Модальное окно завершения игры */
.game-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.game-over-modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 32px;
  padding: 30px;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(255, 215, 0, 0.3);
  animation: slideUp 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-header {
  text-align: center;
  margin-bottom: 20px;

  h2 {
    font-size: 25px;
    font-weight: bold;
    background: linear-gradient(135deg, #ffd700, #ffb347);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin: 0;
  }
}

.modal-body {
  margin-bottom: 30px;
}

.result-stats {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }

  .stat-label {
    color: #aaa;
    font-weight: 500;
  }

  .stat-value {
    font-size: 18px;
    color: #ffd700;
    font-weight: bold;
  }
}

.modal-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-btn {
  padding: 14px 24px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: bold;
  cursor: none;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.improve-btn {
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);

  &:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }
}

.finish-btn, .backend-btn {
  background: linear-gradient(135deg, #2196f3, #1976d2);
  color: white;
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);

  &:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
  }
}

.backend-btn {
  background: linear-gradient(135deg, #c521f3, #1976d2);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fillPulse {
  0% {
    transform: scale(1);
    background: white;
  }
  50% {
    transform: scale(1.1);
    background: #c8e6c9;
  }
  100% {
    transform: scale(1);
    background: #e8f5e9;
  }
}

@keyframes correctPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes wrongPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.wrong-pulse {
  animation: wrongPulse 0.6s ease-in-out;
}

@keyframes earthquake {
  0%, 100% {
    transform: translateX(0);
  }
  10% {
    transform: translateX(-5px);
  }
  20% {
    transform: translateX(5px);
  }
  30% {
    transform: translateX(-4px);
  }
  40% {
    transform: translateX(4px);
  }
  50% {
    transform: translateX(-3px);
  }
  60% {
    transform: translateX(3px);
  }
  70% {
    transform: translateX(-2px);
  }
  80% {
    transform: translateX(2px);
  }
  90% {
    transform: translateX(-1px);
  }
}

@keyframes waveCheck {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
    background: #fff3e0;
    border-color: #ff9800;
  }
  100% {
    transform: scale(1);
  }
}

.letter-slot.wave-animation {
  animation: waveCheck 0.15s ease-in-out;
}

/* Стили для модального окна инструкции */
/* Стили для модального окна инструкции */
.instructions-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
  padding: 16px;
}

.instructions-modal {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 24px 20px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.4s ease;
  border: 2px solid rgba(255, 215, 0, 0.5);
}

.instructions-header {
  text-align: center;
  margin-bottom: 20px;

  h2 {
    font-size: 26px;
    color: white;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
}

.instructions-body {
  margin-bottom: 24px;
}

.instruction-step {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateX(10px);
    background: rgba(255, 255, 255, 0.25);
  }
}

.step-number {
  width: 36px;
  height: 36px;
  background: #ffd700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #764ba2;
  margin-right: 12px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.step-text {
  font-size: 16px;
  color: white;
  font-weight: 500;
  line-height: 1.3;
}

.instructions-footer {
  display: flex;
  justify-content: center;
}

.start-game-btn {
  background: linear-gradient(135deg, #ffd700, #ffb347);
  color: #764ba2;
  border: none;
  padding: 12px 32px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 280px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }
}

/* Специальные стили для очень маленьких экранов */
@media (max-width: 480px) {
  .instructions-modal {
    padding: 20px 16px;
  }

  .instructions-header h2 {
    font-size: 22px;
  }

  .instruction-step {
    padding: 10px;
  }

  .step-number {
    width: 32px;
    height: 32px;
    font-size: 16px;
    margin-right: 10px;
  }

  .step-text {
    font-size: 14px;
  }

  .start-game-btn {
    padding: 10px 24px;
    font-size: 16px;
  }
}

.start-game-btn {
  background: linear-gradient(135deg, #ffd700, #ffb347);
  color: #764ba2;
  border: none;
  padding: 15px 40px;
  font-size: 20px;
  font-weight: bold;
  border-radius: 50px;
  cursor: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }
}

@media (max-width: 600px) {
  .letter-slot, .letter-card {
    width: 35px;
    height: 35px;
    font-size: 22px;
  }

  .translation {
    font-size: 24px;
  }

  .pronunciation {
    font-size: 20px;
  }

  .keyboard-hint {
    font-size: 12px;
  }

  .word-picture {
    max-width: 150px;
    max-height: 120px;
  }
}
</style>
