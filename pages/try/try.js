// pages/try/try.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
  msg:null
  },

inputfunc:function(e){
this.setData({
  msg: e.detail.value
})
},


send:function(){
var that = this

  wx.sendSocketMessage({
    data: that.data.msg,
  })

},
  /**
   * 生命周期函数--监听页面加载
   */


close:function(){

  wx.closeSocket({

  })
  wx.onSocketClose(function (res) {
    console.log('WebSocket 已关闭！')
  })




},


  connect:function(){
    var that = this
    wx.connectSocket({
      url: 'ws://www.liyuanye.club/testwss/'
    })

    wx.onSocketOpen(function (res) {
      console.log('websocket opened')
    })

    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
    })

    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
      that.connect()
    })
  },

  onLoad: function (options) {
  
    this.connect()




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