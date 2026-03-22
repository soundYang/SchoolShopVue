<script setup>
defineOptions({
  name: 'publishedPro'
})

import { useProductStore } from '@/stores'

const productStore = useProductStore()
productStore.getSellProductList()

</script>

<template>
  <div></div>
</template>

<style scoped>

</style>