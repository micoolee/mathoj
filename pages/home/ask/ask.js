// pages/ask/ask.js

const app = getApp()
var util = require('../../../utils/util.js')
var network = require('../../../utils/network.js')
var console = require('../../../utils/console.js')
var grade = '未选择'
var desc = ''
var imgs = 'noimage'
Page({
  data: {
    inputnum: 0,
    files: ["/images/pic_160.png"],
    gradearray: '',
    categorys: '',
    categoryindex: -1,
    gradeindex: 0,
    placeholder: '',
    imagelength: 0,
    disabledbut: false
  },


  bindPickerChangeCategory: function (e) {
    this.setData({
      categoryindex: e.detail.value * 1,
    })
  },

  deletethisimg: function (e) {
    var that = this
    var files = that.data.files
    files.splice(e.currentTarget.dataset.index, 1)
    that.setData({
      files: files,
      imagelength: files.length,
    })
    imgs = files
  },

  descinput: function (e) {
    app.globalData.placeholder = e.detail.value
    desc = e.detail.value
    this.setData({
      inputnum: e.detail.value.length,
    })
  },

  bindPickerChange: function (e) {
    this.setData({
      gradeindex: e.detail.value * 1,
    })
    grade = this.data.gradearray[e.detail.value * 1]
  },

  uploadimg: function () {
    var that = this;
    var files
    wx.chooseImage({
      count: 4, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        if (that.data.files[0] == "/images/pic_160.png") {
          files = res.tempFilePaths
        } else {
          files = that.data.files.concat(res.tempFilePaths)
        }

        that.setData({
          files: files,
          imagelength: files.length,
        })
        imgs = files
      }
    })
  },

  uploadimgs: function (formdata, tmpimgs, i) {
    var that = this
    if (i > tmpimgs.length - 1) {
      that.setData({
        disabledbut: false
      })
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '提问成功',
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({})
          }
        }
      })
      return
    }
    util.uploadfile('/problem/create', tmpimgs[i], 'problempic', formdata,
      function (res) {
        console.log(res)
        var data = JSON.parse(res.data)
        i++
        formdata['problemid'] = data.problemid * 1
        formdata['imgindex'] = i
        that.uploadimgs(formdata, imgs, i)
      },
      function (e) {
        console.log('error', e)
      })
  },



  ask: function (e) {
    var that = this
    //收集formid
    network.post('/user/pushformid', {
      'formid': e.detail.formId,
      'openid': app.globalData.openid
    })
    //验证提问是否合法
    if (desc == '') {
      wx.showModal({
        title: '提示',
        content: '请输入问题描述',
      })
    } else if (grade == '未选择') {
      wx.showModal({
        title: '提示',
        content: '请选择年级',
      })
    } else {
      wx.showLoading({
        title: '上传中',
      })
      this.setData({
        hide: false,
        disabledbut: true,
      })
      if (imgs != 'noimage') {
        //带图片的提问
        var formdata = {
          "openid": app.globalData.openid,
          'categoryid': that.data.categoryindex,
          "grade": grade,
          "desc": desc,
          "noimage": "false",
          'problemid': 0,
          'imgindex': 0
        }
        that.uploadimgs(formdata, imgs, 0)
      } else {
        var formdata = {
          "openid": app.globalData.openid,
          'categoryid': that.data.categoryindex,
          "grade": grade,
          "desc": desc,
          "noimage": "true"
        }
        network.post('/problem/create', formdata, function (res) {
          that.setData({
            disabledbut: false
          })
          wx.showModal({
            title: '提示',
            content: '提问成功',
            success: function (res) {
              if (res.confirm) {
                app.globalData.placeholder = ''
                wx.navigateBack()
              }
            }
          })
        }, function () { },
          function (e) {
            wx.hideLoading()
          })
      }
    }
  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.files
    })
  },

  cancelask: function (e) {
    network.post('/user/pushformid', {
      'formid': e.detail.formId,
      'openid': app.globalData.openid
    })
    app.globalData.placeholder = ''
    wx.navigateBack({})
  },
  onShow: function () {
    this.setData({
      placeholder: app.globalData.placeholder,
      categorys: util.categorys,
      gradearray: util.gradearray
    })
  }

})