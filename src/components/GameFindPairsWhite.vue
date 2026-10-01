<template>
  <div class="marginTop75">
    <div class="progress-container">
      <div class="progress-bar">
        <div
          v-for="(isFirst, index) in firstTryCorrect"
          :key="index"
          class="progress-segment"
          :style="{
            width: `${100 / allQuestions.length}%`,
            'background-color': isFirst === true ? '#2c7a4b' :
                              isFirst === false ? '#b02a37' : 'transparent'
          }"
        ></div>
      </div>
      <div
        class="progress-text"
        :style="{ opacity: progressPercentage > 75 ? 0 : 1 }"
      >
        {{ Math.round(progressPercentage) }}%
      </div>
    </div>

    <div class="test-header">
<!--      <h1 class="test-title">Exam</h1>-->
      <p class="test-subtitle">Нажми на верный перевод </p>
    </div>

    <div class="game-visual-wrapper">
      <svg class="lines-overlay" ref="svgLines" style="width: 100%; height: 100%; display: none;"></svg>

      <div class="game-container">
        <div class="wordCard main-word" ref="leftWord" @click="speakQuestion">
          {{ currentWord.ru }}
        </div>
        <div class="answers-container">
          <div
            v-for="(answer, index) in answers"
            :key="index"
            style="position: relative"
          >
            <div
              class="wordCard answer-card"
              @click="checkAnswer(answer.eng, index)"
              :ref="el => answerRefs[index] = el"
              :class="{
                active: selectedAnswer === answer.eng && !isCorrect,
                correct: isCorrect && selectedAnswer === answer.eng,
                fade: isFading[index]
              }"
              :style="{ opacity: isFading[index] ? 0 : 1 }"
            >
              <div>
                <div class="textOnCard">{{ answer.eng }}</div>
                <div v-if="answer.hint" class="hint">{{ answer.hint }}</div>
              </div>
            </div>

            <div v-if="errorTexts[index]" class="error-text">{{ errorTexts[index] }}</div>
            <div
              v-if="positiveTexts[index]"
              class="positive-text"
              :data-is-word="!positiveWords.includes(positiveTexts[index])"
            >
              {{ positiveTexts[index] }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- НИЖНЯЯ ПАНЕЛЬ -->
<!--    <div class="test-footer">-->
<!--      <div class="test-status">-->
<!--        Question {{ currentQuestionIndex + 1 }} of {{ allQuestions.length }}-->
<!--      </div>-->
<!--    </div>-->
    <!-- Кнопка mute -->
    <button
      class="sound-toggle"
      @click="toggleSound"
      :title="isSoundMuted ? 'Включить звук' : 'Выключить звук'"
    >
      <span v-if="isSoundMuted">🔇</span>
      <span v-else>🔊</span>
    </button>

  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useGameStore } from 'stores/example-store';
import shortWordsData from '../dataForGames/short-words-data';
import { useSpeech } from '../composables/useSpeech';


// Русский — рандом ТОЛЬКО среди русских голосов
const questionSpeech = useSpeech({
  defaultVoice: 'ru-google',
  randomByDefault: true,   // ← включаем рандом по умолчанию
  filterLang: 'ru',        // ← только русские
  rate: 0.9,
})

// Английский — только английские, фиксированный
const answerSpeech = useSpeech({
  defaultVoice: 'alex',
  filterLang: 'en',        // ← только английские
  rate: 0.9,
})



const speakQuestion = () => {
  if (!currentWord.value?.ru) return
  questionSpeech.speak(currentWord.value.ru, {
    random: true,          // ← случайный русский голос
    lang: 'ru-RU',
  })
}

// Синхронизация mute между двумя composable
const isSoundMuted = ref(false)

const toggleSound = () => {
  isSoundMuted.value = !isSoundMuted.value

  if (isSoundMuted.value) {
    questionSpeech.mute()
    answerSpeech.mute()
  } else {
    questionSpeech.unmute()
    answerSpeech.unmute()
  }
}

