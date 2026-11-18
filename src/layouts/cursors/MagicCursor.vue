<template>
  <canvas ref="canvas" class="magic-cursor" aria-hidden="true"></canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  preset: { type: String, default: 'aurora' },
  enabled: { type: Boolean, default: true },
  intensity: { type: Number, default: 0.75 },
  radius: { type: Number, default: 38 },
  lifetime: { type: Number, default: 1.35 },
  touch: { type: Boolean, default: false },
  colors: { type: Array, default: () => [] },
});
const canvas = ref(null);
let dispose;
onMounted(() => { dispose = mountMagicCursor(canvas.value, () => props); });
onBeforeUnmount(() => dispose?.());

// BEGIN CURSOR ENGINE
const PALETTES = {
  ember: ['#f44254', '#ff8350', '#ffd282', '#f94f98'],
  aurora: ['#a489ff', '#5476ff', '#47eacb', '#e7a1fd'],
  forest: ['#498471', '#72d696', '#c8ed9d', '#53c4bc'],
};
const limit = (value, min, max) => Math.max(min, Math.min(max, value));

function mountMagicCursor(canvas, options) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const sprites = new Map();
  let motes = [];
  let lastPointer;
  let frame = 0;
  let previousFrame = 0;
  let width, height;
  let lastPalette;

  function clear() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousFrame = 0;
    lastPointer = undefined;
    motes = [];
    ctx.clearRect(0, 0, width, height);
  }

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.25);
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    clear();
  }

  function sprite(color) {
    if (sprites.has(color)) return sprites.get(color);
    const tile = document.createElement('canvas');
    tile.width = tile.height = 96;
    const brush = tile.getContext('2d');
    const fog = brush.createRadialGradient(48, 48, 0, 48, 48, 48);
    brush.fillStyle = '#a489ff';
    brush.fillStyle = color;
    fog.addColorStop(0, brush.fillStyle);
    fog.addColorStop(.35, brush.fillStyle);
    fog.addColorStop(1, 'transparent');
    brush.fillStyle = fog;
    brush.fillRect(0, 0, 96, 96);
    sprites.set(color, tile);
    return tile;
  }

  function animate(now) {
    frame = 0;
    const settings = options();
    if (!settings.enabled || reducedMotion.matches || document.hidden) { clear(); return; }
    const dt = previousFrame ? Math.min((now - previousFrame) / 1000, .04) : 1 / 60;
    previousFrame = now;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'screen';
    const intensity = limit(settings.intensity ?? .75, 0, 1);
    motes = motes.filter(mote => {
      mote.age += dt;
      const progress = mote.age / mote.life;
      if (progress >= 1) return false;

      // A smooth flow field bends neighboring wisps in different directions.
      const phase = now * .0014 + mote.phase;
      const driftX = Math.sin(mote.y * .019 + phase) * 32;
      const driftY = Math.cos(mote.x * .016 - phase) * 30;
      mote.x += (mote.vx * (1 - progress) + driftX) * dt;
      mote.y += (mote.vy * (1 - progress) + driftY - 12) * dt;

      const scale = mote.radius * (1 + progress * .82);
      ctx.globalAlpha = intensity * .34 * (1 - progress) ** 2;
      ctx.save();
      ctx.translate(mote.x, mote.y);
      ctx.rotate(mote.angle + progress * mote.turn);
      ctx.drawImage(mote.tile, -scale, -scale * .38, scale * 2, scale * .76);
      ctx.restore();
      return true;
    });
    ctx.globalAlpha = 1;
    if (motes.length) frame = requestAnimationFrame(animate);
    else previousFrame = 0;
  }

  function move(event) {
    const settings = options();
    if (!settings.enabled || reducedMotion.matches || document.hidden || (event.pointerType === 'touch' && !settings.touch)) return;
    const bounds = canvas.getBoundingClientRect();
    const point = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, time: performance.now(), id: event.pointerId };
    const previous = lastPointer;
    lastPointer = point;
    if (!previous || point.id !== previous.id || point.time - previous.time > 100) return;

    const dx = point.x - previous.x, dy = point.y - previous.y;
    const distance = Math.hypot(dx, dy);
    if (distance < .5 || distance > 220) return;

    const palette = settings.colors?.length ? settings.colors.slice(0, 8)
      : PALETTES[settings.preset] || PALETTES.aurora;
    const signature = palette.join('|');
    if (signature !== lastPalette) { sprites.clear(); lastPalette = signature; }
    const angle = Math.atan2(dy, dx);
    const steps = Math.min(12, Math.ceil(distance / 8));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const hue = Math.floor(point.time / 155 + i / 3);
      for (let strand = 0; strand < 3; strand++) {
        const offset = (strand - 1) * 9;
        motes.push({
          x: previous.x + dx * t - Math.sin(angle) * offset,
          y: previous.y + dy * t + Math.cos(angle) * offset,
          vx: limit(dx * 5, -120, 120) - Math.sin(angle) * offset * 4,
          vy: limit(dy * 5, -120, 120) + Math.cos(angle) * offset * 4,
          angle,
          turn: (strand - 1) * 1.9,
          phase: strand * .85,
          age: 0,
          life: limit(settings.lifetime ?? 1.35, .3, 3) * (.8 + strand * .1),
          radius: limit(settings.radius ?? 38, 10, 100) * (1.15 - strand * .16),
          tile: sprite(palette[(hue + strand) % palette.length]),
        });
      }
    }
    if (motes.length > 240) motes.splice(0, motes.length - 240);
    if (!frame) frame = requestAnimationFrame(animate);
  }

  function resetPointer() { lastPointer = undefined; }
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointercancel', resetPointer);
  window.addEventListener('blur', clear);
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', clear);
  reducedMotion.addEventListener('change', clear);
  resize();
  return () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointercancel', resetPointer);
    window.removeEventListener('blur', clear);
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', clear);
    reducedMotion.removeEventListener('change', clear);
    clear();
  };
}
// END CURSOR ENGINE
</script>

<style scoped>
.magic-cursor {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
