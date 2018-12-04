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
    zindex:false,

    tabs: ["待解决", "已解决"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    q:null,

    easyarray: ['不限','困难' , '简单'],
    rewardarray: ['不限', '1个奥币', '2个奥币', '3个奥币'],
    gradearray: ['不限', '一年级' ,'二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三','高一','高二','高三'],


    tabTxtbak: [
      {
        'text': '年级',
        'originalText': '不限',
        'value': ['不限', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三', '高一', '高二', '高三'],
        'active': false,
        'child': [
          { 'id': 0, 'text': '不限' },
          { 'id': 1, 'text': '一年级' },
          { 'id': 2, 'text': '二年级' },
          { 'id': 3, 'text': '三年级' },
          { 'id': 4, 'text': '四年级' },
          { 'id': 5, 'text': '五年级' },
          { 'id': 6, 'text': '六年级' },
          { 'id': 7, 'text': '初一' },
          { 'id': 8, 'text': '初二' },
          { 'id': 9, 'text': '初三' },
          { 'id': 10, 'text': '高一' },
          { 'id': 11, 'text': '高二' },
          { 'id': 12, 'text': '高三' },

        ],
        'type': 0
      },
      {
        'text': '难易',
        'originalText': '不限',
        'active': false,
        'value': ['不限', '简单', '困难'],
        'child': [
          { 'id': 0, 'text': '不限' },
          { 'id': 1, 'text': '简单' },
          { 'id': 2, 'text': '困难' }
        ], 'type': 0
      },
      {
        'text': '奖励',
        'originalText': '不限',
        'value': ['不限', '1个奥币', '2个奥币', '3个奥币'],
        'active': false,
        'child': [
          { 'id': 0, 'text': '不限' },
          { 'id': 1, 'text': '1个奥币' },
          { 'id': 2, 'text': '2个奥币' },
          { 'id': 3, 'text': '3个奥币' }
        ], 'type': 0
      }
    ],



    tabTxt: [
      {
        'text': '年级',
        'originalText': '不限',
        'value': ['不限', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三', '高一', '高二', '高三'],
        'active': false,
        'child': [
          { 'id': 0, 'text': '不限' },
          { 'id': 1, 'text': '一年级' },
          { 'id': 2, 'text': '二年级' },
          { 'id': 3, 'text': '三年级' },
          { 'id': 4, 'text': '四年级' },
          { 'id': 5, 'text': '五年级' },
          { 'id': 6, 'text': '六年级' },
          { 'id': 7, 'text': '初一' },
          { 'id': 8, 'text': '初二' },
          { 'id': 9, 'text': '初三' },
          { 'id': 10, 'text': '高一' },
          { 'id': 11, 'text': '高二' },
          { 'id': 12, 'text': '高三' },

        ],
        'type': 0
      },
      {
        'text': '难易',
        'originalText': '不限',
        'active': false,
        'value': ['不限', '简单', '困难'],
        'child': [
          { 'id': 0, 'text': '不限' },
          { 'id': 1, 'text': '简单' },
          { 'id': 2, 'text': '困难' }
        ], 'type': 0
      },
      {
        'text': '奖励',
        'originalText': '不限',
        'value': ['不限', '1个奥币', '2个奥币', '3个奥币'],
        'active': false,
        'child': [
          { 'id': 0, 'text': '不限' },
          { 'id': 1, 'text': '1个奥币' },
          { 'id': 2, 'text': '2个奥币' },
          { 'id': 3, 'text': '3个奥币' }
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
      searchParam:[],
      tabTxt:that.data.tabTxtbak,
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },



  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      var problemid = res.target.dataset.problemid
      return {
        title: '[有人@我]发现一道智力题，考考你~',

        path: '/pages/question/question?problemid=' + problemid,

        imageUrl: app.globalData.baseurl + '/static/sharepic.jpg',

        success: function (res) {


        }
      }

    }
    return {
      title: '[有人@我]发现一道智力题，考考你~',
      path: '/pages/tosolve/tosolve',
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },



  filterTabChild: function (e) {

    this.setData({
      zindex: false
    })

    var that = this;
    var index = e.currentTarget.dataset.index;
    var data = JSON.parse(JSON.stringify(that.data.tabTxt));
    var paramindex = e.detail.value

    if (paramindex == '0') {
        data[index].text = that.data.tabTxt[index].originalText;
        delete that.data.searchParam[index];
    }else{
      data[index].text = data[index]['child'][paramindex].text
      that.data.searchParam[index] = data[index]['child'][paramindex].text

    }

    that.setData({
      tabTxt: data
    })
    var searchparam = that.data.searchParam
    wx.request({
      url: app.globalData.baseurl + '/problem/getten',
      data: { 'formerid': JSON.stringify(that.data.formerid), 'filter': searchparam, 'solved': JSON.stringify(that.data.activeIndex)},
      method:'POST',
      success: function (res) {
        var filterproblist = res.data.problem
        if(filterproblist == undefined){
          that.setData({
            bottom:true,
          })
          var a = that.data.activeIndex
          if (a == '0') {
            that.setData({
              problemlist: []
            })
          } else {
            that.setData({
              solvedproblemlist: []
            })
          }
        }else{
          var tmp = JSON.stringify(filterproblist).replace(/asktime":"([\d- :]*)(.*avatar":")(.*?avatar\/)([\w-_]*)(.jpg)/g, function ($0, $1, $2, $3, $4, $5) { var tmpstr = getDateDiff($1); var cachedoor = get_or_create_avatar($4); if (cachedoor) { var cacheavatar = cachedoor } else { var cacheavatar = $4 + $5 }; return ('asktime":"' + tmpstr + $2 + cachedoor) })
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
    var that = this
    if (app.globalData.authorized == 'true'||app.globalData.avatar!='stranger') {
      wx.navigateTo({
        url: '../ask/ask',
      })
    }else{
      util.checkuserinfo(that)
    }

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
    app.globalData.mapCtx = wx.createMapContext('map')
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
        index: 3,
      })
    }
    var that = this
    util.checklasted(that)


  },

  onReady:function(){
    wx.showModal({
      title: '设置',
      content: '设置我的年级',
      success:function(res){
        if(res.confirm){
          wx.showActionSheet({
            itemList: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
            success:function(res){
              wx.request({
                url: app.globalData.baseurl+"setgrade",
                data:{"grade":res.tapIndex,"userid":app.globalData.openid},
                success:function(res){
                  console.log(res)
              }
              })
            }
          })
        }
      }
    })
  },





  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    if (that.data.activeIndex == '0') {
      util.getlastedprob(that)
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

    var searchparam = that.data.searchParam
    console.log(searchparam)
    if (that.data.activeIndex == '0') {
      util.get10prob(that,searchparam)
    } else if (that.data.activeIndex == '1') {
      util.get10solvedprob(that,searchparam)
    }
    
  },

})






