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
.glitch-toast {
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 99999;
  pointer-events: none;
}

.glitch-toast-content {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 260px;
  max-width: 380px;
  padding: 14px 20px;
  background: var(--mg-white);
  border: var(--mg-border);
  box-shadow: var(--mg-shadow);
  font-family: var(--mg-font);
  font-size: 14px;
  font-weight: 600;
  color: var(--mg-black);
}

.glitch-toast-text {
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.4;
}

.glitch-toast-text i {
  font-size: 18px;
  flex-shrink: 0;
}

/* 过渡动画 */
.fade-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-leave-active {
  transition: all 0.3s ease-in;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(120px) scale(0.9);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(120px) scale(0.9);
}

[data-device="mobile"] .glitch-toast {
  top: auto;
  bottom: 16px;
  right: 16px;
  left: 16px;
}

[data-device="mobile"] .glitch-toast-content {
  min-width: 0;
  max-width: 100%;
  padding: 12px 16px;
  font-size: 13px;
}
</style>