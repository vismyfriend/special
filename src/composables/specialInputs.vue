<template>
  <div class="page">
    <h2>Тест articleWordsInput</h2>

    <!-- ====== ПЕРЕКЛЮЧАТЕЛЬ ====== -->
    <div class="mode-switch">
      <span class="mode-label">Подчёркивание:</span>
      <div class="toggle">
        <button
          class="toggle-btn"
          :class="{ active: underlineMode === 'dash' }"
          @click="underlineMode = 'dash'"
        >
          пунктир
        </button>
        <button
          class="toggle-btn"
          :class="{ active: underlineMode === 'word' }"
          @click="underlineMode = 'word'"
        >
          по словам
        </button>
      </div>
    </div>

    <p class="desc">{{ task.taskDescription }}</p>

    <div class="useful-words">
      <span
        v-for="(w, i) in task.usefulWords"
        :key="i"
        class="useful-word"
      >
        <b>{{ w.eng }}</b> — {{ w.ru }}
      </span>
    </div>

    <div class="article-text">
      <template v-for="(segment, segIndex) in segments" :key="segIndex">
        <span v-if="segment.type === 'text'">{{ segment.value }}</span>
        <span
          v-else
          class="article-blank-wrapper"
          :class="[
            getBlankClass(segment.blankIndex),
            { 'article-blank-wrapper--word': underlineMode === 'word' }
          ]"
          :style="{ '--blank-min': getBlankWidth(segment.answer) }"
          :data-words="getWordUnderscores(segment.answer)"
        >
          <span
            contenteditable="true"
            class="article-blank-input"
            :data-placeholder="segment.isManual ? '...' : ''"
            @keydown.enter.prevent
            @input="onInput(segment.blankIndex, $event)"
            @paste="onPaste($event)"
            @blur="onBlur(segment.blankIndex, $event)"
            :ref="el => setEditableRef(el, segment.blankIndex)"
          ></span>
        </span>
      </template>
    </div>

    <div class="actions">
      <button class="btn" @click="check">Проверить</button>
      <button class="btn reset" @click="reset">Сбросить</button>
    </div>

    <pre v-if="lastResult" class="result-json">{{ lastResult }}</pre>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

// ==================== ТЕСТОВЫЕ ДАННЫЕ ====================
const task = {
  taskDescription: 'Впиши слова в пропуски. Где (anyIsOkay) — что угодно, это на ручную проверку. Подчёркивание показывает, сколько слов в пропуске.',
  usefulWords: [
    { eng: 'wondered', ru: 'задавался вопросом' },
    { eng: 'reason', ru: 'причина' },
    { eng: 'fluency', ru: 'беглость' },
    { eng: 'share with you', ru: 'поделиться с вами' }
  ],
  articleScript: `Have you ever (wondered) why thinking in English feels so hard?
The (reason) is simple: your brain is still translating.
The secret to (fluency) is training your mind to think in English.

  Let me (share with you) a few words about my favourite game. When you wake up, describe what you see in (simple English). It may feel slow, strange, or even (unnatural|strange|weird). But the more you practice, the faster those thoughts become (automatic).

Another trick is to (surround yourself) with English every day.
Listen to English, even when you don't understand (every single word).
Write in your own words why English is important for you: (anyIsOkay)
And here is a long blank for testing: My favourite game is (Twenty One|Black Jack).
Finally, something short: (is) and (a) and (do).`
}

// ==================== РАЗБОР ТЕКСТА ====================
const getArticleSegments = (task) => {
  const script = task?.articleScript || ''
  const parts = script.split(/\(([^)]+)\)/g)
  const segments = []
  let blankIndex = 0
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (i % 2 === 0) {
      if (part) segments.push({ type: 'text', value: part })
    } else {
      const isManual = part.trim().toLowerCase() === 'anyisokay'
      segments.push({
        type: 'blank',
        answer: part,
        blankIndex: blankIndex++,
        isManual
      })
    }
  }
  return segments
}

// ==================== ШИРИНА ПРОПУСКА ====================
const UNDERSCORE_STEP = 8
const WORD_GAP = 6

const getBlankParts = (answer) => {
  const clean = (answer || '').split('|')[0].trim()
  const words = clean.split(/\s+/).filter(Boolean)
  if (words.length === 0) return []
  return words.map(w => Math.max(4, w.length))
}

