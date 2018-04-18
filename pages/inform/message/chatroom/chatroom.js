// pages/message/chatroom/chatroom.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  text:null,
  receiverid:null,
  sessionindex:null,
  messagelist:[]
  },

  inputtext:function(e){
    this.setData({
      text:e.detail.value
    })
  },



sendmsg:function(e){
  var that = this
  var receiverid = e.currentTarget.dataset.userid
  var senderid = app.globalData.openid
  if(this.data.text !=null){
    wx.request({
      url: app.globalData.baseurl + '/sendsixin/',
      data: { 'receiverid': receiverid, 'senderid': senderid, 'message': this.data.text },
      success: function (res) {
        if(res.data!='200'){
          wx.showToast({
            title: 'send fail',
          })
        }
      }
    })
  }else{
    wx.showToast({
      title: 'input somthing',
    })
  }
  
},


onPullDownRefresh: function () {
  var that = this
  console.log('--------下拉刷新-------')
  wx.showNavigationBarLoading() //在标题栏中显示加载
  util.pulldownchatroom(that)
  wx.stopPullDownRefresh() //停止下拉刷新                
},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      receiverid:options.receiverid,
      sessionindex:options.sessionindex
    })
    app.globalData.chatroomthat = that
    if(options.messagelist){
      // var messagelist = JSON.parse(options.messagelist)

      this.setData({
        messagelist: app.globalData.conversationdetaillist,
        receiverid: app.globalData.receiverid
      })
    }
  },

  onShow:function(){
    app.globalData.conversationindex=this.data.sessionindex
  }

})