<template>
  <view class="feedback-page">
    <!-- 提交反馈表单 -->
    <view class="form-section">
      <view class="section-title">提交反馈</view>

      <!-- 反馈类型 -->
      <view class="form-item">
        <text class="label">反馈类型</text>
        <view class="category-list">
          <view
            class="category-item"
            v-for="cat in categories"
            :key="cat.value"
            :class="{ active: feedbackData.category === cat.value }"
            @click="feedbackData.category = cat.value"
          >
            {{ cat.label }}
          </view>
        </view>
      </view>

      <!-- 反馈内容 -->
      <view class="form-item">
        <text class="label">反馈内容</text>
        <textarea
          class="content-input"
          v-model="feedbackData.content"
          placeholder="请详细描述您的问题或建议..."
          :maxlength="500"
        />
        <text class="char-count">{{ feedbackData.content.length }}/500</text>
      </view>

      <!-- 上传图片 -->
      <view class="form-item">
        <text class="label">上传图片（可选）</text>
        <view class="image-upload">
          <view class="image-item" v-for="(img, index) in feedbackData.images" :key="index">
            <image :src="img" mode="aspectFill" @click="previewImage(index)" />
            <view class="remove-btn" @click.stop="removeImage(index)">×</view>
          </view>
          <view class="add-btn" v-if="feedbackData.images.length < 3" @click="chooseImage">
            <text class="icon">+</text>
            <text class="text">添加</text>
          </view>
        </view>
        <text class="tip">最多上传3张图片</text>
      </view>

      <!-- 联系方式 -->
      <view class="form-item">
        <text class="label">联系方式（可选）</text>
        <input
          class="contact-input"
          v-model="feedbackData.contact"
          placeholder="请留下您的手机号或邮箱"
        />
      </view>

      <!-- 提交按钮 -->
      <button class="submit-btn" :disabled="!canSubmit || submitting" @click="handleSubmit">
        {{ submitting ? '提交中...' : '提交反馈' }}
      </button>
    </view>

    <!-- 历史反馈 -->
    <view class="history-section" v-if="historyList.length > 0">
      <view class="section-title">历史反馈</view>
      <view class="history-list">
        <view
          class="history-item"
          v-for="item in historyList"
          :key="item.feedbackId"
          @click="toggleDetail(item)"
        >
          <view class="history-header">
            <view class="history-type">{{ getCategoryLabel(item.category) }}</view>
            <view class="history-status" :class="getStatusClass(item.status)">
              {{ getStatusText(item.status) }}
            </view>
          </view>
          <text class="history-content">{{ item.content }}</text>
          <text class="history-time">{{ formatDate(item.createdAt) }}</text>

          <!-- 回复详情 -->
          <view class="reply-section" v-if="item.showDetail && item.reply">
            <view class="reply-header">官方回复</view>
            <text class="reply-content">{{ item.reply }}</text>
            <text class="reply-time">{{ formatDate(item.replyAt) }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { feedbackApi } from '@/api';
import { formatDate } from '@rocketbird/shared';
import type { Feedback } from '@rocketbird/shared';

const categories = [
  { value: 'bug', label: '问题反馈' },
  { value: 'suggestion', label: '功能建议' },
  { value: 'complaint', label: '投诉' },
  { value: 'other', label: '其他' },
];

const feedbackData = reactive({
  category: 'suggestion',
  content: '',
  images: [] as string[],
  contact: '',
});

const submitting = ref(false);
const historyList = ref<(Feedback & { showDetail?: boolean })[]>([]);

const canSubmit = computed(() => {
  return feedbackData.content.trim().length >= 10;
});

const getCategoryLabel = (value: string) => {
  const cat = categories.find((c) => c.value === value);
  return cat?.label || value;
};

const getStatusText = (status: number) => {
  const texts: Record<number, string> = {
    0: '待处理',
    1: '处理中',
    2: '已回复',
    3: '已关闭',
  };
  return texts[status] || '未知';
};

const getStatusClass = (status: number) => {
  const classes: Record<number, string> = {
    0: 'pending',
    1: 'processing',
    2: 'replied',
    3: 'closed',
  };
  return classes[status] || '';
};

// 选择图片
const chooseImage = () => {
  const remain = 3 - feedbackData.images.length;
  uni.chooseImage({
    count: remain,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      res.tempFilePaths.forEach(async (path) => {
        try {
          const url = await feedbackApi.uploadImage(path);
          feedbackData.images.push(url);
        } catch (error) {
          console.error('上传图片失败', error);
          uni.showToast({ title: '图片上传失败', icon: 'none' });
        }
      });
    },
  });
};

// 预览图片
const previewImage = (index: number) => {
  uni.previewImage({
    urls: feedbackData.images,
    current: index,
  });
};

// 删除图片
const removeImage = (index: number) => {
  feedbackData.images.splice(index, 1);
};

