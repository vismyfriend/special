<!-- src/layouts/cursors/FlashlightCursor.vue -->
<template>
  <canvas ref="canvas" class="flashlight-cursor" aria-hidden="true"></canvas>
  <div
    v-if="showDot && enabled && dotVisible"
    class="flashlight-dot"
    :style="{ left: dotX + 'px', top: dotY + 'px' }"
    aria-hidden="true"
  ></div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  enabled: { type: Boolean, default: true },
  diameter: { type: Number, default: 300 },
  softness: { type: Number, default: 0.55 },
  darkness: { type: Number, default: 0.92 },
  color: { type: String, default: 'warm' },
  glow: { type: Number, default: 0.2 },
  flicker: { type: Number, default: 0 },
  memory: { type: String, default: 'off' },
  seconds: { type: Number, default: 4 },
  touch: { type: Boolean, default: true },
  resetKey: { type: Number, default: 0 },
  showDot: { type: Boolean, default: true },
});

const canvas = ref(null);

// Реактивные координаты и видимость точки — как в RingCursor
const dotX = ref(0);
const dotY = ref(0);
const dotVisible = ref(false);

let controller;

onMounted(() => {
  controller = mountFlashlight(
    canvas.value,
    () => props,
    // колбэк обновления точки из движка
    (x, y) => {
      dotX.value = x;
      dotY.value = y;
      dotVisible.value = true;
    },
    () => {
      dotVisible.value = false;
    }
  );
});

watch(() => props.resetKey, () => controller?.reset());

watch(
  () => [
    props.enabled, props.diameter, props.softness, props.darkness, props.color,
    props.glow, props.flicker, props.memory, props.seconds, props.touch,
  ],
  () => controller?.refresh()
);

// Синхронизация класса, скрывающего стандартный курсор
function syncPointerClass() {
  const on = props.enabled && props.showDot;
  if (on) document.documentElement.classList.add('flashlight-pointer-active');
  else document.documentElement.classList.remove('flashlight-pointer-active');
}

watch(() => [props.enabled, props.showDot], syncPointerClass, { immediate: true });

onBeforeUnmount(() => {
  controller?.dispose();
  document.documentElement.classList.remove('flashlight-pointer-active');
});

