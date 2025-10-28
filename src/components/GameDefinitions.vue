<template>
  <div class="game-container" v-if="currentGameData">
    <!-- Прогресс -->
    <div class="progress-info">
      <p>Осталось: {{ remainingCards }} из {{ totalCards }}</p>
    </div>

    <!-- Две карточки одновременно -->
    <div class="cards-grid">
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
          <p class="english-definition">{{ definition.engClean }}</p>

          <!-- Блок с переводом -->
          <div class="translation" v-if="definition.showHintTranslation">
            <p>{{ definition.ru }}</p>
          </div>

          <!-- Блок с обратной связью после неправильного ответа -->
          <div class="feedback-section" v-if="!definition.showHintTranslation && definition.showFeedback">
            <div class="attempt-feedback" v-if="definition.attempts < 3">
              <p class="attempt-message">Ваши попытки: <strong>{{ definition.allAttempts.join(', ') }}</strong></p>
              <p class="try-again">Попробуйте еще раз! Попытка {{ definition.attempts }} из 3</p>
            </div>
            <div class="correct-answer" v-else>
              <p class="correct-answer-message">Правильный ответ: <strong>{{ definition.ans }}</strong></p>
              <p class="attempts-history" v-if="definition.allAttempts.length > 0">
                Ваши попытки: {{ definition.allAttempts.join(', ') }}
              </p>
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
            placeholder="Введите название персонажа..."
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

    <!-- Сообщение о завершении -->
    <div class="completion-message" v-if="definitions.length === 0 && activeDefinitions.length === 0">
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
// Основные данные игры
const currentGameData = ref([]); // Все данные из JSON
const definitions = ref([]); // Все определения для текущей игры
const activeDefinitions = ref([]); // Активные карточки (2 штуки)
const currentIndex = ref(0); // Текущий индекс для подгрузки новых карточек

// ========== ВЫЧИСЛЯЕМЫЕ СВОЙСТВА ==========
const remainingCards = computed(() => {
  // Оставшиеся карточки = те, что еще не показаны + активные незавершенные
  const remainingFromDefinitions = Math.max(0, definitions.value.length - currentIndex.value);
  const remainingFromActive = activeDefinitions.value.filter(def => !def.isCompleted).length;
  return remainingFromDefinitions + remainingFromActive;
});

const totalCards = computed(() => currentGameData.value.length);

// ========== НАБЛЮДАТЕЛИ ==========
// Следим за активными карточками и заменяем завершенные новыми
watch(activeDefinitions, (newActiveDefs) => {
  const completedCount = newActiveDefs.filter(def => def.isCompleted).length;

  if (completedCount > 0 && currentIndex.value < definitions.value.length) {
    replaceCompletedCards();
  }
}, { deep: true });

// ========== ФУНКЦИИ ДЛЯ РАБОТЫ С ТЕКСТОМ ==========
/**
 * Очищает текст определения от скобок с переводами
 * @param {string} text - исходный текст
 * @returns {string} очищенный текст
 */
const cleanDefinitionText = (text) => {
  return text.replace(/\s*\([^)]*\)/g, '');
};

// ========== ОСНОВНЫЕ ФУНКЦИИ ИГРЫ ==========
/**
 * Инициализирует игру - загружает данные и настраивает начальное состояние
 */
const initializeGame = () => {
  const missionName = route.params.missionName;
  currentGameData.value = definitionsData[missionName] || [];

  // Подготавливаем все определения для игры
  definitions.value = currentGameData.value.map(el => ({
    id: el.id,
    eng: el.eng,
    engClean: cleanDefinitionText(el.eng), // Очищенный английский текст
    ru: el.ru, // Русский перевод
    ans: el.ans, // Правильный ответ
    userAnswer: '', // Текущий ответ пользователя
    showHintTranslation: false, // Показывать ли перевод (управляется кнопкой-лампочкой)
    showFeedback: false, // Показывать ли блок с попытками
    attempts: 0, // Количество неправильных попыток
    allAttempts: [], // Массив всех введенных ответов
    isCompleted: false, // Завершена ли карточка
    isCorrect: false, // Правильный ли текущий ответ
    isIncorrect: false // Неправильный ли текущий ответ
  }));

  currentIndex.value = 0;
  loadInitialCards();
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
  }
};

