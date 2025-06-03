
<template>
  <p class="bubble right" id="intro-message">Hi. <br> Приветики</p>


  <q-btn
    align="between"
    class="q-mb-sm zoomIn padding-left-right"
    color="green"
    :label="showAltLabels ? 'Where to tap next?' : 'куда тыкать дальше ?'"
    :icon-right="showAltIcons ? 'south' : 'help'"
    @click="toggleButtonStates"
  />
  <q-btn class="q-mb-sm zoomIn tapForFun padding-left-right"
         align="between"
         icon-right="favorite"
         :label="showAltLabels ? 'сюда , чтобы играть' : 'tap to play'"
         push
         color="primary"
         @click="goChooseGame"
  />

  <q-btn class="q-mb-sm zoomIn padding-left-right"
         align="between"
         icon-right="my_location"
         :label="showAltLabels ? 'сюда , для практики' : 'tap for practice'"
         push
         color="primary"
         @click="seeAllSetsOfWords" />


  <q-btn class="q-mb-sm zoomIn tapForFun padding-left-right opacity25"
         align="between"
         icon-right="attach_money"
         :label="showAltLabels ? 'сюда , по приколу' : 'tap for fun!'"
         push
         color="primary"
         @click="goToIntroPage"
  />
  <q-btn class="q-mb-sm zoomIn tapForFun padding-left-right opacity25"
         align="between"
         icon-right="build_circle"
         :label="showAltLabels ? 'сюда за доп.материалами' : 'tap for extra!'"
         push
         color="primary"
         @click="goToExtraPage"
  />
  <q-btn class="q-mb-sm zoomIn see-all-sets-of-words-button opacity25"
         icon="fingerprint"
         :label="showAltLabels ? 'вход для СПЭШЛ ЭЙДЖЭНТС' :'For &nbsp; &nbsp;S.P. E.C.I.A.L &nbsp;&nbsp; Agents'"
         stack glossy color="purple"
         @click="goToRegistrationPage" />

  <q-btn class="q-mb-sm zoomIn ask-vincent padding-left-right opacity25"
         icon-right="phone"
         align="between"
         :label="showAltLabels ? 'спросить вИнсента' : 'Ask Vincent!'"
         push
         color="green"
         @click="linkToVismyfriendTelegram" />


  <!--  <q-btn class="q-mb-sm zoomIn" icon="camera" label="see photos of secret agents!" push color="primary"-->
  <!--    @click="goToPhotosOfAgentsPage" />-->
  <!--  <q-btn class="q-mb-sm zoomIn" icon="mail" label="пройти тест" push color="primary" @click="test" />-->
  <!--  <q-btn-->
  <!--    class="custom-btn"-->
  <!--    label="НАЖМИ!"-->
  <!--    @click="test"-->
  <!--  />-->
  <!--  <q-btn class="q-mb-sm zoomIn" icon="search" label="Vismycoder" push color="green" @click="goVismyCoderPage" />-->
  <!-- а где лучше всего идеи записывать? буду здесь пока! -->

</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {api} from "src/api";
import backEndTest from "src/api/backEndTest";

const router = useRouter()
const seeAllSetsOfWords = () => {
  // window.location.href = '#/special-app/devModeNumbersFast';
  window.location.href = '#/see-all-sets-of-words';
};


// const goVismyCoderPage = () => {
//   router.push("/vismycoder")
// }
// const goToSpecialAppPage = () => {
//   router.push("/special-app")
// }
const goToRegistrationPage = () => {
  router.push("/registration")
}

const goToIntroPage = () => {
  router.push('/');  // новый маршрут для кнопок «по приколу»
};
const goChooseGame = () => {
  router.push('/games');
};
const goToExtraPage = () => {
  router.push('/extra-page');  // новый маршрут для кнопок «доп материалов»
};

const linkToVismyfriendTelegram = () => {

  window.open('https://t.me/vismyfriend?text=Hello Vincent', '_blank'); // Открыть ccылку в новой вкладке }

}


import { ref } from 'vue'

