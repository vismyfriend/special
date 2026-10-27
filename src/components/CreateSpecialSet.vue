<template>
  <div class="editor">
    <!-- Шапка -->
    <header class="editor__header">
      <input
        v-model.trim="missionVisibleName"
        class="editor__title"
        placeholder="Название набора"
        maxlength="80"
      />

      <div class="editor__meta">
        <label class="editor__field">
          <span class="editor__label">Slug</span>
          <input
            v-model.trim="missionName"
            class="editor__input"
            placeholder="my_word_set"
            maxlength="60"
          />
        </label>

        <label class="editor__toggle">
          <input type="checkbox" v-model="isPublic" />
          <span>Публичный</span>
        </label>
      </div>

      <input
        v-model.trim="missionDescription"
        class="editor__description"
        placeholder="Короткое описание (необязательно)"
        maxlength="200"
      />
    </header>

    <!-- Сетка слов -->
    <div class="grid">
      <div class="grid__head">
        <span class="grid__col grid__col--idx">#</span>
        <span class="grid__col">English</span>
        <span class="grid__col">Русский</span>
        <span class="grid__col">Подсказка</span>
        <span class="grid__col grid__col--del"></span>
      </div>

      <div
        v-for="(row, index) in rows"
        :key="row.uid"
        class="grid__row"
        :class="{ 'grid__row--invalid': isRowInvalid(row) }"
      >
        <span class="grid__col grid__col--idx">{{ index + 1 }}</span>

        <input
          v-model.trim="row.eng"
          class="grid__input"
          placeholder="English word"
          @keydown.enter.prevent="focusNext(index, 'eng')"
          :ref="el => setRef(el, index, 'eng')"
        />
        <input
          v-model.trim="row.ru"
          class="grid__input"
          placeholder="Русское слово"
          @keydown.enter.prevent="focusNext(index, 'ru')"
          @input="maybeAddRow(index)"
          :ref="el => setRef(el, index, 'ru')"
        />
        <input
          v-model.trim="row.hint"
          class="grid__input"
          placeholder="—"
          @keydown.enter.prevent="focusNext(index, 'hint')"
          :ref="el => setRef(el, index, 'hint')"
        />

        <button
          class="grid__delete"
          title="Удалить строку"
          @click="removeRow(index)"
        >
          ×
        </button>
      </div>
    </div>

    <div class="footer">
      <button class="btn btn--ghost add-row" @click="addRow">
        + Добавить слово
      </button>
      <button
        class="btn btn--primary"
        @click="saveSet"
        :disabled="isSaving || !isValid"
      >
        {{ isSaving ? 'Сохраняем…' : 'Сохранить набор' }}
      </button>
      <button class="btn btn--ghost" @click="fillTestData" :disabled="isSaving">
        🎲 Тестовые данные
      </button>
    </div>

    <p class="counter" :class="{ 'counter--warn': !countOk }">
      Слов: {{ filledCount }} / 100 (минимум 5)
    </p>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import WordSetsApi from '../api/wordSets';

const $q = useQuasar();
const router = useRouter();

/* ---------- State ---------- */
const missionName = ref('');
const missionVisibleName = ref('');
const missionDescription = ref('');
const isPublic = ref(true);
const isSaving = ref(false);

// счётчик и фабрика — ДО первого вызова makeRow()
let uidCounter = 0;
function makeRow(eng = '', ru = '', hint = '') {
  return { uid: ++uidCounter, eng, ru, hint };
}

const rows = ref([
  makeRow(),
  makeRow(),
  makeRow(),
  makeRow(),
  makeRow(),
]);

/* ---------- Refs для навигации ---------- */
const inputRefs = ref({});
const setRef = (el, index, type) => {
  if (!el) return;
  if (!inputRefs.value[index]) inputRefs.value[index] = {};
  inputRefs.value[index][type] = el;
};

const focusNext = (index, field) => {
  if (field === 'eng') {
    inputRefs.value[index]?.ru?.focus();
  } else if (field === 'ru') {
    inputRefs.value[index]?.hint?.focus();
  } else if (field === 'hint' && index < rows.value.length - 1) {
    inputRefs.value[index + 1]?.eng?.focus();
  }
};

/* ---------- Добавление / удаление ---------- */
const addRow = () => rows.value.push(makeRow());

const maybeAddRow = (index) => {
  if (index === rows.value.length - 1 && rows.value[index].ru.trim()) {
    addRow();
    nextTick(() => inputRefs.value[index + 1]?.eng?.focus());
  }
};

const removeRow = (index) => {
  if (rows.value.length === 1) {
    rows.value[0] = makeRow();
    return;
  }
  rows.value.splice(index, 1);
};

/* ---------- Валидация ---------- */
const isRowInvalid = (row) => {
  const eng = row.eng.trim();
  const ru = row.ru.trim();
  const hint = row.hint.trim();
  if (!eng && !ru && !hint) return false;
  if (!eng || !ru) return true;
  return false;
};

const filledRows = computed(() =>
  rows.value.filter((r) => r.eng.trim() && r.ru.trim())
);

const filledCount = computed(() => filledRows.value.length);
const countOk = computed(
  () => filledCount.value >= 5 && filledCount.value <= 100
);

const slugOk = computed(() => /^[a-zA-Z0-9_]+$/.test(missionName.value));
const titleOk = computed(() => missionVisibleName.value.trim().length > 0);
const noDupes = computed(() => {
  const seen = new Set();
  for (const r of filledRows.value) {
    const key = r.eng.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
  }
  return true;
});

