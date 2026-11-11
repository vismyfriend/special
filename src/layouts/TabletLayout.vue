<!-- src/components/layout/TabletLayout.vue -->
<template>
  <div class="tablet-stage">
    <div class="tablet" :class="`tablet--${size}`">
      <div class="tablet__bezel">
        <div class="tablet__camera" />
        <div class="tablet__screen">
          <header v-if="$slots.header" class="tablet__header">
            <slot name="header" />
          </header>

          <main class="tablet__content">
            <slot />
          </main>

          <footer v-if="$slots.toolbar" class="tablet__toolbar">
            <slot name="toolbar" />
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'pro', // 'mini' | 'air' | 'pro' | 'full'
    validator: (v) => ['mini', 'air', 'pro', 'full'].includes(v),
  },
})
</script>

<style scoped>
.tablet-stage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: transparent;   /* ← было #e2e8f0 */
  box-sizing: border-box;
}

.tablet {
  width: 100%;
  max-width: 1200px;
  height: min(85vh, 780px);        /* ← высота, а не aspect-ratio */
  border-radius: 32px;
  background: linear-gradient(145deg, #1e293b, #0f172a);
  padding: 18px;
  box-shadow:
    0 30px 60px -20px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  box-sizing: border-box;
}

.tablet--mini { max-width: 768px; height: min(75vh, 620px); }
.tablet--air  { max-width: 900px; height: min(80vh, 700px); }
.tablet--pro  { max-width: 1024px; height: min(85vh, 780px); }
.tablet--full { max-width: 1280px; height: min(88vh, 820px); }

.tablet__bezel {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  background: #0f172a;
  box-sizing: border-box;
}

.tablet__camera {
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1e293b;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.05);
  z-index: 10;
}

.tablet__screen {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  border-radius: 20px;
  overflow: hidden;
}

.tablet__header {
  flex-shrink: 0;
  padding: 10px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
}

/* ─── ключевое: контент занимает всё оставшееся место, БЕЗ скролла ─── */
.tablet__content {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;   /* ← было auto, теперь hidden */
}

.tablet__toolbar {
  flex-shrink: 0;
  padding: 10px 20px;
  border-top: 1px solid #e2e8f0;
  background: #fff;
}

/* на мобилке — планшет на весь экран */
@media (max-width: 768px) {
  .tablet-stage {
    padding: 0;
    background: #f8fafc;
  }
  .tablet {
    max-width: 100%;
    height: 100vh;
    border-radius: 0;
    padding: 0;
    box-shadow: none;
  }
  .tablet__bezel,
  .tablet__screen {
    border-radius: 0;
  }
  .tablet__camera {
    display: none;
  }
}
</style>
