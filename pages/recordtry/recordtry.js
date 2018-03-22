// pages/oldMusic/index.js
const app = getApp()

const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = false
innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
innerAudioContext.onPlay(() => {
  console.log('开始播放')
})
innerAudioContext.onStop(() => {
  console.log('stop play')
})
innerAudioContext.onError((res) => {
  console.log(res.errMsg)
  console.log(res.errCode)
})




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
    showaudio:false,
    showyuansheng:false,
    playstate:false,
    tingstate:false,
    recordstate:true,

    curTimeVal:0,
    duration:100

  },

  // start: function () {
  //   recorderManager.start(options)
  // },
  // stop:function(){
  //   recorderManager.stop()
  //   this.setData({
  //     showyuansheng:true,
  //   })
  // },


start:function(event){
  if (event.currentTarget.dataset.id) {
    this.setData({
     recordstate: false
    })
    recorderManager.start(options)
  
  } else {
    this.setData({
      recordstate: true,
      showyuansheng: true
    })
    recorderManager.stop()
  }
},


  
submit:function(){
  var that = this;
  wx.uploadFile({
    url: app.globalData.baseurl + '/upload/',
    filePath: app.globalData.audiopath,
    name: 'record',
    success: function (res) {
      app.globalData.returnaudiopath = res.data
      that.setData({
        showaudio:true
      })
    }
  })
},

ting:function(event){
  console.log(app.globalData.audiopath)
  if (event.currentTarget.dataset.id) {
    this.setData({
      tingstate: false
    })
    innerAudioContext.stop()
  } else{
    this.setData({
      tingstate: true
    })
    innerAudioContext.autoplay = true
    innerAudioContext.src = app.globalData.audiopath
    innerAudioContext.play()
  }
},

play:function(event){
  console.log(event.currentTarget.dataset.id)
  if (event.currentTarget.dataset.id){

    innerAudioContext.stop()
    this.setData({
      playstate: false
    })
  }else{

    innerAudioContext.autoplay = true
    innerAudioContext.src = app.globalData.returnaudiopath
    innerAudioContext.play()

    this.setData({
      playstate: true
    })
  }

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



// function play(audio){
//   innerAudioContext.autoplay = true
//   console.log(app.globalData.audiopath)
//   innerAudioContext.src =audio
//   // innerAudioContext.onPlay(() => {
//   //   console.log('开始播放')
//   // })
//   innerAudioContext.onStop(() => {
//     console.log('stop')
//   })
//   innerAudioContext.onError((res) => {
//     console.log(res.errMsg)
//     console.log(res.errCode)
//   })
// }


// function stop(audio) {
//   // innerAudioContext.autoplay = true
//   // console.log(app.globalData.audiopath)
//   innerAudioContext.src = audio
//   innerAudioContext.onStop(() => {
//     console.log('stop')
//   })
//   innerAudioContext.onError((res) => {
//     console.log(res.errMsg)
//     console.log(res.errCode)
//   })
// }