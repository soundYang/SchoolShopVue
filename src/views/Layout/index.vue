<script setup>
import SearchCom from './component/SearchCom.vue'
import SearchMsgCom from './component/SearchMsgCom.vue'
import shopShowListCom from './component/shopShowListCom.vue'
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
   const res = await ProductGetlistServer(key)
   list.value = res.data
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
      <template v-if="hotList.length">
        <shopShowListCom
        :list="hotList"
        badge-text="热门好物"
        />
      </template>
      <div v-else class="empty-hint">
        <span>暂无热门好物，敬请期待</span>
      </div>

       <!-- 每日好物 -->
        <newProCom
        :list="newList"
        style="margin-top: 200px;"/>
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
   gap: var(--gap, 20px);
 }

 .empty-hint {
   display: flex;
   justify-content: center;
   align-items: center;
   height: 200px;
   color: #999;
   font-size: 18px;
   letter-spacing: 2px;
 }

 [data-device="mobile"] .searchBox {
   height: 60vh;
   gap: var(--gap, 12px);
   padding: 20px;
 }

 [data-device="mobile"] .empty-hint {
   font-size: 14px;
   height: 120px;
 }

</style>
