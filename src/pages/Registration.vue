<template>
  <div class="relative">
    <div id="phoneFrame">
      <img class="backgroundImg" src="../assets/images/backgroundBlur.jpg" alt="blur">
      <p class="bubble left think" id="intro-message">What ' s<br> your <br>name?</p>
      <img class="a-girl" src="../assets/images/special logo detective girl 2.png" alt="logo">

      <div class="inside-phone-frame">

        <div class="registration-container">
          <input v-model="userName" type="text" placeholder="Enter your name" class="name-input">
          <q-btn color="green-5" @click="submitName">OK</q-btn>
          <q-btn color="blue-5" @click="continueAsGuest">Я анонимно хочу!</q-btn>
          <q-btn push color="brown-5" @click="backToPreviousPage">📷 назад </q-btn>

        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import {ref} from "vue";
import {api} from "src/api";
import {useQuasar} from "quasar";


const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const userName = ref()



const backToPreviousPage = () => {
  // router.push(-1)
  router.push("/")
}

const setNotify = (message, color = 'black') => {
  $q.notify({
    color: color,
    position: 'top',
    message: message,
    textColor: 'white',
  })
}

const submitName = async () => {
    const res = await api.auth.post(userName.value)
  setNotify(res.data.token)

localStorage.setItem('token', res.data.token);
localStorage.setItem('agentName', userName.value);


  await router.push("/special-app/")



};


const continueAsGuest = async () => {
  const res2 = await api.scores.post("tnt",134, 2, 11)
  const res3 = await api.scores.get()
  console.log(res3)
  // router.push("/special-app")

  // настроить режим анонимных пользователей
  // при отправлении рекрда мы берем имя игры из раута, время в секундах, ошибки/читы, эйджент нэйм из локал
  // (сториджа)


$q.notify({message:res2})
};


</script>

<style lang="scss" scoped>
.inside-phone-frame{
  padding: 1px 15px;
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


.closeThisPage {
  display: block;
  margin: 0 auto;
  border-radius: 30px;
  background-color: transparent;

}

.registration-container {
  display: flex; /* Используем flexbox для расположения элементов в строку */
  justify-content: space-between; /* Распределяем пространство между элементами */
  flex-direction: column;
  align-items: center;

  gap: 10px;
  margin-top: 20px;
}


.name-input {
  padding: 10px;
  border-radius: 10px;
  border: 2px solid #6a6a6a;
  width: 80%;
  font-size: 16px;
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



</style>
