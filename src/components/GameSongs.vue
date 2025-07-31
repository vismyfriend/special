<template>
  <div class="minimal-container">
    <!-- Заголовок задания -->
    <h2>{{ currentTask.taskDescription }}</h2>

    <!-- Картинка -->
    <img
      v-if="currentTask.taskPicture"
      :src="currentTask.taskPicture"
      alt="Task image"
      class="task-image"
    >

    <!-- Полезные слова -->
    <div v-if="currentTask.usefulWords" class="useful-words">
      <ul>
        <li v-for="(pair, index) in parseUsefulWords(currentTask.usefulWords)" :key="index">
          <strong>{{ pair.english }}</strong> - {{ pair.russian }}
        </li>
      </ul>
    </div>

    <!-- Информация о песне -->
    <h3>{{ script.singer }}</h3>
    <h4>{{ script.audioName }}</h4>

    <!-- Аудиоплеер -->
    <audio
      controls
      v-if="currentTask.audio"
      class="audio-player"
    >
      <source :src="currentTask.audio" type="audio/mp3">
    </audio>

    <!-- Дополнительная информация -->
    <p class="extra-info">{{ currentTask.extraInfo }}</p>

    <!-- Текст с размытыми словами -->
    <div class="lyrics">
      <div
        v-for="(line, index) in parsedLyrics"
        :key="index"
        v-html="line"
        @click="handleWordClick"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import songsData from '../dataForGames/SongsData'

const route = useRoute()
const missionName = route.params.missionName

// Получаем данные
const songData = songsData[missionName]
const currentTask = songData?.tasks?.[0] || {}
const script = currentTask.script?.[0] || {}

// Парсим полезные слова
const parseUsefulWords = (wordsString) => {
  if (!wordsString) return []
  return wordsString.split(',').map(pair => {
    const [english, russian] = pair.split('-').map(s => s.trim())
    return { english, russian }
  })
}

// Парсим текст для размытия слов в скобках
const parsedLyrics = computed(() => {
  if (!script.text) return []

  return script.text.split('\n').map(line => {
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
.minimal-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f5f5;
  font-family: Arial, sans-serif;
  color: #333;
  border-radius: 8px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

h3 {
  color: #34495e;
  margin: 15px 0 10px;
}

.task-image {
  width: 100%;

  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
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
  border-radius: 8px;
}

.extra-info {
  font-style: italic;
  color: #7f8c8d;
  margin: 10px 0;
}

.lyrics {
  line-height: 1.2;
  white-space: pre-line;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-size: 20px;
  text-align: center;
}

.blurred {
  filter: blur(5px);
  background: #ddd;
  padding: 0 4px;
  border-radius: 4px;
  cursor: none;
  transition: all 0.3s ease;
}

.revealed {
  filter: none;
  background: #ffeaa7;
  font-weight: bold;
}
</style>
