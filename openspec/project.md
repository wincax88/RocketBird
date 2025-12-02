# RocketBird - 集团化运营级会员端

## Project Overview

RocketBird 是一个为商业健身连锁集团构建的"以会员为中心"的品牌化运营系统。通过打造集团品牌化会员端，实现会员服务、会员关怀和会员运营的数字化载体，结合线上+线下的 O2O 运营手段，帮助健身集团实现运营服务差异化和会员营销增长。

**核心价值主张**: 打破门店界限，集团直面会员，为会员提供统一的、品牌化的运营服务和关怀

## Tech Stack

### Backend
- **Runtime**: Node.js (云函数)
- **Platform**: 腾讯云 TCB (腾讯云开发)
- **Database**: TCB MongoDB
- **Storage**: TCB 云存储 (图片/视频)
- **API Style**: RESTful API

### Frontend - H5 会员端
- **Framework**: UniApp (Vue3 + Vite)
- **State Management**: Pinia
- **UI Library**: uView 2 / uni-ui
- **Target**: H5 (一期), 微信小程序 (二期)

### Frontend - 管理后台
- **Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Ant Design 5
- **Data Fetching**: SWR / React Query

## Architecture Patterns

### Two-Product Model
```
品牌微信小程序 ◄──链接跳转──► 勤鸟会员端 (核心业务工具)
       │
       │ 数据同步
       ▼
品牌运营后台 ◄──API 接口──► 勤鸟 SaaS 后台
```

### O2O Member Journey
- **新会员**: 流量平台获客 → 品牌小程序注册 → 线下体验 → 成交转化 → 场外服务
- **活跃会员**: 品牌小程序互动 → 线下服务 → 口碑传播 → 带动新增
- **沉默会员**: 多渠道触达 → 召回产品 → 重新激活

## Project Phases

### Phase 1 (一期) - Core MVP
- 会员登录注册 (手机号 + 微信授权)
- 会员等级与权益体系
- 积分体系与积分商城
- 打卡分享
- 会员福利 (生日礼/成长礼/新会员礼)
- 每日健身餐推荐
- 推荐好友
- 意见反馈
- 管理后台基础功能

### Phase 2 (二期) - Advanced Features
- 微信小程序发布
- 抽奖活动 (大转盘)
- 会员日活动
- 赛事活动报名
- 精彩瞬间 (图片/视频瀑布流)
- 秒杀活动
- 即时聊天 (与教练沟通)

## Coding Conventions

### Naming
- **Files**: kebab-case (e.g., `member-auth.ts`)
- **Components**: PascalCase (e.g., `MemberCard.vue`)
- **Functions**: camelCase (e.g., `getMemberInfo`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_POINTS`)
- **Database Collections**: snake_case (e.g., `points_log`)

### API Design
- RESTful conventions
- Response format: `{ code: number, data: any, message: string }`
- Error codes: 0 = success, 4xx = client error, 5xx = server error

### Git Workflow
- Main branch: `main`
- Feature branches: `feature/xxx`
- Hotfix branches: `hotfix/xxx`
- Commit messages: Conventional Commits

## Key Business Rules

### Points System
- 积分来源: 签到/分享/邀请/管理员发放/活动奖励
- 积分消耗: 兑换商品/兑换服务
- 积分有效期: 根据配置规则

### Member Levels
- 基于累计积分升级
- 不同等级享有不同权益
- 等级只升不降 (一期)

### Share Rewards
- 分享朋友圈可获得随机积分奖励
- 每日分享次数上限可配置
- 分享类型: 打卡/健身餐/会员等级/福利活动
