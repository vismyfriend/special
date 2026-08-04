<template>
  <!-- ==================== -->
  <!-- Основной экран игры -->
  <!-- ==================== -->
  <img class="backgroundImg" :src="backgroundImage" alt="Фон игры">

  <div class="game-container" v-if="!gameFinished">
    <div class="detective-board">
      <!-- Polaroid-стиль для фотографии -->
      <div class="polaroid">
        <div class="polaroid-content">
          <!-- Левая часть: ФОТО -->
          <div class="photo-wrapper">
            <div v-if="isPhotoLoading" class="photo-placeholder">
              <div class="loader-spinner"></div>
              <p class="loader-text">{{ currentLoadingPhrase }}</p>
            </div>
            <img
              v-show="!isPhotoLoading && !photoLoadError"
              :src="currentPhoto.picture"
              alt="Фото для описания"
              class="photo"
              @load="handlePhotoLoad"
              @error="handlePhotoError"
            >
            <div v-if="photoLoadError" class="photo-error">
              <span>❌</span>
              <p>Не удалось загрузить фото</p>
            </div>
          </div>

          <!-- Правая часть: ЗАДАНИЕ -->
          <div class="task-container">
            <!-- Навигация по типам заданий (бесконечная карусель) -->
            <div class="task-nav">
              <button class="nav-arrow" @click="prevTask">
                ‹
              </button>
              <span class="task-title">{{ currentTask.icon }} {{ currentTask.title }}</span>
              <button class="nav-arrow" @click="nextTask">
                ›
              </button>
            </div>

            <!-- Контент задания -->
            <div class="task-content">
              <!-- Устное описание -->
              <div v-if="currentTask.type === 'speaking'" class="speaking-task">
                <p class="task-instruction">🗣️ Нажимай на фразы, которые подходят для описания этого изображения и читай их вслух, продолжи фразу и опиши фотографию:</p>
                <div class="useful-phrases">
                  <button
                    v-for="(phrase, idx) in displayedPhrases"
                    :key="idx"
                    class="phrase-chip"
                    :class="{ 'used': isPhraseUsed(phrase) }"
                    @click="togglePhrase(phrase)"
                  >
                    {{ phrase }}
                    <span v-if="isPhraseUsed(phrase)" class="check-mark">✓</span>
                  </button>
                </div>
                <button class="show-phrases-btn" @click="loadMorePhrases" :disabled="allPhrasesShown">
                  {{ allPhrasesShown ? '✨ Все фразы показаны' : '➕ Ещё фразы' }}
                </button>
              </div>

              <!-- Пример ответа (показать описание фото) -->
              <div v-if="currentTask.type === 'example'" class="example-task">
                <p class="task-instruction">💡 Посмотри, как можно описать это фото:</p>
                <div class="example-answer">
                  <p>{{ currentPhoto.description || 'Описание отсутствует' }}</p>
                </div>
                <button class="show-phrases-btn" @click="copyText(currentPhoto.description || 'Описание отсутствует')">
                  📋 Скопировать описание
                </button>
              </div>

              <!-- Fill in the gaps -->
              <div v-if="currentTask.type === 'fill-gaps'" class="fill-gaps-task">
                <p class="task-instruction">📝 Заполни пропуски в описании (впиши слова, которые были удалены):</p>
                <div class="gap-template">
                  <p v-for="(line, idx) in currentGapTemplate" :key="idx" class="gap-line">
                    <span v-for="(part, pIdx) in line" :key="pIdx">
                      <span v-if="part.type === 'text'">{{ part.content }}</span>
                      <input
                        v-else-if="part.type === 'gap'"
                        v-model="gapAnswers[idx][pIdx]"
                        class="gap-input"
                        :class="{
                          'gap-correct': gapFeedback[idx]?.[pIdx] === true,
                          'gap-wrong': gapFeedback[idx]?.[pIdx] === false
                        }"
                        :placeholder="'___'"
                        @input="checkGapAnswer(idx, pIdx)"
                        :disabled="gapFeedback[idx]?.[pIdx] === true"
                      />
                      <!-- Используем ✏️ для неправильных ответов и ✅ для правильных -->
                      <span v-if="gapFeedback[idx]?.[pIdx] === true" class="gap-feedback correct">✅</span>
                      <span v-if="gapFeedback[idx]?.[pIdx] === false" class="gap-feedback wrong">✏️</span>
                    </span>
                  </p>
                </div>
                <div class="gap-actions">
                  <button class="check-gaps-btn" @click="checkAllGaps">
                    Проверить все
                  </button>
                  <button class="reset-gaps-btn" @click="resetGaps">
                    Сбросить
                  </button>
                </div>
                <div v-if="gapScore !== null" class="gap-score">
                  Заполнено: {{ gapScore }}/{{ totalGaps }}
                  <span v-if="gapScore === totalGaps && totalGaps > 0" class="perfect-score">🎉 Отлично!</span>
                </div>
              </div>

              <!-- Письменное описание (свободная форма) -->
              <div v-if="currentTask.type === 'writing'" class="writing-task">
                <p class="task-instruction">✍️ Напиши описание фотографии в свободной форме:</p>
                <textarea
                  v-model="freeWriting"
                  class="free-textarea"
                  placeholder="Напиши здесь своё описание..."
                  rows="6"
                ></textarea>
                <div class="word-counter">Слов: {{ countWords(freeWriting) }}</div>
              </div>

              <!-- Чтение (READING) -->
              <div v-if="currentTask.type === 'reading'" class="reading-task">
                <p class="task-instruction">📖 Прочитай описание фотографии. Обрати внимание на полезные выражения:</p>
                <div class="reading-text">
                  <p>{{ currentPhoto.description || 'Описание отсутствует' }}</p>
                </div>
              </div>
            </div>

            <!-- Кнопка "Далее" -->
            <div class="controls-row">
              <button
                class="next-btn"
                @click="nextPhoto"
                :disabled="isPhotoLoading"
              >
                Следующее фото →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== -->
  <!-- Экран результатов -->
  <!-- ==================== -->
  <div class="results-container" v-if="gameFinished">
    <h2 class="h2">🎉 Great job!</h2>
    <p class="final-message">Ты описал все {{ gamePhotos.length }} фотографий!</p>

    <div class="photo-results">
      <div v-for="(photo, index) in gamePhotos" :key="index" class="result-item">
        <div class="result-polaroid">
          <img :src="photo.picture" :alt="'Фото ' + (index + 1)">
          <div class="result-info">
            <p><strong>Фото №{{ index + 1 }}</strong></p>
            <div class="description-wrapper">
              <p class="photo-description"
                 :class="{ 'blurred': !revealedDescriptions[index] }"
                 @click="toggleDescriptionReveal(index)">
                {{ photo.description || 'Описание отсутствует' }}
              </p>
              <span class="click-hint" v-if="!revealedDescriptions[index]">👆 кликни, чтобы прочитать описание</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="play-again-btn" @click="resetGame">
      Играть снова
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { getAllData } from '../dataForGames/yearGuesserData';

