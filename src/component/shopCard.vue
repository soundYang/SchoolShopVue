<script setup>
import { useRouter } from 'vue-router'

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
        <img v-img-lazy="product.shopImg[0]" :alt="product.shopName" />
      </div>

      <!-- 商品信息：上下结构 -->
      <div class="content">
        <p class="title">{{ product.shopName }}</p>
        <div class="price-wrapper">
          <span class="price">￥{{ product.shopPrice.toFixed(2) }}</span>
          <span v-if="product.shopOldPrice" class="old-price">￥{{ product.shopOldPrice.toFixed(2) }}</span>
        </div>
      </div>

      <!-- 购买按钮 -->
      <button class="card-btn">购买</button>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 247px;        /* 190px * 1.3 */
  height: 330px;       /* 254px * 1.3 */
  background: #f5f5f5;
  padding: 20px;       /* 15px * 1.3 ≈ 19.5px → 20px */
  border-radius: 13px; /* 10px * 1.3 */
  overflow: hidden;
  transition: all 0.3s;
  position: relative;
  cursor: pointer;
}

.wrapper {
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;           /* 15px * 1.3 ≈ 19.5px → 20px */
}

.card-image {
  width: 100%;
  height: 221px;       /* 170px * 1.3 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  background: rgb(241, 241, 241);
  border-radius: 10px; /* 8px * 1.3 = 10.4px → 10px */
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  height: fit-content;
  display: flex;
  flex-direction: column; /* 改为上下排列 */
  align-items: center;     /* 水平居中 */
  gap: 8px;                /* 名称与价格行的间距 */
  width: 100%;
}

.price-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;                /* 新旧价格之间的间距 */
}

.title {
  font-size: 0.94em;       /* 0.72em * 1.3 ≈ 0.94em */
  text-transform: uppercase;
  font-weight: 500;
  color: #4d4d4d;
  margin: 0;
  line-height: 1.2;
}

.price {
  font-size: 1.3em;        /* 1em * 1.3 */
  font-weight: 700;
  color: #000;
}

.old-price {
  font-size: 0.91em;       /* 0.7em * 1.3 */
  text-decoration: line-through;
  color: #adadad;
}

.card-btn {
  margin-top: 13px;        /* 10px * 1.3 */
  width: 100%;
  height: 52px;            /* 40px * 1.3 */
  background-color: rgb(24, 24, 24);
  border: none;
  border-radius: 52px;     /* 40px * 1.3 */
  color: white;
  transition: all 0.3s;
  cursor: pointer;
  font-weight: 500;
  font-size: 1.17em;       /* 相对放大，原按钮无字体大小，按比例调整 */
}

/* 悬停效果 */
.card:hover .card-image {
  height: 156px;           /* 120px * 1.3 */
}

.card:hover .card-btn {
  margin-top: 0;
}

.card-btn:hover {
  background-color: greenyellow;
  color: rgb(35, 35, 35);
}

.card:hover {
  background-color: white;
}
</style>