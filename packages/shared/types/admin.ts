/**
 * 管理员相关类型定义
 */

export interface AdminUser {
  adminId: string;
  username: string;
  realName: string;
  phone?: string;
  email?: string;
  avatar?: string;
  roleId: string;
  roleName: string;
  status: AdminStatus;
  lastLoginAt?: string;
  lastLoginIp?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
}

export enum AdminStatus {
  Disabled = 0,
  Active = 1,
}

export interface AdminRole {
  roleId: string;
  name: string;
  code: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  status: number;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminPermission {
  permissionId: string;
  name: string;
  code: string;
  module: string;
  type: PermissionType;
  parentId?: string;
  sortOrder: number;
}

export enum PermissionType {
  Menu = 'menu',
  Button = 'button',
  Api = 'api',
}

export interface OperationLog {
  logId: string;
  adminId: string;
  adminName: string;
  module: string;
  action: string;
  targetType?: string;
  targetId?: string;
  content: string;
  requestData?: Record<string, unknown>;
  responseCode?: number;
  ip: string;
  userAgent?: string;
  duration?: number;
  createdAt: string;
}

export interface AdminLoginParams {
  username: string;
  password: string;
}

export interface AdminLoginResult {
  token: string;
  adminInfo: {
    adminId: string;
    username: string;
    realName: string;
    roleName: string;
    permissions: string[];
  };
}
