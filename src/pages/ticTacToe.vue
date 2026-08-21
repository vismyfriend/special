<template>
  <div class="captcha-overlay" v-if="showCaptcha">
    <div class="captcha-modal">
      <div class="captcha-header">
        <span class="captcha-icon">🕵️</span>
        <h2 class="captcha-title">Докажите что вы не роБОТ</h2>
        <p class="captcha-subtitle">Победите ВИИнсента в крестики-нолики</p>
      </div>

      <div class="game-board">
        <div
          v-for="(cell, index) in board"
          :key="index"
          class="cell"
          @click="makeMove(index)"
          :class="{
            'cell-o': cell === 'O',
            'cell-x': cell === 'X',
            'cell-win': winCells.includes(index),
            'cell-draw': isDraw && cell === ''
          }"
        >
          <span class="cell-symbol">{{ cell }}</span>
          <div v-if="cell === 'O'" class="o-mark">
            <span>◯</span>
          </div>
          <div v-if="cell === 'X'" class="x-mark">
            <span>✕</span>
          </div>
        </div>
      </div>

      <div class="captcha-status">
        <div v-if="winner === 'O'" class="status-win">
          <span class="status-icon">🎉</span>
          <span class="status-text">ВИИ повержен ! ДОСТУП РАЗРЕШЁН!</span>
        </div>
        <div v-else-if="winner === 'X'" class="status-lose">
          <span class="status-icon">😅</span>
          <span class="status-text">ВИИ победил... Попробуйте еще раз!</span>
        </div>
        <div v-else-if="isDraw" class="status-draw">
          <span class="status-icon">🤝</span>
          <span class="status-text">Недостаток IQ! Пробуй еще раз!</span>
        </div>
        <div v-else class="status-playing">
          <span class="status-text">Ваш ход (◯)</span>
          <span class="status-dots">⚡</span>
        </div>
      </div>

      <div class="captcha-actions">
        <button
          v-if="winner || isDraw"
          class="btn-retry"
          @click="resetGame"
        >
          🔄 Играть снова
        </button>
        <button
          v-if="winner === 'O'"
          class="btn-enter"
          @click="goToAllSets"
        >
          🚪 Войти на сайт
        </button>
      </div>

      <div class="captcha-footer">
        <span class="footer-text">🔐 Шифрование S.P.E.C.i.A.L. защита 90 lvl</span>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'TicTacToeCaptcha',
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      board: Array(9).fill(''),
      currentPlayer: 'O', // Теперь игрок играет ноликами
      winner: null,
      winCells: [],
      isDraw: false,
      isProcessing: false,
      gameOver: false
    };
  },
  computed: {
    showCaptcha() {
      return this.show;
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.resetGame();
      }
    }
  },
  methods: {
    makeMove(index) {
      // Если игра окончена или клетка занята или ходит не игрок - игнорируем
      if (this.gameOver || this.board[index] !== '' || this.currentPlayer !== 'O' || this.isProcessing) {
        return;
      }

      // Ход игрока (нолик)
      this.board[index] = 'O';
      this.currentPlayer = 'X';

      // Проверяем победу игрока
      if (this.checkWinner('O')) {
        this.winner = 'O';
        this.gameOver = true;
        return;
      }

      // Проверяем ничью
      if (this.checkDraw()) {
        this.isDraw = true;
        this.gameOver = true;
        return;
      }

      // Ход компьютера с задержкой
      this.isProcessing = true;
      setTimeout(() => {
        this.makeAIMove();
        this.isProcessing = false;
      }, 500 + Math.random() * 300);
    },

    makeAIMove() {
      // Находим свободные клетки
      const emptyCells = this.board
        .map((cell, index) => cell === '' ? index : null)
        .filter(index => index !== null);

      if (emptyCells.length === 0) {
        if (this.checkDraw()) {
          this.isDraw = true;
          this.gameOver = true;
        }
        return;
      }

      // Стратегия ИИ - почти всегда проигрывает
      let moveIndex;

      // 10% шанс, что ИИ сделает умный ход (для интереса)
      if (Math.random() < 0.1) {
        // Умный ход - пытается выиграть или заблокировать
        moveIndex = this.getSmartMove(emptyCells);
      } else {
        moveIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      }

      // Ставим ход ИИ (крестик)
      this.board[moveIndex] = 'X';
      this.currentPlayer = 'O';

      // Проверяем победу ИИ (редко, но бывает)
      if (this.checkWinner('X')) {
        this.winner = 'X';
        this.gameOver = true;
        return;
      }

      // Проверяем ничью
      if (this.checkDraw()) {
        this.isDraw = true;
        this.gameOver = true;
        return;
      }
    },

    getSmartMove(emptyCells) {
      // Проверяем, может ли ИИ выиграть
      for (const index of emptyCells) {
        this.board[index] = 'X';
        if (this.checkWinner('X')) {
          this.board[index] = '';
          return index;
        }
        this.board[index] = '';
      }

      // Блокируем победу игрока
      for (const index of emptyCells) {
        this.board[index] = 'O';
        if (this.checkWinner('O')) {
          this.board[index] = '';
          return index;
        }
        this.board[index] = '';
      }

      // Если центр свободен - берем центр (но это редко)
      if (emptyCells.includes(4) && Math.random() < 0.2) {
        return 4;
      }

      // Иначе рандомный ход
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    },

    checkWinner(player) {
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];

      for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (this.board[a] === player && this.board[b] === player && this.board[c] === player) {
          this.winCells = pattern;
          return true;
        }
      }
      return false;
    },

    checkDraw() {
      return this.board.every(cell => cell !== '');
    },

    resetGame() {
      this.board = Array(9).fill('');
      this.currentPlayer = 'O';
      this.winner = null;
      this.winCells = [];
      this.isDraw = false;
      this.gameOver = false;
      this.isProcessing = false;
    },

    enterSite() {
      this.$emit('captcha-success');
    },

    goToAllSets() {
      this.$router.push("/see-all-sets-of-words/");
    },
  },
  mounted() {
    this.resetGame();
  }
};
</script>

