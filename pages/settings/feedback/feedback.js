// pages/settings/feedback/feedback.js
var app = getApp()


Page({
  data: {
    content: "",
    connect: ""
  },
  onLoad: function (options) {
  },
  getContent: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  getConnection: function (e) {
    this.setData({
      connect: e.detail.value
    })
  },
  submitSuggestion: function () {

wx.request({
  url: app.globalData.baseurl+'/feedback/',
  data:this.data,
  success:function(res){
    wx.showModal({
      title: '提示',
      content: '提交成功！感谢您的反馈！',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.navigateBack({
            
          })
        }
      }
    })
  }
})


  }
  
})