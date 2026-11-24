<!-- src/layouts/cursors/RingCursor.vue -->
<template>
  <div
    ref="ring"
    class="ring-cursor"
    aria-hidden="true"
    :class="{ 'no-shadow': !shadowEnabled }"
    :style="{
      '--ring-size': diameter + 'px',
      '--ring-color': color,
      '--ring-pulse': pulse + 'ms',
      '--ring-shadow-color': shadowColor,
      '--ring-shadow-blur': shadowBlur + 'px',
      '--ring-shadow-opacity': shadowOpacity,
    }"
  >
    <i></i>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  enabled: { type: Boolean, default: true },
  diameter: { type: Number, default: 36 },
  color: { type: String, default: '#e2efff' },
  pulse: { type: Number, default: 700 },
  // ─── Тень ───
  shadowEnabled: { type: Boolean, default: true },
  shadowBlur: { type: Number, default: 18 },
  shadowOpacity: { type: Number, default: 0.47 },
  shadowColor: { type: String, default: '#a8d9ff' },
});

const ring = ref(null);
let controller;

onMounted(() => {
  controller = mountRingCursor(ring.value, () => props);
});

watch(() => props.enabled, (enabled) => {
  if (!enabled) controller?.hide();
});

onBeforeUnmount(() => controller?.dispose());

// BEGIN RING ENGINE
function mountRingCursor(node, settings) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');

  const hide = () => {
    node.hidden = true;
    document.documentElement.classList.remove('ring-pointer-active');
  };

  const move = (event) => {
    if (!settings().enabled || event.pointerType !== 'mouse') {
      hide();
      return;
    }

    node.style.left = `${event.clientX}px`;
    node.style.top = `${event.clientY}px`;

    const isOverControl = Boolean(
      !motion.matches &&
      event.target.closest?.('button,a,input,select,textarea,[role=button],.clickable')
    );
    node.classList.toggle('over-control', isOverControl);

    document.documentElement.classList.add('ring-pointer-active');
    node.hidden = false;
  };

  hide();

  window.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);

  function dispose() {
    hide();
    window.removeEventListener('pointermove', move);
    document.removeEventListener('pointerleave', hide);
    window.removeEventListener('blur', hide);
  }

  return { hide, dispose };
}
// END RING ENGINE
</script>

<style scoped>
:global(.ring-pointer-active),
:global(.ring-pointer-active *) {
  cursor: none !important;
}

.ring-cursor {
  position: fixed;
  transform: translate(-50%, -50%);
  width: var(--ring-size);
  height: var(--ring-size);
  color: var(--ring-color);
  border: 2px solid currentColor;
  border-radius: 50%;
  pointer-events: none;
  z-index: 3;
  /* Тень настраивается через CSS-переменные */
  box-shadow: 0 0 var(--ring-shadow-blur, 18px)
  color-mix(in srgb, var(--ring-shadow-color, #a8d9ff)
    calc(var(--ring-shadow-opacity, 0.47) * 100%), transparent);
  transition: box-shadow 0.2s ease;
}

.ring-cursor.no-shadow {
  box-shadow: none;
}

.ring-cursor.over-control {
  background: #b7d9ff44;
}

.ring-cursor i {
  display: none;
  position: absolute;
  inset: 38%;
  border-radius: 50%;
  background: currentColor;
}

.ring-cursor.over-control i {
  display: block;
  animation: ring-wave var(--ring-pulse) ease-out infinite;
}

@keyframes ring-wave {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
