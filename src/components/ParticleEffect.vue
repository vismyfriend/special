<!-- ParticleEffect.vue -->
<template>
  <canvas ref="canvas" class="particle-effect-canvas"></canvas>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

// Пропсы для настройки компонента
const props = defineProps({
  // Цвет частиц
  particleColor: {
    type: String,
    default: 'rgba(255, 255, 255, 0.8)'
  },
  // Радиус взаимодействия (клик/касание)
  interactionRadius: {
    type: Number,
    default: 50
  },
  // Количество частиц при клике
  particlesPerClick: {
    type: Number,
    default: 30
  },
  // Время жизни частиц в секундах
  particleLifetime: {
    type: Number,
    default: 1.5
  },
  // Максимальная скорость разлета
  maxVelocity: {
    type: Number,
    default: 8
  },
  // Размер частиц
  particleSize: {
    type: Number,
    default: 2.5
  },
  // Использовать ли текстовые частицы (как в оригинале)
  useTextParticles: {
    type: Boolean,
    default: false
  },
  // Текст для текстовых частиц (если useTextParticles = true)
  text: {
    type: String,
    default: '✨'
  },
  // Размер шрифта для текстовых частиц
  fontSize: {
    type: Number,
    default: 24
  },
  // Цвет фона для текстовых частиц
  textColor: {
    type: String,
    default: '#ffffff'
  }
});

// События
const emit = defineEmits(['click', 'particleAnimationEnd']);

const canvas = ref(null);
let ctx = null;
let animationFrameId = null;
let particles = [];

// Класс частицы для эффекта клика
class ClickParticle {
  constructor(x, y, color, isText = false, textChar = null) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.color = color;
    this.size = props.particleSize;
    this.isText = isText;
    this.textChar = textChar;

    // Случайная скорость разлета
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * props.maxVelocity + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    // Случайное вращение для текстовых частиц
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;

    // Время жизни
    this.lifetime = props.particleLifetime;
    this.age = 0;
    this.alpha = 1;
  }

  update(deltaTime) {
    // Обновляем позицию
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    // Добавляем небольшое замедление
    this.vx *= 0.98;
    this.vy *= 0.98;

    // Добавляем гравитацию для более естественного падения
    this.vy += 2 * deltaTime;

    // Обновляем время жизни
    this.age += deltaTime;
    this.alpha = Math.max(0, 1 - (this.age / this.lifetime));

    // Обновляем вращение для текстовых частиц
    if (this.isText) {
      this.rotation += this.rotationSpeed * deltaTime * 60;
    }

    return this.age < this.lifetime;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;

    if (this.isText && this.textChar) {
      // Рисуем текстовую частицу
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.font = `${this.size * 1.5}px "Segoe UI Emoji", "Apple Color Emoji", system-ui, sans-serif`;
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fillText(this.textChar, 0, 0);
      ctx.restore();
    } else {
      // Рисуем обычную частицу
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Класс для статических частиц (как в оригинальном коде)
class StaticParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.origX = x;
    this.origY = y;
    this.color = color;
    this.size = props.particleSize;
    this.vx = 0;
    this.vy = 0;
    this.isBroken = false;
    this.easeFactor = 0.2;
  }

  update(interactionX, interactionY, interactionRadius, deltaTime) {
    // Если частица разлетается
    if (this.isBroken) {
      // Применяем движение
      this.x += this.vx * deltaTime * 60;
      this.y += this.vy * deltaTime * 60;

      // Замедление
      this.vx *= 0.95;
      this.vy *= 0.95;

      // Возвращение к исходной позиции
      const dx = this.origX - this.x;
      const dy = this.origY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 1) {
        this.x = this.origX;
        this.y = this.origY;
        this.isBroken = false;
        this.vx = 0;
        this.vy = 0;
      } else {
        this.x += dx * 0.05;
        this.y += dy * 0.05;
      }
    } else {
      // Проверяем взаимодействие с кликом/касанием
      const dx = this.x - interactionX;
      const dy = this.y - interactionY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < interactionRadius) {
        this.isBroken = true;
        // Случайное направление разлета
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * props.maxVelocity + 3;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
      }
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Создание текстовых статических частиц
const createTextParticles = () => {
  if (!canvas.value) return [];

  const tempCtx = canvas.value.getContext('2d');
  const particles = [];

  // Временно очищаем canvas
  tempCtx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  // Настройки для текста
  tempCtx.font = `${props.fontSize}px system-ui, "Segoe UI", "Apple Color Emoji"`;
  tempCtx.fillStyle = props.textColor;
  tempCtx.textAlign = 'center';
  tempCtx.textBaseline = 'middle';

  // Разбиваем текст на символы для создания отдельных частиц
  const characters = props.text.split('');
  const centerX = canvas.value.width / 2;
  const centerY = canvas.value.height / 2;
  const totalChars = characters.length;
  const radius = Math.min(canvas.value.width, canvas.value.height) * 0.3;

  characters.forEach((char, index) => {
    if (char === ' ') return;

    // Располагаем символы по кругу или в форме текста
    const angle = (index / totalChars) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    particles.push(new StaticParticle(x, y, props.particleColor));
  });

  return particles;
};

// Создание частиц при клике
const createClickParticles = (x, y) => {
  const newParticles = [];

  // Создаем частицы разного типа для красоты
  const emojis = ['✨', '⭐', '💫', '⚡', '💥', '🎯', '🌟', '💢'];

  for (let i = 0; i < props.particlesPerClick; i++) {
    const isText = Math.random() > 0.7;
    let color = props.particleColor;
    let textChar = null;

    if (isText) {
      textChar = emojis[Math.floor(Math.random() * emojis.length)];
      color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    } else {
      // Разноцветные частицы
      color = `hsl(${Math.random() * 360}, 80%, 65%)`;
    }

    newParticles.push(new ClickParticle(x, y, color, isText, textChar));
  }

  return newParticles;
};

// Обработка клика
const handleClick = (e) => {
  // Получаем координаты клика относительно canvas
  const rect = canvas.value.getBoundingClientRect();
  const scaleX = canvas.value.width / rect.width;
  const scaleY = canvas.value.height / rect.height;

  let clickX, clickY;

  if (e.touches) {
    // Touch event
    const touch = e.touches[0];
    clickX = (touch.clientX - rect.left) * scaleX;
    clickY = (touch.clientY - rect.top) * scaleY;
  } else {
    // Mouse event
    clickX = (e.clientX - rect.left) * scaleX;
    clickY = (e.clientY - rect.top) * scaleY;
  }

  // Создаем эффект разлетающихся частиц
  const clickParticles = createClickParticles(clickX, clickY);
  particles.push(...clickParticles);

  // Если есть статические частицы, активируем их разлет
  if (staticParticles.value.length > 0) {
    staticParticles.value.forEach(particle => {
      const dx = particle.x - clickX;
      const dy = particle.y - clickY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < props.interactionRadius) {
        particle.isBroken = true;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * props.maxVelocity + 3;
        particle.vx = Math.cos(angle) * speed;
        particle.vy = Math.sin(angle) * speed;
      }
    });
  }

  // Отправляем событие клика
  emit('click', { x: clickX, y: clickY });
};

