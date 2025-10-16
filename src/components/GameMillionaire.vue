<template>
  <div class="game-container">
    <!-- Прогресс бар -->
    <div class="progress-container">
      <div class="progress-bar">
        <div
          v-for="(isFirst, index) in firstTryCorrect"
          :key="index"
          class="progress-segment"
          :style="{
            width: `${100 / allQuestions.length}%`,
            'background-color': isFirst === true ? '#34aefa' :
                              isFirst === false ? '#f36f78' : 'transparent'
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

    <!-- Вопрос -->
    <div class="question-container">
      <div class="question-card">
        <!-- Аудио плеер -->
        <div v-if="currentQuestion.audio" class="audio-player">
          <audio
            ref="audioPlayer"
            :src="currentQuestion.audio"
            controls
            @play="onAudioPlay"
            @ended="onAudioEnd"
          ></audio>
          <button
            v-if="!isAudioPlaying"
            class="play-audio-button"
            @click="playAudio"
          >
            🔊 Проиграть аудио
          </button>
        </div>

        <div class="question-text">{{ currentQuestion.text }}</div>
        <img
          v-if="currentQuestion.questionPicture"
          :src="currentQuestion.questionPicture"
          alt="Question image"
          class="question-image"
        />
      </div>
    </div>


    <!-- Подсказки -->
    <div class="hints-container">
      <button
        class="hint-button fifty-fifty"
        @click="useFiftyFifty"
        :disabled="fiftyFiftyUsed || hintsDisabled"
      >
        <div class="hint-icon">50/50</div>
        <div class="hint-text">fifty фИфти</div>
      </button>

      <button
        class="hint-button ask-audience"
        @click="useAskAudience"
        :disabled="askAudienceUsed || hintsDisabled"
      >
        <div class="hint-icon">👥</div>
        <div class="hint-text">Спросить зал</div>
      </button>

      <button
        class="hint-button phone-friend"
        @click="usePhoneFriend"
        :disabled="phoneFriendUsed || hintsDisabled"
      >
        <div class="hint-icon">📞</div>
        <div class="hint-text">Звонок другу</div>
      </button>
    </div>
    <!-- Варианты ответов -->
    <div class="options-container">
      <div
        v-for="(option, key) in currentQuestion.options"
        :key="key"
        class="option-card"
        @click="checkAnswer(key, option)"
        :ref="el => optionRefs[key] = el"
        :class="{
          active: selectedOption === key && !isCorrect,
          correct: isCorrect && selectedOption === key,
          fade: isFading[key] || (fiftyFiftyUsed && !fiftyFiftyOptions.includes(key)),
          disabled: fiftyFiftyUsed && !fiftyFiftyOptions.includes(key)
        }"
        :style="{
          opacity: (isFading[key] || (fiftyFiftyUsed && !fiftyFiftyOptions.includes(key))) ? 0 : 1
        }"
      >
        <div class="option-label">{{ key }}</div>
        <div class="option-text">{{ option }}</div>
      </div>
    </div>


    <!-- Анимационные тексты -->
    <div v-if="errorText" class="error-text">{{ errorText }}</div>
    <div v-if="positiveText" class="positive-text">{{ positiveText }}</div>

    <!-- Модальное окно звонка другу - ОБНОВЛЕННОЕ -->
    <div v-if="showPhoneFriendModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Звонок другу</h3>
          <button class="modal-close" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <div class="friend-avatar">{{ phoneFriendData.avatar }}</div>
          <p class="friend-message">
            Ваш друг <strong>{{ phoneFriendData.name }}</strong> думает:
          </p>
          <div class="friend-suggestion">
            "{{ phoneFriendData.message }}"
          </div>
          <div class="friend-answer">
            {{ phoneFriendData.answerText }}
          </div>
          <div class="confidence-level">
            Уверенность друга: <span class="confidence-value">{{ phoneFriendData.confidence }}%</span>
          </div>

        </div>
      </div>
    </div>

    <!-- Модальное окно опроса зала -->
    <div v-if="showAudienceModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Результаты опроса зала</h3>
          <button class="modal-close" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <div class="audience-results">
            <div
              v-for="(option, key) in currentQuestion.options"
              :key="key"
              class="audience-result-item"
            >
              <div class="option-label-small">{{ key }}</div>
              <div class="result-bar-container">
                <div
                  class="result-bar"
                  :style="{ width: Math.max(0, audienceResults[key]) + '%' }"
                  :class="{ correct: key === currentQuestion.correctAnswer }"
                ></div>
                <span class="result-percentage">{{ Math.max(0, audienceResults[key]) }}%</span>
              </div>
            </div>
          </div>
          <p class="audience-note">Зал проголосовал за варианты ответов</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useGameStore } from 'stores/example-store';
