<template>
  <div>
    <!-- Кнопка закрытия и заголовок -->
    <button class="closeThisPage" @click="backToIntroPage">close Special App ❌</button>

    <!-- Контейнер с правилами игры -->
    <div class="rules-container">
      <p>Правила: перемещайте плитки, чтобы числа шли по порядку</p>
      <p>от 1 до 8 слева направо, сверху вниз. Пустая клетка должна быть в правом нижнем углу.</p>
    </div>

    <!-- Основной игровой контейнер -->
    <section class="game-container">
      <!-- Анимированное игровое поле -->
      <transition-group
        tag="div"
        name="slide"
        id="puzzle"
        class="no-select"
      >
      <!--
        Каждая плитка:
        - v-for перебирает массив tiles
        - key нужен для Vue для отслеживания элементов
        - @click вызывает метод move при клике
        - empty класс применяется к пустой клетке (значение 9)
      -->
      <div
        class="tile"
        v-for="(tile, i) in tiles"
        :key="tile"
        @click="move(i)"
        :class="{ empty: tile === 9 }"
      >
        {{ tile !== 9 ? tile : '' }}
      </div>
      </transition-group>
    </section>
  </div>
</template>

<script>
export default {
  // Данные компонента
  data() {
    return {
      // Массив плиток (изначально перемешанный)
      tiles: this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]),
      // Правильное решение - числа по порядку
      solution: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      // Возможные ходы для каждой позиции:
      // Например, плитка в позиции 0 (левый верхний угол)
      // может перемещаться только в позиции 1 (правее) и 3 (ниже)
      moves: [
        [1, 3],       // 0
        [0, 2, 4],    // 1
        [1, 5],       // 2
        [0, 4, 6],    // 3
        [1, 3, 5, 7], // 4
        [2, 4, 8],    // 5
        [3, 7],       // 6
        [4, 6, 8],    // 7
        [5, 7]        // 8
      ]
    }
  },

  // Наблюдатель за свойством solved (следит за решением)
  watch: {
    solved(newVal) {
      if (newVal) {
        alert('Поздравляем! Вы решили головоломку!');
        // Можно автоматически перемешать снова после победы:
        // this.tiles = this.shuffleArray([...this.solution]);
      }
    }
  },

  // Вычисляемые свойства
  computed: {
    // Находит индекс пустой клетки (где значение 9)
    empty() {
      return this.tiles.findIndex(tile => tile === 9);
    },

    // Проверяет, решена ли головоломка
    solved() {
      // Сравниваем текущий массив с решением
      return this.tiles.length === this.solution.length &&
        this.tiles.every((value, index) => value === this.solution[index]);
    }
  },

  // Методы компонента
  methods: {
    /**
     * Алгоритм Фишера-Йетса для перемешивания массива
     * @param {Array} array - Массив для перемешивания
     * @returns {Array} Перемешанный массив
     */
    shuffleArray(array) {
      const arr = [...array]; // Создаем копию массива
      // Идем с конца массива к началу
      for (let i = arr.length - 1; i > 0; i--) {
        // Случайный индекс от 0 до i
        const j = Math.floor(Math.random() * (i + 1));
        // Меняем местами текущий элемент со случайным
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },

    /**
     * Перемещает плитку, если это возможно
     * @param {number} i - Индекс плитки, которую пытаемся переместить
     */
    move(i) {
      // Проверяем, можно ли переместить эту плитку (есть ли пустая клетка среди соседей)
      if (this.moves[i].includes(this.empty)) {
        // Создаем новый массив (важно для реактивности в Vue)
        const newTiles = [...this.tiles];
        // Меняем местами текущую плитку и пустую клетку
        [newTiles[i], newTiles[this.empty]] = [newTiles[this.empty], newTiles[i]];
        // Обновляем массив плиток
        this.tiles = newTiles;
      }
    },

    // Возврат на главную страницу
    backToIntroPage() {
      this.$router.push("/");
    }
  }
}
</script>

<style scoped>
/* Общие стили */
.closeThisPage {
  display: block;
  margin: 10px auto;
  border-radius: 30px;
  background-color: transparent;
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #ccc;
  transition: all 0.3s ease;
}

.closeThisPage:hover {
  background-color: #f0f0f0;
}

.game-title {
  text-align: center;
  margin: 10px 0;
  color: #333;
}

/* Контейнер с правилами */
.rules-container {
  max-width: 300px;
  margin: 0 auto 20px;
  padding: 10px;
  background: #f8f8f8;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  color: #555;
}

/* Основной игровой контейнер */
.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Игровое поле */
#puzzle {
  background: #CCC;
  border: 5px solid black;
  display: grid;
  grid-gap: 1px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  height: 240px;
  width: 240px;
  margin: 0 auto;
  user-select: none; /* Запрещаем выделение текста */
}

/* Стили плитки */
.tile {
  align-items: center;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  font-size: 36px;
  font-weight: bold;
  justify-content: center;
  transition: all 0.3s ease;
  user-select: none; /* Запрещаем выделение текста */
  -webkit-user-select: none; /* Для Safari */
}

.tile:hover {
  background-color: #f0f0f0;
  transform: scale(0.98);
}

/* Пустая плитка */
.tile.empty {
  opacity: 0;
  pointer-events: none;
  background-color: transparent;
}

/* Анимация перемещения плиток */
.slide-move {
  transition: transform 0.5s ease;
}

/* Класс для запрета выделения */
.no-select {
  user-select: none;
  -webkit-user-select: none;
}
</style>
