<template>
  <section class="dial-safe" :class="{ 'safe-open': state.done }" aria-label="Игра: взлом сейфа">
    <header class="safe-header">
      <div><h1>Взлом сейфа</h1><p>Поверни диск, совмести перевод с нижней меткой и удержи позицию 2 секунды.</p></div>
      <div class="safe-actions">
        <span v-if="state.total && !loading" class="safe-count">{{ state.completed }} / {{ state.total }}<small>КОДЫ СОБРАНЫ</small></span>
        <button type="button" class="safe-button" @click="loadGame">Начать заново</button>
      </div>
    </header>
    <p v-if="loading" role="status">Подготавливаем сейф…</p>
    <p v-else-if="loadError" role="alert">{{ loadError }}</p>
    <template v-else>
      <div class="safe-door">
          <div class="safe-mechanism">
            <div class="door-pins" aria-hidden="true">
              <span v-for="pin in state.total" :key="pin" class="door-pin" :class="{ retracted: pin <= state.completed, unlocking: state.phase === 'releasing' && pin === state.completed }" :style="pinPosition(pin)"><span class="pin-slot"><i></i></span></span>
            </div>
            <div class="dial-bezel">
              <span v-if="showDial" class="dial-pointer" aria-hidden="true"></span>
              <div class="dial-face" :class="{ dragging }" role="group" :tabindex="showDial ? 0 : -1" :aria-hidden="!showDial" :aria-label="`Диск: ${selected?.ru || '—'}. Стрелки влево и вправо поворачивают диск.`"
                @pointerdown="beginDrag" @pointermove="moveDrag" @pointerup="endDrag" @pointercancel="cancelDrag" @lostpointercapture="cancelDrag"
                @keydown.left.prevent="turn(-1)" @keydown.right.prevent="turn(1)">
                <div v-if="showDial" class="dial-rotor" :style="{ '--angle': `${state.angle}deg` }">
                  <span v-for="(word, index) in state.options" :key="word.ru" class="dial-word" :class="{ selected: index === state.selected && !dragging }" :style="labelPosition(index, state.options.length)">{{ word.ru }}</span>
                  <div class="dial-grip"><span>S.P.E.C.I.A.L</span></div>
                </div>
              </div>
            </div>
            <div v-if="!showDial" class="safe-inner">
              <div v-if="state.phase === 'code'" class="safe-keypad" role="group" aria-label="Панель ввода кода">
                <output class="safe-code-display" aria-live="polite" aria-label="Введённый код">{{ state.code || '—' }}</output>
                <div class="safe-key-grid">
                  <button v-for="key in CODE_KEYS" :key="key" type="button" class="safe-button"
                    :aria-label="key === 'C' ? 'Сбросить код' : key === 'OK' ? 'Подтвердить код' : undefined"
                    :disabled="key === 'OK' && !state.code" @click="game.pressKey(key)">{{ key }}</button>
                </div>
              </div>
              <div v-else class="safe-treasure">
                <strong lang="en">seventeen</strong>
                <div role="img" aria-label="Две морковки, лук и мешок денег">🥕🥕🧅💰</div>
              </div>
            </div>
          </div>
          <div v-if="showDial" class="safe-controls">
            <button type="button" class="safe-button" :disabled="state.phase !== 'dial' || dragging" aria-label="Повернуть против часовой стрелки" @click="turn(-1)">↶</button>
            <div class="safe-readout"><strong class="safe-prompt" lang="en">{{ state.prompt?.eng }}</strong><div class="hold-track" aria-hidden="true"><i v-if="state.holding" :key="state.holdId"></i></div></div>
            <button type="button" class="safe-button" :disabled="state.phase !== 'dial' || dragging" aria-label="Повернуть по часовой стрелке" @click="turn(1)">↷</button>
          </div>
          <p v-else class="safe-code-prompt" lang="en">{{ state.done ? '' : CODE_QUESTION }}</p>
      </div>
      <footer class="safe-footer"><p role="status">{{ state.message }}</p><button v-if="state.done" type="button" class="safe-button finish-button" @click="finish">{{ demo ? 'Сыграть ещё' : 'К результатам →' }}</button></footer>
    </template>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from 'stores/example-store';
