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

          <div class="project-wrap more-details" @click="router.push('/allProduct')">
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
  margin-left: -200px;
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

[data-device="mobile"] .horiz-gallery-strip {
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}
[data-device="mobile"] .project-wrap {
  width: 44vw;
  padding: 0.5rem;
}
[data-device="mobile"] .project-wrap .card_box {
  width: 100%;
  height: auto;
  aspect-ratio: 2 / 3;
}
[data-device="mobile"] .project-wrap .proDemo>img {
  width: 70%;
  height: auto;
  aspect-ratio: 1 / 1.4;
  margin-top: 10%;
}
[data-device="mobile"] .project-wrap .proDemo>h2 {
  font-size: 12px;
}
[data-device="mobile"] .project-wrap .proDemo>h3 {
  font-size: 14px;
}
[data-device="mobile"] .more-details {
  margin-left: 0;
  min-height: 200px;
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
</style>
