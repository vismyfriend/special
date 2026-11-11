<template>
  <CustomCursorLayout>
    <div class="test-block test-custom-cursor">
      <h2>🟦 TestCustomCursorLayout</h2>
      <p>Этот компонент <b>обёрнут</b> в <code>CustomCursorLayout</code>.</p>
      <p>Должен быть <b>кастомный курсор</b> (если он есть в проекте).</p>
      <p>Фон — <b>как у CustomCursorLayout</b> (посмотри, что он рисует).</p>
    </div>
  </CustomCursorLayout>
</template>

<script setup>
import CustomCursorLayout from 'src/layouts/CustomCursorLayout.vue'
</script>

<style scoped>
.test-block {
  padding: 24px;
  border: 4px solid #3b82f6;
  border-radius: 12px;
  background: #eff6ff;
  color: #1e3a8a;
  font-family: system-ui, sans-serif;
}
.test-block h2 { margin: 0 0 12px; }
</style>