import { whatGameDataToUse } from '../composables/whatGameDataToUse';

const props = defineProps({ demo: Boolean });
const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();
const { loadWords } = whatGameDataToUse();
const dragging = ref(false);
const pinPosition = pin => ({ '--bearing': `${30 + (pin - 1) * 360 / state.value.total}deg` });
const loading = ref(true);
const loadError = ref('');
const state = ref({});
const showDial = computed(() => ['dial', 'releasing'].includes(state.value.phase));
const selected = computed(() => state.value.options?.[state.value.selected]);
let startedAt = 0;
let version = 0;
let finishing = false;
let pointer = null;

// BEGIN SHARED DIAL ENGINE
const HOLD_MS = 2000;
const SETTLE_MS = 230;
const RELEASE_MS = 760;
const CODE_QUESTION = 'What is thirty minus thirteen?';
const CODE_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'];
const demoWords = [
  { eng: "There's nothing wrong with it", ru: 'с этим всё в порядке' },
  { eng: 'Take your time', ru: 'не торопись' },
  { eng: 'Keep an eye on it', ru: 'присмотри за этим' },
  { eng: 'Better late than never', ru: 'лучше поздно, чем никогда' },
  { eng: 'Let me think about it', ru: 'дай мне об этом подумать' },
  { eng: 'That makes sense', ru: 'в этом есть смысл' },
  { eng: 'I changed my mind', ru: 'я передумал' },
  { eng: 'We are on the same page', ru: 'мы друг друга понимаем' },
];
const modulo = (value, size) => ((value % size) + size) % size;
const signedDelta = (angle, previous) => modulo(angle - previous + 180, 360) - 180;
function labelPosition(index, count) {
  const radians = index * Math.PI * 2 / count;
  return { left: `${50 + 34 * Math.sin(radians)}%`, top: `${50 - 34 * Math.cos(radians)}%` };
}
// The fixed marker points to 180° from the top of the dial.
function sectorAtMarker(angle, count) {
  return modulo(Math.round((180 - angle) / (360 / count)), count);
}
function snapAngle(angle, count) {
  const step = 360 / count;
  return 180 + Math.round((angle - 180) / step) * step;
}
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function createDialGame(render) {
  let words = [], timer = null;
  let model = { angle: 0, options: [], selected: 0, completed: 0, total: 0, mistakes: 0, holding: false, holdId: 0, done: false, phase: 'dial', code: '', prompt: null, message: '' };
  const publish = () => render({ ...model });
  function clearHold() {
    clearTimeout(timer); timer = null; model.holding = false;
  }
  function prepareQuestion(first = false) {
    model.prompt = words[model.completed];
    const alternatives = shuffle(words.filter(word => word !== model.prompt)).slice(0, model.completed + 2);
    model.options = shuffle([model.prompt, ...alternatives]);
    // Keep the wheel physically in place; the new labels take over its sectors.
    if (first) model.angle = 180;
    model.angle = snapAngle(model.angle, model.options.length);
    model.selected = sectorAtMarker(model.angle, model.options.length);
    // Keep the correct option away from the stationary marker, where possible.
    if (model.options.length > 1 && model.options[model.selected] === model.prompt) {
      const next = (model.selected + 1) % model.options.length;
      [model.options[model.selected], model.options[next]] = [model.options[next], model.options[model.selected]];
    }
    model.message = first ? 'Поверни диск, чтобы начать.' : 'Ригель сдвинулся. Подбери следующий перевод.';
    if (model.options.length === 1) model.message = 'Один вариант: нажми любую стрелку, чтобы зафиксировать перевод.';
  }
  function reset(items) {
    clearHold(); words = items;
    model = { ...model, angle: 0, options: [], selected: 0, completed: 0, total: Math.min(6, words.length), mistakes: 0, done: false, phase: 'dial', code: '', prompt: null, message: '' };
    if (words.length) prepareQuestion(true);
    publish();
  }
  function rotate(angle) {
    if (model.phase !== 'dial' || !model.options.length) return;
    clearHold();
    model.angle = angle;
    model.selected = sectorAtMarker(angle, model.options.length);
    model.message = 'Совмести перевод с меткой.';
    publish();
  }
  function snap(check = true) {
    if (model.phase !== 'dial' || !model.options.length) return;
    rotate(snapAngle(model.angle, model.options.length));
    if (!check) return;
    model.message = 'Оставь диск на месте на 2 секунды.';
    publish();
    timer = setTimeout(() => {
      model.holding = true; model.holdId++; publish();
      timer = setTimeout(() => {
        clearHold();
        if (model.options[model.selected] !== model.prompt) {
          model.mistakes++;
          model.message = 'Штифт не поддался. Поверни диск к другому переводу.';
        } else {
          model.completed++;
          model.phase = 'releasing';
          model.message = 'Штифт отпирается…';
          timer = setTimeout(() => {
            timer = null;
            if (model.completed === model.total) {
              model.phase = 'code';
              model.message = 'Введи ответ цифрами.';
            } else {
              model.phase = 'dial';
              prepareQuestion();
            }
            publish();
          }, RELEASE_MS);
        }
        publish();
      }, HOLD_MS);
    }, SETTLE_MS);
  }
  function turn(direction) {
    if (!model.options.length || model.phase !== 'dial') return;
    const step = 360 / model.options.length;
    rotate(model.options.length === 1 ? model.angle : snapAngle(model.angle, model.options.length) + direction * step);
    snap();
  }
  function cancel() {
    if (timer === null || model.phase !== 'dial') return;
    clearHold(); model.message = 'Проверка прервана. Поверни диск ещё раз.'; publish();
  }
  function submitCode(value) {
    if (model.phase !== 'code' || !/^\d+$/.test(value)) return;
    if (Number(value) === 17) {
      model.phase = 'open';
      model.done = true;
      model.message = 'Сейф открыт.';
    } else {
      model.mistakes++;
      model.code = '';
      model.message = 'Код не подошёл. Попробуй ещё раз.';
    }
    publish();
  }
  function pressKey(key) {
    if (model.phase !== 'code') return;
    if (key === 'OK') {
      submitCode(model.code);
      return;
    }
    if (key === 'C') model.code = '';
    else if (/^\d$/.test(key) && model.code.length < 4) model.code += key;
    publish();
  }
  publish();
  return { reset, rotate, snap, turn, cancel, pressKey, dispose: clearHold };
}
// END SHARED DIAL ENGINE

