<script setup>
import { defineProps, defineEmits, defineOptions } from 'vue'

defineProps({
  modelValue: Boolean
})

// 定义事件
const emit = defineEmits(['update:modelValue'])

// 设置 inheritAttrs 为 false（与选项式 API 的 inheritAttrs: false 等效）
defineOptions({
  inheritAttrs: false
})

// 处理 change 事件，触发更新
const updateValue = (event) => {
  emit('update:modelValue', event.target.checked)
}
</script>

<template>
  <label class="magic-check">
    <!-- 隐藏原生复选框，通过css控制视觉效果 -->
    <input
      type="checkbox"
      v-bind="$attrs"
      :checked="modelValue"
      @change="updateValue"
    />
    <span class="liquid-box">
      <span class="liquid-fill"></span>
      <span class="sparkle"></span>
    </span>
    <!-- 文字通过插槽自定义，默认值回退 -->
    <span class="magic-label">
      <slot></slot>
    </span>
  </label>
</template>

<style scoped>
/* 单个复选框容器 */
.magic-check {
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  position: relative;
  padding-left: 55px; /* 为左侧液态盒子留出空间 */
}

/* 隐藏原生input */
.magic-check input {
  position: absolute;
  opacity: 0;
}

/* 液态盒子 —— 始终为第三种配色风格 */
.liquid-box {
  position: absolute;
  left: 0;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

/* 液态填充 —— 统一使用第三种渐变色 (原 light green 配色) */
.liquid-fill {
  position: absolute;
  bottom: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #84fab0, #8fd3f4); /* 统一为第三种颜色 */
  clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  transition: all 0.8s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

/* 闪光点效果 */
.sparkle {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.8) 0%,
    transparent 70%
  );
  opacity: 0;
  transform: scale(0);
  transition: all 0.4s;
}

/* 文字标签 */
.magic-label {
  color: white;
  font-family: 'Segoe UI', sans-serif;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  transition: all 0.4s;
  letter-spacing: 0.5px;
}

/* 选中时的液态盒子：旋转 + 统一绿色调阴影 */
.magic-check input:checked ~ .liquid-box {
  transform: rotate(8deg);
  box-shadow: 0 0 20px rgba(132, 250, 176, 0.5); /* 统一为第三种颜色的阴影 */
}

/* 选中时液态填充升起 */
.magic-check input:checked ~ .liquid-box .liquid-fill {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  bottom: 0;
}

/* 选中时闪光点出现并脉冲 */
.magic-check input:checked ~ .liquid-box .sparkle {
  opacity: 1;
  transform: scale(1);
  transition-delay: 0.3s;
  animation: sparkle-pulse 1.5s infinite;
}

/* 选中时文字微动并加强发光 */
.magic-check input:checked ~ .magic-label {
  transform: translateX(5px);
  text-shadow: 0 0 15px currentColor;
}

/* 悬浮时液态盒子轻微放大 */
.magic-check:hover .liquid-box {
  transform: scale(1.05);
}

/* 闪光点脉冲动画 */
@keyframes sparkle-pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}
</style>