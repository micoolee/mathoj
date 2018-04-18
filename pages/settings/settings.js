var app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    // userid: app.globalData.openid,
    hide: false,
    animationData: null,
  },
  onLoad: function (options) {
    this.setData({
      userInfo: { 'avatar': app.globalData.avatar, 'nickname': app.globalData.nickname}
    })
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '', // 分享标题
      desc: '', // 分享描述
      path: '' // 分享路径
    }
  },
  onShow:function(){
    if (app.globalData.reddot) {
      wx.showTabBarRedDot({
        index: 2,
      })
    }
  },

  showMyProf:function(){
    wx.navigateTo({
      url: '../profile/profile',
    })
  },

  showMyQues: function () {
    wx.navigateTo({
      url: './myques/myques',
      success: function (res) {

      },
    })
  },

  showMyBrow: function () {
    wx.navigateTo({
      url: './myhist/myhist',
      success: function (res) {

      },
    })
  },

  showMySubs: function () {
    wx.navigateTo({
      url: './mysubs/mysubs',
      success: function (res) {

      },
    })
  },



  showMyComm: function () {
    wx.navigateTo({
      url: './mycomm/mycomm',
      success: function (res) {

      },
    })
  },





  showClause: function () {
    wx.navigateTo({
      url: './clause/clause',
      success: function (res) {
      }

    })
  },
  showHelp: function () {
    wx.navigateTo({
      url: './help/help',
      success: function (res) {
        // success
      },
    })
  },
  showFeedback: function () {
    wx.navigateTo({
      url: './feedback/feedback',
      success: function(res){
        // success
      },
    })
  },

})