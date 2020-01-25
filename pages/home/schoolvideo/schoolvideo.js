// pages/invite/invite.js
const app = getApp()
var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
//var console = require('../../../utils/console.js')
var formerid = 0
var config = require('../../../config.js')
const TxvContext = requirePlugin("tencentvideo");

var txvContext = ''
Page({
  /**
   * 页面的初始数据
   */
  data: {
    autoplay: false,
    vid: 'k3050sy65mq',
    videos: []
  },
  onLoad: function (e) {
    txvContext = TxvContext.getTxvContext('txv1') // txv1即播放器组件的playerid值
    var that = this
    console.log('app.globalData.school: ', app.globalData.school)
    network.post('/problem/getschoolvideos', {
      schoolid: app.globalData.school,
    }, function (res) {
      console.log('res:', res)
      if (res.videos != undefined) {
        that.setData({
          videos: res.videos
        })
      }
    })
  },

  // 点击cover播放，其它视频结束
  videoPlay: function (e) {
    this.setData({
      autoplay: true,
      vid: this.data.videos[e.currentTarget.id].url
    })
    setTimeout(function () {
      //将点击视频进行播放
      txvContext.play();
    }, 500)
  },
})
