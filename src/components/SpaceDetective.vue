<template>
  <div class="phone-wrapper">
    <div id="phoneFrame">
      <div class="inside-phone-frame">
        <div class="space-detective">
          <!-- Звездный фон с эффектом гиперпространства -->
          <div class="stars-container">
            <div
              v-for="(star, index) in stars"
              :key="index"
              class="star"
              :style="{
                top: star.y + '%',
                left: star.x + '%',
                width: star.size + 'px',
                height: star.size + 'px',
                '--duration': star.duration + 's',
                '--delay': star.delay + 's',
                '--start-x': star.startX + '%',
                '--start-y': star.startY + '%',
                '--end-x': star.endX + '%',
                '--end-y': star.endY + '%',
                '--speed-multiplier': speedMultiplier
              }"
            ></div>
          </div>

          <!-- ХАБ (жизни + скорость + счет) -->
          <div class="hub">
            <div class="lives">
              <span v-for="n in 4" :key="n" class="life-icon" :class="{ lost: n > lives }">
                ❤️
              </span>
            </div>

            <div class="speed-indicator">
              <span class="speed-label">SPEED</span>
              <span class="speed-value" :class="{ pulse: speedPulse }">{{ currentSpeedLevel }}</span>
            </div>

            <div class="score">
              <span class="score-label">ОЧКИ</span>
              <span class="score-value">{{ score }}</span>
            </div>
          </div>

          <!-- Астероид-слово (на английском) -->
          <div class="asteroid-container">
            <div
              class="asteroid-word"
              :class="{
                'explode-correct': explodeCorrect,
                'explode-wrong': explodeWrong,
                'hit': hitAsteroid
              }"
              :style="{
                transform: `scale(${asteroidScale})`,
                opacity: asteroidOpacity,
                filter: `blur(${asteroidBlur}px)`
              }"
            >
              {{ currentWord?.eng || '' }}
              <div class="asteroid-ring"></div>
            </div>
          </div>

          <!-- Варианты ответов (на русском) -->
          <div class="answers-grid">
            <button
              v-for="(answer, index) in answers"
              :key="index"
              class="answer-btn"
              :class="{
                'correct-answer': showCorrect && answer === currentWord?.ru,
                'wrong-answer': showWrong && answer === selectedAnswer && selectedAnswer !== currentWord?.ru
              }"
              @click="checkAnswer(answer)"
              :disabled="isProcessing || gameOver"
            >
              {{ answer }}
            </button>
          </div>

          <!-- Game Over Modal -->
          <div v-if="gameOver" class="game-over-overlay">
            <div class="game-over-modal">
              <div class="modal-icon">{{ lives === 0 ? '💀' : '🚀' }}</div>
              <h2 class="modal-title">{{ lives === 0 ? 'АСТЕРОИД ПОБЕДИЛ' : 'МИССИЯ ВЫПОЛНЕНА!' }}</h2>
              <p class="modal-text">{{ lives === 0 ? 'Вы потеряли все жизни. Попробуйте снова.' : 'Вы отлично справились!' }}</p>
              <div class="modal-stats">
                <span>Счет: {{ score }}</span>
                <span>Сбито: {{ hits }}</span>
                <span>Точность: {{ accuracy }}%</span>
              </div>
              <button class="modal-btn" @click="resetGame">🔄 НОВАЯ МИССИЯ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import shortWordsData from '../dataForGames/short-words-data';

const route = useRoute();

// ============================================================
//  ДАННЫЕ ИГРЫ
// ============================================================
const getWordSet = (name) => {
  if (shortWordsData[name]) return shortWordsData[name];
  for (const level in shortWordsData) {
    if (shortWordsData[level] && shortWordsData[level][name]) {
      return shortWordsData[level][name];
    }
  }
  return [];
};

const currentMission = ref(route.params.missionName || 'digits09');
const words = ref([]);

// ОЧЕРЕДЬ СЛОВ
const wordQueue = ref([]);
const pendingWords = ref([]);
const currentWordIndex = ref(0);
const lastWords = ref([]);
const MAX_LAST_WORDS = 3;
const WORDS_BEFORE_RETRY = 5;

