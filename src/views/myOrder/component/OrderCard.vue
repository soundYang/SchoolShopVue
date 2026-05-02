<script setup>
import { computed } from 'vue'
import BuyButtom from '@/component/buyButtom.vue'
import CountDown from '@/component/CountDown.vue'
import { getImageUrl } from '@/unit/getImagerUrl'
import { formatPrice } from '@/unit/format'
import blindBoxIcon from '@/assets/盲盒.png'

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  statusMap: {
    type: Object,
    default: () => ({})
  },
  isBuyer: {
    type: Boolean,
    default: false
  },
  isSeller: {
    type: Boolean,
    default: false
  }
})

defineEmits(['pay', 'view-detail', 'cancel'])

const isBlindBoxOrder = computed(() => props.order.isBlindBox)

const productInfo = computed(() => {
  if (isBlindBoxOrder.value && !props.order.productId) {
    return { shopName: '盲盒商品', shopImg: [] }
  }
  return props.order.productId || {}
})

const imageUrl = computed(() => {
  if (isBlindBoxOrder.value && !props.order.productId?.shopImg?.length) {
    return blindBoxIcon
  }
  const imgs = productInfo.value.shopImg
  return imgs?.length ? getImageUrl(imgs[0]) : ''
})

const orderQuantity = computed(() => props.order.quantity || 1)

const formatTime = (time) => {
  if (!time) return '暂无'
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="order-card">
    <div class="order-header">
      <span class="order-id">订单编号: {{ order._id }}</span>
      <div class="order-header-right">
        <span v-if="order.isBlindBox" class="blind-box-tag">盲盒</span>
        <span
          class="order-status"
          :style="{ color: statusMap[order.status]?.color || '#999' }"
        >
          {{ statusMap[order.status]?.text || '未知状态' }}
        </span>
      </div>
    </div>

    <div class="order-content">
      <div class="product-info">
        <div class="product-image">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="productInfo.shopName"
          />
          <div v-else class="image-placeholder">暂无图片</div>
        </div>
        <div class="product-details">
          <h3 class="product-name">{{ productInfo.shopName || '商品信息未获取' }}</h3>
          <div class="product-price">¥{{ formatPrice(order.unitPrice) }}</div>
          <div class="product-quantity">数量: x{{ orderQuantity }}</div>
        </div>
      </div>

      <div class="order-summary">
        <div class="summary-row">
          <span class="summary-label">订单总价</span>
          <span class="summary-value">¥{{ formatPrice(order.unitPrice * orderQuantity) }}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">下单时间</span>
          <span class="summary-value">{{ formatTime(order.orderTime) }}</span>
        </div>
      </div>
      <div v-if="order.status === 0" class="order-countdown">
        <CountDown
          :deadline="new Date(order.expireAt).getTime()"
          size="small"
        />
      </div>
    </div>

    <div class="order-actions">
      <button
        class="action-btn view-btn"
        @click="$emit('view-detail', order._id)"
      >
        查看详情
      </button>
      <BuyButtom
        v-if="order.status === 0 && isBuyer"
        str="立即支付"
        @click="$emit('pay', order._id)"
      />
      <button
        v-if="(isBuyer && (order.status === 0 || (order.status === 1 && !order.isBlindBox))) || (isSeller && (order.status === 0 || order.status === 1))"
        class="action-btn cancel-btn"
        @click="$emit('cancel', order._id)"
      >
        {{ isBuyer && order.status === 1 && !order.isBlindBox ? '申请退款' : '取消订单' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.order-card {
  background: white;
  border-radius: 8px;
  border: 2px solid var(--main-color);
  box-shadow: 3px 3px var(--main-color);
  overflow: hidden;
  transition: transform 0.3s;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 4px 4px var(--main-color);
}

.order-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.blind-box-tag {
  background: #FAC921;
  color: #333;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 4px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #f8f8f8;
  border-bottom: 1px solid #ddd;
}

.order-id {
  font-size: 14px;
  color: var(--font-color-sub);
}

.order-status {
  font-size: 14px;
  font-weight: bold;
}

.order-content {
  padding: 15px;
}

.product-info {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid #ddd;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: bold;
  color: var(--font-color);
  line-height: 1.4;
}

.product-price {
  font-size: 16px;
  font-weight: bold;
  color: #ff5858;
}

.product-quantity {
  font-size: 12px;
  color: var(--font-color-sub);
}

.order-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-countdown {
  padding: 8px 0;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  color: var(--font-color-sub);
  font-size: 12px;
}

.summary-value {
  color: var(--font-color);
  font-size: 12px;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  padding: 12px 15px;
  background: #f8f8f8;
  border-top: 1px solid #ddd;
  gap: 8px;
}

.action-btn {
  padding: 4px 12px;
  border: 2px solid var(--main-color);
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 1px 1px var(--main-color);
}

.pay-btn {
  background: #ff5858;
  color: white;
  border-color: #ff5858;
  font-weight: bold;
}

.pay-btn:hover {
  background: #ff3333;
  transform: translateY(-1px);
  box-shadow: 3px 3px #ff5858;
}

.view-btn {
  background: white;
  color: var(--font-color);
}

.view-btn:hover {
  background: #f0f0f0;
  transform: translateY(-1px);
  box-shadow: 3px 3px var(--main-color);
}

.cancel-btn {
  background: #ff5858;
  color: white;
  border: 2px solid #ff5858;
}

.cancel-btn:hover {
  background: #e04a4a;
  border-color: #e04a4a;
}

.order-actions :deep(.box-button) {
  border-width: 2px;
  padding-bottom: 6px;
}

.order-actions :deep(.button) {
  border-width: 2px;
  padding: 3px 10px;
}

.order-actions :deep(.button span) {
  font-size: 11px;
}

@media (max-width: 768px) {
  .product-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .product-image {
    width: 120px;
    height: 120px;
  }
}
</style>
