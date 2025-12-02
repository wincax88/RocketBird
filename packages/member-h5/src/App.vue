<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

onLaunch(() => {
  console.log('App Launch');
});

onShow(() => {
  console.log('App Show');
});

onHide(() => {
  console.log('App Hide');
});
</script>

<style lang="scss">
/* 全局样式 */
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 清除默认样式 */
view,
text,
button,
input,
image {
  box-sizing: border-box;
}

button {
  margin: 0;
  padding: 0;
  background: none;
  border: none;
  line-height: inherit;
}

button::after {
  border: none;
}
</style>