const router = useRouter();
const route = useRoute();
const gameStore = useGameStore();

const currentMission = ref();
const currentGameData = ref([]);
const currentWord = ref({});
const answers = ref([]);
const selectedAnswer = ref(null);
const isCorrect = ref(false);
const currentQuestionIndex = ref(0);
const isFading = ref([]);
const initialTotalQuestions = ref(0);
const totalQuestions = ref(0);
const matchedPairs = ref(0);
const progressPercentage = ref(0);
const firstTryCorrect = ref([]);
const leftWord = ref(null);
const answerRefs = ref([]);
const svgLines = ref(null);

const failedWords = ref([]);
const totalInitialWords = 12;
const allQuestions = ref([]);

const progressWidth = computed(() => `${progressPercentage.value}%`);

const handleButtonClick = () => {
  console.log("Кнопка нажата — резать провода!");
};

const animateProgress = (target) => {
  const duration = 500;
  const start = progressPercentage.value;
  const startTime = performance.now();

  const updateProgress = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    progressPercentage.value = start + (target - start) * progress;

    if (progress < 1) {
      requestAnimationFrame(updateProgress);
    }
  };

  requestAnimationFrame(updateProgress);
};

watch([matchedPairs, allQuestions], ([newMatched, allQuestionsList]) => {
  const totalQuestions = allQuestionsList.length;

  if (totalQuestions === 0) {
    progressPercentage.value = 0;
    return;
  }

  const percentage = (newMatched / totalQuestions) * 100;
  animateProgress(Math.min(percentage, 100));
}, { immediate: true });

const errorTexts = ref([]);

const errorWords = ['Incorrect', 'Not quite', 'Try again', 'Wrong', 'No', 'Missed'];
const positiveWords = ['Correct', 'Right', 'Well done', 'Yes', 'Exactly', 'Good'];
const positiveTexts = ref([]);

const getRandomColor = () => {
  return '#adb5bd';
};

const drawLines = () => {
  if (!leftWord.value || !svgLines.value || answerRefs.value.length === 0) return;

  const svg = svgLines.value;
  svg.innerHTML = '';

  const svgRect = svg.getBoundingClientRect();
  const leftRect = leftWord.value.getBoundingClientRect();

  answerRefs.value.forEach((el) => {
    if (!el) return;

    const answerRect = el.getBoundingClientRect();

    const x1 = leftRect.right - 5 - svgRect.left;
    const y1 = leftRect.top + leftRect.height / 2 - svgRect.top;
    const x2 = answerRect.left + 5 - svgRect.left;
    const y2 = answerRect.top + answerRect.height / 2 - svgRect.top;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', getRandomColor());
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-linecap', 'round');

    svg.appendChild(line);
  });
};

watch(currentWord, async () => {
  await nextTick();
  drawLines();
});

watch(() => answers.value, async () => {
  await nextTick();
  drawLines();
});

const shuffle = (array) => array.sort(() => Math.random() - 0.5);

const generateAnswers = (correctAnswer) => {
  const allItems = currentGameData.value;
  const correctItem = allItems.find(item => item.eng === correctAnswer);

  const otherItems = allItems.filter(item => item.eng !== correctAnswer);
  const shuffledOthers = shuffle([...otherItems]);

  const randomIncorrect = shuffledOthers.slice(0, 3);

  return shuffle([...randomIncorrect, correctItem]);
};

const loadQuestion = async () => {
  if (currentQuestionIndex.value >= allQuestions.value.length && failedWords.value.length === 0) {
    finishGame();
    return;
  }

  if (currentQuestionIndex.value >= allQuestions.value.length && failedWords.value.length > 0) {
    allQuestions.value = [...allQuestions.value, ...failedWords.value];
    failedWords.value = [];
  }

  const wordData = allQuestions.value[currentQuestionIndex.value];
  currentWord.value = wordData;

  const correctAnswer = wordData.eng;
  answers.value = generateAnswers(correctAnswer);
  selectedAnswer.value = null;
  isCorrect.value = false;
  isFading.value = Array(answers.value.length).fill(false);

  await nextTick();
  drawLines();
};

