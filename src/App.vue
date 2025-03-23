<template>
  <router-view />

</template>



<script setup>
import {onMounted, ref} from "vue";
import {api} from "src/api";

const token = ref()

defineOptions({
  name: 'App'
});
// onMounted(async ()=>{
//   const res = await api.fileData.post('egor')
// token.value = res?.data?.token
//   console.log(token)
// })
//


</script>


