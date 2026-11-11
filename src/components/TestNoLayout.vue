<!-- src/components/test/TestNoLayout.vue -->
<template>
  <div class="test-block test-no-layout">
    <h2>🟥 TestNoLayout</h2>
    <p>Этот компонент <b>без layout</b>. Вокруг него ничего нет.</p>
    <p>Фон страницы — <b>белый</b> (по умолчанию браузера).</p>
    <p>Если видишь шапку/меню — значит, layout всё-таки есть.</p>
    <p style="margin-top: 12px; font-size: 13px; color: #666;">
      Если ты видишь фон-картинку — значит, <code>SpecialBackground</code> работает.
    </p>
  </div>
</template>

<style scoped>
.test-block {
  padding: 24px;
  border: 4px solid #ef4444;
  border-radius: 12px;
  background: rgba(254, 242, 242, 0.85);
  color: #7f1d1d;
  font-family: system-ui, sans-serif;
}
.test-block h2 { margin: 0 0 12px; }
</style>
