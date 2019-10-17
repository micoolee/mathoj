App({
  globalData: {
    userInfo: null,
    mapCtx: null,
    openid: null,
    audiopath: null,
    audiopathbak: null,
    returnaudiopath: '',
    screenwidth: 0,
    screenheight: 0,
    messagelist: [],
    sessionlist: [],
    receiverid: null,
    closetime: 0,
    informthat: null,
    informlist: [],
    messagethat: null,
    reddot: false,
    sixindoor: false,
    chatroomthat: null,
    searchlist: [],
    placeholder: '',
    answerlist: [],
    nickname: '路人甲',
    avatar: 'stranger',
    authorized: 'false',
    fromgetuserinfo: false,
    selfuserid: null,
    sessionindex: null,
    grade: null,
    onlysee: true,
    tosolvethat: null,
    getopenidok: false,
    logged: true //今天是否登录了，用于upload头像
  },

  getlastedinform: function (informthat = null) {
    var network = require('./utils/network.js')
    var that = this;
    network.post('/message/getten', {
      'openid': this.globalData.openid
    }, function (res) {
      var informlist = res.message
      that.globalData.informlist = informlist
      if (that.globalData.informthat) {
        that.globalData.informthat.setData({
          informlist: informlist
        })
      }
    })
  },

  connect: function () {
    var config = require('./config.js')
    var that = this
    wx.connectSocket({
      url: config.wssurl + '/' + that.globalData.selfuserid,
    })

    wx.onSocketOpen(function (res) {
      that.globalData.closetime = 0
      console.log('socket connect')
      wx.sendSocketMessage({
        data: {
          'openid': that.globalData.openid
        },
      })
      wx.onSocketMessage(function (res) {
        var singlemessage = JSON.parse(res.data)
        var all = that.globalData.sessionlist
        var index = null
        for (var i in all) {
          if (all[i].sessionid == singlemessage.sessionid) {
            all[i].sixin.push(singlemessage.sixin);
            index = i
          }
        }
        if (all.length == 0 | index == null) {
          all.unshift(singlemessage)
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

        if (that.globalData.chatroomthat && index != null) {
          that.globalData.chatroomthat.setData({
            sixinlist: all[index].sixin
          })
          that.globalData.chatroomthat.refresh()
        }

        that.globalData.reddot = true
        wx.vibrateShort({})
        wx.showTabBarRedDot({
          index: 3,
        })

      })
    });
    wx.onSocketError(function (res) {
      that.globalData.closetime = that.globalData.closetime + 1
    });

    wx.onSocketClose(function (res) {
      console.log('socket close');
      setTimeout(that.connect, that.globalData.closetime * 1000)
    })
  },


  login_getopenid: function (res) {
    var util = require('utils/util.js')
    var network = require('./utils/network.js')
    var that = this
    network.post('/user/getopenid', {
      js_code: res.code
    }, function (res) {
      that.globalData.openid = res.openid
      that.globalData.selfuserid = res.userid
      that.globalData.grade = res.grade || 0
      that.globalData.onlysee = res.onlysee || false
      that.globalData.getopenidok = true
      that.globalData.logged = res.logged
      util.getsessions(that)

      wx.getUserInfo({
        success: res => {
          util.loading(that)
          that.globalData.userInfo = res.userInfo
          that.globalData.hasUserInfo = true
          that.globalData.nickname = res.userInfo.nickName
          that.globalData.avatar = res.userInfo.avatarUrl
        }
      })

      if (res.punish && res.punish == '1') {
        wx.redirectTo({
          url: '/pages/getuserinfo/getuserinfo?status=1',
        })
      }
      that.connect()
    }, function (e) {
      console.log('login_getopenid:', e)
      setTimeout(function (e) {
        that.login_getopenid(res)
      }, 1000)
    }, function (e) {
      wx.hideLoading()
    })
  },

  onLaunch: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      success: res => {
        that.login_getopenid(res)
      }
    })
    var a = wx.getSystemInfoSync()
    that.globalData.screenwidth = a.windowWidth
    that.globalData.screenheight = a.windowHeight
  },

})