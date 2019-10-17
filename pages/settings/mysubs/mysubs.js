const app = getApp()
var console = require('../../../utils/console.js')
var network = require('../../../utils/network.js')
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  data: {
    problemlist: null,
    subscriberlist: null,
    tabs: ["题目", "用户"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    icon: '../../../images/empty.png',
  },


  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },



  showmore: function(e) {
    var userid = e.currentTarget.dataset.userid
    var avatar = e.currentTarget.dataset.avatar
    var username = e.currentTarget.dataset.username
    var openid = app.globalData.openid
    wx.navigateTo({
      url: `../profile/profile?userid=${userid}&avatar=${avatar}&username=${username}&openid=${openid}`,
    })

  },

  bindTouchStart: function(e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function(e) {
    this.endTime = e.timeStamp;
  },

  bindLongTap: function(e) {
    var that = this
    var problemid = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success: function(res) {
        if (res.confirm) {
          network.post('/desubscribe', {
            'problemid': problemid,
            'userid': app.globalData.openid
          }, function() {
            wx.showToast({
              title: 'delete success',
            })
            that.onLoad()
          })

        }
      }
    })
  },

  bindQueTap: function(e) {
    if (this.endTime - this.startTime < 350) {
      var problemid = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/home/question/question?problemid=${problemid}`
      })
    }
  },

  tosolve: function(e) {
    network.post('/user/pushformid', {
      'formid': e.detail.formId,
      'openid': app.globalData.openid
    })
    wx.switchTab({
      url: '/pages/home/tosolve/tosolve',
    })
  },

  onLoad: function(options) {
    var that = this
    network.post('/problem/getmysubscribeprob', {
      'openid': app.globalData.openid
    }, function(res) {
      var problemlist = res.problem
      if (problemlist) {
        that.setData({
          problemlist: problemlist,
        })
      }

    })
    network.post('/problem/getmysubscribeuser', {
      'openid': app.globalData.openid
    }, function(res) {
      var subscriberlist = res.user
      if (subscriberlist) {
        that.setData({
          subscriberlist: subscriberlist
        })
      }
    })

    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    })

    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
})