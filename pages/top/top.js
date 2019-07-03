const app = getApp()
var console = require('../../utils/console.js')
var network = require('../../utils/network.js')
Page({
  data: {
    ranklist: []
  },
  showmore: function(e) {
    var userid = e.currentTarget.dataset.userid
    var avatar = e.currentTarget.dataset.avatar
    var username = e.currentTarget.dataset.username
    var openid = e.currentTarget.dataset.openid

    if (openid == app.globalData.openid) {
      wx.switchTab({
        url: '../settings/settings',
      })
    } else {
      wx.navigateTo({
        url: `../settings/profile/profile?userid=${userid}&avatar=${avatar}&username=${username}&openid=${openid}`,
      })
    }
  },
  onLoad: function(options) {
    wx.showNavigationBarLoading()
    var that = this
    network.post('/problem/getrank', {
      'openid': app.globalData.openid
    }, function(res) {
      var ranklist = res.rankdetail
      that.setData({
        ranklist: ranklist
      })
    }, function() {}, function() {
      wx.hideNavigationBarLoading()
    })
  },
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },
})