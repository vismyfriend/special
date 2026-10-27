<template>
  <div class="relative">
    <div id="phoneFrame">
<!--      <img class="backgroundImg" src="../assets/images/backgroundBlur.jpg" alt="blur">-->
      <p class="bubble left think" id="intro-message">Choose<br> a game</p>
      <img class="a-girl" src="../assets/images/special logo detective girl 2.png" alt="logo">

      <div class="inside-phone-frame">
<!--        <q-btn push color="brown-5" @click="backToPreviousPage">📷 показать все миссии 🔎 </q-btn>-->
        <div class="phone-toolbar">
          <button
            class="settings-btn"
            title="Настройки набора"
            @click="goToSettings"
          >
            ⚙️
          </button>
        </div>
        <div class="games-grid">
          <div
            class="game-card"
            v-for="currentGame in filteredGames"
            :key="currentGame.path"
            @click="startGame(currentGame?.path)"
            :class="{ 'locked': !currentGame.active }"
          >
            <div class="card-content">
              <span>{{ currentGame.name }}</span>
              <div class="card-icon" v-if="!currentGame.active">🔒</div>
              <div class="card-icon" v-else>
                {{ currentGame.cardIcon || '🎮' }} <!-- Используем иконку из массива или дефолтную -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { allGamesAndSetsOfWordsList } from "src/dataForGames/allGamesAndSetsOfWordsList";
import questionsData from "../dataForGames/questions-data";
import sortingWordsData from '../dataForGames/sortingWordsData'
import shortWordsData from '../dataForGames/short-words-data';
import shortSentencesWordOrderData from '../dataForGames/short-sentences-word-order';
import tntData from 'src/dataForGames/tnt-data';
import trickyQuizData from 'src/dataForGames/tricky-quiz-data';
import helpBenderData from 'src/dataForGames/help-bender-data';
import storiesData from 'src/dataForGames/stories-data';
import storiesAndWordsData from 'src/dataForGames/storiesData';
import scrambledData from 'src/dataForGames/scrambled-data';
import homeworkLinksData from 'src/dataForGames/homework-links-data';
import hwData from 'src/dataForGames/hw-data';
import gameTestsNoSeedNoShuffleData from "src/dataForGames/GameTestsNoSeedNoShuffleData";
import GameTestsSeedData from "src/dataForGames/GameTestsSeedData";
import NewFuturisticStyleData from "src/dataForGames/NewFuturisticStyle";
import MillionaireData from "src/dataForGames/MillionaireData";
import pnqwData from "src/dataForGames/pnqw";
import shortPicturesData from "src/dataForGames/short-pictures-data";
import dresserGameData from "src/dataForGames/dresserGameData";
import songsData from "src/dataForGames/SongsData";
import pdfPagesData from "src/dataForGames/pdfPagesData";
import definitionsData from "src/dataForGames/definitions-data";
import dataGame4Sentences from "src/dataForGames/game4SentencesData";

const dynamicText = ref("");
const speed = 150; // Скорость печати (мс)
const introMessage = ref(null); // Добавляем ref для элемента

const router = useRouter()
const route = useRoute()

const goToSettings = () => {
  router.push(`/see-all-sets-of-words/${route.params.missionName}/wordSetSettings`);
};

