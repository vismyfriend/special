<template>
  <div>
    <button class="closeThisPage" @click="backToIntroPage">close Special App ❌</button>


  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()



const backToIntroPage = () => {
  router.push("/")


}
</script>

<style lang="scss" scoped>
.closeThisPage {
  display: block;
  margin: 10px auto;
  border-radius: 30px;
  background-color: transparent;
}
</style>
