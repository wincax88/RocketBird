# RocketBird 项目初始化设计方案

## 一、项目整体结构

```
RocketBird/
├── README.md                      # 项目说明
├── 产品文档.md                     # 产品需求文档
├── openspec/                      # OpenSpec 规范文档
│   ├── project.md
│   ├── AGENTS.md
│   ├── specs/
│   └── changes/
│
├── packages/                      # Monorepo 多包结构
│   ├── shared/                    # 共享代码
│   │   ├── types/                 # TypeScript 类型定义
│   │   ├── constants/             # 常量定义
│   │   ├── utils/                 # 工具函数
│   │   └── validators/            # 数据校验
│   │
│   ├── server/                    # 后端 - TCB 云函数
│   │   ├── functions/             # 云函数目录
│   │   ├── src/                   # 源代码
│   │   └── cloudbaserc.json       # TCB 配置
│   │
│   ├── member-h5/                 # H5 会员端 - UniApp
│   │   ├── src/
│   │   ├── pages/
│   │   └── manifest.json
│   │
│   └── admin/                     # 管理后台 - React
│       ├── src/
│       └── vite.config.ts
│
├── package.json                   # 根 package.json (含 yarn workspaces 配置)
└── tsconfig.base.json             # 基础 TypeScript 配置
```

---

## 二、后端设计 (packages/server)

### 目录结构

```
packages/server/
├── cloudbaserc.json               # TCB 云开发配置
├── package.json
├── tsconfig.json
│
├── functions/                     # 云函数入口
│   └── api/                       # HTTP API 云函数
│       ├── index.ts               # 入口文件
│       └── package.json
│
└── src/
    ├── app.ts                     # Express/Koa 应用
    ├── routes/                    # 路由定义
    │   ├── index.ts
    │   ├── auth.routes.ts         # 认证路由
    │   ├── member.routes.ts       # 会员路由
    │   ├── points.routes.ts       # 积分路由
    │   ├── checkin.routes.ts      # 打卡路由
    │   ├── benefits.routes.ts     # 福利路由
    │   ├── meals.routes.ts        # 健身餐路由
    │   ├── referral.routes.ts     # 推荐路由
    │   ├── feedback.routes.ts     # 反馈路由
    │   ├── brand.routes.ts        # 品牌内容路由
    │   └── admin/                 # 管理后台路由
    │       ├── index.ts
    │       ├── auth.routes.ts
    │       ├── member.routes.ts
    │       ├── points.routes.ts
    │       ├── checkin.routes.ts
    │       ├── benefits.routes.ts
    │       ├── meals.routes.ts
    │       ├── referral.routes.ts
    │       ├── feedback.routes.ts
    │       ├── brand.routes.ts
    │       ├── system.routes.ts
    │       └── stats.routes.ts
    │
    ├── controllers/               # 控制器
    │   ├── auth.controller.ts
    │   ├── member.controller.ts
    │   ├── points.controller.ts
    │   ├── checkin.controller.ts
    │   ├── benefits.controller.ts
    │   ├── meals.controller.ts
    │   ├── referral.controller.ts
    │   ├── feedback.controller.ts
    │   ├── brand.controller.ts
    │   └── admin/
    │       └── ...
    │
    ├── services/                  # 业务逻辑服务
    │   ├── auth.service.ts
    │   ├── member.service.ts
    │   ├── points.service.ts
    │   ├── level.service.ts
    │   ├── checkin.service.ts
    │   ├── benefits.service.ts
    │   ├── meals.service.ts
    │   ├── referral.service.ts
    │   ├── feedback.service.ts
    │   ├── brand.service.ts
    │   ├── share.service.ts
    │   └── upload.service.ts
    │
    ├── models/                    # 数据模型 (MongoDB)
    │   ├── index.ts
    │   ├── user.model.ts
    │   ├── level.model.ts
    │   ├── points-log.model.ts
    │   ├── goods.model.ts
    │   ├── exchange-order.model.ts
    │   ├── checkin.model.ts
    │   ├── checkin-theme.model.ts
    │   ├── meals.model.ts
    │   ├── gift-rule.model.ts
    │   ├── gift-record.model.ts
    │   ├── share-rule.model.ts
    │   ├── share-log.model.ts
    │   ├── invite-record.model.ts
    │   ├── feedback.model.ts
    │   ├── brand-content.model.ts
    │   ├── admin-user.model.ts
    │   ├── admin-role.model.ts
    │   └── operation-log.model.ts
    │
    ├── middlewares/               # 中间件
    │   ├── auth.middleware.ts     # JWT 认证
    │   ├── admin-auth.middleware.ts # 管理员认证
    │   ├── permission.middleware.ts # 权限校验
    │   ├── error.middleware.ts    # 错误处理
    │   ├── logger.middleware.ts   # 日志记录
    │   └── validator.middleware.ts # 参数校验
    │
    ├── utils/                     # 工具函数
    │   ├── response.ts            # 统一响应
    │   ├── jwt.ts                 # JWT 工具
    │   ├── crypto.ts              # 加密工具
    │   ├── sms.ts                 # 短信发送
    │   ├── wechat.ts              # 微信接口
    │   ├── poster.ts              # 海报生成
    │   └── tcb.ts                 # TCB 工具
    │
    ├── config/                    # 配置
    │   ├── index.ts
    │   ├── database.ts
    │   └── constants.ts
    │
    └── types/                     # 类型定义
        └── index.ts
```

