<template>
  <div class="game-wrapper" :style="{ backgroundImage: 'url(/background.jpg)' }">
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: progressWidth }"></div>
      <div class="progress-text" v-if="matchedPairs > 0">{{ progressPercentage }}%</div>
    </div>

<!--    <div class="shift-button" @click="shiftCards">↻ Показать другие</div>-->

    <div class="row" v-if="currentGameData">
      <div class="col">
        <div
          class="wordCard"
          :class="[
  engWord.active ? 'active' : '',
  !engWord.visible ? 'faded' : '',
  engWord.pulse ? 'pulse-once' : '',
  engWord.pulseWrong ? 'pulse-wrong' : ''
]"
          v-for="engWord in engCards"
          :key="engWord.id"
          @click="changeActive(engWord.id, 'left')"
        >
          <div>
            <div>{{ engWord.lang }}</div>
            <div v-if="engWord.hint" class="hint">{{ engWord.hint }}</div>
          </div>
        </div>
      </div>
      <div class="col">
        <div
          class="wordCard"
          :class="[
  ruWord.active ? 'active' : '',
  !ruWord.visible ? 'faded' : '',
  ruWord.pulse ? 'pulse-once' : '',
  ruWord.pulseWrong ? 'pulse-wrong' : ''
]"
          v-for="ruWord in ruCards"
          :key="ruWord.id"
          @click="changeActive(ruWord.id, 'right')"
        >
          {{ ruWord.lang }}
        </div>
      </div>
    </div>
<!--    <div class="image-container">-->
<!--      <img src="../assets/images/wiresPic.png" alt="Wire Cutter" class="cutter-image" />-->
<!--      <button class="action-button" @click="handleButtonClick">Режь правильный провод!!!</button>-->
<!--    </div>-->
  </div>
</template>


<script setup>
import { useRouter, useRoute } from 'vue-router';
import shortWordsData from '../dataForGames/short-words-data';
import { ref, onMounted, computed, watch } from 'vue';
import {useGameStore} from "stores/example-store";

const router = useRouter();
const route = useRoute();
const gameStore = useGameStore()

const shuffle = array => array.sort(() => Math.random() - 0.5);

const currentMission = ref();
const currentGameData = ref();
const engCards = ref([]);
const ruCards = ref([]);

const time = ref(0);






const sliceMin = ref(0);
const sliceMax = ref(5);

const matchedPairs = ref(0); // Количество найденных пар для запонения статус бара

const totalPairs = computed(() => {
  return currentGameData.value?.length || 0; // Получаем количество пар, если массив не пуст
});

const progressWidth = computed(() => {
    return `${(matchedPairs.value / totalPairs.value) * 100}%`;
});
const progressPercentage = ref(0);  // Начальный процент

// Функция для плавного увеличения процентов
const animateProgress = () => {
  const targetPercentage = Math.round((matchedPairs.value / totalPairs.value) * 100);

  // Если текущий процент меньше целевого
  if (progressPercentage.value < targetPercentage) {
    progressPercentage.value += 1;  // Увеличиваем на 1% за каждый кадр
    requestAnimationFrame(animateProgress);  // Запрашиваем следующий кадр анимации
  } else {
    progressPercentage.value = targetPercentage;  // Когда достигаем целевого, устанавливаем точно
  }
};

// Вызываем анимацию каждый раз, когда количество найденных пар изменяется
watch(matchedPairs, animateProgress);

const selectRandomWords = (data, count) => {
    const shuffled = shuffle(data);
    return shuffled.slice(0, count);
};

const splitCards = (lang) => {
  let words = currentGameData.value?.map(el => {
    const base = {
      id: el.id,
      lang: el[lang],
      active: false,
      visible: true
    };
    if (lang === 'eng' && el.hint) {
      base.hint = el.hint;
    }
    return base;
  });

    words = words.slice(sliceMin.value, sliceMax.value); // Отображаем только часть слов
    return shuffle(words);
};

const switchState = (side) => {
    switch (side) {
        case "left":
            engCards.value.forEach(el => el.active = false);
            break;
        case "right":
            ruCards.value.forEach(el => el.active = false);
            break;
        default:
            engCards.value.forEach(el => el.active = false);
            ruCards.value.forEach(el => el.active = false);
            break;
    }
};

