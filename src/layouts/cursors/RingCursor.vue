<template>
  <div ref="ring" class="ring-cursor" aria-hidden="true"
    :style="{ '--ring-size': diameter + 'px', '--ring-color': color, '--ring-pulse': pulse + 'ms' }">
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
});
const ring = ref(null);
let controller;
onMounted(() => { controller = mountRingCursor(ring.value, () => props); });
watch(() => props.enabled, enabled => { if (!enabled) controller?.hide(); });
onBeforeUnmount(() => controller?.dispose());

// BEGIN RING ENGINE
function mountRingCursor(node, settings) {
  const host = node.parentElement;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const hide = () => { node.hidden = true; host.classList.remove('ring-pointer-active'); };
  const move = event => {
    if (!settings().enabled || event.pointerType !== 'mouse') { hide(); return; }
    const rect = host.getBoundingClientRect();
    node.style.left = `${event.clientX - rect.left + host.scrollLeft - host.clientLeft}px`;
    node.style.top = `${event.clientY - rect.top + host.scrollTop - host.clientTop}px`;
    node.classList.toggle('over-control', Boolean(!motion.matches && event.target.closest?.('button,a,input,select,textarea,[role=button],.clickable')));
    host.classList.add('ring-pointer-active');
    node.hidden = false;
  };
  hide();
  host.addEventListener('pointermove', move, { passive: true });
  host.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  function dispose() {
    hide();
    host.removeEventListener('pointermove', move);
    host.removeEventListener('pointerleave', hide);
    window.removeEventListener('blur', hide);
  }
  return { hide, dispose };
}
// END RING ENGINE
</script>

<style scoped>
:global(.ring-pointer-active), :global(.ring-pointer-active *) { cursor:none !important; }
.ring-cursor { position:absolute; transform:translate(-50%,-50%); width:var(--ring-size); height:var(--ring-size); color:var(--ring-color); border:2px solid currentColor; border-radius:50%; box-shadow:0 0 18px #a8d9ff77; pointer-events:none; z-index:3; }
.ring-cursor.over-control { background:#b7d9ff44; }
.ring-cursor i { display:none; position:absolute; inset:38%; border-radius:50%; background:currentColor; }
.ring-cursor.over-control i { display:block; animation:ring-wave var(--ring-pulse) ease-out infinite; }
@keyframes ring-wave { to { transform:scale(4); opacity:0; } }
</style>
