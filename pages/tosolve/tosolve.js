// pages/tosolve/tosolve.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    problempicsrc:'null',
    // userid: app.globalData.openid,
    hide:false,
    animationData:null,
    desc:'nodesc',
    img:'noimg',
    grade:'nograde',
    easy:'noeasy',
    reward:'noreward'
  },
  showquestool:function(){
    this.setData({
      hide:true
    })
  },

  bindQueTap: function (event) {
    var problemid = event.target.dataset.id
    wx.navigateTo({
      url: `../question/question?problemid=${problemid}`
    })
  },


  descinput: function (e) {
    this.setData({
      desc: e.detail.value
    })
  },
  // imginput: function (e) {
  //   this.setData({
  //     img: e.detail.value
  //   })
  // },
  gradeinput: function (e) {
    this.setData({
      grade: e.detail.value
    })
  },
  easyinput: function (e) {
    this.setData({
      easy: e.detail.value
    })
  },
  rewardinput: function (e) {
    this.setData({
      reward: e.detail.value
    })
  },

  uploadimg :function(){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        console.log(src)
        that.setData({
          problempicsrc:src,
                img: src
        })


      }
    })


  },

  



  ask:function(){
    this.setData({
      hide: false,
      userid:app.globalData.openid
    }),
    wx.request({
      url: app.globalData.baseurl+'/ask/',
      method:'post',
      data:this.data,
      header:{
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        wx.showModal({
          title: 'tijiao chengogng',
          content: 'queding',
        })

      }
    })
  },









  onLoad: function () {
    if (app.globalData.userInfo) {
      console.log('111')
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况

      app.userInfoReadyCallback = res => {
        console.log('222')
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        var that = this


        wx.request({
          url: app.globalData.baseurl + '/',
          success: function (res) {
            console.log(res)
            that.setData({
              problemlist: res.data
            })
          }
        })


      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log('333')
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          var that = this


          wx.request({
            url: app.globalData.baseurl+'/',
            success:function(res){
              console.log(res)
              that.setData({
                problemlist:res.data
              })
            }
          })


        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
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
    var that = this


    wx.request({
      url: app.globalData.baseurl + '/',
      success: function (res) {
        console.log(res)
        that.setData({
          problemlist: res.data
        })
      }
    })
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

  // data:{
  //   hide:false,
  //   desc: '',
  //   img: '',
  //   grade: '',
  //   easy: '',
  //   reward: '',
  //   userInfo: '',
  //   hasUserInfo: true,
  //   userid:'',


  // }
})