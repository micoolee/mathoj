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
    var that = this
    that.globalData.screenwidth = wx.getSystemInfoSync().windowWidth  
    that.globalData.screenheight = wx.getSystemInfoSync().windowHeight
    wx.login({
      success: res => {
        wx.request({
          data: { js_code: res.code },
          url: this.globalData.baseurl + '/getopenid/',
          method: 'GET',
          success: function (res) {
            that.globalData.openid = res.data
          },
        })
      }
    })
  }
})





