<!-- vbase-3-setup -->
<template>
  <div class="relative">
    <div id="phoneFrame">
      <p class="bubble left" id="intro-message">Choose<br> a mission</p>

      <div class="q-pa-15">
        <img src="../assets/images/special logo detective girl.png" alt="logo">

        <!-- Поле поиска -->
        <div class="search-container">
          <input
            v-model="searchQuery"
            placeholder="Search sets..."
            class="search-input"
          />
        </div>

        <!-- Используем filteredSets для отображения карточек -->
        <div class="v-cards-choose">
          <!-- Специальная карточка (всегда первая) -->
          <div
            class="v-card-choose tooltip-wrapper create-special-set"
            role="button"
            @click="showSpecialCardAlert"
            :style="{
              '--offset-x': '5px',
              '--offset-y': '29.5px'
            }"
          >
            Создать свой S.P.E.C.I.A.L. набор
            <div class="custom-tooltip">
              Click to see special content
            </div>
          </div>

          <!-- Остальные карточки из наборов -->
          <div
            class="v-card-choose tooltip-wrapper"
            v-for="currentSetOfWords in filteredSets"
            :key="currentSetOfWords.id"
            role="button"
            @click="goToChosenGame(currentSetOfWords)"
            :style="{
    '--offset-x': '5px',
    '--offset-y': '29.5px'
  }"
          >
            <div class="card-content">
              <span class="card-description">{{ currentSetOfWords.missionDescription }}</span>
              <span class="card-stars" v-if="currentSetOfWords.stars">
      {{ getLevelStars(currentSetOfWords.stars) }}
    </span>
            </div>
            <div class="custom-tooltip">
              <div class="tooltip-content">
                <span class="mission-name">{{ currentSetOfWords.missionVisibleName }}</span>
                <span class="mission-stars" v-if="currentSetOfWords.stars">
        {{ getLevelStars(currentSetOfWords.stars) }}
      </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { onMounted } from "vue";
import { allGamesAndSetsOfWordsList } from "src/dataForGames/allGamesAndSetsOfWordsList";

const text = "choose \na \nset of words";
const speed = 150; // Скорость печати (мс)
const introMessage = ref(null); // Добавляем ref для элемента
const searchQuery = ref('');
const router = useRouter()
const $q = useQuasar()

const showSpecialCardAlert = () => {
  router.push('/create-special-set');
};

const AllSetsOfWords = ref(allGamesAndSetsOfWordsList)

// Функция для нормализации строки поиска
const normalizeString = (str) => {
  return str
    .toLowerCase()
    .replace(/[-\s]/g, ''); // удаляем дефисы и пробелы
};

// Фильтрация наборов слов
const filteredSets = computed(() => {
  if (!searchQuery.value) {
    return AllSetsOfWords.value.filter(set => set.active);
  }

  const query = normalizeString(searchQuery.value);

  return AllSetsOfWords.value.filter(set => {
    return (
      set.active && (
        normalizeString(set.missionVisibleName).includes(query) ||
        normalizeString(set.missionDescription).includes(query) ||
        normalizeString(set.missionName).includes(query)
      )
    );
  });
});

const goToChosenGame = (set) => {
  if (set.type === "hardcodedLink") {
    router.push(set.path);
  } else if (set.type === "externalLink") {
    // Для внешних ссылок
    window.open(set.url, set.target || '_blank');
  } else {
    // Для обычных наборов
    router.push(`/see-all-sets-of-words/${set.missionName}`);
  }
}
const getLevelStars = (stars) => {
  if (!stars) return '';
  const starCount = parseInt(stars);
  return '⭐'.repeat(starCount);
};

onMounted(() => {
  const introMessage = document.getElementById("intro-message");
  if (!introMessage) return;

  introMessage.textContent = "";
  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      introMessage.textContent += text[i] === "\n" ? "\n" : text[i];
      i++;
      setTimeout(typeWriter, speed);
    }
  }

  typeWriter();

});

</script>

<style lang="scss" scoped>
/* ask как убрать белые края у блюра? я просто отдельную фотку загрузил, но это же мегабайты лишние*/
.blur {
  filter: blur(5px);
}

.search-container {
  margin: 0 0 10px 0;
  padding: 0 10px;
}

