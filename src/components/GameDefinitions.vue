<template>
  <div class="game-container" v-if="currentGameData">
    <!-- Прогресс -->
    <div class="progress-info">
      <p>Осталось: {{ remainingCards }} определений </p>
    </div>

    <!-- Две карточки одновременно -->
    <div class="cards-grid" v-if="!gameCompleted">
      <div
        class="main-card"
        v-for="(definition, index) in activeDefinitions"
        :key="`${definition.id}-${index}`"
      >
        <!-- Кнопка-лампочка для переключения между переводом и попытками -->
        <button
          class="toggle-hint-btn"
          @click="toggleHintView(index)"
          :title="definition.showHintTranslation ? 'Показать попытки' : 'Показать перевод'"
        >
          {{ definition.showHintTranslation ? '💡' : '📝' }}
        </button>

        <div class="definition-section">
          <h3>Definition:</h3>
          <p class="english-definition" v-html="definition.engWithTooltips"></p>

          <!-- Блок с переводом -->
          <div class="translation" v-if="definition.showHintTranslation">
            <p v-html="definition.ruWithTooltips"></p>
          </div>

          <!-- Блок с обратной связью после неправильного ответа -->
          <div class="feedback-section" v-if="!definition.showHintTranslation && definition.showFeedback">
            <div class="attempt-feedback" v-if="definition.attempts < 4">
              <p class="attempt-message">Ваши попытки: <strong>{{ definition.allAttempts.join(', ') }}</strong></p>
              <p class="try-again">Ответ появится через {{ 4 - definition.attempts}} вариант(а)</p>
            </div>
            <div class="correct-answer" v-else>
              <p class="attempts-history" v-if="definition.allAttempts.length > 0">
                Ваши попытки: {{ definition.allAttempts.join(', ') }}
              </p>
              <p class="correct-answer-message">Правильный ответ: <strong>{{ definition.ans }}</strong></p>

            </div>
          </div>
        </div>

        <div class="input-section">
          <input
            class="answer-input"
            type="text"
            v-model="definition.userAnswer"
            @keyup.enter="checkAnswer(index)"
            :class="{
              'correct': definition.isCorrect,
              'incorrect': definition.isIncorrect
            }"
            placeholder="Введите ответ.."
            :disabled="definition.isCompleted"
          />
          <button
            class="check-btn"
            @click="checkAnswer(index)"
            :disabled="definition.isCompleted"
          >
            {{ definition.isCompleted ? '✓' : 'Проверить' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Сообщение о завершении игры -->
    <div class="completion-results" v-if="gameCompleted">
      <div class="results-header">
        <h2>🎉 Вы справились! 🎉</h2>
        <p class="results-subtitle"></p>
      </div>

      <div class="results-list">
        <div
          class="result-item"
          v-for="(item, index) in completedDefinitions"
          :key="item.id"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="result-answer">
            <span class="result-number">{{ index + 1 }}.</span>
            <strong class="answer-text">{{ item.ans }}</strong>
          </div>
          <div class="result-definition">
            <p class="english-definition" v-html="item.engWithTooltips"></p>
          </div>
        </div>
      </div>

      <div class="results-actions">
        <button class="restart-btn large" @click="restartGame">
          🎮 другие слова
        </button>

      </div>
    </div>

    <!-- Старое сообщение о завершении (оставляем на всякий случай) -->
    <div class="completion-message" v-if="definitions.length === 0 && activeDefinitions.length === 0 && !gameCompleted">
      <h3>🎉 Поздравляем! Вы отгадали всех персонажей!</h3>
      <button class="restart-btn" @click="restartGame">Начать заново</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import definitionsData from '../dataForGames/definitions-data';
import { useRoute } from 'vue-router';

const route = useRoute();

// ========== РЕАКТИВНЫЕ ПЕРЕМЕННЫЕ ==========
const currentGameData = ref([]); // Все данные из JSON
const definitions = ref([]); // Все определения для текущей игры
const activeDefinitions = ref([]); // Активные карточки (2 штуки)
const currentIndex = ref(0); // Текущий индекс для подгрузки новых карточек
const gameCompleted = ref(false); // Флаг завершения игры

// ========== ВЫЧИСЛЯЕМЫЕ СВОЙСТВА ==========
const remainingCards = computed(() => {
  const remainingFromDefinitions = Math.max(0, definitions.value.length - currentIndex.value);
  const remainingFromActive = activeDefinitions.value.filter(def => !def.isCompleted).length;
  return remainingFromDefinitions + remainingFromActive;
});

const totalCards = computed(() => currentGameData.value.length);

// Все завершенные определения для показа в результатах
const completedDefinitions = computed(() => {
  return definitions.value.filter(def => def.isCompleted);
});

// ========== НАБЛЮДАТЕЛИ ==========
// Следим за активными карточками и заменяем завершенные новыми
watch(activeDefinitions, (newActiveDefs) => {
  const completedCount = newActiveDefs.filter(def => def.isCompleted).length;

  if (completedCount > 0 && currentIndex.value < definitions.value.length) {
    replaceCompletedCards();
  } else {
    // Проверяем завершение игры, когда нет замен
    checkGameCompletion();
  }
}, { deep: true });

// ========== ФУНКЦИИ ДЛЯ РАБОТЫ С ТЕКСТОМ ==========
/**
 * Очищает текст определения от скобок с переводами
 */
const cleanDefinitionText = (text) => {
  return text.replace(/\s*\([^)]*\)/g, '');
};

/**
 * Преобразует текст с переводами в скобках в HTML с тултипами
 */
const addTranslationTooltips = (text) => {
  return text.replace(
    /(\w+)\s*\(([^)]+)\)/g,
    '<span class="translation-word" data-translation="$2">$1</span>'
  );
};

