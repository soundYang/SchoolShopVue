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
.magic-check {
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  position: relative;
  padding-left: 55px;
}

.magic-check input {
  position: absolute;
  opacity: 0;
}

.liquid-box {
  position: absolute;
  left: 0;
  width: 40px;
  height: 40px;
  background: var(--mg-white);
  border: var(--mg-border-light);
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

.liquid-fill {
  position: absolute;
  bottom: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--mg-black);
  clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  transition: all 0.8s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

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

.magic-label {
  color: var(--mg-black);
  font-family: var(--mg-font);
  font-size: 18px;
  font-weight: 700;
  transition: all 0.4s;
}

.magic-check input:checked ~ .liquid-box {
  transform: rotate(8deg);
  box-shadow: var(--mg-shadow-sm);
}

.magic-check input:checked ~ .liquid-box .liquid-fill {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  bottom: 0;
}

.magic-check input:checked ~ .liquid-box .sparkle {
  opacity: 1;
  transform: scale(1);
  transition-delay: 0.3s;
  animation: sparkle-pulse 1.5s infinite;
}

.magic-check input:checked ~ .magic-label {
  transform: translateX(5px);
}

.magic-check:hover .liquid-box {
  transform: scale(1.05);
}

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
