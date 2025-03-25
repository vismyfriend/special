<template>
  <img class="backgroundImg" :src="currentBackgroundDay?.img" alt="">

  <div class="main-wrapper">
    <div class="wrapper">
      <router-view />
    </div>
  </div>

  <!-- Бегущая строка с названием трека -->
  <div class="track-name-container" v-show="volume > 0.05 && isMusicPlaying">
    <span class="track-name">{{ trackName }}</span>
  </div>

  <!-- Кнопка для включения музыки -->
  <button v-if="!isUserInteracted" @click="startMusicAtLevel(0.45)" class="music-toggle-btn">
    Включить музыку
  </button>

  <!-- Ползунок громкости (появляется после нажатия на кнопку) -->
  <div v-if="isUserInteracted" class="volume-slider-container">
    <input type="range" v-model="volume" min="0" max="1" step="0.01" @input="adjustVolume" class="volume-slider" />
  </div>

  <!-- Музыкальный элемент -->
  <audio ref="audio" :src="musicTrack" loop preload="auto"></audio>
</template>

<script setup>
import { ref, onMounted, defineExpose } from 'vue';

const currentBackgroundDay = ref(null);

const isMusicPlaying = ref(false);  // Состояние звука
const volume = ref(0);  // Изначальный уровень громкости (0 = выключена)
const isUserInteracted = ref(false); // Флаг для проверки, что пользователь взаимодействовал

const musicTrack = new URL('../assets/audio/Without Me Audio.mp3', import.meta.url).href;  // Путь к музыкальному треку

// Извлекаем название файла для отображения
const trackName = decodeURIComponent(musicTrack.split('/').pop().replace('.mp3', '').replace(/_/g, ' '));  // Декодируем URL и заменяем подчеркивания на пробелы



// Создаем ref для аудиофайла
const audio = ref(null);

// Функция для регулировки громкости
const adjustVolume = () => {
  if (audio.value) {
    // Применяем громкость с небольшой задержкой для корректности
    setTimeout(() => {
      audio.value.volume = volume.value;  // Устанавливаем громкость в зависимости от ползунка
    }, 100); // Задержка в 100 мс для обновления громкости на мобильных устройствах

    if (volume.value > 0 && !isMusicPlaying.value) {
      audio.value.play(); // Играем, если музыка не играет
      isMusicPlaying.value = true; // Включаем музыку
    } else if (volume.value === 0) {
      isMusicPlaying.value = false; // Если громкость 0, то музыка выключена
      audio.value.pause();
    }
  }
};


// Функция для начальной установки громкости на 45% и запуска музыки
const startMusicAtLevel = (level) => {
  isUserInteracted.value = true; // Устанавливаем флаг, что пользователь взаимодействовал
  volume.value = level; // Устанавливаем громкость
  if (audio.value) {
    audio.value.volume = volume.value; // Устанавливаем громкость сразу при старте
  }
  adjustVolume(); // Запускаем музыку и настраиваем громкость
};


const backgrounds = ref([
  { day: 0, img: new URL("../assets/images/background.jpg", import.meta.url).href },
  { day: 1, img: new URL("../assets/images/background2.jpg", import.meta.url).href },
  { day: 2, img: new URL("../assets/images/background1.jpg", import.meta.url).href },
  { day: 3, img: new URL("../assets/images/background2.jpg", import.meta.url).href },
  { day: 4, img: new URL("../assets/images/background3.jpg", import.meta.url).href },
  { day: 5, img: new URL("../assets/images/background4.jpg", import.meta.url).href },
  { day: 6, img: new URL("../assets/images/background3.jpg", import.meta.url).href },
  { day: 7, img: new URL("../assets/images/background3.jpg", import.meta.url).href },
]);

// Устанавливаем текущий фон в зависимости от дня недели
onMounted(() => {
  const currentDay = new Date().getDay();
  currentBackgroundDay.value = backgrounds.value.find(el => el.day === currentDay);
});

defineExpose({ audio });
</script>

<style lang="scss" scoped>
@import url(https://fonts.googleapis.com/css?family=Permanent+Marker);

.main-wrapper {
  display: flex;
  justify-content: center;

  .wrapper {
    min-width: 350px;
    max-width: 450px;
    display: flex;
    flex-direction: column;
  }
}

.backgroundImg {
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  object-fit: cover;
  z-index: -1;
  right: 0;
  bottom: 0;
}

.music-toggle-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 16px;
  z-index: 10;
}

.track-name-container {
  position: fixed;
  bottom: 50px;
  right: 20px;
  width: auto;
  overflow: hidden;
  z-index: 10;
}

.track-name {
  display: inline-block;
  white-space: nowrap;
  font-size: 18px;
  color: white;
  padding: 5px;
  animation: marquee 10s linear infinite;
  mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%);
  -webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%);
}

@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.volume-slider-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 200px;
  z-index: 10;
}

.volume-slider {
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 10px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #ff5e00;
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #ff5e00;
  border-radius: 50%;
  cursor: pointer;
}
</style>

