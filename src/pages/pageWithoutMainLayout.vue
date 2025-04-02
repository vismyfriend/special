<template>
  <div class="background">
    <div class="content">
      <h2>Тут не применяются mainLayout стили </h2>
      <q-btn class="q-mb-sm zoomIn" icon="mail" label="на главную" push color="primary" @click="test" />
    </div>

  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const test = () => {
  router.push("/");
}
</script>
<style lang="scss" scoped>
.background {
  background-image: url('../assets/images/backgroundisland.jpg');

  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh;
  position: relative;
  z-index: 0;
}
.content {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
  padding: 20px;
}
</style>
