<template>
  <!-- ==================== -->
  <!-- Основной экран игры -->
  <!-- ==================== -->
  <div class="app-wrapper">
    <!-- Градиентный фон вместо картинки -->
    <div class="gradient-bg"></div>

    <div class="game-container" v-if="!gameFinished">
      <!-- Заголовок -->
      <div class="game-header">
        <h1 class="game-title">📸 Describe a pic - Опиши изображение</h1>
        <div class="progress-indicator">
          <span class="progress-text">{{ currentRound }}/{{ gamePhotos.length }}</span>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${(currentRound / gamePhotos.length) * 100}%` }"></div>
          </div>
        </div>
      </div>

      <!-- Основной контент -->
      <div class="main-content">
        <!-- Фото -->
        <div class="photo-section">
          <div v-if="isPhotoLoading" class="photo-placeholder-modern">
            <div class="loader-ring"></div>
            <p class="loader-text-modern">{{ currentLoadingPhrase }}</p>
          </div>
          <img
            v-show="!isPhotoLoading && !photoLoadError"
            :src="currentPhoto.picture"
            alt="Фото для описания"
            class="photo-modern"
            @load="handlePhotoLoad"
            @error="handlePhotoError"
          >
          <div v-if="photoLoadError" class="photo-error-modern">
            <span>😕</span>
            <p>Не удалось загрузить фото</p>
          </div>
          <div class="photo-badge">
            <span>📷</span>
          </div>
        </div>

        <!-- Задание -->
        <div class="task-section">
          <!-- Навигация по заданиям -->
          <div class="task-nav-modern">
            <button class="nav-btn" @click="prevTask">
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
            <div class="task-indicator">
              <span class="task-icon">{{ currentTask.icon }}</span>
              <span class="task-name">{{ currentTask.title }}</span>
            </div>
            <button class="nav-btn" @click="nextTask">
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            </button>
          </div>

          <!-- Контент задания -->
          <div class="task-content-modern">
            <!-- Speaking -->
            <div v-if="currentTask.type === 'speaking'">
              <p class="instruction-modern">👇 Нажми на фразу и вслух продолжи её:</p>
              <div class="phrases-grid">
                <button
                  v-for="(phrase, idx) in displayedPhrases"
                  :key="idx"
                  class="phrase-chip-modern"
                  :class="{ 'used': isPhraseUsed(phrase) }"
                  @click="togglePhrase(phrase)"
                >
                  {{ phrase }}
                  <span v-if="isPhraseUsed(phrase)" class="check-mark-modern">✓</span>
                </button>
              </div>
              <button class="more-btn" @click="loadMorePhrases" :disabled="allPhrasesShown">
                {{ allPhrasesShown ? '✨ Все показаны' : '➕ Ещё фразы' }}
              </button>
            </div>

            <!-- Example -->
            <div v-if="currentTask.type === 'example'">
              <p class="instruction-modern">💡 Вслух прочитай пример описания фото:</p>
              <div class="example-card">
                <p>{{ currentPhoto.description || 'Описание отсутствует' }}</p>
              </div>
<!--              <button class="action-btn" @click="copyText(currentPhoto.description || 'Описание отсутствует')">-->
<!--                📋 Копировать-->
<!--              </button>-->
            </div>

            <!-- Fill Gaps -->
            <div v-if="currentTask.type === 'fill-gaps'">
              <p class="instruction-modern">📝 Впиши пропущенные слова:</p>
              <div class="gap-card">
                <p v-for="(line, idx) in currentGapTemplate" :key="idx" class="gap-line-modern">
                  <span v-for="(part, pIdx) in line" :key="pIdx">
                    <span v-if="part.type === 'text'">{{ part.content }}</span>
                    <input
                      v-else-if="part.type === 'gap'"
                      v-model="gapAnswers[idx][pIdx]"
                      class="gap-input-modern"

                      :class="{
                        'gap-correct-modern': gapFeedback[idx]?.[pIdx] === true,
                        'gap-wrong-modern': gapFeedback[idx]?.[pIdx] === false
                      }"

                      :placeholder="'________'"
                      @input="checkGapAnswer(idx, pIdx)"
                      :disabled="gapFeedback[idx]?.[pIdx] === true"
                    />
                    <span v-if="gapFeedback[idx]?.[pIdx] === true" class="feedback-icon correct">✅</span>
                    <span v-if="gapFeedback[idx]?.[pIdx] === false" class="feedback-icon wrong">✏️</span>
                  </span>
                </p>
              </div>
              <div class="gap-actions-modern">
                <button class="check-btn" @click="checkAllGaps">Проверить</button>
                <button class="reset-btn" @click="resetGaps">Сбросить</button>
              </div>
              <div v-if="gapScore !== null" class="gap-score-modern">
                {{ gapScore }}/{{ totalGaps }}
                <span v-if="gapScore === totalGaps && totalGaps > 0" class="perfect">🎉</span>
              </div>
            </div>

            <!-- Writing -->
            <div v-if="currentTask.type === 'writing'">
              <p class="instruction-modern">✍️ Напиши своё описание:</p>
              <textarea
                v-model="freeWriting"
                class="textarea-modern"
                placeholder="Напиши здесь..."
                rows="5"
              ></textarea>
              <div class="word-counter-modern">Слов: {{ countWords(freeWriting) }}</div>
            </div>

            <!-- Reading -->
            <div v-if="currentTask.type === 'reading'">
              <p class="instruction-modern">📖 Прочитай описание:</p>
              <div class="reading-card">
                <p>{{ currentPhoto.description || 'Описание отсутствует' }}</p>
              </div>
            </div>
          </div>

          <!-- Кнопка "Далее" -->
          <button class="next-btn-modern" @click="nextPhoto" :disabled="isPhotoLoading">
            Дальше →
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== -->
    <!-- Экран результатов -->
    <!-- ==================== -->
    <div class="results-modern" v-if="gameFinished">
      <div class="results-card">
        <div class="results-icon">🎉</div>
        <h2 class="results-title">Great job!</h2>
        <p class="results-subtitle">Ты описал все {{ gamePhotos.length }} фотографий!</p>

        <div class="results-gallery">
          <div v-for="(photo, index) in gamePhotos" :key="index" class="result-card-modern">
            <img :src="photo.picture" :alt="'Фото ' + (index + 1)">
            <div class="result-overlay">
              <span class="result-number">#{{ index + 1 }}</span>
              <p class="result-desc" :class="{ 'blurred': !revealedDescriptions[index] }" @click="toggleDescriptionReveal(index)">
                {{ photo.description || 'Нет описания' }}
              </p>
              <span class="hint-text" v-if="!revealedDescriptions[index]">👆 кликни</span>
            </div>
          </div>
        </div>

        <button class="play-again-modern" @click="resetGame">
          🔄 Играть снова
        </button>
      </div>
    </div>
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
const currentRound = ref(1);
const gameFinished = ref(false);

const isPhotoLoading = ref(false);
const photoLoadError = ref(false);
const revealedDescriptions = ref([]);

const currentTaskIndex = ref(0);

const freeWriting = ref('');
const gapAnswers = ref([]);
const gapFeedback = ref([]);
const gapScore = ref(null);
const totalGaps = ref(0);

const displayedPhrases = ref([]);
const usedPhrases = ref(new Set());
const allPhrasesShown = ref(false);
const INITIAL_PHRASES_COUNT = 6;

// ==================== //
// ФРАЗЫ ДЛЯ ЗАГРУЗКИ
// ==================== //
const loadingPhrases = [
  '🖼️ Загружаем...',
  '📸 Достаём фото...',
  '🖌️ Готовим...',
  '✨ Почти готово...',
];

const currentLoadingPhrase = ref(loadingPhrases[0]);
const loadingStartTime = ref(0);
const MIN_LOADING_TIME = 800;

// ==================== //
// ВСЕ ФРАЗЫ
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
  'What`s the English for в углу?',
];

