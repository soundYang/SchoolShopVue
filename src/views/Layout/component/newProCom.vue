<script setup>
import shopCard from '@/component/shopCard.vue'
import router from '@/router'

defineProps({
  list: Array
})
// 计算旋转角度和动画延迟的辅助函数（直接在模板中使用，或定义方法）
const getCardStyle = (index, total) => {
  if (total === 0) return {}
  const angleStep = 360 / total
  const delayStep = 20 / total  // 总动画时长20秒
  return {
    transform: `translate(-50%, -50%) rotateY(${index * angleStep}deg) translateZ(280px)`,
    animationDelay: `-${index * delayStep}s`
  }
}
</script>

<template>
  <section>
    <h2 class="title">新鲜好物</h2>
    <div v-if="list && list.length" class="card-3d">
     <shopCard
         v-for="(item, index) in list"
        :key="item._id"
        :style="getCardStyle(index, list.length)"
        :product="item"
        @click="router.push(`/productDetail/${item._id}`)"
     />
    </div>
    <div v-else class="empty-hint">
      <span>暂无新鲜好物，敬请期待</span>
    </div>
  </section>
</template>

<style scoped>
/* 空状态提示 */
.empty-hint {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #999;
  font-size: 18px;
  letter-spacing: 2px;
}

/* 标题样式保持不变 */
.title {
  margin-left: 70px;
  margin-bottom: 20px;
  transform: skewX(-20deg);
  font-family: 'Courier New', Courier, monospace;
}
.title::before {
  content: "";
  display: block;
  width: 120px;
  height: 2px;
  background: white;
  margin-bottom: -40px;
  margin-left: -5px;
}

/* 全局动画定义不变 */
@keyframes autoRun3d {
  from {
    transform: perspective(800px) rotateY(-360deg);
  }
  to {
    transform: perspective(800px) rotateY(0deg);
  }
}

@keyframes animateBrightness {
  10% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(0.1);
  }
  90% {
    filter: brightness(1);
  }
}

.card-3d {
  position: relative;
  width: 100%;
  height: 20vw;          /* 根据需求调整，例如 300px */
  transform-style: preserve-3d;
  transform: perspective(800px);
  animation: autoRun3d 20s linear infinite;
  will-change: transform;
  margin: 100px auto;
}

.card-3d div {
  position: absolute;
  width: 200px;
  height: 330px;
  background-color: rgb(199, 199, 199);
  border: solid 2px lightgray;
  border-radius: 0.5rem;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  animation: animateBrightness 20s linear infinite;
  transition-duration: 200ms;
  will-change: transform, filter;
}

/* 悬停任意卡片时暂停所有动画 */
.card-3d:has(div:hover) {
  animation-play-state: paused !important;
}
.card-3d:has(div:hover) div {
  animation-play-state: paused !important;
}

/* 移除所有静态的 nth-child 样式，现在通过内联样式动态控制 */

[data-device="mobile"] .title {
  margin-left: 20px;
  font-size: 20px;
}
[data-device="mobile"] .title::before {
  width: 80px;
  margin-bottom: -28px;
  margin-left: -5px;
}
[data-device="mobile"] .card-3d {
  height: 40vw;
  margin: 50px auto;
  animation-duration: 30s;
  transform: perspective(400px);
}
[data-device="mobile"] .card-3d div {
  width: 130px;
  height: 220px;
  animation: none;
  filter: brightness(1) !important;
}
</style>
