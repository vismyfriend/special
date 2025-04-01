<template>
  <div class="progress-container">
    <div class="progress-bar" :style="{ width: progressWidth }"></div>
    <!-- Показываем проценты только если прогресс больше 0% -->
    <div class="progress-text" v-if="progressPercentage > 0">{{ progressPercentage }}%</div>
  </div>
  <div class="game-container" v-if="currentGameData">
    <div class="wordCard">
      {{ currentWord.ru }}
    </div>
    <div class="answers-container">
      <div
        class="wordCard"
        v-for="(answer, index) in answers"
        :key="index"
        @click="checkAnswer(answer, index)"
        :class="{
          active: selectedAnswer === answer && !isCorrect,
          correct: isCorrect && selectedAnswer === answer,
          fade: isFading[index]
        }"
        :style="{ opacity: isFading[index] ? 0 : 1 }"
      >
        {{ answer }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import shortWordsData from '../dataForGames/short-words-data';
import { computed, onMounted, ref, watch } from 'vue';
import { useGameStore } from 'stores/example-store';

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
const isFading = ref([]); // Массив для отслеживания состояния анимации

const totalPairs = ref(12); // Общее количество пар для статус бара
const matchedPairs = ref(0); // Количество правильных ответов
const progressPercentage = ref(0); // Текущий процент прогресса, который будет анимироваться


// Плавное обновление процентов прогресса
const animateProgress = (target) => {
  const step = () => {
    const diff = target - progressPercentage.value;
    if (Math.abs(diff) > 1) {
      progressPercentage.value += Math.sign(diff);
      requestAnimationFrame(step);
    } else {
      progressPercentage.value = target; // Устанавливаем точно
    }
  };
  requestAnimationFrame(step);
};

// Плавный прогресс-бар
const progressWidth = computed(() => {
  return `${progressPercentage.value}%`;
});

// Отслеживаем изменения в matchedPairs и запускаем анимацию
watch(matchedPairs, (newValue) => {
  const targetPercentage = Math.round((newValue / totalPairs.value) * 100);
  animateProgress(targetPercentage); // Анимируем прогресс
});


let startTime = null; // Время начала игры
let shuffledData = []; // Перемешанные данные

// Функция для перемешивания массива
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

// Загружаем вопрос и генерируем ответы
const loadQuestion = () => {
  if (shuffledData.length === 0) {
    console.error("Нет данных для игры.");
    return;
  }

  if (currentQuestionIndex.value >= shuffledData.length) {
    finishGame();
    return;
  }

  const wordData = shuffledData[currentQuestionIndex.value];
  currentWord.value = wordData;
  const correctAnswer = wordData.eng; // Правильный ответ на русском
  answers.value = generateAnswers(correctAnswer);
  selectedAnswer.value = null;
  isCorrect.value = false;
  isFading.value = Array(answers.value.length).fill(false); // Сброс состояния анимации
};

// Генерация случайных ответов
const generateAnswers = (correctAnswer) => {
  const allAnswers = currentGameData.value.map(item => item.eng); // Получаем все ответы
  const uniqueAnswers = [...new Set(allAnswers)];

  // Если меньше 4 уникальных ответов, возвращаем все уникальные
  if (uniqueAnswers.length < 4) {
    return uniqueAnswers; // Или можно добавить дополнительные случайные ответы
  }

  const incorrectAnswers = uniqueAnswers.filter(ans => ans !== correctAnswer).slice(0, 3);
  incorrectAnswers.push(correctAnswer); // Добавляем правильный ответ
  return shuffle(incorrectAnswers); // Перемешиваем ответы
};

let mistakes = 0;

// Проверка ответа
const checkAnswer = (answer, index) => {
  selectedAnswer.value = answer;
  const correctAnswer = currentWord.value.eng; // Правильный ответ
  isCorrect.value = (answer === correctAnswer);

  if (isCorrect.value) {
    matchedPairs.value++; // Увеличиваем количество правильных ответов для прогресс-бара
    setTimeout(() => {
      currentQuestionIndex.value++;
      if (currentQuestionIndex.value < currentGameData.value.length) {
        loadQuestion();
      } else {
        finishGame();
      }
    }, 800);
  } else {
    mistakes += 1;

    // Устанавливаем анимацию только для неверного ответа
    isFading.value[index] = true; // Устанавливаем состояние анимации

    // Убираем элемент через 500 мс, когда анимация завершится
    setTimeout(() => {
      // answers.value.splice(index, 1); // Удаление больше не требуется
    }, 500); // Время должно совпадать с длительностью анимации
  }
};

// Завершение игры и отправка результата
const finishGame = () => {
  const endTime = Date.now();
  const duration = endTime - startTime; // Время в миллисекундах
  const minutes = Math.floor((duration / 1000) / 60);
  const seconds = Math.floor((duration / 1000) % 60);
  const milliseconds = duration % 1000;

  // Отправляем результаты в бэкенд
  gameStore.setLastGameResults(duration, mistakes);
  gameStore.setGameName("FindPairsEasy");

  router.push("/leader-board/");
};

// В onMounted перемешиваем данные
onMounted(() => {
  currentMission.value = route.params.missionName;
  currentGameData.value = shortWordsData[currentMission.value] || [];

  // Перемешиваем данные один раз и выбираем 12 случайных
  shuffledData = shuffle([...currentGameData.value]).slice(0, 12);

  startTime = Date.now(); // Запоминаем время начала игры
  loadQuestion();
});
</script>
<style lang="scss" scoped>
.progress-container {
  position: relative; /* Для корректного позиционирования текста прогресса */
  width: 100%;
  height: 20px; /* Высота полоски прогресса */
  background-color: rgba(0, 0, 0, 0.1); /* Полупрозрачный фон */
  border-radius: 10px; /* Закругление углов */
  margin-bottom: 20px; /* Отступ снизу */
}

.progress-bar {
  height: 100%;
  background-color: green; /* Цвет заполнения */
  border-radius: 10px; /* Закругление углов */
  transition: width 0.5s ease; /* Плавное заполнение */
}

/* Обновляем .progress-text, чтобы точно центрировать внутри прогресс-бара */
.progress-text {
  position: absolute;
  top: 50%; /* Центрируем по вертикали */
  left: 50%; /* Центрируем по горизонтали */
  transform: translate(-50%, -50%); /* Корректное центрирование */
  color: rgba(255, 255, 255, 0.6); /* Полупрозрачный белый */
  font-size: 12px;
  font-weight: bold;
}
.game-container {
  display: flex;
  flex-direction: row;
  align-items: center; /* Центрируем содержимое по горизонтали */
  margin-top: 30px;
  justify-content: center;
}

.wordCard {
  background-color: #f9f9f9; /* Цвет фона карточки */
  border: 2px solid #e90e0e; /* Цвет границы */
  border-radius: 20px; /* Закругление углов */
  height: 50px;
  padding: 5px;
  display: flex; /* Используем flexbox */
  justify-content: center; /* Горизонтальное выравнивание по центру */
  align-items: center; /* Вертикальное выравнивание по центру */
  cursor: pointer; /* Указатель мыши при наведении */
  margin: 1.5px;
  user-select: none;
  color: black;
  transition: opacity 0.5s ease; /* Плавный переход для анимации */
  margin-right: 25px;
  width: 120px;
}

.answers-container {
  margin-top: 20px; /* Отступ сверху для контейнера с ответами */
  width: 120px;
}

.active {
  background-color: black;
  color: white;
}

.correct {
  background-color: green; /* Цвет для правильного ответа */
}

.fade {
  opacity: 0; /* Применяется через стиль, а не через класс */
  transition: opacity 0.9s ease; /* Плавная анимация исчезновения */
}
</style>
