<template>
  <div class="drag-game">
    <div class="game-header">
      <h2>🧩 Перетяни слова в правильный порядок 🧩</h2>
    </div>



    <!-- Обновленный блок с переводом/произнесением/картинкой/аудио -->
    <div class="translation-container" v-if="shouldShowTranslation">
      <!-- Картинка если есть -->
      <div v-if="currentPicture" class="picture-container">
        <img :src="currentPicture" alt="illustration" class="sentence-picture" />
      </div>
      <!-- Аудио кнопка -->
      <div v-if="currentAudio" class="audio-control">
        <button @click="playAudio(false)" class="audio-button" :class="{ 'playing': isPlaying }">
          <span class="audio-icon">{{ isPlaying ? '🔊' : '🔈' }}</span>
          <span>{{ isPlaying ? 'Играет...' : 'Прослушать' }}</span>
        </button>
      </div>
      <div class="translation-content">
        <div class="translation-text" :class="{ 'speak-prompt': isSpeakPrompt }">
          {{ displayTranslation }}
        </div>

        <!-- Произношение (транскрипция) -->
        <div v-if="currentHint"
             class="pronunciation-hint"
             :class="{ 'blurred': isHintBlurred }"
             @click="handleHintClick"

        >
          <span class="hint-icon"></span>
          <span class="hint-text">{{ currentHint }}</span>
        </div>


      </div>
    </div>

    <div ref="container" class="sentence-container">
      <div
        v-for="(item, index) in currentWords"
        :key="item.id"
        class="word-item"
      >
        <div
          class="word"
          :class="{
            'dragging-placeholder': draggedIndex === index,
            'correct-position': getWordStatus(index) === 'correct',
            'incorrect-position': getWordStatus(index) === 'incorrect',
            'not-checked': getWordStatus(index) === 'not-checked'
          }"
        >
          <span v-if="draggedIndex === index" class="drag-emoji">👇</span>
          <span v-else class="word-text">{{ item.word }}</span>
        </div>
      </div>
    </div>

    <div class="game-controls">
      <div class="progress-info">
        {{ completedSentences.size }} / {{ currentGameData.length }}
      </div>
      <button @click="handleControlButton" class="control-button" :class="buttonClass">
        {{ buttonText }}
      </button>
    </div>
  </div>

  <!-- Модальное окно завершения игры -->
  <div v-if="isGameFinished" class="game-overlay">
    <div class="game-over-modal">
      <div class="modal-header">
        <h2 class="special-font">🎉 Поздравляю! 🎉</h2>
      </div>

      <div class="modal-body">
        <div class="result-stats">
          <div class="stat-item">
            <span class="stat-label">Время:</span>
            <span class="stat-value">{{ formatTime(finalTime) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Предложений:</span>
            <span class="stat-value">{{ completedSentences.size }} / {{ currentGameData.length }}</span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="modal-btn improve-btn" @click="improveResult">
          📈 Улучшить результат
        </button>
        <button class="modal-btn backend-btn" @click="shareResults">
          🌎 Поделиться с миром
        </button>
        <button class="modal-btn finish-btn" @click="goToAllSets">
          🏁 К другим миссиям
        </button>
      </div>
    </div>
  </div>

</template>
<script>
import Sortable from 'sortablejs'
import { useRoute, useRouter } from 'vue-router'
import shortSentencesWordOrderData from '../dataForGames/short-sentences-word-order'
import { useGameStore } from 'stores/example-store'

export default {
  name: 'GameDragAndDropSortable',

  setup() {
    const route = useRoute()
    const router = useRouter()
    const gameStore = useGameStore()
    return {
      route,
      router,
      gameStore
    }
  },

  data() {
    return {
      sortable: null,
      draggedWord: null,
      draggedIndex: null,
      currentSentenceIndex: 0,
      currentGameData: [],
      sentences: [],
      shuffledSentences: [], // Добавляем перемешанные предложения
      currentWords: [],
      originalOrder: [],
      completedSentences: new Set(),
      remainingSentences: [],
      gamePhase: 'first-round',
      startTime: null,
      mistakes: 0,
      currentTranslation: '',
      currentHint: '',        // ← добавляем для произношения
      currentAudio: '',       // ← добавляем для аудио
      currentPicture: '',     // ← добавляем для картинки
      totalAttempts: 0,
      isPlaying: false,       // ← состояние воспроизведения
      isHintBlurred: true,
      isGameFinished: false,      // флаг завершения игры
      currentAudioObj: null,   // ← для управления аудио
      timerInterval: null,    // для таймера
      time: 0,                // текущее время игры
    }
  },

  computed: {
    isCurrentSentenceCompleted() {
      const userSentence = this.currentWords.map(w => w.word).join(' ')
      const correctSentence = this.originalOrder.map(w => w.word).join(' ')
      return userSentence === correctSentence
    },

    // Добавляем computed свойство для определения что показывать
    displayTranslation() {
      if (this.isCurrentSentenceCompleted) {
        return "Скажи это бегло по-английски вслух, тренируй произношение 🎤"
      }
      return this.currentTranslation || "Скажи это бегло по-английски вслух, тренируй произношение 🎤"
    },

    // Добавляем computed свойство для определения показывать ли блок
    shouldShowTranslation() {
      // Показываем если есть перевод ИЛИ если предложение собрано
      return this.currentTranslation || this.isCurrentSentenceCompleted
    },

    buttonText() {
      if (this.gamePhase === 'completed') {
        return '🎉 Завершить игру'
      }
      return this.isCurrentSentenceCompleted ? '🔄 Следующее' : '⏭️ пропустить пока'
    },

    buttonClass() {
      if (this.gamePhase === 'completed') {
        return 'finish'
      }
      return this.isCurrentSentenceCompleted ? 'next' : 'skip'
    },

    allSentencesCompleted() {
      return this.completedSentences.size === this.currentGameData.length
    },
    isSpeakPrompt() {
      return this.isCurrentSentenceCompleted || !this.currentTranslation
    },
    finalTime() {
      return this.time
    }
  },

  watch: {
    isCurrentSentenceCompleted(newVal) {
      // Когда предложение правильно собрано (все слова на своих местах)
      if (newVal) {
        // Разблюриваем произношение
        if (this.isHintBlurred) {
          this.isHintBlurred = false
        }
        // Если есть аудио, воспроизводим его
        if (this.currentAudio) {
          this.playAudio(false) // false = не автовоспроизведение, но снимем blur (уже сняли)
        }
      }
    }
  },
  mounted() {
    this.initializeGame()
  },

  methods: {
    initializeGame() {
      const missionName = this.route.params.missionName
      const allData = shortSentencesWordOrderData[missionName] || []

      // 🆕 Берем только 10 случайных предложений
      const shuffledAll = this.shuffleArray([...allData])
      this.currentGameData = shuffledAll.slice(0, 10)

      // Проверяем, что у нас есть хотя бы 10 предложений
      if (this.currentGameData.length === 0) {
        console.error('Нет данных для миссии:', missionName)
        return
      }

      console.log(`📚 Загружено ${this.currentGameData.length} предложений из ${allData.length}`)

      // Сохраняем полные объекты с переводами
      this.sentences = this.currentGameData

      // Перемешиваем предложения (полные объекты)
      this.shuffledSentences = this.shuffleArray([...this.sentences])

      this.completedSentences = new Set()
      this.remainingSentences = [...this.shuffledSentences.keys()]
      this.gamePhase = 'first-round'
      this.currentSentenceIndex = 0

      this.startTime = Date.now()
      this.mistakes = 0
      this.totalAttempts = 0
      // Запускаем таймер
      this.startTimer()
      this.loadSentence()
    },

    shuffleArray(array) {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    },

    loadSentence() {
      let sentenceIndex

      if (this.gamePhase === 'first-round') {
        sentenceIndex = this.currentSentenceIndex
      } else if (this.gamePhase === 'remaining') {
        if (this.remainingSentences.length === 0 || this.currentSentenceIndex >= this.remainingSentences.length) {
          this.prepareRemainingSentences()
          return
        }
        sentenceIndex = this.remainingSentences[this.currentSentenceIndex]
      } else if (this.gamePhase === 'completed') {
        this.finishGame()
        return
      }

      if (sentenceIndex === undefined || sentenceIndex >= this.shuffledSentences.length) {
        console.error('Invalid sentence index:', sentenceIndex)
        this.prepareRemainingSentences()
        return
      }

      const sentenceObj = this.shuffledSentences[sentenceIndex]

      if (!sentenceObj || !sentenceObj.eng) {
        console.error('No sentence object found for index:', sentenceIndex)
        this.prepareRemainingSentences()
        return
      }

      const text = sentenceObj.eng.trim()

      // Загружаем данные
      this.currentTranslation = sentenceObj.ru || ''
      this.currentHint = sentenceObj.hint || ''
      this.currentAudio = sentenceObj.audio || ''
      this.currentPicture = sentenceObj.pic || ''

      // 🆕 Логика blur:
      // 1. Если нет произношения (hint) → не показываем блок вообще (и так работает через v-if)
      // 2. Если это первое предложение (индекс 0) → показываем без blur
      // 3. Иначе → показываем с blur
      const isFirstSentence = (this.gamePhase === 'first-round' && this.currentSentenceIndex === 0)
      if (isFirstSentence) {
        this.isHintBlurred = false
      } else {
        this.isHintBlurred = true
      }

      const words = this.splitSentence(text)

      this.originalOrder = words.map(word => ({ id: this.uuid(), word }))
      this.currentWords = [...this.originalOrder].sort(() => Math.random() - 0.5)

      if (this.currentWords[0].word === this.originalOrder[0].word) {
        const firstWord = this.currentWords.shift()
        this.currentWords.push(firstWord)
      }

      this.$nextTick(() => this.initializeSortable())
    },

    splitSentence(sentence) {
      const words = []
      let currentWord = ''

      for (let i = 0; i < sentence.length; i++) {
        const char = sentence[i]

        if (char === ' ') {
          if (currentWord) {
            words.push(currentWord)
            currentWord = ''
          }
        } else if (/[.,!?;:]/.test(char)) {
          currentWord += char
          words.push(currentWord)
          currentWord = ''
        } else {
          currentWord += char
        }
      }

      if (currentWord) {
        words.push(currentWord)
      }

      return words
    },

    initializeSortable() {
      if (this.sortable) this.sortable.destroy()

      this.sortable = new Sortable(this.$refs.container, {
        animation: 180,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',

        forceFallback: true,
        fallbackOnBody: true,
        fallbackTolerance: 5,
        fallbackOffset: { x: 0, y: -8 },

        delay: 0,
        delayOnTouchOnly: false,

        onStart: (evt) => {
          this.draggedIndex = evt.oldIndex
          this.draggedWord = this.currentWords[evt.oldIndex].word
        },
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt
          if (oldIndex === newIndex) {
            this.draggedIndex = null
            return
          }
          const moved = this.currentWords.splice(oldIndex, 1)[0]
          this.currentWords.splice(newIndex, 0, moved)
          this.draggedIndex = null
          this.totalAttempts++
        }
      })
    },

    getWordStatus(index) {
      if (index === 0 && this.currentWords[index].word !== this.originalOrder[index].word) {
        return 'not-checked'
      }

      for (let i = 0; i <= index; i++) {
        if (this.currentWords[i].word !== this.originalOrder[i].word) {
          return i === index ? 'incorrect' : 'not-checked'
        }
      }

      return 'correct'
    },
    handleHintClick() {
      // При клике на заблюренный текст
      if (this.isHintBlurred) {
        // Если есть аудио - проигрываем и снимаем blur после прослушивания
        if (this.currentAudio) {
          this.playAudio(false) // снимем blur после прослушивания
        } else {
          // Если аудио нет - просто снимаем blur сразу
          this.isHintBlurred = false
        }
      }
    },
    // 🆕 Функция для воспроизведения аудио
    playAudio(isAutoPlay = false) {
      if (!this.currentAudio) return

      if (this.currentAudioObj) {
        this.currentAudioObj.pause()
        this.currentAudioObj.currentTime = 0
      }

      this.currentAudioObj = new Audio(this.currentAudio)
      this.isPlaying = true

      this.currentAudioObj.play().catch(err => {
        console.error('Ошибка воспроизведения аудио:', err)
        this.isPlaying = false
      })

      this.currentAudioObj.onended = () => {
        this.isPlaying = false
        this.currentAudioObj = null

        // 🆕 Снимаем blur ТОЛЬКО если это НЕ автовоспроизведение
        // И если blur еще не снят (например, при правильном составлении мы уже сняли)
        if (!isAutoPlay && this.isHintBlurred) {
          this.isHintBlurred = false
        }
      }

      this.currentAudioObj.onerror = () => {
        console.error('Ошибка загрузки аудио')
        this.isPlaying = false
        this.currentAudioObj = null
      }
    },

    handleControlButton() {
      if (this.gamePhase === 'completed') {
        this.finishGame()
        return
      }

      if (!this.isCurrentSentenceCompleted) {
        this.mistakes++
      }

      if (this.isCurrentSentenceCompleted) {
        let currentIndex
        if (this.gamePhase === 'first-round') {
          // Сохраняем индекс из перемешанного массива
          currentIndex = this.currentSentenceIndex
        } else {
          currentIndex = this.remainingSentences[this.currentSentenceIndex]
        }
        this.completedSentences.add(currentIndex)
      }

      this.nextSentence()
    },

    nextSentence() {
      if (this.gamePhase === 'first-round') {
        this.currentSentenceIndex++

        if (this.currentSentenceIndex >= this.shuffledSentences.length) {
          this.prepareRemainingSentences()
          return
        }
      } else if (this.gamePhase === 'remaining') {
        this.currentSentenceIndex++

        if (this.currentSentenceIndex >= this.remainingSentences.length) {
          if (this.allSentencesCompleted) {
            this.gamePhase = 'completed'
          } else {
            this.currentSentenceIndex = 0
          }
        }
      }

      this.loadSentence()

      // 🆕 Автоматически воспроизводим аудио при загрузке нового предложения
      // Передаем true (автовоспроизведение), чтобы НЕ снимать blur
      setTimeout(() => {
        if (this.currentAudio) {
          this.playAudio(true)
        }
      }, 100)
    },

    prepareRemainingSentences() {
      this.remainingSentences = []
      for (let i = 0; i < this.shuffledSentences.length; i++) {
        if (!this.completedSentences.has(i)) {
          this.remainingSentences.push(i)
        }
      }

      if (this.remainingSentences.length === 0) {
        this.gamePhase = 'completed'
        this.finishGame()  // ← уже есть
      } else {
        this.gamePhase = 'remaining'
        this.currentSentenceIndex = 0
        this.loadSentence()
      }
    },

    finishGame() {
      this.isGameFinished = true

      // Останавливаем таймер если он есть
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }

      // Сохраняем в store для лидерборда
      this.gameStore.setLastGameResults(this.time, this.mistakes)
      this.gameStore.setGameName("SentenceOrder")
      this.gameStore.setWordSet(this.route.params.missionName)

      console.log('🎉 Игра завершена!', {
        time: this.time,
        mistakes: this.mistakes,
        completed: this.completedSentences.size
      })
    },
    uuid() {
      return Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
    },


    formatTime(ms) {
      if (typeof ms !== 'number' || isNaN(ms)) return '0 sec'
      const minutes = Math.floor(ms / 60000)
      const seconds = Math.floor((ms % 60000) / 1000)
      const getMinuteText = (num) => num === 1 ? 'minute' : 'minutes'
      const getSecondText = (num) => num === 1 ? 'second' : 'seconds'

      if (minutes === 0) return `${seconds} ${getSecondText(seconds)} only!`
      if (seconds === 0) return `${minutes} ${getMinuteText(minutes)} sharp!`
      return `${minutes} ${getMinuteText(minutes)} ${seconds} ${getSecondText(seconds)}`
    },

    improveResult() {
      // Перезапускаем игру на том же уровне
      this.isGameFinished = false
      this.mistakes = 0
      this.time = 0
      this.completedSentences.clear()
      this.currentSentenceIndex = 0
      this.gamePhase = 'first-round'

      // 🆕 Заново выбираем 10 случайных предложений
      const missionName = this.route.params.missionName
      const allData = shortSentencesWordOrderData[missionName] || []
      const shuffledAll = this.shuffleArray([...allData])
      this.currentGameData = shuffledAll.slice(0, 10)
      this.sentences = this.currentGameData

      // Запускаем таймер заново
      if (this.timerInterval) clearInterval(this.timerInterval)
      this.startTimer()

      // Перемешиваем предложения заново
      this.shuffledSentences = this.shuffleArray([...this.sentences])
      this.remainingSentences = [...this.shuffledSentences.keys()]
      this.completedSentences = new Set()

      this.loadSentence()
    },

    shareResults() {
      // Отправляем результаты на бэкенд и переходим в лидерборд
      this.gameStore.setLastGameResults(this.time, this.mistakes)
      this.gameStore.setGameName("SentenceOrder")
      this.gameStore.setWordSet(this.route.params.missionName)

      this.router.push({
        path: "/leader-board/",
        query: {
          missionName: this.route.params.missionName
        }
      })
    },

    goToAllSets() {
      this.router.push("/see-all-sets-of-words/")
    },

    startTimer() {
      this.timerInterval = setInterval(() => {
        this.time += 10
      }, 10)
    }


  },

  onBeforeUnmount() {
    if (this.sortable) this.sortable.destroy()
    if (this.timerInterval) clearInterval(this.timerInterval)
  }
}
</script>

