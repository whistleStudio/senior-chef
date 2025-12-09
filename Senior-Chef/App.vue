<script>
	import utils from './common/utils';
	import { useUserStore } from './store/user-store';

	let userStore;

	function wxLogin() {
		uni.login({
			provider: 'weixin',
			success: async function (loginRes) {
				console.log('wx login success:', loginRes);
				try {
					const res = await utils.reqData({
						url: '/api/user/login',
						method: 'POST',
						payload: {
							code: loginRes.code
						}
					});
					console.log('Login response:', res);
					if (res.err === 0 && res.data) {
						userStore.userInfo.openid = res.data.openid;
						userStore.userInfo.nickname = res.data.nickname;
						userStore.userInfo.gender = res.data.gender;
						userStore.userInfo.collections = res.data.collections || [];
						uni.setTabBarItem({
							index: 3,
							iconPath: `/static/tab-bar/chef-${(userStore.userInfo.gender+'') || 2}-bw.png`,
							selectedIconPath: `/static/tab-bar/chef-${(userStore.userInfo.gender+'') || 2}.png`
						})
					}
				} catch (e) {
					console.error('Login error:', e);
				}
				// 获取用户信息
				// uni.getUserInfo({
				// 	provider: 'weixin',
				// 	success: function (infoRes) {
				// 		console.log('getUserInfo success:', infoRes);
				// 		// 这里可以将 loginRes.code 和 infoRes.encryptedData 发送到后台进行登录验证
				// 	},
				// 	fail: function (infoErr) {
				// 		console.log('getUserInfo failed:', infoErr);
				// 	}
				// });
			},
			fail: function (loginErr) {
				uni.showToast({
					title: '微信登录失败',
					icon: 'error',
					mask: true
				})
				console.log('wx login failed:', loginErr);
			}
		});
	}


	export default {
		onLaunch: function() {
			console.log('App Launch')
			userStore = useUserStore();
			wxLogin();
			// #ifdef WEB
			utils.reqData({
				url: '/api/user/login',
				method: 'POST',
				payload: {
					code: 'test-code'
				}
			}).then(res => {
				console.log('App test login response:', res);
				userStore.userInfo.openid = res.data.openid;
				userStore.userInfo.nickname = res.data.nickname;
				userStore.userInfo.gender = res.data.gender;
				userStore.userInfo.collections = res.data.collections || [];
			})
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	// @import url('./uni.scss');
</style>
