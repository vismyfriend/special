<template>
  <div class="creative-thinking-wrapper">
    <div class="creative-thinking-container">
      <!-- ============================================ -->
      <!-- ЗАГОЛОВОК С ТАЙМЕРОМ -->
      <!-- ============================================ -->
      <div class="header-wrapper">
        <h2 class="title">💡 ALTERNATIVE USE FOR :</h2>
        <div class="timer-wrapper" v-if="isRunning">
          <!-- Песочные часы CSS (ретро форма) -->
          <!-- Песочные часы CSS (ретро форма) -->
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
          <span class="timer-text" v-if="!isPausedByUser">{{ Math.ceil(timeLeft) }}s</span>
          <span class="timer-text paused-text" v-else>⏸</span>
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

        <!-- 🔥 БЛОК С РАЗМЫТЫМ НАЗВАНИЕМ -->
        <div class="item-name-wrapper">
          <span
            class="item-name"
            :class="{ 'blurred': !showItemName }"
            @click="showItemName = !showItemName"
          >
            {{ showItemName ? currentItem.name : 'Click to reveal' }}
          </span>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- ПОЛЕ ДЛЯ ВВОДА ИДЕЙ -->
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
      // ============================================
      // 🔥 СОСТОЯНИЕ
      // ============================================
      isPaused: false,        // 🔥 Остановлен ли таймер
      isPausedByUser: false,  // 🔥 Остановлен ли пользователем (для сброса)
      showItemName: false,        // Показывать ли название предмета (blur)
      isRunning: false,           // Идёт ли игра
      timeLeft: 55,               // Оставшееся время (в секундах)
      totalTime: 55,              // Общее время (для анимации песочных часов)
      currentIdea: '',            // Текущая идея в поле ввода
      userIdeas: [],              // Идеи, придуманные пользователем
      showResults: false,         // Показывать ли результаты
      currentItem: null,          // Текущий предмет (картинка + название)
      hasStarted: false,          // Был ли первый ввод

      // ============================================
      // 🔥 ПРЕДМЕТЫ (те же картинки, что в Story Dice)
      // ============================================
      items: [
        { name: 'a rocket or a spaceship or a toy', image: new URL('../assets/images/storyDice/story_dice1.png', import.meta.url).href },
        { name: 'a bottle or a container', image: new URL('../assets/images/storyDice/story_dice2.png', import.meta.url).href },
        { name: 'a key or a lock opener', image: new URL('../assets/images/storyDice/story_dice3.png', import.meta.url).href },
        { name: 'a shoe or a boot', image: new URL('../assets/images/storyDice/story_dice4.png', import.meta.url).href },
        { name: 'a hat or a headwear', image: new URL('../assets/images/storyDice/story_dice5.png', import.meta.url).href },
        { name: 'a cup or a mug', image: new URL('../assets/images/storyDice/story_dice6.png', import.meta.url).href },
        { name: 'a book or a diary', image: new URL('../assets/images/storyDice/story_dice7.png', import.meta.url).href },
        { name: 'a chair or a seat', image: new URL('../assets/images/storyDice/story_dice8.png', import.meta.url).href },
        { name: 'a lamp or a light', image: new URL('../assets/images/storyDice/story_dice9.png', import.meta.url).href },
        { name: 'a clock or a watch', image: new URL('../assets/images/storyDice/story_dice10.png', import.meta.url).href },
        { name: 'an umbrella or a canopy', image: new URL('../assets/images/storyDice/story_dice11.png', import.meta.url).href },
        { name: 'scissors or a cutter', image: new URL('../assets/images/storyDice/story_dice12.png', import.meta.url).href },
        { name: 'a phone or a device', image: new URL('../assets/images/storyDice/story_dice13.png', import.meta.url).href },
        { name: 'a mirror or a reflector', image: new URL('../assets/images/storyDice/story_dice14.png', import.meta.url).href },
        { name: 'a box or a container', image: new URL('../assets/images/storyDice/story_dice15.png', import.meta.url).href },
        { name: 'a rope or a cord', image: new URL('../assets/images/storyDice/story_dice16.png', import.meta.url).href },
        { name: 'a ball or a sphere', image: new URL('../assets/images/storyDice/story_dice17.png', import.meta.url).href },
        { name: 'glasses or eyewear', image: new URL('../assets/images/storyDice/story_dice18.png', import.meta.url).href },
        { name: 'a coin or a token', image: new URL('../assets/images/storyDice/story_dice19.png', import.meta.url).href },
        { name: 'a stick or a rod', image: new URL('../assets/images/storyDice/story_dice20.png', import.meta.url).href },
        { name: 'a stone or a rock', image: new URL('../assets/images/storyDice/story_dice21.png', import.meta.url).href },
        { name: 'a feather or a quill', image: new URL('../assets/images/storyDice/story_dice22.png', import.meta.url).href },
        { name: 'a leaf or a greenery', image: new URL('../assets/images/storyDice/story_dice23.png', import.meta.url).href },
        { name: 'a thread or a string', image: new URL('../assets/images/storyDice/story_dice24.png', import.meta.url).href },
        { name: 'a needle or a pin', image: new URL('../assets/images/storyDice/story_dice25.png', import.meta.url).href },
        { name: 'a button or a fastener', image: new URL('../assets/images/storyDice/story_dice26.png', import.meta.url).href },
        { name: 'a chain or a link', image: new URL('../assets/images/storyDice/story_dice27.png', import.meta.url).href },
        { name: 'a ring or a band', image: new URL('../assets/images/storyDice/story_dice28.png', import.meta.url).href },
        { name: 'a candle or a wax light', image: new URL('../assets/images/storyDice/story_dice29.png', import.meta.url).href },
        { name: 'a brush or a cleaner', image: new URL('../assets/images/storyDice/story_dice30.png', import.meta.url).href },
        { name: 'a comb or a hair tool', image: new URL('../assets/images/storyDice/story_dice31.png', import.meta.url).href },
        { name: 'a basket or a container', image: new URL('../assets/images/storyDice/story_dice32.png', import.meta.url).href },
        { name: 'a bowl or a dish', image: new URL('../assets/images/storyDice/story_dice33.png', import.meta.url).href },
        { name: 'a pot or a container', image: new URL('../assets/images/storyDice/story_dice34.png', import.meta.url).href },
        { name: 'a pan or a skillet', image: new URL('../assets/images/storyDice/story_dice35.png', import.meta.url).href },
        { name: 'a plate or a platter', image: new URL('../assets/images/storyDice/story_dice36.png', import.meta.url).href },
        { name: 'a fork or a utensil', image: new URL('../assets/images/storyDice/story_dice37.png', import.meta.url).href },
        { name: 'a spoon or a utensil', image: new URL('../assets/images/storyDice/story_dice38.png', import.meta.url).href },
        { name: 'a knife or a blade', image: new URL('../assets/images/storyDice/story_dice39.png', import.meta.url).href },
        { name: 'a board or a plank', image: new URL('../assets/images/storyDice/story_dice40.png', import.meta.url).href },
        { name: 'a shell or a seashell', image: new URL('../assets/images/storyDice/story_dice41.png', import.meta.url).href },
        { name: 'a star or a celestial body', image: new URL('../assets/images/storyDice/story_dice42.png', import.meta.url).href },
        { name: 'a moon or a satellite', image: new URL('../assets/images/storyDice/story_dice43.png', import.meta.url).href },
        { name: 'a cloud or a weather sign', image: new URL('../assets/images/storyDice/story_dice44.png', import.meta.url).href },
        { name: 'a rainbow or a colorful arc', image: new URL('../assets/images/storyDice/story_dice45.png', import.meta.url).href },
        { name: 'a flower or a blossom', image: new URL('../assets/images/storyDice/story_dice46.png', import.meta.url).href },
        { name: 'a tree or a plant', image: new URL('../assets/images/storyDice/story_dice47.png', import.meta.url).href },
        { name: 'a rock or a stone', image: new URL('../assets/images/storyDice/story_dice48.png', import.meta.url).href },
        { name: 'sand or grains', image: new URL('../assets/images/storyDice/story_dice49.png', import.meta.url).href },
        { name: 'water or a liquid', image: new URL('../assets/images/storyDice/story_dice50.png', import.meta.url).href },
        { name: 'fire or flame', image: new URL('../assets/images/storyDice/story_dice51.png', import.meta.url).href },
      ],

      // ============================================
      // 🔥 ВСЕ ГОТОВЫЕ ОТВЕТЫ (из них выбираются 4 случайных)
      // ============================================
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
        'Use it as a bookmark',
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
      presetIdeas: [],            // 4 случайных готовых ответа для текущей игры
      timerInterval: null,        // Интервал таймера
      storageKey: 'creative_thinking_ideas', // Ключ для localStorage

      waitingForIdea: false,      // Ожидание завершения последней идеи
      isTyping: false,            // Пользователь печатает
      finishCheckInterval: null,  // Интервал проверки завершения
    };
  },

  // ============================================
  // 🔥 ВЫЧИСЛЯЕМЫЕ СВОЙСТВА
  // ============================================
  computed: {
    // Все идеи (пользовательские + готовые)
    allIdeas() {
      return [...this.userIdeas, ...this.presetIdeas];
    },
    // Сортировка по алфавиту
    sortedIdeas() {
      return [...this.allIdeas].sort((a, b) => a.localeCompare(b));
    },
  },

  // ============================================
  // 🔥 ЖИЗНЕННЫЙ ЦИКЛ
  // ============================================
  mounted() {
    this.loadFromStorage(); // Загружаем сохранённые идеи
    this.pickRandomItem();  // Выбираем случайный предмет
  },

  beforeDestroy() {
    clearInterval(this.timerInterval);
    clearInterval(this.finishCheckInterval);
    this.saveToStorage();
  },

  methods: {
    // ============================================
    // 🔥 ВЫБОР СЛУЧАЙНОГО ПРЕДМЕТА
    // ============================================
    pickRandomItem() {
      const randomIndex = Math.floor(Math.random() * this.items.length);
      this.currentItem = this.items[randomIndex];
    },

    // ============================================
    // 🔥 СТАРТ ИГРЫ (вызывается при первом вводе)
    // ============================================
    startGame() {
      if (this.isRunning) return;

      // Выбираем 4 случайных готовых ответа
      this.presetIdeas = this.getRandomPresetIdeas(4);

      this.isRunning = true;
      this.showResults = false;
      this.userIdeas = [];
      this.waitingForIdea = false;
      this.isTyping = false;
      this.isPaused = false;        // 🔥 Сбрасываем паузу
      this.isPausedByUser = false;  // 🔥 Сбрасываем флаг
      this.timeLeft = this.totalTime;

      this.$nextTick(() => {
        const input = this.$refs.ideaInput;
        if (input) input.focus();
      });

      // Запускаем таймер
      this.timerInterval = setInterval(() => {
        this.timeLeft -= 0.1;
        if (this.timeLeft <= 0) {
          this.timeLeft = 0;
          this.finishGame();
        }
      }, 100);
    },

    // ============================================
    // 🔥 ПАУЗА / ПЕРЕЗАПУСК ТАЙМЕРА ПО КЛИКУ НА ЧАСЫ
    // ============================================
    toggleTimer() {
      // Если таймер уже остановлен пользователем — перезапускаем игру
      if (this.isPausedByUser) {
        this.tryAgain();
        return;
      }

      // Если игра не запущена — ничего не делаем
      if (!this.isRunning || this.showResults) return;

      // Ставим на паузу
      this.isPaused = true;
      this.isPausedByUser = true;
      clearInterval(this.timerInterval);

      // Меняем цвет песка на зелёный через CSS класс
      document.querySelector('.hourglass').classList.add('paused');
    },

    // ============================================
    // 🔥 ПОЛУЧЕНИЕ N СЛУЧАЙНЫХ ГОТОВЫХ ОТВЕТОВ
    // ============================================
    getRandomPresetIdeas(count) {
      const shuffled = [...this.allPresetIdeas];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, count);
    },

    // ============================================
    // 🔥 ОТСЛЕЖИВАНИЕ ВВОДА
    // ============================================
    onInput() {
      this.isTyping = this.currentIdea.trim().length > 0;

      // Запуск таймера при первом вводе
      if (!this.hasStarted && this.currentIdea.trim().length > 0) {
        this.hasStarted = true;
        this.startGame();
      }
    },

    // ============================================
    // 🔥 ПОТЕРЯ ФОКУСА — завершаем, если ждём идею
    // ============================================
    onBlur() {
      if (this.waitingForIdea && this.currentIdea.trim().length === 0) {
        this.completeGame();
      }
    },

    // ============================================
    // 🔥 ЗАВЕРШЕНИЕ ИГРЫ (проверка на последнюю идею)
    // ============================================
    finishGame() {
      // Если пользователь пишет идею (больше 3 символов)
      if (this.currentIdea.trim().length > 3) {
        this.waitingForIdea = true;
        // Проверяем каждые 500мс: если поле пустое или меньше 3 символов — завершаем
        this.finishCheckInterval = setInterval(() => {
          if (this.currentIdea.trim().length === 0 || this.currentIdea.trim().length < 3) {
            this.completeGame();
          }
        }, 500);
        return;
      }
      // Идея короткая — завершаем сразу
      this.completeGame();
    },

    // ============================================
    // 🔥 ДОБАВЛЕНИЕ ИДЕИ
    // ============================================
    addIdea() {
      const idea = this.currentIdea.trim();

      if (!idea) return;
      if (!this.isRunning && !this.waitingForIdea) return;
      if (this.showResults) return;

      this.userIdeas.push(idea);
      this.currentIdea = '';
      this.isTyping = false;

      // Если игра уже завершена, но мы ждали идею — завершаем
      if (this.waitingForIdea) {
        this.completeGame();
        return;
      }

      this.$nextTick(() => {
        const input = this.$refs.ideaInput;
        if (input) input.focus();
      });
    },

    // ============================================
    // 🔥 ЗАВЕРШЕНИЕ ИГРЫ (ФИНАЛЬНОЕ)
    // ============================================
    completeGame() {
      this.isRunning = false;
      this.showResults = true;
      this.waitingForIdea = false;
      this.isTyping = false;
      clearInterval(this.timerInterval);
      clearInterval(this.finishCheckInterval);

      // Сохраняем в localStorage
      this.saveToStorage();

      // Логи убраны, чтобы не спамить в консоль
    },

    // ============================================
    // 🔥 TRY AGAIN
    // ============================================
    tryAgain() {
      this.saveToStorage();

      this.isRunning = false;
      this.showResults = false;
      this.userIdeas = [];
      this.currentIdea = '';
      this.timeLeft = this.totalTime;
      this.hasStarted = false;
      this.showItemName = false;
      this.waitingForIdea = false;
      this.isTyping = false;
      this.isPaused = false;        // 🔥 Сбрасываем паузу
      this.isPausedByUser = false;  // 🔥 Сбрасываем флаг
      clearInterval(this.timerInterval);
      clearInterval(this.finishCheckInterval);

      this.pickRandomItem();
      this.presetIdeas = [];

      this.$nextTick(() => {
        const input = this.$refs.ideaInput;
        if (input) input.focus();
      });
    },

    // ============================================
    // 🔥 ПРОВЕРКА, ЧТО ИДЕЯ ПРИНАДЛЕЖИТ ПОЛЬЗОВАТЕЛЮ
    // ============================================
    isUserIdea(idea) {
      return this.userIdeas.includes(idea);
    },

    // ============================================
    // 🔥 LOCALSTORAGE
    // ============================================
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
      } catch (e) {
        // Нет сохранённых данных
      }
    },
  },
};
</script>

