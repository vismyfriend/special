<template>
    <div>
        <button class="closeThisPage" @click="backToIntroPage">close Special App ❌</button> 
        <router-view />

    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()
const backToIntroPage = () => {
  // router.push(-1) НЕ РАБОТАЕТ -1 если раскомментировтаь
  router.push("/")
}
</script>

<style lang="scss" scoped>
.closeThisPage {
    display: block;
    margin: 0 auto;
    
    border-radius: 30px;
    background-color: transparent;
   
   }

   
</style>