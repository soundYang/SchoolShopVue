<script setup>
import { ref, onMounted, computed, provide, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { OrderGetOneServer, OrderCancelServer, OrderRefundServer, OrderUpdateStatusServer, OrderUpdateAddressServer } from '@/api/order'
import { AddressGetOneServer } from '@/api/address'
import { ReviewAddServer } from '@/api/review'
import { getImageUrl } from '@/unit/getImagerUrl'
import blindBoxImg from '@/assets/盲盒.png'
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import CancelOrderDialog from '@/component/CancelOrderDialog.vue'
import ReturnPage from '@/component/ReturnPage.vue'
import PopupLayerCom from '@/component/PopupLayerCom.vue'
import manageAddress from '@/component/manageAddress.vue'
import addressFrom from '@/component/addressFrom.vue'
import { useToast } from '@/composables/useToast'

import OrderHeader from './component/OrderHeader.vue'
import OrderProduct from './component/OrderProduct.vue'
import OrderSummary from './component/OrderSummary.vue'
import OrderAddress from './component/OrderAddress.vue'
import OrderCancelInfo from './component/OrderCancelInfo.vue'
import OrderActions from './component/OrderActions.vue'
import ReviewPopup from './component/ReviewPopup.vue'

defineOptions({
  name: 'orderDetail'
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { Account } = storeToRefs(userStore)
const { showToast } = useToast()

const orderId = route.query.id

const order = ref(null)
const loading = ref(true)
const isCancelling = ref(false)
const isShipping = ref(false)
const addressInfo = ref(null)
const showCancelDialog = ref(false)
const showReviewPopup = ref(false)
const reviewContent = ref('')
const isConfirming = ref(false)
const isSubmittingReview = ref(false)

const showPopup = ref(false)
const putCount = ref(0)
const putAddress = ref({})
const manageAddressRef = ref(null)

const openAddressFrom = (value) => {
  putCount.value = value
}
provide('openAddressFrom', openAddressFrom)

const openPutAddressFrom = (address) => {
  putAddress.value = { ...address }
  putCount.value = 4
}
provide('openPutAddressFrom', openPutAddressFrom)

const closePopup = () => {
  showPopup.value = false
}

const showAddressPicker = () => {
  showPopup.value = true
  putCount.value = 1
}

watch(() => manageAddressRef.value?.selectedAddress, () => {
  if (manageAddressRef.value?.selectedAddress) {
    const address = manageAddressRef.value.addresses.find(
      item => item._id === manageAddressRef.value.selectedAddress
    )
    if (address) {
      handleChangeAddress(address)
      showPopup.value = false
    }
  }
})

const isBlindBox = computed(() => order.value?.isBlindBox)

const statusMap = {
  0: { text: '待付款', color: '#ff9800' },
  1: { text: '已付款待发货', color: '#2196f3' },
  2: { text: '已发货待收货', color: '#9c27b0' },
  3: { text: '已完成', color: '#4caf50' },
  4: { text: '已取消', color: '#9e9e9e' },
  5: { text: '退款中', color: '#f44336' }
}

const productInfo = computed(() => order.value?.productId || {})
const imageUrl = computed(() => {
  if (isBlindBox.value && isBuyer.value) return blindBoxImg
  const imgs = productInfo.value.shopImg
  return imgs?.length ? getImageUrl(imgs[0]) : ''
})
const isBuyer = computed(() => order.value?.buyerId === Account.value?._id)
const isSeller = computed(() => order.value?.sellerId === Account.value?._id)
const canPay = computed(() => order.value?.status === 0 && isBuyer.value)
const canCancel = computed(() => {
  if (!order.value) return false
  if (isBuyer.value && order.value.status === 0) return true
  if (isBuyer.value && order.value.status === 1 && !order.value.isBlindBox) return true
  if (isSeller.value && order.value.status === 0) return true
  if (isSeller.value && order.value.status === 1 && !order.value.isBlindBox) return true
  return false
})
const canShip = computed(() => isSeller.value && order.value?.status === 1)
const canConfirm = computed(() => isBuyer.value && order.value?.status === 2)
const statusText = computed(() => statusMap[order.value?.status]?.text || '未知状态')
const statusColor = computed(() => statusMap[order.value?.status]?.color || '#999')

const getOrderDetail = async () => {
  if (!orderId) {
    showToast('订单ID不存在')
    router.back()
    return
  }

  loading.value = true
  try {
    const res = await OrderGetOneServer(orderId)
    order.value = res.data

    if (order.value.status === 0 && order.value.isBlindBox && !order.value.deliverAddress && isBuyer.value) {
      const defaultAddr = Account.value?.defaultAddress
      if (defaultAddr) {
        const addrId = typeof defaultAddr === 'string' ? defaultAddr : defaultAddr._id
        if (addrId) {
          order.value.deliverAddress = addrId
          try {
            await OrderUpdateAddressServer(order.value._id, addrId)
          } catch (error) {
            console.error('设置地址失败:', error)
            order.value.deliverAddress = ''
            showToast('自动设置地址失败，请手动选择地址')
          }
        }
      }
    }

    await fetchAddressInfo()
  } catch (error) {
    console.error('获取订单详情失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchAddressInfo = async () => {
  const addressId = order.value?.deliverAddress
  if (!addressId) return
  const id = typeof addressId === 'string' ? addressId : addressId._id
  if (!id) return
  try {
    const res = await AddressGetOneServer(id, order.value._id)
    addressInfo.value = res.data
  } catch (e) {
    console.error('获取地址信息失败:', e)
  }
}

const handlePay = () => {
  const total = order.value.unitPrice * order.value.quantity
  router.push(`/pay?orderId=${order.value._id}&totalPrice=${total}`)
}

const handleCancel = () => {
  showCancelDialog.value = true
}

const handleCancelConfirm = async (reason) => {
  if (isCancelling.value) return
  isCancelling.value = true
  try {
    const shouldRefund = isBuyer.value && order.value.status === 1 && !order.value.isBlindBox
    if (shouldRefund) {
      await OrderRefundServer(order.value._id, reason)
      order.value.status = 5
    } else {
      await OrderCancelServer(order.value._id, reason)
      order.value.status = order.value.status === 1 ? 5 : 4
    }
  } catch (error) {
    console.error('操作失败:', error)
  } finally {
    isCancelling.value = false
  }
}

const handleShip = async () => {
  if (isShipping.value) return
  isShipping.value = true
  try {
    await OrderUpdateStatusServer(order.value._id, 2)
    order.value.status = 2
  } catch (error) {
    console.error('发货失败:', error)
  } finally {
    isShipping.value = false
  }
}

const handleConfirmReceipt = async () => {
  reviewContent.value = ''
  showReviewPopup.value = true
}

const submitReview = async () => {
  if (isSubmittingReview.value) return
  if (!reviewContent.value.trim()) {
    showToast('请输入评价内容')
    return
  }
  isSubmittingReview.value = true
  try {
    const imgs = productInfo.value.shopImg
    const res = await ReviewAddServer({
      productId: order.value.productId?._id || order.value.productId,
      sellerId: order.value.sellerId,
      orderId: order.value._id,
      content: reviewContent.value,
      proPhoto: imgs?.length ? getImageUrl(imgs[0]) : '',
      avatar: Account.value?.Avatar || ''
    })
    if (res.msg && res.msg.includes('图片待管理员审核')) {
      showToast('评论成功，图片待管理员审核通过后展示')
    }
    await OrderUpdateStatusServer(order.value._id, 3)
    order.value.status = 3
    showReviewPopup.value = false
    reviewContent.value = ''
  } catch (error) {
    const data = error?.response?.data || error
    if (data?.code === 400 && data?.msg?.includes('不当信息')) {
      return
    }
    console.error('提交评价失败:', error)
  } finally {
    isSubmittingReview.value = false
  }
}

const handleSkipReview = async () => {
  if (isConfirming.value) return
  isConfirming.value = true
  try {
    await OrderUpdateStatusServer(order.value._id, 3)
    order.value.status = 3
    showReviewPopup.value = false
  } catch (error) {
    console.error('确认收货失败:', error)
  } finally {
    isConfirming.value = false
  }
}

const handleChangeAddress = async (addr) => {
  const addrId = typeof addr === 'string' ? addr : addr._id
  if (!addrId) return
  try {
    const res = await OrderUpdateAddressServer(order.value._id, addrId)
    if (res.data) {
      order.value.deliverAddress = addrId
      await fetchAddressInfo()
    }
  } catch (error) {
    console.error('更新地址失败:', error)
  }
}

onMounted(() => {
  getOrderDetail()
})
</script>

<template>
  <div v-if="order" class="detail-box">
    <p class="page-title">订单详情</p>

    <div class="card">
      <div class="order-header-bar">
        <ReturnPage />
      </div>
      <OrderHeader
        :order="order"
        :status-text="statusText"
        :status-color="statusColor"
      />

      <div class="body-content">
        <div class="section-title">商品信息</div>
        <OrderProduct
          :order="order"
          :product-info="productInfo"
          :is-blind-box="isBlindBox"
          :is-buyer="isBuyer"
        />

        <div class="section-title">订单摘要</div>
        <OrderSummary :order="order" />

        <OrderAddress
          :order="order"
          :address-info="addressInfo"
          :is-buyer="isBuyer"
          @change-address="handleChangeAddress"
          @show-address-picker="showAddressPicker"
        />

        <OrderCancelInfo :order="order" />

        <OrderActions
          :order="order"
          :can-pay="canPay"
          :can-cancel="canCancel"
          :can-ship="canShip"
          :can-confirm="canConfirm"
          :is-buyer="isBuyer"
          @pay="handlePay"
          @cancel="handleCancel"
          @ship="handleShip"
          @confirm-receipt="handleConfirmReceipt"
        />
      </div>
    </div>
  </div>

  <div v-else class="loading-page">
    <p>订单不存在</p>
  </div>

  <CancelOrderDialog
    v-model:visible="showCancelDialog"
    :title="isBuyer && order?.status === 1 && !order?.isBlindBox ? '申请退款' : '取消订单'"
    @confirm="handleCancelConfirm"
  />

  <ReviewPopup
    :visible="showReviewPopup"
    :image-url="imageUrl"
    :product-name="productInfo.shopName || '商品'"
    :review-content="reviewContent"
    :is-confirming="isConfirming"
    :is-submitting-review="isSubmittingReview"
    @update:visible="showReviewPopup = $event"
    @update:reviewContent="reviewContent = $event"
    @submit="submitReview"
    @skip="handleSkipReview"
  />

  <PopupLayerCom v-model:visible="showPopup" @close="closePopup">
    <manageAddress
      ref="manageAddressRef"
      v-if="putCount === 1"
    />
    <addressFrom
      v-else-if="putCount === 4"
      :putAddress="putAddress"
    />
  </PopupLayerCom>
</template>

<style scoped>
.page-title {
  padding-bottom: 20px;
  font-family: '华文新魏';
  font-size: 30px;
  color: #323232;
}

.loading-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 18px;
  padding-top: 80px;
}

.detail-box {
  width: 100%;
  padding: 20px;
  padding-top: 100px;
}

.card {
  width: 100%;
  min-height: 60vh;
  background: rgb(38, 38, 38);
  box-shadow: 7px 5px 10px rgba(0, 0, 0, 0.333);
}

.body-content {
  padding: 20px;
  color: white;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #FAC921;
  margin: 20px 0 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #555;
}

.section-title:first-of-type {
  margin-top: 0;
}

.order-header-bar {
  display: flex;
  align-items: center;
  padding: 0;
  background-color: #ff5858;
}
</style>
