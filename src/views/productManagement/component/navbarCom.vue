<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

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
      :class="{ active: route.path === item.path }"
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
    gap: 12px;
  }

  .card {
    width: 200px;
    height: 50px;
    transition: all .2s;
    cursor: pointer;
    align-items: center;
    text-align: center;
    font-size: 13px;
    background: var(--mg-white);
    border: var(--mg-border-light);
    box-shadow: var(--mg-shadow-sm);
    font-family: var(--mg-font);
    font-weight: bold;
  }

  .card > span {
    display: block;
    margin: auto;
    line-height: 50px;
  }

  .card:hover {
    transform: translate(-2px, -2px);
    box-shadow: var(--mg-shadow);
  }

  .card:active {
    transform: translate(1px, 1px);
    box-shadow: none;
  }

  .card.active {
    background: var(--mg-black);
    color: var(--mg-white);
    border-color: var(--mg-black);
    box-shadow: var(--mg-shadow);
  }
</style>

