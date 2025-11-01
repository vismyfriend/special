


<template>
  <!-- Примеры с полным управлением позицией хвостика -->
  <!--  <p class="chat-bubble" data-tail="top" style="&#45;&#45;tail-x: 70%; &#45;&#45;tail-y: 20%">-->
  <!--    Хвостик сверху<br>смещён вправо и вниз-->
  <!--  </p>-->

  <!--  <p class="chat-bubble" data-tail="bottom" style="&#45;&#45;tail-x: 30%; &#45;&#45;tail-y: -10%">-->
  <!--    Хвостик снизу<br>смещён влево и чуть выше-->
  <!--  </p>  -->
  <div class="bubble-wrapper">
    <p
      class="chat-bubble"
      data-tail="bottom"
      style="--tail-x: 50%; --tail-y: 40%"
      @click="handleBubbleClick"
    >
      <span v-if="infoMessage" v-html="dynamicMessage"></span>
      <span v-else>
        <span class="counter-value">{{ currentTapSymbol }} {{ formattedCounter }}</span>
        <span class="text-value" :class="{ blurred: !showTextInstead && !initialShowText }">
          {{ textVersion }}
        </span>
      </span>
    </p>
  </div>

  <!--  <p class="chat-bubble" data-tail="left" style="&#45;&#45;tail-x: -10%; &#45;&#45;tail-y: 80%">-->
  <!--    Хвостик слева<br>смещён вниз и чуть левее-->
  <!--  </p>-->

  <!--  <p class="chat-bubble" data-tail="right" style="&#45;&#45;tail-x: 10%; &#45;&#45;tail-y: 20%">-->
  <!--    Хвостик справа<br>смещён вверх и чуть правее-->
  <!--  </p>-->

  <!-- Контейнер с картинкой -->
  <div class="image-container">
<!--    <img src="../assets/images/ButtonGreenLady.png" alt="greenButton" class="custom-image">-->
<!--    <img src="../assets/images/lightBulbGirl.png" alt="greenButton" class="custom-image">-->
    <img src="../assets/images/Character6.png" alt="greenButton" class="custom-image">
<!--    <img src="../assets/images/whereToClick.png" alt="greenButton" class="custom-image">-->





    <button
      id="tap-button"
      @click="handleTap"
      @touchstart="handleTap"
      ref="buttonRef"
      class="positioned-button"

    >Cliсk here</button>
    <!--    <div class="counter">Вы увидели: <span>{{ counter }}</span></div>-->

    <Teleport to="body">
      <div
        v-for="word in flyingWords"
        :key="word.id"
        class="flying-word"
        :style="word.style"
      >
        {{ word.text }}
      </div>
    </Teleport>


  </div>
  <q-btn
    align="between"
    class="q-mb-sm zoomIn padding-left-right shining pulsing-a-bit"
    :color="buttonColor"
    :label="buttonLabel"
    icon-right="touch_app"
    @click="backToIntroPage"
    style="position: relative; overflow: hidden;"

  />
  <div
    v-if="showOverlay"
    class="overlay"
  ></div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import shortWordsData from '../dataForGames/short-words-data';

import { useRouter } from 'vue-router';
import questionsData from "src/dataForGames/questions-data";

const router = useRouter();


// Объявляем переменные
// const currentTapSymbol = '⚡'; // Здесь можно менять символ
const currentTapSymbol = '🎃'; // Здесь можно менять символ
const counter = ref(0);
const sessionStartCounter = ref(0);
const sessionCounter = computed(() => counter.value - sessionStartCounter.value);
const initialShowText = ref(true); // Новый флаг для первоначального отображения текста

const buttonLabel = computed(() => {
  return sessionCounter.value >= 20
    ? "Super! Разминка окончена, жми сюда"
    : "Что дальше ? Куда нажимать ?";
});

const buttonColor = computed(() => {
  return sessionCounter.value >= 23
    ? "blue"
    : "green";
});

const dynamicMessage = computed(() => {
  const remaining = 20 - sessionCounter.value;
  if (remaining <= 0) {
    return `Разминка мозгов и языка:<br><br>
    1) Молодчина! Хорошая практика.<br>
    2) <b>число со знаком ${currentTapSymbol}</b> можно нажать<br>
    и проверить правильно ли вы его произнесли<br>
    `;
  } else {
    return `Разомни память и произношение<br> <b>pronunciation </b> / пронАн си эйшн /<br>
<br><br>
    1) нажми "Tap here" ${remaining} times - раз(а)<br>
    2) <b>читай вслух</b> вылетающие слова<br>
    `;
  }
});

