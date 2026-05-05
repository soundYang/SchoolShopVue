<script setup>
import PopupLayerCom from '@/component/PopupLayerCom.vue'

defineProps({
  visible: { type: Boolean, default: false },
  imageUrl: { type: String, default: '' },
  productName: { type: String, default: '' },
  reviewContent: { type: String, default: '' },
  isConfirming: { type: Boolean, default: false },
  isSubmittingReview: { type: Boolean, default: false }
})

const emit = defineEmits(['update:visible', 'update:reviewContent', 'submit', 'skip'])
</script>

<template>
  <PopupLayerCom
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="review-popup">
      <h3 class="review-title">撰写评价</h3>
      <div class="review-product-info">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          class="review-product-img"
        />
        <span class="review-product-name">{{ productName || '商品' }}</span>
      </div>
      <textarea
        :value="reviewContent"
        class="review-textarea"
        placeholder="请输入您的评价内容..."
        rows="5"
        @input="emit('update:reviewContent', $event.target.value)"
      ></textarea>
      <div class="review-actions">
        <button class="review-btn cancel" @click="emit('update:visible', false)">关闭</button>
        <button
          class="review-btn skip"
          :disabled="isConfirming"
          @click="emit('skip')"
        >
          {{ isConfirming ? '确认中...' : '跳过评价' }}
        </button>
        <button
          class="review-btn submit"
          :disabled="isSubmittingReview || !reviewContent.trim()"
          @click="emit('submit')"
        >
          {{ isSubmittingReview ? '提交中...' : '提交评价' }}
        </button>
      </div>
    </div>
  </PopupLayerCom>
</template>

<style scoped>
.review-popup {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-title {
  font-size: 20px;
  font-weight: bold;
  color: var(--mg-black);
  margin: 0;
  text-align: center;
  font-family: var(--mg-font-display);
}

.review-product-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: var(--mg-gray);
  border: var(--mg-border-light);
}

.review-product-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border: var(--mg-border-light);
}

.review-product-name {
  font-size: 14px;
  color: var(--mg-black);
  font-weight: bold;
  font-family: var(--mg-font);
}

.review-textarea {
  width: 100%;
  padding: 12px;
  border: var(--mg-border-light);
  background: var(--mg-white);
  color: var(--mg-black);
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  font-family: var(--mg-font);
  box-sizing: border-box;
  box-shadow: var(--mg-shadow-sm);
}

.review-textarea::placeholder {
  color: var(--mg-black);
  opacity: 0.5;
}

.review-textarea:focus {
  outline: none;
  border-color: var(--mg-black);
}

.review-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.review-btn {
  padding: 10px 24px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  font-family: var(--mg-font);
  border: var(--mg-border-light);
  box-shadow: var(--mg-shadow-sm);
}

.review-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: var(--mg-shadow);
}

.review-btn:active {
  transform: translate(1px, 1px);
  box-shadow: none;
}

.review-btn.cancel {
  background: var(--mg-white);
  color: var(--mg-black);
}

.review-btn.skip {
  background: var(--mg-gray);
  color: var(--mg-black);
}

.review-btn.skip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: var(--mg-shadow-sm);
}

.review-btn.submit {
  background: var(--mg-black);
  color: var(--mg-white);
}

.review-btn.submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: var(--mg-shadow-sm);
}
</style>