### API 路由设计

```typescript
// 会员端 API
POST   /api/auth/wechat-login      # 微信登录
POST   /api/auth/send-sms          # 发送验证码
POST   /api/auth/sms-login         # 短信登录
GET    /api/auth/profile           # 获取用户信息
PUT    /api/auth/profile           # 更新用户信息

GET    /api/level/config           # 等级配置
GET    /api/level/my               # 我的等级
POST   /api/level/share            # 分享等级

GET    /api/points/balance         # 积分余额
GET    /api/points/logs            # 积分明细
GET    /api/points/mall/goods      # 商品列表
GET    /api/points/mall/goods/:id  # 商品详情
POST   /api/points/mall/exchange   # 兑换商品
GET    /api/points/orders          # 兑换订单

POST   /api/checkin/create         # 创建打卡
GET    /api/checkin/themes         # 打卡主题
GET    /api/checkin/my             # 我的打卡
POST   /api/checkin/:id/share      # 分享打卡

GET    /api/benefits/list          # 福利列表
POST   /api/benefits/:id/claim     # 领取福利

GET    /api/meals/today            # 今日健身餐
GET    /api/meals/list             # 健身餐列表
POST   /api/meals/:id/share        # 分享健身餐

GET    /api/referral/my-code       # 我的邀请码
POST   /api/referral/generate-poster # 生成海报
GET    /api/referral/records       # 邀请记录

POST   /api/feedback/submit        # 提交反馈
GET    /api/feedback/my            # 我的反馈

GET    /api/brand/story            # 品牌故事
GET    /api/brand/list             # 品牌内容

POST   /api/upload/image           # 上传图片

// 管理后台 API (前缀 /api/admin)
POST   /api/admin/auth/login       # 登录
POST   /api/admin/auth/logout      # 登出
PUT    /api/admin/auth/password    # 修改密码

CRUD   /api/admin/members          # 会员管理
CRUD   /api/admin/levels           # 等级管理
CRUD   /api/admin/goods            # 商品管理
GET    /api/admin/orders           # 订单管理
CRUD   /api/admin/checkin          # 打卡管理
CRUD   /api/admin/themes           # 主题管理
CRUD   /api/admin/benefits/rules   # 福利规则
GET    /api/admin/benefits/records # 领取记录
CRUD   /api/admin/meals            # 健身餐管理
GET    /api/admin/referral         # 邀请管理
GET    /api/admin/feedback         # 反馈管理
CRUD   /api/admin/brand            # 品牌内容
CRUD   /api/admin/accounts         # 账号管理
CRUD   /api/admin/roles            # 角色管理
GET    /api/admin/logs             # 操作日志
GET    /api/admin/stats/*          # 数据统计
```

---

## 三、H5 会员端设计 (packages/member-h5)

### 目录结构

