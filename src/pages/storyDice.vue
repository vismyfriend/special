<template>
  <div class="story-dice-wrapper">
    <div class="story-dice-container">
      <!-- ============================================ -->
      <!-- ЗАГОЛОВОК С КНОПКОЙ TASK -->
      <!-- ============================================ -->
      <div class="header-wrapper">
        <h2 class="dice-title">🎲 STORY DICE</h2>
        <button class="task-btn" @click="openTaskModal">
          <span class="task-icon">🎲</span>
          TASK
          <span class="pulse-ring"></span>
          <span class="glint"></span>
        </button>
      </div>

      <!-- ============================================ -->
      <!-- ПОЛЕ С КУБИКАМИ -->
      <!-- ============================================ -->
      <div class="dice-area">
        <div
          v-for="(dice, index) in dices"
          :key="index"
          class="dice-wrapper"
          :class="{ 'animate-fall': isRolling }"
          :style="getDiceStyle(index)"
        >
          <img
            :src="dice.image"
            :alt="'Dice ' + (index + 1)"
            class="dice-image"
            :class="[
              { 'rolling': isRolling },
              diceBgIndex[index] === 1 ? 'bg-green' : '',
              diceBgIndex[index] === 2 ? 'bg-pink' : ''
            ]"
            @click="toggleBackground(index)"
          />
        </div>
      </div>

      <!-- ============================================ -->
      <!-- ТЕКСТОВОЕ ПОЛЕ ДЛЯ ИСТОРИИ -->
      <!-- ============================================ -->
      <div class="story-input-wrapper">
        <textarea
          v-model="storyText"
          class="story-input"
          placeholder="Write your story here... 📝"
          rows="3"
          @input="adjustTextareaHeight"
        ></textarea>
      </div>

      <!-- ============================================ -->
      <!-- КНОПКИ УПРАВЛЕНИЯ -->
      <!-- ============================================ -->
      <div class="controls-wrapper">
        <button
          v-if="storyText.length > 3"
          class="share-btn"
          @click="shareStory"
        >
          📤 SHARE YOUR STORY
        </button>

        <button class="roll-btn" @click="rollDices" :disabled="isRolling">
          <span v-if="!isRolling">🎲 ROLL AGAIN</span>
          <span v-else>🌀I'M ROLLING... ROLLING</span>
        </button>
      </div>

      <!-- ============================================ -->
      <!-- МОДАЛЬНОЕ ОКНО С ЗАДАНИЯМИ -->
      <!-- ============================================ -->
      <div v-if="showTaskModal" class="modal-overlay" @click.self="showTaskModal = false">
        <div class="modal-content">
          <button class="modal-close" @click="showTaskModal = false">✕</button>
          <h3 class="modal-title">🎯 CHOOSE YOUR TASK</h3>
          <p class="modal-subtitle">Pick one of these random challenges for your story!</p>

          <div class="task-list">
            <div
              v-for="(task, index) in randomTasks"
              :key="index"
              class="task-item"
              @click="selectTask(task)"
            >
              <span class="task-number">{{ index + 1 }}</span>
              <span class="task-text">{{ task }}</span>
              <span class="task-arrow">→</span>
            </div>
          </div>

          <button class="reshuffle-btn" @click="generateRandomTasks">
            🔄 SHUFFLE TASKS
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoryDice',
  data() {
    return {
      // ===== СОСТОЯНИЕ =====
      isRolling: false,
      storyText: '',
      showTaskModal: false,

      // ===== ФОН КАЖДОГО КУБИКА =====
      diceBgIndex: [], // 0=исходный, 1=зелёный, 2=розовый

      // ===== ВСЕ ЗАДАНИЯ =====
      allTasks: [
        'Make it a horror movie trailer 👻',
        'Просто переведи все картинки 👻',
        'Расскажите где и когда последний раз вы видели эти вещи ⏰',
        "Write a story about your best friend's birthday 🎂",
        'Create a fairy tale 🧚',
        'Tell a story about your English teacher 🦹',
        'Write a news report about a strange event 📰',
        'Create a story about a time traveller ⏰',
        'Write a love story with a sad ending 💔',
        'Just tell what color those objects are 🐾',
        'Write a story about a detective movie 🔍',
        'Create a story that takes place on a space ship 🚀',
        'Use pictures to continue the story: "It was a dark and stormy night..." 🌩️',
        'Create a story about your city ✨',
        'Write a story about two lovers 💭',
        'Create a story about a secret mission 🕵️',
        'Write a story about your neighbours 🏴‍☠️',
        'Use your imagination and tell any story with those pictures 🤖',
        'Write a story about a parallel universe 🌌',
        'Tell a lie about your yesterday 🦸',
        'Tell a lie about your plans for tomorrow 💭',
        'Write a story about a letter to Santa Clause 💌',
        'Create a story about your parents 🦁',
      ],
      randomTasks: [],

      // ===== КАРТИНКИ ДЛЯ КУБИКОВ =====
      diceImages: [
        new URL('../assets/images/storyDice/story_dice1.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice2.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice3.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice4.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice5.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice6.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice7.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice8.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice9.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice10.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice11.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice12.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice13.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice14.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice15.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice16.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice17.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice18.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice19.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice20.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice21.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice22.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice23.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice24.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice25.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice26.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice27.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice28.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice29.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice30.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice31.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice32.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice33.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice34.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice35.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice36.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice37.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice38.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice39.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice40.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice41.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice42.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice43.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice44.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice45.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice46.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice47.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice48.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice49.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice50.png', import.meta.url).href,
        new URL('../assets/images/storyDice/story_dice51.png', import.meta.url).href,
      ],
      dices: [],
      animations: []
    };
  },

  mounted() {
    this.initDices();
    this.generateRandomAnimations();
    this.generateRandomTasks();
  },

  methods: {
    // ============================================
    // 🔥 ИНИЦИАЛИЗАЦИЯ КУБИКОВ
    // ============================================
    initDices() {
      this.dices = this.getRandomSelection();
      this.diceBgIndex = this.dices.map(() => 0);
    },

    // ============================================
    // 🔥 БРОСОК КУБИКОВ
    // ============================================
    rollDices() {
      if (this.isRolling) return;

      this.isRolling = true;
      this.generateRandomAnimations();
      this.dices = this.getRandomSelection();
      this.diceBgIndex = this.dices.map(() => 0); // Сбрасываем фон при броске

      setTimeout(() => {
        this.isRolling = false;
        this.resetPositions();
      }, 1500);
    },

    resetPositions() {
      this.animations = this.animations.map(() => ({
        delay: 0,
        rotation: 0,
        xOffset: 0,
        yOffset: 0,
        duration: 0,
        scale: 1
      }));
    },

    getRandomSelection() {
      const shuffled = [...this.diceImages];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, 9).map(src => ({ image: src }));
    },

    generateRandomAnimations() {
      this.animations = this.dices.map(() => {
        const delay = Math.random() * 0.4;
        const rotation = (Math.random() - 0.5) * 4;
        const duration = 0.8 + Math.random() * 0.6;
        const xOffset = (Math.random() - 0.5) * 30;
        const yOffset = (Math.random() - 0.5) * 20;
        const scale = 0.8 + Math.random() * 0.4;

        return { delay, rotation, xOffset, yOffset, duration, scale };
      });
    },

    getDiceStyle(index) {
      const anim = this.animations[index] || {
        delay: 0,
        rotation: 0,
        xOffset: 0,
        yOffset: 0,
        duration: 1,
        scale: 1
      };

      if (!this.isRolling) {
        return {
          transform: 'translate(0, 0) rotate(0deg) scale(1)',
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
        };
      }

      return {
        '--delay': anim.delay + 's',
        '--rotation': anim.rotation + 'turn',
        '--xOffset': anim.xOffset + 'px',
        '--yOffset': anim.yOffset + 'px',
        '--duration': anim.duration + 's',
        '--scale': anim.scale,
        transform: `translate(${anim.xOffset}px, ${anim.yOffset}px) rotate(${anim.rotation}turn) scale(${anim.scale})`,
        animationDelay: anim.delay + 's',
        animationDuration: anim.duration + 's'
      };
    },

    // ============================================
    // 🔥 ПЕРЕКЛЮЧЕНИЕ ФОНА КУБИКА ПО КЛИКУ
    // ============================================
    toggleBackground(index) {
      this.diceBgIndex[index] = (this.diceBgIndex[index] + 1) % 3;
    },

    // ============================================
    // 🔥 ОСТАЛЬНЫЕ МЕТОДЫ (БЕЗ ИЗМЕНЕНИЙ)
    // ============================================
    adjustTextareaHeight(event) {
      const textarea = event.target;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    },

    openTaskModal() {
      this.generateRandomTasks();
      this.showTaskModal = true;
    },

    generateRandomTasks() {
      const shuffled = [...this.allTasks];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      this.randomTasks = shuffled.slice(0, 3);
    },

    selectTask(task) {
      this.storyText = `📋 Task: ${task}\n\n`;
      this.showTaskModal = false;
      this.$nextTick(() => {
        const textarea = document.querySelector('.story-input');
        if (textarea) {
          textarea.focus();
          textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
      });
    },

    shareStory() {
      if (this.storyText.length < 3) return;

      const message = `📖 My story based on dice:\n\n${this.storyText}\n\n 🎲 Thank you for reading my story`;

      this.copyToClipboard(message);
      console.log('📖 Story Dice Story:');
      console.log(message);
      console.log('---');
      this.sendToTelegram(message);
      this.showNotification('✅ Story copied to clipboard & sent to Telegram!');
    },

    copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {
          this.fallbackCopy(text);
        });
      } else {
        this.fallbackCopy(text);
      }
    },

    fallbackCopy(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    },

    sendToTelegram(message) {
      const encodedMessage = encodeURIComponent(message);
      const telegramUrl = `https://t.me/vismyfriend?text=${encodedMessage}`;
      window.open(telegramUrl, '_blank');
    },

    showNotification(text) {
      if (this.$q && this.$q.notify) {
        this.$q.notify({
          message: text,
          color: 'positive',
          position: 'top-right',
          timeout: 3000
        });
      } else {
        alert(text);
      }
    }
  }
};
</script>

