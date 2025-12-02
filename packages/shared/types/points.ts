/**
 * 积分相关类型定义
 */

export interface PointsLog {
  logId: string;
  userId: string;
  type: PointsType;
  value: number;
  balance: number;
  source: PointsSource;
  sourceId?: string;
  remark: string;
  createdAt: string;
}

export enum PointsType {
  Income = 'income',
  Cost = 'cost',
}

export enum PointsSource {
  Checkin = 'checkin',
  Share = 'share',
  Referral = 'referral',
  Birthday = 'birthday',
  Growth = 'growth',
  NewMember = 'newmember',
  Exchange = 'exchange',
  Admin = 'admin',
  Reward = 'reward',
  Expire = 'expire',
}

export interface PointsBalance {
  balance: number;
  totalEarned: number;
  totalSpent: number;
}

export interface Goods {
  goodsId: string;
  title: string;
  description: string;
  type: GoodsType;
  points: number;
  originalPoints?: number;
  stock: number;
  images: string[];
  limitPerUser: number;
  levelLimit: number[];
  sortOrder: number;
  status: GoodsStatus;
  createdAt: string;
  updatedAt?: string;
}

export enum GoodsType {
  Virtual = 'virtual',
  Physical = 'physical',
}

export enum GoodsStatus {
  OffShelf = 0,
  OnShelf = 1,
}

export interface ExchangeOrder {
  orderId: string;
  orderNo: string;
  userId: string;
  goodsId: string;
  goodsTitle: string;
  goodsImage: string;
  goodsType: GoodsType;
  points: number;
  quantity: number;
  status: OrderStatus;
  address?: Address;
  expressCompany?: string;
  expressNo?: string;
  remark?: string;
  createdAt: string;
  completedAt?: string;
}

export enum OrderStatus {
  Pending = 0,
  Processing = 1,
  Shipped = 2,
  Completed = 3,
  Cancelled = 4,
}

export interface Address {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
}

export interface ExchangeParams {
  goodsId: string;
  quantity: number;
  address?: Address;
}