const backToIntroPage = () => {
  if (sessionCounter.value >= 20) {
    handleBubbleClick();
    // Задержка перед переходом
    setTimeout(() => {
      router.push("/see-all-sets-of-words/");
    }, 500); // пол секунды – чтобы успело показаться сообщение
  } else {
    infoMessage.value = dynamicMessage.value;
    showOverlay.value = true;

    setTimeout(() => {
      // showOverlay.value = false;
      infoMessage.value = '';
    }, 7000);
  }
};

const formattedCounter = computed(() =>
  new Intl.NumberFormat('en-US').format(counter.value)
);
const flyingWords = ref([]);
const buttonRef = ref(null);


const infoMessage = ref('');
const showOverlay = ref(true);


// Настройки анимации
const animationSettings = {
  minDistance: 200,
  maxDistance: 350,
  minAngle: 20,
  maxAngle: 160,
  minDuration: 1300,
  maxDuration: 1900,
  fadeStart: 0.8
};

function numberToWords(num) {
  if (num === 0) return "Zero";

  const belowTwenty = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];
  const thousands = ["", "Thousand", "Million", "Billion"];

  function helper(n) {
    if (n === 0) return "";
    else if (n < 20) return belowTwenty[n] + " ";
    else if (n < 100) return tens[Math.floor(n / 10)] + " " + helper(n % 10);
    else return belowTwenty[Math.floor(n / 100)] + " Hundred " + helper(n % 100);
  }

  let i = 0;
  const parts = [];

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk !== 0) {
      let chunkText = helper(chunk).trim();
      if (thousands[i]) {
        chunkText += " " + thousands[i];
      }
      parts.unshift(chunkText.trim());
    }
    num = Math.floor(num / 1000);
    i++;
  }

  // Добавляем запятые между крупными блоками (кроме последнего)
  for (let j = 0; j < parts.length - 1; j++) {
    if (
      parts[j].match(/\b(Thousand|Million|Billion)$/)
    ) {
      parts[j] += ",";
    }
  }

  return parts.join(" ").replace(/\s+/g, ' ').trim();
}

const showTextInstead = ref(false);
const textVersion = computed(() => numberToWords(counter.value));

const handleBubbleClick = () => {
  showTextInstead.value = true;
  setTimeout(() => {
    showTextInstead.value = false;
  }, 6000); // показываем текст на 6 секунд
};
// Собираем все английские слова
// const welcomeWords = ["S","P","E","C","i","A","L","Special","agent","!!!","Hello","from","Vincent","He", "is", "your", "friend","#vismyfriend",];
// const welcomeWords = ["S","P","E","C","i","A","L","Vincent","#vismyfriend"];
// const welcomeWords = ["ща","я","как","начну","читать","по-","английски","вслух","погнали","vincent"];
// const welcomeWords = ["Oh","my","God","скоро","же","Halloween","хЭл","ОУ","Уин","HALLOWEEN","Vinccenteen",];
const welcomeWords = ["Oй","как","холодно!","it's","so cold","why?","Vincent","help me","please!","S.P.E.C.I.A.L.",];


const allEnglishWords = [
  "Good Job", "Great", "Tap again","hamster",
  "apple", "banana", "cherry", "date", "elderberry",
  ...shortWordsData.devModeNumbersFast.map(item => item.eng),
  ...shortWordsData.devModeNumbers.map(item => item.eng),
  ...shortWordsData.devmode1.map(item => item.eng),
  ...shortWordsData.digits.map(item => item.eng),
  ...shortWordsData.irregularVerbsB1.map(item => item.eng),
  ...shortWordsData.halloween01.map(item => item.eng),
  ...shortWordsData.introTapButtonWords.map(item => item.eng),
  ...questionsData.clothes.map(item => item.eng),
  ...questionsData.randomSet.map(item => item.eng),
  ...questionsData.popularIrregularVerbs.map(item => item.eng),
  ...questionsData.a1words.map(item => item.eng),

];
const uniqueEnglishWords = [...new Set(allEnglishWords)];

// Загрузка и сохранение счётчика
const loadCounter = () => {
  const saved = localStorage.getItem('tapCounter');
  counter.value = saved ? parseInt(saved) : 0;
};

const saveCounter = () => {
  localStorage.setItem('tapCounter', counter.value.toString());
};

// Предотвращение зума
const preventZoom = (e) => {
  if (e.touches && e.touches.length > 1) {
    e.preventDefault();
    e.stopPropagation();
  }
};
const userLocalStorageName = ref('');

