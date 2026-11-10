<template>
  <section class="pick-lock" :class="{ 'is-open': roundComplete, 'is-safe': lockStyle === 'safe' }" aria-label="Игра: вскрой замок">
    <div class="lock-layout">
      <header class="mission-header">
        <div class="heading-row">
          <h1>Can you pick a lock?</h1>
          <span class="mission-badge">замОк {{ String(lockIndex + 1).padStart(2, '0') }}</span>
        </div>
        <p>Сможешь вскрыть замок?</p>
      </header>

      <div class="lock-toolbar">
        <!-- Стиль замка теперь автоматический (3 → 4 → 5 → safe), кнопки временно скрыты -->
        <!--
        <div class="style-toggle" role="group" aria-label="Стиль замка">
          <button type="button" :aria-pressed="lockStyle === 'medieval'" @click="changeStyle('medieval')">Старинный замок <span>3 / 4 / 5 пинов</span></button>
          <button type="button" :aria-pressed="lockStyle === 'safe'" @click="changeStyle('safe')">Стальной сейф <span>до конца</span></button>
        </div>
        -->
<!--        <button type="button" class="secondary-button" @click="loadGame">Начать заново</button>-->
      </div>

      <div class="mission-progress" role="progressbar" :aria-valuenow="completedCount" :aria-valuemax="words.length" aria-valuemin="0" aria-label="Слов найдено">
        <span v-for="(word, index) in words" :key="index" :class="{ done: index < completedCount }"></span>
      </div>

      <div v-if="loading" class="state-message" role="status">Подготавливаем замок…</div>
      <div v-else-if="loadError" class="state-message" role="alert">
        <p>{{ loadError }}</p>
        <button class="secondary-button" @click="loadGame">Повторить загрузку</button>
      </div>
      <template v-else>
        <div class="instrument-topline">
          <span><i class="status-light"></i>{{ roundComplete ? 'МЕХАНИЗМ РАЗБЛОКИРОВАН' : 'НАЖИМАЙ НА ПИНЫ' }}</span>
          <span>{{ lockedIndices.length }} / {{ roundWords.length }} ПИНОВ</span>
        </div>

        <div class="lock-viewport">
          <div class="lock-scene" ref="sceneRef">
            <!-- SVG draws the casing only. Real HTML buttons keep the pins keyboard-accessible. -->
            <svg v-if="lockStyle === 'medieval'" class="lock-housing" viewBox="0 0 1000 900" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="pl-metal" x1="240" y1="100" x2="700" y2="590" gradientUnits="userSpaceOnUse"><stop stop-color="#a39a78"/><stop offset=".22" stop-color="#5f5b49"/><stop offset=".45" stop-color="#c2b792"/><stop offset=".6" stop-color="#6d6650"/><stop offset="1" stop-color="#938365"/></linearGradient>
                <linearGradient id="pl-edge" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d2c5a1"/><stop offset=".46" stop-color="#6e6751"/><stop offset="1" stop-color="#332f24"/></linearGradient>
                <linearGradient id="pl-bolt" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#c2b391"/><stop offset=".35" stop-color="#82785e"/><stop offset=".5" stop-color="#a59776"/><stop offset="1" stop-color="#554d38"/></linearGradient>
                <radialGradient id="pl-screw"><stop stop-color="#b6a782"/><stop offset=".65" stop-color="#82785d"/><stop offset=".8" stop-color="#393629"/><stop offset="1" stop-color="#aa9b78"/></radialGradient>
                <pattern id="pl-grain" width="53" height="37" patternUnits="userSpaceOnUse"><path d="m2 8 12-2m16 20 17-3M5 35l8-1m23-21 8-2" stroke="#e9ddb5" stroke-opacity=".12"/><path d="m9 17 18-2m8 19 11-1" stroke="#191b16" stroke-opacity=".22"/></pattern>
              </defs>
              <g transform="translate(-300 0) scale(1.6 1.3)">
                <path class="housing-shadow" d="M500 39Q548 61 570 115Q648 135 672 203L650 280V471L677 508Q642 557 561 570L500 615L439 570Q358 557 323 508L350 471V280L328 203Q352 135 430 115Q452 61 500 39Z" fill="url(#pl-metal)" stroke="#242820" stroke-width="12"/>
                <path d="M500 53Q541 78 558 125Q639 149 656 204L634 280V479L658 507Q622 545 554 555L500 598L446 555Q378 545 342 507L366 479V280L344 204Q361 149 442 125Q459 78 500 53Z" stroke="#d2c3a0" stroke-opacity=".55" stroke-width="3"/>
                <path d="M500 76Q525 97 533 128L500 151L467 128Q475 97 500 76ZM369 200Q390 158 441 150L477 172M631 200Q610 158 559 150L523 172" stroke="#302f24" stroke-opacity=".6" stroke-width="3"/>
                <path d="M382 214Q500 154 618 214V397H382Z" fill="#171d19" stroke="#c1b18a" stroke-width="5"/>
                <path d="M393 220Q500 169 607 220" stroke="#6c6249" stroke-width="4"/>
                <path d="M350 411H207Q194 383 165 390L147 418Q181 402 195 435H350M350 476H207Q194 504 165 497L147 469Q181 485 195 452H350" fill="url(#pl-metal)" stroke="#a79b78" stroke-width="4"/>
                <g class="sliding-bolt">
                  <path d="M295 402H827V480H295L280 463V419Z" fill="url(#pl-bolt)" stroke="#3b392c" stroke-width="5"/>
                  <path d="M304 411H821M304 469H821" stroke="#d0c39c" stroke-opacity=".6" stroke-width="2"/>
                  <path d="M594 421q30-22 54 0t54 0t54 0m-162 40q30 22 54 0t54 0t54 0M620 442h155m-148-14 12 14-12 14m32-28 12 14-12 14m32-28 12 14-12 14m32-28 12 14-12 14" stroke="#3a392b" stroke-opacity=".65" stroke-width="2"/>
                  <path d="M313 482l8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7" stroke="#ac9d78" stroke-width="5"/>
                </g>
                <path d="M803 382H847V502H803Z" fill="url(#pl-metal)" stroke="#292e25" stroke-width="5"/><path d="M811 389H839V494H811Z" stroke="#c3b18a" stroke-opacity=".6" stroke-width="2"/>
                <g v-for="y in [400, 483]" :key="y"><circle cx="825" :cy="y" r="9" fill="url(#pl-screw)"/><path :d="`M821 ${y + 4}l8-8`" stroke="#302f24" stroke-width="2"/></g>
                <g v-for="x in [447, 553]" :key="x"><circle :cx="x" cy="527" r="33" fill="url(#pl-metal)" stroke="#413f30" stroke-width="6" stroke-dasharray="5 3"/><circle :cx="x" cy="527" r="23" fill="url(#pl-screw)" stroke="#c2b18a" stroke-width="2"/><path :d="`M${x - 7} 534l14-14`" stroke="#403b2d" stroke-width="4"/></g>
                <path d="m475 565 25 18 25-18m-43-9 18 12 18-12M481 192l19-14 19 14" stroke="#3e3e30" stroke-width="3"/>
                <path d="M500 39Q548 61 570 115Q648 135 672 203L650 280V471L677 508Q642 557 561 570L500 615L439 570Q358 557 323 508L350 471V280L328 203Q352 135 430 115Q452 61 500 39Z" fill="url(#pl-grain)" pointer-events="none"/>
              </g>
            </svg>

            <svg v-else class="lock-housing safe-housing" viewBox="0 0 1000 900" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="pl-steel" x1="190" y1="0" x2="790" y2="900" gradientUnits="userSpaceOnUse"><stop stop-color="#6c7d87"/><stop offset=".23" stop-color="#283740"/><stop offset=".48" stop-color="#82939b"/><stop offset=".52" stop-color="#4a5b65"/><stop offset="1" stop-color="#202e37"/></linearGradient>
                <linearGradient id="pl-chrome"><stop stop-color="#35434b"/><stop offset=".25" stop-color="#cad6da"/><stop offset=".48" stop-color="#7f929c"/><stop offset=".52" stop-color="#ecf3f4"/><stop offset="1" stop-color="#40535e"/></linearGradient>
                <pattern id="pl-brush" width="5" height="7" patternUnits="userSpaceOnUse"><path d="M0 1h5M1 4h3" stroke="#d5e3e9" stroke-opacity=".08"/></pattern>
              </defs>
              <rect x="205" y="38" width="590" height="824" rx="38" fill="#0c151d" stroke="#121d25" stroke-width="16"/>
              <rect x="217" y="47" width="566" height="806" rx="29" fill="url(#pl-steel)" stroke="#91a2ab" stroke-width="3"/>
              <rect x="217" y="47" width="566" height="806" rx="29" fill="url(#pl-brush)"/>
              <rect x="289" y="101" width="422" height="300" rx="12" fill="#0a141b" stroke="#a4b4bd" stroke-width="4"/>
              <rect x="289" y="499" width="422" height="300" rx="12" fill="#0a141b" stroke="#a4b4bd" stroke-width="4"/>
              <path d="M253 421H748V478H253" stroke="#182832" stroke-width="9"/>
              <g class="sliding-bolt"><rect x="265" y="425" width="605" height="49" rx="6" fill="url(#pl-chrome)" stroke="#182832" stroke-width="3"/><path d="M284 434H853M284 463H853" stroke="#dde7eb" stroke-opacity=".6" stroke-width="2"/></g>
              <rect x="817" y="397" width="56" height="106" rx="6" fill="url(#pl-steel)" stroke="#9babb3" stroke-width="3"/>
              <path d="M829 412h31m-31 76h31" stroke="#101e27" stroke-width="4"/>
              <path d="M240 78l10 10m-10 0 10-10m500 0 10 10m-10 0 10-10M240 812l10 10m-10 0 10-10m500 0 10 10m-10 0 10-10" stroke="#d1dce0" stroke-width="3"/>
              <path d="M248 128v241m504-241v241M248 531v241m504-241v241" stroke="#a3b4bc" stroke-opacity=".35" stroke-width="3"/>
            </svg>

            <div v-for="(bank, bankIndex) in pinBanks" :key="bankIndex" class="pin-bank" :class="{ 'pin-bank-bottom': bankIndex === 1 }" :style="{ '--pin-count': bank.length }">
              <button v-for="{ word, index } in bank" :key="`${lockIndex}-${index}`" type="button" class="pin-control" :class="{ 'is-set': lockedIndices.includes(index), 'is-wrong': wrongIndex === index }" :disabled="lockedIndices.includes(index) || roundComplete || transitioning" :aria-label="`${word.ru}${lockedIndices.includes(index) ? ', пин зафиксирован' : ''}`" :aria-pressed="lockedIndices.includes(index)" :title="word.ru" :data-pin-index="index" @click="selectPin(index)">
                <span class="pin-number">{{ String(index + 1).padStart(2, '0') }}</span>
                <span class="pin-channel"><span class="pin-spring"></span><span class="pin-shaft"><span class="pin-word">{{ word.ru }}</span><span class="pin-collar"></span></span></span>
                <span class="pin-indicator">{{ lockedIndices.includes(index) ? '◆' : '◇' }}</span>
              </button>
            </div>

            <div class="lockpick" :class="{ 'is-broken': pickBroken, 'targets-bottom': targetsBottom }" :style="pickStyle">
              <div class="pick-handle"><span class="pick-rivet"></span><span class="pick-word" :title="currentWord.eng">{{ roundComplete ? 'unlocked' : transitioning ? activePickWord : currentWord.eng }}</span><span class="pick-grip"></span></div>
              <div class="pick-stem"></div>
              <svg class="pick-hook" viewBox="0 0 64 36" fill="none" aria-hidden="true"><defs><linearGradient id="pl-pick-steel" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e5d5b5"/><stop offset=".4" stop-color="#a89474"/><stop offset=".7" stop-color="#675845"/><stop offset="1" stop-color="#c3b293"/></linearGradient></defs><path d="M0 30H12C24 30 24 20 34 20S48 28 53 16Q56 5 61 3" stroke="#302b23" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path class="pick-tip-metal" d="M0 30H12C24 30 24 20 34 20S48 28 53 16Q56 5 61 3" stroke="url(#pl-pick-steel)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M0 29H12C24 29 24 19 34 19S48 27 53 15Q56 4 61 2" stroke="#f1e5cc" stroke-opacity=".5" stroke-width="1" stroke-linecap="round"/></svg>
            </div>
            <span class="engraving">TO SPECIAL ANGENTS FROM VINCENT</span>
          </div>
        </div>

        <div class="pick-durability" role="status" :aria-label="`Ошибок: ${roundMistakes} из 3`">
          <span>ОТМЫЧКА</span>
          <i v-for="life in 3" :key="life" :class="{ lost: life <= roundMistakes }"></i>
          <span>{{ roundMistakes }} / 3 ошибок</span>
        </div>
        <div class="feedback" aria-live="polite"><span class="feedback-symbol">{{ roundComplete ? '◆' : '+' }}</span>{{ feedback }}</div>

        <footer class="mission-footer">
          <span class="instruction">Слово на отмычке → перевод на пине</span>
          <span class="difficulty">{{ roundWords.length }} PINS <b>·</b> {{ completedCount }} / {{ questions.length }} СЛОВ</span>
        </footer>

        <div v-if="demo" class="demo-note">Демонстрационный набор · <button @click="loadGame">начать заново</button></div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from 'stores/example-store';
