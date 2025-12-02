# Member Benefits System

## Overview

会员福利模块负责管理会员生日礼、成长礼、新会员礼等福利的配置和发放。系统根据规则自动识别符合条件的会员并发放相应福利。

## Data Model

### gift_rule (福利规则表)

| Field | Type | Description |
|-------|------|-------------|
| ruleId | String | 规则ID (UUID) |
| type | String | 类型: birthday/growth/newmember |
| name | String | 规则名称 |
| description | String | 规则描述 |
| rewardType | String | 奖励类型: points/goods/coupon |
| rewardValue | Mixed | 奖励值 |
| rewardDesc | String | 奖励描述文案 |
| levelLimit | Array | 适用会员等级 (空=全部) |
| validDays | Number | 领取有效期 (天) |
| status | Number | 状态: 0禁用 1启用 |
| createdAt | Date | 创建时间 |
| updatedAt | Date | 更新时间 |

**rewardValue 结构说明:**
- 积分奖励: `{ "points": 100 }`
- 商品奖励: `{ "goodsId": "xxx", "quantity": 1 }`
- 优惠券: `{ "couponId": "xxx" }`

### gift_record (礼品领取记录表)

| Field | Type | Description |
|-------|------|-------------|
| recordId | String | 记录ID (UUID) |
| userId | String | 用户ID |
| ruleId | String | 规则ID |
| ruleName | String | 规则名称 (冗余) |
| type | String | 类型: birthday/growth/newmember |
| rewardType | String | 奖励类型 |
| rewardValue | Mixed | 奖励值 |
| rewardDesc | String | 奖励描述 |
| status | Number | 状态: 0待领取 1已领取 2已过期 |
| expireAt | Date | 过期时间 |
| createdAt | Date | 创建时间 |
| claimedAt | Date | 领取时间 |

---

### Requirement: Birthday Gift

系统在会员生日当天自动发放生日礼。

#### Scenario: Create birthday gift record
**GIVEN** 会员设置了生日日期
**AND** 生日礼规则已启用
**WHEN** 系统执行每日定时任务 (凌晨0点)
**AND** 发现当天是会员生日
**THEN** 创建生日礼领取记录 (status=0)
**AND** 设置过期时间为生日当天23:59:59
**AND** 发送生日祝福通知

#### Scenario: Claim birthday gift
**GIVEN** 会员有待领取的生日礼
**AND** 当前时间未过期
**WHEN** 会员点击领取
**THEN** 根据奖励类型发放奖励
**AND** 如果是积分，记录积分流水 (source=birthday)
**AND** 更新记录状态为已领取
**AND** 显示领取成功提示

#### Scenario: Birthday gift expired
**GIVEN** 会员有待领取的生日礼
**AND** 已过领取有效期
**WHEN** 系统执行过期检查任务
**THEN** 更新记录状态为已过期
**AND** 会员无法再领取

#### Scenario: No birthday set
**GIVEN** 会员未设置生日日期
**WHEN** 系统检查生日礼发放
**THEN** 不创建生日礼记录
**AND** 在会员福利页显示 "设置生日可领取生日礼"

---

### Requirement: Growth Gift

会员等级升级时自动发放成长礼。

#### Scenario: Create growth gift on level up
**GIVEN** 会员等级升级
**AND** 成长礼规则已启用
**AND** 会员新等级在规则的 levelLimit 范围内
**WHEN** 等级升级完成
**THEN** 创建成长礼领取记录
**AND** 设置过期时间为 validDays 天后
**AND** 发送升级通知 (包含成长礼信息)

#### Scenario: Claim growth gift
**GIVEN** 会员有待领取的成长礼
**AND** 当前时间未过期
**WHEN** 会员点击领取
**THEN** 根据奖励类型发放奖励
**AND** 更新记录状态为已领取
**AND** 显示领取成功提示

#### Scenario: Multiple level upgrades
**GIVEN** 会员一次性跨多个等级升级
**WHEN** 升级完成
**THEN** 只发放最终等级对应的成长礼
**AND** 不发放中间跳过等级的成长礼

---

### Requirement: New Member Gift

新会员首次成为会籍会员时发放新会员礼。

#### Scenario: Create new member gift
**GIVEN** 用户从潜客转为会籍会员
**AND** 新会员礼规则已启用
**WHEN** 身份转换完成
**THEN** 创建新会员礼领取记录
**AND** 设置过期时间为 validDays 天后
**AND** 发送欢迎通知 (包含新会员礼信息)

