<template>
	<scroll-view class="menu flex-col-center" scroll-y :show-scrollbar="false">
		<view class="menu-card" v-for="(dish, idx) in dishes" :key="dish.name">
			<view class="dish-name">{{ idx+1 }}. {{ dish.name }}</view>
			<view class="nutrition  flex-row-center">
				<view class="nutrition-item flex-row-center" v-for="(value, key, nidx) in dish.nutrition" :key="key">
					<view class="flex-col-center" style="align-items: flex-start;">
						<text class="nutrition-key">{{ nutriKMap[key] }} </text>
						<text class="nutrition-value">{{ value }}{{ nidx===0 ? "kcal" : "g" }}</text>
					</view>
					<view>
						<text class="nrv-text">{{ dish.nrv[key.split('_')[0]] }}%</text>
					</view>
				</view>
			</view>
			<view class="ingredient">
				<view v-for="ingred in dish.ingredients" :key="ingred.name" class="ingredient-item">
					<text class="ingredient-name">{{ ingred.name }}</text>
					<text class="ingredient-amt">{{ ingred.amount }}</text>
				</view>
			</view>
			<view class="step">
				<view  class="step-item flex-col-center" v-for="(step, sidx) in dish.steps" :key="sidx">
					<text class="step-title">步骤 {{ sidx + 1 }}: </text>
					<text class="step-desc">{{ step }}</text>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script setup>
import { useMenuStore } from '../../store/menu-store';


const menuStore = useMenuStore();
console.log(menuStore.menuData.value);
const {dishes} = menuStore.menuData.value;
const nutriKMap = {
  "energy_kcal": "能量",
  "protein_g": "蛋白质",
  "fat_g": "脂肪",
  "carbohydrate_g": "碳水"
};

</script>

<style lang="scss" src="./menu.scss"></style>
