//app.js
App({
  globalData: {
    userInfo: null,
    baseurl: 'http://www.liyuanye.club',
    openid: 'null',
    audiopath: null,
    audiopathbak:null,
    returnaudiopath:'',
    duration:100,
    avatar:null,
    nickname:null,
    screenwidth:0,
    screenheight:0,
  },

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this
    that.globalData.screenwidth = wx.getSystemInfoSync().windowWidth  
    that.globalData.screenheight = wx.getSystemInfoSync().windowHeight
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          //获取openid接口  
          data: { js_code: res.code },
          url: this.globalData.baseurl + '/getopenid/',
          method: 'GET',
          success: function (res) {
            that.globalData.openid = res.data
          },
          fail: function (e) {
            console.log(e)
          }
        })
      }
    })





  }

})





