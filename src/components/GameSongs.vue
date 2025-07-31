<template>
  <div class="minimal-container">
    <!-- Общий заголовок -->
    <h2>{{ songData.mainDescription }}</h2>

    <!-- НАВИГАЦИЯ МЕЖДУ ЗАДАЧАМИ (НОВАЯ СЕКЦИЯ) -->
    <!-- Показываем только если задач больше одной -->
    <div v-if="songData.tasks.length > 1" class="task-navigation">
      <!-- Кнопка "Назад" -->
      <button
        @click="prevTask"
        :disabled="currentTaskIndex === 0"
        class="nav-button"
      >
        ←
      </button>

      <!-- Счётчик задач -->
      <div class="task-counter">
        {{ currentTaskIndex + 1 }}/{{ songData.tasks.length }}
      </div>

      <!-- Кнопка "Вперёд" -->
      <button
        @click="nextTask"
        :disabled="currentTaskIndex === songData.tasks.length - 1"
        class="nav-button"
      >
        →
      </button>
    </div>

    <!-- Заголовок задания -->
    <h3 v-if="currentTask.taskDescription">{{ currentTask.taskDescription }}</h3>

    <!-- Картинка -->
    <img
      v-if="currentTask.taskPicture"
      :src="currentTask.taskPicture"
      alt="Task image"
      class="task-image"
    >

    <!-- Полезные слова -->
    <div v-if="currentTask.usefulWords" class="useful-words">
      <h4>Useful words:</h4>
      <ul>
        <li v-for="(pair, index) in parseUsefulWords(currentTask.usefulWords)" :key="index">
          <strong>{{ pair.english }}</strong> - {{ pair.russian }}
        </li>
      </ul>
    </div>

    <!-- Информация об аудио -->
    <div v-if="currentTask.taskID === 'listenCarefully'">
      <h3>{{ currentScript.singer }}</h3>
      <h4 v-if="currentScript.audioName">{{ currentScript.audioName }}</h4>
    </div>

    <!-- Аудиоплеер -->
    <audio
      controls
      v-if="currentTask.audio"
      class="audio-player"
    >
      <source :src="currentTask.audio" type="audio/mp3">
    </audio>

    <!-- Дополнительная информация -->
    <p v-if="currentTask.extraInfo" class="extra-info">{{ currentTask.extraInfo }}</p>

    <!-- Блок для песен -->
    <div
      v-if="currentTask.taskID === 'listenCarefully'"
      class="song-text"
    >
      <div
        v-for="(line, index) in parsedLyrics"
        :key="index"
        v-html="line"
        @click="handleWordClick"
      ></div>
    </div>

    <!-- Блок для диалогов -->
    <div
      v-if="currentTask.taskID === 'taskDialogs'"
      class="dialog-text"
    >
      <div
        v-for="(line, index) in parsedLyrics"
        :key="index"
        class="dialog-line"
        v-html="line"
        @click="handleWordClick"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import songsData from '../dataForGames/SongsData'

const route = useRoute()
const missionName = route.params.missionName

// НОВОЕ: Добавляем индекс текущей задачи
const currentTaskIndex = ref(0)

// Получаем данные
const songData = songsData[missionName]

// НОВОЕ: Изменяем currentTask на computed с учётом индекса
const currentTask = computed(() => songData?.tasks?.[currentTaskIndex.value] || {})

// НОВОЕ: Переименовываем script в currentScript для ясности
const currentScript = computed(() => currentTask.value.script?.[0] || {})

// НОВОЕ: Функции для навигации между задачами
const prevTask = () => {
  if (currentTaskIndex.value > 0) {
    currentTaskIndex.value--
  }
}

const nextTask = () => {
  if (currentTaskIndex.value < songData.tasks.length - 1) {
    currentTaskIndex.value++
  }
}

// Парсим полезные слова
const parseUsefulWords = (wordsString) => {
  if (!wordsString) return []
  return wordsString.split(',').map(pair => {
    const [english, russian] = pair.split('-').map(s => s.trim())
    return { english, russian }
  })
}

// Парсим текст для размытия слов в скобках
// НОВОЕ: Используем currentScript вместо script
const parsedLyrics = computed(() => {
  if (!currentScript.value.text) return []

  return currentScript.value.text.split('\n').map(line => {
    return line.replace(/\(([^)]+)\)/g, (match, word) => {
      return `<span class="blurred" data-word="${word}">${word}</span>`
    })
  })
})

// Обработка клика по слову
const handleWordClick = (e) => {
  if (e.target.classList.contains('blurred')) {
    e.target.classList.remove('blurred')
    e.target.classList.add('revealed')
  }
}
</script>

<style>
/* Общие стили */
.minimal-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f5f5;
  font-family: Arial, sans-serif;
  color: #333;
  border-radius: 8px;
}

/* НОВЫЕ СТИЛИ ДЛЯ НАВИГАЦИИ */
.task-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.task-counter {
  font-size: 0.9rem;
  color: #5a5a5a;
  font-weight: 500;
  padding: 4px 10px;
  background-color: #f0f7ff;
  border-radius: 12px;
  border: 1px solid #e0e7ff;
  min-width: 50px;
  text-align: center;
}

.nav-button {
  background: #3498db;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.nav-button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.nav-button:not(:disabled):hover {
  background: #2980b9;
}

/* Остальные стили остаются без изменений */
h2 {
  color: #2c3e50;
  margin-bottom: 2px;
  text-align: center;
  font-size: 22px;
  font-weight: 800;
}


h3 {
  color: #34495e;
  margin: 5px;
  font-size: 20px;
  text-align: center;
}


h4 {
  color: #7f8c8d;
  margin: 10px 0;
}

.task-image {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.useful-words {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.useful-words ul {
  list-style-type: none;
  padding: 0;
  margin: 10px 0 0 0;
}

.useful-words li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.useful-words li:last-child {
  border-bottom: none;
}

.audio-player {
  width: 100%;
  margin: 20px 0;
  border-radius: 8px;
}

.extra-info {
  font-style: italic;
  color: #7f8c8d;
  margin: 10px 0;
  text-align: center;
}

/* Стили для текста песен */
.song-text {
  line-height: 1.6;
  white-space: pre-line;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-size: 18px;
  text-align: center;
  max-height: 400px;
  overflow-y: auto;
}

/* Для красивого скроллбара */
.song-text::-webkit-scrollbar {
  width: 8px;
}
.song-text::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.song-text::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
.song-text::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Стили для диалогов */
.dialog-text {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.dialog-line {
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  line-height: 1.5;
  text-align: left;
}

/* Цвета для разных собеседников */
.dialog-line:nth-child(odd) {
  background-color: #f0f7ff;
  border-left: 4px solid #3498db;
  margin-right: 20%;
}

.dialog-line:nth-child(even) {
  background-color: #f5fff0;
  border-left: 4px solid #2ecc71;
  margin-left: 20%;
}

/* Общие стили для размытых слов */
.blurred {
  filter: blur(5px);
  background: #ddd;
  border-radius: 4px;
  cursor: none;
  transition: all 0.3s ease;
  font-weight: bold;
}


.revealed {
  filter: none;
  background: #ffeaa7;
  font-weight: bold;
}
</style>
