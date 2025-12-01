<template>
  <scroll-view class="menu flex-col-center" scroll-y :show-scrollbar="false">
    <!-- 分析摘要（来自 menu3Data.analysis） -->
    <view class="analysis-card" v-if="analysis">
      <text class="analysis-title">塔罗解读</text>
      <text class="analysis-text">{{ analysis }}</text>
    </view>

    <view class="menu-card" v-for="(recipe, idx) in recipes" :key="recipe.name">
      <view class="dish-name">{{ idx + 1 }}. {{ recipe.name }}</view>

      <!-- 菜品功效说明（来自 effect 字段） -->
      <view class="effect" v-if="recipe.effect">
        <text class="effect-label">功效</text>
        <text class="effect-text">{{ recipe.effect }}</text>
      </view>

      <!-- 营养信息（兼容 nutrients 对象结构） -->
      <view class="nutrition flex-row-center" v-if="recipe.nutrients">
        <view
          class="nutrition-item flex-row-center"
          v-for="([nutrName, nutri], nidx) in objectEntries(recipe.nutrients)"
          :key="nutrName + nidx"
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

// 仅从 menu3Data 中读取
const raw = menuStore.menu3Data || {}

const analysis = ref(raw.analysis || '')
const recipes = ref(raw.recipes || [])

// 在模板中不能直接用 Object.entries 的结果解构为响应式的遍历，暴露一个小函数
function objectEntries(obj) {
  if (!obj) return []
  return Object.entries(obj)
}
</script>

<style lang="scss" src="./menu3.scss"></style>