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
  handleClose()
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
  --font-color: #323232;
  --font-color-sub: #666;
  --bg-color: #fff;
  --main-color: #323232;
  padding: 20px;
  background: lightgrey;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
}

.title {
  color: var(--font-color);
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 5px;
  text-align: center;
}

.title span {
  color: var(--font-color-sub);
  font-weight: 600;
  font-size: 17px;
}

.input {
  width: 350px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color);
  padding: 10px;
  outline: none;
  font-family: inherit;
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
  border: 2px solid var(--input-focus);
}

.char-count {
  width: 350px;
  text-align: right;
  font-size: 12px;
  color: var(--font-color-sub);
  margin-top: -10px;
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
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 17px;
  font-weight: 600;
  color: var(--font-color);
  cursor: pointer;
  transition: all 0.1s;
}

.button-confirm:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px var(--main-color);
}

.button-confirm.cancel {
  background: #e0e0e0;
}
</style>
