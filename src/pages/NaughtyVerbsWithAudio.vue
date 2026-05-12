<template>
  <div class="detective-verbs-modern">
    <!-- Модальное окно инструкции -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-icon">🕵️‍♂️</div>
        <h2>СЕКРЕТНЫЙ ФАЙЛ</h2>
        <div class="modal-instruction">
          <p><strong>Правила работы с досье:</strong></p>
          <ul>
            <li>👆 <strong>Кликни на любой глагол</strong> в таблице — услышишь произношение</li>
            <li>📖 В верхней панели появятся <strong>примеры</strong> с этим глаголом</li>
            <li>🎧 Нажми на иконку 🎧 — тоже сработает</li>
          </ul>
          <p class="modal-tip">"Повторяй вслух — так улики запоминаются лучше!"</p>
        </div>
        <button class="modal-btn" @click="closeModal">OK, ПОНЯЛ</button>
      </div>
    </div>

    <!-- Основной контент (затемнён, если модалка открыта) -->
    <div :class="{ 'content-blurred': showModal }">
      <!-- Шапка -->
      <div class="case-header">
        <div class="case-badge">SPECIAL AGENT DOSSIER // TOP SECRET</div>
        <h1>IRREGULAR VERBS</h1>
        <p class="detective-sub">Секретные файлы неправильных глаголов</p>
      </div>

      <!-- Окно примеров -->
      <div class="examples-window" v-if="selectedVerb">
        <div class="examples-header">
          <span class="examples-title">🔍 ПРИМЕРЫ: {{ selectedVerb.base }} ({{ selectedVerb.translation }})</span>
          <button class="examples-close" @click="clearExamples">✕</button>
        </div>
        <div class="examples-list">
          <div class="example-item">
            <span class="pronoun">I</span>
            <span class="example-text">{{ examples.I.positive }}</span>
            <button class="example-audio" @click="playAudio(selectedVerb.audioBase)">🎧</button>
          </div>
          <div class="example-item negative">
            <span class="pronoun">I don't</span>
            <span class="example-text">{{ examples.I.negative }}</span>
            <button class="example-audio" @click="playAudio(selectedVerb.audioBase)">🎧</button>
          </div>
          <div class="example-item">
            <span class="pronoun">He/She/It</span>
            <span class="example-text">{{ examples.he.positive }}</span>
            <button class="example-audio" @click="playAudio(selectedVerb.audioBase)">🎧</button>
          </div>
          <div class="example-item negative">
            <span class="pronoun">He/She/It doesn't</span>
            <span class="example-text">{{ examples.he.negative }}</span>
            <button class="example-audio" @click="playAudio(selectedVerb.audioBase)">🎧</button>
          </div>
          <div class="example-item">
            <span class="pronoun">They/We</span>
            <span class="example-text">{{ examples.they.positive }}</span>
            <button class="example-audio" @click="playAudio(selectedVerb.audioBase)">🎧</button>
          </div>
          <div class="example-item negative">
            <span class="pronoun">They/We don't</span>
            <span class="example-text">{{ examples.they.negative }}</span>
            <button class="example-audio" @click="playAudio(selectedVerb.audioBase)">🎧</button>
          </div>
          <div class="example-item question">
            <span class="pronoun">❓ Question</span>
            <span class="example-text">{{ examples.question }}</span>
            <button class="example-audio" @click="playAudio(selectedVerb.audioBase)">🎧</button>
          </div>
        </div>
      </div>
      <div v-else class="examples-window empty">
        <div class="examples-header">
          <span class="examples-title">🔍 ОКНО ПРИМЕРОВ</span>
        </div>
        <div class="examples-placeholder">
          <span>👆 Нажми на любой глагол, чтобы увидеть примеры</span>
        </div>
      </div>

      <!-- Компактная таблица: русский + 3 формы -->
      <div class="verbs-table-wrapper">
        <table class="verbs-table">
          <thead>
          <tr>
            <th>РУССКИЙ</th>
            <th>BASE</th>
            <th>PAST</th>
            <th>PARTICIPLE</th>
            <th class="audio-col"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(verb, idx) in verbs" :key="idx">
            <td class="trans-cell">{{ verb.translation }}</td>
            <td class="verb-cell" @click="selectVerb(verb, 'base')">
              {{ verb.base }}
              <span class="play-hint">▶</span>
            </td>
            <td class="verb-cell" @click="selectVerb(verb, 'past')">
              {{ verb.past }}
              <span class="play-hint">▶</span>
            </td>
            <td class="verb-cell" @click="selectVerb(verb, 'participle')">
              {{ verb.participle }}
              <span class="play-hint">▶</span>
            </td>
            <td class="audio-cell">
              <button class="audio-icon" @click.stop="playAudio(verb.audioBase)">🎧</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Футер -->
      <div class="detective-footer">
        <span class="footer-icon">🕵️‍♂️</span>
        <span><strong>Совет агента:</strong> нажми на глагол — услышишь произношение и увидишь примеры</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(true);
