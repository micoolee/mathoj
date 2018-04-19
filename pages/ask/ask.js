// pages/ask/ask.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gradearray: ['未选择', '一年级', '二年级', '三年级', '四年级'],
    grade: '未选择',
    gradeindex: 0,
    easy: 'noeasy',
    reward: 'noreward',
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
    }else{

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



  cancelask: function () {
    wx.navigateBack({
      
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})