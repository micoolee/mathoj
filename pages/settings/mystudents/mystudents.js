// pages/settings/myques/myques.js
const app = getApp()
var network = require('../../../utils/network.js')
Page({

  data: {
    students: [],
  },
  onLoad: function () {
    var that = this
    network.post('/user/getmystudents', {
      'userid': app.globalData.selfuserid,
    }, function (res) {
      if (res.students) {
        that.setData({
          students: res.students
        })
      } else {
        that.setData({
          students: []
        })
      }
    })
  },
  deletestudent: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success: function (res) {
        if (res.confirm) {
          network.post('/user/deletestudent', {
            'userid': app.globalData.selfuserid,
            'studentid': e.currentTarget.dataset.studentid,
          }, function (res) {
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
  },
  upgradeteacher: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认升级？',
      success: function (res) {
        if (res.confirm) {
          network.post('/user/upgradetoteacher', {
            'userid': app.globalData.selfuserid,
            'studentid': e.currentTarget.dataset.studentid,
          }, function (res) {
            if (!res.resultCode) {
              wx.showToast({
                title: '升级成功'
              })
            } else if (res.resultMsg == 'AlreadyTeacher') {
              wx.showToast({
                title: '勿重复操作'
              })
            } else {
              wx.showToast({
                title: '升级失败'
              })
            }
          }, function (e) {
            wx.showToast({
              title: '升级失败'
            })
          })
        }
      }
    })
  }
})