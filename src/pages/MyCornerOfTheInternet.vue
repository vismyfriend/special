
<template>
  <!-- Основной контейнер с фоновым изображением -->
  <div class="background">
    <!-- Canvas для эффекта частиц -->
    <canvas ref="canvas" class="particles-canvas"></canvas>

    <!-- Главное меню -->
    <nav class="main-menu" :class="{ 'active': isMenuOpen }">
      <ul>
        <li v-for="(item, index) in menuItems"
            :key="index"
            @mouseenter="handleMouseEnter(index)"
            @mouseleave="handleMouseLeave(index)">
          <a href="#" @click.prevent="toggleSubmenu(index)">
            {{ item.title }}
          </a>

          <!-- Подменю -->
          <transition name="fade">
            <ul class="submenu" v-if="activeSubmenu === index">
              <li v-for="(subItem, subIndex) in item.subItems" :key="subIndex">
                <a href="#"
                   @click.prevent="navigateTo(item.title, subItem)"
                   :target="subItem.url?.startsWith('http') ? '_blank' : ''">
                  {{ subItem.name || subItem }}
                </a>
              </li>
            </ul>
          </transition>
        </li>
      </ul>
    </nav>

    <!-- Добавляем overlay для затемнения -->
    <div class="menu-overlay"
         :class="{ 'active': isMenuOpen && activeSubmenu !== null }"
         @click="closeAllMenus"></div>

    <div class="app-container">
      <div class="menu-container">
        <button class="fancy-btn" @click="playEminem">Welcome</button>
        <button class="fancy-btn" @click="toggleRussian">
          <span>{{ isMenuOpen && currentLanguage === 'ru' ? 'Хорошо' : 'Привет' }}</span>
        </button>
        <button class="fancy-btn" @click="toggleEnglish">
          <span>{{ isMenuOpen && currentLanguage === 'en' ? 'Ok' : 'Hello' }}</span>
        </button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted, ref } from 'vue';

const playEminem = () => {
  const audioPath = new URL('../assets/audio/WithoutMeNoSpaces.mp3', import.meta.url).href;
  const audio = new Audio(audioPath);

  const volume = 0.3; // уровень громкости от 0 до 10
  audio.volume = Math.min(Math.max(volume / 10, 0), 1); // преобразуем в диапазон 0.0–1.0

  audio.play().catch((e) => {
    console.warn('Audio playback failed:', e);
  });
};

