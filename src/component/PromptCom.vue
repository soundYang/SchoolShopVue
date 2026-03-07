<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="toastState.visible" class="glitch-toast" :style="{ zIndex: 9999 }">
        <div class="glitch-toast-content">
          <!-- 使用插槽自定义内容，若无插槽则显示 toastState.text -->
          <span
            class="glitch-toast-text"
            :data-text="displayText"
          >  
          <i class="iconfont icon-tishi"></i>
          
            <slot>
               {{ toastState.text }}
            </slot>
          </span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { toastState } from '@/composables/useToast'

// 计算最终显示的纯文本（用于 data-text 属性，保证 glitch 效果）
const displayText = computed(() => {
  // 如果有插槽内容，尝试获取其纯文本（此处简化为直接使用 toastState.text，
  // 实际项目中可通过更复杂的方式获取插槽文本，但通常插槽用于简单文本即可）
  // 为了保持 glitch 效果，我们仍然使用 toastState.text 作为 data-text，
  // 插槽内容会被渲染，但 glitch 伪元素基于 data-text，两者可能不一致。
  // 建议：若使用插槽，请确保插槽内容为纯文本且与 toastState.text 一致，
  // 或直接通过插槽传递文本，不使用 data-text 属性（可关闭 glitch）。
  // 为简化，此处假设插槽内容也是纯文本，并与 toastState.text 相同。
  return toastState.text
})
</script>

<style scoped>
@keyframes glitch-anim {
  0% {
    transform: translate(0);
    clip-path: inset(0 0 0 0);
  }
  10% {
    transform: translate(-2px, 1px);
    clip-path: inset(30% 0 15% 0);
  }
  20% {
    transform: translate(1px, -1px);
    clip-path: inset(10% 0 55% 0);
  }
  30% {
    transform: translate(-1px, 2px);
    clip-path: inset(70% 0 5% 0);
  }
  40% {
    transform: translate(2px, -1px);
    clip-path: inset(45% 0 30% 0);
  }
  50% {
    transform: translate(0);
    clip-path: inset(0 0 0 0);
  }
  100% {
    transform: translate(0);
    clip-path: inset(0 0 0 0);
  }
}

/* 伪元素专用关键帧：在动画过程中保持原有的透明度，
   结束时透明度变为0，从而隐藏伪元素 */
@keyframes glitch-pseudo-anim {
  0% {
    transform: translate(0);
    clip-path: inset(0 0 0 0);
    opacity: var(--pseudo-opacity, 0.7);
  }
  10% {
    transform: translate(-2px, 1px);
    clip-path: inset(30% 0 15% 0);
    opacity: var(--pseudo-opacity, 0.7);
  }
  20% {
    transform: translate(1px, -1px);
    clip-path: inset(10% 0 55% 0);
    opacity: var(--pseudo-opacity, 0.7);
  }
  30% {
    transform: translate(-1px, 2px);
    clip-path: inset(70% 0 5% 0);
    opacity: var(--pseudo-opacity, 0.7);
  }
  40% {
    transform: translate(2px, -1px);
    clip-path: inset(45% 0 30% 0);
    opacity: var(--pseudo-opacity, 0.7);
  }
  50% {
    transform: translate(0);
    clip-path: inset(0 0 0 0);
    opacity: var(--pseudo-opacity, 0.7);
  }
  100% {
    transform: translate(0);
    clip-path: inset(0 0 0 0);
    opacity: 0; /* 动画结束时完全透明，不再影响原文字 */
  }
}

.glitch-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 300px;
  background-color: #0d0d0d;
  border: 1px solid rgba(0, 242, 234, 0.3);
  box-shadow: 0 0 20px rgba(0, 242, 234, 0.2), inset 0 0 10px rgba(0, 0, 0, 0.5);
  padding: 12px 20px;
  font-family: 'Fira Code', Consolas, 'Courier New', Courier, monospace;
  color: #00f2ea;
  overflow: hidden;
}

.glitch-toast-content {
  position: relative;
}

.glitch-toast-text {
  position: relative;
  display: inline-block;
  color: #00f2ea;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  /* 主文字动画：播放一次，结束后回到默认样式（无透明度问题） */
  animation: glitch-anim 1.5s 1 cubic-bezier(0.25, 0.46, 0.45, 0.94);
  /* 注意：没有 forwards，动画结束后使用自身样式 */
}

.glitch-toast-text::before,
.glitch-toast-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0d0d0d;
  clip-path: inset(0 0 0 0);
  /* 使用伪元素专用关键帧，播放一次并保持最后一帧（透明） */
  animation: glitch-pseudo-anim 1.5s 1 cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  /* 默认透明度由变量控制，动画过程会使用关键帧中定义的变量值 */
}

.glitch-toast-text::before {
  --pseudo-opacity: 0.7; /* 原 before 的透明度 */
  color: #a855f7;
}

.glitch-toast-text::after {
  --pseudo-opacity: 0.5; /* 原 after 的透明度 */
  color: #00f2ea;
}

/* 淡入淡出过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>