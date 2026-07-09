<template>
  <div class="story-dice-wrapper">
    <div class="story-dice-container">
      <h2 class="dice-title">🎲 STORY DICE</h2>

      <!-- Поле с кубиками -->
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
            :class="{ 'rolling': isRolling }"
          />
        </div>
      </div>

      <!-- Текстовое поле для истории -->
      <div class="story-input-wrapper">
        <textarea
          v-model="storyText"
          class="story-input"
          placeholder="Write your story here... 📝"
          rows="3"
          @input="adjustTextareaHeight"
        ></textarea>
      </div>


      <!-- Кнопка управления + текстовое поле + кнопка Share -->
      <div class="controls-wrapper">
        <!-- Кнопка Share появляется справа от ROLL AGAIN -->
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoryDice',
  data() {
    return {
      isRolling: false,
      storyText: '',
      diceImages: [
        '/src/assets/images/storyDice/story_dice1.png',
        '/src/assets/images/storyDice/story_dice2.png',
        '/src/assets/images/storyDice/story_dice3.png',
        '/src/assets/images/storyDice/story_dice4.png',
        '/src/assets/images/storyDice/story_dice5.png',
        '/src/assets/images/storyDice/story_dice6.png',
        '/src/assets/images/storyDice/story_dice7.png',
        '/src/assets/images/storyDice/story_dice8.png',
        '/src/assets/images/storyDice/story_dice9.png',
        '/src/assets/images/storyDice/story_dice10.png',
        '/src/assets/images/storyDice/story_dice11.png',
        '/src/assets/images/storyDice/story_dice12.png',
        '/src/assets/images/storyDice/story_dice13.png',
        '/src/assets/images/storyDice/story_dice14.png',
        '/src/assets/images/storyDice/story_dice15.png',
        '/src/assets/images/storyDice/story_dice16.png',
        '/src/assets/images/storyDice/story_dice17.png',
        '/src/assets/images/storyDice/story_dice18.png',
        '/src/assets/images/storyDice/story_dice19.png',
        '/src/assets/images/storyDice/story_dice20.png',
        '/src/assets/images/storyDice/story_dice21.png',
        '/src/assets/images/storyDice/story_dice22.png',
        '/src/assets/images/storyDice/story_dice23.png',
        '/src/assets/images/storyDice/story_dice24.png',
        '/src/assets/images/storyDice/story_dice25.png',
        '/src/assets/images/storyDice/story_dice26.png',
        '/src/assets/images/storyDice/story_dice27.png',
        '/src/assets/images/storyDice/story_dice28.png',
        '/src/assets/images/storyDice/story_dice29.png',
        '/src/assets/images/storyDice/story_dice30.png',
        '/src/assets/images/storyDice/story_dice31.png',
        '/src/assets/images/storyDice/story_dice32.png',
        '/src/assets/images/storyDice/story_dice33.png',
        '/src/assets/images/storyDice/story_dice34.png',
        '/src/assets/images/storyDice/story_dice35.png',
        '/src/assets/images/storyDice/story_dice36.png',
        '/src/assets/images/storyDice/story_dice37.png',
        '/src/assets/images/storyDice/story_dice38.png',
        '/src/assets/images/storyDice/story_dice39.png',
        '/src/assets/images/storyDice/story_dice40.png',
        '/src/assets/images/storyDice/story_dice41.png',
        '/src/assets/images/storyDice/story_dice42.png',
        '/src/assets/images/storyDice/story_dice43.png',
        '/src/assets/images/storyDice/story_dice44.png',
        '/src/assets/images/storyDice/story_dice45.png',
        '/src/assets/images/storyDice/story_dice46.png',
        '/src/assets/images/storyDice/story_dice47.png',
        '/src/assets/images/storyDice/story_dice48.png',
        '/src/assets/images/storyDice/story_dice49.png',
        '/src/assets/images/storyDice/story_dice50.png',
        '/src/assets/images/storyDice/story_dice51.png',
      ],
      dices: [],
      animations: []
    };
  },
  mounted() {
    this.initDices();
    this.generateRandomAnimations();
  },
  methods: {
    initDices() {
      this.dices = this.getRandomSelection();
    },

    rollDices() {
      if (this.isRolling) return;

      this.isRolling = true;
      this.generateRandomAnimations();
      this.dices = this.getRandomSelection();

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

    // 🔥 АВТО-РАСШИРЕНИЕ TEXTAREA
    adjustTextareaHeight(event) {
      const textarea = event.target;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    },

    // 🔥 ОСНОВНАЯ ФУНКЦИЯ SHARE
    shareStory() {
      if (this.storyText.length < 3) return;

      const message = `📖 My story based on dice:\n\n${this.storyText}\n\n 🎲 Thank you for reading my story`;

      // 1. Копируем в буфер обмена
      this.copyToClipboard(message);

      // 2. Выводим в консоль
      console.log('📖 Story Dice Story:');
      console.log(message);
      console.log('---');

      // 3. Отправляем в Telegram
      this.sendToTelegram(message);

      // 4. Показываем уведомление
      this.showNotification('✅ Story copied to clipboard & sent to Telegram!');
    },

    // Копирование в буфер обмена
    copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {
          this.fallbackCopy(text);
        });
      } else {
        this.fallbackCopy(text);
      }
    },

    // Fallback для старых браузеров
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

    // 🔥 ОТПРАВКА В TELEGRAM
    sendToTelegram(message) {
      // Кодируем сообщение для URL
      const encodedMessage = encodeURIComponent(message);

      // Создаём ссылку для открытия Telegram
      const telegramUrl = `https://t.me/omgbuddy?text=${encodedMessage}`;

      // Открываем Telegram в новом окне/вкладке
      window.open(telegramUrl, '_blank');
    },

    // Простое уведомление
    showNotification(text) {
      // Если есть Quasar Notify — используем его
      if (this.$q && this.$q.notify) {
        this.$q.notify({
          message: text,
          color: 'positive',
          position: 'top-right',
          timeout: 3000
        });
      } else {
        // Иначе используем alert
        alert(text);
      }
    }
  }
};
</script>

