<template>
  <div class="reader-container" :class="currentTheme">
    <!-- Верхняя фиксированная панель -->
    <div class="reader-header">
      <div class="header-top">
        <h1 class="book-title">{{ bookData.mainTitleOfTheText || bookData.title }}</h1>
        <p class="book-author" v-if="bookData.author">{{ bookData.author }}</p>
      </div>

      <!-- Управление в одну строку -->
      <div class="controls-row">
        <div class="controls-group">
          <!-- Ползунок размера шрифта -->
          <div class="font-size-control">
            <div class="slider-wrapper">
              <span class="font-size-value">size - {{ fontSize }}</span>
              <input
                type="range"
                v-model="fontSize"
                min="13"
                max="21"
                step="1"
                @input="updateFontSize"
              />
            </div>
          </div>
        </div>

        <!-- Кнопка аудио (показывается только если есть аудио) -->
        <button
          v-if="bookData.audioUrl"
          class="audio-toggle"
          @click="toggleAudio"
          :title="isAudioVisible ? 'Скрыть плеер' : 'Показать плеер'"
        >
          {{ getAudioButtonIcon }}
        </button>

        <!-- Переключатель темы -->
        <button class="theme-toggle" @click="toggleTheme" :title="currentTheme === 'light' ? 'Ночной режим' : 'Дневной режим'">
          {{ currentTheme === 'light' ? '🌙' : '☀️' }}
        </button>

        <div class="progress-wrapper">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <span class="progress-text">{{ Math.round(progressPercent) }}%</span>
        </div>
      </div>


      <!-- Аудиоплеер (появляется под controls-row) -->
      <div v-if="isAudioVisible && bookData.audioUrl" class="audio-player-wrapper">
        <div class="audio-controls">

          <audio
            ref="audioPlayer"
            :src="bookData.audioUrl"
            controls
            preload="metadata"
            controlslist="nodownload noremoteplayback noplaybackrate"
            @play="onPlay"
            @pause="onPause"
            @ended="onEnded"
          ></audio>
          <button class="rewind-btn" @click="rewind(-5)" title="Назад 5 секунд">
            ⏪ <br>-5
          </button>
          <button class="forward-btn" @click="rewind(5)" title="Вперед 5 секунд">
            ⏩ <br>+5
          </button>
        </div>
      </div>


    </div>

    <!-- Основной контент -->
    <div class="reader-content">
      <!-- Проходим по каждой главе -->
      <div v-for="(chapter, chapterIndex) in bookData.chapters" :key="chapterIndex" class="chapter-wrapper">
        <!-- Заголовок главы с переводом -->
        <h2 class="chapter-title" v-if="chapter.title">
          <span
            class="text-part with-translation"
            :class="{ 'translation-open': getTitleTranslationState(chapterIndex) }"
            @click="toggleTitleTranslation(chapterIndex)"
          >
            {{ getTitleText(chapter.title) }}
            <span v-if="getTitleTranslationState(chapterIndex)" class="inline-translation">
              ➥ {{ getTitleTranslation(chapter.title) }}
            </span>
          </span>
        </h2>

        <!-- Картинка главы (один раз после заголовка) -->
        <div v-if="chapter.picture" class="chapter-image">
          <img :src="chapter.picture" alt="Chapter illustration" />
        </div>

        <!-- Параграфы главы -->
        <div v-for="(paragraph, pIndex) in getChapterParagraphs(chapterIndex)" :key="pIndex" class="paragraph-wrapper">
          <div class="paragraph">
            <template v-for="(part, index) in getPartsForParagraph(chapterIndex, pIndex, paragraph)" :key="index">
              <!-- Текст с переводом -->
              <span
                v-if="part.hasTranslation"
                class="text-part with-translation"
                :class="{ 'translation-open': part.showTranslation }"
                @click="toggleTranslation(part)"
              >
                <span v-html="part.text"></span>
                <span v-if="part.showTranslation" class="inline-translation">
                  ➥ {{ part.translation }}
                </span>
              </span>
              <!-- Обычный текст -->
              <span v-else class="text-part" v-html="part.text"></span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, computed, onMounted, onBeforeUnmount, reactive, watch, nextTick} from 'vue';
import {useRoute} from 'vue-router';
import engBooksData from '../dataForGames/engBooksData';

