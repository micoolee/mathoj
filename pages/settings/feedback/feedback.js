// pages/settings/feedback/feedback.js
var app = getApp()
var network = require('../../../utils/network.js')
var config = require('../../../config.js')
var console = require('../../../utils/console.js')
var content = ""
var connect = ""
var uploadfile = false
Page({
  data: {
    files: ["/images/pic_160.png"],
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
        })
        uploadfile = true
      }
    })
  },

  getContent: function (e) {
    content = e.detail.value
  },
  getConnection: function (e) {
    connect = e.detail.value
  },
  submitSuggestion: function (e) {
    network.post('/user/pushformid', { 'formid': e.detail.formId, 'openid': app.globalData.openid })
    var that = this
    if (uploadfile) {
      wx.uploadFile({
        url: config.host + '/user/feedback',
        filePath: that.data.files[0],
        method: 'POST',
        name: 'errorimage',
        header: {
          "content-type": "application/form-data"
        },
        formData: { 'userid': app.globalData.selfuserid, 'content': content, 'connection': connect, 'noimage': 'false' },
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
    } else {
      if (content != "") {
        network.post('/user/feedback', {
          'userid': app.globalData.userid,
          'content': content,
          'connection': connect, 'noimage': 'true'
        }, function (res) {
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
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '请输入问题描述或者图片',
        })
      }
    }
  }

})