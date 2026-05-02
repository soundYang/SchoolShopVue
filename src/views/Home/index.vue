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

    <router-view v-slot="{ Component }">
      <keep-alive :include="['allProductPage']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
    
    <tailCom></tailCom>
   </div>
</template>

<style scoped>

</style>