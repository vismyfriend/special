<!--можно удалить этот компонент он уже не актуален и из него все использовано в specialBackground-->

<!--<template>-->
<!--  <div class="day-background-layout">-->
<!--    <img-->
<!--      class="background-img"-->
<!--      :class="{ blur: blurredPage }"-->
<!--      :src="currentBackgroundDay?.img"-->
<!--      alt=""-->
<!--    />-->
<!--    <router-view />-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import { ref, computed, onMounted } from 'vue';-->
<!--import { useRoute } from 'vue-router';-->

<!--const route = useRoute();-->
<!--const currentBackgroundDay = ref(null);-->

<!--// По умолчанию блюр включён. Снимается, только если явно meta.blur === false-->
<!--const blurredPage = computed(() => route.meta.blur !== false);-->

<!--const backgrounds = ref([-->
<!--  { day: 0, img: new URL("../assets/images/AVIF/background1.avif", import.meta.url).href },-->
<!--  { day: 1, img: new URL("../assets/images/AVIF/background2.avif", import.meta.url).href },-->
<!--  { day: 2, img: new URL("../assets/images/AVIF/background8.avif", import.meta.url).href },-->
<!--  { day: 3, img: new URL("../assets/images/AVIF/SpecialRoomGreen.avif", import.meta.url).href },-->
<!--  { day: 4, img: new URL("../assets/images/AVIF/background5.avif", import.meta.url).href },-->
<!--  { day: 5, img: new URL("../assets/images/AVIF/background6.avif", import.meta.url).href },-->
<!--  { day: 6, img: new URL("../assets/images/AVIF/background7.avif", import.meta.url).href },-->
<!--]);-->

<!--onMounted(() => {-->
<!--  const currentDay = new Date().getDay();-->
<!--  currentBackgroundDay.value = backgrounds.value.find(el => el.day === currentDay);-->
<!--});-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--.day-background-layout {-->
<!--  position: relative;-->
<!--  min-height: 100vh;-->
<!--}-->

<!--.background-img {-->
<!--  width: 100%;-->
<!--  height: 100vh;-->
<!--  top: 0;-->
<!--  left: 0;-->
<!--  position: fixed;-->
<!--  object-fit: cover;-->
<!--  z-index: -1;-->
<!--  right: 0;-->
<!--  bottom: 0;-->
<!--}-->

<!--.blur {-->
<!--  filter: blur(6px);-->
<!--  box-shadow: 0 0 20px 17px black;-->
<!--}-->
<!--</style>-->
