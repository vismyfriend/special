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
        <div class="definition-section">
          <h3>Definition:</h3>
          <p class="english-definition">{{ definition.engClean }}</p>

          <!-- Кнопка для показа перевода -->
          <button
            class="show-translation-btn"
            @click="toggleTranslation(index)"
            v-if="!definition.showTranslation"
          >
            Показать перевод
          </button>

          <!-- Перевод (изначально скрыт) -->
          <div class="translation" v-if="definition.showTranslation">
            <p>{{ definition.ru }}</p>

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
            :disabled="!definition.userAnswer?.trim() || definition.isCompleted"
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

const currentGameData = ref([]);
const definitions = ref([]);
const activeDefinitions = ref([]);
const currentIndex = ref(0);

// Вычисляемые свойства
const remainingCards = computed(() => {
  const remainingFromDefinitions = Math.max(0, definitions.value.length - currentIndex.value);
  const remainingFromActive = activeDefinitions.value.filter(def => !def.isCompleted).length;
  return remainingFromDefinitions + remainingFromActive;
});

const totalCards = computed(() => currentGameData.value.length);

// Наблюдатель за завершением карточек
watch(activeDefinitions, (newActiveDefs) => {
  const completedCount = newActiveDefs.filter(def => def.isCompleted).length;

  if (completedCount > 0 && currentIndex.value < definitions.value.length) {
    // Заменяем завершенные карточки новыми
    replaceCompletedCards();
  }
}, { deep: true });

// Функция для очистки текста от скобок с переводами
const cleanDefinitionText = (text) => {
  return text.replace(/\s*\([^)]*\)/g, '');
};

// Инициализация игры
const initializeGame = () => {
  const missionName = route.params.missionName;
  currentGameData.value = definitionsData[missionName] || [];

  // Очищаем определения от скобок с переводами
  definitions.value = currentGameData.value.map(el => ({
    id: el.id,
    eng: el.eng,
    engClean: cleanDefinitionText(el.eng),
    ru: el.ru,
    ans: el.ans,
    userAnswer: '',
    showTranslation: false,
    isCompleted: false,
    isCorrect: false,
    isIncorrect: false
  }));

  currentIndex.value = 0;
  loadInitialCards();
};

// Загрузка начальных 2 карточек
const loadInitialCards = () => {
  const initialDefinitions = definitions.value.slice(currentIndex.value, currentIndex.value + 2);

  activeDefinitions.value = initialDefinitions.map(def => ({
    ...def,
    userAnswer: '',
    showTranslation: false,
    isCompleted: false,
    isCorrect: false,
    isIncorrect: false
  }));

  currentIndex.value += initialDefinitions.length;
};

// Замена завершенных карточек новыми
const replaceCompletedCards = () => {
  const newActiveDefinitions = [...activeDefinitions.value];
  let hasReplacements = false;

  for (let i = 0; i < newActiveDefinitions.length; i++) {
    if (newActiveDefinitions[i].isCompleted && currentIndex.value < definitions.value.length) {
      const nextDefinition = definitions.value[currentIndex.value];

      newActiveDefinitions[i] = {
        ...nextDefinition,
        userAnswer: '',
        showTranslation: false,
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

// Переключение перевода
const toggleTranslation = (index) => {
  activeDefinitions.value[index].showTranslation = !activeDefinitions.value[index].showTranslation;
};

// Проверка ответа
const checkAnswer = (index) => {
  const definition = activeDefinitions.value[index];
  if (!definition.userAnswer.trim() || definition.isCompleted) return;

  const isCorrect = isAnswerCorrect(definition.userAnswer, definition.ans);

  if (isCorrect) {
    definition.isCorrect = true;
    definition.isIncorrect = false;

    // Помечаем как завершенную через короткую задержку для визуального подтверждения
    setTimeout(() => {
      definition.isCompleted = true;
    }, 800);
  } else {
    definition.isCorrect = false;
    definition.isIncorrect = true;

    // Сбрасываем статус incorrect через 2 секунды
    setTimeout(() => {
      definition.isIncorrect = false;
    }, 2000);
  }
};

// Перезапуск игры
const restartGame = () => {
  initializeGame();
};

// Проверка правильности ответа
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

const isTypoCloseEnough = (userWord, correctWord) => {
  if (userWord === correctWord) return true;

  const strictWords = ['he','his','she','her','you','your','we','our','it','is','are','was','were','do','does','did','have','has','had','who','why'];
  const isShortWord = correctWord.length <= 3;

  if (strictWords.includes(correctWord) || isShortWord) {
    return false;
  }

  if (Math.abs(userWord.length - correctWord.length) > 1) return false;

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

const isAnswerCorrect = (userAnswer, correctAnswer) => {
  const normalizedUser = normalizeAnswer(userAnswer);
  const normalizedCorrect = normalizeAnswer(correctAnswer);

  if (normalizedUser === normalizedCorrect) return true;

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

// Инициализация при монтировании
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

.show-translation-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.3s ease;

  &:hover {
    background: #5a6268;
  }
}

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

    &.correct {
      border-color: #28a745;
      background-color: rgba(40, 167, 69, 0.1);
      box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2);
    }

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

/* Анимации */
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

/* Адаптивность */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }

  .game-container {
    padding: 10px;
  }
}
</style>
