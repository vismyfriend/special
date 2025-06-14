<template>
  <div>
    <div class="row">
      <div class="col index-col">
        <div class="wordCard" v-for="(row, index) in rows" :key="index">
          <span class="index-text">{{ index + 1 }}</span>
        </div>
      </div>
      <div class="col eng-col">
        <div class="wordCard" v-for="(row, index) in rows" :key="index">
          <input
            type="text"
            v-model="row.eng"
            class="input-field"
            placeholder="English word"
            @keydown.enter.prevent="focusNextField(index, 'eng')"
            :ref="el => setInputRef(el, index, 'eng')"
          >
        </div>
      </div>
      <div class="col ru-col">
        <div class="wordCard" v-for="(row, index) in rows" :key="index">
          <input
            type="text"
            v-model="row.ru"
            class="input-field"
            placeholder="Russian word"
            @keydown.enter.prevent="focusNextField(index, 'ru')"
            @input="addRowIfLast(index)"
            :ref="el => setInputRef(el, index, 'ru')"
          >
        </div>
      </div>
    </div>

    <!-- Кнопка для добавления новых строк -->
    <button class="add-row-button" @click="addRow">+ Add row</button>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

const rows = ref([
  { eng: '', ru: '' },
  { eng: '', ru: '' },
  { eng: '', ru: '' },
  { eng: '', ru: '' }
]);

// Храним ссылки на input элементы
const inputRefs = ref({});

const setInputRef = (el, index, type) => {
  if (el) {
    if (!inputRefs.value[index]) {
      inputRefs.value[index] = {};
    }
    inputRefs.value[index][type] = el;
  }
};

const addRow = () => {
  rows.value.push({ eng: '', ru: '' });
};

// Автоматически добавляем строку, если ввели что-то в последнюю ячейку
const addRowIfLast = (index) => {
  if (index === rows.value.length - 1 && rows.value[index].ru.trim() !== '') {
    addRow();
  }
};

// Обработка нажатия Enter для навигации
const focusNextField = (currentIndex, currentField) => {
  if (currentField === 'eng') {
    // Переходим на русское поле той же строки
    inputRefs.value[currentIndex]?.ru?.focus();
  } else if (currentField === 'ru') {
    // Если это не последняя строка, переходим на английское поле следующей строки
    if (currentIndex < rows.value.length - 1) {
      inputRefs.value[currentIndex + 1]?.eng?.focus();
    }
    // Для последней строки просто остаемся в текущем поле
  }
};
</script>

<style lang="scss" scoped>
.row {
  margin-top: 20px;
  display: flex;
}

.col {
  flex-direction: column;
  display: flex;
}

.index-col {
  flex: 0 0 30px;
}

.wordCard {
  background-color: #f9f9f9;
  border: 0.5px solid #656565;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 30px;
  padding: 4px 2px;
  margin-bottom: 2px;
  box-sizing: border-box;
  height: 100%;
}

.index-text {
  font-size: 9px;
  color: #656565;
}

.eng-col {
  line-height: 0.8;
  flex: 1;
}

.ru-col {
  font-size: 12px;
  line-height: 0.8;
  flex: 1;
}

.input-field {
  width: 100%;
  border: none;
  background: transparent;
  text-align: center;
  outline: none;
  font-size: 12px;
  padding: 5px;

  &:focus {
    background-color: rgba(2, 116, 255, 0.1);
  }
}

.add-row-button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e0e0e0;
    transform: scale(1.05);
  }
}
</style>
