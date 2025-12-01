<template>
	<scroll-view class="menu flex-col-center" scroll-y :show-scrollbar="false">
		<view class="menu-card" v-for="(recipe, idx) in recipes" :key="recipe.name + idx">
			<view class="recipe-name">
				<text>{{ idx+1 }}. {{ recipe.name }}</text>
				<uni-fav :checked="checkList[idx]" class="favBtn" @click="favClick(idx)" bgColorChecked="#F7C96F"/>
			</view>

			<!-- 营养信息：新格式为 recip.nutrients: { "能量": {amount, nrv}, ... } -->
			<view class="nutrition  flex-row-center" v-if="recipe.nutrients">
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
				<view v-for="(ingred, iidx) in recipe.ingredients" :key="ingred.name + ingred.amount + iidx" class="ingredient-item">
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
import { ref } from 'vue'
import { useMenuStore } from '../../store/menu-store'
import { useUserStore } from '../../store/user-store'

const menuStore = useMenuStore()
const userStore = useUserStore()

// 直接假设 menuStore.menuData.value 是传入的 data 对象，且包含 recipes 数组
const data = menuStore.menuData || {}
const recipes = data.recipes || []
console.log('菜单页菜品列表:', recipes);

// 简单版收藏状态（按你原来的形式）：固定长度数组初始化为 false
const checkList = ref(new Array(recipes.length).fill(false))

// 辅助：在模板中不能直接用 Object.entries 的结果解构为响应式的遍历，暴露一个小函数
function objectEntries(obj) {
  if (!obj) return []
  return Object.entries(obj)
}

// 收藏点击（按你原始的实现）
function favClick(idx) {
  checkList.value[idx] = !checkList.value[idx]
  if (checkList.value[idx]) {
    // 添加收藏（使用你 store 中约定的方法）
    userStore.addFavDish && userStore.addFavDish({ dish: recipes[idx] })
    console.log('添加收藏:', recipes[idx].name)
  } else {
    // 取消收藏
    userStore.removeFavDish && userStore.removeFavDish({ dish: recipes[idx] })
    console.log('取消收藏:', recipes[idx].name)
  }
}
</script>

<style lang="scss" src="./menu.scss"></style>