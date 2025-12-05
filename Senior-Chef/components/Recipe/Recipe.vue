<template>
  <scroll-view class="menu flex-col-center" scroll-y :show-scrollbar="false">
    <view class="menu-card">
      <view class="recipe-name">
        <view class="title-row">
          <text class="title-text">{{ isSingle ? '' : recipeIdx + '. ' }}{{ recipe.name }}</text>
					<uni-icons v-if="recipe.steps.length > 0 && isSingle"
					type="trash" color="#fabcc3" size="28" @click="trashClick"
					/>
          <uni-fav v-if="recipe.steps.length > 0 && !isSingle"
            :checked="isFav" class="favBtn" @click="favClick" bgColorChecked="#F7C96F"
          />
        </view>
        <text class="recipe-desc" v-if="recipe.description">{{ recipe.description }}</text>
      </view>

      <!-- 菜品功效说明（来自 effect 字段） -->
      <view class="effect" v-if="recipe.effect">
        <text class="effect-label">功效</text>
        <text class="effect-text">{{ recipe.effect }}</text>
      </view>

      <!-- 营养信息 -->
      <view class="nutrition" v-if="recipe.nutrients" :style="{justifyContent : (cate===0 ? 'flex-start' : 'space-between' )}">
        <view
          class="nutrition-item flex-row-center"
          v-for="([nutrName, nutr], nidx) in objectEntries(recipe.nutrients)"
          :key="nutrName + nidx"
        >
          <view class="flex-col-center" style="align-items: flex-start;">
            <text class="nutrition-key">{{ nutrName }}</text>
            <text class="nutrition-value">{{ nutr.amount }}</text>
          </view>
          <view>
            <text class="nrv-text">{{ nutr.nrv }}</text>
          </view>
        </view>
      </view>

      <!-- 配料 -->
      <view class="ingredient" v-if="recipe.ingredients && recipe.ingredients.length">
        <view
          v-for="(ingred, iidx) in recipe.ingredients"
          :key="ingred.name + ingred.amount + iidx"
          class="ingredient-item"
        >
          <text class="ingredient-name">{{ ingred.name }}</text>
          <text class="ingredient-amt">{{ ingred.amount }}</text>
        </view>
      </view>

      <!-- 步骤 -->
      <view class="step" v-if="recipe.steps && recipe.steps.length">
        <view class="step-item flex-col-center" v-for="(step, sidx) in recipe.steps" :key="sidx">
          <text class="step-title">步骤 {{ sidx + 1 }}: </text>
          <text class="step-desc">{{ step }}</text>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import { ref, defineProps, toRefs } from 'vue'
import { useUserStore } from '../../store/user-store'

const props = defineProps({
	recipe: { type: Object, required: true },
	isSingle: { type: Boolean, default: true },
  recipeIdx: { type: Number, default: 1 },
  cate: { type: Number, default: 0 }, 
})
const { recipe, isSingle, recipeIdx, cate } = toRefs(props)
console.log("cate val:", cate.value);

const userStore = useUserStore()

// 辅助：在模板中不能直接用 Object.entries 的结果解构为响应式的遍历，暴露一个小函数
function objectEntries(obj) {
  if (!obj) return []
  return Object.entries(obj)
}

// 收藏
const isFav = ref(false)

function favClick() {
  if (!recipe.value || !recipe.value.name) return
  isFav.value = !isFav.value
  if (isFav.value) {
    userStore.addFavDish && userStore.addFavDish({ dish: recipe.value, cate: cate.value })
    console.log('添加收藏:', recipe.value.name)
  } else {
    userStore.removeFavDish && userStore.removeFavDish({ dish: recipe.value })
    console.log('取消收藏:', recipe.value.name)
  }
}

// 删除
function trashClick() {
	if (!recipe.value || !recipe.value.name) return
	uni.showModal({
		title: '删除菜谱',
		content: `确定要将「${recipe.value.name}」移出收藏吗？`,
		cancelText: '取消',
		confirmText: '删除',
		confirmColor: '#ff4d4f',
		success(res) {
			if (res.confirm) {
				// deleteRecipe()
				userStore.removeFavDish && userStore.removeFavDish({ dish: recipe.value })
				uni.navigateBack() // 返回上级页面
			}
		}
	})
}

