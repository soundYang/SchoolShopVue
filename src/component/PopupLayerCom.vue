<script setup>
import { watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'close'])

// 关闭弹层
const close = () => {
  emit('update:visible', false)
  emit('close')
}

// 可选：监听 visible 变化，用于日志或副作用
watch(() => props.visible, (val) => {
  if (val) {
    // 弹层打开时的逻辑（如禁止背景滚动）
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}, { immediate: true })
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay">
      <div class="modal-card">
        <!-- 关闭按钮（X） -->
        <button class="close-btn" @click="close">✕</button>
        <!-- 内容插槽 -->
        <div class="modal-content">
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  width: 500px;
  min-height: 400px;
  background: var(--mg-white);
  position: relative;
  border: var(--mg-border);
  box-shadow: var(--mg-shadow);
  overflow: hidden;
  text-align: left;
  max-height: 90vh;
  overflow-y: auto;
}

/* 关闭按钮样式 */
.close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: var(--mg-border-light);
  background: var(--mg-white);
  font-size: 16px;
  line-height: 1;
  color: var(--mg-black);
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  font-weight: 700;
}

.close-btn:hover {
  background: var(--mg-black);
  color: var(--mg-white);
}

/* 内容区域，增加内边距避免被关闭按钮遮挡 */
.modal-content {
  padding: 40px 24px 24px 24px;
  position: relative;
  z-index: 1;
  color: var(--mg-black);
  font-family: var(--mg-font);
}
</style>
