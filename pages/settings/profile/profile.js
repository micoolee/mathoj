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
  // var receiverid = e.currentTarget.dataset.userid
  // var senderid = app.globalData.openid 
  // wx.request({
  //   url: app.globalData.baseurl+'/sendsixin/',
  //   data:{'receiverid':receiverid,'senderid':senderid,'message':'hello world'},
  //   success:function(){
  //     wx.showToast({
  //       title: 'send successfully',
  //     })
  //   }
  // })
wx.navigateTo({
  url: `../../message/chatroom/chatroom?receiverid=${e.currentTarget.dataset.userid}`,
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