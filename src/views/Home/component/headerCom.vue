<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import ButtonOneCom from '@/component/ButtonOneCom.vue'
import TitleCom from '@/component/TitleCom.vue'
import NavbarCom from './NavbarCom.vue'

// 模板引用
const expandedMenu = ref(null)      // 菜单容器
const navbarRef = ref()              // 绑定到 NavbarCom 组件

// GSAP 时间线实例
let tl = null

onMounted(() => {
  // 通过组件实例获取所有需要动画的卡片元素（.glass）
  const glassElements = navbarRef.value.$el.querySelectorAll('.glass')

  // 初始化时间线（默认反向暂停，即菜单收起状态）
  tl = gsap.timeline({ paused: true })
    // 展开菜单容器高度
    .to(expandedMenu.value, {
      duration: 1.2,
      delay: 0.1,
      height: 'auto',
      ease: 'power4.out'
    })
    // 卡片逐个淡入
    .to(
      glassElements,
      {
        duration: 1,
        opacity: 1,
        ease: 'power4.inOut',
        stagger: 0.05
      },
      0.3 // 与上一个动画重叠 0.3 秒
    )
    .reverse() // 使时间线初始为反向状态（菜单收起）
})

// 切换菜单展开/收起
const toggleMenu = () => {
  if (tl) tl.reversed(!tl.reversed())
}
</script>

<template>
  <div class="header">
    <nav>
      <div class="nav-link" style="margin-top: 10px;" @click="toggleMenu">
        <ButtonOneCom str="Navbar" />
      </div>
      <TitleCom style="margin-right: 150px; margin-bottom: 10px;" str="SChoolShop" />
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
  padding-left: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-link {
  cursor: pointer;
}

#expanded-menu {
  background-color: transparent;
  border-bottom: 1px solid var(--light, #ddd); /* 默认色值 */
  overflow: hidden;
  height: 0; /* 初始隐藏 */
}

.content {
  padding: 24px;
}

/* 注意：移除了 .content .navbarBox 中的 opacity 控制，因为透明度动画直接作用于子组件内部的卡片 */
</style>