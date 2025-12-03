<template>
  <view class="meals-page">
    <!-- 今日推荐 -->
    <view class="today-section" v-if="todayMeal">
      <view class="section-title">今日推荐</view>
      <view class="today-card" @click="goDetail(todayMeal.mealId)">
        <image class="today-image" :src="todayMeal.coverImage" mode="aspectFill" />
        <view class="today-info">
          <view class="today-header">
            <text class="today-name">{{ todayMeal.name }}</text>
            <view class="meal-type" :class="todayMeal.type">
              {{ getMealTypeText(todayMeal.type) }}
            </view>
          </view>
          <text class="today-desc">{{ todayMeal.description }}</text>
          <view class="nutrition-brief">
            <text class="nutrition-item">{{ todayMeal.calories }}卡</text>
            <text class="nutrition-item">蛋白质{{ todayMeal.protein }}g</text>
            <text class="nutrition-item">碳水{{ todayMeal.carbs }}g</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 日历 -->
    <view class="calendar-section">
      <view class="calendar-header">
        <text class="arrow" @click="prevMonth">‹</text>
        <text class="month-text">{{ currentYear }}年{{ currentMonth }}月</text>
        <text class="arrow" @click="nextMonth">›</text>
      </view>
      <view class="weekday-row">
        <text class="weekday" v-for="day in weekdays" :key="day">{{ day }}</text>
      </view>
      <view class="days-grid">
        <view
          class="day-cell"
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="{ empty: !day.date, today: day.isToday, selected: day.date === selectedDate, hasMeal: day.hasMeal }"
          @click="selectDate(day)"
        >
          <text class="day-num">{{ day.day }}</text>
          <view class="meal-dot" v-if="day.hasMeal"></view>
        </view>
      </view>
    </view>

    <!-- 健身餐列表 -->
    <view class="meal-list">
      <view class="list-header">
        <text class="list-title">{{ selectedDate ? formatDateTitle(selectedDate) : '全部' }}健身餐</text>
        <text class="clear-filter" v-if="selectedDate" @click="clearFilter">查看全部</text>
      </view>
      <view
        class="meal-item"
        v-for="meal in meals"
        :key="meal.mealId"
        @click="goDetail(meal.mealId)"
      >
        <image class="meal-image" :src="meal.coverImage" mode="aspectFill" />
        <view class="meal-info">
          <view class="meal-header">
            <text class="meal-name">{{ meal.name }}</text>
            <view class="meal-type" :class="meal.type">{{ getMealTypeText(meal.type) }}</view>
          </view>
          <text class="meal-desc">{{ meal.description }}</text>
          <view class="meal-nutrition">
            <text class="nutrition">{{ meal.calories }}卡</text>
            <text class="nutrition">蛋白质{{ meal.protein }}g</text>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view class="load-more" v-if="hasMore">
        <text @click="loadMore">加载更多</text>
      </view>
      <view class="no-more" v-else-if="meals.length > 0">
        <text>没有更多了</text>
      </view>

      <!-- 空状态 -->
      <view class="empty" v-if="!loading && meals.length === 0">
        <image src="/static/empty.png" mode="aspectFit" class="empty-image" />
        <text>暂无健身餐</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow, onReachBottom } from '@dcloudio/uni-app';
import { mealsApi } from '@/api';
import type { Meal, MealCalendar } from '@rocketbird/shared';

const loading = ref(false);
const meals = ref<Meal[]>([]);
const todayMeal = ref<Meal | null>(null);
const page = ref(1);
const pageSize = 10;
const hasMore = ref(true);
const selectedDate = ref('');

// 日历相关
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
const calendarData = ref<MealCalendar[]>([]);

const getMealTypeText = (type: string) => {
  const types: Record<string, string> = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '加餐',
  };
  return types[type] || type;
};

const formatDateTitle = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

// 计算日历天数
const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  const today = new Date();

  const days: { date: string; day: string; isToday: boolean; hasMeal: boolean }[] = [];

  // 填充空白天数
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push({ date: '', day: '', isToday: false, hasMeal: false });
  }

  // 填充当月天数
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const isToday =
      year === today.getFullYear() && month === today.getMonth() + 1 && i === today.getDate();
    const dayData = calendarData.value.find((d) => d.date === dateStr);
    days.push({
      date: dateStr,
      day: String(i),
      isToday,
      hasMeal: !!dayData,
    });
  }

  return days;
});

// 加载今日推荐
const loadTodayMeal = async () => {
  try {
    const res = await mealsApi.getTodayMeal();
    todayMeal.value = res;
  } catch (error) {
    console.error('加载今日推荐失败', error);
  }
};

// 加载日历数据
const loadCalendar = async () => {
  try {
    const res = await mealsApi.getMealCalendar({
      year: currentYear.value,
      month: currentMonth.value,
    });
    calendarData.value = res;
  } catch (error) {
    console.error('加载日历失败', error);
  }
};

// 加载健身餐列表
const loadMeals = async (refresh = false) => {
  if (loading.value) return;

  try {
    loading.value = true;
    if (refresh) {
      page.value = 1;
      hasMore.value = true;
    }

    const res = await mealsApi.getMealList({
      page: page.value,
      pageSize,
      date: selectedDate.value || undefined,
    });

    if (refresh) {
      meals.value = res.list;
    } else {
      meals.value = [...meals.value, ...res.list];
    }

    hasMore.value = res.list.length === pageSize;
  } catch (error) {
    console.error('加载健身餐失败', error);
  } finally {
    loading.value = false;
  }
};

