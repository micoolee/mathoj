const app =getApp()

const WxParse = require('../../wxParse/wxParse.js');
const txvContext = requirePlugin("tencentvideo");

if(app.globalData.baseurl ){
  var baseurl = 'https://mathoj.liyuanye.club'
}else{
  var baseurl = 'https://mathoj.liyuanye.club'
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'请等待，加载中......',
    title:null,
    author:null,
    authorid:null,
    loadok:false,
    storyid:null,
    videos: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    

    WxParse.emojisInit('[]', "/wxParse/emojis/", {
      "00": "00.gif",
      "01": "01.gif",
      "02": "02.gif",
      "03": "03.gif",
      "04": "04.gif",
      "05": "05.gif",
      "06": "06.gif",
      "07": "07.gif",
      "08": "08.gif",
      "09": "09.gif",
      "09": "09.gif",
      "10": "10.gif",
      "11": "11.gif",
      "12": "12.gif",
      "13": "13.gif",
      "14": "14.gif",
      "15": "15.gif",
      "16": "16.gif",
      "17": "17.gif",
      "18": "18.gif",
      "19": "19.gif",
    });




    var storyid = options.id
    this.setData({
      storyid : options.id
    })
    
    wx.request({
      url: baseurl+'/getstory/',
      data:{'storyid':storyid},
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
  /**
   * 用户点击右上角分享
   */
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

  // toface: function () {
  //   wx.navigateToMiniProgram({
  //     appId: 'wxaf249daf125d652c',
  //     path: 'pages/index/index',
  //     extraData: {
  //       foo: 'bar'
  //     },
  //     envVersion: 'develop',
  //     success(res) {
  //       // 打开成功
  //       console.log(res)
  //     },
  //     fail(res) {
  //       console.log(res)
  //     }
  //   })
  // }

})