import mongoose, { Schema, Document } from 'mongoose';

// 健身餐分类
export interface IMealCategory extends Document {
  categoryId: string;
  name: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const MealCategorySchema = new Schema<IMealCategory>(
  {
    categoryId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    sortOrder: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    collection: 'meal_categories',
  }
);

export const MealCategory = mongoose.model<IMealCategory>('MealCategory', MealCategorySchema);

// 健身餐
export interface IFitnessMeal extends Document {
  mealId: string;
  name: string;
  description: string;
  coverImage: string;
  images: string[];
  categoryId: string;
  categoryName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Array<{
    name: string;
    amount: string;
  }>;
  steps: Array<{
    stepNo: number;
    content: string;
    image?: string;
  }>;
  cookingTime: number;
  difficulty: number;
  tags: string[];
  viewCount: number;
  favoriteCount: number;
  isRecommended: boolean;
  sortOrder: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const FitnessMealSchema = new Schema<IFitnessMeal>(
  {
    mealId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    coverImage: { type: String, required: true },
    images: { type: [String], default: [] },
    categoryId: { type: String, required: true, index: true },
    categoryName: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    ingredients: [
      {
        name: { type: String, required: true },
        amount: { type: String, required: true },
      },
    ],
    steps: [
      {
        stepNo: { type: Number, required: true },
        content: { type: String, required: true },
        image: { type: String },
      },
    ],
    cookingTime: { type: Number, required: true }, // 分钟
    difficulty: { type: Number, default: 1 }, // 1简单 2中等 3困难
    tags: { type: [String], default: [] },
    viewCount: { type: Number, default: 0 },
    favoriteCount: { type: Number, default: 0 },
    isRecommended: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    status: { type: Number, default: 1 }, // 0下架 1上架
  },
  {
    timestamps: true,
    collection: 'fitness_meals',
  }
);

FitnessMealSchema.index({ categoryId: 1, status: 1 });
FitnessMealSchema.index({ isRecommended: 1, sortOrder: -1 });

export const FitnessMeal = mongoose.model<IFitnessMeal>('FitnessMeal', FitnessMealSchema);

// 用户收藏
export interface IMealFavorite extends Document {
  favoriteId: string;
  userId: string;
  mealId: string;
  createdAt: Date;
}

const MealFavoriteSchema = new Schema<IMealFavorite>(
  {
    favoriteId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    mealId: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'meal_favorites',
  }
);

MealFavoriteSchema.index({ userId: 1, mealId: 1 }, { unique: true });

export const MealFavorite = mongoose.model<IMealFavorite>('MealFavorite', MealFavoriteSchema);
