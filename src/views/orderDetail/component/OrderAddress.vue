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
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #FAC921;
  margin: 20px 0 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #555;
}

.address-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  background-color: #414141;
  width: fit-content;
  padding-right: 30px;
  padding-left: 20px;
  height: 30px;
  line-height: 30px;
  border-radius: 5px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  margin: 0;
}


.button {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  border: none;
  background: none;
  color: #0f1923;
  cursor: pointer;
  position: relative;
  padding: 8px;
  margin-bottom: 20px;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 14px;
  transition: all .15s ease;
  margin-top: 20px;
}

.button::before,
.button::after {
  content: '';
  display: block;
  position: absolute;
  right: 0;
  left: 0;
  height: calc(50% - 5px);
  border: 1px solid #7D8082;
  transition: all .15s ease;
}

.button::before {
  top: 0;
  border-bottom-width: 0;
}

.button::after {
  bottom: 0;
  border-top-width: 0;
}

.button:active,
.button:focus {
  outline: none;
}

.button:active::before,
.button:active::after {
  right: 3px;
  left: 3px;
}

.button:active::before {
  top: 3px;
}

.button:active::after {
  bottom: 3px;
}

.button_lg {
  position: relative;
  display: block;
  padding: 10px 20px;
  color: #fff;
  background-color: #0f1923;
  overflow: hidden;
  box-shadow: inset 0px 0px 0px 1px transparent;
}

.button_lg::before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 2px;
  background-color: #0f1923;
}

.button_lg::after {
  content: '';
  display: block;
  position: absolute;
  right: 0;
  bottom: 0;
  width: 4px;
  height: 4px;
  background-color: #0f1923;
  transition: all .2s ease;
}

.button_sl {
  display: block;
  position: absolute;
  top: 0;
  bottom: -1px;
  left: -8px;
  width: 0;
  background-color: #ff4655;
  transform: skew(-15deg);
  transition: all .2s ease;
}

.button_text {
  position: relative;
}

.button:hover {
  color: #0f1923;
}

.button:hover .button_sl {
  width: calc(100% + 15px);
}

.button:hover .button_lg::after {
  background-color: #fff;
}


</style>
