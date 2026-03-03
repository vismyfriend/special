<template>
  <!-- http://localhost:9000/special/#/see-all-sets-of-words/lesson4/4sentences -->


  <div class="casino-container-fixed">
    <!-- Неоновые огни казино -->
    <div class="neon-lights">
      <div class="neon-light red"></div>
      <div class="neon-light blue"></div>
      <div class="neon-light green"></div>
      <div class="neon-light yellow"></div>
    </div>

    <!-- Затемняющий фон для контраста -->
    <div class="casino-bg-overlay"></div>

    <!-- Главный игровой автомат -->
    <div class="slot-machine">
      <!-- Заголовок -->
      <div class="machine-header">
        <h1 class="neon-title">
          <span class="neon-word">GRAMMAR</span>
          <span class="neon-word">CASINO</span>
          <span class="neon-word">🎰</span>
        </h1>
        <div class="lesson-name">{{ currentLesson.name }}</div>

        <!-- Переключатель режима -->
        <div class="mode-selector">
          <label class="mode-checkbox">
            <input
              type="checkbox"
              v-model="onlyCurrentLesson"
            >
            <span class="checkmark"></span>
            <span class="mode-text">🎯 Only words from this lesson</span>
          </label>
          <div class="mode-info" v-if="!onlyCurrentLesson && lessonNumber > 1">
            Using words from lessons 1 - {{ lessonNumber }} ({{ totalWordsCount }} words)
          </div>
          <div class="mode-info" v-else-if="onlyCurrentLesson">
            Training mode: only new words from lesson {{ lessonNumber }}
          </div>
        </div>

        <!-- Навигация по урокам -->
        <!-- Навигация по урокам -->
        <div class="lesson-nav">
          <button
            class="nav-btn prev"
            @click="changeLesson(-1)"
            :disabled="currentLessonIndex <= 0"
          >
            ◀ PREV
          </button>

          <select v-model="currentLessonKey" class="lesson-select" @change="goToLesson(currentLessonKey)">
            <option v-for="key in lessonKeys" :key="key" :value="key">
              {{ getLessonName(key) }}
            </option>
          </select>

          <button
            class="nav-btn next"
            @click="changeLesson(1)"
            :disabled="currentLessonIndex >= lessonKeys.length - 1"
          >
            NEXT ▶
          </button>
        </div>
      </div>

      <!-- Барабаны -->
      <div class="reels-container">
        <!-- Первый барабан - Местоимения -->
        <div class="reel-wrapper">
          <div class="reel-label">
            <span class="label-text">PRONOUN</span>
            <span class="label-ru">Кто?</span>
            <span class="word-count">{{ availableWords.pronouns.length }}</span>
          </div>
          <div class="reel" :class="{ spinning: isSpinning }">
            <div class="reel-window">
              <div class="reel-content">
                <div class="word-en">{{ currentPronoun.word }}</div>
                <div class="word-ru">{{ currentPronoun.ru }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Второй барабан - Глагол -->
        <div class="reel-wrapper">
          <div class="reel-label">
            <span class="label-text">VERB</span>
            <span class="label-ru">Что делает?</span>
            <span class="word-count">{{ availableWords.verbs.length }}</span>
          </div>
          <div class="reel" :class="{ spinning: isSpinning }">
            <div class="reel-window">
              <div class="reel-content">
                <div class="word-en">{{ currentVerb.word }}</div>
                <div class="word-ru">{{ currentVerb.ru }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Третий барабан - динамический (прил/сущ/нареч) -->
        <div class="reel-wrapper">
          <div class="reel-label">
            <span class="label-text">{{ thirdReelLabel }}</span>
            <span class="label-ru">{{ thirdReelRuLabel }}</span>
            <span class="word-count">{{ thirdReelCount }}</span>
          </div>
          <div class="reel" :class="{ spinning: isSpinning }">
            <div class="reel-window">
              <div class="reel-content">
                <div class="word-en">{{ currentThird.word }}</div>
                <div class="word-ru">{{ currentThird.ru }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Рычаг -->
      <div class="controls">
        <button
          class="lever-button"
          @click="spin"
          :disabled="isSpinning"
        >
          <span class="lever-emoji">🎰</span>
          <span class="lever-text">PULL THE LEVER!</span>
        </button>
      </div>

      <!-- Результат -->
      <div class="result-panel">
        <div class="result-label">YOUR SENTENCE:</div>
        <div class="result-sentence">{{ currentSentence }}</div>
        <div class="result-translation">{{ currentTranslation }}</div>
      </div>

      <!-- Практика -->
      <div class="practice-area">
        <div class="practice-label">✍️ Write your sentence:</div>
        <div class="input-group">
          <input
            type="text"
            v-model="userInput"
            :placeholder="'Type: ' + currentSentence.toLowerCase()"
            class="practice-input"
            @keyup.enter="checkAnswer"
          >
          <button
            class="check-button"
            @click="checkAnswer"
            :disabled="!userInput.trim()"
          >
            CHECK ✓
          </button>
        </div>
        <div v-if="showFeedback" class="feedback" :class="feedbackClass">
          <span class="feedback-icon">{{ feedbackIcon }}</span>
          <span class="feedback-text">{{ feedbackText }}</span>
        </div>
      </div>

      <!-- Банк слов с подсветкой новых -->
      <div class="word-bank">
        <div class="bank-header" @click="showWordBank = !showWordBank">
          <span>📚 WORD BANK</span>
          <span class="word-count-total">({{ totalWordsCount }} words)</span>
          <span class="arrow">{{ showWordBank ? '▼' : '▶' }}</span>
        </div>
        <div v-if="showWordBank" class="bank-content">
          <!-- Местоимения -->
          <div class="bank-column" v-if="availableWords.pronouns.length">
            <div class="bank-title">PRONOUNS</div>
            <div class="bank-items">
              <div
                v-for="word in availableWords.pronouns"
                :key="word.word"
                class="bank-item"
                :class="{ 'new-word': isNewWord(word, 'pronouns') }"
              >
                <span class="bank-en">{{ word.word }}</span>
                <span class="bank-ru">- {{ word.ru }}</span>
                <span v-if="isNewWord(word, 'pronouns')" class="new-badge">NEW!</span>
              </div>
            </div>
          </div>

          <!-- Глаголы -->
          <div class="bank-column" v-if="availableWords.verbs.length">
            <div class="bank-title">VERBS</div>
            <div class="bank-items">
              <div
                v-for="word in availableWords.verbs"
                :key="word.word"
                class="bank-item"
                :class="{ 'new-word': isNewWord(word, 'verbs') }"
              >
                <span class="bank-en">{{ word.word }}</span>
                <span class="bank-ru">- {{ word.ru }}</span>
                <span v-if="isNewWord(word, 'verbs')" class="new-badge">NEW!</span>
              </div>
            </div>
          </div>

          <!-- Прилагательные -->
          <div class="bank-column" v-if="availableWords.adjectives.length">
            <div class="bank-title">ADJECTIVES</div>
            <div class="bank-items">
              <div
                v-for="word in availableWords.adjectives"
                :key="word.word"
                class="bank-item"
                :class="{ 'new-word': isNewWord(word, 'adjectives') }"
              >
                <span class="bank-en">{{ word.word }}</span>
                <span class="bank-ru">- {{ word.ru }}</span>
                <span v-if="isNewWord(word, 'adjectives')" class="new-badge">NEW!</span>
              </div>
            </div>
          </div>

          <!-- Существительные -->
          <div class="bank-column" v-if="availableWords.nouns.length">
            <div class="bank-title">NOUNS</div>
            <div class="bank-items">
              <div
                v-for="word in availableWords.nouns"
                :key="word.word"
                class="bank-item"
                :class="{ 'new-word': isNewWord(word, 'nouns') }"
              >
                <span class="bank-en">{{ word.word }}</span>
                <span class="bank-ru">- {{ word.ru }}</span>
                <span v-if="isNewWord(word, 'nouns')" class="new-badge">NEW!</span>
              </div>
            </div>
          </div>

          <!-- Наречия -->
          <div class="bank-column" v-if="availableWords.adverbs.length">
            <div class="bank-title">ADVERBS</div>
            <div class="bank-items">
              <div
                v-for="word in availableWords.adverbs"
                :key="word.word"
                class="bank-item"
                :class="{ 'new-word': isNewWord(word, 'adverbs') }"
              >
                <span class="bank-en">{{ word.word }}</span>
                <span class="bank-ru">- {{ word.ru }}</span>
                <span v-if="isNewWord(word, 'adverbs')" class="new-badge">NEW!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Счетчик монет -->
    <div class="coin-counter">
      <div class="coin">🪙</div>
      <div class="count">{{ coinCount }}</div>
    </div>

    <!-- Кнопка назад как в твоем примере -->
    <button class="nav-button back-button" @click="goBack">← BACK</button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { dataGame4Sentences } from '../dataForGames/game4SentencesData';

const router = useRouter();
const route = useRoute();

// Получаем missionName из URL (например: 'lesson1', 'lesson2', 'lesAnimals')
const missionKey = route.params.missionName || 'lesson1';

// Создаем массив всех доступных уроков для навигации
const lessonKeys = Object.keys(dataGame4Sentences); // ['lesson1', 'lesson2', 'lesson3', 'lesson4', 'lesson5', 'lesAnimals']

// Находим индекс текущего урока в массиве
const currentLessonIndex = ref(lessonKeys.indexOf(missionKey) !== -1
  ? lessonKeys.indexOf(missionKey)
  : 0);

// Текущий ключ урока
const currentLessonKey = computed(() => lessonKeys[currentLessonIndex.value]);

// Состояния
const onlyCurrentLesson = ref(false);
const isSpinning = ref(false);
const showWordBank = ref(false);
const userInput = ref('');
const showFeedback = ref(false);
const isCorrect = ref(false);
const coinCount = ref(0);

// Текущие значения на барабанах
const currentPronoun = ref({ word: 'I', ru: 'Я' });
const currentVerb = ref({ word: 'am', ru: 'есть' });
const currentThird = ref({ word: 'big', ru: 'большой' });

// Навигация назад
const goBack = () => {
  router.back();
};

// Получаем название урока по ключу
const getLessonName = (key) => {
  return dataGame4Sentences[key]?.name || key;
};

// Текущий урок
const currentLesson = computed(() => {
  return dataGame4Sentences[currentLessonKey.value] || dataGame4Sentences.lesson1;
});

// Собираем все доступные слова
const availableWords = computed(() => {
  const result = {
    pronouns: [],
    verbs: [],
    adjectives: [],
    nouns: [],
    adverbs: []
  };

  if (onlyCurrentLesson.value) {
    // Только слова из текущего урока
    const lesson = currentLesson.value;
    Object.keys(result).forEach(key => {
      if (lesson[key]) {
        result[key] = [...lesson[key]];
      }
    });
  } else {
    // Слова из всех уроков до текущего (включая текущий)
    for (let i = 0; i <= currentLessonIndex.value; i++) {
      const lesson = dataGame4Sentences[lessonKeys[i]];
      if (lesson) {
        Object.keys(result).forEach(key => {
          if (lesson[key]) {
            result[key] = [...result[key], ...lesson[key]];
          }
        });
      }
    }
  }

  return result;
});

// Общее количество слов
const totalWordsCount = computed(() => {
  return Object.values(availableWords.value).reduce((sum, arr) => sum + arr.length, 0);
});

// Для третьего барабана выбираем категорию с наибольшим количеством слов
const thirdReelCategory = computed(() => {
  const categories = ['adjectives', 'nouns', 'adverbs'];
  let bestCategory = 'adjectives';
  let maxCount = 0;

  categories.forEach(cat => {
    if (availableWords.value[cat]?.length > maxCount) {
      maxCount = availableWords.value[cat].length;
      bestCategory = cat;
    }
  });

  return bestCategory;
});

const thirdReelLabel = computed(() => {
  const map = {
    adjectives: 'ADJECTIVE',
    nouns: 'NOUN',
    adverbs: 'ADVERB'
  };
  return map[thirdReelCategory.value] || 'WORD';
});

const thirdReelRuLabel = computed(() => {
  const map = {
    adjectives: 'Какой?',
    nouns: 'Что?',
    adverbs: 'Как?'
  };
  return map[thirdReelCategory.value] || '';
});

const thirdReelCount = computed(() => {
  return availableWords.value[thirdReelCategory.value]?.length || 0;
});

// Проверяем, новое ли слово (появилось в текущем уроке)
const isNewWord = (word, category) => {
  if (onlyCurrentLesson.value) return true;

  const currentLessonWords = currentLesson.value[category];
  if (!currentLessonWords) return false;

  return currentLessonWords.some(w => w.word === word.word && w.ru === word.ru);
};

// Формируем предложение
const currentSentence = computed(() => {
  let verb = currentVerb.value.word;
  let third = currentThird.value.word;

  if (['am', 'are', 'is'].includes(verb)) {
    return `${currentPronoun.value.word} ${verb} ${third}.`;
  }

  if (verb === 'have' || verb === 'has') {
    return `${currentPronoun.value.word} ${verb} ${third}.`;
  }

  return `${currentPronoun.value.word} ${verb} ${third}.`;
});

const currentTranslation = computed(() => {
  return `${currentPronoun.value.ru} ${currentVerb.value.ru} ${currentThird.value.ru}.`;
});

// Фидбек
const feedbackIcon = computed(() => isCorrect.value ? '🎉' : '💪');
const feedbackText = computed(() => {
  if (isCorrect.value) return 'Excellent! +1 coin!';
  return `Try again! Correct: "${currentSentence.value}"`;
});
const feedbackClass = computed(() => isCorrect.value ? 'feedback-correct' : 'feedback-incorrect');

// Выбираем правильный глагол для местоимения
const getCorrectVerbForPronoun = (pronoun, verbPool) => {
  const compatibleVerbs = verbPool.filter(v => {
    if (!v.onlyWith) return true;
    return v.onlyWith.includes(pronoun.word);
  });

  if (compatibleVerbs.length === 0) return verbPool[Math.floor(Math.random() * verbPool.length)];
  return compatibleVerbs[Math.floor(Math.random() * compatibleVerbs.length)];
};

// Вращение
const spin = () => {
  if (isSpinning.value) return;

  isSpinning.value = true;
  showFeedback.value = false;
  userInput.value = '';

  setTimeout(() => {
    const pronouns = availableWords.value.pronouns;
    const verbs = availableWords.value.verbs;
    const thirdPool = availableWords.value[thirdReelCategory.value];

    if (pronouns.length && verbs.length && thirdPool.length) {
      const randomPronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
      const randomVerb = getCorrectVerbForPronoun(randomPronoun, verbs);
      const randomThird = thirdPool[Math.floor(Math.random() * thirdPool.length)];

      currentPronoun.value = randomPronoun;
      currentVerb.value = randomVerb;
      currentThird.value = randomThird;
    }

    isSpinning.value = false;
  }, 300);
};

// Проверка ответа
const checkAnswer = () => {
  const normalizedInput = userInput.value.trim().toLowerCase().replace(/[.!?]+$/, '');
  const normalizedCorrect = currentSentence.value.toLowerCase().replace(/[.!?]+$/, '');

  isCorrect.value = normalizedInput === normalizedCorrect;
  showFeedback.value = true;

  if (isCorrect.value) coinCount.value += 1;
};

// Смена урока (по индексу)
const changeLesson = (delta) => {
  const newIndex = currentLessonIndex.value + delta;
  if (newIndex >= 0 && newIndex < lessonKeys.length) {
    currentLessonIndex.value = newIndex;
    spin();
  }
};

// Переход к уроку по ключу
const goToLesson = (key) => {
  const index = lessonKeys.indexOf(key);
  if (index !== -1) {
    currentLessonIndex.value = index;
    spin();
  }
};

// Следим за сменой урока или режима
watch([currentLessonIndex, onlyCurrentLesson], () => {
  spin();
});

// Инициализация
spin();

// Предотвращаем зум
const preventZoom = (e) => {
  if (e.touches && e.touches.length > 1) {
    e.preventDefault();
    e.stopPropagation();
  }
};

onMounted(() => {
  console.log('Game started with lesson:', currentLessonKey.value); // Для отладки
  document.addEventListener('dblclick', preventZoom);
  document.addEventListener('touchstart', preventZoom, { passive: false });

  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
  document.head.appendChild(meta);
});

onUnmounted(() => {
  document.removeEventListener('dblclick', preventZoom);
  document.removeEventListener('touchstart', preventZoom);
});
</script>
<style scoped>
/* Глобальные стили как в твоем примере */
html {
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

/* Основной контейнер - fixed как в твоем примере */
.casino-container-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #0a0f0f 0%, #1a1f2e 100%);
  padding: 20px;
  z-index: 100;
  touch-action: manipulation;
  overflow-y: auto;
}

/* Затемняющий фон для контраста */
.casino-bg-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255,215,0,0.1) 0%, transparent 70%);
  pointer-events: none;
  z-index: 1;
}

