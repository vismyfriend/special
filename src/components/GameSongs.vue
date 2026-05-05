
<template>
  <div class="minimal-container">
    <!-- Общий заголовок -->
    <h2>{{ songData.mainDescription }}</h2>

    <!-- НАВИГАЦИЯ МЕЖДУ ЗАДАЧАМИ -->
    <div v-if="songData.tasks.length > 1" class="task-navigation">
      <button @click="prevTask" :disabled="currentTaskIndex === 0" class="nav-button">←</button>
      <div class="task-counter">{{ currentTaskIndex + 1 }}/{{ songData.tasks.length }}</div>
      <button @click="nextTask" :disabled="currentTaskIndex === songData.tasks.length - 1" class="nav-button">→</button>
    </div>

    <!-- Заголовок задания -->
    <h3 v-if="currentTask.taskDescription">{{ currentTask.taskDescription }}</h3>

    <!-- Картинка -->
    <img v-if="currentTask.taskPicture" :src="currentTask.taskPicture" alt="Task image" class="task-image">

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
      <h3>{{ currentScriptData.singer }}</h3>
      <h4 v-if="currentScriptData.audioName">{{ currentScriptData.audioName }}</h4>
    </div>

    <!-- Аудиоплеер -->
    <audio controls v-if="currentTask.audio" class="audio-player">
      <source :src="currentTask.audio" type="audio/mp3">
    </audio>

    <!-- Дополнительная информация -->
    <p v-if="currentTask.extraInfo" class="extra-info">{{ currentTask.extraInfo }}</p>

    <!-- Блок для песен -->
    <div v-if="currentTask.taskID === 'listenCarefully'" class="song-text">
      <div v-for="(line, index) in songLines" :key="index" v-html="line" @click="handleWordClick"></div>
    </div>

    <!-- Блок для диалогов -->
    <div v-if="currentTask.taskID === 'taskDialogs'" class="dialog-text">
      <div v-for="(line, index) in dialogLines" :key="index" class="dialog-line" :style="getLineStyle(line, index)">
        <div v-if="line.character" class="dialog-character" :style="{ color: getCharacterColor(line.character, index).text }">
          {{ line.character }}:
        </div>
        <div class="dialog-text-content" v-html="formatDialogText(line.text)" @click="handleWordClick"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import songsData from '../dataForGames/SongsData'

const route = useRoute()
const missionName = route.params.missionName

// Индекс текущей задачи
const currentTaskIndex = ref(0)

// Получаем данные
const songData = songsData[missionName]

// Текущая задача
const currentTask = computed(() => songData?.tasks?.[currentTaskIndex.value] || {})

// Текущие данные скрипта (первый объект в массиве script)
const currentScriptData = computed(() => currentTask.value.script?.[0] || {})

// ========== ОПРЕДЕЛЕНИЕ ФОРМАТА ДАННЫХ ==========
const hasRolesFormat = computed(() => {
  return currentScriptData.value.roles && Array.isArray(currentScriptData.value.roles)
})

// ========== МАССИВ ЦВЕТОВ ДЛЯ ПЕРСОНАЖЕЙ ==========
const characterColorMap = ref(new Map())
const colorPalette = [
  { bg: '#f0f7ff', borderLeftColor: '#3498db', text: '#2980b9' },   // Синий
  { bg: '#f5fff0', borderLeftColor: '#2ecc71', text: '#27ae60' },   // Зеленый
  { bg: '#fff5f0', borderLeftColor: '#e67e22', text: '#d35400' },    // Оранжевый
  { bg: '#f5f0ff', borderLeftColor: '#9b59b6', text: '#8e44ad' },    // Фиолетовый
  { bg: '#f0fff5', borderLeftColor: '#1abc9c', text: '#16a085' },    // Бирюзовый
  { bg: '#fff0f5', borderLeftColor: '#e84393', text: '#c44569' },    // Розовый
  { bg: '#f0f5ff', borderLeftColor: '#5dade2', text: '#2c3e50' }     // Голубой
]

// ========== ПОЛУЧЕНИЕ ЦВЕТА ДЛЯ ПЕРСОНАЖА ==========
const getCharacterColor = (characterName, index) => {
  // Для пустого имени используем цвет по индексу
  if (!characterName || characterName === '') {
    const colorIndex = index % colorPalette.length
    return colorPalette[colorIndex]
  }

  // Проверяем, есть ли уже цвет для этого персонажа
  if (characterColorMap.value.has(characterName)) {
    return characterColorMap.value.get(characterName)
  }

  // Назначаем новый цвет
  const newColorIndex = characterColorMap.value.size % colorPalette.length
  const color = colorPalette[newColorIndex]
  characterColorMap.value.set(characterName, color)

  return color
}

