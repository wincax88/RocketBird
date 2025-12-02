import mongoose, { Schema, Document } from 'mongoose';

// 积分流水
export interface IPointsRecord extends Document {
  recordId: string;
  userId: string;
  type: string;
  points: number;
  balance: number;
  source: string;
  sourceId?: string;
  description: string;
  expireAt?: Date;
  createdAt: Date;
}

const PointsRecordSchema = new Schema<IPointsRecord>(
  {
    recordId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    type: { type: String, required: true }, // earn/consume/expire/adjust
    points: { type: Number, required: true },
    balance: { type: Number, required: true },
    source: { type: String, required: true }, // checkin/share/exchange/referral/birthday/growth/admin
    sourceId: { type: String, index: true },
    description: { type: String, required: true },
    expireAt: { type: Date },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'points_records',
  }
);

PointsRecordSchema.index({ userId: 1, createdAt: -1 });

export const PointsRecord = mongoose.model<IPointsRecord>('PointsRecord', PointsRecordSchema);

// 积分商品
export interface IPointsProduct extends Document {
  productId: string;
  name: string;
  description: string;
  coverImage: string;
  images: string[];
  category: string;
  pointsCost: number;
  originalPrice?: number;
  stock: number;
  totalStock: number;
  limitPerUser: number;
  productType: string;
  couponInfo?: {
    amount: number;
    minAmount: number;
    validDays: number;
  };
  validDays?: number;
  useRules?: string;
  sortOrder: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const PointsProductSchema = new Schema<IPointsProduct>(
  {
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    coverImage: { type: String, required: true },
    images: { type: [String], default: [] },
    category: { type: String, required: true },
    pointsCost: { type: Number, required: true },
    originalPrice: { type: Number },
    stock: { type: Number, required: true },
    totalStock: { type: Number, required: true },
    limitPerUser: { type: Number, default: 0 }, // 0=不限制
    productType: { type: String, required: true }, // coupon/physical/virtual
    couponInfo: {
      amount: { type: Number },
      minAmount: { type: Number },
      validDays: { type: Number },
    },
    validDays: { type: Number },
    useRules: { type: String },
    sortOrder: { type: Number, default: 0 },
    status: { type: Number, default: 1 }, // 0下架 1上架
  },
  {
    timestamps: true,
    collection: 'points_products',
  }
);

export const PointsProduct = mongoose.model<IPointsProduct>('PointsProduct', PointsProductSchema);

// 兑换订单
export interface IExchangeOrder extends Document {
  orderId: string;
  userId: string;
  userPhone?: string;
  productId: string;
  productName: string;
  productType: string;
  coverImage: string;
  pointsCost: number;
  quantity: number;
  totalPoints: number;
  status: number;
  couponCode?: string;
  expireAt?: Date;
  usedAt?: Date;
  useStore?: string;
  deliveryInfo?: {
    name: string;
    phone: string;
    address: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ExchangeOrderSchema = new Schema<IExchangeOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    userPhone: { type: String },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    productType: { type: String, required: true },
    coverImage: { type: String, required: true },
    pointsCost: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    totalPoints: { type: Number, required: true },
    status: { type: Number, default: 0 }, // 0待使用 1已使用 2已过期 3已取消
    couponCode: { type: String, unique: true, sparse: true },
    expireAt: { type: Date },
    usedAt: { type: Date },
    useStore: { type: String },
    deliveryInfo: {
      name: { type: String },
      phone: { type: String },
      address: { type: String },
    },
  },
  {
    timestamps: true,
    collection: 'exchange_orders',
  }
);

ExchangeOrderSchema.index({ userId: 1, status: 1 });
ExchangeOrderSchema.index({ couponCode: 1 });

export const ExchangeOrder = mongoose.model<IExchangeOrder>('ExchangeOrder', ExchangeOrderSchema);
