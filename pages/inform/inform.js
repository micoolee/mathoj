// pages/inform/inform.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  informlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },


showsixin:function(){
  wx.navigateTo({
    url: '../inform/message/message',
  })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    app.globalData.informthat = that
  },

  /**
   * 生命周期函数--监听页面显示
   */
  print:function(){
    console.log('print')
  },


  onShow: function () {

  
    this.setData({
      informlist:app.globalData.informlist
    })
    wx.hideTabBarRedDot({
      index: 2,
    })
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