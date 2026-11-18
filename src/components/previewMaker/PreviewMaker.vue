<template>
  <section class="preview-maker" aria-label="Игры по набору">
    <header v-if="title"><h2 class="special-font">{{ title }}</h2></header>
    <p v-if="status === 'loading'" role="status">Загружаем набор…</p>
    <div v-else-if="status === 'error'">
      <p role="alert">{{ error }}</p>
      <button type="button" @click="refresh">Повторить</button>
    </div>
    <p v-else-if="!cards.length" role="status">Для этого набора пока нет подходящих превью.</p>
    <div v-else class="preview-grid">
      <a v-for="card in cards" :key="card.id" class="preview-card" :href="gameHref(card.id)"
        draggable="true" @dragstart="dragLink">
        <GameMiniPreview :type="card.id" :preview="card.preview" />
        <div class="preview-card-body">
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
          <span>Играть →</span>
        </div>
      </a>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { whatGameDataToUse } from '../../composables/whatGameDataToUse';
import GameMiniPreview from './GameMiniPreview.vue';
import { buildPreviews } from './previewModel.mjs';

const props = defineProps({
  missionName: { type: String, default: undefined },
  title: { type: String, default: '' },
  words: { type: Array, default: undefined },
  loadSet: { type: Function, default: undefined },
  availableGames: { type: Array, default: undefined },
});
const route = useRoute();
const router = useRouter();
const mission = computed(() => props.missionName ?? route.params.missionName ?? '');
const rows = shallowRef([]);
const status = ref('loading');
const error = ref('');
const cards = computed(() => mission.value ? buildPreviews(rows.value, props.availableGames) : []);
let revision = 0;
let pending;

async function refresh() {
  const current = ++revision;
  pending?.abort();
  pending = new AbortController();
  const signal = pending.signal;
  const key = mission.value;
  rows.value = [];
  error.value = '';
  status.value = 'loading';

  try {
    let result = props.words;
    if (result === undefined && key) {
      if (props.loadSet) {
        result = await props.loadSet(key, { signal });
      } else {
        const loader = whatGameDataToUse();
        result = await loader.loadWords(key);
        if (current !== revision) return;
        // The legacy loader returns [] on errors.
        if (!result?.length && loader.error.value) throw new Error(loader.error.value);
      }
    }
    if (current !== revision) return;
    if (result != null && !Array.isArray(result)) throw new Error('Источник набора должен вернуть список слов.');
    rows.value = result ?? [];
    status.value = 'ready';
  } catch (problem) {
    if (current !== revision) return;
    error.value = problem instanceof Error ? problem.message : 'Не удалось загрузить набор.';
    status.value = 'error';
  }
}

function gameHref(id) {
  const path = `/see-all-sets-of-words/${encodeURIComponent(mission.value)}/${id}`;
  return router.resolve(path).href;
}

function dragLink(event) {
  const url = event.currentTarget.href;
  event.dataTransfer?.setData('text/uri-list', url);
  event.dataTransfer?.setData('text/plain', url);
}

watch([mission, () => props.words, () => props.loadSet], refresh, { immediate: true });
defineExpose({ refresh });
onBeforeUnmount(() => { revision++; pending?.abort(); });
</script>

<style scoped>
.special-font { font-size: 18px; font-family: Special_f1; }
.preview-maker { color: #edf6ff; font-family: system-ui, sans-serif; }
.preview-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 275px), 1fr)); gap: 16px; }
.preview-card { display: flex; flex-direction: column; overflow: hidden; border: 1px solid #415a73; border-radius: 17px; background: #142236; color: inherit; text-decoration: none; user-select: none; }
.preview-card:hover { border-color: #92dfda; }
.preview-card:focus-visible { outline: 2px solid #92dfda; outline-offset: 4px; }
.preview-card-body { flex: 1; display: flex; flex-direction: column; padding: 15px 18px; }
.preview-card-body h3 { margin: 0; font-size: 21px; }
.preview-card-body p { margin: 6px 0 12px; color: #c5d4e3; }
.preview-card-body span { margin-top: auto; color: #9ae6e4; font-weight: 750; }
</style>
