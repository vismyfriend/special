<template>
  <div class="app-container">
    <button class="closeThisPage" @click="backToIntroPage">close Special App ❌</button>

    <!-- Прелоадер с анимированной книгой -->
    <div class="preloader" v-if="showPreloader">
      <div class="book">
        <div class="book__pg-shadow"></div>
        <div class="book__pg"></div>
        <div class="book__pg book__pg--2"></div>
        <div class="book__pg book__pg--3"></div>
        <div class="book__pg book__pg--4"></div>
        <div class="book__pg book__pg--5"></div>
      </div>
    </div>

    <!-- Контент, который появится после прелоадера -->
    <div v-if="!showPreloader" class="content">
      <h1>Ваш контент здесь</h1>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showPreloader = ref(true);

const backToIntroPage = () => {
  router.push("/");
};

// Имитация загрузки (замените на реальную логику)
onMounted(() => {
  setTimeout(() => {
    showPreloader.value = false;
  }, 40000); // Через 4 секунды прелоадер скроется
});
</script>

<style scoped>
/* Базовые стили */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.closeThisPage {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 30px;
  background-color: transparent;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: all 0.3s;
}

.closeThisPage:hover {
  background-color: #e0e0e0;
}

/* Стили прелоадера */
.preloader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.book,
.book__pg-shadow,
.book__pg {
  animation: cover 7s ease-in-out infinite;
}

.book {
  background-color: #6eb8ff;
  border-radius: 0.25em;
  box-shadow:
    0 0.25em 0.5em rgba(0, 0, 0, 0.3),
    0 0 0 0.25em #1e88e5 inset;
  padding: 0.25em;
  perspective: 37.5em;
  position: relative;
  width: 8em;
  height: 6em;
  transform: translate3d(0, 0, 0);
  transform-style: preserve-3d;
}

.book__pg-shadow,
.book__pg {
  position: absolute;
  left: 0.25em;
  width: calc(50% - 0.25em);
}

.book__pg-shadow {
  animation-name: shadow;
  background-image: linear-gradient(-45deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.3) 50%);
  filter: blur(0.25em);
  top: calc(100% - 0.25em);
  height: 3.75em;
  transform: scaleY(0);
  transform-origin: 100% 0%;
}

