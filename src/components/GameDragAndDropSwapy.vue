<template>
  <div class="drag-game">
    <div class="game-header">
      <h2>🧩 Перетяни правильный слова порядок в</h2>
      <div class="progress-info">
        {{ completedSentences.size }} / {{ currentGameData.length }}
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
      <button @click="handleControlButton" class="control-button" :class="buttonClass">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { useRoute } from 'vue-router'
import shortSentencesWordOrderData from '../dataForGames/short-sentences-word-order'

export default {
  name: 'GameDragAndDropSortable',

  setup() {
    const route = useRoute()
    return {
      route
    }
  },

  data() {
    return {
      sortable: null,
      draggedWord: null,
      draggedIndex: null,
      currentSentenceIndex: 0,
      currentGameData: [],
      sentences: [], // Будет заполнен из currentGameData
      currentWords: [],
      originalOrder: [],
      completedSentences: new Set(),
      remainingSentences: [],
      gamePhase: 'first-round'
    }
  },

  computed: {
    isCurrentSentenceCompleted() {
      const userSentence = this.currentWords.map(w => w.word).join(' ')
      const correctSentence = this.originalOrder.map(w => w.word).join(' ')
      return userSentence === correctSentence
    },

    buttonText() {
      if (this.gamePhase === 'completed') {
        return '🎉 Завершить игру'
      }
      return this.isCurrentSentenceCompleted ? '🔄 Следующее' : '⏭️ Пропустить пока что'
    },

    buttonClass() {
      if (this.gamePhase === 'completed') {
        return 'finish'
      }
      return this.isCurrentSentenceCompleted ? 'next' : 'skip'
    },

    allSentencesCompleted() {
      return this.completedSentences.size === this.currentGameData.length
    }
  },

  mounted() {
    this.initializeGame()
  },

  methods: {
    initializeGame() {
      // Загружаем данные по missionName из роута
      const missionName = this.route.params.missionName
      this.currentGameData = shortSentencesWordOrderData[missionName] || []

      // Преобразуем данные в массив предложений
      this.sentences = this.currentGameData.map(item => item.eng)

      this.completedSentences = new Set()
      this.remainingSentences = [...this.sentences.keys()]
      this.gamePhase = 'first-round'
      this.currentSentenceIndex = 0
      this.loadSentence()
    },

    loadSentence() {
      let sentenceIndex

      if (this.gamePhase === 'first-round') {
        sentenceIndex = this.currentSentenceIndex
      } else if (this.gamePhase === 'remaining') {
        // Проверяем, что remainingSentences не пустой и currentSentenceIndex в пределах
        if (this.remainingSentences.length === 0 || this.currentSentenceIndex >= this.remainingSentences.length) {
          this.prepareRemainingSentences()
          return
        }
        sentenceIndex = this.remainingSentences[this.currentSentenceIndex]
      } else if (this.gamePhase === 'completed') {
        this.finishGame()
        return
      }

      // Защита от неопределенного индекса
      if (sentenceIndex === undefined || sentenceIndex >= this.sentences.length) {
        console.error('Invalid sentence index:', sentenceIndex)
        this.prepareRemainingSentences()
        return
      }

      const text = this.sentences[sentenceIndex]?.trim()

      // Дополнительная проверка на существование текста
      if (!text) {
        console.error('No text found for sentence index:', sentenceIndex)
        this.prepareRemainingSentences()
        return
      }

      const words = this.splitSentence(text)

      this.originalOrder = words.map(word => ({ id: this.uuid(), word }))

      // Перемешиваем слова
      this.currentWords = [...this.originalOrder].sort(() => Math.random() - 0.5)

      // Проверяем, не стоит ли первое слово на правильном месте
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
        }
      })
    },

    // Умная проверка позиций слов
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

    handleControlButton() {
      if (this.gamePhase === 'completed') {
        this.finishGame()
        return
      }

      // Если предложение завершено, добавляем в completed
      if (this.isCurrentSentenceCompleted) {
        let currentIndex
        if (this.gamePhase === 'first-round') {
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

        // Завершили первый круг
        if (this.currentSentenceIndex >= this.sentences.length) {
          this.prepareRemainingSentences()
          return
        }
      } else if (this.gamePhase === 'remaining') {
        this.currentSentenceIndex++

        // Завершили все оставшиеся предложения
        if (this.currentSentenceIndex >= this.remainingSentences.length) {
          if (this.allSentencesCompleted) {
            this.gamePhase = 'completed'
          } else {
            // Начинаем новый круг с оставшихся предложений
            this.currentSentenceIndex = 0
          }
        }
      }

      this.loadSentence()
    },

    prepareRemainingSentences() {
      // Собираем индексы незавершенных предложений
      this.remainingSentences = []
      for (let i = 0; i < this.sentences.length; i++) {
        if (!this.completedSentences.has(i)) {
          this.remainingSentences.push(i)
        }
      }

      if (this.remainingSentences.length === 0) {
        this.gamePhase = 'completed'
        this.finishGame()
      } else {
        this.gamePhase = 'remaining'
        this.currentSentenceIndex = 0
        this.loadSentence()
      }
    },

    finishGame() {
      console.log('🎉 Игра завершена! Все предложения составлены правильно!')
      setTimeout(() => {
      }, 100)
      this.initializeGame() // Начинаем заново
    },

    uuid() {
      return Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
    }
  },

  beforeUnmount() {
    if (this.sortable) this.sortable.destroy()
  }
}
</script>

<style scoped>
.drag-game {
  max-width: 800px;
  margin: 30px auto;
  padding: 30px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  user-select: none;
}

.game-header {
  text-align: center;
  margin-bottom: 35px;
}

.game-header h2 {
  font-size: 2.2rem;
  margin-bottom: 10px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  font-weight: 700;
}

.progress-info {
  background: rgba(255, 255, 255, 0.15);
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1.1rem;
  display: inline-block;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-family: Special_f1;
}

.sentence-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  align-items: center;
  margin: 35px 0;
  padding: 5px;
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

/* Стили для умной подсветки */
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

/* убираем любые transform во время drag */
.sortable-chosen .word,
.sortable-drag .word,
.word:active {
  transform: none !important;
}

/* плейсхолдер */
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

/* анимации */
@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* стили Sortable */
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
  padding: 14px 30px;
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

</style>
