# Referral System

## Overview

推荐好友模块允许会员通过分享邀请码或邀请海报邀请好友加入。当被邀请人成功注册后，邀请人可获得积分奖励。

## Data Model

### invite_record (邀请记录表)

| Field | Type | Description |
|-------|------|-------------|
| recordId | String | 记录ID (UUID) |
| inviterId | String | 邀请人ID |
| inviterNickname | String | 邀请人昵称 (冗余) |
| inviteeId | String | 被邀请人ID |
| inviteeNickname | String | 被邀请人昵称 (冗余) |
| inviteePhone | String | 被邀请人手机号 |
| inviteCode | String | 使用的邀请码 |
| rewardPoints | Number | 奖励积分 |
| status | Number | 状态 |
| createdAt | Date | 创建时间 |
| rewardedAt | Date | 奖励发放时间 |

**status 枚举值:**
- `0` - 待奖励 (被邀请人已注册但未满足奖励条件)
- `1` - 已奖励 (已发放积分)
- `2` - 已失效 (被邀请人账号被禁用等)

### invite_rule (邀请规则表)

| Field | Type | Description |
|-------|------|-------------|
| ruleId | String | 规则ID |
| name | String | 规则名称 |
| description | String | 规则描述 |
| inviterReward | Number | 邀请人奖励积分 |
| inviteeReward | Number | 被邀请人奖励积分 |
| rewardCondition | String | 奖励条件: register/first_purchase |
| maxInvitesPerDay | Number | 每日邀请上限 (0=不限) |
| maxInvitesTotal | Number | 总邀请上限 (0=不限) |
| status | Number | 状态: 0禁用 1启用 |
| createdAt | Date | 创建时间 |

---

### Requirement: Generate Invite Code

每个会员有唯一的邀请码。

#### Scenario: View my invite code
**GIVEN** 会员已登录
**WHEN** 会员进入推荐好友页面
**THEN** 展示会员的唯一邀请码
**AND** 展示邀请规则说明
**AND** 展示奖励规则 (邀请人/被邀请人各得多少积分)

#### Scenario: Copy invite code
**GIVEN** 会员查看邀请码
**WHEN** 点击复制按钮
**THEN** 邀请码复制到剪贴板
**AND** 显示 "复制成功" 提示

---

### Requirement: Generate Invite Poster

会员可以生成邀请海报分享。

#### Scenario: Generate invite poster
**GIVEN** 会员点击生成海报
**WHEN** 系统生成邀请海报
**THEN** 海报包含会员头像和昵称
**AND** 海报包含邀请码
**AND** 海报包含品牌 logo 和 slogan
**AND** 海报包含小程序码 (携带邀请码参数)
**AND** 海报包含奖励说明文案

#### Scenario: Save poster to album
**GIVEN** 会员生成了邀请海报
**WHEN** 点击保存到相册
**THEN** 海报图片保存到手机相册
**AND** 显示 "保存成功" 提示

#### Scenario: Share poster directly
**GIVEN** 会员生成了邀请海报
**WHEN** 点击分享给好友
**THEN** 调起微信分享面板
**AND** 可选择分享给好友或朋友圈

---

### Requirement: Accept Invitation

新用户通过邀请码注册。

#### Scenario: Register with invite code
**GIVEN** 新用户扫描邀请海报二维码
**OR** 新用户输入邀请码
**WHEN** 完成注册流程
**THEN** 记录 invitedBy 为邀请人 userId
**AND** 创建邀请记录 (status=0)
**AND** 如果奖励条件是 "register"，立即触发奖励

#### Scenario: Invalid invite code
**GIVEN** 用户输入邀请码
**AND** 邀请码不存在或无效
**WHEN** 提交注册
**THEN** 显示提示 "邀请码无效"
**AND** 仍可继续注册 (不绑定邀请关系)

#### Scenario: Self-invitation prevention
**GIVEN** 用户尝试使用自己的邀请码
**WHEN** 提交注册
**THEN** 显示提示 "不能使用自己的邀请码"
**AND** 不绑定邀请关系

---

### Requirement: Reward Distribution

系统根据规则发放邀请奖励。

#### Scenario: Reward on registration
**GIVEN** 奖励条件设置为 "register"
**AND** 新用户通过邀请码完成注册
**WHEN** 注册成功
**THEN** 向邀请人发放奖励积分
**AND** 向被邀请人发放奖励积分 (如有配置)
**AND** 记录积分流水 (source=referral)
**AND** 更新邀请记录状态为已奖励

#### Scenario: Reward on first purchase
**GIVEN** 奖励条件设置为 "first_purchase"
**AND** 被邀请人完成首次购买
**WHEN** 购买订单确认
**THEN** 向邀请人发放奖励积分
**AND** 记录积分流水 (source=referral)
**AND** 更新邀请记录状态为已奖励