// ========== ОСНОВНЫЕ ФУНКЦИИ ИГРЫ ==========
/**
 * Инициализирует игру - загружает данные и настраивает начальное состояние
 */
const initializeGame = () => {
  const missionName = route.params.missionName;
  currentGameData.value = definitionsData[missionName] || [];
  gameCompleted.value = false; // Сбрасываем флаг завершения

  // Подготавливаем все определения для игры
  definitions.value = currentGameData.value.map(el => ({
    id: el.id,
    eng: el.eng,
    engClean: cleanDefinitionText(el.eng), // Очищенный английский текст
    engWithTooltips: addTranslationTooltips(el.eng), // Текст с тултипами
    ru: el.ru, // Русский перевод
    ruWithTooltips: addTranslationTooltips(el.ru), // Русский текст с тултипами
    ans: el.ans, // Правильный ответ
    userAnswer: '', // Текущий ответ пользователя
    showHintTranslation: false, // Показывать ли перевод
    showFeedback: false, // Показывать ли блок с попытками
    attempts: 0, // Количество неправильных попыток
    allAttempts: [], // Массив всех введенных ответов
    isCompleted: false, // Завершена ли карточка
    isCorrect: false, // Правильный ли текущий ответ
    isIncorrect: false // Неправильный ли текущий ответ
  }));

  currentIndex.value = 0;
  loadInitialCards();

  // Сбрасываем проверку завершения
  setTimeout(() => {
    checkGameCompletion();
  }, 100);
};

/**
 * Загружает первые 2 карточки для начала игры
 */
const loadInitialCards = () => {
  const initialDefinitions = definitions.value.slice(currentIndex.value, currentIndex.value + 2);

  activeDefinitions.value = initialDefinitions.map(def => ({
    ...def,
    userAnswer: '',
    showHintTranslation: false,
    showFeedback: false,
    attempts: 0,
    allAttempts: [],
    isCompleted: false,
    isCorrect: false,
    isIncorrect: false
  }));

  currentIndex.value += initialDefinitions.length;
};

/**
 * Заменяет завершенные карточки новыми из очереди
 */
const replaceCompletedCards = () => {
  const newActiveDefinitions = [...activeDefinitions.value];
  let hasReplacements = false;

  for (let i = 0; i < newActiveDefinitions.length; i++) {
    if (newActiveDefinitions[i].isCompleted && currentIndex.value < definitions.value.length) {
      // Находим и обновляем оригинальное определение в definitions
      const completedDefinitionIndex = definitions.value.findIndex(def => def.id === newActiveDefinitions[i].id);
      if (completedDefinitionIndex !== -1) {
        definitions.value[completedDefinitionIndex].isCompleted = true;
      }

      const nextDefinition = definitions.value[currentIndex.value];

      newActiveDefinitions[i] = {
        ...nextDefinition,
        userAnswer: '',
        showHintTranslation: false,
        showFeedback: false,
        attempts: 0,
        allAttempts: [],
        isCompleted: false,
        isCorrect: false,
        isIncorrect: false
      };

      currentIndex.value++;
      hasReplacements = true;
    }
  }

  if (hasReplacements) {
    activeDefinitions.value = newActiveDefinitions;
  } else {
    // Если нет замен, но все карточки завершены, проверяем завершение игры
    const allActiveCompleted = newActiveDefinitions.every(def => def.isCompleted);
    if (allActiveCompleted && currentIndex.value >= definitions.value.length) {
      // Помечаем оставшиеся активные карточки как завершенные в definitions
      newActiveDefinitions.forEach(activeDef => {
        const defIndex = definitions.value.findIndex(def => def.id === activeDef.id);
        if (defIndex !== -1) {
          definitions.value[defIndex].isCompleted = true;
        }
      });
      // Все карточки завершены и больше нет карточек для замены
      checkGameCompletion();
    }
  }
};