const AllGames = ref([
  // ========== 100–199: СЛОВА ==========
  {
    id: 101,
    name: "Все слова из набора",
    path: "print-all-words",
    gameData: shortWordsData,
    cardIcon: '🖨️',
    active: true,
  },
  {
    id: 102,
    name: "Find pairs EASY",
    path: "find-pairs-easy",
    gameData: shortWordsData,
    cardIcon: '✂️',
    active: true,
  },
  {
    id: 103,
    name: "Spell it",
    path: "spell-it",
    gameData: shortWordsData,
    cardIcon: '🔠',
    active: true,
  },
  {
    id: 104,
    name: "Find pairs HARD",
    path: "find-pairs-hard",
    gameData: shortWordsData,
    cardIcon: '🧩',
    active: true,
  },
  {
    id: 105,
    name: "Say it",
    path: "game-pronunciation",
    gameData: shortWordsData,
    cardIcon: '🎤️',
    active: true,
  },
  {
    id: 106,
    name: "Listen to it",
    path: "game-whatDoYouHear",
    gameData: shortWordsData,
    cardIcon: '🎧',
    active: true,
  },
  {
    id: 107,
    name: "Spell Ten",
    path: "spell-ten",
    gameData: shortWordsData,
    cardIcon: '✏️',
    active: true,
  },
  {
    id: 108,
    name: "Translate it",
    path: "game-translate",
    gameData: shortWordsData,
    cardIcon: '🌐',
    active: true,
  },
  {
    id: 109,
    name: "Spelling old game",
    path: "spelling",
    gameData: shortWordsData,
    cardIcon: '🔠',
    active: true,
  },
  {
    id: 110,
    name: "Распутай слово",
    path: "scrambled",
    gameData: scrambledData,
    cardIcon: '🔀',
    active: true,
  },

  // ========== 200–299: ПРЕДЛОЖЕНИЯ И ПОРЯДОК ==========
  {
    id: 201,
    name: "Correct order",
    path: "word-order-sortable",
    gameData: shortSentencesWordOrderData,
    cardIcon: '🔢',
    active: true,
  },
  {
    id: 202,
    name: "game4Sent",
    path: "4sentences",
    gameData: dataGame4Sentences,
    cardIcon: '💰',
    active: true,
  },
  {
    id: 203,
    name: "Help Bender",
    path: "bender",
    gameData: helpBenderData,
    cardIcon: '🤖',
    active: true,
  },

  // ========== 300–399: КВИЗЫ И ВОПРОСЫ ==========
  {
    id: 301,
    name: "Millionaire",
    path: "millionaire",
    gameData: MillionaireData,
    cardIcon: '💰',
    active: true,
  },
  {
    id: 302,
    name: "Brainstorm",
    path: "brainstorm",
    gameData: gameTestsNoSeedNoShuffleData,
    cardIcon: '🧠',
    active: true,
  },
  {
    id: 303,
    name: "Tests",
    path: "tests-and-exams",
    gameData: GameTestsSeedData,
    cardIcon: '📝',
    active: true,
  },
  {
    id: 304,
    name: "Tricky quiz",
    path: "tricky-quiz",
    gameData: trickyQuizData,
    cardIcon: '❓',
    active: true,
  },
  {
    id: 305,
    name: "Definitions",
    path: "definitions-game",
    gameData: definitionsData,
    active: true,
  },
  {
    id: 306,
    name: "+ - ? why (PC only)",
    path: "pnqw",
    gameData: pnqwData,
    cardIcon: '🃏',
    active: true,
  },
  {
    id: 307,
    name: "Tags",
    path: "tag-questions-game",
    gameData: NewFuturisticStyleData,
    cardIcon: '🏷️',
    active: true,
  },
  {
    id: 308,
    name: "A deck of cards",
    path: "deck-of-cards",
    gameData: questionsData,
    cardIcon: '🃏',
    active: true,
  },

  // ========== 400–499: ИСТОРИИ, ПЕСНИ, ТЕКСТЫ ==========
  {
    id: 401,
    name: "Lyrics and Dialogs",
    path: "songs",
    gameData: songsData,
    cardIcon: '🗣️',
    active: true,
  },
  {
    id: 402,
    name: "Stories",
    path: "stories",
    gameData: storiesAndWordsData,
    cardIcon: '📖',
    active: true,
  },

  // ========== 500–599: ДОМАШКИ, PDF, ПЕЧАТЬ ==========
  {
    id: 501,
    name: "Разные домашки",
    path: "hw-links",
    gameData: homeworkLinksData,
    cardIcon: '📚',
    active: true,
  },
  {
    id: 502,
    name: "Ссылка на домаху",
    path: "hw",
    gameData: hwData,
    cardIcon: '📎',
    active: true,
  },
  {
    id: 503,
    name: "PDF",
    path: "pdfPages",
    gameData: pdfPagesData,
    cardIcon: '🎧',
    active: true,
  },

  // ========== 600–699: ВИЗУАЛЬНЫЕ И СПЕЦИАЛЬНЫЕ ==========
  {
    id: 601,
    name: "Sort it out",
    path: "sorting",
    gameData: sortingWordsData,
    cardIcon: '🛒',
    active: true,
  },
  {
    id: 602,
    name: "Pictures",
    path: "gamePics",
    gameData: shortPicturesData,
    cardIcon: '📎',
    active: true,
  },
  {
    id: 603,
    name: "Dresser",
    path: "gameDresser",
    gameData: dresserGameData,
    cardIcon: '👕',
    active: true,
  },
  {
    id: 604,
    name: "Новая змейка",
    path: "gameSnakeWords",
    gameData: shortWordsData,
    cardIcon: '🐍',
    active: true,
  },
  {
    id: 605,
    name: "TNT",
    path: "tnt",
    gameData: tntData,
    cardIcon: '💣',
    active: true,
  },

  // ========== 900–999: СЛУЖЕБНОЕ ==========
  {
    id: 901,
    name: "настройки",
    path: "wordSetSettings",
    cardIcon: '⚙️',
    active: true,
  },
])

