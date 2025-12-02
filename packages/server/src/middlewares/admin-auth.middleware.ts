import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { error } from '../utils/response';

// 扩展 Request 类型
declare global {
  namespace Express {
    interface Request {
      admin?: {
        adminId: string;
        username: string;
        roleId: string;
        permissions: string[];
      };
    }
  }
}

/**
 * 管理员认证中间件
 */
export const adminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, '未授权访问', 401);
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, config.jwt.adminSecret) as {
        adminId: string;
        username: string;
        roleId: string;
        permissions: string[];
      };

      req.admin = decoded;
      next();
    } catch (err) {
      return error(res, 'Token 无效或已过期', 401);
    }
  } catch (err) {
    next(err);
  }
};

/**
 * 权限检查中间件
 */
export const permissionMiddleware = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return error(res, '未授权访问', 401);
    }

    // 超级管理员拥有所有权限
    if (req.admin.permissions.includes('*')) {
      return next();
    }

    if (!req.admin.permissions.includes(requiredPermission)) {
      return error(res, '没有操作权限', 403);
    }

    next();
  };
};
