<template>
  <div class="drag-sort-game">
    <div class="game-header">
      <h2>{{ currentGameData.title }}</h2>
    </div>

    <div class="instructions">
      <p>{{ currentGameData.instructions }}</p>
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
            @click="showHintTemporarily(item.id)"
          >
            <div class="word-eng">{{ item.eng }}</div>
            <div class="word-ru" :class="getHintClass(item.id)">{{ item.ru }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Слова для перетаскивания -->
    <div ref="wordsContainer" class="words-container">
      <div
        v-for="item in availableWords"
        :key="item.id"
        class="word-card"
        :data-id="item.id"
        :class="getWordCardClass(item.id)"
        @click="showHintTemporarily(item.id)"
      >
        <div class="word-eng">{{ item.eng }}</div>
        <div class="word-ru" :class="getHintClass(item.id)">{{ item.ru }}</div>
      </div>
    </div>

    <div class="game-controls">


      <button @click="checkAnswers" class="control-button check">
        ✅ поделиться
      </button>
      <button @click="toggleHints" class="control-button hints">
        {{ hintsHidden ? '👁️ Показать подсказки' : '🙈 Скрыть подсказки' }}
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
      isDragging: false,
      countedMistakes: new Set(),
      // Добавляем состояние подсказок
      hintsHidden: false,
      temporaryHints: new Set(),

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

      this.currentWords = this.shuffleArray([...this.currentGameData.items])
      this.columnAssignments = {}
      this.completedItems = new Set()
      this.columnRefs = {}
      this.wordStatus = {}

      this.startTime = Date.now()
      this.mistakes = 0
      this.isDragging = false
      this.countedMistakes = new Set()
      this.hintsHidden = true
      this.temporaryHints = new Set()
      this.hintTimers = {}

      if (this.checkTimer) {
        clearInterval(this.checkTimer)
      }

      this.$nextTick(() => {
        this.initializeSortable()
        this.startPeriodicCheck()
      })
    },

    showHintTemporarily(wordId) {
      // Если подсказки уже скрыты глобально, временно показываем эту
      if (this.hintsHidden) {
        // Очищаем предыдущий таймер для этого слова
        if (this.hintTimers[wordId]) {
          clearTimeout(this.hintTimers[wordId])
        }

        // Добавляем слово во временные подсказки
        this.temporaryHints.add(wordId)

        // Устанавливаем таймер на 5 секунд
        this.hintTimers[wordId] = setTimeout(() => {
          this.temporaryHints.delete(wordId)
          delete this.hintTimers[wordId]
        }, 5000)
      }
    },

    shuffleArray(array) {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    },

    getHintClass(wordId) {
      // Если подсказки скрыты глобально И это слово не во временных подсказках
      if (this.hintsHidden && !this.temporaryHints.has(wordId)) {
        return 'blurred'
      }
      return ''
    },

    initializeSortable() {
      this.sortableInstances.forEach(instance => instance.destroy())
      this.sortableInstances = []

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
            this.countedMistakes.delete(itemId)

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


              // Обновляем высоты после добавления элемента
              this.$nextTick(() => {
                this.updateAllColumnsHeight();
              });
            }
          })
          this.sortableInstances.push(columnSortable)
        }
      })
    },

    toggleHints() {
      this.hintsHidden = !this.hintsHidden
    },

    startPeriodicCheck() {
      this.checkTimer = setInterval(() => {
        if (!this.isDragging) {
          this.checkWordStatuses()
        }
      }, 500)
    },
    updateAllColumnsHeight() {
      const columns = document.querySelectorAll('.column-content');
      let maxHeight = 180; // минимальная высота

      // Находим максимальную высоту среди всех колонок
      columns.forEach(column => {
        const height = column.scrollHeight;
        if (height > maxHeight) {
          maxHeight = height;
        }
      });

      // Устанавливаем всем колонкам одинаковую высоту
      columns.forEach(column => {
        column.style.minHeight = `${maxHeight}px`;
      });
    },
    checkWordStatuses() {
      this.currentWords.forEach(word => {
        if (this.columnAssignments[word.id]) {
          const currentColumn = this.columnAssignments[word.id]

          // Поддержка как строк, так и массивов correctColumn
          const isCorrect = Array.isArray(word.correctColumn)
            ? word.correctColumn.includes(currentColumn)
            : word.correctColumn === currentColumn

          if (this.wordStatus[word.id] === null ||
            (isCorrect && this.wordStatus[word.id] !== 'correct') ||
            (!isCorrect && this.wordStatus[word.id] !== 'incorrect')) {

            this.wordStatus[word.id] = isCorrect ? 'correct' : 'incorrect'

            if (!isCorrect && !this.countedMistakes.has(word.id)) {
              this.mistakes++
              this.countedMistakes.add(word.id)
            }

            if (isCorrect && this.countedMistakes.has(word.id)) {
              this.countedMistakes.delete(word.id)
            }
          }
        } else {
          this.wordStatus[word.id] = null
          this.countedMistakes.delete(word.id)
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
        const currentColumn = this.columnAssignments[word.id]

        if (currentColumn) {
          // Поддержка multiple correct columns
          const isCorrect = Array.isArray(word.correctColumn)
            ? word.correctColumn.includes(currentColumn)
            : word.correctColumn === currentColumn

          if (isCorrect) {
            correctCount++
            this.completedItems.add(word.id)
            this.wordStatus[word.id] = 'correct'
          } else {
            currentMistakes++
            this.wordStatus[word.id] = 'incorrect'
          }
        }
      })

      this.mistakes = currentMistakes
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
  min-width: 460px;
  margin: 30px auto;
  padding: 10px;
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
  gap: 6px;
  justify-content: center;
  margin: 25px 0;
  padding: 5px;
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
  padding: 6px 9px;
  font-weight: 600;
  cursor: none;
  user-select: none;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  color: #1f2937;
  min-width: 80px;
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
  transition: all 0.3s ease;
}

/* Стиль для заблюренных подсказок */
.word-ru.blurred {
  filter: blur(2px);
  opacity: 0.8;
  color: #999;
}

.word-card:hover .word-ru:not(.blurred) {
  color: rgba(255, 255, 255, 0.8);
}

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
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin: 25px 0;
}