// const filteredGames = computed(() => {
//   return AllGames.value.filter(game => game.gameData?.hasOwnProperty(route.params.missionName));
// });

const filteredGames = computed(() => {
  const missionName = route.params.missionName;

  // Универсальная проверка: есть ли данные для этой миссии
  const hasData = (dataObj) => {
    if (!dataObj) return false;

    // Прямая проверка
    if (dataObj[missionName]) return true;

    // Проверка во вложенных объектах (для уровней A0, CustomLevel и т.д.)
    for (const key in dataObj) {
      if (dataObj[key] && typeof dataObj[key] === 'object' && dataObj[key][missionName]) {
        return true;
      }
    }
    return false;
  };

  return AllGames.value.filter(game => {
    return hasData(game.gameData) && game.active;
  });
});

watch(
  () => route.params.missionName,
  (newName) => {
    console.log('MISSION NAME CHANGED:', newName);
  },
  { immediate: true }
);

const startGame = (path) => {
  const game = AllGames.value.find(g => g.path === path);
  if (game && game.active) {
    router.push(`/see-all-sets-of-words/${route.params.missionName}/${path}`);
  }
}

const backToPreviousPage = () => {
  router.push("/see-all-sets-of-words/")
}

onMounted(() => {
  const introMessage = document.getElementById("intro-message");

  if (!introMessage) return;

  // Находим соответствующую миссию
  const missionName = route.params.missionName;
  const mission = allGamesAndSetsOfWordsList.find(set => set.missionName === missionName);

  // Формируем текст в зависимости от того, найдена ли миссия
  if (mission) {
    dynamicText.value = `Awesome! "${mission.missionVisibleName}" let's practice:`;
  } else {
    dynamicText.value = "choose\nthe\ntask"; // fallback текст
  }

  introMessage.textContent = "";
  let i = 0;

  function typeWriter() {
    if (i < dynamicText.value.length) {
      introMessage.textContent += dynamicText.value[i] === "\n" ? "\n" : dynamicText.value[i];
      i++;
      setTimeout(typeWriter, speed);
    }
  }

  typeWriter();

  // Выводим в консоль missionName и missionVisibleName
  console.log("missionName:", missionName);

  // Находим соответствующий набор в allGamesAndSetsOfWordsList
  if (mission) {
    console.log("missionVisibleName:", mission.missionVisibleName);
  } else {
    console.log("missionVisibleName not found for this mission");
  }

  console.log('MISSION NAME (mounted):', route.params.missionName);
  console.log('FILTERED GAMES:', filteredGames.value.length);
  console.log('ALL GAMES:', AllGames.value.length);
});

</script>

<style lang="scss" scoped>
.inside-phone-frame {
  padding: 1px 15px 15px;
}

