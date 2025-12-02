import mongoose, { Schema, Document } from 'mongoose';

// 品牌信息
export interface IBrandInfo extends Document {
  brandId: string;
  name: string;
  logo: string;
  slogan: string;
  description: string;
  contactPhone?: string;
  contactEmail?: string;
  wechatQrCode?: string;
  socialLinks?: {
    wechat?: string;
    weibo?: string;
    douyin?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BrandInfoSchema = new Schema<IBrandInfo>(
  {
    brandId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    logo: { type: String, required: true },
    slogan: { type: String, default: '' },
    description: { type: String, default: '' },
    contactPhone: { type: String },
    contactEmail: { type: String },
    wechatQrCode: { type: String },
    socialLinks: {
      wechat: { type: String },
      weibo: { type: String },
      douyin: { type: String },
    },
  },
  {
    timestamps: true,
    collection: 'brand_info',
  }
);

export const BrandInfo = mongoose.model<IBrandInfo>('BrandInfo', BrandInfoSchema);

// 品牌文章
export interface IBrandArticle extends Document {
  articleId: string;
  title: string;
  summary?: string;
  coverImage: string;
  content: string;
  category: string;
  tags: string[];
  viewCount: number;
  isTop: boolean;
  sortOrder: number;
  status: number;
  publishAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BrandArticleSchema = new Schema<IBrandArticle>(
  {
    articleId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    summary: { type: String },
    coverImage: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true }, // news/activity/knowledge
    tags: { type: [String], default: [] },
    viewCount: { type: Number, default: 0 },
    isTop: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    status: { type: Number, default: 1 }, // 0草稿 1发布
    publishAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: 'brand_articles',
  }
);

BrandArticleSchema.index({ category: 1, status: 1, publishAt: -1 });

export const BrandArticle = mongoose.model<IBrandArticle>('BrandArticle', BrandArticleSchema);

// 门店信息
export interface IBrandStore extends Document {
  storeId: string;
  name: string;
  address: string;
  phone: string;
  businessHours: string;
  latitude: number;
  longitude: number;
  images: string[];
  facilities: string[];
  description?: string;
  sortOrder: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const BrandStoreSchema = new Schema<IBrandStore>(
  {
    storeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    businessHours: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    images: { type: [String], default: [] },
    facilities: { type: [String], default: [] },
    description: { type: String },
    sortOrder: { type: Number, default: 0 },
    status: { type: Number, default: 1 }, // 0关闭 1营业
  },
  {
    timestamps: true,
    collection: 'brand_stores',
  }
);

export const BrandStore = mongoose.model<IBrandStore>('BrandStore', BrandStoreSchema);

// 轮播图
export interface IBanner extends Document {
  bannerId: string;
  title: string;
  image: string;
  linkType: string;
  linkUrl?: string;
  position: string;
  sortOrder: number;
  startAt?: Date;
  endAt?: Date;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    bannerId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    linkType: { type: String, default: 'none' }, // none/page/article/url
    linkUrl: { type: String },
    position: { type: String, default: 'home' }, // home/points/checkin
    sortOrder: { type: Number, default: 0 },
    startAt: { type: Date },
    endAt: { type: Date },
    status: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    collection: 'banners',
  }
);

BannerSchema.index({ position: 1, status: 1, sortOrder: -1 });

export const Banner = mongoose.model<IBanner>('Banner', BannerSchema);
