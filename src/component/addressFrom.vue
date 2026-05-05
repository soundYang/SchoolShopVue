<script setup>
import { ref, inject } from 'vue'
import { AddressAddServer, AddressUpdateServer } from '@/api/address'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()
const props = defineProps({
  putAddress: Object
})

const from = {
  receiver: '',
  phone: '',
  detail: '',
  isDefault: false,
  [Symbol.iterator]: function * (){
    yield* Object.entries(addressFrom.value)
  }
}
const addressFrom = ref({
  ...from
})

const fromRegx = ref({
  receiver: {
    regx:/^[\u4e00-\u9fa5a-zA-Z0-9]{2,20}$/,
    message: '请输入2-20位中文或英文名'
  },
  phone: {
    regx:/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/,
    message: '请输入正确的手机号码'
  },
  detail: {
    regx:/^[\u4e00-\u9fa5a-zA-Z0-9\s\-·,.]{2,50}$/,
    message: '请输入2-50位详细地址'
  },
  [Symbol.iterator]: function * (){
    yield* Object.entries(fromRegx.value)
  }
})

if(props.putAddress.receiver){
  addressFrom.value = props.putAddress
  addressFrom.value[Symbol.iterator] = function * (){
    yield* Object.entries(addressFrom.value)
  }
}

const openAddressFrom = inject('openAddressFrom')
// 添加地址
const addInfo = async () => {
  for(let [key,value] of addressFrom.value){
    if(key === 'isDefault') continue
    if(!value){
      return showToast('请填写完整信息')
    }
  }
  if(!checkInfo()) return

  await AddressAddServer(addressFrom.value)
  openAddressFrom(1)
  addressFrom.value = {
    ...from
  }
}

// 修改地址
const putInfo = async () => {
  if(!checkInfo()) return

  await AddressUpdateServer(addressFrom.value)
  openAddressFrom(1)
  addressFrom.value = {
    ...from
  }
}

// 数据验证
const checkInfo = () => {
  for(let [ key, value ] of fromRegx.value){
    if(!value.regx.test(addressFrom.value[key])){
      showToast(value.message)
      return false
    }
  }
  return true
}
</script>

<template>
  <form class="form">
    <div v-if="!props.putAddress.receiver" class="title">新增地址<br><span>Add new address</span></div>
    <div v-else class="title">修改地址<br><span>Put new address</span></div>

    <input v-model="addressFrom.receiver" placeholder="收货人" required name="receiver" class="input">
    <input v-model="addressFrom.phone" placeholder="收货人电话" required name="phone" class="input">
    <input v-model="addressFrom.detail" placeholder="收货地址" required name="detail" class="input">

    <!-- 自定义圆形复选框 -->
    <label class="checkbox-wrapper">
      <input
        type="checkbox"
        v-model="addressFrom.isDefault"
        name="isDefault"
        class="checkbox-hidden"
      >
      <span class="checkbox-custom"></span>
      <span class="checkbox-text">设为默认地址</span>
    </label>

    <button v-if="!props.putAddress.receiver" @click.prevent="addInfo" class="button-confirm">添加</button>
    <button v-else @click.prevent="putInfo" class="button-confirm">修改</button>
  </form>
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

.button-confirm {
  margin: 50px auto 0 auto;
  width: 120px;
  height: 40px;
  border: var(--mg-border-light);
  background-color: var(--bg-color);
  box-shadow: var(--mg-shadow-sm);
  font-size: 17px;
  font-weight: 600;
  color: var(--font-color);
  cursor: pointer;
  font-family: var(--mg-font);
  transition: all 0.1s;
}

.button-confirm:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--mg-shadow);
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox-hidden {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  pointer-events: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--mg-black);
  background-color: var(--bg-color);
  box-shadow: var(--mg-shadow-sm);
  transition: all 0.2s ease;
  display: inline-block;
  box-sizing: border-box;
}

.checkbox-hidden:checked + .checkbox-custom {
  background-color: var(--mg-black);
  border-color: var(--mg-black);
  box-shadow: var(--mg-shadow-sm);
}

.checkbox-hidden:checked + .checkbox-custom::after {
  content: "";
  display: block;
  width: 8px;
  height: 8px;
  background: white;
  margin: 4px auto;
}

.checkbox-text {
  color: var(--font-color);
  font-size: 15px;
  font-weight: 500;
  font-family: var(--mg-font);
}
</style>
