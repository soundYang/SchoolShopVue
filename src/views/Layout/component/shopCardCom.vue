<script setup>
// 使用 defineProps 声明 props，并设置默认值
import { getImageUrl } from '@/unit/getImagerUrl'
import { formatPrice } from '@/unit/format'
defineProps({
  badgeText: {
    type: String,
    default: ''
  },
  product:{
    type: Object
  }
})

</script>

<template>
  <div class="container">
    <div @click="$router.push(`/productDetail/${product._id}`)" class="card_box">
      <div class="proDemo">
        <img v-img-lazy="getImageUrl(product.shopImg[0])" alt="">
        <h2>{{ product.shopName }}</h2>
        <h3>￥{{ formatPrice(product.shopPrice) }}</h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card_box {
  width: 300px;
  height: 450px;
  background: var(--mg-white);
  border: var(--mg-border);
  box-shadow: var(--mg-shadow);
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.card_box:hover {
  transform: translate(-3px, -3px);
  box-shadow: var(--mg-shadow-hover);
}

.proDemo{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  row-gap: 20px;
  font-family: var(--mg-font);
  padding: 20px;
}
.proDemo>img{
  width: 180px;
  height: 260px;
  margin-top: 30px;
  object-fit: cover;
  border: var(--mg-border-light);
}
.proDemo>h2{
  font-size: 18px;
  font-weight: 600;
  color: var(--mg-black);
  text-align: center;
  letter-spacing: 1px;
}
.proDemo>h3{
  font-size: 20px;
  color: var(--mg-black);
  font-family: var(--mg-font-mono);
  font-weight: 700;
}

[data-device="mobile"] .card_box {
  width: 220px;
  height: 340px;
}
[data-device="mobile"] .proDemo>img {
  width: 140px;
  height: 200px;
  margin-top: 20px;
}
[data-device="mobile"] .proDemo>h2 {
  font-size: 14px;
}
[data-device="mobile"] .proDemo>h3 {
  font-size: 16px;
}
</style>
