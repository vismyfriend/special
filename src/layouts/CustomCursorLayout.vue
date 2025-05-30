<template>
  <div>
    <slot /> <!-- Тут будут твои страницы / контент -->
    <!-- Курсор поверх всего -->
    <div class="cursor" ref="cursor"></div>
    <div class="cursor2" ref="cursor2"></div>
    <div class="cursor3" ref="cursor3"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const cursor = ref(null);
const cursor2 = ref(null);
const cursor3 = ref(null);

onMounted(() => {
  document.body.style.cursor = "none";

  const onMouseMove = (e) => {
    if (cursor.value && cursor2.value && cursor3.value) {
      const { clientX: x, clientY: y } = e;

      cursor.value.style.left = `${x - 4}px`;
      cursor.value.style.top = `${y - 4}px`;

      cursor2.value.style.left = `${x - 18}px`;
      cursor2.value.style.top = `${y - 18}px`;

      cursor3.value.style.left = `${x - 18}px`;
      cursor3.value.style.top = `${y - 18}px`;
    }
  };

  document.addEventListener("mousemove", onMouseMove);

  onBeforeUnmount(() => {
    document.body.style.cursor = "default";
    document.removeEventListener("mousemove", onMouseMove);
  });
});
</script>

<style scoped>
.cursor, .cursor2, .cursor3 {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  will-change: transform;
  z-index: 9999;
}

.cursor {
  background-color: #fff;
  height: 8px;
  width: 8px;
}

.cursor2, .cursor3 {
  height: 36px;
  width: 36px;
  transition: transform 0.1s ease-out;
}

.cursor2 {
  border: 2px solid #fff;
  box-shadow: 0 0 22px rgba(255, 255, 255, 0.6);
}
</style>
