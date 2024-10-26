<template>
 
    <div class="row" v-if="currentGameData">
        <div class="col" >
          <div 
            class="flex direction-column"
            :class="[engWord.active ? 'active':'',engWord.visible ? '':'invisible']" 
            v-for="engWord in engCards" 
            :key="engWord.id" 
            @click="changeActive(engWord.id, 'left')"
          >
            {{ engWord.lang }}
          </div>
        </div>
        <div class="col" >
            <div 
            class="flex direction-column"
            :class="[ruWord.active ? 'active':'',ruWord.visible ? '':'invisible']" 
            v-for="ruWord in ruCards" 
            :key="ruWord.id" 
            @click="changeActive(ruWord.id, 'right')"
            >
           {{ ruWord.lang }}
            </div>
        </div>
      </div>

</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import findPairsData from '../dataForGames/find-pairs-data';
import { computed, onMounted, ref, watch } from 'vue';

const router = useRouter()
const route = useRoute()

const shuffle = array => array.sort(() =>  Math.random() - 0.5)


// новая конструкция, которая считает сама себя

const currentMission = ref()
const currentGameData = ref()


const engCards = ref([])
const ruCards = ref([])

const sliceMin = ref(0)
const sliceMax = ref(6)

const splitCards = (lang) => {
    
    let words = currentGameData.value?.map(el =>  {
       
        return {
        id: el.id,
        lang: el[lang],
        active: false,
        visible: true
    }})

    words = words.slice(sliceMin.value,sliceMax.value)

    return shuffle(words)
}



const switchState = (side) => {
    
    switch (side) {
        case "left":
            engCards.value.forEach(el => el.active = false)
            break;
        case "right":
            ruCards.value.forEach(el => el.active = false)
            break;
        default:
            engCards.value.forEach(el => el.active = false)
            ruCards.value.forEach(el => el.active = false)
            break;
    }
    
   
}

const changeActive = (id, side) => {
    let engActive
    let ruActive

    if (side==="left") {
        switchState(side)
        engActive = engCards.value.find(el => el.id === id)
        engActive.active = true

        ruActive = ruCards.value.find(el => el.active)
        if (!ruActive) return

    } else {

        switchState(side)
        ruActive = ruCards.value.find(el => el.id === id)
        ruActive.active = true

        engActive = engCards.value.find(el => el.active)
        if (!engActive) return
        
    } 
    const matched = engActive.id === ruActive.id

    if (matched) deleteCards(ruActive, engActive)

    switchState()
}

const deleteCards = (ru,eng) => {
    
    ru.visible = false
    eng.visible = false
    const allInvisible = engCards.value.every(el => el.visible === false) 
    if (allInvisible) {
        sliceMax.value += 6
        sliceMin.value += 6
        ruCards.value = splitCards("ru");
        engCards.value = splitCards("eng");
    }

    finishGame()
    // // удалить из массива полностью
    // let ruIdx = ruCards.value.findIndex(el => el.id === ru)
    // let engIdx = engCards.value.findIndex(el => el.id === eng)
    
    // ruCards.value.splice(ruIdx,1)
    // engCards.value.splice(engIdx,1)

}

const finishGame = () => {
    if (sliceMin.value >= currentGameData.value.length) 
    console.log("вы нашли все пары, готовьте Ризотто!")
}
//тест от Егорчика
const multiplicationReult = (a,b) => {

return a * b

}


onMounted(()=> {
    currentMission.value = route.params.missionName
    currentGameData.value = findPairsData[currentMission.value]

    ruCards.value = splitCards("ru");
    engCards.value = splitCards("eng");
})
</script>

<style lang="scss" scoped>

.col {
    color: wheat;
}
.active {
    background-color: rgb(227, 227, 227);
    color: brown;
}
.invisible {
    opacity: 0;
    user-select: none;
}
</style>