<template>
  <div class="container">
    <!-- Затемнение фона -->
    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <!-- Модальное окно -->
      <div class="modal">
        <div class="modal-header">
          <span class="modal-icon">⚠️</span>
          <h3>А чего это ? <br>You ain't a lazy ass, r u?</h3>
        </div>
        <div class="modal-content">
          <p>{{ modalMessage }}</p>
          <ul class="missing-words-list">
            <li v-for="word in missingWords" :key="word.ru">
              {{ word.ru }}
            </li>
          </ul>
          <p class="modal-hint">Пожалуйста, заполните все поля перед отправкой.</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn" @click="showModal = false">
            Оу кэй! Ща сделаю! ✏️
          </button>
        </div>
      </div>
    </div>

    <div class="notebook-wrapper" :style="{ height: notebookHeight + 'px' }">
      <!-- Обложка тетради -->
      <div class="notebook-cover">
        <!-- Лист тетради в клетку -->
        <div class="notebook-page">
          <!-- Сетка тетради -->
          <div class="notebook-grid"></div>

          <!-- Содержимое тетради -->
          <div class="notebook-content" ref="contentRef">
            <!-- Заголовок урока -->
            <div class="lesson-title">
              Homework - домашка
            </div>

            <div class="textInLine">
              <div class="lesson-title"></div>
              <p class="textRight">" {{ currentMission }} "</p>
              <div class="lesson-title"></div>

              <p class="fontAm">1. Вслух прочитай <a href="#" @click.prevent="goToAnontherComponent" class="words-link"> <b>все WORDS</b></a> с урока</p>
              <div class="textInLine" v-if="!harderModeEnabled">
                <p class="fontAm">2. Введи перевод этих трёх слов/фраз:</p>
                <div class="lesson-title"></div>
              </div>

              <div class="textInLine" v-if="harderModeEnabled">
                <p class="fontAm">2. Напиши разговорные предложения:</p>
                <div class="lesson-title"></div>
              </div>
            </div>

            <!-- Секция домашнего задания -->
            <div class="homework-section" v-if="showHomeworkSection">
              <div class="homework-content">
                <div class="homework-words">
                  <div class="homework-word" v-for="(word, index) in homeworkWords" :key="'hw-' + index">
                    <div class="word-header">
                      <span class="word-to-translate">{{ word.ru }}</span>
                      <span class="hint-icon" v-if="word.hint && !word.showHint" @click="toggleHint(word)">
                        🔍️ подсказка
                      </span>
                    </div>

                    <!-- Показываем подсказку только если она активна -->
                    <div class="hint-content" v-if="word.showHint">
                      <span class="hint-text">{{ word.hint }}</span>
                    </div>

                    <!-- Поле для перевода (только в обычном режиме) -->
                    <input
                      v-if="!harderModeEnabled"
                      type="text"
                      v-model="word.userTranslation"
                      :placeholder="'введите перевод...'"
                      class="translation-input"
                    >

                    <!-- Три поля для сложного режима -->
                    <div v-if="harderModeEnabled" class="sentences-group">

                      <input
                        type="text"
                        v-model="word.affirmativeSentence"
                        :placeholder="'+ Утверждение'"
                        class="translation-input sentence-input"
                      >
                      <input
                        type="text"
                        v-model="word.negativeSentence"
                        :placeholder="'- Отрицание'"
                        class="translation-input sentence-input"
                      >
                      <input
                        type="text"
                        v-model="word.questionSentence"
                        :placeholder="'? Любой вопрос'"
                        class="translation-input sentence-input"
                      >
                    </div>
                  </div>
                </div>

                <div class="textInLine">
                  <div class="lesson-title"></div>
                  <p class="fontAm">3. <b>Ручкой</b> на любой бумажке или в своей тетради <b>напиши</b> что-нибудь по-английски, <b>сфотографируй</b> и send to Винсенту.</p>
                </div>

                <div class="buttons-wrapper">
                  <button class="harder-homework-btn" @click="goToHarderHomework">
                    {{ harderModeEnabled ? 'вернуть полегче домашку' : '⭐ хочу домашку посложнее' }}
                  </button>
                  <button class="homework-submit-btn" @click="handleSendClick">
                    отправить на проверку
                  </button>
                </div>

                <!-- Контейнер с гифкой -->
                <div class="gif-container" v-if="currentGif">
                  <img :src="currentGif" alt="funny gif" class="random-gif" @click="changeGif">
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import shortWordsData from '../dataForGames/short-words-data';

