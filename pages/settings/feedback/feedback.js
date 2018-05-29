// pages/settings/feedback/feedback.js
var app = getApp()


Page({
  data: {
    content: "",
    connect: "",
    files: ["../../../images/pic_160.png"],
    uploadfile:false,
    errortype:'2'
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.files
    })
  },

  uploadimg: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const src = res.tempFilePaths[0]
        that.setData({
          files: [src],
          imagelength: 1,
          problempicsrc: src,
          askpicdoor: true,
          img: src,
          uploadfile:true
        })
      }
    })
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
    var that = this
    if(this.data.uploadfile){
      wx.uploadFile({
      url: app.globalData.baseurl + '/feedback/',
      filePath: that.data.files[0],
      name: 'errorimage',
      formData:{'content':that.data.content,'connect':that.data.connect,'errortype':'1'},
            success: function (res) {
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
    }else{
      if(this.data.content!=""){
      wx.request({
      url: app.globalData.baseurl + '/feedback/',
      
      data: this.data,
      method:'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
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
      }else{
        wx.showModal({
          title: '提示',
          content: '请输入问题描述或者图片',
        })
      }

    }





  }

})