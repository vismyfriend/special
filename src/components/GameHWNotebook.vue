<template>
  <div class="container">
    <div class="notebook-wrapper" :style="{ height: notebookHeight + 'px' }">
      <!-- Обложка тетради -->
      <div class="notebook-cover">
        <!-- Лист тетради в клетку -->
        <div class="notebook-page">
          <!-- Сетка тетради -->
          <div class="notebook-grid"></div>

          <!-- Содержимое тетради -->
          <div class="notebook-content" ref="contentRef">
            <!-- Заголовок урока (скрыт) -->
            <div class="lesson-title display-none">
              "{{ currentMission }}"
            </div>

            <!-- Чекбокс перемешивания -->
            <div class="shuffle-control">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  v-model="shuffleEnabled"
                  @change="handleShuffleChange"
                  class="checkbox-input"
                >
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">включить перемешивание ?</span>
              </label>
            </div>

            <!-- Слова и фразы -->
            <div class="words-section">
              <div class="section-title display-none">Секретная миссия :</div>
              <div class="excel-style-table">
                <div
                  class="table-row"
                  v-for="word in displayedWords"
                  :key="word.id"
                >
                  <div class="first-row">
                    <div class="english-cell">
                      <span class="english-word">{{ word.eng }}</span>
                    </div>
                    <div class="translation-cell">
                      <span class="translation-text">{{ word.ru }}</span>
                    </div>
                  </div>
                  <div class="second-row" v-if="word.hint">
                    <div class="pronunciation-cell">
                      <span class="hint">{{ word.hint }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Секция с кнопками дополнительных заданий -->
            <div class="materials-section">
              <div class="section-title">🎯 Доп. задания :</div>
              <div class="materials-content">
                <p>придумает заданий всяких для меня,</p>
                <p>а мне выполнять да?!... Ладно, выполню!</p>
                <p>Я же понимаю, что училка для меня</p>
                <p>старался. И я не ленивая задница!</p>
              </div>

              <div class="homework-words">
                <!-- Кнопка  -->
                <div class="homework-word">
                  <div class="word-header">
                    <span class="word-number">1.</span>
                    <span class="word-to-translate">Обезврежу бомбы</span>
                  </div>
                  <button class="homework-submit-btn" @click="goToFindPairsGame">
                    🧨 Deactivate bombs
                  </button>
                </div>

                <div class="homework-word">
                  <div class="word-header">
                    <span class="word-number">2.</span>
                    <span class="word-to-translate">Произнесу по буквам</span>
                  </div>
                  <button class="homework-submit-btn" @click="goToSpellingGame">
                    💥 spell it
                  </button>
                </div>

                <div class="homework-word">
                  <div class="word-header">
                    <span class="word-number">3.</span>
                    <span class="word-to-translate">Найду пары</span>
                  </div>
                  <button class="homework-submit-btn" @click="goToFindPairsHardGame">
                    🃏 Find pairs
                  </button>
                </div>

                <div class="homework-word">
                  <div class="word-header">
                    <span class="word-number">4.</span>
                    <span class="word-to-translate">Диктант?</span>
                  </div>
                  <button class="homework-submit-btn" @click="goToPrintAllWords">
                    📝 three random words
                  </button>
                </div>

                <div class="homework-word">
                  <div class="word-header">
                    <span class="word-number">5.</span>
                    <span class="word-to-translate">Напишу училке</span>
                  </div>
                  <button class="homework-submit-btn" @click="toggleMessageInput">
                    ✉️ Write a message
                  </button>

                  <!-- Поле ввода (появляется по клику) -->
                  <div v-if="showMessageInput" class="message-input-wrapper">
                    <textarea
                      class="message-input"
                      v-model="customMessage"
                      placeholder="Напиши сообщение учителю... (минимум 10 символов)"
                      rows="3"
                    ></textarea>
                    <div class="message-actions">
                      <button
                        class="homework-submit-btn send-btn"
                        @click="openTelegramMessage"
                        :disabled="!isMessageValid"
                      >
                        📤 Отправить в Telegram
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Кнопка печати -->
                <div class="homework-word">
                  <div class="word-header">
                    <span class="word-number">🖨️</span>
                    <span class="word-to-translate">распечатаю всё в ПДФ</span>
                  </div>
                  <button class="homework-submit-btn" @click="printNotebook">
                    🖨️ print PDF
                  </button>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import shortWordsData from '../dataForGames/short-words-data';

// ==================== УТИЛИТЫ ====================
const getWordSet = (name) => {
  if (shortWordsData[name]) return shortWordsData[name];
  for (const level in shortWordsData) {
    if (shortWordsData[level] && shortWordsData[level][name]) {
      return shortWordsData[level][name];
    }
  }
  return [];
};

// ==================== COMPOSABLES ====================
const route = useRoute();
const router = useRouter();

// ==================== СОСТОЯНИЯ ====================
const currentMission = ref('');
const currentGameData = ref([]);
const contentRef = ref(null);
const notebookHeight = ref(600);

// Перемешивание
const shuffleEnabled = ref(false);
const originalGameData = ref([]);
const displayedWords = ref([]);

// Сообщение учителю
const showMessageInput = ref(false);
const customMessage = ref('');

// ==================== COMPUTED ====================
const isMessageValid = computed(() => {
  return customMessage.value.trim().length >= 10;
});

// ==================== ФУНКЦИИ ПЕРЕХОДОВ ====================
const goToFindPairsGame = () => {
  const missionName = route.params.missionName;
  router.push({
    path: `/see-all-sets-of-words/${missionName}/find-pairs-easy`
  });
};

const goToFindPairsHardGame = () => {
  const missionName = route.params.missionName;
  router.push({
    path: `/see-all-sets-of-words/${missionName}/find-pairs-hard`
  });
};

const goToSpellingGame = () => {
  const missionName = route.params.missionName;
  router.push({
    path: `/see-all-sets-of-words/${missionName}/spell-it`
  });
};

const goToPrintAllWords = () => {
  const missionName = route.params.missionName;
  router.push({
    path: `/see-all-sets-of-words/${missionName}/print-all-words`
  });
};

// ==================== ПЕРЕМЕШИВАНИЕ ====================
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const handleShuffleChange = () => {
  if (shuffleEnabled.value) {
    displayedWords.value = shuffleArray(originalGameData.value);
  } else {
    displayedWords.value = [...originalGameData.value];
  }
};

// ==================== СООБЩЕНИЕ УЧИТЕЛЮ ====================
const greetingPhrases = [
  "Hello, my dear teacher!",
  "Hi, Vincentinushka!",
  "Hello, professor!",
  "What'suuuuup, V!",
  "Hey there, language master!",
  "Zdarova Vinnie!",
  "Hello, wise teacher!",
  "Hi, amazing mentor!",
  "Hey, Boss of English!",
  "Greetings, word guru!",
  "Hello, English sensei!",
  "Yo, my buddy V!",
  "I wish you a great day, my friend!",
];

const getRandomGreeting = () => {
  const randomIndex = Math.floor(Math.random() * greetingPhrases.length);
  return greetingPhrases[randomIndex];
};

const toggleMessageInput = () => {
  showMessageInput.value = !showMessageInput.value;
  if (!showMessageInput.value) {
    customMessage.value = '';
  }
};

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
    console.error('Ошибка при копировании:', error);
    return false;
  }
};

