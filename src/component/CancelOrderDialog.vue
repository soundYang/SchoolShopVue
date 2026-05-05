<script setup>
import { ref } from 'vue'
import PopupLayerCom from './PopupLayerCom.vue'

defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '取消订单'
  }
})

const emit = defineEmits(['update:visible', 'confirm', 'close'])

const reason = ref('')

const handleClose = () => {
  reason.value = ''
  emit('update:visible', false)
  emit('close')
}

const handleConfirm = () => {
  emit('confirm', reason.value)
  reason.value = ''
}

const handleCancel = () => {
  handleClose()
}
</script>

<template>
  <PopupLayerCom :visible="visible" @update:visible="handleClose" @close="handleClose">
    <form class="form">
      <div class="title">{{ title }}<br><span>Cancel Order</span></div>
      <textarea
        v-model="reason"
        class="input textarea"
        placeholder="请输入取消原因（可选）"
        rows="4"
        maxlength="200"
      />
      <span class="char-count">{{ reason.length }}/200</span>

      <div class="dialog-actions">
        <button type="button" class="button-confirm cancel" @click="handleCancel">再想想</button>
        <button type="button" class="button-confirm" @click="handleConfirm">确认取消</button>
      </div>
    </form>
  </PopupLayerCom>
</template>

<style scoped>
.form {
  --input-focus: #2d8cf0;
  --font-color: #000;
  --font-color-sub: #666;
  --bg-color: #fff;
  --main-color: #000;
  padding: 20px;
  background: var(--mg-white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  border: var(--mg-border);
  box-shadow: var(--mg-shadow);
}

.title {
  color: var(--font-color);
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 5px;
  text-align: center;
  font-family: var(--mg-font);
}

.title span {
  color: var(--font-color-sub);
  font-weight: 600;
  font-size: 17px;
  font-family: var(--mg-font);
}

.input {
  width: 350px;
  border: var(--mg-border-light);
  background-color: var(--bg-color);
  box-shadow: var(--mg-shadow-sm);
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color);
  padding: 10px;
  outline: none;
  font-family: var(--mg-font);
}

.input.textarea {
  resize: vertical;
  min-height: 100px;
}

.input::placeholder {
  color: var(--font-color-sub);
  opacity: 0.8;
}

.input:focus {
  border: 2px solid var(--mg-black);
}

.char-count {
  width: 350px;
  text-align: right;
  font-size: 12px;
  color: var(--font-color-sub);
  margin-top: -10px;
  font-family: var(--mg-font);
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.button-confirm {
  width: 120px;
  height: 40px;
  border: var(--mg-border-light);
  background-color: var(--bg-color);
  box-shadow: var(--mg-shadow-sm);
  font-size: 17px;
  font-weight: 600;
  color: var(--font-color);
  cursor: pointer;
  transition: all 0.1s;
  font-family: var(--mg-font);
}

.button-confirm:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--mg-shadow);
}

.button-confirm.cancel {
  background: var(--mg-gray);
}
</style>
