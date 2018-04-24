// pages/ask/ask.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files:[],
    gradearray: ['未选择', '一年级', '二年级', '三年级', '四年级'],
    grade: '未选择',
    gradeindex: 0,
    easy: 'noeasy',
    reward: 0,
    easyitems: [
      { name: 'difficult', value: '困难' },
      { name: 'easy', value: '简单', checked: 'true' },
    ],
    desc: '',
    img: 'noimage',
    askpicdoor:false,
    avatar:app.globalData.avatar,
    screenwidth:app.globalData.screenwidth,
    screenheight: app.globalData.screenheight,
  },


  rewardinput: function (e) {
    this.setData({
      reward: e.detail.value
    })
  },

  descinput: function (e) {
    this.setData({
      desc: e.detail.value
    })
  },
  radioChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      easy: e.detail.value
    })
  },


  bindPickerChange: function (e) {
    this.setData({
      gradeindex: e.detail.value,
      grade: this.data.gradearray[e.detail.value]
    })

  },


  uploadimg: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        console.log(src)
        that.setData({
          files: that.data.files.concat(res.tempFilePaths),
          problempicsrc: src,
          askpicdoor:true,
          img: src
        })



      }
    })


  },

  ask: function () {
    if (this.data.desc==''){
      wx.showModal({
        title: 'input somthing',
        content: 'input somthing',
      })
    } else if (this.data.grade == '未选择'){
      wx.showModal({
        title: 'xuanze nianji',
        content: 'input somthing',
      })
    }
    else{

      this.setData({
        hide: false,
        userid: app.globalData.openid
      })
      if (this.data.img != 'noimage') {
        wx.uploadFile({
          url: app.globalData.baseurl + '/ask/',
          filePath: this.data.img,
          name: 'problempic',
          formData: this.data,
          success: function () {
            wx.showModal({
              title: 'tijiao chengogng',
              content: 'queding',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({

                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })

          }
        })


      }
      else {
        wx.request({
          url: app.globalData.baseurl + '/ask/',
          method: 'post',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: this.data,
          success: function () {
            wx.showModal({
              title: 'tijiao chengogng',
              content: 'queding',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                  })
                } else if (res.cancel) {
                }
              }
            })

          },


        })

      }

    }



  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  cancelask: function () {
    wx.navigateBack({
      
    })
  },


})