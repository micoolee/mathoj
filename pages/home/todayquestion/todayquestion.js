// pages/invite/invite.js
const app = getApp()
var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
//var console = require('../../../utils/console.js')
var formerid = 0
var config = require('../../../config.js')
var curDate = ''
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    questions: []
  },
  onLoad: function () {
    var that = this
    that.curDate = new Date()
    var today = that.curDate.Format("yyyy-MM-dd");


    that.setData({
      date: today,
    })
    network.post('/problem/daily', {
      'date': today
    }, function (res) {
      if (res.questions && res.questions.length > 0) {
        that.setData({
          questions: res.questions,
        })
      }
    })
  },

  totoday: function (e) {
    var that = this
    that.onLoad()
  },
  preday: function (e) {
    var that = this
    that.curDate = new Date(that.curDate.getTime() - 24 * 60 * 60 * 1000); //前一天
    this.setData({
      date: that.curDate.Format("yyyy-MM-dd")
    })
    network.post('/problem/daily', {
      'date': that.curDate.Format("yyyy-MM-dd"),
    }, function (res) {
      if (res.questions && res.questions.length > 0) {
        that.setData({
          questions: res.questions,
        })
      } else {
        that.setData({
          questions: [],
        })
      }
    })
  },
  bindDateChange: function (e) {
    var that = this
    this.setData({
      date: e.detail.value
    })
    network.post('/problem/daily', {
      'date': e.detail.value,
    }, function (res) {
      if (res.questions && res.questions.length > 0) {
        that.setData({
          questions: res.questions,
        })
      } else {
        that.setData({
          questions: [],
        })
      }
    })
  },


  viewimage: function (e) {
    var that = this
    var image = e.currentTarget.dataset.image
    var images = [image]
    // if (that.data.problempic != '') {
    //   images = images.concat([that.data.problempic])
    // }

    wx.previewImage({
      current: image,
      urls: images,
    })
  },

})
