<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import shopCardCom from './shopCardCom.vue'

gsap.registerPlugin(ScrollTrigger)

// 获取画廊外层容器
const galleryWrapper = ref(null)

let scrollTween = null
let scrollTriggerInstance = null

onMounted(() => {
  if (!galleryWrapper.value) return

  const sec = galleryWrapper.value // 对应原代码中的 .horiz-gallery-wrapper
  const pinWrap = sec.querySelector('.horiz-gallery-strip')
  if (!pinWrap) return

  // 计算滚动宽度
  let pinWrapWidth
  let horizontalScrollLength

  const refresh = () => {
    pinWrapWidth = pinWrap.scrollWidth
    horizontalScrollLength = pinWrapWidth - window.innerWidth
  }

  refresh()

  // 创建水平滚动动画
  scrollTween = gsap.to(pinWrap, {
    scrollTrigger: {
      trigger: sec,
      pin: sec,
      start: 'center center',
      end: () => `+=${pinWrapWidth}`,
      scrub: true,
      invalidateOnRefresh: true,
      onRefresh: refresh, // 每次刷新时重新计算宽度
    },
    x: () => -horizontalScrollLength,
    ease: 'none',
  })

  scrollTriggerInstance = scrollTween.scrollTrigger
})

onUnmounted(() => {
  // 清理 ScrollTrigger 实例和动画
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill()
  }
  if (scrollTween) {
    scrollTween.kill()
  }
})

defineProps({
  badgeText:{
    type: String,
    default: ''
  },
  list:{
    type: Array,
    required: true
  }
})
</script>

<template>
  <section id="portfolio">
    <div class="section-title">
      <h2 class="text-center">{{ badgeText }}</h2>
    </div>
    
    <div class="container-fluid">
      <div ref="galleryWrapper" class="horiz-gallery-wrapper">
        
        <div class="horiz-gallery-strip">
          <shopCardCom 
          :badge-text="badgeText" 
          :product="item"
          class="project-wrap" 
          v-for="item in list" 
          :key="item">
          </shopCardCom>

          <div class="project-wrap more-details">
            <span>更多详情</span> 
            <i class="iconfont icon-gengduo"></i>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.container-fluid {
  width: 100%;
  padding-right: 0;
  padding-left: 0;
  margin-right: auto;
  margin-left: auto;
}

.horiz-gallery-wrapper,
.horiz-gallery-strip {
  display: flex;
  flex-wrap: nowrap;
  will-change: transform;
  position: relative;
}

.project-wrap {
  width: 23vw;
  padding: 2rem;
  box-sizing: content-box;
}

/* title style */
.text-center{
  margin-left: 70px;
  margin-bottom: 20px;
  /* 字体倾斜 */
  transform: skewX(-20deg);
  font-family: 'Courier New', Courier, monospace;
}
.text-center::before{
  content: "";
  display: block;
  width: 120px;
  height: 2px;
  background: white;
  margin-bottom: -40px;
  margin-left: -5px;
}

/* 更多详情 */
.more-details{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-left: -200px;
  cursor: pointer;
}
.more-details>span{
  text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px rgba(255,255,255,0.5);
}
</style>