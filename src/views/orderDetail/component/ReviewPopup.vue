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
  color: #FAC921;
  margin: 0;
  text-align: center;
}

.review-product-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #333;
  border-radius: 8px;
}

.review-product-img {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  object-fit: cover;
}

.review-product-name {
  font-size: 14px;
  color: #ddd;
  font-weight: bold;
}

.review-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #555;
  border-radius: 8px;
  background: #2a2a2a;
  color: #fff;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  box-sizing: border-box;
}

.review-textarea::placeholder {
  color: #888;
}

.review-textarea:focus {
  outline: none;
  border-color: #FAC921;
}

.review-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.review-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}

.review-btn.cancel {
  background: #555;
  color: #fff;
}

.review-btn.cancel:hover {
  opacity: 0.8;
}

.review-btn.skip {
  background: #888;
  color: #fff;
}

.review-btn.skip:hover {
  opacity: 0.8;
}

.review-btn.skip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.review-btn.submit {
  background: #FAC921;
  color: #333;
}

.review-btn.submit:hover {
  opacity: 0.8;
}

.review-btn.submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
