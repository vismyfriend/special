<!-- src/layouts/TabletLayout.vue -->
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
            <!-- если слот передан — рендерим слот; иначе — router-view -->
            <slot>
              <router-view />
            </slot>
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
    default: 'pro',
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
  height: min(85vh, 780px);
  border-radius: 32px;
  background: linear-gradient(145deg, #1e293b, #0f172a);
  padding: 18px;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.3),              /* обводка */
    0 4px 8px -2px rgba(0, 0, 0, 0.4),         /* близкая тень */
    0 20px 40px -10px rgba(0, 0, 0, 0.7),      /* основная вниз */
    0 0 40px -10px rgba(0, 0, 0, 0.3),         /* рассеянная вокруг */
    0 0 25px 5px rgba(255, 255, 255, 0.25),    /* белое свечение */
    0 0 0 1px rgba(255, 255, 255, 0.35) inset,
    0 0 0 1px rgba(0, 0, 0, 0.3) inset;
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
  background: transparent;   /* было #f8fafc */
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
  overflow: auto;   /* ← было hidden, стало auto — скролл если не влезает */
}

.tablet__toolbar {
  flex-shrink: 0;
  padding: 10px 20px;
  border-top: 1px solid #e2e8f0;
  background: #fff;
}
/* ─── МОБИЛКА ВЕРТИКАЛЬНО (узкий экран) ─── */
@media (max-width: 768px) and (orientation: portrait) {
  .tablet-stage {
    padding: 0;
    background: transparent;
    align-items: stretch;
    justify-content: stretch;
  }

  .tablet {
    max-width: 100%;
    width: 100%;
    height: 100vh;
    height: 100dvh;         /* динамическая высота (учёт адресной строки) */
    border-radius: 0;
    padding: 0;
    background: transparent;
    box-shadow: none;        /* убрать тени планшета */
    animation: none;
  }

  .tablet__bezel {
    border-radius: 0;
    background: transparent;
  }

  .tablet__camera {
    display: none;           /* убрать камеру */
  }

  .tablet__screen {
    border-radius: 0;
    background: #f8fafc;
  }

  .tablet__header,
  .tablet__toolbar {
    /* можно оставить как есть — они нужны для кнопок */
  }
}
</style>
