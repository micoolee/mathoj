var app = getApp()
var util = require('../../utils/util.js')
var network = require('../../utils/network.js')
var console = require('../../utils/console.js')
var config = require('../../config.js')
var ctx = null;

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    hide: false,
    coin: null,
    remainformidnumorstr: '',
    remainformidnum: 0,
    modalHidden: true,
    grades: '',
    gradeindex: 0,
  },
  modalChange: function(e) {
    var that = this
    if (this.data.gradeindex != 0) {
      network.post('/user/setgrade', {
        'openid': app.globalData.openid,
        'grade': this.data.gradeindex
      }, function(e) {
        app.globalData.grade = that.data.gradeindex * 1
        wx.showToast({
          title: '设置成功',
        })
      }, function(e) {})

      this.setData({
        modalHidden: true
      })
    }
  },
  selectgrade: function(e) {
    console.log(e)
    this.setData({
      gradeindex: e.detail.value * 1
    })
  },
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '[有人@我]数学题，你会做么',
        path: '/pages/home/tosolve/tosolve',
        imageUrl: config.host + '/swagger/mobiwusi.jpg',
        success: function(res) {}
      }

    }
  },

  onLoad: function(options) {
    var that = this
    if (app.globalData.grade == 0) {
      that.setData({
        modalHidden: false
      })
    }
    that.setData({
      grades: util.gradearray
    })
    wx.showLoading({
      title: '加载中',
    })
    //获取瓶子数
    network.post('/user/getformidnum', {
      'userid': app.globalData.selfuserid
    }, function(res) {
      setnum(that, res.count)
    }, function() {}, function() {
      wx.hideLoading()
    })
  },

  onShow: function() {
    var that = this
    util.get_or_create_avatar(app.globalData.openid, that)
    if (app.globalData.reddot) {
      wx.showTabBarRedDot({
        index: 3,
      })
    }
  },

  showMyQues: function() {
    wx.navigateTo({
      url: './myques/myques',
    })
  },

  showMyBrow: function() {
    wx.navigateTo({
      url: './myhist/myhist',
    })
  },

  showMySubs: function() {
    wx.navigateTo({
      url: './mysubs/mysubs',
    })
  },

  showMyComm: function() {
    wx.navigateTo({
      url: './mycomm/mycomm',
    })
  },
  
  clearcache: function() {
    wx.showModal({
      title: '提示',
      content: '清除后会重新加载，确定清除？',
      success: function(res) {
        if (res.confirm) {
          wx.clearStorageSync()
          wx.showToast({
            title: '成功清除',
          })
          wx.reLaunch({
            url: '/pages/home/tosolve/tosolve',
          })
        }
      }
    })
  },

  showHelp: function() {
    wx.navigateTo({
      url: './help/help',
    })
  },

  showFeedback: function() {
    wx.navigateTo({
      url: './feedback/feedback',
    })
  },
  showConfig: function() {
    wx.navigateTo({
      url: './config/config',
    })
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  toface: function() {
    wx.navigateToMiniProgram({
      appId: 'wxaf249daf125d652c',
      path: 'pages/index/index',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release'
    })
  },
  //尝试获取formid
  pushformid: function(e) {
    wx.vibrateShort({})
    var that = this
    setnum(that)
    network.post('/user/pushformid', {
      'formid': e.detail.formId,
      'openid': app.globalData.openid
    })
  },


})

function setnum(that, count = -1) {
  if (!count) {
    that.setData({
      remainformidnum: 0,
      remainformidnumorstr: 0
    })
    return
  }
  if (count == -1) {
    that.setData({
      remainformidnum: that.data.remainformidnum + 1,
    })
    if (that.data.remainformidnum > 99) {
      that.setData({
        remainformidnumorstr: ">99",
      })
    } else {
      that.setData({
        remainformidnumorstr: that.data.remainformidnum,
      })
    }
    return
  }
  that.setData({
    remainformidnum: count,
    remainformidnumorstr: count
  })

}