<script setup>
import { inject } from 'vue'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()
const proFrom = inject('proFrom')
const setImgList = inject('setImgList')

const proFromRegx = {
  shopName:{
    message: '商品名称长度2~20个字符',
    regx: /^.{2,100}$/
  },
  shopPrice:{
    message: '商品价格格式为1-9位数字',
    regx: /^[0-9]{1,9}$/
  },
  shopActualValue:{
    message: '商品估计价值格式为1-9位数字',
    regx: /^[0-9]{1,9}$/
  },
  shopNum:{
    message: '商品数量格式为1-3位数字',
    regx: /^[0-9]{1,3}$/
  },
  shopMsg:{
    message: '商品描述长度2~100个字符',
     regx: /^[\s\S]{2,100}$/
  },
  [Symbol.iterator]: function* () {
    yield* Object.entries(proFromRegx)
  }
}

const pushProduct = inject('pushProduct')

const subPro = async () => {
  // 先去除空格
  for (let key of ['shopName', 'shopPrice', 'shopActualValue', 'shopNum', 'shopMsg']) {
    proFrom.value[key] = proFrom.value[key].trim()
  }

  // 验证图片
  if (!setImgList()) {
    return showToast('请至少上传一张商品图片')
  }

  // 验证字段
  for (let [key, value] of Object.entries(proFromRegx)) {
    if (!value.regx.test(proFrom.value[key])) {
      return showToast(value.message)
    }
  }

  // 验证商品类型
  if (!proFrom.value.shopType.length) {
    return showToast('请选择商品类型')
  }

  // 验证地址
  if (!proFrom.value.publishAddress || !Object.keys(proFrom.value.publishAddress).length) {
    return showToast('请选择发货地址')
  }

  // 构建 FormData
  const formData = new FormData()

  // 添加普通字段
  formData.append('shopName', proFrom.value.shopName.trim())
  formData.append('shopPrice', proFrom.value.shopPrice.trim())
  formData.append('shopActualValue', proFrom.value.shopActualValue.trim())
  formData.append('shopNum', proFrom.value.shopNum.trim())
  formData.append('shopMsg', proFrom.value.shopMsg.trim())
  formData.append('isBlinBox', proFrom.value.isBlinBox)
  formData.append('shopType', JSON.stringify(proFrom.value.shopType))
  formData.append('publishAddress', JSON.stringify(proFrom.value.publishAddress))

  // 添加图片文件
  if (proFrom.value.shopImg && proFrom.value.shopImg.files) {
    proFrom.value.shopImg.files.forEach((file) => {
      formData.append('shopImg', file)
    })
  }

  // 调用上传接口
  await pushProduct(formData)
}
</script>

<template>
  <button @click.prevent="subPro">
    <span>
      提交
    </span>
  </button>
</template>

<style scoped>
  button {
   position: relative;
   height: 36px;
   padding: 0 30px;
   border: var(--mg-border-light);
   background: var(--mg-black);
   user-select: none;
   white-space: nowrap;
   transition: all .15s;
   font-family: var(--mg-font);
   color: var(--mg-white);
   font-weight: 600;
   font-size: 14px;
   cursor: pointer;
   box-shadow: var(--mg-shadow-sm);
  }

  button:hover {
   transform: translate(-2px, -2px);
   box-shadow: var(--mg-shadow);
  }

  button:active {
   transform: translate(1px, 1px);
   box-shadow: none;
  }
</style>