// ==================== //
// ROUTER
// ==================== //
const route = useRoute();
const startFromPhotoId = route.params.id ? parseInt(route.params.id) : null;

// ==================== //
// СОСТОЯНИЕ ИГРЫ
// ==================== //
const currentRound = ref(1); // Текущий раунд (номер фото)
const gameFinished = ref(false); // Закончена ли игра
const backgroundImage = new URL("../assets/images/background1.jpg", import.meta.url).href;

const isPhotoLoading = ref(false); // Идёт ли загрузка фото
const photoLoadError = ref(false); // Ошибка загрузки фото
const revealedDescriptions = ref([]); // Массив для раскрытых описаний на экране результатов

const currentTaskIndex = ref(0); // Индекс текущего задания в карусели

// Данные для заданий
const freeWriting = ref(''); // Текст свободного описания
const gapAnswers = ref([]); // Ответы для fill-in-the-gaps
const gapFeedback = ref([]); // Обратная связь для fill-in-the-gaps (true/false/null)
const gapScore = ref(null); // Количество правильных ответов
const totalGaps = ref(0); // Общее количество пропусков

// Данные для фраз
const displayedPhrases = ref([]); // Фразы, которые сейчас показаны
const usedPhrases = ref(new Set()); // Множество использованных фраз (с галочками)
const allPhrasesShown = ref(false); // Показаны ли все фразы
const INITIAL_PHRASES_COUNT = 6; // Сколько фраз показывать изначально

