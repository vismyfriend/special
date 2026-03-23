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
        <select v-model="difficultyLevel" class="difficulty-select" @change="onDifficultyChange">
          <option value="1">🌟 выбран лёгкий уровень</option>
          <option value="2">⭐⭐ Средний уровень </option>
          <option value="3">⭐⭐⭐ Уровень профи ! </option>
        </select>



      </div>

      <!-- Русский перевод -->
      <div class="translation">
        {{ currentWord.ru }}
      </div>



      <!-- Аудио кнопка -->
      <div class="audio-section" v-if="currentWord.audio">
        <button class="audio-button" @click="playAudio">
          🔊 Прослушать
        </button>
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
          :class="{
      filled: filledSlots[index],
      space: item.isSpace,
      'correct-highlight': showFeedback && filledSlots[index] && isSlotCorrect(index),
      'wrong-highlight': showFeedback && filledSlots[index] && !isSlotCorrect(index)
    }"
          @click="removeLetterFromSlot(index)"
        >
          {{ filledSlots[index] || (item.isSpace ? ' ' : '') }}
        </div>
      </div>
      <!-- Подсказка (произношение) -->
      <div class="hint-section" v-if="currentWord.hint">
        <div class="pronunciation">{{ currentWord.hint }}</div>
      </div>


      <!-- Буквы для выбора -->
<!--      <div class="letters-grid" v-if="difficultyLevel !== 3 || !showFeedback">-->
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

      <!-- Панель управления -->
      <div class="control-panel">
<!--        <select v-model="difficultyLevel" class="difficulty-select" @change="onDifficultyChange">-->
<!--          <option value="1">🌟 Уровень 1 - Легкий </option>-->
<!--          <option value="2">⭐⭐ Уровень 2 - Средний </option>-->
<!--          <option value="3">⭐⭐⭐ Уровень 3 - Сложный </option>-->
<!--        </select>-->

        <button v-if="difficultyLevel === 3" class="reset-button" @click="resetCurrentWord">
          Reset сбросить
        </button>

        <button v-if="difficultyLevel === 3" class="check-button" @click="checkWord">
          ✓ check Проверить
        </button>
      </div>
    </div>

    <!-- Сообщение о завершении игры -->
    <!-- Модальное окно завершения игры -->
    <div v-if="isGameFinished" class="game-overlay">
      <div class="game-over-modal">
        <div class="modal-header">
          <h2 class="special-font">🎉 Поздравляю! 🎉</h2>
        </div>

        <div class="modal-body">
          <div class="result-stats">
            <div class="stat-item">
              <span class="stat-label">Уровень сложности:</span>
              <span class="stat-value">{{ getDifficultyName() }}</span>
            </div>
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
          <button
            class="modal-btn harder-btn"
            @click="tryHarderLevel"
            :disabled="difficultyLevel === 3"
            :class="{ disabled: difficultyLevel === 3 }"
          >
            ⬆️ Попробовать уровень сложнее
          </button>
<!--          <button class="modal-btn finish-btn" @click="finishGame">-->
<!--            🏁 Завершить-->
<!--          </button>-->
          <button class="modal-btn finish-btn" @click="goToAllSets">
            🏁 К другим миссиям
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

// Уровни сложности - используем число, но из select приходит строка
const difficultyLevel = ref(1);
const showFeedback = ref(false);
let feedbackTimeout = null;



// "Умное" перемешивание - гарантирует, что первая буква не будет первой буквой слова
const smartShuffle = (array, firstLetter = null) => {
  // Создаем копию массива
  const newArray = [...array];

  // Перемешиваем массив
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  // Если передана первая буква и она есть в массиве
  if (firstLetter && newArray.includes(firstLetter)) {
    // Проверяем, не стоит ли первая буква на первом месте
    if (newArray[0] === firstLetter) {
      // Находим другую позицию для этой буквы
      const firstLetterIndex = newArray.indexOf(firstLetter);
      // Меняем местами с какой-нибудь другой буквой (не первой)
      if (newArray.length > 1) {
        const swapIndex = 1; // Меняем со второй позицией
        [newArray[firstLetterIndex], newArray[swapIndex]] = [newArray[swapIndex], newArray[firstLetterIndex]];
      }
    }
  }

  return newArray;
};

// Гласные и согласные
const vowels = ['A', 'E', 'I', 'O', 'U'];
const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];

