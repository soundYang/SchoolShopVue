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
import { ref, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const { Account } = storeToRefs(useUserStore())
const { SellProduct } = storeToRefs(useProductStore())
const { getSellProductList } = useProductStore()

const route = useRoute()

let isAlive = true
onUnmounted(() => { isAlive = false })

// 响应式数据
const sellerId = ref(route.query.id)  // 卖家id
const sellerInfo = ref()              // 卖家信息
const buyerOrderList = ref([])        // 订单列表
const reviewList = ref([])            // 评价列表
const sellProductList = ref([])       // 卖家商品列表
const judgeUser = ref(false)          // 判断用户是否为卖家 默认为非卖家
// 统一的数据获取函数——所有响应式变量一次性写入，避免部分更新触发的渲染与组件卸载竞态
const fetchData = async () => {
  const currentSellerId = route.query.id
  const isOtherUser = !!(currentSellerId && currentSellerId !== Account.value?._id)

  let _sellerInfo = null
  let _buyerOrders = null
  let _sellProducts = []
  let _reviews = []

  try {
    if (isOtherUser) {
      _sellerInfo = (await UserGetSimpleInfoServer(currentSellerId)).data
    }

    if (isOtherUser) {
      _buyerOrders = null
    } else {
      _buyerOrders = (await OrderGetlistServer({ role: 'buyer', status: 3 })).data
    }

    if (isOtherUser) {
      _sellProducts = (await productGetUserListServer(currentSellerId)).data
    } else {
      await getSellProductList({ id: Account.value?._id })
    }

    const targetUserId = currentSellerId || Account.value?._id
    if (targetUserId) {
      _reviews = (await ReviewGetlistServer({ sellerId: targetUserId })).data
    }
  } catch (error) {
    console.error('User page data fetch error:', error)
    return
  }

  if (!isAlive) return

  sellerId.value = currentSellerId
  judgeUser.value = isOtherUser
  sellerInfo.value = _sellerInfo
  buyerOrderList.value = _buyerOrders
  sellProductList.value = _sellProducts
  reviewList.value = _reviews
}

/**
 * 监听路由参数变化
 * 防止组件复用
 */
watch(
  () => route.query.id,
  async () => {
    if (route.name !== 'user') return
    await fetchData()
  },
  { immediate: true }
)

defineOptions({
  name: 'UserPage'
})
</script>

<template>
  <!-- 模板内容不变 -->
  <div class="userBox">
    <ReturnPage style="margin-top: 20px" />
    <div class="userinfo">
      <!-- 如果 sellerInfo 为 null，则使用 Account；否则使用 sellerInfo -->
      <infoCardCom :userInfo="sellerInfo !== null ? sellerInfo : Account" />
    </div>
    <div class="proInfoBox">
      <div class="boughtBox">
        <proListBox title="已购商品" :proList="buyerOrderList?.map(o => o.productId || o)" />
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
    min-height: 100vh;
    background: var(--mg-white);
    color: var(--mg-black);
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
    font-weight: 700;
    margin-left: 10px;
    font-family: var(--mg-font-display);
  }
  .noReview{
    text-align: center;
    font-weight: 600;
    font-family: var(--mg-font);
    line-height: 300px;
    margin-left: -160px;
    color: var(--mg-black);
  }
  .reviewBox::before {
    content: '';
    display: block;
    width: 1000px;
    height: 2px;
    background: var(--mg-black);
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .reviewList{
    margin-bottom: 20px;
    overflow-x: hidden;
    overflow-y: auto;
    height: 400px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .reviewList::-webkit-scrollbar {
    display: none;
  }

  [data-device="mobile"] .userBox{
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  [data-device="mobile"] .userBox>div{
    padding: 12px;
  }

  [data-device="mobile"] .userinfo{
    flex: none;
    height: auto;
    padding: 16px !important;
  }

  [data-device="mobile"] .proInfoBox{
    flex: none;
    margin-top: 0;
  }

  [data-device="mobile"] .boughtBox,
  [data-device="mobile"] .postedBox{
    flex: none;
  }

  [data-device="mobile"] .reviewBox{
    flex: none;
    padding: 12px;
    margin-top: 12px;
  }

  [data-device="mobile"] .reviewTitle{
    font-size: 18px;
    margin-left: 0;
  }

  [data-device="mobile"] .noReview{
    line-height: 100px;
    margin-left: 0;
    font-size: 16px;
  }

  [data-device="mobile"] .reviewBox::before {
    width: 100%;
  }

  [data-device="mobile"] .reviewList{
    height: 250px;
  }
</style>
