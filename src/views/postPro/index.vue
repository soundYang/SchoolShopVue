<script setup>
/**
 * base64上传图片过大
 * 修改前端后端将商品信息其改成file对象的形式上传
 */
defineOptions({
  name: 'postProPage'
})

import proInfoFrom from './component/proInfoFrom.vue'

import { ref, onMounted, onUnmounted, provide } from 'vue'
import { fileToBase64 } from '@/unit/fileToBase64'
import { useToast } from '@/composables/useToast'

import { LabelGetAllServer } from '@/api/label'
import { ProductPublishServer } from '@/api/product'

const { showToast } = useToast()

const proFrom = ref({
  shopName: '',
  shopPrice: '',
  shopActualValue: '',
  shopNum: '',
  shopMsg: '',
  isBlinBox: true,
  shopImg: [],
  shopType: [],
  publishAddress: {},
})   // 商品信息

// 获取标签
const labels = ref()
const getAllLabel = async () => {
  const res = await LabelGetAllServer()
  labels.value = res.data[0]
}
getAllLabel()

const setProFrom = (data) => {
  proFrom.value = data
}

provide('proFrom', proFrom)
provide('setProFrom', setProFrom)
provide('labels', labels)

// 图片上传
const imgList = ref([])
const pushImg = async (e) => { 
  if(imgList.value.length >= 6){
    return showToast('最多上传六张图片')
  }
  const img = e.target.files[0]
  if(!img) {
    return showToast('请选择图片文件')
  }
  if(img.size > 1 * 1024 * 1024) {
    return showToast('图片大小不能超过 1MB')
  }

  const base = await fileToBase64(img)
  imgList.value.push(base)
}
// 提交时设置图片
const setImgList = () => { 
  if(!imgList.value.length) {
    return false
  }
  
  proFrom.value.shopImg = imgList.value
  return true
} 
provide('setImgList', setImgList)
// 获取图片列表容器引用
const imgShowRef = ref(null)

// 上传商品
const pushProduct = async () => { 
  const res = await ProductPublishServer(proFrom.value)
  console.log(res)
}
provide('pushProduct', pushProduct)

// 鼠标滚轮横向滚动处理
const handleWheel = (e) => {
  e.preventDefault() // 阻止页面垂直滚动
  if (imgShowRef.value) {
    imgShowRef.value.scrollLeft += e.deltaY // 将垂直滚动量转换为水平滚动
  }
}

onMounted(() => {
  if (imgShowRef.value) {
    imgShowRef.value.addEventListener('wheel', handleWheel, { passive: false })
  }
})

onUnmounted(() => {
  if (imgShowRef.value) {
    imgShowRef.value.removeEventListener('wheel', handleWheel)
  }
})
</script>

<template>
  <div class="postProBox">
    <h1 class="title">上传商品图片</h1>
    <div class="photoBox">
       <input @change="pushImg" type="file" id="file" name="file" accept="image/*" class="postImg" />
       <div class="imgShow" ref="imgShowRef">
         <img 
         v-for="(item, index) in imgList" 
         :key="index"
         :src="item">
       </div>
    </div>
    <proInfoFrom/>
  </div>
</template>

<style scoped>
.title{
  font-size: 25px;
  font-family: '华文新魏';
  font-weight: 100;
}
.postProBox{
 width: 100%;
 height: 100%;
 padding: 20px;
 box-sizing: border-box;
}
.photoBox{
  width: 100%;
  height: 300px;
  padding: 20px;
  display: flex;
  box-sizing: border-box;
  gap: 20px; /* 替代 margin-left */
  border-bottom: 1px solid white;
}

.postImg{
  flex: 1;
  position: relative;
  border-radius: 20px;
  /* 隐藏原生输入，使用伪元素美化 */
  opacity: 0; 
  z-index: 2;
  cursor: pointer;
}

/* 美化上传按钮（替代伪元素） */
.photoBox {
  position: relative;
}
.photoBox::before {
  content: '+';
  position: absolute;
  left: 20px; /* 与父级 padding 一致 */
  top: 20px;
  width: calc( (100% - 40px - 20px) / 6 - 10px ); /* 动态计算与 flex:1 匹配，简单起见固定宽度也可 */
  min-width: 100px;
  height: calc(100% - 40px);
  background: #e8e8e8;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 100px;
  color: #090909;
  /* box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff; */
  pointer-events: none; /* 让点击穿透到 input */
  z-index: 1;
}

.imgShow{
  width: 1300px;
  display: flex;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  white-space: nowrap;
  align-items: center;
  height: 100%;
}
.imgShow::-webkit-scrollbar {
  display: none;
}
.imgShow>img{
  height: 100%;
  width: 280px;
  border: 1px solid white;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0; /* 防止图片缩小 */
}
</style>