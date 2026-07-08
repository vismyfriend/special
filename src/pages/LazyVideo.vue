<template>
  <div class="lazy-video-container" :class="{ 'dark-theme': isDarkMode }">
    <!-- Плейсхолдер с постером -->
    <div
      v-if="!isLoaded"
      class="video-placeholder"
      @click="loadVideo"
    >
      <!-- Если есть постер - показываем его без обрезания -->
      <img
        v-if="poster"
        :src="poster"
        alt="Video preview"
        class="poster-image"
        :style="posterImageStyle"
      />

      <!-- Затемнение поверх постера -->
      <div class="poster-overlay"></div>

      <!-- Кнопка воспроизведения -->
      <div class="play-button">
        <span class="play-icon">▶️</span>
      </div>

      <!-- Капшн -->
      <span class="video-caption">{{ caption || 'Видео' }}</span>
    </div>

    <div v-else class="video-wrapper" :style="wrapperStyle">
      <video
        ref="videoRef"
        class="lazy-video"
        controls
        controlslist="nodownload nofullscreen noremoteplayback"
        preload="metadata"
        playsinline
        @loadedmetadata="onVideoLoaded"
        @click="togglePlay"
      >
        <source :src="src" type="video/mp4" />
        Ваш браузер не хочет почему-то показывать видео - сделайте скриншот этого сообщения и отправьте Винсенту - он попробует исправить это недоразумение)) я серьезно!
      </video>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, computed, onMounted } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  poster: {
    type: String,
    default: ''
  },
  isDarkMode: {
    type: Boolean,
    default: false
  }
});

const isLoaded = ref(false);
const videoRef = ref(null);
const videoAspectRatio = ref(null);
const maxHeight = ref(600);
const isVideoVisible = ref(false);
let intersectionObserver = null;

function loadVideo() {
  isLoaded.value = true;
  setTimeout(() => {
    if (videoRef.value) {
      videoRef.value.play().catch(() => {});
    }
  }, 100);
}

function togglePlay(event) {
  if (event.target.closest('.lazy-video')) {
    const video = videoRef.value;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }
}

function onVideoLoaded() {
  const video = videoRef.value;
  if (video && video.videoWidth && video.videoHeight) {
    videoAspectRatio.value = video.videoWidth / video.videoHeight;

    if (videoAspectRatio.value < 1) {
      const maxHeightVh = window.innerHeight * 0.7;
      maxHeight.value = Math.min(600, maxHeightVh);
    } else {
      const maxHeightVh = window.innerHeight * 0.8;
      maxHeight.value = Math.min(700, maxHeightVh);
    }
  }
}

// Стиль для постера - используем object-fit: contain для сохранения пропорций
const posterImageStyle = computed(() => {
  return {
    objectFit: 'contain', // Сохраняем пропорции, не обрезаем
    width: '100%',
    height: '100%',
    display: 'block'
  };
});

// Стили для обертки видео
const wrapperStyle = computed(() => {
  if (!videoAspectRatio.value) {
    return {
      aspectRatio: '16/9',
      maxHeight: `${maxHeight.value}px`
    };
  }

  const ratio = videoAspectRatio.value;
  const maxH = maxHeight.value;

  if (ratio < 1) {
    const width = maxH * ratio;
    return {
      width: `${width}px`,
      maxWidth: '100%',
      maxHeight: `${maxH}px`,
      aspectRatio: `${ratio}`,
      margin: '0 auto'
    };
  } else {
    return {
      width: '100%',
      maxHeight: `${maxH}px`,
      aspectRatio: `${ratio}`
    };
  }
});

// Настройка Intersection Observer
function setupIntersectionObserver() {
  if (!props.poster) return;

  const container = document.querySelector('.lazy-video-container');
  if (!container) return;

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVideoVisible.value = true;
          intersectionObserver.disconnect();
        }
      });
    },
    { threshold: 0.1, rootMargin: '200px' }
  );

  intersectionObserver.observe(container);
}

