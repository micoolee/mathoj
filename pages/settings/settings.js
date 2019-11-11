var app = getApp()
var util = require('../../utils/util.js')
var network = require('../../utils/network.js')
//var console = require('../../utils/console.js')
var config = require('../../config.js')
var remainformidnum = 0
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    hide: false,
    remainformidnumorstr: '',
    modalHidden: true,
    role: ''
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '[有人@我]数学题，你会做么',
        path: '/pages/home/homepage/homepage',
        imageUrl: config.host + '/swagger/mobiwusi.jpg',
        success: function (res) { }
      }
    }
  },

  onLoad: function (options) {
    console.log(app.globalData.selfuserid)
    var that = this
    if (app.globalData.grade == 0) {
      that.setData({
        modalHidden: false
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      role: util.rolemaps[app.globalData.role]
    })
    //获取瓶子数
    network.post('/user/getformidnum', {
      'userid': app.globalData.selfuserid
    }, function (res) {
      setnum(that, res.count)
    }, function () { }, function () {
      wx.hideLoading()
    })
  },

  onShow: function () {
    var that = this
    util.get_or_create_avatar(app.globalData.openid, that)
    if (app.globalData.reddot) {
      wx.showTabBarRedDot({
        index: 3,
      })
    }
  },
  showMyProf: function () {
    wx.navigateTo({
      url: './myprof/myprof',
    })
  },
  showMyQues: function () {
    wx.navigateTo({
      url: './myques/myques',
    })
  },

  showMyBrow: function () {
    wx.navigateTo({
      url: './myhist/myhist',
    })
  },

  showMySubs: function () {
    wx.navigateTo({
      url: './mysubs/mysubs',
    })
  },

  showMyComm: function () {
    wx.navigateTo({
      url: './mycomm/mycomm',
    })
  },
  showMyapply: function () {
    wx.navigateTo({
      url: './myapply/myapply',
    })
  },
  showAllApplys: function () {
    wx.navigateTo({
      url: './allapplys/allapplys',
    })
  },
  showMyStudents: function () {
    wx.navigateTo({
      url: './mystudents/mystudents',
    })
  },
  showMyTeachers: function () {
    wx.navigateTo({
      url: './myteachers/myteachers',
    })
  },
  showposter: function () {
    wx.navigateTo({
      url: './poster/poster',
    })
  },

  clearcache: function () {
    wx.showModal({
      title: '提示',
      content: '清除后会重新加载，确定清除？',
      success: function (res) {
        if (res.confirm) {
          wx.clearStorageSync()
          wx.showToast({
            title: '成功清除',
          })
          wx.reLaunch({
            url: '/pages/home/homepage/homepage',
          })
        }
      }
    })
  },

  showHelp: function () {
    wx.navigateTo({
      url: './help/help',
    })
  },

  showFeedback: function () {
    wx.navigateTo({
      url: './feedback/feedback',
    })
  },
  showConfig: function () {
    wx.navigateTo({
      url: './config/config',
    })
  },
  showSchoolConfig: function () {
    wx.navigateTo({
      url: './schoolconfig/schoolconfig',
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  toface: function () {
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
  pushformid: function (e) {
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
    remainformidnum = 0
    that.setData({
      remainformidnumorstr: 0
    })
    return
  }
  if (count == -1) {

    remainformidnum = remainformidnum + 1
    if (remainformidnum > 99) {
      that.setData({
        remainformidnumorstr: ">99",
      })
    } else {
      that.setData({
        remainformidnumorstr: remainformidnum,
      })
    }
    return
  }
  remainformidnum = count
  that.setData({
    remainformidnumorstr: count
  })

}