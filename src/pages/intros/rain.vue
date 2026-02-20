<template>
  <div class="weather-generator">
    <!-- Контейнер с погодой -->
    <div class="weather-scene" :class="{ 'snow-mode': isSnowMode }">
      <!-- Слой звезд с индивидуальным мерцанием -->
      <div v-if="starsOpacity > 0" class="stars-layer" :style="{ opacity: starsOpacity }">
        <div
          v-for="star in stars"
          :key="star.id"
          class="star"
          :style="getStarStyle(star)"
        ></div>
      </div>
      <!-- Слой дождя/снега (можно отключить) -->
      <div v-if="layers.precipitation" class="precipitation-layer">
        <div
          v-for="drop in precipitationDrops"
          :key="drop.id"
          :class="['precipitation-drop', { 'snow-flake': isSnowMode }]"
          :style="getDropStyle(drop)"
        ></div>
      </div>

      <!-- Слой бликов/тумана (для снега) -->
      <div v-if="isSnowMode && layers.fog" class="fog-layer"></div>
    </div>

    <!-- Панель управления -->

    <div class="control-panel" :class="{ 'panel-hidden': !showControls }">
      <button class="toggle-panel" @click="showControls = !showControls">
        {{ showControls ? '◀' : '▶' }}
      </button>

      <div class="panel-content" v-show="showControls">
        <h3>Создай свою погоду</h3>

        <!-- Режим дождь/снег -->
        <div class="mode-toggle">
          <button
            @click="setRainMode"
            :class="{ active: !isSnowMode }"
          >
            🌧 Дождь
          </button>
          <button
            @click="setSnowMode"
            :class="{ active: isSnowMode }"
          >
            🌨 Снег
          </button>
        </div>

        <!-- Слои (вкл/выкл) -->
        <div class="layers-control">
          <h4>Слои:</h4>

          <!-- Ползунок для звезд вместо чекбокса -->
          <div class="slider-group opacity-slider">
            <label>⭐ Звезды <span class="opacity-value">{{ Math.round(starsOpacity * 100) }}%</span></label>
            <input
              type="range"
              v-model.number="starsOpacity"
              min="0"
              max="1"
              step="0.01"
              class="opacity-range"
            >
          </div>

          <label class="toggle-switch">
            <input type="checkbox" v-model="layers.precipitation">
            <span class="toggle-label">🌧 Осадки</span>
          </label>

          <label class="toggle-switch" v-if="isSnowMode">
            <input type="checkbox" v-model="layers.fog">
            <span class="toggle-label">🌫 Туман</span>
          </label>
        </div>

        <!-- Основные настройки -->
        <div class="slider-group">
          <label>Интенсивность: {{ rainIntensity }}</label>
          <input
            type="range"
            v-model.number="rainIntensity"
            min="20"
            max="200"
            step="1"
          >
        </div>

        <div class="slider-group">
          <label>Скорость: {{ speedMultiplier.toFixed(1) }}x</label>
          <input
            type="range"
            v-model.number="speedMultiplier"
            min="0.3"
            max="2.5"
            step="0.1"
          >
        </div>

        <div class="slider-group">
          <label>Ветер: {{ windAngle }}°</label>
          <input
            type="range"
            v-model.number="windAngle"
            min="-45"
            max="45"
            step="1"
          >
        </div>

        <div class="slider-group">
          <label>Размер: {{ dropSize.toFixed(1) }}</label>
          <input
            type="range"
            v-model.number="dropSize"
            min="0.5"
            max="3.5"
            step="0.1"
          >
        </div>

        <!-- Пресеты погоды -->
        <div class="presets">
          <h4>Пресеты:</h4>
          <div class="preset-buttons">
            <button @click="setLightRain">🌧 Легкий</button>
            <button @click="setMediumRain">🌧 Средний</button>
            <button @click="setHeavyRain">🌧 Ливень</button>
            <button @click="setLightSnow">🌨 Легкий</button>
            <button @click="setMediumSnow">🌨 Средний</button>
            <button @click="setHeavySnow">🌨 Метель</button>
          </div>
        </div>

        <!-- Статистика -->
        <div class="stats">
          <span>Частиц: {{ precipitationDrops.length }}</span>
          <span>Режим: {{ isSnowMode ? 'Снег' : 'Дождь' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

// Состояния
const rainIntensity = ref(80);
const windAngle = ref(0);
const dropSize = ref(1.5);
const speedMultiplier = ref(1.0);
const isSnowMode = ref(false);
const showControls = ref(true);

// Прозрачность звезд (новый параметр)
const starsOpacity = ref(1.0); // от 0 до 1

// Слои (вкл/выкл) - убрали stars из layers
const layers = ref({
  precipitation: true,
  fog: false
});

// Массивы для частиц
const precipitationDrops = ref([]);
let nextDropId = 0;

// Анимационный фрейм
let animationFrame = null;
let starAnimationFrame = null;

// Создание капли дождя
const createRainDrop = (isInitial = false) => {
  const dropType = Math.random();
  let opacity;

  if (dropType < 0.3) {
    opacity = 0.3;
  } else if (dropType < 0.7) {
    opacity = 0.6;
  } else {
    opacity = 0.9;
  }

  // Делаем длину капли зависимой от размера и добавляем больше вариативности
  const baseSize = (0.8 + Math.random() * 1.5) * dropSize.value;
  // Длинные капли = быстрее падают и наоборот
  const lengthMultiplier = 1 + Math.random() * 1.5; // От 1x до 2.5x

  return {
    id: nextDropId++,
    x: Math.random() * 100,
    y: isInitial ? Math.random() * 100 : -5,
    size: baseSize,
    speed: (1.5 + Math.random() * 3) * speedMultiplier.value * (0.8 + lengthMultiplier * 0.2), // Скорость зависит от длины
    opacity: opacity,
    length: 15 + Math.random() * 35 * lengthMultiplier, // Длина от 15 до 50px
    windShift: (Math.random() - 0.5) * 10,
    // Добавляем небольшую вариацию в наклоне для каждой капли
    tiltOffset: (Math.random() - 0.5) * 5 // Небольшое отклонение в наклоне
  };
};

// Создание снежинки
const createSnowFlake = (isInitial = false) => {
  return {
    id: nextDropId++,
    x: Math.random() * 100,
    y: isInitial ? Math.random() * 100 : -2,
    size: (1 + Math.random() * 2.5) * dropSize.value,
    speed: (0.5 + Math.random() * 1.5) * speedMultiplier.value,
    opacity: 0.4 + Math.random() * 0.4,
    windShift: (Math.random() - 0.5) * 15,
    rotation: Math.random() * 360,
    drift: 0.5 + Math.random() * 1.5,
    driftSpeed: 0.5 + Math.random() * 1,
    phase: Math.random() * Math.PI * 2
  };
};

const stars = ref([]);
let nextStarId = 0;

// Создание звезды с индивидуальными параметрами
const createStar = () => {
  // Разные типы звезд для разнообразия
  const type = Math.random();
  let size, baseOpacity, twinkleSpeed, twinkleAmplitude;

  if (type < 0.2) {
    // Маленькие тусклые звезды (редко мерцают)
    size = 1 + Math.random() * 1;
    baseOpacity = 0.15 + Math.random() * 0.2;
    twinkleSpeed = 2 + Math.random() * 3;
    twinkleAmplitude = 0.3 + Math.random() * 0.3;
  } else if (type < 0.6) {
    // Средние звезды (нормальное мерцание)
    size = 1.5 + Math.random() * 1.5;
    baseOpacity = 0.3 + Math.random() * 0.3;
    twinkleSpeed = 1.5 + Math.random() * 2;
    twinkleAmplitude = 0.4 + Math.random() * 0.4;
  } else {
    // Яркие звезды (часто мерцают)
    size = 2 + Math.random() * 2;
    baseOpacity = 0.5 + Math.random() * 0.4;
    twinkleSpeed = 1 + Math.random() * 1.5;
    twinkleAmplitude = 0.5 + Math.random() * 0.5;
  }

  return {
    id: nextStarId++,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: size,
    baseOpacity: baseOpacity,
    twinkleSpeed: twinkleSpeed,
    twinklePhase: Math.random() * Math.PI * 2, // Случайная фаза для синусоиды
    twinkleAmplitude: twinkleAmplitude,
    color: Math.random() > 0.8 ? (Math.random() > 0.5 ? '#fff9e6' : '#e6f0ff') : 'white',
    glowSize: size * (2 + Math.random() * 2)
  };
};

// Генерация звезд
const generateStars = (count = 150) => {
  const newStars = [];
  for (let i = 0; i < count; i++) {
    newStars.push(createStar());
  }
  stars.value = newStars;
};

// Анимация звезд через requestAnimationFrame для более плавного мерцания
const animateStars = () => {
  if (starsOpacity.value <= 0) {
    // Если звезды не видны, все равно продолжаем анимацию, но не обновляем opacity
    starAnimationFrame = requestAnimationFrame(animateStars);
    return;
  }

  const now = Date.now() / 1000; // время в секундах

  stars.value = stars.value.map(star => {
    // Используем синусоиду для плавного мерцания
    // Каждая звезда имеет свою частоту и фазу
    const twinkle = Math.sin(now * star.twinkleSpeed + star.twinklePhase);
    // Преобразуем синус из [-1, 1] в диапазон от 0.2 до 1 с учетом амплитуды
    const minOpacity = Math.max(0.1, star.baseOpacity - star.twinkleAmplitude);
    const maxOpacity = Math.min(1, star.baseOpacity + star.twinkleAmplitude);
    const opacity = minOpacity + (twinkle + 1) * 0.5 * (maxOpacity - minOpacity);

    return {
      ...star,
      currentOpacity: opacity
    };
  });

  starAnimationFrame = requestAnimationFrame(animateStars);
};

// Стили для звезды
const getStarStyle = (star) => {
  return {
    left: `${star.x}%`,
    top: `${star.y}%`,
    width: `${star.size}px`,
    height: `${star.size}px`,
    backgroundColor: star.color,
    borderRadius: '50%',
    boxShadow: `0 0 ${star.glowSize}px ${star.color}`,
    opacity: star.currentOpacity || star.baseOpacity,
    transform: 'translateZ(0)',
    willChange: 'opacity',
    transition: 'box-shadow 0.2s ease',
    position: 'absolute'
  };
};

// Генерация начальных частиц
const generatePrecipitation = () => {
  const drops = [];
  const createDrop = isSnowMode.value ? createSnowFlake : createRainDrop;

  for (let i = 0; i < rainIntensity.value; i++) {
    drops.push(createDrop(true));
  }

  precipitationDrops.value = drops;
};

// Обновление позиций частиц - разделяем логику для дождя и снега
const updatePrecipitation = () => {
  precipitationDrops.value = precipitationDrops.value.map(drop => {
    if (isSnowMode.value) {
      // Логика для снега (с покачиванием)
      let newY = drop.y + drop.speed * 0.15;
      let newX = drop.x + (windAngle.value * 0.02) + (drop.windShift * 0.01);

      // Плавное покачивание снежинок
      newX += Math.sin(Date.now() * 0.002 * drop.driftSpeed + drop.phase) * 0.1 * drop.drift;

      // Если снежинка упала за пределы
      if (newY > 110) {
        newY = -5;
        newX = Math.random() * 100;
      }

      // Ограничиваем X координату
      if (newX < -5) newX = 105;
      if (newX > 105) newX = -5;

      return {
        ...drop,
        y: newY,
        x: newX,
        rotation: drop.rotation + 0.5 // Медленное вращение
      };
    } else {
      // Логика для дождя - строго вниз с учетом ветра, без покачиваний
      let newY = drop.y + drop.speed * 0.4; // Базовая скорость для дождя
      let newX = drop.x - (windAngle.value * 0.03); // Ветер обязательно минус - для правильного отображения

      // Небольшой естественный разброс, но без покачиваний
      newX += drop.windShift * 0.005;

      // Если капля упала за пределы
      if (newY > 110) {
        newY = -5;
        newX = Math.random() * 100;
      }

      // Ограничиваем X координату
      if (newX < -5) newX = 105;
      if (newX > 105) newX = -5;

      return {
        ...drop,
        y: newY,
        x: newX,
        // Для дождя не нужно вращение, просто фиксированный угол от ветра
      };
    }
  });

  animationFrame = requestAnimationFrame(updatePrecipitation);
};

// Стили для частиц
const getDropStyle = (drop) => {
  if (isSnowMode.value) {
    // Стили для снежинок
    return {
      left: `${drop.x}%`,
      top: `${drop.y}%`,
      width: `${drop.size * 2}px`,
      height: `${drop.size * 2}px`,
      opacity: drop.opacity,
      background: 'white',
      borderRadius: '50%',
      boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)',
      transform: `rotate(${drop.rotation}deg) translateZ(0)`,
      filter: 'blur(1px)',
      willChange: 'transform, top, left',
      position: 'absolute'
    };
  } else {
    // Стили для капель дождя
    const totalTilt = windAngle.value + (drop.tiltOffset || 0);

    return {
      left: `${drop.x}%`,
      top: `${drop.y}%`,
      width: `${drop.size}px`,
      height: `${drop.length}px`,
      opacity: drop.opacity,
      background: `linear-gradient(to bottom,
        rgba(200, 220, 255, 0.1) 0%,
        rgba(140, 180, 255, ${drop.opacity * 0.4}) 30%,
        rgba(140, 180, 255, ${drop.opacity * 0.8}) 70%,
        rgba(200, 220, 255, ${drop.opacity}) 100%)`,
      borderRadius: '50% 50% 0 0',
      boxShadow: drop.opacity > 0.7 ? '0 2px 8px rgba(140, 180, 255, 0.4)' : 'none',
      transform: `rotate(${totalTilt}deg) translateZ(0)`,
      filter: 'blur(0.3px)',
      willChange: 'transform, top, left',
      position: 'absolute'
    };
  }
};

// Переключение режимов
const setRainMode = () => {
  isSnowMode.value = false;
  layers.value.fog = false;
  generatePrecipitation();
};

const setSnowMode = () => {
  isSnowMode.value = true;
  layers.value.fog = true;
  generatePrecipitation();
};

// Пресеты для дождя
const setLightRain = () => {
  setRainMode();
  rainIntensity.value = 40;
  windAngle.value = 0;
  dropSize.value = 1.0;
  speedMultiplier.value = 0.8;
};

const setMediumRain = () => {
  setRainMode();
  rainIntensity.value = 80;
  windAngle.value = 5;
  dropSize.value = 1.5;
  speedMultiplier.value = 1.0;
};

const setHeavyRain = () => {
  setRainMode();
  rainIntensity.value = 150;
  windAngle.value = -5;
  dropSize.value = 2.0;
  speedMultiplier.value = 1.3;
};

// Пресеты для снега
const setLightSnow = () => {
  setSnowMode();
  rainIntensity.value = 30;
  windAngle.value = 0;
  dropSize.value = 2.0;
  speedMultiplier.value = 0.5;
};

const setMediumSnow = () => {
  setSnowMode();
  rainIntensity.value = 60;
  windAngle.value = 3;
  dropSize.value = 2.5;
  speedMultiplier.value = 0.8;
};

const setHeavySnow = () => {
  setSnowMode();
  rainIntensity.value = 100;
  windAngle.value = -8;
  dropSize.value = 3.0;
  speedMultiplier.value = 1.2;
};

// Следим за изменениями
watch([rainIntensity, isSnowMode], () => {
  generatePrecipitation();
});

watch([dropSize, speedMultiplier], () => {
  precipitationDrops.value = precipitationDrops.value.map(drop => {
    if (isSnowMode.value) {
      return {
        ...drop,
        size: (1 + Math.random() * 2.5) * dropSize.value,
        speed: (0.5 + Math.random() * 1.5) * speedMultiplier.value
      };
    } else {
      const baseSize = (0.8 + Math.random() * 1.5) * dropSize.value;
      const lengthMultiplier = 1 + Math.random() * 1.5;

      return {
        ...drop,
        size: baseSize,
        length: 15 + Math.random() * 35 * lengthMultiplier,
        speed: (1.5 + Math.random() * 3) * speedMultiplier.value * (0.8 + lengthMultiplier * 0.2),
        tiltOffset: (Math.random() - 0.5) * 5 // Обновляем и наклон
      };
    }
  });
});

// Жизненный цикл
onMounted(() => {
  generateStars(150); // Генерируем звезды
  generatePrecipitation();
  animationFrame = requestAnimationFrame(updatePrecipitation);
  starAnimationFrame = requestAnimationFrame(animateStars);
});

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  if (starAnimationFrame) {
    cancelAnimationFrame(starAnimationFrame);
  }
});
</script>