let shuffledData = [];
let mistakes = 0;

const checkAnswer = (answer, index) => {

  // Озвучка английского варианта — всегда одним голосом
  // answerSpeech.speak(answer, { voice: 'alex' })
  answerSpeech.speak(answer, { random: true })


  selectedAnswer.value = answer;
  const correctAnswer = currentWord.value.eng;

  isCorrect.value = (answer === correctAnswer);





  const isFirstAnswer = !firstTryCorrect.value[currentQuestionIndex.value] &&
    firstTryCorrect.value[currentQuestionIndex.value] !== false;

  if (isCorrect.value) {
    if (isFirstAnswer) {
      firstTryCorrect.value[currentQuestionIndex.value] = true;
    } else {
      firstTryCorrect.value[currentQuestionIndex.value] = false;
    }

    matchedPairs.value++;

    const showRandomPositive = Math.random() > 0.5;
    positiveTexts.value[index] = showRandomPositive
      ? positiveWords[Math.floor(Math.random() * positiveWords.length)]
      : answer;

    if (answerRefs.value[index]) {
      answerRefs.value[index].classList.add('correct-pulse');
    }
    if (leftWord.value) {
      leftWord.value.classList.remove('pulsing');
      leftWord.value.classList.add('correct-pulse');
    }

    setTimeout(() => {
      positiveTexts.value[index] = '';
    }, 1200);

    setTimeout(() => {
      if (answerRefs.value[index]) answerRefs.value[index].classList.remove('correct-pulse');
      if (leftWord.value) {
        leftWord.value.classList.remove('correct-pulse');
        leftWord.value.classList.add('pulsing');
      }
    }, 1200);

    setTimeout(() => {
      currentQuestionIndex.value++;
      loadQuestion();
    }, 800);
  } else {
    if (isFirstAnswer) {
      firstTryCorrect.value[currentQuestionIndex.value] = false;
    }
    const alreadyFailed = failedWords.value.some(
      (word) => word.ru === currentWord.value.ru
    );
    if (!alreadyFailed) {
      failedWords.value.push(currentWord.value);
    }
    answerRefs.value.forEach((el) => {
      if (el) el.classList.add('shake');
    });
    answerRefs.value.forEach((el) => {
      if (!el) return;

      const selectedRect = answerRefs.value[index].getBoundingClientRect();
      const selectedCenterX = selectedRect.left + selectedRect.width / 2;
      const selectedCenterY = selectedRect.top + selectedRect.height / 2;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = (centerX - selectedCenterX) * 0.6;
      const dy = (centerY - selectedCenterY) * 0.6;
      const angle = (Math.random() - 0.5) * 20;

      el.style.setProperty('--dx', `${dx}px`);
      el.style.setProperty('--dy', `${dy}px`);
      el.style.setProperty('--angle', `${angle}deg`);

      el.classList.add('explode');
      el.classList.add('shake');

      setTimeout(() => {
        el.classList.remove('explode');
        el.classList.remove('shake');
      }, 600);
    });

    setTimeout(() => {
      answerRefs.value.forEach((el) => {
        if (el) el.classList.remove('shake');
      });
    }, 500);
    mistakes += 1;

    errorTexts.value[index] = errorWords[Math.floor(Math.random() * errorWords.length)];

    isFading.value[index] = true;

    setTimeout(() => {
      errorTexts.value[index] = '';
    }, 1500);
  }
};

const finishGame = () => {
  const duration = Date.now() - startTime;
  gameStore.setLastGameResults(duration, mistakes);
  gameStore.setGameName("FindPairsWhite");
  gameStore.setWordSet(currentMission.value);

  router.push({
    path: "/leader-board/",
    query: {
      missionName: currentMission.value,
      from: "find-pairs-white",
    }
  });
};

