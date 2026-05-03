/**
 * 只存储用户的信息
 */


import { defineStore } from "pinia"
import { ref } from "vue" 
import { productGetUserListServer } from "@/api/product"

export const useProductStore = defineStore("product",() => { 
  const SellProduct = ref([])  // 卖的
  const BuyProduct = ref([])   // 买的
  const sellTotal = ref(0)

  const getSellProductList = async ({id, page = 1, pageSize = 10}) => { 
    const res = await productGetUserListServer(id, page, pageSize)
    setSellProduct(res.data)
    setSellTotal(res.total)
  }
  const setSellProduct = (product) => {
    SellProduct.value = product
  }
  const setBuyProduct = (product) => {
    BuyProduct.value = product
  }
  const setSellTotal = (total) => {
    sellTotal.value = total
  } 

  const clearSellProduct = () => {
    SellProduct.value = []
    sellTotal.value = 0
  }

  return {
    SellProduct,
    BuyProduct,
    sellTotal,
    setSellProduct,
    setBuyProduct,
    getSellProductList,
    clearSellProduct
   }
})