<style scoped>
/* ============================================ */
/* 🔥 ОБЁРТКА — ПРЕДОТВРАЩАЕТ СКРОЛЛ НА ДЕСКТОПЕ */
/* ============================================ */
.story-dice-wrapper {
  overflow: hidden;
  border-radius: 32px;
  margin: 0 auto;
}

/* ============================================ */
/* 🔥 ОСНОВНОЙ КОНТЕЙНЕР */
/* ============================================ */
.story-dice-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 30px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 32px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.12);
  font-family: 'Arial', sans-serif;
  border: 2px solid rgba(255, 255, 255, 0.5);
  position: relative;
}

/* ============================================ */
/* 🔥 ЗАГОЛОВОК С КНОПКОЙ TASK */
/* ============================================ */
.header-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 10px;
  width: 100%;
  position: relative;
}

.dice-title {
  color: #2d3436;
  font-size: 32px;
  letter-spacing: 4px;
  margin: 0;
  font-weight: 900;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.05);
  background: linear-gradient(135deg, #6c5ce7, #fd79a8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ============================================ */
/* 🔥 КНОПКА TASK */
/* ============================================ */
.task-btn {
  position: relative;
  padding: 6px 16px 6px 12px;
  background: linear-gradient(135deg, #fd79a8, #e17055);
  color: white;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 15px rgba(225, 112, 85, 0.35);
  transition: all 0.3s ease;
  flex-shrink: 0;
  text-transform: uppercase;
  z-index: 2;
  animation: zoomPulse 2.5s ease-in-out infinite;
}

@keyframes zoomPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(225, 112, 85, 0.35);
  }
  50% {
    transform: scale(1.12);
    box-shadow: 0 8px 35px rgba(225, 112, 85, 0.6);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(225, 112, 85, 0.35);
  }
}

