<template>
  <div ref="container" class="lazy-image-container">
    <!-- Плейсхолдер пока изображение не загружено -->
    <div v-if="!isVisible" class="image-placeholder" :class="{ 'dark-theme-placeholder': isDarkMode }">
      <span class="placeholder-icon">🖼️</span>
      <span class="placeholder-text">Изображение загружается...</span>
    </div>
    <img
      v-else
      :src="src"
      :alt="caption || 'Фото'"
      class="lazy-image"
      loading="lazy"
      @load="onLoad"
    />
    <p v-if="caption && isVisible" class="image-caption" :class="{ 'dark-theme-caption': isDarkMode }">{{ caption }}</p>
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

const emit = defineEmits(['loaded']);

const container = ref(null);
const isVisible = ref(false);
let observer = null;

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

function onLoad() {
  emit('loaded');
}

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
.lazy-image-container {
  min-height: 100px;
  width: 100%;
  margin: 1.5rem 0;
}

.image-placeholder {
  width: 100%;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  animation: pulse 1.5s ease infinite;
}

.dark-theme-placeholder {
  background: rgba(0, 0, 0, 0.3);
}

.placeholder-icon {
  font-size: 3rem;
  opacity: 0.7;
}

.placeholder-text {
  font-size: 0.9rem;
  opacity: 0.7;
}

.lazy-image {
  max-width: 100%;
  max-height: 500px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: block;
  margin: 0 auto;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

.image-caption {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.8;
  text-align: center;
  font-style: italic;
  color: inherit;
}

.dark-theme-caption {
  color: #e0e0e0;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes fadeIn {
  to { opacity: 1; }
}
</style>
