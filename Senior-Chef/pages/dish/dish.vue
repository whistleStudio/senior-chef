<template>
	<view>
		<Recipe :recipe="currentRecipe" :cate="currentRecipe.cate"/>
	</view>
</template>

<script setup>
import Recipe from "@/components/Recipe/Recipe.vue"
import { useUserStore } from '@/store/user-store'

const { currentRecipe } = useUserStore()

uni.setNavigationBarTitle({
	title: '我的收藏'
});

</script>

<style>
	       
</style>
