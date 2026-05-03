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
    height: 140px;
    background: #1e1e1e;
    box-shadow: 0 1px 25px rgba(255, 255, 255, 0.1);
    padding: 12px 10px;
    border-radius: 10px;
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
    background: linear-gradient(
      120deg,
      #2a2a2a 30%,
      #3a3a3a 38%,
      #3a3a3a 40%,
      #2a2a2a 48%
    );
    border-radius: 50%;
    background-size: 200% 100%;
    background-position: 100% 0;
    animation: load89234 2s infinite;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .card_avatar{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }
  .card_load_extreme_title {
    width: 160px;
    height: 30px;
    border-radius: 5px;
    background: linear-gradient(
      120deg,
      #2a2a2a 30%,
      #3a3a3a 38%,
      #3a3a3a 40%,
      #2a2a2a 48%
    );
    background-size: 200% 100%;
    background-position: 100% 0;
    animation: load89234 2s infinite;
    text-align: center;
    line-height: 30px;
    font-size: 16px;
  }

  .card_load_extreme_descripion {
    width: 700px;
    height: 60px;
    border-radius: 5px;
    background: linear-gradient(
      120deg,
      #2a2a2a 30%,
      #3a3a3a 38%,
      #3a3a3a 40%,
      #2a2a2a 48%
    );
    background-size: 200% 100%;
    background-position: 100% 0;
    animation: load89234 2s infinite;
    text-indent: 2rem;
    font-size: 15px;
  }

  @keyframes load89234 {
    100% {
      background-position: -100% 0;
    }
  }
</style>