function updateMaxHeight() {
  if (videoAspectRatio.value) {
    const ratio = videoAspectRatio.value;
    if (ratio < 1) {
      const maxHeightVh = window.innerHeight * 0.7;
      maxHeight.value = Math.min(600, maxHeightVh);
    } else {
      const maxHeightVh = window.innerHeight * 0.8;
      maxHeight.value = Math.min(700, maxHeightVh);
    }
  }
}

onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.pause();
    videoRef.value.src = '';
  }

  if (intersectionObserver) {
    intersectionObserver.disconnect();
  }

  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateMaxHeight);
  }
});

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateMaxHeight);
    setupIntersectionObserver();
  }
});
</script>

<style lang="scss" scoped>
.lazy-video-container {
  margin: 1rem 0;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);

  &.dark-theme {
    background: rgba(255, 255, 255, 0.05);
  }
}

.video-placeholder {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: none;
  transition: all 0.3s ease;
  gap: 0.5rem;
  min-height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  aspect-ratio: 16/9; /* Стандартное соотношение до загрузки метаданных */

  &:hover {
    transform: scale(1.02);
    filter: brightness(1.05);

    .play-icon {
      transform: scale(1.1);
    }
  }

  .poster-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain; /* Сохраняем пропорции, не обрезаем */
    z-index: 1;
    background: #000; /* Черный фон для вертикальных постеров */
  }

  .poster-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 2;
    transition: background 0.3s ease;
  }

  &:hover .poster-overlay {
    background: rgba(0, 0, 0, 0.2);
  }

  .play-button {
    position: relative;
    z-index: 3;
    width: 70px;
    height: 70px;
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(8px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .play-icon {
    font-size: 2.5rem;
    line-height: 1;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
    transition: transform 0.3s ease;
    margin-left: 4px;
  }

  .video-caption {
    position: relative;
    z-index: 3;
    font-size: 1rem;
    opacity: 0.95;
    padding: 0.5rem 1.5rem;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    margin-top: 0.5rem;
  }
}

.video-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.lazy-video {
  width: 100%;
  height: 100%;
  display: block;
  background: #000;
  object-fit: contain;
  cursor: none;

  &:hover {
    opacity: 0.98;
  }
}

/* Скрываем лишние кнопки */
.lazy-video::-webkit-media-controls-enclosure {
  border-radius: 0 0 12px 12px;
}

.lazy-video::-webkit-media-controls-airplay-button {
  display: none;
}

.lazy-video::-webkit-media-controls-fullscreen-button {
  display: none;
}

.lazy-video::-webkit-media-controls-rewind-button {
  display: none;
}

/* Улучшенные стили для прогресс-бара */
.lazy-video::-webkit-media-controls-timeline {
  height: 4px;
  border-radius: 2px;
  margin: 0 10px;
}

.lazy-video::-webkit-media-controls-timeline::-webkit-slider-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.lazy-video::-webkit-media-controls-volume-slider {
  height: 4px;
  border-radius: 2px;
}

.lazy-video::-webkit-media-controls-volume-slider::-webkit-slider-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

/* Адаптивность */
@media (max-width: 768px) {
  .lazy-video-container {
    margin: 0.8rem -0.5rem;
    border-radius: 0;
  }

  .video-wrapper {
    border-radius: 0;
  }

  .lazy-video::-webkit-media-controls-enclosure {
    border-radius: 0;
  }

  .video-placeholder {
    min-height: 150px;

    .play-button {
      width: 60px;
      height: 60px;
    }

    .play-icon {
      font-size: 2rem;
    }

    .video-caption {
      font-size: 0.85rem;
      padding: 0.3rem 1rem;
    }
  }
}

@media (max-width: 480px) {
  .video-placeholder {
    min-height: 120px;

    .play-button {
      width: 50px;
      height: 50px;
    }

    .play-icon {
      font-size: 1.8rem;
    }

    .video-caption {
      font-size: 0.75rem;
      padding: 0.2rem 0.8rem;
    }
  }
}
</style>
