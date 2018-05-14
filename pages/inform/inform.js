// pages/inform/inform.js
const app = getApp()
Page({

  /**
   * 页面的初始数据# 0:xitong tongzhi; 1:your problem has answer;2:your guanzhu problem has answer; 3:your comment be thumbed up 4: someone invite you 5:someone subscribe you
   */
  data: {
    informlist: [],
    sixindoor: false,
    icons: { '0': '../../images/system.png', '1': '../../images/key.png', '2': '../../images/key.png', '3': '../../images/zan.png', '4': '../../images/invite1.png','5':'../../images/subscribe.png','6':'../../images/accept.png' }
  },



  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },

  bindLongTap: function (e) {
    var that = this
    var informid = e.currentTarget.dataset.informid
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseurl + '/deleteinform/',
            data: { 'informid': informid},
            success: function () {
              wx.showToast({
                title: '删除成功',
              })
              app.getlastedinform(that)
            }
          })

        }
      }
    })

  },


  onLoad: function (options) {
    app.getlastedinform()

  },


  onPullDownRefresh: function () {

    wx.showNavigationBarLoading() //在标题栏中显示加载
    app.getlastedinform()
    wx.stopPullDownRefresh() //停止下拉刷新    

  },

  showzandetail: function (e) {
    var that = this
    if (this.endTime - this.startTime < 350) {
      var readed = e.currentTarget.dataset.readed
      var index = e.currentTarget.dataset.index
      var informid = e.currentTarget.dataset.informid
      if(e.currentTarget.dataset.informtype != '5'){

        var problemid = e.currentTarget.dataset.problemid

        if (readed == '0') {
          that.data.informlist[index].readed = '1'
          app.globalData.informlist = that.data.informlist

          wx.request({
            url: app.globalData.baseurl + '/updatereaded/',
            data: { 'informid': informid },
            success: function (res) {
            }
          })
        }

        wx.navigateTo({
          url: `../question/question?problemid=${problemid}`
        })

      }else{
        var sourcerid = e.currentTarget.dataset.sourcerid
        var avatar = e.currentTarget.dataset.avatar
        var username = e.currentTarget.dataset.username
        var openid = e.currentTarget.dataset.openid
        if (readed == '0') {
          that.data.informlist[index].readed = '1'
          app.globalData.informlist = that.data.informlist

          wx.request({
            url: app.globalData.baseurl + '/updatereaded/',
            data: { 'informid': informid },
            success: function (res) {
            }
          })
        }
        wx.navigateTo({
          url: `../settings/profile/profile?userid=${sourcerid}&avatar=${avatar}&username=${username}&openid=${openid}`,
        })


      }

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




  onReady: function () {
    var that = this
    app.globalData.informthat = that
  },




  onShow: function () {
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