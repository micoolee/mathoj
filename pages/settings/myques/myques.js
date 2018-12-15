// pages/settings/myques/myques.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    problemlist:null,
    problemlistnull:0,
    icon: '../../../images/empty.png',
  },
  tosolve:function(){
    wx.switchTab({
      url: '../../tosolve/tosolve',
    })
  },
  bindQueTap: function (event) {
    var problemid = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `../../question/question?problemid=${problemid}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    wx.request({
      url: app.globalData.baseurl + '/problem/getmyproblem',
      method: 'post',
      data: { 'openid': app.globalData.openid },
      success: function (res) {
        if(res.data.myproblem){
          that.setData({
            problemlist: res.data.myproblem,
            problemlistnull: res.data.myproblem.length
          })
        }else{
          that.setData({
            problemlist: [],
            problemlistnull: 0
          })
        }

      }
    })

  },

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