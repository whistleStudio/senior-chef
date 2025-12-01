const express = require('express');
const rt = express.Router();
const { APPID, APPSECRET } = require('../private-data.json');
const User = require('../db/model/User');

console.log('User API Config:', { APPID, APPSECRET });
/* 登录获取用户对应的唯一openid */
rt.post('/login', (req, res) => {
  const { code } = req.body;
  ;(async () => {
    const wxRes = await fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${APPSECRET}&js_code=${code}&grant_type=authorization_code`);
    const wxData = await wxRes.json();
    console.log('WeChat Login Response:', wxData);
    const { openid } = wxData;
    console.log('Extracted OpenID:', openid);
    const user = await User.findOneAndUpdate(
      { openid },
      { $setOnInsert: { openid, nickname: `chef_${openid.slice(0, 6)}` } },
      { new: true, upsert: true }
    );
    res.json({err:0, data: user});
  })().catch(error => {
    console.error('WeChat Login Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }) 
});

/* 获取"我的"信息 */
rt.post('/getProfile', (req, res) => {
  const { openid } = req.body;
  console.log('Get Profile Request for OpenID:', openid)
  ;(async () => {
    const user = await User.findOne({ openid });
    if (user) {
      res.json({ err: 0, data: user });
    } else {
      res.json({ err: 1, msg: 'User not found' });
    }
  })().catch(error => {
    res.json({ err: 1, msg: 'Internal Server Error' });
  });
});


/* 单个菜品添加收藏；cate: 0-有啥吃啥, 1-营养专家, 2-玄学大师 */
const maxCollectionsLength = 50; // 最大收藏数量限制
rt.post('/addCollections', (req, res) => {
  const { openid, dish, cate } = req.body;
  console.log('Add to Collections Request:', { openid, dish, cate });
  ;(async () => {
    const user = await User.findOne({ openid });
    if (!user) {
      res.json({ err: 1, msg: 'User not found' });
      return;
    }
    if (!user.collections.find(d => d.name === dish.name && d.cate === cate)) {
      dish.cate = cate; // 添加类别信息
      dish.dateAdded = formatToday(); // 添加收藏日期
      if (user.collections.length >= maxCollectionsLength) {
        // 超过最大收藏数量，移除最旧的收藏
        await User.updateOne(
          { openid },
          { $pop: { collections: 1 } } // 用 $pop 移除最旧的收藏
        );
      }
      await User.updateOne(
        { openid },
        { $push: { collections: { $each: [dish], $position: 0 } } } // 用 $push 添加
      );
      res.json({ err: 0 });
    } else res.json({ err: 0 }); // 已存在则不重复添加
  })().catch(error => {
    console.error('Add to Collections Error:', error);
    res.json({ err: 1, msg: 'Failed to add to collections' });
  });
})

/* 移除收藏 */
rt.post('/removeCollections', (req, res) => {
  const { openid, dish, cate } = req.body;
  ;(async () => {
    await User.updateOne(
      { openid },
      { $pull: { collections: { name: dish.name, cate } } }
    );
    res.json({ err: 0 });
  })().catch(error => {
    console.error('Remove from Collections Error:', error);
    res.json({ err: 1, msg: 'Failed to remove from collections' });
  });
})

// 格式化日期
function formatToday() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const dd = String(today.getDate()).padStart(2, '0');

  const formattedDate = `${yyyy}-${mm}-${dd}`;
  return formattedDate;
}

module.exports = rt;