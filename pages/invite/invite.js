// pages/invite/invite.js
const app = getApp()
var network = require('../../utils/network.js')
var console = require('../../utils/console.js')
var config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    problemid: null,
    invitedsign: [false],
    noone: false,
    icon: '../../images/empty.png',
  },

  onShareAppMessage: function(res) {
    var that = this
    console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '[有人@我]数学题，你会做么',
        path: '/pages/question/question?problemid=' + that.data.problemid,
        imageUrl: config.host + '/swagger/mobiwusi.jpg',
      }
    }
  },

  invite: function(e) {
    var beinviter = e.currentTarget.dataset.beinviter
    var that = this
    var index = e.currentTarget.dataset.index
    network.post('/problem/createinvite', {
      'inviterid': app.globalData.selfuserid,
      'beinviterid': beinviter,
      'problemid': JSON.parse(that.data.problemid)
    }, function(res) {
      var tmp = that.data.invitedsign
      console.log('tmp:', tmp)
      tmp[index] = true
      that.setData({
        invitedsign: tmp
      })
    })

  },

  torank: function(e) {
    network.post('/user/pushformid', {
      'formid': e.detail.formId,
      'openid': app.globalData.openid
    })
    var that = this
    wx.switchTab({
      url: '/pages/top/top',
    })
  },
  onShow: function() {
    var that = this
    network.post('/problem/getinvitelist', {
      'openid': app.globalData.openid,
      'problemid': JSON.parse(that.data.problemid)
    }, function(res) {
      var subscriberlist = res.beinviter
      if (!subscriberlist) {
        that.setData({
          noone: true
        })
        wx.showToast({
          title: '请关注后再邀请',
        })
        return
      }
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


  onLoad: function(options) {
    var that = this
    that.setData({
      problemid: options.problemid
    })

  },

})