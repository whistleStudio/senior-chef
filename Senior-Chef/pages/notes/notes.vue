<template>
	<view class="page">
		<view class="image-wrap flex-row-center">
			<image class="hero" src="@/static/cartoon/cartoon3.png" mode="aspectFit" />
		</view>

		<view class="content">
			<view class="flex-row-center" style="margin-bottom: 20rpx;">
				<text class="lead">你很有想法，跟我学做菜吧</text>
			</view>
			<view class="music" @click="onClickMusic">
				 <view class="poster">
					<view class="play-bg">
					  <view class="play-icon"></view>
					</view>
				 </view>
				 <view class="meta">
					<text class="title">我焦慮就會一直碎碎唸</text>
					<text class="signer">深白色二人组</text>
				 </view>
				 <uni-link class="music-link" copyTips="来点音乐吧，请在手机浏览器里粘贴该网址" ref="musicLinkRef"
					href="https://music.163.com/song?id=2008006018&uct2=U2FsdGVkX18jq0l8pFRzLfUQLdW4M0woF2Xi324ZAaw=" text="深白色二人组 - 我焦虑就会一直碎碎念"/>
			</view>
			<view class="body-text">
				<text class="p">嗐~ 做这应用的时候，大半年的欠薪总算快解决了。</text>
				<text class="p">这段时间在家也没太闲着，学点新东西，折腾了几个自娱自乐的小项目，然后就是每天做做饭，可以说是厨艺大涨了！土土也快来了（希望ta能喜欢这个略土的小名），不用担心吃不到家的味道啦，至少妈妈是给予大拇指肯定的。其实开发最初的想法也是妈妈提出来的，检查说是缺少点营养元素，想着能从健康的食材里或多或少补充些，便做了这个智能生成菜谱的小程序。</text>
				<text class="p">至于为什么是小喵，当然是因为家里有只小喵嘛，闲事科科长每次都会在我做饭的时候，在砧板边蜷成一团莅临指导。</text>
			</view>
		</view>

	</view>

</template>

<script setup>
import { ref } from 'vue';

const musicLinkRef = ref(null);

uni.setNavigationBarTitle({
	title: '碎碎唸唸'
});

// 占位事件，供交互使用
function onClickMusic() {
	// uni.showToast({ title: '播放/暂停（示例）', icon: 'none' });
	musicLinkRef.value.click();
}
</script>

<style scoped lang="scss">
/* 颜色变量（与全局主题保持一致） */
$text-color: #2b2b2b;
$muted: #7b7b7b;
$bg: #f9fbfb;
$card-gradient-start: #ffffff;
$card-gradient-end: #f7fbff;
$accent-pink: #ffe9f0;
$accent-mint: #e7fff6;
$shadow-color: rgba(43, 43, 43, 0.06);

/* 页面整体 */
.page {
  background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(247,251,255,0.9));
  min-height: 100vh;
  padding: 40rpx 28rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  align-items: stretch;
}

/* 图片区域 */
.image-wrap {
  padding-top: 10rpx;
  padding-bottom: 6rpx;
}

.hero {
  width: 100%;
  max-width: 520rpx;
  height: 400rpx;
  border-radius: 20rpx;
  // box-shadow: 0 12rpx 30rpx rgba(16, 16, 30, 0.06);
  // background: linear-gradient(135deg, $card-gradient-start, $card-gradient-end);
}

/* 文字引导 */
.lead {
  display: block;
  font-size: 34rpx;
  color: $text-color;
  font-weight: 700;
  margin-bottom: 6rpx;
}

/* 音乐卡片 */
.music {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 22rpx;
  background: linear-gradient(180deg, $card-gradient-start, $card-gradient-end);
  border-radius: 18rpx;
  box-shadow: 0 10rpx 30rpx $shadow-color;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  cursor: pointer;
	position: relative;
}

.music:active {
  transform: translateY(2rpx) scale(0.998);
}

/* 封面（poster） */
.poster {
  width: 160rpx;
  height: 160rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, lighten($accent-mint, 6%), $accent-mint);
  border-radius: 14rpx;
  box-shadow: 0 8rpx 20rpx rgba(11, 16, 32, 0.06);
  overflow: hidden;
}

/* 圆形播放背景，带光晕与脉冲动画 */
.play-bg {
  width: 94rpx;
  height: 94rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $accent-pink, $accent-mint);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.08), 0 0 20rpx rgba(231,255,246,0.45);
  transition: transform 0.18s ease;
}

.music:active .play-bg {
  transform: scale(0.98);
}

/* 播放三角形（白色） */
.play-icon {
  width: 0;
  height: 0;
  border-left: 20rpx solid #fff;
  border-top: 14rpx solid transparent;
  border-bottom: 14rpx solid transparent;
  transform: translateX(3rpx);
  filter: drop-shadow(0 2rpx 6rpx rgba(0,0,0,0.15));
}

/* 元信息 */
.meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8rpx;
}

.title {
  font-size: 30rpx;
  font-weight: 700;
  color: $text-color;
  line-height: 1.2;
}

.signer {
  font-size: 24rpx;
  color: $muted;
}
.music-link {
	position: absolute;
	opacity: 0;
	inset: 0;
}

/* 正文段落样式 */
.body-text {
  // background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(247,251,255,0.9));
  border-radius: 14rpx;
  padding: 22rpx;
  // box-shadow: 0 8rpx 30rpx rgba(16, 16, 40, 0.04);
}

.p {
  display: block;
  font-size: 26rpx;
  color: $text-color;
  line-height: 40rpx;
  margin-bottom: 14rpx;
  word-break: break-word;
  white-space: pre-wrap;
}

/* 布局辅助 */
.flex-row-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式：小屏微调 */
@media (max-width: 360px) {
  .hero { height: 320rpx; }
  .play-bg { width: 84rpx; height: 84rpx; }
  .poster { width: 140rpx; height: 140rpx; }
  .title { font-size: 28rpx; }
  .lead { font-size: 30rpx; }
  .p { font-size: 24rpx; line-height: 36rpx; }
}
</style>