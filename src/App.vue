<script setup>

</script>

<template>
  <router-view>
    
  </router-view>
</template>

<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
a{
  text-decoration: none;
}
ul{
  list-style: none;
}
body{
  background: black;
  color: white;
}
html {
  overflow: scroll; /* 确保滚动功能可用 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 和 Edge 旧版 */
}

html::-webkit-scrollbar {
  display: none; /* Chrome, Safari, 新版 Edge */
}
</style>
