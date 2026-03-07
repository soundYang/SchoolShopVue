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
  background-color: rgba(0, 0, 0, 0.6); /* 半透明黑色背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  /* 点击遮罩本身不关闭（由 @click.self 控制） */
}

.modal-card {
  width: 500px;           /* 增大卡片宽度，适应表单 */
  min-height: 400px;      /* 最小高度，可根据内容扩展 */
  background: #f8f9fa;
  border-radius: 12px;    /* 可选圆角 */
  position: relative;
  box-shadow: 15px 15px 50px #adb5bd75;
  overflow: hidden;
  transition: all 0.3s ease-in;
  /* 卡片悬停效果继承自您提供的样式，但去除文本相关 */
  text-align: left;       /* 内容默认左对齐，可根据需要覆盖 */
}

.modal-card:hover {
  cursor: pointer;
  box-shadow: none;
}

.modal-card::before {
  content: '';
  width: 100%;
  height: 0;
  background: #3f72ff;
  position: absolute;
  left: 0;
  bottom: 0;
  transition: 0.3s ease-in-out;
  z-index: -1;
}

.modal-card:hover::before {
  height: 100%;
}

/* 关闭按钮样式 */
.close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 24px;
  line-height: 1;
  color: #333;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border-radius: 50%;
}

.close-btn:hover {
  transform: scale(1.5);        /* 进入显现：放大 */
  color: #f8f9fa;               /* 与背景形成对比 */
  background-color: rgba(0,0,0,0.1);
}

.close-btn:not(:hover) {
  transform: scale(1);           /* 划出消失：恢复原大小 */
}

/* 内容区域，增加内边距避免被关闭按钮遮挡 */
.modal-content {
  padding: 40px 24px 24px 24px;  /* 上内边距留出空间给关闭按钮 */
  position: relative;
  z-index: 1;
  color: #333;
}
</style>