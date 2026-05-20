<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { gsap } from 'gsap'
import ButtonOneCom from '@/component/ButtonOneCom.vue'
import TitleCom from '@/component/TitleCom.vue'
import NavbarCom from './NavbarCom.vue'
import NotificationIcon from './NotificationIcon.vue'
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'

const { Account } = storeToRefs(useUserStore())
const title = ref('SchoolStore')
const route = useRoute()

watch(
  () => Account.value?.UserName,
  (newName) => {
    title.value = newName ? `${newName} Store` : 'SchoolStore'
  },
  { immediate: true }
)

const expandedMenu = ref(null)
const navbarRef = ref()

let tl = null

onMounted(() => {
  const glassElements = navbarRef.value.$el.querySelectorAll('.glass')

  tl = gsap.timeline({ paused: true })
    .to(expandedMenu.value, {
      duration: 1.2,
      delay: 0.1,
      height: 'auto',
      ease: 'power4.out'
    })
    .to(
      glassElements,
      {
        duration: 1,
        opacity: 1,
        ease: 'power4.inOut',
        stagger: 0.05
      },
      0.3
    )
    .reverse()

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (tl) tl.kill()
  document.removeEventListener('click', handleClickOutside)
})

const toggleMenu = () => {
  if (tl) tl.reversed(!tl.reversed())
}

const handleClickOutside = (e) => {
  if (!tl || tl.reversed()) return
  const headerEl = document.querySelector('.header')
  if (headerEl && !headerEl.contains(e.target)) {
    tl.reversed(true)
  }
}

watch(
  () => route.fullPath,
  () => {
    if (tl && !tl.reversed()) {
      tl.reversed(true)
    }
  }
)
</script>

<template>
  <div class="header">
    <nav>
      <div class="nav-link" @click.stop="toggleMenu">
        <ButtonOneCom str="Navbar" />
        <NotificationIcon />
      </div>
      <TitleCom class="nav-title" :str="title" />
    </nav>
    <div id="expanded-menu" ref="expandedMenu">
      <div class="content">
        <NavbarCom ref="navbarRef" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  background: transparent;
  letter-spacing: 2.4px;
  font-size: 13px;
  margin: 0;
  position: fixed;
  width: 100%;
  z-index: 100;
}

nav {
  margin-bottom: 10px;
  height: 55px;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-title {
  flex-shrink: 0;
  margin-right: 120px;
}

.nav-link {
  cursor: pointer;
}

#expanded-menu {
  background-color: transparent;
  border-bottom: var(--mg-border-light);
  overflow: hidden;
  height: 0;
  will-change: height;
}

.content {
  padding: 24px;
}

[data-device="mobile"] nav {
  height: 44px;
  padding: 0 12px;
}
[data-device="mobile"] .nav-link {
  display: flex;
  align-items: center;
  gap: 4px;
}
[data-device="mobile"] .nav-title {
  margin-right: 8px;
}
[data-device="mobile"] .content {
  padding: 12px;
}
</style>
