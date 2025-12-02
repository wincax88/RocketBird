import { Request, Response, NextFunction } from 'express';
import { ApiCode } from '@rocketbird/shared';

export class AppError extends Error {
  constructor(
    public code: number,
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorMiddleware(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      code: err.code,
      data: null,
      message: err.message,
    });
    return;
  }

  // 默认服务器错误
  res.status(500).json({
    code: ApiCode.ServerError,
    data: null,
    message: process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message,
  });
}
