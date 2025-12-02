# Fitness Meals Recommendation

## Overview

每日健身餐推荐模块为会员提供每周的健身餐饮建议。由营养师在后台上传每日推荐的健身餐内容，会员可以查看并分享到朋友圈。

## Data Model

### meals (健身餐表)

| Field | Type | Description |
|-------|------|-------------|
| mealId | String | 健身餐ID (UUID) |
| date | Date | 日期 |
| weekday | Number | 星期几 (1-7, 1=周一) |
| title | String | 标题 |
| content | String | 内容描述 (富文本) |
| images | Array | 图片列表 |
| calories | Number | 总卡路里 (kcal) |
| protein | Number | 蛋白质 (g) |
| carbs | Number | 碳水化合物 (g) |
| fat | Number | 脂肪 (g) |
| nutritionist | String | 营养师姓名 |
| nutritionistAvatar | String | 营养师头像 |
| tips | String | 饮食小贴士 |
| shareCount | Number | 分享次数 |
| viewCount | Number | 浏览次数 |
| status | Number | 状态: 0隐藏 1显示 |
| createdAt | Date | 创建时间 |
| updatedAt | Date | 更新时间 |

### meal_recipe (健身餐食谱)

| Field | Type | Description |
|-------|------|-------------|
| recipeId | String | 食谱ID |
| mealId | String | 所属健身餐ID |
| mealType | String | 餐次: breakfast/lunch/dinner/snack |
| name | String | 菜品名称 |
| description | String | 做法简述 |
| image | String | 菜品图片 |
| calories | Number | 卡路里 |
| sortOrder | Number | 排序 |

---

### Requirement: View Today's Meal

会员可以查看今日推荐的健身餐。

#### Scenario: View today's meal
**GIVEN** 会员进入健身餐页面
**WHEN** 加载今日健身餐
**AND** 今日有发布的健身餐
**THEN** 展示健身餐标题和封面图
**AND** 展示总卡路里和营养成分
**AND** 展示各餐次的食谱列表
**AND** 展示营养师信息
**AND** 展示饮食小贴士

#### Scenario: No meal for today
**GIVEN** 会员查看今日健身餐
**AND** 今日未发布健身餐
**WHEN** 加载页面
**THEN** 显示空状态提示 "今日健身餐暂未发布"
**AND** 展示最近一期的健身餐

#### Scenario: View meal detail
**GIVEN** 会员点击某个食谱
**WHEN** 进入详情页
**THEN** 展示菜品大图
**AND** 展示菜品名称和做法
**AND** 展示营养成分明细

---

### Requirement: Browse Meal History

会员可以浏览历史健身餐推荐。

#### Scenario: View meal calendar
**GIVEN** 会员进入健身餐历史页面
**WHEN** 加载日历视图
**THEN** 展示当前周的日期列表
**AND** 有发布的日期显示标记
**AND** 今日高亮显示
**AND** 可切换上一周/下一周

#### Scenario: Select date to view
**GIVEN** 会员在日历中选择某日期
**AND** 该日期有发布的健身餐
**WHEN** 点击日期
**THEN** 加载并展示该日的健身餐内容

#### Scenario: View meal list
**GIVEN** 会员切换到列表视图
**WHEN** 加载健身餐列表
**THEN** 按日期倒序展示
**AND** 每项显示日期、标题、封面图
**AND** 支持下拉加载更多

---

### Requirement: Share Meal

会员可以分享健身餐到朋友圈。

#### Scenario: Generate meal share poster
**GIVEN** 会员点击分享健身餐
**WHEN** 系统生成分享海报
**THEN** 海报包含健身餐封面图
**AND** 海报包含标题和日期
**AND** 海报包含总卡路里
**AND** 海报包含品牌 logo
**AND** 海报包含小程序码

#### Scenario: Share to moments - success
**GIVEN** 会员生成分享海报
**WHEN** 会员分享到朋友圈并返回
**THEN** 检查今日分享次数
**AND** 如未达上限，发放随机积分奖励
**AND** 更新健身餐的 shareCount
**AND** 记录分享日志 (type=meal)

