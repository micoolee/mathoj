// pages/settings/config/config.js
var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
// //var console = require('../../../utils/console.js')
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
    grades: [],
    id: 0,
  },
  changegrade: function (e) {
    this.setData({
      id: e.detail.value
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
      'grade': that.data.id * 1
    }, function (e) {
      wx.showToast({
        title: '更新成功',
        duration: 1000,
        mask: true,
      })
      app.globalData.grade = that.data.id * 1
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
      //console.log(app.globalData.grade, 'app.globalData.grade:')
      that.setData({
        grades: util.gradearray,
        realname: e.profile.realname || '',
        phone: e.profile.phone || '',
        selfdesc: e.profile.selfdesc || '',
        role: app.globalData.role || '',
        id: app.globalData.grade * 1 || 0,


      })
      //console.log(that.data.grades[that.data.id])
    }, function (e) {
      that.setData({
        role: app.globalData.role || '',
        id: app.globalData.grade * 1 || 0,
        grades: util.gradearray,

      })
    })
  },
})