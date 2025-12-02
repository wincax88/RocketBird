# Member Authentication & Registration

## Overview

会员认证模块负责处理会员的注册、登录和身份验证。支持微信一键登录和手机验证码登录两种方式，新会员注册后自动与 SaaS 潜客系统打通。

## Data Model

### user (会员表)

| Field | Type | Description |
|-------|------|-------------|
| userId | String | 用户唯一ID (UUID) |
| openid | String | 微信 openid |
| unionid | String | 微信 unionid (跨平台统一标识) |
| phone | String | 手机号码 |
| nickname | String | 昵称 |
| avatar | String | 头像 URL |
| level | Number | 会员等级 (1-N) |
| levelName | String | 等级名称 |
| points | Number | 当前积分余额 |
| totalPoints | Number | 累计获得积分 |
| inviteCode | String | 个人邀请码 |
| invitedBy | String | 邀请人 userId |
| consultantId | String | 咨询顾问 (教练) ID |
| birthday | Date | 生日 |
| gender | Number | 性别: 0未知 1男 2女 |
| status | Number | 状态: 0禁用 1正常 |
| createdAt | Date | 创建时间 |
| updatedAt | Date | 更新时间 |

---

### Requirement: WeChat Phone Number Login

会员可以使用微信手机号一键登录系统。

#### Scenario: First-time WeChat login creates new member
**GIVEN** 用户首次使用微信手机号登录
**AND** 该手机号在系统中不存在
**WHEN** 用户授权微信手机号
**THEN** 系统创建新会员记录
**AND** 自动生成唯一邀请码
**AND** 设置默认等级为 1
**AND** 初始积分为 0
**AND** 返回 JWT token 和会员信息

#### Scenario: Returning member WeChat login
**GIVEN** 用户使用微信手机号登录
**AND** 该手机号已存在于系统中
**WHEN** 用户授权微信手机号
**THEN** 系统更新 openid/unionid 信息
**AND** 返回 JWT token 和会员信息

#### Scenario: WeChat login with disabled account
**GIVEN** 会员账号状态为禁用 (status=0)
**WHEN** 用户尝试登录
**THEN** 系统返回错误提示 "账号已被禁用，请联系客服"
**AND** 不发放 token

---

### Requirement: SMS Verification Code Login

会员可以使用手机验证码登录系统。

#### Scenario: Send SMS verification code
**GIVEN** 用户输入有效手机号
**WHEN** 用户请求发送验证码
**THEN** 系统生成 6 位数字验证码
**AND** 验证码有效期为 5 分钟
**AND** 同一手机号 60 秒内不能重复发送
**AND** 每日发送上限为 10 条

#### Scenario: Verify SMS code and login
**GIVEN** 用户已收到验证码
**WHEN** 用户输入正确的验证码
**AND** 验证码未过期
**THEN** 系统验证通过
**AND** 如果是新用户则创建会员记录
**AND** 返回 JWT token 和会员信息

#### Scenario: Invalid verification code
**GIVEN** 用户输入验证码
**WHEN** 验证码错误或已过期
**THEN** 系统返回错误提示 "验证码错误或已过期"
**AND** 记录失败次数
**AND** 连续失败 5 次后锁定 30 分钟

---

### Requirement: Token Management

系统使用 JWT token 进行身份验证。

#### Scenario: Valid token authentication
**GIVEN** 用户携带有效 JWT token 请求 API
**WHEN** 系统验证 token
**THEN** 解析出用户身份信息
**AND** 允许访问受保护资源

#### Scenario: Expired token
**GIVEN** 用户携带过期 token 请求 API
**WHEN** 系统验证 token
**THEN** 返回 401 状态码
**AND** 返回错误信息 "登录已过期，请重新登录"

#### Scenario: Token refresh
**GIVEN** token 即将过期 (剩余有效期 < 24小时)
**WHEN** 用户进行任意 API 请求
**THEN** 系统自动刷新 token
**AND** 在响应头中返回新 token

---

### Requirement: Invite Code Generation

每个会员拥有唯一的邀请码用于推荐好友。

#### Scenario: Generate invite code on registration
**GIVEN** 新会员完成注册
**WHEN** 系统创建会员记录
**THEN** 自动生成 8 位字母数字组合的邀请码
**AND** 邀请码在系统中唯一
**AND** 邀请码永久有效

#### Scenario: Use invite code during registration
**GIVEN** 新用户注册时填写了邀请码
**AND** 邀请码有效且存在
**WHEN** 完成注册
**THEN** 记录 invitedBy 为邀请人 userId
**AND** 触发邀请奖励流程

---

## API Endpoints

### POST /api/auth/wechat-login
微信手机号一键登录

**Request:**
```json
{
  "code": "wechat_login_code",
  "encryptedData": "encrypted_phone_data",
  "iv": "encryption_iv"
}
```

**Response:**
```json
{
  "code": 0,
  "data": {
    "token": "jwt_token",
    "userInfo": {
      "userId": "xxx",
      "nickname": "xxx",
      "avatar": "xxx",
      "level": 1,
      "points": 0
    },
    "isNewUser": true
  },
  "message": "success"
}
```

### POST /api/auth/send-sms
发送短信验证码

**Request:**
```json
{
  "phone": "13800138000"
}
```

### POST /api/auth/sms-login
短信验证码登录

**Request:**
```json
{
  "phone": "13800138000",
  "code": "123456",
  "inviteCode": "ABC12345"
}
```

### GET /api/auth/profile
获取当前用户信息

### PUT /api/auth/profile
更新用户信息

**Request:**
```json
{
  "nickname": "new_name",
  "avatar": "new_avatar_url",
  "birthday": "1990-01-01",
  "gender": 1
}
```