// ==================== //
// ФРАЗЫ ДЛЯ ЗАГРУЗКИ
// ==================== //
const loadingPhrases = [
  '🖼️ Загружаем фотографию...',
  '📸 Достаём фото из архива...',
  '🖌️ Готовим картинку для описания...',
  '✨ Почти готово...',
];

const currentLoadingPhrase = ref(loadingPhrases[0]);
const loadingStartTime = ref(0);
const MIN_LOADING_TIME = 1000; // Минимальное время загрузки в мс

// ==================== //
// ВСЕ ПОЛЕЗНЫЕ ФРАЗЫ ДЛЯ ОПИСАНИЯ
// ==================== //
const ALL_USEFUL_PHRASES = [
  'In this picture I see...',
  'There is... in the photo',
  'There are... in this picture',
  'The photo shows...',
  'At first glance, I notice...',
  'I (don`t) like this photo because...',
  'The atmosphere is...',
  'It reminds me of...',
  'The colours are...',
  'It looks like...',
  'Maybe it\'s...',
  'I see a ...',
  'In the middle of the photo, there is...',
  'On the left (right) I see...',
  'I can`t describe this photo because...',
  'This image makes me feel...',
  'This photo is (sad, funny, usual, legendary)',
  'The main focus of the photo is...',
  'The background has...',
  'The photographer wanted to show...',
  'In this photo = this photo has...',
  'Nothing unusual is here.',
  'In the corners of this photo we can notice...',
];

// ==================== //
// ЗАДАНИЯ (КАРУСЕЛЬ) - НОВАЯ ОЧЕРЕДНОСТЬ
// ==================== //
const tasks = [
  {
    id: 'speaking',
    type: 'speaking',
    title: 'Устно',
    icon: '🗣️'
  },
  {
    id: 'example',
    type: 'example',
    title: 'Пример описания',
    icon: '💡'
  },
  {
    id: 'fill-gaps',
    type: 'fill-gaps',
    title: 'Заполни пропуски',
    icon: '📝'
  },
  {
    id: 'writing',
    type: 'writing',
    title: 'Письменно',
    icon: '✍️'
  },
  {
    id: 'reading',
    type: 'reading',
    title: 'Чтение',
    icon: '📖'
  }
];

// ==================== //
// ДАННЫЕ
// ==================== //
const allPhotos = ref(getAllData()); // Все фото из файла с данными

/**
 * Формируем массив из 5 фотографий для игры
 * Если передан ID в URL, то начинаем с этой фотографии
 */
const gamePhotos = computed(() => {
  if (startFromPhotoId) {
    const startIndex = allPhotos.value.findIndex(p => p.id === startFromPhotoId);
    if (startIndex !== -1) {
      const remaining = allPhotos.value.filter((_, i) => i !== startIndex);
      const shuffledRemaining = [...remaining].sort(() => Math.random() - 0.5);
      const selected = shuffledRemaining.slice(0, 4);
      return [allPhotos.value[startIndex], ...selected];
    }
  }
  return allPhotos.value.slice(0, 5);
});

/**
 * Текущая фотография (по номеру раунда)
 */
const currentPhoto = computed(() => {
  return gamePhotos.value[currentRound.value - 1];
});

/**
 * Текущее задание (по индексу в карусели)
 */
const currentTask = computed(() => {
  return tasks[currentTaskIndex.value] || tasks[0];
});

// ==================== //
// ШАБЛОНЫ ДЛЯ FILL-IN-THE-GAPS
// ==================== //

/**
 * Создаёт шаблон с пропусками из описания фотографии
 * Удаляет каждое 4-е слово (кроме первого и последнего)
 */