import MillionaireData from '../dataForGames/MillionaireData';

const router = useRouter();
const route = useRoute();
const gameStore = useGameStore();

// Данные игры
const currentMission = ref('');
const currentGameData = ref([]);
const currentQuestion = ref({});
const selectedOption = ref(null);
const isCorrect = ref(false);
const currentQuestionIndex = ref(0);
const isFading = ref({});
const progressPercentage = ref(0);
const firstTryCorrect = ref([]);
const optionRefs = ref({});

// Аудио
const audioPlayer = ref(null);
const isAudioPlaying = ref(false);

// Подсказки
const fiftyFiftyUsed = ref(false);
const askAudienceUsed = ref(false);
const phoneFriendUsed = ref(false);
const fiftyFiftyOptions = ref([]);
const showPhoneFriendModal = ref(false);
const showAudienceModal = ref(false);
const audienceResults = ref({});
const hintsDisabled = computed(() => false); // Всегда разрешены или другая логика

// Данные для подсказки "Звонок другу"
const phoneFriendData = ref({
  name: '',
  avatar: '',
  confidence: 0,
  message: '',
  suggestedAnswer: '',
  answerText: ''
});

// Анимационные тексты
const errorText = ref('');
const positiveText = ref('');
const errorWords = ['oops!', 'boom!', 'ouch!', 'no!', 'я случайно!', 'f#.k!', 'damn!', 'crap!'];
const positiveWords = ['YES!', 'Great', 'Awesome', 'Super', 'Correct', 'йес!','yep!', 'yup','nice!','right!'];

// Статистика игры
const failedQuestions = ref([]);
const allQuestions = ref([]);
const matchedPairs = ref(0);
const mistakes = ref(0);
let startTime = null;

// Прогресс
const progressWidth = computed(() => `${progressPercentage.value}%`);

// Анимация прогресса
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

// Отслеживание прогресса
watch([matchedPairs, allQuestions], ([newMatched, allQuestionsList]) => {
  const totalQuestions = allQuestionsList.length;
  if (totalQuestions === 0) {
    progressPercentage.value = 0;
    return;
  }
  const percentage = (newMatched / totalQuestions) * 100;
  animateProgress(Math.min(percentage, 100));
}, { immediate: true });

// Аудио функции
const playAudio = () => {
  if (audioPlayer.value) {
    audioPlayer.value.play();
  }
};

const onAudioPlay = () => {
  isAudioPlaying.value = true;
};

const onAudioEnd = () => {
  isAudioPlaying.value = false;
};

// Подсказка 50/50
const useFiftyFifty = () => {
  if (fiftyFiftyUsed.value) return;

  fiftyFiftyUsed.value = true;
  const options = Object.keys(currentQuestion.value.options);
  const correctAnswer = currentQuestion.value.correctAnswer;

  // Убираем правильный ответ из списка для удаления
  const wrongOptions = options.filter(opt => opt !== correctAnswer);

  // Случайно выбираем 2 неправильных ответа для удаления
  const shuffledWrong = [...wrongOptions].sort(() => Math.random() - 0.5);
  const optionsToRemove = shuffledWrong.slice(0, 2);

  // Сохраняем оставшиеся варианты (правильный + один неправильный)
  fiftyFiftyOptions.value = options.filter(opt =>
    opt === correctAnswer || !optionsToRemove.includes(opt)
  );
};

