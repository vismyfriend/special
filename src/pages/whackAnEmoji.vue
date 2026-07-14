<template>
  <div class="bgWrapper">
    <div class="whack-wrapper">
      <div class="whack-container">
        <!-- ===== ЗАГОЛОВОК ===== -->
        <div class="header">
          <h1 class="title">Hi, special agent</h1>
          <h1 class="title">Click the buttons</h1>
          <div class="stats">
            <span class="stat">
              <span class="stat-label">HITS</span>
              <span class="stat-value">{{ hits }}</span>
            </span>
            <span class="stat">
              <span class="stat-label">TARGET</span>
              <span class="stat-value">{{ target }}</span>
            </span>
            <span class="stat">
              <span class="stat-label">MISSES</span>
              <span class="stat-value">{{ misses }}</span>
            </span>
          </div>
        </div>

        <!-- ===== СЕТКА 3x3 ===== -->
        <div class="grid">
          <div
            v-for="(cell, index) in gridCells"
            :key="index"
            class="cell"
            @click="handleClick(index)"
            :class="{ 'miss': missCell === index, 'hit': hitCell === index }"
          >
            <!-- Эмодзи (показываем, если игра не окончена) -->
            <div
              v-if="!showGameOverGrid && activeCell === index"
              class="emoji-wrapper"
              :class="{ 'pop': activeCell === index }"
            >
              <span class="emoji">{{ currentItem.emoji }}</span>
              <span v-if="currentItem.label" class="emoji-label">{{ currentItem.label }}</span>
              <span class="glow-ring"></span>
            </div>

            <!-- GAME OVER / GAME DONE буквы -->
            <div v-if="showGameOverGrid" class="gameover-letter" :style="{ color: cell.color }">
              <span v-if="!cell.isSkull">{{ cell.letter }}</span>
              <span v-else class="skull-emoji">{{ cell.letter }}</span>
            </div>
          </div>
        </div>

        <!-- ===== РЕЗУЛЬТАТ ===== -->
        <div v-if="gameOver && !showGameOverGrid" class="result-overlay">
          <div class="result-card">
            <div class="result-icon">{{ gameOverByMisses ? '💀' : '🕵️' }}</div>
            <h2 class="result-title">{{ gameOverByMisses ? 'SYSTEM FAILURE' : 'MISSION COMPLETE' }}</h2>
            <p class="result-text">{{ gameOverByMisses ? 'EPIC FAIL. Try again.' : 'GREAT ! You are a real special agent!' }}</p>
            <p class="result-stats">
              <span>Hits: {{ hits }}</span>
              <span>Misses: {{ misses }}</span>
              <span>Accuracy: {{ accuracy }}%</span>
            </p>
            <button class="result-btn" @click="resetGame">⟳ INITIALIZE</button>
          </div>
        </div>

        <!-- ===== ФОН С ЭФФЕКТАМИ ===== -->
        <div class="bg-effects">
          <div class="grid-lines"></div>
          <div class="scan-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NeuralTarget',
  data() {
    return {
      activeCell: null,
      hits: 0,
      misses: 0,
      target: 21,
      maxMissDifference: 20,
      gameOver: false,
      gameOverByMisses: false,
      showGameOverGrid: false,
      missCell: null,
      hitCell: null,
      timeoutId: null,
      resultTimeoutId: null,
      currentItem: { emoji: '🎯', label: '' },
      items: [
        { emoji: '🤖', label: 'AI' },
        { emoji: '👾', label: 'ALIEN' },
        { emoji: '💀', label: 'SYSTEM' },
        { emoji: '⚡', label: 'ENERGY' },
        { emoji: '🔮', label: 'PROPHET' },
        { emoji: '🌀', label: 'PORTAL' },
        { emoji: '🧠', label: 'NEURAL' },
        { emoji: '🦾', label: 'CYBER' },
        { emoji: '🔫', label: 'WEAPON' },
        { emoji: '👁️', label: 'SENSOR' },
        { emoji: '🧬', label: 'DNA' },
        { emoji: '🕹️', label: 'CONTROL' },
        { emoji: '📡', label: 'SIGNAL' },
        { emoji: '🛸', label: 'UFO' },
        { emoji: '👽', label: 'ENTITY' },
        { emoji: '💻', label: 'MATRIX' },
        { emoji: '⚙️', label: 'MACHINE' },
        { emoji: '📀', label: 'DATA' },
        { emoji: '🎯', label: 'TARGET' },
        { emoji: '🔺', label: 'THREAT' },
        { emoji: '◼️', label: 'VOID' },
        { emoji: '⬡', label: 'SIGNAL' },
        { emoji: '⏣', label: 'SYSTEM' },
        { emoji: '⏺', label: 'RECORD' },
        { emoji: '🧪', label: 'LAB' },
        { emoji: '🦠', label: 'VIRUS' },
        { emoji: '☢️', label: 'RADIATION' },
        { emoji: '🔓', label: 'ACCESS' },
        { emoji: '🔒', label: 'LOCKED' },
        { emoji: '⌛', label: 'TIMER' },
        { emoji: '⏳', label: 'PAUSE' },
        { emoji: '📟', label: 'PAGER' },
        { emoji: '💾', label: 'SAVE' },
        { emoji: '🖥️', label: 'TERMINAL' },
        { emoji: '⌨️', label: 'INPUT' },
        { emoji: '🖱️', label: 'CURSOR' },
        { emoji: '📱', label: 'DEVICE' },
        { emoji: '📶', label: 'NETWORK' },
        { emoji: '🔌', label: 'POWER' },
        { emoji: '💡', label: 'IDEA' },
        { emoji: '🔋', label: 'CHARGE' },
        { emoji: '📊', label: 'SCAN' },
        { emoji: '📈', label: 'TRACK' },
        { emoji: '📉', label: 'DECLINE' },
        { emoji: '🔄', label: 'CYCLE' },
        { emoji: '⏫', label: 'BOOST' },
        { emoji: '⏬', label: 'DRAIN' },
        { emoji: '◀️', label: 'LEFT' },
        { emoji: '▶️', label: 'RIGHT' },
        { emoji: '▲', label: 'UP' },
        { emoji: '▼', label: 'DOWN' },
        { emoji: '✖️', label: 'ERROR' },
        { emoji: '✔️', label: 'OK' },
        { emoji: '❗', label: 'ALERT' },
        { emoji: '❓', label: 'QUERY' },
        { emoji: '♻️', label: 'RECYCLE' },
        { emoji: '⚕️', label: 'HEAL' },
        { emoji: '💊', label: 'CURE' },
        { emoji: '💉', label: 'INJECT' },
        { emoji: '🩸', label: 'BLOOD' },
        { emoji: '🧫', label: 'CULTURE' },
        { emoji: '🧬', label: 'GENOME' },
        { emoji: '🔬', label: 'MICROSCOPE' },
        { emoji: '🔭', label: 'TELESCOPE' },
        { emoji: '🪐', label: 'SATURN' },
        { emoji: '🌌', label: 'GALAXY' },
        { emoji: '🛰️', label: 'SATELLITE' },
        { emoji: '🚀', label: 'LAUNCH' },
        { emoji: '🪴', label: 'GROW' },
        { emoji: '🌱', label: 'SEED' },
        { emoji: '🌿', label: 'NATURE' },
        { emoji: '☀️', label: 'SOLAR' },
        { emoji: '🌙', label: 'LUNAR' },
        { emoji: '⭐', label: 'STAR' },
        { emoji: '🌟', label: 'NOVA' },
        { emoji: '💫', label: 'GLITCH' },
        { emoji: '✨', label: 'SPARK' },
        { emoji: '🔥', label: 'BLAZE' },
        { emoji: '❄️', label: 'FROST' },
        { emoji: '💧', label: 'DROP' },
        { emoji: '🌊', label: 'WAVE' },
        { emoji: '🌈', label: 'PRISM' },
        { emoji: '☁️', label: 'CLOUD' },
        { emoji: '⛅', label: 'NEBULA' },
        { emoji: '🌪️', label: 'STORM' },
        { emoji: '🌀', label: 'CYCLONE' },
        { emoji: '🌈', label: 'HOLO' },
        { emoji: '🎇', label: 'FLARE' },
        { emoji: '🎆', label: 'BURST' },
        { emoji: '🧨', label: 'EXPLODE' },
        { emoji: '💥', label: 'IMPACT' },
        { emoji: '💢', label: 'ANGRY' },
        { emoji: '💬', label: 'COMM' },
        { emoji: '🗯️', label: 'THOUGHT' },
        { emoji: '💭', label: 'DREAM' },
        { emoji: '👾', label: 'GAME' },
      ],
    };
  },

  computed: {
    accuracy() {
      const total = this.hits + this.misses;
      return total === 0 ? 0 : Math.round((this.hits / total) * 100);
    },
    gridCells() {
      if (this.gameOverByMisses) {
        return [
          { letter: 'G', isSkull: false, color: '#ff0040' },
          { letter: 'A', isSkull: false, color: '#ff0040' },
          { letter: 'M', isSkull: false, color: '#ff0040' },
          { letter: 'E', isSkull: false, color: '#ff0040' },
          { letter: '💀', isSkull: true, color: '#ff0040' },
          { letter: 'O', isSkull: false, color: '#ff0040' },
          { letter: 'V', isSkull: false, color: '#ff0040' },
          { letter: 'E', isSkull: false, color: '#ff0040' },
          { letter: 'R', isSkull: false, color: '#ff0040' },
        ];
      } else {
        return [
          { letter: 'G', isSkull: false, color: '#00ff88' },
          { letter: 'A', isSkull: false, color: '#00ff88' },
          { letter: 'M', isSkull: false, color: '#00ff88' },
          { letter: 'E', isSkull: false, color: '#00ff88' },
          { letter: '🕵️', isSkull: true, color: '#00ff88' },
          { letter: 'D', isSkull: false, color: '#00ff88' },
          { letter: 'O', isSkull: false, color: '#00ff88' },
          { letter: 'N', isSkull: false, color: '#00ff88' },
          { letter: 'E', isSkull: false, color: '#00ff88' },
        ];
      }
    },
  },

  mounted() {
    this.spawnEmoji();
  },

  beforeDestroy() {
    clearTimeout(this.timeoutId);
    clearTimeout(this.resultTimeoutId);
  },

  methods: {
    spawnEmoji() {
      if (this.gameOver || this.activeCell !== null) return;

      const cell = Math.floor(Math.random() * 9) + 1;
      this.activeCell = cell;

      this.currentItem = this.items[Math.floor(Math.random() * this.items.length)];

      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        if (this.activeCell !== null && !this.gameOver) {
          this.miss();
        }
      }, 2000);
    },

    endGameWithDelay() {
      this.showGameOverGrid = true;
      this.gameOver = true;
      this.activeCell = null;
      clearTimeout(this.timeoutId);

      this.resultTimeoutId = setTimeout(() => {
        this.showGameOverGrid = false;
      }, 2000);
    },

    checkGameOverByMisses() {
      const diff = this.misses - this.hits;
      if (diff >= this.maxMissDifference) {
        this.gameOverByMisses = true;
        this.endGameWithDelay();
        return true;
      }
      return false;
    },

    handleClick(index) {
      if (this.gameOver || this.activeCell === null) return;

      if (this.activeCell === index) {
        this.hits++;
        this.hitCell = index;
        this.missCell = null;
        this.activeCell = null;
        clearTimeout(this.timeoutId);

        setTimeout(() => {
          this.hitCell = null;
        }, 300);

        if (this.checkGameOverByMisses()) {
          return;
        }

        if (this.hits >= this.target) {
          this.gameOverByMisses = false;
          this.endGameWithDelay();
          return;
        }

        setTimeout(() => {
          this.spawnEmoji();
        }, 250);
      } else {
        this.missCell = index;
        this.misses++;
        setTimeout(() => {
          this.missCell = null;
        }, 300);

        this.checkGameOverByMisses();
      }
    },

    miss() {
      if (this.gameOver) return;
      this.misses++;
      this.activeCell = null;

      if (this.checkGameOverByMisses()) {
        return;
      }

      setTimeout(() => {
        if (!this.gameOver) {
          this.spawnEmoji();
        }
      }, 300);
    },

    resetGame() {
      this.hits = 0;
      this.misses = 0;
      this.gameOver = false;
      this.gameOverByMisses = false;
      this.showGameOverGrid = false;
      this.activeCell = null;
      this.missCell = null;
      this.hitCell = null;
      clearTimeout(this.timeoutId);
      clearTimeout(this.resultTimeoutId);

      setTimeout(() => {
        this.spawnEmoji();
      }, 400);
    },
  },
};
</script>

