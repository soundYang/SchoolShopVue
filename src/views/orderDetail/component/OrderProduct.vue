<script setup>
import { computed } from 'vue'
import { getImageUrl } from '@/unit/getImagerUrl'
import { formatPrice } from '@/unit/format'
import blindBoxImg from '@/assets/盲盒.png'

const props = defineProps({
  order: { type: Object, required: true },
  productInfo: { type: Object, default: () => ({}) },
  isBlindBox: { type: Boolean, default: false },
  isBuyer: { type: Boolean, default: false }
})

const imageUrl = computed(() => {
  if (props.isBlindBox && props.isBuyer) return blindBoxImg
  const imgs = props.productInfo.shopImg
  return imgs?.length ? getImageUrl(imgs[0]) : ''
})
</script>

<template>
  <div class="product-section">
    <div class="product-image">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="productInfo.shopName"
      />
      <div v-else class="image-placeholder">暂无图片</div>
    </div>

    <div class="product-details">
      <h3 class="product-name">{{ isBlindBox && isBuyer ? '盲盒商品' : (productInfo.shopName || '商品信息未获取') }}</h3>
      <div class="product-tags">
        <span class="tag price-tag">¥{{ formatPrice(order.unitPrice) }}</span>
      </div>
    </div>

    <div class="quantity-section">
      <span class="quantity-label">购买数量</span>
      <span class="quantity-value">x{{ order.quantity }}</span>
    </div>
  </div>
</template>

<style scoped>
.product-section {
  display: flex;
  gap: 20px;
  padding-bottom: 20px;
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

.product-image img[alt="盲盒"] {
  object-fit: contain;
  background: #333;
  padding: 8px;
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

.price-tag {
  background: #FAC921;
  color: #333;
  font-weight: bold;
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
</style>
