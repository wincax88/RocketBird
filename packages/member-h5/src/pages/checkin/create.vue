<template>
  <view class="create-page">
    <!-- 选择主题 -->
    <view class="section">
      <view class="section-title">打卡主题</view>
      <view class="theme-select" @click="showThemePicker = true">
        <view class="selected-theme" v-if="selectedTheme">
          <image class="theme-cover" :src="selectedTheme.coverImage" mode="aspectFill" />
          <view class="theme-info">
            <text class="theme-name">{{ selectedTheme.name }}</text>
            <text class="theme-reward">+{{ selectedTheme.rewardPoints }}积分</text>
          </view>
        </view>
        <view class="placeholder" v-else>
          <text>请选择打卡主题</text>
        </view>
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- 上传图片 -->
    <view class="section">
      <view class="section-title">打卡照片</view>
      <view class="image-upload">
        <view class="image-item" v-for="(img, index) in images" :key="index">
          <image :src="img" mode="aspectFill" @click="previewImage(index)" />
          <view class="remove-btn" @click.stop="removeImage(index)">×</view>
        </view>
        <view class="add-btn" v-if="images.length < 9" @click="chooseImage">
          <text class="icon">+</text>
          <text class="text">添加照片</text>
        </view>
      </view>
      <text class="tip">最多可上传9张照片</text>
    </view>

    <!-- 打卡内容 -->
    <view class="section">
      <view class="section-title">打卡内容</view>
      <textarea
        class="content-input"
        v-model="content"
        placeholder="记录你的健身心得..."
        :maxlength="500"
      />
      <text class="char-count">{{ content.length }}/500</text>
    </view>

    <!-- 位置信息 -->
    <view class="section">
      <view class="section-title">位置信息（可选）</view>
      <view class="location-select" @click="chooseLocation">
        <text class="location-text" v-if="location">{{ location.name }}</text>
        <text class="placeholder" v-else>添加位置</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="bottom-bar">
      <button class="submit-btn" :disabled="!canSubmit || submitting" @click="handleSubmit">
        {{ submitting ? '提交中...' : '完成打卡' }}
      </button>
    </view>

    <!-- 主题选择弹窗 -->
    <view class="theme-picker" v-if="showThemePicker" @click="showThemePicker = false">
      <view class="picker-content" @click.stop>
        <view class="picker-header">
          <text class="picker-title">选择打卡主题</text>
          <text class="close-btn" @click="showThemePicker = false">×</text>
        </view>
        <scroll-view class="theme-list" scroll-y>
          <view
            class="theme-option"
            v-for="theme in themes"
            :key="theme.themeId"
            :class="{ active: selectedTheme?.themeId === theme.themeId }"
            @click="selectTheme(theme)"
          >
            <image class="theme-cover" :src="theme.coverImage" mode="aspectFill" />
            <view class="theme-info">
              <text class="theme-name">{{ theme.name }}</text>
              <text class="theme-desc">{{ theme.description }}</text>
              <text class="theme-reward">+{{ theme.rewardPoints }}积分</text>
            </view>
            <view class="check-icon" v-if="selectedTheme?.themeId === theme.themeId">✓</view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { checkinApi } from '@/api';
import type { ICheckinTheme } from '@rocketbird/shared';

const themes = ref<ICheckinTheme[]>([]);
const selectedTheme = ref<ICheckinTheme | null>(null);
const images = ref<string[]>([]);
const content = ref('');
const location = ref<{ name: string; latitude: number; longitude: number } | null>(null);
const showThemePicker = ref(false);
const submitting = ref(false);

const canSubmit = computed(() => {
  return selectedTheme.value && images.value.length > 0;
});

// 加载主题列表
const loadThemes = async () => {
  try {
    const res = await checkinApi.getThemes();
    themes.value = res;
  } catch (error) {
    console.error('加载主题失败', error);
  }
};

// 选择主题
const selectTheme = (theme: ICheckinTheme) => {
  selectedTheme.value = theme;
  showThemePicker.value = false;
};

// 选择图片
const chooseImage = () => {
  const remain = 9 - images.value.length;
  uni.chooseImage({
    count: remain,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      // 上传图片到服务器
      res.tempFilePaths.forEach(async (path) => {
        try {
          const uploadRes = await uploadImage(path);
          images.value.push(uploadRes);
        } catch (error) {
          console.error('上传图片失败', error);
          uni.showToast({ title: '图片上传失败', icon: 'none' });
        }
      });
    },
  });
};

