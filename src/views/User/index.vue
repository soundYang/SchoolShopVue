<script setup>
import infoCardCom from './component/infoCardCom.vue'
import proListBox from './component/proListBox.vue'
import reviewCom from './component/reviewCom.vue'

import { useUserStore } from '@/stores'
import { useProductStore } from '@/stores'
import { OrderGetlistServer } from '@/api/order'
import { ReviewGetlistServer } from '@/api/review'

import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const { Account } = storeToRefs(useUserStore())

// 用户买的商品
const buyerOrderList = ref([])
const getCompletedOrder = async () => {
  const res = await OrderGetlistServer({ role: 'buyer', status: 3 })
  buyerOrderList.value = res
}
getCompletedOrder()

// 用户卖的商品
const { SellProduct } = storeToRefs(useProductStore())
const { getSellProductList } = useProductStore()
getSellProductList()

// 用户的被评价
const reviewList = ref([])
const getReviewList = async () => {
  const res = await ReviewGetlistServer({ sellerId: Account.value._id })
  reviewList.value = res
}
getReviewList()

defineOptions({
  name: 'UserPage'
})
</script>

<template>
   <div class="userBox">
    <div class="userinfo">
      <infoCardCom :userInfo="Account" />
    </div>
    <div class="proInfoBox">
      <div class="boughtBox">
        <proListBox title="已购商品" :proList="buyerOrderList" />
      </div>
      <div class="postedBox">
        <proListBox title="已发布商品" :proList="SellProduct" />
      </div>
      <div class="reviewBox">
        <div class="reviewTitle">用户评价</div>
        <div class="reviewList" v-if="reviewList.length" >
          <reviewCom 
           v-for="item in reviewList" 
           :key="item._id"
           :reviewUser="item"
           />
        </div>
        <h1 v-else class="noReview">暂无用户评价</h1>
      </div>
    </div>
   </div>
</template>

<style scoped>
  .userBox{
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100vh;
  }
  .userBox>div{
    padding: 40px;
  }
  .userinfo{
    flex: 4;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .proInfoBox{
    flex: 6;
    display: flex;
    flex-direction: column;
    margin-top: 30px;
  }
  /* .proInfoBox>div{
    border: 1px solid white;
  } */
  .boughtBox,
  .postedBox{
    flex: 1.25;
  }
  .reviewBox{
    flex: 1.5;
    padding: 20px;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    margin-top: 20px;
    position: relative;
  }
  .reviewTitle{
    font-size: 24px;
    font-weight: 600;
    margin-left: 10px;
    font-family: "方正舒体";
  }
  .noReview{
    text-align: center;
    font-weight: 600;
    font-family: "方正舒体";
    line-height: 300px;
    margin-left: -160px;
  }
  .reviewBox::before {
    content: '';
    display: block;
    width: 1000px;
    height: 1px;
    box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.6);
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .reviewList{
    margin-bottom: 20px;
    overflow: scroll;
    height: 400px;

  }
  .reviewList {
    /* 保留原有滚动能力，但隐藏滚动条 */
    overflow-x: hidden;          /* 必须保留，否则无法滚动 */
    overflow-y: auto;
    scrollbar-width: none;     /* Firefox 隐藏滚动条 */
    -ms-overflow-style: none;  /* IE 和 Edge 旧版隐藏滚动条 */
  }

  /* Chrome, Safari, 新版 Edge 隐藏滚动条 */
  .reviewList::-webkit-scrollbar {
    display: none;
  }
</style>