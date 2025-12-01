import { defineStore } from 'pinia';
import { ref } from 'vue';
import utils from '../common/utils.js';

export const useUserStore = defineStore('user', () => {
  // const openid = ref('xxxx');
  const userInfo = ref({ openid: 'xxxx', nickname: 'Chef', gender: 0, collections: []});
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

  // cate: 0-有啥吃啥, 1-营养专家, 2-玄学大师
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

  const removeFavDish = async ({dish={}, cate=0}={}) => {
    try {
      const res = await utils.reqData({
        url: '/api/user/removeCollections',
        method: 'POST',
        payload: {
          openid: userInfo.value.openid,
          dish,
          cate
        }
      })
      if (res.err === 0) {
        userInfo.value = res.data
      }
    } catch (error) {
      console.error('Error removing favorite dish:', error);
    }
  }

  return { userInfo, refreshUserInfo, addFavDish, removeFavDish, currentRecipe };
});