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
            <!-- Заголовок урока -->
            <div class="lesson-title display-none">
              "{{ currentMission }}"
            </div>

            <!-- Чекбокс перемешивания в стиле тетради -->
            <div class="shuffle-control">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  v-model="shuffleEnabled"
                  @change="handleShuffleChange"
                  class="checkbox-input"
                >
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">включить перемешивание (обнови страницу)</span>
              </label>
            </div>

            <!-- Слова и фразы -->
            <div class="words-section">
              <div class="section-title display-none">Секретная миссия : </div>
              <div class="lesson-title"></div>
              <div class="excel-style-table">
                <div
                  class="table-row"
                  v-for="(word, index) in displayedWords"
                  :key="word.id"
                >
                  <!-- Первая строка: английское слово + перевод -->
                  <div class="first-row">
                    <div class="english-cell">
                      <span class="english-word">{{ word.eng }}</span>
                    </div>
                    <div class="translation-cell">
                      <span class="translation-text">{{ word.ru }}</span>
                    </div>
                  </div>

                  <!-- Вторая строка: произношение (объединенная ячейка) -->
                  <div class="second-row" v-if="word.hint">
                    <div class="pronunciation-cell">
                      <span class="hint">{{ word.hint }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Дополнительные материалы -->
            <div class="materials-section" v-if="hasAdditionalMaterials">
              <div class="section-title"> Ох уж этот Vincent...</div>
              <div class="materials-content">
                <p>напридумывает фраз всяких, a мне</p>
                <p>писать и переводить... Ладно, напишу!</p>
                <p>Я же понимаю, что училка для меня</p>
                <p>старался. И я не ленивая задница! </p>
              </div>
            </div>

            <!-- Секция домашнего задания -->
            <div class="homework-section " v-if="showHomeworkSection">
              <!--              <div class="section-title ">Cейчас напишу :</div>-->
              <div class="homework-content">

                <div class="homework-words">
                  <div class="homework-word" v-for="(word, index) in homeworkWords" :key="'hw-' + index">
                    <div class="word-header">
                      <span class="word-number">{{ index + 1 }}. </span>
                      <span class="word-to-translate">{{ word.ru }}</span>
                      <!-- Показываем кнопку подсказки только если подсказка еще не показана -->
                      <span class="hint-icon" v-if="word.hint && !word.showHint" @click="toggleHint(word)"> 🔍️ подсказка
    </span>
                    </div>

                    <!-- Показываем подсказку только если она активна -->
                    <div class="hint-content" v-if="word.showHint">
                      <span class="hint-text">{{ word.hint }}</span>
                    </div>

                    <input
                      type="text"
                      v-model="word.userTranslation"
                      :placeholder="'введите перевод...'"
                      class="translation-input"
                      @input="validateHomework"
                    >
                  </div>
                </div>

                <!-- Поле для имени и кнопка отправки -->
                <div class="homework-submission">
                  <textarea
                    class="message-input"
                    v-model="customMessage"
                    placeholder="Практикуйся, используй 1 - 2 слова из этого списка и напиши любой вопрос? (или составь любое предложение)"
                  ></textarea>

                  <button
                    class="homework-submit-btn"
                    @click="openTelegramMessage"
                    :disabled="!isHomeworkValid"
                  >
                    Send to Vismyfriend →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопка печати -->
    <div class="print-controls">
      <button class="print-button" @click="printNotebook">Распечатать материал</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import shortWordsData from '../dataForGames/short-words-data';

const route = useRoute();

const currentMission = ref('');
const currentGameData = ref([]);
const contentRef = ref(null);
const notebookHeight = ref(600);
const customMessage = ref('');
const homeworkWords = ref([]);

// Состояние для перемешивания
const shuffleEnabled = ref(false);
// Оригинальные данные (несортированные)
const originalGameData = ref([]);
// Отображаемые данные (могут быть перемешаны)
const displayedWords = ref([]);


// Функция перемешивания массива (алгоритм Фишера-Йетса)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Обработчик изменения чекбокса
const handleShuffleChange = () => {
  if (shuffleEnabled.value) {
    // Если включено перемешивание - перемешиваем
    displayedWords.value = shuffleArray(originalGameData.value);
  } else {
    // Если выключено - возвращаем оригинальный порядок
    displayedWords.value = [...originalGameData.value];
  }
};


// Массив случайных приветственных фраз
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

// Функция для получения случайного приветствия
const getRandomGreeting = () => {
  const randomIndex = Math.floor(Math.random() * greetingPhrases.length);
  return greetingPhrases[randomIndex];
};
// Вычисляем, есть ли дополнительные материалы
const hasAdditionalMaterials = computed(() => {
  return currentGameData.value.length > 0;
});

// Показывать ли секцию домашнего задания
const showHomeworkSection = computed(() => {
  return homeworkWords.value.length > 0;
});


// Валидность домашнего задания + сообщение
const isHomeworkValid = computed(() => {
  const allWordsFilled = homeworkWords.value.every(word =>
    word.userTranslation &&
    word.userTranslation.trim() !== '' &&
    word.userTranslation.trim().length >= 1
  );

  const messageFilled = customMessage.value.trim().length >= 10; // минимум 10 символов для сообщения

  return allWordsFilled && messageFilled;
});

// Количество использованных подсказок
const usedHintsCount = computed(() => {
  return homeworkWords.value.filter(word => word.showHint).length;
});

// Функция для выбора случайных слов для домашнего задания
const selectHomeworkWords = () => {
  if (currentGameData.value.length === 0) return [];

  // Берем до 5 случайных слов из текущего урока
  const shuffled = [...currentGameData.value].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(5, shuffled.length)).map(word => ({
    ...word,
    userTranslation: '',
    showHint: false // добавляем флаг для показа подсказки
  }));
};

