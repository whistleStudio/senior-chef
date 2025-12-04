<template>
  <scroll-view class="container" scroll-y :show-scrollbar="false">
    <view class="profile-header flex-col-center">
      <image
        class="avatar"
        :src="avatarUrl"
        mode="aspectFill"
        @click="onClickAvatar"
      ></image>
      <text class="nickname">{{ userStore.userInfo.nickname || '游客' }}</text>
      <!-- <text class="subtext" v-if="userStore.userInfo.bio">{{ userStore.userInfo.bio }}</text> -->
    </view>

    <view class="profile-content">
      <view
        class="profile-item flex-row-space-between"
        v-for="(item, idx) in profileContentList"
        :key="idx"
        @click="onClickFav(idx)"
        :hover-class="'item-hover'"
      >
        <view class="item-left flex-row-center">
          <image class="item-icon" :src="item.icon" mode="widthFix" />
          <view class="item-meta">
            <text class="item-label">{{ item.label }}</text>
            <text class="item-desc" v-if="item.desc">{{ item.desc }}</text>
          </view>
        </view>
        <uni-icons type="right" color="#C6C6C6" size="26" />
        <button  class="contact-btn" v-if="idx === 1" open-type="contact">contact</button>
      </view>
    </view>

    <view class="bottom-area">
      <button class="logout-btn"  @click="onLogout" v-if="userStore.isLoggedIn">退出登录</button>
    </view>
  </scroll-view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../../store/user-store'
import { onShow } from '@dcloudio/uni-app'

const userStore = useUserStore()
// const avatarUrlList = [
//   '/static/tab-bar/chef-f.png',
//   '/static/tab-bar/chef-m.png',
// ]
// const curAvatarIdx = ref(0);
const avatarUrl = computed(() => {
  return `/static/tab-bar/chef-${(userStore.userInfo.gender+'') || 2}.png`;
});

// 可替换为项目静态资源路径
const profileContentList = ref([
  { icon: '/static/collect.png', label: '我的收藏', desc: '' },
  { icon: '/static/contact.png', label: '联系客服', desc: '工作日 9:00 - 18:00' },
  { icon: '/static/notes.png', label: '碎碎念念', desc: '' },
])

function onClickFav(idx) {
  // 根据序号跳转或弹窗（可根据需要替换为实际页面路径）
  switch (idx) {
    case 0:
      // 我的收藏
      uni.navigateTo({ url: '/pages/favorites/favorites' })
      break
    case 1:
      break
    case 2:
      // 碎碎念念（私密笔记 / 草稿）
      uni.navigateTo({ url: '/pages/notes/notes' })
      break
    default:
      uni.showToast({ title: '功能未实现', icon: 'none' })
  }
}

function onLogout() {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出当前账号吗？',
    success: (res) => {
      if (res.confirm) {
        // 调用 store logout（若实现），这里仅示例清除用户信息
        if (userStore.logout) {
          userStore.logout()
        } else {
          // 兜底清理（避免报错）
          userStore.userInfo = {}
        }
        uni.showToast({ title: '已退出', icon: 'success' })
      }
    },
  })
}

function onClickAvatar() {
  // 点击切换
  userStore.updateGender();
  // curAvatarIdx = (curAvatarIdx + 1) % avatarUrlList.length;
  // avatarUrl.value = avatarUrlList[curAvatarIdx];
  // uni.setTabBarItem({
  //   index: 3,
  //   iconPath: avatarUrlList[curAvatarIdx],
  // });
}

onShow(() => {
  console.log("profile page shown")
  userStore.refreshUserInfo(); // 获取最新用户信息
})
</script>

<style scoped lang="scss" src="./profile.scss"></style>
