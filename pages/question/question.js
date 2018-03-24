//answer.js
var util = require('../../utils/util.js')
var app = getApp()

//inner audio
const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = false
innerAudioContext.onPlay(() => {
  console.log('开始播放')
})
innerAudioContext.onStop(() => {
  console.log('stop play')
})
innerAudioContext.onPause(() => {
  console.log('pause play')
})
innerAudioContext.onError((res) => {
  console.log(res.errMsg)
  console.log(res.errCode)
})

//record manager
const recorderManager = wx.getRecorderManager()
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
  app.globalData.duration = res.duration
  const { tempFilePath } = res
})
recorderManager.onFrameRecorded((res) => {
  const { frameBuffer } = res
})
const options = {
  duration: 60000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'wav',
  frameSize: 50,
  answerbox:false
}



var page = Page({
  data: {
    motto: '小程序版',
    userInfo: {},
    problemid:'unknown',

    showaudio: false,
    showyuansheng: false,
    playstate: false,
    tingstate: true,
    recordstate: true,
    curTimeVal: 0,
    duration: 100,
    audioSrc: '',
    answerbox:true,

    audiopath:'',
    hidehuida:false,
    textsolu:'',
    answerpicsrc:'',
    desc:'',
    answer:null
  },
  //事件处理函数
  bindItemTap: function() {
    wx.navigateTo({
      url: '../answer/answer'
    })
  },

  onReady:function(){

  },


  audioPlay: function (event) {
    console.log(event)
    innerAudioContext.src = event.currentTarget.dataset.recordsrc
    console.log(innerAudioContext.src)
    innerAudioContext.play()
  },
  audioPause: function () {
    innerAudioContext.pause()
  },

  audioStart: function () {
    innerAudioContext.seek(0)
  },



  // show teacher write area
  showanswerbox:function(){
    this.setData({
      answerbox:false
    })
  },

  //start to record and stop
  start: function (event) {
    if (event.currentTarget.dataset.id) {
      recorderManager.start()
      this.setData({
        recordstate: false
      })
    } else {
      innerAudioContext.src = app.globalData.audiopath;
      recorderManager.stop()

      

      this.setData({
        recordstate: true,
        showyuansheng: true,
        audioSrc: app.globalData.audiopath,
      })
    }
  },



  submit: function () {
    var that = this;
    wx.uploadFile({
      url: app.globalData.baseurl + '/upload/',
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
  //change text sulutions
  textsolu:function(e){
    this.setData({
      textsolu:e.detail.value
    })
  },







  play: function (event) {

    if (event.currentTarget.dataset.id) {

      innerAudioContext.stop()
      this.setData({
        playstate: false
      })
    } else {

      innerAudioContext.autoplay = true
      innerAudioContext.src = app.globalData.returnaudiopath
      innerAudioContext.play()

      this.setData({
        playstate: true
      })
    }

  },

  play1: function (e) {
    var that = this;
    console.log(app.globalData.audiopath)
    innerAudioContext.src = app.globalData.audiopath;
    console.log(innerAudioContext.src)
    innerAudioContext.play(options);
    innerAudioContext.onPlay((res) => that.updateTime(that)) //没有这个事件触发，无法执行updatatime
    this.setData({
      tingstate: false
    })
  },
  pause1: function () {
    innerAudioContext.pause();
    this.setData({
      tingstate: true
    })
  },
  updateTime: function (that) {
    console.log("duratio的值：", innerAudioContext.duration)
    console.log('curtime', innerAudioContext.currentTime)
    innerAudioContext.onTimeUpdate((res) => {
      //更新时把当前的值给slide组件里的value值。slide的滑块就能实现同步更新
      that.setData({
        duration: innerAudioContext.duration.toFixed(2) * 100,
        curTimeVal: innerAudioContext.currentTime.toFixed(2) * 100,
      })
    })

    innerAudioContext.onEnded(() => {
      that.setStopState(that)
    })
  },
  //拖动滑块
  slideBar: function (e) {
    let that = this;
    var curval = e.detail.value; //滑块拖动的当前值
    innerAudioContext.seek(curval); //让滑块跳转至指定位置
    innerAudioContext.onSeeked((res) => {
      this.updateTime(that) //注意这里要继续出发updataTime事件，
    })
  },

  setStopState: function (that) {
    that.setData({
      curTimeVal: 0,
      tingstate: true
    })
  innerAudioContext.stop()
  },

  takephoto: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        console.log(src)
        that.setData({
          answerpicsrc: src,
        })
      }
    })
  },

  uploadtext: function (that) {
    wx.request({
      url: app.globalData.baseurl + '/submitanswer/',
      method:'post',
      data: { 'textsolu': that.data.textsolu, 'problemid': that.data.problemid, 'teacherid': app.globalData.openid, 'imgsign': 'text' },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
          wx.showToast({
            title: 'ti jiao cheng gong',
          })
      }
    })
  },


uploadimg:function(that){
  wx.uploadFile({
    url: app.globalData.baseurl + '/submitanswer/',
    filePath: that.data.answerpicsrc,
    formData: { 'textsolu': that.data.textsolu, 'problemid': that.data.problemid, 'teacherid': app.globalData.openid, 'imgsign': 'true' },
    name: 'image',
    success: function (res) {
      wx.showToast({
        title: 'ti jiao cheng gong',
      })
    }
  })
},

uploadrecord:function(that){
  wx.uploadFile({
    formData: { 'textsolu': that.data.textsolu, 'problemid': that.data.problemid, 'teacherid': app.globalData.openid, 'imgsign': 'false' },
    url: app.globalData.baseurl + '/submitanswer/',
    filePath: app.globalData.audiopath,
    name: 'record',
    success: function (res) {
      wx.showToast({
        title: 'ti jiao cheng gong',
      })    },
  })
},
  submitanswer: function () {
    var that = this;
    if (app.globalData.audiopath){
      that.uploadrecord(that)
    }
    if(that.data.answerpicsrc){
      that.uploadimg(that)
    }
    if (! that.data.answerpicsrc & ! app.globalData.audiopath & that.data.textsolu != ''){
      that.uploadtext(that)
    }
    if (!that.data.answerpicsrc & !app.globalData.audiopath & that.data.textsolu == ''){
      wx.showModal({
        title: 'input your answer at least one item',
        content: '',
      })
    }
    app.globalData.audiopath = null
  },



  onLoad: function (option) {
    var that = this
    this.setData({
      problemid:option.problemid
    })

    wx.request({
      url: app.globalData.baseurl + '/questiondetail/',
      method: 'post',
      data: { 'problemid': that.data.problemid, 'userid': app.globalData.openid },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var problem = JSON.parse(res.data.problem)
        var answer = JSON.parse(res.data.answer)
        var hidehuida = JSON.parse(res.data.answerbox)
        that.setData({
          desc: problem[0].fields.description,
          answer:answer,
          hidehuida : hidehuida
        })
      },
      fail:function(){
        console.log('fail load detail')
      }
    })
  },
  tapName: function(event){
    console.log(event)
  },

  onReady:function(){
    
  },
  onShow:function(){

  },
  onHide:function(){

  }
})