import gifMissionIsPossible from '/src/assets/images/gifs/missionIsPossible.gif';
import gifDoYouUnderstand from '/src/assets/images/gifs/doYouUnderstand.gif';
import gifWhatIsUp1 from '/src/assets/images/gifs/whatIsUp1.gif';
import gifMatrixPills2 from '/src/assets/images/gifs/MatrixPills.gif';
import areAmIs from '/src/assets/images/areAmIs.png';

const harderModeEnabled = ref(false);

const currentGif = ref('');
const gifList = ref([
  { name: 'matrixPills2', url: gifMatrixPills2 },
  { name: 'missionIsPossible', url: gifMissionIsPossible },
  { name: 'doYouUnderstand', url: gifDoYouUnderstand },
  { name: 'whatIsUp1', url: gifWhatIsUp1 },
  { name: 'areAmIs', url: areAmIs }
]);

const changeGif = () => {
  const randomIndex = Math.floor(Math.random() * gifList.value.length);
  currentGif.value = gifList.value[randomIndex].url;
};

const route = useRoute();
const router = useRouter();

const currentMission = ref('');
const currentGameData = ref([]);
const contentRef = ref(null);
const notebookHeight = ref(800);
const homeworkWords = ref([]);
const showModal = ref(false);

const goToAnontherComponent = () => {
  const missionName = route.params.missionName;
  router.push({
    path: `/see-all-sets-of-words/${missionName}/print-all-words2`
  });
};

// Валидность домашнего задания
const isHomeworkValid = computed(() => {
  if (!homeworkWords.value.length) return false;

  if (harderModeEnabled.value) {
    // В сложном режиме проверяем все три предложения
    return homeworkWords.value.every(word =>
      word.affirmativeSentence && word.affirmativeSentence.trim().length >= 1 &&
      word.negativeSentence && word.negativeSentence.trim().length >= 1 &&
      word.questionSentence && word.questionSentence.trim().length >= 1
    );
  } else {
    // В обычном режиме проверяем только переводы
    return homeworkWords.value.every(word =>
      word.userTranslation &&
      word.userTranslation.trim().length >= 1
    );
  }
});

// Список незаполненных слов
const missingWords = computed(() => {
  if (!homeworkWords.value.length) return [];

  if (harderModeEnabled.value) {
    return homeworkWords.value.filter(word =>
      !word.affirmativeSentence || word.affirmativeSentence.trim().length < 1 ||
      !word.negativeSentence || word.negativeSentence.trim().length < 1 ||
      !word.questionSentence || word.questionSentence.trim().length < 1
    );
  } else {
    return homeworkWords.value.filter(word =>
      !word.userTranslation ||
      word.userTranslation.trim().length < 1
    );
  }
});

// Текст для модального окна
const modalMessage = computed(() => {
  if (harderModeEnabled.value) {
    return 'Вы не заполнили предложения для следующих слов:';
  } else {
    return 'Вы не написали перевод для следующих слов:';
  }
});

const goToHarderHomework = () => {
  harderModeEnabled.value = !harderModeEnabled.value;

  if (harderModeEnabled.value) {
    // Обновляем слова и добавляем поля для предложений
    refreshWordsForHarderMode();
  }

  // Пересчитываем высоту тетради
  nextTick(() => {
    setTimeout(() => {
      notebookHeight.value = calculateContentHeight();
    }, 50);
  });
};

// Функция обновления слов для сложного режима
const refreshWordsForHarderMode = () => {
  if (currentGameData.value.length === 0) return;

  // Выбираем новые случайные слова
  const shuffled = [...currentGameData.value].sort(() => 0.5 - Math.random());
  const newWords = shuffled.slice(0, Math.min(3, shuffled.length)).map(word => ({
    ...word,
    userTranslation: '',
    affirmativeSentence: '',
    negativeSentence: '',
    questionSentence: '',
    showHint: false
  }));

  homeworkWords.value = newWords;
};

// Показывать ли секцию домашнего задания
const showHomeworkSection = computed(() => {
  return homeworkWords.value.length > 0;
});

// Функция для выбора случайных слов для домашнего задания
const selectHomeworkWords = () => {
  if (currentGameData.value.length === 0) return [];

  const shuffled = [...currentGameData.value].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(3, shuffled.length)).map(word => ({
    ...word,
    userTranslation: '',
    affirmativeSentence: '',
    negativeSentence: '',
    questionSentence: '',
    showHint: false
  }));
};

// Функция переключения подсказки
const toggleHint = (word) => {
  word.showHint = !word.showHint;

  // Пересчитываем высоту после открытия/закрытия подсказки
  nextTick(() => {
    setTimeout(() => {
      notebookHeight.value = calculateContentHeight();
    }, 50);
  });
};