const getGapTemplate = (photo) => {
  const desc = photo.description || 'This is a beautiful photo from the past. It captures a moment that feels timeless and full of emotion.';
  const words = desc.split(' ');

  // Если мало слов, создаём базовый шаблон
  if (words.length < 10) {
    return [
      [
        { type: 'text', content: 'This photo shows ' },
        { type: 'gap', content: '' },
        { type: 'text', content: ' in a ' },
        { type: 'gap', content: '' },
        { type: 'text', content: ' setting.' }
      ]
    ];
  }

  // Создаём шаблон с пропусками (каждое 4-е слово)
  const template = [];
  let currentLine = [];
  let wordIndex = 0;
  let gapCount = 0;

  while (wordIndex < words.length) {
    // Пропускаем каждое 4-е слово (начиная со 2-го), максимум 5 пропусков
    const isGap = (wordIndex % 4 === 2 && wordIndex > 1 && wordIndex < words.length - 2 && gapCount < 5);

    if (isGap) {
      currentLine.push({ type: 'gap', content: words[wordIndex] });
      gapCount++;
    } else {
      currentLine.push({ type: 'text', content: words[wordIndex] + ' ' });
    }
    wordIndex++;

    // Перенос строки каждые 10-12 слов
    if (wordIndex % 10 === 0 || wordIndex >= words.length) {
      template.push(currentLine);
      currentLine = [];
    }
  }

  if (currentLine.length > 0) {
    template.push(currentLine);
  }

  return template;
};

/**
 * Вычисляем шаблон для текущего фото и инициализируем ответы
 */
const currentGapTemplate = computed(() => {
  const template = getGapTemplate(currentPhoto.value);

  // Инициализируем ответы и фидбек, если они ещё не созданы
  if (gapAnswers.value.length !== template.length) {
    gapAnswers.value = template.map(line =>
      line.map(part => part.type === 'gap' ? '' : null)
    );
    gapFeedback.value = template.map(line =>
      line.map(() => null)
    );
  }

  totalGaps.value = template.reduce((sum, line) =>
    sum + line.filter(part => part.type === 'gap').length, 0
  );

  return template;
});

// ==================== //
// МЕТОДЫ ДЛЯ ФРАЗ
// ==================== //

/**
 * Перемешивает массив (алгоритм Фишера-Йетса)
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Инициализирует фразы для текущей фотографии
 * Показывает 6 случайных фраз
 */
const initPhrases = () => {
  const shuffled = shuffleArray(ALL_USEFUL_PHRASES);
  displayedPhrases.value = shuffled.slice(0, INITIAL_PHRASES_COUNT);
  usedPhrases.value = new Set();
  allPhrasesShown.value = false;
};

/**
 * Загружает ещё 3 фразы (если они есть)
 */
const loadMorePhrases = () => {
  const currentSet = new Set(displayedPhrases.value);
  const remaining = ALL_USEFUL_PHRASES.filter(p => !currentSet.has(p));

  if (remaining.length > 0) {
    const newPhrases = remaining.slice(0, 3);
    displayedPhrases.value = [...displayedPhrases.value, ...newPhrases];

    if (displayedPhrases.value.length >= ALL_USEFUL_PHRASES.length) {
      allPhrasesShown.value = true;
    }
  } else {
    allPhrasesShown.value = true;
  }
};

/**
 * Переключает состояние фразы (использована/не использована)
 */
const togglePhrase = (phrase) => {
  if (usedPhrases.value.has(phrase)) {
    usedPhrases.value.delete(phrase);
  } else {
    usedPhrases.value.add(phrase);
  }
};

/**
 * Проверяет, использована ли фраза
 */
const isPhraseUsed = (phrase) => {
  return usedPhrases.value.has(phrase);
};

// ==================== //
// МЕТОДЫ ДЛЯ GAP-FILL
// ==================== //

/**
 * Проверяет ответ в конкретном пропуске
 * Сравнивает без учёта регистра и пунктуации
 */
const checkGapAnswer = (lineIdx, partIdx) => {
  const answer = gapAnswers.value[lineIdx]?.[partIdx];
  const correctWord = currentGapTemplate.value[lineIdx]?.[partIdx]?.content;

  // Если ответ пустой, сбрасываем фидбек
  if (!answer || !answer.trim()) {
    gapFeedback.value[lineIdx][partIdx] = null;
    return;
  }

  // Нормализуем строки для сравнения
  const normalizedAnswer = answer.trim().toLowerCase().replace(/[.,!?;:]/g, '');
  const normalizedCorrect = correctWord?.toLowerCase().replace(/[.,!?;:]/g, '');

  if (normalizedAnswer === normalizedCorrect) {
    gapFeedback.value[lineIdx][partIdx] = true; // Правильно ✅
  } else {
    gapFeedback.value[lineIdx][partIdx] = false; // Неправильно ✏️
  }
};

