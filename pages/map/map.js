// map.js
var util = require('../../utils/util.js')
var network = require('../../utils/network.js')
//var console = require('../../utils/console.js')
const app = getApp()
var userlatitude = 0
var userlongitude = 0
var schoolorstudent = 'school'
var oldcircle = ''
var margin = 3
var remark = ''
Page({
  data: {
    showjoinremark: false,
    showexitremark: false,
    mapheightratio: 1,
    latitude: 39.90,
    longitude: 116.38,
    height: app.globalData.screenheight,
    scale: 5,
    markers: [],
    circles: [],
    joinedschoolid: 0,
    role: '',
    controls: [{
      id: 1,
      iconPath: '/images/location-control.png',
      position: {
        left: 0,
        top: 10,
        width: 40,
        height: 40
      },
      clickable: true
    },
    {
      id: 2,
      iconPath: '/images/plus.png',
      position: {
        left: 0,
        top: 60,
        width: 40,
        height: 40
      },
      clickable: true
    }, {
      id: 3,
      iconPath: '/images/minus.png',
      position: {
        left: 0,
        top: 110,
        width: 40,
        height: 40
      },
      clickable: true
    }, {
      id: 4,
      iconPath: '/images/juli.png',
      position: {
        left: 50,
        top: 10,
        width: 40,
        height: 40
      },
      clickable: true
    }, {
      id: 5,
      iconPath: '/images/school.png',
      position: {
        left: 100,
        top: 10,
        width: 40,
        height: 40
      },
      clickable: true
    }, {
      id: 6,
      iconPath: '/images/student.png',
      position: {
        left: 150,
        top: 10,
        width: 40,
        height: 40
      },
      clickable: true
    }],
    stucontrols: [{
      id: 1,
      iconPath: '/images/location-control.png',
      position: {
        left: 0,
        top: 10,
        width: 40,
        height: 40
      },
      clickable: true
    },
    {
      id: 2,
      iconPath: '/images/plus.png',
      position: {
        left: 0,
        top: 60,
        width: 40,
        height: 40
      },
      clickable: true
    }, {
      id: 3,
      iconPath: '/images/minus.png',
      position: {
        left: 0,
        top: 110,
        width: 40,
        height: 40
      },
      clickable: true
    }, {
      id: 4,
      iconPath: '/images/juli.png',
      position: {
        left: 50,
        top: 10,
        width: 40,
        height: 40
      },
      clickable: true
    }, {
      id: 5,
      iconPath: '/images/school.png',
      position: {
        left: 100,
        top: 10,
        width: 40,
        height: 40
      },
      clickable: true
    }, {
      id: 6,
      iconPath: '/images/student.png',
      position: {
        left: 150,
        top: 10,
        width: 40,
        height: 40
      },
      clickable: true
    }],
    mapCtx: null,
    profile: '',
    problems: [],
    showchangecircle: false,
    filtermargin: 3,
    inputInfo: '',
    inputFocus: ''
  },
  tojoinschool: function (e) {
    this.setData({
      inputInfo: '',
      showjoinremark: true
    })
  },
  toexitschool: function (e) {
    this.setData({
      inputInfo: '',
      showexitremark: true
    })
  },
  //学生申请加入机构
  joinschool: function (e) {
    var that = this
    if (app.globalData.school != '') {
      wx.showToast({
        title: '不能加入多机构',
      })
      that.setData({
        showjoinremark: false,
        inputInfo: ''
      })
      return
    }
    network.post('/user/applytojoinschool', {
      'userid': app.globalData.selfuserid,
      'schoolid': e.currentTarget.dataset.schoolid * 1,
      'remark': remark,
    }, function (res) {
      that.setData({
        showjoinremark: false,
        inputInfo: ''
      })
      remark = ''
      if (!res.resultCode) {
        app.globalData.school = 'schoolid'
        wx.showToast({
          title: '已申请',
        })
      } else if (res.resultMsg == "HaveApplyHandling") {
        wx.showToast({
          title: '勿重复申请',
        })
      } else {
        wx.showToast({
          title: '申请失败',
        })
      }
    })
  },

  exitschool: function (e) {
    var that = this

    network.post('/user/applytoexitschool', {
      'userid': app.globalData.selfuserid,
      'schoolid': e.currentTarget.dataset.schoolid * 1,
      'remark': remark,
    }, function (res) {
      that.setData({
        showexitremark: false,
        inputInfo: ''
      })
      remark = ''
      if (!res.resultCode) {
        app.globalData.school = 'schoolid'
        wx.showToast({
          title: '已申请',
        })
      } else if (res.resultMsg == "HaveApplyHandling") {
        wx.showToast({
          title: '勿重复申请',
        })
      } else {
        wx.showToast({
          title: '申请失败',
        })
      }
    })
  },
  confirmfilter: function (e) {
    var that = this
    if (oldcircle == undefined || oldcircle == '') {
      wx.showModal({
        content: '未授权您的位置，授权后才可筛选周围的人',
        confirmText: "去授权",
        cancelText: "取消",
        success: function (res) {
          if (res.confirm) {
            that.secondAuthorize(that)
          }
        }
      })
      return
    }
    if (this.data.filtermargin * 1 == 3) {
      oldcircle[0].radius = 3000
      this.setData({
        //画一个三公里的圈
        circles: oldcircle,
        showchangecircle: false,
      })
      margin = 3
    } else if (this.data.filtermargin * 1 == 5) {
      oldcircle[0].radius = 5000
      this.setData({
        //画一个五公里的圈
        circles: oldcircle,
        showchangecircle: false,
      })
      margin = 5
    } else if (this.data.filtermargin * 1 == 0) {
      this.setData({
        //不画圈
        circles: [],
        showchangecircle: false,
      })
      margin = 0
    }
    if (schoolorstudent == 'school') {
      that.formsubmitschool()
    } else if (schoolorstudent == 'student') {
      that.formsubmitstudent()
    }
  },
  cancel: function (e) {
    this.setData({
      showjoinremark: false,
      showexitremark: false,
      inputInfo: ''
    })
  },
  closedistancechange: function (e) {
    this.setData({
      showchangecircle: false,
      showjoinremark: false,
      showexitremark: false
    })
  },
  switchmargin: function (e) {
    this.setData({
      filtermargin: e.currentTarget.dataset.id
    })
  },
  drop: function (e) {
    ////console.log('drop')
  },
  secondAuthorize: function (that) {
    wx.openSetting({
      success: (res) => {
        wx.getLocation({
          type: 'gcj02', //返回可以用于wx.openLocation的经纬度
          success: (res) => {
            var tmpcircle = [{
              latitude: res.latitude,
              longitude: res.longitude,
              radius: 3000,
              color: "#FF0000",
              fillColor: "#FF000020",
              strokeWidth: 1
            }]
            that.createMarker(res);
            that.setData({
              //画一个三公里的圈
              role: app.globalData.role,
              circles: tmpcircle,
              latitude: res.latitude,
              longitude: res.longitude,
              scale: 1,
              joinedschoolid: app.globalData.school || 0
            })

            oldcircle = tmpcircle
            userlatitude = res.latitude
            userlongitude = res.longitude
            //上传用户地理位置
            that.adduserlocation()
            that.formsubmitschool()
            that.enterLocation()
          },
          fail: (res) => {
            wx.getSetting({
              success: (res) => {
                if (!res.authSetting['scope.userLocation'])
                  that.openConfirm()
              }
            })
          }
        });
      }
    })
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap')
  },
  callphone: function (e) {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.profile.phone //仅为示例，并非真实的电话号码
    })
  },
  copyphone: function (e) {
    var that = this
    wx.setClipboardData({
      data: that.data.profile.phone,
    })
  },
  onLoad: function () {
    var that = this
    console.log(app.globalData.authorized == 'true' || app.globalData.avatar != 'stranger')
    if (app.globalData.authorized == 'true' || app.globalData.avatar != 'stranger') {
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: (res) => {
          var tmpcircle = [{
            latitude: res.latitude,
            longitude: res.longitude,
            radius: 3000,
            color: "#FF0000",
            fillColor: "#FF000020",
            strokeWidth: 1
          }]
          that.createMarker(res);
          that.setData({
            //画一个三公里的圈
            role: app.globalData.role,
            circles: tmpcircle,
            latitude: res.latitude,
            longitude: res.longitude,
            scale: 1,
            joinedschoolid: app.globalData.school || 0
          })

          oldcircle = tmpcircle
          userlatitude = res.latitude
          userlongitude = res.longitude
          //上传用户地理位置
          this.adduserlocation()
          this.formsubmitschool()
          this.enterLocation()
        },
        fail: (res) => {
          wx.getSetting({
            success: (res) => {
              if (!res.authSetting['scope.userLocation'])
                that.openConfirm()
            }
          })
        }
      });
      this.mapCtx = wx.createMapContext('myMap')
    } else {
      util.checkuserinfo(that)
    }
  },
  openConfirm: function () {
    var that = this
    wx.showModal({
      content: '检测到您未授权定位权限，是否去设置打开？',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          that.secondAuthorize(that)
        } else {
          console.log('用户点击取消')
        }
      }
    });
  },

  regionchange(e) {
    ////console.log(e)
  },
  bindQueTap: function (e) {
    wx.navigateTo({
      url: `/pages/home/question/question?problemid=${e.currentTarget.dataset.id}`
    })
  },
  mapclick(e) {
    this.setData({
      mapheightratio: 1
    })
  },
  conceal: function (e) {
    this.setData({
      showjoinremark: false,
      showexitremark: false,
    })
  },
  tapInput() {
    this.setData({
      //在真机上将焦点给input
      inputFocus: true,
      //初始占位清空
      inputInfo: ''
    });
  },
  writeremark: function (e) {
    remark = e.detail.value || ''
  },
  /**
   * input 失去焦点后将 input 的输入内容给到cover-view
   */
  blurInput(e) {
    this.setData({
      inputInfo: e.detail.value || ''
    });
  },
  markertap(e) {
    var that = this
    if (schoolorstudent == 'school') {
      network.post('/problem/getonenearbyschool', {
        'userid': app.globalData.selfuserid,
        'schoolid': e.markerId
      }, function (res) {
        that.setData({
          profile: res.profile || {},
          principal: res.principal || {},
          problems: res.problems || [],
          mapheightratio: 0.3
        })
      })
    } else {
      network.post('/problem/getstudentproblem', {
        'userid': app.globalData.selfuserid,
        'studentid': e.markerId
      }, function (res) {
        that.setData({
          profile: res.profile || {},
          problems: res.problems || [],
          mapheightratio: 0.3
        })
      })
    }

  },

  controltap(e) {
    var that = this
    wx.vibrateShort()
    if (e.controlId === 1) {
      this.mapCtx.moveToLocation()
    } else if (e.controlId === 2) {
      that.getCenterLocation()
      let tmpscale = ++that.data.scale
      if (tmpscale > 18) {
        tmpscale = 18
      }
      that.setData({
        scale: tmpscale
      })
    } else if (e.controlId === 3) {
      that.getCenterLocation()
      let tmpscale = --that.data.scale
      if (tmpscale < 5) {
        tmpscale = 5
      }
      that.setData({
        scale: tmpscale
      })
    } else if (e.controlId === 4) {
      //修改圆半径
      that.setData({
        showchangecircle: true
      })
    } else if (e.controlId === 5) {
      //school
      schoolorstudent = 'school'
      that.formsubmitschool()
    } else if (e.controlId === 6) {
      //student
      schoolorstudent = 'student'
      that.formsubmitstudent()
    }
  },


  getCenterLocation: function () {
    var that = this
    this.mapCtx.getCenterLocation({
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      }
    })
  },
  // 根据point创建标记点
  createMarker(point) {
    let marker = {
      iconPath: point.avatar,
      id: point.userid || 0,
      name: point.nickname || '',
      latitude: point.latitude,
      longitude: point.longitude,
      width: 40,
      height: 40,
      istrue: true,
      callout: {
        content: point.nickname,
        color: '#ff000050',
        fontSize: 12,
        borderRadius: 20,
        display: 'ALWAYS',
        padding: 5
      }
    };
    return marker;
  },

  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  enterLocation: function () {
    ////console.log('this.mapctx:', this.mapCtx)

    this.mapCtx.moveToLocation()
    this.setData({
      scale: 15,
    })
  },

  adduserlocation: function () {
    network.post('/location/update', {
      'openid': app.globalData.openid,
      'latitude': userlatitude,
      'longitude': userlongitude
    })
  },
  formsubmitschool: function (e) {
    var that = this
    network.post('/location/getschool', {
      'openid': app.globalData.openid,
      'margin': margin,
    }, function (res) {
      var markers = [];
      if (res.location) {
        for (let item of res.location) {
          let marker = that.createMarker(item);
          markers.push(marker)
        }
      }
      that.setData({
        markers: markers
      })
    })
  },

  formsubmitstudent: function (e) {
    var that = this
    network.post('/location/getstudent', {
      'openid': app.globalData.openid,
      'margin': margin,
    }, function (res) {
      var markers = [];
      if (res.location) {
        for (let item of res.location) {
          let marker = that.createMarker(item);
          markers.push(marker)
        }
      }
      that.setData({
        markers: markers
      })
    })
  },

  onShow: function () {
    var that = this
    if (app.globalData.fromgetuserinfo) {
      if (app.globalData.authorized == 'true' || app.globalData.avatar != 'stranger') {
        wx.getLocation({
          type: 'gcj02', //返回可以用于wx.openLocation的经纬度
          success: (res) => {
            that.createMarker(res);
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude,
              scale: 15
            })
            userlatitude = res.latitude
            userlongitude = res.longitude
            //上传用户地理位置
            that.adduserlocation()
            that.formsubmitschool()
            that.enterLocation()
          }
        });
      }
    }
  }
})