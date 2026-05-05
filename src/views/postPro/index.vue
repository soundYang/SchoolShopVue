<script setup>
defineOptions({
  name: 'postProPage'
})

import proInfoFrom from './component/proInfoFrom.vue'

import { ref, onMounted, onUnmounted, provide } from 'vue'
import { useToast } from '@/composables/useToast'
import { compressImage } from '@/unit/compressImage'
import { useRouter } from 'vue-router'

import { LabelGetAllServer } from '@/api/label'
import { ProductPublishServer } from '@/api/product'

const { showToast } = useToast()
const router = useRouter()

// 商品信息
const proFrom = ref({
  shopName: '',
  shopPrice: '',
  shopActualValue: '',
  shopNum: '',
  shopMsg: '',
  isBlinBox: true,
  shopImg: [],
  shopType: [],
  publishAddress: {}
})

// 获取标签
const labels = ref()
const getAllLabel = async () => {
  const res = await LabelGetAllServer()
  const raw = Array.isArray(res.data) ? res.data[0] : res.data
  const result = {}
  for (const key of ['mainLabel', 'attributeLabel', 'hotLabel']) {
    result[key] = Array.isArray(raw[key]) ? raw[key][0] : raw[key]
  }
  labels.value = result
}
getAllLabel()

const setProFrom = (data) => {
  proFrom.value = data
}

provide('proFrom', proFrom)
provide('setProFrom', setProFrom)
provide('labels', labels)

// 图片上传 - 存储 File 对象和临时 URL
const imgFiles = ref([]) // 存储 File 对象
const imgUrls = ref([])  // 存储临时 URL

const pushImg = async (e) => {
  if (imgFiles.value.length >= 6) {
    return showToast('最多上传六张图片')
  }
  const img = e.target.files[0]
  if (!img) {
    return showToast('请选择图片文件')
  }
  const newFile = await compressImage(img)
  if (newFile.size > 1 * 1024 * 1024) {
    return showToast('图片大小不能超过 1MB')
  }


  // 存储 File 对象
  imgFiles.value.push(newFile)
  // 创建临时 URL 用于预览
  const imageUrl = URL.createObjectURL(newFile)
  imgUrls.value.push(imageUrl)
}

// 删除图片
const removeImage = (index) => {
  // 释放临时 URL
  if (imgUrls.value[index]) {
    URL.revokeObjectURL(imgUrls.value[index])
  }
  imgFiles.value.splice(index, 1)
  imgUrls.value.splice(index, 1)
}

// 提交时设置图片
const setImgList = () => {
  if (!imgFiles.value.length) {
    showToast('请至少上传一张商品图片')
    return false
  }
  proFrom.value.shopImg = [...imgFiles.value] // 复制一份
  return true
}
provide('setImgList', setImgList)

// 获取图片列表容器引用
const imgShowRef = ref(null)

// 上传商品
const pushProduct = async (formData) => {
  try {
    const res = await ProductPublishServer(formData)
    if (res.msg && res.msg.includes('图片待管理员审核')) {
      showToast('商品已发布成功，图片待管理员审核通过后展示，请耐心等待')
    }
    router.push('/publishedPro')
  } catch (err) {
    const data = err?.response?.data || err
    if (data?.code === 400) {
      if (data.msg && data.msg.includes('不当信息')) {
        return
      }
      if (data.msg && data.msg.includes('图片包含违规内容')) {
        imgUrls.value.forEach(url => URL.revokeObjectURL(url))
        imgUrls.value = []
        imgFiles.value = []
        proFrom.value.shopImg = []
        return
      }
    }
    console.error('发布商品失败:', err)
  }
}
provide('pushProduct', pushProduct)

// 鼠标滚轮横向滚动处理
const handleWheel = (e) => {
  e.preventDefault()
  if (imgShowRef.value) {
    imgShowRef.value.scrollLeft += e.deltaY
  }
}

onMounted(() => {
  if (imgShowRef.value) {
    imgShowRef.value.addEventListener('wheel', handleWheel, { passive: false })
  }
})

// 组件卸载时释放所有临时 URL
onUnmounted(() => {
  if (imgShowRef.value) {
    imgShowRef.value.removeEventListener('wheel', handleWheel)
  }
  imgUrls.value.forEach(url => {
    if (url) URL.revokeObjectURL(url)
  })
})
</script>

<template>
  <div class="postProBox">
    <ReturnPage />
    <h1 class="title">上传商品图片</h1>
    <div class="photoBox">
      <input
        @change="pushImg"
        type="file"
        id="file"
        name="file"
        accept="image/*"
        class="postImg"
      />
      <div class="imgShow" ref="imgShowRef">
        <div
          v-for="(item, index) in imgUrls"
          :key="index"
          class="image-item"
        >
          <img :src="item" alt="商品图片">
          <button
            class="remove-btn"
            @click.stop="removeImage(index)"
            type="button"
          >
            ×
          </button>
        </div>
      </div>
    </div>
    <proInfoFrom />
  </div>
</template>

<style scoped>
.title {
  font-size: 25px;
  font-family: var(--mg-font-display);
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--mg-black);
}

.postProBox {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background: var(--mg-white);
  color: var(--mg-black);
  font-family: var(--mg-font);
  padding-top: 80px;
}

.photoBox {
  width: 100%;
  height: 300px;
  padding: 20px;
  display: flex;
  box-sizing: border-box;
  gap: 20px;
  border-bottom: var(--mg-border-light);
  position: relative;
}

.postImg {
  flex: 1;
  position: relative;
  opacity: 0;
  z-index: 2;
  cursor: pointer;
}

.photoBox::before {
  content: '+';
  position: absolute;
  left: 20px;
  top: 20px;
  width: calc((100% - 40px - 20px) / 6 - 10px);
  min-width: 100px;
  height: calc(100% - 40px);
  background: var(--mg-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 100px;
  color: var(--mg-black);
  pointer-events: none;
  z-index: 1;
  border: var(--mg-border-light);
}

.imgShow {
  flex: 5;
  display: flex;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  align-items: center;
  height: 100%;
  position: relative;
}

.imgShow::-webkit-scrollbar {
  display: none;
}

.image-item {
  position: relative;
  height: 100%;
  flex-shrink: 0;
}

.imgShow img {
  height: 100%;
  width: 280px;
  border: var(--mg-border-light);
  object-fit: cover;
  flex-shrink: 0;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 25px;
  height: 25px;
  background: var(--mg-black);
  color: var(--mg-white);
  border: none;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s;
  font-family: var(--mg-font-mono);
}

.remove-btn:hover {
  background: #ff4444;
  transform: scale(1.1);
}

[data-device="mobile"] .postProBox {
  padding: 12px;
  padding-top: 60px;
}

[data-device="mobile"] .title {
  font-size: 18px;
  margin-bottom: 12px;
}

[data-device="mobile"] .photoBox {
  height: 180px;
  padding: 12px;
  gap: 12px;
  flex-direction: column;
}

[data-device="mobile"] .photoBox::before {
  left: 12px;
  top: 12px;
  width: calc(33.33% - 16px);
  min-width: 60px;
  height: calc(100% - 24px);
  font-size: 48px;
}

[data-device="mobile"] .imgShow {
  flex: 1;
  gap: 10px;
}

[data-device="mobile"] .imgShow img {
  width: 160px;
}
</style>
