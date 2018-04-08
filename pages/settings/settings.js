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

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '', // 分享标题
      desc: '', // 分享描述
      path: '' // 分享路径
    }
  },
  showMyQues: function () {
    wx.navigateTo({
      url: './myques/myques',
      success: function (res) {
        // success
      },
    })
  },



  showMySubs: function () {
    wx.navigateTo({
      url: './mysubs/mysubs',
      success: function (res) {
        // success
      },
    })
  },


  showMyBrow: function () {
    wx.showModal({
      title: 'todo',
      content: '',
    })
  },

  showMyComm: function () {
    wx.showModal({
      title: 'todo',
      content: '',
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