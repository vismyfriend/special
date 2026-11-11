<template>
  <div class="test-block test-no-layout">
    <h2>🟥 TestNoLayout</h2>
    <p>Этот компонент <b>без layout</b>. Вокруг него ничего нет.</p>
    <p>Фон страницы — <b>белый</b> (по умолчанию браузера).</p>
    <p>Если видишь шапку/меню — значит, layout всё-таки есть.</p>
  </div>
</template>

<style scoped>
.test-block {
  padding: 24px;
  border: 4px solid #ef4444;
  border-radius: 12px;
  background: #fef2f2;
  color: #7f1d1d;
  font-family: system-ui, sans-serif;
  margin: 20px;
}
.test-block h2 { margin: 0 0 12px; }
</style>
