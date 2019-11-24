// pages/myquan/myquan.js
let network = require('../../../utils/network.js')
// let console = require("../../utils/console.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    remark: '',
    showexitremark: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    network.post('/user/getcurrentschool', {
      'userid': app.globalData.selfuserid,
    }, function (e) {
      //console.log(e)
      that.setData({
        school: e.school || {}
      })

    }, function (e) {
      //console.log(e)
    })
  },
  toexitschool: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认退出？',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            showexitremark: true
          })
        }
      }
    })
  },
  conceal: function (e) {
    var that = this
    that.setData({
      showexitremark: false,
      remark: ''
    })
  },
  cancel: function (e) {
    var that = this
    that.setData({
      showexitremark: false,
      remark: ''
    })
  },
  writeremark: function (e) {
    var that = this
    that.setData({
      remark: e.detail.value
    })
  },
  exitschool: function (e) {
    var that = this
    network.post('/user/applytoexitschool', {
      'userid': app.globalData.selfuserid,
      'schoolid': e.currentTarget.dataset.schoolid * 1,
      'remark': that.data.remark,
    }, function (res) {
      that.setData({
        showexitremark: false,
        remark: ''
      })
      if (!res.resultCode) {
        app.globalData.school = 'schoolid'
        wx.showToast({
          title: '已申请',
        })
      } else if (res.resultMsg == "HaveApplyHandling") {
        wx.showToast({
          title: '勿重复申请',
        })
      } else {
        wx.showToast({
          title: '申请失败',
        })
      }

    })
  }
})