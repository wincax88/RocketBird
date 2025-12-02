/**
 * 健身餐相关类型定义
 */

export interface Meal {
  mealId: string;
  date: string;
  weekday: number;
  title: string;
  content: string;
  images: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  nutritionist: string;
  nutritionistAvatar?: string;
  tips?: string;
  recipes?: MealRecipe[];
  shareCount: number;
  viewCount: number;
  status: MealStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface MealRecipe {
  recipeId: string;
  mealId: string;
  mealType: MealType;
  name: string;
  description: string;
  image: string;
  calories: number;
  sortOrder: number;
}

export enum MealType {
  Breakfast = 'breakfast',
  Lunch = 'lunch',
  Dinner = 'dinner',
  Snack = 'snack',
}

export enum MealStatus {
  Hidden = 0,
  Visible = 1,
}

export interface MealCalendar {
  date: string;
  hasMeal: boolean;
}
