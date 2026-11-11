<template>
  <div class="test-block test-special-header">
    <h2>🟩 TestSpecialHeader</h2>
    <p>Этот компонент <b>внутри</b> <code>SpecialHeaderLayout</code> (через маршрут).</p>
    <p>Сверху должно быть <b>верхнее меню игр</b> (⚙️, Задание, Обновить, Миссии, 🔥, 🎲).</p>
    <p>Фон — <b>как у родителя</b> (<code>MainLayoutWithCursor</code> или <code>TestingLayout</code>).</p>
  </div>
</template>

<style scoped>
.test-block {
  padding: 24px;
  border: 4px solid #22c55e;
  border-radius: 12px;
  background: #f0fdf4;
  color: #14532d;
  font-family: system-ui, sans-serif;
}
.test-block h2 { margin: 0 0 12px; }
</style>
