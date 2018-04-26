const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    problempicsrc: 'null',
    animationData: null,
    door: true,
    formerid: null,
    lastedid: null,
    topStories: [{ image: "../../images/pause.jpg" }, { image: '../../images/home.png' }],
    havenewbtn: false,
    searchcontent: null,
    inputvalue: null,
    problemlist: [],
    showsharedoor:false,
    shareindexlist:[],


    tabTxt: [
      {
        'text': '年级',
        'originalText': '不限',
        'active': false,
        'child': [
          { 'id': 1, 'text': '一年级' },
          { 'id': 2, 'text': '二年级' },
          { 'id': 3, 'text': '三年级' },
          { 'id': 4, 'text': '四年级' }

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
      }
    ],
    searchParam: []
  },



  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      var problemid = res.target.dataset.problemid
      return {
        title: '[有人@我]小学奥数，考考你~',

        path: '/pages/question/question?problemid='+problemid,

        imageUrl: 'https://ceshi.guirenpu.com/images/banner.png',

        success: function (res) {

          console.log("转发成功" + res);

        }
      }

    }
    return {
      title: '[有人@我]小学奥数，考考你~',
      // path: '/pages/tosolve/tosolve',
      path:'/pages/tosolve/tosolve',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
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
    console.log(that.data.searchParam);
    var searchparam = that.data.searchParam
    var tmplist = app.globalData.globalproblemlist
    var tmpproblemlist = []
    that.filteritem(searchparam, tmpproblemlist, tmplist)

    this.setData({
      problemlist: tmpproblemlist
    })



  },


  filteritem: function (searchparam, tmpproblemlist, tmplist) {
console.log(searchparam)
    if (typeof (searchparam[0]) != 'undefined' && searchparam[0] != '' && typeof (searchparam[1]) != 'undefined' && searchparam[1] != '') {
      for (var i in tmplist) { if (tmplist[i].grade == searchparam[0] && tmplist[i].easyclass == searchparam[1]) { tmpproblemlist.push(tmplist[i]) }; }

    }
    else {
      if (typeof (searchparam[0]) != 'undefined' && searchparam[0] != '') {
        for (var i in tmplist) { if (tmplist[i].grade == searchparam[0]) { tmpproblemlist.push(tmplist[i]) } }
      } else if (typeof (searchparam[1]) != 'undefined' && searchparam[1] != ''){
        for (var i in tmplist) { if (tmplist[i].easyclass == searchparam[1]) { tmpproblemlist.push(tmplist[i]) } }
      }

      else{
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
  search: function (e) {
    var that = this
    if (e.detail.value == '') {
      wx.showModal({
        title: 'input sothing',
        content: 'input something',
      })
    } else {
      wx.request({
        url: app.globalData.baseurl + '/mysearch/',
        data: { 'q': e.detail.value },
        success: function (res) {
          that.setData({
            inputvalue: ''
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
      success: res => {
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
          wx.getUserInfo({
            success: function (res) {
              app.globalData.avatar = res.userInfo.avatarUrl
              app.globalData.nickname = res.userInfo.nickName
              loading(that)
              that.onShow()
            },
            fail: function () {
              wx.showModal({
                cancelText: '拒绝授权',
                confirmText: '确定授权',
                title: '提示',
                content: '如果您继续点击拒绝授权,将无法体验。',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        res.authSetting["scope.userInfo"] = true
                        if (res.authSetting["scope.userInfo"]) {
                          wx.getUserInfo({
                            success: function (res) {
                              app.globalData.avatar = res.userInfo.avatarUrl
                              app.globalData.nickname = res.userInfo.nickName
                              loading(that)
                              that.onShow()
                            }
                          })
                        }
                      }, fail: function (res) {
                      }
                    })
                  } else {
                    wx.redirectTo({
                      url: '../index/index'
                    })
                  }
                }
              })
            }
          })
        }
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
    console.log('getting wss')
    util.getlastedprob(that)
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },


showshare:function(e){
  var index = e.target.dataset.shareindex
  var tmpshareindexlist = this.data.shareindexlist
  tmpshareindexlist[index]='1'
  this.setData({
    shareindexlist:tmpshareindexlist
  })
},


clickshare:function(e){
 this.setData({
   showsharedoor:false
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
    console.log('--------下拉刷新-------')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    util.pulldown(that)
    wx.stopPullDownRefresh() //停止下拉刷新                
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('reach bottom')
    var that = this
    util.get10prob(that)
  },

})


function loading(that) {
  if (! app.globalData.openid) {
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