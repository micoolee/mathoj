const app = getApp()
Page({
  data: {
  ranklist:[]
  },
  showmore: function (e) {
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
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/problem/getrank',
      method:'POST',
      data:{'openid':app.globalData.openid},
      success: function (res) {
        var ranklist = res.data.rankdetail
        that.setData({
          ranklist: ranklist
        })
      },
      complete:function(){
        wx.hideNavigationBarLoading()
      }
    })
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },
})