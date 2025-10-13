<template>
  <div class="drag-sort-game">
    <div class="instructions">
      <p>Перетащите слова в правильные категории</p>
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
        {{ item.eng }}
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
        <div class="column-header">{{ column.title }}</div>
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
            {{ item.eng }}
            <div class="word-ru">{{ item.ru }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="game-controls">
      <button @click="checkAnswers" class="control-button">
        Проверить
      </button>
      <button @click="resetGame" class="control-button">
        Сбросить
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
      // Добавляем таймер и статистику
      startTime: null,
      mistakes: 0,
      // Добавляем отслеживание статуса слов
      wordStatus: {}, // { wordId: 'correct' | 'incorrect' | null }
      checkTimer: null,
      isDragging: false // Флаг для отслеживания перетаскивания
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

      // Запускаем таймер
      this.startTime = Date.now()
      this.mistakes = 0
      this.isDragging = false

      // Очищаем предыдущий таймер
      if (this.checkTimer) {
        clearInterval(this.checkTimer)
      }

      this.$nextTick(() => {
        this.initializeSortable()
        // Запускаем периодическую проверку вместо вызова из onAdd
        this.startPeriodicCheck()
      })
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
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
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
            // Сбрасываем статус при перемещении слова обратно в контейнер
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
      // Проверяем статус слов каждые 500ms, но только если не перетаскиваем
      this.checkTimer = setInterval(() => {
        if (!this.isDragging) {
          this.checkWordStatuses()
        }
      }, 500)
    },

    checkWordStatuses() {
      // Проверяем все слова, которые размещены в колонках
      this.currentWords.forEach(word => {
        if (this.columnAssignments[word.id]) {
          const currentColumn = this.columnAssignments[word.id]
          const isCorrect = currentColumn === word.correctColumn

          // Если статус еще не установлен или изменился
          if (this.wordStatus[word.id] === null ||
            (isCorrect && this.wordStatus[word.id] !== 'correct') ||
            (!isCorrect && this.wordStatus[word.id] !== 'incorrect')) {

            // Устанавливаем новый статус
            this.wordStatus[word.id] = isCorrect ? 'correct' : 'incorrect'

            // Если слово размещено неправильно - считаем ошибку
            if (!isCorrect) {
              this.mistakes++
            }
          }
        } else {
          // Слово не размещено - сбрасываем статус
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
      // Останавливаем периодическую проверку
      if (this.checkTimer) {
        clearInterval(this.checkTimer)
      }

      let correctCount = 0
      let currentMistakes = 0

      // Финальная проверка всех слов
      this.currentWords.forEach(word => {
        if (this.columnAssignments[word.id] === word.correctColumn) {
          correctCount++
          this.completedItems.add(word.id)
          // Подсвечиваем правильные слова
          this.wordStatus[word.id] = 'correct'
        } else if (this.columnAssignments[word.id]) {
          // Слово размещено в неправильной колонке - считаем ошибку
          currentMistakes++
          // Подсвечиваем неправильные слова
          this.wordStatus[word.id] = 'incorrect'
        }
      })

      // Добавляем новые ошибки к общему счетчику
      if (currentMistakes > 0) {
        this.mistakes += currentMistakes
      }

      // Всегда отправляем результаты, просто с разным количеством ошибок
      this.finishGame()
    },

    finishGame() {
      const duration = Date.now() - this.startTime

      // Сохраняем результаты точно так же как в вашей другой игре
      this.gameStore.setLastGameResults(duration, this.mistakes)
      this.gameStore.setGameName("WordSorting")
      this.gameStore.setWordSet(this.route.params.missionName)

      // Переходим на leaderboard с теми же параметрами
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
  margin: 20px auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.instructions {
  text-align: center;
  margin-bottom: 20px;
}

.words-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  min-height: 80px;
}

.word-card {
  background: white;
  border: 2px solid #007bff;
  border-radius: 8px;
  padding: 10px 15px;
  font-weight: 600;
  cursor: grab;
  user-select: none;
  text-align: center;
  /* Убираем transition из основного класса */
}

.word-ru {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

/* Стили для правильных слов - добавляем transition только здесь */
.word-correct {
  background: linear-gradient(135deg, #4ade80, #22c55e) !important;
  color: white !important;
  border-color: #16a34a !important;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.4);
  transition: all 0.5s ease !important; /* Transition только для подсвеченных карточек */
}

.word-correct .word-ru {
  color: rgba(255, 255, 255, 0.8) !important;
}

/* Стили для неправильных слов - добавляем transition только здесь */
.word-incorrect {
  background: linear-gradient(135deg, #f87171, #ef4444) !important;
  color: white !important;
  border-color: #dc2626 !important;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  transition: all 0.5s ease !important; /* Transition только для подсвеченных карточек */
}

.word-incorrect .word-ru {
  color: rgba(255, 255, 255, 0.8) !important;
}

/* Стили для Sortable.js */
.sortable-ghost {
  opacity: 0.4;
}

.sortable-chosen .word-card {
  transition: none !important; /* Убираем transition во время перетаскивания */
}

.sortable-drag .word-card {
  transform: rotate(5deg) !important;
  z-index: 1000;
  transition: none !important; /* Убираем transition во время перетаскивания */
}

.columns-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin: 20px 0;
}

.column {
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 10px;
  padding: 15px;
  min-height: 200px;
}

.column-header {
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #dee2e6;
}

.column-content {
  min-height: 150px;
}

.game-controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.control-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #007bff;
  color: white;
  cursor: pointer;
}
</style>