const route = useRoute();

const missionName = computed(() => route.params.missionName);

const bookData = computed(() => {
  if (engBooksData[missionName.value]) {
    return engBooksData[missionName.value];
  }
  return engBooksData.learningRevolution;
});

const currentTheme = ref('light');
const fontSize = ref(16);
const allParts = ref({});
const scrollProgress = ref(0);
const titleTranslations = ref({}); // Хранит состояния переводов заголовков


// === АУДИОПЛЕЕР ===
const audioPlayer = ref(null);
const isAudioVisible = ref(false);
const isAudioPlaying = ref(false);

const rewind = (seconds) => {
  if (audioPlayer.value) {
    audioPlayer.value.currentTime += seconds;
  }
};

// === ИКОНКА ДЛЯ КНОПКИ АУДИО ===
const getAudioButtonIcon = computed(() => {
  if (!isAudioVisible.value) {
    return '🎵'; // Плеер скрыт — показываем ноты
  }

  if (isAudioPlaying.value) {
    return '🔇'; // Плеер виден и играет — квадрат (стоп)
  }

  return '🔊'; // Плеер виден, но на паузе — пауза
});

const toggleAudio = async () => {
  isAudioVisible.value = !isAudioVisible.value;

  if (isAudioVisible.value) {
    // Ждём рендера аудиоэлемента
    await nextTick();
    if (audioPlayer.value) {
      audioPlayer.value.volume = 0.3; // Громкость 50%
      try {
        await audioPlayer.value.play();
        isAudioPlaying.value = true;
      } catch (err) {
        // Автоплей может быть заблокирован браузером
        console.log('Auto-play blocked, user must click play manually');
      }
    }
  } else {
    // Останавливаем при скрытии
    if (audioPlayer.value) {
      audioPlayer.value.pause();
      isAudioPlaying.value = false;
    }
  }
};

const onPlay = () => {
  isAudioPlaying.value = true;
};

const onPause = () => {
  isAudioPlaying.value = false;
};

const onEnded = () => {
  isAudioPlaying.value = false;
};

// Прогресс скролла
const progressPercent = computed(() => {
  return scrollProgress.value;
});

const updateScrollProgress = () => {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (scrollHeight > 0) {
    scrollProgress.value = (scrollTop / scrollHeight) * 100;
  } else {
    scrollProgress.value = 0;
  }
};

// Получаем параграфы для конкретной главы
// Получаем параграфы для конкретной главы
// Получаем параграфы для конкретной главы
// Получаем параграфы для конкретной главы
const getChapterParagraphs = (chapterIndex) => {
  const content = bookData.value.chapters[chapterIndex].content;

  // Разбиваем по переносам строк
  const lines = content.split('\n');

  const paragraphs = [];
  let currentParagraph = '';

  for (let line of lines) {
    // Проверяем, является ли строка элементом списка
    const trimmed = line.trim();
    const isListItem = /^[•\-]|^\d+[\.\)]|^[a-zA-Z][\.\)]/.test(trimmed);  // ← добавлена поддержка букв
    const isEmpty = trimmed === '';

    // Пустая строка — разделитель
    if (isEmpty) {
      if (currentParagraph.trim()) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = '';
      }
      continue;
    }

    // Элемент списка — отдельный параграф
    if (isListItem) {
      if (currentParagraph.trim()) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = '';
      }
      paragraphs.push(trimmed);
    } else {
      // Обычный текст — добавляем к текущему абзацу
      if (currentParagraph) {
        currentParagraph += ' ' + trimmed;
      } else {
        currentParagraph = trimmed;
      }
    }
  }

  // Добавляем последний абзац
  if (currentParagraph.trim()) {
    paragraphs.push(currentParagraph.trim());
  }

  return paragraphs;
};


