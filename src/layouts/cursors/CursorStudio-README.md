# Мастерская курсоров

Открой `CursorStudio-preview.html` в браузере, чтобы попробовать все три режима. Для Vue или Quasar перенеси `CursorStudio.vue`, `MagicCursor.vue`, `RingCursor.vue` и `FlashlightCursor.vue` в одну папку компонентов. Открой `<CursorStudio />` на тестовой странице.

Для игры или layout можно взять только файл выбранного эффекта. Шлейф по умолчанию занимает окно. Чтобы ограничить его сценой, добавь параметр `local`. Кольцо и фонарик работают внутри непосредственного родителя с `position: relative`.

```vue
<script setup>
import FlashlightCursor from 'components/FlashlightCursor.vue'
</script>

<template>
  <div class="game-scene">
    <slot />
    <FlashlightCursor color="night" memory="fade" :seconds="5"
      :diameter="280" :softness="0.6" :glow="0.3" :flicker="0.15" />
  </div>
</template>

<style scoped>
.game-scene { position: relative; overflow: hidden; min-height: 70vh; }
</style>
```

Фонарик поддерживает `warm`, `white` и `night`. Параметр `darkness` управляет темнотой вне луча, `glow` — цветным свечением. В режиме `off` видна только зона под лучом, `fade` плавно стирает след, а `persist` сохраняет освещённые зоны до сброса. Измени числовой `resetKey`, чтобы стереть след. Смена режима памяти, выключение эффекта и изменение размеров сцены тоже очищают карту света.

Для HTML-игры функция `mountFlashlight` уже встроена в исходный код автономного демо. Она принимает canvas и функцию, возвращающую настройки. Методы `refresh()`, `reset()` и `dispose()` обновляют настройки, стирают след и отключают эффект соответственно.
