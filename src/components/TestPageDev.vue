<template>
  <div class="test-div">
    <h2> h2 - Просто тестовый компонент 🟥 for tests</h2>
    <p>Этот компонент <b>можно менять</b> как угодно.</p>
    <p>Фон страницы — <b>белый</b> (по умолчанию браузера).</p>
    <p>Если видишь что-то скажи что-то.</p>

  </div>
</template>

<style scoped>
.test-div {
  padding: 24px;
  border: 4px solid #4447ef;
  border-radius: 12px;
  background: rgba(254, 242, 242, 0.85);
  color: #7f1d1d;
  font-family: system-ui, sans-serif;
}
.test-block h2 { margin: 0 0 12px; }
</style>
<script setup lang="ts">
</script>
