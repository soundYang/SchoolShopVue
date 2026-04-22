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
</script>

<template>
  <div class="product-card group">
    <!-- 背景光晕层 -->
    <div class="bg-glow"></div>
    <!-- 扫描线动画 -->
    <div class="scan-line"></div>

    <div class="card-inner">
      <!-- 图片区域（圆形+光晕+悬浮效果） -->
      <div class="image-area">
        <div class="image-ring"></div>
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
            <i class="fas fa-user"></i> {{ addressInfo.receiver }}
          </div>
          <div class="address-line">
            <i class="fas fa-phone-alt"></i> {{ addressInfo.phone }}
          </div>
          <div class="address-line address-detail">
            <i class="fas fa-location-dot"></i> {{ addressInfo.detail }}
          </div>
        </div>

        <!-- 操作按钮组 -->
        <div class="actions">
          <button class="btn btn-outline" @click="goToDetail">
            <i class="fas fa-eye"></i> 查看
          </button>
          <button class="btn btn-outline" @click="onDelete">
            <i class="fas fa-trash-alt"></i> 删除
          </button>
          <button class="btn btn-primary" @click="onUpdateStatus">
            <i :class="product.shopStatus === 2 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            {{ product.shopStatus === 2 ? '上架' : '下架' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 装饰点 -->
    <div class="decor-dots">
      <span></span><span></span><span></span>
    </div>
  </div>
</template>

<style scoped>
/* 整体卡片容器 */
.product-card {
  position: relative;
  width: 100%;
  margin: 1.5rem auto;
  background: radial-gradient(circle at 30% 20%, #1a1a24, #0a0a0f);
  border-radius: 2rem;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 25px 40px -15px rgba(0, 0, 0, 0.6);
  transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 35px 55px -18px rgba(0, 0, 0, 0.8);
  border-color: rgba(255, 255, 255, 0.2);
}

/* 背景光晕层 */
.bg-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 70% 30%, rgba(80, 80, 140, 0.15), transparent 70%);
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.product-card:hover .bg-glow {
  opacity: 1;
}

/* 扫描线动画 */
.scan-line {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: scan 4s infinite linear;
  pointer-events: none;
  z-index: 1;
}

@keyframes scan {
  0% { left: -100%; }
  100% { left: 200%; }
}

/* 卡片内部结构 */
.card-inner {
  display: flex;
  gap: 1.2rem;
  padding: 1.5rem;
  position: relative;
  z-index: 2;
}

/* 图片区域 */
.image-area {
  position: relative;
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1), rgba(255,255,255,0.3));
  opacity: 0.6;
  transition: opacity 0.3s;
  animation: rotateRing 6s linear infinite;
}

@keyframes rotateRing {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.product-card:hover .image-ring {
  opacity: 1;
  filter: blur(1px);
}

.image-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: #00000055;
  border: 2px solid rgba(255,255,255,0.2);
  transition: all 0.3s ease;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .image-wrapper img {
  transform: scale(1.08);
}

/* 状态徽章（悬浮于图片上） */
.status-badge {
  position: absolute;
  bottom: -8px;
  right: -8px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  padding: 4px 12px;
  border-radius: 40px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  border: 1px solid rgba(255,255,255,0.2);
  white-space: nowrap;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.status-badge.selling {
  background: rgba(46, 125, 50, 0.8);
  color: #c8e6c9;
}
.status-badge.soldOut {
  background: rgba(120, 120, 120, 0.8);
  color: #e0e0e0;
}
.status-badge.pending {
  background: rgba(255, 152, 0, 0.8);
  color: #ffe0b2;
}
.status-badge.violation {
  background: rgba(244, 67, 54, 0.8);
  color: #ffcdd2;
}

/* 内容区域 */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
}

.product-name {
  font-size: 1.3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fff, #ccc);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: -0.3px;
}

.price-main {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffd966;
  text-shadow: 0 0 8px rgba(255, 200, 0, 0.3);
}

.description {
  font-size: 0.85rem;
  color: #b0b0b8;
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
  background: rgba(255,255,255,0.08);
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: 500;
  color: #ddd;
  border: 0.5px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(4px);
}
.tag.blind-box {
  background: rgba(156, 39, 176, 0.4);
  color: #e1bee7;
}

.original-price-row {
  font-size: 0.75rem;
  color: #aaa;
  display: flex;
  gap: 6px;
  align-items: baseline;
}
.original-price-row .label {
  opacity: 0.7;
}
.original-price-row .value {
  text-decoration: line-through;
}

/* 地址卡片 */
.address-card {
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 0.5px solid rgba(255,255,255,0.1);
  transition: all 0.2s;
}
.address-line {
  font-size: 0.7rem;
  color: #ccc;
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.address-line i {
  width: 16px;
  color: #aaa;
}
.address-detail {
  white-space: normal;
  line-height: 1.3;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 6px;
}

.btn {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  padding: 6px 16px;
  border-radius: 40px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #ececec;
  backdrop-filter: blur(4px);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.btn-primary {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.35);
  color: white;
}
.btn-primary:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}
.btn-outline:hover {
  background: rgba(255,255,255,0.12);
  transform: translateY(-2px);
}

/* 装饰点 */
.decor-dots {
  position: absolute;
  bottom: 12px;
  right: 20px;
  display: flex;
  gap: 6px;
  opacity: 0.3;
  transition: opacity 0.3s;
}
.decor-dots span {
  width: 5px;
  height: 5px;
  background: white;
  border-radius: 50%;
  animation: pulseDot 1.5s infinite alternate;
}
.decor-dots span:nth-child(2) { animation-delay: 0.2s; }
.decor-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes pulseDot {
  0% { opacity: 0.3; transform: scale(1); }
  100% { opacity: 1; transform: scale(1.2); }
}
.product-card:hover .decor-dots {
  opacity: 0.8;
}

/* 响应式布局 */
@media (max-width: 560px) {
  .card-inner {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }
  .image-area {
    width: 100px;
    height: 100px;
  }
  .title-row {
    justify-content: center;
  }
  .actions {
    justify-content: center;
  }
  .address-card {
    text-align: left;
  }
}
</style>