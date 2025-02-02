<template>
  <div>
    <div>
      <router-view />


    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()




</script>

<style lang="scss" scoped>
.goBackPage {
  color: green;
  border-radius: 50px;
}


</style>