<style lang="scss" scoped>
.weather-generator {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #0b1120 0%, #030712 100%);
}

.weather-scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &.snow-mode {
    background: linear-gradient(180deg, #1a2635 0%, #0f172a 100%);
  }
}

// Слой звезд
.stars-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.2s ease; // Плавное изменение прозрачности
}

.star {
  position: absolute;
  border-radius: 50%;
  transform: translateZ(0);
  will-change: opacity;
}

// Слой тумана (для снега)
.fog-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(200, 220, 255, 0.05) 50%,
    transparent 100%);
  pointer-events: none;
  animation: fog 8s infinite alternate;
  z-index: 2;
}

.precipitation-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 3;
}

.precipitation-drop {
  position: absolute;
  pointer-events: none;
  transform: translateZ(0);
  backface-visibility: hidden;

  &.snow-flake {
    background: white;
    border-radius: 50%;
    filter: blur(1.5px);
  }
}

// Панель управления
.control-panel {
  position: absolute;
  bottom: 30px;
  left: 30px;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(100, 150, 255, 0.2);
  color: white;
  font-family: 'Segoe UI', sans-serif;
  z-index: 1000;
  transition: transform 0.3s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  max-height: 90vh;
  overflow-y: auto;

  &.panel-hidden {
    transform: translateX(-320px);

    .panel-content {
      opacity: 0;
      pointer-events: none;
    }
  }

  h3, h4 {
    margin: 0 0 15px 0;
    text-align: center;
    color: #aaccff;
    font-weight: 400;
    letter-spacing: 1px;
  }

  h4 {
    margin: 15px 0 10px 0;
    font-size: 14px;
    text-align: left;
    color: #9aaec9;
  }
}

