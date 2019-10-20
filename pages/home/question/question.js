//answer.js
var app = getApp()
var console = require('../../../utils/console.js')
var network = require('../../../utils/network.js')
var config = require('../../../config.js')

//inner audio
const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = false
innerAudioContext.onPlay(() => { })
innerAudioContext.onStop(() => { })
innerAudioContext.onPause(() => { })
innerAudioContext.onError((res) => { })

//record manager
const recorderManager = wx.getRecorderManager()
recorderManager.onStart(() => { })
recorderManager.onResume(() => { })
recorderManager.onPause(() => { })
recorderManager.onStop((res) => {
  innerAudioContext.src = res.tempFilePath
  app.globalData.audiopath = res.tempFilePath
  app.globalData.duration = res.duration
  const {
    tempFilePath
  } = res
})
recorderManager.onFrameRecorded((res) => {
  const {
    frameBuffer
  } = res
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
var answerpicsrc = ''
var haoti = 'false'
var page = Page({
  data: {
    problemid: null,
    showyuansheng: false,
    tingstate: true,
    recordstate: true,
    curTimeVal: 0,
    duration: 100,
    answerbox: true,
    hidehuida: false,
    textsolu: '',
    desc: '',
    answer: [],
    commentcontent: null,
    subscribe_door: true,
    answerdoor: '',
    problempic: 'noimages',
    problempic1: '',
    problempic2: '',
    problempic3: '',
    showpic: true,
    comments: ['notnull'],
    grade: null,
    inputnum: 0,
    files: ["/images/pic_160.png"],
    lookedtime: 0,
    hidecaina: true,
    showdetail: false,
    category: ''
  },
  switch2Change(e) {
    if (e.detail.value) {
      haoti = 'true'
    } else {
      haoti = 'false'
    }
  },
  caina: function (e) {
    var that = this
    var solutionid = e.currentTarget.dataset.solutionid
    var all = that.data.answer;
    network.post('/problem/createcaina', {
      'solutionid': solutionid,
      'openid': app.globalData.openid
    }, function () {
      all[e.currentTarget.dataset.index].Cainastatus = '已采纳'
      that.setData({
        answer: all
      })
      wx.showToast({
        title: '已采纳',
      })
    });
  },

  zansolution: function (e) {
    var that = this
    var all = that.data.answer
    network.post('/problem/createzansolution', {
      'solutionid': e.currentTarget.dataset.solutionid,
      'openid': app.globalData.openid
    }, function (res) {
      all[e.currentTarget.dataset.index].Zanstatus = '已赞'
      that.setData({
        answer: all
      })
      wx.showToast({
        title: '已赞',
      })
    })
  },



  viewimage: function (e) {
    var that = this
    var image = e.currentTarget.dataset.image
    var images = []
    if (that.data.problempic != '') {
      images = images.concat([that.data.problempic])
    }
    if (that.data.problempic1 != '') {
      images = images.concat([that.data.problempic1])
    }
    if (that.data.problempic2 != '') {
      images = images.concat([that.data.problempic2])
    }
    if (that.data.problempic3 != '') {
      images = images.concat([that.data.problempic3])
    }
    console.log(e.currentTarget.dataset)
    if (e.currentTarget.dataset.key) {
      images = images.concat([image])
    }
    wx.previewImage({
      current: image,
      urls: images,
    })
  },
  dianzan: function (e) {
    var that = this
    network.post('/problem/createzancomment', {
      'openid': app.globalData.openid,
      'commentid': e.target.dataset.id
    }, function (res) {
      that.setData({
        comments: res.comment
      })
    })
  },



  onShareAppMessage: function (res) {
    var problemid = this.data.problemid
    if (res.from === 'button') {
      // 来自页面内转发按钮
      problemid = res.target.dataset.problemid
      return {
        title: '[有人@我]数学题，考考你',
        path: '/pages/home/question/question?problemid=' + problemid,
        imageUrl: config.host + '/static/sharepic.jpg',
      }
    }
    return {
      title: '[有人@我]中小学数学题，考考你~',
      path: '/pages/home/question/question?problemid=' + problemid,
      success: function (res) {
      },
    }
  },

  handlepic: function () {
    this.setData({
      showpic: !this.data.showpic
    })
  },

  showinvitebox: function (e) {
    wx.navigateTo({
      url: `/pages/home/invite/invite?problemid=${e.currentTarget.dataset.problemid}`,
    })
  },

  subscribe: function (e) {
    var that = this
    if (e.target.dataset.id == true) {
      network.post('/problem/subscribe', {
        'problemid': JSON.parse(this.data.problemid),
        'userid': app.globalData.selfuserid
      }, function () {
        that.setData({
          subscribe_door: false
        })
      })
    } else {
      network.post('/problem/desubscribe', {
        'problemid': JSON.parse(this.data.problemid),
        'userid': app.globalData.selfuserid
      }, function () {
        that.setData({
          subscribe_door: true
        })
      })
      that.setData({
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
    var that = this
    if (this.data.commentcontent == null || this.data.commentcontent == '') {
      wx.showModal({
        title: '提示',
        content: '请输入评论',
      })
    } else {
      network.post('/problem/createcomment', {
        'openid': app.globalData.openid,
        'desc': this.data.commentcontent,
        'problemid': JSON.parse(this.data.problemid)
      }, function (res) {
        wx.showToast({
          title: '评论成功',
        })
        that.setData({
          comments: res.comment,
          commentcontent: ''
        })
      }, function () {
        wx.showToast({
          title: '评论失败',
        })
      })
    }
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
            } else {
              recorderManager.start()
              that.setData({
                recordstate: false
              })
            }
          }
        })
      } else {
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
      })
    }

  },

  submit: function () {
    wx.uploadFile({
      url: config.host + '/upload/',
      filePath: app.globalData.audiopath,
      name: 'record',
      success: function (res) {
        app.globalData.audiopath = null
      }
    })
  },

  textsolu: function (e) {
    this.setData({
      textsolu: e.detail.value,
      inputnum: e.detail.value.length
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
    var curval = e.detail.value / 100;
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

        })
        answerpicsrc = src
      }
    })
  },

  uploadtext: function (that) {
    var stringArray = new Array();
    network.post('/problem/createsolution', {
      'desc': that.data.textsolu,
      'haoti': haoti,
      'topicids': stringArray,
      'problemid': JSON.parse(that.data.problemid),
      'openid': app.globalData.openid,
      'pic': '',
      'record': ''
    }, function () {
      wx.showToast({
        title: '回答成功',
      })
    })
  },


  uploadimg: function (that) {
    var stringArray = new Array();
    wx.uploadFile({
      url: config.host + '/problem/createsolution',
      filePath: answerpicsrc,
      formData: {
        'desc': that.data.textsolu,
        'haoti': haoti,
        'topicids': stringArray,
        'problemid': JSON.parse(that.data.problemid),
        'openid': app.globalData.openid,
        'noimage': 'false',
        'norecord': 'true'
      },
      name: 'image',
      success: function (res) {
        wx.showToast({
          title: '回答成功',
        })
      }
    })
  },



  uploadrecord: function (that) {
    var stringArray = new Array();
    wx.uploadFile({
      formData: {
        'desc': that.data.textsolu,
        'haoti': haoti,
        'topicids': stringArray,
        'problemid': JSON.parse(that.data.problemid),
        'openid': app.globalData.openid,
        'noimage': 'true',
        'norecord': 'false'
      },
      url: config.host + '/problem/createsolution',
      filePath: app.globalData.audiopath,
      name: 'record',
      success: function (res) {
        wx.showToast({
          title: '回答成功',
        })
      },
    })
  },
  submitanswer: function (e) {
    network.post('/user/pushformid', {
      'formid': e.detail.formId,
      'openid': app.globalData.openid
    })

    var that = this;
    if (that.data.textsolu == '') {
      wx.showModal({
        title: '提示',
        content: '请输入文字内容',
      })
    } else {
      this.setData({
        answerbox: true
      });
      if (app.globalData.audiopath) {
        that.uploadrecord(that)
      }
      if (answerpicsrc) {
        that.uploadimg(that)
      }
      if (!answerpicsrc & !app.globalData.audiopath) {
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
        url: `/pages/settings/profile/profile?userid=${userid}&avatar=${avatar}&username=${username}&openid=${openid}`,
      })
    }
  },

  onLoad: function (option) {

    this.setData({
      problemid: option.problemid
    })
    var that = this


    if (!app.globalData.openid || app.globalData.openid == undefined) {
      wx.login({
        success: res => {
          network.post('/user/getopenid', {
            js_code: res.code
          }, function (res) {
            app.globalData.openid = res.openid
            app.globalData.selfuserid = res.userid
            getproblem(that)
          })
        }
      })
    } else {
      getproblem(that)
    }

  },

  onReady: function () {
    var that = this

    if (!app.globalData.openid) {
      wx.login({
        success: res => {
          network.post('/user/getopenid', {
            js_code: res.code
          }, function (res) {
            app.globalData.openid = res.openid
            app.globalData.selfuserid = res.userid
            app.connect()
          })
        }
      })
    }
  },
  onShow: function () {
    wx.hideKeyboard()
  },
  onPullDownRefresh: function () {
    var that = this
    getproblem(that)
    wx.stopPullDownRefresh() //停止下拉刷新
  }
})

function getproblem(that) {
  wx.showNavigationBarLoading()
  network.post('/problem/detail', {
    'problemid': that.data.problemid,
    'openid': app.globalData.openid
  }, function (res) {
    var problem = res.problem
    if (!problem.problempic) {
      problem.problempic = 'noimages'
    }
    that.setData({
      subscribe_door: res.subscribe_door != '1',
      grade: problem.grade,
      category: problem.category || '',
      desc: problem.description,
      problempic: problem.problempic,
      problempic1: problem.problempic1 || '',
      problempic2: problem.problempic2 || '',
      problempic3: problem.problempic3 || '',
      answer: res.answer || [],
      hidehuida: res.hideanwserbox,
      comments: res.comment || [],
      lookedtime: res.lookedtime,
      hidecaina: res.hidecaina != undefined,
      showdetail: true,
    })
  }, function () { }, function () {
    wx.hideNavigationBarLoading()
  })
}