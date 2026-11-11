<!-- src/layouts/CustomCursorLayout.vue -->
<template>
  <!--
    Корневой контейнер layout'а.
    Класс cursor-layout нужен, чтобы:
    1) на нём самом был cursor: none;
    2) через :deep(*) скрыть стандартный курсор на всех детях.
  -->
  <div class="cursor-layout">

    <!--
      Слот для контента:
      - если layout используется как компонент с контентом в слоте — рендерится слот;
      - если как layout-маршрут (children) — рендерится router-view.
    -->
    <slot>
      <router-view />
    </slot>

    <!-- 🔵 Внутренняя точка курсора (маленькая, всегда по центру) -->
    <div
      class="cursor"
      ref="cursor"
      :class="{ hidden: !isInteractive, pulsing: isInteractive }"
    ></div>

    <!-- ⚪ Белый внешний круг вокруг точки (постоянно видим) -->
    <div class="cursor2" ref="cursor2"></div>

    <!-- 🔴 Внешний круг, появляется только над интерактивными элементами -->
    <div class="cursor3" ref="cursor3" :class="{ visible: isInteractive }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// ─── ССЫЛКИ НА DOM-ЭЛЕМЕНТЫ ТРЁХ ЧАСТЕЙ КУРСОРА ───
const cursor = ref(null);   // 🔵 внутренняя точка
const cursor2 = ref(null);  // ⚪ белый внешний круг (постоянный)
const cursor3 = ref(null);  // 🔴 круг над интерактивными

// Показывать ли красный круг (если наводим на кнопку/ссылку и т.п.)
const isInteractive = ref(false);

onMounted(() => {
  // ─── ПРЯЧЕМ СТАНДАРТНЫЙ КУРСОР ───
  // body — на случай, если курсор над обычным контентом;
  // html — на случай, если курсор над position: fixed элементами,
  // которые выходят за пределы body (меню, модалки, курсоры).
  document.body.style.cursor = "none";
  document.documentElement.style.cursor = "none";

  // ─── ДВИЖЕНИЕ МЫШИ ───
  const onMouseMove = (e) => {
    const { clientX: x, clientY: y, target } = e;

    if (cursor.value && cursor2.value && cursor3.value) {
      // Исключаем случаи, когда курсор сам навёлся на свои части
      if (
        target === cursor.value ||
        target === cursor2.value ||
        target === cursor3.value
      ) return;

      // Обновляем координаты для всех трёх частей
      // (вычитаем половину размера, чтобы центр совпал с мышью)
      cursor.value.style.left = `${x - 4}px`;   // 🔵 точка — 8px/2
      cursor.value.style.top = `${y - 4}px`;

      cursor2.value.style.left = `${x - 18}px`; // ⚪ круг — 36px/2
      cursor2.value.style.top = `${y - 18}px`;

      cursor3.value.style.left = `${x - 18}px`; // 🔴 круг — тоже
      cursor3.value.style.top = `${y - 18}px`;

      // Проверяем: находится ли курсор над интерактивным элементом
      const interactiveEl = target?.closest?.(
        'button, a, input, label, [role="button"], .clickable'
      );

      // 💡 Логгируем текущее наведение (раскомментируй при отладке)
      // console.log('[Cursor]', {
      //   tag: target?.tagName,
      //   classList: [...target?.classList || []],
      //   role: target?.getAttribute?.('role'),
      //   dataset: target?.dataset,
      //   interactiveMatch: !!interactiveEl,
      //   matchedElement: interactiveEl,
      // });

      isInteractive.value = !!interactiveEl;
    }
  };

  document.addEventListener("mousemove", onMouseMove);

  // ─── ОЧИСТКА ПРИ РАЗМОНТИРОВАНИИ ───
  onBeforeUnmount(() => {
    // Возвращаем стандартный курсор
    document.body.style.cursor = "default";
    document.documentElement.style.cursor = "default";
    // Снимаем обработчик
    document.removeEventListener("mousemove", onMouseMove);
  });
});
</script>

<style>
/* Глобальные переменные для анимации курсора */
:root {
  --pulse-duration: 0.7s;
  --pulse-scale: 4.5;
}
</style>

<style scoped>
/* ─── КОРЕНЬ LAYOUT ─── */
/* Скрываем стандартный курсор на всём layout */
.cursor-layout {
  cursor: none;
}

/*
  Гарантируем cursor: none на всех детях.
  :deep(*) проникает в дочерние компоненты.
  Без !important — если где-то нужен cursor: pointer, он переопределит.
*/
.cursor-layout :deep(*) {
  cursor: none;
}

/* ─── ОБЩИЕ СТИЛИ ДЛЯ ВСЕХ ТРЁХ ЧАСТЕЙ КУРСОРА ─── */
.cursor,
.cursor2,
.cursor3 {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;       /* чтобы не перехватывать события мыши */
  will-change: transform;     /* подсказка браузеру для производительности */
  z-index: 9999;              /* поверх всего */
}

/* 🔵 ВНУТРЕННЯЯ ТОЧКА */
.cursor {
  background-color: rgba(200, 200, 200, 0.73);
  height: 8px;
  width: 8px;
  animation: none;
  transition: opacity 0.2s ease;
}

/* Активация анимации пульсации (когда над интерактивным) */
.cursor.pulsing {
  animation: cursorPulse var(--pulse-duration) ease-in-out infinite;
}

/* Скрываем точку, если нужно */
.cursor.hidden {
  opacity: 0;
}

/* 🔁 Анимация пульсации наружу */
@keyframes cursorPulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(var(--pulse-scale));
    opacity: 0;
  }
}

/* ⚪ БЕЛЫЙ ВНЕШНИЙ КРУГ (постоянный) */
.cursor2 {
  height: 36px;
  width: 36px;
  border: 2px solid rgba(200, 200, 200, 0.73);
  box-shadow: 0 0 22px rgba(92, 91, 91, 0.73);
  transition: transform 0.1s ease-out;
}

/* 🔴 КРУГ НАД ИНТЕРАКТИВНЫМИ (по умолчанию невидим) */
.cursor3 {
  height: 36px;
  width: 36px;
  background: rgba(255, 255, 255, 0.82);
  opacity: 0;                 /* изначально скрыт */
  border: 2px solid #4a4a4a;
  box-shadow: 0 0 22px rgba(46, 207, 255, 0.94);
  transition: opacity 0.15s ease;
}

/* Появление при наведении на интерактивный элемент */
.cursor3.visible {
  opacity: 0.5;
}
</style>