<style scoped>
.bgWrapper {
  background: #000000;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.whack-wrapper {
  overflow: hidden;
  border-radius: 24px;
  margin: 0 auto;
  max-width: 600px;
}

.whack-container {
  position: relative;
  padding: 30px 24px 32px;
  background: radial-gradient(ellipse at center, #0a0a0f 0%, #000000 100%);
  border-radius: 24px;
  border: 1px solid rgba(0, 255, 255, 0.06);
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.8), inset 0 0 100px rgba(0, 255, 255, 0.02);
  overflow: hidden;
  min-height: 500px;
}

.bg-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(0, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
}

.scan-line {
  position: absolute;
  top: -2%;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent);
  animation: scanMove 15s ease-in-out infinite;
  opacity: 0.5;
}

@keyframes scanMove {
  0% { top: -2%; }
  50% { top: 98%; }
  100% { top: -2%; }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
  gap: 12px;
}

.title {
  font-size: 20px;
  font-weight: 300;
  color: rgba(0, 255, 255, 0.6);
  letter-spacing: 4px;
  text-transform: uppercase;
  font-family: 'Courier New', monospace;
  margin: 0;
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.1);
}

.stats {
  display: flex;
  gap: 20px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 8px;
  font-weight: 600;
  color: rgba(0, 255, 255, 0.2);
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: 'Courier New', monospace;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #00ffff;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
  line-height: 1.2;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  position: relative;
  z-index: 1;
  max-width: 400px;
  margin: 0 auto;
}

