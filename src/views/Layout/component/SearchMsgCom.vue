<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

// 注册 SplitText 插件
gsap.registerPlugin(SplitText)

const h2 = ref()

onMounted(() => {
  // 等待字体加载完成后执行动画（也可移除该步骤直接运行动画）
  document.fonts.ready.then(() => {
    if (!h2.value) return

    // 设置 h2 可见（覆盖 CSS 中的 opacity: 0）
    gsap.set(h2.value, { opacity: 1 })

    // 拆分单词，忽略 sup 标签
    const headlineSplit = SplitText.create(h2.value, {
      type: 'words',
      wordsClass: 'word++',
      ignore: 'sup'
    })

    // 单词入场动画
    gsap.from(headlineSplit.words, {
      y: -100,
      opacity: 0,
      rotation: 'random(-80, 80)',
      stagger: 0.1,
      duration: 1,
      ease: 'back'
    })
  })
})

const msgArr = ref([
  '宿舍楼下捡到的宝藏?搜搜看',
  '毕业季清仓,搜一下捡漏',
  '隐藏款可能就在下一个搜索',
  '搜一下,价格可能低到离谱'
])
const msg = ref('')
msg.value = msgArr.value[Math.floor(Math.random() * msgArr.value.length)]
const symbolArr = ref([',', ';', '?', '!', ':', '、'])

const msgObj = ref({})
symbolArr.value.forEach(item => {
   const arr = msg.value.split(item)
   if(arr.length > 1) {
    msgObj.value = {
      msgOne: arr[0],
      msgTwo: arr[1],
      symbol: item
    }
    return
   }
})

</script>

<template>
  <div class="container">
    <h2 ref="h2">{{ msgObj.msgOne ? msgObj.msgOne : msg }}<sup>{{ msgObj?.symbol }}</sup> {{ msgObj.msgTwo }}<sup>&trade;</sup></h2>
  </div>
</template>

<style scoped>
h2 {
  opacity: 0;
}

.container {
  position: relative;
  width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.line {
  overflow: hidden;
}

.word {
  border: var(--mg-border-light);
  color: var(--mg-black);
  font-family: var(--mg-font-display);
  font-size: 1.8em;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  margin: 0.25rem;
  background: var(--mg-white);
  display: inline-block;
}

sup {
  line-height: 0;
}

[data-device="mobile"] .word {
  font-size: 1.2em;
  padding: 0.3rem 0.6rem;
}
</style>
