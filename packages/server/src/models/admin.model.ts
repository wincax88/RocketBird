import mongoose, { Schema, Document } from 'mongoose';

// 管理员
export interface IAdminUser extends Document {
  adminId: string;
  username: string;
  password: string;
  realName: string;
  phone?: string;
  email?: string;
  avatar?: string;
  roleId: string;
  roleName: string;
  status: number;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    adminId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    realName: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    avatar: { type: String },
    roleId: { type: String, required: true },
    roleName: { type: String, required: true },
    status: { type: Number, default: 1 }, // 0禁用 1正常
    lastLoginAt: { type: Date },
    lastLoginIp: { type: String },
    createdBy: { type: String },
  },
  {
    timestamps: true,
    collection: 'admin_users',
  }
);

export const AdminUser = mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);

// 角色
export interface IAdminRole extends Document {
  roleId: string;
  name: string;
  code: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const AdminRoleSchema = new Schema<IAdminRole>(
  {
    roleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
    permissions: { type: [String], default: [] },
    isSystem: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    collection: 'admin_roles',
  }
);

export const AdminRole = mongoose.model<IAdminRole>('AdminRole', AdminRoleSchema);

// 权限定义
export interface IAdminPermission extends Document {
  permissionId: string;
  name: string;
  code: string;
  module: string;
  type: string;
  parentId?: string;
  sortOrder: number;
}

const AdminPermissionSchema = new Schema<IAdminPermission>(
  {
    permissionId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    module: { type: String, required: true },
    type: { type: String, required: true }, // menu/button/api
    parentId: { type: String },
    sortOrder: { type: Number, default: 0 },
  },
  {
    timestamps: false,
    collection: 'admin_permissions',
  }
);

export const AdminPermission = mongoose.model<IAdminPermission>('AdminPermission', AdminPermissionSchema);

// 操作日志
export interface IOperationLog extends Document {
  logId: string;
  adminId: string;
  adminName: string;
  module: string;
  action: string;
  targetType?: string;
  targetId?: string;
  content: string;
  requestData?: object;
  responseCode?: number;
  ip: string;
  userAgent?: string;
  duration?: number;
  createdAt: Date;
}

const OperationLogSchema = new Schema<IOperationLog>(
  {
    logId: { type: String, required: true, unique: true },
    adminId: { type: String, required: true, index: true },
    adminName: { type: String, required: true },
    module: { type: String, required: true },
    action: { type: String, required: true },
    targetType: { type: String },
    targetId: { type: String },
    content: { type: String, required: true },
    requestData: { type: Object },
    responseCode: { type: Number },
    ip: { type: String, required: true },
    userAgent: { type: String },
    duration: { type: Number },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'operation_logs',
  }
);

OperationLogSchema.index({ module: 1, createdAt: -1 });
OperationLogSchema.index({ createdAt: -1 });

export const OperationLog = mongoose.model<IOperationLog>('OperationLog', OperationLogSchema);