// Подсказка "Спросить зал" - ИСПРАВЛЕННАЯ ВЕРСИЯ
const useAskAudience = () => {
  if (askAudienceUsed.value) return;

  askAudienceUsed.value = true;
  const options = Object.keys(currentQuestion.value.options);
  const correctAnswer = currentQuestion.value.correctAnswer;
  const wrongOptions = options.filter(opt => opt !== correctAnswer);

  // Правильный ответ получает от 51% до 77%
  const correctPercentage = Math.floor(Math.random() * 27) + 51;
  let remainingPercentage = 100 - correctPercentage;

  // Распределяем оставшиеся проценты между неправильными ответами
  const wrongPercentages = [];

  if (wrongOptions.length > 0) {
    // Для каждого неправильного ответа, кроме последнего
    for (let i = 0; i < wrongOptions.length - 1; i++) {
      // Гарантируем, что у нас останется хотя бы 1% для каждого оставшегося варианта
      const maxPossible = remainingPercentage - (wrongOptions.length - i - 1);
      if (maxPossible <= 0) {
        wrongPercentages.push(0);
      } else {
        const randomPercent = Math.floor(Math.random() * maxPossible) + 1;
        wrongPercentages.push(randomPercent);
        remainingPercentage -= randomPercent;
      }
    }

    // Последний неправильный ответ получает всё, что осталось (но не меньше 0)
    wrongPercentages.push(Math.max(0, remainingPercentage));
  }

  // Создаем объект результатов
  audienceResults.value = {};
  audienceResults.value[correctAnswer] = correctPercentage;

  // Перемешиваем проценты для неправильных ответов для реалистичности
  const shuffledWrongPercentages = [...wrongPercentages].sort(() => Math.random() - 0.5);

  wrongOptions.forEach((option, index) => {
    audienceResults.value[option] = shuffledWrongPercentages[index] || 0;
  });

  // Финальная проверка - убедимся, что сумма равна 100%
  const total = Object.values(audienceResults.value).reduce((sum, percent) => sum + percent, 0);
  if (total !== 100) {
    // Корректируем разницу, добавляя/убирая у правильного ответа
    const difference = 100 - total;
    audienceResults.value[correctAnswer] += difference;
  }

  showAudienceModal.value = true;
};
// Подсказка "Звонок другу" - ОБНОВЛЕННАЯ ВЕРСИЯ С РАНДОМНЫМИ СООБЩЕНИЯМИ
const usePhoneFriend = () => {
  if (phoneFriendUsed.value) return;

  phoneFriendUsed.value = true;

  const friends = {
    Vincent: {
      behavior: 'alwaysCorrect',
      confidence: 99,
      avatar: '👨‍💼',
      messages: [
        "Мы же это проходили с тобой!!!",
        "Сто процентиков май фрэнд!",
        "I am in a toilet, but I can tell you the answer very quickly",
        "Чисто на ощущениях",
        "Гарантирую своей репутацией!"
      ]
    },
    Russel: {
      behavior: 'random',
      confidence: 50,
      avatar: '👨‍🔬',
      messages: [
        "Хм... Думаю, это может быть правильный ответ",
        "Мамой клянусь, вроде бы этот!",
        "Вообще наугад, но пусть будет так",
        "Если честно, я не очень уверен...",
        "Да пофиг вообще, погнали в настолки лучше?",
        "Возможно этот, но это не точно!",
        "Монетку подбросил - выпал этот вариант"
      ]
    },
    Oleg: {
      behavior: 'alwaysWrong',
      confidence: Math.floor(Math.random() * 91) + 10, // 10-100%
      avatar: '🤵',
      messages: [
        "Я где-то это слышал!",
        "Точно помню - это правильный ответ!",
        "Мне кажется, мы это проходили",
        "Я бы поставил на этот вариант",
        "Не сомневайся, бери этот ответ!"
      ]
    },
    Joey: {
      behavior: 'alwaysWrong',
      confidence: Math.floor(Math.random() * 91) + 10, // 10-100%
      avatar: '🤵',
      messages: [
        "Мне Oleg подсказал",
        "У меня в резюме даже есть про это!",
        "Прям вообще ХЗ вообще",
        "I think...",
        "Мне некогда, ответь че-нить"
      ]
    },
    Rachel: {
      behavior: 'random',
      confidence: Math.floor(Math.random() * 71) + 25, // 25-95%
      avatar: '👩‍💻',
      messages: [
        "Мне кажется, это правильный вариант",
        "Думаю, стоит выбрать этот ответ",
        "По-моему, мы на верном пути",
        "Это выглядит логичным",
        "Я склоняюсь к этому варианту"
      ]
    },
    Alex: {
      behavior: 'random',
      confidence: Math.floor(Math.random() * 71) + 25, // 25-95%
      avatar: '👨‍🎓',
      messages: [
        "Я не совсем уверен, но попробуй",
        "Возможно, это тот самый ответ",
        "Наверное, стоит рискнуть с этим",
        "Если бы я был на твоем месте...",
        "Мой внутренний голос говорит этот вариант"
      ]
    },
    Patrick: {
      behavior: 'random',
      confidence: Math.floor(Math.random() * 71) + 25, // 25-95%
      avatar: '👨‍🏫',
      messages: [
        "Давай рискнем с этим вариантом!",
        "Я бы выбрал именно этот ответ",
        "Похоже, это правильное решение",
        "Смело бери этот вариант!",
        "Мой выбор пал на этот ответ"
      ]
    },
    Maria: {
      behavior: 'random',
      confidence: Math.floor(Math.random() * 51) + 40, // 40-90%
      avatar: '👩‍🎨',
      messages: [
        "Интуиция подсказывает мне этот ответ",
        "Чувствую, что это правильный вариант",
        "Что-то мне нравится этот выбор",
        "По ощущениям - этот ответ",
        "Мое шестое чувство говорит этот вариант"
      ]
    },
    Blondinka: {
      behavior: 'alwaysCorrect',
      confidence: Math.floor(Math.random() * 51) + 40, // 40-90%
      avatar: '👨‍💻',
      messages: [
        "Я проверяла - этот ответ верный",
        "Точно помню из учебника",
        "Это стопроцентно правильный вариант",
        "Не сомневайся, я знаю это",
        "Я специалист в этом вопросе"
      ]
    }
  };

  // Выбираем случайного друга
  const friendNames = Object.keys(friends);
  const randomFriendName = friendNames[Math.floor(Math.random() * friendNames.length)];
  const friend = friends[randomFriendName];

  // Выбираем случайное сообщение
  const randomMessage = friend.messages[Math.floor(Math.random() * friend.messages.length)];

  // Определяем какой ответ предложит друг
  let suggestedAnswer;
  const options = Object.keys(currentQuestion.value.options);
  const correctAnswer = currentQuestion.value.correctAnswer;
  const wrongOptions = options.filter(opt => opt !== correctAnswer);

  switch (friend.behavior) {
    case 'alwaysCorrect':
      suggestedAnswer = correctAnswer;
      break;
    case 'alwaysWrong':
      // Выбираем случайный неправильный ответ
      suggestedAnswer = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      break;
    case 'random':
      // Случайный ответ (может быть как правильным, так и нет)
      suggestedAnswer = options[Math.floor(Math.random() * options.length)];
      break;
  }

  // Сохраняем данные для модального окна
  phoneFriendData.value = {
    name: randomFriendName,
    avatar: friend.avatar,
    confidence: friend.confidence,
    message: randomMessage,
    suggestedAnswer: suggestedAnswer,
    answerText: currentQuestion.value.options[suggestedAnswer],
    behavior: friend.behavior
  };

  showPhoneFriendModal.value = true;
};