#### Scenario: Track share count
**GIVEN** 会员分享健身餐
**WHEN** 分享完成
**THEN** 健身餐 shareCount +1
**AND** 健身餐 viewCount 在每次查看时 +1

---

### Requirement: Meal Content Management

运营后台管理健身餐内容。

#### Scenario: Create meal
**GIVEN** 营养师/运营创建健身餐
**WHEN** 填写日期、标题、内容、营养信息
**AND** 上传图片
**AND** 添加各餐次食谱
**THEN** 健身餐创建成功
**AND** 根据 status 决定是否立即发布

#### Scenario: Edit meal
**GIVEN** 管理员编辑已有健身餐
**WHEN** 修改内容并保存
**THEN** 内容立即更新
**AND** 会员端看到最新内容

#### Scenario: Batch create week meals
**GIVEN** 营养师创建一周的健身餐
**WHEN** 选择批量创建模式
**AND** 填写周一到周日的内容
**THEN** 系统创建7条健身餐记录
**AND** 日期自动设置为对应的日期

#### Scenario: Schedule publish
**GIVEN** 管理员创建健身餐
**AND** 设置发布日期为未来日期
**WHEN** 保存健身餐 (status=0)
**THEN** 健身餐创建但不显示
**AND** 到达发布日期时自动设置 status=1

#### Scenario: Delete meal
**GIVEN** 管理员删除健身餐
**WHEN** 确认删除操作
**THEN** 健身餐标记为删除 (软删除)
**AND** 会员端不再显示

---

## API Endpoints

### GET /api/meals/today
获取今日健身餐

**Response:**
```json
{
  "code": 0,
  "data": {
    "mealId": "xxx",
    "date": "2024-01-15",
    "weekday": 1,
    "title": "周一能量餐",
    "content": "...",
    "images": ["url1", "url2"],
    "calories": 1800,
    "protein": 120,
    "carbs": 200,
    "fat": 60,
    "nutritionist": "张营养师",
    "nutritionistAvatar": "avatar_url",
    "tips": "多喝水，少油盐",
    "recipes": [
      {
        "mealType": "breakfast",
        "name": "燕麦牛奶",
        "description": "...",
        "image": "url",
        "calories": 350
      }
    ]
  }
}
```

### GET /api/meals/list
获取健身餐列表

**Query Parameters:**
- `startDate`: 开始日期
- `endDate`: 结束日期
- `page`: 页码
- `pageSize`: 每页数量

### GET /api/meals/:mealId
获取健身餐详情

### GET /api/meals/calendar
获取日历数据

**Query Parameters:**
- `year`: 年份
- `month`: 月份

**Response:**
```json
{
  "code": 0,
  "data": {
    "dates": [
      { "date": "2024-01-15", "hasMeal": true },
      { "date": "2024-01-16", "hasMeal": false }
    ]
  }
}
```

### POST /api/meals/:mealId/share
生成分享海报

### POST /api/meals/:mealId/share-callback
分享完成回调

---

## Admin API Endpoints

### GET /api/admin/meals/list
获取健身餐列表 (后台)

### POST /api/admin/meals/create
创建健身餐

**Request:**
```json
{
  "date": "2024-01-15",
  "title": "周一能量餐",
  "content": "...",
  "images": ["url1"],
  "calories": 1800,
  "protein": 120,
  "carbs": 200,
  "fat": 60,
  "nutritionist": "张营养师",
  "nutritionistAvatar": "url",
  "tips": "...",
  "recipes": [
    {
      "mealType": "breakfast",
      "name": "燕麦牛奶",
      "description": "...",
      "image": "url",
      "calories": 350,
      "sortOrder": 1
    }
  ],
  "status": 1
}
```

### PUT /api/admin/meals/:mealId
更新健身餐

### DELETE /api/admin/meals/:mealId
删除健身餐

### POST /api/admin/meals/batch-create
批量创建一周健身餐

### GET /api/admin/meals/stats
健身餐统计

**Response:**
```json
{
  "code": 0,
  "data": {
    "totalMeals": 100,
    "totalViews": 50000,
    "totalShares": 5000,
    "avgViewsPerMeal": 500,
    "avgSharesPerMeal": 50
  }
}
```