// Обработчик нажатия на кнопку отправки
const handleSendClick = () => {
  if (isHomeworkValid.value) {
    openTelegramMessage();
  } else {
    showModal.value = true;
  }
};

// Функция для копирования текста в буфер обмена
const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (error) {
    console.error('Ошибка при копировании в буфер обмена:', error);
    return false;
  }
};

// Функция отправки в Telegram
const openTelegramMessage = async () => {
  const username = 'vismyfriend';

  let homeworkMessage = "Hi teacher V.\n\n";
  homeworkMessage += "Words from homework:\n";
  homeworkWords.value.forEach((word, index) => {
    homeworkMessage += `${index + 1}. ${word.ru}\n`;
  });

  if (harderModeEnabled.value) {
    homeworkMessage += `\nMy sentences:\n`;
    homeworkWords.value.forEach((word, index) => {
      homeworkMessage += `${index + 1}. ${word.ru}:\n`;
      homeworkMessage += `   +) ${word.affirmativeSentence}\n`;
      homeworkMessage += `   -) ${word.negativeSentence}\n`;
      homeworkMessage += `   ?) ${word.questionSentence}\n`;
    });
  } else {
    homeworkMessage += `\nMy translation:\n`;
    homeworkWords.value.forEach((word, index) => {
      homeworkMessage += `${index + 1}. ${word.userTranslation}\n`;
    });
  }

  homeworkMessage += `\nСейчас ещё фотку отправлю`;
  homeworkMessage += `\n(${currentMission.value})\n`;

  await copyToClipboard(homeworkMessage);

  alert("✅ Скопированно!\n\nВставьте в телеграмм:\n\n💻 На компьютере: \nклик правой кнопкой → Вставить\n📱 На телефоне: \nзажмите пальцем → Вставить");

  const telegramUrl = `https://t.me/${username}?text=${encodeURIComponent(homeworkMessage)}`;
  window.open(telegramUrl, '_blank');
};

// Функция для расчета высоты тетради
const calculateContentHeight = () => {
  if (!contentRef.value) return 700;
  const contentHeight = contentRef.value.scrollHeight;
  const minHeight = 700;
  const padding = 50;
  return Math.max(minHeight, contentHeight + padding);
};

// Следим за изменением слов для пересчета высоты
watch(homeworkWords, () => {
  nextTick(() => {
    setTimeout(() => {
      notebookHeight.value = calculateContentHeight();
    }, 50);
  });
}, { deep: true });

onMounted(() => {
  currentMission.value = route.params.missionName || 'Текущий урок';
  currentGameData.value = shortWordsData[currentMission.value] || [];
  homeworkWords.value = selectHomeworkWords();
  changeGif();

  setTimeout(() => {
    notebookHeight.value = calculateContentHeight();
  }, 100);
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.notebook-wrapper {
  position: relative;
  width: 800px;
  max-width: 95%;
  height: 700px;
  perspective: 1000px;
  transition: height 0.3s ease;
  margin-bottom: 30px;
}

.notebook-cover {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e5799 0%, #207cca 51%, #2989d8 51%, #7db9e8 100%);
  border-radius: 8px 12px 12px 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  padding: 10px;
}

.notebook-page {
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1), inset 0 1px 0 white, inset 0 -1px 0 white;
  overflow: hidden;
}

.notebook-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    linear-gradient(90deg,
      transparent 0%,
      transparent 19px,
      #e0e8e8 19px,
      #e0e8e8 20px,
      transparent 20px
    ),
    linear-gradient(to bottom,
      transparent 0%,
      transparent 19px,
      #e0e8e8 19px,
      #e0e8e8 20px,
      transparent 20px
    );
  background-size: 20px 20px;
  z-index: 1;
  pointer-events: none;
}

.notebook-content {
  position: relative;
  z-index: 3;
  height: 100%;
  padding: 20px 40px 20px 20px;
  font-family: 'Times New Roman', serif;
  font-size: 16px;
  line-height: 20px;
  color: #2c3e50;
  overflow-y: auto;
}

.fontAm {
  font-family: 'American Typewriter', serif;
}

.sentences-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.sentence-input {
  margin-top: 0 !important;
  border-color: #ff9800;

  &:focus {
    border-color: #ff9800;
    box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.2);
  }
}

.lesson-title {
  font-size: 20px;
  font-family: Special_f1;
  justify-content: center;
  font-weight: bold;
  text-align: center;
  color: #1e5799;
  padding-bottom: 10px;
  line-height: 20px;
  height: 20px;
}

