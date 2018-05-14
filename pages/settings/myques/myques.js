// pages/settings/myques/myques.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    problemlist:null
  },





  bindQueTap: function (event) {
    var problemid = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `../../question/question?problemid=${problemid}`
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    wx.request({
      url: app.globalData.baseurl + '/myques/',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: { 'userid': app.globalData.openid },
      success: function (res) {
        console.log(res)
        that.setData({
          problemlist: res.data
        })
      }
    })
    // if (app.globalData.userInfo) {
    //   console.log(app.globalData.openid)
    //   wx.request({
    //     url: app.globalData.baseurl + '/myques/',
    //     method: 'post',
    //     header: {
    //       "Content-Type": "application/x-www-form-urlencoded"
    //     },
    //     data: { 'userid': app.globalData.openid },
    //     success: function (res) {
    //       console.log(res)
    //       that.setData({
    //         problemlist: res.data
    //       })
    //     }
    //   })
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   app.userInfoReadyCallback = res => {
    //     console.log('222')
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //     var that = this


    //     wx.request({
    //       url: app.globalData.baseurl + '/myques/',
    //       method: 'post',
    //       data: { 'userid': app.globalData.openid },
    //       success: function (res) {
    //         console.log(res)
    //         that.setData({
    //           problemlist: res.data
    //         })
    //       }
    //     })


    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       console.log('333')
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //       var that = this


    //       wx.request({
    //         url: app.globalData.baseurl + '/myques/',
    //         method: 'post',
    //         data: { 'userid': app.globalData.openid },
    //         success: function (res) {
    //           console.log(res)
    //           that.setData({
    //             problemlist: res.data
    //           })
    //         }
    //       })


    //     }
    //   })
    // }



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