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
onMounted(async ()=>{
  const res = await api.backEndTest.test()
  const res2 = await api.backEndTest.testBd()
// token.value = res?.data?.token
  console.log(res,res2)
})



</script>


