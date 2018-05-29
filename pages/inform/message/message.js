const app = getApp()
var util = require('../../../utils/util.js')


Page({
  data: {
    focus: false,
    inputValue: '',
    messagelist: app.globalData.messagelist,
    messagethat: null,
    messagelistnull: 0
  },

  torank:function(){
    var that = this
    wx.switchTab({
      url: '/pages/top/top',
    })
  },


  onLoad: function () {
    var that = this
    util.pulldownmessage(that)
  },




  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },




  bindLongTap: function (e) {

    Array.prototype.del = function (index) {
      if (isNaN(index) || index >= this.length) {
        return false;
      }
      for (var i = 0; n = 0; i++) {
        if (this[i] != this[index]) {
          this[n++] = this[i];
        }
      }
      this.length -= 1;
    };




    var that = this
    var sessionid = e.currentTarget.dataset.sessionid
    var index = e.currentTarget.dataset.sessionindex
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseurl + '/deleteconversation/',
            data: { 'sessionid': sessionid, 'userid': app.globalData.openid },
            success: function () {
              app.globalData.messagelist.del(index)
              wx.showToast({
                title: '删除成功',
              })
              // that.onLoad()


            }
          })

        }
      }
    })

  },









  enterconversation: function (e) {
    if (this.endTime - this.startTime < 350) {
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
        url: `../message/chatroom/chatroom?messagelist=111&receiverid= ${receiverid}&sessionindex=${sessionindex}`,
      })
    }
  },



  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading()
    util.pulldownmessage(that)
    wx.stopPullDownRefresh()
  },

  onShow: function () {
    app.globalData.reddot = false
    app.globalData.messagethat = this
    this.setData({
      messagelist: app.globalData.messagelist,
      messagelistnull: app.globalData.messagelist.length
    })

  },
  onUnload: function () {
    app.globalData.sixindoor = false
    app.globalData.informthat.setData({
      sixindoor: false
    })
  }

})