// Закрытие модальных окон
const closeModals = () => {
  showPhoneFriendModal.value = false;
  showAudienceModal.value = false;
};


// Добавьте эту функцию в раздел script
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Функция для перемешивания вариантов ответов
const shuffleOptions = (question) => {
  if (!question.options) return question;

  const optionsArray = Object.entries(question.options);
  const shuffledOptions = shuffleArray(optionsArray);

  // Создаем новый объект options с перемешанными ключами
  const newOptions = {};
  const newCorrectAnswerMap = {};

  shuffledOptions.forEach(([oldKey, value], index) => {
    const newKey = ['A', 'B', 'C', 'D'][index];
    newOptions[newKey] = value;

    // Запоминаем соответствие старых и новых ключей
    newCorrectAnswerMap[oldKey] = newKey;
  });

  // Обновляем правильный ответ
  const newCorrectAnswer = newCorrectAnswerMap[question.correctAnswer];

  return {
    ...question,
    options: newOptions,
    correctAnswer: newCorrectAnswer,
    originalCorrectAnswer: question.correctAnswer // Сохраняем для отладки
  };
};
const loadQuestion = async () => {
  // Сбрасываем подсказки для нового вопроса
  fiftyFiftyUsed.value = false;
  askAudienceUsed.value = false;
  phoneFriendUsed.value = false;
  fiftyFiftyOptions.value = [];
  isAudioPlaying.value = false;
  closeModals();

  // Завершение игры
  if (currentQuestionIndex.value >= allQuestions.value.length && failedQuestions.value.length === 0) {
    finishGame();
    return;
  }

  // Добавление неудачных вопросов
  if (currentQuestionIndex.value >= allQuestions.value.length && failedQuestions.value.length > 0) {
    allQuestions.value = [...allQuestions.value, ...failedQuestions.value];
    failedQuestions.value = [];
  }

  const questionData = allQuestions.value[currentQuestionIndex.value];

  // ПЕРЕМЕШИВАЕМ ВАРИАНТЫ ОТВЕТОВ ДЛЯ КАЖДОГО ВОПРОСА
  currentQuestion.value = shuffleOptions(questionData);

  selectedOption.value = null;
  isCorrect.value = false;
  isFading.value = {};

  await nextTick();
};

