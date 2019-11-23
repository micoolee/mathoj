// pages/inform/inform.js
const app = getApp()
//var console = require('../../../utils/console.js')
var network = require('../../../utils/network.js')
const WxParse = require('../../../wxParse/wxParse.js');
Page({

  data: {
    content: ''
  },
  onLoad: function (options) {
    var that = this
    WxParse.emojisInit('[]', "/wxParse/emojis/", {
      "00": "00.gif",
    });
    network.post('/message/help', {
    }, function (res) {
      WxParse.wxParse('article', 'html', res.content, that, 5);
    })
  },




})