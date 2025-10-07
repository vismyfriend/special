<template>
  <div class="drag-game">
    <div class="game-header">
      <h2>🧩 Восстанови предложение</h2>
      <p>Перетащи слова в правильном порядке</p>
    </div>

    <div ref="container" class="sentence-container">
      <div
        v-for="(item, index) in currentWords"
        :key="item.id"
        class="word-item"
      >
        <div class="word" :class="{ 'dragging-placeholder': draggedIndex === index }">
          <!-- Показываем эмодзи для перетаскиваемого слова -->
          <span v-if="draggedIndex === index" class="drag-emoji">👇</span>
          <span v-else class="word-text">{{ item.word }}</span>
        </div>
      </div>
    </div>

    <div class="game-status">
      <div class="status-message">{{ status }}</div>
    </div>

    <div class="game-controls">
      <button @click="checkSentence" class="control-button check">
        ✅ Проверить
      </button>
      <button @click="nextSentence" class="control-button next">
        🔄 Следующее
      </button>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'

export default {
  name: 'GameDragAndDropSortable',

  data() {
    return {
      sortable: null,
      status: 'Готов к работе',
      draggedWord: null,
      draggedIndex: null,
      currentSentenceIndex: 0,
      sentences: [
        "Виктор не заставляй меня думать",
        "Спать погнали а ?",
        "JavaScript — интересный язык, но иногда сложный!",
        "Когда-нибудь я напишу свой первый большой проект.",
        "Vue.js — отличная библиотека для создания интерфейсов."
      ],
      currentWords: [],
      originalOrder: []
    }
  },

  mounted() {
    this.loadSentence()
  },

  methods: {
    loadSentence() {
      const text = this.sentences[this.currentSentenceIndex].trim()
      const words = this.splitSentence(text)

      this.originalOrder = words.map(word => ({ id: this.uuid(), word }))
      this.currentWords = [...this.originalOrder].sort(() => Math.random() - 0.5)
      this.status = 'Перетащи слова в правильном порядке'

      this.$nextTick(() => this.initializeSortable())
    },

    splitSentence(sentence) {
      return sentence.match(/[\wа-яА-ЯёЁ]+|[^\s\wа-яА-ЯёЁ]+/g) || []
    },

    initializeSortable() {
      if (this.sortable) this.sortable.destroy()

      this.sortable = new Sortable(this.$refs.container, {
        animation: 200,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
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

    checkSentence() {
      const userSentence = this.currentWords.map(w => w.word).join(' ')
      const correctSentence = this.originalOrder.map(w => w.word).join(' ')

      if (userSentence === correctSentence) {
        this.status = '✅ Правильно! Отличная работа!'
        setTimeout(this.nextSentence, 1500)
      } else {
        this.status = '❌ Пока не совсем правильно. Попробуй ещё раз!'
      }
    },

    nextSentence() {
      this.currentSentenceIndex = (this.currentSentenceIndex + 1) % this.sentences.length
      this.loadSentence()
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
}

.game-header {
  text-align: center;
  margin-bottom: 35px;
}

.game-header h2 {
  font-size: 2.4rem;
  margin-bottom: 10px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  font-weight: 700;
}

.game-header p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 400;
}

.sentence-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  align-items: center;
  margin: 35px 0;
  padding: 30px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 18px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  min-height: 140px;
  transition: all 0.3s ease;
}

.word-item {
  flex-shrink: 0;
}

.word {
  background: white;
  border: 2px solid #4ade80;
  border-radius: 14px;
  padding: 14px 20px;
  cursor: grab;
  font-weight: 600;
  user-select: none;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  color: #1f2937;
  font-size: 16px;
  position: relative;
  min-width: 50px;
  min-height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.word:hover {
  background: #4ade80;
  color: white;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 20px rgba(74, 222, 128, 0.4);
}

.word:active {
  cursor: grabbing;
}

/* Стиль для плейсхолдера (где было перетаскиваемое слово) */
.dragging-placeholder {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 2px dashed rgba(255, 255, 255, 0.5) !important;
  color: transparent !important;
  animation: pulse 1.5s ease-in-out infinite;
}

.drag-emoji {
  font-size: 24px;
  animation: bounce 0.8s ease-in-out infinite;
}

.word-text {
  transition: all 0.3s ease;
}

/* Анимация для плейсхолдера */
@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* Стили для перетаскивания */
.sortable-ghost {
  opacity: 0.4;
}

.sortable-chosen .word {
  background: #4ade80 !important;
  color: white !important;
  transform: scale(1.08) rotate(3deg);
  box-shadow: 0 12px 25px rgba(74, 222, 128, 0.5);
}

.sortable-drag .word {
  transform: scale(1.15) rotate(12deg) !important; /* Больше наклона */
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  background: #22c55e !important;
  color: white !important;
  cursor: grabbing !important;
}

.game-status {
  margin: 30px 0;
}

.status-message {
  background: rgba(255, 255, 255, 0.15);
  padding: 18px 25px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.2rem;
  text-align: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.game-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 25px;
}

.control-button {
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 17px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-width: 160px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.control-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.control-button:hover::before {
  left: 100%;
}

.control-button.check {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
}

.control-button.check:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 25px rgba(74, 222, 128, 0.5);
}

.control-button.next {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.control-button.next:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.2);
}

.control-button:active {
  transform: translateY(0) scale(0.98);
}

/* Адаптивность */
@media (max-width: 768px) {
  .drag-game {
    margin: 15px;
    padding: 20px;
  }

  .game-header h2 {
    font-size: 2rem;
  }

  .sentence-container {
    padding: 20px 15px;
    gap: 8px;
    min-height: 120px;
  }

  .word {
    padding: 12px 16px;
    font-size: 15px;
    border-radius: 12px;
  }

  .game-controls {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .control-button {
    width: 220px;
    padding: 14px 28px;
  }

  .drag-emoji {
    font-size: 20px;
  }
}
</style>