```
packages/member-h5/
├── index.html
├── package.json
├── vite.config.ts
├── manifest.json                  # UniApp 配置
├── pages.json                     # 页面配置
├── uni.scss                       # 全局样式变量
│
└── src/
    ├── main.ts                    # 入口文件
    ├── App.vue                    # 根组件
    │
    ├── pages/                     # 页面
    │   ├── index/                 # 首页
    │   │   └── index.vue
    │   ├── login/                 # 登录
    │   │   └── index.vue
    │   ├── profile/               # 个人中心
    │   │   └── index.vue
    │   ├── level/                 # 会员等级
    │   │   ├── index.vue
    │   │   └── detail.vue
    │   ├── points/                # 积分
    │   │   ├── index.vue          # 积分首页
    │   │   ├── logs.vue           # 积分明细
    │   │   ├── mall/              # 积分商城
    │   │   │   ├── index.vue
    │   │   │   └── detail.vue
    │   │   └── orders/            # 兑换订单
    │   │       ├── index.vue
    │   │       └── detail.vue
    │   ├── checkin/               # 打卡
    │   │   ├── index.vue          # 打卡首页
    │   │   ├── create.vue         # 创建打卡
    │   │   ├── detail.vue         # 打卡详情
    │   │   └── my.vue             # 我的打卡
    │   ├── benefits/              # 福利
    │   │   ├── index.vue
    │   │   └── detail.vue
    │   ├── meals/                 # 健身餐
    │   │   ├── index.vue
    │   │   └── detail.vue
    │   ├── referral/              # 推荐好友
    │   │   ├── index.vue
    │   │   └── records.vue
    │   ├── brand/                 # 品牌
    │   │   ├── story.vue
    │   │   └── detail.vue
    │   ├── consultant/            # 咨询顾问
    │   │   └── index.vue
    │   ├── feedback/              # 意见反馈
    │   │   ├── index.vue
    │   │   ├── create.vue
    │   │   └── detail.vue
    │   └── webview/               # 内嵌网页
    │       └── index.vue
    │
    ├── components/                # 组件
    │   ├── common/                # 通用组件
    │   │   ├── NavBar.vue
    │   │   ├── TabBar.vue
    │   │   ├── Loading.vue
    │   │   ├── Empty.vue
    │   │   ├── ImageUploader.vue
    │   │   └── SharePoster.vue
    │   ├── member/                # 会员相关
    │   │   ├── LevelCard.vue
    │   │   ├── PointsCard.vue
    │   │   └── BenefitCard.vue
    │   ├── checkin/               # 打卡相关
    │   │   ├── CheckinCard.vue
    │   │   └── ThemeSelector.vue
    │   └── points/                # 积分相关
    │       ├── GoodsCard.vue
    │       └── OrderCard.vue
    │
    ├── stores/                    # Pinia 状态管理
    │   ├── index.ts
    │   ├── user.ts                # 用户状态
    │   ├── level.ts               # 等级状态
    │   └── points.ts              # 积分状态
    │
    ├── api/                       # API 接口
    │   ├── index.ts               # 请求封装
    │   ├── auth.ts
    │   ├── member.ts
    │   ├── level.ts
    │   ├── points.ts
    │   ├── checkin.ts
    │   ├── benefits.ts
    │   ├── meals.ts
    │   ├── referral.ts
    │   ├── feedback.ts
    │   └── brand.ts
    │
    ├── utils/                     # 工具函数
    │   ├── request.ts             # 请求封装
    │   ├── storage.ts             # 存储封装
    │   ├── auth.ts                # 认证工具
    │   ├── share.ts               # 分享工具
    │   └── format.ts              # 格式化工具
    │
    ├── hooks/                     # 组合式函数
    │   ├── useAuth.ts
    │   ├── useShare.ts
    │   └── useUpload.ts
    │
    ├── styles/                    # 样式
    │   ├── index.scss
    │   ├── variables.scss
    │   └── mixins.scss
    │
    └── static/                    # 静态资源
        ├── images/
        └── icons/
```

### 页面路由配置 (pages.json)

```json
{
  "pages": [
    { "path": "pages/index/index" },
    { "path": "pages/login/index" },
    { "path": "pages/profile/index" },
    { "path": "pages/level/index" },
    { "path": "pages/level/detail" },
    { "path": "pages/points/index" },
    { "path": "pages/points/logs" },
    { "path": "pages/points/mall/index" },
    { "path": "pages/points/mall/detail" },
    { "path": "pages/points/orders/index" },
    { "path": "pages/points/orders/detail" },
    { "path": "pages/checkin/index" },
    { "path": "pages/checkin/create" },
    { "path": "pages/checkin/detail" },
    { "path": "pages/checkin/my" },
    { "path": "pages/benefits/index" },
    { "path": "pages/benefits/detail" },
    { "path": "pages/meals/index" },
    { "path": "pages/meals/detail" },
    { "path": "pages/referral/index" },
    { "path": "pages/referral/records" },
    { "path": "pages/brand/story" },
    { "path": "pages/brand/detail" },
    { "path": "pages/consultant/index" },
    { "path": "pages/feedback/index" },
    { "path": "pages/feedback/create" },
    { "path": "pages/feedback/detail" }
  ],
  "tabBar": {
    "list": [
      { "pagePath": "pages/index/index", "text": "首页" },
      { "pagePath": "pages/points/index", "text": "积分" },
      { "pagePath": "pages/checkin/index", "text": "打卡" },
      { "pagePath": "pages/profile/index", "text": "我的" }
    ]
  }
}
```

