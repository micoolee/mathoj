//answer.js
var util = require('../../utils/util.js')
var app = getApp()
var getDateDiff = util.getDateDiff
var get_or_create_avatar = util.get_or_create_avatar

//inner audio
const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = false
innerAudioContext.onPlay(() => {
})
innerAudioContext.onStop(() => {
})
innerAudioContext.onPause(() => {
})
innerAudioContext.onError((res) => {
})

//record manager
const recorderManager = wx.getRecorderManager()
recorderManager.onStart(() => {
})
recorderManager.onResume(() => {
})
recorderManager.onPause(() => {
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
    answer: [],
    commentcontent: null,
    subscribe_door: true,
    answerdoor:'',
    problempic: 'noimages',
    modalHidden: true,
    shareShow: 'none',
    shareOpacity: {},
    shareBottom: {},
    modalValue: null,
    showpic: false,
    comments: ['notnull'],
    // backfirst: false,
    grade:null,
    inputnum:0,
    files: ["../../images/pic_160.png"],
    lookedtime:0,
    hidecaina:true,
    showdetail:false
  },

  caina:function(e){
    var solutionid = e.currentTarget.dataset.solutionid
    var teacherid = e.currentTarget.dataset.teacherid
    var problemid = e.currentTarget.dataset.problemid
    var askeruserid = app.globalData.openid
    wx.request({
      url: app.globalData.baseurl+'/accept/',
      data:{'solutionid':solutionid,'teacherid':teacherid,'askeruserid':askeruserid,'problemid':problemid},
      success:function(res){
        wx.showToast({
          title: '已采纳',
        })
      }
    })
  },



  viewimage:function(e){
    var that = this
    var  e = e
    var image = e.currentTarget.dataset.image
    wx.previewImage({
      current: '', 
      urls: [image], 
      success:function(){
        that.play(e)
      }
    })
  },
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
          var tmp = JSON.stringify(comments).replace(/avatar":"(.*?avatar\/)([\w-_]*)(.jpg)(.*?submittime":")([\d- :]*)/g, function ($0, $1, $2, $3, $4, $5) { var tmpstr = getDateDiff($5); var cachedoor = get_or_create_avatar($2); if (cachedoor) { var cacheavatar = cachedoor } else { var cacheavatar = $1 + $2 + $3 }; return ('avatar":"' + cacheavatar + $4 + tmpstr) })


          comments = JSON.parse(tmp)
          that.setData({
            comments: comments
          })
        } else {
        }

      }
    })
  },



  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      var problemid = res.target.dataset.problemid
      return {
        title: '[有人@我]小学奥数，考考你~',

        path: '/pages/question/question?problemid=' + problemid,

        imageUrl: app.globalData.baseurl+'/static/sharepic.jpg',

        success: function (res) {
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


  subscribe: function (e) {
    var that = this
    if (e.target.dataset.id == true) {
      wx.request({
        url: app.globalData.baseurl + '/subscribe/',
        data: { 'problemid': this.data.problemid, 'userid': app.globalData.openid },
        success: function () {
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
        title: '提示',
        content: '请输入评论',
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

          wx.showToast({
            title: '评论成功',
          })
          var comments = JSON.parse(res.data.comment)
          var tmp = JSON.stringify(comments).replace(/avatar":"(.*?avatar\/)([\w-_]*)(.jpg)(.*?submittime":")([\d- :]*)/g, function ($0, $1, $2, $3, $4, $5) { var tmpstr = getDateDiff($5); var cachedoor = get_or_create_avatar($2); if (cachedoor) { var cacheavatar = cachedoor } else { var cacheavatar = $1 + $2 + $3 }; return ('avatar":"' + cacheavatar + $4 + tmpstr) })
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
      var that = this
      if (event.currentTarget.dataset.id) {


        if (app.globalData.audiopath != null) {
          wx.showModal({
            title: '提示',
            content: '你确定需要重录？',
            success: function (res) {
              if (res.cancel) {
                return false;
              }else{
                recorderManager.start()
                that.setData({
                  recordstate: false
                })
              }
            }
          })
        }else{
          recorderManager.start()
          that.setData({
            recordstate: false
          })
        }

      } else {
        recorderManager.stop()
        that.setData({
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
        app.globalData.returnaudiopath = res.data,
          app.globalData.audiopath = null//???????????
        that.setData({
          showaudio: true
        })
      }
    })
  },

  textsolu: function (e) {
    var inputnum = e.detail.value.length
    this.setData({
      textsolu: e.detail.value,
      inputnum:inputnum
    })
  },

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
    innerAudioContext.src = app.globalData.audiopath;
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
        that.setData({
          files: [src],
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
        title: '提示',
        content: '请输入文字内容',
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



  showmore: function (e) {
    var userid = e.currentTarget.dataset.userid
    var avatar = e.currentTarget.dataset.avatar
    var username = e.currentTarget.dataset.username
    var openid = e.currentTarget.dataset.openid

    if (openid == app.globalData.openid) {
      wx.switchTab({
        url: '../settings/settings',
      })
    } else {
      wx.navigateTo({
        url: `../settings/profile/profile?userid=${userid}&avatar=${avatar}&username=${username}&openid=${openid}`,
      })
    }
  },

  onLoad: function (option) {
      wx.showNavigationBarLoading()
      this.setData({
        problemid: option.problemid
      })
      var that = this


      if (! app.globalData.openid || app.globalData.openid == undefined){
        wx.login({
          success: res => {
            wx.request({
              data: { js_code: res.code },
              url: app.globalData.baseurl + '/getopenid/',
              method: 'GET',
              success: function (res) {
                app.globalData.openid = res.data.openid
                getproblem(that)
              },
            })
          }
        })
      }else{
        getproblem(that)
      }

  },

  onReady: function () {
    var that = this

    if (!app.globalData.openid) {
      wx.login({
        success: res => {
          wx.request({
            data: { js_code: res.code },
            url: app.globalData.baseurl + '/getopenid/',
            method: 'GET',
            success: function (res) {
              app.globalData.openid = res.data.openid
              app.connect()
            },
          })
        }
      })
    }
  },
  onShow: function () {
    wx.hideKeyboard()

  },
  onHide: function () {

  }
})



function getproblem(that){
  console.log('problemid',that.data.problemid)
  wx.request({
    url: app.globalData.baseurl + '/problem/detail',
    method: 'post',
    data: { 'problemid': that.data.problemid, 'openid': app.globalData.openid },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      var subscribe_door = res.data.subscribe_door
      var answerdoor = res.data.solved

      that.setData({

        answerdoor: answerdoor
      })
      if (subscribe_door == '1') {
        that.setData({
          subscribe_door: false
        })
      } else {
        that.setData({
          subscribe_door: true
        })
      }
      var problem = res.data.problem
      console.log(problem)
      var answer
      if (!res.data.comment) {
        answer = []
      } else {
        answer = res.data.answer
      }
      var hidehuida = res.data.answerbox == undefined
      var comments
      if (! res.data.comment){
        comments = []
      }else{
        comments = res.data.comment
      }
      
      var lookedtime = res.data.lookedtime
      var hidecaina = res.data.hidecaina != undefined

      var tmp = JSON.stringify(comments).replace(/avatar":"(.*?avatar\/)([\w-_]*)(.jpg)(.*?submittime":")([\d- :]*)/g, function ($0, $1, $2, $3, $4, $5) { var tmpstr = getDateDiff($5); var cachedoor = get_or_create_avatar($2); if (cachedoor) { var cacheavatar = cachedoor } else { var cacheavatar = $1 + $2 + $3 }; return ('avatar":"' + cacheavatar + $4 + tmpstr) })

      var answertmp = JSON.stringify(answer).replace(/avatar":"(.*?avatar\/)([\w-_]*)(.jpg)(.*?submittime":")([\d- :]*)/g, function ($0, $1, $2, $3, $4, $5) { var tmpstr = getDateDiff($5); var cachedoor = get_or_create_avatar($2); if (cachedoor) { var cacheavatar = cachedoor } else { var cacheavatar = $1 + $2 + $3 }; return ('avatar":"' + cacheavatar + $4 + tmpstr) })
      answer = JSON.parse(answertmp)
      comments = JSON.parse(tmp)

      that.setData({
        grade: problem.grade,
        desc: problem.description,
        problempic: problem.problempic,
        answer: answer,
        hidehuida: hidehuida,
        comments: comments,
        lookedtime: lookedtime,
        hidecaina: hidecaina,
        showdetail: true,
      })
      app.globalData.answerlist = that
    },
    fail: function () {
    },
    complete:function(){
      wx.hideNavigationBarLoading()
    }
  })
}