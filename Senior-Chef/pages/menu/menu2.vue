<template>
  <scroll-view class="menu flex-col-center" scroll-y :show-scrollbar="false">
    <view class="menu-card" v-for="(recipe, idx) in recipes" :key="recipe.name">
      <view class="dish-name">{{ idx + 1 }}. {{ recipe.name }}</view>

      <!-- 营养信息（JSON 中是 nutrients 对象，键名可能为中文） -->
      <view class="nutrition flex-row-center" v-if="recipe.nutrients">
        <view
          class="nutrition-item flex-row-center"
          v-for="([nutrName, nutri], nidx) in objectEntries(recipe.nutrients)"
          :key="nutrName"
        >
          <view class="flex-col-center" style="align-items: flex-start;">
            <text class="nutrition-key">{{ nutrName }}</text>
            <text class="nutrition-value">{{ nutri.amount }}</text>
          </view>
          <view>
            <text class="nrv-text">{{ nutri.nrv }}</text>
          </view>
        </view>
      </view>

      <!-- 配料 -->
      <view class="ingredient" v-if="recipe.ingredients && recipe.ingredients.length">
        <view
          v-for="ing in recipe.ingredients"
          :key="ing.name + ing.amount"
          class="ingredient-item"
        >
          <text class="ingredient-name">{{ ing.name }}</text>
          <text class="ingredient-amt">{{ ing.amount }}</text>
        </view>
      </view>

      <!-- 步骤 -->
      <view class="step" v-if="recipe.steps && recipe.steps.length">
        <view class="step-item flex-col-center" v-for="(step, sidx) in recipe.steps" :key="sidx">
          <text class="step-title">步骤 {{ sidx + 1 }}:</text>
          <text class="step-desc">{{ step }}</text>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import { ref } from 'vue'
import { useMenuStore } from '../../store/menu-store'

const menuStore = useMenuStore()

const recipes = ref(menuStore.menu2Data.value.recipes || [])

// 辅助：在模板中不能直接用 Object.entries 的结果解构为响应式的遍历，暴露一个小函数
function objectEntries(obj) {
  if (!obj) return []
  return Object.entries(obj)
}

// const { recipes } = toRefs(state)
</script>

<style lang="scss" src="./menu2.scss"></style>