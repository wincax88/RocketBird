# Member Level & Benefits System

## Overview

会员等级与权益模块负责管理会员的成长体系，包括等级定义、升级规则、权益配置和展示。会员根据累计积分自动升级，不同等级享有不同权益。

## Data Model

### level (会员等级表)

| Field | Type | Description |
|-------|------|-------------|
| levelId | String | 等级ID (UUID) |
| level | Number | 等级数值 (1, 2, 3...) |
| name | String | 等级名称 (如: 普通会员, 银卡会员, 金卡会员) |
| icon | String | 等级图标 URL |
| minPoints | Number | 升级所需最低累计积分 |
| description | String | 等级描述 |
| benefits | Array | 权益列表 |
| color | String | 等级主题色 |
| sortOrder | Number | 排序权重 |
| status | Number | 状态: 0禁用 1启用 |
| createdAt | Date | 创建时间 |
| updatedAt | Date | 更新时间 |

### level.benefits 权益结构

```json
{
  "benefitId": "xxx",
  "name": "专属折扣",
  "description": "购买课程享受9折优惠",
  "type": "discount",
  "value": 0.9,
  "icon": "icon_url"
}
```

---

### Requirement: Level Display

会员可以查看自己的等级信息和升级进度。

#### Scenario: View current level
**GIVEN** 会员已登录
**WHEN** 会员访问等级页面
**THEN** 展示当前等级名称和图标
**AND** 展示当前累计积分
**AND** 展示距离下一等级所需积分
**AND** 展示升级进度条百分比

#### Scenario: View level benefits
**GIVEN** 会员已登录
**WHEN** 会员查看等级权益
**THEN** 展示当前等级的所有权益列表
**AND** 每个权益显示名称、描述和图标
**AND** 已解锁权益高亮显示
**AND** 更高等级权益显示为待解锁状态

#### Scenario: Maximum level reached
**GIVEN** 会员已达到最高等级
**WHEN** 会员查看等级信息
**THEN** 显示 "您已达到最高等级" 提示
**AND** 不显示升级进度
**AND** 展示最高等级专属权益

---

### Requirement: Level Upgrade

会员根据累计积分自动升级等级。

#### Scenario: Automatic level upgrade
**GIVEN** 会员累计积分增加
**AND** 新的累计积分达到更高等级门槛
**WHEN** 积分变更完成
**THEN** 系统自动升级会员等级
**AND** 发送升级通知
**AND** 触发成长礼发放流程
**AND** 记录升级日志

#### Scenario: Level upgrade notification
**GIVEN** 会员等级发生升级
**WHEN** 升级完成
**THEN** 向会员发送微信模板消息
**AND** 消息包含新等级名称
**AND** 消息包含新解锁的权益列表
**AND** 消息包含领取成长礼的入口

#### Scenario: Points decrease does not affect level
**GIVEN** 会员当前等级为金卡会员
**AND** 会员消费积分后余额低于金卡门槛
**WHEN** 积分扣减完成
**THEN** 会员等级保持不变
**AND** 累计积分 (totalPoints) 不变
**AND** 只有当前积分余额 (points) 减少

---

### Requirement: Benefits Configuration

运营后台可以配置等级和权益规则。

#### Scenario: Create new level
**GIVEN** 管理员在后台创建新等级
**WHEN** 填写等级名称、门槛积分、权益列表
**AND** 提交保存
**THEN** 新等级创建成功
**AND** 自动为符合条件的会员升级

#### Scenario: Edit level benefits
**GIVEN** 管理员编辑某等级的权益
**WHEN** 修改权益列表并保存
**THEN** 新权益立即对该等级会员生效
**AND** 记录操作日志

#### Scenario: Delete level
**GIVEN** 管理员尝试删除某等级
**AND** 该等级下有会员
**WHEN** 执行删除操作
**THEN** 系统拒绝删除
**AND** 提示 "该等级下存在会员，无法删除"

---

### Requirement: Level Sharing

会员可以分享等级卡片到朋友圈获得奖励。

#### Scenario: Share level card
**GIVEN** 会员在等级页面点击分享
**WHEN** 生成分享海报
**THEN** 海报包含会员昵称和头像
**AND** 海报包含等级名称和图标
**AND** 海报包含品牌 logo
**AND** 海报包含小程序码

#### Scenario: Share reward
**GIVEN** 会员成功分享等级卡片到朋友圈
**WHEN** 分享完成回调
**THEN** 检查今日分享次数是否达到上限
**AND** 如未达上限则发放随机积分奖励
**AND** 记录分享日志

---

## API Endpoints

### GET /api/level/config
获取等级配置列表

**Response:**
```json
{
  "code": 0,
  "data": {
    "levels": [
      {
        "levelId": "xxx",
        "level": 1,
        "name": "普通会员",
        "icon": "icon_url",
        "minPoints": 0,
        "benefits": [...]
      }
    ]
  }
}
```

### GET /api/level/my
获取我的等级信息

**Response:**
```json
{
  "code": 0,
  "data": {
    "currentLevel": {
      "level": 2,
      "name": "银卡会员",
      "icon": "icon_url",
      "benefits": [...]
    },
    "totalPoints": 5000,
    "currentPoints": 3500,
    "nextLevel": {
      "level": 3,
      "name": "金卡会员",
      "minPoints": 10000
    },
    "progress": 50,
    "pointsToNext": 5000
  }
}
```

### POST /api/level/share
分享等级卡片

**Response:**
```json
{
  "code": 0,
  "data": {
    "posterUrl": "generated_poster_url",
    "shareId": "xxx"
  }
}
```

### POST /api/level/share-callback
分享完成回调

**Request:**
```json
{
  "shareId": "xxx"
}
```

**Response:**
```json
{
  "code": 0,
  "data": {
    "rewardPoints": 10,
    "message": "恭喜获得10积分奖励"
  }
}
```

---

## Admin API Endpoints

### GET /api/admin/level/list
获取等级列表 (后台)

### POST /api/admin/level/create
创建等级

### PUT /api/admin/level/:levelId
更新等级

### DELETE /api/admin/level/:levelId
删除等级

### GET /api/admin/level/stats
等级会员统计

**Response:**
```json
{
  "code": 0,
  "data": {
    "stats": [
      { "level": 1, "name": "普通会员", "count": 1000 },
      { "level": 2, "name": "银卡会员", "count": 500 },
      { "level": 3, "name": "金卡会员", "count": 100 }
    ],
    "total": 1600
  }
}
```