const isValid = computed(
  () => slugOk.value && titleOk.value && countOk.value && noDupes.value
);

/* ---------- Сохранение ---------- */
const saveSet = async () => {
  if (!slugOk.value) {
    $q.notify({ message: 'Slug: только латиница, цифры и _', color: 'negative' });
    return;
  }
  if (!titleOk.value) {
    $q.notify({ message: 'Введи название набора', color: 'negative' });
    return;
  }
  if (!countOk.value) {
    $q.notify({ message: 'Нужно от 5 до 100 слов', color: 'negative' });
    return;
  }
  if (!noDupes.value) {
    $q.notify({ message: 'Есть дубликаты английских слов', color: 'negative' });
    return;
  }

  isSaving.value = true;
  try {
    await WordSetsApi.create({
      missionName: missionName.value,
      missionVisibleName: missionVisibleName.value,
      missionDescription: missionDescription.value,
      words: filledRows.value.map((r) => ({
        eng: r.eng.trim(),
        ru: r.ru.trim(),
        hint: r.hint.trim() || '',
      })),
      isPublic: isPublic.value,
      creatorUserAgent: navigator.userAgent,
    });
    $q.notify({ message: 'Набор создан!', color: 'positive' });
    router.push('/see-all-sets-of-words');
  } catch (err) {
    console.error(err);
    $q.notify({
      message: err?.response?.data?.message || 'Ошибка сохранения',
      color: 'negative',
    });
  } finally {
    isSaving.value = false;
  }
};


/* ---------- Тестовые данные ---------- */
let testCounter = 0;

const fillTestData = () => {
  testCounter++;
  const suffix = ` (${testCounter})`;

  missionName.value = `test_set_${testCounter}`;
  missionVisibleName.value = `Тестовый набор #${testCounter}`;
  missionDescription.value = `Автозаполнение для теста, попытка ${testCounter}`;
  isPublic.value = true;

  const base = [
    { eng: 'test',      ru: 'тест',        hint: 'тэст' },
    { eng: 'cat',       ru: 'кошка',       hint: 'кэт' },
    { eng: 'two words', ru: 'два слова',   hint: '' },
    { eng: '4',         ru: '4',           hint: '/ фо /' },
    { eng: '5 a long sentence', ru: '5 длинное предложение', hint: '' },
  ];

  rows.value = base.map((r) => makeRow(
    r.eng + suffix,
    r.ru + suffix,
    r.hint ? r.hint + suffix : '',
  ));

  // фокус в первое поле, чтобы сразу можно было жать Enter
  nextTick(() => inputRefs.value[0]?.eng?.focus());

  $q.notify({ message: `Тестовый набор #${testCounter} заполнен`, color: 'info' });
};
</script>

<style lang="scss" scoped>
$border: #e2e2e2;
$text: #1a1a1a;
$muted: #8a8a8a;
$accent: #0274ff;
$danger: #e5484d;
$bg-soft: #fafafa;

.editor {
  max-width: 860px;
  margin: 40px auto;
  margin-top: 80px;
  padding: 0 16px;
  color: $text;
  font: 14px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.editor__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.editor__title {
  font-size: 22px;
  font-weight: 600;
  border: none;
  border-bottom: 1px solid transparent;
  padding: 4px 0;
  outline: none;
  transition: border-color 0.15s;
  &:focus { border-bottom-color: $accent; }
  &::placeholder { color: $muted; }
}

.editor__meta {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}

.editor__field {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.editor__label {
  color: $muted;
}

.editor__input {
  padding: 6px 10px;
  border: 1px solid $border;
  border-radius: 6px;
  background: #fff;
  font-size: 13px;
  outline: none;
  min-width: 180px;
  &:focus { border-color: $accent; }
}

.editor__toggle {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-size: 13px;
  color: $muted;
  cursor: pointer;
}

.editor__description {
  border: 1px solid $border;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
  outline: none;
  background: #fff;
  &:focus { border-color: $accent; }
  &::placeholder { color: $muted; }
}

.grid {
  border: 1px solid $border;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.grid__head,
.grid__row {
  display: grid;
  grid-template-columns: 44px 1fr 1fr 1fr 32px;
  align-items: center;
}

.grid__head {
  background: $bg-soft;
  font-size: 12px;
  color: $muted;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 8px 0;
  border-bottom: 1px solid $border;
}

.grid__col {
  padding: 0 10px;
  &--idx { text-align: center; }
}

.grid__row {
  border-bottom: 1px solid $border;
  &:last-child { border-bottom: none; }
  transition: background 0.12s;
  &:hover { background: #fcfcfc; }
}

.grid__row--invalid {
  background: rgba($danger, 0.04);
}

.grid__input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  padding: 10px;
  font-size: 14px;
  &:focus { background: rgba($accent, 0.06); }
}

.grid__delete {
  background: none;
  border: none;
  color: $muted;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.12s, color 0.12s;
  .grid__row:hover & { opacity: 1; }
  &:hover { color: $danger; }
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}

.add-row { width: auto; }

.btn {
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s, border-color 0.15s, opacity 0.15s;
  &:disabled { opacity: 0.5; cursor: not-allowed; }

  &--primary {
    background: $accent;
    color: #fff;
    &:hover:not(:disabled) { background: darken($accent, 6%); }
  }
  &--ghost {
    background: #fff;
    border-color: $border;
    color: $text;
    &:hover:not(:disabled) { background: $bg-soft; }
  }
}

.counter {
  margin-top: 10px;
  font-size: 12px;
  color: $muted;
  &--warn { color: $danger; }
}
</style>
