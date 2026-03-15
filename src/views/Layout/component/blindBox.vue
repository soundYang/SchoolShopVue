<script setup>
import blindBoxCard from './blindBoxCard.vue'
import { ref } from 'vue'

const color = ref([
  {
    bgGradient: 'linear-gradient(145deg, #fbbf24, #b45309)'
  },
  {
    bgGradient: 'linear-gradient(145deg, #23FB23, #3CB408)'
  },
  {
    bgGradient: 'linear-gradient(145deg, #B223FB, #4A08B4)'
  },
  {
    bgGradient: 'linear-gradient(145deg, #236BFB, #0872B4)'
  },
])
</script>

<template>
  <section class="blindBox">
    <h2 class="title">每日盲盒</h2>
    <div>
        <blind-box-card
        v-for="(item, index) in color"
        :key="index"
        :bg-gradient="item.bgGradient"
        :bg-shape-color="item.bgShapeColor"
      />
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
</style>