import { get, post } from '@/utils/request';
import type { IPointsRecord, IPointsProduct, IExchangeOrder, IPagination } from '@rocketbird/shared';

// 获取积分余额
export const getPointsBalance = () => {
  return get<{ totalPoints: number; availablePoints: number }>('/points/balance');
};

// 获取积分明细
export const getPointsRecords = (params: { type?: string; page: number; pageSize: number }) => {
  return get<{ list: IPointsRecord[]; pagination: IPagination }>('/points/records', params);
};

// 获取积分商品列表
export const getMallProducts = (params: { category?: string; page: number; pageSize: number }) => {
  return get<{ list: IPointsProduct[]; pagination: IPagination }>('/points/mall/products', params);
};

// 获取商品详情
export const getProductDetail = (productId: string) => {
  return get<IPointsProduct>(`/points/mall/products/${productId}`);
};

// 积分兑换
export const exchangeProduct = (productId: string, quantity?: number) => {
  return post<IExchangeOrder>('/points/mall/exchange', { productId, quantity });
};

// 获取兑换订单列表
export const getExchangeOrders = (params: { status?: number; page: number; pageSize: number }) => {
  return get<{ list: IExchangeOrder[]; pagination: IPagination }>('/points/mall/orders', params);
};

// 获取订单详情
export const getOrderDetail = (orderId: string) => {
  return get<IExchangeOrder>(`/points/mall/orders/${orderId}`);
};

// 核销订单
export const useOrder = (orderId: string) => {
  return post<IExchangeOrder>(`/points/mall/orders/${orderId}/use`);
};
