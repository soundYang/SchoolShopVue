<script setup>
import { ref } from 'vue'

const navbarList = ref([
  {
    name: '我的订单',
    path: '/myOrder'
  },
  {
    name: '发布商品',
    path: '/postPro'
  },
  {
    name: '已发布商品',
    path: '/publishedPro'
  }
])
</script>


<template>
  <div class="container">
      <div  class="card" 
      v-for="item in navbarList"
      :key="item.name"
      @click="$router.push(item.path)"
      >
        <span>{{ item.name }}</span>
      </div>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 30px;
    flex-direction: column;
  }

  .card {
    margin: 4%;
    width: 200px;
    height: 50px;
    transition: .2s all;
    cursor: pointer;
    align-items: center;
    text-align: center;
    font-size: 13px;
    border-radius: 30px;
    background: lightgrey;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 50px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 26px -18px inset;
  }

  .card > span {
    display: block;
    margin: auto;
    line-height: 50px;
  }

  .container:hover .card {
    filter: blur(3px);
    opacity: .5;
    transform: scale(.98);
    box-shadow: none;
  }

  .container:hover .card:hover {
    transform: scale(1);
    filter: blur(0px);
    opacity: 1;
    box-shadow: 0 8px 20px 0px rgba(0, 0, 0, 0.125);
    color: black;
  }
</style>