const loadMore = () => {
  if (hasMore.value && !loading.value) {
    page.value++;
    loadMeals();
  }
};

// 切换月份
const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentYear.value--;
    currentMonth.value = 12;
  } else {
    currentMonth.value--;
  }
  loadCalendar();
};

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentYear.value++;
    currentMonth.value = 1;
  } else {
    currentMonth.value++;
  }
  loadCalendar();
};

// 选择日期
const selectDate = (day: { date: string; day: string }) => {
  if (!day.date) return;
  selectedDate.value = day.date;
  loadMeals(true);
};

// 清除筛选
const clearFilter = () => {
  selectedDate.value = '';
  loadMeals(true);
};

// 跳转详情
const goDetail = (mealId: string) => {
  uni.navigateTo({ url: `/pages/meals/detail?id=${mealId}` });
};

onShow(() => {
  loadTodayMeal();
  loadCalendar();
  loadMeals(true);
});

onReachBottom(() => {
  loadMore();
});
</script>

<style lang="scss" scoped>
.meals-page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: env(safe-area-inset-bottom);
}

.today-section {
  background: #fff;
  margin: 24rpx;
  padding: 24rpx;
  border-radius: $radius-lg;

  .section-title {
    font-size: 32rpx;
    font-weight: 500;
    color: $text-color;
    margin-bottom: 20rpx;
  }

  .today-card {
    .today-image {
      width: 100%;
      height: 320rpx;
      border-radius: $radius-md;
    }

    .today-info {
      margin-top: 20rpx;

      .today-header {
        display: flex;
        align-items: center;
        gap: 16rpx;

        .today-name {
          font-size: 34rpx;
          font-weight: 500;
          color: $text-color;
        }
      }

      .today-desc {
        display: block;
        font-size: 26rpx;
        color: $text-secondary;
        margin-top: 12rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .nutrition-brief {
        display: flex;
        gap: 24rpx;
        margin-top: 16rpx;

        .nutrition-item {
          font-size: 24rpx;
          color: $primary-color;
          background: rgba(82, 196, 26, 0.1);
          padding: 6rpx 16rpx;
          border-radius: $radius-sm;
        }
      }
    }
  }
}

.meal-type {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: $radius-sm;
  color: #fff;

  &.breakfast {
    background: #faad14;
  }

  &.lunch {
    background: #52c41a;
  }

  &.dinner {
    background: #1890ff;
  }

  &.snack {
    background: #eb2f96;
  }
}

.calendar-section {
  background: #fff;
  margin: 24rpx;
  padding: 24rpx;
  border-radius: $radius-lg;

  .calendar-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 24rpx;

    .arrow {
      width: 60rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      font-size: 40rpx;
      color: $text-secondary;
    }

    .month-text {
      font-size: 32rpx;
      font-weight: 500;
      color: $text-color;
      margin: 0 24rpx;
    }
  }

  .weekday-row {
    display: flex;
    margin-bottom: 16rpx;

    .weekday {
      flex: 1;
      text-align: center;
      font-size: 24rpx;
      color: $text-secondary;
    }
  }

  .days-grid {
    display: flex;
    flex-wrap: wrap;

    .day-cell {
      width: calc(100% / 7);
      height: 80rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .day-num {
        font-size: 28rpx;
        color: $text-color;
      }

      .meal-dot {
        width: 10rpx;
        height: 10rpx;
        background: $primary-color;
        border-radius: 50%;
        margin-top: 4rpx;
      }

      &.empty .day-num {
        visibility: hidden;
      }

      &.today .day-num {
        background: $primary-color;
        color: #fff;
        width: 48rpx;
        height: 48rpx;
        line-height: 48rpx;
        text-align: center;
        border-radius: 50%;
      }

      &.selected .day-num {
        background: rgba(82, 196, 26, 0.2);
        width: 48rpx;
        height: 48rpx;
        line-height: 48rpx;
        text-align: center;
        border-radius: 50%;
      }

      &.hasMeal .day-num {
        color: $primary-color;
        font-weight: 500;
      }
    }
  }
}

.meal-list {
  background: #fff;
  margin: 24rpx;
  padding: 24rpx;
  border-radius: $radius-lg;

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .list-title {
      font-size: 32rpx;
      font-weight: 500;
      color: $text-color;
    }

    .clear-filter {
      font-size: 26rpx;
      color: $primary-color;
    }
  }

  .meal-item {
    display: flex;
    padding: 20rpx 0;
    border-bottom: 1rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .meal-image {
      width: 180rpx;
      height: 180rpx;
      border-radius: $radius-md;
      flex-shrink: 0;
    }

    .meal-info {
      flex: 1;
      margin-left: 20rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .meal-header {
        display: flex;
        align-items: center;
        gap: 12rpx;

        .meal-name {
          font-size: 30rpx;
          font-weight: 500;
          color: $text-color;
        }
      }

      .meal-desc {
        font-size: 26rpx;
        color: $text-secondary;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .meal-nutrition {
        display: flex;
        gap: 16rpx;

        .nutrition {
          font-size: 24rpx;
          color: $text-placeholder;
        }
      }
    }
  }
}

.load-more,
.no-more {
  text-align: center;
  padding: 32rpx;
  color: $text-placeholder;
  font-size: 26rpx;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  color: $text-placeholder;

  .empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 24rpx;
  }
}
</style>