.toggle-panel {
  position: absolute;
  top: 30px;
  width: 30px;
  height: 50px;
  background: rgba(30, 40, 60, 0.9);
  border: 1px solid rgba(100, 150, 255, 0.3);
  border-left: none;
  border-radius: 0 10px 10px 0;
  color: white;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(50, 70, 100, 0.9);
  }
}

.panel-content {
  padding: 25px;
  width: 280px;
  transition: opacity 0.3s ease;
}

// Переключатель режима
.mode-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;

  button {
    flex: 1;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(100, 150, 255, 0.2);
    border-radius: 12px;
    color: #9aaec9;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(74, 144, 226, 0.2);
    }

    &.active {
      background: #4a90e2;
      border-color: #4a90e2;
      color: white;
      box-shadow: 0 0 15px #4a90e2;
    }
  }
}

// Контроль слоев
.layers-control {
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
}

// Специальный стиль для ползунка прозрачности звезд
.opacity-slider {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
    color: #aaccff;

    .opacity-value {
      background: rgba(74, 144, 226, 0.3);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      color: #4a90e2;
      border: 1px solid rgba(74, 144, 226, 0.5);
    }
  }

  .opacity-range {
    width: 100%;
    height: 4px;
    -webkit-appearance: none;
    background: linear-gradient(90deg, #4a90e2 0%, #4a90e2 var(--progress), rgba(255,255,255,0.1) var(--progress));
    border-radius: 2px;
    outline: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      background: #4a90e2;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 10px #4a90e2;
      border: 2px solid rgba(255, 255, 255, 0.5);
    }
  }
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  cursor: pointer;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #4a90e2;
  }

  .toggle-label {
    font-size: 14px;
    color: #ddd;
  }
}

// Слайдеры
.slider-group {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
    color: #9aaec9;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input[type="range"] {
    width: 100%;
    height: 4px;
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    outline: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      background: #4a90e2;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 10px #4a90e2;
      border: 2px solid rgba(255, 255, 255, 0.5);
    }
  }
}

// Пресеты
.presets {
  margin: 25px 0 15px;
}

.preset-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;

  button {
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(100, 150, 255, 0.2);
    border-radius: 8px;
    color: #9aaec9;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(74, 144, 226, 0.2);
      color: white;
    }
  }
}

// Статистика
.stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #5f7a9f;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

// Анимации
@keyframes fog {
  0% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.1); }
  100% { opacity: 0.1; transform: scale(1); }
}

// Адаптация для мобильных
@media (max-width: 768px) {
  .control-panel {
    bottom: 20px;
    left: 20px;

    &.panel-hidden {
      transform: translateX(-300px);
    }
  }

  .panel-content {
    width: 250px;
    padding: 20px;
  }
}
</style>
