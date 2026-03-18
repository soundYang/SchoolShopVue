<script setup>
// 使用 defineProps 声明 props，并设置默认值
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
        <img v-img-lazy="product.shopImg[0]" alt="">
        <h2>{{ product.shopName }}</h2>
        <h3>￥{{ product.shopPrice.toFixed(2) }}</h3>
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
  border-radius: 20px;
  background: linear-gradient(170deg, rgba(58, 56, 56, 0.623) 0%, rgb(31, 31, 31) 100%);
  position: relative;
  box-shadow: 0 25px 50px rgba(0,0,0,0.55);
  cursor: pointer;
  transition: all .3s;
}

.card_box:hover {
  transform: scale(0.9);
}

/* 商品样式 */
.proDemo{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  row-gap: 20px;
  font-family:'方正舒体';
}
.proDemo>img{
  width: 180px;
  height: 260px;
  margin-top: 60px;
  border-radius: 10px;
  object-fit: cover;
}
.proDemo>h3{
  font-size: 20px;
  color: rgb(239, 239, 2);
}
</style>