const game = createDialGame(snapshot => { state.value = snapshot; });
function bearing(event, element) {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;
  return Math.hypot(x, y) < 14 ? null : Math.atan2(y, x) * 180 / Math.PI;
}
function beginDrag(event) {
  if (state.value.phase !== 'dial' || pointer || event.button !== 0) return;
  const angle = bearing(event, event.currentTarget);
  if (angle === null) return;
  game.cancel();
  pointer = { id: event.pointerId, angle, rotation: state.value.angle, moved: false };
  dragging.value = true;
  event.currentTarget.setPointerCapture(event.pointerId);
}
function moveDrag(event) {
  if (pointer?.id !== event.pointerId) return;
  const angle = bearing(event, event.currentTarget);
  if (angle === null) { pointer.angle = null; return; }
  if (pointer.angle !== null) {
    const delta = signedDelta(angle, pointer.angle);
    pointer.rotation += delta;
    if (Math.abs(pointer.rotation - state.value.angle) >= 2 || pointer.moved) {
      pointer.moved = true;
      game.rotate(pointer.rotation);
    }
  }
  pointer.angle = angle;
}
function releaseDrag(event, check) {
  if (pointer?.id !== event.pointerId) return;
  const moved = pointer.moved;
  pointer = null; dragging.value = false;
  if (moved) game.snap(check);
}
function endDrag(event) { releaseDrag(event, true); }
function cancelDrag(event) { releaseDrag(event, false); }
function turn(direction) { if (!dragging.value) game.turn(direction); }
function onVisibility() {
  if (!document.hidden) return;
  if (pointer) { pointer = null; dragging.value = false; game.snap(false); }
  game.cancel();
}
async function loadGame() {
  const request = ++version;
  pointer = null; dragging.value = false; loading.value = true; loadError.value = '';
  game.reset([]);
  try {
    const data = props.demo ? demoWords : await loadWords(route.params.missionName);
    if (request !== version) return;
    const translations = new Set(), prompts = new Set();
    const words = [];
    for (const item of Array.isArray(data) ? data : []) {
      const eng = typeof item?.eng === 'string' ? item.eng.trim() : '';
      const ru = typeof item?.ru === 'string' ? item.ru.trim() : '';
      const enKey = eng.toLowerCase(), ruKey = ru.toLowerCase();
      if (!eng || !ru || translations.has(ruKey) || prompts.has(enKey)) continue;
      translations.add(ruKey); prompts.add(enKey); words.push({ eng, ru });
    }
    if (!words.length) throw new Error('В этой миссии не нашлось пар слов. Проверь набор и попробуй снова.');
    game.reset(props.demo ? words : shuffle(words).slice(0, 28));
    startedAt = Date.now();
  } catch (error) {
    if (request === version) loadError.value = error instanceof Error ? error.message : 'Не удалось загрузить слова.';
  } finally { if (request === version) loading.value = false; }
}
async function finish() {
  if (!state.value.done || finishing) return;
  if (props.demo) { await loadGame(); return; }
  finishing = true;
  try {
    gameStore.setLastGameResults(Date.now() - startedAt, state.value.mistakes);
    gameStore.setGameName('GameDialSafe');
    gameStore.setWordSet(route.params.missionName);
    await router.push({ path: '/leader-board/', query: { missionName: route.params.missionName, from: 'game-dial-safe' } });
  } finally { finishing = false; }
}
watch(() => [route.params.missionName, props.demo], loadGame, { immediate: true });
onMounted(() => document.addEventListener('visibilitychange', onVisibility));
onBeforeUnmount(() => { version++; game.dispose(); document.removeEventListener('visibilitychange', onVisibility); });
</script>

