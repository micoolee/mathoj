const app = getApp()
var util = require('../../../utils/util.js')
var sliderWidth = 96;
var console = require('../../../utils/console.js')
var network = require('../../../utils/network.js')
var config = require('../../../config.js')
Page({
  data: {
    userInfo: {},
    bottom: false,
    hasUserInfo: false,
    problempicsrc: 'null',
    animationData: null,
    door: true,
    formerid: 0,
    solvedformerid: 0,
    lastedid: null,
    topStories: [],
    havenewbtn: false,
    searchcontent: null,
    inputvalue: null,
    problemlist: [],
    zindex: false,

    tabs: ["题库", "好题"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    q: null,
    msg2: {
      icon: '../../../images/empty.png',
    },
    easyarray: ['不限', '困难', '简单'],
    rewardarray: ['不限', '1个奥币', '2个奥币', '3个奥币'],
    gradearray: ['不限', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三', '高一', '高二', '高三'],
    tabTxtbak: '',
    tabTxt: '',
    searchParam: [],
    solvedproblemlist: [],
    solvedformerid: 0
  },




  tabClick: function(e) {
    var that = this
    var a
    if (app.globalData.grade != 0 && app.globalData.onlysee) {
      a = [util.gradearray[app.globalData.grade]]
    } else {
      a = []
    }
    console.log(a)
    this.setData({
      searchParam: a,
      tabTxt: that.data.tabTxtbak,
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    })
    if (e.currentTarget.id == '1') {
      if (that.data.solvedproblemlist.length == 0) {
        util.getlastedsolvedprob(that, that.data.searchParam)
      }
    }
  },



  onShareAppMessage: function(res) {
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



  filterTabChild: function(e) {
    this.setData({
      zindex: false,
      formerid: 0
    })

    var that = this;
    var index = e.currentTarget.dataset.index;
    var data = JSON.parse(JSON.stringify(that.data.tabTxt));
    var paramindex = e.detail.value

    if (paramindex == '0') {
      data[index].text = that.data.tabTxt[index].originalText;
      delete that.data.searchParam[index];
    } else {
      data[index].text = data[index]['child'][paramindex].text
      that.data.searchParam[index] = data[index]['child'][paramindex].text

    }
    that.setData({
      tabTxt: data
    })
    if (that.data.activeIndex == '0') {
      network.post('/problem/getten', {
        'formerid': that.data.formerid,
        'filter': that.data.searchParam,
        'solved': '0'
      }, function(res) {
        var filterproblist = res.problem
        if (filterproblist == undefined) {
          that.setData({
            bottom: true,
            problemlist: []
          })
        } else {
          that.setData({
            problemlist: filterproblist,
            formerid: filterproblist[filterproblist.length - 1]['problemid'],
          })
        }
      })
    } else {
      network.post('/problem/getten', {
        'formerid': 0,
        'filter': that.data.searchParam,
        'solved': '1'
      }, function(res) {
        var filterproblist = res.problem
        if (filterproblist == undefined) {
          that.setData({
            bottom: true,
            solvedproblemlist: []
          })
        } else {
          that.setData({
            solvedproblemlist: filterproblist,
            solvedformerid: filterproblist[filterproblist.length - 1]['problemid'],
          })
        }
      })
    }
  },

  toask: function() {
    var that = this
    if (app.globalData.authorized == 'true' || app.globalData.avatar != 'stranger') {
      wx.navigateTo({
        url: '../ask/ask',
      })
    } else {
      util.checkuserinfo(that)
    }
  },
  totop: function() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  bindQueTap: function(e) {
    var problemid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/home/question/question?problemid=${problemid}`
    })
  },

  // 搜索框搜索
  writesearch: function(e) {
    this.setData({
      q: e.detail.value
    })
  },
  search: function(e) {
    var that = this
    var q = this.data.q
    if (q == '' || q == undefined) {
      wx.showModal({
        title: '提示',
        content: '关键词不能为空',
      })
    } else {
      network.post('/problem/search', {
        'content': q
      }, function(res) {
        that.setData({
          inputvalue: '',
          q: null
        })
        app.globalData.searchlist = res.problem
        wx.navigateTo({
          url: `/pages/home/searchres/searchres`,
        })
      })
    }
  },

  //轮询直到getopenid加载完毕
  load: function(e) {
    var that = this
    setTimeout(function() {
      if (app.globalData.getopenidok) {
        if (app.globalData.onlysee && app.globalData.grade != 0 && app.globalData.grade) {
          util.getlastedprob(that, [util.gradearray[app.globalData.grade]])
          that.setData({
            searchParam: [util.gradearray[app.globalData.grade]]
          })
        } else {
          util.getlastedprob(that)
        }
      } else {
        that.load()
      }
    }, 500)
  },

  onLoad: function() {
    var that = this
    app.globalData.tosolvethat = that
    that.setData({
      tabTxt: util.tabtxt,
      tabTxtbak: util.tabtxt,
    })
    that.load()

    app.globalData.mapCtx = wx.createMapContext('map')
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  showmore: function(e) {
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

  onShow: function() {
    var that = this
    if (app.globalData.reddot) {
      wx.showTabBarRedDot({
        index: 3,
      })
    }
    util.checklasted(that)
  },

  onPullDownRefresh: function() {
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    console.log(that.data.searchParam)
    if (that.data.activeIndex == '0') {
      that.setData({
        formerid: 0
      })
      util.getlastedprob(that, that.data.searchParam)
    } else if (that.data.activeIndex == '1') {
      that.setData({
        solvedformerid: 0
      })
      util.getlastedsolvedprob(that, that.data.searchParam)
    }
    wx.stopPullDownRefresh() //停止下拉刷新                
  },
  onReachBottom: function() {
    var that = this
    var searchparam = that.data.searchParam
    console.log(that.data.searchParam)
    if (that.data.activeIndex == '0') {
      util.get10prob(that, searchparam)
    } else if (that.data.activeIndex == '1') {
      util.get10solvedprob(that, searchparam)
    }
  },
})