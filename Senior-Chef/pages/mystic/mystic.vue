<template>
  <view class="mystic flex-col-center">
    <view class="title">占卜食疗，来制作一道魔法料理吧</view>
    <view class="step step-1 flex-col-center" v-if="step===1">
      <view class="step-title">Step 1</view>
      <input class="question" :placeholder-style="placeholderStyle" v-model="question" focus placeholder="请输入你想问的问题" :maxlength="30"/>
    </view>
    <view class="step step-2 flex-col-center" v-if="step===2">
      <view class="step-title">Step 2</view>
      <view class="step-desc">默念你的问题，翻开下方三张卡牌</view>
      <view class="flex-row-center tarot">
        <view class="flex-col-center tarot-card" :class="{ flipped: card.flipped }" v-for="(card, idx) in tarotCards" :key="idx"
        @click="onClickCard(idx)">
          <view class="card-front">{{ card.label }}</view>
          <view class="card-back" :style="genTarotCardStyle()">🃏</view>
        </view>
      </view>
    </view>
    <view class="next" v-if="isNextShow" @click="onClickNext">{{ `>>>` }}</view>
    <uni-icons class="reset" @click="onClickReset" type="reload" color="#ffffff88" size="35"/>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import global from '../../common/global';

const placeholderStyle = `color: #ffffff99;`;
const step = ref(1);
const question = ref('');
const isNextShow = computed(() => {
  if (step.value === 1) {
    return question.value.trim().length > 0;
  } else if (step.value === 2) {
    return true;
  }
  return false;
});
const tarotCards = ref([
  {label: "过去", val: "", flipped: false},
  {label: "现在", val: "", flipped: false},
  {label: "未来", val: "", flipped: false},
]);
const tarotList = global.tarotList;
const genTarotCardStyle = () => {
  return {
    backgroundColor: 'red'
  };
};
// 翻牌
const onClickCard = (idx) => {
  tarotCards.value[idx].flipped = true;
};
// 下一步
const onClickNext = () => {
  if (step.value === 1) {
    step.value = 2;
    getRandomTarotCards();
  } else if (step.value === 2) {

  }
};
// 重置
const onClickReset = () => {
  step.value = 1;
  question.value = '';
  tarotCards.value.forEach(card => {
    card.flipped = false;
  });
  // 重新请求卡牌，考虑增加些loading, 以减少调用频率
};

/* --------------------------- */
// 随机获取三张塔罗牌
function getRandomTarotCards() {
  const selectedCards = new Set();
  while (selectedCards.size < 3) {
    const randIdx = Math.floor(Math.random() * tarotList.length);
    selectedCards.add(tarotList[randIdx]);
  }
  const cards = Array.from(selectedCards);
  console.log('Selected Tarot Cards:', cards);
  tarotCards.value.forEach((card, idx) => {
    card.val = cards[idx];
  });
};

/* ---------------------------- */
// onMounted(() => {
//   console.log('Mystic mounted');
//   const cards = getRandomTarotCards();
//   tarotCards.value.forEach((card, idx) => {
//     card.val = cards[idx];
//   });
// });
</script>

<style src="./mystic.scss" scoped lang="scss"></style>