/**
 * Проверяет все пропуски и подсчитывает количество правильных ответов
 */
const checkAllGaps = () => {
  let filled = 0;
  let total = 0;

  // Проходим по всем пропускам и считаем правильные
  gapAnswers.value.forEach((line, lineIdx) => {
    line.forEach((answer, partIdx) => {
      // Проверяем только те пропуски, которые уже были проверены
      if (gapFeedback.value[lineIdx]?.[partIdx] !== undefined) {
        const isCorrect = gapFeedback.value[lineIdx][partIdx] === true;
        if (isCorrect) {
          filled++;
        }
        total++;
      }
    });
  });

  gapScore.value = filled;
  totalGaps.value = total;
};

/**
 * Сбрасывает все ответы и фидбек в пропусках
 */
const resetGaps = () => {
  gapAnswers.value = currentGapTemplate.value.map(line =>
    line.map(part => part.type === 'gap' ? '' : null)
  );
  gapFeedback.value = currentGapTemplate.value.map(line =>
    line.map(() => null)
  );
  gapScore.value = null;
};

// ==================== //
// ОСНОВНЫЕ МЕТОДЫ
// ==================== //

/**
 * Обновляет фразу загрузки (случайная из списка)
 */
const updateLoadingPhrase = () => {
  const randomIndex = Math.floor(Math.random() * loadingPhrases.length);
  currentLoadingPhrase.value = loadingPhrases[randomIndex];
};

/**
 * Обработчик успешной загрузки фото
 * Ждёт минимальное время для плавности
 */
const handlePhotoLoad = () => {
  const elapsed = Date.now() - loadingStartTime.value;
  const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

  setTimeout(() => {
    isPhotoLoading.value = false;
    photoLoadError.value = false;
  }, remaining);
};

/**
 * Обработчик ошибки загрузки фото
 */
const handlePhotoError = () => {
  isPhotoLoading.value = false;
  photoLoadError.value = true;
};

/**
 * Подсчёт слов в тексте
 */
const countWords = (text) => {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
};

/**
 * Копирование текста в буфер обмена
 */
const copyText = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    console.log('📋 Скопировано:', text);
  });
};

// ==================== //
// БЕСКОНЕЧНАЯ КАРУСЕЛЬ ЗАДАНИЙ
// ==================== //

/**
 * Переход к предыдущему заданию (по кругу)
 */
const prevTask = () => {
  if (currentTaskIndex.value === 0) {
    // Если на первом задании — переходим на последнее
    currentTaskIndex.value = tasks.length - 1;
  } else {
    currentTaskIndex.value--;
  }
};

/**
 * Переход к следующему заданию (по кругу)
 */
const nextTask = () => {
  if (currentTaskIndex.value === tasks.length - 1) {
    // Если на последнем задании — переходим на первое
    currentTaskIndex.value = 0;
  } else {
    currentTaskIndex.value++;
  }
};

// ==================== //
// НАВИГАЦИЯ ПО ФОТО
// ==================== //

/**
 * Переход к следующей фотографии
 */
const nextPhoto = () => {
  if (currentRound.value < gamePhotos.value.length) {
    currentRound.value++;

    // Обновляем состояние загрузки
    updateLoadingPhrase();
    loadingStartTime.value = Date.now();
    isPhotoLoading.value = true;

    // Сбрасываем состояния заданий для новой фотографии
    freeWriting.value = '';
    gapAnswers.value = [];
    gapFeedback.value = [];
    gapScore.value = null;
    currentTaskIndex.value = 0; // Возвращаемся к первому заданию
    initPhrases(); // Сброс фраз для новой фотки
  } else {
    // Игра закончена — показываем результаты
    gameFinished.value = true;
    revealedDescriptions.value = gamePhotos.value.map(() => false);
  }
};

/**
 * Переключение видимости описания на экране результатов
 */
const toggleDescriptionReveal = (index) => {
  revealedDescriptions.value[index] = !revealedDescriptions.value[index];
};

