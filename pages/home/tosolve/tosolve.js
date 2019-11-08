const app = getApp()
var util = require('../../../utils/util.js')
var sliderWidth = 96;
var network = require('../../../utils/network.js')
var config = require('../../../config.js')
var searchParam = []
var formerid = 0
var jinxuanformerid = 0
var qdata = null
var tmpactiveIndex = 0
var tmpgrade = 1 //1是不限

var formerid1 = 0
var tmpgrade1 = 1
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
    filtergrade: 0,

    flag1: true,//筛选页,true为无开屏
    problemlist1: [],
    grade1: 1,
    gradeStr1: '二年级',
    filtergrade1: 0,

    sliderOffset: 0,
    sliderLeft: 0,
    msg2: {
      icon: '/images/empty.png',
    },
    problemlist: [],
    jinxuanproblemlist: [],
    show: 'jigou',
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
    tmpgrade = e.currentTarget.dataset.id * 1
    this.setData({
      filtergrade: e.currentTarget.dataset.id * 1
    })
  },
  // 发现里面设置年级
  switchgrade1: function (e) {
    tmpgrade1 = e.currentTarget.dataset.id
    this.setData({
      filtergrade1: tmpgrade1
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

  showfilter1: function (e) {
    this.setData({
      flag1: false,
      filtergrade1: tmpgrade1
    })
  },
  confirmfilter: function (e) {
    console.log('tmpgrade: ', tmpgrade)
    this.setData({
      flag: true,
      activeIndex: tmpactiveIndex,
      grade: tmpgrade,
      activeIndexStr: util.tijis[tmpactiveIndex],
      gradeStr: util.filtergradearray[tmpgrade]
    })

    var that = this;
    that.formerid = 0
    if (tmpgrade == 0) {
      searchParam = []
    } else {
      searchParam = [util.filtergradearray[tmpgrade]]
    }

    if (tmpactiveIndex == '0') {
      network.post('/problem/getten', {
        'openid': app.globalData.openid,
        'formerid': 0,
        'filter': searchParam,
        'jinxuan': '0'
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
          that.formerid = filterproblist[filterproblist.length - 1]['problemid']
        }
      })
    } else {
      network.post('/problem/getten', {
        'openid': app.globalData.openid,
        'formerid': 0,
        'filter': searchParam,
        'jinxuan': '1'
      }, function (res) {
        var filterproblist = res.problem
        if (filterproblist == undefined) {
          that.setData({
            bottom: true,
            jinxuanproblemlist: []
          })
        } else {
          that.setData({
            jinxuanproblemlist: filterproblist,
          })
          that.jinxuanformerid = filterproblist[filterproblist.length - 1]['problemid']
        }
      })
    }
  },

  confirmfilter1: function (e) {
    this.setData({
      flag1: true,
      grade1: tmpgrade1,
      gradeStr1: util.filtergradearray[tmpgrade1]
    })

    var that = this;
    that.formerid1 = 0
    network.post('/problem/getnearbytenproblem', {
      'openid': app.globalData.openid,
      'formerid': 0,
      'scope': 'all',
      'grade': util.filtergradearray[tmpgrade1] || '',
    }, function (res) {
      var filterproblist = res.problems
      if (filterproblist == undefined) {
        that.setData({
          bottom: true,
          problemlist1: []
        })
      } else {
        that.setData({
          problemlist1: filterproblist,
        })
        that.formerid1 = filterproblist[filterproblist.length - 1]['problemid']
      }
    })

  },


  // 转换为发现页
  showdiscovery: function (e) {
    this.setData({
      show: 'discovery'
    })
  },
  // 转换为机构页
  showjigou: function (e) {
    this.setData({
      show: 'jigou'
    })
  },

  toschoolmate: function (e) {
    wx.navigateTo({
      url: '/pages/home/schoolmate/schoolmate',
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
          searchParam = [util.gradearray[app.globalData.grade]]
          util.getlastedprob(that, searchParam)
        } else {
          util.getlastedprob(that)
        }
      } else {
        that.load()
      }
    }, 500)
  },

  onLoad: function () {
    app.globalData.tosolvethat = this
    this.load()
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
        url: `/pages/settings/profile/profile?userid=${askerid}&avatar=${avatar}&username=${username}&openid=${openid}`,
      })
    }
  },

  conceal: function (e) {
    this.setData({ flag: true })
  },

  conceal1: function (e) {
    this.setData({ flag1: true })
  },

  rankshowmore: function (e) {
    var dataset = e.currentTarget.dataset
    if (openid == app.globalData.openid) {
      wx.switchTab({
        url: '/pages/settings/settings',
      })
    } else {
      wx.navigateTo({
        url: `/pages/settings/profile/profile?userid=${dataset.userid}&avatar=${dataset.avatar}&username=${dataset.username}&openid=${dataset.openid}`,
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
      that.formerid = 0
      util.getlastedprob(that, searchParam)
    } else if (that.data.activeIndex == '1') {
      that.jinxuanformerid = 0
      util.getlastedjinxuanprob(that, searchParam)
    }
    wx.stopPullDownRefresh() //停止下拉刷新
    wx.hideNavigationBarLoading()
  },

  onReachBottom: function () {
    var that = this
    if (tmpactiveIndex == '0') {
      util.get10prob(that, searchParam)
    } else if (that.data.activeIndex == '1') {
      util.get10jinxuanprob(that, searchParam)
    }
  },
})