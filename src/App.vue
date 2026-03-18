<script setup>
import PromptCom from '@/component/PromptCom.vue'
import LoadingCom from './component/LoadingCom.vue'

import { useLoadingStore } from '@/stores'

const loadingStore = useLoadingStore()
</script>

<template>
  <router-view />
  <!-- 提示框 -->
  <PromptCom />
  <!-- 加载动画 -->
  <LoadingCom :show="loadingStore.isLoading"/>
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
  background: rgb(33, 33, 33);
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