/**
 * Переключает между показом перевода и показом попыток
 * @param {number} index - индекс карточки в activeDefinitions
 */
const toggleHintView = (index) => {
  activeDefinitions.value[index].showHintTranslation = !activeDefinitions.value[index].showHintTranslation;
};

/**
 * Проверяет ответ пользователя и обновляет состояние карточки
 * @param {number} index - индекс карточки в activeDefinitions
 */
const checkAnswer = (index) => {
  const definition = activeDefinitions.value[index];

  // Проверяем, не завершена ли уже карточка
  if (definition.isCompleted) return;

  // Если поле ввода пустое, считаем это неправильным ответом
  if (!definition.userAnswer.trim()) {
    definition.isCorrect = false;
    definition.isIncorrect = true;
    definition.showHintTranslation = false; // Скрываем перевод
    definition.showFeedback = true; // Показываем блок с попытками
    definition.attempts += 1;

    // Сохраняем пустую попытку в историю (можно написать "пусто" или оставить пустую строку)
    definition.allAttempts.push('(пусто)');

    // Очищаем поле ввода
    definition.userAnswer = '';

    // Сбрасываем красную подсветку через 2 секунды
    setTimeout(() => {
      definition.isIncorrect = false;
    }, 2000);

    return; // Выходим из функции
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
    }, 800);
  } else {
    // Неправильный ответ
    definition.isCorrect = false;
    definition.isIncorrect = true;
    definition.showHintTranslation = false; // Скрываем перевод
    definition.showFeedback = true; // Показываем блок с попытками
    definition.attempts += 1;

    // Сохраняем текущую попытку в историю
    definition.allAttempts.push(definition.userAnswer);

    // Очищаем поле ввода для следующей попытки
    definition.userAnswer = '';

    // Сбрасываем красную подсветку через 2 секунды
    setTimeout(() => {
      definition.isIncorrect = false;
    }, 2000);
  }
};

/**
 * Перезапускает игру
 */
const restartGame = () => {
  initializeGame();
};

// ========== ФУНКЦИИ ДЛЯ ПРОВЕРКИ ОТВЕТОВ ==========
/**
 * Нормализует ответ пользователя для сравнения
 * @param {string} answer - ответ пользователя
 * @returns {string} нормализованный ответ
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
 * @param {string} userWord - слово пользователя
 * @param {string} correctWord - правильное слово
 * @returns {boolean} true если опечатка допустима
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
 * @param {string} userAnswer - ответ пользователя
 * @param {string} correctAnswer - правильный ответ
 * @returns {boolean} true если ответ правильный
 */
const isAnswerCorrect = (userAnswer, correctAnswer) => {
  const normalizedUser = normalizeAnswer(userAnswer);
  const normalizedCorrect = normalizeAnswer(correctAnswer);

  if (normalizedUser === normalizedCorrect) return true;

  // Разбиваем на слова и проверяем каждое слово с учетом опечаток
  const userWords = normalizedUser.split(' ');
  const correctWords = normalizedCorrect.split(' ');

  if (userWords.length !== correctWords.length) return false;

  for (let i = 0; i < correctWords.length; i++) {
    if (!isTypoCloseEnough(userWords[i], correctWords[i])) {
      return false;
    }
  }

  return true;
};

// ========== ИНИЦИАЛИЗАЦИЯ ==========
// Запускаем игру при загрузке компонента
onMounted(() => {
  initializeGame();
});
</script>

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
    padding: 12px;
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
  padding: 12px;
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
  flex-direction: column;
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
