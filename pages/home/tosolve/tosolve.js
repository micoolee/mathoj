const app = getApp()
var util = require('../../../utils/util.js')
var sliderWidth = 96;
var network = require('../../../utils/network.js')
var config = require('../../../config.js')
var searchParam = []
var formerid = 0
var solvedformerid = 0
var qdata = null
var tmpactiveIndex = 0
var tmpgrade = 1 //1是不限
Page({
  data: {
    bottom: false,
    havenewbtn: false,
    inputvalue: null,
    //点击确认筛选后传给后端的值
    activeIndex: 0,
    grade: 1,
    //点击确认筛选后展示的结果
    activeIndexStr: '题库',
    gradeStr: '二年级',
    //点击筛选中的值，实时展示
    filteractiveIndex: 0,
    filtergrade: 1,

    sliderOffset: 0,
    sliderLeft: 0,
    msg2: {
      icon: '/images/empty.png',
    },
    problemlist: [],
    solvedproblemlist: [],
    show: 'quanzi',
    ranklist: [],
    flag: true,//筛选页,true为无开屏
  },
  // 显示排行页
  showrank: function (e) {
    wx.showNavigationBarLoading()
    var that = this
    network.post('/problem/getrank', {}, function (res) {
      if (res.rankdetail) {
        that.setData({
          ranklist: res.rankdetail,
          show: 'rank'
        })
      } else {
        that.setData({
          ranklist: [],
          show: 'rank'
        })
      }

    }, function () { }, function () {
      wx.hideNavigationBarLoading()
    })
  },
  // 设置题集或者精选
  switchactiveIndex: function (e) {
    console.log('switchactiveIndex: ', e)
    tmpactiveIndex = e.currentTarget.dataset.id
    this.setData({
      filteractiveIndex: e.currentTarget.dataset.id
    })
  },
  // 设置年级
  switchgrade: function (e) {
    tmpgrade = e.currentTarget.dataset.id
    this.setData({
      filtergrade: e.currentTarget.dataset.id
    })
  },
  // 显示筛选
  showfilter: function (e) {
    this.setData({
      flag: false,
      filteractiveIndex: tmpactiveIndex,
      filtergrade: tmpgrade
    })
  },

  confirmfilter: function (e) {
    console.log('tmpgrade: ', tmpgrade)
    this.setData({
      flag: true,
      activeIndex: tmpactiveIndex,
      grade: tmpgrade,
      activeIndexStr: util.tijis[tmpactiveIndex],
      gradeStr: util.grades[tmpgrade]
    })
    formerid = 0
    var that = this;

    if (tmpgrade == 1) {
      searchParam = []
    } else {
      console.log('tmpgrade: ', tmpgrade)
      searchParam = [util.gradearray[tmpgrade]]
    }

    if (tmpactiveIndex == '0') {
      network.post('/problem/getten', {
        'formerid': 0,
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
        console.log('res: ', res)
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

  // 转换为发现页
  showdiscovery: function (e) {
    this.setData({
      show: 'discovery'
    })
  },
  // 转换为圈子页
  showquanzi: function (e) {
    this.setData({
      show: 'quanzi'
    })
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
  //放弃冒泡
  drop: function (e) {
    console.log('drop tap')
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
        if (app.globalData.onlysee && app.globalData.grade && app.globalData.grade != 0) {
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
    that.load()
    app.globalData.mapCtx = wx.createMapContext('map')
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

  conceal: function (e) {
    this.setData({ flag: true })
  },

  rankshowmore: function (e) {
    var dataset = e.currentTarget.dataset
    if (openid == app.globalData.openid) {
      wx.switchTab({
        url: '../settings/settings',
      })
    } else {
      wx.navigateTo({
        url: `../settings/profile/profile?userid=${dataset.userid}&avatar=${dataset.avatar}&username=${dataset.username}&openid=${dataset.openid}`,
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
    wx.hideNavigationBarLoading()
  },

  onReachBottom: function () {
    var that = this
    if (tmpactiveIndex == '0') {
      util.get10prob(that, searchParam)
    } else if (that.data.activeIndex == '1') {
      util.get10solvedprob(that, searchParam)
    }
  },
})