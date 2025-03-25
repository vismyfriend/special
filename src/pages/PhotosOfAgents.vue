<template>
    <div>
        <button class="closeThisPage" @click="backToIntroPage">close Special App ❌</button>
        <button class="itchioGameOne" @click="itchioGameOne">Itch.io Game One</button>
        <button class="goToPageWorkbench1" @click="goToPageWorkbench1">goToPageWorkbench1</button>
        <button class="goToPageWorkbench2" @click="goToPageWorkbench2">goToPageWorkbench2</button>
        <button class="goToPageWorkbench3" @click="goToPageWorkbench3">goToPageWorkbench3</button>
        <button class="goToPageWorkbench4" @click="goToPageWorkbench4">goToPageWorkbench4</button>
        <img src="../assets/images/special logo hat square.png" alt="logo">

    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()



const backToIntroPage = () => {
  // router.push(-1) НЕ РАБОТАЕТ -1 если раскомментировтаь
  router.push("/")
}

const goToPageWorkbench1 = () => {
  router.push("/workbench1")
}
const goToPageWorkbench2 = () => {
  router.push("/workbench2")
}
const goToPageWorkbench3 = () => {
  router.push("/workbench3")
}
const goToPageWorkbench4 = () => {
  router.push("/workbench4")
}
const itchioGameOne = () => {
  router.push("/my-games")
}
</script>

<style lang="scss" scoped>
.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 25px; /* Закругленные углы */
  background-color: #4CAF50; /* Зеленый фон */
  color: white; /* Белый текст */
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Тень для кнопки */
  transition: all 0.3s ease; /* Плавная анимация */
  width: 250px;
}

button:hover {
  background-color: #45a049; /* Более темный оттенок на hover */
  transform: translateY(-3px); /* Легкое поднятие кнопки */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Увеличение тени */
}

button:active {
  transform: translateY(1px); /* Легкое сжатие при нажатии */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

button:focus {
  outline: none; /* Убираем стандартное выделение при фокусе */
}


</style>