.backgroundImg {
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  object-fit: cover;
  z-index: -1;
  right: 0;
  bottom: 0;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 15px;
}

.game-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
  cursor: none;
  min-height: 60px;
  display: flex;
  align-items: center;
  user-select: none;

  .card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    span {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      flex-grow: 1;
    }


    .card-icon {
      font-size: 20px;
      margin-left: 8px;
      min-width: 20px; /* Добавлено для сохранения места */
      text-align: center; /* Центрируем иконку */
    }

  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &.locked {
    background-color: #f5f5f5;
    cursor: not-allowed;

    .card-content {
      span {
        color: #999;
      }

      .card-icon {
        color: #999;
      }
    }

    &:hover {
      transform: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
}
.relative {
  margin-top: 75px;
}
#phoneFrame {
  position: relative; // Устанавливает элемент относительно его нормального положения
  height: 655px; // Высота элемента
  width: 310px; // Ширина элемента

  background:
    linear-gradient( // Фоновый градиент
        to top, // Направление градиента
        #fff -250%, // Белый цвет
        #000000 150% // Черный цвет
    );
  margin: 5px auto; // Отступы сверху и снизу, центрирование по горизонтали
  margin-top: 10px;

  border-radius: 2em; // Скругление углов
  border: solid 5px #6a6a6a; // Рамка вокруг элемента
  box-shadow: // Тени для элемента
    inset 0 0 2px 7px #000, // Внутренняя тень
    inset 0 0 3px 7px #000, // Внутренняя тень
    0 150px 200px -80px #000; // Внешняя тень
  overflow: auto; // Обрезка содержимого, если оно выходит за пределы элемента

  // Стилизация полосы прокрутки
  &::-webkit-scrollbar {
    width: 8px; // Ширина полосы прокрутки
  }

  &::-webkit-scrollbar-track {
    background: transparent; // Цвет фона полосы прокрутки
  }

  &::-webkit-scrollbar-thumb {
    background: gray; // Цвет ползунка
    border-radius: 10px; // Скругление углов ползунка
  }

  &::-webkit-scrollbar-thumb:hover {
    background: darkgray; // Цвет ползунка при наведении
  }

  &::before {
    // Псевдоэлемент перед элементом
    text-align: center; // Выравнивание текста по центру
    word-spacing: 6em; // Промежуток между словами
    color: #fff; // Цвет текста
    font-family: helvetica; // Шрифт
    font-size: .7em; // Размер шрифта
    display: block; // Отображение как блочный элемент
    height: 240px; // Высота псевдоэлемента
    width: 240px; // Ширина псевдоэлемента
    position: absolute; // Абсолютное позиционирование
    margin: 30px; // Отступы
  }
}


.closeThisPage {
  display: block;
  margin: 0 auto;
  border-radius: 30px;
  background-color: transparent;

}

.games-container {
  display: flex; /* Используем flexbox для расположения элементов в строку */
  flex-wrap: wrap; /* Позволяем элементам переноситься на новую строку */
  justify-content: space-between; /* Распределяем пространство между элементами */
}

.v-cards-choose {
  display: flex;
  flex-wrap: wrap; /* Позволяет карточкам переходить на новую строку */
  user-select: none;
  height: 35px;

  display: flex; /* Используем flex для карточек */
  align-items: center; /* Центрируем элементы по вертикали */
  margin-bottom: 10px; /* Отступ между строками */
}

.v-card-choose {
  display: flex;
  flex-wrap: wrap; /* Позволяет карточкам переходить на новую строку */
  user-select: none;
  background-color: #f9f9f9; /* Цвет фона карточки */
  border: 1px solid #ddd; /* Цвет границы */
  border-radius: 20px; /* Закругление углов */
  padding: 5px 20px; /* Внутренние отступы */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Тень */
  cursor: none;
  transition: transform 0.2s, box-shadow 0.2s; /* Плавный переход при наведении */
  margin: 1.5px;
  user-select: none;

  flex: 1; /* Занимаем доступное пространство */
  margin-right: 10px; /* Отступ между карточкой и кнопкой */

}