<style scoped>
/* 🔥 ОБЁРТКА — ПРЕДОТВРАЩАЕТ СКРОЛЛ НА ДЕСКТОПЕ */
.story-dice-wrapper {
  overflow: hidden;
  border-radius: 32px;
  margin: 0 auto;
}

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
}

.dice-title {
  color: #2d3436;
  font-size: 32px;
  letter-spacing: 4px;
  margin-bottom: 10px;
  margin-top: 0;
  font-weight: 900;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.05);
  background: linear-gradient(135deg, #6c5ce7, #fd79a8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

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
  /* 🔥 ОСНОВНЫЕ ЭФФЕКТЫ ДЛЯ ОБЪЁМА */
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.15),
    0 2px 8px rgba(0, 0, 0, 0.06),
    inset 0 -4px 12px rgba(0, 0, 0, 0.08),
    inset 0 4px 12px rgba(255, 255, 255, 0.9);  transition: transform 0.3s ease;
  user-select: none;
}

.dice-image:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

/* АНИМАЦИЯ ПАДЕНИЯ СВЕРХУ С ХАОТИЧНЫМ ВРАЩЕНИЕМ */
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

/* Дополнительное вращение во время броска */
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
/* 🔥 НОВЫЕ СТИЛИ ДЛЯ УПРАВЛЕНИЯ */
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

/* Кнопка ROLL AGAIN */
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

/* 🔥 НОВАЯ КНОПКА SHARE */
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

/* 🔥 ТЕКСТОВОЕ ПОЛЕ ДЛЯ ИСТОРИИ */
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

/* Адаптив */
@media (max-width: 600px) {
  .story-dice-container {
    padding: 25px 15px;
  }

  .dice-area {
    gap: 12px;
    padding: 15px;
  }

  .dice-title {
    font-size: 24px;
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
}
</style>
