<template>
  <div class="gallery-container">
    <!-- Сетка с фото (1-5 штук) -->
    <div class="gallery-grid" :class="gridClass">
      <div
        v-for="(photo, index) in visiblePhotos"
        :key="index"
        class="gallery-item"
        :class="getItemClass(index)"
        @click="openLightbox(index)"
      >
        <!-- Показываем плейсхолдер или изображение в зависимости от загрузки -->
        <template v-if="!loadedImages.has(photo.src)">
          <div class="image-placeholder" :class="{ 'dark-theme-placeholder': isDarkMode }">
            <span class="placeholder-icon">🖼️</span>
            <span class="placeholder-text">Загрузка... <br> почему-то дольше обычного... <br>отправьте Винсенту скриншот, сообщите об ошибке) </span>
          </div>
          <!-- Скрытое изображение для загрузки -->
          <img
            :src="photo.src"
            :alt="photo.caption || 'Фото'"
            :class="{ portrait: photo.orientation === 'portrait' }"
            style="display: none;"
            @load="onImageLoad(photo.src)"
            @error="onImageError(photo.src)"
          />
        </template>

        <!-- Когда изображение загружено - показываем его -->
        <img
          v-else
          :src="photo.src"
          :alt="photo.caption || 'Фото'"
          :class="{ portrait: photo.orientation === 'portrait' }"
        />

        <!-- Затемнение с количеством, если фото много -->
        <div v-if="isLastInCollage(index)" class="more-overlay">
          +{{ photos.length - maxVisible }}
        </div>
      </div>
    </div>

    <!-- Лайтбокс для просмотра всех фото -->
    <Teleport to="body">
      <div v-if="lightboxOpen" class="lightbox-modal-overlay" @click="closeLightbox">
        <div class="lightbox-modal-content" @click="closeLightbox">
          <div class="lightbox-image-container" @click="closeLightbox">
            <button class="lightbox-close-btn" @click="closeLightbox">✕</button>

            <button
              v-if="currentPhotoIndex > 0"
              class="lightbox-nav-btn prev"
              @click.stop="prevPhoto"
            >←</button>

            <!-- Показываем плейсхолдер или изображение -->
            <template v-if="!lightboxImageLoaded">
              <div class="lightbox-placeholder">
                <span class="placeholder-icon">🖼️</span>
              </div>
              <!-- Скрытое изображение для загрузки -->
              <img
                :src="photos[currentPhotoIndex]?.src"
                :alt="photos[currentPhotoIndex]?.caption"
                style="display: none;"
                @load="lightboxImageLoaded = true"
                @error="onLightboxError"
              />
            </template>

            <!-- Когда изображение загружено - показываем его -->
            <img
              v-else
              :src="photos[currentPhotoIndex]?.src"
              :alt="photos[currentPhotoIndex]?.caption"
              class="lightbox-image"
            />

            <button
              v-if="currentPhotoIndex < photos.length - 1"
              class="lightbox-nav-btn next"
              @click.stop="nextPhoto"
            >→</button>
          </div>

          <div class="lightbox-footer" @click="closeLightbox">
            <div class="lightbox-caption" v-if="photos[currentPhotoIndex]?.caption">
              {{ photos[currentPhotoIndex].caption }}
            </div>
            <div class="lightbox-counter">
              {{ currentPhotoIndex + 1 }} / {{ photos.length }}
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  photos: {
    type: Array,
    required: true
  },
  isDarkMode: {
    type: Boolean,
    default: false
  }
});

const maxVisible = 5;
const lightboxOpen = ref(false);
const currentPhotoIndex = ref(0);
const loadedImages = ref(new Set());
const lightboxImageLoaded = ref(false);

// Intersection Observer для ленивой загрузки
let observer = null;
const imageRefs = new Map();

// Сколько фото реально показываем
const visiblePhotos = computed(() => {
  return props.photos.slice(0, maxVisible);
});

const gridClass = computed(() => {
  const count = visiblePhotos.value.length;
  if (count === 1) return 'grid-one';
  if (count === 2) return 'grid-two';
  if (count === 3) return 'grid-three';
  if (count === 4) return 'grid-four';
  return 'grid-five';
});

function isLastInCollage(index) {
  return index === maxVisible - 1 && props.photos.length > maxVisible;
}

