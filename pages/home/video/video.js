// pages/invite/invite.js
const app = getApp()
var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
//var console = require('../../../utils/console.js')
var formerid = 0
var config = require('../../../config.js')
const TxvContext = requirePlugin("tencentvideo");

var txvContext = ''
var albumid = ''
Page({
  /**
   * 页面的初始数据
   */
  data: {
    autoplay: false,
    vid: 'k3050sy65mq',
    videos: [],
    desc: '',
    nowplay: 0
  },
  onLoad: function (e) {
    txvContext = TxvContext.getTxvContext('txv1') // txv1即播放器组件的playerid值
    var that = this
    that.albumid = e.albumid
    network.post('/problem/getvideos', {
      'albumid': e.albumid * 1,
    }, function (res) {
      if (res.videos != undefined) {
        that.setData({
          videos: res.videos,
          desc: res.desc,
        })
      }
    })
  },

  // 点击cover播放，其它视频结束
  videoPlay: function (e) {
    this.setData({
      autoplay: true,
      vid: this.data.videos[e.currentTarget.id].url,
      nowplay: e.currentTarget.id
    })
    setTimeout(function () {
      //将点击视频进行播放
      txvContext.play();
    }, 500)
  },

  onShareAppMessage: function (res) {
    // var problemid = this.data.problemid
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // problemid = res.target.dataset.problemid
      return {
        title: '[有人@我]快来听课吧',
        path: '/pages/home/video/video?albumid=' + that.albumid,
        imageUrl: config.host + '/static/sharepic.jpg',
      }
    }
    return {
      title: '[有人@我]快来听课吧',
      path: '/pages/home/video/video?albumid=' + that.albumid,
      success: function (res) {
      },
    }
  },

})
