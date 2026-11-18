<template>
  <section class="word-search" aria-label="Поиск английских слов">
    <header class="search-header">
      <div><h1>файнд уордз</h1>
        <!--        <p>Найди слово по переводу. Нажимай буквы по порядку или проведи от первой до последней.</p>-->
      </div>
      <div class="search-actions">
        <div class="search-levels" role="group" aria-label="Сложность">
          <button v-for="level in LEVELS" :key="level.id" type="button" :aria-pressed="difficulty === level.id" @click="changeLevel(level.id)">{{ level.label }}</button>
        </div>

        <!--        <button type="button" @click="loadGame">Новое поле</button>-->
        <button type="button" :disabled="!canReveal" @click="game.reveal(false)">подсказка</button>
        <!--        <button type="button" :disabled="!canReveal" @click="game.reveal(true)">Показать все ответы</button>-->
        <output v-if="state && !loading && !error" class="search-score" ref="scoreEl">
          My score <strong>{{ animatedScore + animatedPreview }}</strong>
        </output>
      </div>
    </header>
    <p v-if="loading" role="status">Готовим поле…</p>
    <p v-else-if="error" role="alert">{{ error }}</p>
    <template v-else>
      <div class="search-progress"><progress :value="state.found.length" :max="state.board.words.length" aria-label="Найдено слов"></progress><strong>{{ state.found.length }} / {{ state.board.words.length }}</strong></div>
      <div class="search-layout">
        <aside class="search-clues" aria-label="Переводы">
          <div class="clue-heading">
            <h2>Переводы</h2>
            <button type="button" class="clue-toggle" :aria-expanded="cluesOpen" :aria-label="cluesOpen ? 'Скрыть переводы' : 'Показать переводы'" @click="cluesOpen = !cluesOpen">{{ cluesOpen ? '×' : '+' }}</button>
          </div>
          <div v-show="cluesOpen" class="clue-cards">
            <div v-for="word in state.cards" :key="word.id" class="clue-card-slot">
              <component :is="word.picture && word.ru ? 'button' : 'div'"
                         class="clue-card" :class="{ 'is-flipped': flipped.has(word.id), 'can-flip': word.picture && word.ru }"
                         :type="word.picture && word.ru ? 'button' : undefined"
                         :aria-label="word.picture && word.ru ? (flipped.has(word.id) ? 'Показать изображение' : 'Показать перевод') : undefined"
                         @click="flipCard(word)">
                <span class="clue-card-face" :aria-hidden="flipped.has(word.id)">
                  <img v-if="word.image" :src="word.image" alt="Картинка к слову" loading="lazy">
                  <span v-else-if="word.picture" class="clue-art">{{ word.picture }}</span>
                  <span v-else>{{ word.ru }}<small v-if="word.hint">{{ word.hint }}</small></span>
                </span>
                <span v-if="word.picture && word.ru" class="clue-card-face clue-card-back" :aria-hidden="!flipped.has(word.id)">
                  <span>{{ word.ru }}<small v-if="word.hint">{{ word.hint }}</small></span>
                </span>
                <span v-if="word.picture && word.ru" class="clue-flip" aria-hidden="true">⇄</span>
              </component>
            </div>
          </div>
        </aside>
        <div class="search-paper" ref="paper">
          <div class="search-grid" ref="grid" :style="{ '--size': state.board.size }" role="group" aria-label="Поле букв">
            <svg class="search-ink" :viewBox="`0 0 ${state.board.size} ${state.board.size}`" aria-hidden="true">
              <polyline v-for="mark in marks" :key="mark.id" :class="mark.tone" :points="mark.points" />
            </svg>
            <button v-for="(letter, index) in state.board.cells" :key="index" type="button" lang="en"
                    :data-cell="index" :tabindex="cursor === index ? 0 : -1" :aria-label="letterLabel(letter, index, state.board.size)"
                    :class="cellClasses(state, index)" @focus="cursor = index" @keydown="moveFocus($event, index)" @click="game.select(index)"><span>{{ letter }}</span></button>
          </div>
        </div>
      </div>
      <div class="search-footer"><p role="status">{{ state.message }}</p><button v-if="state.sequence.length && !state.pending && !state.awaitingDialog" type="button" @click="game.cancel">Сбросить выбор</button><button v-if="complete && !demo" type="button" @click="finish">К результатам →</button></div>
    </template>
    <dialog ref="translationDialog" class="search-dialog" aria-label="Выбери перевод" @cancel.prevent="cancelTranslation" @close="onDialogClose">
      <div class="search-dialog-heading"><h2>Выбери перевод</h2><button type="button" aria-label="Закрыть" @click="cancelTranslation">×</button></div>
      <strong class="search-reveal" lang="en">{{ state?.pending?.eng }}</strong>
      <div class="search-choices">
        <button v-for="word in remainingClues" :key="word.id" type="button" :class="{ 'choice-wrong': state.wrongChoice === word.id }" @click="game.answer(word.id)">
          <img v-if="!word.ru && word.image" :src="word.image" alt="Картинка к слову">
          <span v-else>{{ word.ru || word.picture }}</span><small v-if="word.hint">{{ word.hint }}</small>
        </button>
      </div>
      <p role="status">{{ state?.wrongChoice == null ? '' : 'Перевод не совпал. Попробуй ещё раз.' }}</p>
    </dialog>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from 'stores/example-store';