.task-btn:hover {
  animation: none;
  transform: scale(1.15) !important;
  box-shadow: 0 8px 40px rgba(225, 112, 85, 0.7) !important;
}

.task-btn:active {
  transform: scale(0.95) !important;
}

.task-icon {
  font-size: 16px;
}

.pulse-ring {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 34px;
  border: 2px solid rgba(225, 112, 85, 0.4);
  animation: pulseRing 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes pulseRing {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.15);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.glint {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%);
  border-radius: 50%;
  pointer-events: none;
  animation: glintMove 3s ease-in-out infinite;
}

@keyframes glintMove {
  0% {
    transform: translate(-30%, -30%) rotate(0deg);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: translate(30%, 30%) rotate(180deg);
    opacity: 0;
  }
}

/* ============================================ */
/* 🔥 ПОЛЕ С КУБИКАМИ */
/* ============================================ */
.dice-area {
  position: relative;
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 25px;
  box-sizing: border-box;
  box-shadow: inset 0 2px 20px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.08);
}

.dice-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  position: relative;
}

/* ============================================ */
/* 🔥 СТИЛЬ КУБИКОВ */
/* ============================================ */
.dice-image {
  width: 100%;
  max-width: 130px;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  border-radius: 16px;
  background: white;
  padding: 8px;
  box-sizing: border-box;
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.15),
    0 2px 8px rgba(0, 0, 0, 0.06),
    inset 0 -4px 12px rgba(0, 0, 0, 0.08),
    inset 0 4px 12px rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  user-select: none;
  cursor: pointer;
}