const openTelegramMessage = async () => {
  const username = 'vismyfriend';
  const randomGreeting = getRandomGreeting();

  let message = `${randomGreeting}\n\n`;
  message += `${customMessage.value.trim()}`;

  await copyToClipboard(message);
  alert("✅ Сообщение скопировано!\nОтправляем училке...");

  const telegramUrl = `https://t.me/${username}?text=${encodeURIComponent(message)}`;
  window.open(telegramUrl, '_blank');

  customMessage.value = '';
  showMessageInput.value = false;
};

// ==================== ПЕЧАТЬ ====================
const printNotebook = () => {
  window.print();
};

// ==================== ВЫСОТА ТЕТРАДИ ====================
const calculateContentHeight = () => {
  if (!contentRef.value) return 600;
  const contentHeight = contentRef.value.scrollHeight;
  const minHeight = 600;
  const padding = 50;
  return Math.max(minHeight, contentHeight + padding);
};

// ==================== LIFECYCLE ====================
onMounted(() => {
  currentMission.value = route.params.missionName || 'Текущий урок';
  currentGameData.value = getWordSet(currentMission.value);

  originalGameData.value = [...currentGameData.value];
  displayedWords.value = [...currentGameData.value];

  setTimeout(() => {
    notebookHeight.value = calculateContentHeight();
  }, 100);
});
</script>

<style lang="scss" scoped>
// ============================================
// 📦 КОНТЕЙНЕРЫ
// ============================================

.container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  margin-top: 75px;
}

.notebook-wrapper {
  position: relative;
  width: 800px;
  max-width: 95%;
  height: 600px;
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
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  padding: 10px;
}

.notebook-page {
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 4px;
  box-shadow:
    0 2px 10px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 white,
    inset 0 -1px 0 white;
  overflow: hidden;
}

// ============================================
// 📐 СЕТКА ТЕТРАДИ
// ============================================

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

// ============================================
// 📝 ЗАГОЛОВКИ
// ============================================