const currentWord = ref(null);
const answers = ref([]);
const selectedAnswer = ref(null);
const score = ref(0);
const lives = ref(4);
const hits = ref(0);
const totalAttempts = ref(0);
const gameOver = ref(false);
const isProcessing = ref(false);
const showCorrect = ref(false);
const showWrong = ref(false);
const explodeCorrect = ref(false);
const explodeWrong = ref(false);
const hitAsteroid = ref(false);

// Параметры астероида
const asteroidScale = ref(0.1);
const asteroidOpacity = ref(1);
const asteroidBlur = ref(10);
let animationFrame = null;
const BASE_SPEED = 0.006;

// СКОРОСТЬ - теперь увеличивается при КАЖДОМ правильном ответе
const speedLevel = ref(1);
const correctStreak = ref(0);
const speedPulse = ref(false);
const MAX_SPEED_LEVEL = 20;

const currentSpeedLevel = computed(() => Math.min(speedLevel.value, MAX_SPEED_LEVEL));
const speedMultiplier = computed(() => 1 + (speedLevel.value - 1) * 0.1);

// ============================================================
//  ЗВЕЗДЫ — ЭФФЕКТ ГИПЕРПРОСТРАНСТВА
// ============================================================
const stars = ref([]);

const generateStars = () => {
  const count = 100;
  const newStars = [];
  const centerX = 50;
  const centerY = 50;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = 10 + Math.random() * 90;

    const startX = centerX + Math.cos(angle) * (Math.random() * 30);
    const startY = centerY + Math.sin(angle) * (Math.random() * 30);

    const endX = centerX + Math.cos(angle) * (60 + Math.random() * 60);
    const endY = centerY + Math.sin(angle) * (60 + Math.random() * 60);

    newStars.push({
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY,
      x: startX,
      y: startY,
      size: 1 + Math.random() * 3,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 6,
      opacity: 0.3 + Math.random() * 0.7,
    });
  }
  stars.value = newStars;
};

// ============================================================
//  КОМПЬЮТЕРНЫЕ СВОЙСТВА
// ============================================================
const accuracy = computed(() => {
  if (totalAttempts.value === 0) return 0;
  return Math.round((hits.value / totalAttempts.value) * 100);
});

// ============================================================
//  УМНАЯ ЛОГИКА ОЧЕРЕДИ
// ============================================================
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

const initWordQueue = () => {
  const shuffled = shuffle([...words.value]);
  wordQueue.value = shuffled;
  currentWordIndex.value = 0;
  pendingWords.value = [];
  lastWords.value = [];
};

const getNextWordFromQueue = () => {
  if (pendingWords.value.length > 0) {
    const word = pendingWords.value.shift();
    return word;
  }

  if (wordQueue.value.length === 0) {
    const remainingWords = words.value.filter(w =>
      !lastWords.value.includes(w.id)
    );
    wordQueue.value = shuffle([...remainingWords]);
    currentWordIndex.value = 0;
  }

  if (currentWordIndex.value >= wordQueue.value.length) {
    if (pendingWords.value.length > 0) {
      wordQueue.value = shuffle([...pendingWords.value]);
      pendingWords.value = [];
      currentWordIndex.value = 0;
    } else {
      wordQueue.value = shuffle([...words.value]);
      currentWordIndex.value = 0;
    }
  }

  const word = wordQueue.value[currentWordIndex.value];
  currentWordIndex.value++;

  if (lastWords.value.includes(word.id)) {
    return getNextWordFromQueue();
  }

  return word;
};

const addToPending = (word) => {
  const alreadyPending = pendingWords.value.some(w => w.id === word.id);
  if (!alreadyPending) {
    pendingWords.value.push(word);
  }
};

const updateLastWords = (word) => {
  lastWords.value.push(word.id);
  if (lastWords.value.length > MAX_LAST_WORDS) {
    lastWords.value.shift();
  }
};

