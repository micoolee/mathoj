// pages/tosolve/tosolve.js
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
    lastedid:null,
    topStories: [{ image: "../../images/pause.jpg" }, { image: '../../images/home.png' }],
    havenewbtn:false,
    searchcontent:null
  },
  showquestool: function () {
    wx.navigateTo({
      url: '../ask/ask',
    })
  },

  bindQueTap: function (event) {
    var problemid = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `../question/question?problemid=${problemid}`
    })
  },

// writesearch:function(e){
//   this.setData({
//     searchcontent:e.detail.value
//   })
// },

search:function(e){
  wx.request({
    url: app.globalData.baseurl+'/search/',
    data:{'content':e.detail.value},
    success:function(res){
      console.log(res)
    }
  })
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

showmore:function(e){
  var userid = e.currentTarget.dataset.userid
  var avatar = e.currentTarget.dataset.avatar
  var username = e.currentTarget.dataset.username
  var openid = e.currentTarget.dataset.openid

  if (openid == app.globalData.openid) {
    wx.switchTab({
      url: '../settings/settings',
    })
  }else{
    wx.navigateTo({
      url: `../settings/profile/profile?userid=${userid}&avatar=${avatar}&username=${username}&openid=${openid}`,
    })
  }


},







  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
  if (app.globalData.openid != 'null') {
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