<template>
  <section>
    <h2 class="title">新鲜好物</h2>
    <div class="card-3d">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </section>
</template>

<style scoped>
/* 标题 */
.title{
  margin-left: 70px;
  margin-bottom: 20px;
  /* 字体倾斜 */
  transform: skewX(-20deg);
  font-family: 'Courier New', Courier, monospace;
}
.title::before{
  content: "";
  display: block;
  width: 120px;
  height: 2px;
  background: white;
  margin-bottom: -40px;
  margin-left: -5px;
}

/* 主体 */
@keyframes autoRun3d {
  from {
    transform: perspective(800px) rotateY(-360deg);
  }
  to {
    transform: perspective(800px) rotateY(0deg);
  }
}

@keyframes animateBrightness {
  10% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(0.1);
  }
  90% {
    filter: brightness(1);
  }
}

.card-3d {
  position: relative;
  width: 100%;
  height: 40vw;          /* 若卡片上下超出，可适当增加此值，例如 300px */
  transform-style: preserve-3d;
  transform: perspective(800px);
  animation: autoRun3d 20s linear infinite;
  will-change: transform;
  margin: 0px auto;
}

.card-3d div {
  position: absolute;
  width: 170px;           /* 调整为 170px */
  height: 230px;          /* 调整为 230px */
  background-color: rgb(199, 199, 199);
  border: solid 2px lightgray;
  border-radius: 0.5rem;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  animation: animateBrightness 20s linear infinite;
  transition-duration: 200ms;
  will-change: transform, filter;
}

/* 悬停任意卡片时暂停所有动画 */
.card-3d:has(div:hover) {
  animation-play-state: paused !important;
}
.card-3d:has(div:hover) div {
  animation-play-state: paused !important;
}

/* 各个卡片的位置和动画延迟（半径调整为 280px） */
.card-3d div:nth-child(1) {
  transform: translate(-50%, -50%) rotateY(0deg) translateZ(280px);
  animation-delay: -0s;
}
.card-3d div:nth-child(2) {
  transform: translate(-50%, -50%) rotateY(36deg) translateZ(280px);
  animation-delay: -2s;
}
.card-3d div:nth-child(3) {
  transform: translate(-50%, -50%) rotateY(72deg) translateZ(280px);
  animation-delay: -4s;
}
.card-3d div:nth-child(4) {
  transform: translate(-50%, -50%) rotateY(108deg) translateZ(280px);
  animation-delay: -6s;
}
.card-3d div:nth-child(5) {
  transform: translate(-50%, -50%) rotateY(144deg) translateZ(280px);
  animation-delay: -8s;
}
.card-3d div:nth-child(6) {
  transform: translate(-50%, -50%) rotateY(180deg) translateZ(280px);
  animation-delay: -10s;
}
.card-3d div:nth-child(7) {
  transform: translate(-50%, -50%) rotateY(216deg) translateZ(280px);
  animation-delay: -12s;
}
.card-3d div:nth-child(8) {
  transform: translate(-50%, -50%) rotateY(252deg) translateZ(280px);
  animation-delay: -14s;
}
.card-3d div:nth-child(9) {
  transform: translate(-50%, -50%) rotateY(288deg) translateZ(280px);
  animation-delay: -16s;
}
.card-3d div:nth-child(10) {
  transform: translate(-50%, -50%) rotateY(324deg) translateZ(280px);
  animation-delay: -18s;
}
</style>