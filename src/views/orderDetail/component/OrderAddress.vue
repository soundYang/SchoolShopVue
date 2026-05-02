<script setup>
import { ref, computed } from 'vue'
import { AddressGetListServer } from '@/api/address'

const props = defineProps({
  order: { type: Object, required: true },
  addressInfo: { type: Object, default: null },
  isBuyer: { type: Boolean, default: false }
})

const emit = defineEmits(['change-address'])

const showAddressDialog = ref(false)
const addressList = ref([])
const loadingList = ref(false)

const loadAddressList = async () => {
  if (loadingList.value) return
  loadingList.value = true
  try {
    const res = await AddressGetListServer()
    addressList.value = res.data || []
    showAddressDialog.value = true
  } catch (e) {
    console.error('获取地址列表失败:', e)
  } finally {
    loadingList.value = false
  }
}

const handleSelectAddress = (addr) => {
  emit('change-address', addr)
  showAddressDialog.value = false
}

const deliverAddressId = computed(() => {
  const da = props.order?.deliverAddress
  return typeof da === 'string' ? da : da?._id
})
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
      <button v-if="order.status === 0" class="change-address-btn" @click="loadAddressList">{{ order.deliverAddress ? '修改地址' : '设置地址' }}</button>
    </div>

    <div v-if="showAddressDialog" class="dialog-overlay" @click.self="showAddressDialog = false">
      <div class="address-dialog">
        <div class="dialog-header">
          <span>选择收货地址</span>
          <button class="dialog-close" @click="showAddressDialog = false">✕</button>
        </div>
        <div class="dialog-body">
          <div
            v-for="addr in addressList"
            :key="addr._id"
            class="address-item"
            :class="{ active: addr._id === deliverAddressId }"
            @click="handleSelectAddress(addr)"
          >
            <div class="address-item-main">
              <span class="address-receiver">{{ addr.receiver }}</span>
              <span class="address-phone">{{ addr.phone }}</span>
              <span v-if="addr.isDefault" class="default-tag">默认</span>
            </div>
            <div class="address-detail">{{ addr.detail }}</div>
          </div>
          <div v-if="!addressList.length && !loadingList" class="no-address">暂无收货地址</div>
          <div v-if="loadingList" class="no-address">加载中...</div>
        </div>
      </div>
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

.change-address-btn {
  margin-top: 12px;
  padding: 8px 20px;
  background: #FAC921;
  color: #333;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}

.change-address-btn:hover {
  opacity: 0.8;
}

.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.address-dialog {
  background: #2a2a2a;
  border-radius: 12px;
  width: 420px;
  max-width: 90vw;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  color: #fff;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #444;
}

.dialog-close {
  background: none;
  border: none;
  color: #aaa;
  font-size: 18px;
  cursor: pointer;
}

.dialog-close:hover {
  color: #fff;
}

.dialog-body {
  padding: 12px 20px 20px;
  overflow-y: auto;
  flex: 1;
}

.address-item {
  padding: 12px 16px;
  border: 1px solid #444;
  border-radius: 8px;
  margin-top: 10px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.address-item:hover {
  border-color: #FAC921;
  background: rgba(250, 201, 33, 0.08);
}

.address-item.active {
  border-color: #FAC921;
  background: rgba(250, 201, 33, 0.15);
}

.address-item-main {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.address-receiver {
  font-weight: bold;
  font-size: 15px;
}

.address-phone {
  color: #aaa;
  font-size: 14px;
}

.default-tag {
  background: #FAC921;
  color: #333;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 3px;
}

.address-detail {
  font-size: 14px;
  color: #ccc;
}

.no-address {
  text-align: center;
  padding: 30px 0;
  color: #888;
}
</style>
