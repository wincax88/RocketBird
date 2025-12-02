# Feedback System

## Overview

意见反馈模块允许会员提交对产品或服务的意见和建议，运营人员可以在后台查看并回复反馈。

## Data Model

### feedback (意见反馈表)

| Field | Type | Description |
|-------|------|-------------|
| feedbackId | String | 反馈ID (UUID) |
| userId | String | 用户ID |
| userNickname | String | 用户昵称 (冗余) |
| userPhone | String | 联系电话 |
| userAvatar | String | 用户头像 (冗余) |
| category | String | 反馈类别 |
| content | String | 反馈内容 |
| images | Array | 图片列表 (最多3张) |
| reply | String | 回复内容 |
| status | Number | 状态 |
| priority | Number | 优先级: 1低 2中 3高 |
| createdAt | Date | 创建时间 |
| replyAt | Date | 回复时间 |
| replyBy | String | 回复人ID |
| replyByName | String | 回复人姓名 |

**status 枚举值:**
- `0` - 待处理
- `1` - 处理中
- `2` - 已回复
- `3` - 已关闭

**category 枚举值:**
- `suggestion` - 功能建议
- `complaint` - 投诉
- `bug` - 问题反馈
- `other` - 其他

---

### Requirement: Submit Feedback

会员可以提交意见反馈。

#### Scenario: Submit feedback with images
**GIVEN** 会员进入意见反馈页面
**WHEN** 选择反馈类别
**AND** 输入反馈内容 (必填，10-500字)
**AND** 上传图片 (可选，最多3张)
**AND** 填写联系电话 (可选)
**AND** 点击提交
**THEN** 反馈提交成功
**AND** 显示 "提交成功，我们会尽快处理" 提示
**AND** 反馈状态为待处理

#### Scenario: Submit feedback - content too short
**GIVEN** 会员输入反馈内容
**AND** 内容少于10字
**WHEN** 点击提交
**THEN** 显示提示 "反馈内容至少10个字"
**AND** 阻止提交

#### Scenario: Submit feedback - too many images
**GIVEN** 会员上传图片
**AND** 图片数量超过3张
**WHEN** 尝试添加更多图片
**THEN** 显示提示 "最多上传3张图片"
**AND** 阻止添加

---

### Requirement: View My Feedback

会员可以查看自己提交的反馈。

#### Scenario: View feedback list
**GIVEN** 会员进入我的反馈页面
**WHEN** 加载反馈列表
**THEN** 展示该会员的所有反馈记录
**AND** 按提交时间倒序排列
**AND** 显示反馈内容摘要和状态

#### Scenario: View feedback detail
**GIVEN** 会员点击某条反馈
**WHEN** 进入详情页
**THEN** 展示反馈完整内容
**AND** 展示上传的图片
**AND** 如有回复，展示回复内容和时间
**AND** 显示当前处理状态

#### Scenario: View feedback reply notification
**GIVEN** 反馈收到回复
**WHEN** 会员打开应用
**THEN** 显示新回复提醒
**AND** 点击可跳转到反馈详情

---

### Requirement: Process Feedback

运营人员处理意见反馈。

#### Scenario: View feedback list (admin)
**GIVEN** 运营人员进入反馈管理页面
**WHEN** 加载反馈列表
**THEN** 展示所有反馈记录
**AND** 支持按状态、类别、时间筛选
**AND** 待处理的排在前面

#### Scenario: Reply to feedback
**GIVEN** 运营人员查看某条反馈
**WHEN** 输入回复内容
**AND** 点击回复
**THEN** 回复保存成功
**AND** 反馈状态变更为已回复
**AND** 向会员发送回复通知

#### Scenario: Change feedback status
**GIVEN** 运营人员处理反馈
**WHEN** 修改状态为处理中/已关闭
**THEN** 状态更新成功
**AND** 记录操作日志

#### Scenario: Set feedback priority
**GIVEN** 运营人员评估反馈
**WHEN** 设置优先级
**THEN** 优先级更新成功
**AND** 高优先级反馈在列表中标记

---

### Requirement: Feedback Statistics

统计反馈数据。

#### Scenario: View feedback stats
**GIVEN** 管理员查看反馈统计
**WHEN** 加载统计数据
**THEN** 展示总反馈数量
**AND** 展示各状态数量分布
**AND** 展示各类别数量分布
**AND** 展示平均响应时间

#### Scenario: Export feedback data
**GIVEN** 管理员需要导出反馈数据
**WHEN** 设置筛选条件
**AND** 点击导出
**THEN** 生成 Excel 文件
**AND** 包含反馈详情和处理记录

---

## API Endpoints

### POST /api/feedback/submit
提交反馈

**Request:**
```json
{
  "category": "suggestion",
  "content": "希望增加课程预约提醒功能...",
  "images": ["url1", "url2"],
  "phone": "13800138000"
}
```

**Response:**
```json
{
  "code": 0,
  "data": {
    "feedbackId": "xxx",
    "message": "提交成功，我们会尽快处理"
  }
}
```

### GET /api/feedback/my
获取我的反馈列表

**Query Parameters:**
- `status`: 状态筛选
- `page`: 页码
- `pageSize`: 每页数量

### GET /api/feedback/:feedbackId
获取反馈详情

---

## Admin API Endpoints

### GET /api/admin/feedback/list
获取反馈列表

**Query Parameters:**
- `status`: 状态
- `category`: 类别
- `priority`: 优先级
- `userId`: 用户ID
- `startDate`: 开始日期
- `endDate`: 结束日期
- `keyword`: 关键词搜索

### GET /api/admin/feedback/:feedbackId
获取反馈详情

### POST /api/admin/feedback/:feedbackId/reply
回复反馈

**Request:**
```json
{
  "reply": "感谢您的反馈，我们已记录并会在后续版本中考虑..."
}
```

### PUT /api/admin/feedback/:feedbackId/status
更新反馈状态

**Request:**
```json
{
  "status": 1,
  "priority": 3
}
```

### GET /api/admin/feedback/stats
反馈统计

**Response:**
```json
{
  "code": 0,
  "data": {
    "total": 500,
    "byStatus": {
      "pending": 50,
      "processing": 20,
      "replied": 400,
      "closed": 30
    },
    "byCategory": {
      "suggestion": 200,
      "complaint": 50,
      "bug": 150,
      "other": 100
    },
    "avgResponseTime": "4.5小时"
  }
}
```

### GET /api/admin/feedback/export
导出反馈数据
