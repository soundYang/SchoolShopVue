<script setup>
import BuyButtom from '@/component/buyButtom.vue'

defineProps({
  order: { type: Object, required: true },
  canPay: { type: Boolean, default: false },
  canCancel: { type: Boolean, default: false },
  canShip: { type: Boolean, default: false },
  canConfirm: { type: Boolean, default: false },
  isBuyer: { type: Boolean, default: false }
})

const emit = defineEmits(['pay', 'cancel', 'ship', 'confirm-receipt'])
</script>

<template>
  <div class="action-section">
    <BuyButtom
      v-if="canPay"
      str="立即支付"
      @click="emit('pay')"
    />
    <BuyButtom
      v-if="canCancel"
      :str="isBuyer && order.status === 1 && !order.isBlindBox ? '申请退款' : '取消订单'"
      @click="emit('cancel')"
    />
    <BuyButtom
      v-if="canShip"
      str="确认发货"
      @click="emit('ship')"
    />
    <BuyButtom
      v-if="canConfirm"
      str="确认收货"
      @click="emit('confirm-receipt')"
    />
  </div>
</template>

<style scoped>
.action-section {
  margin-top: 30px;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}
</style>
