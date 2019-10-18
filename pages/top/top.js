const app = getApp()
var console = require('../../utils/console.js')
var network = require('../../utils/network.js')
Page({
  data: {
    ranklist: []
  },
  showmore: function (e) {
    var dataset = e.currentTarget.dataset
    if (openid == app.globalData.openid) {
      wx.switchTab({
        url: '../settings/settings',
      })
    } else {
      wx.navigateTo({
        url: `../settings/profile/profile?userid=${dataset.userid}&avatar=${dataset.avatar}&username=${dataset.username}&openid=${dataset.openid}`,
      })
    }
  },
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    var that = this
    network.post('/problem/getrank', {
      'openid': app.globalData.openid
    }, function (res) {
      that.setData({
        ranklist: res.rankdetail
      })
    }, function () { }, function () {
      wx.hideNavigationBarLoading()
    })
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },
})