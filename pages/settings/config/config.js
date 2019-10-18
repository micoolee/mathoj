// pages/settings/config/config.js
var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
var console = require('../../../utils/console.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grades: [],
    index: 0,
    onlysee: true
  },
  changegrade: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  switch1Change: function (e) {
    this.setData({
      onlysee: e.detail.value
    })
  },
  save: function (e) {
    var that = this
    network.post('/user/updateconfig', { 'userid': app.globalData.selfuserid, 'onlysee': that.data.onlysee, 'grade': that.data.index * 1 }, function (e) {
      wx.showToast({
        title: '更新成功',
        duration: 1000,
        mask: true,
      })
      app.globalData.onlysee = that.data.onlysee
      app.globalData.grade = that.data.index * 1
      app.globalData.tosolvethat.setData({
        formerid: 0,
        solvedformerid: 0
      })
      if (that.data.onlysee) {
        util.getlastedprob(app.globalData.tosolvethat, [util.gradearray[that.data.index]])
        util.getlastedsolvedprob(app.globalData.tosolvethat, [util.gradearray[that.data.index]])
      } else {
        util.getlastedprob(app.globalData.tosolvethat)
        util.getlastedsolvedprob(app.globalData.tosolvethat)
      }
      wx.navigateBack({
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.onlysee) {
      this.setData({
        grades: util.gradearray,
        index: app.globalData.grade,
        onlysee: true
      })
    } else {
      this.setData({
        grades: util.gradearray,
        index: app.globalData.grade,
        onlysee: false
      })
    }
  },

})