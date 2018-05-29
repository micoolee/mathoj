// pages/settings/myques/myques.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    problemlist: null,
    problemlistnull: 0,
    loadok: false
  },

  tosolve: function () {
    wx.switchTab({
      url: '../../tosolve/tosolve',
    })
  },


  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },
  bindQueTap: function (e) {
    if (this.endTime - this.startTime < 350) {
      var problemid = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `../../question/question?problemid=${problemid}`
      })
    }
  },
  bindLongTap: function (e) {
    var problemid = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseurl + '/deletehist/',
            data: { 'problemid': problemid, 'userid': app.globalData.openid },
            success: function () {
              wx.showToast({
                title: 'delete success',
              })
              that.onLoad()
            }
          })



        }
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    wx.request({
      url: app.globalData.baseurl + '/myhist/',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: { 'userid': app.globalData.openid },
      success: function (res) {
        that.setData({
          loadok: true,
          problemlist: res.data,
          problemlistnull: res.data.length
        })
      }
    })



  },

  onReady: function () {

  },


  onShow: function () {

  },


  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },


  onShareAppMessage: function () {

  }
})