import { whatGameDataToUse } from '../composables/whatGameDataToUse';

import knockSound from '/src/assets/audio/lockPickCorrect.mp3';
import incorrectSound from '/src/assets/audio/lockPickIncorrect.mp3';
import successSound from '/src/assets/audio/lockPickSuccess.mp3';

const props = defineProps({ demo: { type: Boolean, default: false } });
const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();
const { loadWords } = whatGameDataToUse();

// Звуки: создаём один раз, переиспользуем
const sounds = {
  correct: new Audio(knockSound),
  incorrect: new Audio(incorrectSound),
  success: new Audio(successSound),
};
sounds.correct.preload = 'auto';
sounds.incorrect.preload = 'auto';
sounds.success.preload = 'auto';

function playSound(name) {
  const audio = sounds[name];
  if (!audio) return;
  try {
    audio.currentTime = 0;
    audio.play().catch(() => {}); // игнорируем autoplay-блокировку
  } catch (e) { /* noop */ }
}

const words = ref([]);
const questions = ref([]);
const lockSizes = [3, 4, 5, Infinity];
const lockIndex = ref(0);
const questionPointer = ref(0);
const roundWords = ref([]);
const lockedIndices = ref([]);
const questionOrder = ref([]);
const wrongIndex = ref(null);
const transitioning = ref(false);
const sceneRef = ref(null);
const roundMistakes = ref(0);
const pickBroken = ref(false);
const targetsBottom = ref(false);
const activePickWord = ref('');
const pickStyle = ref({ '--pick-x': '0px', '--pick-y': '0px' });
const loading = ref(true);
const loadError = ref('');
const feedback = ref('Выбери пин с правильным переводом');
const completedCount = ref(0);
const mistakes = ref(0);

