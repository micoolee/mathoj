// pages/ask/ask.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputnum:0,
    files: ["../../images/pic_160.png"],
    gradearray: ['未选择', '一年级', '二年级', '三年级', '四年级'],

    grade: '未选择',
    gradeindex: 0,
    easy: 'noeasy',
    rewardarray: ['未选择','2','3'],
    rewardindex:0,
    easyitems: [
      { name: 'difficult', value: '困难' },
      { name: 'easy', value: '简单', checked: 'true' },
    ],
    desc: '',
    placeholder:'',
    img: 'noimage',
    askpicdoor:false,
    avatar:app.globalData.avatar,
    screenwidth:app.globalData.screenwidth,
    screenheight: app.globalData.screenheight,
    imagelength:0
  },


  rewardinput: function (e) {
    this.setData({
      reward: e.detail.value
    })
  },



  descinput: function (e) {
    var num = e.detail.value.length
    app.globalData.placeholder= e.detail.value
    this.setData({
      desc: e.detail.value,
      inputnum:num,
      
    })
  },
  radioChange: function (e) {
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


  bindPickerChangereward: function (e) {
    this.setData({
      rewardindex: e.detail.value,
      reward: this.data.rewardarray[e.detail.value]
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
        that.setData({
          files: [src],
          imagelength:1,
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
        title: '提示',
        content: '请输入问题描述',
      })
    } else if (this.data.grade == '未选择'){
      wx.showModal({
        title: '提示',
        content: '请选择年级',
      })
    }else if(this.data.reward == '0'){
      wx.showModal({
        title: '提示',
        content: '请选择奖励值',
      })
    }
    else{

      this.setData({
        hide: false,
        userid: app.globalData.openid,
        avatar: app.globalData.avatar,
      })
      if (this.data.img != 'noimage') {
        wx.uploadFile({
          url: app.globalData.baseurl + '/ask/',
          filePath: this.data.img,
          name: 'problempic',
          formData: this.data,
          success: function () {
            wx.showModal({
              title: '提示',
              content: '提问成功',
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
              title: '提示',
              content: '提问成功',
              success: function (res) {
                if (res.confirm) {
                  app.globalData.placeholder = ''
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

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  cancelask: function () {
    app.globalData.placeholder = ''
    wx.navigateBack({
      
    })
  },
 onShow:function(){
   this.setData({
     placeholder: app.globalData.placeholder
   })
 }


})