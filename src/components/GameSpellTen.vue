<template>
  <div class="row" v-if="currentGameData">
    <div class="col">
      <div class="wordCard" v-for="(ruWord, index) in ruCards" :key="ruWord.id">
        <div class="word-container">
          <div class="word-column">
            <span @dblclick="revealAnswer(index)">{{ ruWord.lang }}</span>
          </div>

          <div class="input-column">
            <div class="input-wrap">
              <!-- Overlay: текст прозрачный, видны только фон/подчёркивание/маркеры -->
              <div class="overlay" aria-hidden="true">
                <span
                  v-for="(seg, i) in highlightSegments[index]"
                  :key="i"
                  :class="'seg-' + seg.type"
                >{{ seg.text }}</span>
              </div>

              <input
                class="userInput"
                type="text"
                v-model="translations[index]"
                @keyup.enter="handleEnter(index)"
                @input="clearHighlight(index)"
                :placeholder="getPlaceholder(index)"
                :class="{
                  'correct': correctAnswers[index],
                  'incorrect': incorrectAnswers[index]
                }"
              />
            </div>
          </div>

<!--          <div class="additional-column">-->
<!--            <p>{{ (index + 1) * 10 }}%</p>-->
<!--          </div>-->
        </div>
      </div>
    </div>
  </div>

  <div class="controls">
    <button class="check-answers-button" @click="checkAllTranslations">Проверить перевод</button>

    <label class="hints-toggle">
      <span class="toggle-label">Подсказки</span>
      <input type="checkbox" v-model="hintsEnabled" />
      <span class="slider"></span>
    </label>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { whatGameDataToUse } from '../composables/whatGameDataToUse';
import shortWordsData from '../dataForGames/short-words-data';
import { useRoute } from 'vue-router';

const { loadWords, loading, error } = whatGameDataToUse();

const getWordSet = (name) => {
  if (shortWordsData[name]) return shortWordsData[name];
  for (const level in shortWordsData) {
    if (shortWordsData[level] && shortWordsData[level][name]) {
      return shortWordsData[level][name];
    }
  }
  return [];
};

const route = useRoute();

const currentGameData = ref([]);
const ruCards = ref([]);
const translations = ref(Array(10).fill(''));
const correctAnswers = ref(Array(10).fill(false));
const incorrectAnswers = ref(Array(10).fill(false));

const hintsEnabled = ref(true);
const revealedIndexes = ref(new Set());

// Сегменты подсветки по каждому индексу
const highlightSegments = ref(Array(10).fill(null).map(() => []));

const shuffle = array => array.sort(() => Math.random() - 0.5);

const splitCards = (lang) => {
  let words = currentGameData.value?.map(el => ({
    id: el.id,
    lang: el[lang],
  }));
  return shuffle(words).slice(0, 10);
};

const getHintById = (id) => {
  const word = currentGameData.value.find(el => el.id === id);
  return word?.hint || '';
};

const getPlaceholder = (index) => {
  if (revealedIndexes.value.has(index)) {
    const word = currentGameData.value.find(el => el.id === ruCards.value[index].id);
    return word?.eng || '';
  }
  if (hintsEnabled.value) {
    return getHintById(ruCards.value[index].id);
  }
  return '';
};

const revealAnswer = (index) => {
  const newSet = new Set(revealedIndexes.value);
  newSet.add(index);
  revealedIndexes.value = newSet;

  setTimeout(() => {
    const s = new Set(revealedIndexes.value);
    s.delete(index);
    revealedIndexes.value = s;
  }, 2000);
};

