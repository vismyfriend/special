<template>
  <div class="drag-sort-game">
    <div class="game-header">
      <h2>{{ currentGameData.title }}</h2>
      <div class="progress-info">
        {{ completedItems.size }} / {{ currentGameData.items.length }}
      </div>
    </div>

    <div class="instructions">
      <p>{{ currentGameData.instructions }}</p>
    </div>

    <!-- Подсказки с переводами -->
    <div v-if="showHints" class="hints-container">
      <div class="hints-title">📚 Подсказки:</div>
      <div class="hints-list">
        <div
          v-for="item in currentWords"
          :key="item.id"
          class="hint-item"
        >
          <span class="eng-word">{{ item.eng }}</span> -
          <span class="ru-word">{{ item.ru }}</span>
        </div>
      </div>
    </div>

    <!-- Слова для перетаскивания -->
    <div v-if="gamePhase !== 'completed'" ref="wordsContainer" class="words-container">
      <div
        v-for="item in availableWords"
        :key="item.id"
        class="word-card"
        :data-id="item.id"
      >
        {{ item.eng }}
      </div>
    </div>

    <!-- Колонки для сортировки -->
    <div v-if="gamePhase !== 'completed'" class="columns-container">
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
          >
            {{ item.eng }}
          </div>
        </div>
      </div>
    </div>

    <!-- Экран завершения -->
    <div v-if="gamePhase === 'completed'" class="completion-screen">
      <div class="completion-content">
        <h3>🎉 Поздравляем!</h3>
        <p>Вы успешно завершили задание!</p>
        <div class="completion-stats">
          <p>Правильно распределено: {{ completedItems.size }} из {{ currentGameData.items.length }}</p>
          <p>Процент правильных ответов: {{ percentage }}%</p>
        </div>
        <div class="completion-buttons">
          <button @click="goToResults" class="control-button results">
            📊 Посмотреть результаты
          </button>
          <button @click="initializeGame" class="control-button restart">
            🔄 Начать заново
          </button>
        </div>
      </div>
    </div>

    <div v-else class="game-controls">
      <button
        @click="checkAnswers"
        class="control-button"
        :class="buttonClass"
        :disabled="!allWordsPlaced"
      >
        {{ buttonText }}
      </button>
      <button @click="toggleHints" class="control-button hint">
        {{ showHints ? '🙈 Скрыть подсказки' : '💡 Показать подсказки' }}
      </button>
      <button @click="resetGame" class="control-button reset">
        🔄 Сбросить
      </button>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { useRoute, useRouter } from 'vue-router'
import sortingWordsData from '../dataForGames/sortingWordsData'

