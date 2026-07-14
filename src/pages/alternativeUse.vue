<template>
  <div class="creative-thinking-wrapper">
    <div class="creative-thinking-container">
      <!-- ============================================ -->
      <!-- ЗАГОЛОВОК С ТАЙМЕРОМ -->
      <!-- ============================================ -->
      <div class="header-wrapper">
        <h2 class="title">💡 ALTERNATIVE USE FOR :</h2>
        <div class="timer-wrapper" :class="{ 'hidden': !isRunning && !isPausedByUser }">
          <div
            class="hourglass"
            :class="{ 'running': isRunning, 'paused': isPausedByUser }"
            @click="toggleTimer"
          >
            <div class="hourglass-top">
              <div class="sand-falling" :style="{ animationDuration: totalTime + 's' }"></div>
            </div>
            <div class="hourglass-bottom">
              <div class="sand-filled" :style="{ animationDuration: totalTime + 's' }"></div>
            </div>
            <div class="hourglass-waist"></div>
          </div>
          <span class="timer-text" v-if="!isPausedByUser && isRunning">{{ Math.ceil(timeLeft) }}s</span>
          <span class="timer-text paused-text" v-else-if="isPausedByUser">⏸</span>
          <span class="timer-text" v-else-if="showResults">✅</span>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- КАРТИНКА С ПРЕДМЕТОМ -->
      <!-- ============================================ -->
      <div class="image-area">
        <img
          v-if="currentItem"
          :src="currentItem.image"
          alt="Item"
          class="item-image"
        />
        <div v-else class="placeholder-image">
          <span>🎲</span>
        </div>

        <div class="item-name-wrapper">
          <span
            class="item-name"
            :class="{ 'blurred': !showItemName }"
            @click="showItemName = !showItemName"
          >
            {{ showItemName ? currentItem.name : 'Click to see a hint' }}
          </span>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- ПОЛЕ ДЛЯ ВВОДА -->
      <!-- ============================================ -->
      <div class="input-wrapper">
        <input
          v-model="currentIdea"
          type="text"
          class="idea-input"
          :placeholder="isRunning ? 'One more idea of using this... ' : 'This can be used to ...'"
          :disabled="timeLeft <= 0 && showResults"
          @keyup.enter="addIdea"
          @input="onInput"
          @blur="onBlur"
          ref="ideaInput"
        />
        <button
          class="add-btn"
          @click="addIdea"
          :disabled="!currentIdea.trim() || showResults || (!isRunning && !waitingForIdea) || (timeLeft <= 0 && !waitingForIdea)"
        >
          ➜
        </button>
      </div>

      <!-- ============================================ -->
      <!-- КНОПКИ УПРАВЛЕНИЯ -->
      <!-- ============================================ -->
      <div class="controls-wrapper">
        <button v-if="showResults" class="try-again-btn" @click="tryAgain">
          🔄 TRY AGAIN
        </button>
      </div>

      <!-- ============================================ -->
      <!-- РЕЗУЛЬТАТЫ -->
      <!-- ============================================ -->
      <div v-if="showResults" class="results-wrapper">
        <h3 class="results-title">📋 ALL IDEAS ({{ allIdeas.length }})</h3>
        <div class="results-list">
          <div
            v-for="(idea, index) in sortedIdeas"
            :key="index"
            class="result-item"
            :class="{ 'user-idea': isUserIdea(idea) }"
          >
            <span class="result-number">{{ index + 1 }}</span>
            <span class="result-text">{{ idea }}</span>
            <span v-if="isUserIdea(idea)" class="user-badge">✏️ you</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Imagination Trainer',
  data() {
    return {
      isPaused: false,
      isPausedByUser: false,
      showItemName: false,
      isRunning: false,
      timeLeft: 200,
      totalTime: 200,
      currentIdea: '',
      userIdeas: [],
      showResults: false,
      currentItem: null,
      hasStarted: false,

      items: [
        { name: 'a rocket\na spaceship\na toy', image: new URL('../assets/images/storyDice/story_dice1.png', import.meta.url).href },
        { name: 'an umbrella ', image: new URL('../assets/images/storyDice/story_dice2.png', import.meta.url).href },
        { name: 'a 1.5 volt battery ', image: new URL('../assets/images/storyDice/story_dice3.png', import.meta.url).href },
        { name: 'a robot', image: new URL('../assets/images/storyDice/story_dice4.png', import.meta.url).href },
        { name: 'a pencil', image: new URL('../assets/images/storyDice/story_dice5.png', import.meta.url).href },
        { name: 'a toilet', image: new URL('../assets/images/storyDice/story_dice6.png', import.meta.url).href },
        { name: 'a snake', image: new URL('../assets/images/storyDice/story_dice7.png', import.meta.url).href },
        { name: 'a cactus', image: new URL('../assets/images/storyDice/story_dice8.png', import.meta.url).href },
        { name: 'a drone\na camera', image: new URL('../assets/images/storyDice/story_dice9.png', import.meta.url).href },
        { name: 'a debit card\n credit card', image: new URL('../assets/images/storyDice/story_dice10.png', import.meta.url).href },
        { name: 'a deck of cards\ncards', image: new URL('../assets/images/storyDice/story_dice11.png', import.meta.url).href },
        { name: 'a dead fish', image: new URL('../assets/images/storyDice/story_dice12.png', import.meta.url).href },
        { name: 'an envelop', image: new URL('../assets/images/storyDice/story_dice13.png', import.meta.url).href },
        { name: 'newspaper', image: new URL('../assets/images/storyDice/story_dice14.png', import.meta.url).href },
        { name: 'a bicycle', image: new URL('../assets/images/storyDice/story_dice15.png', import.meta.url).href },
        { name: 'a yacht\na ship\na boat', image: new URL('../assets/images/storyDice/story_dice16.png', import.meta.url).href },
        { name: 'a pair of glasses\nglasses', image: new URL('../assets/images/storyDice/story_dice17.png', import.meta.url).href },
        { name: 'a vacuum cleaner', image: new URL('../assets/images/storyDice/story_dice18.png', import.meta.url).href },
        { name: 'a mug\na glass', image: new URL('../assets/images/storyDice/story_dice19.png', import.meta.url).href },
        { name: 'a mouse trap', image: new URL('../assets/images/storyDice/story_dice20.png', import.meta.url).href },
        { name: 'a hamburger', image: new URL('../assets/images/storyDice/story_dice21.png', import.meta.url).href },
        { name: 'headsets\nheadphones', image: new URL('../assets/images/storyDice/story_dice22.png', import.meta.url).href },
        { name: 'a sofa\na couch', image: new URL('../assets/images/storyDice/story_dice23.png', import.meta.url).href },
        { name: 'a double deck bus\na bus', image: new URL('../assets/images/storyDice/story_dice24.png', import.meta.url).href },
        { name: 'a plate\na fork\na knife', image: new URL('../assets/images/storyDice/story_dice25.png', import.meta.url).href },
        { name: 'a jaw in a glass of water', image: new URL('../assets/images/storyDice/story_dice26.png', import.meta.url).href },
        { name: 'a slice of pizza', image: new URL('../assets/images/storyDice/story_dice27.png', import.meta.url).href },
        { name: 'an underwear\nmaybe dirty', image: new URL('../assets/images/storyDice/story_dice28.png', import.meta.url).href },
        { name: 'a lamp\na bulb', image: new URL('../assets/images/storyDice/story_dice29.png', import.meta.url).href },
        { name: 'a ladder', image: new URL('../assets/images/storyDice/story_dice30.png', import.meta.url).href },
        { name: 'a car', image: new URL('../assets/images/storyDice/story_dice31.png', import.meta.url).href },
        { name: 'an ice-cream\na cone of ice-cream', image: new URL('../assets/images/storyDice/story_dice32.png', import.meta.url).href },
        { name: 'a comb\na hairbrush', image: new URL('../assets/images/storyDice/story_dice33.png', import.meta.url).href },
        { name: 'some paper\ndocuments', image: new URL('../assets/images/storyDice/story_dice34.png', import.meta.url).href },
        { name: 'a banana', image: new URL('../assets/images/storyDice/story_dice35.png', import.meta.url).href },
        { name: 'a mouse\ndead or alive', image: new URL('../assets/images/storyDice/story_dice36.png', import.meta.url).href },
        { name: 'a ball', image: new URL('../assets/images/storyDice/story_dice37.png', import.meta.url).href },
        { name: 'a laptop', image: new URL('../assets/images/storyDice/story_dice38.png', import.meta.url).href },
        { name: 'a phone', image: new URL('../assets/images/storyDice/story_dice39.png', import.meta.url).href },
        { name: 'an award\na cup\na trophy', image: new URL('../assets/images/storyDice/story_dice40.png', import.meta.url).href },
        { name: 'a pin\na hair clip\na bobby pin', image: new URL('../assets/images/storyDice/story_dice42.png', import.meta.url).href },
        { name: 'a chair', image: new URL('../assets/images/storyDice/story_dice44.png', import.meta.url).href },
        { name: 'pliers\ntweezers', image: new URL('../assets/images/storyDice/story_dice45.png', import.meta.url).href },
        { name: 'a guitar\nan acoustic guitar', image: new URL('../assets/images/storyDice/story_dice46.png', import.meta.url).href },
        { name: 'binos\nbinoculars\nfield glasses', image: new URL('../assets/images/storyDice/story_dice47.png', import.meta.url).href },
        { name: 'a book\na notebook', image: new URL('../assets/images/storyDice/story_dice48.png', import.meta.url).href },
        { name: 'a doormat\na rug\na welcome sign', image: new URL('../assets/images/storyDice/story_dice49.png', import.meta.url).href },
        { name: 'a band aid\na patch\na plaster', image: new URL('../assets/images/storyDice/story_dice50.png', import.meta.url).href },
        { name: 'a drill\nan electric drill', image: new URL('../assets/images/storyDice/story_dice51.png', import.meta.url).href },
      ],

      allPresetIdeas: [
        'Just look at it and enjoy its beauty',
        'Paint a graffiti of it on a wall',
        'Use it as a meditation object',
        'Turn it into a musical instrument',
        'Make a wish while holding it',
        'Give it as a gift to a stranger',
        'Use it as a paperweight',
        'Put it in a museum',
        'Draw a portrait of it',
        'Write a poem about it',
        'Use it as a bookmark',
        'Make a keychain from it',
        'Use it as a good luck charm',
        'Put it in a time capsule',
        'Photograph it from 100 angles',
        'Trade it with someone',
        'Hide it in a secret place',
        'Make a movie about it',
        'Use it as a teaching tool',
        'Start a collection with it',
        'Use it as a doorstop',
        'Use it as a decorative piece',
        'Turn it into a mobile phone stand',
        'Use it as a candle holder',
        'Use it as a gift box',
        'Use it as a plant pot',
        'Turn it into a bird feeder',
        'Use it as a bookend',
        'Use it as a vase',
        'Turn it into a lamp',
        'Use it as a picture frame',
        'Turn it into a wind chime',
        'Use it as a soap dish',
        'Turn it into a toy for a pet',
        'Use it as a paper holder',
        'Turn it into a key holder',
        'Use it as a jewelry box',
        'Turn it into a clock',
        'Use it as a letter opener',
        'Turn it into a piggy bank',
        'Turn it into a wall hanging',
        'Use it as a fridge magnet',
        'Turn it into a mobile phone case',
        'Use it as a business card holder',
        'Turn it into a napkin ring',
        'Use it as a candle snuffer',
        'Turn it into a tea infuser',
        'Use it as a soap dispenser',
        'Turn it into a photo holder',
        'Use it as a place card holder',
        'Turn it into a perfume bottle',
        'Use it as a salt shaker',
        'Turn it into a wind spinner',
        'Use it as a stepping stone',
        'Turn it into a garden marker',
        'Use it as a coaster',
        'Turn it into a mirror frame',
        'Use it as a cookie cutter',
        'Turn it into a stencil',
        'Use it as a stamp',
        'Turn it into a mosaic tile',
        'Use it as a puzzle piece',
        'Turn it into a badge',
        'Use it as a brooch',
        'Turn it into a hair accessory',
        'Use it as a tie clip',
        'Turn it into a cufflink',
        'Use it as a lapel pin',
        'Turn it into a zipper pull',
        'Use it as a sunglasses holder',
        'Turn it into a pipe cleaner',
        'Use it as a whistle',
      ],
      presetIdeas: [],
      timerInterval: null,
      storageKey: 'creative_thinking_ideas',
      waitingForIdea: false,
      isTyping: false,
      finishCheckInterval: null,
    };
  },

  computed: {
    allIdeas() {
      return [...this.userIdeas, ...this.presetIdeas];
    },
    sortedIdeas() {
      return [...this.allIdeas].sort((a, b) => a.localeCompare(b));
    },
  },

  mounted() {
    this.loadFromStorage();
    this.pickRandomItem();
  },

  beforeDestroy() {
    clearInterval(this.timerInterval);
    clearInterval(this.finishCheckInterval);
    this.saveToStorage();
  },

  methods: {
    pickRandomItem() {
      const randomIndex = Math.floor(Math.random() * this.items.length);
      this.currentItem = this.items[randomIndex];
    },

    startGame() {
      if (this.isRunning) return;

      this.presetIdeas = this.getRandomPresetIdeas(4);

      this.isRunning = true;
      this.showResults = false;
      this.userIdeas = [];
      this.waitingForIdea = false;
      this.isTyping = false;
      this.isPaused = false;
      this.isPausedByUser = false;
      this.timeLeft = this.totalTime;

      this.$nextTick(() => {
        const input = this.$refs.ideaInput;
        if (input) input.focus();
      });

      this.timerInterval = setInterval(() => {
        this.timeLeft -= 0.1;
        if (this.timeLeft <= 0) {
          this.timeLeft = 0;
          this.finishGame();
        }
      }, 100);
    },

    toggleTimer() {
      if (this.showResults) return;
      if (!this.isRunning && !this.isPausedByUser) return;

      if (this.isPausedByUser) {
        this.tryAgain();
        return;
      }

      this.isPaused = true;
      this.isPausedByUser = true;
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    },

    getRandomPresetIdeas(count) {
      const shuffled = [...this.allPresetIdeas];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, count);
    },

    onInput() {
      this.isTyping = this.currentIdea.trim().length > 0;

      if (!this.hasStarted && this.currentIdea.trim().length > 0) {
        this.hasStarted = true;
        this.startGame();
      }
    },

    onBlur() {
      if (this.showResults) return;
      if (this.waitingForIdea && this.currentIdea.trim().length === 0) {
        this.completeGame();
      }
    },

    finishGame() {
      if (this.showResults) return;

      if (this.currentIdea.trim().length > 3) {
        if (this.waitingForIdea) return;

        this.waitingForIdea = true;
        this.finishCheckInterval = setInterval(() => {
          if (this.showResults) {
            clearInterval(this.finishCheckInterval);
            this.finishCheckInterval = null;
            return;
          }

          if (this.currentIdea.trim().length === 0 || this.currentIdea.trim().length < 3) {
            this.completeGame();
          }
        }, 500);
        return;
      }

      this.completeGame();
    },

    addIdea() {
      const idea = this.currentIdea.trim();

      if (!idea) return;
      if (this.showResults) return;
      if (!this.isRunning && !this.waitingForIdea) return;

      this.userIdeas.push(idea);
      this.currentIdea = '';
      this.isTyping = false;

      if (this.waitingForIdea) {
        this.completeGame();
        return;
      }

      this.$nextTick(() => {
        const input = this.$refs.ideaInput;
        if (input) input.focus();
      });
    },

    completeGame() {
      clearInterval(this.timerInterval);
      clearInterval(this.finishCheckInterval);

      this.isRunning = false;
      this.showResults = true;
      this.waitingForIdea = false;
      this.isTyping = false;
      this.isPaused = false;
      this.isPausedByUser = false;

      this.timerInterval = null;
      this.finishCheckInterval = null;

      this.saveToStorage();
    },

    tryAgain() {
      clearInterval(this.timerInterval);
      clearInterval(this.finishCheckInterval);

      this.timerInterval = null;
      this.finishCheckInterval = null;

      this.isRunning = false;
      this.showResults = false;
      this.waitingForIdea = false;
      this.isTyping = false;
      this.isPaused = false;
      this.isPausedByUser = false;
      this.hasStarted = false;
      this.userIdeas = [];
      this.currentIdea = '';
      this.timeLeft = this.totalTime;
      this.showItemName = false;
      this.presetIdeas = [];

      this.pickRandomItem();

      this.$nextTick(() => {
        const input = this.$refs.ideaInput;
        if (input) input.focus();
      });
    },

    isUserIdea(idea) {
      return this.userIdeas.includes(idea);
    },

    saveToStorage() {
      if (this.userIdeas.length > 0) {
        const data = {
          item: this.currentItem ? this.currentItem.name : 'Unknown',
          ideas: this.userIdeas,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      }
    },

    loadFromStorage() {
      try {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
          const data = JSON.parse(saved);
          console.log('📦 Loaded from storage:', data);
        }
      } catch (e) {}
    },
  },
};
</script>