<style scoped>
/* ============================================ */
/* 🔥 ОБЩИЕ СТИЛИ */
/* ============================================ */
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

/* ============================================ */
/* 🔥 ЗАГОЛОВОК С ТАЙМЕРОМ */
/* ============================================ */
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
}

.timer-text {
  font-size: 22px;
  font-weight: 700;
  color: #2d3436;
  min-width: 45px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

/* ============================================ */
/* 🔥 ПЕСОЧНЫЕ ЧАСЫ — РЕТРО ФОРМА */
/* ============================================ */
.hourglass {
  position: relative;
  width: 40px;
  height: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
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

/* Талия песочных часов */
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

/* Песок в верхней части (падает) */
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
/* ============================================ */
/* 🔥 ПАУЗА — ЗЕЛЁНЫЙ ПЕСОК */
/* ============================================ */
.hourglass.paused .sand-falling {
  background: linear-gradient(180deg, #55efc4, #00b894) !important;
  animation-play-state: paused !important;
}

.hourglass.paused .sand-filled {
  background: linear-gradient(0deg, #55efc4, #00b894) !important;
  animation-play-state: paused !important;
}

.hourglass.paused {
  cursor: pointer;
  opacity: 0.85;
}

.hourglass.paused:hover {
  opacity: 1;
}

/* 🔥 Подсказка при наведении */
.hourglass:not(.paused):not(.running) {
  cursor: default;
}

.hourglass.running:not(.paused) {
  cursor: pointer;
}

.hourglass.running:not(.paused):hover {
  opacity: 0.8;
}
.paused-text {
  color: #00b894;
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

/* Песок в нижней части (заполняется) */
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

/* ============================================ */
/* 🔥 КАРТИНКА С ПРЕДМЕТОМ */
/* ============================================ */
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

/* ============================================ */
/* 🔥 НАЗВАНИЕ ПРЕДМЕТА — С РАЗМЫТИЕМ */
/* ============================================ */
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
}

/* Размытое состояние */
.item-name.blurred {
  filter: blur(6px);
  color: #636e72;
  background: rgba(0, 0, 0, 0.03);
  cursor: pointer;
  transition: all 0.4s ease;
}

.item-name.blurred:hover {
  filter: blur(4px);
  background: rgba(0, 0, 0, 0.06);
}

/* ============================================ */
/* 🔥 ПОЛЕ ДЛЯ ВВОДА */
/* ============================================ */
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

/* ============================================ */
/* 🔥 КНОПКИ УПРАВЛЕНИЯ */
/* ============================================ */
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

/* ============================================ */
/* 🔥 РЕЗУЛЬТАТЫ */
/* ============================================ */
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

/* 🔥 ОТВЕТЫ ПОЛЬЗОВАТЕЛЯ — ПАСТЕЛЬНО-ЖЕЛТО-ОРАНЖЕВЫЙ ГРАДИЕНТ */
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

/* ============================================ */
/* 🔥 АДАПТИВ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ */
/* ============================================ */
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
