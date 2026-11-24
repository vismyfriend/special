<!-- src/layouts/cursors/CursorStudio.vue -->
<template>
  <div class="cursor-root">
    <!-- МАСТЕРСКАЯ: показывается, если не отключена через meta.cursorStudio.scene === false -->
    <section v-if="showStudio" class="cursor-studio">
      <header>
        <div>
          <h1>Мастерская курсоров</h1>
          <p>Выбери эффект и проверь его на сцене. Курсор работает на всей странице.</p>
        </div>
        <div class="studio-modes" role="group" aria-label="Эффект курсора">
          <button
            v-for="mode in modes"
            :key="mode.id"
            type="button"
            :aria-pressed="active === mode.id"
            @click="active = mode.id"
          >{{ mode.label }}</button>
        </div>
      </header>

      <div class="studio-layout">
        <aside class="studio-controls" aria-label="Настройки курсора">
          <label class="studio-toggle">
            <input v-model="enabled" type="checkbox"> Включить эффект
          </label>

          <template v-if="active === 'flashlight'">
            <label class="studio-toggle">
              <input v-model="flashlight.showDot" type="checkbox"> Точка-прицел
            </label>
            <label>Цвет луча
              <select v-model="flashlight.color">
                <option value="warm">Тёплый</option>
                <option value="white">Белый</option>
                <option value="night">Ночное видение</option>
              </select>
            </label>
            <label>Память света
              <select v-model="flashlight.memory">
                <option value="off">Только луч</option>
                <option value="fade">Плавное затухание</option>
                <option value="persist">До сброса</option>
              </select>
            </label>
            <label v-if="flashlight.memory === 'fade'">
              Затухание <output>{{ flashlight.seconds }} с</output>
              <input v-model.number="flashlight.seconds" type="range" min="0.5" max="15" step="0.5">
            </label>
            <button v-if="flashlight.memory !== 'off'" type="button" @click="resetKey++">Стереть след</button>
          </template>

          <label v-if="active === 'magic'">Палитра
            <select v-model="magic.preset">
              <option value="aurora">Сияние</option>
              <option value="ember">Угли</option>
              <option value="forest">Лес</option>
            </select>
          </label>

          <template v-if="active === 'ring'">
            <label>Цвет кольца <input v-model="ring.color" type="color"></label>

            <label class="studio-toggle">
              <input v-model="ring.shadowEnabled" type="checkbox"> Тень вокруг
            </label>

            <template v-if="ring.shadowEnabled">
              <label>Размытие тени <output>{{ ring.shadowBlur }} px</output>
                <input v-model.number="ring.shadowBlur" type="range" min="0" max="60" step="1">
              </label>
              <label>Прозрачность тени <output>{{ Math.round(ring.shadowOpacity * 100) }}%</output>
                <input v-model.number="ring.shadowOpacity" type="range" min="0" max="1" step="0.01">
              </label>
              <label>Цвет тени <input v-model="ring.shadowColor" type="color"></label>
            </template>
          </template>

          <label v-for="slider in sliders[active]" :key="slider.key">
            {{ slider.label }} <output>{{ current[slider.key] }}{{ slider.unit || '' }}</output>
            <input
              v-model.number="current[slider.key]"
              type="range"
              :min="slider.min"
              :max="slider.max"
              :step="slider.step ?? 1"
            >
          </label>
        </aside>

        <div class="studio-scene" :class="`scene-${active}`">
          <div class="studio-landmark landmark-west"><span>◆</span> Западный проход</div>
          <div class="studio-landmark landmark-east"><span>✦</span> Северная башня</div>
          <div class="studio-centre">
            <strong>{{ sceneTitle }}</strong>
            <button type="button" @click="activated = !activated">
              {{ activated ? 'Печать открыта' : 'Открыть печать' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ДЕТИ МАРШРУТА -->
    <router-view />

    <!-- КУРСОР: слой поверх всего -->
    <div class="cursor-layer">
      <component
        :is="cursorComponent"
        v-if="cursorComponent"
        v-bind="cursorProps"
        :enabled="cursorEnabled"
        :reset-key="resetKey"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import MagicCursor from './MagicCursor.vue';
import RingCursor from './RingCursor.vue';
import FlashlightCursor from './FlashlightCursor.vue';

// ─── РЕЕСТР КУРСОРОВ ───
// Чтобы добавить новый курсор: импорт + строка в components + defaultProps.
const components = {
  magic: MagicCursor,
  ring: RingCursor,
  flashlight: FlashlightCursor,
};

const defaultProps = {
  magic: { preset: 'aurora', radius: 75, intensity: 0.25, lifetime: 0.55 },
  ring: {
    color: 'rgba(226,239,255,0.76)',
    diameter: 36,
    pulse: 700,
    shadowEnabled: true,
    shadowBlur: 15,
    shadowOpacity: 0.75,
    shadowColor: '#40403b',
  },
    flashlight: {
    diameter: 300,
    softness: 0.55,
    glow: 0.22,
    darkness: 0.92,
    flicker: 0,
    color: 'warm',
    memory: 'off',
    seconds: 4,
    showDot: true,
  },
};

// ─── СОСТОЯНИЕ МАСТЕРСКОЙ ───
const modes = [
  { id: 'flashlight', label: 'Фонарик' },
  { id: 'magic', label: 'Шлейф' },
  { id: 'ring', label: 'Кольцо' },
];

const active = ref('magic');
const enabled = ref(true);
const activated = ref(false);
const resetKey = ref(0);

const flashlight = reactive({ ...defaultProps.flashlight });
const magic = reactive({ ...defaultProps.magic });
const ring = reactive({ ...defaultProps.ring });

const settings = { flashlight, magic, ring };
const current = computed(() => settings[active.value]);

const sceneTitle = computed(() => ({
  flashlight: 'Зал под башней',
  magic: 'Световая поляна',
  ring: 'Вход в башню',
})[active.value]);

const sliders = {
  flashlight: [
    { key: 'diameter', label: 'Диаметр', min: 80, max: 700, step: 10, unit: ' px' },
    { key: 'softness', label: 'Мягкость края', min: 0.05, max: 1, step: 0.05 },
    { key: 'glow', label: 'Цветное свечение', min: 0, max: 0.65, step: 0.05 },
    { key: 'darkness', label: 'Темнота', min: 0, max: 1, step: 0.01 },
    { key: 'flicker', label: 'Мерцание', min: 0, max: 1, step: 0.05 },
  ],
  magic: [
    { key: 'radius', label: 'Радиус', min: 10, max: 100, unit: ' px' },
    { key: 'intensity', label: 'Яркость', min: 0, max: 1, step: 0.05 },
    { key: 'lifetime', label: 'Затухание', min: 0.3, max: 3, step: 0.05, unit: ' с' },
  ],
  ring: [
    { key: 'diameter', label: 'Диаметр', min: 18, max: 80, unit: ' px' },
    { key: 'pulse', label: 'Пульсация', min: 300, max: 1500, step: 50, unit: ' мс' },
  ],
};

// ─── META ───
const route = useRoute();

// Показывать ли мастерскую (сцену + контролы)
const showStudio = computed(() => {
  const cfg = route.meta?.cursorStudio;
  if (cfg && cfg.scene === false) return false;
  return true;
});

// Тип курсора
const cursorType = computed(() => {
  const m = route.meta?.cursor;

  if (m === 'none') return null;
  if (typeof m === 'string') return components[m] ? m : active.value;
  if (m?.type && components[m.type]) return m.type;

  return active.value;
});

// Включён ли курсор
const cursorEnabled = computed(() => {
  const m = route.meta?.cursor;
  if (m === 'none') return false;
  if (m) return true;
  return enabled.value;
});

// Props курсора: без type (он уже использован для выбора компонента)
const cursorProps = computed(() => {
  const type = cursorType.value;
  if (!type) return {};

  const m = route.meta?.cursor;
  let fromMeta = {};

  if (typeof m === 'object' && m) {
    const { type: _ignored, ...rest } = m; // убираем type из props
    fromMeta = rest;
  } else if (route.meta?.cursorProps) {
    fromMeta = route.meta.cursorProps;
  }

  const fromMaster =
    type === active.value && settings[type] ? settings[type] : {};

  return {
    ...(defaultProps[type] || {}),
    ...fromMaster,
    ...fromMeta,
  };
});

const cursorComponent = computed(() => components[cursorType.value] || null);
</script>

<style scoped>
/* ─── КОРЕНЬ ─── */
.cursor-root {
  position: relative;
  min-height: 100vh;
}

/* ─── СЛОЙ КУРСОРА ─── */
.cursor-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 999999;
}

/* ─── МАСТЕРСКАЯ ─── */
.cursor-studio {
  max-width: 1100px;
  margin: 24px auto;
  padding: clamp(14px, 3vw, 28px);
  background: #181b25;
  border: 1px solid #444959;
  border-radius: 16px;
  color: #f5ecd8;
  font: 15px system-ui, sans-serif;
}

.cursor-studio header,
.studio-modes {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}
.cursor-studio h1 { margin: 0; font: 700 clamp(26px, 4vw, 40px) / 1.1 Georgia, serif; }
.cursor-studio p { color: #b6b9c6; margin: 8px 0; }
.cursor-studio button,
.cursor-studio select {
  font: inherit;
  color: inherit;
  background: #272b38;
  border: 1px solid #60667b;
  padding: 8px 12px;
  border-radius: 7px;
}
.cursor-studio button { cursor: pointer; }
.cursor-studio button[aria-pressed='true'] {
  background: #e9c783;
  color: #282333;
  border-color: #ffe2a8;
}

.studio-layout {
  display: grid;
  grid-template-columns: minmax(185px, 230px) minmax(0, 1fr);
  gap: 14px;
  margin-top: 16px;
}

.studio-controls {
  display: grid;
  align-content: start;
  gap: 12px;
  padding: 14px;
  background: #202433;
  border-radius: 10px;
}
.studio-controls label { display: block; font-size: 13px; }
.studio-controls output { float: right; color: #e9c783; }
.studio-controls label select,
.studio-controls input[type='range'] {
  display: block;
  width: 100%;
  margin: 6px 0 0;
}
.studio-controls input { accent-color: #e9c783; }

.studio-scene {
  isolation: isolate;
  position: relative;
  min-height: 480px;
  overflow: hidden;
  border: 1px solid #666253;
  border-radius: 11px;
  background:
    radial-gradient(ellipse at 52% 40%, #6d6448, transparent 65%),
    repeating-linear-gradient(110deg, #9a865224 0 1px, transparent 1px 24px),
    #242c27;
}
.scene-flashlight,
.scene-magic { touch-action: none; }
.studio-scene::before {
  position: absolute;
  inset: 9%;
  border: 2px solid #d8bc7355;
  border-radius: 48% 48% 12px 12px;
  box-shadow: 0 0 0 7px #191d1a77, inset 0 0 55px #191a1090;
  content: '';
  pointer-events: none;
}
.studio-centre {
  position: absolute;
  top: 43%;
  left: 0;
  right: 0;
  display: grid;
  gap: 12px;
  justify-items: center;
}
.studio-centre strong { font: 700 clamp(23px, 4vw, 42px) Georgia, serif; }
.studio-landmark {
  position: absolute;
  padding: 6px 10px;
  color: #efda9f;
  font-size: 12px;
}
.studio-landmark span {
  color: #ffe4aa;
  font-size: 22px;
  vertical-align: middle;
  margin-right: 4px;
}
.landmark-west { bottom: 15%; left: 9%; }
.landmark-east { top: 14%; right: 9%; }
.scene-magic { background: radial-gradient(ellipse at 56% 55%, #312049, #131626 70%); }

@media (max-width: 650px) {
  .studio-layout { grid-template-columns: 1fr; }
  .studio-scene { grid-row: 1; min-height: 330px; }
}
</style>
