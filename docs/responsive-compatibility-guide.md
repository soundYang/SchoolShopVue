# 两端兼容（响应式适配）经验总结

## 一、项目响应式架构

本项目采用 `data-device` 属性选择器方案，而非传统的 CSS 媒体查询。

### 核心机制

在 `index.html` 中通过内联脚本检测窗口宽度：

- **桌面端**（`>768px`）：`<html data-device="desktop">`，基础字号 `16px`
- **移动端**（`<=768px`）：`<html data-device="mobile">`，基础字号 `max(w/375*16, 12)`

```html
<script>
  function updateDevice() {
    var w = window.innerWidth
    if (w <= 768) {
      var base = Math.max(w / 375 * 16, 12)
      document.documentElement.style.fontSize = base + 'px'
      document.documentElement.setAttribute('data-device', 'mobile')
      window.__IS_MOBILE__ = true
    } else {
      document.documentElement.style.fontSize = '16px'
      document.documentElement.setAttribute('data-device', 'desktop')
      window.__IS_MOBILE__ = false
    }
  }
  updateDevice()
  window.addEventListener('resize', updateDevice)
</script>
```

### 全局 CSS 变量

在 `App.vue` 中定义了一组 CSS 变量，移动端自动切换值：

| 变量 | 桌面端 | 移动端 | 用途 |
|------|--------|--------|------|
| `--direction` | `row` | `column` | 主轴方向 |
| `--direction-wrap` | `row` | `column` | 换行方向 |
| `--direction-nav` | `row` | `nowrap` | 导航方向 |
| `--columns` | `4` | `2` | 列数 |
| `--gap` | `60px` | `12px` | 间距 |
| `--show-desktop` | `flex` | `none` | 桌面元素显隐 |
| `--show-mobile` | `none` | `flex` | 移动元素显隐 |
| `--base-font` | `16px` | `14px` | 基础字号 |
| `--btn-scale` | `1` | `0.92` | 按钮缩放 |

---

## 二、开发规范与经验总结

### 1. 使用 `[data-device="mobile"]` 覆盖移动端样式

移动端样式统一包裹在 `[data-device="mobile"]` 选择器内：

```css
/* 桌面端默认样式 */
.header {
  padding: 160px;
  display: flex;
  gap: 30px;
}

/* 移动端覆盖 */
[data-device="mobile"] .header {
  padding: 20px;
  flex-wrap: wrap;
  gap: 10px;
}
```

### 2. Padding 缩减规则

移动端屏幕宽度有限（通常 375px-428px），页面内边距需大幅缩减：

| 场景 | 桌面端 | 移动端 |
|------|--------|--------|
| 页面顶部留白 | `padding-top: 100px` | `padding-top: 60px` |
| 大段装饰性留白 | `padding: 160px` | `padding: 20px` |
| 卡片内边距 | `padding: 40px` | `padding: 16px` |
| 普通内容内边距 | `padding: 20px` | `padding: 12px` |

**经验公式**：移动端 padding 约为桌面端的 `25%-40%`，且不超过 `24px`。

### 3. Flex 布局方向转换

桌面端多用横排（`flex-direction: row`），移动端需转为纵排（`column`）：

```css
[data-device="mobile"] .flex-container {
  flex-direction: column;
}
```

### 4. 固定宽度处理

桌面端常见的固定宽度（如 `width: 1200px`, `width: 1000px`）在移动端必须改为百分比或 `100%`：

```css
.proBox {
  width: 1200px; /* 桌面固定 */
}

[data-device="mobile"] .proBox {
  width: 100%;
}
```

### 5. 大字号缩减

移动端因屏幕小，超大标题字号需适当缩减：

| 桌面端 | 移动端 |
|--------|--------|
| `font-size: 50px` | `font-size: 28px` |
| `font-size: 30px` | `font-size: 20px` |
| `font-size: 24px` | `font-size: 16px` |