// Проверка ответа
const checkAnswer = (optionKey, optionValue) => {
  // УБИРАЕМ ПРОВЕРКУ НА БЛОКИРОВКУ
  // if (hintsDisabled.value) return;

  selectedOption.value = optionKey;
  const correctAnswer = currentQuestion.value.correctAnswer;
  isCorrect.value = (optionKey === correctAnswer);

  const isFirstAnswer = !firstTryCorrect.value[currentQuestionIndex.value] &&
    firstTryCorrect.value[currentQuestionIndex.value] !== false;

  if (isCorrect.value) {
    // Правильный ответ
    if (isFirstAnswer) {
      firstTryCorrect.value[currentQuestionIndex.value] = true;
    } else {
      firstTryCorrect.value[currentQuestionIndex.value] = false;
    }

    matchedPairs.value++;

    // Показ позитивного текста
    const showRandomPositive = Math.random() > 0.5;
    positiveText.value = showRandomPositive
      ? positiveWords[Math.floor(Math.random() * positiveWords.length)]
      : optionValue;

    // Анимация правильного ответа
    if (optionRefs.value[optionKey]) {
      optionRefs.value[optionKey].classList.add('correct-pulse');
    }

    setTimeout(() => {
      positiveText.value = '';
    }, 1200);

    setTimeout(() => {
      if (optionRefs.value[optionKey]) {
        optionRefs.value[optionKey].classList.remove('correct-pulse');
      }
    }, 1200);

    setTimeout(() => {
      currentQuestionIndex.value++;
      loadQuestion();
    }, 800);
  } else {
    // Неправильный ответ - НЕ БЛОКИРУЕМ, А ПРОДОЛЖАЕМ

    if (isFirstAnswer) {
      firstTryCorrect.value[currentQuestionIndex.value] = false;
    }

    // Добавление в неудачные вопросы
    const alreadyFailed = failedQuestions.value.some(
      (q) => q.text === currentQuestion.value.text
    );
    if (!alreadyFailed) {
      failedQuestions.value.push(currentQuestion.value);
    }

    // Анимация ошибки (оставляем для обратной связи)
    Object.values(optionRefs.value).forEach((el) => {
      if (!el) return;
      el.classList.add('shake');
    });

    mistakes.value += 1;

    // Показ текста ошибки
    errorText.value = errorWords[Math.floor(Math.random() * errorWords.length)];
    isFading.value[optionKey] = true;

    // Убираем тряску
    setTimeout(() => {
      Object.values(optionRefs.value).forEach((el) => {
        if (el) el.classList.remove('shake');
      });
    }, 500);

    // Сброс текста ошибки и ПЕРЕХОД К СЛЕДУЮЩЕМУ ВОПРОСУ
    setTimeout(() => {
      errorText.value = '';
      isFading.value[optionKey] = false;

      // ВАЖНО: ПЕРЕХОДИМ К СЛЕДУЮЩЕМУ ВОПРОСУ ДАЖЕ ПРИ ОШИБКЕ
      currentQuestionIndex.value++;
      loadQuestion();
    }, 1500);
  }
};

// Завершение игры
const finishGame = () => {
  const duration = Date.now() - startTime;
  gameStore.setLastGameResults(duration, mistakes.value);
  gameStore.setGameName("MillionaireGame");
  gameStore.setWordSet(currentMission.value);

  router.push({
    path: "/leader-board/",
    query: {
      missionName: currentMission.value
    }
  });
};

// Инициализация
onMounted(() => {
  currentMission.value = route.params.missionName;

  // Загрузка данных из MillionaireData
  const rawData = MillionaireData[currentMission.value] || [];

  // ПЕРЕМЕШИВАЕМ ВСЕ ВОПРОСЫ ПРИ ЗАПУСКЕ
  const shuffledQuestions = shuffleArray(rawData);

  // И ПЕРЕМЕШИВАЕМ ВАРИАНТЫ ОТВЕТОВ ДЛЯ КАЖДОГО ВОПРОСА
  currentGameData.value = shuffledQuestions.map(question => shuffleOptions(question));

  allQuestions.value = [...currentGameData.value];
  startTime = Date.now();
  firstTryCorrect.value = Array(allQuestions.value.length).fill(null);
  loadQuestion();
});
</script>