const showAltLabels = ref(false)
const showAltIcons = ref(false)

const toggleLabels = () => {
  showAltLabels.value = !showAltLabels.value
}
const toggleIcons = () => {
  showAltIcons.value = !showAltIcons.value
}
const toggleButtonStates = () => {
  toggleLabels();
  toggleIcons();
}
const test = () => {
  // alert("you clicked! It worked!")
  router.push("/vismyfriend")


}

const goToPhotosOfAgentsPage = () => {
  router.push("/photos-of-agents")
}

// Функция для получения правильного окончания
const getOrdinalSuffix = (date) => {
  const lastDigit = date % 10; // Последняя цифра
  const lastTwoDigits = date % 100; // Последние две цифры

  if (lastTwoDigits === 11 || lastTwoDigits === 12 || lastTwoDigits === 13) {
    return 'th'; // Исключения для 11, 12, 13
  }

  // Проверяем окончание по последней цифре
  switch (lastDigit) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th'; // Для всех остальных
  }
};


// Функция для теста Бэкенда при старте приложения - отправляем запрос
const connectToBackEnd = async () => {
  try {
    const backEndTest = await api.backEndTest.get(); // Запрос на получение данных с бэкенда
  } catch (error) {
    console.error("Ошибка соединения с бэкЭндиной!", error);
  }
};

onMounted(  () => {

  connectToBackEnd();
  const currentDate = new Date();
  const monthName = currentDate.toLocaleString('en-US', { month: 'long' }); // Явно указываем английский
  const dayName = currentDate.toLocaleString('en-US', { weekday: 'long' }); // Явно указываем английский
  const currentDay = currentDate.getDate();
  const suffix = getOrdinalSuffix(currentDay);

  // Массив приветствий
  const greetings = [
    "Hello, friends",
    "Welcome to SPECIAL",
    "Hi, buddy",
    "Хэллоу, фрэнд",
    "Zdraste, priehali",
    "Hola, amigos ",
    "Privet, friend",
    "Today is a SPECIAL day",
  ];
  // Выбираем случайное приветствие
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  // Обновляем сообщение
  document.getElementById('intro-message').innerHTML = `
    ${randomGreeting} <br>
    today is <u><span class="purple-text">${dayName}</span></u> <br>
    the <span class="purple-text">${currentDay}</span>-<strong>
    <u><span class="purple-text">${suffix}</span></u></strong> of ${monthName}
  `;

});



</script>

<style lang="scss" scoped>

:deep(.purple-text) {
  color: #af10af;
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

//.custom-btn {
//  background-image: url('../assets/images/yellow_card.png');
//  background-size: cover;
//  background-position: center;
//content: "";
//  //aspect-ratio: 16 / 3; /* Подбери под свою картинку */
////height: 30px;
//  color: black;
//  font-weight: bold;
//  font-size: 20px;
//}
.bubble {
  text-align: center;
  user-select: none;
  font-family: "Permanent Marker";
  font-size: 17px;
  display: inline-block;
  position: relative;
  padding: 30px 40px;
  border-radius: 45px;
  border: 3px solid black;
  background: white;
  clear: both;

  &:before {
    content: '';
    position: absolute;
    bottom: -50px;
    height: 50px;
    width: 90px;

  }

  &.left {
    float: left;
    margin: 10px 10px 60px 10px;

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

.padding-left-right {
  padding-left: 40px;
  padding-right: 40px;

}
.q-btn {
  display: inline-flex
;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  outline: 0;
  border: 0;
  vertical-align: middle;
  font-size: 14px;
  line-height: 1.715em;
  text-decoration: none;
  color: inherit;
  background: transparent;
  font-weight: 500;
  text-transform: uppercase;
  text-align: center;
  width: auto;
  height: 50px;
  cursor: none;

}
.see-all-sets-of-words-button {
  height: 70px !important; /* или любое нужное значение */
  //!important нужен, чтобы переопределить встроенный стиль Quasar, если он выставляет height напрямую.

}
.opacity25 {
  opacity: 0.25;
}
</style>
