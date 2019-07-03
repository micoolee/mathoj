const app =getApp()

const WxParse = require('../../wxParse/wxParse.js');
var network = require('../../utils/network.js')
var console = require('../../utils/console.js')
var config = require('../../config.js')
Page({

  data: {
    content:'请等待，加载中......',
    title:null,
    author:null,
    authorid:null,
    loadok:false,
    storyid:null,
    videos: []
  },

  onLoad: function (options) {
    var that = this;

    WxParse.emojisInit('[]', "/wxParse/emojis/", {
      "00": "00.gif",
    });
    var storyid = options.id
    this.setData({
      storyid : options.id
    })
    network.post('/problem/getstory',{'storyid':storyid},function(res){
        that.setData({
            authorid:res.authorid,
            title:res.title,
            author:res.author,
            content:res.content,
            loadok:true
        })
        var title = that.data.title;
        var article = that.data.content;
        WxParse.wxParse('title', 'html', title, that, 5);
        WxParse.wxParse('article', 'html', article, that, 5);
        // let player4 = txvContext.getTxvContext('txv4');
    })
  },
  onShareAppMessage: function () {
    return {
      title: '[有人@我]小学奥数，分享给你~',
      path: '/pages/storydetail/storydetail?id=' + this.data.storyid,
      imageUrl: config.host + '/static/sharepic.jpg',
      success: function (res) {
        wx.showToast({
          title: '分享成功~',
        })
      }
    }
  },

})