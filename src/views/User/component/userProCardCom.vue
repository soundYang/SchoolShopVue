<script setup>
import { getImageUrl } from '@/unit/getImagerUrl'
defineProps({
  product: Object
})
</script>

<template>
  <div class="card">
    <img :src="getImageUrl(product.shopImg[0])" alt="">
    <h2>{{ product.shopName }}</h2>
    <h3>￥{{ product.shopPrice.toFixed(2) }}</h3>
  </div>
</template>

<style scoped>
  .card {
   width: 150px;
   height: 220px;
   background: rgb(40,40,55);
   background: linear-gradient(344deg, rgba(40,40,55,1) 0%, rgba(16,16,18,1) 50%);
   box-shadow: 4px 6px 14px #00000036;
   border-radius: 3px;
   color: #F9F9F9;
   padding: 16px;
   transition: all .3s;
   border-radius: 10px;
  }

  .card:hover {
   margin-top: -30px;
  }
  .card{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 20px;
    font-family:'方正舒体';
  }
  .card>img{
    width: 100px;
    height: 100px;
    border-radius: 10px;
    object-fit: cover;
  }
  .card>h2{
    font-size: 16px;
  }
  .card>h3{
    font-size: 14px;
    color: red;
  }
</style>