.cell {
  aspect-ratio: 1 / 1;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(0, 255, 255, 0.04);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  cursor: none;
  user-select: none;
  position: relative;
}

.cell:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(0, 255, 255, 0.08);
}

.cell.miss {
  background: rgba(255, 0, 0, 0.08);
  border-color: rgba(255, 0, 0, 0.15);
  animation: missFlash 0.3s ease;
}

@keyframes missFlash {
  0%, 100% { background: rgba(255, 0, 0, 0.08); }
  50% { background: rgba(255, 0, 0, 0.2); }
}

.cell.hit {
  background: rgba(0, 255, 0, 0.08);
  border-color: rgba(0, 255, 0, 0.15);
  animation: hitFlash 0.3s ease;
}

@keyframes hitFlash {
  0%, 100% { background: rgba(0, 255, 0, 0.08); }
  50% { background: rgba(0, 255, 0, 0.2); }
}

.emoji-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: none;
  user-select: none;
  animation: popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes popIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.emoji {
  font-size: 48px;
  user-select: none;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.15));
  transition: transform 0.1s ease;
  line-height: 1;
}

.emoji-wrapper:hover .emoji {
  transform: scale(1.1);
}

.emoji-label {
  font-size: 18px;
  font-weight: 600;
  color: rgb(0, 255, 255);
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: 'Courier New', monospace;
  margin-top: 4px;
  user-select: none;
  z-index: 2;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.05);
  transition: color 0.3s ease;
}