### 6. 大间距缩减

Grid/Flex 的 gap 值在移动端需大幅缩减：

```css
[data-device="mobile"] .container {
  gap: 12px; /* 桌面端可能是 60px 或 80px */
}
```

### 7. 视口高度（100vh）处理

移动端 `100vh` 会包含浏览器工具栏，导致元素溢出。可改用 `min-height` 或配合内容自适应：

```css
[data-device="mobile"] .full-height {
  height: auto;
  min-height: 100vh;
}
```

### 8. Scale 变换的注意点

使用 CSS `scale` 属性（非 `transform: scale()`）时，元素实际占据空间不变但视觉放大，容易导致溢出。解决方案：

```css
/* 避免 scale 导致溢出 */
.title-wrapper {
  flex-shrink: 0; /* 防止被压缩 */
  margin-right: 120px; /* 用 margin 做位置补偿 */
}
```

### 9. 按钮缩放

全局按钮在移动端使用 `--btn-scale: 0.92` 变量缩放，配合 `transform: scale(var(--btn-scale))`。

### 10. 图片/卡片固定尺寸处理

固定尺寸的卡片在移动端需改为百分比或自适应：

```css
.card {
  width: 247px;
  height: 330px;
}

[data-device="mobile"] .card {
  width: 100%;
  height: auto;
}
```

---

## 三、组件适配清单

### 已适配组件（11 个）
- `headerCom.vue` - 导航栏
- `TitleCom.vue` - 标题动画
- `NotificationIcon.vue` - 通知图标
- `ButtonOneCom.vue` - 按钮
- `NavbarCom.vue` - 导航菜单
- `shopShowListCom.vue` - 商品画廊
- `newProCom.vue` - 新品展示
- `blindBox.vue` - 盲盒展示
- `patticleClock.vue` - 粒子时钟
- `Layout/index.vue` - 首页布局
- `App.vue` - 全局变量

### 待适配页面（12 个）
- `Login/index.vue` - 登录/注册
- `allProduct/index.vue` - 全部商品
- `Search/index.vue` - 搜索
- `ProductDetails/index.vue` - 商品详情
- `User/index.vue` - 用户主页
- `pay/index.vue` - 支付
- `shopOrder/index.vue` - 下单
- `myOrder/index.vue` - 订单列表
- `orderDetail/index.vue` - 订单详情
- `postPro/index.vue` - 发布商品
- `publishedPro/index.vue` - 已发布商品
- `productManagement/index.vue` - 商品管理

### 待适配共享组件（2 个）
- `shopCard.vue` - 商品卡片
- `buyButtom.vue` - 购买按钮

---

## 四、常见问题与解决方案

### Q1: 元素溢出视口
**现象**：内容超出屏幕右侧，出现水平滚动条
**解决**：检查固定宽度元素（`width: 1200px` 等），改为 `max-width: 100%` 或 `width: 100%`

### Q2: 大段空白
**现象**：移动端顶部出现巨大空白区域
**解决**：缩减 `padding-top` / `padding` 值，从 `100px-160px` 降至 `20px-60px`

### Q3: 文字过小
**现象**：移动端文字看不清
**解决**：使用 `font-size: 14px-16px` 作为基础，特殊场景用 CSS 变量 `--base-font`

### Q4: Flex 布局错乱
**现象**：横排元素在移动端挤在一起
**解决**：使用 `flex-direction: column` 转换为纵排

### Q5: 点击区域过小
**现象**：按钮/链接在小屏幕上难以点击
**解决**：保证触控区域至少 `44px x 44px`

---

## 五、测试要点

1. **断点测试**：分别在 375px（iPhone SE）和 768px（iPad）宽度下查看
2. **滚动测试**：确保所有内容可滚动到达
3. **交互测试**：按钮点击、表单填写、弹窗操作
4. **图片测试**：图片不溢出、不变形
5. **文字测试**：无文字被截断、无重叠