// ========== ПРОСТАЯ ЛОГИКА ОТСТУПОВ ==========
// Просто чередуем: первый персонаж слева, второй справа, третий слева и т.д.
const getLineStyle = (line, index) => {
  // Получаем цвет для персонажа
  const color = getCharacterColor(line.character, index)

  // Простая логика отступа:
  // Собираем всех уникальных персонажей в этом диалоге
  const allCharacters = [...new Set(dialogLines.value.map(l => l.character))]
  const characterPosition = allCharacters.findIndex(c => c === line.character)

  // Если персонаж на четной позиции (0, 2, 4...) - отступ слева
  // Если на нечетной (1, 3, 5...) - отступ справа
  const isLeftAligned = characterPosition % 2 === 0

  return {
    backgroundColor: color.bg,
    borderLeftColor: color.borderLeftColor,
    marginLeft: isLeftAligned ? '0' : '10%',
    marginRight: !isLeftAligned ? '0' : '5%'
  }
}

// ========== ПАРСИНГ ДИАЛОГОВ (ПОДДЕРЖКА ДВУХ ФОРМАТОВ) ==========
const dialogLines = computed(() => {
  if (!currentScriptData.value) return []

  // НОВЫЙ ФОРМАТ: есть roles
  if (hasRolesFormat.value) {
    return currentScriptData.value.roles.map(role => ({
      character: role.character,
      text: role.text
    }))
  }

  // СТАРЫЙ ФОРМАТ: парсим text построчно
  if (currentScriptData.value.text) {
    const lines = currentScriptData.value.text.split('\n')
    const parsed = []

    for (const line of lines) {
      if (!line.trim()) continue

      // Ищем имя персонажа в формате "Имя: текст"
      const match = line.match(/^([A-Za-z]+):\s*"?([^"]*)"?/)
      if (match) {
        const character = match[1]
        let text = match[2]
        text = text.replace(/^"|"$/g, '')
        parsed.push({ character, text })
      } else {
        // Если нет имени, оставляем без персонажа
        parsed.push({ character: '', text: line })
      }
    }
    return parsed
  }

  return []
})

// ========== ДЛЯ ПЕСЕН (СТАРЫЙ ФОРМАТ) ==========
const songLines = computed(() => {
  if (!currentScriptData.value || hasRolesFormat.value) return []
  if (!currentScriptData.value.text) return []

  return currentScriptData.value.text.split('\n').map(line => {
    return line.replace(/\(([^)]+)\)/g, (match, word) => {
      return `<span class="blurred" data-word="${word}">${word}</span>`
    })
  })
})

// ========== ФОРМАТИРОВАНИЕ ТЕКСТА ДИАЛОГА ==========
const formatDialogText = (text) => {
  if (!text) return ''
  console.log('Original text:', text) // Проверяем что приходит
  const result = text.replace(/\(([^)]+)\)/g, (match, word) => {
    console.log('Found word in parentheses:', word) // Проверяем что нашли
    return `<span class="blurred" data-word="${word}">${word}</span>`
  })
  console.log('Result:', result) // Проверяем результат
  return result
}

// ========== НАВИГАЦИЯ ==========
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

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
const parseUsefulWords = (wordsString) => {
  if (!wordsString) return []
  return wordsString.split(',').map(pair => {
    const [english, russian] = pair.split('-').map(s => s.trim())
    return { english, russian }
  })
}

const handleWordClick = (e) => {
  if (e.target.classList && e.target.classList.contains('blurred')) {
    e.target.classList.remove('blurred')
    e.target.classList.add('revealed')
  }
}
</script>

<style scoped>
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

/* Навигация */
.task-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 10px;
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
  cursor: none;
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
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.useful-words {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 2px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.useful-words ul {
  list-style-type: none;
  padding: 0;
  margin: 10px 0 0 0;
}

.useful-words li {
  padding: 4px 0;
  border-bottom: 1px solid #eee;
}

.useful-words li:last-child {
  border-bottom: none;
}

.audio-player {
  width: 100%;
  margin: 0;
  border-radius: 8px;
}

.extra-info {
  font-style: italic;
  color: #7f8c8d;
  margin: 10px 0;
  text-align: center;
}

/* Стили для песен */
.song-text {
  line-height: 1.25;
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

/* ========== СТИЛИ ДЛЯ ДИАЛОГОВ ========== */
.dialog-text {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.dialog-text-content {
  font-size: 16px;
  word-wrap: break-word;
  display: inline-block;
  width: 100%;
}

.dialog-text-content .blurred {
  filter: blur(5px);
  background: #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  display: inline-block;
  padding: 0 2px;
}
.dialog-line {
  margin-bottom: 4px;
  padding: 5px 12px;
  border-radius: 6px;
  line-height: 18px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 1px;
  transition: all 0.2s ease;
  border-left: 4px solid;
}

.dialog-character {
  font-weight: bold;
  font-size: 11px;
  letter-spacing: 0.5px;
}

.dialog-text-content {
  font-size: 15px;
  word-wrap: break-word;
}

/* Стили для размытых слов */

.blurred:hover {
  filter: blur(3px);
  background: #ccc;
}




/* Для v-html внутри компонента */
:deep(.blurred) {
  filter: blur(5px);
  background: #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  padding: 0 2px;
}

:deep(.revealed) {
  filter: none;
  background: #ffeaa7;
  font-weight: bold;
  border-radius: 4px;
  padding: 0 2px;
}
</style>

