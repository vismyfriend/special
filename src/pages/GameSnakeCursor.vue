<template>
  <div class="snake-game-container">
    <button class="closeThisPage" @click="backToIntroPage">close game ❌</button>

    <div class="game-container">



      <div class="canvas-wrapper">
        <canvas ref="gameCanvas" width="280" height="280"></canvas>
      </div>

      <div class="controls">
        <div class="control-buttons">
          <button class="control-btn up" @click="handleDirection('up')">↑</button>
          <button class="control-btn left" @click="handleDirection('left')">←</button>
          <button class="control-btn right" @click="handleDirection('right')">→</button>
          <button class="control-btn down" @click="handleDirection('down')">↓</button>
        </div>
      </div>
      <h1>🐍 Snake Game</h1>
      <p class="subtitle">Винсент из мамин кодер)</p>
      <div class="game-info">
        <div class="score">Score: <span>{{ score }}</span></div>
        <div class="high-score">High Score: <span>{{ highScore }}</span></div>
      </div>

      <div class="instructions">
        <p><strong>Controls:</strong></p>
        <p>• Use arrow keys or WASD to move</p>
        <p>• Click the control buttons above</p>
        <p>• Eat the food to grow and increase your score!</p>
      </div>
    </div>

    <div class="game-over" v-if="!gameRunning">
      <h2>You are special!</h2>
      <p>Your score is : <span>{{ score }}</span></p>
      <button class="restart-btn" @click="restartGame">Click Start</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameSnakeCursor',
  data() {
    return {
      canvas: null,
      ctx: null,
      gridSize: 20,
      tileCount: 14, // если 400 на 400 размер то ставим 20 клеток
      snake: [{ x: 7, y: 7 }],
      food: {},
      dx: 1,
      dy: 0,
      score: 0,
      gameSpeed: 200, // Увеличили интервал (замедлили змейку)
      highScore: localStorage.getItem('snakeHighScore') || 0,
      gameRunning: true,
      gameLoopInterval: null
    };
  },
  mounted() {
    this.initGame();
  },
  beforeDestroy() {
    this.cleanup();
  },
  methods: {
    initGame() {
      this.canvas = this.$refs.gameCanvas;
      this.ctx = this.canvas.getContext('2d');
      this.generateFood();
      this.startGameLoop();
      window.addEventListener('keydown', this.handleKeyDown);
    },
    cleanup() {
      clearInterval(this.gameLoopInterval);
      window.removeEventListener('keydown', this.handleKeyDown);
    },
    generateFood() {
      // Генерируем координаты, исключая крайние клетки (1..18 вместо 0..19)
      this.food = {
        x: Math.floor(Math.random() * (this.tileCount - 2)) + 1,
        y: Math.floor(Math.random() * (this.tileCount - 2)) + 1
      };

      // Проверяем, чтобы еда не появилась на змейке
      for (let segment of this.snake) {
        if (segment.x === this.food.x && segment.y === this.food.y) {
          this.generateFood();
          return;
        }
      }
    },
    drawSnake() {
      // Тело змейки
      this.ctx.fillStyle = '#4CAF50';
      for (let segment of this.snake) {
        this.ctx.fillRect(
          segment.x * this.gridSize,
          segment.y * this.gridSize,
          this.gridSize - 2,
          this.gridSize - 2
        );
      }

      // Голова змейки с эмодзи детектива
      const head = this.snake[0];
      this.ctx.fillStyle = '#45a049';
      this.ctx.fillRect(
        head.x * this.gridSize,
        head.y * this.gridSize,
        this.gridSize - 2,
        this.gridSize - 2
      );

      // Рисуем эмодзи детектива на голове
      this.ctx.font = '20px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(
        '🕵️',
        head.x * this.gridSize + this.gridSize / 2,
        head.y * this.gridSize + this.gridSize / 2
      );
    },
    drawFood() {
      this.ctx.fillStyle = '#ff4757';
      this.ctx.beginPath();
      this.ctx.arc(
        this.food.x * this.gridSize + this.gridSize / 2,
        this.food.y * this.gridSize + this.gridSize / 2,
        this.gridSize / 2 - 1,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    },
    drawGrid() {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      this.ctx.lineWidth = 1;

      for (let i = 0; i <= this.tileCount; i++) {
        // Вертикальные линии
        this.ctx.beginPath();
        this.ctx.moveTo(i * this.gridSize, 0);
        this.ctx.lineTo(i * this.gridSize, this.canvas.height);
        this.ctx.stroke();

        // Горизонтальные линии
        this.ctx.beginPath();
        this.ctx.moveTo(0, i * this.gridSize);
        this.ctx.lineTo(this.canvas.width, i * this.gridSize);
        this.ctx.stroke();
      }
    },
    moveSnake() {
      const head = {
        x: this.snake[0].x + this.dx,
        y: this.snake[0].y + this.dy
      };

      // Проверка столкновения со стеной
      if (head.x < 0 || head.x >= this.tileCount ||
        head.y < 0 || head.y >= this.tileCount) {
        this.gameOver();
        return;
      }

      // Проверка столкновения с собой
      for (let segment of this.snake) {
        if (head.x === segment.x && head.y === segment.y) {
          this.gameOver();
          return;
        }
      }

      // Добавляем новую голову
      this.snake.unshift(head);

      // Проверка, съела ли змейка еду
      if (head.x === this.food.x && head.y === this.food.y) {
        this.score += 10;
        this.generateFood();
      } else {
        // Удаляем хвост, если не съели еду
        this.snake.pop();
      }
    },
    gameOver() {
      this.gameRunning = false;

      // Обновляем рекорд, если текущий счет больше
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('snakeHighScore', this.highScore);
      }
    },
    restartGame() {
      // Сброс состояния игры
      this.snake = [{ x: 4, y: 4 }];
      this.dx = 1;
      this.dy = 0;
      this.score = 0;
      this.gameRunning = true;
      this.generateFood();

      // Очистка и перерисовка холста
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawGrid();
      this.drawFood();
      this.drawSnake();
    },
    handleDirection(direction) {
      if (!this.gameRunning) return;

      // Получаем текущее положение головы
      const head = this.snake[0];
      // Вычисляем следующее положение
      let nextX = head.x;
      let nextY = head.y;

      // Определяем следующее положение в зависимости от направления
      switch (direction) {
        case 'up':
          if (this.dy !== 1) {
            nextY = head.y - 1;
            // Проверяем, не будет ли следующее положение внутри змейки
            if (!this.isPositionInSnake(nextX, nextY)) {
              this.dx = 0;
              this.dy = -1;
            }
          }
          break;
        case 'down':
          if (this.dy !== -1) {
            nextY = head.y + 1;
            if (!this.isPositionInSnake(nextX, nextY)) {
              this.dx = 0;
              this.dy = 1;
            }
          }
          break;
        case 'left':
          if (this.dx !== 1) {
            nextX = head.x - 1;
            if (!this.isPositionInSnake(nextX, nextY)) {
              this.dx = -1;
              this.dy = 0;
            }
          }
          break;
        case 'right':
          if (this.dx !== -1) {
            nextX = head.x + 1;
            if (!this.isPositionInSnake(nextX, nextY)) {
              this.dx = 1;
              this.dy = 0;
            }
          }
          break;
      }
    },

