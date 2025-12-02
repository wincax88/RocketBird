# Points System

## Overview

积分体系是会员运营的核心模块，管理积分的产生、消耗、流水记录和积分商城兑换功能。积分可通过多种渠道获取，用于兑换实物或虚拟商品/服务。

## Data Model

### points_log (积分流水表)

| Field | Type | Description |
|-------|------|-------------|
| logId | String | 流水ID (UUID) |
| userId | String | 用户ID |
| type | String | 类型: income (收入) / cost (支出) |
| value | Number | 积分数值 (正数) |
| balance | Number | 变动后余额 |
| source | String | 来源类型 |
| sourceId | String | 关联业务ID |
| remark | String | 备注说明 |
| createdAt | Date | 创建时间 |

**source 枚举值:**
- `checkin` - 打卡签到
- `share` - 分享奖励
- `referral` - 邀请好友
- `birthday` - 生日礼
- `growth` - 成长礼
- `newmember` - 新会员礼
- `exchange` - 积分兑换
- `admin` - 管理员调整
- `reward` - 活动奖励
- `expire` - 积分过期

### goods (积分商品表)

| Field | Type | Description |
|-------|------|-------------|
| goodsId | String | 商品ID (UUID) |
| title | String | 商品名称 |
| description | String | 商品描述 |
| type | String | 类型: virtual (虚拟) / physical (实物) |
| points | Number | 兑换所需积分 |
| originalPoints | Number | 原价积分 (用于展示划线价) |
| stock | Number | 库存数量 |
| images | Array | 商品图片列表 |
| limitPerUser | Number | 每人限兑数量 (0=不限) |
| levelLimit | Array | 等级限制 (空=不限) |
| sortOrder | Number | 排序权重 |
| status | Number | 状态: 0下架 1上架 |
| createdAt | Date | 创建时间 |
| updatedAt | Date | 更新时间 |

### exchange_order (兑换订单表)

| Field | Type | Description |
|-------|------|-------------|
| orderId | String | 订单ID (UUID) |
| orderNo | String | 订单编号 (展示用) |
| userId | String | 用户ID |
| goodsId | String | 商品ID |
| goodsTitle | String | 商品名称 (冗余) |
| goodsImage | String | 商品图片 (冗余) |
| goodsType | String | 商品类型 |
| points | Number | 消耗积分 |
| quantity | Number | 兑换数量 |
| status | Number | 状态 |
| address | Object | 收货地址 (实物商品) |
| expressCompany | String | 快递公司 |
| expressNo | String | 快递单号 |
| remark | String | 备注 |
| createdAt | Date | 创建时间 |
| completedAt | Date | 完成时间 |

**status 枚举值:**
- `0` - 待处理
- `1` - 处理中
- `2` - 已发货 (实物)
- `3` - 已完成
- `4` - 已取消

---

### Requirement: Points Balance Display

会员可以查看积分余额和明细。

#### Scenario: View points balance
**GIVEN** 会员已登录
**WHEN** 会员访问积分页面
**THEN** 展示当前积分余额
**AND** 展示累计获得积分
**AND** 展示累计消费积分

#### Scenario: View points history
**GIVEN** 会员查看积分明细
**WHEN** 加载明细列表
**THEN** 按时间倒序展示积分流水
**AND** 每条记录显示类型、数值、来源、时间
**AND** 收入显示为 "+XX"，支出显示为 "-XX"
**AND** 支持分页加载 (每页20条)

#### Scenario: Filter points history
**GIVEN** 会员在积分明细页
**WHEN** 选择筛选条件 (全部/收入/支出)
**THEN** 列表只显示对应类型的记录
**AND** 保持时间倒序排列

---

### Requirement: Points Mall

会员可以使用积分兑换商品。

#### Scenario: Browse points mall
**GIVEN** 会员进入积分商城
**WHEN** 加载商品列表
**THEN** 展示所有上架商品
**AND** 商品按 sortOrder 降序排列
**AND** 每个商品显示图片、名称、所需积分
**AND** 库存为0的商品显示 "已兑完"
**AND** 等级不符的商品显示 "等级不足"

#### Scenario: View goods detail
**GIVEN** 会员点击某商品
**WHEN** 进入商品详情页
**THEN** 展示商品大图轮播
**AND** 展示商品名称、描述
**AND** 展示所需积分和原价积分
**AND** 展示剩余库存
**AND** 展示已兑换人数
**AND** 展示每人限兑数量

#### Scenario: Exchange goods - success
**GIVEN** 会员积分充足
**AND** 商品有库存
**AND** 未超过个人限兑数量
**AND** 会员等级符合要求
**WHEN** 会员点击兑换
**THEN** 扣减会员积分
**AND** 扣减商品库存
**AND** 创建兑换订单
**AND** 记录积分流水 (type=cost, source=exchange)
**AND** 显示兑换成功提示

