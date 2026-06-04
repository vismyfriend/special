<template>
  <div class="relative">
    <div id="phoneFrame">
<!--      <img class="backgroundImg" src="../assets/images/backgroundBlur.jpg" alt="blur">-->
      <p class="bubble left think" id="intro-message">What is<br> your <br>name?</p>
      <img class="a-girl" src="../assets/images/special logo detective girl 2.png" alt="logo">

      <div class="inside-phone-frame">

        <div class="registration-container">
          <div class="input-container">
            <input v-model="userName" type="text" :placeholder="placeholderText" class="name-input">
            <q-btn
              color="green-5"
              :disable="isSubmitting"
              @click="submitName"
              class="ok-btn"
            >
              OK
            </q-btn>
          </div>

          <div class="virtual-keyboard" v-if="!isLoading">
            <div class="keyboard-row">
              <button class="kboardbutton" v-for="key in row1" :key="key" @click="addCharacter(key)">
                {{ key }}
              </button>
            </div>
            <div class="keyboard-row">
              <button class="kboardbutton" v-for="key in row2" :key="key" @click="addCharacter(key)">
                {{ key }}
              </button>
            </div>
            <div class="keyboard-row">
              <button class="kboardbutton" v-for="key in row3" :key="key" @click="addCharacter(key)">
                {{ key }}
              </button>
            </div>
            <div class="keyboard-row">
              <button class="kboardbutton" @click="deleteLastCharacter">⌫</button>
              <button class="kboardbutton" @click="addCharacter(' ')">Space</button>
              <button class="kboardbutton" @click="clearInput">Clear</button>
            </div>
          </div>
          <div v-if="isLoading" class="loading-container">
            <div class="loading-message">loading ...  ( загрузка...)</div>

            <img src="../assets/images/loadingDuck.gif" alt="loading" class="loading-gif" />
          </div>
          <q-btn push color="brown-5" @click="backToPreviousPage" class="back-btn">📷 назад </q-btn>

          <q-btn color="blue-5" @click="continueAsGuest" class="guest-btn">Я анонимно хочу!</q-btn>



        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { ref } from "vue";
import { api } from "src/api";
import { useQuasar } from "quasar";
import { onMounted } from "vue";
import {useGameStore} from "stores/example-store";

const placeholderText = ref("My name |");

const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const row3 = ["Z", "X", "C", "V", "B", "N", "M", "?"];

const addCharacter = (char) => {
  userName.value += char;
};


const deleteLastCharacter = () => {
  userName.value = userName.value.slice(0, -1);
};

const clearInput = () => {
  userName.value = "";
};
// Список вопросов
const introQuestions = [
  "What is your name?",
  "And your name is...?",
  "Who are you?",
  "Do I know you?",
  "Tell me your name?",
  "Agent... who?",
  "I'm Alex, and you are...",
  "Vincent likes you",
  "English is fun",
];

// Переменная для хранения случайного вопроса
const randomQuestion = ref("");

// Функция для выбора случайного вопроса
function getRandomIntroQuestion() {
  const randomIndex = Math.floor(Math.random() * introQuestions.length);
  console.log(introQuestions[randomIndex]);
  return introQuestions[randomIndex];

}

// Получаем случайный вопрос в момент монтирования компонента
onMounted(() => {


  randomQuestion.value = getRandomIntroQuestion();
  const introMessageText = `${randomQuestion.value}`;
  const speed = 150; // Скорость печати (мс)

  const introMessage = document.getElementById("intro-message");
  if (!introMessage) return;

  introMessage.textContent = "";
  let i = 0;

  function typeWriter() {
    if (i < introMessageText.length) {
      introMessage.textContent += introMessageText[i] === "\n" ? "\n" : introMessageText[i];
      i++;
      setTimeout(typeWriter, speed);
    }
  }

  typeWriter();
  const togglePlaceholder = () => {
    placeholderText.value = placeholderText.value === "My name |" ? "My name" : "My name |";
    setTimeout(togglePlaceholder, 500); // продолжает мигать
  };

  togglePlaceholder(); // запуск анимации мигания
});

const isSubmitting = ref(false);
const isLoading = ref(false);
const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const userName = ref("");

const gameStore = useGameStore()


