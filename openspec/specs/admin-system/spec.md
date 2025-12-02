# Admin System

## Overview

管理后台系统模块负责运营后台的账号管理、角色权限控制和操作日志记录。提供完整的权限体系支持不同角色的运营人员使用。

## Data Model

### admin_user (管理员表)

| Field | Type | Description |
|-------|------|-------------|
| adminId | String | 管理员ID (UUID) |
| username | String | 用户名 (唯一) |
| password | String | 密码 (bcrypt 加密) |
| realName | String | 真实姓名 |
| phone | String | 手机号 |
| email | String | 邮箱 |
| avatar | String | 头像 URL |
| roleId | String | 角色ID |
| roleName | String | 角色名称 (冗余) |
| status | Number | 状态: 0禁用 1正常 |
| lastLoginAt | Date | 最后登录时间 |
| lastLoginIp | String | 最后登录IP |
| createdAt | Date | 创建时间 |
| updatedAt | Date | 更新时间 |
| createdBy | String | 创建人 |

### admin_role (角色表)

| Field | Type | Description |
|-------|------|-------------|
| roleId | String | 角色ID (UUID) |
| name | String | 角色名称 |
| code | String | 角色编码 (唯一) |
| description | String | 角色描述 |
| permissions | Array | 权限列表 |
| isSystem | Boolean | 是否系统角色 (不可删除) |
| status | Number | 状态: 0禁用 1正常 |
| createdAt | Date | 创建时间 |
| updatedAt | Date | 更新时间 |

### admin_permission (权限定义表)

| Field | Type | Description |
|-------|------|-------------|
| permissionId | String | 权限ID |
| name | String | 权限名称 |
| code | String | 权限编码 |
| module | String | 所属模块 |
| type | String | 类型: menu/button/api |
| parentId | String | 父权限ID |
| sortOrder | Number | 排序 |

### operation_log (操作日志表)

| Field | Type | Description |
|-------|------|-------------|
| logId | String | 日志ID (UUID) |
| adminId | String | 操作人ID |
| adminName | String | 操作人姓名 |
| module | String | 操作模块 |
| action | String | 操作类型 |
| targetType | String | 目标类型 |
| targetId | String | 目标ID |
| content | String | 操作内容描述 |
| requestData | Object | 请求数据 (脱敏) |
| responseCode | Number | 响应状态码 |
| ip | String | 操作IP |
| userAgent | String | 浏览器信息 |
| duration | Number | 请求耗时 (ms) |
| createdAt | Date | 创建时间 |

---

### Requirement: Admin Authentication

管理员登录认证。

#### Scenario: Admin login - success
**GIVEN** 管理员输入用户名和密码
**AND** 账号存在且密码正确
**AND** 账号状态正常
**WHEN** 提交登录
**THEN** 验证通过
**AND** 生成管理员 JWT token
**AND** 更新 lastLoginAt 和 lastLoginIp
**AND** 记录登录日志
**AND** 返回 token 和管理员信息

#### Scenario: Admin login - wrong password
**GIVEN** 管理员输入错误密码
**WHEN** 提交登录
**THEN** 返回错误 "用户名或密码错误"
**AND** 记录失败日志
**AND** 连续失败5次后锁定账号30分钟

#### Scenario: Admin login - disabled account
**GIVEN** 管理员账号状态为禁用
**WHEN** 提交登录
**THEN** 返回错误 "账号已被禁用，请联系管理员"

#### Scenario: Admin logout
**GIVEN** 管理员已登录
**WHEN** 点击退出登录
**THEN** 清除 token
**AND** 记录登出日志
**AND** 跳转到登录页

#### Scenario: Change password
**GIVEN** 管理员已登录
**WHEN** 修改密码
**AND** 原密码验证正确
**AND** 新密码符合复杂度要求
**THEN** 密码更新成功
**AND** 清除当前 token
**AND** 需要重新登录

---

### Requirement: Account Management

管理员账号的增删改查。

#### Scenario: Create admin account
**GIVEN** 超级管理员创建新账号
**WHEN** 填写用户名、密码、角色等信息
**AND** 提交保存
**THEN** 账号创建成功
**AND** 密码加密存储
**AND** 记录操作日志

#### Scenario: Create admin - duplicate username
**GIVEN** 创建新管理员账号
**AND** 用户名已存在
**WHEN** 提交保存
**THEN** 返回错误 "用户名已存在"

#### Scenario: Edit admin account
**GIVEN** 编辑管理员信息
**WHEN** 修改角色或状态
**AND** 提交保存
**THEN** 信息更新成功
**AND** 如果角色变更，权限立即生效
**AND** 记录操作日志

#### Scenario: Disable admin account
**GIVEN** 禁用某管理员账号
**WHEN** 设置 status=0
**THEN** 账号禁用
**AND** 该管理员的 token 立即失效
**AND** 记录操作日志