// === Нормализация ===
const normalizeAnswer = (answer) => {
  if (!answer || typeof answer !== 'string') return '';
  return answer
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.,!?;:…–—]+$/g, '')
    .replace(/[.,!?;:…–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[`'‘’´]/g, "'")
    .replace(/\bdo not\b/g, "don't")
    .replace(/\bdoes not\b/g, "doesn't")
    .replace(/\bdid not\b/g, "didn't")
    .replace(/\bwill not\b/g, "won't")
    .replace(/\bcan not\b/g, "can't")
    .replace(/\b(?:dont|doesnt|didnt|wont|cant)\b/g, match =>
      ({
        dont: "don't",
        doesnt: "doesn't",
        didnt: "didn't",
        wont: "won't",
        cant: "can't"
      }[match]))
    .replace(/\s+/g, ' ')
    .trim();
};

// === Проверка «верно/неверно» (как было) ===
const isTypoCloseEnough = (userWord, correctWord) => {
  if (userWord === correctWord) return true;

  const strictWords = ['he','his','she','her','you','your','we','our','it','is','are','was','were','do','does','did','have','has','had','who','why'];
  const isShortWord = correctWord.length <= 3;

  if (strictWords.includes(correctWord) || isShortWord) return false;

  if (Math.abs(userWord.length - correctWord.length) > 1) return false;

  let errors = 0;
  const maxLength = Math.max(userWord.length, correctWord.length);

  for (let i = 0, j = 0; i < maxLength || j < maxLength; i++, j++) {
    if (i >= userWord.length || j >= correctWord.length || userWord[i] !== correctWord[j]) {
      errors++;
      if (errors > 1) return false;
      if (userWord.length > correctWord.length) j--;
      else if (userWord.length < correctWord.length) i--;
    }
  }
  return true;
};

const isAnswerCorrect = (userAnswer, correctAnswer) => {
  const normalizedUser = normalizeAnswer(userAnswer);
  const normalizedCorrect = normalizeAnswer(correctAnswer);

  if (normalizedUser === normalizedCorrect) return true;

  const userWords = normalizedUser.split(' ');
  const correctWords = normalizedCorrect.split(' ');

  if (userWords.length !== correctWords.length) return false;

  for (let i = 0; i < correctWords.length; i++) {
    if (!isTypoCloseEnough(userWords[i], correctWords[i])) return false;
  }
  return true;
};

// === Diff по символам (Levenshtein + backtracking) ===
// Возвращает массив операций:
// { type: 'equal', text }
// { type: 'replace', user, correct }
// { type: 'delete', text }  // лишний символ у пользователя
// { type: 'insert', text }  // пропущенный символ (есть в correct)
const diffChars = (userStr, correctStr) => {
  const a = userStr;
  const b = correctStr;
  const n = a.length;
  const m = b.length;

  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j - 1], // replace
          dp[i - 1][j],     // delete
          dp[i][j - 1]      // insert
        );
      }
    }
  }

  const ops = [];
  let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      ops.push({ type: 'equal', text: a[i - 1] });
      i--; j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      ops.push({ type: 'replace', user: a[i - 1], correct: b[j - 1] });
      i--; j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      ops.push({ type: 'delete', text: a[i - 1] });
      i--;
    } else {
      ops.push({ type: 'insert', text: b[j - 1] });
      j--;
    }
  }
  ops.reverse();

  // Схлопываем подряд идущие операции одного типа
  const merged = [];
  for (const op of ops) {
    const last = merged[merged.length - 1];
    if (last && last.type === op.type) {
      if (op.type === 'replace') {
        last.user += op.user;
        last.correct += op.correct;
      } else {
        last.text += op.text;
      }
    } else {
      merged.push({ ...op });
    }
  }
  return merged;
};

// === Превращаем diff в сегменты для overlay ===
const computeHighlight = (userInput, correctAnswer) => {
  if (!userInput || !userInput.trim()) return [];

  const normalizedUser = normalizeAnswer(userInput);
  const normalizedCorrect = normalizeAnswer(correctAnswer);

  // Полное совпадение — всё зелёное
  if (normalizedUser === normalizedCorrect) {
    return [{ text: userInput, type: 'exact' }];
  }

  const userWords = normalizedUser.split(' ');
  const correctWords = normalizedCorrect.split(' ');


  // Расширяет fuzzy/missing-сегменты на 1 символ влево и вправо,
// чтобы одиночная ошибочная буква была хорошо видна.
// Подчёркивание при этом должно остаться только на самой ошибке,
// поэтому маркер для подчёркивания отделяем.
  const expandFuzzySegments = (segments) => {
    if (!segments.length) return segments;

    // Помечаем, какие сегменты "виновные" (fuzzy / missing)
    const isFault = (seg) => seg.type === 'fuzzy' || seg.type === 'missing';

    // Сначала: для каждого сегмента вычисляем, надо ли ему добавить
    // "фоновую подсветку" слева или справа (но не менять его тип для подчёркивания)
    const result = segments.map(seg => ({ ...seg }));

    for (let i = 0; i < result.length; i++) {
      const seg = result[i];
      if (!isFault(seg)) continue;

      // Разбиваем текст сегмента на символы, чтобы можно было точечно
      // добавить фоновую подсветку только к первому/последнему символу
      const chars = seg.text.split('');

      // Левый сосед: если предыдущий сегмент — neutral и не пустой
      if (i > 0 && result[i - 1].type === 'neutral') {
        const prevChars = result[i - 1].text.split('');
        if (prevChars.length > 0) {
          const lastChar = prevChars.pop();
          result[i - 1].text = prevChars.join('');
          result[i - 1].padRight = lastChar; // запомним символ для "фонового" расширения
        }
      }

      // Правый сосед: если следующий сегмент — neutral и не пустой
      if (i < result.length - 1 && result[i + 1].type === 'neutral') {
        const nextChars = result[i + 1].text.split('');
        if (nextChars.length > 0) {
          const firstChar = nextChars.shift();
          result[i + 1].text = nextChars.join('');
          result[i + 1].padLeft = firstChar; // запомним символ для "фонового" расширения
        }
      }
    }

    // Теперь превращаем padLeft / padRight в отдельные neutral-сегменты
    // с дополнительным классом "pad" — чтобы они получили фон, но не подчёркивание.
    const expanded = [];
    for (const seg of result) {
      if (seg.padLeft) {
        expanded.push({ text: seg.padLeft, type: 'pad' });
      }
      if (seg.text) {
        const { padLeft, padRight, ...rest } = seg;
        expanded.push(rest);
      }
      if (seg.padRight) {
        expanded.push({ text: seg.padRight, type: 'pad' });
      }
    }

    return expanded;
  };

  // Если число слов не совпало — не diff-им посимвольно, подсвечиваем всё
  if (userWords.length !== correctWords.length) {
    return [{ text: userInput, type: 'fuzzy' }];
  }

  const segments = [];
  for (let w = 0; w < correctWords.length; w++) {
    const uWord = userWords[w];
    const cWord = correctWords[w];

    if (uWord === cWord) {
      segments.push({ text: uWord, type: 'neutral' });
    } else {
      const ops = diffChars(uWord, cWord);
      for (const op of ops) {
        if (op.type === 'equal') {
          segments.push({ text: op.text, type: 'neutral' });
        } else if (op.type === 'replace') {
          segments.push({ text: op.user, type: 'fuzzy' });
        } else if (op.type === 'delete') {
          segments.push({ text: op.text, type: 'fuzzy' });
        } else if (op.type === 'insert') {
          segments.push({ text: op.text, type: 'missing' });
        }
      }
    }

    if (w < correctWords.length - 1) {
      segments.push({ text: ' ', type: 'neutral' });
    }
  }

  return expandFuzzySegments(segments);
};

// === Очистка подсветки при новом вводе ===
const clearHighlight = (index) => {
  highlightSegments.value[index] = [];
  correctAnswers.value[index] = false;
  incorrectAnswers.value[index] = false;
};

// === Проверка всех переводов ===
const checkAllTranslations = () => {
  ruCards.value.forEach((ruWord, index) => {
    const correctTranslation = currentGameData.value.find(el => el.id === ruWord.id).eng;
    const isCorrect = isAnswerCorrect(translations.value[index], correctTranslation);

    correctAnswers.value[index] = isCorrect;
    incorrectAnswers.value[index] = !isCorrect;

    highlightSegments.value[index] = computeHighlight(translations.value[index], correctTranslation);
  });
};

const handleEnter = (index) => {
  if (index < translations.value.length - 1) {
    const nextInput = document.querySelectorAll('input')[index + 1];
    if (nextInput) nextInput.focus();
  } else {
    checkAllTranslations();
  }

  const lastInput = document.querySelectorAll('input')[index];
  if (lastInput) lastInput.blur();
};

onMounted(async () => {
  const missionName = route.params.missionName;
  currentGameData.value = await loadWords(missionName);
  console.log('Загружено слов:', currentGameData.value.length);
  ruCards.value = splitCards("ru");
});
</script>

<style lang="scss" scoped>

.row { margin-top: 75px; }
.col { color: wheat; }

.check-answers-button {
  border-radius: 50px;
  background-color: aqua;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 20px;
}

/* Toggle подсказок */
.hints-toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  color: wheat;
  position: relative;
}
.hints-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
.toggle-label { font-size: 16px; }
.slider {
  position: relative;
  width: 48px;
  height: 26px;
  background-color: #ccc;
  border-radius: 26px;
  transition: background-color 0.3s;
}
.slider::before {
  content: "";
  position: absolute;
  width: 20px; height: 20px;
  left: 3px; top: 3px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
}
.hints-toggle input:checked + .slider { background-color: #4caf50; }
.hints-toggle input:checked + .slider::before { transform: translateX(22px); }

.wordCard {
  background-color: #f9f9f9;
  border-radius: 20px;
  padding: 5px 20px;
  margin: 1.5px;
  user-select: none;
  color: black;
  display: flex;
  flex-direction: column;
}

.word-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.word-column {
  flex-basis: 30%;
  text-align: right;
  padding-right: 10px;
  cursor: pointer;
}

.input-column { flex-basis: 60%; }
.additional-column { flex-basis: 10%; }

/* === Обёртка input + overlay === */
.input-wrap {
  position: relative;
  width: 100%;
  height: 38px;
}

/* Overlay: текст прозрачный, видны только фон/подчёркивание/маркеры */
.overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  font-size: 16px;
  font-family: inherit;
  white-space: pre;
  overflow: hidden;
  box-sizing: border-box;
  z-index: 0;
  color: transparent; /* ключевое: текст невидим, двоения нет */
}

/* Совпавшие символы — без фона */
.seg-neutral {
  background: transparent;
  border-bottom: none;
}

/* Ошибка: неверный или лишний символ */
.seg-fuzzy {
  background: rgba(255, 165, 0, 0.35);
  border-bottom: 2px solid #ff9800;
  border-radius: 3px;
}

/* Пропущенный символ: тонкий маркер на месте вставки */
.seg-missing {
  background: rgba(255, 165, 0, 0.25);
  border-left: 2px dashed #ff9800;
  border-right: 2px dashed #ff9800;
}

/* Полное совпадение */
.seg-exact {
  background: rgba(76, 175, 80, 0.30);
  border-bottom: 2px solid #4caf50;
  border-radius: 3px;
}

/* Совсем неверно (если число слов не совпало) */
.seg-wrong {
  background: rgba(244, 67, 54, 0.25);
  border-bottom: 2px solid #f44336;
  border-radius: 3px;
}
/* Соседний символ ошибки: только фон, без подчёркивания */
.seg-pad {
  background: rgba(44, 255, 0, 0.21);
  border-radius: 3px;
}
/* Input: прозрачный фон, текст виден только здесь */
.userInput {
  position: relative;
  z-index: 1;
  border-radius: 50px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-align: center;
  border: 2px solid gray;
  transition: all 0.3s ease;
  background: transparent;
  font-size: 16px;
  font-family: inherit;
  padding: 0 12px;
  color: #000;
}

.userInput:focus {
  border: 2px solid blue;
  box-shadow: 0 0 10px 5px rgba(0, 0, 255, 0.5);
  background: rgba(173, 216, 230, 0.3);
}

.correct {
  border: 2px solid green;
  box-shadow: 0 0 10px 5px rgba(0, 255, 0, 0.5);
}

.incorrect {
  border: 2px solid red;
  font-weight: bold;
  box-shadow: 0 0 10px 5px rgba(255, 0, 0, 0.5);
}

</style>
