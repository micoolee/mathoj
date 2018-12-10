// pages/document/chat/chat.js
const app = getApp()
var util = require('../../../../utils/util.js')
Page({
  data: {
    text: '',
    receiverid: null,
    
    sessionlistnull:null,
    showdetail:'nouse',
    sixinlist: [] ,
    success:'',
    sendmsg:''
  },

  onLoad: function () {
    var that = this
    app.globalData.chatroomthat = that
    that.setData({
      receiverid: app.globalData.receiverid,
      sixinlist: app.globalData.sessionlist[app.globalData.sessionindex].sixin
    })

    wx.pageScrollTo({
      scrollTop: app.globalData.sessionlist[app.globalData.sessionindex].sixin.length * 300
    })
  },

  onShow: function () {
    var that = this
    wx.pageScrollTo({
      scrollTop: app.globalData.sessionlist[app.globalData.sessionindex].sixin.length*300
    })
  },

  inputtext: function (e) {
    if (e.detail.value==''){
      this.setData({
        success: '',
        sendmsg:''
      })
    }else{
      this.setData({
        text: e.detail.value,
        success:'success',
        sendmsg:'sendmsg'
      })
    }

  },



  sendmsg: function (e) {
    var that = this
    var receiverid = this.data.receiverid
    var senderopenid = app.globalData.openid

    wx.request({
      url: app.globalData.baseurl + '/message/createsixin',
      data: { 'receiverid': receiverid, 'senderopenid': senderopenid, 'content': this.data.text},
      method:'POST',
      success: function (res) {
        if (res.data.result_code) {
          wx.showToast({
            title: '消息发送失败',
          })
        } else {
          var all = app.globalData.sessionlist[app.globalData.sessionindex]
          all.sixin.push({ 'ziji': "1", "senderavatar": app.globalData.avatar, "content":that.data.text})
          that.setData({
            text: '',
            sixinlist:all.sixin,
          })
          app.globalData.sessionlist[app.globalData.sessionindex] = all
          
        }
      }
    })
    

  },

})