#### Scenario: Reset admin password
**GIVEN** 超级管理员重置某账号密码
**WHEN** 执行重置操作
**THEN** 生成随机新密码
**AND** 新密码通过短信/邮件发送
**AND** 标记需要首次登录修改密码
**AND** 记录操作日志

#### Scenario: Delete admin account
**GIVEN** 删除管理员账号
**AND** 该账号不是超级管理员
**WHEN** 确认删除
**THEN** 账号标记为删除 (软删除)
**AND** 记录操作日志

---

### Requirement: Role Management

角色的增删改查。

#### Scenario: Create role
**GIVEN** 超级管理员创建新角色
**WHEN** 填写角色名称、编码、描述
**AND** 选择权限列表
**AND** 提交保存
**THEN** 角色创建成功
**AND** 记录操作日志

#### Scenario: Edit role permissions
**GIVEN** 编辑角色权限
**WHEN** 修改权限列表并保存
**THEN** 权限更新成功
**AND** 拥有该角色的管理员权限立即更新

#### Scenario: Delete role
**GIVEN** 删除某角色
**AND** 该角色不是系统角色
**AND** 该角色下没有管理员
**WHEN** 确认删除
**THEN** 角色删除成功

#### Scenario: Delete role - has admins
**GIVEN** 删除某角色
**AND** 该角色下有管理员
**WHEN** 尝试删除
**THEN** 返回错误 "该角色下存在管理员，无法删除"

---

### Requirement: Permission Control

权限控制与验证。

#### Scenario: Check menu permission
**GIVEN** 管理员访问后台菜单
**WHEN** 加载菜单列表
**THEN** 只返回有权限的菜单项
**AND** 无权限的菜单不显示

#### Scenario: Check API permission
**GIVEN** 管理员调用后台 API
**WHEN** 请求到达服务器
**THEN** 验证管理员角色权限
**AND** 如无权限返回 403 错误
**AND** 有权限则正常处理请求

#### Scenario: Check button permission
**GIVEN** 管理员在页面操作
**WHEN** 渲染页面按钮
**THEN** 只显示有权限的操作按钮
**AND** 无权限的按钮隐藏或禁用

---

### Requirement: Operation Logging

记录管理员操作日志。

#### Scenario: Log write operations
**GIVEN** 管理员执行写操作 (POST/PUT/DELETE)
**WHEN** 请求完成
**THEN** 记录操作日志
**AND** 包含操作人、模块、操作类型、目标、时间
**AND** 包含请求数据 (敏感字段脱敏)

#### Scenario: Query operation logs
**GIVEN** 管理员查询操作日志
**WHEN** 设置筛选条件 (时间/操作人/模块)
**THEN** 返回符合条件的日志列表
**AND** 按时间倒序排列
**AND** 支持导出功能

#### Scenario: Log retention
**GIVEN** 操作日志
**WHEN** 日志存储超过保留期限 (如90天)
**THEN** 定时任务自动清理过期日志
**AND** 保留重要操作日志不清理

---

## Default Roles

### 超级管理员 (super_admin)
- 所有权限
- 不可删除

### 运营管理员 (operator)
- 会员管理
- 积分管理
- 内容管理
- 福利管理
- 数据查看

### 内容编辑 (editor)
- 健身餐管理
- 打卡审核
- 品牌内容管理

### 客服 (customer_service)
- 会员查看
- 意见反馈管理

---

## API Endpoints

### POST /api/admin/auth/login
管理员登录

**Request:**
```json
{
  "username": "admin",
  "password": "xxx"
}
```

**Response:**
```json
{
  "code": 0,
  "data": {
    "token": "jwt_token",
    "adminInfo": {
      "adminId": "xxx",
      "username": "admin",
      "realName": "张三",
      "roleName": "超级管理员",
      "permissions": ["member:view", "member:edit", ...]
    }
  }
}
```

### POST /api/admin/auth/logout
管理员登出

### PUT /api/admin/auth/password
修改密码

### GET /api/admin/auth/profile
获取当前管理员信息

### PUT /api/admin/auth/profile
更新个人信息

---

### CRUD /api/admin/accounts
管理员账号管理

### POST /api/admin/accounts/:adminId/reset-password
重置密码

### PUT /api/admin/accounts/:adminId/status
启用/禁用账号

---

### CRUD /api/admin/roles
角色管理

### GET /api/admin/permissions
获取权限树

---

### GET /api/admin/logs
操作日志查询

**Query Parameters:**
- `adminId`: 操作人
- `module`: 模块
- `action`: 操作类型
- `startDate`: 开始日期
- `endDate`: 结束日期
- `page`: 页码
- `pageSize`: 每页数量

### GET /api/admin/logs/export
导出操作日志 (Excel)
