// pages/settings/config/config.js
var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
//var console = require('../../../utils/console.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    usethislocation: false,
    schoolname: '',
    schoolphone: '',
    schooladdress: ''
  },
  switchlocation: function (e) {
    this.setData({
      usethislocation: e.detail.value
    })
  },
  writeschooladdress: function (e) {
    var that = this
    that.setData({
      schooladdress: e.detail.value
    })
  },
  writeschoolname: function (e) {
    var that = this
    that.setData({
      schoolname: e.detail.value
    })
  },
  writeschoolphone: function (e) {
    var that = this
    that.setData({
      schoolphone: e.detail.value
    })
  },
  writeschooldesc: function (e) {
    var that = this
    that.setData({
      schooldesc: e.detail.value
    })
  },
  save: function (e) {
    var that = this
    network.post('/user/updateschoolprofile', {
      'userid': app.globalData.selfuserid,
      'jigoumap': that.data.usethislocation,
      'schoolname': that.data.schoolname,
      'schoolphone': that.data.schoolphone,
      'schooldesc': that.data.schooldesc,
      'schooladdress': that.data.schooladdress,
    }, function (e) {
      wx.showToast({
        title: '更新成功',
        duration: 1000,
        mask: true,
      })
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