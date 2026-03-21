<script setup>
import { ref, inject } from 'vue'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()
const labels = inject('labels')
const proFrom = inject('proFrom')
const close = inject('close')

const labelList = ref({
  mainLabel: {
    name: '主标签',
    list: []
  },
  attributeLabel: {
    name: '副标签',
    list: []
  },
  hotLabel: {
    name: '热门标签',
    list: []
  },
  [Symbol.iterator]: function* () {
    yield* Object.entries(this)
  }
})
const mainAcvive = ref('')  // 主标签激活

const addLable = (e, key) => {

  // 主标签只允许存在一个
  if(key === 'mainLabel'){
    if(labelList.value[key].list.length >= 1){
       labelList.value[key].list = []
    }
    labelList.value[key].list.push(e.target.innerHTML)
    mainAcvive.value = e.target.innerHTML
    return
  }
  
  // 副标签二次点击则删除
  if(labelList.value[key].list.includes(e.target.innerHTML)){
    if(key === 'mainLabel') return
    e.target.classList.toggle('active')
    return labelList.value[key].list.splice(labelList.value[key].list.indexOf(e.target.innerHTML), 1)
  }

  // 最多存在四个标签
  if(!judegLength()){
    return showToast('最多添加四个标签')
  }

  labelList.value[key].list.push(e.target.innerHTML)
  e.target.classList.toggle('active')
  
}

// 判断标签长度
const judegLength = () => {
  let length = 0
  for(let [key, value] of labelList.value){
    length += value.list.length
  }
  
  if(length >= 4){
    return false
  }
  return true
}

const comfirmlabel = () => {
  proFrom.value.shopType = []
  for(let [key, value] of labelList.value){
    if(key === 'mainLabel' && value.list.length === 0){
        return showToast('请选择主标签')
    }
    if(value.list.length > 0){
      proFrom.value.shopType.push(...value.list)
    }
  } 
  close() 
}
</script>

<template>
  <form class="form">
    <div class="title">选择标签<br><span>Select Tag</span></div>

    <div 
    v-for="( [key, value], index ) in labelList"
    :key="index"
    >
      <h3>{{ value.name }}</h3>
      <ul id="mainLable">
        <li 
        @click="e => addLable(e, key)" 
        v-for="label in labels[key]" 
        :key="label"
        :class="{active: key === 'mainLabel' && mainAcvive === label}"
        >
          {{ label }}
        </li>
      </ul>
    </div>

    <button class="button-confirm" @click.prevent="comfirmlabel">确定</button>
  </form>
</template>

<style scoped>
  .form {
    --input-focus: #2d8cf0;
    --font-color: #323232;
    --font-color-sub: #666;
    --bg-color: #fff;
    --main-color: #323232;
    padding: 20px;
    background: lightgrey;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
  }

  .title {
    color: var(--font-color);
    font-weight: 900;
    font-size: 20px;
    margin-bottom: 25px;
  }

  .title span {
    color: var(--font-color-sub);
    font-weight: 600;
    font-size: 17px;
  }

  .input {
    width: 250px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 15px;
    font-weight: 600;
    color: var(--font-color);
    padding: 5px 10px;
    outline: none;
  }

  .input::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }

  .input:focus {
    border: 2px solid var(--input-focus);
  }

  .button-confirm {
    margin: 50px auto 0 auto;
    width: 120px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 17px;
    font-weight: 600;
    color: var(--font-color);
    cursor: pointer;
  }

  ul{
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .active{
    color: aqua;
  }
</style>