// ======================
// Данные для меню на разных языках
// ======================
const menuData = {
  en: [
    {
      title: 'About Me :',
      subItems: [
        { name: 'Portfolio', url: '' },
        { name: 'YouTube', url: '' },
        { name: 'VK', url: '' },
        { name: 'TikTok', url: '' },
        { name: 'Instagram', url: '' },
        { name: 'Facebook', url: '' },
        { name: 'Telegram', url: '' },
        { name: 'contacts ☝', url: '' }
      ]
    },
    {
      title: 'My Projects :',
      subItems: [
        { name: 'Travel', url: '' },
        { name: 'Study', url: '' },
        { name: 'Enjoy', url: '' },
        { name: 'Business', url: '' },
        { name: 'English', url: '' }
      ]
    },
    {
      title: 'My games:',
      subItems: [
        { name: 'Tap-clicker', url: '' },
        { name: 'Skeleton 3D', url: 'https://vismyfriend.itch.io/clicker-test' },
        { name: 'Platformer 2D', url: '' }
      ]
    },
    {
      title: 'English:',
      subItems: [
        { name: 'TOEFL', url: '' },
        { name: 'IELTS', url: '' },
        { name: 'Books', url: '' },
        { name: 'C2', url: '' },
        { name: 'C1', url: '' },
        { name: 'B2', url: '' },
        { name: 'B1', url: '' },
        { name: 'A2', url: '' },
        { name: 'A1', url: '' },
      ]
    },
    {
      title: 'S.P.E.C.I.A.L',
      subItems: [
        { name: 'App', url: '/' },
        { name: 'Website', url: '/games' }
      ]
    }
  ],
  ru: [
    {
      title: 'Обо мне :',
      subItems: [
        { name: 'Портфолио', url: '' },
        { name: 'YouTube', url: '' },
        { name: 'VK', url: '' },
        { name: 'TikTok', url: '' },
        { name: 'Instagram', url: '' },
        { name: 'Facebook', url: '' },
        { name: 'Telegram', url: '' },
        { name: 'контакты ☝', url: '' }
      ]
    },
    {
      title: 'Мои проекты:',
      subItems: [
        { name: 'Путешествия', url: '' },
        { name: 'Обучение', url: '' },
        { name: 'Удовольствия', url: '' },
        { name: 'Бизнес', url: '' },
        { name: 'Английский', url: '' }
      ]
    },
    {
      title: 'Мои игры:',
      subItems: [
        { name: 'Tap-clicker', url: '' },
        { name: 'Skeleton 3D', url: 'https://vismyfriend.itch.io/clicker-test' },
        { name: 'Platformer 2D', url: '' }
      ]
    },
    {
      title: 'Английский:',
      subItems: [
        { name: 'TOEFL', url: '' },
        { name: 'IELTS', url: '' },
        { name: 'Books', url: '' },
        { name: 'C2', url: '' },
        { name: 'C1', url: '' },
        { name: 'B2', url: '' },
        { name: 'B1', url: '' },
        { name: 'A2', url: '' },
        { name: 'A1', url: '' },
      ]
    },
    {
      title: 'S.P.E.C.I.A.L',
      subItems: [
        { name: 'App', url: '/' },
        { name: 'Сайт', url: '/games' }
      ]
    }
  ]
};
// ======================
// Audio Manager (полная версия)
// ======================
const audioManager = {
  sounds: {},
  audioContext: null,
  activeLoops: new Set(),
  isAudioAllowed: false,

  soundConfig: {
    helloSound: new URL('../assets/audio/magic_sound_short.mp3', import.meta.url).href,
    privetSound: '../assets/audio/trimmedStarsSound.mp3',
    withoutMe: '../assets/audio/WithoutMeNoSpaces.mp3',
    starsMysterySound: '../assets/audio/trimmedStarsSound.mp3'
  },

  async init() {
    try {
      // Create but don't start the context yet
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.audioContext.suspend(); // Start in suspended state
      await this.loadAllSounds();
      console.log('AudioManager initialized (suspended)');
    } catch (error) {
      console.error('AudioManager init failed:', error);
    }
  },

  async allowAudio() {
    if (!this.isAudioAllowed) {
      if (this.audioContext?.state === 'suspended') {
        await this.audioContext.resume();
      }
      this.isAudioAllowed = true;
      console.log('Audio allowed after user interaction');
    }
  },

  async loadAllSounds() {
    await Promise.all(
      Object.keys(this.soundConfig).map(name =>
        this.loadSound(name, this.soundConfig[name])
      )
      );
  },

  async loadSound(name, path) {
    try {
      const soundUrl = new URL(path, import.meta.url).href;
      const response = await fetch(soundUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      this.sounds[name] = {
        buffer: audioBuffer,
        sources: new Set()
      };
    } catch (error) {
      console.error(`Failed to load sound "${name}":`, error);
    }
  },

  async playSound(name, volume = 7, loopCount = 1) {
    // Разрешаем аудио при первом взаимодействии
    await this.allowAudio();

    if (!this.sounds[name]) {
      console.warn(`Sound "${name}" not loaded`);
      return;
    }

    // Останавливаем предыдущий звук, если это loop
    if (loopCount > 1) {
      this.stopSound(name);
    }

    this._playSound(name, volume, loopCount);
  },

  _playSound(name, volume, loopCount) {
    const sound = this.sounds[name];

    if (loopCount > 1) {
      if (this.activeLoops.has(name)) {
        return;
      }
      this.activeLoops.add(name);
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = sound.buffer;
    sound.sources.add(source);

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = Math.min(Math.max(volume, 0), 10) / 10;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    if (loopCount > 1) {
      source.loop = true;
      source.loopEnd = sound.buffer.duration * loopCount;
    }

    source.onended = () => {
      sound.sources.delete(source);
      if (loopCount > 1) {
        this.activeLoops.delete(name);
      }
    };

    source.start(0);

    if (loopCount > 1) {
      setTimeout(() => {
        if (sound.sources.has(source)) {
          source.stop();
        }
      }, sound.buffer.duration * loopCount * 1000);
    }
  },

  stopSound(name) {
    if (!this.sounds[name]) return;

    const sound = this.sounds[name];
    sound.sources.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        console.warn(`Error stopping sound "${name}":`, e);
      }
    });
    sound.sources.clear();
    this.activeLoops.delete(name);
  },

  stopAllSounds() {
    Object.keys(this.sounds).forEach(name => {
      this.stopSound(name);
    });
    this.activeLoops.clear();
  }
};

