<script setup>
import { computed } from 'vue'
import BuyButtom from '@/component/buyButtom.vue'
import { getImageUrl } from '@/unit/getImagerUrl'
import { formatPrice } from '@/unit/format'

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      shopId: '',
      shopName: '',
      shopPrice: 0,
      shopImages: [],
      isBlindBox: false
    })
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
})

const emit = defineEmits(['submit-order'])

const totalPrice = computed(() => props.product.shopPrice * props.quantity)
const productDesc = computed(() =>
  props.product.isBlindBox ? '盲盒商品，购买后随机发放' : '普通商品'
)
const hasImage = computed(() => props.product.shopImages?.length > 0)
const imageUrl = computed(() => hasImage.value ? getImageUrl(props.product.shopImages[0]) : '')

const handleSubmitOrder = () => {
  emit('submit-order')
}


</script>

<template>
  <div class="order-box">
    <div class="product-info">
      <div class="product-image">
        <img
          v-if="hasImage"
          :src="imageUrl"
          :alt="product.shopName"
        />
        <div v-else class="image-placeholder">暂无图片</div>
      </div>

      <div class="product-details">
        <h3 class="product-name">{{ product.shopName || '商品名称' }}</h3>
        <div class="product-tags">
          <span v-if="product.isBlindBox" class="tag blind-box">盲盒</span>
          <span class="tag price-tag">¥{{ formatPrice(product.shopPrice) }}</span>
        </div>
        <p class="product-desc">{{ productDesc }}</p>
      </div>

      <div class="quantity-section">
        <span class="quantity-label">购买数量</span>
        <span class="quantity-value">x{{ quantity }}</span>
      </div>
    </div>

    <div class="order-summary">
      <div class="summary-row">
        <span class="summary-label">商品单价</span>
        <span class="summary-value">¥{{ formatPrice(product.shopPrice) }}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">购买数量</span>
        <span class="summary-value">x{{ quantity }}</span>
      </div>
      <div class="summary-row total-row">
        <span class="summary-label">订单总价</span>
        <span class="summary-value total-price">¥{{ formatPrice(totalPrice) }}</span>
      </div>
    </div>

    <div class="order-actions">
      <div class="submit-button">
        <BuyButtom
          str="购买"
          @click="handleSubmitOrder"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-box {
  padding: 20px;
  color: white;
}

.product-info {
  display: flex;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #555;
}

.product-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 12px;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-name {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}

.product-tags {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.blind-box {
  background: #ff5858;
  color: white;
}

.price-tag {
  background: #FAC921;
  color: #333;
  font-weight: bold;
}

.product-desc {
  margin: 0;
  color: #aaa;
  font-size: 14px;
}

.quantity-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 5px;
}

.quantity-label {
  color: #888;
  font-size: 14px;
}

.quantity-value {
  font-size: 24px;
  font-weight: bold;
  color: #FAC921;
}

.order-summary {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  color: #aaa;
  font-size: 14px;
}

.summary-value {
  color: #fff;
  font-size: 14px;
}

.total-row {
  margin-top: 10px;
  padding-top: 15px;
  border-top: 2px dashed #555;
}

.total-price {
  font-size: 28px;
  font-weight: bold;
  color: #ff5858;
}

.order-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  cursor: pointer;
}
</style>
