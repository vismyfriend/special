<!-- vbase-3-setup -->
<template>
  <div class="relative"> 
    <div id="phoneFrame" >
      <p class="bubble left" id="intro-message">Choose<br> a mission</p>
<!-- ask v-if="q.platform.is.desktop" добавить к диву, чтобы только с компьютера видно было, если добавляю пропадает весь див с содержимым -->
<!-- отображение элементов на разных платформах -->
<!-- 001 если с мобильного теефона кто-то открывает сайт, то эта картинка не отображается,
она только для десктопной версии. (если телефон горизонтально разворачивают, то тоже можно убрать рамку) -->

<!-- <img class="phoneFrame" v-if="$q.platform.is.desktop" src="../assets/images/phone frame.png" alt="logo"> -->
      <img class="backgroundImg" src="/src/assets/images/backgroundBlur.jpg" alt="blur">

      <div class="q-pa-15">
        <img src="../assets/images/special logo detective girl.png" alt="logo">
        <div class="v-cards-choose" v-for="currentSetOfWords in AllSetsOfWords" :key="currentSetOfWords.id"> 
          <div class="v-card-choose" v-if="currentSetOfWords.active" @click="goToChosenGame(`/special-app/${currentSetOfWords.missionName}`)">
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

const router = useRouter()
const $q=useQuasar()

const AllSetsOfWords = ref([
  {
    missionName: "devmode0",
    description: "протестировать игры",
    id: 0,
    active: true, 
  },
  {
    missionName: "digits1",
    description: "цифры от 0 до 9",
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
    id: 6,
    active: true
  },
  {
    missionName: "missssssion",
    description: "новый набор слов и выражений",
    id: 7,
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

  router.push({path:route})
  
}


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
  flex-wrap: wrap; /* Позволяет карточкам переходить на новую строку */

}

.v-card-choose {
  background-color: #f9f9f9; /* Цвет фона карточки */
  border: 1px solid #ddd; /* Цвет границы */
  border-radius: 20px; /* Закругление углов */
  padding: 5px 20px; /* Внутренние отступы */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Тень */
  cursor: pointer; /* Указатель мыши при наведении */
  transition: transform 0.2s, box-shadow 0.2s; /* Плавный переход при наведении */
margin: 1.5px;
user-select: none;

}

.v-card-choose:hover {
  transform: scale(1.05); /* Увеличение карточки при наведении */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Увеличенная тень при наведении */
  user-select: none;

}

.closeThisPage {

  display: block;
  margin: 0 auto;
}

#phoneFrame {
  position: relative;
  height: 600px;
  width: 310px;
  background: 
    linear-gradient(
      to top,
      #fff -250%,
      #000000 150%
    )
    ;
  margin: 2em auto;
  border-radius: 2em;
  border: solid 5px #6a6a6a;
  box-shadow: 
    inset 0 0 2px 7px #000,
    inset 0 0 3px 7px #000,
    0 150px 200px -80px #000,
    ;
    overflow: auto;

  
  &::before {
    text-align: center;
    word-spacing: 6em;
    color: #fff;
    font-family: helvetica;
    font-size: .7em;
    display: block;
    height: 240px;
    width: 240px;
    position: absolute;
    margin: 30px;
    
  }
}

.bubble {
  text-align: center;
  user-select: none;
  font-family: "Permanent Marker";
  font-size: 17px;
  display: inline-block;
  position: absolute;
  padding: 30px 40px;
  border-radius: 10px;
  border: 3px solid black;
  background: white;
  clear: both;
  
  padding: 16px 17px;

  
   &:before {
     content: '';
     position: absolute;
     bottom: -50px;
     height: 50px;
     width: 90px;
     
   }
  
  &.left {
    float: left;
    margin: 6px 1px 62px 176px;


    
    &:before {
      border-radius: 0 0 100%;     
      box-shadow: 
        -2px -2px 0 0 #000 inset,
        -23px 0 0 0 #fff inset,
        -25px -2px 0 0 #000 inset;
      left: 0;
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