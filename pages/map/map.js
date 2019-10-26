// map.js
var util = require('../../utils/util.js')
var network = require('../../utils/network.js')
var console = require('../../utils/console.js')
const app = getApp()
var userlatitude = 0
var userlongitude = 0
var teacherorstudent = 'teacher'

Page({
  data: {
    mapheightratio: 1,
    latitude: 0,
    longitude: 0,
    height: app.globalData.screenheight,
    scale: 5,
    markers: [],
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
      iconPath: '/images/teacher.png',
      position: {
        left: 50,
        top: 10,
        width: 40,
        height: 40
      },
      clickable: true
    }, {
      id: 5,
      iconPath: '/images/student.png',
      position: {
        left: 100,
        top: 10,
        width: 40,
        height: 40
      },
      clickable: true
    }
    ],
    mapCtx: null,
    profile: '',
    problems: []
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map')
  },
  onLoad: function () {
    var that = this
    if (app.globalData.authorized == 'true' || app.globalData.avatar != 'stranger') {
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: (res) => {
          that.createMarker(res);
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            scale: 1
          })
          userlatitude = res.latitude
          userlongitude = res.longitude
          //上传用户地理位置
          this.adduserlocation()
          this.getSchoolMarkers()
          this.enterLocation()
        }
      });
    } else {
      util.checkuserinfo(that)
    }
  },
  regionchange(e) {
    console.log(e)
  },
  mapclick(e) {
    this.setData({
      mapheightratio: 1
    })
  },
  markertap(e) {
    var that = this
    if (teacherorstudent == 'teacher') {
      network.post('/problem/getonenearbyprincipal', {
        'userid': app.globalData.selfuserid,
        'principalid': e.markerId
      }, function (res) {
        that.setData({
          profile: res.profile || {},
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
      //teacher
      teacherorstudent = 'teacher'
      that.formsubmitteacher()
    } else if (e.controlId === 5) {
      //student
      teacherorstudent = 'student'
      that.formsubmitstudent()
    }


  },
  getSchoolMarkers() {
    var that = this
    network.post('/location/getteacher', {
      'openid': app.globalData.openid
    }, function (res) {
      let markers = [];
      if (res.location) {
        for (let item of res.location) {
          console.log('item: ', item)
          let marker = that.createMarker(item);
          markers.push(marker)
        }
      }
      that.setData({
        markers: markers
      })
    })
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
      name: point.username || '',
      latitude: point.latitude,
      longitude: point.longitude,
      width: 40,
      height: 40,
      istrue: true,
      callout: {
        content: point.username,
        color: '#000000',
        fontSize: 15,
        borderRadius: 10,
        display: 'ALWAYS',
      }
    };
    return marker;
  },

  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  enterLocation: function () {
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
  formsubmitteacher: function (e) {
    var that = this
    network.post('/location/getteacher', {
      'openid': app.globalData.openid
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
      'openid': app.globalData.openid
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
            that.getSchoolMarkers()
            that.enterLocation()
          }
        });
      }
    }
  }
})