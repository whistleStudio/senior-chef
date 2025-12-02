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
          <view class="card-back" :style="genTarotCardStyle(idx)"></view>
        </view>
      </view>
    </view>
    <view class="next" v-if="isNextShow" @click="onClickNext">{{ `>>>` }}</view>
    <uni-icons class="reset" @click="onClickReset" type="reload" color="#ffffff88" size="35"/>
    <!-- 预览大图层 -->
    <view class="preview flex-col-center" v-if="previewVisible" @click="closePreview">
      <image class="preview-img" :src="previewSrc" mode="aspectFit" />
      <text class="preview-text">{{ tarotCards[previewIndex].val }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import global from '../../common/global';
import utils from '../../common/utils.js';
import { useMenuStore } from '../../store/menu-store';

const menuStore = useMenuStore();

const placeholderStyle = `color: #ffffff99;`;
const step = ref(1);
const question = ref('');
const isNextShow = computed(() => {
  if (step.value === 1) {
    return question.value.trim().length > 0;
  } else if (step.value === 2) {
    for (let v of tarotCards.value) {
      if (!v.flipped) return false;
    }
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
const tarotCardBaseUrl = global.tarotCardBaseUrl;
const genTarotCardStyle = (idx) => {
  return {
    backgroundImage: tarotCards.value[idx].val ? `url(${tarotCardBaseUrl}/${tarotCards.value[idx].val}.webp)` : '',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
};
// 预览状态
const previewVisible = ref(false);
const previewIndex = ref(null);
const previewSrc = computed(() => {
  if (previewIndex.value === null) return '';
  const val = tarotCards.value[previewIndex.value].val;
  return val ? `${tarotCardBaseUrl}/${val}.webp` : '';
});

// 点击卡牌：若未翻则翻牌；已翻则打开大图预览（如果有图片）
const onClickCard = (idx) => {
  const card = tarotCards.value[idx];
  if (!card.flipped) {
    card.flipped = true;
  } else {
    // 已经翻开，显示大图（如果 val 存在）
    if (card.val) {
      previewIndex.value = idx;
      previewVisible.value = true;
    }
  }
};

// 关闭预览
const closePreview = () => {
  previewVisible.value = false;
  previewIndex.value = null;
};


const menuTestJson = import('@/static/menu3.test.json');  // 测试用
// 下一步
const onClickNext = async () => {
  if (step.value === 1) {
    step.value = 2;
    getRandomTarotCards(); // 获取随机卡牌
  } else if (step.value === 2) {
    // 菜谱生成
    try {
      uni.showLoading({
        title: '正在为您占卜...'
      });
      // const res = await utils.reqData({
      //   url: '/api/menu/tarot-cook',
      //   method: 'POST',
      //   payload: {
      //     question: question.value,
      //     tarotCards: tarotCards.value.map(card => card.val)
      //   }
      // });
      uni.hideLoading();
      /* ---------测试开始----------- */
      const data = await menuTestJson;
      menuStore.menuData = data;
      uni.navigateTo({
        url: '/pages/menu/menu'
      });
      /* ---------测试结束----------- */
      // if (res && res.err === 0) {
      //   menuStore.menuData = res.data;
      //   uni.navigateTo({
      //      url: '/pages/menu/menu'  // 占位，后续改为菜谱详情页;
      //   });
      // } else {
      //   uni.showToast({
      //     title: '占卜失败，请重试',
      //     duration: 1000
      //   });
      // }
      // console.log('Mystic Cook Response:', res.data);
    } catch (err) {
      uni.hideLoading();
      uni.showToast({
        title: '占卜失败，请重试',
        duration: 1000
      });
      console.error('Show loading failed:', err);
    }
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