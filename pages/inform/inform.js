// pages/inform/inform.js
const app = getApp()
Page({

  /**
   * 页面的初始数据# 0:xitong tongzhi; 1:your problem has answer;2:your guanzhu problem has answer; 3:your comment be thumbed up 4: someone invite you 5:someone subscribe you
   */
  data: {
    informlist: [],
    sixindoor: false,
    icons: { '1': '../../images/system.png', '2': '../../images/subscribe.png', '3': '../../images/key.png', '4': '../../images/zan.png', '5': '../../images/zan.png', '6': '../../images/invite1.png','7':'../../images/accept.png' }
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
    wx.request({
      url: app.globalData.baseurl + '/message/checksession',
      data: { 'openid': app.globalData.openid },
      method: 'POST',
      success: function (res) {
        if (res.data.res) {
          that.setData({
            sixindoor: true
          })
        }
      }
    })
  },


  onPullDownRefresh: function () {

    wx.showNavigationBarLoading() //在标题栏中显示加载
    app.getlastedinform()
    wx.stopPullDownRefresh() //停止下拉刷新    
    wx.hideNavigationBarLoading() //完成停止加载

  },

  showzandetail: function (e) {
    var that = this
    var informid = e.currentTarget.dataset.informid
    if (this.endTime - this.startTime < 350) {
      var readed = e.currentTarget.dataset.readed
      var index = e.currentTarget.dataset.index
      
      if (e.currentTarget.dataset.informtype != '2' && e.currentTarget.dataset.informtype != '1'){

        var problemid = e.currentTarget.dataset.problemid

        if (readed == '0') {
          that.data.informlist[index].readed = '1'
          app.globalData.informlist = that.data.informlist

          wx.request({
            url: app.globalData.baseurl + '/message/read',
            method:'POST',
            data: { 'messageid': informid },
            success: function (res) {
            }
          })
        }

        wx.navigateTo({
          url: `../question/question?problemid=${problemid}`
        })

      } else if (e.currentTarget.dataset.informtype == '2'){
        var sourcerid = e.currentTarget.dataset.sourcerid
        var avatar = e.currentTarget.dataset.avatar
        var username = e.currentTarget.dataset.username
        var openid = e.currentTarget.dataset.openid
        if (readed == '0') {
          that.data.informlist[index].readed = '1'
          app.globalData.informlist = that.data.informlist

          wx.request({
            url: app.globalData.baseurl + '/message/read',
            data: { 'messageid': informid },
            method: 'POST',
            success: function (res) {
            }
          })
        }
        wx.navigateTo({
          url: `../settings/profile/profile?userid=${sourcerid}&avatar=${avatar}&username=${username}&openid=${openid}`,
        })


      }else{
        if (readed == '0') {
          that.data.informlist[index].readed = '1'
          app.globalData.informlist = that.data.informlist

          wx.request({
            url: app.globalData.baseurl + '/message/read',
            method: 'POST',
            data: { 'messageid': informid },
            success: function (res) {
            }
          })
        }
        wx.navigateTo({
          url: `/pages/howtouse/howtouse`,
        })
      }

    }else{
      wx.showModal({
        title: '提示',
        content: '是否删除',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.baseurl + '/message/delete',
              method:'POST',
              data: { 'messageid': informid,'openid':app.globalData.openid },
              success: function () {
                app.getlastedinform(that)
                wx.showToast({
                  title: '删除成功',
                })
              }
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
        url: '../settings/settings',
      })
    } else {
      wx.navigateTo({
        url: `../settings/profile/profile?userid=${sourcerid}&avatar=${avatar}&username=${username}&openid=${openid}`,
      })
    }


  },



  showsixin: function () {
    this.setData({
      sixindoor: false
    })
    app.globalData.sixindoor = false
    wx.navigateTo({
      url: '../inform/message/message',
    })
  },



  onShow: function () {
    var that = this
    if (app.globalData.sixindoor) {
      this.setData({
        sixindoor: true
      })
    }



    app.globalData.reddot = false
    this.setData({
      informlist: app.globalData.informlist
    })
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