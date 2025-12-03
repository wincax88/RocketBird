<template>
  <view class="brand-page">
    <!-- 品牌 Banner -->
    <view class="brand-banner">
      <image class="banner-image" src="/static/brand-banner.png" mode="aspectFill" />
      <view class="banner-overlay">
        <text class="brand-name">RocketBird</text>
        <text class="brand-slogan">让健康成为生活方式</text>
      </view>
    </view>

    <!-- 品牌故事 -->
    <view class="section" v-if="brandStory">
      <view class="section-title">
        <text class="title-text">品牌故事</text>
        <view class="title-line"></view>
      </view>
      <view class="story-content">
        <rich-text :nodes="brandStory.content"></rich-text>
      </view>
    </view>

    <!-- 品牌理念 -->
    <view class="section">
      <view class="section-title">
        <text class="title-text">品牌理念</text>
        <view class="title-line"></view>
      </view>
      <view class="concept-grid">
        <view class="concept-item">
          <view class="concept-icon">💪</view>
          <text class="concept-title">科学健身</text>
          <text class="concept-desc">专业教练指导，科学训练计划</text>
        </view>
        <view class="concept-item">
          <view class="concept-icon">🥗</view>
          <text class="concept-title">营养膳食</text>
          <text class="concept-desc">均衡营养搭配，健康饮食习惯</text>
        </view>
        <view class="concept-item">
          <view class="concept-icon">🎯</view>
          <text class="concept-title">目标导向</text>
          <text class="concept-desc">个性化目标设定，持续追踪进度</text>
        </view>
        <view class="concept-item">
          <view class="concept-icon">👥</view>
          <text class="concept-title">社区互动</text>
          <text class="concept-desc">志同道合伙伴，共同成长进步</text>
        </view>
      </view>
    </view>

    <!-- 品牌视频 -->
    <view class="section" v-if="brandVideos.length > 0">
      <view class="section-title">
        <text class="title-text">品牌视频</text>
        <view class="title-line"></view>
      </view>
      <view class="video-list">
        <view
          class="video-item"
          v-for="video in brandVideos"
          :key="video.contentId"
          @click="playVideo(video)"
        >
          <image class="video-cover" :src="video.coverImage" mode="aspectFill" />
          <view class="play-icon">▶</view>
          <text class="video-title">{{ video.title }}</text>
        </view>
      </view>
    </view>

    <!-- 联系我们 -->
    <view class="section">
      <view class="section-title">
        <text class="title-text">联系我们</text>
        <view class="title-line"></view>
      </view>
      <view class="contact-list">
        <view class="contact-item" @click="makePhoneCall">
          <view class="contact-icon">📞</view>
          <view class="contact-info">
            <text class="contact-label">客服电话</text>
            <text class="contact-value">400-888-8888</text>
          </view>
          <text class="contact-arrow">›</text>
        </view>
        <view class="contact-item" @click="copyEmail">
          <view class="contact-icon">📧</view>
          <view class="contact-info">
            <text class="contact-label">电子邮箱</text>
            <text class="contact-value">contact@rocketbird.com</text>
          </view>
          <text class="contact-arrow">›</text>
        </view>
        <view class="contact-item">
          <view class="contact-icon">📍</view>
          <view class="contact-info">
            <text class="contact-label">公司地址</text>
            <text class="contact-value">上海市浦东新区XX路XX号</text>
          </view>
        </view>
        <view class="contact-item">
          <view class="contact-icon">⏰</view>
          <view class="contact-info">
            <text class="contact-label">服务时间</text>
            <text class="contact-value">周一至周日 9:00-21:00</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 关注我们 -->
    <view class="section">
      <view class="section-title">
        <text class="title-text">关注我们</text>
        <view class="title-line"></view>
      </view>
      <view class="follow-grid">
        <view class="follow-item" @click="showQRCode('wechat')">
          <image class="follow-icon" src="/static/icon-wechat.png" mode="aspectFit" />
          <text class="follow-name">微信公众号</text>
        </view>
        <view class="follow-item" @click="showQRCode('weibo')">
          <image class="follow-icon" src="/static/icon-weibo.png" mode="aspectFit" />
          <text class="follow-name">官方微博</text>
        </view>
        <view class="follow-item" @click="showQRCode('douyin')">
          <image class="follow-icon" src="/static/icon-douyin.png" mode="aspectFit" />
          <text class="follow-name">抖音号</text>
        </view>
        <view class="follow-item" @click="showQRCode('xiaohongshu')">
          <image class="follow-icon" src="/static/icon-xiaohongshu.png" mode="aspectFit" />
          <text class="follow-name">小红书</text>
        </view>
      </view>
    </view>

    <!-- 版权信息 -->
    <view class="copyright">
      <text>© 2024 RocketBird 火箭鸟健康</text>
      <text>保留所有权利</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { brandApi } from '@/api';
