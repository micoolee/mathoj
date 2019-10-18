// pages/settings/profile/profile.js
const app = getApp()
var console = require('../../../utils/console.js')
var network = require('../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    ziji: false,
    subscribe_door: true,
    sessionid: 0
  },

  sendsixin: function (e) {
    network.post('/user/pushformid', {
      'formid': e.detail.formId,
      'openid': app.globalData.openid
    })
    app.globalData.receiverid = e.currentTarget.dataset.askerid
    wx.navigateTo({
      url: `../../inform/message/chat/chat?receiverid=${e.currentTarget.dataset.askerid}&newsession=true&sessionid=${e.currentTarget.dataset.sessionid}`,
    })
  },

  onLoad: function (options) {

    this.setData({
      userInfo: {
        'avatar': options.avatar,
        'nickname': options.username,
        'askerid': options.userid,
        'profileropenid': options.openid
      }
    })
  },

  subscribe: function (e) {
    network.post('/user/pushformid', {
      'formid': e.detail.formId,
      'openid': app.globalData.openid
    })
    var that = this
    if (e.currentTarget.dataset.id == true) {
      network.post('/user/subscribe', {
        'besubscriberid': e.currentTarget.dataset.askerid,
        'subscriberid': app.globalData.openid
      }, function (res) {
        wx.showToast({
          title: '关注成功',
        })
      })
      this.setData({
        subscribe_door: false
      })
    } else {
      network.post('/user/desubscribe', {
        'besubscriberid': e.currentTarget.dataset.askerid,
        'subscriberid': app.globalData.openid
      }, function () {
        wx.showToast({
          title: '已取消关注',
        })
      })
      this.setData({
        subscribe_door: true
      })
    }

  },
  onShow: function () {
    var that = this
    network.post('/message/getsessionid', {
      'receiveropenid': that.data.userInfo.profileropenid,
      'senderid': app.globalData.selfuserid
    }, function (res) {
      if (res.subscribenum) {
        that.setData({
          subscribe_door: false
        })
      }
      if (res.sessionid) {
        that.setData({
          sessionid: res.sessionid,
        })
      } else {
        that.setData({
          sessionid: 0,
        })
      }
    })
  }



})