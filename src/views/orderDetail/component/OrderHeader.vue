<script setup>
defineProps({
  order: { type: Object, required: true },
  statusText: { type: String, default: '' },
  statusColor: { type: String, default: '#999' }
})

const formatTime = (time) => {
  if (!time) return '暂无'
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
</script>

<template>
  <div class="order-header">
    <div class="header-top">
      <div class="header-status-group">
        <span v-if="order.isBlindBox" class="blind-box-badge">盲盒订单</span>
        <span class="order-status" :style="{ color: statusColor }">
          {{ statusText }}
        </span>
      </div>
    </div>

    <div class="header-info">
      <h4 class="info-item">订单编号：{{ order._id }}</h4>
      <h4 class="info-item">下单时间：{{ formatTime(order.orderTime) }}</h4>
      <h4 v-if="order.payTime" class="info-item">付款时间：{{ formatTime(order.payTime) }}</h4>
    </div>
  </div>
</template>

<style scoped>
.order-header {
  background-color: var(--mg-black);
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.header-top {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.header-status-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.blind-box-badge {
  background: var(--mg-white);
  color: var(--mg-black);
  font-size: 12px;
  font-weight: bold;
  padding: 4px 10px;
  border: 2px solid var(--mg-black);
}

.order-status {
  font-size: 20px;
  font-weight: bold;
  color: var(--mg-white);
  font-family: var(--mg-font-display);
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  background-color: var(--mg-gray);
  width: fit-content;
  padding-right: 30px;
  padding-left: 20px;
  height: 30px;
  line-height: 30px;
  color: var(--mg-black);
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  font-family: var(--mg-font);
  border: var(--mg-border-light);
}
</style>
