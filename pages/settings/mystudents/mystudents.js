// pages/settings/myques/myques.js
const app = getApp()
var console = require('../../../utils/console.js')
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
      console.log('res:', res)
      that.setData({
        students: res.students
      })
    })
  },
})