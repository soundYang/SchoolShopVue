<script setup>
defineOptions({ name: 'managePage' })

import navbarCom from './component/navbarCom.vue'
</script>

<template>
  <div class="manageBox">
    <div class="navbar">
      <navbarCom />
    </div>

    <div class="body">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.manageBox {
  width: 100%;
  height: 100vh;
  display: flex;
}
.manageBox>div{
  margin-top: 66px;
}
.navbar{
  flex: 1;
  border-right: 1px solid white;
}
.body{
  flex: 5;
}
</style>