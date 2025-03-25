<template>
  <div class="special-app">
    <!-- Кнопка для закрытия приложения и возврата на главную страницу -->
    <button class="closeThisPage" @click="backToIntroPage">close Special App ❌</button>

    <!-- Элементы кастомных курсоров -->
    <div class="cursor" ref="cursor"></div>
    <div class="cursor2" ref="cursor2"></div>
    <div class="cursor3" ref="cursor3"></div>

    <!-- Панель управления кастомизацией курсора -->
    <div class="cursor-controls">
      <!-- Переключатели для видимости курсоров -->
      <label>
        <input type="checkbox" v-model="showStandardCursor" /> Show Standard Cursor
      </label>
      <label>
        <input type="checkbox" v-model="showCustomCursor" /> Show Custom Cursor
      </label>
      <label>
        <input type="checkbox" v-model="showCursor3" /> Show Custom Point (Cursor 3)
      </label>

      <!-- Ползунки для изменения цвета курсоров -->
      <div>
        <label>Cursor 2 Border Color: </label>
        <input type="color" v-model="cursor2Color" />
      </div>
      <div>
        <label>Cursor 3 Border Color: </label>
        <input type="color" v-model="cursor3Color" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'; // Импортируем нужные функции из Vue
import { useRouter } from 'vue-router'; // Импортируем роутер для навигации

const router = useRouter(); // Создаем экземпляр роутера
const cursor = ref(null); // Ссылка на кастомный курсор
const cursor2 = ref(null); // Ссылка на второй курсор (круг)
const cursor3 = ref(null); // Ссылка на третий курсор (точка)

const showStandardCursor = ref(false); // Состояние для отображения стандартного курсора
const showCustomCursor = ref(true); // Состояние для отображения кастомного курсора
const showCursor3 = ref(true); // Состояние для отображения третьего курсора

const cursor2Color = ref("#ffffff"); // Цвет второго курсора (граница)
const cursor3Color = ref("#ffffff"); // Цвет третьего курсора (граница)

const backToIntroPage = () => {
  router.push("/"); // Функция для возврата на главную страницу
};

onMounted(() => {
  document.body.style.cursor = "none"; // Отключаем стандартный курсор на всей странице

  document.addEventListener("mousemove", (e) => {
    requestAnimationFrame(() => {
      const { clientX: x, clientY: y } = e; // Получаем координаты мыши

      // Перемещаем кастомные курсоры по координатам мыши
      if (cursor.value) {
        cursor.value.style.left = `${x - 4}px`; // Центрируем курсор
        cursor.value.style.top = `${y - 4}px`;
      }

      if (cursor2.value) {
        cursor2.value.style.left = `${x - 18}px`; // Центрируем второй курсор
        cursor2.value.style.top = `${y - 18}px`;
        cursor2.value.style.borderColor = cursor2Color.value; // Устанавливаем цвет границы второго курсора
      }

      if (cursor3.value) {
        cursor3.value.style.left = `${x - 18}px`; // Центрируем третий курсор
        cursor3.value.style.top = `${y - 18}px`;
        cursor3.value.style.borderColor = cursor3Color.value; // Устанавливаем цвет границы третьего курсора
      }
    });
  });
});

watch([showStandardCursor, showCustomCursor, showCursor3], () => {
  // Управление видимостью курсоров
  if (!showStandardCursor.value) {
    document.body.style.cursor = "none"; // Скрываем стандартный курсор, если выключен
  } else {
    document.body.style.cursor = "default"; // Показываем стандартный курсор
  }

  cursor.value.style.display = showCustomCursor.value ? "block" : "none"; // Показываем/скрываем кастомный курсор
  cursor2.value.style.display = showCustomCursor.value ? "block" : "none"; // Показываем/скрываем второй курсор
  cursor3.value.style.display = showCursor3.value ? "block" : "none"; // Показываем/скрываем третий курсор
});

// Добавляем обработку для сброса стандартного курсора при выходе
onBeforeUnmount(() => {
  document.body.style.cursor = "default"; // Восстанавливаем стандартный курсор при уходе с компонента

});
</script>

<style lang="scss" scoped>
/* Основной контейнер приложения */
.special-app {
  height: 100vh;
  overflow: hidden;
  cursor: none;
}

/* Панель управления кастомизацией */
.cursor-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 8px;
  color: white;
}

.cursor-controls label,
.cursor-controls div {
  display: block;
  margin: 10px 0;
}

/* Стандартный курсор скрыт, кастомный курсор */
.cursor, .cursor2, .cursor3 {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  will-change: transform;
}

/* Маленькая точка (основной курсор) */
.cursor {
  background-color: #fff;
  height: 8px;
  width: 8px;
  z-index: 99999;
}

/* Второй курсор (круг) */
.cursor2 {
  height: 36px;
  width: 36px;
  transition: transform 0.1s ease-out;
  border: 2px solid #fff; /* Контур */
  box-shadow: 0 0 22px rgba(255, 255, 255, 0.6);
}

/* Третий курсор (точка) */
.cursor3 {
  height: 36px;
  width: 36px;
  border: 2px solid #fff; /* Контур */
  box-shadow: 0 0 22px rgba(255, 255, 255, 0.6);
}
</style>
