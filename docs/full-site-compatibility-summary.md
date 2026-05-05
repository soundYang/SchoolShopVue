# 全站移动端适配完成清单

## 适配概览

本项目所有页面及核心组件均已添加 `[data-device="mobile"]` 移动端兼容样式，覆盖 **13 个页面** + **5 个共享组件**。

---

## 一、已适配的页面

### 1. Layout 布局（首页入口）
| 文件 | 关键适配内容 |
|------|-------------|
| `Layout/index.vue` | 主布局区域自适应 |
| `Layout/component/shopShowListCom.vue` | 商品展示列表栅格布局 |
| `Layout/component/newProCom.vue` | 新品组件间距缩减 |
| `Layout/component/blindBox.vue` | 盲盒区域布局调整 |
| `Layout/component/patticleClock.vue` | 粒子时钟缩放 |

### 2. Home 首页
| 文件 | 关键适配内容 |
|------|-------------|
| `Home/component/headerCom.vue` | 导航栏 padding/间距对称，nav-title 紧凑 |
| `Home/component/TitleCom.vue` | 标题文字字号缩放，高度自适应 |
| `Home/component/NavbarCom.vue` | 导航菜单间距 |
| `Home/component/NotificationIcon.vue` | 通知弹窗全宽 + 右对齐 |
| `Home/component/tailCom.vue` | 页脚 `min-height: 100vh→60vh`，文字区域缩小 |

### 3. User 用户中心
| 文件 | 关键适配内容 |
|------|-------------|
| `User/index.vue` | 改为纵向布局，`100vh→auto`，分隔线全宽 |
| `User/component/infoCardCom.vue` | 用户信息卡片紧凑 |
| `User/component/proListBox.vue` | 商品列表自适应 |
| `User/component/reviewCom.vue` | 评价区域缩小 |

### 4. Login 登录/注册
| 文件 | 关键适配内容 |
|------|-------------|
| `Login/index.vue` | Card `max-width: 100%`，验证码 120x40，表单间距缩减 |

### 5. allProduct 全部商品
| 文件 | 关键适配内容 |
|------|-------------|
| `allProduct/index.vue` | `padding: 160px→80px 16px 20px`，`width: 1200px→100%`，gap 缩减 |

### 6. Search 搜索
| 文件 | 关键适配内容 |
|------|-------------|
| `Search/index.vue` | `padding: 100px→16px`，`gap: 80px→12px`，提示文字缩小 |
| `Search/component/minSearch.vue` | 搜索框自适应 |

### 7. ProductDetails 商品详情
| 文件 | 关键适配内容 |
|------|-------------|
| `ProductDetails/index.vue` | 纵向布局，`h1 50px→28px`，卖家头像 100px，库存/浏览量字号缩小，购买按钮居中 |
| `ProductDetails/component/productImgs.vue` | 图片卡片 `264x392→132x196`，边框/圆角缩减 |

### 8. pay 支付
| 文件 | 关键适配内容 |
|------|-------------|
| `pay/index.vue` | `padding-top: 100px→60px`，Card 全宽，价格字号 22px |

### 9. shopOrder 下单
| 文件 | 关键适配内容 |
|------|-------------|
| `shopOrder/index.vue` | `padding-top: 100px→60px`，地址项紧凑 |
| `shopOrder/component/OrderBox.vue` | 订单盒子自适应 |

### 10. myOrder 我的订单
| 文件 | 关键适配内容 |
|------|-------------|
| `myOrder/index.vue` | 原有 `@media` 改 `[data-device]`，无边框/阴影，角色/状态标签紧凑，分页换行 |
| `myOrder/component/OrderCard.vue` | 订单卡片自适应 |