const getBlankWidth = (answer) => {
  const clean = (answer || '').split('|')[0].trim()
  if (clean.toLowerCase() === 'anyisokay') return '120px'
  const parts = getBlankParts(answer)
  if (parts.length === 0) return '40px'
  const chars = parts.reduce((s, len) => s + len * UNDERSCORE_STEP, 0)
  const gaps = (parts.length - 1) * WORD_GAP
  return `${chars + gaps + 8}px`
}

// ==================== ПРОВЕРКА ====================
const normalize = (s) => String(s || '')
  .toLowerCase()
  .replace(/\s+/g, ' ')
  .trim()
  .replace(/[.,!?;:…–—]+$/g, '')

const checkOne = (user, variants) => {
  const u = normalize(user)
  return variants.some(v => normalize(v) === u)
}

const checkArticleTask = (task, userAnswers) => {
  const segments = getArticleSegments(task)
  const blanks = segments.filter(s => s.type === 'blank')

  const results = []
  let filled = 0
  let hasAuto = false

  blanks.forEach((seg, i) => {
    const user = String(userAnswers?.[i] ?? '').trim()
    if (user) filled++

    if (seg.isManual) {
      results[i] = 'manual'
      return
    }

    hasAuto = true
    const variants = seg.answer.split('|').map(v => v.trim()).filter(Boolean)
    results[i] = user ? checkOne(user, variants) : false
  })

  const autoResults = results.filter(r => r !== 'manual')
  const allAutoOk = autoResults.every(r => r === true)

  if (!hasAuto) {
    return {
      isCorrect: null,
      message: '📝 Всё на ручную проверку',
      results
    }
  }

  return {
    isCorrect: allAutoOk && filled > 0,
    message: allAutoOk && filled > 0
      ? '✅ Все автопроверяемые слова верны'
      : '⚠️ Не все слова совпали',
    results
  }
}

// ==================== СЕГМЕНТЫ ====================
const segments = computed(() => getArticleSegments(task))

const blankCount = computed(() =>
  segments.value.filter(s => s.type === 'blank').length
)

// ==================== РЕЖИМ ====================
const underlineMode = ref('dash')

const getWordUnderscores = (answer) => {
  const clean = (answer || '').split('|')[0].trim()
  if (clean.toLowerCase() === 'anyisokay') {
    return '____ ____'
  }
  const words = clean.split(/\s+/).filter(Boolean)
  if (words.length === 0) return '____'
  return words.map(w => '_'.repeat(Math.max(4, w.length))).join(' ')
}

// ==================== СОСТОЯНИЕ ====================
const answers = ref([])
const results = ref([])
const showResults = ref(false)
const lastResult = ref(null)

// ==================== REF'Ы ====================
const editableRefs = ref({})

const setEditableRef = (el, blankIndex) => {
  if (!el) return
  editableRefs.value[blankIndex] = el
  const saved = answers.value[blankIndex] || ''
  if (el.innerText !== saved) {
    el.innerText = saved
  }
}

// ==================== ВВОД ====================
const onInput = (blankIndex, event) => {
  const text = (event.target.innerText || '').replace(/\u00a0/g, ' ')
  answers.value[blankIndex] = text
}

const onPaste = (event) => {
  event.preventDefault()
  const raw = (event.clipboardData || window.clipboardData).getData('text/plain')
  if (!raw) return
  const text = raw.replace(/\s+/g, ' ').trim()
  const selection = window.getSelection()
  if (!selection.rangeCount) return
  selection.deleteFromDocument()
  selection.getRangeAt(0).insertNode(document.createTextNode(text))
  selection.collapseToEnd()
}

