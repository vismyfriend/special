<template>
  <div class="progress-container">
    <div class="progress-bar" :style="{ width: progressWidth }"></div>
    <div class="progress-text" v-if="progressPercentage > 0">{{ progressPercentage }}%</div>
  </div>

  <div class="game-visual-wrapper">
    <svg class="lines-overlay" ref="svgLines" style="width: 100%; height: 100%;"></svg>

    <div class="game-container">
      <div class="wordCard main-word" ref="leftWord">
        {{ currentWord.ru }}
      </div>
      <div class="answers-container">
        <div
          v-for="(answer, index) in answers"
          :key="index"
          style="position: relative"
        >
          <div
            class="wordCard"
            @click="checkAnswer(answer, index)"
            :ref="el => answerRefs[index] = el"
            :class="{
      active: selectedAnswer === answer && !isCorrect,
      correct: isCorrect && selectedAnswer === answer,
      fade: isFading[index]
    }"
            :style="{ opacity: isFading[index] ? 0 : 1 }"
          >
            {{ answer }}
          </div>

          <!-- Вынесли из .wordCard, но оставили в v-for -->
          <div v-if="errorTexts[index]" class="error-text">{{ errorTexts[index] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useGameStore } from 'stores/example-store';
import shortWordsData from '../dataForGames/short-words-data';

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

const totalPairs = ref(12);
const matchedPairs = ref(0);
const progressPercentage = ref(0);

const leftWord = ref(null);
const answerRefs = ref([]);
const svgLines = ref(null);

const progressWidth = computed(() => `${progressPercentage.value}%`);

const animateProgress = (target) => {
  const step = () => {
    const diff = target - progressPercentage.value;
    if (Math.abs(diff) > 1) {
      progressPercentage.value += Math.sign(diff);
      requestAnimationFrame(step);
    } else {
      progressPercentage.value = target;
    }
  };
  requestAnimationFrame(step);
};

watch(matchedPairs, (newValue) => {
  const targetPercentage = Math.round((newValue / totalPairs.value) * 100);
  animateProgress(targetPercentage);
});

const errorTexts = ref([]); // Сюда будем помещать 'oops!', 'boom!', и т.д.

const errorWords = ['oops!', 'boom!', 'ouch!', 'no!', 'я случайно!', 'f#ck'];


const getRandomColor = () => {
  // Возвращает случайный яркий цвет
  const colors = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const drawLines = () => {
  // Проверяем, что все элементы доступны
  if (!leftWord.value || !svgLines.value || answerRefs.value.length === 0) return;

  const svg = svgLines.value;
  svg.innerHTML = ''; // Очищаем предыдущие линии

  const svgRect = svg.getBoundingClientRect();
  const leftRect = leftWord.value.getBoundingClientRect();

  // Для каждого ответа рисуем линию от левого слова

  answerRefs.value.forEach((el) => {
    if (!el)
      return;

    const answerRect = el.getBoundingClientRect();

    // Координаты центра слова и центра ответа
    const x1 = leftRect.right - leftRect.width / 4 - svgRect.left;
    const y1 = leftRect.top + leftRect.height / 2 - svgRect.top;
    const x2 = answerRect.left + answerRect.width / 4 - svgRect.left;
    const y2 = answerRect.top + answerRect.height / 2 - svgRect.top;

    // Создаём SVG-линию
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', getRandomColor()); // Случайный цвет
    line.setAttribute('stroke-width', '3'); // Толще — как провод
    line.setAttribute('stroke-linecap', 'round'); // Скруглённые концы

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
  const allAnswers = currentGameData.value.map(item => item.eng);
  const uniqueAnswers = [...new Set(allAnswers)];
  if (uniqueAnswers.length < 4) return uniqueAnswers;

  const incorrectAnswers = uniqueAnswers.filter(ans => ans !== correctAnswer).slice(0, 3);
  incorrectAnswers.push(correctAnswer);
  return shuffle(incorrectAnswers);
};

const loadQuestion = async () => {
  if (shuffledData.length === 0 || currentQuestionIndex.value >= shuffledData.length) {
    finishGame();
    return;
  }

  const wordData = shuffledData[currentQuestionIndex.value];
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
  selectedAnswer.value = answer;
  const correctAnswer = currentWord.value.eng;
  isCorrect.value = (answer === correctAnswer);

  if (isCorrect.value) {
    matchedPairs.value++;
    setTimeout(() => {
      currentQuestionIndex.value++;
      loadQuestion();
    }, 800);
  } else {

    // Добавляем всем карточкам эффект тряски
    answerRefs.value.forEach((el) => {
      if (el) el.classList.add('shake');
    });
    answerRefs.value.forEach((el) => {
      if (!el) return;

      // Центр выбранной карточки
      const selectedRect = answerRefs.value[index].getBoundingClientRect();
      const selectedCenterX = selectedRect.left + selectedRect.width / 2;
      const selectedCenterY = selectedRect.top + selectedRect.height / 2;


      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Вектор от выбранной карточки наружу
      const dx = (centerX - selectedCenterX) * 0.6;
      const dy = (centerY - selectedCenterY) * 0.6;
      const angle = (Math.random() - 0.5) * 20; // чуть рандомности

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

// Убираем тряску через 500мс
    setTimeout(() => {
      answerRefs.value.forEach((el) => {
        if (el) el.classList.remove('shake');
      });
    }, 500);
    mistakes += 1;

    // Показываем случайный "ошибочный" текст
    errorTexts.value[index] = errorWords[Math.floor(Math.random() * errorWords.length)];

    // Запускаем анимацию исчезновения
    isFading.value[index] = true;

    // Через 1.5 сек убираем текст ошибки
    setTimeout(() => {
      errorTexts.value[index] = '';
    }, 1500);
  }
};
const finishGame = () => {
  const duration = Date.now() - startTime;
  gameStore.setLastGameResults(duration, mistakes);
  gameStore.setGameName("FindPairsEasy");
  router.push("/leader-board/");
};

let startTime = null;

onMounted(() => {
  currentMission.value = route.params.missionName;
  currentGameData.value = shortWordsData[currentMission.value] || [];
  shuffledData = shuffle([...currentGameData.value]).slice(0, 12);
  startTime = Date.now();
  loadQuestion();
});
</script>

<style lang="scss" scoped>
.progress-container {
  position: relative;
  width: 100%;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-bottom: 20px;
}

.progress-bar {
  height: 100%;
  background-color: #34aefa;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: bold;
}

.game-visual-wrapper {
  position: relative;
}

.lines-overlay {
  position: absolute;
  top: 0;
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
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.wordCard {
  position: relative; // relative;, чтобы .error-text позиционировался внутри:

  background-color: #f9f9f9;
  border: 2px solid #e90e0e;
  border-radius: 20px;
  height: 50px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 1.5px;
  margin-right: 25px;
  user-select: none;
  color: black;
  transition: opacity 0.5s ease;
  width: 120px;
}

.answers-container {
  margin-top: 20px;
  width: 120px;
}

.active {
  background-color: black;
  color: white;
}

.correct {
  background-color: green;
}

.fade {
  opacity: 0;
  transition: opacity 0.9s ease;
}
.error-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 60px;
  font-weight: bold;
  color: red;
  animation: popIn 0.3s ease, popOut 0.2s ease-in 0.7s forwards;
  pointer-events: none;
  text-align: center;
  white-space: nowrap;
  z-index: 10; // чтобы не пряталось под другими элементами
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
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
    transform: translate(-50%, -50%) scale(7); // Вылетает сильно!
  }
}

@keyframes shake-slight {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(2.2deg); }
  50% { transform: rotate(-2.2deg); }
  75% { transform: rotate(2deg); }
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
    transform: translate(var(--dx, 0px), var(--dy, 0px)) scale(1.05) rotate(var(--angle, 0deg));
    opacity: 0.8;
  }
  60% {
    transform: translate(calc(var(--dx) * 0.8), calc(var(--dy) * 0.8)) scale(0.98) rotate(0deg);
    opacity: 0.6;
  }
  100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 1;
  }
}

.explode {
  animation: explode-realistic 0.5s cubic-bezier(0.42, 0, 0.58, 1); // плавный «взрыв» и возврат
  will-change: transform;
}

</style>
