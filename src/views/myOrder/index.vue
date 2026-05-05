<script setup>
defineOptions({
  name: 'myOrderPage'
})

import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { OrderGetlistServer, OrderGetBlindBoxServer, OrderCancelServer, OrderRefundServer } from '@/api/order'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import OrderCard from './component/OrderCard.vue'
import CancelOrderDialog from '@/component/CancelOrderDialog.vue'

const { showToast } = useToast()
const router = useRouter()
const userStore = useUserStore()
const { Account } = storeToRefs(userStore)

// 订单列表数据
const orders = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(3)
const total = ref(0)

// 筛选条件
const activeRole = ref('buyer') // buyer 或 seller
const activeStatus = ref('all') // all, 0(待支付), 1(已支付), 2(已完成), 3(已取消)

// 订单状态映射
const statusMap = {
  0: { text: '待付款', color: '#ff9800' },
  1: { text: '已付款待发货', color: '#2196f3' },
  2: { text: '已发货待收货', color: '#9c27b0' },
  3: { text: '已完成', color: '#4caf50' },
  4: { text: '已取消', color: '#9e9e9e' },
  5: { text: '退款中', color: '#f44336' }
}

// 计算属性：当前角色的订单列表
const filteredOrders = computed(() => {
  if (activeStatus.value === 'blindBox' || activeStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === parseInt(activeStatus.value))
})

// 计算属性：状态选项
const statusOptions = computed(() => [
  { value: 'all', label: '全部' },
  { value: 'blindBox', label: '盲盒' },
  { value: '0', label: '待付款' },
  { value: '1', label: '已付款待发货' },
  { value: '2', label: '已发货待收货' },
  { value: '3', label: '已完成' },
  { value: '4', label: '已取消' },
  { value: '5', label: '退款中' }
])

// 计算属性：总页数
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 获取订单列表
const getOrderList = async () => {
  if (!Account.value?._id) {
    showToast('请先登录')
    return
  }

  loading.value = true
  try {
    let res
    if (activeStatus.value === 'blindBox') {
      res = await OrderGetBlindBoxServer({
        page: currentPage.value,
        pageSize: pageSize.value
      })
    } else {
      res = await OrderGetlistServer({
        page: currentPage.value,
        pageSize: pageSize.value,
        role: activeRole.value,
        status: activeStatus.value === 'all' ? undefined : activeStatus.value
      })
    }

    if (res.data) {
      orders.value = res.data || []
      total.value = res.total || 0
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 切换角色
const switchRole = (role) => {
  activeRole.value = role
  currentPage.value = 1
  getOrderList()
}

// 切换状态
const switchStatus = (status) => {
  activeStatus.value = status
  currentPage.value = 1
  getOrderList()
}

// 支付订单
const handlePay = (orderId) => {
  const order = orders.value.find(o => o._id === orderId)
  const qty = order ? (order.quantity || 1) : 1
  const totalPrice = order ? order.unitPrice * qty : 0
  router.push(`/pay?orderId=${orderId}&totalPrice=${totalPrice}`)
}

// 切换页码
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  getOrderList()
}

const handleViewDetail = (orderId) => {
  router.push(`/orderDetail?id=${orderId}`)
}

const showCancelDialog = ref(false)
const cancelOrderId = ref(null)
const isCancelling = ref(false)

const dialogTitle = computed(() => {
  if (!cancelOrderId.value) return '取消订单'
  const order = orders.value.find(o => o._id === cancelOrderId.value)
  if (order && activeRole.value === 'buyer' && order.status === 1 && !order.isBlindBox) {
    return '申请退款'
  }
  return '取消订单'
})

const handleCancel = (orderId) => {
  cancelOrderId.value = orderId
  showCancelDialog.value = true
}

const handleCancelConfirm = async (reason) => {
  if (isCancelling.value || !cancelOrderId.value) return
  isCancelling.value = true
  try {
    const order = orders.value.find(o => o._id === cancelOrderId.value)
    const shouldRefund = order && activeRole.value === 'buyer' && order.status === 1 && !order.isBlindBox
    if (shouldRefund) {
      await OrderRefundServer(cancelOrderId.value, reason)
      if (order) order.status = 5
    } else {
      await OrderCancelServer(cancelOrderId.value, reason)
      if (order) order.status = order.status === 1 ? 5 : 4
    }
  } catch (error) {
    console.error('操作失败:', error)
  } finally {
    isCancelling.value = false
    cancelOrderId.value = null
  }
}

onMounted(() => {
  getOrderList()
})
</script>

<template>
  <div class="box">
    <ReturnPage />
    <div class="title">
      我的订单<br />
      <span>My Orders</span>
    </div>

    <!-- 角色切换 -->
    <div class="role-tabs">
      <button
        v-for="role in [{ value: 'buyer', label: '我买入的' }, { value: 'seller', label: '我卖出的' }]"
        :key="role.value"
        :class="['role-tab', { active: activeRole === role.value }]"
        @click="switchRole(role.value)"
      >
        {{ role.label }}
      </button>
    </div>

    <!-- 状态筛选 -->
    <div class="status-tabs">
      <button
        v-for="option in statusOptions"
        :key="option.value"
        :class="['status-tab', { active: activeStatus === option.value }]"
        @click="switchStatus(option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <!-- 订单列表 -->
    <ul v-if="filteredOrders.length" class="order-box">
      <li v-for="order in filteredOrders" :key="order._id">
        <OrderCard
          :order="order"
          :status-map="statusMap"
          :is-buyer="activeRole === 'buyer'"
          :is-seller="activeRole === 'seller'"
          @pay="handlePay"
          @cancel="handleCancel"
          @view-detail="handleViewDetail"
        />
      </li>
    </ul>

    <!-- 空状态 -->
    <div v-else-if="!loading" class="empty-tip">暂无订单数据</div>

    <!-- 加载中 -->
    <div v-if="loading" class="loading-state">
      <p>加载中...</p>
    </div>

    <!-- 分页组件 -->
    <div class="pagination" v-if="total > 0">
      <button class="cta prev" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        <span class="hover-underline-animation">上一页</span>
      </button>

      <div class="page-info-wrapper">
        <span class="page-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
        <span class="total-info">共 {{ total }} 条</span>
      </div>

      <button class="cta next" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
        <span class="hover-underline-animation">下一页</span>
      </button>
    </div>
  </div>

  <CancelOrderDialog
    v-model:visible="showCancelDialog"
    :title="dialogTitle"
    @confirm="handleCancelConfirm"
  />
</template>

<style scoped>
.box {
  --main-color: #000;
  padding: 20px;
  background: var(--mg-white);
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: var(--mg-border);
  box-shadow: var(--mg-shadow);
  width: 100%;
  min-height: 100vh;
  margin-top: 80px;
  font-family: var(--mg-font);
}

.title {
  color: var(--mg-black);
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 10px;
}

.title span {
  color: var(--mg-black);
  font-weight: 600;
  font-size: 17px;
}

.role-tabs {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
  padding-bottom: 15px;
  border-bottom: var(--mg-border-light);
}

.role-tab {
  padding: 10px 20px;
  background: var(--mg-white);
  border: var(--mg-border-light);
  color: var(--mg-black);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--mg-shadow-sm);
  font-family: var(--mg-font);
}

.role-tab:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--mg-shadow);
}