const onBlur = (blankIndex, event) => {
  const el = event.target
  const clean = (el.innerText || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (el.innerText !== clean) {
    el.innerText = clean
  }
  answers.value[blankIndex] = clean
}

// ==================== RESET ====================
const reset = () => {
  answers.value = new Array(blankCount.value).fill('')
  results.value = []
  showResults.value = false
  lastResult.value = null

  nextTick(() => {
    Object.values(editableRefs.value).forEach(el => {
      if (el) el.innerText = ''
    })
  })
}

onMounted(() => {
  reset()
})

// ==================== ПРОВЕРКА ====================
const check = () => {
  const r = checkArticleTask(task, answers.value)
  results.value = r.results
  showResults.value = true
  lastResult.value = JSON.stringify(r, null, 2)
}

// ==================== ПОДСВЕТКА ====================
const getBlankClass = (blankIndex) => {
  if (!showResults.value) return ''
  const val = results.value[blankIndex]
  if (val === undefined) return ''
  if (val === 'manual') return 'article-blank-manual'
  return val ? 'article-blank-correct' : 'article-blank-incorrect'
}
</script>

<style scoped>
.page {
  padding: 30px;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Times New Roman', serif;
}

/* ====== ПЕРЕКЛЮЧАТЕЛЬ ====== */
.mode-switch {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 10px;
  font-family: 'Special_f1', sans-serif;
}
.mode-label {
  font-size: 14px;
  color: #2c3e50;
}
.toggle {
  display: inline-flex;
  background: #e0e8e8;
  border-radius: 20px;
  padding: 3px;
}
.toggle-btn {
  padding: 6px 16px;
  border: none;
  background: transparent;
  border-radius: 17px;
  font-size: 13px;
  font-family: inherit;
  color: #5a6b7b;
  cursor: pointer;
  transition: all 0.2s;
}
.toggle-btn.active {
  background: white;
  color: #207cca;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* ====== ОПИСАНИЕ ====== */
.desc {
  font-size: 14px;
  color: #2c3e50;
  margin: 0 0 10px;
}
.useful-words {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 14px;
  padding: 8px 12px;
  background: rgba(52, 152, 219, 0.08);
  border-left: 4px solid #3498db;
  border-radius: 8px;
}
.useful-word {
  font-size: 13px;
  background: white;
  padding: 4px 10px;
  border: 1px solid rgba(52, 152, 219, 0.25);
  border-radius: 6px;
}

/* ====== ТЕКСТ ====== */
.article-text {
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 28px;
  color: #2c3e50;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
}

/* ====== ПРОПУСК ====== */
.article-blank-wrapper {
  position: relative;
  display: inline-block;
  vertical-align: baseline;
  min-width: var(--blank-min, 40px);
  min-height: 22px;
  line-height: 28px;
  box-sizing: border-box;
  margin: 0 2px;
}

/* режим «пунктир» */
.article-blank-wrapper::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 1px;
  pointer-events: none;
  background-image: repeating-linear-gradient(
    to right,
    rgba(0, 0, 0, 0.35) 0px,
    rgba(0, 0, 0, 0.35) 4px,
    transparent 4px,
    transparent 8px
  );
  z-index: 0;
}

/* режим «по словам» */
.article-blank-wrapper--word::before {
  content: attr(data-words);
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: auto;
  line-height: 1;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.35);
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  background-image: none;
  z-index: 0;
  letter-spacing: 0;
}

/* ====== ЦВЕТ ЛИНИИ/ПОДЧЁРКИВАНИЙ ====== */

.article-blank-wrapper--word.article-blank-correct::before {
  color: #27ae60;
}


.article-blank-wrapper--word.article-blank-incorrect::before {
  color: #f39c12;
}


.article-blank-wrapper--word.article-blank-manual::before {
  color: #3498db;
}

/* ====== САМ ВВОД ====== */
.article-blank-input {
  display: inline-block;
  vertical-align: baseline;
  min-width: inherit;
  min-height: 22px;
  padding: 0 3px;
  margin: 0;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  line-height: 28px;
  color: #2c3e50;
  text-align: center;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
  caret-color: #207cca;
  position: relative;
  z-index: 1;
  cursor: text;
  border-radius: 4px;
  transition: background 0.2s;
}

.article-blank-input:empty::before {
  content: attr(data-placeholder);
  color: #95a5a6;
  font-style: italic;
}

/* ====== МЯГКИЙ ФОН ПОД ТЕКСТОМ ====== */
.article-blank-wrapper.article-blank-correct .article-blank-input {
  background: rgba(46, 204, 113, 0.18);
}
.article-blank-wrapper.article-blank-incorrect .article-blank-input {
  background: rgba(243, 156, 18, 0.18);
}
.article-blank-wrapper.article-blank-manual .article-blank-input {
  background: rgba(52, 152, 219, 0.15);
}

/* ====== КНОПКИ ====== */
.actions {
  margin-top: 16px;
  display: flex;
  gap: 10px;
}
.btn {
  padding: 8px 18px;
  background: linear-gradient(135deg, #207cca, #1e5799);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}
.btn.reset {
  background: #e0e8e8;
  color: #2c3e50;
}
.result-json {
  margin-top: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  font-size: 12px;
  overflow-x: auto;
}
</style>
