// pages/settings/profile/profile.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    ziji: false,
    profileropenid: null,
    subscribe_door: true,
    sessionid:0
  },

  sendsixin: function (e) {
    console.log(e.currentTarget.dataset.askerid)
    app.globalData.receiverid = e.currentTarget.dataset.askerid
    wx.navigateTo({
      url: `../../inform/message/chat/chat?receiverid=${e.currentTarget.dataset.askerid}&newsession=true&sessionid=${e.currentTarget.dataset.sessionid}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      userInfo: { 'avatar': options.avatar, 'nickname': options.username, 'askerid': options.userid, 'profileropenid': options.openid}
    })
  },

  subscribe: function (e) {
    var that = this
    if (e.currentTarget.dataset.id == true) {
      wx.request({
        url: app.globalData.baseurl + '/user/subscribe',
        method:'POST',
        data: { 'besubscriberid': e.currentTarget.dataset.askerid, 'subscriberid': app.globalData.openid },
        success: function (res) {
          wx.showToast({
            title: '关注成功',
          })
        }
      })
      this.setData({
        subscribe_door: false
      })
    } else {
      wx.request({
        url: app.globalData.baseurl + '/user/desubscribe',
        method: 'POST',
        data: { 'besubscriberid': e.currentTarget.dataset.askerid, 'subscriberid': app.globalData.openid },
        success: function () {
          wx.showToast({
            title: '已取消关注',
          })
          that.setData({
            subscribe_door: true
          })
          // that.onShow()
        }
      })
      this.setData({
        subscribe_door: true
      })
    }

  },
  onShow:function(){
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/message/getsessionid',
      method: 'POST',
      data: { 'receiveropenid': that.data.userInfo.profileropenid, 'senderid': app.globalData.selfuserid },
      success: function (res) {
        if (res.data.sessionid) {
          that.setData({
            sessionid: res.data.sessionid,
          })
        } else {
          that.setData({
            sessionid: 0,
          })
        }

      }
    })
  }



})