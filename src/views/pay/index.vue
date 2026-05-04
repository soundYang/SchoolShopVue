<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { OrderPayServer } from '@/api/order'
import BuyButtom from '@/component/buyButtom.vue'
import { useToast } from '@/composables/useToast'
import { formatPrice } from '@/unit/format'

defineOptions({
  name: 'payPage'
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { Account } = storeToRefs(userStore)
const { showToast } = useToast()

const orderId = route.query.orderId
const totalPrice = Number(route.query.totalPrice) || 0

const isPaying = ref(false)
const paySuccess = ref(false)

const balance = computed(() => Account.value?.Balance || 0)
const canPay = computed(() => {
  const payAmount = Math.round(totalPrice * 100) / 100
  const userBalance = Math.round((Account.value?.Balance || 0) * 100) / 100
  return userBalance >= payAmount
})

const handlePay = async () => {
  if (!canPay.value || isPaying.value) return

  isPaying.value = true

  try {
    await OrderPayServer(orderId)
    paySuccess.value = true
    showToast('支付成功！')
    await userStore.putUser()
    setTimeout(() => {
      router.push('/layout')
    }, 2000)
  } catch (error) {
    const errMsg = error?.response?.data?.msg || ''
    if (errMsg === '订单状态异常或已被支付') {
      showToast('该订单已支付，请勿重复操作')
    } else {
      showToast('支付失败，请重试')
    }
  } finally {
    isPaying.value = false
  }
}
</script>

<template>
  <div class="pay-container">
    <div class="pay-card">
      <div class="pay-header">
        <ReturnPage />
        <h2 class="pay-title">订单支付</h2>
      </div>

      <div class="pay-content">
        <div class="order-info">
          <div class="info-row">
            <span class="info-label">订单编号</span>
            <span class="info-value order-id">{{ orderId || '暂无' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">支付金额</span>
            <span class="info-value price">¥{{ formatPrice(totalPrice) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">账户余额</span>
            <span class="info-value">¥{{ formatPrice(balance) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">支付后余额</span>
            <span class="info-value" :class="{ insufficient: !canPay }">
              ¥{{ formatPrice(balance - totalPrice) }}
            </span>
          </div>
        </div>

        <div v-if="!canPay" class="warning-box">
          <p>余额不足，请先充值</p>
        </div>

        <div v-if="paySuccess" class="success-box">
          <div class="success-icon">✓</div>
          <p>支付成功！正在跳转...</p>
        </div>

        <div class="pay-actions">
          <div v-if="isPaying" class="paying-text">支付中...</div>
          <BuyButtom
            v-if="!paySuccess"
            str="确认支付"
            :disabled="isPaying"
            @click="handlePay"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pay-container {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  padding-top: 100px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.pay-card {
  width: 100%;
  max-width: 500px;
  background: rgb(38, 38, 38);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.pay-header {
  background: linear-gradient(135deg, #ff5858, #ff3333);
  padding: 20px;
  position: relative;
}

.pay-title {
  margin: 0;
  text-align: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.pay-content {
  padding: 30px;
}

.order-info {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #3a3a3a;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: #888;
  font-size: 14px;
}

.info-value {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.info-value.order-id {
  font-size: 12px;
  color: #aaa;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-value.price {
  font-size: 28px;
  font-weight: bold;
  color: #ff5858;
}

.info-value.insufficient {
  color: #ff4444;
}

.warning-box {
  background: rgba(255, 68, 68, 0.2);
  border: 1px solid #ff5858;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
}

.warning-box p {
  margin: 0;
  color: #ff5858;
  font-size: 14px;
}

.success-box {
  background: rgba(0, 255, 136, 0.2);
  border: 1px solid #00ff88;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 20px;
  text-align: center;
}

.success-icon {
  width: 60px;
  height: 60px;
  background: #00ff88;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 30px;
  color: white;
  font-weight: bold;
}

.success-box p {
  margin: 0;
  color: #00ff88;
  font-size: 16px;
}

.paying-text {
  text-align: center;
  color: #ff5858;
  font-size: 14px;
  padding: 10px 0;
}

.pay-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.pay-btn {
  display: inline-block;
  padding: 15px 50px;
  background: linear-gradient(135deg, #ff5858, #ff3333);
  color: white;
  border-radius: 8px;
  font-weight: bold;
  font-size: 18px;
  transition: all 0.3s;
}

.pay-btn:not(.disabled):hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(255, 88, 88, 0.5);
}

.pay-btn.disabled {
  background: #555;
  cursor: not-allowed;
  opacity: 0.7;
}

.disabled {
  pointer-events: none;
  opacity: 0.6;
}

[data-device="mobile"] .pay-container {
  padding-top: 60px;
  padding: 12px;
  padding-top: 60px;
}

[data-device="mobile"] .pay-card {
  max-width: 100%;
  border-radius: 12px;
}

[data-device="mobile"] .pay-header {
  padding: 14px;
}

[data-device="mobile"] .pay-title {
  font-size: 18px;
}

[data-device="mobile"] .pay-content {
  padding: 16px;
}

[data-device="mobile"] .order-info {
  padding: 14px;
}

[data-device="mobile"] .info-row {
  padding: 10px 0;
}

[data-device="mobile"] .info-value.price {
  font-size: 22px;
}

[data-device="mobile"] .info-value.order-id {
  max-width: 120px;
  font-size: 11px;
}
</style>
