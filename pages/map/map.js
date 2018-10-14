// map.js
let schoolData = require('../../resources/gis-school')
const app = getApp()
Page({
  data: {
    latitude:0,
    longitude:0,
    centerX:0,
    centerY:0,
    scale:5,
    markers: [],
    controls: [{
      id: 1,
      iconPath: '/images/location-control.png',
      position: {
        left: 0,
        top:10,
        width: 40,
        height: 40
      },
      clickable: true
    }],
    mapCtx:null
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('map')
  },
  onLoad: function () {
    console.log('地图定位！')
    var that = this
    wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success:(res)=>{
          console.log(res)
            let latitude = res.latitude; 
            let longitude = res.longitude; 
            let marker = that.createMarker(res);
            that.setData({
                centerX:longitude,
                centerY:latitude,
                latitude:res.latitude,
                longitude:res.longitude,
                scale:1
                
            })

          this.adduserlocation()
          this.getSchoolMarkers()
          this.enterLocation()
        }
    });



  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e)
  },
  controltap(e) {
    console.log(e.controlId)
    this.moveToLocation()
  },
  getSchoolMarkers(){
    var that = this
    //get schooldata from backend
    wx.request({
      url: app.globalData.baseurl + '/getallteacherlocations/',
      success:function(res){
          console.log(res)

        console.log(schoolData)
        let markers = [];
        for (let item of res.data) {
          let marker = that.createMarker(item);
          markers.push(marker)
        }
        that.setData({
          markers: markers
        })
      }
    })


  },

  createMarker(point) {
    let latitude = point.latitude;
    let longitude = point.longitude;

    // var avatar = this.downloadfile(point.avatar,point.id)

    let marker = {
      iconPath: point.avatar,
      id: point.id || 0,
      name: point.username || '',
      latitude: latitude,
      longitude: longitude,
      width: 50,
      height: 50
    };
    return marker;
  },

  //   {
  //   "id": 1,
  //   "name": "北京大学",
  //   "longitude": "116.316176",
  //   "latitude": "39.997741"
  // },


  // getCenterLocation: function () {
  //   this.mapCtx.getCenterLocation({
  //     success: function (res) {
  //         console.log(res.longitude)
  //         console.log(res.latitude)
  //       this.setData({
  //         latitude:res.latitude,
  //         longitude:res.longitude
  //       })
  //     }
  //   })
  // },

  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  enterLocation:function(){
    console.log("enterlocation")
    this.mapCtx.moveToLocation()
    this.setData({
      scale: 15,
    })
  },

  adduserlocation:function() {
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/adduserlocation/',
      data: { 'openid': app.globalData.openid, 'latitude': that.data.latitude, 'longitude': that.data.longitude },
      success: function (res) {
        console.log("add ok")
        console.log(res)
      }
    })
  },

  downloadfile:function(url,id){
    wx.downloadFile({
      url: url,
      success: function (res) {
        console.log(res)
        var avatarimg = res.tempFilePath
        console.log(avatarimg)
        wx.setStorageSync(string(id), avatarimg)
        var avatarimgcache = wx.getStorageSync(string(id))
        return avatarimgcache
      }
    })
  }



})