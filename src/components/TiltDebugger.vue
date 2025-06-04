<!-- TiltDebugger.vue -->
<template>
  <div class="tilt-debugger">
    <h4>📐 Наклоны устройства:</h4>
    <div><strong>Alpha (оси Z):</strong> {{ alpha.toFixed(1) }}°</div>
    <div><strong>Beta (наклон на себя / от себя):</strong> {{ beta.toFixed(1) }}°</div>
    <div><strong>Gamma (влево / вправо):</strong> {{ gamma.toFixed(1) }}°</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const alpha = ref(0);
const beta = ref(0);
const gamma = ref(0);

const handleOrientation = (event) => {
  alpha.value = event.alpha ?? 0;
  beta.value = event.beta ?? 0;
  gamma.value = event.gamma ?? 0;
};

onMounted(() => {
  window.addEventListener('deviceorientation', handleOrientation);
});
onUnmounted(() => {
  window.removeEventListener('deviceorientation', handleOrientation);
});
</script>

<style scoped>
.tilt-debugger {
  margin-top: 20px;
  padding: 10px;
  border-top: 1px solid #ccc;
  font-family: monospace;
  font-size: 14px;
  background: #f9f9f9;
  width: 100%;
  max-width: 360px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 8px;
}
</style>
