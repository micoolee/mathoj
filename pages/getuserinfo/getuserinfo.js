var network = require('../../utils/network.js')
//var console = require('../../utils/console.js')
const app = getApp()
Page({

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showwarning: false
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.authorized = 'true'
      app.globalData.nickname = e.detail.userInfo.nickName
      // app.globalData.avatar = e.detail.userInfo.avatarUrl
      network.post('/user/uploadavatar', {
        'openid': app.globalData.openid,
        'username': app.globalData.nickname,
        'avatar': e.detail.userInfo.avatarUrl
      }, function (res) {
        if (!res.resultCode) {
          app.globalData.avatar = res.avatar
        }
        // console.log('uploadavatar from getuserinfo')
      })
      app.globalData.fromgetuserinfo = true;
      wx.navigateBack({})
    }
  },

  onLoad: function (options) {
    if (options.status == '1') {
      this.setData({
        showwarning: true
      })
    }
  },
})