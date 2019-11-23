// pages/settings/myques/myques.js
const app = getApp()
//var console = require('../../../utils/console.js')
var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
Page({
  data: {
    applys: [],
    applytypes: {}
  },
  onLoad: function () {
    var that = this
    network.post('/user/getmyapplys', {
      'userid': app.globalData.selfuserid,
    }, function (res) {
      that.setData({
        applys: res.applys,
        applytypes: util.applymaps
      })
    })
  },
  passapply: function (e) {
    var succ = '加入成功'
    var fail = '加入失败'
    if (e.currentTarget.dataset.applytype == 'exit') {
      succ = '退出成功'
      fail = '退出失败'
    }
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
                title: succ
              })
            } else {
              if (res.resultMsg == 'ApplyHandled') {
                wx.showToast({
                  title: succ
                })
                return
              }
              wx.showToast({
                title: fail
              })
            }
          }, function (e) {
            wx.showToast({
              title: fail
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