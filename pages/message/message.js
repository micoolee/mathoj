const app = getApp()
var util = require('../../utils/util.js')





Page({
  data: {
    focus: false,
    inputValue: '',
    messagelist: app.globalData.messagelist
  },


  onLoad: function () {
    this.onPullDownRefresh()
  },

  enterconversation: function (e) {
    var sessionindex = e.currentTarget.dataset.sessionindex
    var msg = JSON.stringify(this.data.messagelist[sessionindex])
    if (this.data.messagelist[sessionindex].value[0]['ziji'] == '0') {
      var receiverid = this.data.messagelist[sessionindex].value[0]['sender_id']

    }
    else {
      var receiverid = this.data.messagelist[sessionindex].value[0]['receiver_id']
    }
    app.globalData.conversationdetaillist = this.data.messagelist[sessionindex]
    app.globalData.receiverid = receiverid
    wx.navigateTo({
      url: `../message/chatroom/chatroom?messagelist=${msg}&receiverid= ${receiverid}`,
    })

  },



  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    util.pulldownmessage(that)
    wx.stopPullDownRefresh() //停止下拉刷新                
  },

  onShow:function(){

    this.setData({
      messagelist: app.globalData.messagelist
    })
  }


})