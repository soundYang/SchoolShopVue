import { defineStore } from "pinia"
import { ref } from "vue" 
import { productGetUserListServer } from "@/api/product"

export const useProductStore = defineStore("product",() => { 
 
  const getSellProductList = async (id) => { 
    const res = await productGetUserListServer(id)
    setSellProduct(res.data)
  }
  const SellProduct = ref([])  // 卖的
  const BuyProduct = ref([])   // 买的

  const setSellProduct = (product) => {
    SellProduct.value = product
  }
  const setBuyProduct = (product) => {
    BuyProduct.value = product
  }

  return {
    SellProduct,
    BuyProduct,
    setSellProduct,
    setBuyProduct,
    getSellProductList
   }
})