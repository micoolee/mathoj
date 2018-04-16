// pages/inform/inform.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  informlist:[],
  sixindoor:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  onPullDownRefresh:function(){
    app.getlastedinform()
  },


showsixin:function(){
  this.setData({
    sixindoor:false
  })
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

  print:function(){
    console.log('print')
  },


  onShow: function () {

    app.globalData.reddot = false
    this.setData({
      informlist:app.globalData.informlist
    })
    wx.hideTabBarRedDot({
      index: 2,
    })
  },


})