// Парсим части для конкретной главы и параграфа
const getPartsForParagraph = (chapterIndex, pIndex, paragraph) => {
  const cacheKey = `${chapterIndex}_${pIndex}`;

  if (allParts.value[cacheKey]) {
    return allParts.value[cacheKey];
  }

  const regex = /([^()]*?)\(\(([^)]*?)\)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(paragraph)) !== null) {
    // Текст ДО перевода (с пробелами!)
    if (match.index > lastIndex) {
      const textBefore = paragraph.slice(lastIndex, match.index);
      if (textBefore) {  // ← убрал .trim() чтобы сохранить пробелы
        parts.push({text: textBefore, hasTranslation: false});
      }
    }

    // Сам перевод
    const englishText = match[1];  // ← убрал .trim() чтобы сохранить пробелы
    const translation = match[2].trim();
    if (englishText) {
      parts.push(reactive({
        text: englishText,
        translation: translation,
        hasTranslation: true,
        showTranslation: false
      }));
    }

    lastIndex = match.index + match[0].length;
  }

  // Текст ПОСЛЕ последнего перевода (с пробелами!)
  if (lastIndex < paragraph.length) {
    const remaining = paragraph.slice(lastIndex);
    if (remaining) {  // ← убрал .trim() чтобы сохранить пробелы
      parts.push({text: remaining, hasTranslation: false});
    }
  }

  allParts.value[cacheKey] = parts;
  return parts;
};

// Функции для работы с переводами заголовков
const getTitleText = (title) => {
  const match = title.match(/^(.*?)(?:\(\(([^)]*?)\)\))?$/);
  return match ? match[1].trim() : title;
};

const getTitleTranslation = (title) => {
  const match = title.match(/\(\(([^)]*?)\)\)$/);
  return match ? match[1].trim() : null;
};

const getTitleTranslationState = (chapterIndex) => {
  return titleTranslations.value[chapterIndex] || false;
};

const toggleTitleTranslation = (chapterIndex) => {
  titleTranslations.value[chapterIndex] = !titleTranslations.value[chapterIndex];
};

const toggleTranslation = (part) => {
  part.showTranslation = !part.showTranslation;
};

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
  localStorage.setItem('readerTheme', currentTheme.value);
};

const applyFontSize = (size) => {
  document.documentElement.style.setProperty('--reader-font-size', size + 'px');

  // Обновляем параграфы
  const paragraphs = document.querySelectorAll('.paragraph');
  paragraphs.forEach(el => {
    el.style.fontSize = size + 'px';
  });

  // ✅ Обновляем заголовки глав
  const titles = document.querySelectorAll('.chapter-title');
  titles.forEach(el => {
    el.style.fontSize = size + 'px';
  });

  localStorage.setItem('readerFontSize', size);
};

const updateFontSize = () => {
  applyFontSize(fontSize.value);
};

watch(fontSize, (newVal) => {
  applyFontSize(newVal);
});

onMounted(() => {
  const savedTheme = localStorage.getItem('readerTheme');
  if (savedTheme) currentTheme.value = savedTheme;

  const savedFontSize = localStorage.getItem('readerFontSize');
  if (savedFontSize) {
    fontSize.value = parseInt(savedFontSize);
    setTimeout(() => {
      applyFontSize(fontSize.value);
    }, 100);
  }

  window.addEventListener('scroll', updateScrollProgress);
  setTimeout(updateScrollProgress, 500);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollProgress);

  // Останавливаем аудио при уходе
  if (audioPlayer.value) {
    audioPlayer.value.pause();
  }
});
</script>


<style scoped>
.reader-container {
  --reader-font-size: 16px;
  --reader-line-height: 1.45;

  max-width: 800px;
  margin: 0 auto;
  padding: 20px 20px 40px;
  padding-top: 70px; /* ← добавляем отступ сверху */

  min-height: 100vh;
  transition: all 0.3s ease;
  font-family: 'Georgia', serif;
}

/* ========== ТЕМЫ ========== */
.reader-container.light {
  background: #f5f0eb;
  color: #2c2c2c;
}

.reader-container.dark {
  background: #1a1a1a;
  color: #e0e0e0;
}

/* ========== ХЕДЕР - ФИКСИРОВАННЫЙ ========== */
.reader-header {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 8px 0 6px;
  background: inherit;
  border-bottom: 2px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 12px;
}

.dark .reader-header {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.header-top {
  text-align: center;
  margin-bottom: 4px;
}

.book-title {
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  margin: 0 0 2px;
}

.book-author {
  font-size: 13px;
  opacity: 0.6;
  margin: 0;
  font-style: italic;
}

/* ========== ОДНА СТРОКА УПРАВЛЕНИЯ ========== */
.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 10px;
  padding-bottom: 5px;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.progress-bar {
  flex: 1;
  height: 3px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  overflow: hidden;
  min-width: 30px;
}

.dark .progress-bar {
  background: rgba(255, 255, 255, 0.08);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  border-radius: 10px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 11px;
  font-weight: bold;
  opacity: 0.6;
  min-width: 32px;
  text-align: right;
}

.controls-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}