.column {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  padding: 5px;
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
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
  gap: 8px;
  line-height: 18px;
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
  gap: 15px;
  margin-top: 25px;
  flex-wrap: wrap;
}

.control-button {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  cursor: none;
  transition: all 0.25s ease;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  font-weight: 600;
}

.control-button.check {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
}

.control-button.hints {
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
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
}

@media (max-width: 768px) {
  .drag-sort-game {
    margin: 15px auto;
    padding: 10px 15px;
    min-width: auto;
  }

  .columns-container {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 10px;
  }

  .column {
    padding: 12px;
    min-height: 180px;
  }

  .column-header {
    font-size: 0.8rem;
    margin-bottom: 10px;
    padding-bottom: 6px;
  }

  .column-icon {
    font-size: 0.9rem;
  }

  .in-column {
    padding: 6px 8px !important;
    min-width: 50px !important;
    font-size: 11px !important;
  }

  .in-column .word-eng {
    font-size: 11px !important;
  }

  .in-column .word-ru {
    font-size: 9px !important;
    margin-top: 2px;
  }

  .word-correct,
  .word-incorrect {
    transform: scale(1.02) !important;
  }

  .game-controls {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .control-button {
    min-width: 200px;
    padding: 10px 20px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .columns-container {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: 8px;
  }

  .column {
    padding: 10px;
    min-height: 160px;
  }

  .in-column {
    padding: 5px 6px !important;
    min-width: 45px !important;
    font-size: 10px !important;
  }

  .in-column .word-eng {
    font-size: 10px !important;
  }

  .in-column .word-ru {
    font-size: 8px !important;
  }
}
</style>
