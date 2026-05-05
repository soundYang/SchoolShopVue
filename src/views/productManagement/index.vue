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
  height: 140vh;
  display: flex;
  font-family: var(--mg-font);
}
.manageBox>div{
  margin-top: 66px;
}
.navbar{
  flex: 1;
  border-right: var(--mg-border-light);
}
.body{
  flex: 5;
}

[data-device="mobile"] .manageBox {
  height: auto;
  min-height: 100dvh;
  flex-direction: column;
}

[data-device="mobile"] .manageBox>div{
  margin-top: 56px;
}

[data-device="mobile"] .navbar{
  flex: none;
  border-right: none;
  border-bottom: var(--mg-border-light);
  width: 100%;
  overflow-x: auto;
}

[data-device="mobile"] .body{
  flex: none;
  width: 100%;
}
</style>
