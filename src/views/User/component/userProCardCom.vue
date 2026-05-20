<script setup>
import { getImageUrl } from '@/unit/getImagerUrl'
import { formatPrice } from '@/unit/format'
 defineProps({
  product: [Object, String]
})
</script>

<template>
  <div class="card" v-if="product && typeof product === 'object'">
    <img v-img-lazy="getImageUrl(product.shopImg?.[0] || '')" alt="">
    <h2>{{ product.shopName || '' }}</h2>
    <h3>￥{{ formatPrice(product.shopPrice || 0) }}</h3>
  </div>
</template>

<style scoped>
  .card {
   width: 150px;
   height: 220px;
   background: var(--mg-white);
   box-shadow: var(--mg-shadow-sm);
   color: var(--mg-black);
   padding: 16px;
   transition: all .3s;
   border: var(--mg-border-light);
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   row-gap: 20px;
   font-family: var(--mg-font);
  }

  .card:hover {
   margin-top: -30px;
   box-shadow: var(--mg-shadow);
  }
  .card>img{
    width: 100px;
    height: 100px;
    object-fit: cover;
    border: var(--mg-border-light);
  }
  .card>h2{
    font-size: 16px;
    font-weight: 700;
  }
  .card>h3{
    font-size: 14px;
    color: var(--mg-black);
    font-family: var(--mg-font-mono);
  }
</style>
