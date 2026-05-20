<script setup>
import { ref, inject } from 'vue'
import { AddressAddServer, AddressUpdateServer } from '@/api/address'
import { useToast } from '@/composables/useToast'
import { rules } from '@/unit/validate'

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
    regx: rules.phoneNumber.rex,
    message: rules.phoneNumber.msg
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
    const val = addressFrom.value[key]
    if (typeof val === 'string') {
      addressFrom.value[key] = val.trim()
    }
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
  --font-color: #323232;
  --font-color-sub: #666;
  --bg-color: #fff;
  --main-color: #323232;
  padding: 20px;
  background: lightgrey;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
}

.title {
  color: var(--font-color);
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 25px;
}

.title span {
  color: var(--font-color-sub);
  font-weight: 600;
  font-size: 17px;
}

.input {
  width: 250px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color);
  padding: 5px 10px;
  outline: none;
}

.input::placeholder {
  color: var(--font-color-sub);
  opacity: 0.8;
}

.input:focus {
  border: 2px solid var(--input-focus);
}

.button-confirm {
  margin: 50px auto 0 auto;
  width: 120px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 17px;
  font-weight: 600;
  color: var(--font-color);
  cursor: pointer;
}

/* 自定义复选框容器 */
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

/* 隐藏原生复选框 */
.checkbox-hidden {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  pointer-events: none;
}

/* 自定义圆形复选框 */
.checkbox-custom {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  transition: all 0.2s ease;
  display: inline-block;
  box-sizing: border-box;
}

/* 选中状态样式 */
.checkbox-hidden:checked + .checkbox-custom {
  background-color: var(--input-focus); /* 选中时背景色变蓝，可自定义 */
  border-color: var(--main-color);
  box-shadow: 4px 4px var(--main-color);
}

/* 可选：添加一个内圆点表示选中，更符合圆形的视觉习惯 */
.checkbox-hidden:checked + .checkbox-custom::after {
  content: "";
  display: block;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  margin: 5px auto; /* 居中，取决于实际尺寸 */
}

/* 文字样式 */
.checkbox-text {
  color: var(--font-color);
  font-size: 15px;
  font-weight: 500;
}
</style>