// ======================
// Инициализация компонента
// ======================
const router = useRouter();
const canvas = ref(null);
const isMenuOpen = ref(false);
const activeSubmenu = ref(null);
const currentLanguage = ref('en'); // 'en' или 'ru'
const menuItems = ref(menuData.en); // Изначально английская версия


// Метод для переключения языка и управления меню
const toggleEnglish = async () => {
  try {
    await audioManager.allowAudio(); // First ensure audio is allowed
    await audioManager.playSound('helloSound', 10, 2);

    if (!isMenuOpen.value) {
      currentLanguage.value = 'en';
      menuItems.value = menuData.en;
      isMenuOpen.value = true;
    } else if (currentLanguage.value === 'en') {
      isMenuOpen.value = false;
      activeSubmenu.value = null;
    } else {
      currentLanguage.value = 'en';
      menuItems.value = menuData.en;
    }
  } catch (error) {
    console.error('Error in toggleEnglish:', error);
  }
};

const toggleRussian = async () => {
  try {
    await audioManager.allowAudio(); // First ensure audio is allowed
    await audioManager.playSound('starsMysterySound', 4, 1);

    if (!isMenuOpen.value) {
      currentLanguage.value = 'ru';
      menuItems.value = menuData.ru;
      isMenuOpen.value = true;
    } else if (currentLanguage.value === 'ru') {
      isMenuOpen.value = false;
      activeSubmenu.value = null;
    } else {
      currentLanguage.value = 'ru';
      menuItems.value = menuData.ru;
    }
  } catch (error) {
    console.error('Error in toggleRussian:', error);
  }
};


// ======================
// Методы компонента
// ======================

// Методы для управления меню


const toggleSubmenu = (index) => {
  if (window.innerWidth < 769) {
    activeSubmenu.value = activeSubmenu.value === index ? null : index;
  }
};

const handleMouseEnter = (index) => {
  if (window.innerWidth >= 769 && isMenuOpen.value) {
    activeSubmenu.value = index;
  }
};

const handleMouseLeave = (index) => {
  if (window.innerWidth >= 769) {
    setTimeout(() => {
      if (activeSubmenu.value === index) {
        activeSubmenu.value = null;
      }
    }, 200);
  }
};

const closeAllMenus = () => {
  isMenuOpen.value = false;
  activeSubmenu.value = null;
};

const navigateTo = (section, subItem) => {
  closeAllMenus();
  try {
    if (typeof subItem === 'object' && subItem.url) {
      if (subItem.url.startsWith('http')) {
        window.open(subItem.url, '_blank');
      } else {
        router.push(subItem.url);
      }
    }
  } catch (err) {
    console.error("Navigation failed:", err);
  }
};

// ======================
// Эффект частиц
// ======================

// Функция для определения плотности частиц
const getDensity = () => {
  // Меньше частиц (3) на мобильных, больше (5) на десктопах
  return window.innerWidth < 768 ? 3 : 5;
};

// Объявляем переменные для эффекта частиц заранее
let animationFrameId;
let particles = [];
let mouseX = 0;
let mouseY = 0;
const hoverRadius = 20; // Радиус взаимодействия с курсором
const easeFactor = 0.2; // Коэффициент плавности возврата частиц
const text = "SPECIAL"; // Текст из частиц

// Класс для создания частиц
class Particle {
  constructor(x, y, color) {
    // Текущие координаты
    this.x = x;
    this.y = y;

    // Исходные координаты (куда возвращаются частицы)
    this.origX = x;
    this.origY = y;

    this.color = color; // Цвет частицы
    this.size = 1.5; // Размер частицы

    // Случайные скорости движения
    this.vx = Math.random() * 4 - 2;
    this.vy = Math.random() * 4 - 2;

    // Флаг "разлетания" частицы
    this.isBroken = false;
  }

