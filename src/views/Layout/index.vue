<script setup>
import SearchCom from './component/SearchCom.vue'
import SearchMsgCom from './component/SearchMsgCom.vue'
import shopShowListCom from '@/component/shopShowListCom.vue'
import blindBox from './component/blindBox.vue'
import newProCom from './component/newProCom.vue'

import { ref } from 'vue'
import { ProductGetlistServer } from '@/api/product'


defineOptions({
  name: 'layoutPage'
})

const hotList = ref([])
const newList = ref([])
const getList = async (list,key) => {
   list.value = await ProductGetlistServer(key)
}

getList(hotList,'hot')
getList(newList,'new')

</script>

<template>
   <div class="body">
      <!-- 搜索 -->
      <div class="searchBox">
         <SearchMsgCom />
         <SearchCom />
      </div>
      
      <!-- 每日盲盒 -->
      <blindBox />

      <!-- 热门商品 -->
       <shopShowListCom 
       v-if="hotList.length"
       :list="hotList" 
       badge-text="热门好物"
       />

       <!-- 每日好物 -->
        <newProCom style="margin-top: 200px;"/>
   </div>
</template>

<style scoped>
 /* .body{
 } */
 .searchBox{
   display: flex;
   justify-content: center;
   align-items: center;
   height: 80vh;
   flex-direction: column;
   gap: 20px;
 }

</style>