.role-tab.active {
  background: var(--mg-black);
  color: var(--mg-white);
}

.status-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.status-tab {
  padding: 8px 16px;
  background: var(--mg-white);
  border: var(--mg-border-light);
  color: var(--mg-black);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--mg-font);
}

.status-tab:hover {
  background: var(--mg-gray);
}

.status-tab.active {
  background: var(--mg-black);
  color: var(--mg-white);
}

.order-box {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.empty-tip,
.loading-state {
  text-align: center;
  padding: 40px 0;
  color: var(--mg-black);
  font-size: 16px;
  background: var(--mg-white);
  border: var(--mg-border);
  box-shadow: var(--mg-shadow-sm);
  font-family: var(--mg-font);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: var(--mg-border-light);
}

.cta {
  position: relative;
  border: none;
  background: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0;
  transition: all 0.2s ease;
  overflow: visible;
}

.cta:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.cta span {
  padding-bottom: 7px;
  letter-spacing: 4px;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 500;
  color: var(--mg-black);
  font-family: var(--mg-font);
}

.cta::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 8px;
  height: 8px;
  border-top: 2px solid var(--mg-black);
  border-right: 2px solid var(--mg-black);
  transition: transform 0.3s ease;
  transform-origin: center;
}

.next::after {
  right: -24px;
  transform: translateY(-50%) rotate(45deg) translateX(-12px);
}
.next:hover:not(:disabled)::after {
  transform: translateY(-50%) rotate(45deg) translateX(0);
}

.prev::after {
  left: -24px;
  transform: translateY(-50%) rotate(-135deg) translateX(12px);
}
.prev:hover:not(:disabled)::after {
  transform: translateY(-50%) rotate(-135deg) translateX(0);
}

.hover-underline-animation {
  position: relative;
  padding-bottom: 20px;
}

.hover-underline-animation:after {
  content: "";
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: var(--mg-black);
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

.next:hover:not(:disabled) .hover-underline-animation:after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.prev .hover-underline-animation:after {
  transform-origin: bottom left;
}
.prev:hover:not(:disabled) .hover-underline-animation:after {
  transform: scaleX(1);
  transform-origin: bottom right;
}

.page-info-wrapper {
  display: flex;
  gap: 16px;
  background: var(--mg-gray);
  padding: 6px 16px;
  border: var(--mg-border-light);
  font-size: 14px;
  color: var(--mg-black);
  font-family: var(--mg-font-mono);
}

.page-info,
.total-info {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.page-info {
  border-right: var(--mg-border-light);
  padding-right: 16px;
}

[data-device="mobile"] .box {
  margin-top: 56px;
  padding: 12px;
  gap: 12px;
  border: none;
  box-shadow: none;
  min-height: 100dvh;
}

[data-device="mobile"] .title {
  font-size: 16px;
}

[data-device="mobile"] .title span {
  font-size: 14px;
}

[data-device="mobile"] .role-tabs {
  gap: 10px;
  padding-bottom: 10px;
}

[data-device="mobile"] .role-tab {
  padding: 8px 14px;
  font-size: 14px;
}

[data-device="mobile"] .status-tabs {
  gap: 6px;
}

[data-device="mobile"] .status-tab {
  padding: 6px 12px;
  font-size: 12px;
}

[data-device="mobile"] .order-box {
  row-gap: 12px;
}

[data-device="mobile"] .pagination {
  gap: 16px;
  flex-wrap: wrap;
}

[data-device="mobile"] .cta span {
  font-size: 12px;
  letter-spacing: 2px;
}

[data-device="mobile"] .page-info-wrapper {
  gap: 8px;
  padding: 4px 12px;
  font-size: 12px;
}

[data-device="mobile"] .page-info {
  padding-right: 8px;
}
</style>
