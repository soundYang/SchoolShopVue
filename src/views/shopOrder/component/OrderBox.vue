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
  },
  blindBoxImage: {
    type: String,
    default: ''
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
        <img
          v-else-if="product.isBlindBox && blindBoxImage"
          :src="blindBoxImage"
          alt="盲盒"
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
  color: var(--mg-black);
  font-family: var(--mg-font);
}

.product-info {
  display: flex;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: var(--mg-border-light);
}

.product-image {
  width: 120px;
  height: 120px;
  overflow: hidden;
  flex-shrink: 0;
  border: var(--mg-border-light);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: var(--mg-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mg-black);
  font-size: 12px;
  font-family: var(--mg-font);
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
  color: var(--mg-black);
  font-family: var(--mg-font);
}

.product-tags {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 4px 10px;
  font-size: 12px;
  border: var(--mg-border-light);
  font-family: var(--mg-font);
}

.blind-box {
  background: var(--mg-black);
  color: var(--mg-white);
}

.price-tag {
  background: var(--mg-gray);
  color: var(--mg-black);
  font-weight: bold;
  font-family: var(--mg-font-mono);
}

.product-desc {
  margin: 0;
  color: var(--mg-black);
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
  color: var(--mg-black);
  font-size: 14px;
}

.quantity-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--mg-black);
  font-family: var(--mg-font-mono);
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
  color: var(--mg-black);
  font-size: 14px;
}

.summary-value {
  color: var(--mg-black);
  font-size: 14px;
  font-family: var(--mg-font-mono);
}

.total-row {
  margin-top: 10px;
  padding-top: 15px;
  border-top: 2px dashed var(--mg-black);
}

.total-price {
  font-size: 28px;
  font-weight: bold;
  color: var(--mg-black);
  font-family: var(--mg-font-mono);
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