<style scoped>
.creative-thinking-wrapper {
  overflow: hidden;
  border-radius: 32px;
  margin: 0 auto;
  max-width: 700px;
}

.creative-thinking-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 30px;
  background: linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%);
  border-radius: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  min-height: 500px;
}

.header-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  gap: 16px;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: #2d3436;
  margin: 0;
  letter-spacing: 1px;
}

.timer-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 1;
  pointer-events: all;
  transition: opacity 0.3s ease;
}

.timer-wrapper.hidden {
  opacity: 0;
  pointer-events: none;
}

.timer-text {
  font-size: 22px;
  font-weight: 700;
  color: #2d3436;
  min-width: 45px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.paused-text {
  color: #00b894;
}

.hourglass {
  position: relative;
  width: 40px;
  height: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
}

.hourglass:not(.running):not(.paused) {
  cursor: default;
}

.hourglass.running:not(.paused):hover {
  opacity: 0.8;
}

.hourglass.paused {
  cursor: pointer;
  opacity: 0.85;
}

.hourglass.paused:hover {
  opacity: 1;
}

.hourglass-top,
.hourglass-bottom {
  position: relative;
  width: 100%;
  height: 45%;
  overflow: hidden;
}

.hourglass-top {
  border-radius: 50% 50% 0 0 / 20% 20% 0 0;
  background: linear-gradient(180deg, #dfe6e9 0%, #b2bec3 100%);
  border: 2px solid #636e72;
  border-bottom: none;
}

.hourglass-bottom {
  border-radius: 0 0 50% 50% / 0 0 20% 20%;
  background: linear-gradient(0deg, #dfe6e9 0%, #b2bec3 100%);
  border: 2px solid #636e72;
  border-top: none;
}

.hourglass-waist {
  position: relative;
  width: 12px;
  height: 10%;
  background: #636e72;
  z-index: 2;
  flex-shrink: 0;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.hourglass-waist::after {
  content: '';
  position: absolute;
  top: 0;
  left: -4px;
  right: -4px;
  height: 100%;
  background: #636e72;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
}

.sand-falling {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(180deg, #fdcb6e, #f39c12);
  border-radius: 0 0 50% 50% / 0 0 20% 20%;
  transform-origin: bottom;
  transform: scaleY(1);
  animation: sandFall linear forwards;
  animation-play-state: paused;
}

.hourglass.running .sand-falling {
  animation-play-state: running;
}

.hourglass.paused .sand-falling {
  background: linear-gradient(180deg, #55efc4, #00b894) !important;
  animation-play-state: paused !important;
}

.hourglass.paused .sand-filled {
  background: linear-gradient(0deg, #55efc4, #00b894) !important;
  animation-play-state: paused !important;
}

@keyframes sandFall {
  0% {
    transform: scaleY(1);
    opacity: 1;
  }
  100% {
    transform: scaleY(0);
    opacity: 0.2;
  }
}

.sand-filled {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0%;
  background: linear-gradient(0deg, #fdcb6e, #f39c12);
  border-radius: 0 0 50% 50% / 0 0 20% 20%;
  transform-origin: bottom;
  animation: sandFill linear forwards;
  animation-play-state: paused;
}

.hourglass.running .sand-filled {
  animation-play-state: running;
}

@keyframes sandFill {
  0% {
    height: 0%;
    opacity: 0.2;
  }
  100% {
    height: 100%;
    opacity: 1;
  }
}

.image-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 300px;
}

.item-image {
  width: 150px;
  height: 150px;
  object-fit: contain;
  border-radius: 12px;
  background: #fafafa;
  padding: 10px;
}

.placeholder-image {
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #dfe6e9;
}

.item-name-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.item-name {
  font-size: 18px;
  font-weight: 600;
  color: #2d3436;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  transition: all 0.4s ease;
  user-select: none;
  padding: 4px 12px;
  border-radius: 8px;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: pre-line; /* 🔥 Позволяет переносить строки */

}

.item-name.blurred {
  filter: blur(2.5px);
  color: #636e72;
  background: rgba(0, 0, 0, 0.03);
  cursor: pointer;
  transition: all 0.4s ease;
}

.item-name.blurred:hover {
  filter: blur(4px);
  background: rgba(0, 0, 0, 0.06);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 500px;
  margin-bottom: 16px;
}

.idea-input {
  flex: 1;
  padding: 14px 18px;
  font-size: 16px;
  font-family: inherit;
  border: 2px solid #dfe6e9;
  border-radius: 14px;
  background: white;
  color: #2d3436;
  transition: all 0.3s ease;
  outline: none;
  min-height: 52px;
}

.idea-input:focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.08);
}

.idea-input:disabled {
  background: #f1f2f6;
  cursor: not-allowed;
  opacity: 0.6;
}

.idea-input::placeholder {
  color: #b2bec3;
}

.add-btn {
  padding: 14px 20px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 20px;
  transition: all 0.3s ease;
  flex-shrink: 0;
  height: 52px;
  width: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(108, 92, 231, 0.3);
}

.add-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.add-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.controls-wrapper {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 500px;
}

.try-again-btn {
  flex: 1;
  padding: 12px 24px;
  background: linear-gradient(135deg, #fdcb6e, #f39c12);
  color: white;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 30px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(243, 156, 18, 0.3);
  letter-spacing: 1px;
  min-width: 140px;
}

.try-again-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(243, 156, 18, 0.4);
}

.try-again-btn:active {
  transform: scale(0.97);
}

.results-wrapper {
  width: 100%;
  max-width: 550px;
  margin-top: 10px;
  padding: 20px 24px 24px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  animation: fadeSlideUp 0.5s ease;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.results-title {
  font-size: 18px;
  font-weight: 700;
  color: #2d3436;
  margin: 0 0 16px 0;
  text-align: center;
  letter-spacing: 0.5px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 4px;
}

.results-list::-webkit-scrollbar {
  width: 4px;
}

.results-list::-webkit-scrollbar-thumb {
  background: #dfe6e9;
  border-radius: 2px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
  border-radius: 10px;
  background: #f8f9fa;
  transition: background 0.2s ease;
}

.result-item:hover {
  background: #f1f2f6;
}

.result-number {
  font-size: 12px;
  font-weight: 700;
  color: #b2bec3;
  min-width: 28px;
  text-align: center;
}

.result-text {
  font-size: 15px;
  color: #2d3436;
  flex: 1;
}

.result-item.user-idea {
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
  border-left: 3px solid #fdd835;
  padding-left: 11px;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.12);
}

.result-item.user-idea:hover {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  box-shadow: 0 2px 12px rgba(255, 193, 7, 0.2);
}

.user-badge {
  font-size: 10px;
  font-weight: 700;
  color: #f57c00;
  background: rgba(255, 193, 7, 0.2);
  padding: 2px 10px;
  border-radius: 12px;
  flex-shrink: 0;
  letter-spacing: 0.5px;
}

@media (max-width: 600px) {
  .creative-thinking-container {
    padding: 25px 16px;
    border-radius: 24px;
  }

  .title {
    font-size: 16px;
  }

  .timer-text {
    font-size: 18px;
    min-width: 35px;
  }

  .hourglass {
    width: 32px;
    height: 44px;
  }

  .image-area {
    max-width: 220px;
    padding: 14px;
  }

  .item-image {
    width: 110px;
    height: 110px;
  }

  .placeholder-image {
    width: 110px;
    height: 110px;
    font-size: 44px;
  }

  .item-name {
    font-size: 14px;
  }

  .idea-input {
    font-size: 14px;
    padding: 12px 14px;
    min-height: 44px;
  }

  .add-btn {
    height: 44px;
    width: 44px;
    font-size: 16px;
    padding: 0;
  }

  .try-again-btn {
    padding: 10px 16px;
    font-size: 14px;
    min-width: 100px;
  }

  .results-wrapper {
    padding: 16px 16px 20px;
  }

  .result-text {
    font-size: 13px;
  }
}
</style>
