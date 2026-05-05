<script setup>
import { useRouter } from 'vue-router'
import { getImageUrl } from '@/unit/getImagerUrl'
import { formatPrice } from '@/unit/format'

const router = useRouter()

defineProps({
  product: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="card" @click="router.push(`/productDetail/${product._id}`)">
    <div class="wrapper">
      <!-- 图片区域，悬停时高度缩小 -->
      <div class="card-image">
        <img v-img-lazy="getImageUrl(product.shopImg[0])" :alt="product.shopName" />
      </div>

      <!-- 商品信息：上下结构 -->
      <div class="content">
        <p class="title">{{ product.shopName }}</p>
        <div class="price-wrapper">
          <span class="price">￥{{ formatPrice(product.shopPrice) }}</span>
        </div>
      </div>

      <!-- 购买按钮 -->
      <button class="card-btn">购买</button>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 21.5vw;
  min-width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--mg-gray);
  border: var(--mg-border-light);
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.card:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--mg-shadow-sm);
}

.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card-image {
  width: 100%;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--mg-white);
  border-bottom: var(--mg-border-light);
  padding: 10px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 10px;
}

.title {
  font-family: var(--mg-font);
  font-size: 0.9em;
  font-weight: 600;
  color: var(--mg-black);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.price-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.price {
  font-family: var(--mg-font-mono);
  font-size: 1.1em;
  font-weight: 700;
  color: var(--mg-black);
}

.card-btn {
  border: var(--mg-border-light);
  background-color: var(--mg-white);
  color: var(--mg-black);
  font-family: var(--mg-font);
  font-weight: 600;
  font-size: 0.7em;
  padding: 6px 14px;
  cursor: pointer;
  transition: all 0.15s ease;
  width: calc(100% - 20px);
  margin: 6px 0 8px;
}

.card-btn:hover {
  background-color: var(--mg-black);
  color: var(--mg-white);
}

[data-device="mobile"] .card {
  width: 42vw;
  min-width: 0;
}

[data-device="mobile"] .title {
  font-size: 0.75em;
}

[data-device="mobile"] .price {
  font-size: 0.9em;
}

[data-device="mobile"] .card-btn {
  font-size: 0.6em;
  padding: 4px 8px;
}
</style>
