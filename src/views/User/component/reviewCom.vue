<script setup>
import ToTime from '@/unit/ToTime'
defineProps({
  reviewUser: Object
})

</script>

<template>
  <div class="card">
    <div class="card_load">
      <img v-if="reviewUser.Avatar" class="card_avatar" v-img-lazy="reviewUser.Avatar" alt="">
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#888" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
      </svg>
    </div>
    <div class="card_msg">
      <div class="card_load_extreme_title">{{ reviewUser.userName }}</div>
      <h1 style="margin-left: 20px; font-size: 12px;">{{ ToTime(reviewUser.time) }}</h1>
      <div class="card_load_extreme_descripion">{{ reviewUser.content }}</div>
    </div>
  </div>
</template>

<style scoped>
  .card {
    width: 85%;
    min-height: 140px;
    background: var(--mg-white);
    border: var(--mg-border-light);
    box-shadow: var(--mg-shadow-sm);
    padding: 12px 10px;
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .card_msg{
    display: flex;
    flex-direction: column;
    row-gap: 10px;
  }
  .card_load {
    width: 90px;
    height: 90px;
    background: var(--mg-gray);
    display: flex;
    align-items: center;
    justify-content: center;
    border: var(--mg-border-light);
  }
  .card_avatar{
    width: 80px;
    height: 80px;
    object-fit: cover;
  }
  .card_load_extreme_title {
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 16px;
    font-weight: 700;
    color: var(--mg-black);
    font-family: var(--mg-font);
  }

  .card_load_extreme_descripion {
    text-indent: 2rem;
    font-size: 15px;
    color: var(--mg-black);
    font-family: var(--mg-font);
    line-height: 1.5;
  }
</style>
