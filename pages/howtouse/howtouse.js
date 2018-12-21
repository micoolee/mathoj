const WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({
  data: {
  
  },

  onLoad: function (options) {
  
  var that = this


  WxParse.emojisInit('[]', "/wxParse/emojis/", {
   "00": "00.gif",

  });
  wx.request({
      url: app.globalData.baseurl+'/message/help',
     method:'POST',
     data:{'openid':app.globalData.openid},
     success: function (res) {
      var article = res.data.content;

      WxParse.wxParse('article', 'html', article, that, 5);
    }
  })
  },

})