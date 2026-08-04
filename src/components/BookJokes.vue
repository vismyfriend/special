<template>
  <div class="joke-cards-container">
    <div class="cards-grid">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="card-wrapper"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div
          class="card"
          :class="{ flipped: card.flipped }"
          @click="toggleFlip(card)"
        >
          <div class="card-inner">
            <!-- Front Side -->
            <div class="card-front" :style="{ backgroundColor: card.color || '#FFD93D' }">
              <div class="card-header">
                <span class="card-emoji">{{ card.emoji || '😄' }}</span>
                <span class="card-number">{{ index + 1 }}</span>
              </div>
              <div class="card-content">
                <div
                  v-for="(block, idx) in parseContent(card.content)"
                  :key="idx"
                  class="content-block"
                >
                  <span
                    v-if="block.type === 'text'"
                    v-html="block.value"
                  />
                  <div
                    v-else-if="block.type === 'gallery'"
                    class="gallery-preview"
                  >
                    <img
                      v-for="(item, gIdx) in block.items"
                      :key="gIdx"
                      :src="item.src"
                      :alt="item.caption"
                      class="gallery-thumb"
                    />
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <span class="card-date">{{ formatDate(card.date) }}</span>
                <span class="flip-hint">👆 Tap to flip</span>
              </div>
            </div>

            <!-- Back Side -->
            <div class="card-back" :style="{ backgroundColor: card.backColor || '#6C5CE7' }">
              <div class="back-content">
                <div class="back-emoji">{{ card.backEmoji || '🤣' }}</div>
                <div class="back-text">Laugh & Learn</div>
                <div class="back-subtext">English with Jokes</div>
                <button
                  class="translation-btn"
                  @click.stop="showTranslation(card)"
                >
                  📖 Show Translation
                </button>
                <div v-if="card.showTranslation" class="translation-box">
                  {{ card.translation }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JokeCards',
  data() {
    return {
      cards: [
        {
          id: 'joke-1',
          date: '2026-02-27',
          emoji: '👶',
          color: '#FFD93D', // Yellow
          backColor: '#6C5CE7', // Purple
          content: [
            {
              type: 'text',
              value: 'Teacher: "Where does God live?"\n\nKid: "I think He lives in our bathroom."\n\nTeacher: "Why do you say that?"\n\nKid: "Because every morning my dad bangs on the door and shouts: <i>«God, are you still in there?!»</i>"'
            }
          ],
          translation: 'Учитель: "Где живет Бог?"\nМалыш: "Я думаю, он живет в нашей ванной."\nУчитель: "Почему ты так говоришь?"\nМалыш: "Потому что каждое утро мой папа колотит в дверь и говорит: «Господи, ты ещё здесь?!»"',
          flipped: false,
          showTranslation: false
        },
        {
          id: 'joke-2',
          date: '2026-02-27',
          emoji: '👴',
          color: '#A8E6CF', // Mint Green
          backColor: '#FF6B6B', // Red
          content: [
            {
              type: 'text',
              value: 'An 80-year-old man came to his doctor.\n\n"I\'m getting married next week, Doc."\n\n"That\'s great! How old is your bride?"\n\n"Eighteen."\n\n"Good Lord! I must warn you, any sexual activity could be fatal!"\n\n"Well," said the man, "if she dies, she dies..."'
            }
          ],
          translation: 'Восьмидесятилетний мужчина пришел к врачу.\n\n- Я собираюсь жениться на следующей неделе, доктор.\n- Очень хорошо. Сколько лет вашей невесте?\n- Восемнадцать.\n- Господи! Я должен вас предупредить, что любая активность в постели может стать смертельной.\n- Ну что же, - сказал мужчина, - если она умрет, значит, она умрет...',
          flipped: false,
          showTranslation: false
        },
        {
          id: 'joke-3',
          date: '2026-02-27',
          emoji: '🐕',
          color: '#FFB3B3', // Light Pink
          backColor: '#4ECDC4', // Teal
          content: [
            {
              type: 'text',
              value: 'A dog thinks: "My owner feeds me, loves me, looks after me... He must be a GOD!"\n\nA cat thinks: "My owner feeds me, loves me, looks after me... I must be GOD!"'
            }
          ],
          translation: 'Собака думает: "Хозяин кормит меня, любит меня, заботится обо мне... Должно быть, он БОГ!"\n\nКошка думает: "Хозяин кормит меня, любит меня, заботится обо мне... Должно быть, я БОГ!"',
          flipped: false,
          showTranslation: false
        },
        {
          id: 'joke-4',
          date: '2026-02-27',
          emoji: '🎓',
          color: '#FFEAA7', // Light Gold
          backColor: '#A29BFE', // Lavender
          content: [
            {
              type: 'text',
              value: 'I first learnt German by telling jokes to people in my awful German. But I quickly progressed and now I\'m pretty fluent – and know lots of great jokes as well.'
            }
          ],
          translation: 'Я начал учить немецкий, рассказывая анекдоты людям на моем ужасном немецком. Но я быстро прогрессировал и теперь говорю довольно бегло – и знаю много отличных шуток тоже.',
          flipped: false,
          showTranslation: false
        },
        {
          id: 'joke-5',
          date: '2026-02-27',
          emoji: '💼',
          color: '#DFE6E9', // Light Gray
          backColor: '#FD79A8', // Pink
          content: [
            {
              type: 'text',
              value: 'At job interview:\n\nInterviewer: "What is your greatest weakness?"\n\nMe: "Honesty."\n\nInterviewer: "I don\'t think honesty is a weakness."\n\nMe: "I don\'t give a damn what you think."'
            }
          ],
          translation: 'На собеседовании:\n\nИнтервьюер: "Какой ваш главный недостаток?"\n\nЯ: "Честность."\n\nИнтервьюер: "Я не думаю, что честность - это недостаток."\n\nЯ: "Мне плевать, что вы думаете."',
          flipped: false,
          showTranslation: false
        }
      ]
    }
  },
  methods: {
    parseContent(content) {
      return content.map(block => {
        if (block.type === 'text') {
          // Handle formatting
          let value = block.value
          // Replace newlines with <br>
          value = value.replace(/\n/g, '<br>')
          // Handle custom formatting if needed
          return { ...block, value }
        }
        return block
      })
    },
    toggleFlip(card) {
      card.flipped = !card.flipped
      // Reset translation visibility when flipping back
      if (!card.flipped) {
        card.showTranslation = false
      }
    },
    showTranslation(card) {
      card.showTranslation = !card.showTranslation
    },
    formatDate(date) {
      const d = new Date(date)
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.joke-cards-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  padding: 20px;
}

.card-wrapper {
  perspective: 1000px;
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  width: 100%;
  aspect-ratio: 3/4;
  cursor: pointer;
  position: relative;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.card.flipped {
  transform: rotateY(180deg);
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

/* Front & Back Sides */
.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  padding: 25px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease;
}

.card-front {
  background-color: #FFD93D;
  border: 3px solid rgba(255,255,255,0.3);
}

.card-back {
  background-color: #6C5CE7;
  transform: rotateY(180deg);
  border: 3px solid rgba(255,255,255,0.2);
}

/* Hover Effect */
.card:hover .card-front,
.card:hover .card-back {
  box-shadow: 0 15px 40px rgba(0,0,0,0.25);
  transform: translateY(-5px);
}

/* Card Front Content */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.card-emoji {
  font-size: 2.5rem;
}

.card-number {
  background: rgba(0,0,0,0.1);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  color: rgba(0,0,0,0.6);
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 1.1rem;
  line-height: 1.6;
  overflow: hidden;
  padding: 10px 0;
}

.content-block {
  margin-bottom: 10px;
}

/* Gallery Preview */
.gallery-preview {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.gallery-thumb {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid rgba(255,255,255,0.5);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 2px solid rgba(0,0,0,0.1);
  font-size: 0.8rem;
  color: rgba(0,0,0,0.5);
}

.flip-hint {
  background: rgba(0,0,0,0.08);
  padding: 3px 12px;
  border-radius: 12px;
  font-size: 0.7rem;
}

/* Card Back Content */
.back-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: white;
}

.back-emoji {
  font-size: 4rem;
  margin-bottom: 15px;
}

.back-text {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.back-subtext {
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 20px;
}

.translation-btn {
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.3);
  color: white;
  padding: 10px 25px;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.translation-btn:hover {
  background: rgba(255,255,255,0.3);
  transform: scale(1.05);
}

.translation-box {
  background: rgba(0,0,0,0.3);
  padding: 15px;
  border-radius: 15px;
  max-width: 90%;
  max-height: 200px;
  overflow-y: auto;
  font-size: 0.9rem;
  line-height: 1.5;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255,255,255,0.1);
}

/* Scrollbar Styling */
.translation-box::-webkit-scrollbar {
  width: 6px;
}

.translation-box::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
}

.translation-box::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.3);
  border-radius: 10px;
}

/* Responsive */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    padding: 10px;
  }

  .card-front,
  .card-back {
    padding: 20px;
  }

  .card-content {
    font-size: 0.95rem;
  }

  .back-text {
    font-size: 1.5rem;
  }
}
</style>