/**
 * Сброс игры (играть снова)
 */
const resetGame = () => {
  currentRound.value = 1;
  gameFinished.value = false;
  revealedDescriptions.value = [];
  currentTaskIndex.value = 0;
  freeWriting.value = '';
  gapAnswers.value = [];
  gapFeedback.value = [];
  gapScore.value = null;

  // Перемешиваем все фото заново
  const allData = getAllData();
  allPhotos.value = allData.sort(() => Math.random() - 0.5);

  // Обновляем состояние загрузки
  updateLoadingPhrase();
  loadingStartTime.value = Date.now();
  isPhotoLoading.value = true;
  photoLoadError.value = false;

  initPhrases();
};

// ==================== //
// ХУКИ ЖИЗНЕННОГО ЦИКЛА
// ==================== //

onMounted(() => {
  // Перемешиваем фото при старте
  const allData = getAllData();
  allPhotos.value = allData.sort(() => Math.random() - 0.5);

  // Начинаем загрузку первого фото
  updateLoadingPhrase();
  loadingStartTime.value = Date.now();
  isPhotoLoading.value = true;

  // Инициализируем фразы
  initPhrases();
});

onBeforeUnmount(() => {
  // Очищаем при необходимости
});
</script>

<style scoped>
/* ==================== */
/* ОСНОВНЫЕ СТИЛИ       */
/* ==================== */

.backgroundImg {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  object-fit: cover;
  z-index: -1;
  filter: brightness(0.7) blur(4px);
  transform: scale(1.02);
}

.game-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Courier New', monospace;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.detective-board {
  background-color: #e8e8e8;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #d0d0d0;
  position: relative;
}

