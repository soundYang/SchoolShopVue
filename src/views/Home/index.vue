<script setup>
defineOptions({
  name: 'HomePage'
})

import headerCom from './component/headerCom.vue'
import tailCom from './component/tailCom.vue'
</script>

<template>
   <div>
    <headerCom></headerCom>

    <RouterView/>
    
    <tailCom></tailCom>
   </div>
</template>

<style scoped>

</style>