// Функция переключения подсказки
const toggleHint = (word) => {
  word.showHint = !word.showHint;
};

// Валидация домашнего задания
const validateHomework = () => {
  // Можно добавить дополнительную логику валидации при необходимости
  console.log('Homework validation updated');
};


// Функция для копирования текста в буфер обмена
const copyToClipboard = async (text) => {
  try {
    // Пробуем современный API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Старый метод для старых браузеров
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


  // Получаем случайное приветствие
  const randomGreeting = getRandomGreeting();
  // Формируем сообщение с домашним заданием
  let homeworkMessage = "";

  // Создаем восклицательные знаки по количеству подсказок
  const exclamationMarks = '!'.repeat(usedHintsCount.value);


  // Добавляем текст сообщения только если оно заполнено студентом
  // Добавляем случайное приветствие и текст сообщения
  if (customMessage.value.trim()) {
    homeworkMessage += `${randomGreeting}${exclamationMarks} \n\nI am not a lazy ass, and it is my message to you: \n"${customMessage.value.trim()}"\n\n`;
  } else {
    homeworkMessage += `${randomGreeting}${exclamationMarks}\n\nI am a little lazy today.\nAnd how do you feel?\nIt is my homework: \n\n`;
  }

  homeworkMessage += "Words from homework:\n";
  homeworkWords.value.forEach((word, index) => {
    homeworkMessage += `${index + 1}. ${word.eng}\n`; // Добавляем \n для переноса строки
  });

  homeworkMessage += `\nMy translation:\n`;
  homeworkWords.value.forEach((word, index) => {
    homeworkMessage += `${index + 1}. ${word.userTranslation}\n`;
  });

  // Копируем в буфер обмена (без уведомлений)
  await copyToClipboard(homeworkMessage);

  // Показываем alert
  alert("✅ Успешно скопированно!\nОтправляем училке... \n\n Если ваше сообщение не добавится автоматически, тогда:\n\n💻 На компьютере: \nклик правой кнопкой → Вставить\n📱На телефоне: \nзажмите пальцем → Вставить");  // Открываем Telegram

  const telegramUrl = `https://t.me/${username}?text=${encodeURIComponent(homeworkMessage)}`;
  window.open(telegramUrl, '_blank');
};
// Функция для расчета высоты тетради
const calculateContentHeight = () => {
  if (!contentRef.value) return 600;

  const contentHeight = contentRef.value.scrollHeight;
  const minHeight = 600;
  const padding = 50;

  return Math.max(minHeight, contentHeight + padding);
};

// Печать тетради
const printNotebook = () => {
  const printControls = document.querySelector('.print-controls');

  // Скрываем кнопки печати
  if (printControls) {
    printControls.style.display = 'none';
  }

  // Даем время на скрытие элементов перед печати
  setTimeout(() => {
    window.print();

    // Восстанавливаем кнопки после печати
    setTimeout(() => {
      if (printControls) {
        printControls.style.display = 'block';
      }
    }, 500);
  }, 100);
};



onMounted(() => {
  // Получаем данные урока
  currentMission.value = route.params.missionName || 'Текущий урок';
  currentGameData.value = shortWordsData[currentMission.value] || [];


  // Сохраняем оригинальные данные
  originalGameData.value = [...currentGameData.value];
  // Инициализируем отображаемые данные
  displayedWords.value = [...currentGameData.value];

  // Выбираем слова для домашнего задания
  homeworkWords.value = selectHomeworkWords();

  // Настраиваем высоту тетради после загрузки данных
  setTimeout(() => {
    notebookHeight.value = calculateContentHeight();
  }, 100);
});


</script>

<style lang="scss" scoped>

.container {
  width: 100%;
  min-height: 100vh;
  //background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
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
  padding: 15px;
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

/* Сетка тетради в клетку */
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
  line-height: 20px; /* Важно: совпадает с высотой клетки */
  color: #2c3e50;
  overflow-y: auto;
}

/* Заголовок урока */
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

/* Секции */
.words-section,
.materials-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  font-family: Special_f1;
  margin-bottom: 15px;
  color: #25598e;
  border-left: 3px solid #00ff14;
  padding-left: 10px;
  line-height: 20px;
  height: 20px;
}

/* Стили для слов - ВАЖНО: выравнивание по клеточкам */
.words-list {
  display: flex;
  flex-direction: column;
}

