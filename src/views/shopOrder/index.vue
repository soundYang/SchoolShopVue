<script setup>
import { ref, provide, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'

import { ProductGetOneServer } from '@/api/product'
import { OrderCreateServer } from '@/api/order'

import PopupLayerCom from '@/component/PopupLayerCom.vue'
import manageAddress from '@/component/manageAddress.vue'
import addressFrom from '@/component/addressFrom.vue'
import OrderBox from './component/OrderBox.vue'
import SelectAddressButtom from './component/SelectAddressButtom.vue'
import { useToast } from '@/composables/useToast'

defineOptions({
  name: 'shopOrder'
})

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()
const shopId = route.query.id
const count = +route.query.count

const userStore = useUserStore()
const { Account } = storeToRefs(userStore)

const showPopup = ref(false)
const manageAddressRef = ref(null)

const productInfo = ref({
  shopId: '',
  shopName: '',
  shopPrice: 0,
  shopImages: [],
  isBlindBox: false
})

const showAddress = ref({
  detail: '',
  receiver: '',
  phone: '',
  _id: ''
})

const postOrder = ref({
  sellerId: '',
  productId: '',
  deliverAddress: '',
  isBlindBox: false,
  unitPrice: 0,
  quantity: 0
})

const hasAddress = computed(() => !!showAddress.value.detail)
const addressButtonText = computed(() => hasAddress.value ? '修改地址' : '请选择地址')
// const canCreateOrder = computed(() => !!postOrder.value.deliverAddress)

const getProduct = async () => {
  if (!shopId) return
  const res = await ProductGetOneServer(shopId)
  const product = res.data

  productInfo.value = {
    shopId: product._id,
    shopName: product.shopName,
    shopPrice: product.shopPrice,
    shopImages: product.shopImg || [],
    isBlindBox: product.isBlindBox
  }

  postOrder.value.sellerId = product.userId
  postOrder.value.productId = product._id
  postOrder.value.unitPrice = product.shopPrice
  postOrder.value.quantity = +count
}

const getShowAddress = (obj) => {
  if (!obj) return

  showAddress.value = {
    detail: obj.detail || '',
    receiver: obj.receiver || '',
    phone: obj.phone || '',
    _id: obj._id || ''
  }
  postOrder.value.deliverAddress = obj._id || ''
}

const createOrder = async () => {
  if (!postOrder.value.deliverAddress) {
    showToast('请选择收货地址')
    return false
  }

  try {
   const orderData = {
      sellerId: postOrder.value.sellerId,
      productId: postOrder.value.productId,
      deliverAddress: postOrder.value.deliverAddress,
      isBlindBox: postOrder.value.isBlindBox,
      unitPrice: postOrder.value.unitPrice,
      quantity: postOrder.value.quantity
    }
    const res = await OrderCreateServer(orderData)
    return res.data
  } catch (error) {
    console.error('订单创建失败:', error)

    return false
  }
}

const handleSubmitOrder = async () => {
  const orderData = await createOrder()
  if (orderData) {
    router.push({
      path: '/pay',
      query: {
        orderId: orderData._id,
        totalPrice: Math.round(productInfo.value.shopPrice * count * 100) / 100
      }
    })
  }
}

const putCount = ref(0)
const openAddressFrom = (value) => {
  putCount.value = value
}
provide('openAddressFrom', openAddressFrom)

const putAddress = ref({})
const openPutAddressFrom = (address) => {
  putAddress.value = { ...address }
  putCount.value = 4
}
provide('openPutAddressFrom', openPutAddressFrom)

const close = () => {
  showPopup.value = false
}

const showAddressFrom = () => {
  showPopup.value = true
  putCount.value = 1
}

watch(() => manageAddressRef.value?.selectedAddress, () => {
  if (manageAddressRef.value?.selectedAddress) {
    const address = manageAddressRef.value.addresses.find(
      item => item._id === manageAddressRef.value.selectedAddress
    )
    if (address) {
      getShowAddress(address)
    }
  }
})

onMounted(() => {
  getProduct()
  if (Account.value?.defaultAddress) {
    getShowAddress(Account.value.defaultAddress)
  }
})
</script>

<template>
  <div>
    <div class="address-box">
      <p class="order-title">订单信息</p>
      <div class="card">
        <div class="order-header-bar">
          <ReturnPage />
        </div>
        <div class="order-header">
          <div v-if="hasAddress" class="address-info">
            <h4 class="address-item">收货地址：{{ showAddress.detail }}</h4>
            <h4 class="address-item">收货人：{{ showAddress.receiver }}</h4>
            <h4 class="address-item">手机号：{{ showAddress.phone }}</h4>
          </div>
          <SelectAddressButtom
            @click="showAddressFrom"
            :str="addressButtonText"
            style="position: absolute; bottom: -15px; left: 30px; "
          />
        </div>

        <div class="description">
          <OrderBox
            :product="productInfo"
            :quantity="count || 1"
            @submit-order="handleSubmitOrder"
          />
        </div>

        <div class="social-media"></div>
      </div>
    </div>

    <PopupLayerCom v-model:visible="showPopup" @close="close">
      <manageAddress
        ref="manageAddressRef"
        v-if="putCount === 1"
      />
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
  min-height: 80vh;
  background: rgb(38, 38, 38);
  box-shadow: 7px 5px 10px rgba(0, 0, 0, 0.333);
}

.order-header {
  min-height: 200px;
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
  margin: 0;
}

.description {
  border-color: #141414;
  background-color: #414141;
  transform: translate(5px, 6px);
  width: 100%;
  min-height: 400px;
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

.order-header-bar {
  display: flex;
  align-items: center;
  padding: 0;
  background-color: #ff5858;
}

</style>
