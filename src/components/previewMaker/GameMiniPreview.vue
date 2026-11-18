<template>
  <div v-if="type === 'dialSafe'" class="sample safe">
    <div class="dial">
      <i v-for="pin in 6" :key="pin" class="pin" :style="{ '--turn': (pin * 60 - 30) + 'deg' }" aria-hidden="true"></i>
      <span v-for="(word, index) in preview.choices" :key="word.ru" class="dial-word"
        :class="word === preview.prompt ? 'south' : positions[index]">{{ word.ru }}</span>
      <strong class="dial-centre">S.P.E.C.I.A.L</strong>
      <span class="dial-needle" aria-hidden="true"></span>
    </div>
    <div class="dial-controls"><span aria-hidden="true">↶</span><strong lang="en">{{ preview.prompt.eng }}</strong><span aria-hidden="true">↷</span></div>
  </div>
  <div v-else-if="type === 'find-pairs-easy'" class="sample wires">
    <img class="agent" src="./wire-cutter.png" alt="" draggable="false" width="240" height="240">
    <div class="wire-stage">
      <span class="wire-prompt">
        <img v-if="preview.prompt.image" :src="preview.prompt.image" alt="" draggable="false">
        {{ preview.prompt.ru }}
      </span>
      <svg class="wire-lines" viewBox="0 0 62 200" preserveAspectRatio="none" fill="none" stroke-width="3" aria-hidden="true">
        <path v-for="(_, index) in preview.choices" :key="index"
          :d="`M0 100 C32 100, 32 ${wireEnd(index)}, 62 ${wireEnd(index)}`" :stroke="wireColors[index]" />
      </svg>
      <div class="wire-answers" :style="{ gridTemplateRows: `repeat(${preview.choices.length}, 1fr)` }">
        <span v-for="word in preview.choices" :key="word.eng" class="wire-answer">
          <b lang="en">{{ word.eng }}</b><small v-if="word.hint">{{ word.hint }}</small>
        </span>
      </div>
    </div>
  </div>
  <div v-else class="sample ruins">
    <div class="ruins-clues">
      <span v-for="word in preview.words" :key="word.letters">
        <img v-if="word.image" :src="word.image" alt="" draggable="false">
        <template v-else>{{ word.ru || word.media }}</template>
      </span>
    </div>
    <div class="letter-grid" :style="{ gridTemplateColumns: `repeat(${preview.size}, 1fr)` }" lang="en" aria-hidden="true">
      <span v-for="(letter, index) in preview.letters" :key="index"
        :class="{ found: preview.highlighted.includes(index) }">{{ letter }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: { type: String, required: true },
  preview: { type: Object, required: true },
});
const positions = ['north', 'east', 'west'];
const wireColors = ['#5da8ff', '#65dca0', '#f7c756', '#ff817a'];
function wireEnd(index) {
  return (index + .5) * 200 / props.preview.choices.length;
}
</script>

<style scoped src="./mini-preview.css"></style>
