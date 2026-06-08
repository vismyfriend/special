<template>
  <!-- Тот же template, оставляем без изменений -->
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

    <!-- Модальное окно для всех слов -->
    <div class="modal-overlay" v-if="showAllWordsModal">
      <div class="modal-content">
        <h2>Вы съели все слова! 🎉</h2>
        <p>Хотите продолжить игру?</p>
        <div class="modal-buttons">
          <button class="modal-btn continue" @click="continueGame">Продолжить</button>
          <button class="modal-btn restart" @click="restartGame">Начать заново</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import shortWordsData from '../dataForGames/short-words-data';

export default {
  name: 'GameSnakeCursor',
  data() {
    return {
      canvas: null,
      ctx: null,
      gridSize: 20,
      tileCount: 14,
      snake: [{ x: 7, y: 7 }],
      food: {},
      dx: 1,
      dy: 0,
      score: 0,
      gameSpeed: 400,
      highScore: localStorage.getItem('snakeHighScore') || 0,
      gameRunning: true,
      gameLoopInterval: null,

      // Динамическая загрузка данных
      testQuicklyData: [],

      currentWordIndex: 0,
      wordPositions: [],
      showAllWordsModal: false,
      gamePaused: false,
      lastDirection: { dx: 1, dy: 0 },

      // ВОССТАНАВЛИВАЕМ СПЕЦЭФФЕКТЫ ИЗ ПЕРВОГО КОМПОНЕНТА
      specialEffects: {
        // Цвета для сегментов змейки (начиная с 5-го сегмента)
        snakeColors: [
          '#8A2BE2', // фиолетовый (5)
          '#1E90FF', // синий (6)
          '#00FF00', // зеленый (7)
          '#FFFF00', // желтый (8)
          '#FFA500', // оранжевый (9)
          '#FF0000', // красный (10)
          '#FF69B4', // розовый (11)
          '#00FFFF', // бирюзовый (12)
          '#800080', // пурпурный (13)
          '#000000', // черный (14)
          '#FFD700', // золотой (15)
          '#C0C0C0', // серебряный (16)
          '#FF1493', // глубокий розовый (17)
          '#00CED1', // темный бирюзовый (18)
          '#32CD32', // лаймовый (19)
          '#000000'  // черный (20)
        ],
        // Спецэффекты по количеству съеденных объектов - ТОЧНО КАК В ПЕРВОМ КОМПОНЕНТЕ
        effects: {
          5: {
            type: 'invert',
            duration: 2,
            description: 'Поле черное, змейка белая'
          },
          10: {
            type: 'invertReverse',
            duration: 3,
            description: 'Поле белое, змейка черная'
          },
          17: {
            type: 'strobe',
            duration: 3,
            description: 'Стробоскоп на 2 объекта'
          },
          20: {
            type: 'pinkBlue',
            duration: 5,
            description: 'Розовое поле, синяя змейка'
          },
          30: {
            type: 'invertReverse',
            duration: 0, // постоянно
            description: 'Поле белое, змейка черная'
          },
        }
      },
      currentEffect: null,
      effectCounter: 0,
      strobeState: false
    };
  },



  mounted() {
    this.loadGameData();
    this.initGame();
  },
  beforeDestroy() {
    this.cleanup();
  },
  methods: {
    // Метод для загрузки данных игры

    getWordSet(name) {
      if (shortWordsData[name]) return shortWordsData[name];
      for (const level in shortWordsData) {
        if (shortWordsData[level] && shortWordsData[level][name]) {
          return shortWordsData[level][name];
        }
      }
      return [];
    },

    loadGameData() {
      try {
        const missionName = this.$route?.params?.missionName;
        console.log('Current mission name:', missionName);

        // Используем новую функцию getWordSet
        const words = this.getWordSet(missionName);

        if (words.length > 0) {
          this.testQuicklyData = words;
          console.log(`Загружена миссия: ${missionName}, слов: ${this.testQuicklyData.length}`);

          if (this.testQuicklyData.length > 0) {
            console.log('Первое слово:', this.testQuicklyData[0]);
          }
        } else {
          // Если миссия не найдена, используем демо-данные
          console.warn('Миссия не найдена, используем демо-данные');
          this.testQuicklyData = [
            { id: 1, eng: "English", ru: "Английский", hint: "/Инглиш/" },
            { id: 2, eng: "London", ru: "Лондон", hint: "/лАндан/" },
            { id: 3, eng: "Capital", ru: "Столица", hint: "/кЭпитал/" },
            { id: 4, eng: "Special", ru: "Особенный", hint: "/спЭшл/" },
          ];
        }

        if (this.testQuicklyData.length === 0) {
          console.error('Нет данных для игры');
          this.testQuicklyData = [
            { id: 1, eng: "Hello", ru: "Привет", hint: "/хэлОу/" },
            { id: 2, eng: "World", ru: "Мир", hint: "/уорлд/" }
          ];
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        this.testQuicklyData = [
          { id: 1, eng: "Error", ru: "Ошибка", hint: "/эрор/" },
          { id: 2, eng: "Loading", ru: "Загрузка", hint: "/лОудинг/" }
        ];
      }
    },

    initGame() {
      this.canvas = this.$refs.gameCanvas;
      this.ctx = this.canvas.getContext('2d');

      // УБИРАЕМ повторную загрузку данных - уже загружено в loadGameData()
      this.generateFood();
      this.startGameLoop();
      window.addEventListener('keydown', this.handleKeyDown);
    },

    cleanup() {
      clearInterval(this.gameLoopInterval);
      window.removeEventListener('keydown', this.handleKeyDown);
    },

    generateFood() {
      // Генерируем координаты, исключая крайние клетки (1..12 вместо 0..13)
      this.food = {
        x: Math.floor(Math.random() * (this.tileCount - 4)) + 2,
        y: Math.floor(Math.random() * (this.tileCount - 4)) + 2
      };

      // Проверяем, чтобы еда не появилась на змейке или на буквах слов
      let validPosition = false;
      while (!validPosition) {
        validPosition = true;

        // Проверка на змейку
        for (let segment of this.snake) {
          if (segment.x === this.food.x && segment.y === this.food.y) {
            validPosition = false;
            break;
          }
        }

        // Проверка на буквы слов
        if (validPosition) {
          for (let wordPos of this.wordPositions) {
            if (wordPos.x === this.food.x && wordPos.y === this.food.y && wordPos.letter !== ' ') {
              validPosition = false;
              break;
            }
          }
        }

        if (!validPosition) {
          this.food = {
            x: Math.floor(Math.random() * (this.tileCount - 4)) + 2,
            y: Math.floor(Math.random() * (this.tileCount - 4)) + 2
          };
        }
      }
    },

    // Метод для размещения слова на поле - ОСТАВЛЯЕМ БЕЗ ИЗМЕНЕНИЙ
    placeWord(wordData) {
      this.wordPositions = [];
      const engStartX = 2; // английское слово с 3-й клетки
      const hintStartX = 1; // ПРОИЗНОШЕНИЕ Со 2-Й КЛЕТКИ!
      const engY = 2; // третья сверху
      const hintY = 3; // четвертая сверху
      const ruY = this.tileCount - 4; // четвертая снизу

      // Английское слово на третьей строке сверху (со 2-й клетки)
      for (let i = 0; i < wordData.eng.length; i++) {
        this.wordPositions.push({
          x: engStartX + i,
          y: engY,
          letter: wordData.eng[i],
          type: 'eng'
        });
      }

      // Произношение на четвертой строке сверху (с 1-й клетки!)
      if (wordData.hint) {
        for (let i = 0; i < wordData.hint.length; i++) {
          this.wordPositions.push({
            x: hintStartX + i, // начинается с 0 вместо 1
            y: hintY,
            letter: wordData.hint[i],
            type: 'hint'
          });
        }
      }

      // Русский перевод на четвертой строке снизу (со 2-й клетки)
      for (let i = 0; i < wordData.ru.length; i++) {
        this.wordPositions.push({
          x: engStartX + i,
          y: ruY,
          letter: wordData.ru[i],
          type: 'ru'
        });
      }
    },

    // Метод для отрисовки слов - УЛУЧШАЕМ ОТОБРАЖЕНИЕ РУССКОГО ТЕКСТА
    drawWords() {
      if (this.wordPositions.length === 0) return;

      // УСТАНАВЛИВАЕМ ШРИФТ, КОТОРЫЙ ПОДДЕРЖИВАЕТ РУССКИЕ СИМВОЛЫ
      this.ctx.font = '14px "Arial", "Helvetica", sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      for (let pos of this.wordPositions) {
        if (pos.letter !== ' ') {
          // Фон для буквы в зависимости от типа
          if (pos.type === 'ru') {
            // Бледно-серый фон для перевода
            this.ctx.fillStyle = 'rgba(200,200,200,0)';
          } else {
            // Белый фон для английского слова и произношения
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          }

          this.ctx.fillRect(
            pos.x * this.gridSize,
            pos.y * this.gridSize,
            this.gridSize - 2,
            this.gridSize - 2
          );

          // Текст буквы в зависимости от типа
          if (pos.type === 'ru') {
            this.ctx.fillStyle = '#666'; // Бледно-серый текст для перевода
          } else {
            this.ctx.fillStyle = '#333'; // Темный текст для английского и произношения
          }

          // ОТРИСОВКА СИМВОЛА - используем тот же подход что в рабочем компоненте
          this.ctx.fillText(
            pos.type === 'eng' ? pos.letter.toUpperCase() : pos.letter,
            pos.x * this.gridSize + this.gridSize / 2,
            pos.y * this.gridSize + this.gridSize / 2
          );
        }
      }
    },

    // ВОССТАНАВЛИВАЕМ ВСЕ МЕТОДЫ ИЗ ПЕРВОГО РАБОЧЕГО КОМПОНЕНТА:

    // Метод для получения цвета сегмента змейки
    getSnakeColor(segmentIndex) {
      // Голова всегда зеленая
      if (segmentIndex === 0) return '#45a049';

      // Тело до 4-го сегмента - обычный зеленый
      if (segmentIndex < 4) return '#4CAF50';

      // Начиная с 5-го сегмента - цвета из массива
      const colorIndex = segmentIndex - 4;
      if (colorIndex < this.specialEffects.snakeColors.length) {
        return this.specialEffects.snakeColors[colorIndex];
      }

      // Если цветов не хватило - чередуем последние 2 цвета
      const colors = this.specialEffects.snakeColors;
      return colors[colors.length - 2 + (colorIndex % 2)];
    },

    // Метод проверки и активации спецэффектов
    checkSpecialEffects() {
      const foodsEaten = this.score / 10;

      // Сбрасываем эффект если его duration закончился
      if (this.currentEffect && this.currentEffect.duration > 0) {
        this.effectCounter++;
        if (this.effectCounter >= this.currentEffect.duration) {
          this.currentEffect = null;
          this.effectCounter = 0;
          this.strobeState = false;
        }
      }

      // Проверяем, нужно ли активировать новый эффект
      const effectConfig = this.specialEffects.effects[foodsEaten];
      if (effectConfig && !this.currentEffect) {
        this.currentEffect = { ...effectConfig };
        this.effectCounter = 0;
        this.strobeState = false;
      }
    },

    // Модифицированный drawSnake с учетом цветов и эффектов
    drawSnake() {
      const head = this.snake[0];

      // Рисуем тело змейки
      for (let i = 0; i < this.snake.length; i++) {
        let segmentColor = this.getSnakeColor(i);

        // Применяем эффекты к цвету
        if (this.currentEffect) {
          segmentColor = this.applyEffectToColor(segmentColor, i === 0);
        }

        this.ctx.fillStyle = segmentColor;
        this.ctx.fillRect(
          this.snake[i].x * this.gridSize,
          this.snake[i].y * this.gridSize,
          this.gridSize - 2,
          this.gridSize - 2
        );
      }

      // Рисуем эмодзи детектива на голове (если нет инверсных эффектов)
      if (!this.currentEffect || !this.currentEffect.type.includes('invert')) {
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
          '🕵️',
          head.x * this.gridSize + this.gridSize / 2,
          head.y * this.gridSize + this.gridSize / 2
        );
      }
    },

    // Применение эффектов к цвету
    applyEffectToColor(originalColor, isHead) {
      if (!this.currentEffect) return originalColor;

      switch (this.currentEffect.type) {
        case 'invert':
          return isHead ? '#FFFFFF' : '#FFFFFF'; // белая змейка

        case 'invertReverse':
          return isHead ? '#000000' : '#000000'; // черная змейка

        case 'strobe':
          this.strobeState = !this.strobeState;
          return this.strobeState ? '#000000' : '#FFFFFF';

        case 'pinkBlue':
          return isHead ? '#1E90FF' : '#1E90FF'; // синяя змейка

        default:
          return originalColor;
      }
    },

    // Модифицированный drawGrid с учетом эффектов
    drawGrid() {
      let strokeStyle = 'rgba(255, 255, 255, 0.1)';
      let fillStyle = 'rgba(0,0,0,0)';

      // Применяем эффекты к фону
      if (this.currentEffect) {
        switch (this.currentEffect.type) {
          case 'invert':
            fillStyle = '#000000'; // черное поле
            strokeStyle = 'rgba(255, 255, 255, 0.3)';
            break;

          case 'invertReverse':
            fillStyle = '#FFFFFF'; // белое поле
            strokeStyle = 'rgba(0, 0, 0, 0.3)';
            break;

          case 'strobe':
            fillStyle = this.strobeState ? '#000000' : '#FFFFFF';
            strokeStyle = this.strobeState ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
            break;

          case 'pinkBlue':
            fillStyle = '#FF69B4'; // розовое поле
            strokeStyle = 'rgba(255, 255, 255, 0.3)';
            break;
        }
      }

      // Заливаем фон
      this.ctx.fillStyle = fillStyle;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Рисуем сетку
      this.ctx.strokeStyle = strokeStyle;
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

    // Модифицированный drawFood с учетом эффектов
    drawFood() {
      let foodColor = '#ff4757';

      // Применяем эффекты к еде
      if (this.currentEffect) {
        switch (this.currentEffect.type) {
          case 'invert':
            foodColor = '#FFFFFF'; // белая еда на черном поле
            break;
          case 'invertReverse':
            foodColor = '#000000'; // черная еда на белом поле
            break;
          case 'strobe':
            foodColor = this.strobeState ? '#FFFFFF' : '#000000';
            break;
          case 'pinkBlue':
            foodColor = '#1E90FF'; // синяя еда на розовом поле
            break;
        }
      }

      this.ctx.fillStyle = foodColor;
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

    moveSnake() {
      if (this.gamePaused) return;

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

        this.checkSpecialEffects();

        // Прогрессивная скорость в зависимости от количества съеденной еды
        const foodsEaten = this.score / 10; // каждая еда = +10 очков

        if (foodsEaten === 1) {
          this.gameSpeed = 300; // после первой еды
        } else if (foodsEaten === 2) {
          this.gameSpeed = 250; // после второй еды
        } else if (foodsEaten === 3) {
          this.gameSpeed = 200; // после третьей еды и дальше
        }

        // Перезапускаем игровой цикл с новой скоростью
        if (foodsEaten <= 3) {
          clearInterval(this.gameLoopInterval);
          this.startGameLoop();
        }

        // После первой съеденной еды начинаем показывать слова
        if (this.currentWordIndex === 0 && this.score === 10) {
          this.placeWord(this.testQuicklyData[this.currentWordIndex]);
        } else if (this.currentWordIndex > 0) {
          // Для последующих слов
          this.placeWord(this.testQuicklyData[this.currentWordIndex]);
        }

        this.currentWordIndex++;

        // Проверяем, не закончились ли слова
        if (this.currentWordIndex >= this.testQuicklyData.length) {
          this.showAllWordsModal = true;
          this.gamePaused = true;
          this.lastDirection = { dx: this.dx, dy: this.dy };
          this.dx = 0;
          this.dy = 0;
        }

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
      this.snake = [{ x: 7, y: 7 }];
      this.dx = 1;
      this.dy = 0;
      this.score = 0;
      this.gameRunning = true;
      this.gamePaused = false;
      this.showAllWordsModal = false;
      this.currentWordIndex = 0;
      this.wordPositions = [];

      // Сброс эффектов и скорости
      this.currentEffect = null;
      this.effectCounter = 0;
      this.strobeState = false;
      this.gameSpeed = 400;

      this.generateFood();

      // Очистка и перерисовка холста
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawGrid();
      this.drawFood();
      this.drawSnake();
      this.drawWords();
    },

    continueGame() {
      this.showAllWordsModal = false;
      this.gamePaused = false;
      this.currentWordIndex = 0; // Начинаем слова заново
      this.placeWord(this.testQuicklyData[this.currentWordIndex]);
      this.currentWordIndex++;

      // Восстанавливаем направление движения
      this.dx = this.lastDirection.dx;
      this.dy = this.lastDirection.dy;
    },

    handleDirection(direction) {
      if (!this.gameRunning || this.gamePaused) return;

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
      if (!this.gameRunning || this.gamePaused) return;

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
      // Запускаем игровой цикл
      this.gameLoopInterval = setInterval(() => {
        if (this.gameRunning) {
          this.moveSnake();
        }

        // Очистка и перерисовка - змейка и еда поверх слов
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawWords(); // Сначала слова (фоном)
        this.drawFood();  // Потом еда
        this.drawSnake(); // И змейка поверх всего
      }, this.gameSpeed);
    },

    backToIntroPage() {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
/* Стили остаются такими же как в предыдущем коде */
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
  display: block;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.modal-content h2 {
  margin-bottom: 15px;
  font-size: 1.8rem;
}

.modal-content p {
  margin-bottom: 25px;
  font-size: 1.1rem;
  opacity: 0.9;
}

.modal-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.modal-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
}

.modal-btn.continue {
  background: #4CAF50;
  color: white;
}

.modal-btn.continue:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.modal-btn.restart {
  background: #ff4757;
  color: white;
}

.modal-btn.restart:hover {
  background: #ff3742;
  transform: translateY(-2px);
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

  .modal-buttons {
    flex-direction: column;
  }

  .modal-btn {
    width: 100%;
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
