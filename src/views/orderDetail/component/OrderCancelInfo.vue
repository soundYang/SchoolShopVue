<script setup>
defineProps({
  order: { type: Object, required: true }
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
  <div>
    <div v-if="order.status === 4 && order.cancelReason" class="cancel-info-section">
      <div class="section-title">取消信息</div>
      <div class="cancel-info">
        <h4 class="info-item">取消原因：{{ order.cancelReason }}</h4>
        <h4 v-if="order.cancelTime" class="info-item">取消时间：{{ formatTime(order.cancelTime) }}</h4>
        <h4 class="info-item">取消方：{{ order.cancelBy === 'buyer' ? '买家' : '卖家' }}</h4>
      </div>
    </div>

    <div v-if="order.status === 5" class="cancel-info-section">
      <div class="section-title">{{ order.cancelBy === 'buyer' ? '退款信息' : '取消信息' }}</div>
      <div class="cancel-info">
        <h4 v-if="order.cancelReason" class="info-item">原因：{{ order.cancelReason }}</h4>
        <h4 v-if="order.cancelTime" class="info-item">{{ order.cancelBy === 'buyer' ? '退款' : '取消' }}时间：{{ formatTime(order.cancelTime) }}</h4>
        <h4 class="info-item">操作方：{{ order.cancelBy === 'buyer' ? '买家' : '卖家' }}</h4>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cancel-info-section {
  margin-top: 10px;
  font-family: var(--mg-font);
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--mg-black);
  margin: 20px 0 15px;
  padding-bottom: 8px;
  border-bottom: var(--mg-border-light);
  font-family: var(--mg-font);
}

.cancel-info {
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
