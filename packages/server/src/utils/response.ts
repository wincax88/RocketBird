import { Response } from 'express';
import { ApiResponse, ApiCode } from '@rocketbird/shared';

/**
 * 成功响应
 */
export function success<T>(res: Response, data: T, message = 'success'): Response {
  const response: ApiResponse<T> = {
    code: ApiCode.Success,
    data,
    message,
  };
  return res.json(response);
}

/**
 * 错误响应
 */
export function error(
  res: Response,
  code: number,
  message: string,
  statusCode = 400
): Response {
  const response: ApiResponse<null> = {
    code,
    data: null,
    message,
  };
  return res.status(statusCode).json(response);
}

/**
 * 分页响应
 */
export function paginated<T>(
  res: Response,
  list: T[],
  total: number,
  page: number,
  pageSize: number
): Response {
  return success(res, {
    list,
    total,
    page,
    pageSize,
  });
}
