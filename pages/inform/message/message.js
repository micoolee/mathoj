const app = getApp()
var util = require('../../../utils/util.js')


Page({
  data: {
    focus: false,
    inputValue: '',
    sessionlist: app.globalData.sessionlist,
    messagethat: null,
    sessionlistnull: 0,
    showdetail:false,
    icon: '../../../images/empty.png',
  },

  onLoad:function(){
    var that = this
    app.globalData.messagethat = that
    wx.showNavigationBarLoading()
    var that = this
    util.getsessions(that)
  },

  torank:function(){
    var that = this
    wx.switchTab({
      url: '/pages/top/top',
    })
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
            url: app.globalData.baseurl + '/message/deletesession',
            method:'POST',
            data: { 'sessionid': sessionid, 'openid': app.globalData.openid },
            success: function () {
              app.globalData.messagelist.del(index)
              that.setData({
                messagelist: app.globalData.messagelist
              })
              wx.showToast({
                title: '删除成功',
              })
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

      var sign = this.data.sessionlist[sessionindex].sixin[0]

      app.globalData.sessionindex = sessionindex
      if (sign['ziji'] == '2') {
        app.globalData.receiverid = sign['sender']

      }
      else {
        app.globalData.receiverid = sign['receiver']
      }
    
      
      var sessionid = that.data.sessionlist[sessionindex].sessionid
      wx.navigateTo({
        url: `../message/chat/chat?sessionlist=111&sessionid=${sessionid}&newsession=false`,
      })
      console.log(that.data.sessionlist[sessionindex].sessionid)
      wx.request({
        url: app.globalData.baseurl+'/message/readsession',
        method:'POST',
        data: {"session": that.data.sessionlist[sessionindex].sessionid},
        success:function(e){
          console.log(e)
        }
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
  },
  //退出时去除tarbar的reddot
  onUnload: function () {
    app.globalData.sixindoor = false
    wx.hideTabBarRedDot({
      index: 3,
    })
    if (app.globalData.informthat){
      app.globalData.informthat.setData({
        sixindoor: false
      })
    }
    

  }



})