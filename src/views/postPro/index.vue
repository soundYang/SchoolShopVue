<script setup>
defineOptions({
  name: 'postProPage'
})

import proInfoFrom from './component/proInfoFrom.vue'

import { ref, onMounted, onUnmounted, provide, computed } from 'vue'
import { useToast } from '@/composables/useToast'
import { compressImage } from '@/unit/compressImage'
import { useRouter, useRoute } from 'vue-router'

import { LabelGetAllServer } from '@/api/label'
import { ProductPublishServer, ProductUpdateServer, ProductGetOneServer } from '@/api/product'
import { getImageUrl } from '@/unit/getImagerUrl'

const { showToast } = useToast()
const router = useRouter()
const route = useRoute()

const isEditMode = computed(() => !!route.query.id)
const productId = computed(() => route.query.id || '')

provide('isEditMode', isEditMode)
provide('productId', productId)

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
const imgFiles = ref([]) // 新上传的 File 对象
const imgUrls = ref([])  // 预览 URL（含已有图片和新上传的）
const existingImgUrls = ref([]) // 编辑模式下已有的图片 URL

const pushImg = async (e) => {
  const totalCount = imgFiles.value.length + existingImgUrls.value.length
  if (totalCount >= 6) {
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

  imgFiles.value.push(newFile)
  const imageUrl = URL.createObjectURL(newFile)
  imgUrls.value.push(imageUrl)
}

const removeImage = (index) => {
  const existingCount = existingImgUrls.value.length
  if (index < existingCount) {
    existingImgUrls.value.splice(index, 1)
  } else {
    const fileIndex = index - existingCount
    if (imgUrls.value[index]) {
      URL.revokeObjectURL(imgUrls.value[index])
    }
    imgFiles.value.splice(fileIndex, 1)
  }
  imgUrls.value.splice(index, 1)
}

const setImgList = () => {
  const totalCount = imgFiles.value.length + existingImgUrls.value.length
  if (!totalCount) {
    showToast('请至少上传一张商品图片')
    return false
  }
  proFrom.value.shopImg = {
    files: [...imgFiles.value],
    existing: [...existingImgUrls.value]
  }
  return true
}
provide('setImgList', setImgList)

const imgShowRef = ref(null)

const pushProduct = async (formData) => {
  try {
    if (isEditMode.value) {
      formData.append('_id', productId.value)
      if (existingImgUrls.value.length) {
        formData.append('existingImages', JSON.stringify(existingImgUrls.value))
      }
      await ProductUpdateServer(formData)
      showToast('商品已修改成功')
    } else {
      const res = await ProductPublishServer(formData)
      if (res.msg && res.msg.includes('图片待管理员审核')) {
        showToast('商品已发布成功，图片待管理员审核通过后展示，请耐心等待')
      }
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
        existingImgUrls.value = []
        proFrom.value.shopImg = []
        return
      }
    }
    console.error(isEditMode.value ? '修改商品失败:' : '发布商品失败:', err)
  }
}
provide('pushProduct', pushProduct)

const handleWheel = (e) => {
  e.preventDefault()
  if (imgShowRef.value) {
    imgShowRef.value.scrollLeft += e.deltaY
  }
}

onMounted(async () => {
  if (isEditMode.value) {
    try {
      const res = await ProductGetOneServer(productId.value)
      const product = res.data
      proFrom.value = {
        shopName: product.shopName || '',
        shopPrice: String(product.shopPrice || ''),
        shopActualValue: String(product.shopActualValue || ''),
        shopNum: String(product.shopNum || ''),
        shopMsg: product.shopMsg || '',
        isBlinBox: product.isBlinBox ?? true,
        shopImg: [],
        shopType: product.shopType || [],
        publishAddress: product.publishAddress || {}
      }
      if (product.shopImg && product.shopImg.length) {
        existingImgUrls.value = product.shopImg.map(img => typeof img === 'string' ? img : '')
        imgUrls.value = existingImgUrls.value.map(url => getImageUrl(url))
      }
    } catch (err) {
      console.error('加载商品信息失败:', err)
      showToast('加载商品信息失败')
      router.push('/publishedPro')
    }
  }

  if (imgShowRef.value) {
    imgShowRef.value.addEventListener('wheel', handleWheel, { passive: false })
  }
})

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
    <h1 class="title">{{ isEditMode ? '编辑商品图片' : '上传商品图片' }}</h1>
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
  scrollbar-width: thin;
  scroll-behavior: smooth;
}

.imgShow::-webkit-scrollbar {
  height: 6px;
}

.imgShow::-webkit-scrollbar-thumb {
  background: var(--mg-black);
  border-radius: 3px;
}

.image-item {
  position: relative;
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border: var(--mg-border-light);
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border: none;
  background: var(--mg-black);
  color: var(--mg-white);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.image-item:hover .remove-btn {
  opacity: 1;
}
</style>
