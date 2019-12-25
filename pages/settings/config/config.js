var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
//var console = require('../../../utils/console.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    onlysee: true
  },
  switch1Change: function (e) {
    this.setData({
      onlysee: e.detail.value
    })
  },
  save: function (e) {
    var that = this
    network.post('/user/updateconfig', {
      'userid': app.globalData.selfuserid,
      'onlysee': that.data.onlysee,

    }, function (e) {
      wx.showToast({
        title: '更新成功',
        duration: 1000,
        mask: true,
      })
      app.globalData.onlysee = that.data.onlysee
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (app.globalData.onlysee) {
      this.setData({
        onlysee: true
      })
    } else {
      this.setData({
        onlysee: false
      })
    }
  },

})