const app = getApp()
var util = require('../../utils/util.js')
var getDateDiff = util.getDateDiff
var get_or_create_avatar = util.get_or_create_avatar
var sliderWidth = 96; 

Page({
  data: {
    userInfo: {},
    bottom: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    problempicsrc: 'null',
    animationData: null,
    door: true,
    formerid: null,
    lastedid: null,
    topStories: [],
    havenewbtn: false,
    searchcontent: null,
    inputvalue: null,
    problemlist: [],
    showsharedoor: false,
    shareindexlist: [],


    tabs: ["待解决", "已解决"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    q:null,

    tabTxt: [
      {
        'text': '年级',
        'originalText': '不限',
        'active': false,
        'child': [

          { 'id': 1, 'text': '二年级' },
          { 'id': 2, 'text': '三年级' },
          { 'id': 3, 'text': '四年级' },
          { 'id': 4, 'text': '五年级' },
          { 'id': 5, 'text': '六年级' },
          { 'id': 6, 'text': '初一' },

        ],
        'type': 0
      },
      {
        'text': '难易',
        'originalText': '不限',
        'active': false,
        'child': [
          { 'id': 1, 'text': '简单' },
          { 'id': 2, 'text': '困难' }
        ], 'type': 0
      },
      {
        'text': '奖励',
        'originalText': '不限',
        'active': false,
        'child': [
          { 'id': 1, 'text': '2' },
          { 'id': 2, 'text': '3' }
        ], 'type': 0
      }
    ],
    searchParam: [],
    solvedproblemlist: []
  },




  tabClick: function (e) {
    var that = this
    if (e.currentTarget.id == '1') {
      if (that.data.solvedproblemlist.length == 0) {
        util.getlastedsolvedprob(that)
      }
    }
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },



  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      var problemid = res.target.dataset.problemid
      return {
        title: '[有人@我]智力题，考考你~',

        path: '/pages/question/question?problemid=' + problemid,

        imageUrl: app.globalData.baseurl + '/static/sharepic.jpg',

        success: function (res) {


        }
      }

    }
    return {
      title: '[有人@我]智力题，考考你~',
      path: '/pages/tosolve/tosolve',
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },






  filterTab: function (e) {
    var that = this;
    var data = JSON.parse(JSON.stringify(that.data.tabTxt));
    var index = e.currentTarget.dataset.index;
    var newTabTxt = data.map(function (e) {
      e.active = false;
      return e;
    });
    newTabTxt[index].active = !that.data.tabTxt[index].active;
    this.setData({
      tabTxt: data
    })

  },



  filterTabChild: function (e) {

    //我需要切换选中项 修改展示文字 并收回抽屉  
    var that = this;
    var index = e.currentTarget.dataset.index;
    var data = JSON.parse(JSON.stringify(that.data.tabTxt));
    if (typeof (e.target.dataset.id) == 'undefined' || e.target.dataset.id == '') {
      data[index].active = !that.data.tabTxt[index].active;
    }
    else {
      data[index].type = e.target.dataset.id;
      data[index].active = !that.data.tabTxt[index].active;
      if (e.target.dataset.id == '0') {
        data[index].text = that.data.tabTxt[index].originalText;
        //不限删除条件
        delete that.data.searchParam[index];
      }
      else {
        data[index].text = e.target.dataset.txt;
        //更改删除条件
        that.data.searchParam[index] = data[index].text;
      }


    }

    that.setData({
      tabTxt: data
    })
    var searchparam = that.data.searchParam
    wx.request({
      url: app.globalData.baseurl + '/getfilterprob/',
      data: { 'filter': JSON.stringify(searchparam), 'solved': that.data.activeIndex },
      success: function (res) {
        var filterproblist = JSON.parse(res.data.json_data)
        var tmp = JSON.stringify(filterproblist).replace(/avatar":"(.*?avatar\/)([\w-]*)(.jpg)(.*?submittime":")([\d- :]*)/g, function ($0, $1, $2, $3, $4, $5) { var tmpstr = getDateDiff($5); var cachedoor = get_or_create_avatar($2); if (cachedoor) { var cacheavatar = cachedoor } else { var cacheavatar = $1 + $2 + $3 }; return ('avatar":"' + cacheavatar + $4 + tmpstr) })
        filterproblist = JSON.parse(tmp)
        var a = that.data.activeIndex
        if (a == '0') {
          that.setData({
            problemlist: filterproblist
          })
        } else {
          that.setData({
            solvedproblemlist: filterproblist
          })
        }

      }
    })


  },


  filteritem: function (searchparam, tmpproblemlist, tmplist) {
    if (typeof (searchparam[0]) != 'undefined' && searchparam[0] != '' && typeof (searchparam[1]) != 'undefined' && searchparam[1] != '') {
      for (var i in tmplist) { if (tmplist[i].grade == searchparam[0] && tmplist[i].easyclass == searchparam[1]) { tmpproblemlist.push(tmplist[i]) }; }

    }
    else {
      if (typeof (searchparam[0]) != 'undefined' && searchparam[0] != '') {
        for (var i in tmplist) { if (tmplist[i].grade == searchparam[0]) { tmpproblemlist.push(tmplist[i]) } }
      } else if (typeof (searchparam[1]) != 'undefined' && searchparam[1] != '') {
        for (var i in tmplist) { if (tmplist[i].easyclass == searchparam[1]) { tmpproblemlist.push(tmplist[i]) } }
      }

      else {
        for (var i in tmplist) { tmpproblemlist.push(tmplist[i]) }
      }
    }
  },





  showquestool: function () {
    wx.navigateTo({
      url: '../ask/ask',
    })
  },

  totop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },


  bindQueTap: function (event) {
    var problemid = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `../question/question?problemid=${problemid}`
    })
  },
  writesearch:function(e){
    this.setData({
      q:e.detail.value
    })
  },
  search: function (e) {
    var that = this
    var q = this.data.q
    if (q == '' || q == undefined) {
      wx.showModal({
        title: '提示',
        content: '关键词不能为空',
      })
    } else {
      wx.request({
        url: app.globalData.baseurl + '/mysearch/',
        data: { 'q': q },
        success: function (res) {
          that.setData({
            inputvalue: '',
            q:null
          })
          app.globalData.searchlist = res.data
          wx.navigateTo({
            url: `../searchres/searchres`,
          })
        }
      })
    }
  },
  onLoad: function () {
    var that = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              app.globalData.avatar = res.userInfo.avatarUrl
              app.globalData.nickname = res.userInfo.nickName
              loading(that)
              if (app.userInfoReadyCallback) {
                app.userInfoReadyCallback(res)
              }
            }, complete: function (res) {

            }
          })
        }
        else {
          wx.navigateTo({
            url: '/pages/getuserinfo/getuserinfo',
          })
        }
      },
      fail: function (res) {
      }
    })






    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况

      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        var that = this
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }






    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    util.getlastedprob(that)
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },


  showshare: function (e) {
    var index = e.target.dataset.shareindex
    var tmpshareindexlist = this.data.shareindexlist
    tmpshareindexlist[index] = '1'
    this.setData({
      shareindexlist: tmpshareindexlist
    })
  },


  clickshare: function (e) {
    this.setData({
      showsharedoor: false
    })
  },



  showmore: function (e) {
    var userid = e.currentTarget.dataset.userid
    var avatar = e.currentTarget.dataset.avatar
    var username = e.currentTarget.dataset.username
    var openid = e.currentTarget.dataset.openid

    if (openid == app.globalData.openid) {
      wx.switchTab({
        url: '../settings/settings',
      })
    } else {
      wx.navigateTo({
        url: `../settings/profile/profile?userid=${userid}&avatar=${avatar}&username=${username}&openid=${openid}`,
      })
    }


  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.reddot) {
      wx.showTabBarRedDot({
        index: 2,
      })
    }
    var that = this
    util.checklasted(that)


  },




  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    if (that.data.activeIndex == '0') {
      util.pulldown(that)
    } else if (that.data.activeIndex == '1') {
      util.getlastedsolvedprob(that)
    }
    wx.stopPullDownRefresh() //停止下拉刷新                
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    util.get10prob(that)
  },

})


function loading(that) {
  if (app.globalData.openid) {
    wx.showToast({
      title: '加载完成~',
    })
    uploadavatar()
    util.pulldownmessage()
    app.getlastedinform()

    that.onShow()
  } else {
    setTimeout(function () {
      wx.showLoading({
        title: '加载中',
      })
      loading(that)
    }, 100)
  }
}



function uploadavatar() {
  wx.request({
    url: app.globalData.baseurl + '/uploadavatar/',
    method: 'post',
    data: { 'userid': app.globalData.openid, 'username': app.globalData.nickname, 'avatar': app.globalData.avatar },
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  })


}