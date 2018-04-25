//answer.js
var util = require('../../utils/util.js')
var app = getApp()
var getDateDiff = util.getDateDiff
var get_or_create_avatar = util.get_or_create_avatar

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
  innerAudioContext.src = res.tempFilePath
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
  answerbox: false
}



var page = Page({
  data: {
    motto: '小程序版',
    userInfo: {},
    problemid: 'unknown',
    showaudio: false,
    showyuansheng: false,
    playstate: false,
    tingstate: true,
    recordstate: true,
    curTimeVal: 0,
    duration: 100,
    audioSrc: '',
    answerbox: true,
    audiopath: '',
    hidehuida: false,
    textsolu: '',
    answerpicsrc: '',
    desc: '',
    answer: null,
    commentcontent: null,
    subscribe_door: true,

    problempic: 'noimages',
    modalHidden: true,
    shareShow: 'none',
    shareOpacity: {},
    shareBottom: {},
    modalValue: null,
    showpic: true,
    comments: ['notnull'],

  },
  /**
   * 关闭分享
   */
  dianzan: function (e) {
    var commentid = e.target.dataset.id
    var problemid = e.target.dataset.problemid
    var commenter = e.target.dataset.commenter
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/dianzan/',
      data: { 'userid': app.globalData.openid, 'commentid': commentid, 'problemid': problemid, 'commenter': commenter },
      success: function (res) {
        if (res.data.code == '200') {
          var comments = JSON.parse(res.data.comment)
          var tmp = JSON.stringify(comments).replace(/avatar":"(.*?avatar\/)([\w]*)(.jpg)(.*?submittime":")([\d- :]*)/g, function ($0, $1, $2, $3, $4, $5) { var tmpstr = getDateDiff($5); var cachedoor = get_or_create_avatar($2); if (cachedoor) { var cacheavatar = cachedoor } else { var cacheavatar = $1 + $2 + $3 }; return ('avatar":"' + cacheavatar + $4 + tmpstr) })
          // var tmp = JSON.stringify(comments).replace(/submittime":"([\d- :]*)(.*?avatar":")(.*?avatar\/)([\w]*)(.jpg)/g, function ($0, $1, $2, $3, $4, $5) { var tmpstr = getDateDiff($1); var cachedoor = get_or_create_avatar($4); if (cachedoor) { var cacheavatar = cachedoor } else { var cacheavatar = $3 + $4 + $5 }; return ('submittime":"' + tmpstr + $2 + cacheavatar) })

          comments = JSON.parse(tmp)






          that.setData({
            comments: comments
          })
        } else {
          console.log('you dianzan guo le')
        }

      }
    })
  },



  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      var problemid = res.target.dataset.problemid
      return {
        title: '[有人@我]小学奥数，考考你~',

        path: '/pages/question/question?problemid=' + problemid,

        imageUrl: 'https://ceshi.guirenpu.com/images/banner.png',

        success: function (res) {

          console.log("转发成功" + res);

        }
      }

    }
    return {
      title: '[有人@我]小学奥数，考考你~',
      // path: '/pages/tosolve/tosolve',
      path: '/pages/tosolve/tosolve',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },







  handlepic: function () {
    console.log(this.data.showpic)
    this.setData({
      showpic: !this.data.showpic
    })
  },


  shareClose: function () {
    // 创建动画
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: "ease"
    })
    this.animation = animation;

    var that = this;

    setTimeout(function () {
      that.animation.bottom(-210).step();
      that.setData({
        shareBottom: animation.export()
      });
    }.bind(this), 500);

    setTimeout(function () {
      that.animation.opacity(0).step();
      that.setData({
        shareOpacity: animation.export()
      });
    }.bind(this), 500);

    setTimeout(function () {
      that.setData({
        shareShow: "none",
      });
    }.bind(this), 1500);
  },

  modalChange: function (e) {
    var that = this;
    that.setData({
      modalHidden: true
    })
  },
  showShare: function (e) {

    // 创建动画
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease",
    })
    this.animation = animation;
    console.log(animation)

    var that = this;
    that.setData({
      shareShow: "block",
    });

    setTimeout(function () {
      that.animation.bottom(0).step();
      that.setData({
        shareBottom: animation.export()
      });
    }.bind(this), 400);

    // 遮罩层
    setTimeout(function () {
      that.animation.opacity(0.3).step();
      that.setData({
        shareOpacity: animation.export()
      });
    }.bind(this), 400);

  },


  showinvitebox:function(e){
    var problemid = e.currentTarget.dataset.problemid
    wx.navigateTo({
      url: `../invite/invite?problemid=${problemid}`,
    })
  },


  modalTap: function (res) {
    var that = this;

    console.log(res)
    return {
      title: '自定义转发标题',
      path: 'pages/tosolve/tosolve',
      success: function (res) {

      },
      fail: function (res) {
      }
    }
  },


  subscribe: function (e) {
    var that = this
    console.log(e.target.dataset.id)
    if (e.target.dataset.id == true) {
      wx.request({
        url: app.globalData.baseurl + '/subscribe/',
        data: { 'problemid': this.data.problemid, 'userid': app.globalData.openid },
        success: function () {
          console.log('subscribe success')
          that.setData({
            subscribe_door: false
          })
          // that.onShow()
        }
      })
    } else {
      wx.request({
        url: app.globalData.baseurl + '/desubscribe/',
        data: { 'problemid': this.data.problemid, 'userid': app.globalData.openid },
        success: function () {
          console.log('desubscribe success')
          that.setData({
            subscribe_door: true
          })
          // that.onShow()
        }
      })
      this.setData({
        subscribe_door: true
      })

    }

  },

  bindItemTap: function () {
    wx.navigateTo({
      url: '../answer/answer'
    })
  },




  writecomment: function (e) {
    this.setData({
      commentcontent: e.detail.value
    })
  },


  comment: function (event) {
    var event = event
    var that = this
    if (this.data.commentcontent == null) {
      wx.showModal({
        title: 'tishi',
        content: 'please input something',
      })
    }
    else {
      wx.request({
        url: app.globalData.baseurl + '/comment/',
        method: 'post',
        data: { 'userid': app.globalData.openid, 'text': this.data.commentcontent, 'problemid': this.data.problemid },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          // event.detail.value=''
          wx.showToast({
            title: 'comment successfully',
          })
          var comments = JSON.parse(res.data.comment)
          var tmp = JSON.stringify(comments).replace(/avatar":"(.*?avatar\/)([\w]*)(.jpg)(.*?submittime":")([\d- :]*)/g, function ($0, $1, $2, $3, $4, $5) { var tmpstr = getDateDiff($5); var cachedoor = get_or_create_avatar($2); if (cachedoor) { var cacheavatar = cachedoor } else { var cacheavatar = $1 + $2 + $3 }; return ('avatar":"' + cacheavatar + $4 + tmpstr) })


          comments = JSON.parse(tmp)


          that.setData({
            comments: comments,
          })
        }
      })
    }
  },



  audioPlay: function (event) {

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





  showanswerbox: function () {
    this.setData({
      answerbox: false
    })
  },


  start: function (event) {
    if (event.currentTarget.dataset.id) {
      recorderManager.start()
      this.setData({
        recordstate: false
      })
    } else {
      // innerAudioContext.src = app.globalData.audiopath;
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
  textsolu: function (e) {
    this.setData({
      textsolu: e.detail.value
    })
  },

  // play: function (event) {

  //   if (event.currentTarget.dataset.id) {
  //     innerAudioContext.stop()
  //     this.setData({
  //       playstate: false
  //     })
  //   } else {

  //     innerAudioContext.autoplay = true
  //     innerAudioContext.src = app.globalData.returnaudiopath
  //     innerAudioContext.play()
  //     this.setData({
  //       playstate: true
  //     })
  //   }

  // },

  play: function (e) {
    var that = this;

    innerAudioContext.src = e.currentTarget.dataset.recordsrc
    innerAudioContext.play();
    innerAudioContext.onPlay((res) => that.updateTime(that)) //没有这个事件触发，无法执行updatatime
    that.setData({
      tingstate: false
    })
  },



  play1: function (e) {
    var that = this;
    console.log(app.globalData.audiopath)
    innerAudioContext.src = app.globalData.audiopath;
    console.log(innerAudioContext.src)
    // innerAudioContext.play(options);
    innerAudioContext.play();
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

    innerAudioContext.onTimeUpdate((res) => {
      //更新时把当前的值给slide组件里的value值。slide的滑块就能实现同步更新

      console.log("duratio的值：", innerAudioContext.duration)
      console.log('curtime', innerAudioContext.currentTime)
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
    var curval = e.detail.value / 100; //滑块拖动的当前值
    console.log('hhhh')
    console.log(e.detail.value)
    console.log(innerAudioContext.currentTime)
    console.log(curval)
    console.log('dddd')



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
    console.log('this is curtimeval')
    console.log(that.data.curTimeVal)
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
      method: 'post',
      data: { 'textsolu': that.data.textsolu, 'problemid': that.data.problemid, 'teacherid': app.globalData.openid, 'imgsign': 'text' },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.showToast({
          title: '提交成功',
        })
      }
    })
  },


  uploadimg: function (that) {
    wx.uploadFile({
      url: app.globalData.baseurl + '/submitanswer/',
      filePath: that.data.answerpicsrc,
      formData: { 'textsolu': that.data.textsolu, 'problemid': that.data.problemid, 'teacherid': app.globalData.openid, 'imgsign': 'true' },
      name: 'image',
      success: function (res) {
        wx.showToast({
          title: '提交成功',
        })
      }
    })
  },

  uploadrecord: function (that) {
    wx.uploadFile({
      formData: { 'textsolu': that.data.textsolu, 'problemid': that.data.problemid, 'teacherid': app.globalData.openid, 'imgsign': 'false' },
      url: app.globalData.baseurl + '/submitanswer/',
      filePath: app.globalData.audiopath,
      name: 'record',
      success: function (res) {
        wx.showToast({
          title: '提交成功',
        })
      },
    })
  },
  submitanswer: function () {
    var that = this;
    if (that.data.textsolu == '') {
      wx.showModal({
        title: 'input desc',
        content: 'input desc',
      })
    } else {
      this.setData({
        answerbox: true
      })
      if (app.globalData.audiopath) {
        that.uploadrecord(that)
      }
      if (that.data.answerpicsrc) {
        that.uploadimg(that)
      }
      if (!that.data.answerpicsrc & !app.globalData.audiopath) {
        that.uploadtext(that)
      }
      app.globalData.audiopath = null
    }


  },

  onLoad: function (option) {

    this.setData({
      problemid: option.problemid
    })


    var that = this
    wx.request({
      url: app.globalData.baseurl + '/questiondetail/',
      method: 'post',
      data: { 'problemid': that.data.problemid, 'userid': app.globalData.openid },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var subscribe_door = JSON.parse(res.data.subscribe_door)
        if (subscribe_door[0].i == 1) {
          that.setData({
            subscribe_door: false
          })
        } else {
          that.setData({
            subscribe_door: true
          })
        }
        // that.onShow()
        var problem = JSON.parse(res.data.problem)
        var answer = JSON.parse(res.data.answer)
        var hidehuida = JSON.parse(res.data.answerbox)
        var comments = JSON.parse(res.data.comment)

        var tmp = JSON.stringify(comments).replace(/avatar":"(.*?avatar\/)([\w]*)(.jpg)(.*?submittime":")([\d- :]*)/g, function ($0, $1, $2, $3, $4, $5) { var tmpstr = getDateDiff($5); var cachedoor = get_or_create_avatar($2); if (cachedoor) { var cacheavatar = cachedoor } else { var cacheavatar = $1 + $2 + $3 }; return ('avatar":"' + cacheavatar + $4 + tmpstr) })
        // var tmp = JSON.stringify(comments).replace(/submittime":"([\d- :]*)(.*?avatar":")(.*?avatar\/)([\w]*)(.jpg)/g, function ($0, $1, $2, $3, $4, $5) { var tmpstr = getDateDiff($1); var cachedoor = get_or_create_avatar($4); if (cachedoor) { var cacheavatar = cachedoor } else { var cacheavatar = $3 + $4 + $5 }; return ('submittime":"' + tmpstr + $2 + cacheavatar) })


        comments = JSON.parse(tmp)

        that.setData({
          desc: problem[0].fields.description,
          problempic: problem[0].fields.problempic,
          answer: answer,
          hidehuida: hidehuida,
          comments: comments,
        })
      },
      fail: function () {
        console.log('fail load detail')
      }
    })



  },
  tapName: function (event) {
    console.log(event)
  },

  onReady: function () {

  },
  onShow: function () {
    wx.hideKeyboard()

  },
  onHide: function () {

  }
})
