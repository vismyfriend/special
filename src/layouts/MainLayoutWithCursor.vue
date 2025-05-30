<template>
  <CustomCursorLayout>
    <MainLayout>
      <router-view />
    </MainLayout>
  </CustomCursorLayout>
</template>

<script setup>
import CustomCursorLayout from './CustomCursorLayout.vue';
import MainLayout from './MainLayout.vue';
</script>
