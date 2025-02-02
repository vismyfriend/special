<template>
  <div class="background">
    <div class="content">
      <h2>Тут когда-то появится инфа или голенький Ви</h2>
      <q-btn class="q-mb-sm zoomIn" icon="mail" label="Пройти тест" push color="primary" @click="test" />
    </div>
    <div>
      <DraggableWindow 
        v-for="(window, index) in windows" 
        :key="index" 
        :title="window.title" 
        :position="window.position" 
        :isActive="activeWindow === window.title"
        @updatePosition="updatePosition(index, $event)" 
        @setActiveWindow="setActiveWindow"
      />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import DraggableWindow from './DraggableWindow.vue'; // Импортируем компонент для перетаскиваемого окна
const router = useRouter();
const test = () => {
  router.push("/");
}
// Позиции окон
const windows = ref([
  { title: 'Window 1', position: { top: '50px', left: '50px' } },
  { title: 'Window 2', position: { top: '100px', left: '100px' } },
]);
const activeWindow = ref('');
const updatePosition = (index, position) => {
  windows.value[index].position = position;
};
const setActiveWindow = (title) => {
  activeWindow.value = title;
};
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
