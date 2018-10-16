// map.js
let schoolData = require('../../resources/gis-school')
const app = getApp()
Page({
  data: {
    latitude:0,
    longitude:0,
    centerX:0,
    centerY:0,
    height:app.globalData.screenheight,
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
      }    
    ],
    mapCtx:null
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('map')
  },
  onLoad: function () {
    console.log(app.globalData.screenheight)
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
    var that = this
    console.log(e.controlId)
    if (e.controlId === 1){
      this.moveToLocation()
    }
    else if (e.controlId === 2) {
      that.setData({
        scale: ++that.data.scale
      })
    } else {
      that.setData({
        scale: --that.data.scale
      })
    }


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
      width: 40,
      height: 40,
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
  },
  //尝试获取formid
  formsubmitteacher: function (e) {
    var that = this
    console.log(e)
    wx.request({
      url: app.globalData.baseurl + '/pushformid/',
      data: { 'formid': e.detail.formId, 'openid': app.globalData.openid, 'getrole':'teacher'},
      success: function (res) {
        console.log(res)
        let markers = [];
        for (let item of res.data) {
          let marker = that.createMarker(item);
          markers.push(marker)
        }
        console.log(markers)
        that.setData({
          markers: markers
        })
      }

    })
  },

  formsubmitstudent: function (e) {
    var that = this
    console.log(e)
    wx.request({
      url: app.globalData.baseurl + '/pushformid/',
      data: { 'formid': e.detail.formId, 'openid': app.globalData.openid,'getrole':'student'},
      success: function (res) {
        console.log(res)
        let markers = [];
        for (let item of res.data) {
          let marker = that.createMarker(item);
          markers.push(marker)
        }
        console.log(markers)
        that.setData({
          markers: markers
        })
      }

    })
  }

})