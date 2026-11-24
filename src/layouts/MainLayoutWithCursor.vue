<template>
  <CustomCursorLayout>
    <BackgroundByDayLayout>
      <router-view />
    </BackgroundByDayLayout>
  </CustomCursorLayout>
</template>

<script setup>
import CustomCursorLayout from './CustomCursorLayout.vue';
import BackgroundByDayLayout from './BackgroundByDayLayout.vue';
</script>
