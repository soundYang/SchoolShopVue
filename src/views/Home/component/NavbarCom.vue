<script setup>
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const router = useRouter()

const userStore = useUserStore()
const jumpUser = () => {
  if(!userStore.token){
    return router.push('/login')
  }
  router.push('/user')
}

const jumpProductManagement = () => {
  if(!userStore.token){
    return router.push('/login')
  }
  router.push('/productManagement')
}
</script>

<template>
  <div class="container">
  <div @click="router.push('/layout')" data-text="首页" style="--r:-15;" class="glass">
    <i class="iconfont icon-shouye"></i>
  </div>
  <div @click="router.push('/allProduct')" data-text="全部商品" style="--r:5;" class="glass">
    <i class="iconfont icon-shangpin"></i>
  </div>
  <div @click="jumpProductManagement" data-text="商品管理" style="--r:25;" class="glass">
    <i class="iconfont icon-shangchuanshangpinxinxi"></i>
  </div>
  <div @click="jumpUser"  data-text="我的" style="--r:25;" class="glass">
    <i class="iconfont icon-mine-hover"></i>
  </div>
</div>

</template>

<style scoped>
.container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container .glass {
  opacity: 0;
  position: relative;
  width: 180px;
  height: 200px;
  background: var(--mg-white);
  border: var(--mg-border);
  box-shadow: var(--mg-shadow);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.5s, margin 0.5s;
  will-change: transform, opacity;
  margin: 0 -45px;
  transform: rotate(calc(var(--r) * 1deg));
  cursor: pointer;
}

.container:hover .glass {
  transform: rotate(0deg);
  margin: 0 10px;
}

.container .glass::before {
  content: attr(data-text);
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  background: var(--mg-black);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--mg-white);
  font-family: var(--mg-font);
  font-weight: 600;
  font-size: 14px;
  border-top: var(--mg-border-light);
}
.container .glass i {
  font-size: 2.5em;
  color: var(--mg-black);
}

[data-device="mobile"] .container .glass {
  width: 120px;
  height: 130px;
  margin: 0 -25px;
}
[data-device="mobile"] .container .glass i {
  font-size: 1.8em;
}
[data-device="mobile"] .container .glass::before {
  height: 30px;
  font-size: 12px;
}
</style>
