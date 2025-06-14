<template>
  <router-view />

</template>



<script setup>
import {onMounted, ref} from "vue";
import {api} from "src/api";
import { useQuasar } from "quasar";

const token = ref()

defineOptions({
  name: 'App'
})

const $q = useQuasar()
const setNotify = (message, color = 'red') => {
  $q.notify({
    color: color,
    position: 'top',
    message: message,
    textColor: 'white',
  })
}

onMounted(async ()=>{
  const res = await api.backEndTest.health()
  if (res.status !== 200) {
    setNotify('Ой ой, у нас ошибка бэкэндИны. Отправь скриншот советскому учителю')
  }
  // console.log(res)
})



</script>