.v-card-choose:hover {
  transform: scale(1.05); /* Увеличение карточки при наведении */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Увеличенная тень при наведении */
}
.bubble {
  text-align: center;
  user-select: none;
  font-family: "Permanent Marker";
  font-size: 17px;
  display: inline-block;
  position: absolute;

  border-radius: 10px;
  border: 3px solid black;
  background: white;
  clear: both;
  padding: 15px;
  line-height: 16px;

  &:before {
    content: '';
    position: absolute;
    bottom: -50px;
    height: 50px;
    width: 90px;

  }

  &.left {
    float: left;
    margin: 20px 1px 62px 180px;

    &:before {
      border-radius: 0 0 100%;
      box-shadow:
        -2px -2px 0 0 #000 inset,
        -23px 0 0 0 #fff inset,
        -25px -2px 0 0 #000 inset;
      left: 0;
    }

  }
  &.right {
    float: right;
    margin: 10px 10px 60px 10px;
    &:before {
      border-radius: 0 0 0 100%;
      box-shadow:
        2px -2px 0 0 #000 inset,
        23px 0 0 0 #fff inset,
        25px -2px 0 0 #000 inset;
      right: 0;
    }
  }

  &.think {
    &:before {
      height: 3px;
      width: 3px;
      bottom: -20px;
      border-radius: 100%;
      background: #fff;
    }
    &.left:before {
      left: 50px;
      box-shadow:
        0 0 0 7px white,
        0 0 0 10px black,
        -20px 15px 0 5px white,
        -20px 15px 0 8px black,
        -40px 20px 0 2px white,
        -40px 20px 0 5px black;
    }
    &.right:before {
      right: 50px;
      box-shadow:
        0 0 0 7px white,
        0 0 0 10px black,
        20px 15px 0 5px white,
        20px 15px 0 8px black,
        40px 20px 0 2px white,
        40px 20px 0 5px black;
    }
  }
  &.yell {
    &:before {
      height: 0px;
      width: 0px;
      bottom: -8px;
      border-radius: 0;
      background: #fff;
    }
    &:after {
      content: '';
      position: absolute;
      bottom: -41px;
      height: 20px;
      width: 59px;
    }
    &.left {
      &:before {
        transform: skew(-45deg);
        left: 50px;
        box-shadow:
          //0 0 0 7px white,
          0 -3px 0 5px white,
          0 0 0 5px white,
          0 8px 0 5px white,
          8px 8px 0 5px white,
          16px 8px 0 5px white,
          24px 8px 0 5px white,

          0 0 0 8px black,
          0 8px 0 8px black,
          8px 8px 0 8px black,
          16px 8px 0 8px black,
          24px 8px 0 8px black;
      }
      &:after {
        border-radius: 0 0 60%;
        transform: skew(-45deg);
        box-shadow:
          -3px -2px 0 0 #000 inset,
          -14px 0 0 0 #fff inset,
          -17px -2px 0 0 #000 inset;
        left: 0;
      }
    }
    &.right {
      &:before {
        transform: skew(45deg);
        right: 50px;
        box-shadow:
          0 -3px 0 5px white,
          0 0 0 5px white,
          0 8px 0 5px white,
          -8px 8px 0 5px white,
          -16px 8px 0 5px white,
          -24px 8px 0 5px white,
          0 0 0 8px black,
          0 8px 0 8px black,
          -8px 8px 0 8px black,
          -16px 8px 0 8px black,
          -24px 8px 0 8px black;
      }
      &:after {
        border-radius: 0 0 0 60%;
        transform: skew(45deg);
        box-shadow:
          3px -2px 0 0 #000 inset,
          14px 0 0 0 #fff inset,
          17px -2px 0 0 #000 inset;
        right: 0;
      }
    }
  }

}

.q-btn {
  cursor: none;

}
.phone-toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 4px 0 0;
}

.settings-btn {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  width: 34px;
  height: 34px;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.15s, box-shadow 0.15s;

  &:hover {
    transform: translateY(-1px) rotate(30deg);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}
</style>
