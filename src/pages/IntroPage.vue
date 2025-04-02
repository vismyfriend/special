<template>
  <p class="bubble right" id="intro-message">Hi. <br> Приветики</p>
  <q-btn class="q-mb-sm zoomIn" icon="fingerprint" label="Open &nbsp;S.P. E.C.I.A.L &nbsp;App" stack glossy color="purple"
    @click="goToRegistrationPage" />
  <q-btn class="q-mb-sm zoomIn ask-vincent"
         icon="phone"
         label="ASK Vincent"
         push
         color="primary"
         @click="linkToVismyfriendTelegram" />
  <q-btn class="q-mb-sm zoomIn"
         icon="my_location"
         label="попробовать игры"
         push
         color="primary"
         @click="tryGames" />
  <q-btn class="q-mb-sm zoomIn" icon="camera" label="see photos of secret agents!" push color="primary"
    @click="goToPhotosOfAgentsPage" />
  <q-btn class="q-mb-sm zoomIn" icon="mail" label="пройти тест" push color="primary" @click="test" />

  <q-btn class="q-mb-sm zoomIn" icon="search" label="Vismycoder" push color="green" @click="goVismyCoderPage" />
  <!-- а где лучше всего идеи записывать? буду здесь пока! -->

</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const tryGames = () => {
  window.location.href = '#/special-app/devModeNumbersFast';
};
const goVismyCoderPage = () => {
  router.push("/vismycoder")
}
const goToSpecialAppPage = () => {
  router.push("/special-app")
}
const goToRegistrationPage = () => {
  router.push("/registration")
}
const linkToVismyfriendTelegram = () => {

  window.open('https://t.me/vismyfriend?text=Hello Vincent', '_blank'); // Открыть ccылку в новой вкладке }

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



onMounted(() => {
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
    "Hola, amigos ",
    "Privet, friend",
    "Today is a SPECIAL day",];

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
.bubble {
  text-align: center;
  user-select: none;
  font-family: "Permanent Marker";
  font-size: 17px;
  display: inline-block;
  position: relative;
  padding: 30px 40px;
  border-radius: 10px;
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
</style>
