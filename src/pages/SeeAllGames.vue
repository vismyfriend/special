<template>
  <div class="relative">
    <div class="phone-content">

      <div id="phoneFrame">
        <p class="bubble left" id="intro-message">Choose<br> a game</p>

        <div class="q-pa-15">
          <img src="../assets/images/special logo detective girl.png" alt="logo">
          <div class="registrationContainer">
            <button class="registrationBtn" @click="goToRegistration">
              {{ registrationButtonText }}
            </button>
            <div class="miniButtons">
              <!-- Показываем разные кнопки в зависимости от наличия имени -->
              <template v-if="hasName">
                <button class="btn-switch-name" title="сменить имя" @click="onAccept"><></button>
                <button class="btn-accept" title="Действие 2" @click="onQuestionClick">✔</button>
              </template>
              <template v-else>
                <button class="btn-close" title="Отказаться" @click="onDecline">✕</button>
                <button class="btn-accept" title="Согласен" @click="onAccept">✔</button>
              </template>
            </div>
          </div>
          <div class="games-grid">
            <div
              class="game-card"
              :style="{'background-image': `url(${getImagePath(game.icon)})`}"
              v-for="game in availableGames"
              :key="game.id"
              role="button"
              @click="goToGameSelection(game)"
            >
              <div class="game-name">{{ game.name }}</div>
              <q-tooltip v-if="game.description">{{ game.description }}</q-tooltip>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import { AllGames } from "src/dataForGames/allGamesAndSetsOfWordsList";
import { api } from "src/api";
import {useGameStore} from "stores/example-store";

const gameStore = useGameStore();


const text = "test all\ngames";
const speed = 150;
const router = useRouter();

// Проверяем, есть ли имя (и оно не 'nonameYet')
const hasName = computed(() => {
  const name = localStorage.getItem('agentName');
  return name && name !== 'nonameYet';
});

const registrationButtonText = computed(() => {
  return hasName.value
    ? `Привет ${localStorage.getItem('agentName')} если это не ты, нажми на стрелки, а если ты, то нажимай галку`
    : 'Создать аккаунт спэшл эйджент и получить доступ ко всем наборам слов?';

});


// Обработчики для новых кнопок


const onQuestionClick = async () => {
  const savedName = localStorage.getItem('agentName');

  if (!savedName) {
    console.error('Имя не найдено в localStorage');
    return;
  }

  // Проверяем токен
  if (!localStorage.getItem('token')) {
    try {
      const res = await api.auth.post(savedName);
      localStorage.setItem('token', res.data.token);
    } catch (error) {
      console.error('Ошибка при получении токена:', error);
    }
  }

  // Убедимся, что имя установлено в хранилище
  gameStore.setAgentName(savedName);
  await router.push("/see-all-sets-of-words/");
};

  const onAccept = () => {
  // Переход на регистрацию
  goToRegistration();
};

const onDecline = () => {
  // Скрыть блок с кнопками или вывести сообщение
  const container = document.querySelector(".registrationContainer");
  if (container) container.style.display = "none";
};

// Функция для корректного формирования пути к изображению
const getImagePath = (iconName) => {
  return new URL(`../assets/images/${iconName}`, import.meta.url).href;
};

const availableGames = ref(AllGames);

const goToGameSelection = (game) => {
  if (game.externalUrl) {
    window.open(game.externalUrl, "_blank");
  } else {
    router.push({ path: game.route });
  }
};

const goToRegistration = () => {

  router.push("/registration")
};

const userLocalStorageName = ref('');


onMounted(() => {
  userLocalStorageName.value = localStorage.getItem('agentName') || 'nonameYet';
  console.log("Name in local storage : " + userLocalStorageName.value);

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
.games-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 20px;
}

.game-card {
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  transition: all 0.3s ease;
  cursor: none;
  height: 120px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);

    z-index: 1;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);

    &::before {
      background: rgba(0, 0, 0, 0.1);
    }
  }
}

.game-name {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: white;
  position: relative;
  z-index: 2;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
  background: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 10px;
}

/* Адаптация под мобильные устройства
@media (max-width: 600px) {
  .games-grid {
    grid-template-columns: 1fr;
  }

  .game-icon-container {
    width: 50px;
    height: 50px;
  }
}
*/


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
  cursor: none;
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

.phone-content {

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

.registrationContainer {
  position: relative;
  display: inline-block;
}
.registrationBtn {
  position: relative; /* для псевдоэлемента */
  overflow: hidden;
  width: 100%;
  padding: 10px 12px 17px 12px;
  margin: 0;
  border-radius: 10px;
  line-height: 1.2;
  font-weight: bold;
  color: white;
  background: linear-gradient(to top, #007BFF, #339CFF);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -2px 4px rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  cursor: none;
  font-size: 16px;
}

.registrationBtn::before {
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

.registrationBtn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.4), inset 0 -2px 4px rgba(255, 255, 255, 0.2);
}

.registrationBtn:active {
  transform: translateY(1px);
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.4);
}



.miniButtons {
  position: absolute;
  bottom: -13px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 13px;
}
.q-btn {
  cursor: none;

}
.miniButtons button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 15px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  cursor: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
  }
}

.btn-close {
  background: linear-gradient(to bottom, #ff4d4d, #cc0000);
}

.btn-accept {
  background: linear-gradient(to bottom, #4CAF50, #2E7D32);
}
.btn-switch-name {
  background: linear-gradient(to bottom, #FBBC05, #f9ab00);
}

</style>


