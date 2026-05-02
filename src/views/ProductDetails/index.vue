<script setup>
defineOptions({
  name: 'ProductsDetail'
})

import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ProductGetOneServer } from '@/api/product'
import { UserGetSimpleInfoServer, UserGetExistServer } from '@/api/user'
import productImgs from './component/productImgs.vue'
import { useRouter } from 'vue-router'
import BuyButtom from '@/component/buyButtom.vue'
import { useToast } from '@/composables/useToast'
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { formatPrice } from '@/unit/format'

const { showToast } = useToast()

const userStore = useUserStore()
const { Account } = storeToRefs(userStore)

const router = useRouter()
const route = useRoute()
const { id }  = route.params

const product = ref({})
const sellerInfo = ref({})
const count = ref(1)

const isSelfProduct = computed(() => {
  if (!product.value.userId || !Account.value?._id) return false
  return String(product.value.userId) === String(Account.value._id)
})

const getProduct = async () => {
  const res = await ProductGetOneServer(id)
  product.value = res.data
  await getSellerInfo()
}

getProduct()

const getSellerInfo = async () => {
  const res = await UserGetSimpleInfoServer(product.value.userId)
  sellerInfo.value = res.data
}

const jumpSeller = async () => {
   // 判断用户是否存在
   const { data: isExist } = await UserGetExistServer(sellerInfo.value._id)
   if(!isExist) return
   router.push('/user?id=' + sellerInfo.value._id)
}

const buyShop = () => {
  if (isSelfProduct.value) {
    showToast('不能购买自己的商品')
    return
  }
  if(product.value.shopNum < count.value) {
    showToast('库存不足')
    return
  }
   // 路径跳转
   router.push(`/shopOrder?id=${id}&count=${count.value}`)

}

</script>

<template>
   <section class="detailBox">
      <ReturnPage />
      <div class="proImgBox">
         <productImgs :shopImg="product.shopImg"/>
         <p style="
          color: rgb(192, 191, 191);
          text-align: center;
          margin-top: -40px;
         ">温馨提示：可通过拖拽查看图片</p>
      </div>

      <div class="proMsgBox">
         <div class="top">
            <div class="header">
               <h1>{{ product.shopName }}</h1>
               <p>
                  {{ product.shopMsg }}
               </p>
               <div class="label">
                  <span
                  v-for="(value, index) in product.shopType"
                  :key="index"
                  >
                  {{ value }}
                 </span>
               </div>
            </div>
            <div @click="jumpSeller" class="sellInfoBox">
               <img :src="sellerInfo.Avatar || ''" alt="">
               <h3 style="text-align: center; margin-top: 20px;">{{ sellerInfo.UserName }}</h3>
            </div>
         </div>
         <div class="bottom">
           <h1> 售价：{{ formatPrice(product.shopPrice) }}￥ </h1>
           <h3> 商品库存：{{ product.shopNum }} </h3>
           <span>已被浏览{{ product.viewCount }}次</span>
           <!-- 数量 -->
            <div class="countBox">
               <button @click="count > 1 ? count-- : 1" class="button">-</button>
               <span>{{ count }}</span>
               <button @click="count++" class="button">+</button>
            </div>
           <div v-if="isSelfProduct" class="self-product-hint">
             不能购买自己的商品
           </div>
           <div v-else class="box-button">
             <BuyButtom
               str="购买"
               @click="buyShop"
             />
           </div>
         </div>
      </div>
   </section>
</template>

<style scoped>
.detailBox{
  width: 100%;
  height: 100vh;
  padding: 100px;
  display: flex;
}
.proImgBox{
   flex: 3;
}
.proMsgBox{
   flex: 2.5;
   font-family: '华文新魏';
   padding: 30px;
}
.top{
   display: flex;
   justify-content: space-between;
   width: 100%;
}
.header>h1{
   margin-left: -50px;
   font-size: 50px;
}
.header>p{
   margin-top: 30px;
   color: rgb(192, 191, 191);
   font-size: 20px;
   word-wrap: break-word;
   overflow-wrap: break-word;
   word-break: break-all;
   text-indent: 2rem;
   margin-left: -30px;
}
.sellInfoBox{
   padding: 50px;
   cursor: pointer;
}
.sellInfoBox>img{
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
.bottom{
   width: 100%;
}
.label{
   margin-top: 20px;
   display: flex;
   gap: 20px;
   padding-left: 20px;
}
.label>span{
   display: block;
   color: rgb(136, 134, 134);
   border-bottom: 1px solid aqua;
}

.bottom{
   margin-top: 50px;
   display: flex;
   flex-direction: column;
   row-gap: 50px;
}

/* 按钮 */
.countBox{
   display: flex;
   gap: 20px;
   align-items: center;
   line-height: 30px;
   text-align: center;
}
.countBox *{
   width: 30px;
   height: 30px;
}

.self-product-hint {
  width: fit-content;
  padding: 10px 20px;
  border: 2px solid #ccc;
  border-radius: 4px;
  color: #999;
  font-size: 14px;
  cursor: not-allowed;
  user-select: none;
}
</style>
