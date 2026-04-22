<script setup>
import { ref } from 'vue'
import { useBlindBoxStore } from '@/stores/model/blindBox'

const blindBoxStore = useBlindBoxStore()

// 定义 props
const props = defineProps({
  // 背景渐变（支持任何CSS background值）
  bgGradient: {
    type: String,
  },
  // 深色不规则形状的背景色
  bgShapeColor: {
    type: String,
    default: '#3a2e1f'
  },
  blindBox:{
    type: Object
  }
})

// 响应式状态
const isFlashing = ref(false)      // 高光闪烁
const isFading = ref(false)        // 磨砂褪去（永久）
const animationPlayed = ref(false) // 是否已播放过动画

const price = ref(props.blindBox.randomPrice)
const lable = ref(props.blindBox.label)

// 触发动画（仅一次）
const triggerAnimation = () => {
  if (animationPlayed.value) return
  animationPlayed.value = true

  // 启动高光动画
  isFlashing.value = true

  // 300ms 后高光结束，同时磨砂开始褪去（永久）
  setTimeout(() => {
    isFlashing.value = false
    isFading.value = true
  }, 500)
  if(!props.blindBox.isOpen){
    blindBoxStore.setBlindboxIsOpen(props.blindBox._id)
  }
}

if(props.blindBox.isOpen){
  triggerAnimation()
}
</script>

<template>
  <div class="glass-demo-container">
    <div
      class="glass-card"
      @click="triggerAnimation"
      v-if="blindBox._id"
    >
      <!-- 背景层：可自定义渐变和形状颜色 -->
      <div class="card-bg-layer" :style="{ background: bgGradient }">
        <div class="card-bg-shape" :style="{ backgroundColor: bgShapeColor }"></div>
      </div>

      <!-- 磨砂层（动态褪去） -->
      <div
        class="card-frost-center"
        :class="{ 'no-frost': isFading }"
      >
        <div class="spinner">
          <i class="iconfont icon-manghe"></i>
        </div>
      </div>

      <!-- 顶层内容：磨砂面板（动态褪去） -->
      <div class="card-content">
        <div
          class="frost-panel-full"
          :class="{ 'fade-blur': isFading }"
        >
          <span class="title">{{ !isFading ? '???' : lable }}</span>
          <span class="sub">{{ !isFading ? '???' : price }}</span>
          <div class="year">
            <span>store</span>
          </div>
        </div>
      </div>

      <!-- 高光动画层（点击时触发） -->
      <div
        class="card-highlight"
        :class="{ flash: isFlashing }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
/* 样式与之前完全相同，无需修改 */


.glass-card {
  position: relative;
  width: 200px;
  height: 300px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 35px -8px rgba(0, 0, 0, 0.5);
  transition: box-shadow 0.2s ease;
  cursor: pointer;
}

.glass-card:hover {
  box-shadow: 0 25px 40px -8px rgba(0, 0, 0, 0.6);
}

.card-bg-layer {
  position: absolute;
  inset: 0;
  padding: 4px;
  z-index: 1;
}

.card-bg-shape {
  width: 100%;
  height: 100%;
  border-radius: 12px 100px 40px 12px;
}

.card-frost-center {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background-color: transparent;
  z-index: 2;
  border-radius: inherit;
  transition: backdrop-filter 0.5s ease, -webkit-backdrop-filter 0.5s ease;
}

.card-frost-center.no-frost {
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
}

.spinner {
  width: 128px;
  height: 128px;
  border-radius: 9999px;
  background: linear-gradient(145deg, #f59e0b, #fbbf24);
  box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner>i {
  color: black;
  font-size: 60px;
}

.card-content {
  position: absolute;
  inset: 0;
  display: flex;
  z-index: 3;
  pointer-events: none;
}

.frost-panel-full {
  width: 100%;
  height: 100%;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background-color: rgba(249, 250, 251, 0.1);
  border-radius: 16px;
  color: #e5e7eb;
  font-family: 'Courier New', monospace, monospace;
  pointer-events: auto;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-sizing: border-box;
  transition: backdrop-filter 0.5s ease, -webkit-backdrop-filter 0.5s ease, background-color 0.5s ease;
}

.frost-panel-full.fade-blur {
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  background-color: transparent;
}

.frost-panel-full .title {
  font-size: 24px;
  font-weight: 500;
  line-height: 1.2;
}

.frost-panel-full .sub {
  font-size: 14px;
  color: #d1d5db;
  margin-top: 4px;
}

.frost-panel-full .year {
  margin-top: auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #d1d5db;
  letter-spacing: 1px;
}

.card-highlight {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
  border-radius: 16px;
}

.card-highlight::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 60%);
  opacity: 0;
  transform: translateY(-30%) rotate(15deg);
}

.card-highlight.flash::after {
  animation: highlightFlash 0.3s ease-out forwards;
}

@keyframes highlightFlash {
  0% {
    transform: translateY(-100%) rotate(15deg) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  30% {
    transform: translateY(-20%) rotate(10deg) scale(1.2);
    opacity: 0.8;
  }
  70% {
    transform: translateY(50%) rotate(0deg) scale(1.2);
    opacity: 0.6;
  }
  100% {
    transform: translateY(150%) rotate(-5deg) scale(1);
    opacity: 0;
  }
}

.frost-panel-full span {
  user-select: none;
}
</style>