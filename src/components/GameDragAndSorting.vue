<template>
  <div class="drag-sort-game">
    <div class="game-header">
      <h2>{{ currentGameData.title }}</h2>
    </div>

    <div class="instructions">
      <p>{{ currentGameData.instructions }}</p>
    </div>

    <!-- Слова для перетаскивания -->
    <div ref="wordsContainer" class="words-container">
      <div
        v-for="item in availableWords"
        :key="item.id"
        class="word-card"
        :data-id="item.id"
        :class="getWordCardClass(item.id)"
      >
        <div class="word-eng">{{ item.eng }}</div>
        <div class="word-ru">{{ item.ru }}</div>
      </div>
    </div>

    <!-- Колонки для сортировки -->
    <div class="columns-container">
      <div
        v-for="column in currentGameData.columns"
        :key="column.id"
        class="column"
      >
        <div class="column-header">
          <span class="column-icon">📁</span>
          {{ column.title }}
        </div>
        <div
          :ref="el => { columnRefs[column.id] = el }"
          class="column-content"
        >
          <div
            v-for="item in getItemsInColumn(column.id)"
            :key="item.id"
            class="word-card in-column"
            :data-id="item.id"
            :class="getWordCardClass(item.id)"
          >
            <div class="word-eng">{{ item.eng }}</div>
            <div class="word-ru">{{ item.ru }}</div>
          </div>
        </div>

      </div>
    </div>

    <div class="game-controls">
      <button @click="checkAnswers" class="control-button check">
        ✅ Проверить ответы
      </button>
      <button @click="resetGame" class="control-button reset">
        🔄 Начать заново
      </button>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { useRoute, useRouter } from 'vue-router'
import sortingWordsData from '../dataForGames/sortingWordsData'
import { useGameStore } from 'stores/example-store'

export default {
  name: 'GameDragAndSorting',

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
      sortableInstances: [],
      currentGameData: {
        title: '',
        instructions: '',
        columns: [],
        items: []
      },
      currentWords: [],
      columnAssignments: {},
      completedItems: new Set(),
      columnRefs: {},
      startTime: null,
      mistakes: 0,
      wordStatus: {},
      checkTimer: null,
      isDragging: false
    }
  },

  computed: {
    availableWords() {
      return this.currentWords.filter(word =>
        !this.columnAssignments[word.id]
      )
    }
  },

  mounted() {
    this.initializeGame()
  },

  methods: {
    initializeGame() {
      const missionName = this.route.params.missionName || 'fruitsVegetables'
      this.currentGameData = sortingWordsData[missionName] || sortingWordsData.fruitsVegetables

      this.currentWords = [...this.currentGameData.items]
      this.columnAssignments = {}
      this.completedItems = new Set()
      this.columnRefs = {}
      this.wordStatus = {}

      this.startTime = Date.now()
      this.mistakes = 0
      this.isDragging = false

      if (this.checkTimer) {
        clearInterval(this.checkTimer)
      }

      this.$nextTick(() => {
        this.initializeSortable()
        this.startPeriodicCheck()
      })
    },

    initializeSortable() {
      this.sortableInstances.forEach(instance => instance.destroy())
      this.sortableInstances = []

      // ИСПОЛЬЗУЕМ ТЕ ЖЕ НАСТРОЙКИ КАК В РАБОЧЕМ КОМПОНЕНТЕ!
      const sortableOptions = {
        group: {
          name: 'words',
          pull: true,
          put: true
        },
        animation: 180,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',

        // КРИТИЧЕСКИ ВАЖНЫЕ НАСТРОЙКИ ДЛЯ МОБИЛЬНЫХ
        forceFallback: true,
        fallbackOnBody: true,
        fallbackTolerance: 5,
        fallbackOffset: { x: 0, y: -8 },

        delay: 0,
        delayOnTouchOnly: false,

        onStart: () => {
          this.isDragging = true
        },
        onEnd: () => {
          this.isDragging = false
        }
      }

      if (this.$refs.wordsContainer) {
        const wordsSortable = new Sortable(this.$refs.wordsContainer, {
          ...sortableOptions,
          sort: false,
          onAdd: (evt) => {
            const itemId = evt.item.getAttribute('data-id')
            delete this.columnAssignments[itemId]
            this.wordStatus[itemId] = null
          }
        })
        this.sortableInstances.push(wordsSortable)
      }

      this.currentGameData.columns.forEach(column => {
        const columnElement = this.columnRefs[column.id]
        if (columnElement) {
          const columnSortable = new Sortable(columnElement, {
            ...sortableOptions,
            onAdd: (evt) => {
              const itemId = evt.item.getAttribute('data-id')
              this.columnAssignments[itemId] = column.id
            }
          })
          this.sortableInstances.push(columnSortable)
        }
      })
    },

    startPeriodicCheck() {
      this.checkTimer = setInterval(() => {
        if (!this.isDragging) {
          this.checkWordStatuses()
        }
      }, 500)
    },

    checkWordStatuses() {
      this.currentWords.forEach(word => {
        if (this.columnAssignments[word.id]) {
          const currentColumn = this.columnAssignments[word.id]
          const isCorrect = currentColumn === word.correctColumn

          if (this.wordStatus[word.id] === null ||
            (isCorrect && this.wordStatus[word.id] !== 'correct') ||
            (!isCorrect && this.wordStatus[word.id] !== 'incorrect')) {

            this.wordStatus[word.id] = isCorrect ? 'correct' : 'incorrect'

            if (!isCorrect) {
              this.mistakes++
            }
          }
        } else {
          this.wordStatus[word.id] = null
        }
      })
    },

    getWordCardClass(wordId) {
      const status = this.wordStatus[wordId]
      if (status === 'correct') {
        return 'word-correct'
      } else if (status === 'incorrect') {
        return 'word-incorrect'
      }
      return ''
    },

    getItemsInColumn(columnId) {
      return this.currentWords.filter(word =>
        this.columnAssignments[word.id] === columnId
      )
    },

    checkAnswers() {
      if (this.checkTimer) {
        clearInterval(this.checkTimer)
      }

      let correctCount = 0
      let currentMistakes = 0

      this.currentWords.forEach(word => {
        if (this.columnAssignments[word.id] === word.correctColumn) {
          correctCount++
          this.completedItems.add(word.id)
          this.wordStatus[word.id] = 'correct'
        } else if (this.columnAssignments[word.id]) {
          currentMistakes++
          this.wordStatus[word.id] = 'incorrect'
        }
      })

      if (currentMistakes > 0) {
        this.mistakes += currentMistakes
      }

      this.finishGame()
    },

    finishGame() {
      const duration = Date.now() - this.startTime

      this.gameStore.setLastGameResults(duration, this.mistakes)
      this.gameStore.setGameName("WordSorting")
      this.gameStore.setWordSet(this.route.params.missionName)

      this.router.push({
        path: "/leader-board/",
        query: {
          missionName: this.route.params.missionName
        }
      })
    },

    resetGame() {
      this.initializeGame()
    }
  },

  beforeUnmount() {
    this.sortableInstances.forEach(instance => instance.destroy())
    if (this.checkTimer) {
      clearInterval(this.checkTimer)
    }
  }
}
</script>