/**
 * Переключает между показом перевода и показом попыток
 */
const toggleHintView = (index) => {
  activeDefinitions.value[index].showHintTranslation = !activeDefinitions.value[index].showHintTranslation;
};

/**
 * Проверяет ответ пользователя и обновляет состояние карточки
 */
const checkAnswer = (index) => {
  const definition = activeDefinitions.value[index];

  // Проверяем, не завершена ли уже карточка
  if (definition.isCompleted) return;

  // Если поле ввода пустое, считаем это неправильным ответом
  if (!definition.userAnswer.trim()) {
    definition.isCorrect = false;
    definition.isIncorrect = true;
    definition.showHintTranslation = false;
    definition.showFeedback = true;
    definition.attempts += 1;
    definition.allAttempts.push(' - ');
    definition.userAnswer = '';

    setTimeout(() => {
      definition.isIncorrect = false;
    }, 2000);

    return;
  }

  const isCorrect = isAnswerCorrect(definition.userAnswer, definition.ans);

  if (isCorrect) {
    // Правильный ответ
    definition.isCorrect = true;
    definition.isIncorrect = false;
    definition.showFeedback = false;

    // Завершаем карточку через небольшую задержку
    setTimeout(() => {
      definition.isCompleted = true;

      // Обновляем оригинальное определение в definitions
      const defIndex = definitions.value.findIndex(def => def.id === definition.id);
      if (defIndex !== -1) {
        definitions.value[defIndex].isCompleted = true;
      }

      // После завершения карточки проверяем завершение игры
      checkGameCompletion();
    }, 800);
  } else {
    // Неправильный ответ
    definition.isCorrect = false;
    definition.isIncorrect = true;
    definition.showHintTranslation = false;
    definition.showFeedback = true;
    definition.attempts += 1;
    definition.allAttempts.push(definition.userAnswer);
    definition.userAnswer = '';

    setTimeout(() => {
      definition.isIncorrect = false;
    }, 2000);
  }
};

/**
 * Проверяет завершение игры
 */
const checkGameCompletion = () => {
  const allCompleted = definitions.value.length > 0 &&
    definitions.value.every(def => def.isCompleted);

  // console.log('Game completion check:', {
  //   allCompleted,
  //   definitionsLength: definitions.value.length,
  //   definitionsCompleted: definitions.value.filter(def => def.isCompleted).length,
  //   activeDefinitionsLength: activeDefinitions.value.length,
  //   activeCompleted: activeDefinitions.value.filter(def => def.isCompleted).length
  // });

  if (allCompleted && !gameCompleted.value) {
    // console.log('🎉 Game completed! Showing results...');
    setTimeout(() => {
      gameCompleted.value = true;
    }, 500);
  }
};

/**
 * Перезапускает игру
 */
const restartGame = () => {
  gameCompleted.value = false;
  initializeGame();
};

// ========== ФУНКЦИИ ДЛЯ ПРОВЕРКИ ОТВЕТОВ ==========
/**
 * Нормализует ответ пользователя для сравнения
 */
