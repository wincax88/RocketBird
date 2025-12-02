# Brand Content Management

## Overview

品牌内容管理模块负责管理品牌故事、品牌宣言、品牌视频等内容，用于在会员端展示品牌形象和价值观。

## Data Model

### brand_content (品牌内容表)

| Field | Type | Description |
|-------|------|-------------|
| contentId | String | 内容ID (UUID) |
| type | String | 内容类型 |
| title | String | 标题 |
| subtitle | String | 副标题 |
| content | String | 内容 (富文本 HTML) |
| summary | String | 摘要 |
| coverImage | String | 封面图片 |
| images | Array | 图片列表 |
| videoUrl | String | 视频 URL |
| videoCover | String | 视频封面 |
| author | String | 作者/来源 |
| tags | Array | 标签列表 |
| sortOrder | Number | 排序权重 |
| viewCount | Number | 浏览次数 |
| status | Number | 状态: 0隐藏 1显示 |
| publishAt | Date | 发布时间 |
| createdAt | Date | 创建时间 |
| updatedAt | Date | 更新时间 |
| createdBy | String | 创建人 |

**type 枚举值:**
- `story` - 品牌故事
- `slogan` - 品牌宣言
- `video` - 品牌视频
- `news` - 品牌动态
- `honor` - 品牌荣誉
- `culture` - 企业文化

---

### Requirement: View Brand Story

会员可以查看品牌故事。

#### Scenario: View brand story page
**GIVEN** 会员进入品牌故事页面
**WHEN** 加载页面内容
**THEN** 展示品牌故事的标题
**AND** 展示品牌故事的富文本内容
**AND** 展示相关图片
**AND** viewCount +1

#### Scenario: View brand slogan
**GIVEN** 会员查看品牌宣言
**WHEN** 加载页面
**THEN** 展示品牌定位
**AND** 展示品牌口号
**AND** 展示品牌价值观

#### Scenario: View brand video
**GIVEN** 会员查看品牌视频
**WHEN** 加载视频页面
**THEN** 展示视频封面
**AND** 点击播放视频
**AND** 支持全屏播放

---

### Requirement: Brand Content List

会员可以浏览品牌相关内容列表。

#### Scenario: View brand news list
**GIVEN** 会员进入品牌动态页面
**WHEN** 加载内容列表
**THEN** 展示所有品牌动态
**AND** 按发布时间倒序排列
**AND** 每项显示封面、标题、摘要、时间
**AND** 支持下拉加载更多

#### Scenario: View brand honors
**GIVEN** 会员查看品牌荣誉
**WHEN** 加载荣誉列表
**THEN** 展示所有荣誉证书和奖项
**AND** 每项显示图片和说明
**AND** 支持点击查看大图

#### Scenario: View content detail
**GIVEN** 会员点击某条内容
**WHEN** 进入详情页
**THEN** 展示完整内容
**AND** 展示发布时间
**AND** viewCount +1
**AND** 支持分享到朋友圈

---

### Requirement: Content Management

运营后台管理品牌内容。

#### Scenario: Create brand content
**GIVEN** 管理员创建新内容
**WHEN** 选择内容类型
**AND** 填写标题、内容、图片等
**AND** 提交保存
**THEN** 内容创建成功
**AND** 根据 status 决定是否立即显示

#### Scenario: Edit brand content
**GIVEN** 管理员编辑已有内容
**WHEN** 修改内容并保存
**THEN** 内容更新成功
**AND** 会员端立即看到新内容

#### Scenario: Upload rich text with images
**GIVEN** 管理员编辑富文本内容
**WHEN** 在编辑器中插入图片
**THEN** 图片上传到云存储
**AND** 自动插入图片 URL 到内容中

#### Scenario: Upload video
**GIVEN** 管理员上传品牌视频
**WHEN** 选择视频文件
**THEN** 视频上传到云存储
**AND** 自动生成视频封面 (可自定义)
**AND** 返回视频播放 URL

#### Scenario: Schedule publish
**GIVEN** 管理员创建内容
**AND** 设置定时发布
**WHEN** 设置 publishAt 为未来时间
**AND** 保存内容 (status=0)
**THEN** 内容创建但不显示
**AND** 到达发布时间时自动设置 status=1

#### Scenario: Delete content
**GIVEN** 管理员删除某内容
**WHEN** 确认删除
**THEN** 内容标记为删除 (软删除)
**AND** 会员端不再显示

#### Scenario: Reorder content
**GIVEN** 管理员调整内容排序
**WHEN** 拖拽调整顺序
**OR** 修改 sortOrder 值
**THEN** 排序更新成功
**AND** 会员端按新顺序展示

---

### Requirement: Content Statistics

统计内容浏览数据。

#### Scenario: View content stats
**GIVEN** 管理员查看内容统计
**WHEN** 加载统计数据
**THEN** 展示各类型内容数量
**AND** 展示总浏览量
**AND** 展示热门内容排行

---

## API Endpoints

### GET /api/brand/story
获取品牌故事

**Response:**
```json
{
  "code": 0,
  "data": {
    "contentId": "xxx",
    "title": "我们的故事",
    "content": "<p>品牌故事内容...</p>",
    "images": ["url1", "url2"],
    "publishAt": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/brand/slogan
获取品牌宣言

### GET /api/brand/video
获取品牌视频

**Response:**
```json
{
  "code": 0,
  "data": {
    "contentId": "xxx",
    "title": "品牌宣传片",
    "videoUrl": "https://xxx.com/video.mp4",
    "videoCover": "https://xxx.com/cover.jpg"
  }
}
```

### GET /api/brand/list
获取品牌内容列表

**Query Parameters:**
- `type`: 内容类型
- `page`: 页码
- `pageSize`: 每页数量

### GET /api/brand/:contentId
获取内容详情

### POST /api/brand/:contentId/share
生成分享海报

---

## Admin API Endpoints

### GET /api/admin/brand/list
获取内容列表 (后台)

**Query Parameters:**
- `type`: 内容类型
- `status`: 状态
- `keyword`: 关键词搜索

### POST /api/admin/brand/create
创建内容

**Request:**
```json
{
  "type": "story",
  "title": "我们的故事",
  "subtitle": "创立初心",
  "content": "<p>品牌故事内容...</p>",
  "summary": "摘要...",
  "coverImage": "url",
  "images": ["url1", "url2"],
  "tags": ["品牌", "故事"],
  "sortOrder": 100,
  "status": 1,
  "publishAt": "2024-01-01T00:00:00Z"
}
```

### PUT /api/admin/brand/:contentId
更新内容

### DELETE /api/admin/brand/:contentId
删除内容

### POST /api/admin/brand/upload-image
上传图片

### POST /api/admin/brand/upload-video
上传视频

### PUT /api/admin/brand/reorder
批量更新排序

**Request:**
```json
{
  "items": [
    { "contentId": "xxx", "sortOrder": 100 },
    { "contentId": "yyy", "sortOrder": 99 }
  ]
}
```

### GET /api/admin/brand/stats
内容统计

**Response:**
```json
{
  "code": 0,
  "data": {
    "byType": {
      "story": 1,
      "news": 20,
      "video": 5,
      "honor": 10
    },
    "totalViews": 50000,
    "topContent": [
      {
        "contentId": "xxx",
        "title": "品牌故事",
        "viewCount": 10000
      }
    ]
  }
}
```
