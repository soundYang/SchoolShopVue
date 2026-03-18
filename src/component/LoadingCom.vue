<script setup>
defineProps({
  // 控制加载动画显示/隐藏
  show: {
    type: Boolean,
    default: false
  },
  // 遮罩层背景色（可半透明），默认透明黑色
  maskColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.3)'
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="loading-mask" :style="{ backgroundColor: maskColor }" @click.stop.prevent>
      <div class="spinner">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 极高层级，覆盖所有内容 */
  /* 不设置 pointer-events: none，因为遮罩本身要拦截点击 */
  /* 通过 @click.stop.prevent 阻止点击事件穿透和默认行为 */
}

.spinner {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  /* 移除之前的 margin-left: -75px，因为现在居中 */
  margin-left: 0;
}

.spinner span {
  position: absolute;
  top: 50%;
  left: var(--left);
  width: 35px;
  height: 7px;
  background: #ffff;
  animation: dominos 1s ease infinite;
  box-shadow: 2px 2px 3px 0px black;
}

.spinner span:nth-child(1) {
  --left: 80px;
  animation-delay: 0.125s;
}

.spinner span:nth-child(2) {
  --left: 70px;
  animation-delay: 0.3s;
}

.spinner span:nth-child(3) {
  left: 60px;
  animation-delay: 0.425s;
}

.spinner span:nth-child(4) {
  animation-delay: 0.54s;
  left: 50px;
}

.spinner span:nth-child(5) {
  animation-delay: 0.665s;
  left: 40px;
}

.spinner span:nth-child(6) {
  animation-delay: 0.79s;
  left: 30px;
}

.spinner span:nth-child(7) {
  animation-delay: 0.915s;
  left: 20px;
}

.spinner span:nth-child(8) {
  left: 10px;
}

@keyframes dominos {
  50% {
    opacity: 0.7;
  }
  75% {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
  80% {
    opacity: 1;
  }
}
</style>