const selectedVerb = ref(null);

// Функция воспроизведения аудио
const playAudio = (audioSrc) => {
  if (!audioSrc) {
    console.warn('Audio missing');
    return;
  }
  const audio = new Audio(audioSrc);
  audio.play().catch(e => console.error('audio error:', e));
};

// Функция закрытия модалки
const closeModal = () => {
  showModal.value = false;
};

// Очистка примеров
const clearExamples = () => {
  selectedVerb.value = null;
};

// Генерация примеров для выбранного глагола
const examples = ref({
  I: { positive: '', negative: '' },
  he: { positive: '', negative: '' },
  they: { positive: '', negative: '' },
  question: ''
});

const generateExamples = (verb) => {
  const base = verb.base;
  const past = verb.past;
  const participle = verb.participle;

  // Базовые примеры (можно позже вынести в отдельный массив)
  examples.value = {
    I: {
      positive: `${base} ${base === 'be' ? 'am' : base === 'have' ? 'have' : ''} ${base === 'go' ? 'to school' : base === 'eat' ? 'pizza' : base === 'drink' ? 'coffee' : 'rules'}`.trim(),
      negative: `don't ${base} ${base === 'be' ? 'late' : base === 'have' ? 'time' : base === 'go' ? 'there' : base === 'eat' ? 'meat' : 'anything'}`.trim()
    },
    he: {
      positive: base === 'be' ? 'is' : base === 'have' ? 'has' : `${base}s`,
      negative: `doesn't ${base}`
    },
    they: {
      positive: `${base} ${base === 'be' ? 'are' : base === 'have' ? 'have' : ''}`,
      negative: `don't ${base}`
    },
    question: `Do you ${base} ${base === 'be' ? 'happy' : base === 'have' ? 'a car' : 'often'}?`
  };

  // Доработка для конкретных глаголов (для реализма)
  if (base === 'break') {
    examples.value.I.positive = 'break rules sometimes';
    examples.value.I.negative = "don't break rules";
    examples.value.he.positive = 'breaks rules';
    examples.value.he.negative = "doesn't break rules";
    examples.value.they.positive = 'break rules';
    examples.value.they.negative = "don't break rules";
    examples.value.question = 'Do you break rules often?';
  }
  if (base === 'go') {
    examples.value.I.positive = 'go to school every day';
    examples.value.I.negative = "don't go to school on Sunday";
    examples.value.he.positive = 'goes to work by car';
    examples.value.he.negative = "doesn't go to the gym";
    examples.value.they.positive = 'go to the cinema';
    examples.value.they.negative = "don't go to parties";
    examples.value.question = 'Do you go to the gym?';
  }
  if (base === 'eat') {
    examples.value.I.positive = 'eat pizza for dinner';
    examples.value.I.negative = "don't eat meat";
    examples.value.he.positive = 'eats vegetables every day';
    examples.value.he.negative = "doesn't eat fast food";
    examples.value.they.positive = 'eat together';
    examples.value.they.negative = "don't eat late";
    examples.value.question = 'Do you eat breakfast?';
  }
};

// Выбор глагола и показ примеров
const selectVerb = (verb, formType) => {
  selectedVerb.value = verb;
  generateExamples(verb);

  // Воспроизводим выбранную форму
  let audioSrc = verb.audioBase;
  if (formType === 'past') audioSrc = verb.audioPast;
  if (formType === 'participle') audioSrc = verb.audioParticiple;
  playAudio(audioSrc);
};

