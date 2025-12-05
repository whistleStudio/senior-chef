<template>
  <view class="mystic flex-col-center">
    <view class="title">占卜食疗，来制作一道魔法料理吧</view>
    <view class="step step-1 flex-col-center" v-if="step===1">
      <view class="step-title">Step 1</view>
      <input class="question" :placeholder-style="placeholderStyle" v-model.trim="question" focus placeholder="请输入你想问的问题" :maxlength="30"/>
    </view>
    <view class="step step-2 flex-col-center" v-if="step>=2">
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

    <view class="cook flex-col-center" @click="onClickNext" style="position: relative;" >
			<image style="height: 300rpx;width: 420rpx;" src="@/static/cartoon/cartoon2.png" mode="aspectFit"/>
      <image style="height: 60rpx; position: absolute; transform: translate(-50%) ; left: 51.5%; top: 34%;"
				:src="cartoonFaceSrc"
				mode="aspectFit"
			/>
			<image style="height: 45rpx; position: absolute; transform-origin: center; transform: translate(-50%); left: 75.6%; bottom: 14.3%; opacity: 0;"
				:class="{dec1: step>=1 && question, dec2: step===2 && tarotCards.some(card => card.flipped), dec3: step===3 }"
				src="@/static/cartoon/cartoon2-dec0.png"
				mode="aspectFit"
			/>
		</view>
    <uni-icons class="reset" @click="resetMysticPage" type="reload" color="#593d6455" size="35"/>
    <!-- 预览大图层 -->
    <view class="preview flex-col-center" v-if="previewVisible" @click="closePreview">
      <image class="preview-img" :src="previewSrc" mode="aspectFit" />
      <text class="preview-text">{{ tarotCards[previewIndex].val }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import global from '../../common/global';
import utils from '../../common/utils.js';
import { useMenuStore } from '../../store/menu-store';
import { useUserStore } from '../../store/user-store';
import { onShow } from '@dcloudio/uni-app';

const menuStore = useMenuStore();
const userStore = useUserStore();

const cartoonFaceSrc = ref('/static/cartoon/cartoon2-face0.png');
const tim = ref(null);
let oldFlippedCount = 0;
// const decOpacity = ref(0);

const placeholderStyle = `color: #2b2b2b55;line-height: 50rpx;`;
const step = ref(1);
const question = ref('');
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


// const menuTestJson = import('@/static/menu3.test.json');  // 测试用
// 下一步
const onClickNext = async () => {
  clearInterval(tim.value);
  const que = question.value.trim();
  if (que && que.length < 30) {
    if (step.value === 1) {
      step.value = 2;
      cartoonFaceSrc.value = '/static/cartoon/cartoon2-face0.png';
      getRandomTarotCards(); // 获取随机卡牌
    } else if (step.value === 2) {
      if (countFlippedCards() < 3) {
        uni.showToast({
          title: '请翻开所有卡牌',
          icon: 'none',
          duration: 1000
        });
        return;
      }
      step.value = 3;
      tim.value = setInterval(() => {
        cartoonFaceSrc.value = cartoonFaceSrc.value === '/static/cartoon/cartoon2-face0.png' ?
        '/static/cartoon/cartoon2-face1.png' : '/static/cartoon/cartoon2-face0.png';
      }, 500);
      // 菜谱生成
      try {
        uni.showLoading({
          title: '正在为您占卜...'
        });
        const res = await utils.reqData({
          url: '/api/menu/tarot-cook',
          method: 'POST',
          payload: {
            openid: userStore.userInfo.openid,
            question: que,
            tarotCards: tarotCards.value.map(card => card.val)
          }
        });
        // await utils.wait(3); // 测试等待时间
        clearInterval(tim.value);
        tim.value = null;
        uni.hideLoading();

        /* ---------测试开始----------- */
        // const data = await menuTestJson;
        // menuStore.menuData = data;
        // uni.navigateTo({
        //   url: '/pages/menu/menu?cate=2'
        // });
        /* ---------测试结束----------- */

        if (res && res.err === 0) {
          menuStore.menuData = res.data;
          uni.navigateTo({
             url: '/pages/menu/menu?cate=2'  // 占位，后续改为菜谱详情页;
          });
        } else {
          uni.showToast({
            title: res?.err===3 ? '今日占卜次数已用完' : '占卜失败，请重试',
            duration: 1000
          });
        }
        console.log('Mystic Cook Response:', res.data);
      } catch (err) {
        step.value = 2;
        clearInterval(tim.value);
        tim.value = null;
        uni.hideLoading();
        uni.showToast({
          title: '占卜失败，请重试',
          duration: 1000
        });
        console.error('Show loading failed:', err);
      }
    }
  } else {
    cartoonFaceSrc.value = '/static/cartoon/cartoon2-face1.png';
    uni.showToast({
      title:  que ? '糟糕, 你的问题太长了' : '我还不知道你的问题呢',
      icon: 'none',
      duration: 1000
    });
    tim.value = setTimeout(() => {
      cartoonFaceSrc.value = '/static/cartoon/cartoon2-face0.png';
    }, 1000);
    if (que) question.value = "";
  }
};

/* --------------------------- */
// 重置
function resetMysticPage() {
  step.value = 1;
  question.value = '';
  tarotCards.value.forEach(card => {
    card.flipped = false;
  });
  oldFlippedCount = 0;
  cartoonFaceSrc.value = '/static/cartoon/cartoon2-face0.png';
}

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
// 动画
watch(question, (newV, oldV) => {
  if (step.value === 1 && !oldV.trim() && newV.trim()) {
    clearTimeout(tim.value);
    cartoonFaceSrc.value = cartoonFaceSrc.value = '/static/cartoon/cartoon2-face1.png'
    tim.value = setTimeout(() => {
      cartoonFaceSrc.value = cartoonFaceSrc.value = '/static/cartoon/cartoon2-face0.png';
    }, 2000);
  }
})


watch(
  tarotCards, 
  _ => {
    const newFlippedCount = countFlippedCards();
    // console.log('Flipped Cards Count:', newFlippedCount);
    // console.log('Previous Flipped Cards Count:', oldFlippedCount);
    if (step.value === 2 && newFlippedCount > oldFlippedCount) {
      clearTimeout(tim.value);
      cartoonFaceSrc.value = cartoonFaceSrc.value = '/static/cartoon/cartoon2-face1.png'
      tim.value = setTimeout(() => {
        cartoonFaceSrc.value = cartoonFaceSrc.value = '/static/cartoon/cartoon2-face0.png';
      }, 1000);
    }
    oldFlippedCount = newFlippedCount;
  },
  { deep: true }
)
function countFlippedCards() {
  return tarotCards.value.filter(card => card.flipped).length;
}

/* ------------------------------ */
onShow(() => {
  // console.log('Mystic Page Shown');
  resetMysticPage();
});
</script>

<style src="./mystic.scss" scoped lang="scss"></style>
