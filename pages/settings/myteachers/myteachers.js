// pages/settings/myques/myques.js
const app = getApp()
var console = require('../../../utils/console.js')
var network = require('../../../utils/network.js')
Page({
  data: {
    teachers: [],
  },
  onLoad: function () {
    var that = this
    network.post('/user/getmyteachers', {
      'userid': app.globalData.selfuserid,
    }, function (res) {
      console.log('res:', res)
      that.setData({
        teachers: res.teachers
      })
    })
  },

  deleteteacher: function (e) {
    console.log(e, "e: ")
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success: function (res) {
        if (res.confirm) {
          network.post('/user/deleteteacher', {
            'userid': app.globalData.selfuserid,
            'teacherid': e.currentTarget.dataset.teacherid,
          }, function (res) {
            console.log('res:', res)
            if (!res.resultCode) {
              wx.showToast({
                title: '删除成功'
              })
            } else {
              wx.showToast({
                title: '删除失败'
              })
            }
          }, function (e) {
            wx.showToast({
              title: '删除失败'
            })
          })
        }
      }
    })

  }
})