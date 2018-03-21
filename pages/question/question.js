//answer.js
var util = require('../../utils/util.js')

var app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
recorderManager.onStart(() => {
  console.log('recorder start')
})
recorderManager.onResume(() => {
  console.log('recorder resume')
})
recorderManager.onPause(() => {
  console.log('recorder pause')
})
recorderManager.onStop((res) => {
  app.globalData.audiopath = res.tempFilePath
  console.log('recorder stop', res)
  const { tempFilePath } = res
})
recorderManager.onFrameRecorded((res) => {
  const { frameBuffer } = res
  console.log('frameBuffer.byteLength', frameBuffer.byteLength)
})

const options = {
  duration: 10000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'aac',
  frameSize: 50
}




Page({
  data: {
    motto: '知乎--微信小程序版',
    userInfo: {},
    problemid:'unknown',
    showaudio: false,
    showyuansheng: false,
  },
  //事件处理函数
  bindItemTap: function() {
    wx.navigateTo({
      url: '../answer/answer'
    })
  },


  start: function () {
    recorderManager.start(options)
  },
  stop: function () {
    recorderManager.stop()
    this.setData({
      showyuansheng: true,
    })
  },


  submit: function () {
    var that = this;
    wx.uploadFile({
      url: app.globalData.baseurl + '/test/',
      filePath: app.globalData.audiopath,
      name: 'record',
      success: function (res) {
        app.globalData.returnaudiopath = res.data
        that.setData({
          showaudio: true
        })
      }
    })
  },

  ting: function () {
    play(app.globalData.audiopath)
  },

  play: function () {
    play(app.globalData.returnaudiopath)
  },






  onLoad: function (option) {
    wx.request({
      url: app.globalData.baseurl+'/questiondetail/',
      method:'post',
      data: {'problemid':option.problemid,'userid':app.globalData.openid},
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        console.log(res)
      }
    })
    console.log(option.problemid) 
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  tapName: function(event){
    console.log(event)
  }
})


function play(audio) {
  innerAudioContext.autoplay = true
  console.log(app.globalData.audiopath)
  innerAudioContext.src = audio
  innerAudioContext.onPlay(() => {
    console.log('开始播放')
  })
  innerAudioContext.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
  })
}