#### Scenario: Claim new member gift
**GIVEN** 新会员有待领取的新会员礼
**AND** 当前时间未过期
**WHEN** 会员点击领取
**THEN** 根据奖励类型发放奖励
**AND** 更新记录状态为已领取
**AND** 显示领取成功提示和权益介绍

#### Scenario: Already claimed new member gift
**GIVEN** 会员已领取过新会员礼
**WHEN** 会员再次查看新会员礼
**THEN** 显示 "已领取" 状态
**AND** 显示领取时间

---

### Requirement: View Benefits

会员可以查看可领取的福利。

#### Scenario: View benefits list
**GIVEN** 会员进入福利中心
**WHEN** 加载福利列表
**THEN** 展示所有待领取的福利
**AND** 展示已领取的福利 (近30天)
**AND** 待领取的显示 "立即领取" 按钮
**AND** 已过期的显示 "已过期" 标签

#### Scenario: View benefit detail
**GIVEN** 会员点击某项福利
**WHEN** 进入详情页
**THEN** 展示福利名称和描述
**AND** 展示奖励内容
**AND** 展示有效期
**AND** 展示领取按钮或状态

#### Scenario: Empty benefits
**GIVEN** 会员没有待领取的福利
**WHEN** 查看福利中心
**THEN** 显示空状态提示
**AND** 引导查看如何获得更多福利

---

### Requirement: Benefits Configuration

运营后台配置福利规则。

#### Scenario: Create gift rule
**GIVEN** 管理员创建新福利规则
**WHEN** 填写规则类型、名称、奖励配置
**AND** 提交保存
**THEN** 规则创建成功
**AND** 对新符合条件的会员生效

#### Scenario: Edit gift rule
**GIVEN** 管理员编辑已有规则
**WHEN** 修改奖励配置并保存
**THEN** 新配置对后续发放的福利生效
**AND** 已发放的福利记录不受影响

#### Scenario: Disable gift rule
**GIVEN** 管理员禁用某规则
**WHEN** 设置 status=0
**THEN** 停止发放该类福利
**AND** 已发放未领取的福利仍可领取

#### Scenario: View gift records
**GIVEN** 管理员查看领取记录
**WHEN** 进入福利记录页面
**THEN** 展示所有发放记录
**AND** 支持按类型、状态、时间筛选
**AND** 显示领取率统计

---

## API Endpoints

### GET /api/benefits/list
获取我的福利列表

**Query Parameters:**
- `status`: 0待领取 | 1已领取 | 2已过期 | all
- `type`: birthday | growth | newmember | all

**Response:**
```json
{
  "code": 0,
  "data": {
    "pending": [
      {
        "recordId": "xxx",
        "type": "birthday",
        "ruleName": "生日礼",
        "rewardDesc": "获得100积分",
        "expireAt": "2024-01-01T23:59:59Z",
        "status": 0
      }
    ],
    "claimed": [...],
    "expired": [...]
  }
}
```

### GET /api/benefits/:recordId
获取福利详情

### POST /api/benefits/:recordId/claim
领取福利

**Response:**
```json
{
  "code": 0,
  "data": {
    "rewardType": "points",
    "rewardValue": { "points": 100 },
    "message": "恭喜获得100积分"
  }
}
```

### GET /api/benefits/birthday-status
获取生日礼状态

**Response:**
```json
{
  "code": 0,
  "data": {
    "hasBirthday": true,
    "birthday": "1990-05-15",
    "canClaim": false,
    "nextBirthday": "2024-05-15"
  }
}
```

---

## Admin API Endpoints

### GET /api/admin/benefits/rules
获取福利规则列表

### POST /api/admin/benefits/rules
创建福利规则

**Request:**
```json
{
  "type": "birthday",
  "name": "生日礼",
  "description": "生日当天可领取",
  "rewardType": "points",
  "rewardValue": { "points": 100 },
  "rewardDesc": "获得100积分",
  "levelLimit": [],
  "validDays": 1
}
```

### PUT /api/admin/benefits/rules/:ruleId
更新福利规则

### DELETE /api/admin/benefits/rules/:ruleId
删除福利规则

### GET /api/admin/benefits/records
获取领取记录

**Query Parameters:**
- `type`: 福利类型
- `status`: 状态
- `userId`: 用户ID
- `startDate`: 开始日期
- `endDate`: 结束日期

### GET /api/admin/benefits/stats
福利统计

**Response:**
```json
{
  "code": 0,
  "data": {
    "birthday": {
      "total": 100,
      "claimed": 80,
      "expired": 20,
      "claimRate": "80%"
    },
    "growth": {...},
    "newmember": {...}
  }
}
```