<style lang="scss" scoped>
.game-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.progress-container {
  position: relative;
  width: 100%;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-bottom: 30px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  display: flex;
  transition: width 0.5s ease;
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
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: bold;
  pointer-events: none;
}

.question-container {
  margin-bottom: 30px;
}

.question-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 3px solid #fff;
}

.audio-player {
  margin-bottom: 20px;

  audio {
    width: 100%;
    max-width: 300px;
    margin-bottom: 10px;
  }
}

.play-audio-button {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
}

.question-text {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin-bottom: 20px;
  line-height: 1.4;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.question-image {
  max-width: 200px;
  max-height: 150px;
  border-radius: 10px;
  border: 2px solid white;
}

.options-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin-bottom: 30px;
}

.option-card {
  background: white;
  border: 3px solid #4a5568;
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  min-height: 80px;

  &:hover:not(.disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.4 !important;
  }
}

.option-label {
  background: #4a5568;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
}

.option-text {
  font-size: 16px;
  font-weight: 500;
  color: #2d3748;
  line-height: 1.3;
  flex-grow: 1;
}

.option-card.active {
  background: #2d3748;
  border-color: #1a202c;

  .option-text {
    color: white;
  }
}

.option-card.correct {
  background: #48bb78;
  border-color: #2f855a;

  .option-text {
    color: white;
  }
}

.fade {
  opacity: 0;
  transition: opacity 0.9s ease;
}

/* Стили для подсказок */
.hints-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.hint-button {
  background: linear-gradient(135deg, #ffd89b, #19547b);
  border: none;
  border-radius: 15px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
}

.hint-icon {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.hint-text {
  font-size: 12px;
  font-weight: 600;
  color: white;
}

/* Модальные окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: modalAppear 0.3s ease;
}

.modal-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 30px;
}

.friend-avatar {
  font-size: 60px;
  text-align: center;
  margin-bottom: 20px;
}

.friend-message {
  font-size: 16px;
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.5;
}
.friend-suggestion {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 10px;
  padding: 12px 15px;
  text-align: center;
  font-style: italic;
  color: #1e40af;
  margin: 10px 0;
  line-height: 1.4;
}

.friend-answer {
  background: #e8f5e8;
  border: 2px solid #48bb78;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #2d3748;
  margin: 15px 0;
}

.confidence-level {
  text-align: center;
  margin: 15px 0;
  font-size: 14px;
  color: #4a5568;
}

.confidence-value {
  font-weight: bold;
  color: #2d3748;
}

.audience-results {
  space-y: 15px;
}

.audience-result-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.option-label-small {
  background: #4a5568;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
}

.result-bar-container {
  flex-grow: 1;
  background: #e2e8f0;
  border-radius: 10px;
  height: 30px;
  position: relative;
  overflow: hidden;
}

.result-bar {
  height: 100%;
  background: #4299e1;
  border-radius: 10px;
  transition: width 1s ease;

  &.correct {
    background: #48bb78;
  }
}

.result-percentage {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-weight: bold;
  color: #2d3748;
}

.audience-note {
  text-align: center;
  color: #718096;
  font-style: italic;
  margin-top: 20px;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.error-text, .positive-text {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 60px;
  font-weight: bold;
  animation: popIn 0.3s ease, popOut 0.2s ease-in 0.7s forwards;
  pointer-events: none;
  text-align: center;
  white-space: nowrap;
  z-index: 100;
}

.error-text {
  color: red;
  text-shadow: 0 0 10px rgba(255, 0, 0, 0.7);
}

.positive-text {
  color: #00ff00;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.7);
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
    transform: translate(-50%, -50%) scale(7);
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

@keyframes pulse-green {
  0% {
    box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7);
  }
  50% {
    box-shadow: 0 0 12px 6px rgba(72, 187, 120, 1);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7);
  }
}

.correct-pulse {
  animation: pulse-green 0.6s ease-in-out 0s 2;
  z-index: 3;
}

// Адаптивность
@media (max-width: 768px) {
  .options-container {
    grid-template-columns: 1fr;
  }



  .question-text {
    font-size: 20px;
  }

  .option-card {
    padding: 15px;
    min-height: 70px;
  }

  .error-text, .positive-text {
    font-size: 40px;
  }

  .audio-player {
    audio {
      max-width: 100%;
    }
  }
}
</style>
