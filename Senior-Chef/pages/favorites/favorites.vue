<template>
  <scroll-view class="fav-container" scroll-y :show-scrollbar="false">
    <view class="fav-list">
      <view
        class="fav-card flex-row-space-between"
        :class="getBgColorClass(dish.cate)"
        v-for="(dish, idx) in collections"
        :key="dish.name + idx"
        @click="onClickDish(dish)"
        :hover-class="'fav-hover'"
      >
        <view class="fav-left">
          <text class="dish-name" :title="dish.name">{{ dish.name }}</text>
          <text class="dish-desc" v-if="dish.desc">{{ dish.desc }}</text>
        </view>
        <view class="fav-right">
          <text class="date">{{ dish.dateAdded || '' }}</text>
          <uni-icons type="right" color="#C6C6C6" size="22" />
        </view>
      </view>

      <view class="empty-state" v-if="collections.length === 0">
        <text>您还没有收藏的菜谱～</text>
        <text class="empty-sub">去菜单挑几道喜欢的菜吧</text>
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../../store/user-store'

const userStore = useUserStore()

const collections = computed(() => {
  // 以防 userInfo 未初始化，保证返回数组
  return userStore.userInfo?.collections || []
})

function onClickDish(dish) {
  // 默认跳转到菜品详情页（如无详情页可改为其他行为）
  if (!dish || !dish.name) return
	userStore.currentRecipe = dish; // 设置当前菜品
  uni.navigateTo({
    url: `/pages/dish/dish`
  })
}

function getBgColorClass(cate) {
	switch (cate) {
		case 1:
			return 'fav-card-b'
		case 2:
			return 'fav-card-c'
		default:
			return 'fav-card-a'
	}
}

</script>

<style scoped lang="scss">
$fav-bg: #f9fbfb;
// $card-start: #ffffff;
// $card-end: #f7fbff;
$text-color: #2b2b2b;
$muted: #7b7b7b;
$shadow: rgba(43, 43, 43, 0.06);
$accent: #e7fff6;

/* 分类专用淡色渐变 */
$card-a-start: #e6f0ff; // 淡蓝
$card-a-end: #f7fbff;

$card-b-start: #ffe6f0; // 淡粉
$card-b-end: #fff7fb;

$card-c-start: #f0e6ff; // 淡紫
$card-c-end: #f7f0ff;

.fav-container {
  background: $fav-bg;
  min-height: 100%;
  padding: 40rpx 18rpx;
  box-sizing: border-box;
}

.fav-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

/* 收藏卡片样式 */
.fav-card {
  // background: linear-gradient(180deg, $card-start 0%, $card-end 100%);
  border-radius: 18rpx;
  padding: 20rpx;
  box-shadow: 0 8rpx 30rpx $shadow;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

/* 分类渐变 */
.fav-card-a {
  background: linear-gradient(180deg, $card-a-start 0%, $card-a-end 100%);
}

.fav-card-b {
  background: linear-gradient(180deg, $card-b-start 0%, $card-b-end 100%);
}

.fav-card-c {
  background: linear-gradient(180deg, $card-c-start 0%, $card-c-end 100%);
}

/* 左侧简介 */
.fav-left {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  max-width: 70%;
}

.dish-name {
  font-size: 30rpx;
  color: $text-color;
  font-weight: 700;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dish-desc {
  font-size: 22rpx;
  color: $muted;
}

/* 右侧时间和箭头 */
.fav-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.date {
  font-size: 20rpx;
  color: $muted;
}

/* 空状态 */
.empty-state {
  margin-top: 80rpx;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  color: $muted;
}

.empty-sub {
  font-size: 20rpx;
  color: lighten($muted, 10%);
}

/* hover / 点击效果（uni-app hover-class） */
.fav-hover {
  background: linear-gradient(90deg, rgba(231,255,246,0.6), rgba(255,233,240,0.6));
}

/* 布局辅助类（兼容项目其他页面） */
.flex-row-space-between {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

/* 小屏适配 */
@media (max-width: 360px) {
  .fav-card { padding: 18rpx; border-radius: 16rpx; }
  .dish-name { font-size: 28rpx; }
  .dish-desc { font-size: 20rpx; }
  .date { font-size: 18rpx; }
}
</style>