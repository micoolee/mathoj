const app =getApp()

const WxParse = require('../../wxParse/wxParse.js');
const txvContext = requirePlugin("tencentvideo");
//mike dev
var baseurl = 'https://mathoj.liyuanye.club'

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
    
    wx.request({
      url: baseurl+'/problem/getstory',
      data:{'storyid':storyid},
      method:'POST',
      success:function(res){
        that.setData({
          authorid:res.data.authorid,
          title:res.data.title,
          author:res.data.author,
          content:res.data.content,
          loadok:true
        })
        var title = that.data.title;
        var article = that.data.content;
        WxParse.wxParse('title', 'html', title, that, 5);
        WxParse.wxParse('article', 'html', article, that, 5);
        let player4 = txvContext.getTxvContext('txv4');
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '[有人@我]小学奥数，分享给你~',
      path: '/pages/storydetail/storydetail?id=' + this.data.storyid,
      imageUrl: app.globalData.baseurl + '/static/sharepic.jpg',
      success: function (res) {
        wx.showToast({
          title: '分享成功~',
        })
      }
    }
  },

})