// Анимация
let lastTimestamp = 0;
const animate = (timestamp) => {
  if (!canvas.value || !ctx) return;

  // Вычисляем delta time для плавной анимации
  const deltaTime = Math.min(0.033, (timestamp - lastTimestamp) / 1000);
  lastTimestamp = timestamp;

  // Очищаем canvas
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  // Обновляем и рисуем статические частицы
  if (staticParticles.value.length > 0 && interactionPoint.value) {
    staticParticles.value.forEach(particle => {
      particle.update(
        interactionPoint.value.x,
        interactionPoint.value.y,
        props.interactionRadius,
        deltaTime
      );
      particle.draw(ctx);
    });
  }

  // Обновляем и рисуем динамические частицы (от кликов)
  particles = particles.filter(particle => {
    const isAlive = particle.update(deltaTime);
    if (isAlive) {
      particle.draw(ctx);
    } else if (!isAlive) {
      emit('particleAnimationEnd');
    }
    return isAlive;
  });

  // Сбрасываем точку взаимодействия (чтобы частицы возвращались)
  if (interactionPoint.value) {
    setTimeout(() => {
      interactionPoint.value = null;
    }, 100);
  }

  animationFrameId = requestAnimationFrame(animate);
};

// Resize handler
const resizeCanvas = () => {
  if (!canvas.value) return;

  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;

  // Пересоздаем статические частицы при изменении размера
  if (props.useTextParticles) {
    staticParticles.value = createTextParticles();
  }
};

// Хранилище для статических частиц и точки взаимодействия
const staticParticles = ref([]);
const interactionPoint = ref(null);

// Обработчики взаимодействия
let currentInteractionTimer = null;

const handleInteraction = (x, y) => {
  interactionPoint.value = { x, y };

  // Автоматически сбрасываем через короткое время
  if (currentInteractionTimer) {
    clearTimeout(currentInteractionTimer);
  }
  currentInteractionTimer = setTimeout(() => {
    interactionPoint.value = null;
  }, 100);
};

const handleMouseMove = (e) => {
  const rect = canvas.value.getBoundingClientRect();
  const scaleX = canvas.value.width / rect.width;
  const scaleY = canvas.value.height / rect.height;

  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  handleInteraction(x, y);
};

const handleTouchMove = (e) => {
  e.preventDefault();
  if (e.touches && e.touches[0]) {
    const rect = canvas.value.getBoundingClientRect();
    const scaleX = canvas.value.width / rect.width;
    const scaleY = canvas.value.height / rect.height;

    const x = (e.touches[0].clientX - rect.left) * scaleX;
    const y = (e.touches[0].clientY - rect.top) * scaleY;

    handleInteraction(x, y);
  }
};

// Lifecycle hooks
onMounted(() => {
  if (!canvas.value) return;

  ctx = canvas.value.getContext('2d');
  resizeCanvas();

  // Создаем статические частицы если нужно
  if (props.useTextParticles) {
    staticParticles.value = createTextParticles();
  }

  // Добавляем обработчики событий
  canvas.value.addEventListener('click', handleClick);
  canvas.value.addEventListener('mousemove', handleMouseMove);
  canvas.value.addEventListener('touchstart', handleClick);
  canvas.value.addEventListener('touchmove', handleTouchMove);
  window.addEventListener('resize', resizeCanvas);

  // Запускаем анимацию
  animationFrameId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  if (canvas.value) {
    canvas.value.removeEventListener('click', handleClick);
    canvas.value.removeEventListener('mousemove', handleMouseMove);
    canvas.value.removeEventListener('touchstart', handleClick);
    canvas.value.removeEventListener('touchmove', handleTouchMove);
  }

  window.removeEventListener('resize', resizeCanvas);

  if (currentInteractionTimer) {
    clearTimeout(currentInteractionTimer);
  }
});
</script>

<style scoped>
.particle-effect-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto; /* Изменено с none на auto для обработки кликов */
  z-index: 1000;
  display: block;
  cursor: pointer;
}
</style>
