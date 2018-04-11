// pages/tosolve/tosolve.js
const app = getApp()
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
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
    havenewbtn:false
  },
  showquestool: function () {
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

    util.getlastedprob(that)




    // if (that.data.door) {
    //   that.setData({door :false,formerid:'first'})

    //   util.get10prob(that)
    // }


  },
  getUserInfo: function (e) {
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
    util.checklasted(that)
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

  refresh: function () {
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 3000
    });

    // load data
    // var feed = util.getData2();
    // console.log("loaddata");
    // var feed_data = feed.data;
    // this.setData({
    //   feed: feed_data,
    //   feed_length: feed_data.length
    // });
    setTimeout(function () {
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 2000
      })
    }, 3000)

  },


  //使用本地 fake 数据实现继续加载效果
  nextLoad: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 4000
    })
    // load data
    // var next = util.getNext();
    // console.log("continueload");
    // var next_data = next.data;
    // this.setData({
    //   feed: this.data.feed.concat(next_data),
    //   feed_length: this.data.feed_length + next_data.length
    // });
    setTimeout(function () {
      wx.showToast({
        title: '加载成功',
        icon: 'success',
        duration: 2000
      })
    }, 3000)
  },




  // upper: function () {
  //   wx.showNavigationBarLoading()
  //   this.refresh();
  //   console.log("upper");
  //   setTimeout(function () { wx.hideNavigationBarLoading(); wx.stopPullDownRefresh(); }, 2000);
  // },
  // lower: function (e) {
  //   wx.showNavigationBarLoading();
  //   var that = this;
  //   setTimeout(function () { wx.hideNavigationBarLoading(); that.nextLoad(); }, 1000);
  //   console.log("lower")
  // },




  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
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
  })


}