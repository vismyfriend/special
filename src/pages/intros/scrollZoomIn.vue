
<template>
  <div class="scroll-container">
    <!-- Прокручиваемый блок для имитации скролла -->
    <div ref="fakeScrollArea" class="fake-scroll-area"></div>

    <!-- Блок с эффектом увеличения -->
    <div class="zoom-section" ref="zoomSection">
      <div class="zoom-image-wrapper">
        <img
          src="/src/assets/images/scrollZoomIn copy.png"
          alt="monitor"
          class="zoom-image"
          :style="{ transform: `scale(${scale})` }"
        />
      </div>

      <!-- Контент за монитором -->
      <div class="background-content">
        <div class="screen-app" :style="{ opacity: screenOpacity }">
          <div class="app-window">
            <h2>Интерфейс монитора</h2>
            <p>Добро пожаловать! Вы включили монитор.</p>
            <button @click="count++">Счетчик: {{ count }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Основной контент страницы -->
    <div class="page-content">
      <h2>А вот и обычный скролл</h2>
      <p>Добавь сюда больше текста, чтобы можно было скроллить.</p>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
const scale = ref(1);
const maxScale = 10;
const zoomDistance = 500;
const fakeScrollArea = ref(null);
const zoomSection = ref(null);
const count = ref(0);

// Появление интерфейса: scale от 2 до 6
const screenOpacity = computed(() => {
  const min = 2;
  const max = 6;
  if (scale.value <= min) return 0;
  if (scale.value >= max) return 1;
  return (scale.value - min) / (max - min);
});

const onScroll = () => {
  const scrollTop = window.scrollY;

  if (scrollTop < zoomDistance) {
    const newScale = 1 + (scrollTop / zoomDistance) * (maxScale - 1);
    scale.value = Math.min(newScale, maxScale);

    zoomSection.value.style.position = 'fixed';
    zoomSection.value.style.top = '0';
    zoomSection.value.style.left = '0';
    zoomSection.value.style.right = '0';
  } else {
    zoomSection.value.style.position = 'relative';
    zoomSection.value.style.top = 'unset';
    scale.value = maxScale;
  }
};

onMounted(() => {
  window.addEventListener('scroll', onScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>
<style lang="scss" scoped>
:global(html.no-scroll),
:global(body.no-scroll) {
  overflow: hidden;
  height: 100%;
}
html.no-scroll,
body.no-scroll {
  overflow: hidden;
  height: 100%;
}
.scroll-container {
  position: relative;
  overflow-x: hidden;
}

.zoom-image-wrapper {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  background: transparent;
  pointer-events: none;
}

.zoom-image {
  max-width: 100%;


  height: auto;
  transition: transform 0.3s ease-out;
  z-index: 5;
}



.page-content {
  padding: 100vh 20px 100px;
  background-color: white;
  color: black;
}
.background-content {
  position: absolute;
  top: 0;
  height: 100vh;
  width: 100%;
  z-index: 0;
  background: #1e1e1e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.screen-app {
  transition: opacity 0.5s ease;
  opacity: 0;
  pointer-events: auto;
}

.app-window {
  background-color: #2a2a2a;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  max-width: 400px;
  width: 100%;
  text-align: center;

  h2 {
    margin-bottom: 1rem;
  }

  button {
    margin-top: 1rem;
    background: #4caf50;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: #45a049;
    }
  }
}
</style>