.dice-image:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

/* 🔥 ФОН №1 — ПАСТЕЛЬНО-ЗЕЛЁНЫЙ (ПОСЛЕ 1-ГО КЛИКА) */
.dice-image.bg-green {
  background: linear-gradient(145deg, #d4edda, #b7e4c7) !important;
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.15),
    0 2px 8px rgba(0, 0, 0, 0.06),
    inset 0 -4px 12px rgba(0, 0, 0, 0.08),
    inset 0 4px 12px rgba(255, 255, 255, 0.9);
}

/* 🔥 ФОН №2 — ПАСТЕЛЬНО-РОЗОВЫЙ (ПОСЛЕ 2-ГО КЛИКА) */
.dice-image.bg-pink {
  background: linear-gradient(145deg, #f8d7da, #f5c6cb) !important;
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.15),
    0 2px 8px rgba(0, 0, 0, 0.06),
    inset 0 -4px 12px rgba(0, 0, 0, 0.08),
    inset 0 4px 12px rgba(255, 255, 255, 0.9);
}

/* ============================================ */
/* 🔥 АНИМАЦИЯ ПАДЕНИЯ КУБИКОВ */
/* ============================================ */
.animate-fall .dice-image {
  animation: chaoticFall var(--duration, 1.2s) cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: var(--delay, 0s);
  opacity: 0;
}

@keyframes chaoticFall {
  0% {
    transform: translateY(-120vh) rotate(0deg) scale(0.2);
    opacity: 0;
  }
  40% {
    transform: translateY(20px) rotate(var(--rotation, 2turn)) scale(var(--scale, 1.2));
    opacity: 1;
  }
  70% {
    transform: translateY(-8px) rotate(calc(var(--rotation, 2turn) * 0.8)) scale(0.95);
  }
  85% {
    transform: translateY(5px) rotate(calc(var(--rotation, 2turn) * 1.1)) scale(1.02);
  }
  100% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 1;
  }
}

.rolling {
  animation: spinChaotic 0.6s ease-in-out infinite;
}

@keyframes spinChaotic {
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.1); }
  50% { transform: rotate(180deg) scale(0.95); }
  75% { transform: rotate(270deg) scale(1.05); }
  100% { transform: rotate(360deg) scale(1); }
}

/* ============================================ */
/* 🔥 КНОПКИ УПРАВЛЕНИЯ */
/* ============================================ */
.controls-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
  flex-wrap: wrap;
  width: 100%;
}

.roll-btn {
  padding: 18px 40px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 2px;
  border: none;
  border-radius: 60px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 30px rgba(108, 92, 231, 0.3);
  text-transform: uppercase;
  flex-shrink: 0;
}

.roll-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 12px 40px rgba(108, 92, 231, 0.4);
}