function getItemClass(index) {
  const classes = [];
  if (index === 0 && props.photos.length === 3) classes.push('main-photo');
  return classes.join(' ');
}

function onImageLoad(src) {
  loadedImages.value.add(src);
}

function onImageError(src) {
  console.warn(`⚠️ Не удалось загрузить изображение: ${src}`);
  // Можно показать заглушку с ошибкой
}

function onLightboxError() {
  console.warn(`⚠️ Ошибка загрузки в лайтбоксе: ${props.photos[currentPhotoIndex.value]?.src}`);
  lightboxImageLoaded.value = false;
}

function openLightbox(index) {
  currentPhotoIndex.value = index;
  lightboxImageLoaded.value = false; // Сброс перед загрузкой
  lightboxOpen.value = true;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxOpen.value = false;
  document.body.style.overflow = '';
}

function nextPhoto() {
  if (currentPhotoIndex.value < props.photos.length - 1) {
    currentPhotoIndex.value++;
    lightboxImageLoaded.value = false; // Сброс для нового фото
  }
}

function prevPhoto() {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--;
    lightboxImageLoaded.value = false; // Сброс для нового фото
  }
}

// Настройка Intersection Observer для ленивой загрузки
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target.querySelector('img');
          if (img && img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
        }
      });
    },
    { threshold: 0.1, rootMargin: '200px' }
  );

  // Наблюдаем за каждым контейнером изображения
  // Это нужно будет добавить через ref в разметке
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style lang="scss" scoped>


.gallery-container {
  margin: 1.5rem 0;
}

.gallery-grid {
  display: grid;
  gap: 4px;
  border-radius: 12px;
  overflow: hidden;

  // Одна фотка
  &.grid-one {
    grid-template-columns: 1fr;

    .gallery-item {
      min-height: 200px;

      img {
        max-height: 500px;
        width: 100%;
        object-fit: contain;
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }

  // Две фотки
  &.grid-two {
    grid-template-columns: 1fr 1fr;

    .gallery-item {
      aspect-ratio: 1;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;

        &.portrait {
          object-fit: contain;
          background: rgba(0, 0, 0, 0.05);
        }
      }
    }
  }

  // Три фотки
  &.grid-three {
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 1fr 1fr;

    .gallery-item:first-child {
      grid-row: span 2;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .gallery-item:nth-child(2),
    .gallery-item:nth-child(3) {
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  // Четыре фотки
  &.grid-four {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    .gallery-item {
      aspect-ratio: 1;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  // Пять+ фоток
  &.grid-five {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr 1fr;

    .gallery-item {
      aspect-ratio: 1;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &:last-child {
        position: relative;

        .more-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
          backdrop-filter: blur(2px);
          z-index: 2;
        }
      }
    }
  }
}

.gallery-item {
  overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, 0.1);

  img {
    width: 100%;
    height: 100%;
    transition: transform 0.3s;
    object-fit: cover;

    &:hover {
      transform: scale(1.05);
    }
  }
}

// Плейсхолдер для загрузки
.image-placeholder {
  width: 100%;
  height: 100%;
  min-height: 150px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  animation: pulse 1.5s ease infinite;

  &.dark-theme-placeholder {
    background: rgba(0, 0, 0, 0.3);
  }

  .placeholder-icon {
    font-size: 2rem;
    opacity: 0.7;
  }

  .placeholder-text {
    font-size: 0.8rem;
    opacity: 0.7;
  }
}

// Лайтбокс
.lightbox-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

.lightbox-modal-content {
  position: relative;
  width: 90vw;
  max-width: 1200px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.lightbox-image-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(90vh - 100px);
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.lightbox-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .placeholder-icon {
    font-size: 4rem;
    opacity: 0.5;
    animation: pulse 1.5s ease infinite;
  }
}

.lightbox-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.5rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
}

.lightbox-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1);
  }

  &.prev { left: 16px; }
  &.next { right: 16px; }
}

.lightbox-footer {
  margin-top: 20px;
  text-align: center;
  color: white;
}

.lightbox-caption {
  padding: 8px 16px;
  font-size: 1rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  display: inline-block;
}

.lightbox-counter {
  margin-top: 8px;
  font-size: 0.9rem;
  opacity: 0.6;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

// Адаптивность
@media (max-width: 768px) {
  .lightbox-nav-btn {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .lightbox-nav-btn {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }
}
</style>