#### Scenario: Exchange goods - insufficient points
**GIVEN** 会员积分不足
**WHEN** 会员点击兑换
**THEN** 显示提示 "积分不足，还差XX积分"
**AND** 不创建订单

#### Scenario: Exchange goods - out of stock
**GIVEN** 商品库存为0
**WHEN** 会员点击兑换
**THEN** 显示提示 "商品已兑完"
**AND** 不创建订单

#### Scenario: Exchange goods - limit exceeded
**GIVEN** 会员已达到个人限兑数量
**WHEN** 会员点击兑换
**THEN** 显示提示 "您已达到兑换上限"
**AND** 不创建订单

---

### Requirement: Exchange Order Management

会员可以查看和管理兑换订单。

#### Scenario: View my orders
**GIVEN** 会员进入我的兑换记录
**WHEN** 加载订单列表
**THEN** 按创建时间倒序展示
**AND** 每个订单显示商品图片、名称、积分、状态
**AND** 支持分页加载

#### Scenario: View order detail
**GIVEN** 会员点击某订单
**WHEN** 进入订单详情
**THEN** 展示商品信息
**AND** 展示订单状态和时间线
**AND** 如是实物商品展示收货地址
**AND** 如已发货展示物流信息

#### Scenario: Cancel order
**GIVEN** 订单状态为待处理
**WHEN** 会员点击取消订单
**THEN** 订单状态变更为已取消
**AND** 退还扣除的积分
**AND** 恢复商品库存
**AND** 记录积分流水 (type=income, source=exchange, remark=兑换取消退还)

---

### Requirement: Points Earning Rules

系统根据配置规则自动发放积分。

#### Scenario: Daily check-in points
**GIVEN** 会员当日未签到
**WHEN** 会员完成签到/打卡
**THEN** 发放签到积分
**AND** 记录积分流水 (source=checkin)
**AND** 增加累计积分 (totalPoints)

#### Scenario: Share reward points
**GIVEN** 会员分享内容到朋友圈
**AND** 今日分享次数未达上限
**WHEN** 分享成功回调
**THEN** 发放随机积分奖励 (范围可配置)
**AND** 记录积分流水 (source=share)

#### Scenario: Referral reward points
**GIVEN** 新用户通过邀请码注册
**WHEN** 新用户完成首次登录
**THEN** 向邀请人发放推荐奖励积分
**AND** 记录积分流水 (source=referral)

---

## API Endpoints

### GET /api/points/balance
获取积分余额

**Response:**
```json
{
  "code": 0,
  "data": {
    "balance": 3500,
    "totalEarned": 5000,
    "totalSpent": 1500
  }
}
```

### GET /api/points/logs
获取积分流水

**Query Parameters:**
- `type`: income | cost | all (default: all)
- `page`: 页码 (default: 1)
- `pageSize`: 每页数量 (default: 20)

**Response:**
```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "logId": "xxx",
        "type": "income",
        "value": 100,
        "balance": 3500,
        "source": "checkin",
        "remark": "打卡签到奖励",
        "createdAt": "2024-01-01T10:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

### GET /api/points/mall/goods
获取商品列表

**Query Parameters:**
- `type`: virtual | physical | all
- `page`: 页码
- `pageSize`: 每页数量

### GET /api/points/mall/goods/:goodsId
获取商品详情

### POST /api/points/mall/exchange
兑换商品

**Request:**
```json
{
  "goodsId": "xxx",
  "quantity": 1,
  "address": {
    "name": "张三",
    "phone": "13800138000",
    "province": "重庆市",
    "city": "重庆市",
    "district": "渝北区",
    "detail": "XX路XX号"
  }
}
```

### GET /api/points/orders
获取我的兑换订单

### GET /api/points/orders/:orderId
获取订单详情

### POST /api/points/orders/:orderId/cancel
取消订单

---

## Admin API Endpoints

### GET /api/admin/points/logs
查询积分流水 (支持按用户、来源、时间筛选)

### POST /api/admin/points/adjust
手动调整积分

**Request:**
```json
{
  "userId": "xxx",
  "type": "income",
  "value": 100,
  "remark": "活动补发"
}
```

### CRUD /api/admin/goods
商品管理 (增删改查)

### GET /api/admin/orders
兑换订单管理

### PUT /api/admin/orders/:orderId/ship
发货

**Request:**
```json
{
  "expressCompany": "顺丰速运",
  "expressNo": "SF123456789"
}
```

### PUT /api/admin/orders/:orderId/complete
完成订单

### GET /api/admin/points/stats
积分统计报表
