<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router' // 导入路由钩子
import { gsap } from 'gsap'
import ButtonOneCom from '@/component/ButtonOneCom.vue'
import TitleCom from '@/component/TitleCom.vue'
import NavbarCom from './NavbarCom.vue'
import NotificationIcon from './NotificationIcon.vue'
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'

const { Account } = storeToRefs(useUserStore())
const title = ref('SchoolStore')
const route = useRoute() // 获取当前路由对象

// 监听用户名变化，更新标题
watch(
  () => Account.value?.UserName,
  (newName) => {
    title.value = newName ? `${newName} Store` : 'SchoolStore'
  },
  { immediate: true }
)

// 模板引用
const expandedMenu = ref(null)
const navbarRef = ref()

// GSAP 时间线实例
let tl = null

onMounted(() => {
  // 获取所有需要动画的卡片元素（.glass）
  const glassElements = navbarRef.value.$el.querySelectorAll('.glass')

  // 初始化时间线（默认反向，即菜单收起）
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
    .reverse() // 使时间线初始为反向状态（菜单收起）
})

// 组件卸载时清理 GSAP 实例，防止内存泄漏
onUnmounted(() => {
  if (tl) tl.kill()
})

// 切换菜单展开/收起
const toggleMenu = () => {
  if (tl) tl.reversed(!tl.reversed())
}

// 监听路由变化：如果菜单展开则自动收起
watch(
  () => route.fullPath, // 监听路径变化
  () => {
    // 当路由变化时，若菜单处于展开状态（!tl.reversed()），则将其收起
    if (tl && !tl.reversed()) {
      tl.reversed(true) // 直接设置为反向，播放收起动画
    }
  }
)
</script>

<template>
  <div class="header">
    <nav>
      <div class="nav-link" @click="toggleMenu">
        <ButtonOneCom str="Navbar" />
        <NotificationIcon />
      </div>
      <TitleCom class="nav-title" :str="title" />
    </nav>
    <!-- 展开菜单区域，初始高度为0，由GSAP控制展开 -->
    <div id="expanded-menu" ref="expandedMenu">
      <div class="content">
        <!-- 子组件 NavbarCom 内部包含多个 .glass 卡片，初始透明（需在子组件样式中设置 opacity:0） -->
        <NavbarCom ref="navbarRef" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
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
  border-bottom: 1px solid var(--light, #ddd);
  overflow: hidden;
  height: 0;
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
