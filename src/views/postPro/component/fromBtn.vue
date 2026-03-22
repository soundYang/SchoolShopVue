<script setup>
import { inject } from 'vue'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()
const proFrom = inject('proFrom')
const setImgList = inject('setImgList')

const proFromRegx = {
  shopName:{
    message: '商品名称长度2~20个字符',
    regx: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,20}$/
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
    regx: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,100}$/
  },
  [Symbol.iterator]: function* () {
    yield* Object.entries(proFromRegx)
  }
}

const pushProduct = inject('pushProduct')

const subPro = async () => {
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
  formData.append('shopName', proFrom.value.shopName)
  formData.append('shopPrice', proFrom.value.shopPrice)
  formData.append('shopActualValue', proFrom.value.shopActualValue)
  formData.append('shopNum', proFrom.value.shopNum)
  formData.append('shopMsg', proFrom.value.shopMsg)
  formData.append('isBlinBox', proFrom.value.isBlinBox)
  formData.append('shopType', JSON.stringify(proFrom.value.shopType))
  formData.append('publishAddress', JSON.stringify(proFrom.value.publishAddress))
  
  // 添加图片文件
  if (proFrom.value.shopImg && proFrom.value.shopImg.length) {
    proFrom.value.shopImg.forEach((file) => {
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
   height: 30px;
   padding: 0 30px;
   border: 2px solid #000;
   background: #e8e8e8;
   user-select: none;
   white-space: nowrap;
   transition: all .05s linear;
   font-family: inherit;
  }

  button:before, button:after {
   content: "";
   position: absolute;
   background: #e8e8e8;
   transition: all .2s linear;
  }

  button:before {
   width: calc(100% + 6px);
   height: calc(100% - 16px);
   top: 8px;
   left: -3px;
  }

  button:after {
   width: calc(100% - 16px);
   height: calc(100% + 6px);
   top: -3px;
   left: 8px;
  }

  button:hover {
   cursor: crosshair;
  }

  button:active {
   transform: scale(0.95);
  }

  button:hover:before {
   height: calc(100% - 32px);
   top: 16px;
  }

  button:hover:after {
   width: calc(100% - 32px);
   left: 16px;
  }

  button span {
   font-size: 15px;
   z-index: 3;
   position: relative;
   font-weight: 600;
  }
</style>
