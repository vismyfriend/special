<template>
  <button
    class="audio-button"
    :class="{ 'playing': isPlaying }"
    @click.stop="toggleAudio"
    :title="audioTitle"
  >
    <span class="audio-icon">{{ isPlaying ? '🔊' : '🔈' }}</span>
    <span v-if="showText">{{ text || 'Слушать' }}</span>
  </button>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';

const props = defineProps({
  audioSrc: {
    type: String,
    required: true
  },
  text: {
    type: String,
    default: ''
  },
  showText: {
    type: Boolean,
    default: false
  },
  audioTitle: {
    type: String,
    default: 'Воспроизвести'
  }
});

const isPlaying = ref(false);
let currentAudio = null;

// Ссылка на глобальный аудио менеджер (если есть)
const globalAudio = ref(null);

const toggleAudio = () => {
  // Если уже играет — останавливаем
  if (isPlaying.value) {
    stopAudio();
    return;
  }

  // Останавливаем любой другой аудио, который может играть
  stopAllAudio();

  // Запускаем новый
  playAudio();
};

const playAudio = () => {
  if (!props.audioSrc) return;

  currentAudio = new Audio(props.audioSrc);
  currentAudio.play();
  isPlaying.value = true;

  // Когда аудио закончилось — сбрасываем состояние
  currentAudio.onended = () => {
    isPlaying.value = false;
    currentAudio = null;
  };

  // Если произошла ошибка
  currentAudio.onerror = () => {
    console.error('Audio playback error:', props.audioSrc);
    isPlaying.value = false;
    currentAudio = null;
  };
};

const stopAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  isPlaying.value = false;
};

const stopAllAudio = () => {
  // Можно использовать глобальный менеджер или просто эмит
  // Для простоты — пусть родительский компонент управляет
  window.dispatchEvent(new CustomEvent('stop-all-audio'));
};

// Слушаем глобальное событие остановки
onBeforeUnmount(() => {
  stopAudio();
});
</script>

<style lang="scss" scoped>
.audio-button {
  background: linear-gradient(135deg, #ffd89b, #c7e9fb);
  border: none;
  border-radius: 30px;
  padding: 4px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  margin-left: 8px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &.playing {
    background: linear-gradient(135deg, #4ade80, #22c55e);
    color: white;
    animation: pulse-audio 1s ease-in-out infinite;
  }

  .audio-icon {
    font-size: 0.9rem;
  }
}

@keyframes pulse-audio {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
