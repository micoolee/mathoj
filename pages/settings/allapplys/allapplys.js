// pages/settings/myques/myques.js
const app = getApp()
var console = require('../../../utils/console.js')
var network = require('../../../utils/network.js')
Page({
  data: {
    applys: [],
  },
  onLoad: function () {
    var that = this
    network.post('/user/getmyapplys', {
      'userid': app.globalData.selfuserid,
    }, function (res) {
      that.setData({
        applys: res.applys
      })
    })
  },
})