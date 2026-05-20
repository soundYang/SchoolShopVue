<script setup>
import { computed, inject } from 'vue'
import router from '@/router'
import { getImageUrl } from '@/unit/getImagerUrl'

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// 状态文本映射
const statusText = computed(() => {
  const map = { 0: '待审核', 1: '在售', 2: '下架', 3: '违规' }
  return map[props.product.shopStatus] || '在售'
})

// 状态样式类
const statusClass = computed(() => ({
  pending: props.product.shopStatus === 0,
  selling: props.product.shopStatus === 1,
  soldOut: props.product.shopStatus === 2,
  violation: props.product.shopStatus === 3
}))

// 商品图片（取第一张）
const coverImage = computed(() => {
  const images = props.product.shopImg
  return images?.length > 0 ? images[0] : ''
})

// 地址信息
const addressInfo = computed(() => {
  const addr = props.product.publishAddress
  if (!addr) return null
  return {
    receiver: addr.receiver || '未填写',
    phone: addr.phone || '未填写',
    detail: addr.detail || '未知地址'
  }
})

// 标签数组
const typeTags = computed(() => props.product.shopType || [])

// 注入方法
const updateProStatus = inject('updateProStatus')
const deletePro = inject('deletePro')

const onUpdateStatus = () => {
  updateProStatus(props.product._id, props.product.shopStatus === 1 ? 2 : 1)
}

const onDelete = () => {
  deletePro(props.product._id)
}

const goToDetail = () => {
  router.push({ name: 'productDetail', params: { id: props.product._id } })
}

const goToEdit = () => {
  router.push({ name: 'postPro', query: { id: props.product._id } })
}
</script>

<template>
  <div class="product-card">
    <div class="card-inner">
      <!-- 图片区域 -->
      <div class="image-area">
        <div class="image-wrapper">
          <img :src="getImageUrl(coverImage)" :alt="product.shopName" />
        </div>
        <div class="status-badge" :class="statusClass">
          {{ statusText }}
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <div class="title-row">
          <h3 class="product-name">{{ product.shopName }}</h3>
          <div class="price-main">¥{{ product.shopPrice }}</div>
        </div>

        <p class="description">{{ product.shopMsg || '暂无描述' }}</p>

        <!-- 标签组 -->
        <div v-if="typeTags.length" class="tags">
          <span v-for="tag in typeTags" :key="tag" class="tag">{{ tag }}</span>
          <span v-if="product.isBlindBox" class="tag blind-box">盲盒</span>
        </div>

        <!-- 原价信息 -->
        <div v-if="product.shopActualValue && product.shopActualValue !== product.shopPrice" class="original-price-row">
          <span class="label">价值</span>
          <span class="value">¥{{ product.shopActualValue }}</span>
        </div>

        <!-- 地址卡片 -->
        <div v-if="addressInfo" class="address-card">
          <div class="address-line">
            <span class="address-label">收货人:</span> {{ addressInfo.receiver }}
          </div>
          <div class="address-line">
            <span class="address-label">手机号:</span> {{ addressInfo.phone }}
          </div>
          <div class="address-line address-detail">
            <span class="address-label">地址:</span> {{ addressInfo.detail }}
          </div>
        </div>

        <!-- 操作按钮组 -->
        <div class="actions">
          <button class="action-btn view-btn" @click="goToDetail">
            查看
          </button>
          <button class="action-btn edit-btn" @click="goToEdit">
            编辑
          </button>
          <button class="action-btn delete-btn" @click="onDelete">
            删除
          </button>
          <button class="action-btn status-btn" @click="onUpdateStatus">
            {{ product.shopStatus === 2 ? '上架' : '下架' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: var(--mg-white);
  border: var(--mg-border);
  box-shadow: var(--mg-shadow-sm);
  margin-bottom: 20px;
  font-family: var(--mg-font);
}

.product-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--mg-shadow);
}

.card-inner {
  display: flex;
  gap: 15px;
  padding: 15px;
}

.image-area {
  position: relative;
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  overflow: hidden;
  border: var(--mg-border-light);
}

.image-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .image-wrapper img {
  transform: scale(1.05);
}

.status-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: bold;
  font-family: var(--mg-font-mono);
  white-space: nowrap;
  border: var(--mg-border-light);
}

.status-badge.selling {
  background: var(--mg-black);
  color: var(--mg-white);
}

.status-badge.soldOut {
  background: var(--mg-gray);
  color: var(--mg-black);
}

.status-badge.pending {
  background: var(--mg-white);
  color: var(--mg-black);
  border-style: dashed;
}

.status-badge.violation {
  background: var(--mg-white);
  color: var(--mg-black);
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
}

.product-name {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: var(--mg-black);
  line-height: 1.4;
}

.price-main {
  font-size: 18px;
  font-weight: bold;
  color: var(--mg-black);
  font-family: var(--mg-font-mono);
}

.description {
  margin: 0;
  font-size: 14px;
  color: var(--mg-black);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: var(--mg-gray);
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--mg-black);
  border: var(--mg-border-light);
  font-family: var(--mg-font-mono);
}

.tag.blind-box {
  background: var(--mg-black);
  color: var(--mg-white);
  border-color: var(--mg-black);
}

.original-price-row {
  font-size: 12px;
  color: var(--mg-black);
  display: flex;
  gap: 6px;
  align-items: baseline;
}

.original-price-row .label {
  opacity: 0.6;
}

.original-price-row .value {
  text-decoration: line-through;
  font-family: var(--mg-font-mono);
}

.address-card {
  background: var(--mg-gray);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  border: var(--mg-border-light);
}

.address-line {
  font-size: 12px;
  color: var(--mg-black);
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.address-label {
  font-weight: bold;
  min-width: 50px;
  flex-shrink: 0;
}

.address-detail {
  line-height: 1.3;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 5px;
}

.action-btn {
  padding: 6px 16px;
  border: var(--mg-border-light);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--mg-shadow-sm);
  background: var(--mg-white);
  color: var(--mg-black);
  font-family: var(--mg-font);
}

.action-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: var(--mg-shadow);
}

.action-btn:active {
  transform: translate(1px, 1px);
  box-shadow: none;
}

.action-btn.delete-btn {
  background: var(--mg-black);
  color: var(--mg-white);
}

.action-btn.status-btn {
  background: var(--mg-black);
  color: var(--mg-white);
}

.view-btn:hover {
  background: #f0f0f0;
}

.edit-btn {
  border-color: #2196f3;
  color: #2196f3;
}

.edit-btn:hover {
  background: #2196f3;
  color: white;
}

.delete-btn {
  border-color: #f44336;
  color: #f44336;
}

.delete-btn:hover {
  background: #f44336;
  color: white;
}

.status-btn {
  border-color: #ff9800;
  color: #ff9800;
}

.status-btn:hover {
  background: #ff9800;
  color: white;
}

/* 响应式布局 */
@media (max-width: 560px) {
  .card-inner {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 15px;
  }

  .image-area {
    width: 120px;
    height: 120px;
  }

  .title-row {
    justify-content: center;
  }

  .actions {
    justify-content: center;
  }

  .address-card {
    text-align: left;
    width: 100%;
  }
}
</style>