// Два глагола на букву (для компактности)
const verbs = ref([
  // B
  { base: "be", past: "was/were", participle: "been", translation: "быть", audioBase: "https://media.merriam-webster.com/audio/prons/en/us/mp3/b/be000001.mp3", audioPast: "https://media.merriam-webster.com/audio/prons/en/us/mp3/w/were0001.mp3", audioParticiple: "https://media.merriam-webster.com/audio/prons/en/us/mp3/b/been0001.mp3" },
  { base: "break", past: "broke", participle: "broken", translation: "ломать", audioBase: "https://media.merriam-webster.com/audio/prons/en/us/mp3/b/break001.mp3", audioPast: "https://media.merriam-webster.com/audio/prons/en/us/mp3/b/broke001.mp3", audioParticiple: "https://media.merriam-webster.com/audio/prons/en/us/mp3/b/broken001.mp3" },

  // C
  { base: "choose", past: "chose", participle: "chosen", translation: "выбирать", audioBase: "https://media.merriam-webster.com/audio/prons/en/us/mp3/c/choo_s01.mp3", audioPast: "https://media.merriam-webster.com/audio/prons/en/us/mp3/c/chose001.mp3", audioParticiple: "https://media.merriam-webster.com/audio/prons/en/us/mp3/c/chosen001.mp3" },
  { base: "come", past: "came", participle: "come", translation: "приходить", audioBase: "https://media.merriam-webster.com/audio/prons/en/us/mp3/c/come001.mp3", audioPast: "https://media.merriam-webster.com/audio/prons/en/us/mp3/c/came001.mp3", audioParticiple: "https://media.merriam-webster.com/audio/prons/en/us/mp3/c/come001.mp3" },

  // D
  { base: "do", past: "did", participle: "done", translation: "делать", audioBase: "https://media.merriam-webster.com/audio/prons/en/us/mp3/d/do000001.mp3", audioPast: "https://media.merriam-webster.com/audio/prons/en/us/mp3/d/did00001.mp3", audioParticiple: "https://media.merriam-webster.com/audio/prons/en/us/mp3/d/done0001.mp3" },
  { base: "drink", past: "drank", participle: "drunk", translation: "пить", audioBase: "https://media.merriam-webster.com/audio/prons/en/us/mp3/d/drink001.mp3", audioPast: "https://media.merriam-webster.com/audio/prons/en/us/mp3/d/drank001.mp3", audioParticiple: "https://media.merriam-webster.com/audio/prons/en/us/mp3/d/drunk001.mp3" },

  // E
  { base: "eat", past: "ate", participle: "eaten", translation: "есть", audioBase: "https://media.merriam-webster.com/audio/prons/en/us/mp3/e/eat000001.mp3", audioPast: "https://media.merriam-webster.com/audio/prons/en/us/mp3/a/ate000001.mp3", audioParticiple: "https://media.merriam-webster.com/audio/prons/en/us/mp3/e/eaten001.mp3" },

  // F
  { base: "fly", past: "flew", participle: "flown", translation: "летать", audioBase: "https://media.merriam-webster.com/audio/prons/en/us/mp3/f/fly000001.mp3", audioPast: "https://media.merriam-webster.com/audio/prons/en/us/mp3/f/flew001.mp3", audioParticiple: "https://media.merriam-webster.com/audio/prons/en/us/mp3/f/flown001.mp3" },

  // G
  { base: "go", past: "went", participle: "gone", translation: "идти", audioBase: "https://media.merriam-webster.com/audio/prons/en/us/mp3/g/go000001.mp3", audioPast: "https://media.merriam-webster.com/audio/prons/en/us/mp3/w/went0001.mp3", audioParticiple: "https://media.merriam-webster.com/audio/prons/en/us/mp3/g/gone0001.mp3" }
]);
</script>

