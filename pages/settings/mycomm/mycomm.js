// pages/settings/mycomm/mycomm.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  commentlist:[],
  commentlistnull:0,
  loadok:false,

  icon: '../../../images/empty.png',

  },

  tosolve: function () {
    wx.switchTab({
      url: '../../tosolve/tosolve',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/problem/getmycomment',
      method: 'post',

      data: { 'openid': app.globalData.openid },
      success: function (res) {
        if (res.data.mycomment){
          that.setData({
            commentlist: res.data.mycomment,
            commentlistnull: res.data.mycomment.length,
            loadok: true
          })
        }else{
          that.setData({
            commentlist: [],
            commentlistnull: 0,
            loadok: true
          })
        }

      }
    })
  },



  bindQueTap: function (e) {
      var problemid = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `../../question/question?problemid=${problemid}`
      })

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