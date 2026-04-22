<script setup>
defineOptions({
  name: 'shopOrder'
})

import { useRoute } from 'vue-router'
import { ref, provide, watch, onMounted, nextTick } from 'vue'
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'

import { ProductGetOneServer } from '@/api/product'
import { OrderCreateServer } from '@/api/order'

import PopupLayerCom from '@/component/PopupLayerCom.vue'
import manageAddress from '@/component/manageAddress.vue'
import addressFrom from '@/component/addressFrom.vue'
import OrderBox from './component/OrderBox.vue'


const route = useRoute()
const shopId = route.query.id
const count = +route.query.count

const userStore = useUserStore()
const { Account } = storeToRefs(userStore)

const showPopup = ref(false)
const manageAddressRef = ref(null)

const showAddress = ref({
  detail:'',
  receiver: '',
  phone: '',
  _id: '',
  [Symbol.iterator]: function * (){ 
    yield* Object.keys(showAddress.value)
  }
})

const postOrder = ref({
     sellerId: '',
     productId: '',
     deliverAddress: '',
     isBlindBox: true,
     unitPrice: 0,
     quantity: 0
})  // 提交订单的数据

// 获取商品信息
const getProduct = async () => {
  const res = await ProductGetOneServer(shopId)
  const product = res.data

  postOrder.value.sellerId = product.userId
  postOrder.value.productId = product.shopId
  postOrder.value.isBlindBox = product.isBlindBox
  postOrder.value.unitPrice = product.shopPrice
  postOrder.value.quantity = +count
}
getProduct()

// 获取展示地址信息
const getShowAddress = (obj) => { 
  if(!Account.value?.Addresses.length) {
    return
  } 

  for(const key of showAddress.value){
    showAddress.value[key] = obj[key]
  }
}
getShowAddress(Account.value.defaultAddress)

// 生成订单
// const createOrder = async () => {
//   OrderCreateServer(postOrder.value)
// }

// 地址管理
const putCount = ref(0) // 修改标记
const openAddressFrom = (value) => { 
  putCount.value = value
}
provide('openAddressFrom', openAddressFrom)

// 将要修改的数据传入addressFrom子组件
const putAddress = ref({})
const openPutAddressFrom = (address) => { 
  putAddress.value = {
    ...address
  }
  putCount.value = 4
}
provide('openPutAddressFrom', openPutAddressFrom)

const close = () => { showPopup.value = false }

const showAddressFrom =() => {
  showPopup.value = true
  putCount.value = 1 
}

watch(() => manageAddressRef.value?.selectedAddress,() => {
  if(manageAddressRef.value?.selectedAddress){
   const address = manageAddressRef.value.addresses.find(item => item._id === manageAddressRef.value.selectedAddress)
   getShowAddress(address)
   postOrder.value.deliverAddress = showAddress.value._id
  }
})
</script>

<template>
  <div>
    <!-- 选择地址 -->
    <div class="address-box">
      <p class="order-title">订单信息</p>
      <div class="card">
        <div class="order-header">
          <div v-if="showAddress.detail" class="address-info">
            <h4 class="address-item">收货地址：{{ showAddress.detail }}</h4>
            <h4 class="address-item">收货人：{{ showAddress.receiver }}</h4>
            <h4 class="address-item">手机号：{{ showAddress.phone }}</h4>
          </div>
          <button 
            @click="showAddressFrom"
            class="ui-btn">
              <span>
                {{ showAddress.detail? "修改地址" : "请选择地址"  }}
              </span>
          </button>
        </div>

        <div class="description">
           <OrderBox />
        </div>

        <div class="social-media"></div>
      </div>
    </div>

    <PopupLayerCom v-model:visible="showPopup" @close="close">
      <!-- 管理地址 -->
      <manageAddress 
        ref="manageAddressRef"
        v-if="putCount === 1" 
      />
      <!-- 修改地址 -->
      <addressFrom 
        v-else-if="putCount === 4"
        :putAddress="putAddress"
      />
    </PopupLayerCom>
  </div>
