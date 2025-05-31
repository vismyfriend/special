<template>
  <div>
    <slot />

    <!-- 🔵 Внутренняя точка курсора (маленькая, всегда по центру) -->
    <!-- Добавим класс pulsing при isInteractive -->
    <div
      class="cursor"
      ref="cursor"
      :class="{ hidden: !isInteractive, pulsing: isInteractive }"
    ></div>    <!-- ⚪ Белый внешний круг вокруг точки (постоянно видим, просто как обводка) -->
    <div class="cursor2" ref="cursor2"></div>

    <!-- 🔴 Красный внешний круг (появляется только над интерактивными элементами) -->
    <div class="cursor3" ref="cursor3" :class="{ visible: isInteractive }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Ссылки на DOM-элементы трёх частей курсора
const cursor = ref(null);   // 🔵 внутренняя белая точка

const cursor2 = ref(null);  // ⚪ белый внешний круг (постоянный)
const cursor3 = ref(null);  // 🔴 красный круг (только на интерактивных)

// Показывать ли красный круг (если наводим на кнопку/ссылку и т.п.)
const isInteractive = ref(false);

onMounted(() => {
  // Прячем стандартный курсор
  document.body.style.cursor = "none";

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

// 💡 Логгируем текущее наведение
//       console.log('[Cursor]', {
//         tag: target?.tagName,
//         classList: [...target?.classList || []],
//         role: target?.getAttribute?.('role'),
//         dataset: target?.dataset,
//         interactiveMatch: !!interactiveEl,
//         matchedElement: interactiveEl,
//       });

      isInteractive.value = !!interactiveEl;

      // Управляем видимостью красного круга (через класс)
      isInteractive.value = !!interactiveEl;
    }
  };

  document.addEventListener("mousemove", onMouseMove);

  onBeforeUnmount(() => {
    document.body.style.cursor = "default";
    document.removeEventListener("mousemove", onMouseMove);
  });
});
</script>

<style>
:root {
  --pulse-duration: 0.7s;
  --pulse-scale: 4.5;
}
</style>


<style scoped>
/* 🎯 Общие стили для всех 3-х курсоров */
.cursor,
.cursor2,
.cursor3 {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  will-change: transform;
  z-index: 9999;
}

/* 🔵 Внутренняя белая точка (всегда видна — но можно тут контролировать прозрачность) */


/* 🔵 Внутренняя белая точка */
.cursor {
  background-color: rgba(200, 200, 200, 0.73);
  height: 8px;
  width: 8px;
  animation: none;
  transition: opacity 0.2s ease;
}

/* 🔵 Активация анимации пульсации */
.cursor.pulsing {
  animation: cursorPulse var(--pulse-duration) ease-in-out infinite;
}

/* Скрываем при необходимости */
.cursor.hidden {
  opacity: 0;
}

/* 🔁 Анимация пульсации наружу и внутрь
@keyframes cursorPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(var(--pulse-scale));
    opacity: 0;
  }
}
*/

/* 🔁 Анимация пульсации только наружу */
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

/* ⚪ Белый круг (всегда активен, просто светится как фон) */
.cursor2 {
  height: 36px;
  width: 36px;
  border: 2px solid rgba(200, 200, 200, 0.73);
  box-shadow: 0 0 22px rgba(92, 91, 91, 0.73);
  transition: transform 0.1s ease-out;
}

/* 🔴 Зеленый или кКрасный круг — по умолчанию невидим */
.cursor3 {
  height: 36px;
  width: 36px;
  background: rgba(255, 255, 255, 0.82);
  opacity: 0; /* изначально скрыт */
  /*
  border: 2px solid #69fd04;
  box-shadow: 0 0 22px rgba(21, 193, 1, 0.6);

   */
  border: 2px solid #4a4a4a;
  box-shadow: 0 0 22px rgba(46, 207, 255, 0.94);
  transition: opacity 0.15s ease;
}

/* 🔴 Красный круг — появляется при наведении */
.cursor3.visible {
  opacity: 0.5;
}

</style>