/* ==================== */
/* СТИЛИ POLAROID       */
/* ==================== */
.polaroid {
  background: white;
  padding: 15px 15px 30px 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: rotate(-1deg);
  margin: 0 auto 30px;
  width: fit-content;
  max-width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.polaroid:before {
  content: '';
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  background: #f5f5f5;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}

/* ==================== */
/* КОНТЕНТ POLAROID     */
/* ==================== */
.polaroid-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

/* ==================== */
/* ОБЁРТКА ДЛЯ ФОТО     */
/* ==================== */
.photo-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
}

.photo {
  width: auto;
  max-height: 450px;
  max-width: 100%;
  display: block;
  border: 1px solid #ddd;
  object-fit: contain;
}

/* ==================== */
/* КОНТЕЙНЕР ЗАДАНИЙ    */
/* ==================== */
.task-container {
  flex: 1;
  width: 100%;
  min-width: 280px;
  padding: 10px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

/* ==================== */
/* НАВИГАЦИЯ КАРУСЕЛИ  */
/* ==================== */
.task-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 12px;
  background: #fff;
  border-radius: 6px;
  border-bottom: 2px solid #5D2906;
  margin-bottom: 15px;
}

.nav-arrow {
  background: #5D2906;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-arrow:hover {
  background: #8B4513;
  transform: scale(1.05);
}

.nav-arrow:active {
  transform: scale(0.95);
}

.task-title {
  font-size: 16px;
  font-weight: bold;
  color: #5D2906;
}

/* ==================== */
/* КОНТЕНТ ЗАДАНИЙ      */
/* ==================== */
.task-content {
  padding: 10px 0;
  min-height: 200px;
}

.task-instruction {
  font-size: 14px;
  color: #555;
  margin-bottom: 12px;
  line-height: 1.6;
}

/* ==================== */
/* ЗАДАНИЕ: SPEAKING    */
/* ==================== */
.useful-phrases {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 12px 0;
}

.phrase-chip {
  position: relative;
  background: #e8f0fe;
  border: 2px solid #b6c8d9;
  border-radius: 20px;
  padding: 8px 16px;
  padding-right: 30px;
  font-size: 13px;
  color: #1a3a5c;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Courier New', monospace;
}

.phrase-chip:hover {
  transform: scale(1.03);
  background: #d0e0f0;
}

.phrase-chip.used {
  background: #4CAF50;
  border-color: #388E3C;
  color: white;
}

.phrase-chip .check-mark {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #2E7D32;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.show-phrases-btn {
  background: #5D2906;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Courier New', monospace;
  margin: 8px 0;
}

.show-phrases-btn:hover:not(:disabled) {
  background: #8B4513;
  transform: scale(1.02);
}

.show-phrases-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ==================== */
/* ЗАДАНИЕ: EXAMPLE     */
/* ==================== */
.example-answer {
  background: #fff;
  border-left: 4px solid #5D2906;
  padding: 12px 16px;
  border-radius: 4px;
  margin: 8px 0;
}

.example-answer p {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin: 0;
}

/* ==================== */
/* ЗАДАНИЕ: FILL GAPS   */
/* ==================== */
.gap-template {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 16px;
  margin: 8px 0;
}

.gap-line {
  margin: 6px 0;
  font-size: 14px;
  line-height: 2.4;
  color: #333;
}

.gap-input {
  border: none;
  border-bottom: 2px solid #5D2906;
  background: transparent;
  font-size: 14px;
  font-family: 'Courier New', monospace;
  min-width: 80px;
  padding: 2px 6px;
  margin: 0 2px;
  transition: all 0.3s ease;
}

.gap-input:focus {
  outline: none;
  border-bottom-color: #8B4513;
  background: #fafafa;
}

.gap-input::placeholder {
  color: #bbb;
  font-size: 12px;
}

/* Правильный ответ — зелёный */
.gap-input.gap-correct {
  border-bottom-color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
}

/* Неправильный ответ — жёлтый (вместо красного) */
.gap-input.gap-wrong {
  border-bottom-color: #FFC107;
  background: rgba(255, 193, 7, 0.15);
}

.gap-feedback {
  margin-left: 4px;
  font-size: 16px;
}

.gap-feedback.correct {
  color: #4CAF50;
}

.gap-feedback.wrong {
  color: #FFC107;
}

.gap-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.check-gaps-btn {
  background: #5D2906;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  font-family: 'Courier New', monospace;
}

.check-gaps-btn:hover {
  background: #8B4513;
}

.reset-gaps-btn {
  background: #666;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  font-family: 'Courier New', monospace;
}

.reset-gaps-btn:hover {
  background: #888;
}

.gap-score {
  font-size: 14px;
  font-weight: bold;
  color: #5D2906;
  margin-top: 10px;
}

.perfect-score {
  color: #4CAF50;
  margin-left: 8px;
}

/* ==================== */
/* ЗАДАНИЕ: WRITING     */
/* ==================== */
.free-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Courier New', monospace;
  resize: vertical;
  min-height: 120px;
  background: #fff;
}

.free-textarea:focus {
  outline: none;
  border-color: #5D2906;
  box-shadow: 0 0 0 2px rgba(93, 41, 6, 0.1);
}

.word-counter {
  font-size: 12px;
  color: #888;
  text-align: right;
  margin-top: 4px;
}

/* ==================== */
/* ЗАДАНИЕ: READING     */
/* ==================== */
.reading-text {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 16px;
  margin: 8px 0;
  line-height: 1.8;
  font-size: 14px;
  color: #333;
}

.reading-text p {
  margin: 0;
}

/* ==================== */
/* УПРАВЛЕНИЕ           */
/* ==================== */
.controls-row {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.next-btn {
  display: block;
  padding: 10px 30px;
  background: #5D2906;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
  font-family: 'Courier New', monospace;
}

.next-btn:hover:not(:disabled) {
  background: #8B4513;
}

.next-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

/* ==================== */
/* ПЛЕЙСХОЛДЕР ЗАГРУЗКИ */
/* ==================== */
.photo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 450px;
  width: 100%;
  min-width: 300px;
  background: linear-gradient(135deg, #2d3436, #636e72);
  border-radius: 4px;
  padding: 40px;
  box-sizing: border-box;
}

.loader-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #fdcb6e;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loader-text {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Courier New', monospace;
  font-size: 16px;
  text-align: center;
  animation: pulseText 1.5s ease-in-out infinite;
}

@keyframes pulseText {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* ==================== */
/* ОШИБКА ЗАГРУЗКИ      */
/* ==================== */
.photo-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  max-height: 500px;
  width: 100%;
  background: #2d3436;
  border-radius: 4px;
  padding: 40px;
  box-sizing: border-box;
  color: #ff6b6b;
  font-family: 'Courier New', monospace;
  font-size: 18px;
}

