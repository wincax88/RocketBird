# Check-in & Share System

## Overview

打卡分享模块允许会员在健身场馆打卡并分享到社交平台。场馆内布置不同的健身打卡主题，会员可上传图文内容，分享后可获得积分奖励。

## Data Model

### checkin (打卡记录表)

| Field | Type | Description |
|-------|------|-------------|
| checkinId | String | 打卡ID (UUID) |
| userId | String | 用户ID |
| userNickname | String | 用户昵称 (冗余) |
| userAvatar | String | 用户头像 (冗余) |
| content | String | 打卡文案 |
| images | Array | 图片URL列表 (最多9张) |
| theme | String | 打卡主题 |
| themeId | String | 主题ID |
| location | String | 打卡地点 |
| storeId | String | 门店ID |
| storeName | String | 门店名称 |
| likeCount | Number | 点赞数 |
| shareCount | Number | 分享次数 |
| status | Number | 状态 |
| rewardPoints | Number | 获得的积分奖励 |
| rejectReason | String | 拒绝原因 |
| createdAt | Date | 创建时间 |
| auditAt | Date | 审核时间 |
| auditBy | String | 审核人 |

**status 枚举值:**
- `0` - 待审核
- `1` - 已通过
- `2` - 已拒绝

### checkin_theme (打卡主题表)

| Field | Type | Description |
|-------|------|-------------|
| themeId | String | 主题ID |
| name | String | 主题名称 |
| description | String | 主题描述 |
| coverImage | String | 封面图片 |
| rewardPoints | Number | 打卡奖励积分 |
| shareRewardPoints | Number | 分享额外奖励积分 |
| sortOrder | Number | 排序权重 |
| status | Number | 状态: 0禁用 1启用 |
| createdAt | Date | 创建时间 |

### share_rule (分享规则表)

| Field | Type | Description |
|-------|------|-------------|
| ruleId | String | 规则ID |
| type | String | 分享类型 |
| name | String | 规则名称 |
| rewardPointsMin | Number | 最小奖励积分 |
| rewardPointsMax | Number | 最大奖励积分 |
| dailyLimit | Number | 每日分享上限 |
| status | Number | 状态 |
| createdAt | Date | 创建时间 |

### share_log (分享记录表)

| Field | Type | Description |
|-------|------|-------------|
| logId | String | 记录ID |
| userId | String | 用户ID |
| type | String | 分享类型: checkin/meal/level/gift |
| targetId | String | 分享目标ID |
| rewardPoints | Number | 获得积分 |
| createdAt | Date | 创建时间 |

---

### Requirement: Create Check-in

会员可以创建打卡记录。

#### Scenario: Create check-in with images
**GIVEN** 会员已登录
**AND** 会员选择了打卡主题
**WHEN** 会员上传图片 (1-9张)
**AND** 输入打卡文案 (可选)
**AND** 点击发布
**THEN** 图片上传至云存储
**AND** 创建打卡记录 (status=0 待审核)
**AND** 显示 "打卡成功，等待审核" 提示

#### Scenario: Check-in image validation
**GIVEN** 会员上传打卡图片
**WHEN** 图片数量超过9张
**THEN** 显示提示 "最多上传9张图片"
**AND** 阻止提交

#### Scenario: Check-in content validation
**GIVEN** 会员输入打卡文案
**WHEN** 文案长度超过500字
**THEN** 显示提示 "文案最多500字"
**AND** 阻止继续输入

---

### Requirement: Check-in Approval

运营人员审核打卡内容。

#### Scenario: Approve check-in
**GIVEN** 打卡记录状态为待审核
**WHEN** 运营人员点击通过
**THEN** 状态变更为已通过
**AND** 向会员发放打卡积分奖励
**AND** 记录积分流水 (source=checkin)
**AND** 发送审核通过通知

#### Scenario: Reject check-in
**GIVEN** 打卡记录状态为待审核
**WHEN** 运营人员填写拒绝原因
**AND** 点击拒绝
**THEN** 状态变更为已拒绝
**AND** 记录拒绝原因
**AND** 发送审核未通过通知

#### Scenario: Auto-approve (optional)
**GIVEN** 系统配置为自动审核模式
**WHEN** 会员提交打卡
**AND** 内容不包含敏感词
**THEN** 自动通过审核
**AND** 立即发放积分奖励