// Маппинг символов
const symbolMapping = {
  "'": ["'", "`", "´", "’", "‘", "§", "±", ".", ",", "?"],
  '"': ['"', '“', '”'],
  '-': ['-', '–', '—']
};
// Mapping маппинг если забыли переключить раскладку и вводят на русском
const russianToEnglishMap = {
  'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p',
  'ф': 'a', 'ы': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k', 'д': 'l',
  'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'm', 'б': ',', 'ю': '.', 'ё': '`',
  // Заглавные буквы
  'Й': 'Q', 'Ц': 'W', 'У': 'E', 'К': 'R', 'Е': 'T', 'Н': 'Y', 'Г': 'U', 'Ш': 'I', 'Щ': 'O', 'З': 'P', 'Х': '[', 'Ъ': ']',
  'Ф': 'A', 'Ы': 'S', 'В': 'D', 'А': 'F', 'П': 'G', 'Р': 'H', 'О': 'J', 'Л': 'K', 'Д': 'L', 'Ж': ';', 'Э': "'",
  'Я': 'Z', 'Ч': 'X', 'С': 'C', 'М': 'V', 'И': 'B', 'Т': 'N', 'Ь': 'M', 'Б': ',', 'Ю': '.', 'Ё': '`'
};

// Функция для преобразования русских букв в английские
const convertToEnglish = (char) => {
  // Если буква русская, возвращаем английский аналог
  if (russianToEnglishMap[char]) {
    return russianToEnglishMap[char];
  }
  // Иначе возвращаем исходный символ
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

// Массив со звуками
const wrongAnswerSounds = ref([
  new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no.mp3', import.meta.url).href,
  new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no1.mp3', import.meta.url).href,
  new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no2.mp3', import.meta.url).href,
  new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no3.mp3', import.meta.url).href,
  new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no4.mp3', import.meta.url).href,
  new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no5.mp3', import.meta.url).href,
  new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no6.mp3', import.meta.url).href,

]);

const totalWords = computed(() => gameWords.value.length);
const matchedPairs = computed(() => currentWordIndex.value);
const progressWidth = computed(() => `${(matchedPairs.value / totalWords.value) * 100}%`);
const progressPercentage = computed(() => Math.round((matchedPairs.value / totalWords.value) * 100));
const finalTime = computed(() => {
  return time.value;
});
const formatTime = (ms) => {
  if (typeof ms !== 'number' || isNaN(ms)) return '0 sec';

  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  // Функция для правильного склонения
  const getMinuteText = (num) => {
    if (num === 1) return 'minute';
    return 'minutes';
  };

  const getSecondText = (num) => {
    if (num === 1) return 'second';
    return 'seconds';
  };

  if (minutes === 0) {
    return `${seconds} ${getSecondText(seconds)} only !`;
  }

  if (seconds === 0) {
    return `${minutes} ${getMinuteText(minutes)} sharp !`;
  }

  return `${minutes} ${getMinuteText(minutes)} ${seconds} ${getSecondText(seconds)}`;
};


// Функция для запуска волновой анимации
const startWaveAnimation = () => {
  if (isWaveAnimating.value) return;
  isWaveAnimating.value = true;

  const slots = document.querySelectorAll('.letter-slot');
  const filledSlotsArray = Array.from(slots).filter((_, index) => filledSlots.value[index] !== null);

  // Запускаем анимацию для каждого заполненного слота с задержкой
  filledSlotsArray.forEach((slot, index) => {
    setTimeout(() => {
      slot.classList.add('wave-animation');
      setTimeout(() => {
        slot.classList.remove('wave-animation');
      }, 100);
    }, index * (1500 / filledSlotsArray.length)); // Равномерно распределяем на 1.5 секунды
  });

  setTimeout(() => {
    isWaveAnimating.value = false;
  }, 1500);
};

// Функция воспроизведения случайного звука
const playRandomWrongAnswerSound = () => {
  if (wrongAnswerSounds.value.length === 0) return;
  const randomIndex = Math.floor(Math.random() * wrongAnswerSounds.value.length);
  const audio = new Audio(wrongAnswerSounds.value[randomIndex]);

  // Устанавливаем громкость (0.0 - 1.0)
  audio.volume = 0.3; // 40% громкости

  audio.play().catch(e => console.log('Sound play failed:', e));
};

const getDifficultyName = () => {
  switch(difficultyLevel.value) {
    case 1: return 'Легкий';
    case 2: return 'Средний';
    case 3: return 'Сложный';
    default: return 'Средний';
  }
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

// Генерация доступных элементов - ИСПРАВЛЕНО: сравниваем с числом
// Генерация доступных элементов
const generateAvailableItems = (word) => {
  const itemsOnly = [];
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    if (!isSpace(char)) {
      itemsOnly.push(char.toUpperCase());
    }
  }

  // Получаем первую букву слова (без учета пробелов)
  let firstLetter = null;
  for (let i = 0; i < word.length; i++) {
    if (!isSpace(word[i])) {
      firstLetter = word[i].toUpperCase();
      break;
    }
  }


  // УРОВЕНЬ 1 - ТОЛЬКО БУКВЫ СЛОВА
  if (difficultyLevel.value === 1) {
    const shuffledItems = smartShuffle(itemsOnly, firstLetter);
    return shuffledItems.map(item => ({ value: item, used: false }));
  }

  // УРОВНИ 2 И 3 - ДОБАВЛЯЕМ 4 ЛИШНИХ БУКВЫ
  const extraLetters = [
    ...getRandomLetters(2, true),
    ...getRandomLetters(2, false)
  ];

  const allItems = [...itemsOnly, ...extraLetters];
  const shuffledItems = smartShuffle(allItems, firstLetter);

  return shuffledItems.map(item => ({ value: item, used: false }));
};

// Простое перемешивание (для списка слов)
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

const loadWord = () => {
  if (currentWordIndex.value >= gameWords.value.length) {
    console.log('=== GAME FINISHED ===');
    console.log('Final time value:', time.value);
    console.log('Final mistakesCount value:', mistakesCount.value);
    console.log('mistakesCount type:', typeof mistakesCount.value);
    console.log('mistakesCount ref:', mistakesCount);
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

// Функция для удаления буквы из слота
const removeLetterFromSlot = (slotIndex) => {
  // Только для 3 уровня (сложного)
  if (difficultyLevel.value !== 3) return;

  // Нельзя удалять во время показа обратной связи
  if (showFeedback.value) return;

  // Нельзя удалять пробелы
  if (wordStructure.value[slotIndex].isSpace) return;

  // Проверяем, есть ли буква в этом слоте
  const currentLetter = filledSlots.value[slotIndex];
  if (currentLetter === null || currentLetter === ' ') return;

  // Находим эту букву в availableLetters
  const letterToReturn = availableLetters.value.find(
    letter => letter.value === currentLetter && letter.used === true
  );

  if (letterToReturn) {
    // Возвращаем букву обратно в доступные
    letterToReturn.used = false;

    // Очищаем слот
    filledSlots.value[slotIndex] = null;
  }
};

const selectLetter = (itemObj) => {
  if (isGameFinished.value || itemObj.used || showFeedback.value) return;

  // Для сложного уровня - просто заполняем слоты без проверки
  if (difficultyLevel.value === 3) {
    const firstEmptyIndex = filledSlots.value.findIndex(slot => slot === null);
    if (firstEmptyIndex === -1) return;
    filledSlots.value[firstEmptyIndex] = itemObj.value;
    itemObj.used = true;
    return;
  }

  // Для уровней 1 и 2 - проверяем сразу
  const firstEmptyIndex = filledSlots.value.findIndex(slot => slot === null);
  if (firstEmptyIndex === -1) return;

  const expectedItem = wordStructure.value[firstEmptyIndex];
  let expectedValue = expectedItem.char;
  if (isLetter(expectedValue)) expectedValue = expectedValue.toUpperCase();

  if (isCharMatch(itemObj.value, expectedValue)) {
    filledSlots.value[firstEmptyIndex] = itemObj.value;
    itemObj.used = true;
    if (filledSlots.value.every(slot => slot !== null)) {
      // Воспроизводим аудио если есть
      if (currentWord.value?.audio) {
        playAudio();
      }
      setTimeout(() => {
        currentWordIndex.value++;
        loadWord();
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

const checkWord = () => {
  if (difficultyLevel.value !== 3) return;

  // Проверяем, все ли слоты заполнены
  const isComplete = filledSlots.value.every(slot => slot !== null);
  if (!isComplete) {
    triggerEarthquake();
    return;
  }

  // Запускаем волновую анимацию
  startWaveAnimation();

  // Проверяем правильность каждого слота
  let allCorrect = true;
  for (let i = 0; i < filledSlots.value.length; i++) {
    if (!isSlotCorrect(i)) {
      allCorrect = false;
      break;
    }
  }

  // Показываем обратную связь (с задержкой, чтобы анимация успела пройти)
  setTimeout(() => {
    showFeedback.value = true;

    if (allCorrect) {
      // Воспроизводим аудио если есть
      if (currentWord.value?.audio) {
        playAudio();
      }
      // Если всё правильно, переходим к следующему слову
      setTimeout(() => {
        showFeedback.value = false;
        currentWordIndex.value++;
        loadWord();
      }, 500);
    } else {
      // ВСЕГДА воспроизводим звук ошибки, независимо от наличия аудио у слова
      playRandomWrongAnswerSound();
      // Воспроизводим аудио если есть
      if (currentWord.value?.audio) {
        setTimeout(() => {
          playAudio();
        }, 1700);
      }
      // Если есть ошибки, увеличиваем счетчик и показываем подсветку
      mistakesCount.value++;
      setTimeout(() => {
        showFeedback.value = false;
        resetCurrentWord();
      }, 2000);
    }
  }, 800); // Небольшая задержка, чтобы волна прошла
};
const handleKeyPress = (event) => {
  if (isGameFinished.value || showFeedback.value) return;

  // Обработка Enter для проверки слова (только на 3 уровне)
  if (event.key === 'Enter') {
    event.preventDefault();

    // Только для 3 уровня (сложного)
    if (difficultyLevel.value === 3) {
      checkWord();
    }
    return;
  }

  // Обработка Backspace
  if (event.key === 'Backspace') {
    event.preventDefault();

    // Только для 3 уровня (сложного)
    if (difficultyLevel.value !== 3) return;

    // Находим последний заполненный слот
    let lastFilledIndex = -1;
    for (let i = filledSlots.value.length - 1; i >= 0; i--) {
      if (filledSlots.value[i] !== null && filledSlots.value[i] !== ' ') {
        lastFilledIndex = i;
        break;
      }
    }

    // Если есть заполненный слот, удаляем букву
    if (lastFilledIndex !== -1) {
      const currentLetter = filledSlots.value[lastFilledIndex];

      // Находим эту букву в availableLetters
      const letterToReturn = availableLetters.value.find(
        letter => letter.value === currentLetter && letter.used === true
      );

      if (letterToReturn) {
        // Возвращаем букву обратно в доступные
        letterToReturn.used = false;
        // Очищаем слот
        filledSlots.value[lastFilledIndex] = null;

        // Визуальная обратная связь
        const slotElement = document.querySelectorAll('.letter-slot')[lastFilledIndex];
        if (slotElement) {
          slotElement.classList.add('remove-pulse');
          setTimeout(() => {
            slotElement.classList.remove('remove-pulse');
          }, 200);
        }
      }
    }
    return;
  }


  // Сначала обрабатываем специальные клавиши

  let key = event.key;
  if (key === ' ' || key === 'Space') key = ' ';
  if (key === '§' || key === '±') key = "'";
  if (key === '`' || key === "'" || key === '´' || key === '’' || key === '‘') key = "'";

  // Преобразуем русские буквы в английские
  key = convertToEnglish(key);

  // Проверяем, что это допустимый символ (теперь и русские буквы преобразуются)
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

// Функция для смены уровня (убираем @change из select)
const onDifficultyChange = (event) => {
  const newLevel = parseInt(event.target.value, 10);
  difficultyLevel.value = newLevel;
};

// При смене уровня - обновляем доступные буквы для текущего слова
watch(difficultyLevel, (newLevel, oldLevel) => {
  if (oldLevel !== newLevel && currentWord.value) {
    // Обновляем доступные буквы для текущего слова
    const englishWord = currentWord.value.eng;
    availableLetters.value = generateAvailableItems(englishWord);
    // Сбрасываем флаг показа обратной связи
    showFeedback.value = false;
  }
});

const resetCurrentWord = () => loadWord();
const playAudio = () => {
  if (currentWord.value?.audio) {
    const audio = new Audio(currentWord.value.audio);
    audio.play().catch(e => console.log('Audio play failed:', e));
  }
};
const finishGame = () => {
  gameStore.setLastGameResults(time.value, mistakesCount.value);
  gameStore.setGameName(`SpellingAgent_${getDifficultyName()}`);
  gameStore.setWordSet(currentMission.value);
  router.push("/leader-board/");
};
const goToAllSets = () => {
  gameStore.setLastGameResults(time.value, mistakesCount.value);
  gameStore.setGameName(`SpellingAgent_${getDifficultyName()}`);
  gameStore.setWordSet(currentMission.value);
  router.push("/see-all-sets-of-words/");
};


// Улучшить результат - перезапустить игру на том же уровне
const improveResult = () => {
  isGameFinished.value = false;
  currentWordIndex.value = 0;
  mistakesCount.value = 0;
  time.value = 0;


  // ЗАНОВО ПЕРЕМЕШИВАЕМ СЛОВА
  const allWords = shortWordsData[currentMission.value];
  if (allWords?.length > 0) {
    gameWords.value = selectRandomWords(allWords, 10);
  }

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => { time.value += 10; }, 10);

  loadWord();
};

// Попробовать уровень сложнее
const tryHarderLevel = () => {
  if (difficultyLevel.value === 3) return; // Нельзя повысить выше 3

  // Повышаем уровень
  difficultyLevel.value = difficultyLevel.value + 1;

  // Сбрасываем игру
  isGameFinished.value = false;
  currentWordIndex.value = 0;
  mistakesCount.value = 0;
  time.value = 0;

  // ЗАНОВО ПЕРЕМЕШИВАЕМ СЛОВА
  const allWords = shortWordsData[currentMission.value];
  if (allWords?.length > 0) {
    gameWords.value = selectRandomWords(allWords, 10);
  }

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => { time.value += 10; }, 10);

  loadWord();
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

    timerInterval = setInterval(() => { time.value += 10; }, 10);
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
/* Добавляем стили для новых элементов */
.control-panel {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.difficulty-select {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 40px;
  border: 2px solid #4a90e2;
  background: white;
  cursor: none;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f4fa;
  }
}

.check-button {
  padding: 12px 24px;
  width: 130px;
  background: #3ec46d;
  color: white;
  border: none;
  border-radius: 40px;
  font-size: 16px;
  cursor: none;
  transition: all 0.3s ease;
  line-height: 15px;

  &:hover {
    background: #2e9b54;
    transform: scale(1.02);
  }
}

.correct-highlight {
  background: #c8e6c9 !important;
  border-color: #3ec46d !important;
  animation: correctPulse 0.5s ease;
}

.wrong-highlight {
  background: #ffcdd2 !important;
  border-color: #f44336 !important;
  animation: wrongPulse 0.5s ease;
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
  font-size: 28px;
  font-weight: bold;
  color: #4a90e2;
  background: #f0f4fa;
  display: inline-block;
  padding: 8px 24px;
  border-radius: 40px;
  font-family: monospace;
  margin-bottom: 10px;
}

.audio-section {
  text-align: center;
  margin-bottom: 20px;
}

.audio-button {
  background: #4a90e2;
  color: white;
  border: none;
  padding: 10px 24px;
  font-size: 16px;
  border-radius: 40px;
  cursor: none;
  transition: all 0.3s ease;

  &:hover {
    background: #357abd;
    transform: scale(1.05);
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
  display: inline-block;
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
    cursor: default;
    pointer-events: none;
    transform: scale(0.8);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
}

.reset-button {
  display: block;
  width: 150px;
  padding: 12px 24px;
  background: #ff9800;
  color: white;
  border: none;
  line-height: 15px;
  border-radius: 40px;
  font-size: 16px;
  cursor: none;
  transition: all 0.3s ease;

  &:hover {
    background: #f57c00;
    transform: scale(1.02);
  }
}

.finish-message {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 40px;
  max-width: 500px;
  margin: 50px auto;

  h2 {
    color: #3ec46d;
    margin-bottom: 16px;
  }

  p {
    font-size: 18px;
    color: #666;
    margin-bottom: 30px;
  }
}

.finish-button {
  padding: 12px 32px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 40px;
  font-size: 18px;
  cursor: none;
  transition: all 0.3s ease;

  &:hover {
    background: #357abd;
    transform: scale(1.05);
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
  cursor: pointer;
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

.harder-btn {
  background: linear-gradient(135deg, #ff9800, #f57c00);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);

  &:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
  }

  &.disabled {
    background: linear-gradient(135deg, #666, #555);
    box-shadow: none;
  }
}

.finish-btn {
  background: linear-gradient(135deg, #2196f3, #1976d2);
  color: white;
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);

  &:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
  }
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

.wrong-pulse {
  animation: wrongPulse 0.6s ease-in-out;
}

@keyframes wrongPulse {
  0% {
    transform: scale(1);
    background: #ffebee;
    border-color: #f44336;
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.6);
  }
  50% {
    transform: scale(1.05);
    background: #ffcdd2;
    border-color: #f44336;
    box-shadow: 0 0 8px 4px rgba(244, 67, 54, 0.8);
  }
  100% {
    transform: scale(1);
    background: #f0f4fa;
    border-color: #ccc;
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
  }
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

// Добавьте в конец стилей
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