// Новый метод для проверки, находится ли позиция внутри змейки
    isPositionInSnake(x, y) {
      // Игнорируем хвост, так как он скоро исчезнет при движении
      for (let i = 0; i < this.snake.length - 1; i++) {
        if (this.snake[i].x === x && this.snake[i].y === y) {
          return true;
        }
      }
      return false;
    },
    handleKeyDown(e) {
      if (!this.gameRunning) return;

      // Обработка клавиш клавиатуры
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'Ц':
        case 'ц':
          e.preventDefault();
          this.handleDirection('up');
          break;
        case 'ArrowDown':
        case 's':
        case 's':
        case 'ы':
        case 'Ы':
          e.preventDefault();
          this.handleDirection('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
        case 'ф':
        case 'Ф':
          e.preventDefault();
          this.handleDirection('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
        case 'В':
        case 'в':
          e.preventDefault();
          this.handleDirection('right');
          break;
      }
    },
    startGameLoop() {
      // Запускаем игровой цикл с интервалом 150 мс
      this.gameLoopInterval = setInterval(() => {
        if (this.gameRunning) {
          this.moveSnake();
        }

        // Очистка и перерисовка
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawFood();
        this.drawSnake();
      }, this.gameSpeed); // Используем новое значение скорости
    },
    backToIntroPage() {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.snake-game-container {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 20px;
}

.closeThisPage {
  display: block;
  margin: 10px auto;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.closeThisPage:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.game-container {
  position: relative;

  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 100%;
  max-width: 500px;
}

.game-container::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(135deg,
  rgba(102, 126, 234, 0.3) 0%,
  rgba(118, 75, 162, 0.3) 100%);
}

.game-container::after {
  content: '';
  position: absolute;
  top: -15px;
  left: -15px;
  right: -15px;
  bottom: -15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 35px;
  z-index: -2;
  pointer-events: none;
}
h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.1rem;
  margin-bottom: 20px;
  opacity: 0.9;
}

.game-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: bold;
}

.score, .high-score {
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 10px;
  backdrop-filter: blur(5px);
}


.canvas-wrapper {
  position: relative;
  display: inline-block;
  border: 2px solid #ffffff;
  border-radius: 12px;
  margin: 10px 0;
}

#gameCanvas {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  display: block; /* Важно для корректного отображения */
}

/* Для мобильных */
@media (max-width: 600px) {
  .canvas-wrapper {
    padding: 3px;
  }
  #gameCanvas {
    width: 300px;
    height: 300px;
  }
}
.controls {
  margin-top: 20px;
}

.control-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  max-width: 300px;
  margin: 0 auto;
}

.control-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 15px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.control-btn:active {
  transform: translateY(0);
}

.control-btn.up {
  grid-column: 2;
}

.control-btn.left {
  grid-column: 1;
  grid-row: 2;
}

.control-btn.right {
  grid-column: 3;
  grid-row: 2;
}

.control-btn.down {
  grid-column: 2;
  grid-row: 3;
}

.instructions {
  margin-top: 20px;
  font-size: 0.9rem;
  opacity: 0.8;
  line-height: 1.4;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.game-over {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  z-index: 100;
  width: 80%;
  max-width: 400px;
}

.restart-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 15px;
  transition: background 0.3s ease;
  width: 100%;
}

.restart-btn:hover {
  background: #45a049;
}

@media (max-width: 600px) {
  .game-container {
    padding: 20px;
    margin: 10px;
  }

  h1 {
    font-size: 2rem;
  }

  #gameCanvas {
    width: 300px;
    height: 300px;
  }

  .control-buttons {
    max-width: 250px;
  }
}
</style>
