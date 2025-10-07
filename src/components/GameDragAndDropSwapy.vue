<template>
  <div class="drag-game-sortable">
    <h2>Восстанови предложение</h2>
    <p>Перетащи слова в правильном порядке:</p>

    <div ref="container" class="sentence-container">
      <div
        v-for="(item, index) in currentWords"
        :key="item.id"
        class="word-item"
      >
        <div class="word">
          <!-- Если это текущее перетаскиваемое слово, показываем эмодзи 👇 -->
          {{ draggedIndex === index ? '👇' : item.word }}
        </div>
      </div>
    </div>

    <div class="debug-info">
      <div><strong>Текущее предложение:</strong> {{ currentWords.map(w => w.word).join(' ') }}</div>
      <div><strong>Правильный порядок:</strong> {{ originalOrder.map(w => w.word).join(' ') }}</div>
      <div><strong>Последнее событие:</strong> {{ lastEvent }}</div>
    </div>

    <div class="status">{{ status }}</div>

    <div class="buttons">
      <button @click="checkSentence" class="check-button">Проверить</button>
      <button @click="nextSentence" class="next-button">Следующее</button>
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
      lastEvent: 'Нет событий',
      draggedWord: null,
      draggedIndex: null,
      currentSentenceIndex: 0,
      sentences: [
        "Я изучаю программирование уже целый день",
        "Сегодня отличная погода, и это радует!",
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
      this.lastEvent = 'Новое предложение загружено'

      this.$nextTick(() => this.initializeSortable())
    },

    splitSentence(sentence) {
      // Разделяем с сохранением пунктуации
      return sentence.match(/[\wа-яА-ЯёЁ]+|[^\s\wа-яА-ЯёЁ]+/g) || []
    },

    initializeSortable() {
      if (this.sortable) this.sortable.destroy()

      this.sortable = new Sortable(this.$refs.container, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        onStart: (evt) => {
          this.draggedIndex = evt.oldIndex
          this.draggedWord = this.currentWords[evt.oldIndex].word
          this.lastEvent = `Начали тянуть "${this.draggedWord}" (index ${evt.oldIndex})`
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
          this.lastEvent = `Перемещено "${moved.word}" (${oldIndex} → ${newIndex})`
        }
      })
    },

    checkSentence() {
      const userSentence = this.currentWords.map(w => w.word).join(' ')
      const correctSentence = this.originalOrder.map(w => w.word).join(' ')

      if (userSentence === correctSentence) {
        this.status = '✅ Правильно! Отличная работа!'
        this.lastEvent = 'Результат: правильно!'
        setTimeout(this.nextSentence, 1500)
      } else {
        this.status = '❌ Пока не совсем правильно. Попробуй ещё раз!'
        this.lastEvent = 'Результат: ошибка'
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
.drag-game-sortable {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
  font-family: "Segoe UI", Arial, sans-serif;
}

.sentence-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 12px;
  min-height: 120px;
  transition: all 0.3s ease;
}

.word-item {
  flex-shrink: 0;
}

.word {
  background: white;
  border: 2px solid #007bff;
  border-radius: 8px;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: bold;
  user-select: none;
  transition: all 0.2s ease;
  min-width: 40px;
}

.word:hover {
  background: #007bff;
  color: white;
}

.word:active {
  cursor: pointer;
  background: rgb(0, 0, 0);
  font-size: 7px;

}

.sortable-ghost {
  opacity: 0.9;
  background: #ccc;
}

.sortable-chosen {
  transform: scale(1.05);
  background: #e3f2fd;
}

.sortable-drag {
  opacity: 0.8;
}

.debug-info {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  text-align: left;
  font-family: monospace;
  font-size: 14px;
  margin-bottom: 15px;
  border-left: 4px solid #6c757d;
}

.status {
  background: #e9ecef;
  border-radius: 6px;
  padding: 10px;
  font-weight: bold;
  margin-bottom: 20px;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  color: white;
  transition: background 0.2s ease;
}

.check-button {
  background: #007bff;
}
.check-button:hover {
  background: #0056b3;
}

.next-button {
  background: #28a745;
}
.next-button:hover {
  background: #218838;
}
</style>
