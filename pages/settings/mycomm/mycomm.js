// pages/settings/mycomm/mycomm.js
const app = getApp()
var network = require('../../../utils/network.js')
var console = require('../../../utils/console.js')
Page({
  data: {
    commentlist: [],
    commentlistnull: 0,
    loadok: false,
    icon: '../../../images/empty.png',
  },
  deletecomment: function(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function(sm) {
        if (sm.confirm) {
          network.post('/problem/deletecomment', {
            'commentid': e.currentTarget.dataset.cid
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  tosolve: function(e) {
    var that = this
    network.post('/user/pushformid', {
      'formid': e.detail.formId,
      'openid': app.globalData.openid
    })
    wx.switchTab({
      url: '/pages/home/tosolve/tosolve',
    })
  },

  onLoad: function(options) {
    var that = this
    network.post('/problem/getmycomment', {
      'openid': app.globalData.openid
    }, function(res) {
      if (res.mycomment) {
        that.setData({
          commentlist: res.mycomment,
          commentlistnull: res.mycomment.length,
          loadok: true
        })
      } else {
        that.setData({
          commentlist: [],
          commentlistnull: 0,
          loadok: true
        })
      }
    })
  },



  bindQueTap: function(e) {
    var problemid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/home/question/question?problemid=${problemid}`
    })

  },
})