// ==================== //
// ЗАДАНИЯ
// ==================== //
const tasks = [
  { id: 'speaking', type: 'speaking', title: 'Опачки фоточка...', icon: '🗣️' },
  { id: 'example', type: 'example', title: 'Произношение', icon: '💡' },
  { id: 'fill-gaps', type: 'fill-gaps', title: 'Пропуски', icon: '📝' },
  { id: 'writing', type: 'writing', title: 'Письменно', icon: '✍️' },
  { id: 'reading', type: 'reading', title: 'Чтение', icon: '📖' }
];

// ==================== //
// ДАННЫЕ
// ==================== //
const allPhotos = ref(getAllData());

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

const currentPhoto = computed(() => {
  return gamePhotos.value[currentRound.value - 1];
});

const currentTask = computed(() => {
  return tasks[currentTaskIndex.value] || tasks[0];
});

// ==================== //
// GAP TEMPLATE
// ==================== //
const getGapTemplate = (photo) => {
  const desc = photo.description || 'This is a beautiful photo from the past. It captures a moment that feels timeless and full of emotion.';
  const words = desc.split(' ');

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

  const template = [];
  let currentLine = [];
  let wordIndex = 0;
  let gapCount = 0;

  while (wordIndex < words.length) {
    const isGap = (wordIndex % 4 === 2 && wordIndex > 1 && wordIndex < words.length - 2 && gapCount < 5);

    if (isGap) {
      currentLine.push({ type: 'gap', content: words[wordIndex] });
      gapCount++;
    } else {
      currentLine.push({ type: 'text', content: words[wordIndex] + ' ' });
    }
    wordIndex++;

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

const currentGapTemplate = computed(() => {
  const template = getGapTemplate(currentPhoto.value);

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
// МЕТОДЫ
// ==================== //
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const initPhrases = () => {
  const shuffled = shuffleArray(ALL_USEFUL_PHRASES);
  displayedPhrases.value = shuffled.slice(0, INITIAL_PHRASES_COUNT);
  usedPhrases.value = new Set();
  allPhrasesShown.value = false;
};

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

const togglePhrase = (phrase) => {
  if (usedPhrases.value.has(phrase)) {
    usedPhrases.value.delete(phrase);
  } else {
    usedPhrases.value.add(phrase);
  }
};

const isPhraseUsed = (phrase) => {
  return usedPhrases.value.has(phrase);
};

const checkGapAnswer = (lineIdx, partIdx) => {
  const answer = gapAnswers.value[lineIdx]?.[partIdx];
  const correctWord = currentGapTemplate.value[lineIdx]?.[partIdx]?.content;

  if (!answer || !answer.trim()) {
    gapFeedback.value[lineIdx][partIdx] = null;
    return;
  }

  const normalizedAnswer = answer.trim().toLowerCase().replace(/[.,!?;:]/g, '');
  const normalizedCorrect = correctWord?.toLowerCase().replace(/[.,!?;:]/g, '');

  if (normalizedAnswer === normalizedCorrect) {
    gapFeedback.value[lineIdx][partIdx] = true;
  } else {
    gapFeedback.value[lineIdx][partIdx] = false;
  }
};

const checkAllGaps = () => {
  let filled = 0;
  let total = 0;

  gapAnswers.value.forEach((line, lineIdx) => {
    line.forEach((answer, partIdx) => {
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

const resetGaps = () => {
  gapAnswers.value = currentGapTemplate.value.map(line =>
    line.map(part => part.type === 'gap' ? '' : null)
  );
  gapFeedback.value = currentGapTemplate.value.map(line =>
    line.map(() => null)
  );
  gapScore.value = null;
};

const updateLoadingPhrase = () => {
  const randomIndex = Math.floor(Math.random() * loadingPhrases.length);
  currentLoadingPhrase.value = loadingPhrases[randomIndex];
};

const handlePhotoLoad = () => {
  const elapsed = Date.now() - loadingStartTime.value;
  const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

  setTimeout(() => {
    isPhotoLoading.value = false;
    photoLoadError.value = false;
  }, remaining);
};

const handlePhotoError = () => {
  isPhotoLoading.value = false;
  photoLoadError.value = true;
};

const countWords = (text) => {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
};

const copyText = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    console.log('📋 Скопировано');
  });
};

const prevTask = () => {
  currentTaskIndex.value = currentTaskIndex.value === 0 ? tasks.length - 1 : currentTaskIndex.value - 1;
};

const nextTask = () => {
  currentTaskIndex.value = currentTaskIndex.value === tasks.length - 1 ? 0 : currentTaskIndex.value + 1;
};

const nextPhoto = () => {
  if (currentRound.value < gamePhotos.value.length) {
    currentRound.value++;
    updateLoadingPhrase();
    loadingStartTime.value = Date.now();
    isPhotoLoading.value = true;
    freeWriting.value = '';
    gapAnswers.value = [];
    gapFeedback.value = [];
    gapScore.value = null;
    currentTaskIndex.value = 0;
    initPhrases();
  } else {
    gameFinished.value = true;
    revealedDescriptions.value = gamePhotos.value.map(() => false);
  }
};

const toggleDescriptionReveal = (index) => {
  revealedDescriptions.value[index] = !revealedDescriptions.value[index];
};

const resetGame = () => {
  currentRound.value = 1;
  gameFinished.value = false;
  revealedDescriptions.value = [];
  currentTaskIndex.value = 0;
  freeWriting.value = '';
  gapAnswers.value = [];
  gapFeedback.value = [];
  gapScore.value = null;

  const allData = getAllData();
  allPhotos.value = allData.sort(() => Math.random() - 0.5);

  updateLoadingPhrase();
  loadingStartTime.value = Date.now();
  isPhotoLoading.value = true;
  photoLoadError.value = false;

  initPhrases();
};

// ==================== //
// ХУКИ
// ==================== //
onMounted(() => {
  const allData = getAllData();
  allPhotos.value = allData.sort(() => Math.random() - 0.5);
  updateLoadingPhrase();
  loadingStartTime.value = Date.now();
  isPhotoLoading.value = true;
  initPhrases();
});
</script>

<style scoped>
/* ==================== */
/* ГЛОБАЛЬНЫЕ СТИЛИ     */
/* ==================== */
* {
  box-sizing: border-box;
}

.app-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
}

.gradient-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(145deg, #0f0c29, #302b63, #24243e);
  z-index: -1;
}

/* ==================== */
/* ОСНОВНОЙ КОНТЕЙНЕР   */
/* ==================== */
.game-container {
  width: 100%;
  max-width: 1100px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
}

/* ==================== */
/* ЗАГОЛОВОК            */
/* ==================== */
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.game-title {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin: 0;
  background: linear-gradient(135deg, #f7971e, #ffd200);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.progress-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 500;
}

.progress-bar {
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f7971e, #ffd200);
  border-radius: 4px;
  transition: width 0.4s ease;
}

/* ==================== */
/* ОСНОВНОЙ КОНТЕНТ     */
/* ==================== */
.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* ==================== */
/* СЕКЦИЯ С ФОТО        */
/* ==================== */
.photo-section {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-modern {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.photo-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 14px;
  color: #fff;
}

/* ==================== */
/* ПЛЕЙСХОЛДЕР ЗАГРУЗКИ */
/* ==================== */
.photo-placeholder-modern {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.3);
}

.loader-ring {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #ffd200;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loader-text-modern {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.photo-error-modern {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.photo-error-modern span {
  font-size: 48px;
}

/* ==================== */
/* СЕКЦИЯ С ЗАДАНИЕМ    */
/* ==================== */
.task-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ==================== */
/* НАВИГАЦИЯ ЗАДАНИЙ    */
/* ==================== */
.task-nav-modern {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.task-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.task-icon {
  font-size: 18px;
}

.task-name {
  color: rgba(255, 255, 255, 0.8);
}

/* ==================== */
/* КОНТЕНТ ЗАДАНИЯ      */
/* ==================== */
.task-content-modern {
  flex: 1;
  min-height: 180px;
}

.instruction-modern {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

/* ==================== */
/* SPEAKING — ФРАЗЫ     */
/* ==================== */
.phrases-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.phrase-chip-modern {
  position: relative;
  padding: 8px 16px;
  padding-right: 28px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.25s ease;
}

.phrase-chip-modern:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.phrase-chip-modern.used {
  background: rgba(76, 175, 80, 0.25);
  border-color: rgba(76, 175, 80, 0.4);
  color: #81c784;
}

.check-mark-modern {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #4CAF50;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.more-btn {
  border: none;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.6);
  padding: 6px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.more-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.more-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ==================== */
/* EXAMPLE              */
/* ==================== */
.example-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 12px;
  border-left: 3px solid #ffd200;
}

.example-card p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.action-btn {
  border: none;
  background: rgba(255, 215, 0, 0.15);
  color: #ffd200;
  padding: 8px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(255, 215, 0, 0.25);
}

/* ==================== */
/* FILL GAPS            */
/* ==================== */
.gap-card {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 12px;
}

.gap-line-modern {
  margin: 4px 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  line-height: 1.6;
}

.gap-input-modern {
  border: none;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  font-size: 14px;
  font-family: inherit;
  min-width: 70px;
  padding: 2px 6px;
  margin: 0 2px;
  height: 20px;
  color: #fff;
  transition: all 0.3s;
}

.gap-input-modern:focus {
  outline: none;
  border-bottom-color: #ffd200;
  background: rgba(255, 255, 255, 0.05);
}

.gap-input-modern::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.gap-correct-modern {
  border-bottom-color: #4CAF50 !important;
  background: rgba(76, 175, 80, 0.08) !important;
}

.gap-wrong-modern {
  border-bottom-color: #FFC107 !important;
  background: rgba(255, 193, 7, 0.08) !important;
}

.feedback-icon {
  margin-left: 2px;
  font-size: 14px;
}

.feedback-icon.correct {
  color: #4CAF50;
}

.feedback-icon.wrong {
  color: #FFC107;
}

.gap-actions-modern {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.check-btn, .reset-btn {
  border: none;
  padding: 6px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.check-btn {
  background: rgba(255, 215, 0, 0.15);
  color: #ffd200;
}

.check-btn:hover {
  background: rgba(255, 215, 0, 0.25);
}

.reset-btn {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.5);
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

.gap-score-modern {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
}

.perfect {
  color: #4CAF50;
  margin-left: 6px;
}

/* ==================== */
/* WRITING              */
/* ==================== */
.textarea-modern {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border 0.3s;
}

.textarea-modern:focus {
  outline: none;
  border-color: rgba(255, 215, 0, 0.4);
}

.textarea-modern::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.word-counter-modern {
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;
  text-align: right;
  margin-top: 4px;
}

/* ==================== */
/* READING              */
/* ==================== */
.reading-card {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 14px;
  padding: 16px;
  border-left: 3px solid #4FC3F7;
}

.reading-card p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  line-height: 1.7;
  margin: 0;
}

/* ==================== */
/* КНОПКА "ДАЛЕЕ"       */
/* ==================== */
.next-btn-modern {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #f7971e, #ffd200);
  color: #1a1a2e;
  font-size: 16px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: auto;
}

.next-btn-modern:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
}

.next-btn-modern:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

/* ==================== */
/* ЭКРАН РЕЗУЛЬТАТОВ   */
/* ==================== */
.results-modern {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

.results-card {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 40px 32px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  text-align: center;
}

.results-icon {
  font-size: 64px;
  margin-bottom: 12px;
}

.results-title {
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.results-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  margin: 0 0 24px 0;
}

.results-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.result-card-modern {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  aspect-ratio: 1;
  background: rgba(0, 0, 0, 0.3);
}

.result-card-modern img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
}

.result-number {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  font-weight: 500;
}

.result-desc {
  color: #fff;
  font-size: 12px;
  margin: 4px 0 0 0;
  line-height: 1.4;
  cursor: pointer;
  transition: filter 0.3s;
}

.result-desc.blurred {
  filter: blur(4px);
  user-select: none;
}

.hint-text {
  color: rgba(255, 255, 255, 0.3);
  font-size: 10px;
}

.play-again-modern {
  border: none;
  padding: 14px 40px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f7971e, #ffd200);
  color: #1a1a2e;
  font-size: 16px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s;
}

.play-again-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(255, 215, 0, 0.3);
}









/* ==================== */
/* АДАПТАЦИЯ            */
/* ==================== */
@media (max-width: 900px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .photo-section {
    aspect-ratio: 16/10;
    max-height: 320px;
  }

  .game-container {
    padding: 16px;
  }

  .results-card {
    padding: 28px 20px;
  }
}

@media (max-width: 500px) {
  .app-wrapper {
    padding: 10px;
  }

  .game-container {
    padding: 12px;
    border-radius: 20px;
  }

  .game-title {
    font-size: 16px;
  }

  .progress-bar {
    width: 60px;
  }

  .task-section {
    padding: 14px;
  }

  .results-gallery {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .results-title {
    font-size: 24px;
  }
}


</style>