.word-line {
  display: flex;
  align-items: center;
  min-height: 20px; /* Высота одной клетки */
  margin-bottom: 0;
  position: relative;
}

.word-content {
  display: flex;
  align-items: baseline;
  gap: 8px;
  width: 100%;
  line-height: 20px;
  min-height: 20px;
}

.english-word {
  font-weight: bold;
  color: #2c3e50;
  min-width: 150px;
  line-height: 20px;
}

.hint {
  //color: #7f8c8d;
  font-style: italic;
  line-height: 20px;
  font-family: 'Arial', serif;

}

.translation {
  color: rgba(127, 140, 141, 0.86);
  //flex: 1;  /* ← ЭТО заставляет перевод занимать всё оставшееся пространство */
  line-height: 20px;
}

/* Контролы печати */
.print-controls {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.print-button {
  background: linear-gradient(180deg, #4CAF50, #45a049);
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 16px;
  padding: 12px 24px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-family: 'Times New Roman', serif;
}

.print-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  background: linear-gradient(180deg, #45a049, #4CAF50);
}

.print-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Красная вертикальная линия для полей */
.notebook-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 35px;
  width: 1px;
  height: 100%;
  //background: #ff6b6b;
  z-index: 3;
}

/* Дырочки для пружины */
.notebook-cover::after {
  content: '';
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 80%;
  background:
    radial-gradient(circle at center, #666 2px, transparent 2px),
    transparent;
  background-size: 6px 20px;
  background-repeat: repeat-y;
  z-index: 2;
}

/* Стили для печати */
@media print {
  .container {
    background: none;
    padding: 0;
  }

  .print-controls {
    display: none !important;
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

  /* Убираем декоративные элементы при печати */
  .notebook-cover::before,
  .notebook-cover::after,
  .notebook-page::before {
    display: none;
  }

  /* Оптимизируем для печати */
  .word-content {
    gap: 6px;
  }

  .english-word {
    min-width: 140px;
  }
}

/* Адаптивность */
@media (max-width: 768px) {

  .english-word {

    min-width: 125px;
  }
}

/* Убедимся, что все элементы точно выровнены по сетке */
.lesson-title,
.section-title,
.word-line,
.materials-section p {
  display: flex;
  align-items: center;
  min-height: 20px;
  margin: 0;
  padding: 0;

}

/* Отступы между строками слов */
.word-line + .word-line {
  margin-top: 0; /* Убираем отступы, так как каждая строка занимает ровно одну клетку */
}


/* Стили для секции домашнего задания */
.homework-section {
  margin-bottom: 20px;
}

.homework-content {
  p {
    margin-bottom: 20px;
    line-height: 20px;
    min-height: 20px;
  }
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

.homework-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.homework-word-line {
  display: flex;
  align-items: center;
  min-height: 20px;
  line-height: 20px;
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
  color: #ff0000;
  font-size: 18px;
}

.translation-input {
  border: 2px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  font-family: 'Times New Roman', serif;
  margin-left: 20px;
  width: 280px;
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

.homework-submission {
  margin-top: 18px;
  padding-top: 20px;
  border-top: 2px dashed #e0e8e8;
}

.message-input {
  width: 303px;
  min-height: 80px;
  border: 2px solid #ddd;
  border-radius: 4px;
  padding: 10px 12px;
  font-family: 'Times New Roman', serif;
  margin-bottom: 15px;
  background: rgba(255, 255, 255, 0.8);
  resize: vertical;
  transition: all 0.3s ease;

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

.homework-submit-btn {
  background: linear-gradient(180deg, #4CAF50, #45a049);
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 14px;
  padding: 12px 24px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-family: 'Times New Roman', serif;

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

/* Адаптивность для домашнего задания */
@media (max-width: 768px) {
  .homework-item {
    gap: 6px;
  }

  .translation-input {
    margin-left: 20px;
  }

  .word-to-translate {
    font-size: 18px;
  }
}

/* Стили для печати - домашнее задание */
@media print {
  .translation-input {
    border: 1px solid #ccc;
    background: white;
    color: #333;
    margin-left: 25px;
  }

  .message-input,
  .homework-submit-btn {
    display: none;
  }

  .homework-submission {
    border-top: 1px solid #ccc;
  }

  .homework-item {
    margin-bottom: 15px;
  }
}
/* Только позиционирование - без оформления */
.excel-style-table {
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

.translation-cell {
  grid-column: 2;
  color: #ff001e;
}

.pronunciation-cell {
  flex: 1;
  text-align: right;
}

/* Адаптивность для мобильных */



// Добавляем новые стили для заголовка и чекбокса
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  min-height: 20px;
  line-height: 20px;
}

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
  cursor: pointer;
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
  width: 18px;
  height: 18px;
  background: white;
  border: 1px solid #1e5799;
  border-radius: 2px;
  position: relative;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);

  /* Имитация клетки тетради */
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

/* Адаптивность */
@media (max-width: 768px) {
  .header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .checkbox-text {
    font-size: 12px;
  }
}

/* Стили для печати */
@media print {
  .shuffle-control {
    display: none !important;
  }
}
.display-none {
  display: none;
}

</style>