// 提交反馈
const handleSubmit = async () => {
  if (!canSubmit.value || submitting.value) return;

  try {
    submitting.value = true;
    await feedbackApi.submitFeedback({
      category: feedbackData.category,
      content: feedbackData.content,
      images: feedbackData.images.length > 0 ? feedbackData.images : undefined,
      contact: feedbackData.contact || undefined,
    });

    uni.showToast({ title: '提交成功', icon: 'success' });

    // 重置表单
    feedbackData.content = '';
    feedbackData.images = [];
    feedbackData.contact = '';

    // 刷新历史
    loadHistory();
  } catch (error) {
    console.error('提交失败', error);
    uni.showToast({ title: '提交失败', icon: 'none' });
  } finally {
    submitting.value = false;
  }
};

// 加载历史反馈
const loadHistory = async () => {
  try {
    const res = await feedbackApi.getMyFeedbacks({ page: 1, pageSize: 10 });
    historyList.value = res.list.map((item) => ({ ...item, showDetail: false }));
  } catch (error) {
    console.error('加载历史失败', error);
  }
};

// 切换详情
const toggleDetail = (item: Feedback & { showDetail?: boolean }) => {
  item.showDetail = !item.showDetail;
};

onShow(() => {
  loadHistory();
});
</script>

<style lang="scss" scoped>
.feedback-page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: env(safe-area-inset-bottom);
}

.form-section,
.history-section {
  background: #fff;
  margin: 24rpx;
  padding: 24rpx;
  border-radius: $radius-lg;
}

.section-title {
  font-size: 32rpx;
  font-weight: 500;
  color: $text-color;
  margin-bottom: 24rpx;
}

.form-item {
  margin-bottom: 32rpx;

  .label {
    display: block;
    font-size: 28rpx;
    color: $text-color;
    margin-bottom: 16rpx;
  }
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;

  .category-item {
    padding: 16rpx 32rpx;
    font-size: 26rpx;
    color: $text-secondary;
    background: $bg-color;
    border-radius: $radius-full;
    border: 2rpx solid transparent;

    &.active {
      color: $primary-color;
      background: rgba(82, 196, 26, 0.1);
      border-color: $primary-color;
    }
  }
}

.content-input {
  width: 100%;
  height: 240rpx;
  padding: 20rpx;
  background: $bg-color;
  border-radius: $radius-md;
  font-size: 28rpx;
  color: $text-color;
  box-sizing: border-box;
}

.char-count {
  display: block;
  text-align: right;
  font-size: 24rpx;
  color: $text-placeholder;
  margin-top: 12rpx;
}

.image-upload {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;

  .image-item {
    position: relative;
    width: 160rpx;
    height: 160rpx;

    image {
      width: 100%;
      height: 100%;
      border-radius: $radius-md;
    }

    .remove-btn {
      position: absolute;
      top: -16rpx;
      right: -16rpx;
      width: 40rpx;
      height: 40rpx;
      line-height: 36rpx;
      text-align: center;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      border-radius: 50%;
      font-size: 28rpx;
    }
  }

  .add-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 160rpx;
    height: 160rpx;
    background: $bg-color;
    border-radius: $radius-md;
    border: 2rpx dashed $border-color;

    .icon {
      font-size: 40rpx;
      color: $text-placeholder;
    }

    .text {
      font-size: 22rpx;
      color: $text-placeholder;
      margin-top: 8rpx;
    }
  }
}

.tip {
  display: block;
  font-size: 24rpx;
  color: $text-placeholder;
  margin-top: 12rpx;
}

.contact-input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  background: $bg-color;
  border-radius: $radius-md;
  font-size: 28rpx;
  color: $text-color;
  box-sizing: border-box;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: $primary-color;
  color: #fff;
  font-size: 32rpx;
  font-weight: 500;
  border-radius: $radius-full;
  margin-top: 16rpx;

  &[disabled] {
    opacity: 0.5;
  }
}

.history-list {
  .history-item {
    padding: 24rpx;
    margin-bottom: 16rpx;
    background: $bg-color;
    border-radius: $radius-md;

    &:last-child {
      margin-bottom: 0;
    }

    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12rpx;

      .history-type {
        font-size: 26rpx;
        color: $text-color;
        font-weight: 500;
      }

      .history-status {
        font-size: 24rpx;
        padding: 4rpx 16rpx;
        border-radius: $radius-sm;

        &.pending {
          color: #faad14;
          background: rgba(250, 173, 20, 0.1);
        }

        &.processing {
          color: #1890ff;
          background: rgba(24, 144, 255, 0.1);
        }

        &.replied {
          color: $primary-color;
          background: rgba(82, 196, 26, 0.1);
        }

        &.closed {
          color: $text-placeholder;
          background: rgba(0, 0, 0, 0.05);
        }
      }
    }

    .history-content {
      display: block;
      font-size: 26rpx;
      color: $text-secondary;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .history-time {
      display: block;
      font-size: 24rpx;
      color: $text-placeholder;
      margin-top: 12rpx;
    }

    .reply-section {
      margin-top: 16rpx;
      padding-top: 16rpx;
      border-top: 1rpx solid $border-color;

      .reply-header {
        font-size: 26rpx;
        color: $primary-color;
        font-weight: 500;
        margin-bottom: 8rpx;
      }

      .reply-content {
        font-size: 26rpx;
        color: $text-color;
        line-height: 1.5;
      }

      .reply-time {
        display: block;
        font-size: 24rpx;
        color: $text-placeholder;
        margin-top: 8rpx;
      }
    }
  }
}
</style>
