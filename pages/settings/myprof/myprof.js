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
    role: '',
    realname: '',
    phone: '',
    selfdesc: '',
    jigoudesc: ''
  },

  save: function (e) {
    var that = this
    network.post('/user/updateprofile', {
      'userid': app.globalData.selfuserid,
      'onlysee': that.data.onlysee,
      'grade': that.data.index * 1
    }, function (e) {
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
    })
  },
  writerealname: function (e) {
    var that = this
    that.setData({
      realname: e.detail.value
    })
    console.log(that.data.realname)
  },
  writephone: function (e) {
    var that = this
    that.setData({
      phone: e.detail.value
    })
    console.log(that.data.phone)
  },
  writejigoudesc: function (e) {
    var that = this
    that.setData({
      jigoudesc: e.detail.value
    })
    console.log(that.data.jigoudesc)
  },
  writeselfdesc: function (e) {
    var that = this
    that.setData({
      selfdesc: e.detail.value
    })
    console.log(that.data.selfdesc)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      role: app.globalData.role
    })
  },

})