---

## 四、管理后台设计 (packages/admin)

### 目录结构

```
packages/admin/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
│
└── src/
    ├── main.tsx                   # 入口文件
    ├── App.tsx                    # 根组件
    ├── vite-env.d.ts
    │
    ├── routes/                    # 路由配置
    │   ├── index.tsx
    │   └── routes.tsx
    │
    ├── layouts/                   # 布局
    │   ├── BasicLayout.tsx        # 基础布局
    │   ├── BlankLayout.tsx        # 空白布局
    │   └── components/
    │       ├── Header.tsx
    │       ├── Sidebar.tsx
    │       └── Footer.tsx
    │
    ├── pages/                     # 页面
    │   ├── login/                 # 登录
    │   │   └── index.tsx
    │   ├── dashboard/             # 仪表盘
    │   │   └── index.tsx
    │   ├── member/                # 会员管理
    │   │   ├── list/
    │   │   ├── detail/
    │   │   ├── level/
    │   │   └── benefits/
    │   ├── points/                # 积分管理
    │   │   ├── goods/
    │   │   ├── orders/
    │   │   └── logs/
    │   ├── content/               # 内容管理
    │   │   ├── checkin/
    │   │   ├── themes/
    │   │   ├── meals/
    │   │   └── brand/
    │   ├── operation/             # 运营管理
    │   │   ├── benefits/
    │   │   ├── share/
    │   │   └── referral/
    │   ├── feedback/              # 反馈管理
    │   │   └── list/
    │   ├── stats/                 # 数据统计
    │   │   ├── overview/
    │   │   ├── member/
    │   │   ├── points/
    │   │   └── share/
    │   └── system/                # 系统管理
    │       ├── accounts/
    │       ├── roles/
    │       └── logs/
    │
    ├── components/                # 组件
    │   ├── common/
    │   │   ├── PageContainer.tsx
    │   │   ├── ProTable.tsx
    │   │   ├── ImageUpload.tsx
    │   │   ├── RichEditor.tsx
    │   │   └── SearchForm.tsx
    │   └── business/
    │       ├── MemberSelect.tsx
    │       ├── GoodsSelect.tsx
    │       └── LevelSelect.tsx
    │
    ├── api/                       # API 接口
    │   ├── index.ts
    │   ├── request.ts
    │   ├── auth.ts
    │   ├── member.ts
    │   ├── points.ts
    │   ├── checkin.ts
    │   ├── benefits.ts
    │   ├── meals.ts
    │   ├── referral.ts
    │   ├── feedback.ts
    │   ├── brand.ts
    │   ├── system.ts
    │   └── stats.ts
    │
    ├── stores/                    # 状态管理 (zustand)
    │   ├── index.ts
    │   ├── user.ts
    │   └── app.ts
    │
    ├── hooks/                     # 自定义 Hooks
    │   ├── useAuth.ts
    │   ├── useTable.ts
    │   ├── useModal.ts
    │   └── useUpload.ts
    │
    ├── utils/                     # 工具函数
    │   ├── request.ts
    │   ├── storage.ts
    │   ├── auth.ts
    │   ├── format.ts
    │   └── permission.ts
    │
    ├── styles/                    # 样式
    │   ├── index.less
    │   ├── variables.less
    │   └── antd-override.less
    │
    └── types/                     # 类型定义
        ├── api.d.ts
        ├── member.d.ts
        ├── points.d.ts
        └── system.d.ts
```

### 路由配置

