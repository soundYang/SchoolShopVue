<script setup>
import { ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrambleTextPlugin);

// 中文文案数组
const blurbs = [
  "每天四次机会，价格由你揭晓",
  "下一个隐藏款，也许就在今天",
  "宿舍楼下的惊喜，等你来拆盒",
  "学号认证，安心交易，快乐翻倍"
];

const curIndex = ref(0);

const playAnimation = () => {
  curIndex.value = (curIndex.value + 1) % blurbs.length;
  gsap.to(".text", {
    scrambleText: {
      text: blurbs[curIndex.value],
      chars: "!@#$%^&*()_+{}:<>?~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", // 丰富字符集
      revealDelay: 0.2,
      tweenLength: true,
      newClass: curIndex.value === 2 ? "border" : ""
    },
    ease: "power2.inOut",
    overwrite: "auto",
    duration: 2.5 // 缩短时长
  });
};

const target = ref(null);

useIntersectionObserver(
  target,
  ([entry]) => {
    if (entry.isIntersecting) {
      playAnimation();
    }
  },
  { threshold: 0.5, once: false }
);
</script>

<template>
  <section ref="target" class="tail">
    <h1 class="text heading-text">
      每天四次机会，价格由你揭晓
    </h1>
  </section>
</template>

<style scoped>
.tail {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
}

.text {
  font-family: 'Fraktion Mono', 'Courier New', monospace, 'PingFang SC', 'Microsoft YaHei';
  box-sizing: border-box;
  padding: 10% 5% 5% 5%;
  width: 100%;
  height: 300px;
  text-align: center;
  width: 90vw;
  max-width: 50ch;
}

.border {
  outline: grey 2px dashed;
  outline-offset: 5px;
  border-radius: 10px;
}

[data-device="mobile"] .tail {
  min-height: 60vh;
}

[data-device="mobile"] .text {
  height: 200px;
  padding: 10% 5%;
  font-size: 1rem;
  max-width: 90vw;
}
</style>
