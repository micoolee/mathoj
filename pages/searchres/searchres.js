// pages/searchres/searchres.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  searchlist:[],
  searchlistnull:0,
    msg2: {
      icon: '../../images/empty.png',
      buttons: [{
        text: '随便逛逛',
      }],
    },
  },
  toindex:function(){
    wx.navigateBack({
      url: '../tosolve/tosolve'
    })
  },

  bindQueTap: function (e) {
    var problemid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../question/question?problemid=${problemid}`
    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var searchlist = app.globalData.searchlist
    if (!searchlist){
      this.setData({
        searchlist: [],
        searchlistnull: 0
      })
    }else{
      this.setData({
        searchlist: searchlist,
        searchlistnull: searchlist.length
      })
    }

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