import type { BrandContent } from '@rocketbird/shared';

const brandStory = ref<BrandContent | null>(null);
const brandVideos = ref<BrandContent[]>([]);

// 加载品牌故事
const loadBrandStory = async () => {
  try {
    const res = await brandApi.getBrandStory();
    brandStory.value = res;
  } catch (error) {
    console.error('加载品牌故事失败', error);
  }
};

// 加载品牌视频
const loadBrandVideos = async () => {
  try {
    const res = await brandApi.getBrandVideos();
    brandVideos.value = res;
  } catch (error) {
    console.error('加载品牌视频失败', error);
  }
};

// 播放视频
const playVideo = (video: BrandContent) => {
  if (video.videoUrl) {
    uni.navigateTo({
      url: `/pages/webview/index?url=${encodeURIComponent(video.videoUrl)}`,
    });
  }
};

// 拨打电话
const makePhoneCall = () => {
  uni.makePhoneCall({
    phoneNumber: '4008888888',
  });
};

// 复制邮箱
const copyEmail = () => {
  uni.setClipboardData({
    data: 'contact@rocketbird.com',
    success: () => {
      uni.showToast({ title: '邮箱已复制', icon: 'success' });
    },
  });
};

// 显示二维码
const showQRCode = (type: string) => {
  uni.showToast({ title: `请关注${type}`, icon: 'none' });
};

onShow(() => {
  loadBrandStory();
  loadBrandVideos();
});
</script>

<style lang="scss" scoped>
.brand-page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: env(safe-area-inset-bottom);
}

.brand-banner {
  position: relative;
  width: 100%;
  height: 400rpx;

  .banner-image {
    width: 100%;
    height: 100%;
  }

  .banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(82, 196, 26, 0.8), rgba(82, 196, 26, 0.6));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;

    .brand-name {
      font-size: 56rpx;
      font-weight: 700;
      letter-spacing: 4rpx;
    }

    .brand-slogan {
      font-size: 28rpx;
      margin-top: 16rpx;
      opacity: 0.9;
    }
  }
}

.section {
  background: #fff;
  margin: 24rpx;
  padding: 32rpx;
  border-radius: $radius-lg;
}

.section-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32rpx;

  .title-text {
    font-size: 36rpx;
    font-weight: 600;
    color: $text-color;
  }

  .title-line {
    width: 60rpx;
    height: 6rpx;
    background: $primary-color;
    border-radius: 3rpx;
    margin-top: 16rpx;
  }
}

.story-content {
  font-size: 28rpx;
  color: $text-secondary;
  line-height: 1.8;
  text-align: justify;
}

.concept-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;

  .concept-item {
    text-align: center;
    padding: 32rpx 16rpx;
    background: $bg-color;
    border-radius: $radius-md;

    .concept-icon {
      font-size: 56rpx;
      margin-bottom: 16rpx;
    }

    .concept-title {
      display: block;
      font-size: 30rpx;
      font-weight: 500;
      color: $text-color;
    }

    .concept-desc {
      display: block;
      font-size: 24rpx;
      color: $text-secondary;
      margin-top: 8rpx;
    }
  }
}

.video-list {
  .video-item {
    position: relative;
    margin-bottom: 24rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .video-cover {
      width: 100%;
      height: 320rpx;
      border-radius: $radius-md;
    }

    .play-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      border-radius: 50%;
      font-size: 32rpx;
    }

    .video-title {
      display: block;
      font-size: 28rpx;
      color: $text-color;
      margin-top: 16rpx;
    }
  }
}

.contact-list {
  .contact-item {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .contact-icon {
      font-size: 40rpx;
      margin-right: 20rpx;
    }

    .contact-info {
      flex: 1;

      .contact-label {
        display: block;
        font-size: 24rpx;
        color: $text-secondary;
      }

      .contact-value {
        display: block;
        font-size: 28rpx;
        color: $text-color;
        margin-top: 4rpx;
      }
    }

    .contact-arrow {
      font-size: 32rpx;
      color: $text-placeholder;
    }
  }
}

.follow-grid {
  display: flex;
  justify-content: space-around;

  .follow-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .follow-icon {
      width: 80rpx;
      height: 80rpx;
    }

    .follow-name {
      font-size: 24rpx;
      color: $text-secondary;
      margin-top: 12rpx;
    }
  }
}

.copyright {
  text-align: center;
  padding: 40rpx;
  color: $text-placeholder;
  font-size: 24rpx;

  text {
    display: block;

    &:first-child {
      margin-bottom: 8rpx;
    }
  }
}
</style>
