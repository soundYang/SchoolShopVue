<script setup>
import infoCardCom from './component/infoCardCom.vue'
import proListBox from './component/proListBox.vue'
import reviewCom from './component/reviewCom.vue'

import { useUserStore, useProductStore } from '@/stores'
import { OrderGetlistServer } from '@/api/order'
import { ReviewGetlistServer } from '@/api/review'
import { UserGetSimpleInfoServer } from '@/api/user'
import { productGetUserListServer } from "@/api/product"

import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const { Account } = storeToRefs(useUserStore())
const { SellProduct } = storeToRefs(useProductStore())
const { getSellProductList } = useProductStore()

const route = useRoute()

// 响应式数据
const sellerId = ref(route.query.id)  // 卖家id
const sellerInfo = ref()              // 卖家信息
const buyerOrderList = ref([])        // 订单列表
const reviewList = ref([])            // 评价列表
const sellProductList = ref([])       // 卖家商品列表
const judgeUser = ref(false)          // 判断用户是否为卖家 默认为非卖家
// 统一的数据获取函数
const fetchData = async () => {
  try {
    const currentSellerId = route.query.id
    sellerId.value = currentSellerId

    if (currentSellerId && currentSellerId !== Account.value?._id) {
      judgeUser.value = true
    } else {
      judgeUser.value = false
    }

    // 1. 获取卖家信息
    if (judgeUser.value) {
      const res = await UserGetSimpleInfoServer(currentSellerId)
      sellerInfo.value = res.data
    } else {
      sellerInfo.value = null
    }

    // 2. 获取当前用户购买的已完成商品（仅自己主页）
    if (judgeUser.value) {
      buyerOrderList.value = null
    } else {
      const res = await OrderGetlistServer({ role: 'buyer', status: 3 })
      buyerOrderList.value = res.data
    }

    // 3. 获取卖家发布的商品
    if (judgeUser.value) {
      const res = await productGetUserListServer(currentSellerId)
      sellProductList.value = res.data
    } else {
      await getSellProductList({ id: Account.value?._id })
    }

    // 4. 获取评价列表
    const targetUserId = currentSellerId || Account.value?._id
    if (targetUserId) {
      const res = await ReviewGetlistServer({ sellerId: targetUserId })
      reviewList.value = res.data
    } else {
      reviewList.value = []
    }
  } catch (error) {
    console.error('User page data fetch error:', error)
  }
}

/**
 * 监听路由参数变化
 * 防止组件复用
 */
watch(
  () => route.query.id,
  async () => {
    await fetchData()
  },
  { immediate: true } // immediate 确保组件挂载时执行一次
)

defineOptions({
  name: 'UserPage'
})
</script>

<template>
  <!-- 模板内容不变 -->
  <div class="userBox">
    <ReturnPage />
    <div class="userinfo">
      <!-- 如果 sellerInfo 为 null，则使用 Account；否则使用 sellerInfo -->
      <infoCardCom :userInfo="sellerInfo !== null ? sellerInfo : Account" />
    </div>
    <div class="proInfoBox">
      <div class="boughtBox">
        <proListBox title="已购商品" :proList="buyerOrderList" />
      </div>
      <div class="postedBox">
        <proListBox
        title="已发布商品"
        :proList=" judgeUser ? sellProductList : SellProduct" />
      </div>
      <div class="reviewBox">
        <div class="reviewTitle">用户评价</div>
        <div class="reviewList" v-if="reviewList.length">
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