let startTime = null;

onMounted(async () => {
  await questionSpeech.loadVoices()
  await answerSpeech.loadVoices()
  currentMission.value = route.params.missionName;

  const getWordSet = (name) => {
    if (shortWordsData[name]) return shortWordsData[name];

    for (const level in shortWordsData) {
      if (shortWordsData[level] && shortWordsData[level][name]) {
        return shortWordsData[level][name];
      }
    }
    return [];
  };

  currentGameData.value = getWordSet(currentMission.value);
  console.log(currentMission.value);
  shuffledData = shuffle([...currentGameData.value]).slice(0, 12);
  initialTotalQuestions.value = shuffledData.length;
  totalQuestions.value = initialTotalQuestions.value;
  allQuestions.value = [...shuffledData];
  startTime = Date.now();
  loadQuestion();
  firstTryCorrect.value = Array(allQuestions.value.length).fill(null);

});
</script>

<style lang="scss" scoped>
/* ==================== ОСНОВНОЙ КОНТЕЙНЕР ==================== */
.marginTop75 {
  margin-top: 75px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 30px 40px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
  font-family: 'Georgia', 'Times New Roman', serif;
  border: 1px solid #e9ecef;
}

/* ==================== ПРОГРЕСС-БАР ==================== */
.progress-container {
  position: relative;
  width: 100%;
  height: 6px;
  background-color: #e9ecef;
  border-radius: 3px;
  margin-bottom: 40px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  display: flex;
}

.progress-segment {
  height: 100%;
  transition: background-color 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #495057;
  font-size: 10px;
  font-weight: 600;
  pointer-events: none;
  font-family: 'Georgia', serif;
}

/* ==================== ЗАГОЛОВОК ТЕСТА ==================== */
.test-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.test-title {
  font-size: 28px;
  font-weight: 400;
  color: #212529;
  margin: 0 0 8px 0;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: Special_f1;
}

.test-subtitle {
  font-size: 15px;
  color: #6c757d;
  margin: 0;
  font-style: italic;
  font-family: Special_f1;
}

/* ==================== КОНТЕЙНЕР ВОПРОСА И ОТВЕТОВ ==================== */
.game-visual-wrapper {
  position: relative;
}

.lines-overlay {
  position: absolute;
  top: -15px;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.game-container {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  gap: 12px;
}

/* ==================== КАРТОЧКИ ==================== */
.wordCard {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 16px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  user-select: none;
  color: #212529;
  transition: all 0.15s ease;
  font-family: 'Georgia', serif;
  min-height: 56px;
}

.wordCard:hover {
  border-color: #495057;
  background-color: #f8f9fa;
}

.hint {
  font-size: 13px;
  color: #868e96;
  line-height: 1.2;
  margin-top: 4px;
  font-style: italic;
}

.textOnCard {
  font-size: 17px;
  font-weight: 400;
  line-height: 1.3;
}

/* Вопрос */
.main-word {
  font-size: 20px;
  font-weight: 500;
  font-style: normal;
  line-height: 1.4;
  min-height: 90px;
  padding: 24px;
  background-color: #bcc0c3;
  border: 2px solid #212529;
  border-radius: 4px;
  word-break: break-word;
  overflow-wrap: break-word;
  margin-bottom: 20px;
  cursor: default;
}

.main-word:hover {
  background-color: #f8f9fa;
  border-color: #212529;
}

/* Убираем пульсацию */
.pulsing {
  animation: none;
}

/* ==================== КОНТЕЙНЕР ОТВЕТОВ ==================== */
.answers-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ==================== СОСТОЯНИЯ КАРТОЧЕК ==================== */
.active {
  background-color: #212529;
  color: #ffffff;
  border-color: #212529;
}

.correct {
  background-color: #d1e7dd;
  border-color: #2c7a4b;
  color: #0f5132;
}

.fade {
  opacity: 0;
  transition: opacity 0.9s ease;
}

/* ==================== ТЕКСТЫ ОШИБОК И УСПЕХА ==================== */
.error-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: 500;
  color: #b02a37;
  animation: popIn 0.3s ease, popOut 0.3s ease-in 0.8s forwards;
  pointer-events: none;
  text-align: center;
  white-space: nowrap;
  z-index: 10;
  font-family: 'Georgia', serif;
  letter-spacing: 1px;
}