// Инициализация при монтировании
onMounted(() => {
  loadCounter();
  userLocalStorageName.value = localStorage.getItem('agentName') || 'nonameYet';
console.log("Name in local storage : " + userLocalStorageName.value);
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
  document.head.appendChild(meta);

  document.addEventListener('dblclick', preventZoom);
  document.addEventListener('touchstart', preventZoom, { passive: false });

  // Запоминаем стартовое значение на момент загрузки
  sessionStartCounter.value = counter.value;


  // Через 10 секунд скрываем текст
  setTimeout(() => {
    initialShowText.value = false;
  }, 10000);
});
const shownWelcomeWords = ref(0);
// Обработчик клика

const handleTap = (e) => {
  if (e.type === 'touchstart') e.preventDefault();

  counter.value++;
  saveCounter();


  // Выбираем слово - сначала из welcomeWords, потом из общего списка
  let text;
  if (shownWelcomeWords.value < welcomeWords.length) {
    text = welcomeWords[shownWelcomeWords.value];
    shownWelcomeWords.value++;
  } else {
    text = uniqueEnglishWords[Math.floor(Math.random() * uniqueEnglishWords.length)].toLowerCase();
  }

  const duration = animationSettings.minDuration +
    Math.random() * (animationSettings.maxDuration - animationSettings.minDuration);

  const angle = animationSettings.minAngle +
    Math.random() * (animationSettings.maxAngle - animationSettings.minAngle);

  const distance = animationSettings.minDistance +
    Math.random() * (animationSettings.maxDistance - animationSettings.minDistance);

  const angleRad = angle * Math.PI / 180;
  const offsetX = Math.cos(angleRad) * distance;
  const offsetY = -Math.sin(angleRad) * distance;

  const button = buttonRef.value;
  const rect = button.getBoundingClientRect();

  const word = {
    id: Date.now() + Math.random(),
    text,
    duration,
    style: {
      position: 'fixed',
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.top + rect.height / 2}px`,
      transform: `translate(-50%, -50%)`,
      animation: `fly-word ${duration}ms ease-out forwards`,
      '--offsetX': `${offsetX}px`,
      '--offsetY': `${offsetY}px`,
      '--fadeStart': `${animationSettings.fadeStart}`,
    }
  };

  flyingWords.value.push(word);
  setTimeout(() => flyingWords.value = flyingWords.value.filter(w => w.id !== word.id), duration);

  button.classList.add('button-tap');
  button.classList.add('text-shrink');

  setTimeout(() => {
    button.classList.remove('button-tap');
    button.classList.remove('text-shrink');
  }, 200);
};


</script>

<style>
/* Глобальные стили */
html {
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.flying-word {
  position: fixed;
  font-size: 35px;
  font-weight: bold;
  //text-shadow:
  //  0 0 1px #fff,
  //  0 0 10px #ffc73b,
  //  0 0 10px #000000,
  //  0 0 15px #ffc20d;
  //color: #ffea00;
  text-shadow:
    0 0 1px #fff,
    0 0 10px #3bf8ff,
    0 0 10px #000000,
    0 0 15px #0debff;
  color: #ffffff;
  /* color: #333; */
  pointer-events: none;
  z-index: 9999;
  white-space: nowrap;
  opacity: 1;
  transform: translate(-50%, -50%);
  animation: fly-word var(--duration) ease-out forwards;
}

@keyframes fly-word {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
calc(var(--fadeStart) * 100%) {
  opacity: 1;
}
100% {
  transform: translate(
    calc(-50% + var(--offsetX)),
    calc(-50% + var(--offsetY))
  ) scale(1.2);
  opacity: 0;
}
}
</style>

<style scoped>
.game-container {
  font-family: 'Neucha', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  //background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  width: 300px;
  margin: 100px auto;
  touch-action: manipulation;
}

#tap-button {
  background-color: rgba(76, 175, 80, 0);
  color: #f4f4f4;
  border: none;
  border-radius: 50%;
  font-size: 30px;
  font-weight: bold;
  width: 215px;
  height: 215px;
  cursor: none;
  margin: 20px 0;
  padding: 50px;
  transition: transform 0.1s, opacity 0.1s;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  font-family: Special_f1, sans-serif;
  line-height: 35px;
}


.counter {
  font-size: 18px;
  margin-top: 10px;
}

.bubble-wrapper {
  position: relative; /* точка отсчета для абсолютного позиционирования */
}


.chat-bubble {

  /* Настраиваемые переменные */
  --bubble-color: white;
  --border-color: black;
  --border-width: 3px;
  --tail-width: 20px;
  --tail-length: 20px;
  --tail-x: 50%; /* Горизонтальное смещение (50% - центр) */
  --tail-y: 0%;  /* Вертикальное смещение (0% - край пузыря) */




  position: absolute; /* absolute - тогда отключаем влияние на поток документа */

  top: 0; /* можно настраивать */
  left: 50%;
  transform: translateX(-50%);
  z-index: 20; /* поверх других элементов */

  width: 330px;
  /* pointer-events: auto; */

  display: inline-block;
  padding: 30px 5px;
  border-radius: 45px;
  border: var(--border-width) solid var(--border-color);
  background: var(--bubble-color);
  /* font-family: 'Neucha', sans-serif; */
  font-size: 17px;
  text-align: center;
  margin-top: 20px;

  &::after {
    content: '';
    position: absolute;
    width: var(--tail-width);
    height: var(--tail-length);
    background: var(--bubble-color);
    border: var(--border-width) solid var(--border-color);
    box-sizing: border-box;
  }

  /* Хвостик сверху */
  &[data-tail="top"] {
    margin-top: calc(var(--tail-length) + 10px);

    &::after {
      top: calc(-1 * var(--tail-length));
      left: var(--tail-x);
      transform:
        translateX(-50%)
        translateY(var(--tail-y))
        rotate(135deg);
      border-bottom: none;
      border-left: none;
    }
  }

  /* Хвостик снизу */
  &[data-tail="bottom"] {
    margin-bottom: calc(var(--tail-length) + 10px);

    &::after {
      bottom: calc(-1 * var(--tail-length));
      left: var(--tail-x);
      transform:
        translateX(-50%)
        translateY(calc(-1 * var(--tail-y)))
        rotate(-45deg);
      border-top: none;
      border-right: none;
    }
  }

  /* Хвостик слева */
  &[data-tail="left"] {
    margin-left: calc(var(--tail-length) + 10px);

    &::after {
      left: calc(-1 * var(--tail-length));
      top: var(--tail-y);
      transform:
        translateY(-50%)
        translateX(var(--tail-x))
        rotate(-135deg);
      border-right: none;
      border-top: none;
    }
  }

  /* Хвостик справа */
  &[data-tail="right"] {
    margin-right: calc(var(--tail-length) + 10px);

    &::after {
      right: calc(-1 * var(--tail-length));
      top: var(--tail-y);
      transform:
        translateY(-50%)
        translateX(calc(-1 * var(--tail-x)))
        rotate(45deg);
      border-left: none;
      border-bottom: none;
    }
  }
}

.image-container {
  position: relative;
  width: 100%;
  max-width: 400px; /* подгони под нужный размер */
  margin: 140px 0 auto auto; /* подгони под нужный размер */
  z-index: 6;
}

.custom-image {
  width: 100%;
  display: block;
  border-radius: 20px;

}

.counter-value {
  display: block;
  font-size: 1.2em;
  margin-bottom: 8px;
}

.text-value {
  display: block;
  transition: all 0.3s ease;
  position: relative;
  padding-top: 8px;
}

.text-value::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 1px;
  background: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%);
}

.text-value.blurred {
  filter: blur(3px);
  opacity: 0.5;
  cursor: pointer;
}
/* Кнопка, позиционируемая поверх картинки */
.positioned-button {
  position: absolute;
  top: 60%; /* подстрой вручную */
  left: 50%;
  transform: translate(-50%, -50%);
  //background-color: #4CAF50;
  color: white;
  font-family: 'Neucha', sans-serif;

  border: none;
  border-radius: 50%;
  font-size: 24px;
  width: 100px;
  height: 100px;
  cursor: none;
  transition: transform 0.1s, opacity 0.1s;
  z-index: 10;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.text-shrink {
  font-size: 24px !important; /* уменьшаем на 3px от 24px */
  transition: font-size 0.2s ease;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* полупрозрачный чёрный */
  z-index: 5;
}
.q-mb-sm {
  cursor: none;
  z-index: 6;
}
/* Добавьте это в ваш файл стилей */
.shining {
  position: relative;
  overflow: hidden;
}

.shining::before {
  content: "";
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-20deg);
  opacity: 0.7;
  pointer-events: none;
  animation: shine 3s infinite ease-in-out;
}

@keyframes shine {
  0% {
    left: -75%;
  }
  50% {
    left: 125%;
  }
  100% {
    left: -75%;
  }
}
.pulsing-a-bit {
  animation: pulse 2s infinite ease-in-out;

}
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03); /* можно увеличить до 1.05, если хочется активнее */
  }
}
</style>