/* Кнопка назад как в твоем примере */
.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 80px;
  height: 60px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(145deg, #ffffff 0%, #e6e9f0 100%);
  box-shadow: 5px 5px 10px #b8b9be, -5px -5px 10px #ffffff;
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 200;
  border: 2px solid #ffd700;
}

.back-button:hover {
  transform: scale(1.05);
  background: linear-gradient(145deg, #e6e9f0 0%, #ffffff 100%);
}

/* Игровой автомат - с z-index чтобы быть поверх фона */
.slot-machine {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border: 4px solid #ffd700;
  border-radius: 60px 60px 30px 30px;
  padding: 40px 30px;
  box-shadow:
    0 0 50px rgba(255, 215, 0, 0.3),
    inset 0 0 30px rgba(255, 215, 0, 0.2),
    0 20px 40px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 20;
  backdrop-filter: blur(5px);
}

/* Остальные стили из предыдущего CSS */
.neon-lights {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 10px;
  z-index: 10;
  pointer-events: none;
}

.neon-light {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  filter: blur(10px);
  animation: flicker 2s infinite;
}

.neon-light.red { background: #ff0000; animation-delay: 0s; box-shadow: 0 0 30px #ff0000; }
.neon-light.blue { background: #00ffff; animation-delay: 0.5s; box-shadow: 0 0 30px #00ffff; }
.neon-light.green { background: #00ff00; animation-delay: 1s; box-shadow: 0 0 30px #00ff00; }
.neon-light.yellow { background: #ffff00; animation-delay: 1.5s; box-shadow: 0 0 30px #ffff00; }

@keyframes flicker {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  25% { opacity: 0.8; transform: scale(1.1); }
  50% { opacity: 0.4; transform: scale(0.9); }
  75% { opacity: 1; transform: scale(1.2); }
}

/* Неоновый заголовок */
.machine-header {
  text-align: center;
  margin-bottom: 30px;
}

.neon-title {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.neon-word {
  font-size: 52px;
  font-weight: bold;
  color: #fff;
  text-shadow:
    0 0 10px #ffd700,
    0 0 20px #ffd700,
    0 0 30px #ffd700,
    0 0 40px #ff8c00,
    0 0 70px #ff8c00;
  animation: neonPulse 1.5s infinite;
  letter-spacing: 4px;
}

@keyframes neonPulse {
  0%, 100% {
    text-shadow:
      0 0 10px #ffd700,
      0 0 20px #ffd700,
      0 0 30px #ffd700,
      0 0 40px #ff8c00;
  }
  50% {
    text-shadow:
      0 0 15px #ffd700,
      0 0 25px #ffd700,
      0 0 35px #ffd700,
      0 0 50px #ff8c00,
      0 0 80px #ff8c00;
  }
}

.lesson-name {
  color: #ffd700;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  background: rgba(0, 0, 0, 0.5);
  display: inline-block;
  padding: 10px 30px;
  border-radius: 50px;
  border: 2px solid #ffd700;
}

/* Переключатель режима */
.mode-selector {
  margin: 20px auto;
  padding: 15px 25px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50px;
  border: 2px solid #ffd700;
  display: inline-block;
  max-width: 90%;
}

.mode-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: #fff;
  font-size: 18px;
  position: relative;
}

.mode-checkbox input {
  width: 22px;
  height: 22px;
  cursor: pointer;
  accent-color: #ffd700;
}

.mode-text {
  color: #ffd700;
  font-weight: bold;
  letter-spacing: 1px;
}

.mode-info {
  margin-top: 8px;
  font-size: 14px;
  color: #aaa;
  font-style: italic;
  border-top: 1px solid #333;
  padding-top: 8px;
}

/* Навигация по урокам */
.lesson-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.nav-btn {
  background: linear-gradient(180deg, #333, #111);
  border: 2px solid #ffd700;
  border-radius: 30px;
  padding: 12px 30px;
  color: #ffd700;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.nav-btn:hover:not(:disabled) {
  background: linear-gradient(180deg, #444, #222);
  transform: scale(1.05);
  box-shadow: 0 0 20px #ffd700;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.lesson-select {
  background: linear-gradient(180deg, #333, #111);
  border: 2px solid #ffd700;
  border-radius: 30px;
  padding: 12px 30px;
  color: #ffd700;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  min-width: 300px;
  text-align: center;
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffd700' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
  background-repeat: no-repeat;
  background-position: right 20px center;
  background-size: 16px;
}

.lesson-select option {
  background: #1a1a1a;
  color: #fff;
  padding: 10px;
}

/* Барабаны */
.reels-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-bottom: 30px;
  background: linear-gradient(145deg, #0a0a0a, #1e1e1e);
  padding: 30px;
  border-radius: 50px;
  border: 3px solid #ffd700;
  box-shadow: inset 0 0 30px #000, 0 10px 30px rgba(0,0,0,0.5);
}

.reel-wrapper {
  text-align: center;
}

.reel-label {
  color: #ffd700;
  margin-bottom: 15px;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.label-ru {
  color: #888;
  font-size: 14px;
  text-transform: lowercase;
  font-style: italic;
}

.word-count {
  background: #ffd700;
  color: #1a1a1a;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: bold;
  margin-left: 5px;
}

.reel {
  background: linear-gradient(145deg, #f0e6d2, #d4c4a8);
  border-radius: 30px;
  padding: 8px;
  border: 4px solid #ffd700;
  box-shadow:
    0 12px 0 #b8860b,
    inset 0 0 30px rgba(255, 215, 0, 0.5),
    0 0 20px rgba(255, 215, 0, 0.3);
  transition: all 0.1s;
}

.reel.spinning {
  animation: spinReel 0.15s linear infinite;
}

@keyframes spinReel {
  0% { transform: translateY(0) scale(1); }
  20% { transform: translateY(-8px) scale(1.02); }
  40% { transform: translateY(0) scale(1); }
  60% { transform: translateY(8px) scale(0.98); }
  80% { transform: translateY(-4px) scale(1.01); }
  100% { transform: translateY(0) scale(1); }
}

.reel-window {
  background: linear-gradient(145deg, #fff9e6, #f0e0b0);
  border-radius: 25px;
  padding: 30px 15px;
  border: 2px solid #b8860b;
  overflow: hidden;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reel-content {
  transition: all 0.3s;
  text-align: center;
}

.word-en {
  font-size: 42px;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 10px;
  text-transform: lowercase;
  line-height: 1.2;
}

.word-ru {
  font-size: 20px;
  color: #666;
  font-style: italic;
  border-top: 2px dashed #b8860b;
  padding-top: 8px;
  margin-top: 8px;
}

/* Рычаг */
.controls {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.lever-button {
  background: linear-gradient(180deg, #ffd700, #b8860b);
  border: none;
  border-radius: 60px;
  padding: 20px 60px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  box-shadow:
    0 12px 0 #7a5c00,
    0 15px 30px rgba(0,0,0,0.5),
    0 0 30px #ffd700;
  transition: 0.05s linear;
  position: relative;
  overflow: hidden;
  border: 2px solid #fff;
}

.lever-button:active {
  transform: translateY(10px);
  box-shadow:
    0 2px 0 #7a5c00,
    0 10px 20px rgba(0,0,0,0.5),
    0 0 30px #ffd700;
}

.lever-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: translateY(5px);
  box-shadow: 0 5px 0 #7a5c00, 0 10px 20px rgba(0,0,0,0.5);
}

.lever-emoji {
  font-size: 48px;
  animation: shake 0.5s infinite;
  filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));
}

@keyframes shake {
  0%, 100% { transform: rotate(-10deg) scale(1); }
  25% { transform: rotate(10deg) scale(1.1); }
  50% { transform: rotate(-15deg) scale(1.2); }
  75% { transform: rotate(15deg) scale(1.1); }
}

.lever-text {
  color: #1a1a1a;
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 3px;
  text-shadow: 0 2px 5px rgba(255,255,255,0.5);
}

/* Панель результата */
.result-panel {
  background: linear-gradient(145deg, #2a2a2a, #1e1e1e);
  border: 3px solid #ffd700;
  border-radius: 40px;
  padding: 30px;
  margin-bottom: 30px;
  text-align: center;
  box-shadow: inset 0 0 30px rgba(255,215,0,0.1), 0 10px 30px rgba(0,0,0,0.5);
}

.result-label {
  color: #ffd700;
  font-size: 16px;
  letter-spacing: 4px;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.result-sentence {
  color: #fff;
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 15px;
  text-shadow: 0 0 15px #ffd700;
  line-height: 1.3;
}

.result-translation {
  color: #aaa;
  font-size: 28px;
  font-style: italic;
  border-top: 2px solid #333;
  padding-top: 15px;
  margin-top: 15px;
}

/* Поле для практики */
.practice-area {
  background: rgba(0, 0, 0, 0.7);
  border-radius: 40px;
  padding: 30px;
  margin-bottom: 30px;
  border: 2px solid #ffd700;
}

.practice-label {
  color: #ffd700;
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: bold;
}

.input-group {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.practice-input {
  flex: 1;
  min-width: 250px;
  background: #fff;
  border: 3px solid #ffd700;
  border-radius: 20px;
  padding: 18px 25px;
  font-size: 20px;
  font-family: 'Courier New', monospace;
  transition: all 0.3s;
}

.practice-input:focus {
  outline: none;
  box-shadow: 0 0 30px #ffd700;
  transform: scale(1.02);
}

.check-button {
  background: linear-gradient(180deg, #4CAF50, #45a049);
  border: none;
  border-radius: 20px;
  padding: 18px 40px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 8px 0 #2d6a2d, 0 5px 20px rgba(0,0,0,0.3);
  transition: 0.05s linear;
  border: 2px solid #fff;
  letter-spacing: 2px;
}

.check-button:active {
  transform: translateY(8px);
  box-shadow: 0 0 0 #2d6a2d, 0 5px 20px rgba(0,0,0,0.3);
}

.check-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: translateY(4px);
  box-shadow: 0 4px 0 #2d6a2d;
}

/* Фидбек */
.feedback {
  padding: 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  animation: slideIn 0.3s ease;
  font-size: 18px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feedback-correct {
  background: rgba(76, 175, 80, 0.2);
  border: 2px solid #4CAF50;
  color: #a5d6a7;
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
}

.feedback-incorrect {
  background: rgba(255, 87, 34, 0.2);
  border: 2px solid #ff5722;
  color: #ffab91;
  box-shadow: 0 0 20px rgba(255, 87, 34, 0.3);
}

.feedback-icon {
  font-size: 32px;
  filter: drop-shadow(0 0 5px currentColor);
}

.feedback-text {
  font-size: 18px;
  flex: 1;
}

/* Банк слов */
.word-bank {
  background: rgba(0, 0, 0, 0.8);
  border: 3px solid #ffd700;
  border-radius: 30px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.bank-header {
  padding: 20px 30px;
  color: #ffd700;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 215, 0, 0.1);
  transition: all 0.3s;
  border-bottom: 2px solid transparent;
}

.bank-header:hover {
  background: rgba(255, 215, 0, 0.2);
}

.word-count-total {
  color: #ffd700;
  font-size: 16px;
  background: rgba(255, 215, 0, 0.2);
  padding: 5px 15px;
  border-radius: 30px;
  margin-left: 10px;
}

.arrow {
  font-size: 24px;
  transition: transform 0.3s;
}

.bank-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 30px;
  border-top: 2px solid #ffd700;
  max-height: 400px;
  overflow-y: auto;
}

.bank-column {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #ffd700;
}

.bank-title {
  color: #ffd700;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ffd700;
  text-align: center;
  letter-spacing: 2px;
}

.bank-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 5px;
}

.bank-items::-webkit-scrollbar {
  width: 8px;
}

.bank-items::-webkit-scrollbar-track {
  background: rgba(255, 215, 0, 0.1);
  border-radius: 10px;
}

.bank-items::-webkit-scrollbar-thumb {
  background: #ffd700;
  border-radius: 10px;
}

.bank-item {
  color: #fff;
  padding: 8px 12px;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: all 0.3s;
  position: relative;
}

.bank-item:hover {
  background: rgba(255, 215, 0, 0.2);
  transform: translateX(5px);
}

.bank-en {
  color: #ffd700;
  font-weight: bold;
}

.bank-ru {
  color: #aaa;
}

.new-word {
  background: rgba(255, 215, 0, 0.1);
  border-left: 4px solid #ffd700;
}

.new-badge {
  background: #ffd700;
  color: #1a1a1a;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: bold;
  animation: pulse 1s infinite;
  margin-left: 5px;
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

/* Счетчик монет */
.coin-counter {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(145deg, #ffd700, #b8860b);
  border-radius: 40px;
  padding: 15px 30px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 4px solid #fff;
  box-shadow:
    0 0 30px #ffd700,
    0 10px 20px rgba(0,0,0,0.5);
  z-index: 200;
  animation: coinFloat 3s infinite;
}

@keyframes coinFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-5px) rotate(2deg); }
  75% { transform: translateY(5px) rotate(-2deg); }
}

.coin {
  font-size: 40px;
  filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));
}

.count {
  font-size: 36px;
  font-weight: bold;
  color: #1a1a1a;
  text-shadow: 0 2px 5px rgba(255,255,255,0.5);
}

/* Адаптивность */
@media (max-width: 768px) {
  .slot-machine {
    padding: 20px 15px;
  }

  .neon-word {
    font-size: 32px;
  }

  .lesson-name {
    font-size: 20px;
    padding: 8px 20px;
  }

  .reels-container {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
  }

  .word-en {
    font-size: 32px;
  }

  .result-sentence {
    font-size: 28px;
  }

  .result-translation {
    font-size: 20px;
  }

  .lever-text {
    font-size: 20px;
  }

  .lever-emoji {
    font-size: 32px;
  }

  .input-group {
    flex-direction: column;
  }

  .practice-input {
    font-size: 16px;
    padding: 15px;
  }

  .check-button {
    width: 100%;
    padding: 15px;
  }

  .bank-content {
    grid-template-columns: 1fr;
    padding: 15px;
  }

  .coin-counter {
    top: 10px;
    right: 10px;
    padding: 10px 20px;
  }

  .coin {
    font-size: 28px;
  }

  .count {
    font-size: 24px;
  }

  .lesson-select {
    min-width: 250px;
    font-size: 14px;
  }

  .nav-btn {
    padding: 8px 20px;
    font-size: 14px;
  }

  .back-button {
    width: 60px;
    height: 50px;
    font-size: 20px;
    top: 10px;
    left: 10px;
  }
}
</style>
