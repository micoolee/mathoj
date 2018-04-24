// pages/settings/profile/profile.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  userInfo:{},
  ziji:false,
  profileropenid:null
  },

sendsixin:function(e){

wx.navigateTo({
  url: `../../inform/message/chatroom/chatroom?receiverid=${e.currentTarget.dataset.userid}`,
})


},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      userInfo: { 'avatar': options.avatar, 'nickname': options.username, 'userid': options.userid,'profileropenid':options.openid}
    })

  },

subscribe:function(e){
wx.request({
  url: app.globalData.baseurl+'/subscribeuser/',
  data:{'userid':e.currentTarget.dataset.userid,'subscriberid':app.globalData.openid},
  success:function(res){
    wx.showToast({
      title: 'guan zhu chenggong',
    })
  }
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