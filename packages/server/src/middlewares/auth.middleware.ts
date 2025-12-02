import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AppError } from './error.middleware';
import { ApiCode } from '@rocketbird/shared';

export interface JwtPayload {
  userId: string;
  phone: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(ApiCode.Unauthorized, '未登录或登录已过期', 401);
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError(ApiCode.Unauthorized, '登录已过期，请重新登录', 401));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(ApiCode.Unauthorized, '无效的登录凭证', 401));
    } else {
      next(error);
    }
  }
}

export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      req.user = decoded;
    }

    next();
  } catch {
    // 可选认证，忽略错误
    next();
  }
}
