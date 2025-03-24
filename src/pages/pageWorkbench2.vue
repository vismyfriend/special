<template>
  <div :style="{ backgroundColor: `rgba(0, 0, 0, ${1 - brightness})` }" class="dimmer-container">
    <button class="closeThisPage" @click="backToIntroPage">
      close Special App ❌
    </button>

    <!-- Диммер -->
    <div class="toggle-wrapper">
      <input
        class="toggle-checkbox"
        type="range"
        min="0"
        max="1"
        step="0.01"
        v-model="brightness"
      />
      <div
        class="toggle-container"
        :style="{ backgroundColor: `rgb(${225 + brightness * 30}, ${218 - brightness * 50}, ${205 - brightness * 100})` }"
      >
        <div class="toggle-button" :style="{ transform: `translateX(${brightness * 7.0}em)` }">
          <div class="toggle-button-circles-container">
            <div class="toggle-button-circle" v-for="n in 12" :key="n"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const brightness = ref(1); // От 1 (ярко) до 0 (темно)

const backToIntroPage = () => {
  router.push("/");
};
</script>

<style lang="scss" scoped>
/* Контейнер всей страницы */
.dimmer-container {
  min-height: 100vh;
  transition: background-color 0.4s ease;
}

/* Кнопка закрытия */
.closeThisPage {
  display: block;
  margin: 10px auto;
  border-radius: 30px;
  background-color: transparent;
  color: white;
}

/* Контейнер переключателя */
.toggle-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 10em;
  height: 3em;
  border-radius: 1em;
  padding: 0.25em;
  background-image: linear-gradient(to bottom, #d0c4b8, #f5ece5);
  box-shadow: 0 2px 2px rgb(255 255 255 / 0.6);
}

/* Ползунок диммера */
.toggle-checkbox {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.01;
  cursor: pointer;
  z-index: 2;
}

/* Основная часть переключателя */
.toggle-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border-radius: 0.75em;
  width: 100%;
  height: 100%;
  transition: background-color 0.4s linear;
}

/* Кнопка внутри переключателя */
.toggle-button {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  border-radius: 30%;
  width: 2.5em;
  height: 2.5em;
  background-color: #e4ddcf;
  box-shadow:
    inset 0 -0.125em 0.125em 0.25em rgb(0 0 0 / 0.1),
    inset 0 -0.25em 0.125em rgb(0 0 0 / 0.2),
    inset 0 0.375em 0.125em rgb(255 255 255 / 0.3),
    0 0.25em 0.25em rgb(0 0 0 / 0.5);
  transition: transform 0.4s ease;
}

/* Контейнер точек внутри кнопки */
.toggle-button-circles-container {
  display: grid;
  grid-template-columns: repeat(3, min-content);
  gap: 0.25em;
  position: absolute;
  margin: 0 auto;
}

/* Маленькие точки внутри кнопки */
.toggle-button-circle {
  border-radius: 50%;
  width: 0.25em;
  height: 0.25em;
  background-image: radial-gradient(circle at 50% 0, #f6f0e9, #bebcb0);
}
</style>
