// pages/settings/myques/myques.js
const app = getApp()
//var console = require('../../../utils/console.js')
var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
Page({
  data: {
    applys: undefined,
    applytypes: {},
    icons: {
      'pass': 'mathojtongguo',
      'reject': 'mathojjujue'
    }
  },
  onLoad: function () {
    var that = this
    //获取自己的申请列表
    network.post('/user/getmyapply', {
      'userid': app.globalData.selfuserid,
    }, function (res) {
      that.setData({
        applys: res.applys || [],
        applytypes: util.applymaps
      })
    })
  },
  withdrawapply: function (e) {
    wx.showModal({
      title: '提示',
      content: '确认撤销？',
      success: function (res) {
        if (res.confirm) {
          network.post('/user/withdrawapply', {
            'userid': app.globalData.selfuserid,
            'applyid': e.currentTarget.dataset.applyid,
          }, function (res) {
            if (!res.resultCode) {
              wx.showToast({
                title: '撤销成功'
              })
            } else {
              if (res.resultMsg == 'ApplyHandled') {
                wx.showToast({
                  title: '撤销失败'
                })
                return
              }
              wx.showToast({
                title: '撤销失败'
              })
            }
          }, function (e) {
            wx.showToast({
              title: '撤销失败'
            })
          })
        }
      }
    })
  },

})