<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import shopCardCom from './shopCardCom.vue'

const router = useRouter()

gsap.registerPlugin(ScrollTrigger)

const isMobile = () => window.__IS_MOBILE__ === true

// 获取画廊外层容器
const galleryWrapper = ref(null)

let scrollTween = null
let scrollTriggerInstance = null

onMounted(() => {
  if (!galleryWrapper.value) return
  if (isMobile()) return

  const sec = galleryWrapper.value
  const pinWrap = sec.querySelector('.horiz-gallery-strip')
  if (!pinWrap) return

  let pinWrapWidth
  let horizontalScrollLength

  const refresh = () => {
    pinWrapWidth = pinWrap.scrollWidth
    horizontalScrollLength = pinWrapWidth - window.innerWidth
  }

  refresh()

  scrollTween = gsap.to(pinWrap, {
    scrollTrigger: {
      trigger: sec,
      pin: sec,
      start: 'center center',
      end: () => `+=${pinWrapWidth}`,
      scrub: true,
      invalidateOnRefresh: true,
      onRefresh: refresh,
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

    <div class="container-fluid" v-if="list && list.length">
      <div ref="galleryWrapper" class="horiz-gallery-wrapper">

        <div class="horiz-gallery-strip">
          <shopCardCom
          :badge-text="badgeText"
          :product="item"
          class="project-wrap"
          v-for="item in list"
          :key="item">
          </shopCardCom>

          <div class="project-wrap more-details" @click="router.push('/allProduct')">
            <span>更多详情</span>
            <i class="iconfont icon-gengduo"></i>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty-hint">
      <span>暂无{{ badgeText }}，敬请期待</span>
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
  backface-visibility: hidden;
}

.project-wrap {
  width: 23vw;
  padding: 2rem;
  box-sizing: content-box;
}

.text-center{
  margin-left: 70px;
  margin-bottom: 20px;
  transform: skewX(-20deg);
  font-family: var(--mg-font-display);
  font-size: 2em;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--mg-black);
}
.text-center::before{
  content: "";
  display: block;
  width: 120px;
  height: 3px;
  background: var(--mg-black);
  margin-bottom: -40px;
  margin-left: -5px;
}

.more-details{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-family: var(--mg-font);
  font-weight: 600;
  color: var(--mg-black);
}
.more-details>span{
  font-size: 1.2em;
}
.more-details i {
  font-size: 1.5em;
}

[data-device="mobile"] .horiz-gallery-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
[data-device="mobile"] .horiz-gallery-wrapper::-webkit-scrollbar {
  display: none;
}
[data-device="mobile"] .project-wrap {
  width: 44vw;
  flex-shrink: 0;
  padding: 0.5rem;
}
[data-device="mobile"] .horiz-gallery-strip {
  flex-wrap: nowrap;
  gap: 8px;
}
[data-device="mobile"] .more-details {
  margin-left: 0;
  min-height: auto;
  width: 30vw;
  flex-shrink: 0;
}
[data-device="mobile"] .text-center {
  margin-left: 20px;
  font-size: 20px;
}
[data-device="mobile"] .text-center::before {
  width: 80px;
  margin-bottom: -28px;
  margin-left: -5px;
}

.empty-hint {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: var(--mg-gray-dark, #999);
  font-size: 18px;
  letter-spacing: 2px;
  font-family: var(--mg-font);
}

[data-device="mobile"] .empty-hint {
  font-size: 14px;
  height: 120px;
}
</style>