  // Обновление позиции частицы
  update() {
    // Движение частицы
    this.x += this.vx;
    this.y += this.vy;

    // Расчет расстояния до курсора
    const dx = this.x - mouseX;
    const dy = this.y - (mouseY + 270); // Учет смещения canvas
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Активация разлета при приближении курсора
    if (distance < hoverRadius) {
      this.isBroken = true;
    }

    // Плавное возвращение к исходной позиции
    const localEase = this.isBroken ? 0.01 : easeFactor;
    this.x += (this.origX - this.x) * localEase;
    this.y += (this.origY - this.y) * localEase;

    // Сброс флага разлета при возвращении
    if (this.isBroken && Math.abs(this.x - this.origX) < 1 && Math.abs(this.y - this.origY) < 1) {
      this.isBroken = false;
    }
  }

  // Отрисовка частицы
  draw() {
    const ctx = canvas.value.getContext("2d");
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

// Изменение размера canvas при ресайзе
const resizeCanvas = () => {
  if (!canvas.value) return;
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;
};

// Инициализация частиц
const initParticles = () => {
  const ctx = canvas.value.getContext("2d");
  particles = [];
  const fontSize = Math.min(window.innerWidth * 0.2, 200); // Адаптивный размер шрифта
  const currentDensity = getDensity(); // Получаем плотность частиц

  // Рендерим текст для получения данных пикселей
  ctx.font = `${fontSize}px Outfit`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.value.width / 2, canvas.value.height / 2);

  // Получаем данные изображения текста
  const textWidth = ctx.measureText(text).width;
  const imageData = ctx.getImageData(
    canvas.value.width / 2 - textWidth / 2,
    canvas.value.height / 2 - fontSize / 2,
    textWidth,
    fontSize
  );

  // Очищаем canvas перед созданием частиц
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  // Создаем частицы на основе непрозрачных пикселей текста
  for (let y = 0; y < imageData.height; y += currentDensity) {
    for (let x = 0; x < imageData.width; x += currentDensity) {
      const index = (x + y * imageData.width) * 4;
      const alpha = imageData.data[index + 3];

      // Создаем частицу для непрозрачных пикселей
      if (alpha > 128) {
        const posX = x + canvas.value.width / 2 - textWidth / 2;
        const posY = y + canvas.value.height / 2 - fontSize / 2;
        particles.push(new Particle(posX, posY, "rgba(255, 255, 255, 0.8)"));
      }
    }
  }
};

// Анимация частиц
const animate = () => {
  if (!canvas.value) return; // Проверка на существование canvas

  const ctx = canvas.value.getContext("2d");
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  animationFrameId = requestAnimationFrame(animate);
};

// Обработчик движения мыши
const handleMouseMove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

// Обработчик касаний для мобильных устройств
const handleTouchMove = (e) => {
  if (e.touches && e.touches[0]) {
    // Получаем координаты касания
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY + 270; // Учитываем смещение canvas (top: -270px)

    // Обновляем позицию "курсора" для взаимодействия с частицами
    mouseX = touchX;
    mouseY = touchY;

    // Включаем разлёт для частиц в радиусе hoverRadius
    particles.forEach(p => {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < hoverRadius) {
        p.isBroken = true;
        p.vx = Math.random() * 4 - 2; // Случайная скорость по X
        p.vy = Math.random() * 4 - 2; // Случайная скорость по Y
      }
    });
  }
};

const handleTouchStart = (e) => {
  if (e.touches && e.touches[0]) {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY + 270; // Аналогичное смещение

    // Активируем разлёт ТОЛЬКО для частиц в радиусе hoverRadius
    particles.forEach(p => {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < hoverRadius) {
        p.isBroken = true;
        p.vx = Math.random() * 4 - 2;
        p.vy = Math.random() * 4 - 2;
      }
    });
  }
};

// Функция очистки эффекта частиц
const cleanupParticles = () => {
  // Остановить анимацию
  cancelAnimationFrame(animationFrameId);

  // Удалить обработчики событий
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('resize', resizeCanvas);
  window.removeEventListener('touchmove', handleTouchMove);
  window.removeEventListener('touchstart', handleTouchStart);
};

// ======================
// Хуки жизненного цикла
// ======================

// Регистрируем хуки ДО async операций
onUnmounted(() => {
  cleanupParticles();
});

