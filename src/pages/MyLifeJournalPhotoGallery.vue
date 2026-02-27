<template>
  <div class="gallery-container">
    <!-- Сетка с фото -->
    <div class="gallery-grid" :class="gridClass">
      <div
        v-for="(photo, index) in visiblePhotos"
        :key="index"
        class="gallery-item"
        :class="getItemClass(index)"
        @click="openLightbox(index)"
      >
        <img
          :src="photo.src"
          :alt="photo.caption || 'Фото'"
          loading="lazy"
          :class="{ portrait: photo.orientation === 'portrait' }"
        />
        <!-- Затемнение с количеством, если фото много -->
        <div v-if="isLastInCollage(index)" class="more-overlay">
          +{{ photos.length - maxVisible }}
        </div>
      </div>
    </div>

    <!-- Лайтбокс как модальное окно -->
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

            <img
              :src="photos[currentPhotoIndex]?.src"
              :alt="photos[currentPhotoIndex]?.caption"
              class="lightbox-image"
              @click="closeLightbox"
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
import { ref, computed } from 'vue';

const props = defineProps({
  photos: {
    type: Array,
    required: true
  }
});

const maxVisible = 5;
const lightboxOpen = ref(false);
const currentPhotoIndex = ref(0);

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

function openLightbox(index) {
  currentPhotoIndex.value = index;
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
  }
}

function prevPhoto() {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--;
  }
}
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

    .gallery-item img {
      max-height: 500px;
      width: 100%;
      object-fit: contain;
      background: rgba(0, 0, 0, 0.05);
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
        }
      }
    }
  }
}

.gallery-item {
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.05);
    }
  }
}

// Модальное окно лайтбокса
.lightbox-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.18);
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
  max-height: calc(90vh - 100px);
}

.lightbox-image {
  max-width: 90vw;
  max-height: calc(90vh - 100px);
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

// Кнопка закрытия теперь позиционируется относительно контейнера с изображением
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
  z-index: 10001;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
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
  z-index: 10001;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-50%) scale(1.1);
  }

  &.prev {
    left: 16px;
  }

  &.next {
    right: 16px;
  }
}

.lightbox-footer {
  margin-top: 20px;
  text-align: center;
  color: white;
}

.lightbox-caption {
  padding: 8px 16px;
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  display: inline-block;
}

.lightbox-counter {
  font-size: 0.9rem;
  opacity: 0.6;
}

// Анимация появления
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// Адаптивность
@media (max-width: 768px) {
  .lightbox-close-btn {
    top: 8px;
    right: 8px;
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
  }

  .lightbox-nav-btn {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;

    &.prev {
      left: 20px;
    }

    &.next {
      right: 40px;
    }
  }
}

@media (max-width: 480px) {
  .lightbox-close-btn {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .lightbox-nav-btn {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }
}
</style>
