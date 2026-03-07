<template>
  <div class="tooltip-container">
    <!-- 顶部弹框（悬停出现）：现在盒子自带背景和边框，内部完全由插槽定制 -->
    <div class="tooltip">
      <!-- 默认插槽：用户可传入任意内容，无需再包裹样式容器 -->
      <div class="tooltipBox">
        <div>管理</div>
        <slot></slot>
      </div>
    </div>

    <!-- 图标区域（触发弹框） -->
    <a class="icon" href="#">
      <div class="layer">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <!-- 图标插槽（默认提供 Instagram SVG） -->
        <span class="instagramSVG">
          <slot name="icon">
          </slot>
        </span>
      </div>
      <!-- 底部标签已移除 -->
    </a>
  </div>
</template>

<style scoped>

.tooltip-container {
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 17px;
  border-radius: 10px;
}

/* 顶部弹框盒子：现在自带背景、边框、内边距和阴影，内部完全由插槽控制 */
.tooltip {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px; /* 从原 .profile 移入，确保内容不贴边 */
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s;
  border-radius: 15px; /* 沿用原 .tooltip 的圆角，也可改为 10px 15px 但统一更简洁 */
  box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.2),
    inset -5px -5px 15px rgba(255, 255, 255, 0.1),
    5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.1);
  /* 以下样式从原 .profile 移入，使盒子具有深色背景和边框 */
  background: #2a2b2f;
  border: 1px solid #52382f;

}

.tooltip-container:hover .tooltip {
  top: -150px; /* 从顶部弹出 */
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

/* 原 .profile 相关样式已移除，现在由 .tooltip 统一提供视觉外壳 */
/* 如果您需要保留默认卡片内容作为示例，可以自行添加，但当前已完全交给插槽 */

.icon {
  text-decoration: none;
  color: #fff;
  display: block;
  position: relative;
}

.layer {
  width: 55px;
  height: 55px;
  transition: transform 0.3s;
}

.icon:hover .layer {
  transform: rotate(-35deg) skew(20deg);
}

.layer span {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border: 1px solid #fff;
  border-radius: 15px;
  transition: all 0.3s;
}

.layer span,
.icon .text {
  color: #e6683c;
  border-color: #e6683c;
}

.icon:hover .layer span {
  box-shadow: -1px 1px 3px #e6683c;
}

/* 层叠效果：五个span依次偏移 */
.icon:hover .layer span:nth-child(1) {
  opacity: 0.2;
}
.icon:hover .layer span:nth-child(2) {
  opacity: 0.4;
  transform: translate(5px, -5px);
}
.icon:hover .layer span:nth-child(3) {
  opacity: 0.6;
  transform: translate(10px, -10px);
}
.icon:hover .layer span:nth-child(4) {
  opacity: 0.8;
  transform: translate(15px, -15px);
}
.icon:hover .layer span:nth-child(5) {
  opacity: 1;
  transform: translate(20px, -20px);
}

.instagramSVG {
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: -webkit-linear-gradient(
    45deg,
    #f09433 0%,
    #e6683c 25%,
    #dc2743 50%,
    #cc2366 75%,
    #bc1888 100%
  );
  background: linear-gradient(
    45deg,
    #f09433 0%,
    #e6683c 25%,
    #dc2743 50%,
    #cc2366 75%,
    #bc1888 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f09433', endColorstr='#bc1888',GradientType=1 );
}

.tooltipBox{
  width: 200px;

}

</style>