```typescript
const routes = [
  { path: '/login', component: Login, layout: 'blank' },
  { path: '/', component: Dashboard },
  {
    path: '/member',
    children: [
      { path: 'list', component: MemberList },
      { path: 'detail/:id', component: MemberDetail },
      { path: 'level', component: LevelManage },
      { path: 'benefits', component: BenefitsManage },
    ]
  },
  {
    path: '/points',
    children: [
      { path: 'goods', component: GoodsList },
      { path: 'orders', component: OrderList },
      { path: 'logs', component: PointsLogs },
    ]
  },
  {
    path: '/content',
    children: [
      { path: 'checkin', component: CheckinList },
      { path: 'themes', component: ThemeList },
      { path: 'meals', component: MealsList },
      { path: 'brand', component: BrandContent },
    ]
  },
  {
    path: '/operation',
    children: [
      { path: 'benefits', component: BenefitsRules },
      { path: 'share', component: ShareRules },
      { path: 'referral', component: ReferralManage },
    ]
  },
  { path: '/feedback', component: FeedbackList },
  {
    path: '/stats',
    children: [
      { path: 'overview', component: Overview },
      { path: 'member', component: MemberStats },
      { path: 'points', component: PointsStats },
      { path: 'share', component: ShareStats },
    ]
  },
  {
    path: '/system',
    children: [
      { path: 'accounts', component: AccountList },
      { path: 'roles', component: RoleList },
      { path: 'logs', component: OperationLogs },
    ]
  },
];
```

---

## 五、共享包设计 (packages/shared)

### 目录结构

```
packages/shared/
├── package.json
├── tsconfig.json
│
├── types/                         # TypeScript 类型
│   ├── index.ts
│   ├── user.ts
│   ├── level.ts
│   ├── points.ts
│   ├── checkin.ts
│   ├── benefits.ts
│   ├── meals.ts
│   ├── referral.ts
│   ├── feedback.ts
│   ├── brand.ts
│   ├── admin.ts
│   └── api.ts
│
├── constants/                     # 常量
│   ├── index.ts
│   ├── status.ts                  # 状态枚举
│   ├── types.ts                   # 类型枚举
│   └── config.ts                  # 配置常量
│
├── utils/                         # 工具函数
│   ├── index.ts
│   ├── format.ts                  # 格式化
│   ├── validate.ts                # 校验
│   └── helpers.ts                 # 辅助函数
│
└── validators/                    # 数据校验规则
    ├── index.ts
    ├── user.ts
    ├── points.ts
    └── checkin.ts
```

---

## 六、技术选型汇总

| 模块 | 技术栈 |
|------|--------|
| 后端运行时 | Node.js 18+ |
| 后端框架 | Express.js |
| 数据库 | MongoDB (TCB 云数据库) |
| 文件存储 | TCB 云存储 |
| 部署平台 | 腾讯云 TCB |
| H5 框架 | UniApp + Vue 3 |
| H5 构建工具 | Vite |
| H5 状态管理 | Pinia |
| H5 UI库 | uView UI |
| 后台框架 | React 18 |
| 后台构建工具 | Vite |
| 后台状态管理 | Zustand |
| 后台 UI库 | Ant Design 5 |
| 数据请求 | SWR |
| 包管理 | Yarn |
| Monorepo 工具 | Yarn workspaces |
| 代码规范 | ESLint + Prettier |
| Git Hooks | Husky + lint-staged |

---

## 七、开发阶段划分

### 阶段 1：项目初始化
- 创建 Monorepo 项目结构
- 配置 Yarn workspaces
- 配置 ESLint、Prettier
- 初始化各子项目
- 配置 TCB 云环境

### 阶段 2：后端基础
- 数据库模型定义
- 认证模块 (登录/注册/JWT)
- 基础中间件
- 统一响应格式

### 阶段 3：会员体系
- 会员信息 CRUD
- 等级体系
- 积分体系
- 积分商城

### 阶段 4：内容模块
- 打卡分享
- 健身餐推荐
- 品牌内容

### 阶段 5：运营模块
- 会员福利
- 推荐好友
- 分享奖励

### 阶段 6：管理后台
- 后台框架搭建
- 各功能模块页面
- 数据统计报表

### 阶段 7：测试上线
- 功能测试
- 部署配置
- 上线验收

---

## 八、待确认事项

1. **TCB 环境**：是否已创建 TCB 云开发环境？需要环境 ID
2. **微信小程序**：是否已注册微信小程序？需要 AppID
3. **短信服务**：使用 TCB 云开发短信还是第三方？
4. **UI 设计稿**：是否有设计稿？使用什么设计规范？
5. **品牌素材**：Logo、主题色等品牌视觉素材