// ============================================================
//  МЕТОДЫ ИГРЫ
// ============================================================
const spawnAsteroid = () => {
  if (gameOver.value) return;

  const word = getNextWordFromQueue();
  if (!word) {
    gameOver.value = true;
    return;
  }

  currentWord.value = word;
  updateLastWords(word);

  // Правильный ответ - русский вариант
  const correctAnswer = word.ru;
  // Другие слова для вариантов
  const otherWords = words.value.filter(w => w.ru !== correctAnswer);
  const shuffledOthers = shuffle([...otherWords]);
  const wrongAnswers = shuffledOthers.slice(0, 3).map(w => w.ru);

  while (wrongAnswers.length < 3) {
    const fallback = ['???', 'Неизвестно', 'Ошибка', 'Неправильно'];
    wrongAnswers.push(fallback[wrongAnswers.length % fallback.length]);
  }

  const allAnswers = shuffle([correctAnswer, ...wrongAnswers]);
  answers.value = allAnswers;

  selectedAnswer.value = null;
  showCorrect.value = false;
  showWrong.value = false;
  explodeCorrect.value = false;
  explodeWrong.value = false;
  hitAsteroid.value = false;
  isProcessing.value = false;

  asteroidScale.value = 0.1;
  asteroidOpacity.value = 1;
  asteroidBlur.value = 10;

  if (animationFrame) cancelAnimationFrame(animationFrame);
  animateAsteroid();
};

const animateAsteroid = () => {
  const speed = BASE_SPEED * speedMultiplier.value;
  asteroidScale.value += speed;
  asteroidBlur.value = Math.max(0, 10 - asteroidScale.value * 30);

  if (asteroidScale.value >= 3.5) {
    asteroidHit();
    return;
  }

  if (asteroidScale.value >= 1.8) {
    asteroidOpacity.value = 0.7 + Math.sin(Date.now() / 200) * 0.3;
  }

  animationFrame = requestAnimationFrame(animateAsteroid);
};

const asteroidHit = () => {
  if (isProcessing.value || gameOver.value) return;
  isProcessing.value = true;
  hitAsteroid.value = true;

  document.querySelector('.space-detective')?.classList.add('shake');

  lives.value--;
  correctStreak.value = 0;

  if (lives.value <= 0) {
    gameOver.value = true;
    document.querySelector('.space-detective')?.classList.remove('shake');
    return;
  }

  setTimeout(() => {
    document.querySelector('.space-detective')?.classList.remove('shake');
    isProcessing.value = false;
    spawnAsteroid();
  }, 800);
};

const checkAnswer = (answer) => {
  if (isProcessing.value || gameOver.value) return;
  if (!currentWord.value) return;

  selectedAnswer.value = answer;
  totalAttempts.value++;

  // Сравниваем с русским вариантом (правильный ответ)
  const isCorrect = answer === currentWord.value.ru;

  if (isCorrect) {
    showCorrect.value = true;
    explodeCorrect.value = true;
    hits.value++;
    score.value += 50;
    correctStreak.value++;

    // Увеличиваем скорость при КАЖДОМ правильном ответе
    if (speedLevel.value < MAX_SPEED_LEVEL) {
      speedLevel.value++;
      speedPulse.value = true;
      setTimeout(() => { speedPulse.value = false; }, 500);
    }

    isProcessing.value = true;

    const pendingIndex = pendingWords.value.findIndex(w => w.id === currentWord.value.id);
    if (pendingIndex !== -1) {
      pendingWords.value.splice(pendingIndex, 1);
    }

    setTimeout(() => {
      explodeCorrect.value = false;
      showCorrect.value = false;
      isProcessing.value = false;
      spawnAsteroid();
    }, 600);
  } else {
    showWrong.value = true;
    explodeWrong.value = true;
    isProcessing.value = true;
    correctStreak.value = 0;
    addToPending(currentWord.value);

    setTimeout(() => {
      explodeWrong.value = false;
      showWrong.value = false;
      isProcessing.value = false;
    }, 600);
  }
};

const resetGame = () => {
  score.value = 0;
  lives.value = 3;
  hits.value = 0;
  totalAttempts.value = 0;
  gameOver.value = false;
  speedLevel.value = 1;
  correctStreak.value = 0;
  speedPulse.value = false;
  isProcessing.value = false;
  showCorrect.value = false;
  showWrong.value = false;
  explodeCorrect.value = false;
  explodeWrong.value = false;
  hitAsteroid.value = false;

  if (animationFrame) cancelAnimationFrame(animationFrame);

  const allWords = getWordSet(currentMission.value);
  if (allWords?.length > 0) {
    words.value = shuffle([...allWords]);
    initWordQueue();
  }

  document.querySelector('.space-detective')?.classList.remove('shake');
  spawnAsteroid();
};