.lesson-title {
  font-size: 20px;
  font-family: Special_f1;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #1e5799;
  padding-bottom: 10px;
  line-height: 20px;
  height: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  font-family: Special_f1;
  margin-bottom: 20px;
  color: #25598e;
  border-left: 3px solid #00ff14;
  padding-left: 10px;
  line-height: 20px;
  height: 20px;
}

.display-none {
  display: none;
}

// ============================================
// 📊 ТАБЛИЦА СЛОВ
// ============================================

.excel-style-table {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.table-row {
  display: flex;
  flex-direction: column;
}

.first-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 20px;
  align-items: center;
}

.second-row {
  display: flex;
  min-height: 20px;
  align-items: center;
}

.english-cell {
  grid-column: 1;
}

.english-word {
  font-weight: bold;
  color: #2c3e50;
  min-width: 150px;
  line-height: 20px;
}

.translation-cell {
  grid-column: 2;
  color: rgb(152, 149, 149);
  font-size: 14px;
}

.translation-text {
  line-height: 20px;
}

.pronunciation-cell {
  flex: 1;
  text-align: right;
}

.hint {
  color: #3174b4;
  font-style: italic;
  line-height: 20px;
  font-family: 'Arial', serif;
  font-weight: bold;
}

// ============================================
// 🎯 КНОПКИ ЗАДАНИЙ
// ============================================

.materials-section {
  margin-bottom: 20px;
}

.materials-content {
  p {
    margin: 0;
    padding: 0;
    line-height: 20px;
    min-height: 20px;
    display: flex;
    align-items: center;
  }
}

.homework-words {
  margin-top: 20px;
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

.word-number {
  font-weight: bold;
  font-family: Special_f1;
  font-size: 12px;
  color: #1e5799;
  min-width: 25px;
}

.word-to-translate {
  font-weight: bold;
  color: #3b8a2a;
  font-size: 18px;
  text-align: left;
  flex: 1;
}

// ============================================
// 🔘 КНОПКИ
// ============================================

.homework-submit-btn {
  background: linear-gradient(180deg, #4CAF50, #45a049);
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 14px;
  padding: 10px 20px;
  cursor: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-family: Special_f1;
  position: relative;


  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    background: linear-gradient(180deg, #45a049, #4CAF50);
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

.send-btn {
  background: linear-gradient(180deg, #4CAF50, #45a049);

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

// ============================================
// ✉️ ПОЛЕ ВВОДА СООБЩЕНИЯ
// ============================================

.message-input-wrapper {

  margin-top: 20px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  border: 1px solid #e0e8e8;
  animation: slideDown 0.3s ease;


}

.message-input {
  width: 100%;
  min-height: 80px;
  border: 2px solid #ddd;
  border-radius: 4px;
  padding: 10px 12px;
  font-family: 'Times New Roman', serif;
  font-size: 14px;
  background: white;
  resize: vertical;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }

  &::placeholder {
    color: #aaa;
    font-style: italic;
  }
}

.message-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  justify-content: flex-end;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ============================================
// 🎯 ЧЕКБОКС ПЕРЕМЕШИВАНИЯ
// ============================================

.shuffle-control {
  display: flex;
  align-items: center;
  font-size: 14px;
  z-index: 10;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: none;
  user-select: none;
  position: relative;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: white;
  border: 1px solid #1e5799;
  border-radius: 2px;
  position: relative;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      linear-gradient(90deg,
        rgba(224, 232, 232, 0.3) 0%,
        rgba(224, 232, 232, 0.3) 1px,
        transparent 1px),
      linear-gradient(0deg,
        rgba(224, 232, 232, 0.3) 0%,
        rgba(224, 232, 232, 0.3) 1px,
        transparent 1px);
    background-size: 4px 4px;
    pointer-events: none;
  }
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #1e5799;
  font-size: 14px;
  font-weight: bold;
  line-height: 1;
}

.checkbox-text {
  color: #2c3e50;
  font-family: 'Times New Roman', serif;
  font-size: 14px;
  line-height: 20px;
}

// ============================================
// 🖨️ ПЕЧАТЬ
// ============================================

@media print {
  .homework-submit-btn {
    display: none !important;
  }

  .message-input-wrapper {
    display: none !important;
  }

  .shuffle-control {
    display: none !important;
  }

  .container {
    background: none;
    padding: 0;
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

  .english-word {
    min-width: 140px;
  }
}

// ============================================
// 📱 АДАПТИВНОСТЬ
// ============================================

@media (max-width: 768px) {
  .english-word {
    min-width: 125px;
  }

  .word-to-translate {
    font-size: 15px;
  }

  .message-input {
    min-height: 60px;
    font-size: 13px;
  }

  .homework-submit-btn {
    font-size: 12px;
    padding: 8px 14px;
  }

  .homework-words {
    gap: 14px;
  }
}
</style>
