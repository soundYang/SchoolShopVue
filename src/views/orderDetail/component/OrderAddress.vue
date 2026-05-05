<script setup>
defineProps({
  order: { type: Object, required: true },
  addressInfo: { type: Object, default: null },
  isBuyer: { type: Boolean, default: false }
})

const emit = defineEmits(['change-address', 'show-address-picker'])

const handleOpenPicker = () => {
  emit('show-address-picker')
}
</script>

<template>
  <div>
    <div v-if="order.deliverAddress || (order.isBlindBox && order.status === 0)" class="address-section">
      <div class="section-title">收货信息</div>
      <div v-if="addressInfo" class="address-info">
        <h4 class="info-item">收货地址：{{ addressInfo.detail }}</h4>
        <h4 class="info-item">收货人：{{ addressInfo.receiver }}</h4>
        <h4 class="info-item">手机号：{{ addressInfo.phone }}</h4>
      </div>
      <div v-else-if="order.deliverAddress" class="address-info">
        <h4 class="info-item">收货地址：{{ typeof order.deliverAddress === 'object' ? (order.deliverAddress.detail || '地址加载中') : '地址ID：' + order.deliverAddress }}</h4>
      </div>
      <div v-else class="address-info no-address-msg">
        <h4 class="info-item">暂未设置收货地址</h4>
      </div>
      <button v-if="order.status === 0" class="button" @click="handleOpenPicker">
        <span class="button_lg">
          <span class="button_sl"></span>
          <span class="button_text">{{ order.deliverAddress ? '修改地址' : '设置地址' }}</span>
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.address-section {
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

.address-info {
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

.button {
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 8px 20px;
  background: var(--mg-black);
  color: var(--mg-white);
  border: var(--mg-border-light);
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  font-family: var(--mg-font);
  box-shadow: var(--mg-shadow-sm);
}

.button:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--mg-shadow);
}

.button:active {
  transform: translate(1px, 1px);
  box-shadow: none;
}
</style>
