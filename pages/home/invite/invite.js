// pages/invite/invite.js
const app = getApp()
var network = require('../../../utils/network.js')
//var console = require('../../../utils/console.js')
var config = require('../../../config.js')
var problemid = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitedsign: [false],
    // noone: false,
    // icon: '/images/empty.png',
    subscriberlist: undefined,
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '[有人@我]数学题，你会做么',
        path: '/pages/home/question/question?problemid=' + problemid,
        imageUrl: config.host + '/swagger/mobiwusi.jpg',
      }
    }
  },

  invite: function (e) {
    var that = this
    network.post('/problem/createinvite', {
      'inviterid': app.globalData.selfuserid,
      'beinviterid': e.currentTarget.dataset.beinviter,
      'problemid': JSON.parse(problemid)
    }, function (res) {
      var tmp = that.data.invitedsign
      //console.log('tmp:', tmp)
      tmp[e.currentTarget.dataset.index] = true
      that.setData({
        invitedsign: tmp
      })
    })

  },

  torank: function (e) {
    network.post('/user/pushformid', {
      'formid': e.detail.formId,
      'openid': app.globalData.openid
    })
    wx.switchTab({
      url: '/pages/top/top',
    })
  },
  onShow: function () {
    var that = this
    network.post('/problem/getinvitelist', {
      'openid': app.globalData.openid,
      'problemid': JSON.parse(problemid)
    }, function (res) {
      var subscriberlist
      if (res.beinviter) {
        subscriberlist = res.beinviter
      } else {
        subscriberlist = []
      }

      // if (!subscriberlist) {
      //   that.setData({
      //     noone: true
      //   })
      //   wx.showToast({
      //     title: '请关注后再邀请',
      //   })
      //   return
      // }
      var tmplist = new Array();

      for (var i = 0; i < subscriberlist.length; i++) {
        tmplist.push(false)
      }
      that.setData({
        subscriberlist: subscriberlist,
        invitedsign: tmplist
      })
    })
  },
  onLoad: function (options) {
    problemid = options.problemid
  },

})