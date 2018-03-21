// pages/oldMusic/index.js
const app = getApp()

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
    showaudio:false,
    showyuansheng:false,
  },

  start: function () {
    recorderManager.start(options)
  },
  stop:function(){
    recorderManager.stop()
    this.setData({
      showyuansheng:true,
    })
  },

  
submit:function(){
  var that = this;
  wx.uploadFile({
    url: app.globalData.baseurl + '/test/',
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

ting:function(){
  play(app.globalData.audiopath)
},

play:function(){
  play(app.globalData.returnaudiopath)
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



function play(audio){
  innerAudioContext.autoplay = true
  console.log(app.globalData.audiopath)
  innerAudioContext.src =audio
  innerAudioContext.onPlay(() => {
    console.log('开始播放')
  })
  innerAudioContext.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
  })
}