// ============================================================
//  LIFECYCLE
// ============================================================
onMounted(() => {
  generateStars();

  const allWords = getWordSet(currentMission.value);
  if (allWords?.length > 0) {
    words.value = shuffle([...allWords]);
    initWordQueue();
    spawnAsteroid();
  }
});

onBeforeUnmount(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  document.querySelector('.space-detective')?.classList.remove('shake');
});
</script>

<style scoped lang="scss">
// ============================================================
//  ОБЕРТКА ТЕЛЕФОНА
// ============================================================
.phone-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: #0a0a0f;
}

#phoneFrame {
  position: relative;
  height: 700px;
  width: 340px;
  background: linear-gradient(to top, #1a1a2e 0%, #0a0a0f 100%);
  border-radius: 2em;
  border: solid 5px #6a6a6a;
  box-shadow:
    inset 0 0 2px 7px #000,
    inset 0 0 3px 7px #000,
    0 150px 200px -80px #000;
  overflow: hidden;
  flex-shrink: 0;
}

.inside-phone-frame {
  padding: 5px 10px;
  height: 100%;
  position: relative;
}

// ============================================================
//  ОСНОВНЫЕ СТИЛИ ИГРЫ
// ============================================================
.space-detective {
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
  overflow: hidden;
  font-family: 'Courier New', monospace;
  user-select: none;
  cursor: none;

  &.shake {
    animation: shake 0.3s ease-in-out;
  }
}

// ============================================================
//  ЗВЕЗДЫ — ЭФФЕКТ ГИПЕРПРОСТРАНСТВА
// ============================================================
.stars-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: hyperSpace var(--duration) linear infinite;
  animation-delay: var(--delay);
  opacity: var(--opacity);
  box-shadow: 0 0 2px rgba(255, 255, 255, 0.1);
}

@keyframes hyperSpace {
  0% {
    top: var(--start-y);
    left: var(--start-x);
    opacity: var(--opacity);
    transform: scale(0.3);
  }
  100% {
    top: var(--end-y);
    left: var(--end-x);
    opacity: 0;
    transform: scale(2);
  }
}

// ============================================================
//  ХАБ (ЖИЗНИ + СКОРОСТЬ + СЧЕТ)
// ============================================================
.hub {
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  z-index: 10;
}

.lives {
  display: flex;
  gap: 4px;
  font-size: 20px;

  .life-icon {
    transition: all 0.5s ease;

    &.lost {
      opacity: 0.15;
      transform: scale(0.7);
      filter: grayscale(1);
    }
  }
}

.speed-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  .speed-label {
    font-size: 7px;
    color: rgba(255, 255, 255, 0.2);
    letter-spacing: 2px;
    text-transform: uppercase;
    font-family: 'Courier New', monospace;
  }

  .speed-value {
    font-size: 22px;
    font-weight: 700;
    color: #00ffff;
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
    line-height: 1;
    font-family: 'Courier New', monospace;
    transition: all 0.3s ease;

    &.pulse {
      animation: speedPulse 0.4s ease;
    }
  }
}

