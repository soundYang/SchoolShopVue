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
  font-family: var(--mg-font);
}

.pay-card {
  width: 100%;
  max-width: 500px;
  background: var(--mg-white);
  border: var(--mg-border);
  box-shadow: var(--mg-shadow);
}

.pay-header {
  background: var(--mg-black);
  padding: 20px;
  position: relative;
  border-bottom: var(--mg-border);
}

.pay-title {
  margin: 0;
  text-align: center;
  color: var(--mg-white);
  font-size: 24px;
  font-weight: bold;
  font-family: var(--mg-font-display);
}

.pay-content {
  padding: 30px;
}

.order-info {
  background: var(--mg-gray);
  padding: 20px;
  margin-bottom: 20px;
  border: var(--mg-border-light);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: var(--mg-border-light);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: var(--mg-black);
  font-size: 14px;
}

.info-value {
  color: var(--mg-black);
  font-size: 14px;
  font-weight: 500;
}

.info-value.order-id {
  font-size: 12px;
  color: var(--mg-black);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--mg-font-mono);
}

.info-value.price {
  font-size: 28px;
  font-weight: bold;
  color: var(--mg-black);
  font-family: var(--mg-font-mono);
}

.info-value.insufficient {
  color: var(--mg-black);
  text-decoration: line-through;
}

.warning-box {
  background: var(--mg-white);
  border: var(--mg-border-light);
  border-style: dashed;
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
}

.warning-box p {
  margin: 0;
  color: var(--mg-black);
  font-size: 14px;
  font-family: var(--mg-font-mono);
}

.success-box {
  background: var(--mg-white);
  border: var(--mg-border);
  padding: 30px;
  margin-bottom: 20px;
  text-align: center;
}

.success-icon {
  width: 60px;
  height: 60px;
  background: var(--mg-black);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 30px;
  color: var(--mg-white);
  font-weight: bold;
  border: var(--mg-border-light);
}

.success-box p {
  margin: 0;
  color: var(--mg-black);
  font-size: 16px;
  font-family: var(--mg-font);
}

.paying-text {
  text-align: center;
  color: var(--mg-black);
  font-size: 14px;
  padding: 10px 0;
  font-family: var(--mg-font-mono);
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
  background: var(--mg-black);
  color: var(--mg-white);
  font-weight: bold;
  font-size: 18px;
  transition: all 0.2s;
  border: var(--mg-border);
  box-shadow: var(--mg-shadow);
  font-family: var(--mg-font-display);
  cursor: pointer;
}

.pay-btn:not(.disabled):hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--mg-black);
}

.pay-btn:not(.disabled):active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.pay-btn.disabled {
  background: var(--mg-gray);
  color: var(--mg-black);
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
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