let startedAt = 0;
let loadVersion = 0;
let finishing = false;
const timers = new Set();
const later = (fn, ms) => { const timer = setTimeout(() => { timers.delete(timer); fn(); }, ms); timers.add(timer); };
const clearTimers = () => { timers.forEach(clearTimeout); timers.clear(); };

const demoWords = [
  { eng: "There's nothing wrong with it", ru: 'с этим всё в порядке' },
  { eng: 'Take your time', ru: 'не торопись' },
  { eng: 'Keep an eye on it', ru: 'присмотри за этим' },
  { eng: "It's up to you", ru: 'решать тебе' },
  { eng: 'Better late than never', ru: 'лучше поздно, чем никогда' },
  { eng: 'That makes sense', ru: 'в этом есть смысл' },
  { eng: "I changed my mind", ru: 'я передумал' },
  { eng: "Don't give up", ru: 'не сдавайся' },
  { eng: "Let me think about it", ru: 'дай мне об этом подумать' },
  { eng: "We're on the same page", ru: 'мы друг друга понимаем' },
];

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const lockStyle = computed(() => lockIndex.value >= 3 ? 'safe' : 'medieval');

const pinBanks = computed(() => {
  const indexed = roundWords.value.map((word, index) => ({ word, index }));
  if (lockStyle.value !== 'safe') return [indexed];
  const half = Math.ceil(indexed.length / 2);
  return [indexed.slice(0, half), indexed.slice(half)].filter(b => b.length);
});