### 11. orderDetail 订单详情
| 文件 | 关键适配内容 |
|------|-------------|
| `orderDetail/index.vue` | `padding-top: 100px→60px`，section 间距缩减 |
| `orderDetail/component/OrderHeader.vue` | 订单头部 |
| `orderDetail/component/OrderProduct.vue` | 订单商品列表 |
| `orderDetail/component/OrderSummary.vue` | 订单汇总 |
| `orderDetail/component/OrderAddress.vue` | 地址信息 |
| `orderDetail/component/OrderCancelInfo.vue` | 取消信息 |
| `orderDetail/component/OrderActions.vue` | 操作按钮 |
| `orderDetail/component/ReviewPopup.vue` | 评价弹窗 |

### 12. postPro 发布商品
| 文件 | 关键适配内容 |
|------|-------------|
| `postPro/index.vue` | 图片上传区 `300px→180px`，`+` 图标缩小，纵向布局 |
| `postPro/component/proInfoFrom.vue` | 表单自适应 |
| `postPro/component/LabelBox.vue` | 标签选择弹窗 |

### 13. publishedPro 已发布商品
| 文件 | 关键适配内容 |
|------|-------------|
| `publishedPro/index.vue` | 页面 padding 缩减，分页紧凑 |
| `publishedPro/component/proShowBox.vue` | 商品展示卡片自适应 |

### 14. productManagement 商品管理
| 文件 | 关键适配内容 |
|------|-------------|
| `productManagement/index.vue` | `140vh→auto`，侧边栏改横向排列，全宽显示 |

---

## 二、已适配的共享组件

| 组件 | 关键适配内容 |
|------|-------------|
| `shopCard.vue` | 固定 `247x330→` 自适应，图片高度 `160px`，字号/间距缩减 |
| `buyButtom.vue` | 按钮 padding 缩减，`border-width: 3px`，字体缩小 |
| `ButtonOneCom.vue` | 按钮缩放 |
| `TitleCom.vue` | 标题文字缩放+高度自适应 |
| `tailCom.vue` | 页脚 `min-height` 缩减，文字区域缩小 |

---

## 三、全局适配（App.vue）

| CSS 变量 | 桌面端 | 移动端 |
|----------|--------|--------|
| `--direction` | `row` | `column` |
| `--direction-wrap` | `row` | `column` |
| `--gap` | `60px` | `12px` |
| `--columns` | `4` | `2` |
| `--show-desktop` | `flex` | `none` |
| `--show-mobile` | `none` | `flex` |
| `--base-font` | `16px` | `14px` |
| `--btn-scale` | `1` | `0.92` |

---

## 四、适配模式速查表

| 场景 | 桌面端值 | 移动端值 | 规则 |
|------|---------|---------|------|
| 页面大 padding | `100px~160px` | `12px~16px` | 缩减 85%~90% |
| header 大 padding | `160px` | `80px 16px 20px` | 上下减半，左右缩至 16px |
| 弹性布局方向 | `row` | `column` | 纵向堆叠 |
| 大间距 gap | `60px~80px` | `12px` | 缩减至 ~15% |
| 固定宽度容器 | `1200px` | `100%` | 百分比自适应 |
| 大标题 font-size | `45px~60px` | `24px~28px` | 缩减至 ~50% |
| 普通标题 font-size | `20px~30px` | `16px~18px` | 缩减至 ~60% |
| 固定尺寸头像/图标 | `200px` | `100px` | 缩减至 50% |
| 100vh 高度 | `100vh` | `auto` / `min-height` | 避免溢出 |
| 侧边栏布局 | flex 分栏 | 纵向堆叠 | 改为 column |
| 商品图片卡片 | `264x392` | `132x196` | 等比 50% 缩放 |

---

## 五、测试要点

1. **375px 宽度**（iPhone SE）：最小支持宽度，验证所有页面无水平滚动
2. **414px 宽度**（iPhone Plus）：主流大屏手机
3. **768px 宽度**（iPad 竖屏）：移动端与桌面端分界点
4. 验证要点：
   - 所有页面无水平滚动条
   - 文字完整可见，不截断
   - 按钮可点击，不重叠
   - 表单输入框宽度适配
   - 图片比例正常，不变形
   - 弹窗/浮层位置正确，不超出屏幕