.roll-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.97);
}

.roll-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: scale(0.98);
  background: linear-gradient(135deg, #b2bec3, #dfe6e9);
}

.share-btn {
  padding: 18px 40px;
  background: linear-gradient(135deg, #00b894, #00cec9);
  color: white;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 2px;
  border: none;
  border-radius: 60px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 30px rgba(0, 206, 201, 0.3);
  text-transform: uppercase;
  flex-shrink: 0;
  animation: fadeInUp 0.4s ease forwards;
}

.share-btn:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 12px 40px rgba(0, 206, 201, 0.4);
}

.share-btn:active {
  transform: translateY(0) scale(0.97);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ============================================ */
/* 🔥 ТЕКСТОВОЕ ПОЛЕ */
/* ============================================ */
.story-input-wrapper {
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
}

.story-input {
  width: 100%;
  padding: 16px 20px;
  font-size: 16px;
  font-family: 'Arial', sans-serif;
  border: 2px solid #dfe6e9;
  border-radius: 16px;
  background: white;
  color: #2d3436;
  transition: all 0.3s ease;
  resize: none;
  min-height: 80px;
  max-height: 300px;
  box-sizing: border-box;
  line-height: 1.6;
}

.story-input:focus {
  outline: none;
  border-color: #6c5ce7;
  box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.1);
}

.story-input::placeholder {
  color: #b2bec3;
  font-style: italic;
}

/* ============================================ */
/* 🔥 МОДАЛЬНОЕ ОКНО */
/* ============================================ */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 28px;
  padding: 35px 40px 30px;
  max-width: 550px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
  position: relative;
}

@keyframes slideUp {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 18px;
  background: none;
  border: none;
  font-size: 26px;
  color: #b2bec3;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0 8px;
}

.modal-close:hover {
  color: #2d3436;
  transform: rotate(90deg);
}

.modal-title {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 6px 0;
  color: #2d3436;
  letter-spacing: 1px;
}

.modal-subtitle {
  color: #636e72;
  font-size: 15px;
  margin: 0 0 22px 0;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid #f0f0f0;
}

.task-item:hover {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-color: #6c5ce7;
  transform: translateX(4px);
}

.task-item:active {
  transform: scale(0.98);
}

.task-number {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.task-text {
  flex: 1;
  font-size: 15px;
  color: #2d3436;
  font-weight: 500;
}

.task-arrow {
  color: #b2bec3;
  font-size: 18px;
  transition: all 0.3s ease;
}

.task-item:hover .task-arrow {
  color: #6c5ce7;
  transform: translateX(4px);
}

.reshuffle-btn {
  margin-top: 18px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #fdcb6e, #f39c12);
  color: white;
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.reshuffle-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(243, 156, 18, 0.4);
}

.reshuffle-btn:active {
  transform: scale(0.97);
}

/* ============================================ */
/* 🔥 АДАПТИВ */
/* ============================================ */
@media (max-width: 600px) {
  .story-dice-container {
    padding: 25px 15px;
  }

  .header-wrapper {
    flex-wrap: wrap;
    gap: 10px;
  }

  .dice-title {
    font-size: 24px;
  }

  .task-btn {
    font-size: 12px;
    padding: 5px 12px 5px 10px;
  }

  .task-icon {
    font-size: 13px;
  }

  .modal-content {
    padding: 25px 20px 20px;
  }

  .modal-title {
    font-size: 20px;
  }

  .task-text {
    font-size: 13px;
  }

  .dice-area {
    gap: 12px;
    padding: 15px;
  }

  .controls-wrapper {
    flex-direction: column;
    gap: 12px;
  }

  .roll-btn {
    padding: 14px 32px;
    font-size: 16px;
    width: 100%;
    justify-content: center;
  }

  .share-btn {
    padding: 14px 32px;
    font-size: 16px;
    width: 100%;
    justify-content: center;
  }

  .dice-image {
    max-width: 80px;
    padding: 5px;
  }

  .story-input {
    font-size: 14px;
    padding: 14px 16px;
    min-height: 60px;
  }

  .reshuffle-btn {
    font-size: 13px;
    padding: 10px 20px;
  }
}
</style>