const currentWord = computed(() => roundWords.value[questionOrder.value[lockedIndices.value.length]] || {});
const roundComplete = computed(() => roundWords.value.length > 0 && lockedIndices.value.length === roundWords.value.length);

function logState(label, extra = {}) {
  console.log(`[GamePickLock] ${label}`, {
    lockIndex: lockIndex.value,
    lockStyle: lockStyle.value,
    questionPointer: questionPointer.value,
    questionsLen: questions.value.length,
    roundWords: roundWords.value.map(w => w.eng),
    lockedIndices: [...lockedIndices.value],
    roundComplete: roundComplete.value,
    transitioning: transitioning.value,
    roundMistakes: roundMistakes.value,
    pickBroken: pickBroken.value,
    feedback: feedback.value,
    ...extra,
  });
}

function startLock() {
  const size = lockSizes[lockIndex.value];
  const remaining = questions.value.length - questionPointer.value;
  const take = Math.min(size, remaining);
  console.log('[startLock] enter', { lockIndex: lockIndex.value, size, remaining, take });

  if (take <= 0) {
    console.log('[startLock] take <= 0 → finishGame');
    finishGame();
    return;
  }

  roundWords.value = questions.value.slice(questionPointer.value, questionPointer.value + take);
  questionPointer.value += take;

  lockedIndices.value = [];
  roundMistakes.value = 0;
  pickBroken.value = false;
  wrongIndex.value = null;
  transitioning.value = false;
  targetsBottom.value = false;
  pickStyle.value = { '--pick-x': '0px', '--pick-y': '0px' };
  questionOrder.value = shuffle(roundWords.value.map((_, i) => i));
  feedback.value = 'Выбери пин с правильным переводом';

  logState('startLock done', { questionOrder: [...questionOrder.value] });
}

function movePickToPin(index) {
  const scene = sceneRef.value;
  if (!scene) return;
  const shaft = scene.querySelector(`[data-pin-index="${index}"] .pin-shaft`);
  const hook = scene.querySelector('.pick-hook');
  if (!shaft || !hook) return;
  const target = shaft.getBoundingClientRect();
  const tip = hook.getBoundingClientRect();
  const bottom = lockStyle.value === 'safe' && index >= Math.ceil(roundWords.value.length / 2);
  targetsBottom.value = bottom;
  const x = target.left + target.width / 2 - (tip.right - 2);
  const y = (bottom ? target.top - 3 : target.bottom + 3) - (bottom ? tip.bottom - 2 : tip.top + 2);
  pickStyle.value = { '--pick-x': `${x}px`, '--pick-y': `${y}px` };
  later(() => {
    pickStyle.value = { '--pick-x': `${x}px`, '--pick-y': `${y + (bottom ? 9 : -9)}px` };
  }, 380);
}