// BEGIN FLASHLIGHT ENGINE
function mountFlashlight(canvas, settings, onDotMove, onDotHide) {
  const ctx = canvas.getContext('2d');
  const memory = document.createElement('canvas');
  const ink = memory.getContext('2d');
  if (!ctx || !ink) return { reset() {}, refresh() {}, dispose() {} };

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const tones = { warm: '255,193,94', white: '229,242,255', night: '102,255,133' };

  let width = 1, height = 1, ratio = 1, point, previous, frame = 0;
  let lastPaint = 0, lastStamp = -Infinity, lastMode, lastEnabled;

  const bound = (value, min, max) => Math.min(max, Math.max(min, value));

  function erase(context, x, y, radius, softness, strength = 1) {
    const edge = context.createRadialGradient(
      x, y, radius * (1 - softness),
      x, y, radius
    );
    edge.addColorStop(0, `rgba(0,0,0,${strength})`);
    edge.addColorStop(1, 'transparent');
    context.fillStyle = edge;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  function draw(now) {
    frame = 0;
    const opts = settings();
    const seconds = bound(opts.seconds, 0.5, 30);
    const age = now - lastStamp;

    if (opts.memory === 'fade' && age < seconds * 1000 && lastPaint) {
      ink.globalCompositeOperation = 'destination-out';
      ink.fillStyle = `rgba(0,0,0,${1 - Math.exp(-6 * (now - lastPaint) / (seconds * 1000))})`;
      ink.fillRect(0, 0, width, height);
      ink.globalCompositeOperation = 'source-over';
    } else if (opts.memory === 'fade' && Number.isFinite(lastStamp) && age >= seconds * 1000) {
      ink.clearRect(0, 0, width, height);
      lastStamp = -Infinity;
    }
    lastPaint = now;

    ctx.clearRect(0, 0, width, height);
    if (!opts.enabled) return;

    ctx.fillStyle = `rgba(0,0,0,${bound(opts.darkness, 0, 1)})`;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'destination-out';
    if (opts.memory !== 'off') ctx.drawImage(memory, 0, 0, width, height);

    const flicker = point && !motion.matches ? bound(opts.flicker, 0, 1) : 0;
    if (point) {
      const radius = bound(opts.diameter, 40, 1200) / 2;
      const softness = bound(opts.softness, 0.01, 1);
      const pulse = Math.max(0, Math.sin(now / 710 + Math.sin(now / 317))) ** 18;
      const brightness = 1 - flicker * pulse * (0.45 + 0.35 * Math.sin(now / 23) ** 2);
      erase(ctx, point.x, point.y, radius, softness, brightness);
      ctx.globalCompositeOperation = 'source-over';
      const tint = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
      tint.addColorStop(
        0,
        `rgba(${tones[opts.color] || tones.white},${brightness * bound(opts.glow, 0, 0.65)})`
      );
      tint.addColorStop(1, 'transparent');
      ctx.fillStyle = tint;
      ctx.fillRect(point.x - radius, point.y - radius, radius * 2, radius * 2);
    }
    ctx.globalCompositeOperation = 'source-over';

    if (flicker || (opts.memory === 'fade' && Number.isFinite(lastStamp))) schedule();
  }

  function schedule() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(draw);
  }

  function refresh() {
    const opts = settings();
    if (opts.memory !== lastMode || opts.enabled !== lastEnabled) {
      previous = undefined;
      lastMode = opts.memory;
      lastEnabled = opts.enabled;
      reset();
    } else schedule();
  }

  function reset() {
    lastStamp = -Infinity;
    lastPaint = 0;
    ink.clearRect(0, 0, width, height);
    schedule();
  }

  function resize() {
    const nextWidth = Math.max(window.innerWidth, 1);
    const nextHeight = Math.max(window.innerHeight, 1);
    const nextRatio = Math.min(window.devicePixelRatio || 1, 1.5);

    if (
      nextWidth === width &&
      nextHeight === height &&
      ratio === nextRatio &&
      canvas.width === Math.round(width * ratio)
    ) return;

    width = nextWidth;
    height = nextHeight;
    ratio = nextRatio;
    canvas.width = memory.width = Math.round(width * ratio);
    canvas.height = memory.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ink.setTransform(ratio, 0, 0, ratio, 0, 0);
    point = previous = undefined;
    reset();
  }

  function isValidPointerEvent(event) {
    if (!Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) return false;
    if (event.clientX === 0 && event.clientY === 0 && !event.isTrusted) return false;
    return true;
  }

  function handleMove(event) {
    const opts = settings();
    if (!opts.enabled) return;
    if (event.pointerType === 'touch' && !opts.touch) return;
    if (!isValidPointerEvent(event)) return;

    point = { x: event.clientX, y: event.clientY };

    // Обновляем точку через реактивный колбэк — как в RingCursor
    if (opts.showDot) {
      onDotMove(event.clientX, event.clientY);
    }

    if (opts.memory !== 'off') {
      const radius = bound(opts.diameter, 40, 1200) / 2;
      const start = previous || point;
      const dx = point.x - start.x, dy = point.y - start.y;
      const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / (radius * 0.35)));
      for (let step = 1; step <= steps; step++) {
        erase(
          ink,
          start.x + dx * step / steps,
          start.y + dy * step / steps,
          radius,
          bound(opts.softness, 0.01, 1),
          0.85
        );
      }
      lastStamp = performance.now();
      if (!lastPaint) lastPaint = lastStamp;
    }
    previous = point;
    schedule();
  }

  function handleDown(event) {
    const opts = settings();
    if (!opts.enabled) return;
    if (event.pointerType === 'touch' && !opts.touch) return;
    if (!isValidPointerEvent(event)) return;

    point = { x: event.clientX, y: event.clientY };

    // Точку двигаем и на pointerdown — чтобы после клика она была там, где клик
    if (opts.showDot) {
      onDotMove(event.clientX, event.clientY);
    }

    if (opts.memory !== 'off') {
      const radius = bound(opts.diameter, 40, 1200) / 2;
      const start = previous || point;
      const dx = point.x - start.x, dy = point.y - start.y;
      const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / (radius * 0.35)));
      for (let step = 1; step <= steps; step++) {
        erase(
          ink,
          start.x + dx * step / steps,
          start.y + dy * step / steps,
          radius,
          bound(opts.softness, 0.01, 1),
          0.85
        );
      }
      lastStamp = performance.now();
      if (!lastPaint) lastPaint = lastStamp;
    }
    previous = point;
    schedule();
  }

  function leave() {
    point = previous = undefined;
    onDotHide();
    schedule();
  }

  function visibility() {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      point = previous = undefined;
      onDotHide();
    } else schedule();
  }

  const observer = new ResizeObserver(resize);
  observer.observe(document.documentElement);

  window.addEventListener('pointermove', handleMove, { passive: true });
  window.addEventListener('pointerdown', handleDown, { passive: true });
  document.addEventListener('pointerleave', leave);
  window.addEventListener('blur', leave);
  document.addEventListener('visibilitychange', visibility);

  resize();
  refresh();

  return {
    reset,
    refresh,
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleDown);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
      document.removeEventListener('visibilitychange', visibility);
      onDotHide();
    },
  };
}
// END FLASHLIGHT ENGINE
</script>

<style scoped>
.flashlight-cursor {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.flashlight-dot {
  position: fixed;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.9), 0 0 12px rgba(255, 193, 94, 0.6);
  pointer-events: none;
  z-index: 3;
  transition: opacity 0.15s ease;
}

:global(.flashlight-pointer-active),
:global(.flashlight-pointer-active *) {
  cursor: none !important;
}
</style>