.photo-error span {
  font-size: 48px;
  margin-bottom: 12px;
}

/* ==================== */
/* ЭКРАН РЕЗУЛЬТАТОВ   */
/* ==================== */
.results-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Courier New', monospace;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.h2 {
  font-size: 50px;
  color: palevioletred;
  font-family: Special_f1;
}

.final-message {
  font-size: 20px;
  color: #5D2906;
  margin: 20px 0;
}

.photo-results {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 30px;
}

.result-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.result-polaroid {
  display: flex;
  gap: 20px;
  align-items: center;
  text-align: left;
}

.result-polaroid img {
  max-width: 200px;
  border: 1px solid #ddd;
}

.photo-description {
  font-style: italic;
  font-size: 15px;
  margin-top: 10px;
  color: #000000;
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 4px;
  position: relative;
}

.photo-description.blurred {
  filter: blur(5px);
  user-select: none;
  background: rgba(0, 0, 0, 0.03);
  padding: 4px 8px;
  border-radius: 4px;
}

.photo-description.blurred:hover {
  background: rgba(0, 0, 0, 0.06);
}

.photo-description:not(.blurred) {
  filter: blur(0);
}

.click-hint {
  font-size: 15px;
  color: #999;
  display: block;
  margin-top: 4px;
  font-style: normal;
}

.play-again-btn {
  margin-top: 30px;
  padding: 12px 30px;
  background: #5D2906;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s;
  font-family: 'Courier New', monospace;
}

.play-again-btn:hover {
  background: #8B4513;
}

/* ==================== */
/* АДАПТАЦИЯ ДЛЯ ГОРИЗОНТАЛЬНЫХ ЭКРАНОВ */
/* ==================== */
@media (orientation: landscape) and (max-height: 900px),
(min-width: 768px) and (max-width: 1200px) and (orientation: landscape) {
  .polaroid {
    flex-direction: row;
    align-items: stretch;
    padding: 15px;
    gap: 20px;
    width: 95%;
    max-width: 95%;
    transform: rotate(0deg);
  }

  .polaroid-content {
    flex-direction: row;
    align-items: stretch;
    gap: 20px;
  }

  .photo-wrapper {
    flex: 0 0 auto;
    max-width: 50%;
  }

  .photo-wrapper .photo {
    max-height: 500px;
    max-width: 100%;
    height: auto;
  }

  .task-container {
    flex: 1;
    min-width: 300px;
    padding: 15px;
  }

  .photo-placeholder {
    height: 400px;
    width: 100%;
    min-width: 200px;
  }
}

/* ==================== */
/* АДАПТАЦИЯ ДЛЯ МОБИЛЬНЫХ */
/* ==================== */
@media (max-width: 768px) {
  .game-container {
    padding: 0;
  }

  .polaroid {
    padding: 10px 10px 20px 10px;
  }

  .polaroid::before {
    display: none;
  }

  .polaroid-content {
    flex-direction: column;
  }

  .photo-wrapper .photo {
    max-height: 280px;
  }

  .photo-placeholder {
    height: 250px;
    width: 100%;
    min-width: auto;
  }

  .task-container {
    min-width: auto;
    padding: 8px;
  }

  .task-title {
    font-size: 14px;
  }

  .nav-arrow {
    width: 28px;
    height: 28px;
    font-size: 16px;
  }

  .free-textarea {
    min-height: 80px;
    font-size: 13px;
  }

  .phrase-chip {
    font-size: 12px;
    padding: 6px 14px;
    padding-right: 26px;
  }

  .phrase-chip .check-mark {
    width: 18px;
    height: 18px;
    font-size: 10px;
    top: -6px;
    right: -6px;
  }

  .result-polaroid {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .result-polaroid img {
    max-width: 150px;
  }

  .h2 {
    font-size: 28px;
  }

  .final-message {
    font-size: 16px;
  }

  .gap-input {
    min-width: 60px;
    font-size: 13px;
  }

  .gap-line {
    font-size: 13px;
    line-height: 2.2;
  }
}
</style>
