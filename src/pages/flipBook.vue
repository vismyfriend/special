<template>
  <div>
    <button class="goToMainPage" @click="goToMainPage">go to main page ❌</button>


  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()



const goToMainPage = () => {
  router.push("/")


}
</script>

<style lang="scss" scoped>
.goToMainPage {
  display: block;
  margin: 10px auto;
  border-radius: 30px;
  background-color: transparent;
}
</style>