.positive-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: 500;
  color: #2c7a4b;
  animation: popIn 0.3s ease, popOut 0.3s ease-in 0.8s forwards;
  pointer-events: none;
  text-align: center;
  white-space: nowrap;
  z-index: 10;
  font-family: 'Georgia', serif;
  letter-spacing: 1px;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes popOut {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

/* ==================== АНИМАЦИИ ОШИБКИ (ОСТАВЛЕНЫ) ==================== */
@keyframes shake-slight {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(1.5deg); }
  50% { transform: rotate(-1.5deg); }
  75% { transform: rotate(1deg); }
  100% { transform: rotate(0deg); }
}

.shake {
  animation: shake-slight 0.4s ease-in-out;
}

@keyframes explode-realistic {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 1;
  }
  30% {
    transform: translate(var(--dx, 0px), var(--dy, 0px)) scale(1.02) rotate(var(--angle, 0deg));
    opacity: 0.85;
  }
  60% {
    transform: translate(calc(var(--dx) * 0.8), calc(var(--dy) * 0.8)) scale(0.99) rotate(0deg);
    opacity: 0.7;
  }
  100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 1;
  }
}

.explode {
  animation: explode-realistic 0.5s cubic-bezier(0.42, 0, 0.58, 1);
  will-change: transform;
}

/* ==================== АНИМАЦИИ ПРАВИЛЬНОГО ОТВЕТА ==================== */
@keyframes pulse-green {
  0% {
    box-shadow: 0 0 0 0 rgba(44, 122, 75, 0.5);
  }
  50% {
    box-shadow: 0 0 8px 2px rgba(44, 122, 75, 0.7);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(44, 122, 75, 0.5);
  }
}

.correct-pulse {
  animation: pulse-green 0.6s ease-in-out 0s 2;
  z-index: 3;
  border-color: #2c7a4b !important;
}

@keyframes pulse-wrong {
  0% {
    box-shadow: 0 0 0 0 rgba(176, 42, 55, 0.5);
  }
  50% {
    box-shadow: 0 0 10px 3px rgba(176, 42, 55, 0.7);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(176, 42, 55, 0.5);
  }
}

.wrong-pulse {
  animation: pulse-wrong 0.6s ease-in-out 1;
  z-index: 3;
}

/* ==================== НИЖНЯЯ ПАНЕЛЬ ==================== */
.test-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
  text-align: center;
}

.test-status {
  font-size: 13px;
  color: #6c757d;
  font-family: 'Georgia', serif;
  letter-spacing: 1px;
  text-transform: uppercase;
}
/* ==================== КНОПКА MUTE ==================== */
.sound-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px auto 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 2px solid #ced4da;
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  color: #212529;
}

.sound-toggle:hover {
  background-color: #f8f9fa;
  border-color: #495057;
  transform: scale(1.05);
}

.sound-toggle:active {
  transform: scale(0.98);
}




/* ==================== АДАПТИВ ==================== */
@media (max-width: 600px) {
  .marginTop75 {
    padding: 20px 16px;
    margin-top: 60px;
  }

  .sound-toggle {
    width: 48px;
    height: 48px;
    font-size: 20px;
    margin-top: 20px;
  }
  .test-title {
    font-size: 22px;
    letter-spacing: 1px;
  }

  .test-subtitle {
    font-size: 13px;
  }

  .main-word {
    padding: 18px;
    min-height: 80px;
  }

  .textOnCard {
    font-size: 16px;
  }

  .error-text,
  .positive-text {
    font-size: 20px;
  }

  .test-status {
    font-size: 11px;
  }
}
</style>
