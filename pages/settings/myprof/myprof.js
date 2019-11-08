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
    jigoudesc: '',
    grades: [],
    index: 0,
  },
  changegrade: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  save: function (e) {
    var that = this
    network.post('/user/updateprofile', {
      'userid': app.globalData.selfuserid,
      'realname': that.data.realname,
      'phone': that.data.phone,
      'selfdesc': that.data.selfdesc,
      'jigoudesc': that.data.jigoudesc,
      'grade': that.data.index * 1
    }, function (e) {
      wx.showToast({
        title: '更新成功',
        duration: 1000,
        mask: true,
      })
      app.globalData.grade = that.data.index * 1
    })
  },
  writerealname: function (e) {
    var that = this
    that.setData({
      realname: e.detail.value
    })
  },
  writephone: function (e) {
    var that = this
    that.setData({
      phone: e.detail.value
    })
  },
  writejigoudesc: function (e) {
    var that = this
    that.setData({
      jigoudesc: e.detail.value
    })
  },
  writeselfdesc: function (e) {
    var that = this
    that.setData({
      selfdesc: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    network.post('/user/getmyprofile', {
      'userid': app.globalData.selfuserid,
    }, function (e) {
      console.log(e, 'e:')
      that.setData({
        realname: e.profile.realname,
        phone: e.profile.phone,
        selfdesc: e.profile.selfdesc,
        jigoudesc: e.profile.jigoudesc,
        role: app.globalData.role,
        grades: util.gradearray,
        index: app.globalData.grade,
      })
    }, function (e) {
      that.setData({
        role: app.globalData.role,
        grades: util.gradearray,
        index: app.globalData.grade,
      })
    })
  },
})