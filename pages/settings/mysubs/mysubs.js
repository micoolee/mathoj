// pages/settings/myques/myques.js
const app = getApp()

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    problemlist: null,
    subscriberlist:null,
    tabs: ["题目", "用户"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },


  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },



  showmore: function (e) {
    var userid = e.currentTarget.dataset.userid
    var avatar = e.currentTarget.dataset.avatar
    var username = e.currentTarget.dataset.username
    var openid = app.globalData.openid


      wx.navigateTo({
        url: `../profile/profile?userid=${userid}&avatar=${avatar}&username=${username}&openid=${openid}`,
      })
    


  },










  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },

  bindLongTap: function (e) {
    var that = this
    var problemid = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseurl + '/desubscribe/',
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




  bindQueTap: function (e) {
    if (this.endTime - this.startTime < 350) {
      var problemid = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `../../question/question?problemid=${problemid}`
      })
    }
  },






  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this

      wx.request({
        url: app.globalData.baseurl + '/mysubs/',
        method: 'post',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: { 'userid': app.globalData.openid },
        success: function (res) {
          var problemlist = JSON.parse(res.data.json_data)
          var subscriberlist = JSON.parse(res.data.subscriberlist)
          that.setData({
            problemlist: problemlist,
            subscriberlist :subscriberlist

          })
        }
      })
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    


  
    






    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });














  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})