<style scoped>
.dial-safe { --amber:#ffca72; --metal:#b8c0b8; --dim:#a5aca4; max-width:960px; margin:75px auto 0; padding:clamp(14px,4vw,38px); border:1px solid #495047; border-radius:12px; background:radial-gradient(ellipse at 50% 20%,#323b31,#141a17 75%); color:#e7eae2; font-family:system-ui,sans-serif; box-shadow:0 20px 55px #0005; }
.dial-safe * { box-sizing:border-box; }
.safe-header,.safe-footer { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
.safe-count { font:600 10px/1.3 monospace; letter-spacing:.14em; }
.safe-header h1 { font-size:clamp(30px,5vw,49px); margin:5px 0 1px; letter-spacing:-.04em; line-height:1; }
.safe-header p { color:var(--dim); margin:10px 0 0; font-size:13px; }
.safe-button { border:1px solid #656a59; border-radius:6px; background:linear-gradient(#343d33,#212720); color:#f2e8d4; font:inherit; padding:9px 14px; cursor:pointer; }
.safe-button:hover:not(:disabled) { border-color:var(--amber); }
.safe-button:focus-visible,.dial-face:focus-visible { outline:2px solid var(--amber); outline-offset:4px; }
.safe-button:disabled { opacity:.45; cursor:default; }
.safe-prompt { display:block; margin-top:5px; font:600 clamp(16px,3vw,24px)/1.18 system-ui,sans-serif; overflow-wrap:anywhere; }
.safe-count { font-size:18px; white-space:nowrap; color:var(--amber); text-align:right; }
.safe-count small { display:block; font-size:8px; color:var(--dim); }
.safe-door { position:relative; border:5px solid #131814; border-radius:20px; padding:clamp(8px,3vw,26px); background:repeating-linear-gradient(0deg,#fff1 0 1px,transparent 1px 4px),linear-gradient(125deg,#4c554c,#262e29 32%,#495047 55%,#292f2b); box-shadow:inset 0 0 0 1px #80867a,inset 0 0 25px #000a; }
.safe-mechanism { position:relative; width:min(100%,520px); margin:auto; padding:clamp(20px,5.3vw,42px); isolation:isolate; }
.dial-bezel { position:relative; padding:clamp(7px,1.5vw,14px); border:1px solid #8a9287; border-radius:50%; background:repeating-conic-gradient(#999f90 0 1deg,#3e453c 1deg 3deg,#525b51 3deg 6deg); box-shadow:0 10px 18px #0009,inset 0 0 0 3px #272e27; }
.dial-pointer { z-index:4; position:absolute; bottom:-10px; left:50%; transform:translateX(-50%); width:24px; height:24px; background:var(--amber); clip-path:polygon(50% 0,100% 100%,0 100%); pointer-events:none; }
.dial-face { position:relative; aspect-ratio:1; container-type:inline-size; border:2px solid #141b17; border-radius:50%; overflow:hidden; background:#171f1a; touch-action:none; user-select:none; cursor:grab; }
.dial-face.dragging { cursor:grabbing; }
.dial-rotor { position:absolute; inset:0; border-radius:50%; transform:rotate(var(--angle)); transition:transform 220ms cubic-bezier(.2,.7,.3,1); background:radial-gradient(circle,#313b35 0 22%,#202923 23% 47%,#485247 48% 49%,#28332b 50% 68%,#171e19 69%); }
.dial-word { position:absolute; display:grid; place-items:center; width:24%; min-height:11%; padding:5px 4px; border:1px solid #6c7567; border-radius:6px; background:linear-gradient(#333e34,#1e2922); color:#eee9d8; text-align:center; overflow-wrap:anywhere; font-size:clamp(10px,3.1cqi,14px); font-weight:650; line-height:1.16; transform:translate(-50%,-50%) rotate(calc(-1 * var(--angle))); transition:transform 220ms cubic-bezier(.2,.7,.3,1); }
.dial-word.selected { border-color:var(--amber); color:#ffe4b0; background:#473a26; }
.dragging .dial-rotor,.dragging .dial-word { transition:none; }
.dial-grip { position:absolute; inset:39%; border-radius:50%; display:flex; align-items:center; justify-content:center; gap:8%; background:radial-gradient(circle at 35% 30%,#717b70,#303a33 60%,#1a201d); border:2px solid #788172; box-shadow:0 4px 12px #000b,inset 0 0 0 4px #333d34; color:#ccd1c6; }
.dial-grip span { font:700 clamp(6px,2.65cqi,12px) monospace; color:#f3dfa9; transform:rotate(180deg); white-space:nowrap; text-shadow:0 1px 2px #000; }
.safe-controls { display:flex; align-items:center; justify-content:center; gap:10px; margin:8px auto 0; max-width:430px; }
.safe-controls button { font-size:23px; line-height:1; min-width:44px; min-height:44px; }
.safe-readout { min-width:0; flex:1; text-align:center; color:#ffe1ab; font-size:13px; overflow-wrap:anywhere; }
.hold-track { margin:6px auto 0; height:5px; border-radius:3px; background:#161e18; overflow:hidden; }
.hold-track i { display:block; height:100%; background:var(--amber); transform-origin:left; animation:hold-fill 2s linear both; }
@keyframes hold-fill { from { transform:scaleX(0); } to { transform:scaleX(1); } }
.safe-footer { min-height:56px; margin-top:8px; font-size:13px; color:var(--dim); }
.safe-open { --amber:#c8ec91; }
.finish-button { color:var(--amber); }
.safe-header { margin-bottom:20px; }
.safe-actions { display:flex; align-items:center; gap:14px; }
.safe-count small { white-space:nowrap; }
.safe-mechanism::before {
  content:''; position:absolute; inset:1%; z-index:-1; border-radius:50%;
  background:repeating-conic-gradient(from 3deg,#797b68 0 5deg,#4e5348 5deg 9deg,#282e27 9deg 12deg);
  border:2px solid #949580; box-shadow:0 10px 20px #0009,inset 0 0 0 4px #30372d;
}
.door-pins { position:absolute; inset:0; z-index:3; pointer-events:none; }
.door-pin { position:absolute; inset:0; transform:rotate(var(--bearing)); }
.pin-slot {
  position:absolute; left:43.5%; top:0; width:13%; height:15%; overflow:hidden;
  border:2px solid #929582; border-radius:5px; background:repeating-linear-gradient(0deg,#111713 0 6px,#29342b 6px 7px);
  box-shadow:0 2px 6px #000b,inset 0 0 8px #000;
}
.pin-slot i {
  position:absolute; inset:8% 8% 7%;
  clip-path:polygon(0 0,100% 0,100% 17%,84% 17%,84% 30%,100% 30%,100% 44%,84% 44%,84% 57%,100% 57%,100% 71%,84% 71%,84% 83%,100% 83%,100% 100%,0 100%,0 83%,16% 83%,16% 71%,0 71%,0 57%,16% 57%,16% 44%,0 44%,0 30%,16% 30%,16% 17%,0 17%);
  background:repeating-linear-gradient(0deg,#5e39182e 0 2px,transparent 2px 7px),linear-gradient(90deg,#a26f31,#e7be6b 28%,#ffdf91 50%,#9b682c);
}
.door-pin.retracted i { transform:translateY(-87%); }
.door-pin.retracted .pin-slot { border-color:#859d73; }
.door-pin.unlocking .pin-slot { animation:pin-slot-glow .7s ease-out both; }
.door-pin.unlocking i { animation:pin-unlock .7s cubic-bezier(.3,.65,.4,1) both; }
@keyframes pin-unlock {
  0% { transform:translateY(0); filter:brightness(1); }
  23% { transform:translateY(5%); filter:brightness(1.65); }
  100% { transform:translateY(-87%); filter:brightness(1); }
}
@keyframes pin-slot-glow {
  35% { box-shadow:0 0 19px #ffd477, inset 0 0 8px #ffb854; border-color:#ffe8a1; }
}
@media(prefers-reduced-motion:reduce) {
  .dial-rotor,.dial-word { transition:none; }
  .door-pin.unlocking i,.door-pin.unlocking .pin-slot { animation:none; }
  .hold-track i { animation-timing-function:steps(2,end); }
}
.safe-readout .safe-prompt { color:#ffe1ab; margin:0; font-size:clamp(13px,3vw,20px); }
.safe-inner { position:absolute; inset:0; z-index:2; display:grid; place-items:center; }
.safe-keypad,.safe-treasure {
  padding:10px; border:2px solid #828976; border-radius:10px; background:#1c251e;
  text-align:center; box-shadow:0 5px 14px #000a,inset 0 0 0 3px #333c31;
}
.safe-keypad { width:clamp(164px, 50%, 224px); }
.safe-code-display {
  display:block; margin-bottom:7px; padding:4px; border:1px solid #55604a; border-radius:4px;
  background:#090e0a; color:#e5efba; font:700 19px/1.15 monospace; letter-spacing:.2em;
}
.safe-key-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:4px; }
.safe-key-grid button { min-height:44px; padding:3px; font:700 16px monospace; touch-action:manipulation; }
.safe-key-grid button:last-child { color:var(--amber); }
.safe-code-prompt { min-height:44px; display:grid; place-items:center; margin:8px auto 0; text-align:center; color:#ffe1ab; font-weight:650; }
.safe-treasure { width:min(76%, 330px); background:radial-gradient(ellipse at 50% 70%,#35492c,#101812 78%); }
.safe-treasure strong { color:#b8ef8b; font:700 clamp(22px,6vw,36px) monospace; }
.safe-treasure div { font-size:clamp(22px,6vw,52px); margin-top:12px; }
</style>