const backToPreviousPage = () => {
  // router.push(-1)
  router.push("/games")
};

const setNotify = (message, color = 'black') => {
  $q.notify({
    color: color,
    position: 'top',
    message: message,
    textColor: 'white',
  });
};


const submitName = async () => {
  isSubmitting.value = true;
  isLoading.value = true;

  if (!userName.value || userName.value.trim() === "") {
    setNotify("Please enter a valid name!", 'red');
    isSubmitting.value = false;
    isLoading.value = false;
    return;
  }

  // Генерируем уникальный суффикс
  const generateUniqueSuffix = () => {
    // Вариант 1: Простой timestamp + случайные символы
    const timestamp = Date.now().toString(36); // конвертируем время в 36-ричную систему
    const random = Math.random().toString(36).substring(2, 6); // 4 случайных символа
    return `${timestamp}${random}`;

    // Вариант 2: Только короткий ID (для красоты)
    // return Math.random().toString(36).substring(2, 8);

    // Вариант 3: Имя пользователя + короткий ID
    // const shortId = Math.random().toString(36).substring(2, 5);
    // return `${userName.value}_${shortId}`;
  };

  const uniqueSuffix = generateUniqueSuffix();
  const uniqueAgentName = `${userName.value}#${uniqueSuffix}`;

  try {
    const res = await api.auth.post(uniqueAgentName);
    localStorage.setItem('token', res.data.token);

    // Сохраняем красивое имя для отображения
    localStorage.setItem('agentName', userName.value);

    // Сохраняем полное уникальное имя для бэкенда
    localStorage.setItem('fullAgentName', uniqueAgentName);

    gameStore.setAgentName(uniqueAgentName);

    setNotify(`Hello, ${userName.value}! Your agent ID: ${uniqueSuffix}`);

    await router.push("/see-all-sets-of-words/");
  } catch (error) {
    setNotify("Registration failed. Please try again.", 'red');
    console.error('Registration error:', error);
  } finally {
    isSubmitting.value = false;
    isLoading.value = false;
  }
};

// настроить режим анонимных пользователей
// не пушится - удали этот коммент))


const continueAsGuest = async () => {
  // const res2 = await api.scores.post("tnt", 134, 2, 11);
  // const res3 = await api.scores.get();
  // console.log(res3);
  router.push("/see-all-sets-of-words")

  // при отправлении рекрда мы берем имя игры из раута, время в секундах, ошибки/читы, эйджент нэйм из локал
  // (сториджа)

  // $q.notify({ message: res2 });
};
</script>

<style lang="scss" scoped>




.inside-phone-frame {
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
  position: relative;
  height: 655px;
  width: 310px;
  background:
    linear-gradient(
        to top,
        #fff -250%,
        #000000 150%
    );
  margin: 5px auto;
  border-radius: 2em;
  border: solid 5px #6a6a6a;
  box-shadow:
    inset 0 0 2px 7px #000,
    inset 0 0 3px 7px #000,
    0 150px 200px -80px #000;
  overflow: auto;
}

.registration-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  margin-top: 20px;
}

.input-container {
  display: flex;
  justify-content: space-between;
  width: 80%;
  gap: 10px;
  align-items: center;

}

.name-input {
  padding: 10px;
  border-radius: 10px;
  border: 2px solid #6a6a6a;
  width: 165px;
  font-size: 22px;
  cursor: none;

}

.ok-btn {
  margin-left: 7px;
}

.guest-btn, .back-btn {
  margin-top: 10px;
  width: 100%;
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

.virtual-keyboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-top: 4px;
}

.keyboard-row {
  display: flex;
  gap: 2px;
}
.q-btn {
  cursor: none;

}
.kboardbutton {
  padding: 7px;
  font-size: 18px;
  border-radius: 5px;
  cursor: none;
  background-color: #333;
  color: white;
  border: none;
}

.kboardbutton:hover {
  background-color: #555;
}
.loading-message {
  text-align: center;
  font-size: 18px;
  margin-top: 10px;
  color: #ffffff;
  font-weight: bold;
  font-family: "Permanent Marker";
}
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4px; // как у .virtual-keyboard
  gap: 10px;
}

.loading-gif {
  width: 75%; // или аналогично размеру клавиатуры
  height: auto;
}

</style>