<style scoped>
.captcha-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  animation: overlayFade 0.4s ease;
}

@keyframes overlayFade {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(12px);
  }
}

.captcha-modal {
  background: linear-gradient(145deg, #0a0a1a, #1a1a2e);
  border: 1px solid rgba(0, 255, 255, 0.15);
  border-radius: 24px;
  padding: 32px 28px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8), 0 0 60px rgba(0, 255, 255, 0.03);
  animation: modalSlide 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalSlide {
  from {
    transform: translateY(30px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.captcha-header {
  text-align: center;
  margin-bottom: 24px;
}

.captcha-icon {
  font-size: 36px;
  display: block;
  margin-bottom: 8px;
}

.captcha-title {
  font-size: 18px;
  font-weight: 600;
  color: #00ffff;
  letter-spacing: 3px;
  text-transform: uppercase;
  font-family: 'Courier New', monospace;
  margin: 0 0 6px 0;
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.1);
}

.captcha-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  font-family: 'Courier New', monospace;
  margin: 0;
  letter-spacing: 0.5px;
}

.game-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-width: 320px;
  margin: 0 auto 20px;
}

.cell {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  min-height: 70px;
}

.cell:hover:not(.cell-o):not(.cell-x) {
  background: rgba(0, 255, 255, 0.05);
  border-color: rgba(0, 255, 255, 0.15);
}

/* Нолик - цвет игрока (розовый/красный) */
.cell-o {
  background: rgba(255, 0, 100, 0.05);
  border-color: rgba(255, 0, 100, 0.15);
}

/* Крестик - цвет ИИ (голубой/неоновый) */
.cell-x {
  background: rgba(0, 255, 255, 0.05);
  border-color: rgba(0, 255, 255, 0.15);
}

.cell-win {
  animation: winPulse 0.6s ease infinite alternate;
  border-color: #00ff88 !important;
  background: rgba(0, 255, 136, 0.1) !important;
  box-shadow: 0 0 30px rgba(0, 255, 136, 0.1);
}

@keyframes winPulse {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.03);
  }
}

.cell-draw {
  animation: drawPulse 0.8s ease;
}

@keyframes drawPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.cell-symbol {
  font-size: 0;
  display: none;
}

/* Нолик - цвет игрока */
.o-mark {
  font-size: 42px;
  color: #ff0064;
  font-weight: 300;
  text-shadow: 0 0 30px rgba(255, 0, 100, 0.2);
  animation: oAppear 0.3s ease;
}

/* Крестик - цвет ИИ */
.x-mark {
  font-size: 42px;
  color: #00ffff;
  font-weight: 300;
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
  animation: xAppear 0.3s ease;
}

@keyframes oAppear {
  from {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  to {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes xAppear {
  from {
    transform: scale(0) rotate(45deg);
    opacity: 0;
  }
  to {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.captcha-status {
  text-align: center;
  margin-bottom: 20px;
  min-height: 36px;
}

.status-win {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #00ff88;
  animation: statusPop 0.5s ease;
}

.status-lose {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #ff6b6b;
  animation: statusPop 0.5s ease;
}

.status-draw {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #ffd93d;
  animation: statusPop 0.5s ease;
}

@keyframes statusPop {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.status-icon {
  font-size: 24px;
}

.status-text {
  font-size: 15px;
  font-weight: 500;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}

.status-playing {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  font-family: 'Courier New', monospace;
}

.status-dots {
  animation: dotsPulse 1s ease infinite;
}

@keyframes dotsPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

.captcha-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-retry {
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.btn-retry:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-enter {
  padding: 10px 32px;
  background: linear-gradient(135deg, #00ff88, #00cc66);
  border: none;
  border-radius: 30px;
  color: #000;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  box-shadow: 0 4px 20px rgba(0, 255, 136, 0.2);
}

.btn-enter:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 255, 136, 0.3);
}

.captcha-footer {
  margin-top: 20px;
  text-align: center;
}

.footer-text {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.15);
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
}

@media (max-width: 480px) {
  .captcha-modal {
    padding: 24px 16px;
  }

  .captcha-title {
    font-size: 15px;
    letter-spacing: 2px;
  }

  .captcha-subtitle {
    font-size: 12px;
  }

  .game-board {
    max-width: 260px;
    gap: 6px;
  }

  .cell {
    min-height: 60px;
  }

  .o-mark,
  .x-mark {
    font-size: 34px;
  }

  .status-text {
    font-size: 13px;
  }

  .btn-retry,
  .btn-enter {
    font-size: 12px;
    padding: 8px 20px;
  }
}
</style>
