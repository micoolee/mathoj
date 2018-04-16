const app = getApp()
var util = require('../../../utils/util.js')





Page({
  data: {
    focus: false,
    inputValue: '',
    messagelist: app.globalData.messagelist,
    messagethat:null
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
    wx.showNavigationBarLoading()
    util.pulldownmessage(that)
    wx.stopPullDownRefresh() 
  },

  onShow:function(){
    app.globalData.reddot=false
    app.globalData.messagethat = this
    this.setData({
      messagelist: app.globalData.messagelist
    })
  }


})