<style scoped>
.drag-sort-game {
  max-width: 1000px;
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
  margin-bottom: 25px;
}

.game-header h2 {
  font-size: 2rem;
  margin-bottom: 10px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  font-weight: 700;
}



.instructions {
  text-align: center;
  margin-bottom: 25px;
  font-size: 1.1rem;
  opacity: 0.9;
}

.words-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin: 25px 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 15px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  min-height: 100px;
}

.word-card {
  background: white;
  border: 2px solid #4ade80;
  border-radius: 12px;
  padding: 12px 18px;
  font-weight: 600;
  cursor: grab;
  user-select: none;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  color: #1f2937;
  min-width: 80px;
  /* Убираем transition из основного класса */
}

.word-card:hover {
  background: #4ade80;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(74, 222, 128, 0.35);
}

.word-eng {
  font-size: 14px;
  font-weight: 700;
}

.word-ru {
  font-size: 11px;
  color: #666;
  margin-top: 4px;
}

.word-card:hover .word-ru {
  color: rgba(255, 255, 255, 0.8);
}

/* Стили для правильных слов */
.word-correct {
  background: linear-gradient(135deg, #4ade80, #22c55e) !important;
  color: white !important;
  border-color: #16a34a !important;
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(74, 222, 128, 0.45);
  transition: all 0.5s ease !important;
  animation: pulse-green 2s ease-in-out infinite;
}

.word-correct .word-ru {
  color: rgba(255, 255, 255, 0.8) !important;
}

/* Стили для неправильных слов */
.word-incorrect {
  background: linear-gradient(135deg, #f87171, #ef4444) !important;
  color: white !important;
  border-color: #dc2626 !important;
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.45);
  transition: all 0.5s ease !important;
  animation: pulse-red 2s ease-in-out infinite;
}

.word-incorrect .word-ru {
  color: rgba(255, 255, 255, 0.8) !important;
}

@keyframes pulse-green {
  0%, 100% { transform: scale(1.05); }
  50% { transform: scale(1.08); }
}

@keyframes pulse-red {
  0%, 100% { transform: scale(1.05); }
  50% { transform: scale(1.08); }
}

.columns-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 25px 0;
}

.column {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  padding: 20px;
  min-height: 250px;
  transition: border-color 0.3s ease;
  position: relative;
}

.column:hover {
  border-color: rgba(255, 255, 255, 0.5);
}

.column-header {
  text-align: center;
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.column-icon {
  font-size: 1.2rem;
}

.column-content {
  min-height: 180px;
}


.game-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 25px;
}

.control-button {
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.25s ease;
  min-width: 180px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  font-weight: 600;
}

.control-button.check {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
}

.control-button.reset {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.control-button:hover {
  transform: translateY(-2px) scale(1.03);
}

.control-button:active {
  transform: scale(0.97);
}

/* Стили для Sortable.js - БЕЗ ИЗМЕНЕНИЙ */
.sortable-ghost {
  opacity: 0.4;
}

.sortable-chosen .word-card {
  border-color: #fbbf24 !important;
  background: #fef3c7 !important;
  color: #92400e !important;
  box-shadow: 0 8px 20px rgba(251, 191, 36, 0.4) !important;
  transform: scale(1.05) rotate(3deg);
  transition: none !important;
}

.sortable-drag .word-card {
  background: #fef3c7 !important;
  color: black !important;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4) !important;
  z-index: 1000;
  transform: rotate(5deg) scale(1.1);
  transition: none !important;
  cursor: grabbing !important;
}

/* Адаптивность */
@media (max-width: 768px) {
  .drag-sort-game {
    margin: 15px auto;
    padding: 20px 15px;
  }

  .columns-container {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .game-controls {
    flex-direction: column;
    align-items: center;
  }

  .control-button {
    min-width: 200px;
  }

  .word-card {
    padding: 10px 15px;
    min-width: 70px;
  }
}
</style>
