import { get } from '@/utils/request';
import type { Meal, MealCalendar, IPagination } from '@rocketbird/shared';

// 获取健身餐列表
export const getMealList = (params: { page: number; pageSize: number; date?: string }) => {
  return get<{ list: Meal[]; pagination: IPagination }>('/meals', params);
};

// 获取健身餐详情
export const getMealDetail = (mealId: string) => {
  return get<Meal>(`/meals/${mealId}`);
};

// 获取今日健身餐
export const getTodayMeal = () => {
  return get<Meal | null>('/meals/today');
};

// 获取健身餐日历
export const getMealCalendar = (params: { year: number; month: number }) => {
  return get<MealCalendar[]>('/meals/calendar', params);
};

// 分享健身餐
export const shareMeal = (mealId: string) => {
  return get<{ shareUrl: string; posterUrl: string }>(`/meals/${mealId}/share`);
};