const changeActive = (id, side) => {
    let engActive, ruActive;

    if (side === "left") {
        switchState(side);
        engActive = engCards.value.find(el => el.id === id);
        engActive.active = true;

        ruActive = ruCards.value.find(el => el.active);
        if (!ruActive) return;
    } else {
        switchState(side);
        ruActive = ruCards.value.find(el => el.id === id);
        ruActive.active = true;

        engActive = engCards.value.find(el => el.active);
        if (!engActive) return;
    }

    const matched = engActive.id === ruActive.id;

  if (matched) {
    deleteCards(ruActive, engActive);
  } else {
    addWrongPulse(engActive, ruActive);  // добавляем пульсацию ошибки
  }
  switchState();
};
const addWrongPulse = (eng, ru) => {
  eng.pulseWrong = true;
  ru.pulseWrong = true;

  setTimeout(() => {
    eng.pulseWrong = false;
    ru.pulseWrong = false;
  }, 600);  // длительность совпадает с анимацией
};

const deleteCards = (ru, eng) => {
  ru.pulse = true;
  eng.pulse = true;
  matchedPairs.value++;

  setTimeout(() => {
    ru.visible = false;
    eng.visible = false;
    ru.pulse = false;
    eng.pulse = false;

    const allInvisible = engCards.value.every(el => !el.visible);
    if (allInvisible) shiftCards(); // теперь вызывается корректно после исчезновения карточек
  }, 500); // через 800ms исчезает пульсация, а карточки становятся полупрозрачными

  const allInvisible = engCards.value.every(el => !el.visible);
  if (allInvisible) shiftCards();
};

const shiftCards = () => {
  sliceMax.value += 5;
  sliceMin.value += 5;

  if (sliceMin.value < currentGameData.value.length) {
    ruCards.value = splitCards("ru");
    engCards.value = splitCards("eng");
  } else {
    finishGame();
  }
};

const finishGame = () => {

  gameStore.setLastGameResults(time.value, 20)
  gameStore.setGameName("FindPairsHard")
  router.push("/leader-board/");

};

onMounted(() => {

    currentMission.value = route.params.missionName;
    currentGameData.value = shortWordsData[currentMission.value];
    currentGameData.value = selectRandomWords(currentGameData.value, 20); // Выбираем 20 случайных слов

    ruCards.value = splitCards("ru");
    engCards.value = splitCards("eng");

    // Запускаем секундомер
    setInterval(() => {time.value+= 10}, 10)



});
</script>

<style lang="scss" scoped>
.game-wrapper {
  background-size: cover;
  background-position: center;
  padding: 20px;
  min-height: 100vh;
}

.row {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 2px;
}

.wordCard {
  background-color: #f4f4f4;
  height: 70px; // или 80px — подбери нужную высоту

  border: 2px solid #aaa;
  border-radius: 16px;
  padding: 10px 5px;
  font-size: 16px;
  text-align: center;
  align-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 2px 2px 6px rgba(0,0,0,0.1);
}

.wordCard:hover {
  background-color: #e0e0e0;
}
.hint {
  font-size: 15px;
  color: #666;
  line-height: 0.5;       // делает текст компактнее по вертикали

}
.active {
  background-color: #333;
  color: #fff;
}

.faded {
  opacity: 0.3;
  pointer-events: none;
}

.pulse-once {
  animation: pulse 0.5s ease-in-out 1;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    background-color: #c8f7c5;
  }
  50% {
    transform: scale(1.05);
    background-color: #a2e9a2;
  }
  100% {
    transform: scale(1);
    background-color: #f4f4f4;
  }
}

.progress-container {
  width: 100%;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #3ec46d;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 13px;
  font-weight: bold;
}

.shift-button {
  margin: 10px auto 20px auto;
  padding: 8px 20px;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  text-align: center;
  width: max-content;
  transition: background-color 0.3s ease;
}

.shift-button:hover {
  background-color: #666;
}
.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.cutter-image {
  width: 300px;
  height: auto;
  transform: translate(-48px, -74px); // Смещение влево и вверх
}
.action-button {
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  transform: translateY(-74px); // сдвиг кнопки вверх, к картинке

  &:hover {
    background-color: #cc0000;
  }

}

@keyframes pulse-border {
  0% {
    box-shadow: 0 0 0 0 rgba(233, 14, 14, 0.6);
  }
  50% {
    box-shadow: 0 0 8px 4px rgba(233, 14, 14, 0.8);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(233, 14, 14, 0.6);
  }
}

.pulse-wrong {
  animation: pulse-border 0.6s ease-in-out 1;
  border-color: red !important;
  z-index: 3;
}
</style>
