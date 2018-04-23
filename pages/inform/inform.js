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


  showzandetail:function(e){
    var problemid = e.currentTarget.dataset.problemid
    wx.navigateTo({
      url: `../question/question?problemid=${problemid}`
    })

  },



showsixin:function(){
  this.setData({
    sixindoor:false
  })
  app.globalData.sixindoor = false
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
    console.log(app.globalData.sixindoor)
    if(app.globalData.sixindoor){
      this.setData({
        sixindoor:true
      })
    }
    app.globalData.reddot = false
    this.setData({
      informlist:app.globalData.informlist
    })
    wx.hideTabBarRedDot({
      index: 2,
    })
  },
  onHide:function(){
    app.globalData.reddot = false
    wx.hideTabBarRedDot({
      index: 2,
    })
  }


})