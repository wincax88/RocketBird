<template>
  <view class="login-page">
    <view class="logo-section">
      <image class="logo" src="/static/logo.png" mode="aspectFit" />
      <text class="title">RocketBird 会员</text>
      <text class="subtitle">开启您的健康生活</text>
    </view>

    <view class="login-form">
      <!-- 微信一键登录 -->
      <button class="wechat-btn" open-type="getPhoneNumber" @getphonenumber="handleWechatLogin">
        <view class="icon wechat"></view>
        <text>微信一键登录</text>
      </button>

      <!-- 或者分割线 -->
      <view class="divider">
        <view class="line"></view>
        <text>或</text>
        <view class="line"></view>
      </view>

      <!-- 手机号登录 -->
      <view class="phone-login">
        <view class="input-group">
          <input v-model="phone" type="number" maxlength="11" placeholder="请输入手机号" />
        </view>
        <view class="input-group code-input">
          <input v-model="code" type="number" maxlength="6" placeholder="请输入验证码" />
          <button class="code-btn" :disabled="countdown > 0" @click="sendCode">
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </button>
        </view>

        <view class="invite-code" v-if="showInviteCode">
          <input v-model="inviteCode" placeholder="邀请码（选填）" />
        </view>

        <button class="submit-btn" :disabled="!canSubmit" @click="handlePhoneLogin">登录</button>
      </view>
    </view>

    <!-- 协议 -->
    <view class="agreement">
      <checkbox-group @change="handleAgreementChange">
        <label class="agreement-label">
          <checkbox :checked="agreed" />
          <text>我已阅读并同意</text>
          <text class="link" @click.stop="openAgreement('user')">《用户协议》</text>
          <text>和</text>
          <text class="link" @click.stop="openAgreement('privacy')">《隐私政策》</text>
        </label>
      </checkbox-group>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores';
import { authApi } from '@/api';
import { showError, showSuccess } from '@/utils';

const userStore = useUserStore();

const phone = ref('');
const code = ref('');
const inviteCode = ref('');
const showInviteCode = ref(false);
const countdown = ref(0);
const agreed = ref(false);

const canSubmit = computed(() => {
  return phone.value.length === 11 && code.value.length === 6 && agreed.value;
});

let timer: NodeJS.Timeout | null = null;

const handleWechatLogin = async (e: any) => {
  if (!agreed.value) {
    showError('请先同意用户协议');
    return;
  }

  if (e.detail.errMsg !== 'getPhoneNumber:ok') {
    return;
  }

  try {
    // 获取微信登录 code
    const loginRes = await new Promise<UniApp.LoginRes>((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: resolve,
        fail: reject,
      });
    });

    const res = await authApi.wechatLogin(loginRes.code);
    userStore.login(res);
    showSuccess('登录成功');

    // 返回上一页或首页
    const pages = getCurrentPages();
    if (pages.length > 1) {
      uni.navigateBack();
    } else {
      uni.reLaunch({ url: '/pages/home/index' });
    }
  } catch (error) {
    console.error('微信登录失败', error);
  }
};

const sendCode = async () => {
  if (!phone.value || phone.value.length !== 11) {
    showError('请输入正确的手机号');
    return;
  }

  try {
    await authApi.sendSms(phone.value);
    showSuccess('验证码已发送');

    countdown.value = 60;
    timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer!);
      }
    }, 1000);
  } catch (error) {
    console.error('发送验证码失败', error);
  }
};

const handlePhoneLogin = async () => {
  if (!agreed.value) {
    showError('请先同意用户协议');
    return;
  }

  try {
    const res = await authApi.smsLogin(phone.value, code.value, inviteCode.value || undefined);
    userStore.login(res);
    showSuccess('登录成功');

    const pages = getCurrentPages();
    if (pages.length > 1) {
      uni.navigateBack();
    } else {
      uni.reLaunch({ url: '/pages/home/index' });
    }
  } catch (error) {
    console.error('手机登录失败', error);
  }
};

const handleAgreementChange = (e: any) => {
  agreed.value = e.detail.value.length > 0;
};

const openAgreement = (type: 'user' | 'privacy') => {
  // TODO: 打开协议页面
};

onLoad((options) => {
  if (options?.inviteCode) {
    inviteCode.value = options.inviteCode;
    showInviteCode.value = true;
  }
});
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: #fff;
  padding: 0 48rpx;
}

.logo-section {
  padding-top: 120rpx;
  text-align: center;

  .logo {
    width: 160rpx;
    height: 160rpx;
  }

  .title {
    display: block;
    margin-top: 24rpx;
    font-size: 40rpx;
    font-weight: 600;
    color: $text-color;
  }

  .subtitle {
    display: block;
    margin-top: 12rpx;
    font-size: 28rpx;
    color: $text-secondary;
  }
}

.login-form {
  margin-top: 80rpx;

  .wechat-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 96rpx;
    background: #07C160;
    color: #fff;
    font-size: 32rpx;
    border-radius: $radius-full;

    .icon {
      width: 40rpx;
      height: 40rpx;
      margin-right: 12rpx;
      background: url('/static/icons/wechat.png') no-repeat center;
      background-size: contain;
    }
  }

  .divider {
    display: flex;
    align-items: center;
    margin: 48rpx 0;

    .line {
      flex: 1;
      height: 1rpx;
      background: $border-color;
    }

    text {
      padding: 0 24rpx;
      font-size: 26rpx;
      color: $text-placeholder;
    }
  }

  .phone-login {
    .input-group {
      display: flex;
      align-items: center;
      height: 96rpx;
      border-bottom: 1rpx solid $border-color;
      margin-bottom: 24rpx;

      input {
        flex: 1;
        height: 100%;
        font-size: 32rpx;
      }

      &.code-input {
        .code-btn {
          min-width: 180rpx;
          height: 64rpx;
          line-height: 64rpx;
          background: $primary-color;
          color: #fff;
          font-size: 26rpx;
          border-radius: $radius-md;

          &[disabled] {
            background: #ccc;
          }
        }
      }
    }

    .invite-code {
      margin-bottom: 24rpx;

      input {
        height: 96rpx;
        border-bottom: 1rpx solid $border-color;
        font-size: 32rpx;
      }
    }

    .submit-btn {
      width: 100%;
      height: 96rpx;
      margin-top: 48rpx;
      background: $primary-color;
      color: #fff;
      font-size: 32rpx;
      border-radius: $radius-full;

      &[disabled] {
        background: #ccc;
      }
    }
  }
}

.agreement {
  position: fixed;
  bottom: 60rpx;
  left: 48rpx;
  right: 48rpx;

  .agreement-label {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    color: $text-secondary;

    checkbox {
      transform: scale(0.7);
    }

    .link {
      color: $primary-color;
    }
  }
}
</style>
