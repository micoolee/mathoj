//app.js test

App({
  globalData: {
    userInfo: null,
    // baseurl: 'https://mathoj.liyuanye.club',
    // wssurl: 'wss://mathoj.liyuanye.club/testwss/',

    baseurl: 'http://192.168.0.174:8080',
    wssurl: 'ws://192.168.0.174:8080/user/createwss',


    mapCtx:null,
    openid: null,
    audiopath: null,
    audiopathbak: null,
    returnaudiopath: '',
    screenwidth: 0,
    screenheight: 0,
    messagelist: [],
    sessionlist:[],
    receiverid: null,
    closetime: 0,
    informthat: null,
    informlist: [],
    messagethat: null,
    reddot: false,
    sixindoor: false,
    nothissession: true,
    chatroomthat: null,
    searchlist: [],
    globalproblemlist: [],
    placeholder: '',
    answerlist:[],
    nickname:'路人甲',
    avatar:'stranger',
    authorized:'false',
    fromgetuserinfo:false,
    selfuserid:null,
    sessionindex:null,
  },

  getlastedinform: function (informthat = null) {
    var that = this

    wx.request({
      url: this.globalData.baseurl + '/message/getten',
      data: { 'openid': this.globalData.openid },
      method:'POST',
      success: function (res) {
        console.log(res.data.message)
        var informlist = res.data.message
        that.globalData.informlist = informlist
        if (that.globalData.informthat) {
          that.globalData.informthat.setData({
            informlist: informlist
          })
        }
      }
    })
  },

  connect: function () {

    var that = this
    wx.connectSocket({
      url: that.globalData.wssurl + '/'+that.globalData.selfuserid,
    })

    wx.onSocketOpen(function (res) {
      that.globalData.closetime = 0
      console.log('socket connect')
      wx.sendSocketMessage({
        data: {'openid': that.globalData.openid},
      })
      wx.onSocketMessage(function (res) {
        console.log(res.data)
        var tmp = JSON.parse(res.data)
        console.log(tmp)


        var all = that.globalData.sessionlist
        var singlemessage = tmp
        var one = singlemessage

        for (var i in all) { if (all[i].sessionid == one.sessionid) { all[i].sixin.push(one.sixin); that.globalData.nothissession = false } }
        if (all.length == 0 | that.globalData.nothissession) {
          all.unshift(one)
        }
        that.globalData.sessionlist = all
        if (that.globalData.informthat) {
          that.globalData.informthat.setData({
            sixindoor: true,
          })
        } else {
          that.globalData.sixindoor = true
        }

        if (that.globalData.messagethat) {
          that.globalData.messagethat.setData({
            sessionlist: all
          })
        }


        if (that.globalData.chatroomthat) {
          that.globalData.chatroomthat.setData({
            sixinlist: all[that.globalData.sessionindex].sixin
          })
          that.globalData.chatroomthat.refresh()
        }


      
        that.globalData.reddot = true
        wx.vibrateShort({
        })
        wx.showTabBarRedDot({
          index: 3,
        })
      
        
      
      })
    })
    wx.onSocketError(function (res) {
      that.globalData.closetime = that.globalData.closetime + 1
    })

    wx.onSocketClose(function (res) {
      console.log('socket close')
      setTimeout(that.connect, that.globalData.closetime * 1000)
    })
  },




  onLaunch: function () {
    var that = this
    wx.clearStorageSync()

    wx.login({
      success: res => {
        wx.request({
          data: { js_code: res.code },
          url: this.globalData.baseurl + '/user/getopenid',
          method: 'post',
          success: function (res) {
            var util = require('utils/util.js')
            
            that.globalData.openid = res.data.openid
            that.globalData.selfuserid = res.data.userid
            util.getsessions()
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
              success: res => {
                util.loading(that)
                that.globalData.userInfo = res.userInfo
                that.globalData.hasUserInfo = true
                that.globalData.nickname = res.userInfo.nickName
                that.globalData.avatar = res.userInfo.avatarUrl
              }
            })
            
            if(res.data.punish =='1'){
              wx.redirectTo({
                url: '/pages/getuserinfo/getuserinfo?status=1',
              })
            }
            that.connect()
          },
        })
      }
    })

    var a = wx.getSystemInfoSync()
    that.globalData.screenwidth = a.windowWidth
    that.globalData.screenheight = a.windowHeight
  },

})





