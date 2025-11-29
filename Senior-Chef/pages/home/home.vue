<template>
	<view class="container">
		<view class="food-default" >
			<view class="food-seg">
				<uni-segmented-control :current="current" :values="items.map(item => item.label)" style-type="button" class="seg"
					:active-color="activeColor" @clickItem="onClickItem" :in-active-color="inActiveColor"/>
			</view>
			<scroll-view class="content" scroll-y :show-scrollbar="false">
				<view v-for="(item, index) in items" :key="index">
					<!-- <text class="content-text">选项卡{{ index + 1 }}的内容</text> -->
					<view v-if="current === index" class="content-box">
						<uni-tag v-for="cv in item.vals" :key="cv" :text="cv" class="food-tag" type="primary" :customStyle="customTagStyle"
							:solid="selectedDefaultFood.has(cv)"
						:inverted="!selectedDefaultFood.has(cv)" @click="onClickDefaultTag(cv)" />
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="food-custom">
			<scroll-view scroll-y class="content" :show-scrollbar="false" style="height: 250rpx;">
				<view class="content-box" style="justify-content: flex-start;">
					<uni-tag v-for="(cv, ci) in [...customFood, '+']" :key="cv" :text="cv" class="food-tag food-custom-tag" type="success" :customStyle="customTagStyle"
				  :inverted="!selectedCustomFood.has(cv)" @click="onClickCustomTag(cv, ci)" @longpress="onLongPressCustomTag(cv, ci)"/>
				</view>
			</scroll-view>
		</view>
		<view class="cook">
			<image style="height: 280rpx;" src="@/static/pot.png" mode="aspectFit"
			@click="onClickCook"/>
		</view>                                  
	</view>	
	<uni-popup ref="inputDialog" type="dialog">
		<uni-popup-dialog ref="inputClose"  mode="input" title="自定义食材" value="对话框预置提示内容!"
			placeholder="请输入内容（长按标签删除）" @confirm="dialogInputConfirm"></uni-popup-dialog>
	</uni-popup>
	<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0">底部弹出 Popup 自定义圆角</uni-popup>
</template>

<script setup>
import { ref, watch } from 'vue';
import global from '@/common/global.js';
import utils from '@/common/utils.js';
import { useMenuStore } from '@/store/menu-store.js';

const foodList = global.foodList;
const selectedDefaultFood = ref(new Set());
const customFood = ref(new Set());
const selectedCustomFood = ref(new Set());
const items = ref(foodList);
const current = ref(0);
const activeColor = ref(global.primaryColorDark);
const inActiveColor = ref(global.primaryColorLight);
const inputDialog = ref(null);
const popup = ref(null);
const menuStore = useMenuStore();

const customTagStyle = `
	display:flex;
	justify-content:center;
	align-items:center;
	text-align:center;
	white-space:nowrap;
	width:80rpx;
	line-height:50rpx;
	font-size:27rpx;
	font-weight:500;
	border-color: ${global.primaryColorLight};
`;


// 切换headbar seg
const onClickItem = (e) => {
	current.value = e.currentIndex;
	console.log('Current Index:', current.value);
};
// default tag点击
const onClickDefaultTag = tag => {
	if (selectedDefaultFood.value.has(tag)) {
		selectedDefaultFood.value.delete(tag);
	} else {
		selectedDefaultFood.value.add(tag);
	}
	console.log('Selected Indices:', Array.from(selectedDefaultFood.value));
}
// custom tag点击
const onClickCustomTag = (tag, index) => {
	if (index === customFood.value.size) {
		// 点击了最后一个+号，打开输入对话框
		inputDialog.value.open();
	} else {
		if (selectedCustomFood.value.has(tag)) {
			selectedCustomFood.value.delete(tag);
		} else {
			selectedCustomFood.value.add(tag);
		}
		console.log('Selected Custom Indices:', Array.from(selectedCustomFood.value));
	}
}
// 对话框输入确认
const dialogInputConfirm = (val) => {
	const inputValue = val.trim();
	if (inputValue) {
		customFood.value.add(inputValue);
		console.log('Now Custom Food:', customFood.value);
	}
};

// 长按custom tag删除
const onLongPressCustomTag = (tag, index) => {
	if (index === customFood.value.size) return; // +号不处理
	customFood.value.delete(tag);
	selectedCustomFood.value.delete(tag);
	if (tag.length > 4) {
		tag = tag.slice(0,3) + '..';
	}
	uni.showToast({
		title: `${tag}已丢弃`,
		icon: 'success',
		mask: true,
		duration: 2000
	});
}

// 点击烹饪按钮
const menuTestJson = import('@/static/menu.test.json'); // 测试节省付费接口请求次数用
const onClickCook = async () => {
	const allSelectedFood = [
		...Array.from(selectedDefaultFood.value),
		...Array.from(selectedCustomFood.value)
	];
	if (allSelectedFood.length < 2) {
		uni.showToast({
			title: '请至少选择两种食材',
			icon: 'none'
		});
		return;
	}
	console.log('Cooking with selected food...');
	uni.showLoading({
		title: '正在为您烹饪...'
	});
	try {
		// const res = await utils.reqData({
		// 	url: "/api/menu/cook",
		// 	method: "POST",
		// 	payload: {
		// 		food: allSelectedFood.join(',')
		// 	}
		// })
		uni.hideLoading();
		const res = await menuTestJson; // 测试用
		if (res && res.err === 0) {
			menuStore.menuData.value = res.data;
			uni.navigateTo({
				url: '/pages/menu/menu'
			});
		} else {
			uni.showToast({
				title: res.msg || '烹饪失败，请重试',
				icon: 'none'
			});
		}
		console.log('Cook Response:', res);
	} catch (error) {
		uni.hideLoading();
		uni.showToast({
			title: '烹饪失败，请重试',
			icon: 'none'
		});
		return;
	}

}

watch(selectedDefaultFood.value, (newVal) => {
	console.log('Updated Selected Indices:', newVal.size);
	// if (newVal.size > 0) {
	// 	popup.value.open();
	// } else {
	// 	popup.value.close();
	// }
});

</script>

<style lang="scss">
.container {
	padding: 0px 30rpx;
}

// .food-seg {
// 	width: 100%;
// 	margin-bottom: 20rpx;

// }
.content {
	// width: 700rpx;
	margin-top: 30rpx;
	height: 600rpx;
	.content-box {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		justify-content: space-between;
		align-items: center;
		.food-custom-tag {
			overflow: hidden;
			margin-right: 20rpx;
			&:nth-of-type(5n) {
				margin-right: 0 !important;
			}
		}
	}
}
.cook {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 20rpx;
}
</style>
