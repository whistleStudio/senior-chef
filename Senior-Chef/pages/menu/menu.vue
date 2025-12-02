<template>
	<scroll-view class="menu flex-col-center" scroll-y :show-scrollbar="false">
		<view class="analysis-card" v-if="analysis">
      <text class="analysis-title">塔罗解读</text>
      <text class="analysis-text">{{ analysis }}</text>
    </view>
		<Recipe  v-for="(recipe, index) in recipes" :key="recipe.name" :recipe="recipe" :is-single="false" :recipe-idx="index + 1" :cate="cate"/>
	</scroll-view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMenuStore } from '../../store/menu-store'
import Recipe from '../../components/Recipe/Recipe.vue'
import { onLoad } from '@dcloudio/uni-app'

const menuStore = useMenuStore()
const data = menuStore.menuData || {}
const recipes = computed(() => data.recipes || [])
const analysis = computed(() => data.analysis || '');	
console.log('菜单页菜品列表:', recipes);
console.log('菜单页分析:', analysis);

const cate = ref(0);

onLoad((options) => {
	// 页面加载时的逻辑（如果有需要）
	cate.value = Number(options.cate) || 0;
});

// // 简单版收藏状态（按你原来的形式）：固定长度数组初始化为 false
// const checkList = ref(new Array(recipes.length).fill(false))

// // 辅助：在模板中不能直接用 Object.entries 的结果解构为响应式的遍历，暴露一个小函数
// function objectEntries(obj) {
//   if (!obj) return []
//   return Object.entries(obj)
// }

// // 收藏点击（按你原始的实现）
// function favClick(idx) {
//   checkList.value[idx] = !checkList.value[idx]
//   if (checkList.value[idx]) {
//     // 添加收藏（使用你 store 中约定的方法）
//     userStore.addFavDish && userStore.addFavDish({ dish: recipes[idx] })
//     console.log('添加收藏:', recipes[idx].name)
//   } else {
//     // 取消收藏
//     userStore.removeFavDish && userStore.removeFavDish({ dish: recipes[idx] })
//     console.log('取消收藏:', recipes[idx].name)
//   }
// }
</script>

<style lang="scss" >
$bg: #f9fbfb;
$card-gradient-start: #ffffff;
$card-gradient-end: #f7fbff;
$accent-pink: #ffe9f0;
$accent-mint: #e7fff6;
$accent-lavender: #f7f4fc;
$text-color: #2b2b2b;
$muted: #7b7b7b;
$shadow-color: rgba(43, 43, 43, 0.06);
// 通用容器
.menu {
  background: $bg;
  min-height: 100%;
  padding: 20rpx 5rpx 25rpx;
  box-sizing: border-box;
  align-items: stretch;
}

/* 分析摘要卡片（mystic 跳转用） */
.analysis-card {
  background: linear-gradient(180deg, $card-gradient-start 0%, $card-gradient-end 100%);
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 6rpx 20rpx $shadow-color;
	margin: 0 15rpx;
}

.analysis-title {
  font-size: 30rpx;
  color: $text-color;
  font-weight: 700;
  margin-bottom: 8rpx;
  margin-right: 30rpx;
}

.analysis-text {
  font-size: 24rpx;
  color: $muted;
  line-height: 34rpx;
}
</style>