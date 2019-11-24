// pages/invite/invite.js
const app = getApp()
var network = require('../../../utils/network.js')
//var console = require('../../../utils/console.js')
var config = require('../../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolmates: [],
  },

  onLoad: function () {
    var that = this
    network.post('/user/getteachersandstudents', {
      'userid': app.globalData.selfuserid,
    }, function (res) {
      //console.log('res:', res)
      that.setData({
        schoolmates: res.users
      })
    })
  },

})