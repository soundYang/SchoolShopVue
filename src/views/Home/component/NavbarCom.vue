<script setup>
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const router = useRouter()

const userStore = useUserStore()
const jumpUser = () => {
  if(!userStore.Account.token){
    router.push('/login')
  }
  router.push('/user')
  
}
</script>

<template>
  <div class="container">
  <div @click="router.push('/layout')" data-text="首页" style="--r:-15;" class="glass">
    <i class="iconfont icon-shouye"></i>
  </div>
  <div data-text="全部商品" style="--r:5;" class="glass">
    <i class="iconfont icon-shangpin"></i>
  </div>
  <div data-text="每日盲盒" style="--r:25;" class="glass">
    <i class="iconfont icon-manghe"></i>
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
  background: linear-gradient(#fff2, transparent);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 25px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.5s;
  border-radius: 10px;
  margin: 0 -45px;
  backdrop-filter: blur(10px);
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
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
.container .glass i {
  font-size: 2.5em;
  fill: #fff;
}
</style>