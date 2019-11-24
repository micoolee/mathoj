// pages/settings/myques/myques.js
const app = getApp()
//var console = require('../../../utils/console.js')
var network = require('../../../utils/network.js')
Page({

  data: {
    problemlist: null,
    problemlistnull: 0,
  },
  deleteproblem: function (e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          network.post('/problem/delete', {
            'problemid': e.currentTarget.dataset.pid
          })
        } else if (sm.cancel) {
          //console.log('用户点击取消')
        }
      }
    })

  },
  homepage: function (e) {
    network.post('/user/pushformid', {
      'formid': e.detail.formId,
      'openid': app.globalData.openid
    })
    wx.switchTab({
      url: '/pages/home/homepage/homepage',
    })
  },
  bindQueTap: function (e) {
    wx.navigateTo({
      url: `/pages/home/question/question?problemid=${e.currentTarget.dataset.id}`
    })
  },

  onLoad: function (options) {
    var that = this
    network.post('/problem/getmyproblem', {
      'openid': app.globalData.openid
    }, function (res) {
      if (res.myproblem) {
        that.setData({
          problemlist: res.myproblem,
          problemlistnull: res.myproblem.length
        })
      } else {
        that.setData({
          problemlist: [],
          problemlistnull: 0
        })
      }
    })
  },
})