const normalizeAnswer = (answer) => {
  if (!answer || typeof answer !== 'string') return '';

  return answer
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.,!?;:…–—]+$/g, '')
    .replace(/[.,!?;:…–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[`'‘’´]/g, "'")
    .replace(/\bdo not\b/g, "don't")
    .replace(/\bdoes not\b/g, "doesn't")
    .replace(/\bdid not\b/g, "didn't")
    .replace(/\bwill not\b/g, "won't")
    .replace(/\bcan not\b/g, "can't")
    .replace(/\b(?:dont|doesnt|didnt|wont|cant)\b/g, match =>
      ({
        dont: "don't",
        doesnt: "doesn't",
        didnt: "didn't",
        wont: "won't",
        cant: "can't"
      }[match]))
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Проверяет, является ли опечатка допустимой
 */
const isTypoCloseEnough = (userWord, correctWord) => {
  if (userWord === correctWord) return true;

  // Слова, которые должны совпадать точно
  const strictWords = ['he','his','she','her','you','your','we','our','it','is','are','was','were','do','does','did','have','has','had','who','why'];
  const isShortWord = correctWord.length <= 3;

  if (strictWords.includes(correctWord) || isShortWord) {
    return false;
  }

  // Допускаем разницу в длине не более 1 символа
  if (Math.abs(userWord.length - correctWord.length) > 1) return false;

  // Проверяем количество ошибок (не более 1)
  let errors = 0;
  const maxLength = Math.max(userWord.length, correctWord.length);

  for (let i = 0, j = 0; i < maxLength || j < maxLength; i++, j++) {
    if (i >= userWord.length || j >= correctWord.length || userWord[i] !== correctWord[j]) {
      errors++;
      if (errors > 1) return false;
      if (userWord.length > correctWord.length) j--;
      else if (userWord.length < correctWord.length) i--;
    }
  }

  return true;
};

/**
 * Проверяет правильность ответа пользователя
 */
const isAnswerCorrect = (userAnswer, correctAnswer) => {
  const normalizedUser = normalizeAnswer(userAnswer);
  const normalizedCorrect = normalizeAnswer(correctAnswer);

  // Проверка точного совпадения
  if (normalizedUser === normalizedCorrect) return true;

  // Функция для получения правильного артикля для слова
  const getCorrectArticle = (word) => {
    if (!word) return '';
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return vowels.some(vowel => word.toLowerCase().startsWith(vowel)) ? 'an' : 'a';
  };

  // Функция для проверки артиклей
  const checkArticles = (userText, correctText) => {
    const userWords = userText.split(' ');
    const correctWords = correctText.split(' ');

    const userHasArticle = userWords.length > 1 && (userWords[0] === 'a' || userWords[0] === 'an');
    const correctHasArticle = correctWords.length > 1 && (correctWords[0] === 'a' || correctWords[0] === 'an');

    if (userHasArticle && correctHasArticle) {
      return userWords[0] === correctWords[0];
    } else if (userHasArticle && !correctHasArticle) {
      const userArticle = userWords[0];
      const userFirstWord = userWords[1];
      const correctArticle = getCorrectArticle(userFirstWord);
      return userArticle === correctArticle;
    } else if (!userHasArticle && correctHasArticle) {
      return true;
    }

    return true;
  };

  // Функция для удаления артиклей "a" и "an"
  const removeArticles = (text) => {
    return text
      .replace(/^\s*(a|an)\s+/i, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Проверяем правильность артиклей
  const articlesAreCorrect = checkArticles(normalizedUser, normalizedCorrect);
  if (!articlesAreCorrect) return false;

  // Проверка совпадения без артиклей
  const userWithoutArticles = removeArticles(normalizedUser);
  const correctWithoutArticles = removeArticles(normalizedCorrect);

  if (userWithoutArticles === correctWithoutArticles) return true;

  // Разбиваем на слова без артиклей и проверяем с учетом опечаток
  const userWords = userWithoutArticles.split(' ');
  const correctWords = correctWithoutArticles.split(' ');

  if (userWords.length === correctWords.length) {
    let allWordsMatch = true;
    for (let i = 0; i < correctWords.length; i++) {
      if (!isTypoCloseEnough(userWords[i], correctWords[i])) {
        allWordsMatch = false;
        break;
      }
    }
    if (allWordsMatch) return true;
  }

  return false;
};

// ========== ИНИЦИАЛИЗАЦИЯ ==========
onMounted(() => {
  initializeGame();
});
</script>

<style lang="scss">
/* Глобальные стили для слов с переводами */
.translation-word {
  color: #2c5aa0;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 2px;
  cursor: pointer;
  position: relative;

  &:hover::after {
    content: attr(data-translation);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    margin-bottom: 5px;
  }

  &:hover::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #333;
    margin-bottom: -5px;
    z-index: 1001;
  }
}

/* Адаптивность для тултипов на мобильных */
@media (max-width: 768px) {
  .translation-word:hover::after {
    font-size: 11px;
    padding: 6px 10px;
    width: 100px;
    white-space: normal;
    text-align: center;
  }
}
</style>

<style lang="scss" scoped>
.game-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.progress-info {
  text-align: center;
  margin-bottom: 20px;
  font-size: 16px;
  color: #666;
}

.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.main-card {
  background: #f9f9f9;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: slideIn 0.5s ease;
  position: relative; /* Для позиционирования кнопки-лампочки */
}

/* Стили для экрана результатов */
.completion-results {
  text-align: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, #f9f9f9 0%, #e8f4f8 100%);
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.8s ease;

  .results-header {
    margin-bottom: 30px;

    h2 {
      color: #28a745;
      margin-bottom: 10px;
      font-size: 28px;
    }

    .results-subtitle {
      color: #666;
      font-size: 18px;
      margin: 0;
    }
  }

  .results-list {
    max-height: 60vh;
    overflow-y: auto;
    margin-bottom: 30px;
    padding: 0 10px;

    .result-item {
      background: white;
      border-radius: 12px;
      padding: 10px;
      margin-bottom: 15px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      border-left: 4px solid #2c5aa0;
      animation: slideInUp 0.5s ease both;

      .result-answer {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .result-number {
          background: #2c5aa0;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .answer-text {
          color: #2c5aa0;
          font-size: 18px;
          margin: 0;
        }
      }

      .result-definition {
        text-align: left;

        .english-definition {
          font-size: 14px;
          line-height: 18px;
          color: #444;
          margin: 0;
          background: #f8f9fa;
          border-radius: 8px;
        }
      }
    }
  }

  .results-actions {
    .restart-btn.large {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      border: none;
      padding: 15px 40px;
      border-radius: 25px;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
      }
    }
  }
}

/* Анимации */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Кнопка-лампочка в правом верхнем углу */
.toggle-hint-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 50%;
  background: #ffc107;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.1);
    background: #ffb300;
  }

  &:active {
    transform: scale(0.95);
  }
}

.definition-section {
  margin-bottom: 20px;

  h3 {
    color: #333;
    margin-bottom: 12px;
    font-size: 16px;
  }

  .english-definition {
    font-size: 14px;
    line-height: 1.4;
    color: #444;
    margin-bottom: 12px;
    padding: 2px 12px;
    background: white;
    border-radius: 8px;
    border-left: 4px solid #2c5aa0;
  }
}

/* Стили для блока с переводом */
.translation {
  margin-top: 12px;
  padding: 12px;
  background: #e9ecef;
  border-radius: 8px;
  border-left: 4px solid #28a745;

  p {
    margin: 0;
    color: #495057;
    line-height: 1.3;
    font-size: 13px;
  }
}

/* Стили для блока с попытками и обратной связью */
.feedback-section {
  margin-top: 12px;
  padding: 2px 12px;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
  background: #fff3cd;

  .attempt-feedback {
    .attempt-message {
      margin: 0 0 8px 0;
      color: #856404;
      font-size: 13px;
    }

    .try-again {
      margin: 0;
      color: #856404;
      font-size: 12px;
      font-style: italic;
    }
  }

  .correct-answer {
    .correct-answer-message {
      margin: 0 0 8px 0;
      color: #155724;
      font-size: 13px;
      font-weight: bold;
    }

    .attempts-history {
      margin: 0;
      color: #6c757d;
      font-size: 12px;
      font-style: italic;
    }
  }
}

.input-section {
  display: flex;
  gap: 8px;

  .answer-input {
    flex: 1;
    padding: 10px 12px;
    border: 2px solid #ddd;
    border-radius: 20px;
    font-size: 14px;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #2c5aa0;
      box-shadow: 0 0 0 2px rgba(44, 90, 160, 0.1);
    }

    &:disabled {
      background-color: #f8f9fa;
      cursor: not-allowed;
    }

    /* Стили для правильного ответа */
    &.correct {
      border-color: #28a745;
      background-color: rgba(40, 167, 69, 0.1);
      box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2);
    }

    /* Стили для неправильного ответа */
    &.incorrect {
      border-color: #dc3545;
      background-color: rgba(220, 53, 69, 0.1);
      box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
    }
  }

  .check-btn {
    background: #2c5aa0;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: all 0.3s ease;
    white-space: nowrap;
    min-width: 80px;

    &:hover:not(:disabled) {
      background: #1e3d6f;
      transform: translateY(-1px);
    }

    &:disabled {
      background: #6c757d;
      cursor: not-allowed;
      transform: none;
    }
  }
}

.completion-message {
  text-align: center;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 20px;

  h3 {
    color: #28a745;
    margin-bottom: 20px;
  }
}

.restart-btn {
  background: #2c5aa0;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: #1e3d6f;
    transform: translateY(-2px);
  }
}

/* Анимация появления карточек */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .completion-results {
    padding: 10px 15px;


    .results-header h2 {
      font-size: 24px;
    }

    .results-header .results-subtitle {
      font-size: 16px;

    }

    .result-item {
      padding: 15px;

      .result-answer .answer-text {
        font-size: 16px;

      }
    }

    .restart-btn.large {
      padding: 12px 30px;
      font-size: 16px;
    }
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .game-container {
    padding: 10px;
  }

  .toggle-hint-btn {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
}


</style>