.search-input {
  width: 100%;
  padding: 8px 15px;
  border-radius: 20px;
  border: 1px solid #ddd;
  font-size: 16px;
  outline: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:focus {
    border-color: #6a6a6a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
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


/*
.phoneFrame{
  position: absolute;
  height: 100%;
  z-index: -1;
}
*/

.v-cards-choose {
  display: flex;
  flex-wrap: wrap;
  /* Позволяет карточкам переходить на новую строку */


}

.v-card-choose {
  background-color: #f9f9f9;
  /* Цвет фона карточки */
  border: 1px solid #ddd;
  /* Цвет границы */
  border-radius: 20px;
  /* Закругление углов */
  padding: 5px 20px;
  /* Внутренние отступы */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  /* Тень */
  cursor: none;
  /* Указатель мыши при наведении */
  transition: transform 0.2s, box-shadow 0.2s;
  /* Плавный переход при наведении */
  margin: 1.5px;
  user-select: none;
  width: 100%;

}
.q-btn {
  cursor: none;

}
.v-card-choose:hover {
  transform: scale(1.05);
  /* Увеличение карточки при наведении */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  /* Увеличенная тень при наведении */
  user-select: none;

}


.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center; /* выравнивание по вертикали */
  width: 100%;
}

.card-description {
  text-align: left;
  margin-right: 10px;
  flex-grow: 1; /* позволяет описанию занимать всё доступное пространство */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* предотвращаем перенос текста */
}

.card-stars {
  text-align: right;
  white-space: nowrap;
  flex-shrink: 0; /* предотвращает сжатие звёзд */
}

.closeThisPage {

  display: block;
  margin: 0 auto;
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

.bubble {
  // Класс bubble
  text-align: center; // Выравнивание текста по центру
  user-select: none; // Запрет на выделение текста
  font-family: "Permanent Marker"; // Шрифт
  font-size: 17px; // Размер шрифта
  display: inline-block; // Отображение как строчно-блочный элемент
  position: absolute; // Абсолютное позиционирование
  padding: 30px 40px; // Внутренние отступы
  border-radius: 10px; // Скругление углов
  border: 3px solid black; // Рамка вокруг элемента
  background: white; // Фоновый цвет
  clear: both; // Очищение флоатов

  padding: 16px 17px; // Внутренние отступы (переопределение предыдущих)

  &:before {
    // Псевдоэлемент перед элементом bubble
    content: ''; // Пустое содержимое
    position: absolute; // Абсолютное позиционирование
    bottom: -50px; // Позиция снизу
    height: 50px; // Высота псевдоэлемента
    width: 90px; // Ширина псевдоэлемента
  }

  &.left {
    // Состояние, когда bubble имеет класс left
    float: left; // Обтекание слева
    margin: 25px 1px 62px 176px; // Отступы

    &:before {
      // Псевдоэлемент перед элементом bubble с классом left
      border-radius: 0 0 100%; // Скругление углов
      box-shadow: // Тени для псевдоэлемента
        -2px -2px 0 0 #000 inset,
        -23px 0 0 0 #fff inset,
        -25px -2px 0 0 #000 inset;
      left: 0; // Позиция слева
      /* ask - в инспекторе если в это месте добавить margin-right: 15px то стрелка двигается, а если тут в стилях дописать, то в инспекторе не отображается эта строчка*/
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
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}
.custom-tooltip {
  position: absolute;
  left: 0; // ← ПРИЖАТ К ЛЕВОМУ КРАЮ
  transform: translate(var(--offset-x, 0px), var(--offset-y, -10px));
  bottom: 100%;

  background-color: #222;
  color: #fff;
  padding: 2px 12px;
  border-radius: 30px;
  font-size: 16px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 100;
  //max-width: 300px;
  text-align: left;
  width: 100%;
}

.tooltip-wrapper:hover .custom-tooltip {
  opacity: 1;
}


.tooltip-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.mission-name {
  text-align: left;
  margin-right: 10px; /* небольшой отступ между названием и звёздами */
}

.mission-stars {
  text-align: right;
  white-space: nowrap; /* чтобы звёзды не переносились */
}

.create-special-set {
  display: none;
  position: relative; /* для псевдоэлемента */
  overflow: hidden;
  margin: 1.5px;
  padding: 5px 20px;
  border-radius: 20px;
  color: white;
  background: linear-gradient(to top, #007BFF, #339CFF);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -2px 4px rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  cursor: none;
  //font-size: 16px;
}

.create-special-set::before {
  content: "";
  position: absolute;
  top: 0;
  left: -75%;  /* стартуем слева за пределами */
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

.create-special-set:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.4), inset 0 -2px 4px rgba(255, 255, 255, 0.2);
}

.create-special-set:active {
  transform: translateY(1px);
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.4);
}
</style>
