<script setup>
import { ref } from 'vue';

// Audio handling
const playAudio = (audioSrc) => {
  const audio = new Audio(audioSrc);
  audio.play().catch(e => console.error("Audio playback failed:", e));
};

// Data structure for the chart
const vowels = {
  monophthongs: [
    { symbol: 'i:', word: 'sleep', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/1.-iː-sleep-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/1.-iː-sleep-2.m4a' },
    { symbol: 'ɪ', word: 'slip', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/1.-slip-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/1.-slip-2.m4a' },
    { symbol: 'ʊ', word: 'good', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/3.-good-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/3.-good-2.m4a' },
    { symbol: 'u:', word: 'food', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/4.-food-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/4.-food-2-1.m4a' },
    { symbol: 'e', word: 'ten', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/5.-ten-1-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/5.-ten-2-1.m4a' },
    { symbol: 'ə', word: 'better', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/6.-better-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/6.-better-2.m4a' },
    { symbol: 'ɜ:', word: 'word', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/7.-word-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/7.-word-2.m4a' },
    { symbol: 'ɔ:', word: 'more', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/8.-more-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/8.-more-2.m4a' },
    { symbol: 'æ', word: 'tap', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/9.-tap-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/9.-tap-2.m4a' },
    { symbol: 'ʌ', word: 'cup', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/10.-cup-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/10.-cup-2.m4a' },
    { symbol: 'ɑ:', word: 'bar', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/11.-bar-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/11.-bar-2.m4a' },
    { symbol: 'ɒ', word: 'gone', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/12.-gone-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/12.-gone-2.m4a' }
  ],
  diphthongs: [
    { symbol: 'ɪə', word: 'hear', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/13.-hear-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/13.-hear-2.m4a' },
    { symbol: 'eɪ', word: 'game', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/14.-game-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/14.-game-2.m4a' },
    { symbol: 'ʊə', word: 'pure', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/15.-pure-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/15.-pure-2.m4a' },
    { symbol: 'ɔɪ', word: 'toy', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/16.-toy-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/16.-toy-2.m4a' },
    { symbol: 'əʊ', word: 'no', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/17.-no-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/17.-no-2.m4a' },
    { symbol: 'eə', word: 'where', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/18.-where-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/18.-where-2.m4a' },
    { symbol: 'aɪ', word: 'mine', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/19.-mine-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/19.-mine-2.m4a' },
    { symbol: 'aʊ', word: 'how', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/20.-how-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/20.-how-2.m4a' }
  ]
};

const consonants = [
  { symbol: 'p', word: 'pen', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/21.-pen-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/21.-pen-2.m4a' },
  { symbol: 'f', word: 'fig', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/22.-fig-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/22.-fig-2.m4a' },
  { symbol: 't', word: 'tip', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/23.-tip-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/23.-tip-2.m4a' },
  { symbol: 'θ', word: 'thought', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/24.-thought-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/24.-thought-2.m4a' },
  { symbol: 'ʧ', word: 'chip', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/25.-chip-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/25.-chip-2.m4a' },
  { symbol: 's', word: 'save', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/26.-save-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/26.-save-2.m4a' },
  { symbol: 'ʃ', word: 'sure', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/27.-sure-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/27.-sure-2.m4a' },
  { symbol: 'k', word: 'cat', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/28.-cat-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/28.-cat-2.m4a' },
  { symbol: 'b', word: 'bit', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/29.-bit-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/29.-bit-2.m4a' },
  { symbol: 'v', word: 'vase', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/30.-vase-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/30.-vase-2.m4a' },
  { symbol: 'd', word: 'done', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/31.-done-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/31.-done-2.m4a' },
  { symbol: 'ð', word: 'those', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/32.-those-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/32.-those-2.m4a' },
  { symbol: 'ʤ', word: 'jam', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/33.-jam-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/33.-jam-2.m4a' },
  { symbol: 'z', word: 'zoo', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/34.-zoo-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/34.-zoo-2.m4a' },
  { symbol: 'ʒ', word: 'vision', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/35.-vision-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/35.-vision-2.m4a' },
  { symbol: 'g', word: 'goal', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/36.-goal-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/36.-goal-2.m4a' },
  { symbol: 'h', word: 'him', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/37.-him-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/37.-him-2.m4a' },
  { symbol: 'm', word: 'may', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/38.-may-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/38.-may-2.m4a' },
  { symbol: 'n', word: 'not', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/39.-not-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/39.-not-2.m4a' },
  { symbol: 'ŋ', word: 'sing', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/40.-sing-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/40.-sing-2.m4a' },
  { symbol: 'r', word: 'reach', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/41.-reach-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/41.-reach-2.m4a' },
  { symbol: 'l', word: 'lie', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/42-lie-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/42-lie-2.m4a' },
  { symbol: 'w', word: 'will', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/43.-will-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/43.-will-2.m4a' },
  { symbol: 'j', word: 'yet', symbolAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/44.-yet-1.m4a', wordAudio: 'https://englishwithlucy.com/wp-content/uploads/2020/10/44.-yet-2.m4a' }
];
</script>


<script>
export default {
  data() {
    return {
      // ... остальные данные ...
      monophthongExamples: [
        { symbol: 'i:', words: ['Me', 'see', 'need', 'be', 'leave'] },
        { symbol: 'ɜ:', words: ['Earn', 'learn', 'turn', 'yearn', 'churn'] },
        { symbol: 'I', words: ['Pit', 'sit', 'with', 'this', 'wink'] },
        { symbol: 'ɔ:', words: ['Oar', 'or', 'floor', 'bore', 'chore'] },
        { symbol: 'ʊ', words: ['Foot', 'cook', 'look', 'book', 'hook'] },
        { symbol: 'æ', words: ['Map', 'cat', 'bad', 'pack', 'sand'] },
        { symbol: 'u:', words: ['To', 'new', 'you', 'shoe', 'cool'] },
        { symbol: 'ʌ', words: ['Mud', 'bus', 'shut', 'but', 'up'] },
        { symbol: 'e', words: ['When', 'men', 'said', 'leg', 'hen', 'head'] },
        { symbol: 'ɑ:', words: ['Palm', 'calm', 'cart', 'smart', 'start'] },
        { symbol: 'ə', words: ['Letter', 'power', 'flower', 'tower', 'shower'] },
        { symbol: 'ɒ', words: ['Lot', 'cot', 'dot', 'pot', 'on'] }
      ],
      diphthongExamples: [
        { symbol: 'ɪə', words: ['Ear', 'cheer', 'year', 'deer', 'fear'] },
        { symbol: 'əʊ', words: ['Go', 'bow', 'sew', 'so', 'flow'] },
        { symbol: 'eɪ', words: ['Say', 'pray', 'day', 'way', 'stray'] },
        { symbol: 'eə', words: ['Air', 'chair', 'rare', 'bare', 'there'] },
        { symbol: 'ʊə', words: ['Tour', 'sure', 'cure'] },
        { symbol: 'aɪ', words: ['I', 'eye', 'pie', 'fight', 'fright'] },
        { symbol: 'ɔɪ', words: ['Oil', 'coin', 'boy', 'voice', 'boil'] },
        { symbol: 'aʊ', words: ['Owl', 'out', 'count', 'bow', 'cowl'] }
      ],
      consonantExamples: [
        { symbol: 'p', words: ['Pay', 'happy', 'pet'] },
        { symbol: 'ʧ', words: ['Choke', 'watch', 'catch'] },
        { symbol: 'b', words: ['Best', 'trouble', 'tub'] },
        { symbol: 'f', words: ['Fine', 'offer', 'off'] },
        { symbol: 's', words: ['Miss', 'face', 'snake'] },
        { symbol: 'v', words: ['Vine', 'of', 'save'] },
        { symbol: 't', words: ['Mat', 'tile', 'flat'] },
        { symbol: 'ʃ', words: ['Show', 'push', 'rush'] },
        { symbol: 'd', words: ['Dip', 'sad', 'mad'] },
        { symbol: 'θ', words: ['Thin', 'both', 'method'] },
        { symbol: 'k', words: ['Cat', 'back', 'talk'] },
        { symbol: 'ð', words: ['With', 'then', 'other'] },
        { symbol: 'ʤ', words: ['Joke', 'June', 'large'] },
        { symbol: 'g', words: ['Game', 'bag', 'big'] },
        { symbol: 'n', words: ['Nail', 'fun', 'nine'] },
        { symbol: 'z', words: ['Crazy', 'lazy', 'phase'] },
        { symbol: 'h', words: ['He', 'heal', 'hill'] },
        { symbol: 'ŋ', words: ['Sing', 'fling', 'wing'] },
        { symbol: 'ʒ', words: ['Measured', 'treasure', 'pleasure'] },
        { symbol: 'm', words: ['Some', 'mail', 'mum'] },
        { symbol: 'r', words: ['Real', 'courage', 'umbrella'] },
        { symbol: 'l', words: ['Love', 'like', 'follow'] },
        { symbol: 'w', words: ['We', 'show', 'wheel'] },
        { symbol: 'j', words: ['You', 'beyond', 'yacht'] }
      ]
    }
  }
}
</script>
<template>
  <div class="phonemic-chart-container">
    <div class="header">

      <h1>фоу`нЭмик <strong>чарт </strong> 🕵️‍♀️🕵️‍♂️🕵🏻🕵🏿 чёрт её подери! </h1>
      <p class="detective-title">🔍 Фонематическая <strong>таблица :</strong> Раскройте тайны английского произношения!</p>

      <p>Нажимай на звуки или на слова, чтобы услышать произношение.</p>
      <p>Повторяй вслух, будь настоящим британским детективом!</p>
    </div>

    <!-- Vowels Section -->
    <div class="chart-section">
      <h2 class="section-title">Vowels - гласные</h2>

      <div class="vowels-container">
        <!-- Monophthongs -->
        <div class="vowels-column">
          <h3 class="vowels-title">Monophthongs</h3>
          <div class="sound-grid">
            <div class="sound-box monophthong"
                 v-for="(sound, index) in vowels.monophthongs"
                 :key="'mono-' + index"
                 @click="playAudio(sound.symbolAudio)"
            >
              <div class="symbol">{{ sound.symbol }}</div>
              <div class="word" @click.stop="playAudio(sound.wordAudio)">{{ sound.word }}</div>
            </div>
          </div>
        </div>

        <!-- Diphthongs -->
        <div class="vowels-column">
          <h3 class="vowels-title">Diphthongs</h3>
          <div class="sound-grid">
            <div class="sound-box diphthong"
                 v-for="(sound, index) in vowels.diphthongs"
                 :key="'diph-' + index"
                 @click="playAudio(sound.symbolAudio)"
            >
              <div class="symbol">{{ sound.symbol }}</div>
              <div class="word" @click.stop="playAudio(sound.wordAudio)">{{ sound.word }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Consonants Section -->
    <div class="chart-section">
      <h2 class="section-title">Consonants - согласные</h2>
      <div class="sound-grid consonants-grid">
        <div class="sound-box consonant"
             v-for="(sound, index) in consonants"
             :key="'consonant-' + index"
             @click="playAudio(sound.symbolAudio)"
        >
          <div class="symbol">{{ sound.symbol }}</div>
          <div class="word" @click.stop="playAudio(sound.wordAudio)">{{ sound.word }}</div>
        </div>
      </div>
    </div>

    <!-- Новый раздел с детективной подачей -->
    <div class="detective-section">
      <div class="detective-content">

        <div class="detective-block">
          <p>Хотите говорить по-английски так, чтобы ни у кого не было сомнений, что он вам не родной?</p>
          <p>Пусть вашему произношению завидует сам Бенедикт Кумбербекович ;) S.P.E.C.I.A.L  <strong> интерактивный IPA-алфавит</strong> — именно то, что вам нужно!</p>
        </div>

        <div class="detective-block detective-important">
          <h3>Что такое IPA-алфавит и как он улучшит вашу речь?</h3>
          <p><strong>IPA (International Phonetic Alphabet)</strong> — это международный фонетический алфавит, созданный в XIX веке на основе латиницы. Он содержит <strong>уникальные символы</strong>, каждый из которых соответствует определенному звуку в английском языке.</p>
          <p>🔍 <strong>Почему это важно?</strong> Английский славится коварными исключениями в произношении. Например:</p>
          <ul>
            <li>Слово <strong>"bought"</strong> выглядит так, будто должно читаться как <strong>"боут"</strong>, но на самом деле звучит как <strong>"бот"</strong>!</li>
          </ul>
          <p>IPA-алфавит помогает <strong>раскрыть этот шифр</strong> и понять, как произносить слова правильно.</p>
        </div>

        <div class="detective-block">
          <h3>Структура IPA-алфавита: Гласные vs. Согласные</h3>
          <p>Как настоящий детектив, вы должны знать, с чем имеете дело:</p>
          <div class="structure-grid">
            <div class="structure-item">
              <h4>🔹 Гласные (Vowels)</h4>
              <p><strong>Монофтонги</strong> - звуки, которые не меняются (sleep, slip)</p>
              <p><strong>Дифтонги</strong> - "двойные агенты", два гласных в одном (coin, loud)</p>
            </div>
            <div class="structure-item">
              <h4>🔹 Согласные (Consonants)</h4>
              <p>24 символа - каждый отвечает за четкий звук</p>
            </div>
          </div>
        </div>

        <div class="detective-callout">
          <p>Готовы к расследованию? 🔍 Отправьте <strong>голосовое сообщение </strong> Винсенту: <br><p>"ˈhaʊdi, ˈvɪnsənt!
            aɪ æm praʊd tuː biː ə ˈspɛʃəl ˈeɪʤənt!"</p></p>
          <p><strong> "Howdy, Vincent! <br> I am proud to be a special agent!"</strong></p>
        </div>

      </div>
    </div>
  </div>

  <!-- Дополнительные примеры звуков -->
  <div class="examples-section">
    <div class="examples-container">
      <!-- Monophthongs Examples -->
      <div class="examples-block">
        <h3 class="examples-title">Monophthongs Examples</h3>
        <div class="examples-grid">
          <div v-for="(example, index) in monophthongExamples" :key="'mono-ex-'+index" class="example-item">
            <div class="example-symbol">{{ example.symbol }}</div>
            <div class="example-words">
              <span v-for="(word, wordIndex) in example.words" :key="'mono-word-'+wordIndex">
                {{ word }}<span v-if="wordIndex < example.words.length - 1">, </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Diphthongs Examples -->
      <div class="examples-block">
        <h3 class="examples-title">Diphthongs Examples</h3>
        <div class="examples-grid">
          <div v-for="(example, index) in diphthongExamples" :key="'diph-ex-'+index" class="example-item">
            <div class="example-symbol">{{ example.symbol }}</div>
            <div class="example-words">
              <span v-for="(word, wordIndex) in example.words" :key="'diph-word-'+wordIndex">
                {{ word }}<span v-if="wordIndex < example.words.length - 1">, </span>
              </span>
            </div>
          </div>
        </div>
        <p class="practice-tip">Гланый совет - терпение и труд - язык в порошок НЕ сотрут! <br>
          Все у вас получится, нужно лишь больше говорить вслух, <br>произносить всё вслух и наслаждаться процессом. <strong>You are special !</strong></p>
      </div>

      <!-- Consonants Examples -->
      <div class="examples-block">
        <h3 class="examples-title">Consonants Examples</h3>
        <div class="examples-grid consonant-examples">
          <div v-for="(example, index) in consonantExamples" :key="'cons-ex-'+index" class="example-item">
            <div class="example-symbol">{{ example.symbol }}</div>
            <div class="example-words">
              <span v-for="(word, wordIndex) in example.words" :key="'cons-word-'+wordIndex">
                {{ word }}<span v-if="wordIndex < example.words.length - 1">, </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.phonemic-chart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
  color: #333;

  .header {
    text-align: center;
    margin-bottom: 40px;

    h1 {
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 15px;
    }

    p {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #555;
    }
  }

  .chart-section {
    margin-bottom: 40px;

    .section-title {
      font-size: 1.8rem;
      color: #2c3e50;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
  }

  .vowels-container {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    margin-bottom: 30px;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .vowels-column {
    flex: 1;
    min-width: 300px;

    .vowels-title {
      font-size: 1.4rem;
      color: #3498db;
      margin-bottom: 15px;
      text-align: center;
    }
  }

  .sound-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;

    &.consonants-grid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
  }

  .sound-box {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 15px 10px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);

    &.monophthong {
      background-color: #e6f2ff;  /* Пастельно-голубой */
    }

    &.diphthong {
      background-color: #e8f8f5;  /* Пастельно-зеленый */
    }

    &.consonant {
      background-color: #fef5e7;  /* Пастельно-оранжевый */
    }

    &:hover {
      /* Общие стили hover */
      &.monophthong:hover {
        background-color: #d6e6ff;
      }

      &.diphthong:hover {
        background-color: #d4f1eb;
      }

      &.consonant:hover {
        background-color: #fcebd5;
      }
    }

    .symbol {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 8px;
      color: #2c3e50;
    }

    .word {
      font-size: 0.9rem;
      color: #555;
      padding: 5px;
      border-radius: 4px;
      background-color: rgba(255,255,255,0.7);

      &:hover {
        background-color: #e3f2fd;
        color: #1976d2;
      }
    }
  }

  .footer-note {
    margin-top: 40px;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    font-size: 0.95rem;
    line-height: 1.6;
    color: #555;

    a {
      color: #3498db;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
.detective-section {
  margin: 50px 0;
  padding: 30px;
  background-color: #f5f7fa;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #3498db;

  .detective-content {
    margin: 0 auto;
  }

  .detective-title {
    font-size: 1.8rem;
    color: #2c3e50;
    margin-bottom: 25px;
    text-align: center;
    position: relative;

    &::before, &::after {
      content: "•";
      color: #3498db;
      margin: 0 15px;
    }
  }

  .detective-block {
    margin-bottom: 30px;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    h3 {
      color: #2c3e50;
      margin-bottom: 15px;
      font-size: 1.3rem;
      border-bottom: 1px dashed #eee;
      padding-bottom: 10px;
    }

    p, li {
      line-height: 1.7;
      color: #444;
    }

    ul {
      padding-left: 20px;
      margin: 15px 0;
    }

    li {
      margin-bottom: 8px;
    }
  }

  .detective-important {
    border-left: 3px solid #3ce748;

    background-color: #fff9f9;
  }

  .structure-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;

    .structure-item {
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 6px;

      h4 {
        color: #3498db;
        margin-bottom: 10px;
        font-size: 1.1rem;
      }

      p {
        margin-bottom: 8px;
        font-size: 0.95rem;
      }
    }
  }

  .detective-callout {
    text-align: center;
    padding: 25px;
    background-color: #2c3e50;
    color: white;
    border-radius: 8px;
    margin-top: 30px;

    p {
      font-size: 1.1rem;
      margin-bottom: 10px;
      line-height: 1.6;

      &:last-child {
        font-size: 1.3rem;
        font-weight: bold;
        color: #f1c40f;
      }
    }
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .detective-section {
    padding: 20px 15px;

    .detective-title {
      font-size: 1.5rem;
    }

    .structure-grid {
      grid-template-columns: 1fr;
    }
  }
}


.examples-section {
  margin: 50px 0 30px;
  padding: 0 20px;
}

.examples-container {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.examples-block {
  margin-bottom: 40px;

  &:last-child {
    margin-bottom: 0;
  }
}

.examples-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
}

.section-note {
  font-style: italic;
  color: #555;
  margin-bottom: 20px;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;

  &.consonant-examples {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

.example-item {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-3px);
  }
}

.example-symbol {
  font-weight: bold;
  font-size: 1.2rem;
  color: #3498db;
  margin-bottom: 8px;
}

.example-words {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #555;
}

.practice-tip {
  margin-top: 25px;
  padding: 15px;
  background-color: #e3f2fd;
  border-radius: 8px;
  color: #1976d2;
  font-weight: 500;
  text-align: center;
  font-style: italic;
}

@media (max-width: 768px) {
  .examples-grid {
    grid-template-columns: 1fr;
  }

  .examples-container {
    padding: 20px;
  }
}
</style>
