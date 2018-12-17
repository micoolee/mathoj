var app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    hide: false,
    animationData: null,
    coin:null,
    remainformidnumorstr:null,
    remainformidnum:0
  },
  onLoad: function (options) {
    var that = this
    //获取瓶子数
    wx.request({
      url: app.globalData.baseurl + '/user/getformidnum',
      data: { 'userid': app.globalData.selfuserid },
      method: 'POST',
      success: function (res) {
        setnum(that, res.data.count)
      }
    })
  },

  onShow: function () {
    var that = this
    util.get_or_create_avatar(app.globalData.openid, that)


    if (app.globalData.reddot) {
      wx.showTabBarRedDot({
        index: 3,
      })
    }
  },



  //设置年级
  setGrade:function(){
    wx.showModal({
      title: '设置',
      content: '设置我的年级',
      success: function (res) {
        if (res.confirm) {
          wx.showActionSheet({
            itemList: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
            success: function (res) {
              wx.request({
                url: app.globalData.baseurl + "/user/setgrade",
                data: { "grade": res.tapIndex, "openid": app.globalData.openid },
                success: function (res) {
                  console.log(res)
                }
              })
            }
          })
        }
      }
    })
  },
  showMyQues: function () {
      wx.navigateTo({
          url: './myques/myques',
          success: function (res) {

          },
      })
  },

  showMyBrow: function () {
    wx.navigateTo({
      url: './myhist/myhist',
      success: function (res) {

      },
    })
  },

  showMySubs: function () {
    wx.navigateTo({
      url: './mysubs/mysubs',
      success: function (res) {

      },
    })
  },

  showMyComm: function () {
    wx.navigateTo({
      url: './mycomm/mycomm',
      success: function (res) {

      },
    })
  },



  clearcache:function(){
    wx.showModal({
      title: '提示',
      content: '清除后会重新加载，确定清除？',
      success:function(res){
        if(res.confirm){
          wx.clearStorageSync()
          wx.showToast({
            title: '成功清除',
          })
          wx.reLaunch({
            url: '/pages/tosolve/tosolve',
          })
        }else{

        }
      }
    })

  },

  showHelp: function () {
    wx.navigateTo({
      url: './help/help',
      success: function (res) {
      },
    })
  },

  showFeedback: function () {
    wx.navigateTo({
      url: './feedback/feedback',
      success: function(res){
      },
    })
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  toface:function(){
    wx.navigateToMiniProgram({
      appId: 'wxaf249daf125d652c',
      path: 'pages/index/index',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
        console.log(res)
      },
      fail(res){
        console.log(res)
      }
    })
  },
  //尝试获取formid
  //尝试获取formid
  pushformid: function (e) {
    var that = this
    setnum(that)
    wx.request({
      url: app.globalData.baseurl + '/user/pushformid',
      method: 'POST',
      data: { 'formid': e.detail.formId, 'openid': app.globalData.openid },
      success: function (res) {        
      }
    })
  },

})

function setnum(that,count=-1){
  if (!count) {
    console.log(0)
    that.setData({
      remainformidnum: 0,
      remainformidnumorstr: 0
    })
    return
  }
  if(count == -1){
    that.setData({
      remainformidnum: that.data.remainformidnum + 1,
      
    })
    if (that.data.remainformidnum>99){
      that.setData({
        remainformidnumorstr:">99",
      })
    }else{
      that.setData({
        remainformidnumorstr: that.data.remainformidnum,
      })
    }
    return
  }
  that.setData({
    remainformidnum: count,
    remainformidnumorstr: count
  })

}