/* === КНОПКА АУДИО === */
.audio-toggle {
  width: 26px;
  height: 26px;
  border: 2px solid rgba(0, 0, 0, 0.12);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dark .audio-toggle {
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
}

.audio-toggle:hover {
  transform: scale(1.1);
  background: rgba(76, 175, 80, 0.2);
}

.audio-toggle.active {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.15);
}

/* === АУДИОПЛЕЕР С КНОПКАМИ === */
/* Аудиоплеер — прижат к низу отдельно */
.audio-player-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 8px 16px 12px;
  background: inherit;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
}

.dark .audio-player-wrapper {
  border-top-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}

.audio-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.audio-controls audio {
  flex: 1;
  height: 36px;
  outline: none;
  border-radius: 8px;
  min-width: 0; /* важно для flex-элемента */
}

.rewind-btn,
.forward-btn {
  width: 44px;
  height: 36px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.04);
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  color: #4b5563;
  transition: all 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.dark .rewind-btn,
.dark .forward-btn {
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #d1d5db;
}

.rewind-btn:hover,
.forward-btn:hover {
  background: rgba(76, 175, 80, 0.15);
  border-color: #4CAF50;
  transform: scale(1.05);
}

.rewind-btn:active,
.forward-btn:active {
  transform: scale(0.95);
}

/* Скрываем кнопку скачивания у аудио */
.audio-controls audio::-webkit-media-controls-download-button {
  display: none !important;
}

.audio-controls audio::-webkit-media-controls-enclosure {
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.04);
}

.dark .audio-controls audio::-webkit-media-controls-enclosure {
  background: rgba(255, 255, 255, 0.04);
}

/* Firefox */
.audio-controls audio::-moz-media-controls-download-button {
  display: none !important;
}

/* Скрываем кнопку AirPlay в Safari */
.audio-controls audio::-webkit-media-controls-remote-playback-button {
  display: none !important;
}

/* Скрываем кнопку AirPlay в других браузерах */
.audio-controls audio::-webkit-media-controls-remote-playback-button {
  display: none !important;
}

/* Полный набор для Safari */
.audio-controls audio::-webkit-media-controls-panel {
  -webkit-appearance: none;
}



/* ========== КНОПКА ПЕРЕКЛЮЧЕНИЯ ТЕМ ========== */
.theme-toggle {
  width: 26px;
  height: 26px;
  border: 2px solid rgba(0, 0, 0, 0.12);
  border-radius: 50%;
  background: #0000004a;
  cursor: none;
  font-size: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dark .theme-toggle {
  border-color: rgba(255, 255, 255, 0.12);
}

.theme-toggle:hover {
  transform: scale(1.1);
}

/* ========== ПОЛЗУНОК РАЗМЕРА ШРИФТА ========== */
.font-size-control {
  display: flex;
  align-items: center;
  gap: 1px;
  position: relative;
}

.slider-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.font-size-value {
  font-size: 11px;
  font-weight: bold;
  opacity: 0.6;
  color: inherit;
  margin-bottom: 5px;
  min-width: 28px;
  text-align: center;
}

.font-size-control input[type="range"] {
  width: 100px;
  height: 3px;
  -webkit-appearance: none;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  outline: none;
  transition: background 0.2s;
}

.dark .font-size-control input[type="range"] {
  background: rgba(255, 255, 255, 0.2);
}

.font-size-control input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #4CAF50;
  border-radius: 50%;
  cursor: none;
  transition: all 0.2s;
}

.font-size-control input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.dark .font-size-control input[type="range"]::-webkit-slider-thumb {
  background: #66BB6A;
}

.font-size-control input[type="range"]::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #4CAF50;
  border-radius: 50%;
  cursor: none;
  border: none;
}

.dark .font-size-control input[type="range"]::-moz-range-thumb {
  background: #66BB6A;
}

/* ========== КОНТЕНТ ========== */
.reader-content {
  padding: 5px 0 30px;
}

.chapter-wrapper {
  margin-bottom: 40px;
}