.book__pg {
  animation-name: pg1;
  background-color: white;
  background-image: linear-gradient(90deg, rgba(245, 245, 245, 0) 87.5%, #f5f5f5);
  height: calc(100% - 0.5em);
  transform-origin: 100% 50%;
}

.book__pg--2,
.book__pg--3,
.book__pg--4 {
  background-image:
    repeating-linear-gradient(#333 0 0.125em, rgba(51, 51, 51, 0) 0.125em 0.5em),
    linear-gradient(90deg, rgba(245, 245, 245, 0) 87.5%, #f5f5f5);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 2.5em 4.125em, 100% 100%;
}

.book__pg--2 {
  animation-name: pg2;
}

.book__pg--3 {
  animation-name: pg3;
}

.book__pg--4 {
  animation-name: pg4;
}

.book__pg--5 {
  animation-name: pg5;
}

/* Анимации */
@keyframes cover {
  from, 5%, 45%, 55%, 95%, to {
    animation-timing-function: ease-out;
    background-color: #6eb8ff;
  }
  10%, 40%, 60%, 90% {
    animation-timing-function: ease-in;
    background-color: #1e88e5;
  }
}

@keyframes shadow {
  from, 10.01%, 20.01%, 30.01%, 40.01% {
    transform: translate3d(0, 0, 1px) scaleY(0) rotateY(0);
  }
  5%, 15%, 25%, 35%, 45%, 55%, 65%, 75%, 85%, 95% {
    transform: translate3d(0, 0, 1px) scaleY(0.2) rotateY(90deg);
  }
  10%, 20%, 30%, 40%, 50%, to {
    transform: translate3d(0, 0, 1px) scaleY(0) rotateY(180deg);
  }
  50.01%, 60.01%, 70.01%, 80.01%, 90.01% {
    transform: translate3d(0, 0, 1px) scaleY(0) rotateY(180deg);
  }
  60%, 70%, 80%, 90%, to {
    transform: translate3d(0, 0, 1px) scaleY(0) rotateY(0);
  }
}

@keyframes pg1 {
  from, to {
    transform: translate3d(0, 0, 1px) rotateY(0.4deg);
  }
  10%, 15% {
    transform: translate3d(0, 0, 1px) rotateY(180deg);
  }
  20%, 80% {
    background-color: #bdbdbd;
    transform: translate3d(0, 0, 1px) rotateY(180deg);
  }
  85%, 90% {
    transform: translate3d(0, 0, 1px) rotateY(180deg);
  }
}

@keyframes pg2 {
  from, to {
    background-color: #bdbdbd;
    transform: translate3d(0, 0, 1px) rotateY(0.3deg);
  }
  5%, 10% {
    transform: translate3d(0, 0, 1px) rotateY(0.3deg);
  }
  20%, 25% {
    transform: translate3d(0, 0, 1px) rotateY(179.9deg);
  }
  30%, 70% {
    background-color: #bdbdbd;
    transform: translate3d(0, 0, 1px) rotateY(179.9deg);
  }
  75%, 80% {
    transform: translate3d(0, 0, 1px) rotateY(179.9deg);
  }
  90%, 95% {
    transform: translate3d(0, 0, 1px) rotateY(0.3deg);
  }
}

@keyframes pg3 {
  from, 10%, 90%, to {
    background-color: #bdbdbd;
    transform: translate3d(0, 0, 1px) rotateY(0.2deg);
  }
  15%, 20% {
    transform: translate3d(0, 0, 1px) rotateY(0.2deg);
  }
  30%, 35% {
    transform: translate3d(0, 0, 1px) rotateY(179.8deg);
  }
  40%, 60% {
    background-color: #bdbdbd;
    transform: translate3d(0, 0, 1px) rotateY(179.8deg);
  }
  65%, 70% {
    transform: translate3d(0, 0, 1px) rotateY(179.8deg);
  }
  80%, 85% {
    transform: translate3d(0, 0, 1px) rotateY(0.2deg);
  }
}

@keyframes pg4 {
  from, 20%, 80%, to {
    background-color: #bdbdbd;
    transform: translate3d(0, 0, 1px) rotateY(0.1deg);
  }
  25%, 30% {
    transform: translate3d(0, 0, 1px) rotateY(0.1deg);
  }
  40%, 45% {
    transform: translate3d(0, 0, 1px) rotateY(179.7deg);
  }
  50% {
    background-color: #bdbdbd;
    transform: translate3d(0, 0, 1px) rotateY(179.7deg);
  }
  55%, 60% {
    transform: translate3d(0, 0, 1px) rotateY(179.7deg);
  }
  70%, 75% {
    transform: translate3d(0, 0, 1px) rotateY(0.1deg);
  }
}

@keyframes pg5 {
  from, 30%, 70%, to {
    background-color: #bdbdbd;
    transform: translate3d(0, 0, 1px) rotateY(0);
  }
  35%, 40% {
    transform: translate3d(0, 0, 1px) rotateY(0deg);
  }
  50% {
    transform: translate3d(0, 0, 1px) rotateY(179.6deg);
  }
  60%, 65% {
    transform: translate3d(0, 0, 1px) rotateY(0);
  }
}

/* Темная тема */
@media (prefers-color-scheme: dark) {
  .app-container {
    background-color: #333;
  }

  .book {
    background-color: #4a89dc;
    box-shadow:
      0 0.25em 0.5em rgba(0, 0, 0, 0.5),
      0 0 0 0.25em #2a6fc9 inset;
  }

  .book__pg {
    background-color: #424242;
    background-image: linear-gradient(90deg, rgba(66, 66, 66, 0) 87.5%, #424242);
  }

  .book__pg--2,
  .book__pg--3,
  .book__pg--4 {
    background-image:
      repeating-linear-gradient(#eee 0 0.125em, rgba(238, 238, 238, 0) 0.125em 0.5em),
      linear-gradient(90deg, rgba(66, 66, 66, 0) 87.5%, #424242);
  }
}
</style>
