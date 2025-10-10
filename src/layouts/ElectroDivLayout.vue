<template>
  <div
    :class="[
      'electro-container',
      { 'full-screen': fullScreen }
    ]"
  >
    <!-- SVG фильтры -->
    <svg class="svg-container">
      <defs>
        <filter id="electro-filter-moving" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
          <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
            <animate attributeName="dy" values="700; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
          </feOffset>

          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="1" />
          <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
            <animate attributeName="dy" values="0; -700" dur="6s" repeatCount="indefinite" calcMode="linear" />
          </feOffset>

          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="2" />
          <feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
            <animate attributeName="dx" values="490; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
          </feOffset>

          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="2" />
          <feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
            <animate attributeName="dx" values="0; -490" dur="6s" repeatCount="indefinite" calcMode="linear" />
          </feOffset>

          <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
          <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
          <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

          <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="30" xChannelSelector="R" yChannelSelector="B" />
        </filter>

        <filter id="electro-filter-hue" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="7" />
          <feColorMatrix type="hueRotate" result="pt1" >
            <animate attributeName="values" values="0;360;" dur="0.6s" repeatCount="indefinite" calcMode="paced" />
          </feColorMatrix>
          <feComposite />
          <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="7" seed="5" />
          <feColorMatrix type="hueRotate" result="pt2">
            <animate attributeName="values" values="0; 333; 199; 286; 64; 168; 256; 157; 360;" dur="5s" repeatCount="indefinite" calcMode="paced" />
          </feColorMatrix>
          <feBlend in="pt1" in2="pt2" mode="normal" result="combinedNoise" />
          <feDisplacementMap in="SourceGraphic" scale="30" xChannelSelector="R" yChannelSelector="B" />
        </filter>
      </defs>
    </svg>

    <!-- Основной контейнер -->
    <div
      :class="[
        'card-container',
        `electro-${effect}`,
        { 'outline-only': outlineOnly }
      ]"
      :style="{
        '--electric-border-color': color,
        '--electric-light-color': lightColor,
        '--gradient-color': gradientColor,
        'width': fullScreen ? '100%' : width,
        'height': fullScreen ? '100%' : height
      }"
    >
      <div class="inner-container" v-if="!outlineOnly">
        <div class="border-outer">
          <div class="main-card"></div>
        </div>
        <div class="glow-layer-1"></div>
        <div class="glow-layer-2"></div>
      </div>

      <div class="overlay-1" v-if="!outlineOnly"></div>
      <div class="overlay-2" v-if="!outlineOnly"></div>
      <div class="background-glow" v-if="!outlineOnly"></div>

      <!-- Контент показываем только если не outlineOnly -->
      <div class="content-container" v-if="!outlineOnly">
        <slot name="top">
          <div class="content-top">
            <div class="scrollbar-glass">
              {{ title || 'Electro' }}
            </div>
            <p class="title">{{ title || 'Electro Div' }}</p>
          </div>
        </slot>

        <hr class="divider" />

        <div class="content-bottom">
          <slot name="bottom">
            <p class="description">{{ description || 'Amazing electro effect container' }}</p>
          </slot>
        </div>
      </div>

      <!-- Для outline-only режима - просто контур -->
      <div class="outline-container" v-if="outlineOnly">
        <div class="outline-border"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: '#dd8448' // оранжевый по умолчанию
  },
  effect: {
    type: String,
    default: 'moving', // 'moving' или 'hue'
    validator: (value) => ['moving', 'hue'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '22rem'
  },
  height: {
    type: String,
    default: 'auto'
  },
  fullScreen: {
    type: Boolean,
    default: false
  },
  outlineOnly: {
    type: Boolean,
    default: false
  }
})

// Вычисляемые цвета на основе основного цвета
const lightColor = computed(() => {
  return props.color
})

const gradientColor = computed(() => {
  return props.color + '66'
})
</script>

<style scoped lang="scss">
.electro-container {
  position: relative;
  display: inline-block;

  &.full-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9998;
    pointer-events: none;

    .card-container {
      pointer-events: none;
    }
  }
}