// 上传图片
const uploadImage = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${import.meta.env.VITE_API_BASE_URL}/upload/image`,
      filePath,
      name: 'file',
      success: (res) => {
        if (res.statusCode === 200) {
          const data = JSON.parse(res.data);
          resolve(data.url);
        } else {
          reject(new Error('上传失败'));
        }
      },
      fail: reject,
    });
  });
};

// 预览图片
const previewImage = (index: number) => {
  uni.previewImage({
    urls: images.value,
    current: index,
  });
};

// 删除图片
const removeImage = (index: number) => {
  images.value.splice(index, 1);
};

// 选择位置
const chooseLocation = () => {
  uni.chooseLocation({
    success: (res) => {
      if (res.name) {
        location.value = {
          name: res.name,
          latitude: res.latitude,
          longitude: res.longitude,
        };
      }
    },
    fail: (error) => {
      // 用户取消或未授权
      if (error.errMsg.includes('cancel')) return;
      uni.showToast({ title: '获取位置失败', icon: 'none' });
    },
  });
};

// 提交打卡
const handleSubmit = async () => {
  if (!canSubmit.value || submitting.value) return;

  try {
    submitting.value = true;

    await checkinApi.createCheckin({
      themeId: selectedTheme.value!.themeId,
      content: content.value || undefined,
      images: images.value,
      location: location.value || undefined,
    });

    uni.showToast({ title: '打卡成功', icon: 'success' });

    // 延迟返回
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (error) {
    console.error('打卡失败', error);
    uni.showToast({ title: '打卡失败，请重试', icon: 'none' });
  } finally {
    submitting.value = false;
  }
};

onLoad((options) => {
  loadThemes().then(() => {
    // 如果传入了themeId，自动选择该主题
    if (options?.themeId) {
      const theme = themes.value.find((t) => t.themeId === options.themeId);
      if (theme) {
        selectedTheme.value = theme;
      }
    }
  });
});
</script>

<style lang="scss" scoped>
.create-page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: 160rpx;
}

.section {
  background: #fff;
  margin: 24rpx;
  padding: 24rpx;
  border-radius: $radius-lg;

  .section-title {
    font-size: 30rpx;
    font-weight: 500;
    color: $text-color;
    margin-bottom: 24rpx;
  }
}

.theme-select {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: $bg-color;
  border-radius: $radius-md;

  .selected-theme {
    display: flex;
    align-items: center;
    flex: 1;

    .theme-cover {
      width: 80rpx;
      height: 80rpx;
      border-radius: $radius-sm;
    }

    .theme-info {
      margin-left: 20rpx;

      .theme-name {
        display: block;
        font-size: 28rpx;
        color: $text-color;
      }

      .theme-reward {
        display: block;
        font-size: 24rpx;
        color: $primary-color;
        margin-top: 4rpx;
      }
    }
  }

  .placeholder {
    flex: 1;
    color: $text-placeholder;
    font-size: 28rpx;
  }

  .arrow {
    font-size: 36rpx;
    color: $text-placeholder;
  }
}

.image-upload {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;

  .image-item {
    position: relative;
    width: 200rpx;
    height: 200rpx;

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
    width: 200rpx;
    height: 200rpx;
    background: $bg-color;
    border-radius: $radius-md;
    border: 2rpx dashed $border-color;

    .icon {
      font-size: 48rpx;
      color: $text-placeholder;
    }

    .text {
      font-size: 24rpx;
      color: $text-placeholder;
      margin-top: 8rpx;
    }
  }
}

.tip {
  display: block;
  font-size: 24rpx;
  color: $text-placeholder;
  margin-top: 16rpx;
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

.location-select {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: $bg-color;
  border-radius: $radius-md;

  .location-text {
    flex: 1;
    font-size: 28rpx;
    color: $text-color;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .placeholder {
    flex: 1;
    font-size: 28rpx;
    color: $text-placeholder;
  }

  .arrow {
    font-size: 36rpx;
    color: $text-placeholder;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);

  .submit-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: linear-gradient(135deg, #52c41a, #73d13d);
    color: #fff;
    font-size: 32rpx;
    font-weight: 500;
    border-radius: $radius-full;

    &[disabled] {
      opacity: 0.5;
    }
  }
}

// 主题选择弹窗
.theme-picker {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: flex-end;

  .picker-content {
    width: 100%;
    max-height: 70vh;
    background: #fff;
    border-radius: 24rpx 24rpx 0 0;
    display: flex;
    flex-direction: column;
  }

  .picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx;
    border-bottom: 1rpx solid $border-color;

    .picker-title {
      font-size: 32rpx;
      font-weight: 500;
      color: $text-color;
    }

    .close-btn {
      font-size: 40rpx;
      color: $text-placeholder;
    }
  }

  .theme-list {
    flex: 1;
    padding: 24rpx;
  }

  .theme-option {
    display: flex;
    align-items: center;
    padding: 24rpx;
    margin-bottom: 16rpx;
    background: $bg-color;
    border-radius: $radius-md;
    border: 2rpx solid transparent;

    &.active {
      border-color: $primary-color;
      background: rgba(82, 196, 26, 0.1);
    }

    .theme-cover {
      width: 120rpx;
      height: 120rpx;
      border-radius: $radius-md;
    }

    .theme-info {
      flex: 1;
      margin-left: 24rpx;

      .theme-name {
        display: block;
        font-size: 30rpx;
        color: $text-color;
        font-weight: 500;
      }

      .theme-desc {
        display: block;
        font-size: 24rpx;
        color: $text-secondary;
        margin-top: 8rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .theme-reward {
        display: block;
        font-size: 26rpx;
        color: $primary-color;
        margin-top: 8rpx;
      }
    }

    .check-icon {
      width: 48rpx;
      height: 48rpx;
      line-height: 48rpx;
      text-align: center;
      background: $primary-color;
      color: #fff;
      border-radius: 50%;
      font-size: 28rpx;
    }
  }
}
</style>
