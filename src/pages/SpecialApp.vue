<!-- vbase-3-setup -->
<template>
  <div class="relative">
    <div id="phoneFrame">
      <p class="bubble left" id="intro-message">Choose<br> a mission</p>
      <!-- ask v-if="q.platform.is.desktop" добавить к диву, чтобы только с компьютера видно было, если добавляю пропадает весь див с содержимым -->
      <!-- отображение элементов на разных платформах -->
      <!-- 001 если с мобильного теефона кто-то открывает сайт, то эта картинка не отображается,
       она только для десктопной версии. (если телефон горизонтально разворачивают, то тоже можно убрать рамку) -->

      <!-- <img class="phoneFrame" v-if="$q.platform.is.desktop" src="../assets/images/phone frame.png" alt="logo"> -->
<!--      <img class="backgroundImg" src="/src/assets/images/backgroundBlur.jpg" alt="blur">-->

      <div class="q-pa-15">
        <img src="../assets/images/special logo detective girl.png" alt="logo">
        <div class="v-cards-choose" v-for="currentSetOfWords in AllSetsOfWords" :key="currentSetOfWords.id">
          <div class="v-card-choose" v-if="currentSetOfWords.active"
            @click="goToChosenGame(`/special-app/${currentSetOfWords.missionName}`)">
            {{ currentSetOfWords.description }}
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { onMounted } from "vue";

const text = "choose \na \nset of words";
const speed = 150; // Скорость печати (мс)
const introMessage = ref(null); // Добавляем ref для элемента


const router = useRouter()
const $q = useQuasar()

const AllSetsOfWords = ref([

  {
    missionName: "digits",
    description: "цифры",
    id: 6,
    active: true
  },
  {
    missionName: "alphabetData",
    description: "Алфавит ENG",
    id: 7,
    active: true
  },
  {
    missionName: "devModeNumbersFast",
    description: "протестировать быстро",
    id: 15,
    active: true,
  },

  {
    missionName: "halloween01",
    description: "Halloween 1",
    id: 1,
    active: true
  },
  {
    missionName: "car-numbers",
    description: "car numbers",
    id: 2,
    active: false
  },
  {
    missionName: "devmode0",
    description: "boys' names",
    id: 3,
    active: true
  },
  {
    missionName: "abcde",
    description: "bukvas",
    id: 4,
    active: true
  },
  {
    missionName: "story-one",
    description: "story number one",
    id: 5,
    active: true
  },

  {
    missionName: "missssssion",
    description: "новый набор слов и выражений",
    id: 8,
    active: true
  },
  {
    missionName: "missssssion",
    description: "новый набор слов и выражений",
    id: 9,
    active: true
  },
  {
    missionName: "missssssion",
    description: "новый набор слов и выражений",
    id: 10,
    active: true
  },
  {
    missionName: "missssssion",
    description: "новый набор слов и выражений",
    id: 11,
    active: true
  },
  {
    missionName: "missssssion",
    description: "новый набор слов и выражений",
    id: 12,
    active: true
  },
  {
    missionName: "missssssion",
    description: "more words",
    id: 13,
    active: true
  },
  {
    missionName: "missssssion",
    description: "so many words...",
    id: 14,
    active: true
  },


])

const goToChosenGame = (route) => {

  router.push({ path: route })

}


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
  cursor: pointer;
  /* Указатель мыши при наведении */
  transition: transform 0.2s, box-shadow 0.2s;
  /* Плавный переход при наведении */
  margin: 1.5px;
  user-select: none;

}

.v-card-choose:hover {
  transform: scale(1.05);
  /* Увеличение карточки при наведении */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  /* Увеличенная тень при наведении */
  user-select: none;

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
</style>