---

### Requirement: View Check-in List

会员可以查看打卡列表。

#### Scenario: View my check-ins
**GIVEN** 会员进入我的打卡页面
**WHEN** 加载打卡列表
**THEN** 展示该会员所有打卡记录
**AND** 按创建时间倒序排列
**AND** 显示状态标签 (待审核/已通过/已拒绝)
**AND** 已拒绝的显示拒绝原因

#### Scenario: View check-in detail
**GIVEN** 会员点击某条打卡
**WHEN** 进入详情页
**THEN** 展示打卡图片 (支持预览大图)
**AND** 展示打卡文案
**AND** 展示打卡时间和主题
**AND** 展示获得的积分 (如已审核通过)

---

### Requirement: Share Check-in

会员可以分享打卡到朋友圈。

#### Scenario: Generate share poster
**GIVEN** 会员点击分享打卡
**AND** 打卡状态为已通过
**WHEN** 系统生成分享海报
**THEN** 海报包含打卡图片 (取第一张)
**AND** 海报包含会员昵称和头像
**AND** 海报包含打卡文案 (截取前50字)
**AND** 海报包含品牌 logo
**AND** 海报包含小程序码

#### Scenario: Share to moments - success
**GIVEN** 会员生成分享海报
**WHEN** 会员分享到朋友圈并返回
**THEN** 检查今日分享次数
**AND** 如未达上限，发放随机积分奖励
**AND** 更新打卡记录的 shareCount
**AND** 记录分享日志

#### Scenario: Share limit reached
**GIVEN** 会员今日分享次数已达上限
**WHEN** 会员再次分享
**THEN** 分享功能正常
**AND** 但不再发放积分奖励
**AND** 提示 "今日分享奖励已领完"

---

### Requirement: Check-in Themes

运营后台管理打卡主题。

#### Scenario: Create theme
**GIVEN** 管理员创建打卡主题
**WHEN** 填写主题名称、描述、封面、奖励积分
**AND** 提交保存
**THEN** 主题创建成功
**AND** 会员端可见新主题

#### Scenario: Edit theme
**GIVEN** 管理员编辑已有主题
**WHEN** 修改配置并保存
**THEN** 立即生效
**AND** 已有打卡记录的主题信息不变

#### Scenario: Disable theme
**GIVEN** 管理员禁用某主题
**WHEN** 设置 status=0
**THEN** 会员端不再显示该主题
**AND** 已有的打卡记录不受影响

---

## API Endpoints

### POST /api/checkin/create
创建打卡

**Request:**
```json
{
  "themeId": "xxx",
  "content": "今天健身打卡！",
  "images": ["image_url_1", "image_url_2"],
  "location": "XX健身房"
}
```

### GET /api/checkin/themes
获取打卡主题列表

### GET /api/checkin/my
获取我的打卡列表

**Query Parameters:**
- `status`: 0 | 1 | 2 | all
- `page`: 页码
- `pageSize`: 每页数量

### GET /api/checkin/:checkinId
获取打卡详情

### POST /api/checkin/:checkinId/share
生成分享海报

### POST /api/checkin/:checkinId/share-callback
分享完成回调

### POST /api/upload/image
上传图片

**Request:** multipart/form-data
- `file`: 图片文件

**Response:**
```json
{
  "code": 0,
  "data": {
    "url": "https://xxx.tcb.qcloud.la/xxx.jpg"
  }
}
```

---

## Admin API Endpoints

### GET /api/admin/checkin/list
获取打卡列表 (支持筛选)

**Query Parameters:**
- `status`: 状态筛选
- `userId`: 用户筛选
- `themeId`: 主题筛选
- `startDate`: 开始日期
- `endDate`: 结束日期

### PUT /api/admin/checkin/:checkinId/approve
审核通过

### PUT /api/admin/checkin/:checkinId/reject
审核拒绝

**Request:**
```json
{
  "reason": "图片内容不符合要求"
}
```

### CRUD /api/admin/checkin/themes
打卡主题管理

### GET /api/admin/share/rules
获取分享规则

### PUT /api/admin/share/rules/:ruleId
更新分享规则

### GET /api/admin/share/stats
分享统计
