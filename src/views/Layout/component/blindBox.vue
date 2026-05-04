<script setup>
import blindBoxCard from './blindBoxCard.vue'
import patticleClock from './patticleClock.vue'

import { ref } from 'vue'
import { useBlindBoxStore } from '@/stores'
import { storeToRefs } from 'pinia'

import goldenImg from '@/assets/Golden.png'
import purpleImg from '@/assets/Purple.png'
import blueImg from '@/assets/blue.png'
import greenImg from '@/assets/green.png'

/**
 * 价格数据 [0.99  6.99 9.99  19.9 39.9  69.9]
 */

const blindBoxStore = useBlindBoxStore()
const { blindBox, blindBoxOpen, blindBoxCount } = storeToRefs(blindBoxStore)
blindBoxStore.getBlindBox()

const color = ref([
  {
    bgGradient: 'linear-gradient(145deg, #fbbf24, #b45309)',
    image: goldenImg
  },
  {
    bgGradient: 'linear-gradient(145deg, #B223FB, #4A08B4)',
    image: purpleImg
  },
  {
    bgGradient: 'linear-gradient(145deg, #236BFB, #0872B4)',
    image: blueImg
  },
  {
    bgGradient: 'linear-gradient(145deg, #23FB23, #3CB408)',
    image: greenImg
  },
])

const colorSelect = (price) => {
  let index
  if(price === 0.99){
    index = 0
  }else if(price === 6.99 || price === 9.99){
    index = 1
  }else if(price === 19.9 || price === 39.9){
    index = 2
  }else if(price === 69.9){
    index = 3
  }
  return index
}

</script>

<template>
  <section class="blindBox">
    <h2 class="title">每日盲盒</h2>
    <div>
      <span class="time">下次刷新时间：</span><patticle-clock width="500px" height="200px"/>
    </div>
    <div v-if="blindBox.length">
        <blind-box-card
        v-for="(item, index) in blindBox"
        :key="index"
        :blindBox="item"
        :bg-gradient="color[colorSelect(item.randomPrice)].bgGradient"
        :bg-shape-color="color[colorSelect(item.randomPrice)].bgShapeColor"
        :bg-image="color[colorSelect(item.randomPrice)].image"
      />
    </div>
    <div v-else-if="!blindBoxOpen" class="empty-tip">
      <div class="closed-tip">
        <span class="closed-title">盲盒暂未开放</span>
        <span class="closed-desc">当前 <em>{{ blindBoxCount }}</em> 种盲盒商品，满 150 种开放</span>
      </div>
    </div>
    <div v-else class="empty-tip">
      <span>暂时无盲盒</span>
    </div>
  </section>
</template>

<style scoped>
.title{
  margin-left: 70px;
  margin-bottom: 100px;
  /* 字体倾斜 */
  transform: skewX(-20deg);
  font-family: 'Courier New', Courier, monospace;
}
.title::before{
  content: "";
  display: block;
  width: 120px;
  height: 2px;
  background: white;
  margin-bottom: -40px;
  margin-left: -5px;
}
.blindBox{
  min-height: 45vw;
}
.blindBox>div {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', Roboto, system-ui, sans-serif;
  padding: 1rem;
  gap: 40px;
}
.time{
  font-size: 40px;
  font-family: '华文新魏';
}
.empty-tip {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-tip span {
  font-size: 28px;
  color: #999;
  font-family: '华文新魏';
}
.closed-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.closed-title {
  font-size: 32px;
  color: #ff6b6b;
  font-family: '华文新魏';
}
.closed-desc {
  font-size: 20px;
  color: #bbb;
  font-family: '华文新魏';
}
.closed-desc em {
  font-style: normal;
  font-size: 26px;
  color: #fbbf24;
  font-weight: bold;
}

[data-device="mobile"] .title {
  margin-left: 20px;
  margin-bottom: 50px;
  font-size: 20px;
}
[data-device="mobile"] .title::before {
  width: 80px;
  margin-bottom: -28px;
}
[data-device="mobile"] .blindBox>div {
  flex-direction: column;
  gap: 12px;
  padding: 0.5rem;
}
[data-device="mobile"] .time {
  font-size: 20px;
}
[data-device="mobile"] .empty-tip {
  min-height: 150px;
}
[data-device="mobile"] .empty-tip span {
  font-size: 18px;
}
[data-device="mobile"] .closed-title {
  font-size: 22px;
}
[data-device="mobile"] .closed-desc {
  font-size: 14px;
}
[data-device="mobile"] .closed-desc em {
  font-size: 18px;
}
</style>
