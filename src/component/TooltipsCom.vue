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
    <div class="icon">
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
    </div>
  </div>
</template>

<style scoped>

.tooltip-container {
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 17px;
}

.tooltip {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s;
  box-shadow: var(--mg-shadow);
  background: var(--mg-white);
  border: var(--mg-border);
  z-index: 100;
}

.tooltip-container:hover .tooltip {
  top: -150px;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.icon {
  text-decoration: none;
  color: var(--mg-black);
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
  border: 2px solid var(--mg-black);
  transition: all 0.3s;
}

.layer span,
.icon .text {
  color: var(--mg-black);
  border-color: var(--mg-black);
}

.icon:hover .layer span {
  box-shadow: 3px 3px 0 var(--mg-black);
}

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
  background: var(--mg-white);
}

.tooltipBox{
  width: 200px;
  font-family: var(--mg-font);
  color: var(--mg-black);
}

</style>