</template>

<style scoped>
.order-title {
  padding-bottom: 20px;
  font-family: '华文新魏';
  font-size: 30px;
}

.address-box {
  width: 100%;
  padding: 20px;
  padding-top: 100px;
}

.card {
  width: 100%;
  height: 80vh;
  background: rgb(38, 38, 38);
  box-shadow: 7px 5px 10px rgba(0, 0, 0, 0.333);
}

.order-header {
  height: 200px;
  background-color: #ff5858;
  position: relative;
}

.address-info {
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  padding: 30px;
}

.address-item {
  background-color: #414141;
  width: fit-content;
  padding-right: 30px;
  padding-left: 20px;
  height: 30px;
  line-height: 30px;
  border-radius: 5px;
  color: white;
  font-size: 15px;
  font-weight: bold;
  margin: 0; /* 重置 h4 默认边距 */
}

.description {
  border-color: #141414;
  background-color: #414141;
  transform: translate(5px, 6px);
  width: 100%;
  min-height: 500px;
  border-radius: 5px;
  margin-left: -7px;
}

.social-media:before {
  content: " ";
  display: block;
  width: 100%;
  height: 2px;
  transform: translatey(10px);
  background: #414141;
}

/* 选择地址 */
.selectaddress{
  color: white;
}

.ui-btn {
  --btn-default-bg: rgb(41, 41, 41);
  --btn-padding: 15px 20px;
  --btn-hover-bg: rgb(51, 51, 51);
  --btn-transition: .3s;
  --btn-letter-spacing: .1rem;
  --btn-animation-duration: 1.2s;
  --btn-shadow-color: rgba(0, 0, 0, 0.137);
  --btn-shadow: 0 2px 10px 0 var(--btn-shadow-color);
  --hover-btn-color: #FAC921;
  --font-size: 16px;
  /* 👆 this field should not be empty */
  --font-weight: 600;
  --font-family: Menlo,Roboto Mono,monospace;
  /* 👆 this field should not be empty */
}

.ui-btn {
  box-sizing: border-box;
  padding: var(--btn-padding);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--default-btn-color);
  font: var(--font-weight) var(--font-size) var(--font-family);
  border: none;
  cursor: pointer;
  transition: var(--btn-transition);
  overflow: hidden;
  background: transparent;
  position: absolute;
  bottom: 0;
}

.ui-btn span {
  letter-spacing: var(--btn-letter-spacing);
  transition: var(--btn-transition);
  box-sizing: border-box;
  position: relative;
  background: inherit;
}

.ui-btn span::before {
  box-sizing: border-box;
  position: absolute;
  content: "";
  background: inherit;
}

.ui-btn:hover span, .ui-btn:focus span {
  color: var(--hover-btn-color);
}

.ui-btn:hover span::before, .ui-btn:focus span::before {
  animation: chitchat linear both var(--btn-animation-duration);
}

@keyframes chitchat {
  0% {
    content: "#";
  }

  5% {
    content: ".";
  }

  10% {
    content: "^{";
  }

  15% {
    content: "-!";
  }

  20% {
    content: "#$_";
  }

  25% {
    content: "№:0";
  }

  30% {
    content: "#{+.";
  }

  35% {
    content: "@}-?";
  }

  40% {
    content: "?{4@%";
  }

  45% {
    content: "=.,^!";
  }

  50% {
    content: "?2@%";
  }

  55% {
    content: "\;1}]";
  }

  60% {
    content: "?{%:%";
    right: 0;
  }

  65% {
    content: "|{f[4";
    right: 0;
  }

  70% {
    content: "{4%0%";
    right: 0;
  }

  75% {
    content: "'1_0<";
    right: 0;
  }

  80% {
    content: "{0%";
    right: 0;
  }

  85% {
    content: "]>'";
    right: 0;
  }

  90% {
    content: "4";
    right: 0;
  }

  95% {
    content: "2";
    right: 0;
  }

  100% {
    content: "";
    right: 0;
  }
}

</style>