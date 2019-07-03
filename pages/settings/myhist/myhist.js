// pages/settings/myques/myques.js
const app = getApp()
var network = require('../../../utils/network.js')
var console = require('../../../utils/console.js')
Page({

  data: {
    problemlist: null,
    problemlistnull: 0,
    loadok: false,
    icon: '../../../images/empty.png',
  },

  tosolve: function(e) {
    var that = this
    network.post('/user/pushformid', {
      'formid': e.detail.formId,
      'openid': app.globalData.openid
    })
    wx.switchTab({
      url: '../../tosolve/tosolve',
    })
  },


  bindTouchStart: function(e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function(e) {
    this.endTime = e.timeStamp;
  },
  bindQueTap: function(e) {
    if (this.endTime - this.startTime < 350) {
      var problemid = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `../../question/question?problemid=${problemid}`
      })
    }
  },
  bindLongTap: function(e) {
    var problemid = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success: function(res) {
        if (res.confirm) {
          network.post('/deletehist', {
            'problemid': problemid,
            'userid': app.globalData.openid
          }, function() {
            wx.showToast({
              title: 'delete success',
            })
            that.onLoad()
          })
        }
      }
    })
  },
  onLoad: function(options) {
    var that = this
    network.post('/problem/getmyhistory', {
      'openid': app.globalData.openid
    }, function(res) {
      if (res.history) {
        that.setData({
          loadok: true,
          problemlist: res.history,
          problemlistnull: res.history.length
        })
      } else {
        that.setData({
          loadok: true,
          problemlist: [],
          problemlistnull: 0
        })
      }
    })
  },
})