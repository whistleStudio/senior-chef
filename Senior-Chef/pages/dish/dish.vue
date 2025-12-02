<template>
	<view>
		<Recipe :recipe="currentRecipe" />
	</view>
</template>

<script setup>
import Recipe from "@/components/Recipe/Recipe.vue"
import { useUserStore } from '@/store/user-store'

const { currentRecipe } = useUserStore()


</script>

<style>
	       
</style>
