<template>
    <div>
        <div>
            <button class="closeThisPage" @click="backToIntroPage">back to intro page ❌</button>  
        </div>
        
    </div>

</template>

<script setup>
import { useRouter } from 'vue-router';



// посмотреть на какой платформе открыт сайт
import { useQuasar } from 'quasar';
const $q=useQuasar()
console.log($q.platform.is) 
// посмотреть на какой платформе открыт сайт


const router = useRouter()

const backToIntroPage = () => {
    router.push("/")
}

</script>

<style lang="scss" scoped>
.closeThisPage {
    display: block;
    margin: 10px auto;
    border-radius: 30px;
    background-color: transparent;
   
   }
</style>