async function loadGame() {
  console.log('[loadGame] START');
  const version = ++loadVersion;
  clearTimers();
  loading.value = true;
  loadError.value = '';
  words.value = [];
  completedCount.value = 0;
  mistakes.value = 0;
  finishing = false;
  roundMistakes.value = 0;
  pickBroken.value = false;

  try {
    const data = props.demo ? demoWords : await loadWords(route.params.missionName);
    if (version !== loadVersion) return;

    const seen = new Set();
    const valid = (Array.isArray(data) ? data : []).filter(item => {
      if (typeof item?.eng !== 'string' || typeof item?.ru !== 'string' || !item.eng.trim() || !item.ru.trim()) return false;
      const key = item.ru.trim().toLocaleLowerCase('ru');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map(item => ({ ...item, eng: item.eng.trim(), ru: item.ru.trim() }));

    console.log('[loadGame] loaded words', { raw: data?.length, valid: valid.length });

    if (!valid.length) throw new Error('В этом наборе пока нет слов. Проверь название миссии и источник данных.');

    // 3 + 4 + 5 = 12 на medieval, ещё 10 на safe (5 + 5) = 22
    const WORDS_PER_GAME = 28;
    words.value = props.demo ? [...valid] : shuffle(valid).slice(0, WORDS_PER_GAME);
    questions.value = [...words.value];
    lockIndex.value = 0;
    questionPointer.value = 0;
    console.log('[loadGame] init', { wordsLen: words.value.length, questionsLen: questions.value.length });
    startLock();
    startedAt = Date.now();
  } catch (err) {
    console.error('[loadGame] error', err);
    if (version === loadVersion) loadError.value = err instanceof Error ? err.message : 'Не удалось загрузить слова.';
  } finally {
    if (version === loadVersion) loading.value = false;
  }
}

function selectPin(index) {
  console.log('[selectPin] click', { index, lockedIndices: [...lockedIndices.value], transitioning: transitioning.value, roundComplete: roundComplete.value });
  if (transitioning.value || roundComplete.value || lockedIndices.value.includes(index) || !roundWords.value[index]) {
    console.log('[selectPin] BLOCKED');
    return;
  }

  clearTimers();
  wrongIndex.value = null;
  transitioning.value = true;
  activePickWord.value = currentWord.value.eng;

  const correct = roundWords.value[index].ru === currentWord.value.ru;
  console.log('[selectPin] answer', { picked: roundWords.value[index]?.ru, expected: currentWord.value.ru, correct });
  movePickToPin(index);

  later(() => {
    if (correct) {
      playSound('correct');   // 🆕

      lockedIndices.value = [...lockedIndices.value, index];
      completedCount.value++;
      feedback.value = roundComplete.value ? 'Замок открыт. Отличная работа, агент.' : 'Есть контакт. Пин зафиксирован.';
      logState('selectPin correct (after 560)');
    } else {
      playSound('incorrect'); // 🆕

      mistakes.value++;
      roundMistakes.value++;
      wrongIndex.value = index;

      if (roundMistakes.value < 3) {
        const failedWord = currentWord.value;
        if (!questions.value.slice(questionPointer.value).some(w => w.eng === failedWord.eng)) {
          questions.value.push(failedWord);
          console.log('[selectPin] failed word pushed', { eng: failedWord.eng, questionsLen: questions.value.length });
        }
        feedback.value = `Не тот пин. Ошибок: ${roundMistakes.value} из 3. Слово вернётся в конце.`;
      }

      if (roundMistakes.value === 3) {
        pickBroken.value = true;
        feedback.value = 'Отмычка сломалась! Игра начинается заново…';
      }
      logState('selectPin wrong (after 560)');
    }
  }, 560);

  later(() => {
    if (!pickBroken.value) pickStyle.value = { '--pick-x': '0px', '--pick-y': '0px' };
  }, 800);

  later(() => {
    if (pickBroken.value) {
      console.log('[selectPin] pick broken → loadGame');
      loadGame();
      return;
    }
    transitioning.value = false;
    if (correct && !roundComplete.value) feedback.value = 'Пин зафиксирован. Найди следующее слово.';
    logState('selectPin done (after 1500)');
  }, 1500);

  later(() => { wrongIndex.value = null; }, 1850);
}

// Автоматический переход к следующему замку
watch(roundComplete, (isComplete) => {
  if (!isComplete) return;
  later(() => playSound('success'), 100);

  console.log('[auto] roundComplete → nextRound in 1200ms');
  later(() => {
    nextRound();
  }, 1200);
});

async function nextRound() {
  console.log('[nextRound] START', {
    lockIndex: lockIndex.value,
    questionPointer: questionPointer.value,
    questionsLen: questions.value.length,
  });
  if (finishing) return;

  lockIndex.value++;
  console.log('[nextRound] lockIndex →', lockIndex.value);

  if (lockIndex.value >= lockSizes.length) {
    if (questionPointer.value >= questions.value.length) {
      console.log('[nextRound] all done → finishGame');
      finishGame();
      return;
    }
    console.log('[nextRound] new cycle, lockIndex → 0');
    lockIndex.value = 0;
  }

  startLock();
}

function finishGame() {
  console.log('[finishGame] START', { finishing, mistakes: mistakes.value, duration: Date.now() - startedAt });
  if (finishing) return;
  if (props.demo) { loadGame(); return; }
  finishing = true;
  gameStore.setLastGameResults(Date.now() - startedAt, mistakes.value);
  gameStore.setGameName('GamePickLock');
  gameStore.setWordSet(route.params.missionName);
  router.push({ path: '/leader-board/', query: { missionName: route.params.missionName, from: 'game-pick-lock' } })
    .finally(() => { finishing = false; });
}

watch(() => [route.params.missionName, props.demo], loadGame, { immediate: true });
onBeforeUnmount(() => { console.log('[onBeforeUnmount]'); loadVersion++; clearTimers(); });
</script>

<style scoped>
.pick-lock { --ink: #ded9be; --muted: #8c9487; --gold: #cbb278; box-sizing: border-box; min-height: 780px; margin-top: 75px; padding: 46px 28px 28px; color: var(--ink); background: radial-gradient(ellipse at 50% 43%, #35423955, transparent 56%), linear-gradient(100deg, #101a19, #17221e 48%, #0b1414); font-family: 'Trebuchet MS', sans-serif; position: relative; isolation: isolate; overflow: hidden; border: 1px solid #89977c20; border-radius: 8px; }
.pick-lock::before { content: ''; position: absolute; inset: 0; z-index: -1; opacity: .22; background: repeating-linear-gradient(91deg, transparent 0 85px, #050b0b 86px 88px, transparent 89px 178px), radial-gradient(circle, #020807 0 3px, #8c987922 4px, transparent 6px) 0 0 / 89px 98px; box-shadow: inset 0 0 120px #020706; pointer-events: none; }
.pick-lock * { box-sizing: border-box; }
.lock-layout { max-width: 1000px; margin: 0 auto; }
.eyebrow { font: 10px/1.5 monospace; letter-spacing: 3px; color: #a6ab8b; }
.heading-row { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-top: 12px; }
h1 { font-family: Georgia, serif; font-size: clamp(28px, 4vw, 42px); font-weight: 400; letter-spacing: .5px; margin: 0; }
.mission-header p { margin: 10px 0 26px; font-size: 13px; color: var(--muted); }
.mission-badge { border: 1px solid #b8ab7140; padding: 8px 12px; font: 10px monospace; letter-spacing: 2px; color: #b7b496; white-space: nowrap; }
.mission-progress { display: flex; gap: 5px; height: 3px; margin-bottom: 25px; }
.mission-progress span { flex: 1; background: #c8c49b20; transition: background .4s, box-shadow .4s; }
.mission-progress .done { background: var(--gold); box-shadow: 0 0 8px #cbb27855; }
.instrument-topline { display: flex; justify-content: space-between; font: 9px monospace; letter-spacing: 2px; color: #9caa93; gap: 12px; }
.status-light { display: inline-block; width: 5px; height: 5px; background: #c4a86c; border-radius: 50%; margin-right: 9px; box-shadow: 0 0 9px #d8b57466; }
.lock-viewport { width: 100%; overflow-x: auto; scrollbar-color: #726b50 #131e19; }
.lock-scene { position: relative; width: 100%; min-width: 840px; aspect-ratio: 1000 / 900; }
.lock-housing { position: absolute; inset: 0; width: 100%; height: 100%; filter: drop-shadow(0 22px 16px #0009); }
.housing-shadow { filter: drop-shadow(0 2px 2px #000); }
.sliding-bolt { transition: transform 1.1s cubic-bezier(.2,.7,.2,1); }
.is-open .sliding-bolt { transform: translateX(570px); }
.pin-bank { position: absolute; top: 30.8%; left: 32.2%; width: 35.6%; height: 27%; display: grid; grid-template-columns: repeat(var(--pin-count), minmax(0, 1fr)); gap: 9px; }
.pin-control { position: relative; border: 0; background: none; padding: 0; color: #d5c28b; cursor: none; min-width: 0; -webkit-tap-highlight-color: transparent; }
.pin-control:focus-visible { outline: 2px solid #f1d490; outline-offset: 7px; border-radius: 3px; }
.pin-number { position: absolute; top: -14%; left: 0; right: 0; font: 9px monospace; color: #ddd0a480; }
.pin-channel { position: absolute; inset: 0 3%; background: linear-gradient(90deg, #080e0a, #30352b 50%, #080d0b); border: 1px solid #b6aa7d44; border-radius: 7px 7px 2px 2px; box-shadow: inset 3px 0 4px #000; overflow: hidden; }
.pin-spring { position: absolute; top: 3%; left: 14%; width: 72%; height: 22%; background: repeating-linear-gradient(24deg, transparent 0 6px, #151b16 7px, #b8b29a 8px, #6e7160 10px, #151b16 12px, transparent 13px); transition: height .4s; filter: drop-shadow(1px 2px 1px #000); }
.pin-shaft { position: absolute; top: 18%; left: 8%; width: 84%; height: 81%; border: 1px solid #d9bb72; border-radius: 4px 4px 1px 1px; background: linear-gradient(90deg, #5f421c, #c48a35 14%, #eed298 35%, #b98332 58%, #976726 80%, #e0b86c); box-shadow: 3px 2px 5px #0008, inset 0 2px 1px #fff7; transition: transform .4s, filter .25s; }
.pin-word { position: absolute; inset: 7px 0 8px; writing-mode: vertical-rl; transform: rotate(180deg); display: flex; align-items: center; justify-content: center; color: #2b210f; font-size: 14px; font-weight: 700; letter-spacing: .4px; text-shadow: 0 1px #ffedb877; overflow: hidden; }
.pin-collar { position: absolute; bottom: 5%; left: -9%; width: 118%; height: 6%; background: linear-gradient(#edcf90, #87612c, #ddb36b); border: 1px solid #5a4625; }
.pin-indicator { position: absolute; bottom: -15%; left: 0; right: 0; font-size: 13px; color: #a69a7055; transition: color .4s; }
.pin-control:hover:not(:disabled) .pin-shaft { transform: translateY(-5px); filter: brightness(1.2); }
.pin-control.is-set .pin-shaft { transform: translateY(-18%); filter: saturate(.65) brightness(1.25); }
.pin-control.is-set .pin-spring { height: 5%; }
.pin-control.is-set .pin-indicator { color: #dbc282; text-shadow: 0 0 10px #d6b46388; }
.pin-control.is-wrong { animation: pl-rattle .35s; }
.pin-control.is-wrong .pin-shaft { filter: sepia(1) saturate(3) hue-rotate(320deg); }
.lockpick { position: absolute; left: 1%; top: 63.5%; width: 59%; height: 6.5%; display: flex; align-items: center; filter: drop-shadow(0 5px 3px #000a); transform: translate(var(--pick-x, 0px), var(--pick-y, 0px)); transition: transform .38s cubic-bezier(.3,.05,.25,1), opacity .6s; pointer-events: none; z-index: 3; }
.pick-handle { width: 75%; height: 100%; flex-shrink: 0; border-radius: 50% 9px 9px 50% / 50% 6px 6px 50%; border: 1px solid #a48c6b; background: linear-gradient(#604432, #382920 24%, #654332 45%, #3d2921 65%, #201c16); position: relative; box-shadow: inset 0 2px #c0a17b44, inset 0 -2px #110e0c; }
.pick-word { position: absolute; inset: 4px 8% 4px 11%; display: flex; align-items: center; justify-content: center; font: italic clamp(15px, 2vw, 21px)/1.15 Georgia, serif; color: #f1d9a4; text-shadow: 0 2px 2px #000; white-space: normal; overflow-wrap: anywhere; text-align: center; }
.pick-rivet { position: absolute; top: 40%; left: 6%; width: 5px; height: 5px; background: #b2a07c; border-radius: 50%; box-shadow: 0 1px 2px #000; }
.pick-grip { position: absolute; right: 3%; top: 12%; height: 76%; width: 9%; background: repeating-linear-gradient(90deg, #201c16 0 2px, #a48c6b66 3px, transparent 4px); }
.pick-stem { flex: 1; height: 5px; margin-right: 60px; background: linear-gradient(#d4c1a0, #776652 40%, #2b2721 70%, #ad9a7d); }
.pick-hook { position: absolute; right: 0; top: calc(50% - 30px); width: 64px; height: 36px; overflow: visible; transform-origin: center 30px; }
.is-open .lockpick { opacity: .35; }
.engraving { position: absolute; bottom: 3%; left: 0; right: 0; text-align: center; font: 9px Georgia, serif; letter-spacing: 4px; color: #b6ad7a55; }
.feedback { display: flex; justify-content: center; align-items: center; gap: 12px; min-height: 42px; text-align: center; color: #c1ba98; font-size: 13px; }
.feedback-symbol { color: var(--gold); font-size: 19px; }
.mission-footer { border-top: 1px solid #a2ac8230; padding-top: 23px; margin-top: 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.instruction { color: #929c8c; font-size: 11px; }
.difficulty { font: 9px monospace; letter-spacing: 1.5px; color: #b2ad8e; }
.difficulty b { margin: 0 8px; color: #5d6c59; }
.continue-button, .secondary-button { border: 1px solid #ad9c6855; padding: 12px 16px; background: #bba46b10; color: #dfcea1; font: inherit; font-size: 12px; cursor: none; border-radius: 2px; }
.continue-button:hover, .secondary-button:hover { background: #bba46b25; }
.continue-button span { margin-left: 15px; }
.state-message { padding: 100px 20px; text-align: center; color: #c8bf9c; }
.demo-note { text-align: center; color: #7e8a7a; font-size: 10px; margin-top: 24px; }
.demo-note button { border: 0; background: none; color: #bbac7f; font: inherit; text-decoration: underline; cursor: none; }
@keyframes pl-rattle { 25%,75% { transform: translateX(-3px); } 50% { transform: translateX(3px); } }
@media (max-width: 700px) { .pick-lock { padding: 28px 14px 22px; min-height: 650px; } .eyebrow { font-size: 8px; letter-spacing: 1.6px; } .mission-badge { font-size: 8px; padding: 7px; letter-spacing: 1px; } .instrument-topline { font-size: 8px; letter-spacing: .6px; } .lock-scene { min-width: 840px; } .lock-viewport { margin-top: 12px; } .pin-word { font-size: 13px; } .mission-footer { flex-wrap: wrap; } .instruction { font-size: 10px; } .feedback { font-size: 12px; } }
@media (prefers-reduced-motion: reduce) { .pick-lock *, .pick-lock *::before { animation: none !important; transition: none !important; } }

.lock-toolbar { display: flex; justify-content: space-between; gap: 14px; margin: 0 0 24px; flex-wrap: wrap; }
.style-toggle { display: flex; border: 1px solid #b7a47444; padding: 4px; border-radius: 5px; gap: 4px; }
.style-toggle button { border: 1px solid transparent; border-radius: 3px; padding: 10px 14px; background: transparent; color: #9da692; font: inherit; font-size: 12px; cursor: none; text-align: left; }
.style-toggle button span { display: block; font: 9px monospace; margin-top: 5px; opacity: .65; letter-spacing: 1px; }
.style-toggle button[aria-pressed="true"] { background: #bfab7520; color: #e3d3a8; border-color: #c4ac6b55; }
.style-toggle button:focus-visible { outline: 2px solid var(--gold); }
.pin-word { overflow-wrap: anywhere; padding: 2px; line-height: 1.25; }
.is-safe { --gold: #acd5e7; background: radial-gradient(ellipse at 50% 43%, #3c596855, transparent 60%), linear-gradient(110deg, #0e1821, #1d2b36 48%, #0b141b); }
.is-safe h1 { font-family: 'Trebuchet MS', sans-serif; font-weight: 300; }
.is-safe .pin-bank { left: 29.5%; width: 41%; top: 12%; height: 32%; }
.is-safe .pin-bank-bottom { top: 56%; }
.is-safe .pin-shaft { background: linear-gradient(90deg, #425763, #aebfc6 18%, #e5eef1 35%, #8eabb9 58%, #607c8a 80%, #b5cbd5); border-color: #c5dbe5; }
.is-safe .pin-collar { background: linear-gradient(#d7e8ef, #5a737f, #aec7d3); border-color: #435763; }
.is-safe .pin-word { color: #152b36; text-shadow: 0 1px #ffffff77; }
.is-safe .pin-bank-bottom .pin-shaft { top: 1%; }
.is-safe .pin-bank-bottom .pin-spring { top: auto; bottom: 3%; }
.is-safe .pin-bank-bottom .pin-collar { bottom: auto; top: 5%; }
.is-safe .pin-bank-bottom .is-set .pin-shaft { transform: translateY(18%); }
.is-safe .pin-bank-bottom .pin-control:hover:not(:disabled) .pin-shaft { transform: translateY(5px); }
.is-safe .pin-bank-bottom .pin-number { top: auto; bottom: -14%; }
.is-safe .pin-bank-bottom .pin-indicator { bottom: auto; top: -14%; }
.is-safe .lockpick { top: 47.2%; width: 74%; height: 5.8%; }
.is-safe .pick-handle { width: 60%; background: linear-gradient(#465965, #1c2c36 30%, #334954 50%, #172731); border-color: #8babbc; }
.is-safe .pick-word { color: #d4e9f2; }
.is-safe .is-set .pin-indicator { color: #b5e2f3; text-shadow: 0 0 10px #79d0ed88; }
.is-safe .sliding-bolt { transition-duration: 1.4s; }
.is-safe.is-open .sliding-bolt { transform: translateX(640px); }

.pick-durability { display: flex; align-items: center; justify-content: center; gap: 8px; color: #aaa78e; font: 10px monospace; letter-spacing: 1px; padding: 12px 0 5px; }
.pick-durability span:first-child { margin-right: 8px; }
.pick-durability span:last-child { margin-left: 8px; }
.pick-durability i { width: 18px; height: 4px; background: var(--gold); border-radius: 2px; transition: background .2s; }
.pick-durability i.lost { background: #eb796d; box-shadow: 0 0 7px #f25a4a88; }
.pin-control.is-wrong .pin-channel { border-color: #ff8476; box-shadow: 0 0 16px #f15a4777, inset 0 0 14px #ff534644; }
.pin-control.is-wrong .pin-indicator { color: #ff8b7d; text-shadow: 0 0 9px #ff6254; }
.pin-control.is-wrong .pin-shaft { background: linear-gradient(90deg, #85382f, #ffa18b 35%, #bc5545 75%, #f48b72); filter: none; }
.lockpick.targets-bottom .pick-hook { transform: scaleY(-1); }
.lockpick.is-broken .pick-stem { transform-origin: left; animation: pl-snap-stem .75s ease-in forwards; }
.lockpick.is-broken .pick-hook { animation: pl-snap-tip .75s ease-in forwards; }
.lockpick.is-broken .pick-handle { animation: pl-rattle .35s; }
.continue-button:disabled { opacity: .5; cursor: none; }
@keyframes pl-snap-stem { to { transform: translate(16px, 90px) rotate(32deg); opacity: 0; } }
@keyframes pl-snap-tip { to { transform: translate(35px, 140px) rotate(100deg); opacity: 0; } }
</style>