.chapter-wrapper:last-child {
  margin-bottom: 0;
}

.chapter-title {
  font-size: calc(var(--reader-font-size) + 6px);
  font-weight: bold;
  text-align: center;
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.08);
}

.dark .chapter-title {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.paragraph-wrapper {
  margin-bottom: 8px;
}

.paragraph {
  font-size: var(--reader-font-size);
  line-height: var(--reader-line-height);
  margin-bottom: 0;
  text-align: justify;
}

/* ========== ТЕКСТ ========== */
.text-part {
  transition: all 0.2s ease;
  border-radius: 3px;
  padding: 1px 0;
}

.text-part.with-translation {
  cursor: none;
  position: relative;
  transition: all 0.2s ease;
}

.text-part.with-translation:hover {
  background: rgba(255, 222, 0, 0.37);
}

.text-part.with-translation.translation-open {
  border-bottom: 2px solid rgba(76, 175, 80, 0.4);
}

.text-part.with-translation.translation-open:hover {
  background: rgba(76, 175, 80, 0.18);
}

.dark .text-part.with-translation.translation-open {
  border-bottom-color: rgba(76, 175, 80, 0.5);
}

/* ========== ВСТРОЕННЫЙ ПЕРЕВОД ========== */
.inline-translation {
  display: block;
  padding: 6px 12px;
  margin-bottom: 6px;
  background: rgba(76, 175, 80, 0.08);
  border-radius: 6px;
  border-left: 3px solid #4CAF50;
  font-size: 0.9em;
  line-height: 1.25;
  animation: slideDown 0.25s ease;
}

.dark .inline-translation {
  background: rgba(76, 175, 80, 0.12);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


/* ========== СТИЛИ ДЛЯ ВЫДЕЛЕНИЙ В ТЕКСТЕ ========== */
.paragraph strong {
  font-weight: 700;
  color: #ff6b35;
}

.paragraph em {
  font-style: italic;
  color: #4CAF50;
}

.paragraph mark {
  background: #ffdd57;
  color: #2c2c2c;
  padding: 0 4px;
  border-radius: 3px;
}

.paragraph u {
  text-decoration: underline;
  text-decoration-color: #4CAF50;
  text-decoration-thickness: 2px;
}

.paragraph span[style] {
  /* Стили для span с инлайн-стилями */
}

/* Для темной темы */
.dark .paragraph mark {
  background: #ffdd57;
  color: #1a1a1a;
}

.dark .paragraph strong {
  color: #ff8a65;
}

.dark .paragraph em {
  color: #81C784;
}


/* ========== КАРТИНКИ В КНИГЕ ========== */
.chapter-image {
  margin: 20px 0;
  text-align: center;

}

.chapter-image img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: inline-block; /* ← чтобы работало с text-align: center */

}


.dark .chapter-image img {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

/* ========== АДАПТИВ ДЛЯ МОБИЛЬНЫХ ========== */
@media (max-width: 600px) {
  .chapter-image img {
    max-height: 200px;
    border-radius: 8px;
  }
  .book-title {
    font-size: 16px;
  }

  .book-author {
    font-size: 13px;
  }

  .chapter-title {
    font-size: 18px;
    margin-bottom: 14px;
  }

  .controls-row {
    gap: 6px;
    padding-top: 15px;
  }


  .progress-text {
    font-size: 10px;
    min-width: 28px;
  }

  .theme-toggle {
    width: 24px;
    height: 24px;
    font-size: 11px;
  }

  .font-size-control input[type="range"] {
    width: 75px;
  }

  .font-size-value {
    font-size: 10px;
    min-width: 22px;
  }

  .inline-translation {
    padding: 4px 10px;
    font-size: 0.85em;
  }

  .reader-header {
    padding: 6px 0 4px;
  }
}

@media (max-width: 400px) {

  .chapter-title {
    font-size: 16px;
  }

  .controls-row {
    gap: 4px;
  }

  .progress-text {
    font-size: 9px;
    min-width: 24px;
  }

  .theme-toggle {
    width: 22px;
    height: 22px;
    font-size: 10px;
  }


  .font-size-value {
    font-size: 9px;
    min-width: 18px;
  }

  .inline-translation {
    padding: 3px 8px;
    font-size: 0.8em;
  }
}
</style>