<style scoped>
/* Стили остаются без изменений */
.drag-game {
  max-width: 800px;
  margin: 30px auto;
  padding: 5px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  user-select: none;
}

.game-header {
  text-align: center;
  margin-bottom: 15px;
}

.game-header h2 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  font-weight: 700;

}

.progress-info {
  background: rgba(255, 255, 255, 0.15);
  padding: 10px 5px;
  margin-right: 5px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  display: inline-block;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-family: Special_f1;
}

.sentence-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
  align-items: center;
  align-content: center;
  margin: 5px 0;
  padding: 2px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 18px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  min-height: 140px;
  transition: background 0.3s ease;
}

.word-item {
  flex-shrink: 0;
  cursor: grab;
}

.word-item:active {
  cursor: grabbing;
}

.word {
  background: white;
  border: 2px solid #4ade80;
  border-radius: 14px;
  padding: 10px 10px;
  font-weight: 600;
  user-select: none;
  transition: all 0.25s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  color: #1f2937;
  font-size: 16px;
  position: relative;
  min-width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.word:hover {
  background: #4ade80;
  color: white;
  box-shadow: 0 6px 16px rgba(74, 222, 128, 0.35);
}

.correct-position {
  border-color: #1aff00 !important;
  background: #4ade80c7 !important;
  color: white !important;
  box-shadow: 0 10px 20px rgba(74, 222, 128, 0.45);
  animation: glow 1.5s ease-in-out infinite alternate;
}

.incorrect-position {
  border-color: #9ca3af !important;
  background: #f3f4f6 !important;
  color: #6b7280 !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.not-checked {
  border-color: #9ca3af !important;
  background: #f3f4f6 !important;
  color: #6b7280 !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

@keyframes glow {
  from {
    box-shadow: 0 6px 16px rgba(74, 222, 128, 0.35);
  }
  to {
    box-shadow: 0 6px 16px rgba(62, 228, 123, 0.49);
  }
}

.sortable-chosen .word,
.sortable-drag .word,
.word:active {
  transform: none !important;
}

.dragging-placeholder {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 2px dashed rgba(255, 255, 255, 0.5) !important;
  color: transparent !important;
  animation: pulse 1.5s ease-in-out infinite;
}

.drag-emoji {
  font-size: 20px;
  animation: bounce 0.8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.sortable-ghost {
  opacity: 0.5;
}

.sortable-chosen .word {
  border-color: #fbbf24 !important;
  background: #fef3c7 !important;
  color: #92400e !important;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4) !important;
}

.sortable-drag .word {
  background: #fef3c7 !important;
  color: black !important;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.game-controls {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.control-button {
  padding: 7px 30px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  cursor: none;
  transition: all 0.25s ease;
  min-width: 220px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  font-family: Special_f1;
}

.control-button.next {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
}

.control-button.skip {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.control-button.finish {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  animation: celebrate 2s ease-in-out infinite;
}

.control-button:hover {
  transform: translateY(-2px) scale(1.03);
}

.control-button:active {
  transform: scale(0.97);
}

@keyframes celebrate {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.translation-container {
  text-align: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeIn 0.5s ease-in;
  margin: 10px 0;
}
.hint-text {
  font-size: 1.3rem;

}

.pronunciation-hint.blurred {
  filter: blur(3px);
  cursor: none;
}

.pronunciation-hint.blurred:hover {
  filter: blur(2px);
}

.translation-text {
  padding: 5px;
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Segoe UI', system-ui, sans-serif;
  line-height: 20px;
}

.audio-control {
  margin-top: 12px;
}

.audio-button {
  background: linear-gradient(135deg, #ffd89b, #c7e9fb);
  border: none;
  border-radius: 30px;
  padding: 8px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: none;
  transition: all 0.3s ease;
  color: #333;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.audio-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.audio-button.playing {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
  animation: pulse-audio 1s ease-in-out infinite;
}

.audio-icon {
  font-size: 1.1rem;
}

@keyframes pulse-audio {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.picture-container {
 display: flex;
  justify-content: center;
}

.sentence-picture {
  max-width: 120px;
  max-height: 120px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: white;
  padding: 5px;
}
/* Анимация пульсации для всех сообщений в translation-text */
.translation-text {
  animation: subtle-pulse 3s ease-in-out infinite;
}
.translation-text.speak-prompt {
  animation: pulse-glow 2s ease-in-out infinite;
  color: #00ff22;
  text-shadow: 0 0 10px rgba(254, 243, 199, 0.5);
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.9;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}
@keyframes subtle-pulse {
  0%, 100% {
    opacity: 0.95;
  }
  50% {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Модальное окно завершения игры */
.game-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.game-over-modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 32px;
  padding: 30px;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(255, 215, 0, 0.3);
  animation: slideUp 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-header {
  text-align: center;
  margin-bottom: 20px;

  h2 {
    font-size: 25px;
    font-weight: bold;
    background: linear-gradient(135deg, #ffd700, #ffb347);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin: 0;
  }
}

.modal-body {
  margin-bottom: 30px;
}

.result-stats {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }

  .stat-label {
    color: #aaa;
    font-weight: 500;
  }

  .stat-value {
    font-size: 18px;
    color: #ffd700;
    font-weight: bold;
  }
}

.modal-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-btn {
  padding: 14px 24px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

.improve-btn {
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);

  &:hover {
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }
}

.backend-btn {
  background: linear-gradient(135deg, #c521f3, #1976d2);
  color: white;
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);

  &:hover {
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
  }
}

.finish-btn {
  background: linear-gradient(135deg, #2196f3, #1976d2);
  color: white;
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);

  &:hover {
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
  }
}

.special-font {
  font-family: Special_f1;
  display: flex;
  justify-content: center;
  font-size: 25px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
