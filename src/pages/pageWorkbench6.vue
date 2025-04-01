<template>
  <div class="app-container">
    <button class="closeThisPage" @click="backToIntroPage">close Special App ❌</button>

    <div class="menu-container">
      <button class="fancy-btn"><span>Resume</span></button>
      <button class="fancy-btn">New Game</button>
      <button class="fancy-btn">Start</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const backToIntroPage = () => {
  router.push("/");
};
</script>

<style lang="scss" scoped>
/* Базовые стили */
.app-container {
  min-height: 100vh;
  background: #181620;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 500px;
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
}

.closeThisPage:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Стили для меню с 3D-кнопками */
.menu-container {
  display: flex;
  flex-direction: column;
  transform: rotatex(10deg);
  animation: rotateAngle 6s linear infinite;
}

.fancy-btn {
  display: block;
  position: relative;
  margin: 0.5em 0;
  padding: 0.8em 2.2em;
  cursor: pointer;
  background: #FFFFFF;
  border: none;
  border-radius: 0.4em;
  text-transform: uppercase;
  font-size: 1.4em;
  font-weight: 500;
  letter-spacing: 0.04em;
  mix-blend-mode: color-dodge;
  perspective: 500px;
  transform-style: preserve-3d;
  transition: background 0.3s 0.1s;
}

.fancy-btn:before,
.fancy-btn:after {
  --z: 0px;
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  content: '';
  width: 100%;
  height: 100%;
  opacity: 0;
  mix-blend-mode: inherit;
  border-radius: inherit;
  transform-style: preserve-3d;
  transform: translate3d(
      calc(var(--z) * 0px),
      calc(var(--z) * 0px),
      calc(var(--z) * 0px)
  );
}

.fancy-btn span {
  mix-blend-mode: none;
  display: block;
}

.fancy-btn:after {
  background-color: #5D00FF;
}

.fancy-btn:before {
  background-color: #FF1731;
}

.fancy-btn:hover {
  background-color: #FFF65B;
}

.fancy-btn:hover:before {
  --z: 0.04;
  animation: translateWobble 2.2s ease forwards;
}

.fancy-btn:hover:after {
  --z: -0.06;
  animation: translateWobble 2.2s ease forwards;
}

/* Анимации */
@keyframes rotateAngle {
  0% {
    transform: rotateY(0deg) rotateX(10deg);
    animation-timing-function: cubic-bezier(0.61, 1, 0.88, 1);
  }
  25% {
    transform: rotateY(20deg) rotateX(10deg);
  }
  50% {
    transform: rotateY(0deg) rotateX(10deg);
    animation-timing-function: cubic-bezier(0.61, 1, 0.88, 1);
  }
  75% {
    transform: rotateY(-20deg) rotateX(10deg);
  }
  100% {
    transform: rotateY(0deg) rotateX(10deg);
  }
}

@keyframes translateWobble {
  0% {
    opacity: 0;
    transform: translate3d(
        calc(var(--z) * 0px),
        calc(var(--z) * 0px),
        calc(var(--z) * 0px)
    );
  }
  16% {
    transform: translate3d(
        calc(var(--z) * 160px),
        calc(var(--z) * 160px),
        calc(var(--z) * 160px)
    );
  }
  28% {
    opacity: 1;
    transform: translate3d(
        calc(var(--z) * 70px),
        calc(var(--z) * 70px),
        calc(var(--z) * 70px)
    );
  }
  44% {
    transform: translate3d(
        calc(var(--z) * 130px),
        calc(var(--z) * 130px),
        calc(var(--z) * 130px)
    );
  }
  59% {
    transform: translate3d(
        calc(var(--z) * 85px),
        calc(var(--z) * 85px),
        calc(var(--z) * 85px)
    );
  }
  73% {
    transform: translate3d(
        calc(var(--z) * 110px),
        calc(var(--z) * 110px),
        calc(var(--z) * 110px)
    );
  }
  88% {
    opacity: 1;
    transform: translate3d(
        calc(var(--z) * 90px),
        calc(var(--z) * 90px),
        calc(var(--z) * 90px)
    );
  }
  100% {
    opacity: 1;
    transform: translate3d(
        calc(var(--z) * 100px),
        calc(var(--z) * 100px),
        calc(var(--z) * 100px)
    );
  }
}

/* Адаптация для мобильных устройств */
@media (max-width: 768px) {
  .menu-container {
    transform: rotatex(5deg); /* Можно немного уменьшить угол */
    //animation: none;
    animation: rotateAngle 6s linear infinite; /* Оставляем анимацию */

  }

  .fancy-btn {
    font-size: 1.1em;
    padding: 0.6em 1.5em;
  }
}
</style>
