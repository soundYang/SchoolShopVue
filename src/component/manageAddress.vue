<script setup>
import { ref, inject } from 'vue'
import AddressButtonCom from '@/views/User/component/AddressButtonCom.vue'
import { AddressGetListServer, AddressDeleteServer } from '@/api/address'
import { useUserStore } from '@/stores'

const { putUser } = useUserStore()

// 地址数据
const addresses = ref([])

const getAddressList = async () => {
  const res = await AddressGetListServer()
  addresses.value = res.data
  putUser()
} 
getAddressList()

// 当前选中的地址ID
const selectedAddress = ref()
const openAddressFrom = inject('openAddressFrom')

const openPutAddressFrom = inject('openPutAddressFrom')
// 将修改的地址数据传递给父组件
const putAddress = (id) => {
  const address = addresses.value.find(item => item._id === id)
  openPutAddressFrom(address)
}

// 删除地址
const delAdress = async (id) => { 
  await AddressDeleteServer(id)
  addresses.value = addresses.value.filter(item => item._id !== id)
  putUser()
}

/**
 * 为什么是4
 * 因为先做的user页面，所以固定为4
 */
const openAddress = () => {
  putAddress()   // 清空putAddress当中缓存的数据
  openAddressFrom(4)
}

defineExpose({
  selectedAddress,
  addresses
})
</script>

<template>
  <div class="address-list">
    <AddressButtonCom @click="openAddress">
      新增地址
    </AddressButtonCom>
    
    <div v-if="addresses.length">
      <div
        v-for="address in addresses"
        :key="address._id"
        class="address-item"
      >
        <!-- 隐藏的原始 radio，通过 v-model 绑定选中值 -->
        <input
          type="radio"
          receiver="address-radio"
          :id="'addr-' + address._id"
          :value="address._id"
          v-model="selectedAddress"
          class="hidden-radio"
        />

        <!-- 自定义卡片，点击时选中当前地址 -->
        <div
          class="address-card"
          :class="{ active: selectedAddress === address._id }"
          @click="selectedAddress = address._id"
        >
          <!-- 左侧圆形指示器（完全保留原 ::before 的样式和动画） -->
          <span class="radio-indicator"></span>

          <!-- 右侧地址详细信息（可自由定制内容） -->
          <div class="address-info">
            <div>
              <div class="info-row">
                <span class="name">{{ address.receiver }}</span>
                <span class="phone">{{ address.phone }}</span>
                <span v-if="address.isDefault" class="default-tag">默认</span>
              </div>
              <div class="address-detail">{{ address.detail }}</div>
            </div>
            <div class="iconBox">
              <i @click="putAddress(address._id)" class="iconfont icon-xiugai"></i>
              <i @click="delAdress(address._id)" class="iconfont icon-shanchu"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <h2 v-else class="noAddress">暂无地址</h2>
  </div>
</template>

<style scoped>
.address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: var(--mg-font);
  font-size: 16px;
  font-weight: 600;
  color: var(--mg-black);
  overflow: scroll;
  height: 300px; 
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.address-list::-webkit-scrollbar{
  display: none;
}
.address-item {
  position: relative;
}

.hidden-radio {
  display: none;
}

.address-card {
  display: flex;
  align-items: center;
  padding: 10px 10px 10px 30px;
  border: var(--mg-border-light);
  background-color: var(--mg-white);
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease-in-out;
  box-shadow: var(--mg-shadow-sm);
}

.address-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--mg-shadow);
}

.radio-indicator {
  content: "";
  display: block;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background-color: var(--mg-white);
  border: 2px solid var(--mg-black);
  transition: all 0.3s ease-in-out;
}

.address-card.active {
  background-color: var(--mg-black);
  color: var(--mg-white);
  border-color: var(--mg-black);
}

.address-card.active .radio-indicator {
  background-color: var(--mg-white);
  border-color: var(--mg-white);
  top: 0;
}

.address-info {
  width: 100%;
  margin-left: 20px;
  display: flex;
  justify-content: space-between;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.name {
  font-weight: 600;
  font-size: 16px;
}

.phone {
  color: #666;
  font-size: 14px;
}

.address-card.active .phone {
  color: rgba(255, 255, 255, 0.8);
}

.default-tag {
  background-color: var(--mg-black);
  color: var(--mg-white);
  font-size: 12px;
  padding: 2px 8px;
  font-weight: 500;
  border: 2px solid var(--mg-black);
}

.address-detail {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.address-card.active .address-detail {
  color: rgba(255, 255, 255, 0.8);
}
.iconBox{
  display: flex;
  padding: 10px;
  gap: 20px;
}
.iconBox>i{
  font-size: 25px;
  color: var(--mg-black);
}
.address-card.active .iconBox>i{
  color: var(--mg-white);
}
.noAddress{
  text-align: center;
  color: var(--mg-black);
  line-height: 200px;
  font-family: var(--mg-font);
}
</style>