// pages/settings/myques/myques.js
const app = getApp()
var console = require('../../../utils/console.js')
var network = require('../../../utils/network.js')
Page({
  data: {
    applys: [],
  },
  onLoad: function () {
    var that = this
    network.post('/user/getmyapplys', {
      'userid': app.globalData.selfuserid,
    }, function (res) {
      that.setData({
        applys: res.applys
      })
    })
  },
  passapply: function (e) {
    wx.showModal({
      title: '提示',
      content: '确认通过？',
      success: function (res) {
        if (res.confirm) {
          network.post('/user/handleapply', {
            'applyid': e.currentTarget.dataset.applyid,
            'action': 'pass',
          }, function (res) {
            console.log('res:', res)
            if (!res.resultCode) {
              wx.showToast({
                title: '加入成功'
              })
            } else {
              if (res.resultMsg == 'ApplyHandled') {
                wx.showToast({
                  title: '不能重复操作'
                })
                return
              }
              wx.showToast({
                title: '加入失败'
              })
            }
          }, function (e) {
            wx.showToast({
              title: '加入失败'
            })
          })
        }
      }
    })
  },

  rejectapply: function (e) {
    wx.showModal({
      title: '提示',
      content: '确认拒绝？',
      success: function (res) {
        if (res.confirm) {
          network.post('/user/handleapply', {
            'applyid': e.currentTarget.dataset.applyid,
            'action': 'reject',
          }, function (res) {
            console.log('res:', res)
            if (!res.resultCode) {
              wx.showToast({
                title: '已拒绝'
              })
            } else {
              if (res.resultMsg == 'ApplyHandled') {
                wx.showToast({
                  title: '不能重复操作'
                })
                return
              }
              wx.showToast({
                title: '拒绝失败'
              })
            }
          }, function (e) {
            wx.showToast({
              title: '拒绝失败'
            })
          })
        }
      }
    })
  },
})