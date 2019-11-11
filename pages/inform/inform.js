// pages/inform/inform.js
const app = getApp()
//var console = require('../../utils/console.js')
var network = require('../../utils/network.js')
Page({

  data: {
    informlist: [],
    icons: {
      '1': 'mathojxixitongxiaoxi',
      '2': 'mathojdingyue',
      '3': 'mathojdaanjiexi',
      '4': 'mathojdianzan_active',
      '5': 'mathojdianzan_active',
      '6': 'mathojyaoqing',
      '7': 'mathojbeicaina'
    }
  },

  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },

  onLoad: function () {
    var that = this
    app.globalData.informthat = that
    app.getlastedinform()
  },


  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    app.getlastedinform()
    wx.stopPullDownRefresh() //停止下拉刷新    
    wx.hideNavigationBarLoading() //完成停止加载
  },

  showinformdetail: function (e) {
    var that = this
    var informid = e.currentTarget.dataset.informid
    if (this.endTime - this.startTime < 350) {
      var readed = e.currentTarget.dataset.readed
      var index = e.currentTarget.dataset.index

      if (e.currentTarget.dataset.informtype != '2' && e.currentTarget.dataset.informtype != '1') {

        var problemid = e.currentTarget.dataset.problemid

        if (readed == '0') {
          that.data.informlist[index].readed = '1'
          app.globalData.informlist = that.data.informlist
          network.post('/message/read', {
            'messageid': informid
          })
        }

        wx.navigateTo({
          url: `/pages/home/question/question?problemid=${problemid}`
        })

      } else if (e.currentTarget.dataset.informtype == '2') {
        var sourcerid = e.currentTarget.dataset.sourcerid
        var avatar = e.currentTarget.dataset.avatar
        var username = e.currentTarget.dataset.username
        var openid = e.currentTarget.dataset.openid
        if (readed == '0') {
          that.data.informlist[index].readed = '1'
          app.globalData.informlist = that.data.informlist
          network.post('/message/read', {
            'messageid': informid
          })
        }
        wx.navigateTo({
          url: `/pages/settings/profile/profile?userid=${sourcerid}&avatar=${avatar}&username=${username}&openid=${openid}`,
        })


      } else {
        if (readed == '0') {
          that.data.informlist[index].readed = '1'
          app.globalData.informlist = that.data.informlist
          network.post('/message/read', {
            'messageid': informid
          })
        }
        console.log('帮助页面')
      }

    } else {
      wx.showModal({
        title: '提示',
        content: '是否删除',
        success: function (res) {
          if (res.confirm) {
            network.post('/message/delete', {
              'messageid': informid,
              'openid': app.globalData.openid
            }, function () {
              app.getlastedinform(that)
              wx.showToast({
                title: '删除成功',
              })
            })

          }
        }
      })
    }
  },

  showmore: function (e) {
    var sourcerid = e.currentTarget.dataset.sourcerid
    var avatar = e.currentTarget.dataset.avatar
    var username = e.currentTarget.dataset.username
    var openid = e.currentTarget.dataset.openid

    if (openid == app.globalData.openid) {
      wx.switchTab({
        url: '/pages/settings/settings',
      })
    } else {
      wx.navigateTo({
        url: `/pages/settings/profile/profile?userid=${sourcerid}&avatar=${avatar}&username=${username}&openid=${openid}`,
      })
    }
  },





  onShow: function () {
    var that = this




    app.globalData.reddot = false
    if (app.globalData.informlist) {
      this.setData({
        informlist: app.globalData.informlist
      })
    }

    wx.hideTabBarRedDot({
      index: 2,
    })
  },

  onHide: function () {
    app.globalData.reddot = false
    wx.hideTabBarRedDot({
      index: 2,
    })
  }


})