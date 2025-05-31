<template>
  <div class="game-container">
    <button
      id="tap-button"
      @click="handleTap"
      @touchstart="handleTap"
      ref="buttonRef"
    >Tap Me!</button>
    <div class="counter">Вы увидели: <span>{{ counter }}</span></div>

    <Teleport to="body">
      <div
        v-for="word in flyingWords"
        :key="word.id"
        class="flying-word"
        :style="word.style"
      >
        {{ word.text }}
      </div>
    </Teleport>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import shortWordsData from '../dataForGames/short-words-data';

// Метатег для viewport (добавляется динамически)
onMounted(() => {
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
  document.head.appendChild(meta);

  // Предотвращаем двойной тап на всей странице
  document.addEventListener('dblclick', preventZoom);
  document.addEventListener('touchstart', preventZoom, { passive: false });
});

function preventZoom(e) {
  if (e.touches && e.touches.length > 1) {
    e.preventDefault();
    e.stopPropagation();
  }
}

const counter = ref(0);
const flyingWords = ref([]);
const buttonRef = ref(null);

// Собираем все английские слова из разных массивов файла
const allEnglishWords = [
  // Из оригинального кликера
  "Good Job", "Great", "Tap again", "Vismyfriend", "hamster",
  "apple", "banana", "cherry", "date", "elderberry",

  // Из shortWordsData
  ...shortWordsData.devModeNumbersFast.map(item => item.eng),
  ...shortWordsData.devModeNumbers.map(item => item.eng),
  ...shortWordsData.devmode1.map(item => item.eng),
  ...shortWordsData.digits.map(item => item.eng),
  ...shortWordsData.alphabetData.map(item => item.eng),
  ...shortWordsData.halloween01.map(item => item.eng)
];

// Удаляем дубликаты (если есть)
const uniqueEnglishWords = [...new Set(allEnglishWords)];


// Настройки анимации
const animationSettings = {
  minDistance: 100,
  maxDistance: 200,
  minAngle: 10,
  maxAngle: 170,
  minDuration: 800,  // Уменьшил для более быстрого отклика
  maxDuration: 1500,
  fadeStart: 0.7
};

function handleTap(e) {
  // Предотвращаем стандартное поведение для touch-событий
  if (e.type === 'touchstart') {
    e.preventDefault();
  }

  counter.value++;

  const text = uniqueEnglishWords[Math.floor(Math.random() * uniqueEnglishWords.length)];
  const duration = animationSettings.minDuration +
    Math.random() * (animationSettings.maxDuration - animationSettings.minDuration);

  const angle = animationSettings.minAngle +
    Math.random() * (animationSettings.maxAngle - animationSettings.minAngle);

  const distance = animationSettings.minDistance +
    Math.random() * (animationSettings.maxDistance - animationSettings.minDistance);

  const angleRad = angle * Math.PI / 180;
  const offsetX = Math.cos(angleRad) * distance;
  const offsetY = -Math.sin(angleRad) * distance;

  const button = buttonRef.value;
  const rect = button.getBoundingClientRect();

  const word = {
    id: Date.now() + Math.random(),
    text,
    duration,
    style: {
      position: 'fixed',
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.top + rect.height / 2}px`,
      transform: `translate(-50%, -50%)`,
      animation: `fly-word ${duration}ms ease-out forwards`,
      '--offsetX': `${offsetX}px`,
      '--offsetY': `${offsetY}px`,
      '--fadeStart': `${animationSettings.fadeStart}`,
    }
  };

  flyingWords.value.push(word);

  setTimeout(() => {
    flyingWords.value = flyingWords.value.filter(w => w.id !== word.id);
  }, duration);

  // Добавляем анимацию нажатия кнопки
  button.classList.add('button-tap');
  setTimeout(() => button.classList.remove('button-tap'), 200);
}
</script>

<style>
/* Глобальные стили для предотвращения зума */
html {
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

/* Анимация летающих слов */
.flying-word {
  position: fixed;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  pointer-events: none;
  z-index: 9999;
  white-space: nowrap;
  opacity: 1;
  transform: translate(-50%, -50%);
  animation: fly-word var(--duration) ease-out forwards;
}

@keyframes fly-word {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
calc(var(--fadeStart) * 100%) {
  opacity: 1;
}
100% {
  transform: translate(
    calc(-50% + var(--offsetX)),
    calc(-50% + var(--offsetY))
  ) scale(1.2);
  opacity: 0;
}
}
</style>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Neucha:regular);

.game-container {
  font-family: 'Neucha', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  width: 300px;
  margin: 100px auto;
  touch-action: manipulation; /* Дополнительная защита */
}

#tap-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  width: 100px;
  height: 100px;
  cursor: pointer;
  margin: 20px 0;
  transition: transform 0.1s, opacity 0.1s;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

#tap-button.button-tap {
  transform: scale(0.95);
  opacity: 0.9;
}

.counter {
  font-size: 18px;
  margin-top: 10px;
}
</style>
