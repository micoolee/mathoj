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
      wx.request({
          url: app.globalData.baseurl + '/user/pushformid',
          method: 'POST',
          data: { 'formid': e.detail.formId, 'openid': app.globalData.openid },
          success: function (res) {
          }
      })
    app.globalData.receiverid = e.currentTarget.dataset.askerid
    wx.navigateTo({
      url: `../../inform/message/chat/chat?receiverid=${e.currentTarget.dataset.askerid}&newsession=true&sessionid=${e.currentTarget.dataset.sessionid}`,
    })
  },

  onLoad: function (options) {

    this.setData({
      userInfo: { 'avatar': options.avatar, 'nickname': options.username, 'askerid': options.userid, 'profileropenid': options.openid}
    })
  },

  subscribe: function (e) {
      wx.request({
          url: app.globalData.baseurl + '/user/pushformid',
          method: 'POST',
          data: { 'formid': e.detail.formId, 'openid': app.globalData.openid },
          success: function (res) {
          }
      })
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
          if(res.data.subscribenum){
              that.setData({
                  subscribe_door:false
              })
          }
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