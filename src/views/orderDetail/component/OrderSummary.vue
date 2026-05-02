<script setup>
import { formatPrice } from '@/unit/format'
import CountDown from '@/component/CountDown.vue'

defineProps({
  order: { type: Object, required: true }
})
</script>

<template>
  <div>
    <div class="summary-section">
      <div class="summary-row">
        <span class="summary-label">商品单价</span>
        <span class="summary-value">¥{{ formatPrice(order.unitPrice) }}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">购买数量</span>
        <span class="summary-value">x{{ order.quantity }}</span>
      </div>
      <div class="summary-row total-row">
        <span class="summary-label">订单总价</span>
        <span class="summary-value total-price">¥{{ formatPrice(order.unitPrice * order.quantity) }}</span>
      </div>
    </div>

    <div v-if="order.status === 0" class="countdown-section">
      <CountDown :deadline="new Date(order.expireAt).getTime()" />
    </div>
  </div>
</template>

<style scoped>
.summary-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  color: #aaa;
  font-size: 14px;
}

.summary-value {
  color: #fff;
  font-size: 14px;
}

.total-row {
  margin-top: 10px;
  padding-top: 15px;
  border-top: 2px dashed #555;
}

.total-price {
  font-size: 28px;
  font-weight: bold;
  color: #ff5858;
}

.countdown-section {
  margin-top: 20px;
  padding: 15px 0;
  border-top: 2px dashed #555;
  display: flex;
  justify-content: flex-end;
}
</style>
