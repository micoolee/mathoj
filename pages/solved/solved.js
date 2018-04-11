const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    // userid: app.globalData.openid,
    hide: false,
    animationData: null,
    havenewbtn:false,
    lastedid:null,
    formerid:null

  },


  bindQueTap: function (event) {
    var problemid = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `../question/question?problemid=${problemid}`
    })
  },



  onLoad: function () {
    // if (app.globalData.userInfo) {
    //   console.log('111')
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况

    //   app.userInfoReadyCallback = res => {
    //     console.log('222')
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //     var that = this


    //     wx.request({
    //       url: app.globalData.baseurl + '/solved/',
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
    //         url: app.globalData.baseurl + '/solved/',
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


var that = this
util.getlastedsolvedprob(that)



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
    var that = this
    console.log('--------下拉刷新-------')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    util.solvedpulldown(that)
    wx.stopPullDownRefresh() //停止下拉刷新   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('reach bottom')
    var that = this
    util.get10solvedprob(that)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // data: {
  //   hide: false,

  //   userInfo: '',
  //   hasUserInfo: true,
  //   userid: '',


  // }
})