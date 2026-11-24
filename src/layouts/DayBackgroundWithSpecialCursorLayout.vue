<template>
  <CustomCursorLayout>
    <DayBackground>
      <router-view />
    </DayBackground>
  </CustomCursorLayout>
</template>

<script setup>
import CustomCursorLayout from './CustomCursorLayout.vue';
import DayBackground from './DayBackground.vue';
</script>
