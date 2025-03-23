<template>
    <div>
        <button class="closeThisPage" @click="backToIntroPage">close Special App ❌</button>
        <button class="itchioGameOne" @click="itchioGameOne">Itch.io Game One</button>
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

const itchioGameOne = () => {
  // router.push(-1) НЕ РАБОТАЕТ -1 если раскомментировтаь
  router.push("/my-games")
}
</script>

<style lang="scss" scoped>

</style>