onMounted(async () => {
  try {
    // 1. Инициализация аудио (в suspended состоянии)
    await audioManager.init();

    // 2. Инициализация эффекта частиц
    resizeCanvas();

    // Ждем загрузки шрифтов перед созданием частиц
    await document.fonts.ready;

    initParticles();
    animate();

    // 3. Добавляем обработчики событий
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', () => {
      resizeCanvas();
      // Задержка для стабилизации после ресайза
      setTimeout(initParticles, 100);
    });
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchstart', handleTouchStart);

  } catch (error) {
    console.error('Initialization error:', error);
  }
});
</script>
<style>
/* Глобальные стили без scoped (применяются ко всему приложению) */
html, body, #app {
  overflow: hidden !important;
  position: fixed !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  touch-action: none !important;
}

/* Особые стили для iOS Safari */
@supports (-webkit-touch-callout: none) {
  body {
    overscroll-behavior-y: none;
    -webkit-overflow-scrolling: auto;
  }
}
</style>

<style lang="scss" scoped>
/* Базовые стили */
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-image: url('../assets/images/MyFriendJonatanStars1.jpg');
  background-size: cover;
  background-position: center;
  z-index: 0;
  overflow: hidden;
}

.particles-canvas {
  position: fixed;
  top: -270px;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
  display: block;
}

.app-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 500px;
  z-index: 2;
  padding-bottom: 10px;
}

.closeThisPage {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 30px;
  background-color: transparent;
  border: 1px solid #ccc;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.menu-container {
  display: flex;
  flex-direction: column;
  transform: rotatex(10deg);
  animation: rotateAngle 6s linear infinite;
  gap: 15px;
}

.fancy-btn {
  user-select: none;
  display: block;
  position: relative;
  margin: 0.5em 0;
  padding: 0.8em 2.2em;
  cursor: pointer;

  /* Чистый стеклянный эффект */
  background: rgba(255, 255, 255, 0.15);

  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 0.4em;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.15),
    inset 0 0 12px rgba(255, 255, 255, 0.1);

  /* Текст */
  text-transform: uppercase;
  font-size: 1.7em;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

  /* Анимации */
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-style: preserve-3d;
  overflow: hidden;

  &:hover {
    background: rgba(186, 249, 255, 0.25);
    transform: translateY(-3px);
    box-shadow:
      0 6px 30px rgba(0, 0, 0, 0.25),
      inset 0 0 16px rgba(255, 255, 255, 0.2);
  }

  /* Эффект кристального преломления */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
        to bottom right,
        rgba(255, 255, 255, 0) 45%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0) 55%
    );
    transform: rotate(30deg);
    opacity: 0.7;
    transition: all 0.6s ease;
  }

  &:hover::before {
    top: 0;
    left: 0;
    opacity: 1;
  }

  /* Внутреннее свечение */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 75% 25%,
        rgba(255, 255, 255, 0.15) 0%,
        rgba(255, 255, 255, 0) 50%
    );
    border-radius: 0.4em;
  }

  span {
    position: relative;
    z-index: 1;
    mix-blend-mode: overlay;
  }
}

/* Адаптация для мобильных */
@media (max-width: 768px) {
  .fancy-btn {
    font-size: 1.6em;
    padding: 0.6em 1.5em;

  }
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 3;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;

  &.active {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
}

.main-menu {
  position: fixed;
  top: 0;
  right: -100%; /* Изменено с left на right */
  left: auto; /* Добавлено */
  display: flex;
  align-items: flex-end;
  max-width: 300px;
  height: 100%;

  /* Градиентный фон */
  background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0) 0%,          /* 1 часть - полностью прозрачная */
      rgba(0, 0, 0, 0.1) 10%,       /* 15% - все еще прозрачная */
      rgba(0, 0, 0, 0.15) 15%,       /* Начинаем переход к черному */
      rgba(0, 0, 0, 0.7) 40%,       /* Продолжаем затемнение */
      rgba(0, 0, 0, 0.9) 60%,       /* Почти черный */
      rgba(0, 0, 0, 1) 75%,         /* Полностью черный */
      rgba(0, 0, 0, 1) 100%         /* Остальная часть черная */
  );

  z-index: 4;
  padding: 20px;
  transition: all 0.3s ease;
  //overflow-y: auto;

  &.active {
    right: 0; /* Изменено с left на right */
    left: auto; /* Добавлено */
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 15px;
    position: relative;
  }

  a {
    color: white;
    text-decoration: none;
    font-size: 1.2em;
    display: block;
    padding: 10px;
    transition: all 0.3s;

    &:hover {
      color: #FFF65B;
    }
  }
}

