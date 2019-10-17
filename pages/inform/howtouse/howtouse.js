const WxParse = require('../../../wxParse/wxParse.js');
var network = require('../../../utils/network.js')
var console = require('../../../utils/console.js')
const app = getApp()
Page({
  data: {
  },

  onLoad: function(options) {
    var that = this
    WxParse.emojisInit('[]', "/wxParse/emojis/", {
      "00": "00.gif",
    });
    network.post('/message/help',{
        'openid': app.globalData.openid
    }, function (res) {
      WxParse.wxParse('article', 'html', res.content, that, 5);
    })
  },

})