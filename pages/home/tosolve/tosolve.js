const app = getApp()
var util = require('../../../utils/util.js')
var sliderWidth = 96;
var network = require('../../../utils/network.js')
var config = require('../../../config.js')
var searchParam = []
var formerid = 0
var solvedformerid = 0
var qdata = null
var tabTxtbak = ''
Page({
  data: {
    bottom: false,
    havenewbtn: false,
    inputvalue: null,
    tabs: ["题库", "精选"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    msg2: {
      icon: '/images/empty.png',
    },
    tabTxt: '',
    problemlist: [],
    solvedproblemlist: [],
  },

  tabClick: function (e) {
    var that = this
    if (app.globalData.grade != 0 && app.globalData.onlysee) {
      searchParam = [util.gradearray[app.globalData.grade]]
    } else {
      searchParam = []
    }
    that.setData({
      tabTxt: tabTxtbak,
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    })
    if (e.currentTarget.id == '1') {
      if (that.data.solvedproblemlist.length == 0) {
        util.getlastedsolvedprob(that, searchParam)
      }
    }
  },



  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      var problemid = res.target.dataset.problemid
      return {
        title: '[有人@我]发现一道智力题，考考你~',
        path: '/pages/home/question/question?problemid=' + problemid,
        imageUrl: config.host + '/static/sharepic.jpg',
      }
    }
    return {
      title: '[有人@我]发现一道智力题，考考你~',
      path: '/pages/home/tosolve/tosolve',
    }
  },



  filterTabChild: function (e) {
    formerid = 0
    var that = this;
    var index = e.currentTarget.dataset.index;
    var data = JSON.parse(JSON.stringify(that.data.tabTxt));
    var paramindex = e.detail.value

    if (paramindex == '0') {
      data[index].text = that.data.tabTxt[index].originalText;
      delete searchParam[index];
    } else {
      data[index].text = data[index]['child'][paramindex].text
      searchParam[index] = data[index]['child'][paramindex].text
    }
    that.setData({
      tabTxt: data
    })
    if (that.data.activeIndex == '0') {
      network.post('/problem/getten', {
        'formerid': formerid,
        'filter': searchParam,
        'solved': '0'
      }, function (res) {
        var filterproblist = res.problem
        if (filterproblist == undefined) {
          that.setData({
            bottom: true,
            problemlist: []
          })
        } else {
          that.setData({
            problemlist: filterproblist,
          })
          formerid = filterproblist[filterproblist.length - 1]['problemid']
        }
      })
    } else {
      network.post('/problem/getten', {
        'formerid': 0,
        'filter': searchParam,
        'solved': '1'
      }, function (res) {
        var filterproblist = res.problem
        if (filterproblist == undefined) {
          that.setData({
            bottom: true,
            solvedproblemlist: []
          })
        } else {
          that.setData({
            solvedproblemlist: filterproblist,
          })
          solvedformerid = filterproblist[filterproblist.length - 1]['problemid']
        }
      })
    }
  },

  toask: function () {
    var that = this
    if (app.globalData.authorized == 'true' || app.globalData.avatar != 'stranger') {
      wx.navigateTo({
        url: '../ask/ask',
      })
    } else {
      util.checkuserinfo(that)
    }
  },
  totop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  bindQueTap: function (e) {
    wx.navigateTo({
      url: `/pages/home/question/question?problemid=${e.currentTarget.dataset.id}`
    })
  },

  //轮询直到getopenid加载完毕
  load: function (e) {
    var that = this
    setTimeout(function () {
      if (app.globalData.getopenidok) {
        if (app.globalData.onlysee && app.globalData.grade != 0 && app.globalData.grade) {
          util.getlastedprob(that, [util.gradearray[app.globalData.grade]])

          searchParam = [util.gradearray[app.globalData.grade]]
        } else {
          util.getlastedprob(that)
        }
      } else {
        that.load()
      }
    }, 500)
  },

  onLoad: function () {
    var that = this
    app.globalData.tosolvethat = that
    that.setData({
      tabTxt: util.tabtxt,
    })
    tabTxtbak = util.tabtxt
    that.load()

    app.globalData.mapCtx = wx.createMapContext('map')
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
  },

  showmore: function (e) {
    var askerid = e.currentTarget.dataset.askerid
    var avatar = e.currentTarget.dataset.avatar
    var username = e.currentTarget.dataset.username
    var openid = e.currentTarget.dataset.openid
    //如果是自己
    if (openid == app.globalData.openid) {
      wx.switchTab({
        url: '/pages/settings/settings',
      })
    } else {
      wx.navigateTo({
        url: `../settings/profile/profile?userid=${askerid}&avatar=${avatar}&username=${username}&openid=${openid}`,
      })
    }
  },

  onShow: function () {
    var that = this
    if (app.globalData.reddot) {
      wx.showTabBarRedDot({
        index: 3,
      })
    }
    util.checklasted(that)
  },

  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    if (that.data.activeIndex == '0') {
      formerid = 0
      util.getlastedprob(that, searchParam)
    } else if (that.data.activeIndex == '1') {
      solvedformerid = 0
      util.getlastedsolvedprob(that, searchParam)
    }
    wx.stopPullDownRefresh() //停止下拉刷新                
  },

  onReachBottom: function () {
    var that = this
    if (that.data.activeIndex == '0') {
      util.get10prob(that, searchParam)
    } else if (that.data.activeIndex == '1') {
      util.get10solvedprob(that, searchParam)
    }
  },
})