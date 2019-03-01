var app = getApp()
var util = require('../../utils/util.js')
let animation = require("../../utils/requestanimation.js")

var ctx = null;
var factor = {
  speed: .0005,  // 运动速度，值越小越慢
  t: 0    //  贝塞尔函数系数
};
var timer = null;  // 循环定时器

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    hide: false,
    animationData: null,
    coin:null,
    remainformidnumorstr:null,
    remainformidnum:0,
    canvas_style:''
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
    ctx = wx.createCanvasContext('canvas_wi')
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
      envVersion: 'release',
      success:function(e){
        console.log(e)
      },
      fail:function(e){
        console.log(e)
      }
    })
  },
  //尝试获取formid
  pushformid: function (e) {
    wx.vibrateShort({
      
    })
    var that = this
    that.setData({
      canvas_style: 'width: 90px;height: 400px;'
    })
    this.startTimer();
    setnum(that)
    wx.request({
      url: app.globalData.baseurl + '/user/pushformid',
      method: 'POST',
      data: { 'formid': e.detail.formId, 'openid': app.globalData.openid },
      success: function (res) {        
      }
    })
    
  },



  // 火箭升空
  drawImage: function (data) {
    var that = this
    var p10 = data[0];   // 三阶贝塞尔曲线起点坐标值
    var p11 = data[1];   // 三阶贝塞尔曲线第一个控制点坐标值

    var t = factor.t;

    /*计算多项式系数 （下同）*/
    var cy1 = 3 * (p10.y - p11.y);

    var xt1 = p10.x;
    var yt1 = cy1 * t + p11.y;

    factor.t += factor.speed;
    ctx.drawImage("/images/rocket.png", xt1, yt1, 50, 50);

    ctx.draw();
    if (factor.t > 1) {
      factor.t = 0;
      that.setData({
        canvas_style: ''
      })
      ctx.clearRect(0, 0, 700, 700)
      ctx.draw()
    } else {
      timer = animation.requestAnimationFrame(function () {
        that.drawImage([{ x: 40, y: 400 }, { x: 60, y: 0 }])
      })
    }


  },


  onClickImage: function (e) {
    var that = this
    that.setData({
      style_img: 'transform:scale(1.3);'
    })
    setTimeout(function () {
      that.setData({
        style_img: 'transform:scale(1);'
      })
    }, 500)
  },

  startTimer: function () {
    var that = this
    that.setData({
      style_img: 'transform:scale(1.3);',
    })
    setTimeout(function () {
      that.setData({
        style_img: 'transform:scale(1);'
      })
    }, 500)
    that.drawImage([{ x: 40, y: 400 }, { x: 60, y: 0 }])
  }

})

function setnum(that,count=-1){
  if (!count) {
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