#### Scenario: Daily invite limit reached
**GIVEN** 会员今日邀请成功数量已达上限
**WHEN** 再有新用户通过其邀请码注册
**THEN** 邀请关系正常建立
**AND** 但不发放奖励给邀请人
**AND** 被邀请人奖励正常发放

#### Scenario: Total invite limit reached
**GIVEN** 会员总邀请成功数量已达上限
**WHEN** 再有新用户通过其邀请码注册
**THEN** 邀请关系正常建立
**AND** 但不发放奖励给邀请人
**AND** 被邀请人奖励正常发放

---

### Requirement: View Invite Records

会员可以查看邀请记录。

#### Scenario: View my invites
**GIVEN** 会员进入我的邀请记录页面
**WHEN** 加载邀请列表
**THEN** 展示所有邀请记录
**AND** 按邀请时间倒序排列
**AND** 显示被邀请人昵称 (脱敏)
**AND** 显示邀请状态和奖励积分

#### Scenario: View invite statistics
**GIVEN** 会员查看邀请统计
**WHEN** 加载统计数据
**THEN** 展示总邀请人数
**AND** 展示成功奖励次数
**AND** 展示累计获得积分

---

### Requirement: Invite Rule Configuration

运营后台配置邀请规则。

#### Scenario: Configure invite rule
**GIVEN** 管理员配置邀请规则
**WHEN** 设置邀请人/被邀请人奖励积分
**AND** 设置奖励条件
**AND** 设置邀请上限
**THEN** 规则保存成功
**AND** 对新邀请立即生效

#### Scenario: View invite analytics
**GIVEN** 管理员查看邀请数据
**WHEN** 进入邀请统计页面
**THEN** 展示总邀请次数
**AND** 展示成功率
**AND** 展示奖励积分发放总量
**AND** 展示邀请排行榜

---

## API Endpoints

### GET /api/referral/my-code
获取我的邀请码和规则

**Response:**
```json
{
  "code": 0,
  "data": {
    "inviteCode": "ABC12345",
    "inviteUrl": "https://xxx.com/invite/ABC12345",
    "rule": {
      "inviterReward": 100,
      "inviteeReward": 50,
      "rewardCondition": "register",
      "description": "邀请好友注册成功，您得100积分，好友得50积分"
    }
  }
}
```

### POST /api/referral/generate-poster
生成邀请海报

**Response:**
```json
{
  "code": 0,
  "data": {
    "posterUrl": "https://xxx.tcb.qcloud.la/poster/xxx.jpg"
  }
}
```

### GET /api/referral/records
获取邀请记录

**Query Parameters:**
- `status`: 0 | 1 | 2 | all
- `page`: 页码
- `pageSize`: 每页数量

**Response:**
```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "recordId": "xxx",
        "inviteeNickname": "张*",
        "inviteePhone": "138****8000",
        "status": 1,
        "rewardPoints": 100,
        "createdAt": "2024-01-01T10:00:00Z"
      }
    ],
    "total": 50
  }
}
```

### GET /api/referral/stats
获取邀请统计

**Response:**
```json
{
  "code": 0,
  "data": {
    "totalInvites": 50,
    "successInvites": 45,
    "totalRewardPoints": 4500,
    "todayInvites": 2,
    "todayLimit": 10
  }
}
```

### POST /api/referral/validate-code
验证邀请码

**Request:**
```json
{
  "inviteCode": "ABC12345"
}
```

**Response:**
```json
{
  "code": 0,
  "data": {
    "valid": true,
    "inviterNickname": "张*"
  }
}
```

---

## Admin API Endpoints

### GET /api/admin/referral/rules
获取邀请规则

### PUT /api/admin/referral/rules
更新邀请规则

**Request:**
```json
{
  "inviterReward": 100,
  "inviteeReward": 50,
  "rewardCondition": "register",
  "maxInvitesPerDay": 10,
  "maxInvitesTotal": 0,
  "status": 1
}
```

### GET /api/admin/referral/records
获取所有邀请记录

### GET /api/admin/referral/stats
邀请统计分析

**Response:**
```json
{
  "code": 0,
  "data": {
    "overview": {
      "totalInvites": 10000,
      "successRate": "85%",
      "totalRewardPoints": 1000000
    },
    "trend": [...],
    "topInviters": [
      {
        "userId": "xxx",
        "nickname": "张三",
        "inviteCount": 100,
        "rewardPoints": 10000
      }
    ]
  }
}
```

### GET /api/admin/referral/ranking
邀请排行榜

**Query Parameters:**
- `period`: day | week | month | all
- `limit`: 返回数量
