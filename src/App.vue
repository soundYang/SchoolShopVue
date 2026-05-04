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
  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html::-webkit-scrollbar {
  display: none;
}

:root {
  --direction: row;
  --direction-wrap: row;
  --direction-nav: row;
  --columns: 4;
  --columns-sm: 3;
  --gap: 60px;
  --gap-sm: 20px;
  --show-desktop: flex;
  --show-mobile: none;
  --base-font: 16px;
  --btn-scale: 1;
}

[data-device="mobile"] {
  --direction: column;
  --direction-wrap: column;
  --direction-nav: nowrap;
  --columns: 2;
  --columns-sm: 2;
  --gap: 12px;
  --gap-sm: 8px;
  --show-desktop: none;
  --show-mobile: flex;
  --base-font: 14px;
  --btn-scale: 0.92;
}

[data-device="mobile"] body {
  font-size: 14px;
}

button:active,
.btn:active,
.button:active,
[role="button"]:active {
  transform: scale(0.96) !important;
  transition: transform 0.1s ease !important;
}

* {
  -webkit-tap-highlight-color: transparent;
}
</style>