.submenu {
  list-style: none;
  padding-left: 20px;
  margin-top: 5px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease;

  li {
    margin-bottom: 5px;
  }

  a {
    font-size: 1em;
    padding: 5px 10px;
  }
}

.main-menu li:hover .submenu,
.main-menu li:focus-within .submenu {
  max-height: 500px;
}

/* Анимации */
@keyframes rotateAngle {
  0%, 100% {
    transform: rotateY(0deg) rotateX(10deg);
    animation-timing-function: cubic-bezier(0.61, 1, 0.88, 1);
  }
  25% { transform: rotateY(20deg) rotateX(10deg); }
  75% { transform: rotateY(-20deg) rotateX(10deg); }
}

@keyframes translateWobble {
  0% { opacity: 0; transform: translate3d(0, 0, 0); }
  16% { transform: translate3d(calc(var(--z) * 160px), calc(var(--z) * 160px), calc(var(--z) * 160px)); }
  28% { opacity: 1; transform: translate3d(calc(var(--z) * 70px), calc(var(--z) * 70px), calc(var(--z) * 70px)); }
  44% { transform: translate3d(calc(var(--z) * 130px), calc(var(--z) * 130px), calc(var(--z) * 130px)); }
  59% { transform: translate3d(calc(var(--z) * 85px), calc(var(--z) * 85px), calc(var(--z) * 85px)); }
  73% { transform: translate3d(calc(var(--z) * 110px), calc(var(--z) * 110px), calc(var(--z) * 110px)); }
  88%, 100% { opacity: 1; transform: translate3d(calc(var(--z) * 100px), calc(var(--z) * 100px), calc(var(--z) * 100px)); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Адаптация для мобильных устройств */
@media (max-width: 768px) {
  .menu-container {
    transform: rotatex(5deg);
  }

  .fancy-btn {
    font-size: 1.6em;
    padding: 0.6em 1.5em;
  }
}

/* Десктопная версия */
@media (min-width: 769px) {
  .main-menu {
    left: auto;
    top: -100%;
    right: 0;
    width: 100%;
    max-width: none;
    height: auto;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;

    &.active {
      top: 0;
      left: auto;
    }

    ul {
      display: flex;
      gap: 30px;
    }

    li {
      margin-bottom: 0;
      position: relative;

      &:hover .submenu {
        display: block;
      }
    }
  }

  .submenu {
    position: absolute;
    top: 100%;
    left: 50%;

    transform: translateX(-50%);
    background: #000;
    min-width: 200px;
    padding: 10px;
    border-radius: 0 0 5px 5px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    display: none;
    max-height: none !important;

    &.active {
      display: block;
    }
  }
}


/* Десктопная версия */
@media (min-width: 769px) {
  .main-menu {
    left: auto;
    top: -100%;
    right: 0;
    width: 100%;
    max-width: none;
    height: 100px;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    padding: 15px 0;

    &.active {
      top: 0;
      left: auto;
    }

    > ul {
      display: flex;
      gap: 30px;
      position: relative;
    }

    li {
      margin-bottom: 0;
      position: relative;
      white-space: nowrap;

      &:hover .submenu,
      &:focus-within .submenu {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
        pointer-events: auto;
      }
    }
  }

  .submenu {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-10px);
    background: #000;
    min-width: 200px;
    padding: 10px;
    border-radius: 0 0 5px 5px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    display: block !important;
    max-height: none !important;
    margin-top: 10px;
    padding-left: 0;

    li {
      margin-bottom: 8px;
      white-space: nowrap;

      &:last-child {
        margin-bottom: 0;
      }
    }

    a {
      padding: 8px 15px;
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }
}

/* Анимации */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .menu-container {
    transform: rotatex(5deg);
    transition: transform 0.3s ease, padding-right 0.3s ease; /* Изменено с padding-left на padding-right */

    // Смещаем кнопки влево при открытом меню
    .main-menu.active ~ .app-container & {
      padding-right: 140px; /* Изменено с padding-left на padding-right */
      padding-left: 0; /* Добавлено */
    }
  }

  .fancy-btn {
    font-size: 1.6em;
    padding: 0.6em 1.5em;
  }
}

</style>
