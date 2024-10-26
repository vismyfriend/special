<template>
  <div> 
    <p class="bubble left think" id="intro-message">Choose<br> a game</p>
    <img class="a-girl" src="../assets/images/special logo detective girl 2.png" alt="logo">
    <!-- ask здесь нужно вместо кнопки выйти из приложения поставить кнопку назад - как один элемент из Layout чтобы конкретно на этой странице не отображался -->
    <!-- ask и еще здеь дублируются кнопки почему то -->
    <q-btn push color="brown-5" @click="backToPreviousPage">📷 back to other missions 🔎 </q-btn>
      <div class="v-cards-choose" v-for="currentGame in AllGames" :key="currentGame.id"> 
         <div class="v-card-choose" v-if="currentGame.active" @click="startGame(currentGame?.path)">{{ currentGame.name }} 
           <q-btn icon="star" class="glossy" round color="deep-orange"  />
        </div>
      </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import deckOfCardsData from "../dataForGames/deck-of-cards-data"
import findPairsData from '../dataForGames/find-pairs-data';
import tntData from 'src/dataForGames/tnt-data';
import trickyQuizData from 'src/dataForGames/tricky-quiz-data';
import helpBenderData from 'src/dataForGames/help-bender-data';
import storiesData from 'src/dataForGames/stories-data';
import scrambledData from 'src/dataForGames/scrambled-data';
import homeworkLinksData from 'src/dataForGames/homework-links-data';
import hwData from 'src/dataForGames/hw-data';

const router = useRouter()
const route = useRoute()

const AllGames = ref([
  {
    id: 0,
    name: "Find pairs",
    path: "find-pairs",
    gameData: findPairsData,
    active: true, 
  },
  {
    id: 1,
    name: "TNT",
    path: "tnt",
    gameData: tntData,
    active: true
  },
  {
    id: 2,
    name: "A deck of cards",
    path: "deck-of-cards",
    gameData: deckOfCardsData,
    active: false
  },
  {
    id: 3,
    name: "Tricky quiz",
    path: "tricky-quiz",
    gameData: trickyQuizData,
    active: true
  },
  {
    id: 4,
    name: "Help Bender",
    path: "bender",
    gameData: helpBenderData,
    active: true
  },
  {
    id: 5,
    name: "Истории",
    path: "stories",
    gameData: storiesData,
    active: true
  },
  {
    id: 6,
    name: "Распутай слово",
    path: "scrambled",
    gameData: scrambledData,
    active: true
  },
  {
    id: 7,
    name: "Разные домашки",
    path: "hw-links",
    gameData: homeworkLinksData,
    active: true
  },
  {
    id: 8,
    name: "Ссылка на домаху",
    path: "hw",
    gameData: hwData,
    active: true
  },
 


])

const startGame = (path) => {
  router.push(`/special-app/${route.params.missionName}/${path}`)
}

const backToPreviousPage = () => {
  // router.push(-1)
  router.push("/special-app/")
}

const compareNames = () => {
  AllGames.value.forEach(el => {
    const gameExists = el.gameData?.hasOwnProperty(route.params.missionName)  
    el.active = gameExists
  })

 

}

onMounted(()=>{
    compareNames()
   
    
})
</script>

<style lang="scss" scoped>

.closeThisPage {
 display: block;
 margin: 0 auto;
 border-radius: 30px;
 background-color: transparent;

}

.v-cards-choose {
  display: flex;
  flex-wrap: wrap; /* Позволяет карточкам переходить на новую строку */
  user-select: none;
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
  padding: 30px;
  
   &:before {
     content: '';
     position: absolute;
     bottom: -50px;
     height: 50px;
     width: 90px;
     
   }
  
  &.left {
    float: left;
    margin: -23px 11px 62px 176px;
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