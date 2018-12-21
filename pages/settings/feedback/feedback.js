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
  submitSuggestion: function (e) {
      wx.request({
          url: app.globalData.baseurl + '/user/pushformid',
          method: 'POST',
          data: { 'formid': e.detail.formId, 'openid': app.globalData.openid },
          success: function (res) {
          }
      })
    var that = this
    if (that.data.uploadfile){
      wx.uploadFile({
      url: app.globalData.baseurl + '/user/feedback',
      filePath: that.data.files[0],
      method:'POST',
      name: 'errorimage',
      header: {
        "content-type": "application/form-data"
      },
      formData:{'userid':app.globalData.selfuserid,'content':that.data.content,'connection':that.data.connect,'noimage':'false'},
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
      if (that.data.content!=""){
        wx.request({
          url: app.globalData.baseurl + '/user/feedback',
          data: { 'userid': app.globalData.userid, 'content': that.data.content, 'connection': that.data.connect, 'noimage': 'true'},
          method:'post',
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