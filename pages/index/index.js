// pages/oldMusic/index.js
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showaudio:false,
    showyuansheng:false,
  },
  reauthenticate:function(){
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
                  }
                   else {
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  
  }


})


