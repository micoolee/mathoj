App({
  globalData: {
    role: '',//登陆人的角色
    school: '',//登陆人的学校（如果有的话）
    userInfo: null,
    openid: null,
    audiopath: null,
    screenwidth: 0,
    screenheight: 0,
    messagelist: [],
    receiverid: null,
    informthat: null,
    informlist: undefined,
    reddot: false,
    searchlist: [],
    // placeholder: '',
    nickname: '路人甲', //用户的昵称
    avatar: 'stranger',//用户头像
    authorized: 'false', //用户是否授权了个人信息
    fromgetuserinfo: false,//来自授权页
    selfuserid: null, //user表的userid，time生成
    grade: null,
    onlysee: true,
    homepagethat: null,
    getopenidok: false,//是否获取到了openid
    logged: true //今天是否登录了，用于upload头像
  },
  //最开始启动的地方
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
          informlist: informlist || [],
          multichose: false,
          allchecked: false
        })
      }
    }, function () { }, function () {
      wx.hideNavigationBarLoading() //完成停止加载
    })
  },


  login_getopenid: function (res) {
    var util = require('./utils/util.js')
    var network = require('./utils/network.js')
    var that = this
    network.post('/user/getopenid', {
      js_code: res.code
    }, function (res) {
      that.globalData.openid = res.openid
      that.globalData.selfuserid = res.userid
      that.globalData.grade = res.grade || 0
      that.globalData.onlysee = res.onlysee || false
      that.globalData.logged = res.logged
      that.globalData.role = res.role
      that.globalData.school = res.schoolid || ''
      that.globalData.getopenidok = true
      that.globalData.avatar = res.avatar
      console.log('that.globalData.avatar: ', that.globalData.avatar)
      wx.getUserInfo({
        success: res => {
          that.globalData.hasUserInfo = true
          that.globalData.userInfo = res.userInfo
          util.loading(that)
        },
        fail: res => {
          wx.navigateTo({
            url: '/pages/getuserinfo/getuserinfo',
          })
        }
      })
      //是否关小黑屋
      if (res.punish == '1') {
        wx.redirectTo({
          url: '/pages/getuserinfo/getuserinfo?status=1',
        })
      }
    }, function (e) {
      setTimeout(function (e) {
        that.login_getopenid(res)
      }, 1000)
    }, function (e) {
      wx.hideLoading()
    })
  },
})