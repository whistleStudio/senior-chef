<template>
  <view class="nutritionist">
    <view class="nutri-default">
      <view class="title flex-row-center">
        <!-- <image src="@/static/add.png" mode="aspectFit"/> -->
        <text>营养规划</text>
      </view>
      <scroll-view class="content flex-row-center" scroll-y :show-scrollbar="false">
        <NutriToggle class="nutri-toggle"
          v-for="(chname, k) in nutriMap"
          :key="k"
          :name="chname"
          v-model:state="nutriState[k]"
        />
      </scroll-view>
    </view>
    <view class="food-except">
      <view class="title flex-row-center">
        <!-- <image src="@/static/add.png" mode="aspectFit"/> -->
        <text>忌口</text>
      </view>
      <scroll-view class="content-2 flex-row-center" scroll-y :show-scrollbar="false">
        <uni-tag v-for="(food, idx) in [...foodExcept, '+']" :key="food"
          :text="food" size="normal" type="warning" :inverted="!selectedFoodExcept.has(food)"
          @click="onClickFoodExceptTag(food, idx)" @longpress="onLongPressFoodExceptTag(food, idx)"
        />
      </scroll-view>
    </view>
    <view class="cook flex-col-center" @click="onClickCook" style="position: relative;">
			<image style="height: 300rpx;width: 420rpx;" src="@/static/cartoon/cartoon1.png" mode="aspectFit"/>
      <image style="height: 50rpx; position: absolute; transform: translateX(-50%); left: 49%;"
				:src="cartoonFaceSrc"
				mode="aspectFit"
			/>
			<image style="height: 50rpx; position: absolute; transform: translateX(-50%); left: 35%; bottom: 120rpx; opacity: 0;"
				:class="tim ? 'dec' : ''"
				src="@/static/cartoon/cartoon1-dec0.png"
				mode="aspectFit"
			/>
      <image style="height: 130rpx; position: absolute; transform: translate(-50%); left: 24%; top: 4%;"
        src="@/static/cartoon/bubble.png"
        mode="aspectFit"
      />
		</view>
  </view>
  <uni-popup ref="inputDialog" type="dialog">
		<uni-popup-dialog ref="inputClose"  mode="input" title="我不想吃"
			placeholder="请输入内容（长按标签删除）" @confirm="dialogInputConfirm"></uni-popup-dialog>
	</uni-popup>
</template>

<script setup>
import { ref } from 'vue';
import NutriToggle from '@/components/NutriToggle/NutriToggle.vue';
import global from '@/common/global.js';
import utils from '@/common/utils.js';
import { useMenuStore } from '@/store/menu-store.js';

const menuStore = useMenuStore();

const nutriMap = global.nutriMap;
const nutriStateVal = {}
Object.keys(nutriMap).forEach(k => {
  nutriStateVal[k] = 0;
})
const nutriState = ref(nutriStateVal);
const foodExcept = ref(new Set(["香菜", "辣椒", "海鲜"]));
const selectedFoodExcept = ref(new Set());
const inputDialog = ref(null);
const cartoonFaceSrc = ref('/static/cartoon/cartoon1-face0.png');
const tim = ref(null);

/*-------- tag操作相关开始 ---------*/
const onClickFoodExceptTag = (food, idx) => {
  if (foodExcept.value.size === idx) {
    inputDialog.value.open();
    return;
  }
  if (selectedFoodExcept.value.has(food)) {
    selectedFoodExcept.value.delete(food);
  } else {
    selectedFoodExcept.value.add(food);
  }
}

const onLongPressFoodExceptTag = (food, idx) => {
  if (foodExcept.value.size === idx) {
    return;
  }
  foodExcept.value.delete(food);
  selectedFoodExcept.value.delete(food);
  console.log('Now foodExcept:', foodExcept.value);
};

const dialogInputConfirm = (val) => {
	const inputValue = val.trim();
	if (inputValue) {
		foodExcept.value.add(inputValue);
		console.log('Now foodExcept:', foodExcept.value);
	}
};
/*-------- tag操作相关结束 ---------*/

const menuTestJson = import('@/static/menu2.test.json');  // 测试用

const onClickCook = async () => {
  clearInterval(tim.value);
  const nutri_increase = [];
  const nutri_decrease = [];
  Object.keys(nutriState.value).forEach(k => {
    const state = nutriState.value[k];
    if (state === 1) {
      nutri_increase.push(nutriMap[k]);
    } else if (state === -1) {
      nutri_decrease.push(nutriMap[k]);
    }
  });
  if (nutri_increase.length + nutri_decrease.length === 0) {
		uni.showToast({
			title: '请至少更改一种营养需求',
			icon: 'none'
		});
		return;
	}
  console.log('营养增量:', nutri_increase);
  console.log('营养减量:', nutri_decrease);


  tim.value = setInterval(() => {
    cartoonFaceSrc.value = cartoonFaceSrc.value === '/static/cartoon/cartoon1-face0.png' ?
      '/static/cartoon/cartoon1-face1.png' : '/static/cartoon/cartoon1-face0.png';
  }, 500);
  uni.showLoading({
    title: '正在为您定制...'
  });
  // await utils.wait(3); // 测试等待时间
  try {
    const res = await utils.reqData({
      url: '/api/menu/nutritionist-cook',
      method: 'POST',
      payload: {
        nutri_increase: nutri_increase.join(','),
        nutri_decrease: nutri_decrease.join(','),
        food_avoid: Array.from(selectedFoodExcept.value).join(',')
      }
    });

    clearInterval(tim.value);
    tim.value = null;
    uni.hideLoading();


    if (res && res.err === 0) {
      menuStore.menuData = res.data;
      uni.navigateTo({
        url: '/pages/menu/menu?cate=0'
      });
    } else {
      uni.showToast({
        title: res.msg || '烹饪失败，请重试',
        icon: 'none',
        duration: 1000
      });
    }
    /* -----------测试用开始-------------- */
    // const res = await menuTestJson; 
    // menuStore.menuData = res;
		// uni.navigateTo({
		// 	url: '/pages/menu/menu?cate=0'
		// });
    /* -----------测试用结束-------------- */
    console.log('Cook API Response:', res);
  } catch (err) {
    clearInterval(tim.value);
    tim.value = null;
    uni.hideLoading();
		uni.showToast({
			title: '烹饪失败，请重试',
			icon: 'none'
		});
		return;
  }
}

</script>

<style scoped lang="scss">
.nutritionist {
  padding: 50rpx 30rpx 0;
}

.title {
  justify-content: flex-start;
  gap: 20rpx;
  margin-bottom: 20rpx;
  font-weight: bold;
  opacity: 0.6;
  >image {
    width: 50rpx;
    height: 50rpx;
  }
}

.nutri-default {
  margin-bottom: 50rpx;
  .content {
    height: 580rpx;
    flex-wrap: wrap;
  }
}
.food-except {
  .content-2 {
    padding: 5rpx 0;
    height: 160rpx;
    // background-color: red;
    flex-wrap: wrap;
    gap: 20rpx;
    uni-tag, .uni-tag {
      margin: 10rpx;
    }
  }
}

.dec {
  animation: identifier 1s infinite;
  @keyframes identifier {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }
}

</style>