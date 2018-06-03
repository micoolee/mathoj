var app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hide: false,
    animationData: null,
    coin:null
  },
  onLoad: function (options) {

  },
  onShow:function(){
    var that = this
    var a = util.get_or_create_avatar(app.globalData.openid,that)

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



clearcache:function(){
  wx.showModal({
    title: '提示',
    content: '清除后会重新加载，确定清除？',
    success:function(res){
      if(res.confirm){
        wx.clearStorageSync()
        wx.showToast({
          title: '成功清除',
        })
        wx.reLaunch({
          url: '/pages/tosolve/tosolve',
        })
      }else{

      }
    }
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
      },
    })
  },
  showFeedback: function () {
    wx.navigateTo({
      url: './feedback/feedback',
      success: function(res){
      },
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

})