import { whatGameDataToUse } from '../composables/whatGameDataToUse';

const scoreEl = ref(null);
const animatedScore = ref(0);
const animatedPreview = ref(0);
let scoreAnimation = null;
let previewAnimation = null;

// BEGIN SHARED WORD SEARCH
const LEVELS = [
  { id: 'basic', label: 'light level' },
  { id: 'diagonal', label: 'hard' },
];
const DEMO_WORDS = [
  { eng: 'stomach', ru: 'желудок', hint: '/ стОмак /' },
  { eng: 'treasure', ru: 'сокровище', hint: '/ трЭжэр /' },
  { eng: 'jungle', ru: 'джунгли', hint: '/ джАнгл /', taskPicture: '🌿' },
  { eng: 'temple', ru: 'храм', hint: '/ тЭмпл /' },
  { eng: 'waterfall', ru: 'водопад', hint: '/ уОтерфол /' },
  { eng: 'river', ru: 'река', hint: '/ рИвэр /' },
  { eng: 'ancient', ru: 'древний', hint: '/ Эйншэнт /' },
  { eng: 'forest', ru: 'лес', hint: '/ фОрест /' },
  { eng: 'bridge', ru: 'мост', hint: '/ бридж /' },
  { eng: 'map', ru: 'карта', hint: '/ мэп /', taskPicture: '🗺️' },
];
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function normalizeWords(data) {
  const seenWords = new Set();
  const seenTranslations = new Set();
  const words = [];
  for (const row of Array.isArray(data) ? data : []) {
    const eng = typeof row?.eng === 'string' ? row.eng.trim() : '';
    const translationValue = row?.ru || row?.rus;
    const ru = typeof translationValue === 'string' ? translationValue.trim() : '';
    const picture = typeof row?.taskPicture === 'string' ? row.taskPicture.trim() : '';
    if (!/^[a-z]+(?:['’-][a-z]+)*$/i.test(eng) || (!ru && !picture)) continue;
    const letters = eng.replace(/[^a-z]/gi, '').toUpperCase();
    const translation = ru ? 'text:' + ru.toLowerCase() : 'picture:' + picture;
    if (letters.length < 3 || letters.length > 13 || seenWords.has(letters) || seenTranslations.has(translation)) continue;
    seenWords.add(letters);
    seenTranslations.add(translation);
    const image = /^(?:https?:\/\/|blob:|file:|\.{0,2}\/|data:image\/)|^[^\s]+\.(?:png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i.test(picture) ? picture : '';
    words.push({ picture, image, id: letters, letters, eng, ru, hint: typeof row.hint === 'string' ? row.hint.trim() : '' });
  }
  return words;
}
function chooseWords(words) {
  const chosen = [];
  for (const word of shuffle(words)) {
    // A shorter word embedded in a longer one would create an extra visible answer.
    if (chosen.some(other => [other.letters, [...other.letters].reverse().join('')].some(letters =>
      letters.includes(word.letters) || word.letters.includes(letters)))) continue;
    chosen.push(word);
    if (chosen.length === 10) break;
  }
  return chosen;
}

function fillBoard(cells, placed, size) {
  const randomLetter = () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  const filled = cells.map(letter => letter || randomLetter());
  const directions = [[0,1], [1,0], [1,1], [1,-1], [0,-1], [-1,0], [-1,-1], [-1,1]];
  const constraints = [];
  for (const word of placed) {
    for (let start = 0; start < cells.length; start++) {
      const row = Math.floor(start / size), col = start % size;
      for (const [dy, dx] of directions) {
        const last = word.letters.length - 1;
        const y = row + dy * last, x = col + dx * last;
        if (y < 0 || y >= size || x < 0 || x >= size) continue;
        const path = Array.from(word.letters, (_, i) => start + (dy * size + dx) * i);
        if (path.every((cell, i) => cell === word.path[i])) continue;
        if (path.every((cell, i) => cell === word.path[last - i]) && word.letters === [...word.letters].reverse().join('')) continue;
        if (path.some((cell, i) => cells[cell] && cells[cell] !== word.letters[i])) continue;
        const free = path.filter(cell => !cells[cell]);
        if (!free.length) return null;
        constraints.push({ path, free, letters: word.letters });
      }
    }
  }
  // Repair only filler cells, leaving every registered word intact.
  for (let pass = 0; pass < 32; pass++) {
    let changed = false;
    for (const { path, free, letters } of constraints) {
      if (!path.every((cell, i) => filled[cell] === letters[i])) continue;
      const cell = free[Math.floor(Math.random() * free.length)];
      const previous = ALPHABET.indexOf(filled[cell]);
      filled[cell] = ALPHABET[(previous + 1 + Math.floor(Math.random() * 25)) % 26];
      changed = true;
    }
    if (!changed) return filled;
  }
  return null;
}

function buildBoard(sample, difficulty) {
  const diagonal = difficulty === 'diagonal';
  const longest = Math.max(...sample.map(word => word.letters.length));
  let size = Math.max(10, sample.length, longest);
  const sorted = [...sample].sort((a, b) => b.letters.length - a.letters.length);
  const straight = [[0, 1], [1, 0]];
  let cells;
  let placed;
  let filled;
  for (let attempt = 0; attempt < 12; attempt++) {
    cells = Array(size * size).fill('');
    placed = [];
    for (const word of sorted) {
      const directions = diagonal && !placed.length ? [[1, 1], [1, -1]]
        : diagonal ? [...straight, [1, 1], [1, -1]] : straight;
      let bestScore = -Infinity;
      let bestPath;
      for (const [dy, dx] of directions) {
        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            const endRow = row + dy * (word.letters.length - 1);
            const endCol = col + dx * (word.letters.length - 1);
            if (endRow >= size || endCol < 0 || endCol >= size) continue;
            const path = [];
            let crossings = 0;
            for (let i = 0; i < word.letters.length; i++) {
              const index = (row + dy * i) * size + col + dx * i;
              if (cells[index] && cells[index] !== word.letters[i]) break;
              if (cells[index]) crossings++;
              path.push(index);
            }
            if (path.length !== word.letters.length || placed.some(other => selectablePaths(word, path).some(candidate =>
              selectablePaths(other, other.path).some(existing => pathsShareStart(candidate, existing))))) continue;
            const score = crossings * 3 + Math.random();
            if (score > bestScore) { bestScore = score; bestPath = path; }
          }
        }
      }
      if (!bestPath) break;
      bestPath.forEach((index, i) => { cells[index] = word.letters[i]; });
      placed.push({ ...word, path: bestPath });
    }
    if (placed.length === sample.length) {
      filled = fillBoard(cells, placed, size);
      if (filled) break;
    }
    size++;
  }
  if (!filled) throw new Error('Отправь скриншот Винсентику please.Не удалось разместить слова WordSearch. ');
  const byId = new Map(placed.map(word => [word.id, word]));
  return {
    size,
    cells: filled,
    words: sample.map(word => byId.get(word.id)),
  };
}
// Avoid placing one complete word on the opening cells of another.
function selectablePaths(word, path) {
  return word.letters === [...word.letters].reverse().join('') ? [path, [...path].reverse()] : [path];
}
function pathsShareStart(path, other) {
  return path.slice(0, Math.min(path.length, other.length)).every((cell, i) => cell === other[i]);
}
function cellClasses(state, index) {
  return {
    'letter-pulse': state.celebration !== null && state.celebration.path.includes(index),
    'letter-bounce': state.revealMode === 'hint' && state.revealCells.has(index),
    'letter-dim': state.revealMode === 'all' && !state.revealCells.has(index),
  };
}
function boardMarks(state) {
  const size = state.board.size;
  function mark(id, path, tone) {
    const points = path.map(index => `${index % size + 0.5},${Math.floor(index / size) + 0.5}`);
    // A tiny segment gives a single selected letter a round marker cap.
    if (points.length === 1) points.push(`${path[0] % size + 0.501},${Math.floor(path[0] / size) + 0.5}`);
    return { id, tone, points: points.join(' ') };
  }
  const marks = state.board.words.filter(word => state.found.includes(word.id)).map(word => {
    const step = word.path[1] - word.path[0];
    const tone = step === 1 ? 'ink-horizontal' : step === size ? 'ink-vertical' : 'ink-diagonal';
    return mark(word.id, word.path, tone);
  });
  if (state.sequence.length) marks.push(mark('active', state.sequence, 'ink-active'));
  return marks;
}
function bindGridDrag(grid, select) {
  let drag;
  let suppressClick = false;
  const cellAt = (x, y) => {
    const cell = grid.ownerDocument.elementFromPoint(x, y)?.closest('[data-cell]');
    return cell && grid.contains(cell) ? Number(cell.dataset.cell) : null;
  };
  function down(event) {
    if (drag || event.button !== 0 || !event.isPrimary) return;
    suppressClick = false;
    const index = cellAt(event.clientX, event.clientY);
    if (index === null) return;
    drag = { id: event.pointerId, index, last: index, x: event.clientX, y: event.clientY, moved: false };
  }
  function move(event) {
    if (drag?.id !== event.pointerId) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    const distance = Math.hypot(dx, dy);
    if (!drag.moved && distance < 5) return;
    if (!drag.moved) {
      drag.moved = true;
      suppressClick = true;
      grid.setPointerCapture(event.pointerId);
      drag.valid = select(drag.index);
    }
    if (!drag.valid) return;
    const steps = Math.ceil(distance / 6);
    for (let i = 1; i <= steps; i++) {
      const next = cellAt(drag.x + dx * i / steps, drag.y + dy * i / steps);
      if (next === null || next === drag.last) continue;
      drag.last = next;
      select(next, true);
    }
    drag.x = event.clientX;
    drag.y = event.clientY;
  }
  function end(event) { if (drag?.id === event.pointerId) drag = undefined; }
  function click(event) {
    if (event.detail && suppressClick) {
      event.stopImmediatePropagation();
      suppressClick = false;
    }
  }
  const listeners = {
    pointerdown: down,
    pointermove: move,
    pointerup: end,
    pointercancel: end,
    lostpointercapture: (event) => {
      // Завершаем жест, только если захват потеряло само поле.
      if (event.target === grid) end(event);
    },
  };
  for (const [name, handler] of Object.entries(listeners)) grid.addEventListener(name, handler);
  grid.addEventListener('click', click, true);
  return () => {
    for (const [name, handler] of Object.entries(listeners)) grid.removeEventListener(name, handler);
    grid.removeEventListener('click', click, true);
  };
}
function letterLabel(letter, index, size) {
  return `${letter}, строка ${Math.floor(index / size) + 1}, столбец ${index % size + 1}`;
}
function createSearchGame(render) {
  let state;
  let pulseTimer, revealTimer;
  const jumpMs = 400;
  const dialogPauseMs = 1000;
  function dispose() {
    clearTimeout(pulseTimer); clearTimeout(revealTimer);
  }
  const publish = () => render({ ...state });
  function reset(board) {
    dispose();
    const cards = board.words.slice(0, 5);
    state = { board, cards, shown: new Set(cards.map(word => word.id)), score: 0, previewScore: 0, found: [], sequence: [], celebration: null, awaitingDialog: false, revealMode: null, revealCells: new Set(), pending: null, wrongChoice: null, mistakes: 0, message: '' };
    publish();
  }
  function select(index, quiet = false) {
    if (state.pending || state.awaitingDialog || state.found.length === state.board.words.length) return false;
    const available = state.board.words.filter(word => !state.found.includes(word.id));
    function matching(path) {
      return available.filter(word => selectablePaths(word, word.path).some(candidate => path.every((cell, i) => candidate[i] === cell)));
    }
    let next = [...state.sequence, index];
    let candidates = matching(next);
    if (!candidates.length && !quiet && state.sequence.length) {
      candidates = matching([index]);
      if (candidates.length) next = [index];
    }
    if (!candidates.length && quiet) return false;
    if (!candidates.length) {
      state.mistakes++;
      state.previewScore = 0;
      state.message = state.sequence.length ? 'Нажми следующую букву по порядку.' : 'Начни с первой буквы слова.';
    } else {
      state.sequence = next;
      state.previewScore = next.length * 8;
      state.message = '';
      const completed = candidates.find(word => word.path.length === next.length);
      if (completed) {
        const remainingAfter = state.board.words.filter(w => !state.found.includes(w.id) && w.id !== completed.id);
        if (remainingAfter.length === 0) {
          award(completed);   // 🆕 без диалога
          publish();
          return true;
        }
        state.celebration = completed;
        state.awaitingDialog = true;
        state.revealMode = null;
        state.revealCells = new Set();
        clearTimeout(revealTimer);
        pulseTimer = setTimeout(() => {
          state.celebration = null;
          publish();
          pulseTimer = setTimeout(() => {
            state.awaitingDialog = false;
            state.pending = completed;
            state.wrongChoice = null;
            publish();
          }, dialogPauseMs);
        }, jumpMs);
      }
    }
    publish();
    return candidates.length > 0;
  }

  function award(word) {
    const wasShown = state.shown.has(word.id);
    const points = (wasShown ? 123 : 221) + word.path.length * 8;
    state.score += points;
    state.previewScore = 0;
    state.message = `+${points} points`;
    state.found = [...state.found, word.id];
    const slot = state.cards.findIndex(w => w.id === word.id);
    if (slot !== -1) {
      const replacement = state.board.words.find(w => !state.shown.has(w.id) && !state.found.includes(w.id));
      state.cards = [...state.cards];
      state.cards.splice(slot, 1, ...(replacement ? [replacement] : []));
      if (replacement) state.shown.add(replacement.id);
    }
    state.sequence = [];
    state.pending = null;
    state.wrongChoice = null;
  }
  function answer(id) {
    if (!state.pending || state.found.includes(id) || !state.board.words.some(w => w.id === id)) return;
    if (state.pending.id !== id) {
      state.mistakes++;
      state.wrongChoice = id;
      state.previewScore = 0;
    } else {
      award(state.pending);
    }
    publish();
  }


  function cancel() {
    if (!state.pending && !state.sequence.length) return;
    clearTimeout(pulseTimer);
    state.celebration = null;
    state.awaitingDialog = false;
    state.pending = null;
    state.sequence = [];
    state.previewScore = 0;
    state.wrongChoice = null;
    state.message = '';
    publish();
  }
  function reveal(all) {
    if (state.pending || state.awaitingDialog) return;
    const remaining = state.board.words.filter(word => !state.found.includes(word.id));
    if (!remaining.length) return;
    clearTimeout(revealTimer);
    const eligible = remaining.filter(word => !word.path.slice(0, 2).every(index => state.revealCells.has(index)));
    const word = shuffle(eligible.length ? eligible : remaining)[0];
    state.revealMode = all ? 'all' : 'hint';
    state.revealCells = new Set(all ? state.board.words.flatMap(word => word.path) : word.path.slice(0, 2));
    publish();
    revealTimer = setTimeout(() => { state.revealMode = null; state.revealCells = new Set(); publish(); }, all ? 2000 : 1500);
  }
  return { reset, select, answer, cancel, reveal, dispose };
}
// END SHARED WORD SEARCH

const props = defineProps({ demo: Boolean });
const route = useRoute();
const router = useRouter();
const store = useGameStore();
const { loadWords } = whatGameDataToUse();
const difficulty = ref('basic');
const loading = ref(true);
const error = ref('');
const state = ref(null);
const cursor = ref(0);
const paper = ref(null);
const grid = ref(null);
const cluesOpen = ref(true);
const flipped = ref(new Set());
function flipCard(word) {
  if (!word.picture || !word.ru) return;
  if (flipped.value.has(word.id)) flipped.value.delete(word.id);
  else flipped.value.add(word.id);
}
const marks = computed(() => state.value ? boardMarks(state.value) : []);
watch(grid, (element, _, cleanup) => {
  if (element) cleanup(bindGridDrag(element, game.select));
}, { flush: 'post' });
const translationDialog = ref(null);
let sourceWords = [];
let startedAt = 0;
let request = 0;
let finishing = false;
const game = createSearchGame(snapshot => { state.value = snapshot; });
const complete = computed(() => state.value?.found.length === state.value?.board.words.length);
const canReveal = computed(() => !loading.value && !error.value && state.value && !complete.value && !state.value.awaitingDialog && !state.value.pending);
const remainingClues = computed(() => state.value?.board.words.filter(word => !state.value.found.includes(word.id)) ?? []);

function newBoard() {
  flipped.value.clear();
  cursor.value = 0;
  error.value = '';
  try {
    game.reset(buildBoard(chooseWords(sourceWords), difficulty.value));
    startedAt = Date.now();
  } catch (problem) {
    error.value = problem.message;
  }
}
async function loadGame() {
  const current = ++request;
  game.dispose();
  state.value = null;
  sourceWords = [];
  loading.value = true;
  error.value = '';
  try {
    const rows = props.demo ? DEMO_WORDS : await loadWords(route.params.missionName);
    if (current !== request) return;
    sourceWords = normalizeWords(rows);
    if (!sourceWords.length) throw new Error('В наборе нет отдельных английских слов длиной от 3 до 13 букв.');
    newBoard();
  } catch (problem) {
    if (current === request) error.value = problem instanceof Error ? problem.message : 'Не удалось загрузить слова.';
  } finally {
    if (current === request) loading.value = false;
  }
}
function changeLevel(level) {
  if (difficulty.value === level) return;
  difficulty.value = level;
  if (sourceWords.length) newBoard();
}
function moveFocus(event, index) {
  const size = state.value.board.size;
  const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -size, ArrowDown: size };
  if (event.key === 'Escape') { game.cancel(); return; }
  if (!(event.key in offsets)) return;
  event.preventDefault();
  if ((event.key === 'ArrowLeft' && index % size === 0) || (event.key === 'ArrowRight' && index % size === size - 1)) return;
  paper.value?.querySelectorAll('button')[index + offsets[event.key]]?.focus();
}
function cancelTranslation() { game.cancel(); }
function onDialogClose() {
  if (translationDialog.value?.open) return;
  if (state.value?.pending) game.cancel();
}
watch(() => state.value?.pending, pending => {
  const dialog = translationDialog.value;
  if (pending && dialog && !dialog.open) dialog.showModal();
  if (!pending && dialog?.open) dialog.close();
}, { flush: 'post' });

async function finish() {
  if (!complete.value || !state.value || props.demo || finishing) return;
  finishing = true;
  try {
    store.setLastGameResults(Date.now() - startedAt, state.value.mistakes);
    store.setGameName('GameWordSearch');
    store.setWordSet(route.params.missionName);
    await router.push({ path: '/leader-board/', query: { missionName: route.params.missionName, from: 'game-word-search' } });
  } finally { finishing = false; }
}
watch(() => [route.params.missionName, props.demo], loadGame, { immediate: true });


// Анимация основного счёта
watch(() => state.value?.score, (newScore) => {
  if (typeof newScore !== 'number') {
    animatedScore.value = 0;
    return;
  }
  const start = animatedScore.value;
  const end = newScore;
  if (start === end) return;

  cancelAnimationFrame(scoreAnimation);
  const duration = 600;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    animatedScore.value = Math.round(start + (end - start) * eased);

    if (scoreEl.value) {
      scoreEl.value.style.transform = `scale(${1 + Math.sin(progress * Math.PI) * 0.08})`;
    }

    if (progress < 1) {
      scoreAnimation = requestAnimationFrame(tick);
    } else {
      animatedScore.value = end;
      if (scoreEl.value) scoreEl.value.style.transform = '';
    }
  };
  scoreAnimation = requestAnimationFrame(tick);
}, { immediate: true });

