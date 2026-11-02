<!-- src/components/layout/TabletLayout.vue -->
<template>
  <div class="tablet-stage">
    <div class="tablet" :class="`tablet--${size}`">
      <!-- корпус -->
      <div class="tablet__bezel">
        <div class="tablet__camera" />
        <div class="tablet__screen">
          <!-- верхняя панель (опционально) -->
          <header v-if="$slots.header" class="tablet__header">
            <slot name="header" />
          </header>

          <!-- основной контент -->
          <main class="tablet__content">
            <slot />
          </main>

          <!-- нижняя панель (опционально) -->
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
  background: #e2e8f0;
}

.tablet {
  width: 100%;
  max-width: 1024px;
  aspect-ratio: 4 / 3; /* iPad классический */
  border-radius: 32px;
  background: linear-gradient(145deg, #1e293b, #0f172a);
  padding: 18px;
  box-shadow:
    0 30px 60px -20px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

.tablet--mini { max-width: 768px; }
.tablet--air  { max-width: 900px; }
.tablet--pro  { max-width: 1024px; }
.tablet--full { max-width: 1280px; aspect-ratio: 16 / 10; }

.tablet__bezel {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  background: #0f172a;
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
  padding: 12px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
}

.tablet__content {
  flex: 1;
  min-height: 0;
  overflow: auto;
  position: relative;
}

.tablet__toolbar {
  flex-shrink: 0;
  padding: 12px 20px;
  border-top: 1px solid #e2e8f0;
  background: #fff;
}

/* на мобилке — почти без рамки, планшет на весь экран */
@media (max-width: 768px) {
  .tablet-stage {
    padding: 0;
    background: #f8fafc;
  }
  .tablet {
    max-width: 100%;
    aspect-ratio: auto;
    height: 100vh;
    border-radius: 0;
    padding: 0;
    box-shadow: none;
  }
  .tablet__bezel {
    border-radius: 0;
  }
  .tablet__camera {
    display: none;
  }
  .tablet__screen {
    border-radius: 0;
  }
}
</style>
