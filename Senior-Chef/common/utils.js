export default {
  baseUrl: "http://localhost:8083",

  reqData({url, method="GET", payload={}}={}) {
    return new Promise((rsv, rej) => {
      uni.request({
        url: `${this.baseUrl}${url}`, // 基础路径 + 具体接口路径
        method,
        data: payload,
        success: res => rsv(res.data),
        fail: err => rej(err)
      });
    })
  },

  wait(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
  }
}
