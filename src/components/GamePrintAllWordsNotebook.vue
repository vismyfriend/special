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
            <div class="lesson-title">
              {{ currentMission }}
            </div>

            <!-- Слова и фразы -->
            <div class="words-section">
              <div class="section-title">Секретная миссия : </div>
              <div class="lesson-title"></div>
              <div class="words-list">
                <div
                  class="word-line"
                  v-for="(word, index) in currentGameData"
                  :key="word.id"
                >
                  <div class="word-content">
                    <span class="english-word">{{ word.eng }}</span>
                    <span class="hint" v-if="word.hint">{{ word.hint }}</span>
                    <span class="translation">- {{ word.ru }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Дополнительные материалы -->
            <div class="materials-section" v-if="hasAdditionalMaterials">
              <div class="section-title"> Ох уж этот Vincent...</div>
              <div class="materials-content">
                <p>напридумывает словосочетаний всяких,</p>
                <p>будь готов их переводить special agent!</p>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import shortWordsData from '../dataForGames/short-words-data';

const route = useRoute();

const currentMission = ref('');
const currentGameData = ref([]);
const contentRef = ref(null);
const notebookHeight = ref(600);

// Вычисляем, есть ли дополнительные материалы
const hasAdditionalMaterials = computed(() => {
  return currentGameData.value.length > 0;
});

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
  font-weight: bold;
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
</style>