<style scoped>
.detective-verbs-modern {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  background: #0a0c10;
  background-image: radial-gradient(circle at 15% 30%, rgba(30, 40, 60, 0.4) 0%, #030507 95%);
  border-radius: 24px;
  color: #eef2ff;
  box-shadow: 0 25px 40px -12px rgba(0, 0, 0, 0.6);
  position: relative;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}
.modal-content {
  background: linear-gradient(135deg, #141e2c 0%, #0a111c 100%);
  border: 1px solid #2e4a6e;
  border-radius: 32px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}
.modal-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}
.modal-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #fff, #8ab3d6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
.modal-instruction {
  text-align: left;
  margin: 1.5rem 0;
}
.modal-instruction ul {
  padding-left: 1.5rem;
  margin: 1rem 0;
}
.modal-instruction li {
  margin: 0.75rem 0;
  font-size: 0.9rem;
  line-height: 1.4;
}
.modal-tip {
  background: rgba(59, 130, 246, 0.1);
  border-left: 3px solid #3b82f6;
  padding: 0.75rem;
  font-style: italic;
  font-size: 0.85rem;
  margin-top: 1rem;
}
.modal-btn {
  background: #3b6e9f;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}
.modal-btn:hover {
  background: #2c5a85;
  transform: scale(1.02);
}

.content-blurred {
  filter: blur(4px);
  pointer-events: none;
  user-select: none;
}

/* Шапка */
.case-header {
  padding: 1rem 0.5rem 0.8rem;
  border-bottom: 1px solid rgba(80, 140, 200, 0.3);
  margin-bottom: 1.2rem;
}
.case-badge {
  font-size: 0.65rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #6c8fb3;
  background: rgba(20, 30, 45, 0.7);
  backdrop-filter: blur(4px);
  display: inline-block;
  padding: 0.2rem 0.8rem;
  border-radius: 40px;
  margin-bottom: 0.5rem;
}
.case-header h1 {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0.25rem 0;
  background: linear-gradient(135deg, #FFFFFF 0%, #9ab3d0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
.detective-sub {
  font-size: 0.8rem;
  color: #a0bbd6;
  margin-top: 0.25rem;
}

/* Окно примеров */
.examples-window {
  background: rgba(12, 18, 28, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 20px;
  border: 1px solid #2e4a6e;
  margin-bottom: 1.2rem;
  overflow: hidden;
}
.examples-window.empty {
  background: rgba(12, 18, 28, 0.6);
}
.examples-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  background: rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid #2e4a6e;
}
.examples-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #8ab3d6;
  text-transform: uppercase;
}
.examples-close {
  background: none;
  border: none;
  color: #8ab3d6;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 0.5rem;
}
.examples-list {
  padding: 0.8rem;
  max-height: 280px;
  overflow-y: auto;
}
.example-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 0.5rem;
  border-bottom: 1px solid rgba(80, 140, 200, 0.15);
  font-size: 0.85rem;
}
.example-item.negative {
  background: rgba(239, 68, 68, 0.05);
}
.example-item.question {
  background: rgba(59, 130, 246, 0.05);
}
.pronoun {
  font-weight: 700;
  min-width: 85px;
  color: #8ab3d6;
}
.example-text {
  flex: 1;
  color: #eef2ff;
}
.example-audio {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}
.example-audio:hover {
  opacity: 1;
}
.examples-placeholder {
  padding: 1.5rem;
  text-align: center;
  color: #6c8fb3;
  font-size: 0.85rem;
}

/* Таблица */
.verbs-table-wrapper {
  background: rgba(12, 18, 28, 0.75);
  backdrop-filter: blur(2px);
  border-radius: 20px;
  border: 1px solid rgba(70, 110, 150, 0.3);
  overflow-x: auto;
  margin-bottom: 1rem;
}
.verbs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  min-width: 500px;
}
.verbs-table th {
  text-align: left;
  padding: 0.8rem 0.5rem;
  font-weight: 600;
  color: #c9e1ff;
  background: rgba(0, 0, 0, 0.35);
  border-bottom: 1px solid #2e425b;
  font-size: 0.7rem;
  text-transform: uppercase;
}
.verbs-table td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid rgba(60, 90, 120, 0.3);
  vertical-align: middle;
}
.trans-cell {
  color: #bdd4f0;
  font-size: 0.8rem;
  font-weight: 400;
}
.verb-cell {
  font-weight: 600;
  color: #eef5ff;
  cursor: pointer;
  transition: all 0.1s ease;
  position: relative;
}
.verb-cell:hover {
  color: #7bb3e0;
  text-shadow: 0 0 2px rgba(100, 160, 220, 0.5);
}
.verb-cell .play-hint {
  font-size: 0.65rem;
  opacity: 0;
  margin-left: 4px;
  transition: opacity 0.1s;
}
.verb-cell:hover .play-hint {
  opacity: 0.7;
}
.audio-cell {
  text-align: center;
  width: 45px;
}
.audio-icon {
  background: rgba(20, 30, 48, 0.7);
  border: none;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 40px;
  padding: 0.25rem 0.5rem;
  transition: all 0.15s;
  color: #b0caf0;
}
.audio-icon:hover {
  background: #1f3b52;
  transform: scale(1.05);
}
.detective-footer {
  background: rgba(0, 0, 0, 0.35);
  border-radius: 40px;
  padding: 0.6rem 1rem;
  font-size: 0.75rem;
  text-align: center;
  color: #bdd0e8;
  border: 0.5px solid #2f4b6e;
}
.footer-icon {
  margin-right: 6px;
}

/* Адаптив для мобильных */
@media (max-width: 640px) {
  .detective-verbs-modern {
    padding: 0.75rem;
    border-radius: 16px;
  }
  .case-header h1 {
    font-size: 1.3rem;
  }
  .verbs-table th, .verbs-table td {
    padding: 0.5rem 0.35rem;
    font-size: 0.7rem;
  }
  .pronoun {
    min-width: 70px;
    font-size: 0.75rem;
  }
  .example-item {
    font-size: 0.75rem;
    gap: 0.5rem;
  }
  .examples-list {
    max-height: 240px;
  }
  .modal-content {
    padding: 1.5rem;
  }
  .modal-content h2 {
    font-size: 1.2rem;
  }
}
</style>
