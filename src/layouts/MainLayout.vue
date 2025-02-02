<template>
  <img class="backgroundImg" :src="currentBackgroundDay?.img" alt="">

  <div class="main-wrapper">
    <div class="wrapper"> 
      <router-view />
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const currentBackgroundDay = ref()
const backgrounds = ref([
        {
        day: 0, 
        img: "/src/assets/images/background.jpg",
        
        },
        {
        day: 1, 
        img: "/src/assets/images/background.jpg",
        
        },
        {
        day: 2, 
        img: "/src/assets/images/background1.jpg",
        
        },
        {
        day: 3, 
        img: "/src/assets/images/background2.jpg",
        
        },
        {
        day: 4, 
        img: "/src/assets/images/background3.jpg",
        
        },
        {
        day: 5, 
        img: "/src/assets/images/background4.jpg",
        
        },
        {
        day: 6, 
        img: "/src/assets/images/background3.jpg",
        
        },
        {
        day: 7, 
        img: "/src/assets/images/background3.jpg",
        
        },
       
])

onMounted(()=>{
       
  const currentDay = new Date().getDay()
  currentBackgroundDay.value = backgrounds.value.find(el => el.day === currentDay)  
       
})

</script>


<style lang="scss" scoped>
@import url(https://fonts.googleapis.com/css?family=Permanent+Marker);
.main-wrapper {
  display: flex;
  justify-content: center;
  

  .wrapper {
    width: 310px;
    display: flex;
    flex-direction: column;
  }
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
</style>