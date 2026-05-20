<script setup>
import LabelBox from './LabelBox.vue'
import PopupLayerCom from '@/component/PopupLayerCom.vue'
import manageAddress from '@/component/manageAddress.vue'
import addressFrom from '@/component/addressFrom.vue'

import fromBtn from './fromBtn.vue'
import { provide, inject, ref, watch } from 'vue'


const proFrom = inject('proFrom')
const setProFrom = inject('setProFrom')

// 定义需要循环的字段（排除 shopMsg 和 isBlindBox，单独处理）
const fields = [
  { key: 'shopName', placeholder: '商品名称' },
  { key: 'shopPrice', placeholder: '商品价格' },
  { key: 'shopActualValue', placeholder: '商品估计价值' },
  { key: 'shopNum', placeholder: '商品数量' }
]

const visible = ref(false)
const count = ref(0)  // 控制弹框显示表单

// 获取选中地址
const manageAddressRef = ref(null)

const close = () => {
  visible.value = false
}
provide('close', close)

// 地址管理
const openAddress = () => {
  visible.value = true
  count.value = 1
}

watch(() => manageAddressRef.value?.selectedAddress,() => {
  if(manageAddressRef.value?.selectedAddress){
    proFrom.value.publishAddress = manageAddressRef.value.addresses.find(item => item._id === manageAddressRef.value.selectedAddress)
  }
})
const openAddressFrom = (value) => {
  count.value = value
}
provide('openAddressFrom', openAddressFrom)

// 将要修改的数据传入addressFrom子组件
const putAddress = ref({})
const openPutAddressFrom = (address) => {
  putAddress.value = {
    ...address
  }
  count.value = 4
}
provide('openPutAddressFrom', openPutAddressFrom)


</script>

<template>
  <div>
    <form class="form">
      <div class="title">商品信息<br><span>Product Information</span></div>

      <!-- 循环渲染输入框 -->
      <input
        v-for="field in fields"
        :key="field.key"
        :value="proFrom[field.key]"
        @input="setProFrom({ ...proFrom, [field.key]: $event.target.value })"
        :placeholder="field.placeholder"
        class="input"
        type="text"
      />

      <!-- 商品标签 -->
      <div class="label">
        <label @click="visible = true, count = 0">选择商品标签</label>
        <ul v-if="proFrom.shopType.length" class="lableList">
          <li
          v-for="item in proFrom.shopType"
          :key="item">
            {{ item }}
          </li>
        </ul>
      </div>

      <!-- 地址选择 -->
      <div>
        <label class="address" @click="openAddress">选择发货地址</label>
        <div class="addressInfo" v-if="proFrom.publishAddress.detail">
          <h5>{{ proFrom.publishAddress.detail }}</h5>
          <span>|</span>
          <h5>{{ proFrom.publishAddress.receiver }}</h5>
          <span>|</span>
          <h5>{{ proFrom.publishAddress.phone }}</h5>
          <span>|</span>
        </div>
      </div>

      <!-- 单独处理多行文本 -->
      <textarea
        :value="proFrom.shopMsg"
        @input="setProFrom({ ...proFrom, shopMsg: $event.target.value })"
        placeholder="商品描述"
        class="input proMsg"
      ></textarea>

      <!-- 复选框 -->
      <label class="custom-checkbox">
        <span style="margin-right: 20px;">是否允许为盲盒</span>
        <input
          :checked="proFrom.isBlindBox"
          @change="setProFrom({ ...proFrom, isBlindBox: $event.target.checked })"
          type="checkbox"
        />
        <span class="checkmark"></span>
      </label>

      <fromBtn />
    </form>

    <!-- 选择标签弹层 -->
    <PopupLayerCom v-model:visible="visible" @close="close">
      <!-- 标签选择 -->
      <LabelBox  v-if="count === 0"/>
      <!-- 修改地址 -->
      <addressFrom
      v-if="count === 4"
      :putAddress="putAddress"
      @openPutAddressFrom="openPutAddressFrom"/>
      <!-- 地址管理 -->
      <manageAddress ref="manageAddressRef" v-if="count === 1"/>
    </PopupLayerCom>
  </div>
</template>


<style scoped>
.form {
    --input-focus: #2d8cf0;
    --font-color: #000;
    --font-color-sub: #666;
    --bg-color: #fff;
    --main-color: #000;
    padding: 20px;
    background: var(--mg-white);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    border: var(--mg-border);
    box-shadow: var(--mg-shadow);
  }

  .title {
    color: var(--font-color);
    font-weight: 900;
    font-size: 20px;
    margin-bottom: 25px;
    font-family: var(--mg-font);
  }

  .title span {
    color: var(--font-color-sub);
    font-weight: 600;
    font-size: 17px;
    font-family: var(--mg-font);
  }

  .input {
    width: 250px;
    height: 40px;
    border: var(--mg-border-light);
    background-color: var(--bg-color);
    box-shadow: var(--mg-shadow-sm);
    font-size: 15px;
    font-weight: 600;
    color: var(--font-color);
    padding: 5px 10px;
    outline: none;
    font-family: var(--mg-font);
  }

  .input::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }

  .input:focus {
    border: 2px solid var(--mg-black);
  }

  .proMsg{
    width: 1000px;
    height: 100px;
  }

  .custom-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-size: 16px;
  color: var(--mg-black);
  transition: color 0.3s;
  font-family: var(--mg-font);
}

.custom-checkbox input[type="checkbox"] {
  display: none;
}

.custom-checkbox .checkmark {
  width: 24px;
  height: 24px;
  border: var(--mg-border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  transition: background-color 0.3s, border-color 0.3s, transform 0.3s;
  transform-style: preserve-3d;
}

.custom-checkbox .checkmark::before {
  content: "\2713";
  font-size: 16px;
  color: transparent;
  transition: color 0.3s, transform 0.3s;
}

.custom-checkbox input[type="checkbox"]:checked + .checkmark {
  background-color: var(--mg-black);
  border-color: var(--mg-black);
  transform: scale(1.1) rotateZ(360deg) rotateY(360deg);
}

.custom-checkbox input[type="checkbox"]:checked + .checkmark::before {
  color: var(--mg-white);
}

.custom-checkbox:hover {
  color: #666;
}

.custom-checkbox:hover .checkmark {
  border-color: #666;
  background-color: var(--mg-gray);
  transform: scale(1.05);
}

.custom-checkbox input[type="checkbox"]:focus + .checkmark {
  box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.2);
  outline: none;
}

.custom-checkbox .checkmark,
.custom-checkbox input[type="checkbox"]:checked + .checkmark {
  transition: background-color 1.3s, border-color 1.3s, color 1.3s, transform 0.3s;
}

.label,
.address{
  cursor: pointer;
  font-family: var(--mg-font);
  color: var(--mg-black);
}
.label>label:hover,
.address:hover{
  color: var(--mg-black);
  text-decoration: underline;
}

.lableList{
  display: flex;
  flex-wrap: wrap;
  color: var(--mg-black);
  gap: 10px;
}

.addressInfo{
  display: flex;
  gap: 15px;
}
.addressInfo>h5{
  line-height: 30px;
  color: var(--mg-black);
}
</style>
