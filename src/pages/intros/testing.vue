<template>
  <div class="weather-generator">
    <!-- Контейнер с погодой -->
    <div class="weather-scene" :class="weatherClass">
      <!-- Градиент неба (меняется в зависимости от времени суток) -->
      <div class="sky-gradient" :style="skyGradientStyle"></div>

      <!-- Солнце/Луна (показываем для всех режимов, но с разной прозрачностью) -->
      <div v-if="showSunMoon" class="sun-moon" :class="sunMoonClass" :style="sunMoonStyle"></div>

      <!-- Облака (для всех режимов) -->
      <div v-if="showClouds" class="clouds-layer">
        <div
          v-for="cloud in clouds"
          :key="cloud.id"
          class="cloud"
          :style="getCloudStyle(cloud)"
        >
          <div class="cloud-part"></div>
          <div class="cloud-part"></div>
          <div class="cloud-part"></div>
        </div>
      </div>

      <!-- Слой звезд с индивидуальным мерцанием -->
      <div v-if="starsOpacity > 0" class="stars-layer" :style="{ opacity: starsOpacity }">
        <div
          v-for="star in stars"
          :key="star.id"
          class="star"
          :style="getStarStyle(star)"
        ></div>
      </div>

      <!-- Слой дождя/снега -->
      <div v-if="layers.precipitation && (weatherType === 'rain' || weatherType === 'snow')" class="precipitation-layer">
        <div
          v-for="drop in precipitationDrops"
          :key="drop.id"
          :class="['precipitation-drop', { 'snow-flake': weatherType === 'snow' }]"
          :style="getDropStyle(drop)"
        ></div>
      </div>

      <!-- Слой бликов/тумана (для снега) -->
      <div v-if="weatherType === 'snow' && layers.fog" class="fog-layer"></div>

      <!-- Эффект заката (лучи солнца) -->
      <div v-if="weatherType === 'sunset'" class="sunset-rays"></div>

      <!-- Легкая дымка -->
      <div v-if="layers.haze && hazeIntensity > 0" class="haze-layer" :style="{ opacity: hazeIntensity }"></div>
    </div>

    <!-- Панель управления -->
    <div class="control-panel" :class="{ 'panel-hidden': !showControls }">
      <button class="toggle-panel" @click="showControls = !showControls">
        {{ showControls ? '◀' : '▶' }}
      </button>

      <div class="panel-content" v-show="showControls">
        <h3>your special weather</h3>

        <!-- Режимы погоды -->
        <div class="mode-toggle weather-modes">
          <button
            @click="setClearMode"
            :class="{ active: weatherType === 'clear' }"
            title="Ясная погода"
          >
            ☀️ Ясно
          </button>
          <button
            @click="setSunsetMode"
            :class="{ active: weatherType === 'sunset' }"
            title="Закат"
          >
            🌅 Закат
          </button>
          <button
            @click="setRainMode"
            :class="{ active: weatherType === 'rain' }"
          >
            🌧 Дождь
          </button>
          <button
            @click="setSnowMode"
            :class="{ active: weatherType === 'snow' }"
          >
            🌨 Снег
          </button>
        </div>

        <!-- Слои (вкл/выкл) -->
        <div class="layers-control">
          <h4>Слои:</h4>

          <!-- Ползунок для звезд -->
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
            <input type="checkbox" v-model="layers.clouds">
            <span class="toggle-label">☁️ Облака</span>
          </label>

          <label class="toggle-switch" v-if="weatherType === 'rain' || weatherType === 'snow'">
            <input type="checkbox" v-model="layers.precipitation">
            <span class="toggle-label">🌧 Осадки</span>
          </label>

          <label class="toggle-switch" v-if="weatherType === 'snow'">
            <input type="checkbox" v-model="layers.fog">
            <span class="toggle-label">🌫 Туман</span>
          </label>

          <label class="toggle-switch">
            <input type="checkbox" v-model="layers.haze">
            <span class="toggle-label">🌫 Легкая дымка</span>
          </label>
        </div>

        <!-- УНИВЕРСАЛЬНЫЙ ПОЛЗУНОК ВРЕМЕНИ СУТОК (ДЛЯ ВСЕХ РЕЖИМОВ) -->
        <div class="extra-settings universal-time">
          <h4>Время суток: {{ timeOfDay === 'day' ? 'День' : timeOfDay === 'evening' ? 'Вечер' : 'Ночь' }}</h4>
          <div class="slider-group">
            <input
              type="range"
              v-model.number="timeOfDayValue"
              min="0"
              max="2"
              step="0.01"
              @input="updateTimeOfDay"
            >
            <div class="time-labels">
              <span>🌙 Ночь</span>
              <span>☀️ День</span>
              <span>🌙 Вечер</span>
            </div>
          </div>
        </div>

        <!-- Настройки для ясной погоды -->
        <template v-if="weatherType === 'clear'">
          <div class="slider-group">
            <label>Интенсивность дымки: {{ Math.round(hazeIntensity * 100) }}%</label>
            <input
              type="range"
              v-model.number="hazeIntensity"
              min="0"
              max="0.5"
              step="0.01"
            >
          </div>
        </template>

        <!-- Настройки для дождя/снега -->
        <template v-if="weatherType === 'rain' || weatherType === 'snow'">
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
        </template>

        <!-- Пресеты погоды -->
        <div class="presets">
          <h4>Пресеты:</h4>
          <div class="preset-buttons">
            <button @click="setClearDay">☀️ Ясный день</button>
            <button @click="setClearEvening">🌆 Ясный вечер</button>
            <button @click="setClearNight">🌙 Ясная ночь</button>
            <button @click="setGoldenHour">🌅 Золотой час</button>
            <button @click="setSunset">🌇 Закат</button>
            <button @click="setLightRain">🌧 Легкий дождь</button>
            <button @click="setMediumRain">🌧 Средний дождь</button>
            <button @click="setHeavyRain">🌧 Ливень</button>
            <button @click="setLightSnow">🌨 Легкий снег</button>
            <button @click="setMediumSnow">🌨 Средний снег</button>
            <button @click="setHeavySnow">🌨 Метель</button>
          </div>
        </div>

        <!-- Статистика -->
        <div class="stats">
          <span>{{ weatherType === 'clear' ? 'Ясно' : weatherType === 'sunset' ? 'Закат' : weatherType === 'rain' ? 'Дождь' : 'Снег' }}</span>
          <span>{{ timeOfDay === 'day' ? 'День' : timeOfDay === 'evening' ? 'Вечер' : 'Ночь' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';

// Тип погоды
const weatherType = ref('clear'); // 'clear', 'sunset', 'rain', 'snow'

// Время суток (для градиента) - теперь работает для всех режимов!
const timeOfDayValue = ref(1); // 0 - ночь, 1 - день, 2 - вечер/закат
const timeOfDay = computed(() => {
  if (timeOfDayValue.value < 0.5) return 'night';
  if (timeOfDayValue.value < 1.5) return 'day';
  return 'evening';
});

// Интенсивность дымки
const hazeIntensity = ref(0.2);

// Состояния для осадков
const rainIntensity = ref(80);
const windAngle = ref(0);
const dropSize = ref(1.5);
const speedMultiplier = ref(1.0);
const showControls = ref(true);

// Прозрачность звезд
const starsOpacity = ref(0.8);

// Слои
const layers = ref({
  clouds: true,
  precipitation: true,
  fog: false,
  haze: true
});

// Массивы для частиц
const precipitationDrops = ref([]);
let nextDropId = 0;

// Облака
const clouds = ref([]);
let nextCloudId = 0;

// Звезды
const stars = ref([]);
let nextStarId = 0;

// Анимационные фреймы
let animationFrame = null;
let starAnimationFrame = null;
let cloudAnimationFrame = null;

// Класс для weather-scene
const weatherClass = computed(() => {
  return {
    'clear-mode': weatherType.value === 'clear',
    'sunset-mode': weatherType.value === 'sunset',
    'rain-mode': weatherType.value === 'rain',
    'snow-mode': weatherType.value === 'snow'
  };
});

// Показывать солнце/луну (для всех режимов, но с разной прозрачностью)
const showSunMoon = computed(() => {
  // Для дождя и снега показываем только если не ночь
  if (weatherType.value === 'rain' || weatherType.value === 'snow') {
    return timeOfDay.value !== 'night';
  }
  return weatherType.value === 'clear' || weatherType.value === 'sunset';
});

// Класс для солнца/луны
const sunMoonClass = computed(() => {
  if (timeOfDay.value === 'night') return 'moon';
  return 'sun';
});

// Стиль для солнца/луны
const sunMoonStyle = computed(() => {
  let top, left, size, glow, opacity = 1;

  if (weatherType.value === 'sunset') {
    top = '70%';
    left = '70%';
    size = '120px';
    glow = '80px';
  } else if (weatherType.value === 'rain' || weatherType.value === 'snow') {
    // Для дождя/снега солнце/луна более тусклые
    top = timeOfDay.value === 'night' ? '15%' : '15%';
    left = timeOfDay.value === 'night' ? '15%' : '80%';
    size = '50px';
    glow = '30px';
    opacity = 0.4; // Полупрозрачное сквозь облака
  } else {
    if (timeOfDay.value === 'day') {
      top = '15%';
      left = '80%';
      size = '80px';
      glow = '100px';
    } else if (timeOfDay.value === 'evening') {
      top = '25%';
      left = '75%';
      size = '70px';
      glow = '60px';
    } else {
      top = '15%';
      left = '15%';
      size = '60px';
      glow = '40px';
    }
  }

  return {
    top,
    left,
    width: size,
    height: size,
    opacity,
    boxShadow: `0 0 ${glow}px ${timeOfDay.value === 'night' ? '#fff9e6' : '#ffd700'}`
  };
});

// Градиент неба - теперь зависит от времени суток для всех режимов!
const skyGradientStyle = computed(() => {
  // База времени суток
  const timeGradients = {
    day: 'linear-gradient(180deg, #87CEEB 0%, #87CEEB 70%, #F0E68C 100%)',
    evening: 'linear-gradient(180deg, #FFB6C1 0%, #FFA07A 30%, #FF8C00 70%, #4A2511 100%)',
    night: 'linear-gradient(180deg, #0b1120 0%, #030712 100%)'
  };

  // Для заката - особый градиент
  if (weatherType.value === 'sunset') {
    return {
      background: 'radial-gradient(circle at 70% 70%, #ff7f50 0%, #ff4500 30%, #8b4513 70%, #2c1810 100%)'
    };
  }

  // Для дождя - смешиваем с базовым градиентом времени суток
  if (weatherType.value === 'rain') {
    const baseGradient = timeGradients[timeOfDay.value];
    // Затемняем для дождя
    return {
      background: baseGradient,
      filter: 'brightness(0.7) saturate(1.2)'
    };
  }

  // Для снега - смешиваем с базовым градиентом времени суток
  if (weatherType.value === 'snow') {
    const baseGradient = timeGradients[timeOfDay.value];
    // Делаем более светлым/холодным для снега
    return {
      background: baseGradient,
      filter: 'brightness(1.2) saturate(0.8) hue-rotate(-10deg)'
    };
  }

  // Ясная погода - чистый градиент времени суток
  return {
    background: timeGradients[timeOfDay.value]
  };
});

// Показывать облака
const showClouds = computed(() => {
  return layers.value.clouds;
});

// Создание облака
const createCloud = () => {
  return {
    id: nextCloudId++,
    x: Math.random() * 100,
    y: 10 + Math.random() * 30,
    size: 0.5 + Math.random() * 1.5,
    speed: 0.02 + Math.random() * 0.05,
    opacity: 0.3 + Math.random() * 0.4,
  };
};

// Генерация облаков
const generateClouds = (count = 8) => {
  const newClouds = [];
  for (let i = 0; i < count; i++) {
    newClouds.push(createCloud());
  }
  clouds.value = newClouds;
};

// Анимация облаков
const animateClouds = () => {
  if (!layers.value.clouds) {
    cloudAnimationFrame = requestAnimationFrame(animateClouds);
    return;
  }

  clouds.value = clouds.value.map(cloud => {
    let newX = cloud.x + cloud.speed;

    if (newX > 120) {
      newX = -20;
    }

    return {
      ...cloud,
      x: newX
    };
  });

  cloudAnimationFrame = requestAnimationFrame(animateClouds);
};

// Стиль для облака
const getCloudStyle = (cloud) => {
  return {
    left: `${cloud.x}%`,
    top: `${cloud.y}%`,
    transform: `scale(${cloud.size})`,
    opacity: cloud.opacity,
    position: 'absolute',
    filter: 'blur(5px)',
    zIndex: 2
  };
};

// Создание капли дождя
const createRainDrop = (isInitial = false) => {
  const baseSize = (0.8 + Math.random() * 1.5) * dropSize.value;
  const lengthMultiplier = 1 + Math.random() * 1.5;

  return {
    id: nextDropId++,
    x: Math.random() * 100,
    y: isInitial ? Math.random() * 100 : -5,
    size: baseSize,
    speed: (1.5 + Math.random() * 3) * speedMultiplier.value * (0.8 + lengthMultiplier * 0.2),
    opacity: 0.3 + Math.random() * 0.6,
    length: 15 + Math.random() * 35 * lengthMultiplier,
    windShift: (Math.random() - 0.5) * 10,
    tiltOffset: (Math.random() - 0.5) * 5
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

// Создание звезды
const createStar = () => {
  const type = Math.random();
  let size, baseOpacity, twinkleSpeed, twinkleAmplitude;

  if (type < 0.2) {
    size = 1 + Math.random() * 1;
    baseOpacity = 0.15 + Math.random() * 0.2;
    twinkleSpeed = 2 + Math.random() * 3;
    twinkleAmplitude = 0.3 + Math.random() * 0.3;
  } else if (type < 0.6) {
    size = 1.5 + Math.random() * 1.5;
    baseOpacity = 0.3 + Math.random() * 0.3;
    twinkleSpeed = 1.5 + Math.random() * 2;
    twinkleAmplitude = 0.4 + Math.random() * 0.4;
  } else {
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
    twinklePhase: Math.random() * Math.PI * 2,
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

// Анимация звезд
const animateStars = () => {
  if (starsOpacity.value <= 0) {
    starAnimationFrame = requestAnimationFrame(animateStars);
    return;
  }

  const now = Date.now() / 1000;

  stars.value = stars.value.map(star => {
    const twinkle = Math.sin(now * star.twinkleSpeed + star.twinklePhase);
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
    position: 'absolute'
  };
};

// Генерация начальных частиц
const generatePrecipitation = () => {
  if (weatherType.value !== 'rain' && weatherType.value !== 'snow') {
    precipitationDrops.value = [];
    return;
  }

  const drops = [];
  const createDrop = weatherType.value === 'snow' ? createSnowFlake : createRainDrop;

  for (let i = 0; i < rainIntensity.value; i++) {
    drops.push(createDrop(true));
  }

  precipitationDrops.value = drops;
};

// Обновление позиций частиц
const updatePrecipitation = () => {
  if (weatherType.value !== 'rain' && weatherType.value !== 'snow') {
    animationFrame = requestAnimationFrame(updatePrecipitation);
    return;
  }

  precipitationDrops.value = precipitationDrops.value.map(drop => {
    if (weatherType.value === 'snow') {
      let newY = drop.y + drop.speed * 0.15;
      let newX = drop.x + (windAngle.value * 0.02) + (drop.windShift * 0.01);
      newX += Math.sin(Date.now() * 0.002 * drop.driftSpeed + drop.phase) * 0.1 * drop.drift;

      if (newY > 110) {
        newY = -5;
        newX = Math.random() * 100;
      }

      if (newX < -5) newX = 105;
      if (newX > 105) newX = -5;

      return {
        ...drop,
        y: newY,
        x: newX,
        rotation: drop.rotation + 0.5
      };
    } else {
      let newY = drop.y + drop.speed * 0.4;
      let newX = drop.x - (windAngle.value * 0.03);
      newX += drop.windShift * 0.005;

      if (newY > 110) {
        newY = -5;
        newX = Math.random() * 100;
      }

      if (newX < -5) newX = 105;
      if (newX > 105) newX = -5;

      return {
        ...drop,
        y: newY,
        x: newX
      };
    }
  });

  animationFrame = requestAnimationFrame(updatePrecipitation);
};

// Стили для частиц
const getDropStyle = (drop) => {
  if (weatherType.value === 'snow') {
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

// Обновление времени суток
const updateTimeOfDay = () => {
  // Автоматически регулируем звезды в зависимости от времени
  if (timeOfDay.value === 'night') {
    starsOpacity.value = 1.0;
  } else if (timeOfDay.value === 'evening') {
    starsOpacity.value = 0.5;
  } else {
    starsOpacity.value = 0.2;
  }
};

// Переключение режимов
const setClearMode = () => {
  weatherType.value = 'clear';
  layers.value.precipitation = false;
  layers.value.fog = false;
  generateClouds();
  updateTimeOfDay();
};

const setSunsetMode = () => {
  weatherType.value = 'sunset';
  layers.value.precipitation = false;
  layers.value.fog = false;
  timeOfDayValue.value = 2; // Устанавливаем вечер
  generateClouds(5);
  updateTimeOfDay();
};

const setRainMode = () => {
  weatherType.value = 'rain';
  layers.value.precipitation = true;
  layers.value.fog = false;
  generatePrecipitation();
  updateTimeOfDay();
};

const setSnowMode = () => {
  weatherType.value = 'snow';
  layers.value.precipitation = true;
  layers.value.fog = true;
  generatePrecipitation();
  updateTimeOfDay();
};

// Пресеты для ясной погоды
const setClearDay = () => {
  setClearMode();
  timeOfDayValue.value = 1;
  hazeIntensity.value = 0.1;
  updateTimeOfDay();
};

const setClearEvening = () => {
  setClearMode();
  timeOfDayValue.value = 1.8;
  hazeIntensity.value = 0.3;
  updateTimeOfDay();
};

const setClearNight = () => {
  setClearMode();
  timeOfDayValue.value = 0;
  hazeIntensity.value = 0;
  updateTimeOfDay();
};

const setGoldenHour = () => {
  setClearMode();
  timeOfDayValue.value = 1.3;
  hazeIntensity.value = 0.2;
  updateTimeOfDay();
};

const setSunset = () => {
  setSunsetMode();
  updateTimeOfDay();
};

// Пресеты для дождя
const setLightRain = () => {
  setRainMode();
  rainIntensity.value = 40;
  windAngle.value = 0;
  dropSize.value = 1.0;
  speedMultiplier.value = 0.8;
  timeOfDayValue.value = 1; // День
  updateTimeOfDay();
};

const setMediumRain = () => {
  setRainMode();
  rainIntensity.value = 80;
  windAngle.value = 5;
  dropSize.value = 1.5;
  speedMultiplier.value = 1.0;
  timeOfDayValue.value = 1; // День
  updateTimeOfDay();
};

const setHeavyRain = () => {
  setRainMode();
  rainIntensity.value = 150;
  windAngle.value = -5;
  dropSize.value = 2.0;
  speedMultiplier.value = 1.3;
  timeOfDayValue.value = 0.8; // Пасмурно
  updateTimeOfDay();
};

// Пресеты для снега
const setLightSnow = () => {
  setSnowMode();
  rainIntensity.value = 30;
  windAngle.value = 0;
  dropSize.value = 2.0;
  speedMultiplier.value = 0.5;
  timeOfDayValue.value = 1; // День
  updateTimeOfDay();
};

const setMediumSnow = () => {
  setSnowMode();
  rainIntensity.value = 60;
  windAngle.value = 3;
  dropSize.value = 2.5;
  speedMultiplier.value = 0.8;
  timeOfDayValue.value = 1; // День
  updateTimeOfDay();
};

const setHeavySnow = () => {
  setSnowMode();
  rainIntensity.value = 100;
  windAngle.value = -8;
  dropSize.value = 3.0;
  speedMultiplier.value = 1.2;
  timeOfDayValue.value = 0.5; // Сумерки
  updateTimeOfDay();
};

// Следим за изменениями
watch([rainIntensity, weatherType], () => {
  if (weatherType.value === 'rain' || weatherType.value === 'snow') {
    generatePrecipitation();
  }
});

watch([dropSize, speedMultiplier], () => {
  if (weatherType.value === 'rain' || weatherType.value === 'snow') {
    generatePrecipitation(); // Полностью пересоздаем для простоты
  }
});

watch(timeOfDay, () => {
  updateTimeOfDay();
});

// Жизненный цикл
onMounted(() => {
  generateStars(150);
  generateClouds();
  generatePrecipitation();
  animationFrame = requestAnimationFrame(updatePrecipitation);
  starAnimationFrame = requestAnimationFrame(animateStars);
  cloudAnimationFrame = requestAnimationFrame(animateClouds);
  updateTimeOfDay();
});

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  if (starAnimationFrame) cancelAnimationFrame(starAnimationFrame);
  if (cloudAnimationFrame) cancelAnimationFrame(cloudAnimationFrame);
});
</script>

<style lang="scss" scoped>
/* Стили остаются без изменений, только добавим: */

.universal-time {
  margin: 20px 0;
  padding: 15px;
  background: rgba(74, 144, 226, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(74, 144, 226, 0.3);

  h4 {
    margin-top: 0;
    color: #4a90e2;
  }
}

// Остальные стили остаются точно такими же, как у вас были
.weather-generator {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.weather-scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: background 1s ease;
}

.sky-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: background 1s ease;
  z-index: 0;
}

.sun-moon {
  position: absolute;
  border-radius: 50%;
  z-index: 1;
  transition: all 1s ease;

  &.sun {
    background: radial-gradient(circle at 30% 30%, #fff9e6, #ffd700);
    box-shadow: 0 0 100px #ffd700;
  }

  &.moon {
    background: radial-gradient(circle at 30% 30%, #fff9e6, #e6e6fa);
    box-shadow: 0 0 60px #fff9e6;
  }
}

.clouds-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.cloud {
  position: absolute;
  filter: blur(8px);

  .cloud-part {
    position: absolute;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;

    &:nth-child(1) {
      width: 60px;
      height: 40px;
      left: -20px;
      top: 0;
    }

    &:nth-child(2) {
      width: 80px;
      height: 50px;
      left: 0;
      top: -15px;
    }

    &:nth-child(3) {
      width: 70px;
      height: 45px;
      left: 30px;
      top: -5px;
    }
  }
}

.stars-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.2s ease;
}

.star {
  position: absolute;
  border-radius: 50%;
  transform: translateZ(0);
  will-change: opacity;
}

.sunset-rays {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 70% 70%,
    rgba(255, 140, 0, 0.3) 0%,
    rgba(255, 69, 0, 0.2) 30%,
    transparent 70%);
  z-index: 1;
  pointer-events: none;
  animation: rays 8s infinite alternate;
}

.haze-layer {
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
  z-index: 2;
  mix-blend-mode: overlay;
}

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
    font-family: Special_f1;
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
  width: 380px;
  transition: opacity 0.3s ease;
}

.weather-modes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 25px;

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
    }

    &.active {
      background: #4a90e2;
      border-color: #4a90e2;
      color: white;
      box-shadow: 0 0 15px #4a90e2;
    }
  }
}

.layers-control {
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
}

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

.extra-settings {
  margin-bottom: 20px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
}

.time-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 12px;
  color: #9aaec9;
}

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

.presets {
  margin: 25px 0 15px;
}

.preset-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 5px;

  button {
    padding: 8px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(100, 150, 255, 0.2);
    border-radius: 6px;
    color: #9aaec9;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      background: rgba(74, 144, 226, 0.2);
      color: white;
    }
  }
}

.stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #5f7a9f;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes fog {
  0% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.1); }
  100% { opacity: 0.1; transform: scale(1); }
}

@keyframes rays {
  0% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.05); }
  100% { opacity: 0.2; transform: scale(1); }
}

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

  .preset-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
