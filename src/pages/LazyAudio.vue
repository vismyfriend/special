<template>
  <div ref="container" class="lazy-audio-container">
    <!-- Плейсхолдер пока аудио не загружено -->
    <div v-if="!isVisible" class="audio-placeholder" :class="{ 'dark-theme-placeholder': isDarkMode }" @click="loadNow">
      <span class="placeholder-icon">🎵</span>
      <span class="placeholder-text">{{ caption || 'Аудиозапись (нажмите для загрузки)' }}</span>
    </div>
    <audio
      v-else
      controls
      :src="src"
      class="audio-player"
      preload="none"
    ></audio>
    <p v-if="caption && isVisible" class="audio-caption" :class="{ 'dark-theme-caption': isDarkMode }">{{ caption }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  src: String,
  caption: String,
  isDarkMode: {
    type: Boolean,
    default: false
  }
});

const container = ref(null);
const isVisible = ref(false);
let observer = null;

function loadNow() {
  isVisible.value = true;
  if (observer) observer.disconnect();
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        isVisible.value = true;
        observer.disconnect();
      }
    },
    { threshold: 0.1, rootMargin: '200px' }
  );

  if (container.value) {
    observer.observe(container.value);
  }
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
.lazy-audio-container {
  margin: 1.5rem 0;
  width: 100%;
}

.audio-placeholder {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark-theme-placeholder {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

.audio-placeholder:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.02);
}

.dark-theme-placeholder:hover {
  background: rgba(0, 0, 0, 0.4);
}

.placeholder-icon {
  font-size: 2rem;
  opacity: 0.9;
}

.placeholder-text {
  font-size: 1rem;
  opacity: 0.8;
}

.audio-player {
  width: 100%;
  border-radius: 30px;
}

.audio-caption {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

.dark-theme-caption {
  color: #e0e0e0;
}
</style>