export default {
  name: 'GameDragAndSorting',

  setup() {
    const route = useRoute()
    const router = useRouter()
    return {
      route,
      router
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
      gamePhase: 'playing',
      showHints: false,
      gameResults: null
    }
  },

  computed: {
    availableWords() {
      return this.currentWords.filter(word =>
        !this.columnAssignments[word.id]
      )
    },

    allWordsPlaced() {
      return this.currentWords.length > 0 &&
        this.currentWords.every(word => this.columnAssignments[word.id])
    },

    buttonText() {
      return '✅ Проверить'
    },

    buttonClass() {
      if (!this.allWordsPlaced) {
        return 'disabled'
      }
      return 'check'
    },

    percentage() {
      return Math.round((this.completedItems.size / this.currentGameData.items.length) * 100)
    }
  },

  mounted() {
    this.initializeGame()
  },

  methods: {
    initializeGame() {
      const missionName = this.route.params.missionName
      this.currentGameData = sortingWordsData[missionName] || sortingWordsData.fruitsVegetables

      this.currentWords = [...this.currentGameData.items]
      this.columnAssignments = {}
      this.completedItems = new Set()
      this.columnRefs = {}
      this.gamePhase = 'playing'
      this.showHints = false
      this.gameResults = null

      this.$nextTick(() => {
        this.initializeSortable()
      })
    },

    initializeSortable() {
      this.sortableInstances.forEach(instance => instance.destroy())
      this.sortableInstances = []

      if (this.$refs.wordsContainer) {
        const wordsSortable = new Sortable(this.$refs.wordsContainer, {
          group: {
            name: 'words',
            pull: true,
            put: true
          },
          sort: false,
          animation: 150,
          onAdd: (evt) => {
            const itemId = evt.item.getAttribute('data-id')
            delete this.columnAssignments[itemId]
          }
        })
        this.sortableInstances.push(wordsSortable)
      }

      this.currentGameData.columns.forEach(column => {
        const columnElement = this.columnRefs[column.id]
        if (columnElement) {
          const columnSortable = new Sortable(columnElement, {
            group: {
              name: 'words',
              pull: true,
              put: true
            },
            animation: 150,
            onAdd: (evt) => {
              const itemId = evt.item.getAttribute('data-id')
              this.columnAssignments[itemId] = column.id
            }
          })
          this.sortableInstances.push(columnSortable)
        }
      })
    },

    getItemsInColumn(columnId) {
      return this.currentWords.filter(word =>
        this.columnAssignments[word.id] === columnId
      )
    },

    toggleHints() {
      this.showHints = !this.showHints
    },

    checkAnswers() {
      if (!this.allWordsPlaced) return

      let correctCount = 0
      const newlyCompleted = new Set()

      this.currentWords.forEach(word => {
        if (this.columnAssignments[word.id] === word.correctColumn) {
          correctCount++
          newlyCompleted.add(word.id)
        }
      })

      newlyCompleted.forEach(id => this.completedItems.add(id))

      // Сохраняем результаты для страницы результатов
      this.gameResults = {
        missionName: this.route.params.missionName,
        gameTitle: this.currentGameData.title,
        totalWords: this.currentGameData.items.length,
        correctAnswers: correctCount,
        percentage: Math.round((correctCount / this.currentGameData.items.length) * 100),
        timestamp: new Date().toISOString(),
        items: this.currentWords.map(word => ({
          id: word.id,
          eng: word.eng,
          ru: word.ru,
          userColumn: this.columnAssignments[word.id],
          correctColumn: word.correctColumn,
          isCorrect: this.columnAssignments[word.id] === word.correctColumn
        }))
      }

      if (correctCount === this.currentWords.length) {

        setTimeout(() => {
          this.gamePhase = 'completed'
          this.sendGameResults()
        }, 1000)
      } else {
        alert(`Правильно: ${correctCount} из ${this.currentWords.length}. Попробуйте еще!`)
      }
    },

    sendGameResults() {
      // Отправка результатов на сервер
      console.log('📊 Результаты игры:', this.gameResults)

      // Пример отправки:
      /*
      this.$api.post('/game-results', this.gameResults)
        .then(response => {
          console.log('Результаты сохранены:', response)
        })
        .catch(error => {
          console.error('Ошибка сохранения:', error)
        })
      */
    },

    goToResults() {
      // Переход на страницу результатов с передачей данных
      this.$router.push({
        name: 'GameResults',
        query: {
          game: 'drag-and-sort',
          mission: this.route.params.missionName,
          results: JSON.stringify(this.gameResults)
        }
      })
    },

    resetGame() {
      this.initializeGame()
    }
  },

  beforeUnmount() {
    this.sortableInstances.forEach(instance => instance.destroy())
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

.game-header {
  text-align: center;
  margin-bottom: 20px;
}

.game-header h2 {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.progress-info {
  background: #f0f0f0;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  display: inline-block;
}

.instructions {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

/* Стили для подсказок */
.hints-container {
  background: #e7f3ff;
  border: 2px solid #b3d9ff;
  border-radius: 10px;
  padding: 15px;
  margin: 20px 0;
}

.hints-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #0066cc;
}

.hints-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.hint-item {
  padding: 5px 10px;
  background: white;
  border-radius: 5px;
  font-size: 0.9rem;
}

.eng-word {
  font-weight: bold;
  color: #0066cc;
}

.ru-word {
  color: #666;
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
  transition: all 0.2s ease;
}

.word-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.word-card.in-column {
  background: #e9ecef;
  border-color: #6c757d;
  margin-bottom: 5px;
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
  transition: border-color 0.3s ease;
}

.column:hover {
  border-color: #007bff;
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
  flex-wrap: wrap;
}

.control-button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  min-width: 160px;
}

.control-button.check {
  background: #28a745;
  color: white;
}

.control-button.check:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
}

.control-button.hint {
  background: #ffc107;
  color: #212529;
}

.control-button.hint:hover {
  background: #e0a800;
  transform: translateY(-2px);
}

.control-button.reset {
  background: #6c757d;
  color: white;
}

.control-button.reset:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.control-button.results {
  background: #17a2b8;
  color: white;
  font-size: 16px;
  padding: 15px 25px;
}

.control-button.restart {
  background: #6c757d;
  color: white;
  font-size: 16px;
  padding: 15px 25px;
}

.control-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.control-button:disabled:hover {
  transform: none;
}

/* Экран завершения */
.completion-screen {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  color: white;
  margin: 20px 0;
}

.completion-content h3 {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.completion-content p {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.completion-stats {
  background: rgba(255, 255, 255, 0.2);
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
  display: inline-block;
}

.completion-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 25px;
  flex-wrap: wrap;
}

/* Стили для SortableJS */
.sortable-ghost {
  opacity: 0.4;
}

.sortable-chosen {
  background: #fff3cd;
}

/* Адаптивность */
@media (max-width: 768px) {
  .game-controls {
    flex-direction: column;
    align-items: center;
  }

  .control-button {
    width: 100%;
    max-width: 250px;
  }

  .completion-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>
