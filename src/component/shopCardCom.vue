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

const clickFun = () => {
  console.log('点击了')
}

</script>

<template>
  <div class="container">
    <div @click="clickFun" class="card_box">
      <span v-if="badgeText" :data-text="badgeText"></span>
      <div class="proDemo">
        <img :src="product.shopImg[0]" alt="">
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

.card_box span {
  position: absolute;
  overflow: hidden;
  width: 150px;
  height: 150px;
  top: -10px;
  left: -10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card_box span::before {
  /* 使用 attr() 获取 data-text 的值作为内容 */
  content: attr(data-text);
  position: absolute;
  width: 150%;
  height: 40px;
  background-image: linear-gradient(45deg, #ff6547 0%, #ffb144  51%, #ff7053  100%);
  transform: rotate(-45deg) translateY(-20px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  box-shadow: 0 5px 10px rgba(0,0,0,0.23);
  /* 防止文字过长溢出 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card_box span::after {
  content: '';
  position: absolute;
  width: 10px;
  bottom: 0;
  left: 0;
  height: 10px;
  z-index: -1;
  box-shadow: 140px -140px #cc3f47;
  background-image: linear-gradient(45deg, #FF512F 0%, #F09819  51%, #FF512F  100%);
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
}
.proDemo>h3{
  font-size: 20px;
  color: rgb(239, 239, 2);
}
</style>