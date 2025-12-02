/**
 * API 相关类型定义
 */

export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

export interface PaginatedData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface ListParams extends PaginationParams {
  keyword?: string;
  status?: number;
  startDate?: string;
  endDate?: string;
}

export enum ApiCode {
  Success = 0,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  ServerError = 500,
}

export interface UploadResult {
  url: string;
  fileId?: string;
}

export interface SharePosterResult {
  posterUrl: string;
  shareId?: string;
}

export interface ShareCallbackParams {
  shareId: string;
}

export interface ShareRewardResult {
  rewardPoints: number;
  message: string;
}
