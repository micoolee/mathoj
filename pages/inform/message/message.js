const app = getApp()
var util = require('../../../utils/util.js')


Page({
  data: {
    focus: false,
    inputValue: '',
    messagelist: app.globalData.messagelist,
    messagethat: null,
    messagelistnull: 0,
    showdetail:false
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
      var n = 0
      for (var i = 0; i<this.length; i++) {
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
              that.setData({
                messagelist: app.globalData.messagelist
              })
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





  showmore: function (e) {
    var sourcerid = e.currentTarget.dataset.sourcerid
    var avatar = e.currentTarget.dataset.avatar
    var username = e.currentTarget.dataset.username
    var openid = e.currentTarget.dataset.openid

    if (openid == app.globalData.openid) {
      wx.switchTab({
        url: '../../settings/settings',
      })
    } else {
      wx.navigateTo({
        url: `../../settings/profile/profile?userid=${sourcerid}&avatar=${avatar}&username=${username}&openid=${openid}`,
      })
    }
  },



  enterconversation: function (e) {
    var that = this
    if (this.endTime - this.startTime < 350) {
      var sessionindex = e.currentTarget.dataset.sessionindex
      var msg = JSON.stringify(this.data.messagelist[sessionindex])
      if (this.data.messagelist[sessionindex].value[0]['ziji'] == '0') {
        var receiverid = this.data.messagelist[sessionindex].value[0]['sender_id']
        var userid = this.data.messagelist[sessionindex].value[0]['receiver_id']

      }
      else {
        var receiverid = this.data.messagelist[sessionindex].value[0]['receiver_id']
        var userid = this.data.messagelist[sessionindex].value[0]['sender_id']
      }
      app.globalData.conversationdetaillist = this.data.messagelist[sessionindex]
      app.globalData.receiverid = receiverid

      wx.navigateTo({
        url: `../message/chatroom/chatroom?messagelist=111&receiverid= ${receiverid}&sessionindex=${sessionindex}`,
      })

      wx.request({
        url: app.globalData.baseurl+'/updatesixintoread/',
        data: { "user_id": userid, "sessionid": that.data.messagelist[sessionindex].value[0]['sessionid']}
      })

      app.globalData.messagelist[sessionindex].value[0].readedsign='1'


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