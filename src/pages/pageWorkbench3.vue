<template>
  <div class="special-app">
    <!-- Кнопка для закрытия приложения и возврата на главную страницу -->
    <button class="closeThisPage" @click="backToIntroPage">close Special App ❌</button>

    <!-- Три элемента, создающие кастомный курсор -->
    <div class="cursor" ref="cursor"></div>
    <div class="cursor2" ref="cursor2"></div>
    <div class="cursor3" ref="cursor3"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'; // Импортируем нужные функции из Vue
import { useRouter } from 'vue-router'; // Импортируем роутер для навигации

const router = useRouter(); // Создаем экземпляр роутера
const cursor = ref(null); // Ссылка на основной курсор
const cursor2 = ref(null); // Ссылка на второй курсор (больший круг)
const cursor3 = ref(null); // Ссылка на третий курсор (дополнительный эффект)

const backToIntroPage = () => {
  router.push("/"); // Функция для возврата на главную страницу
};

onMounted(() => {
  document.body.style.cursor = "none"; // Отключаем стандартный курсор

  // Функция для обработки движения мыши
  const onMouseMove = (e) => {
    // Проверяем, существуют ли элементы перед их изменением
    if (cursor.value && cursor2.value && cursor3.value) {
      const { clientX: x, clientY: y } = e; // Получаем текущие координаты мыши

      cursor.value.style.left = `${x - 4}px`; // Центрируем курсор, убираем сдвиг
      cursor.value.style.top = `${y - 4}px`; // Для маленького курсора с размером 8px

      cursor2.value.style.left = `${x - 18}px`; // Центрируем больший курсор
      cursor2.value.style.top = `${y - 18}px`; // Для большего курсора с размером 36px

      cursor3.value.style.left = `${x - 18}px`; // Центрируем третий курсор
      cursor3.value.style.top = `${y - 18}px`; // Для третьего курсора с размером 36px
    }

  };

  document.addEventListener("mousemove", onMouseMove);

  // Добавляем обработку для сброса стандартного курсора при уходе с компонента
  onBeforeUnmount(() => {
    document.body.style.cursor = "default"; // Восстанавливаем стандартный курсор
    document.removeEventListener("mousemove", onMouseMove); // Убираем обработчик события
  });
});
</script>

<style lang="scss" scoped>
/* Основной контейнер приложения */
.special-app {
  height: 100vh; /* Занимает всю высоту экрана */
  overflow: hidden; /* Отключаем прокрутку */
  cursor: none; /* Скрываем стандартный курсор внутри приложения */
}

/* Стили для кнопки закрытия */
.closeThisPage {
  display: block;
  margin: 10px auto;
  border-radius: 30px;
  background-color: transparent;
  color: white;
  cursor: pointer; /* Оставляем стандартный курсор на кнопке */
}

/* Основные стили для кастомного курсора */
.cursor, .cursor2, .cursor3 {
  position: fixed; /* Фиксированное положение на экране */
  border-radius: 50%; /* Делаем курсор кругом */
  pointer-events: none; /* Отключаем взаимодействие с элементами */
  will-change: transform; /* Оптимизируем анимацию */
}

/* Маленькая точка (основной курсор) */
.cursor {
  background-color: #fff; /* Белый цвет */
  height: 8px; /* Маленький круг */
  width: 8px;
  z-index: 99999; /* Поверх всех элементов */
}

/* Дополнительные курсоры (эффекты) */
.cursor2, .cursor3 {
  height: 36px; /* Размер больше, чем у основного */
  width: 36px;
  transition: transform 0.1s ease-out; /* Плавное движение */
}

/* Эффект свечения у одного из курсоров */
.cursor2 {
  border: 2px solid #fff;
  box-shadow: 0 0 22px rgba(255, 255, 255, 0.6);
}
</style>