@keyframes speedPulse {
  0% { transform: scale(1); color: #00ffff; }
  50% { transform: scale(1.4); color: #ff6b35; text-shadow: 0 0 40px rgba(255, 107, 53, 0.5); }
  100% { transform: scale(1); color: #00ffff; }
}

.score {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .score-label {
    font-size: 8px;
    color: rgba(255, 255, 255, 0.2);
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .score-value {
    font-size: 24px;
    font-weight: 700;
    color: #00ff88;
    text-shadow: 0 0 20px rgba(0, 255, 136, 0.15);
    line-height: 1;
  }
}

// ============================================================
//  АСТЕРОИД-СЛОВО
// ============================================================
.asteroid-container {
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 85%;
  max-width: 300px;
}

.asteroid-word {
  position: relative;
  font-size: 22px;
  font-weight: 700;
  color: #ff6b35;
  text-align: center;
  text-shadow: 0 0 30px rgba(255, 107, 53, 0.2);
  padding: 15px;
  word-break: break-word;
  transition: none;
  line-height: 1.3;

  &.explode-correct {
    animation: explodeCorrect 0.6s ease forwards;
  }

  &.explode-wrong {
    animation: explodeWrong 0.6s ease forwards;
  }

  &.hit {
    animation: explodeHit 0.5s ease forwards;
  }
}

.asteroid-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  border: 1px solid rgba(255, 107, 53, 0.08);
  border-radius: 50%;
  animation: pulseRing 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes pulseRing {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

// ============================================================
//  АНИМАЦИИ АСТЕРОИДА
// ============================================================
@keyframes explodeCorrect {
  0% {
    transform: scale(1);
    opacity: 1;
    color: #00ff88;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    color: #00ff88;
  }
}

@keyframes explodeWrong {
  0% {
    transform: scale(1);
    opacity: 1;
    color: #ff0040;
  }
  30% {
    transform: scale(1.15) rotate(8deg);
  }
  60% {
    transform: scale(0.85) rotate(-5deg);
  }
  100% {
    transform: scale(1);
    opacity: 1;
    color: #ff6b35;
  }
}

@keyframes explodeHit {
  0% {
    transform: scale(1);
    opacity: 1;
    color: #ff0040;
  }
  50% {
    transform: scale(1.6);
    opacity: 1;
    color: #ff0040;
    text-shadow: 0 0 60px rgba(255, 0, 64, 0.6);
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
    color: #ff0040;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10% { transform: translateX(-6px) rotate(-0.5deg); }
  20% { transform: translateX(6px) rotate(0.5deg); }
  30% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  50% { transform: translateX(-3px); }
  60% { transform: translateX(3px); }
  70% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
  90% { transform: translateX(-1px); }
}

// ============================================================
//  ОТВЕТЫ (СЕТКА 2×2)
// ============================================================
.answers-grid {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  z-index: 10;
  width: 92%;
  max-width: 300px;
}

.answer-btn {
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  font-family: 'Courier New', monospace;
  cursor: none;
  transition: all 0.2s ease;
  text-align: center;
  letter-spacing: 0.5px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
    color: #fff;
    transform: scale(1.02);
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &.correct-answer {
    background: rgba(0, 255, 136, 0.12);
    border-color: #00ff88;
    color: #00ff88;
    animation: correctPulse 0.3s ease;
  }

  &.wrong-answer {
    background: rgba(255, 0, 64, 0.12);
    border-color: #ff0040;
    color: #ff0040;
    animation: wrongPulse 0.3s ease;
  }
}

@keyframes correctPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}

@keyframes wrongPulse {
  0%, 100% { transform: scale(1); }
  30% { transform: scale(1.04) translateX(4px); }
  60% { transform: scale(0.96) translateX(-4px); }
}

// ============================================================
//  GAME OVER
// ============================================================
.game-over-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-radius: 2em;
  animation: fadeIn 0.4s ease;
}

.game-over-modal {
  background: radial-gradient(ellipse at center, #0a0a1a, #000000);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 24px;
  padding: 28px 24px;
  max-width: 280px;
  width: 90%;
  text-align: center;
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.modal-title {
  font-size: 18px;
  font-weight: 300;
  color: #00ffff;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin: 0 0 6px 0;
}

.modal-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.25);
  margin: 0 0 16px 0;
}

.modal-stats {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.25);
  margin-bottom: 18px;
  font-family: 'Courier New', monospace;
}

.modal-btn {
  padding: 10px 28px;
  background: transparent;
  border: 1px solid rgba(0, 255, 255, 0.15);
  border-radius: 30px;
  color: rgba(0, 255, 255, 0.5);
  font-size: 13px;
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
  cursor: none;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 255, 255, 0.05);
    border-color: rgba(0, 255, 255, 0.3);
    color: #00ffff;
    transform: scale(1.02);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

// ============================================================
//  АДАПТИВНОСТЬ
// ============================================================
@media (max-width: 380px) {
  #phoneFrame {
    height: 620px;
    width: 300px;
  }

  .asteroid-word {
    font-size: 18px;
  }

  .answer-btn {
    font-size: 12px;
    padding: 10px 10px;
    min-height: 42px;
  }

  .lives {
    font-size: 16px;
  }

  .score-value {
    font-size: 20px;
  }

  .speed-value {
    font-size: 18px;
  }

  .modal-title {
    font-size: 16px;
  }
}
</style>