.svg-container {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.card-container {
  padding: 2px;
  border-radius: 1.5em;
  position: relative;
  background: linear-gradient(
      -30deg,
      var(--gradient-color),
      transparent,
      var(--gradient-color)
  ),
  linear-gradient(
      to bottom,
      var(--color-neutral-900, oklch(0.185 0 0)),
      var(--color-neutral-900, oklch(0.185 0 0))
  );

  &.electro-moving {
    --f: url(#electro-filter-moving);
  }

  &.electro-hue {
    --f: url(#electro-filter-hue);
  }

  // Стили для outline-only режима
  &.outline-only {
    background: transparent;
    border-radius: 0;
    padding: 4px;

    .outline-container {
      position: relative;
      width: 100%;
      height: 100%;

      .outline-border {
        width: 100%;
        height: 100%;
        border: 2px solid var(--electric-border-color);
        filter: var(--f);
        border-radius: 0;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border: 1px solid color-mix(in oklch, var(--electric-border-color) 60%, transparent);
          filter: blur(1px);
          pointer-events: none;
        }

        &::after {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border: 1px solid var(--electric-light-color);
          filter: blur(4px);
          pointer-events: none;
        }
      }
    }
  }
}

.inner-container {
  position: relative;
}

.border-outer {
  border: 2px solid color-mix(in oklch, var(--electric-border-color) 50%, transparent);
  border-radius: 1.5em;
  padding-right: .15em;
  padding-bottom: .15em;
}

.main-card {
  width: 100%;
  aspect-ratio: 7 / 10;
  border-radius: 1.5em;
  border: 2px solid var(--electric-border-color);
  margin-top: -4px;
  margin-left: -4px;
  filter: var(--f);
}

.glow-layer-1 {
  border: 2px solid color-mix(in oklch, var(--electric-border-color) 60%, transparent);
  border-radius: 24px;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  filter: blur(1px);
}

.glow-layer-2 {
  border: 2px solid var(--electric-light-color);
  border-radius: 24px;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  filter: blur(4px);
}

.overlay-1 {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 24px;
  opacity: 1;
  mix-blend-mode: overlay;
  transform: scale(1.1);
  filter: blur(16px);
  background: linear-gradient(
      -30deg,
      white,
      transparent 30%,
      transparent 70%,
      white
  );
}

.overlay-2 {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 24px;
  opacity: 0.5;
  mix-blend-mode: overlay;
  transform: scale(1.1);
  filter: blur(16px);
  background: linear-gradient(
      -30deg,
      white,
      transparent 30%,
      transparent 70%,
      white
  );
}

.background-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 24px;
  filter: blur(32px);
  transform: scale(1.1);
  opacity: 0.3;
  z-index: -1;
  background: linear-gradient(
      -30deg,
      var(--electric-light-color),
      transparent,
      var(--electric-border-color)
  );
}

.content-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-top {
  display: flex;
  flex-direction: column;
  padding: 48px;
  padding-bottom: 16px;
  height: 100%;
}

.content-bottom {
  display: flex;
  flex-direction: column;
  padding: 48px;
  padding-top: 16px;
}

.scrollbar-glass {
  background: radial-gradient(
      47.2% 50% at 50.39% 88.37%,
      rgba(255, 255, 255, 0.12) 0%,
      rgba(255, 255, 255, 0) 100%
  ),
  rgba(255, 255, 255, 0.04);
  position: relative;
  transition: background 0.3s ease;
  border-radius: 14px;
  width: fit-content;
  height: fit-content;
  padding: .5em 1em;
  text-transform: uppercase;
  font-weight: bold;
  font-size: .85em;
  color: rgba(255, 255, 255, 0.8);

  &:hover {
    background: radial-gradient(
        47.2% 50% at 50.39% 88.37%,
        rgba(255, 255, 255, 0.12) 0%,
        rgba(255, 255, 255, 0) 100%
    ),
    rgba(255, 255, 255, 0.08);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 1px;
    background: linear-gradient(
        150deg,
        rgba(255, 255, 255, 0.48) 16.73%,
        rgba(255, 255, 255, 0.08) 30.2%,
        rgba(255, 255, 255, 0.08) 68.2%,
        rgba(255, 255, 255, 0.6) 81.89%
    );
    border-radius: inherit;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: xor;
    -webkit-mask-composite: xor;
    pointer-events: none;
  }
}

.title {
  font-size: 2.25em;
  font-weight: 500;
  margin-top: auto;
  color: white;
}

.description {
  opacity: 0.5;
  color: white;
}

.divider {
  margin-top: auto;
  border: none;
  height: 1px;
  background-color: currentColor;
  opacity: 0.1;
  mask-image: linear-gradient(to right, transparent, black, transparent);
  -webkit-mask-image: linear-gradient(
      to right,
      transparent,
      black,
      transparent
  );
}
</style>
