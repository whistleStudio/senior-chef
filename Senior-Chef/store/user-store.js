import { defineStore } from 'pinia';
import { ref } from 'vue';
import utils from '../common/utils.js';

export const useUserStore = defineStore('user', () => {
  // const openid = ref('xxxx');
  const userInfo = ref({ openid: 'test-code', nickname: 'Chef', gender: 0, collections: []});
  const currentRecipe = ref({})

  // 刷新数据
  const refreshUserInfo = async () => {
    try {
      const res = await utils.reqData({
        url: '/api/user/getProfile',
        method: 'POST',
        payload: {
          openid: userInfo.value.openid
        }
      });
      if (res.err === 0 && res.data) {
        userInfo.value.nickname = res.data.nickname;
        userInfo.value.gender = res.data.gender;
        userInfo.value.collections = res.data.collections || [];
        console.log('User info refreshed:', userInfo.value);
      }
    } catch (error) {
      console.error('Error refreshing user info:', error);
    }
  };

  // cate: 0-养生喵, 1-天才喵, 2-占卜喵
  const addFavDish = async ({dish={}, cate=0}={}) => {
    try {
      utils.reqData({
        url: '/api/user/addCollections',
        method: 'POST',
        payload: {
          openid: userInfo.value.openid,
          dish,
          cate
        }
      })
    } catch (error) {
      console.error('Error adding favorite dish:', error);
    }
  }

  const removeFavDish = async ({dish={}}={}) => {
    try {
      const res = await utils.reqData({
        url: '/api/user/removeCollections',
        method: 'POST',
        payload: {
          openid: userInfo.value.openid,
          dish
        }
      })
      console.log('Remove favorite dish response:', res);
      if (res.err === 0) {
        userInfo.value.collections = res.data.collections || [];
        console.log('Favorite dish removed. Updated collections:', userInfo.value.collections);
      }
    } catch (error) {
      console.error('Error removing favorite dish:', error);
    }
  }

  // 更改性别
  const updateGender = async () => {
    try {
      const res = await utils.reqData({
        url: '/api/user/updateGender',
        method: 'POST',
        payload: {
          openid: userInfo.value.openid,
          gender: userInfo.value.gender
        } 
      });
      if (res.err === 0) {
        userInfo.value.gender = res.gender;
        uni.setTabBarItem({
          index: 3,
          iconPath: `/static/tab-bar/chef-${(userInfo.value.gender+'') || 2}-bw.png`,
          selectedIconPath: `/static/tab-bar/chef-${(userInfo.value.gender+'') || 2}.png`
        });
      }
    } catch (error) {
      console.error('Error updating gender:', error);
    }
  }

  return { userInfo, refreshUserInfo, addFavDish, removeFavDish, currentRecipe, updateGender };
});