// Анимация превью-счёта (за буквы)
watch(() => state.value?.previewScore ?? 0, (newPreview) => {
  const start = animatedPreview.value;
  const end = newPreview;
  if (start === end) return;

  cancelAnimationFrame(previewAnimation);
  const duration = 300;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    animatedPreview.value = Math.round(start + (end - start) * eased);

    if (progress < 1) {
      previewAnimation = requestAnimationFrame(tick);
    } else {
      animatedPreview.value = end;
    }
  };
  previewAnimation = requestAnimationFrame(tick);
}, { immediate: true });

onBeforeUnmount(() => {
  cancelAnimationFrame(scoreAnimation);
  cancelAnimationFrame(previewAnimation);
  request++;
  game.dispose();
});
</script>

<style scoped>
.word-search {
  --gold:#f4d899; --muted:#bfcbb2; --ink:#382817; --rim:#ac7940;
  max-width:1040px; margin:75px auto 0; padding:clamp(14px,4vw,36px);
  border-radius:18px; border:1px solid #6d8154; overflow:hidden;
  background:radial-gradient(ellipse at 78% 16%,#55745266,transparent 48%),radial-gradient(ellipse at 8% 95%,#58704066,transparent 55%),linear-gradient(138deg,#202d21,#13271d 47%,#0e1e18);
  box-shadow:0 16px 40px #0b1d1555; color:#fff1cc; font-family:system-ui,sans-serif;
}
.word-search * { box-sizing:border-box; }
.search-header,.search-actions,.search-footer { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
.search-header h1 { font-family: Special_f1, serif; margin:0; letter-spacing:-.035em; font-size: 20px}
.search-header p { margin:9px 0 0; color:var(--muted); font-size:13px; }
.search-actions { justify-content:flex-start; gap:8px; }
.word-search button { font:inherit; cursor:none; }
.search-actions button,.search-footer button { border:1px solid #8d9b72; color:#fff1cc; background:#263c2d; border-radius:6px; padding:8px 10px; font-size:12px; min-height:40px; }
.search-levels { display:flex; gap:4px; }
.search-levels [aria-pressed=true] { background:#e8c887; color:#382817; border-color:#ffdf9c; font-weight:700; }
.word-search button:focus-visible { outline:2px solid #bd651a; outline-offset:-2px; }
.search-progress { display:flex; align-items:center; gap:12px; margin:20px 0 14px; color:var(--gold); font:700 13px monospace; white-space:nowrap; }
.search-progress progress { flex:1; min-width:0; height:10px; appearance:none; border:0; border-radius:8px; overflow:hidden; background:#0d1c14; }
.search-progress progress::-webkit-progress-bar { background:#0d1c14; }
.search-progress progress::-webkit-progress-value { background:#9ac865; border-radius:8px; }
.search-progress progress::-moz-progress-bar { background:#9ac865; }
.search-layout { display:grid; grid-template-columns:minmax(145px,220px) minmax(0,1fr); gap:clamp(10px,2.5vw,22px); align-items:start; }
.search-clues,.search-paper { color:var(--ink); border:2px solid var(--rim); border-radius:12px; background:radial-gradient(ellipse at 48% 42%,#fff0c0,#edce8e); box-shadow:0 5px 0 #694524,0 10px 18px #07160c77,inset 0 0 0 3px #fff1bd88; }
.search-clues { overflow:hidden; }
.clue-heading { display:flex; align-items:center; justify-content:space-between; padding:5px 8px 5px 14px; color:#fff1c2; background:repeating-linear-gradient(0deg,#603b2166 0 1px,transparent 1px 6px),linear-gradient(#86542e,#56341f); font:700 19px Georgia,serif; }
.search-clues h2 { margin:0; font:inherit; }
.clue-toggle { width:38px; height:38px; border:1px solid #e7bb70; border-radius:8px; color:#56351d; background:linear-gradient(#ffe8a9,#d9ab61); box-shadow:0 2px #432715,inset 0 1px #fff1c8; font-size:23px!important; line-height:1; }
.search-score { display:inline-flex; align-items:center; gap:8px; min-height:40px; padding:8px 10px; border:1px solid #8d9b72; border-radius:6px; background:#263c2d; color:#fff1cc; font-size:12px; transition: transform 0.1s ease-out; will-change: transform; }
.search-score strong { color:#f4d899; font:700 15px monospace; }
.clue-cards { display:grid; gap:8px; padding:9px; }
.clue-card-slot { min-width:0; perspective:650px; }
.clue-card {
  position:relative; display:block; width:100%; height:clamp(64px,9vw,84px); padding:0; border:1px solid #a8753b;
  border-radius:8px; background:#fff0bb; color:#3b2918; box-shadow:0 2px 0 #a7764288; text-align:center; font-weight:750;
}
.clue-card.can-flip:hover { border-color:#655034; }
.clue-card-face {
  position:absolute; inset:0; display:grid; place-items:center; padding:8px; overflow:hidden; border-radius:inherit;
  background:linear-gradient(135deg,#fff3c9,#efd59a); backface-visibility:hidden; overflow-wrap:anywhere;
  transition:transform .32s ease; font-size:15px; line-height:1.15;
}
.clue-card-face img { width:100%; height:100%; min-height:0; object-fit:contain; }
.clue-card-back { transform:rotateY(-180deg); }
.clue-card.is-flipped .clue-card-face:first-child { transform:rotateY(180deg); }
.clue-card.is-flipped .clue-card-back { transform:rotateY(0); }
.clue-art { font-size:clamp(19px,4vw,30px); }
.clue-flip { position:absolute; right:4px; top:4px; z-index:1; padding:2px 5px; border:1px solid #b68b4a; border-radius:5px; background:#3d2d20; color:#fff2bd; line-height:1; }
.clue-card small,.search-choices small { display:block; margin-top:3px; color:#654b2d; font-size:11px; }
.search-choices img { display:block; width:100%; max-height:60px; object-fit:contain; }
@media(prefers-reduced-motion:reduce) { .clue-card-face { transition:none; } }
.search-paper { min-width:0; padding:clamp(4px,1vw,10px); overflow:auto; }
.search-grid { position:relative; isolation:isolate; display:grid; grid-template-columns:repeat(var(--size),minmax(19px,1fr)); width:min(100%,calc(var(--size) * 36px)); min-width:calc(var(--size) * 19px); margin:auto; touch-action:none; user-select:none; }
.search-ink { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
.search-ink polyline { fill:none; stroke-width:.76; stroke-linecap:round; stroke-linejoin:round; }
.ink-horizontal { stroke:#b5cd8e; }
.ink-vertical { stroke:#a7c7b1; }
.ink-diagonal { stroke:#d1bfdc; }
.ink-active { stroke:#99c86e; }
.search-grid button { position:relative; display:grid; place-items:center; aspect-ratio:1; padding:0; border:1px solid #bb8c5124; border-radius:3px; background:transparent; color:var(--ink); font-weight:800; font-size:clamp(11px,2.2vw,17px); }
.search-grid .letter-pulse span { animation:word-pulse .4s ease both; }
.search-grid .letter-bounce span { animation:letter-bounce .5s ease 4; }
.search-grid .letter-bounce:nth-of-type(3n) span { animation-delay:.08s; }
@keyframes word-pulse { 45% { transform:translateY(-4px) scale(1.2); } }
.search-grid .letter-dim span { opacity:.48; }
@keyframes letter-bounce { 45% { transform:translateY(-4px) scale(1.14); } }
@media(prefers-reduced-motion:reduce) {
  .search-grid .letter-bounce span,.search-grid .letter-pulse span { animation:none; outline:1px dashed currentColor; outline-offset:2px; }
}
.search-actions button:disabled { opacity:.5; cursor:none; }
.search-grid button:hover { border-color:#986c37; }
.search-footer { margin-top:12px; min-height:34px; font-size:13px; }
.search-footer p { margin:0; color:var(--muted); }
.search-dialog { width:min(430px,calc(100% - 24px)); max-height:calc(100dvh - 24px); overflow:auto; margin:auto; padding:18px; color:var(--ink); background:radial-gradient(ellipse at 45% 22%,#fff4cb,#efd297); border:2px solid #a5753f; border-radius:14px; box-shadow:0 14px 50px #0009,inset 0 0 0 3px #fff1bd; }
.search-dialog::backdrop { background:#102117bb; }
.search-dialog-heading { display:flex; justify-content:space-between; align-items:center; gap:10px; }
.search-dialog h2 { margin:0; font:700 23px Georgia,serif; }
.search-dialog-heading button { border:0; background:none; color:#56361d; font-size:24px; padding:0 8px; }
.search-reveal { display:block; margin:9px 0 14px; color:#345c27; font-size:20px; overflow-wrap:anywhere; }
.search-choices { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:7px; }
.search-choices button { min-height:44px; padding:7px 8px; border:1px solid #ba9359; border-radius:6px; background:#ffefbd; color:var(--ink); text-align:left; font-size:13px; overflow-wrap:anywhere; }
.search-choices button:hover { background:#e1eab6; }
.search-choices .choice-wrong { background:#f4bd95; border-color:#a75637; }
.search-dialog > p { margin:8px 0 0; color:#84381f; font-size:12px; }
@media(max-width:640px) {
  .search-layout { grid-template-columns:minmax(0,1fr); }
  .search-paper { grid-row:1; }
  .clue-cards { grid-template-columns:repeat(5,minmax(0,1fr)); }
  .clue-card-face { font-size:12px; padding:5px; }
  .clue-card small { font-size:9px; }
}
@media(max-width:420px) { .clue-cards { grid-template-columns:repeat(3,minmax(0,1fr)); } }
</style>
