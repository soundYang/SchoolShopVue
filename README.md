# 校园二手交易平台 · 前端

基于 Vue 3 + Vite 的校园二手交易 Web 前端，覆盖商品浏览、发布、搜索、下单、支付、订单管理、盲盒和用户中心等完整交易流程。

后端仓库：[soundYang/schooShopNode](https://github.com/soundYang/schooShopNode)

## 功能模块

### 商品

- 首页推荐、全部分类、关键词搜索、标签检索
- 商品详情、图片浏览、卖家信息
- 发布商品（最多 6 张图）、编辑、下架、我的发布

### 交易

- 下单、余额支付、订单列表与详情
- 买家 / 卖家订单视图、取消订单、申请退款、确认收货
- 收货地址管理

### 盲盒

- 每日盲盒、开盒动画、盲盒记录、盲盒订单

### 用户与消息

- 注册 / 登录、图形验证码、个人资料、头像、修改密码
- 通知列表、未读数量、消息已读

### 体验

- 游客态浏览、移动端适配、GSAP 动画
- Hash 路由与登录守卫、Pinia 持久化

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | Vue 3.5 |
| 构建 | Vite 7 |
| 路由 | Vue Router 5（Hash 模式） |
| 状态管理 | Pinia 3 + pinia-plugin-persistedstate |
| 请求 | Axios |
| 样式 | Sass |
| 动画 | GSAP |
| 工具 | VueUse、unplugin-auto-import |
| 规范 | ESLint、Oxlint、Prettier |
| 包管理 | pnpm |

## 目录结构

```text
src/
├─ api/          # 按业务拆分的接口封装
├─ component/    # 通用组件
├─ composables/  # 组合式函数（自动导入）
├─ directives/   # 自定义指令
├─ router/       # 路由与登录守卫
├─ stores/       # Pinia：user / product / blindBox / notification / loading
├─ unit/         # Axios 实例与通用工具
└─ views/        # 页面级组件
```

## 快速开始

要求 Node.js `^20.19.0 || >=22.12.0`，包管理器使用 pnpm。

```bash
pnpm install
pnpm dev
```

开发环境默认访问 `http://localhost:5173`，接口指向本地后端 `http://127.0.0.1:3000`。

### 环境变量

| 变量 | 说明 | 开发环境 | 生产环境 |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | 后端 API 地址 | `http://127.0.0.1:3000` | `/api` |
| `VITE_IMAGE_BASE_URL` | 图片资源地址 | `http://127.0.0.1:3000` | `/api` |

开发和生产配置分别位于 `.env.development`、`.env.production`，只包含接口地址，不包含密钥。

### 构建与检查

```bash
pnpm build      # 生产构建，输出到 dist/
pnpm preview    # 本地预览构建结果
pnpm lint       # Oxlint + ESLint
pnpm format     # Prettier 格式化
```

## 部署

将 `dist/` 部署到 Nginx 静态目录，并把 `/api/` 反向代理到后端服务：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/school-shop;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

项目使用 Hash 路由，Nginx 不需要额外配置前端路由回退；保留 `try_files` 也不影响访问。

## 边界说明

- 当前仅支持余额支付；Xorpay / 微信支付相关代码保留但未启用。
- 管理后台前端不在本仓库。
- 暂未接入自动化测试与 CI。
- 本项目为个人学习与作品展示项目。