.textInLine {
  color: #2c3e50;
  font-family: 'Times New Roman', serif;
  font-size: 14px;
  line-height: 20px;
}

.homework-section {
  margin-bottom: 20px;
}

.homework-content p {
  margin-bottom: 20px;
  line-height: 20px;
  min-height: 20px;
}

.homework-words {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.homework-word {
  display: flex;
  flex-direction: column;
}

.word-header {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 20px;
  line-height: 20px;
  justify-content: space-between;
}

.hint-icon {
  color: #1e5799;
  cursor: pointer;
  font-size: 12px;
  opacity: 0.7;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
}

.hint-content {
  margin-left: 25px;
  animation: fadeIn 0.3s ease;
}

.hint-text {
  font-style: italic;
  font-family: 'Arial', serif;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.word-to-translate {
  margin-left: 30px;
  font-weight: bold;
  color: #3b8a2a;
  font-size: 18px;
  text-align: left;
  flex: 1;
}

.translation-input {
  border: 2px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  font-family: 'Times New Roman', serif;
  margin-left: 20px;
  width: 340px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    transform: translateX(5px);
  }

  &::placeholder {
    color: #aaa;
    font-style: italic;
  }
}

.buttons-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.harder-homework-btn {
  background: linear-gradient(180deg, #ff9800, #f57c00);
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 14px;
  padding: 8px 16px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-family: Special_f1;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    background: linear-gradient(180deg, #f57c00, #ff9800);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

.homework-submit-btn {
  background: linear-gradient(180deg, #4CAF50, #45a049);
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 14px;
  padding: 8px 16px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-family: Special_f1;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    background: linear-gradient(180deg, #45a049, #4CAF50);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.textRight {
  text-align: right;
}

.modal {
  background: white;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icon {
  font-size: 28px;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-family: "American Typewriter", serif;
}

.modal-content {
  padding: 20px;
}

.modal-content p {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-family: 'Times New Roman', serif;
  font-size: 14px;
}

.missing-words-list {
  margin: 12px 0;
  padding-left: 25px;
  color: #ee5a24;
  font-family: 'Times New Roman', serif;
  font-size: 14px;
}

.missing-words-list li {
  margin: 8px 0;
  font-weight: 500;
}

.modal-hint {
  margin-top: 16px;
  color: #7f8c8d;
  font-style: italic;
  font-size: 12px !important;
}

.modal-footer {
  padding: 0 20px 20px 20px;
  display: flex;
  justify-content: center;
}

.modal-btn {
  background: linear-gradient(180deg, #4CAF50, #45a049);
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 14px;
  padding: 10px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Times New Roman', serif;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.notebook-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 35px;
  width: 1px;
  height: 100%;
  z-index: 3;
}

.words-link {
  color: #1e5799;
  text-decoration: underline;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #ff6b6b;
    text-decoration: none;
  }
}

.gif-container {
  position: relative;
  margin-top: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 150px;
  line-height: 20px;
}

.random-gif {
  max-width: 100%;
  height: auto;
  max-height: 150px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

@media (max-width: 768px) {
  .word-to-translate {
    font-size: 18px;
  }

  .translation-input {
    margin-left: 20px;
    width: 280px;
  }
}

@media print {
  .container {
    background: none;
    padding: 0;
  }

  .gif-container {
    display: none;
  }

  .notebook-wrapper {
    box-shadow: none;
    margin: 0;
    height: auto !important;
    max-width: 100%;
  }

  .notebook-cover {
    box-shadow: none;
    background: white !important;
    padding: 10px;
    border-radius: 0;
  }

  .notebook-page {
    box-shadow: none;
    padding: 0;
  }

  .notebook-content {
    padding: 20px 30px 20px 40px;
  }

  .notebook-grid {
    background:
      linear-gradient(90deg,
        transparent 0%,
        transparent 19px,
        #f0f0f0 19px,
        #f0f0f0 20px,
        transparent 20px
      ),
      linear-gradient(to bottom,
        transparent 0%,
        transparent 19px,
        #f0f0f0 19px,
        #f0f0f0 20px,
        transparent 20px
      );
  }

  .notebook-cover::before,
  .notebook-cover::after,
  .notebook-page::before {
    display: none;
  }

  .translation-input {
    border: 1px solid #ccc;
    background: white;
    color: #333;
    margin-left: 25px;
  }

  .homework-submit-btn,
  .modal-overlay {
    display: none;
  }
}
</style>
