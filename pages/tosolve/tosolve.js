// pages/tosolve/tosolve.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    problempicsrc:'null',
    animationData:null,
  },
  showquestool:function(){
    wx.navigateTo({
      url: '../ask/ask',
    })
  },
// click a question
  bindQueTap: function (event) {
    var problemid = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `../question/question?problemid=${problemid}`
    })
  },





  // easyinput: function (e) {
  //   this.setData({
  //     easy: e.detail.value
  //   })
  // },

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
                console.log('11111')
                console.log(app.globalData.avatar)
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
              console.log('22222')              
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
                              console.log('33333')
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
      console.log('111')
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况

      app.userInfoReadyCallback = res => {
        console.log('222')
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
          console.log('333')
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          var that = this


    

        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },








  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that = this
    wx.request({
      url: app.globalData.baseurl + '/',
      success: function (res) {
        console.log(res)
        that.setData({
          problemlist: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    　　console.log('--------下拉刷新-------')
    　　wx.showNavigationBarLoading() //在标题栏中显示加载

    　　wx.request({
        url: app.globalData.baseurl + '/',

      success: function (res) {
        that.setData({
          problemlist: res.data
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })                
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },


})











function loading(that) {
  if (app.globalData.openid != 'null') {
    wx.showToast({
      title: '加载完成~',
    })
    console.log(app.globalData.openid)
    uploadavatar()

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
    success: function () {
      console.log('succ')
    }


  })


}