.emoji-wrapper:hover .emoji-label {
  color: rgba(0, 255, 255, 0.6);
}

.glow-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 255, 255, 0.15) 0%, transparent 70%);
  animation: pulseGlow 1.5s ease-in-out infinite;
  z-index: 1;
}

@keyframes pulseGlow {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0;
  }
}

.gameover-letter {
  font-size: 32px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 40px rgba(0, 0, 0, 0.4);
  animation: gameoverPulse 0.8s ease-in-out infinite alternate;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skull-emoji {
  font-size: 44px;
  filter: drop-shadow(0 0 30px rgba(255, 0, 64, 0.3));
}

@keyframes gameoverPulse {
  0% {
    opacity: 0.6;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1.05);
  }
}

.result-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  animation: fadeIn 0.5s ease;
  border-radius: 24px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(8px);
  }
}

.result-card {
  text-align: center;
  padding: 40px 32px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(0, 255, 255, 0.1);
  border-radius: 24px;
  max-width: 360px;
  width: 90%;
  animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
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

.result-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.result-title {
  font-size: 22px;
  font-weight: 300;
  color: #00ffff;
  letter-spacing: 6px;
  text-transform: uppercase;
  font-family: 'Courier New', monospace;
  margin: 0 0 8px 0;
  text-shadow: 0 0 40px rgba(0, 255, 255, 0.15);
}

.result-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 20px 0;
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
}

.result-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 24px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Courier New', monospace;
}

.result-stats span {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.result-stats span::after {
  content: '';
  width: 20px;
  height: 1px;
  background: rgba(0, 255, 255, 0.1);
}

.result-btn {
  padding: 12px 32px;
  background: transparent;
  border: 1px solid rgba(0, 255, 255, 0.2);
  color: rgba(0, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 3px;
  text-transform: uppercase;
  font-family: 'Courier New', monospace;
  border-radius: 30px;
  cursor: none;
  user-select: none;
  transition: all 0.3s ease;
}

.result-btn:hover {
  background: rgba(0, 255, 255, 0.05);
  border-color: rgba(0, 255, 255, 0.4);
  color: #00ffff;
  box-shadow: 0 0 40px rgba(0, 255, 255, 0.05);
}

@media (max-width: 600px) {
  .whack-wrapper {
    border-radius: 16px;
  }

  .whack-container {
    padding: 20px 16px 24px;
    border-radius: 16px;
    min-height: 420px;
  }

  .title {
    font-size: 14px;
    letter-spacing: 2px;
  }

  .stat-value {
    font-size: 16px;
  }

  .grid {
    gap: 8px;
    max-width: 300px;
  }

  .cell {
    border-radius: 12px;
  }

  .emoji {
    font-size: 36px;
  }

  .emoji-label {
    font-size: 14px;
    letter-spacing: 1px;
  }

  .gameover-letter {
    font-size: 24px;
  }

  .skull-emoji {
    font-size: 32px;
  }

  .result-title {
    font-size: 18px;
    letter-spacing: 4px;
  }

  .result-card {
    padding: 28px 20px;
  }

  .result-stats {
    gap: 16px;
    font-size: 12px;
    flex-wrap: wrap;
  }

  .stats {
    gap: 12px;
  }

  .stat-label {
    font-size: 7px;
  }
}
</style>