/* --------------------------------------------- */
// onLoad((options) => {
//   console.log('Recipe 组件加载，菜品:', options.cate, typeof options.cate)
//   cate.value = Number(options.cate) || 0;
// });

</script>

<style scoped lang="scss">
$bg: #f9fbfb;
$card-gradient-start: #ffffff;
$card-gradient-end: #f7fbff;
$accent-pink: #ffe9f0;
$accent-mint: #e7fff6;
$accent-lavender: #f7f4fc;
$text-color: #2b2b2b;
$muted: #7b7b7b;
$shadow-color: rgba(43, 43, 43, 0.06);

.menu {
  background: $bg;
  min-height: 100%;
  padding: 50rpx 0rpx 25rpx;
  box-sizing: border-box;
  align-items: stretch;
}

/* 卡片 */
.menu-card {
  background: linear-gradient(180deg, $card-gradient-start 0%, $card-gradient-end 100%);
  border-radius: 28rpx;
  padding: 20rpx;
  margin: 24rpx 0;
  box-shadow: 0 8rpx 30rpx $shadow-color;
}

/* 标题行 */
.recipe-name {
  margin-bottom: 18rpx;
}

.title-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.title-text {
  font-size: 40rpx;
  color: $text-color;
  font-weight: 700;
}

.favBtn {
  margin-left: 14rpx;
}

/* 描述 */
.recipe-desc {
  font-size: 24rpx;
  color: $muted;
  margin-top: 8rpx;
}

/* 营养信息 */
.nutrition {
  width: 100%;
  gap: 12rpx;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}



.nutrition-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f8f8;
  border-radius: 14rpx;
  padding: 10rpx;
  box-sizing: border-box;
  &:not(:last-of-type) {
    margin-right: 8rpx;
  }
}

.nutrition-key {
  font-size: 20rpx;
  color: $muted;
}

.nutrition-value {
  font-size: 24rpx;
  font-weight: 700;
  color: $text-color;
}

.nrv-text {
  margin-left: 12rpx;
  font-size: 28rpx;
  color: $muted;
}

/* 配料 */
.ingredient {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 14rpx;
}

.ingredient-item {
  background: linear-gradient(90deg, $accent-mint 0%, $accent-pink 100%);
  border-radius: 12rpx;
  padding: 12rpx;
  width: calc(50% - 6rpx);
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 64rpx;
}

.ingredient-name {
  font-size: 24rpx;
  color: $text-color;
  font-weight: 600;
}

.ingredient-amt {
  font-size: 22rpx;
  color: $muted;
}

/* 步骤块 */
.step {
  width: 100%;
  margin-top: 8rpx;
}

.step-item {
  background: $accent-lavender;
  border-radius: 12rpx;
  padding: 12rpx;
  margin-bottom: 10rpx;
  align-items: flex-start !important;
  text-align: left;
}

.step-title {
  font-size: 22rpx;
  color: $muted;
  margin-bottom: 6rpx;
  font-weight: 600;
}

.step-desc {
  font-size: 24rpx;
  color: $text-color;
  line-height: 34rpx;
}

/* 功效说明 */
.effect {
  background: #f6fbff;
  border-radius: 12rpx;
  padding: 12rpx;
  margin-bottom: 12rpx;
}

.effect-label {
  font-size: 22rpx;
  color: $muted;
  font-weight: 600;
  margin-bottom: 6rpx;
  margin-right: 20rpx;
}

.effect-text {
  font-size: 24rpx;
  color: $text-color;
  line-height: 34rpx;
}

/* 布局辅助类 */
.flex-col-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 小屏适配 */
@media (max-width: 360px) {
  .menu-card { padding: 20rpx; margin: 18rpx; }
  .title-text { font-size: 34rpx; }
  .recipe-desc { font-size: 20rpx; }
}
</style>