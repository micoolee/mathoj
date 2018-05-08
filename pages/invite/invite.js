// pages/invite/invite.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  problemid:null
  },

invite:function(e){
  var beinviter = e.currentTarget.dataset.besubscriber
  var inviter = app.globalData.openid
  var that = this
  wx.request({
    url: app.globalData.baseurl+'/invite/',
    data:{'inviteruserid':inviter,'beinviterid':beinviter,'problemid':that.data.problemid},
    success:function(res){
      console.log(res)
    }
  })

},



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      problemid:options.problemid
    })
    wx.request({
      url: app.globalData.baseurl + '/getinvitelist/',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: { 'userid': app.globalData.openid },
      success: function (res) {

        var subscriberlist = JSON.parse(res.data.subscriberlist)
        if(subscriberlist.length==0){
          wx.showToast({
            title: '请关注后再邀请',
          })
        }
        that.setData({

          subscriberlist: subscriberlist

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