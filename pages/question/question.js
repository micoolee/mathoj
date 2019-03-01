//answer.js
var util = require('../../utils/util.js')
var app = getApp()

//inner audio
const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = false
innerAudioContext.onPlay(() => {})
innerAudioContext.onStop(() => {})
innerAudioContext.onPause(() => {})
innerAudioContext.onError((res) => {})

//record manager
const recorderManager = wx.getRecorderManager()
recorderManager.onStart(() => {})
recorderManager.onResume(() => {})
recorderManager.onPause(() => {})
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



var page = Page({
  data: {
    motto: '小程序版',
    userInfo: {},
    problemid: null,
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
    answerdoor: '',
    problempic: 'noimages',
    problempic1:'',
    problempic2:'',
    problempic3:'',
    modalHidden: true,
    shareShow: 'none',
    shareOpacity: {},
    shareBottom: {},
    modalValue: null,
    showpic: true,
    comments: ['notnull'],
    grade: null,
    inputnum: 0,
    files: ["../../images/pic_160.png"],
    lookedtime: 0,
    hidecaina: true,
    showdetail: false,
    topicids: [],
    haoti: 'false',

  },
  switch2Change(e) {
    var that = this
    if (e.detail.value) {
      that.setData({
        haoti: 'true'
      })
    } else {
      that.setData({
        haoti: 'false'
      })
    }
  },
  caina: function(e) {
    var that = this
    var solutionid = e.currentTarget.dataset.solutionid
    var all = that.data.answer
    wx.request({
      url: app.globalData.baseurl + '/problem/createcaina',
      data: {
        'solutionid': solutionid,
        'openid': app.globalData.openid
      },
      method: 'POST',
      success: function(res) {
        all[e.currentTarget.dataset.index].Cainastatus = '已采纳'
        that.setData({
          answer: all
        })

        wx.showToast({
          title: '已采纳',
        })
      }
    })
  },

  zansolution: function(e) {
    var that = this
    var solutionid = e.currentTarget.dataset.solutionid
    var all = that.data.answer
    wx.request({
      url: app.globalData.baseurl + '/problem/createzansolution',
      data: {
        'solutionid': solutionid,
        'openid': app.globalData.openid
      },
      method: 'POST',
      success: function(res) {
        all[e.currentTarget.dataset.index].Zanstatus = '已赞'
        that.setData({
          answer: all
        })

        wx.showToast({
          title: '已赞',
        })
      }
    })
  },



  viewimage: function(e) {
    var that = this
    var e = e
    var image = e.currentTarget.dataset.image
    var images = []
    if(that.data.problempic!=''){
      images=images.concat([that.data.problempic])
    }
    if (that.data.problempic1 != '') {
      images=images.concat([that.data.problempic1])
    }
    if (that.data.problempic2 != '') {
      images=images.concat([that.data.problempic2])
    }
    if (that.data.problempic3 != '') {
      images=images.concat([that.data.problempic3])
    }
    wx.previewImage({
      current: image,
      urls: images,
    })
  },
  dianzan: function(e) {
    var commentid = e.target.dataset.id
    var problemid = e.target.dataset.problemid
    var commenter = e.target.dataset.commenter
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/problem/createzancomment',
      data: {
        'openid': app.globalData.openid,
        'commentid': commentid
      },
      method: 'POST',
      success: function(res) {

        var comments = res.data.comment
        that.setData({
          comments: comments
        })
      }
    })
  },



  onShareAppMessage: function(res) {
    console.log(res)
    console.log(this.data.problemid)
    var problemid = this.data.problemid
    if (res.from === 'button') {
      // 来自页面内转发按钮
      problemid = res.target.dataset.problemid
      return {
        title: '[有人@我]小学奥数，考考你~',
        path: '/pages/question/question?problemid=' + problemid,
        imageUrl: app.globalData.baseurl + '/static/sharepic.jpg',
        success: function(res) {}
      }

    }
    return {
      title: '[有人@我]中小学数学题，考考你~',
      path: '/pages/question/question?problemid=' + problemid,
      success: function(res) {
      },

    }
  },

  handlepic: function() {
    this.setData({
      showpic: !this.data.showpic
    })
  },


  shareClose: function() {
    // 创建动画
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: "ease"
    })
    this.animation = animation;

    var that = this;

    setTimeout(function() {
      that.animation.bottom(-210).step();
      that.setData({
        shareBottom: animation.export()
      });
    }.bind(this), 500);

    setTimeout(function() {
      that.animation.opacity(0).step();
      that.setData({
        shareOpacity: animation.export()
      });
    }.bind(this), 500);

    setTimeout(function() {
      that.setData({
        shareShow: "none",
      });
    }.bind(this), 1500);
  },

  modalChange: function(e) {
    var that = this;
    that.setData({
      modalHidden: true
    })
  },
  showShare: function(e) {
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

    setTimeout(function() {
      that.animation.bottom(0).step();
      that.setData({
        shareBottom: animation.export()
      });
    }.bind(this), 400);

    // 遮罩层
    setTimeout(function() {
      that.animation.opacity(0.3).step();
      that.setData({
        shareOpacity: animation.export()
      });
    }.bind(this), 400);

  },


  showinvitebox: function(e) {
    var problemid = e.currentTarget.dataset.problemid
    wx.navigateTo({
      url: `../invite/invite?problemid=${problemid}`,
    })
  },


  subscribe: function(e) {
    var that = this
    if (e.target.dataset.id == true) {
      wx.request({
        url: app.globalData.baseurl + '/problem/subscribe',
        data: {
          'problemid': JSON.parse(this.data.problemid),
          'userid': app.globalData.selfuserid
        },
        method: 'POST',
        success: function() {
          that.setData({
            subscribe_door: false
          })
          // that.onShow()
        }
      })
    } else {
      wx.request({
        url: app.globalData.baseurl + '/problem/desubscribe',
        data: {
          'problemid': JSON.parse(this.data.problemid),
          'userid': app.globalData.selfuserid
        },
        method: 'POST',
        success: function() {
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

  bindItemTap: function() {
    wx.navigateTo({
      url: '../answer/answer'
    })
  },




  writecomment: function(e) {
    this.setData({
      commentcontent: e.detail.value
    })
  },


  comment: function(event) {
    var event = event
    var that = this
    if (this.data.commentcontent == null||this.data.commentcontent=='') {
      wx.showModal({
        title: '提示',
        content: '请输入评论',
      })
    } else {
      wx.request({
        url: app.globalData.baseurl + '/problem/createcomment',
        method: 'post',
        data: {
          'openid': app.globalData.openid,
          'desc': this.data.commentcontent,
          'problemid': JSON.parse(this.data.problemid)
        },
        success: function(res) {
          wx.showToast({
            title: '评论成功',
          })
          var comments = res.data.comment

          that.setData({
            comments: comments,
            commentcontent:''
          })
        },fail:function(e){
          wx.showToast({
            title: '评论失败',
          })
        }
      })
    }
  },


  //todel
  audioPlay: function(event) {

    innerAudioContext.src = event.currentTarget.dataset.recordsrc
    innerAudioContext.play()
  },
  audioPause: function() {
    innerAudioContext.pause()
  },

  audioStart: function() {
    innerAudioContext.seek(0)
  },





  showanswerbox: function() {
    this.setData({
      answerbox: false
    })
  },


  start: function(event) {
    var that = this
    if (event.currentTarget.dataset.id) {


      if (app.globalData.audiopath != null) {
        wx.showModal({
          title: '提示',
          content: '你确定需要重录？',
          success: function(res) {
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
        audioSrc: app.globalData.audiopath,
      })
    }

  },

  submit: function() {
    var that = this;
    wx.uploadFile({
      url: app.globalData.baseurl + '/upload/',
      filePath: app.globalData.audiopath,
      name: 'record',
      success: function(res) {
        app.globalData.returnaudiopath = res.data,
          app.globalData.audiopath = null
        that.setData({
          showaudio: true
        })
      }
    })
  },

  textsolu: function(e) {
    var inputnum = e.detail.value.length
    this.setData({
      textsolu: e.detail.value,
      inputnum: inputnum
    })
  },

  play: function(e) {
    var that = this;

    innerAudioContext.src = e.currentTarget.dataset.recordsrc
    innerAudioContext.play();
    innerAudioContext.onPlay((res) => that.updateTime(that)) //没有这个事件触发，无法执行updatatime
    that.setData({
      tingstate: false
    })
  },



  play1: function(e) {
    var that = this;
    innerAudioContext.src = app.globalData.audiopath;
    innerAudioContext.play();
    innerAudioContext.onPlay((res) => that.updateTime(that)) //没有这个事件触发，无法执行updatatime
    this.setData({
      tingstate: false
    })
  },
  pause1: function() {
    innerAudioContext.pause();
    this.setData({
      tingstate: true
    })
  },
  updateTime: function(that) {

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
  slideBar: function(e) {
    let that = this;
    var curval = e.detail.value / 100; 


    innerAudioContext.seek(curval); //让滑块跳转至指定位置
    innerAudioContext.onSeeked((res) => {
      this.updateTime(that) //注意这里要继续出发updataTime事件，
    })
  },

  setStopState: function(that) {
    that.setData({
      curTimeVal: 0,
      tingstate: true
    })

    innerAudioContext.stop()
  },

  takephoto: function() {
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

  choosetopic: function(e) {
    console.log(e)
  },

  uploadtext: function(that) {
    var stringArray = new Array();
    // for (var i=0;i<that.data.topicids.length;i++){
    //     stringArray.append(that.data.topicids[i])
    // }
    wx.request({
      url: app.globalData.baseurl + '/problem/createsolution',
      method: 'post',
      data: {
        'desc': that.data.textsolu,
        'haoti': that.data.haoti,
        'topicids': stringArray,
        'problemid': JSON.parse(that.data.problemid),
        'openid': app.globalData.openid,
        'pic': '',
        'record': ''
      },
      success: function(res) {
        wx.showToast({
          title: '回答成功',
        })
      }
    })
  },


  uploadimg: function(that) {
    var stringArray = new Array();
    wx.uploadFile({
      url: app.globalData.baseurl + '/problem/createsolution',
      filePath: that.data.answerpicsrc,
      formData: {
        'desc': that.data.textsolu,
        'haoti': that.data.haoti,
        'topicids': stringArray,
        'problemid': JSON.parse(that.data.problemid),
        'openid': app.globalData.openid,
        'noimage': 'false',
        'norecord': 'true'
      },
      name: 'image',
      success: function(res) {
        wx.showToast({
          title: '回答成功',
        })
      }
    })
  },



  uploadrecord: function(that) {
    var stringArray = new Array();
    wx.uploadFile({
      formData: {
        'desc': that.data.textsolu,
        'haoti': that.data.haoti,
        'topicids': stringArray,
        'problemid': JSON.parse(that.data.problemid),
        'openid': app.globalData.openid,
        'noimage': 'true',
        'norecord': 'false'
      },
      url: app.globalData.baseurl + '/problem/createsolution',
      filePath: app.globalData.audiopath,
      name: 'record',
      success: function(res) {
        wx.showToast({
          title: '回答成功',
        })
      },
    })
  },
  submitanswer: function(e) {
    wx.request({
      url: app.globalData.baseurl + '/user/pushformid',
      method: 'POST',
      data: {
        'formid': e.detail.formId,
        'openid': app.globalData.openid
      },
      success: function(res) {}
    });
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
      if (that.data.answerpicsrc) {
        that.uploadimg(that)
      }
      if (!that.data.answerpicsrc & !app.globalData.audiopath) {
        that.uploadtext(that)
      }
      app.globalData.audiopath = null
    }


  },



  showmore: function(e) {
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

  onLoad: function(option) {

    this.setData({
      problemid: option.problemid
    })
    var that = this


    if (!app.globalData.openid || app.globalData.openid == undefined) {
      wx.login({
        success: res => {
          wx.request({
            data: {
              js_code: res.code
            },
            url: app.globalData.baseurl + '/user/getopenid',

            method: 'POST',
            success: function(res) {
              app.globalData.openid = res.data.openid
              app.globalData.selfuserid = res.data.userid
              getproblem(that)
            },
          })
        }
      })
    } else {
      getproblem(that)
    }

  },

  onReady: function() {
    var that = this

    if (!app.globalData.openid) {
      wx.login({
        success: res => {
          wx.request({
            data: {
              js_code: res.code
            },
            url: app.globalData.baseurl + '/user/getopenid',
            method: 'POST',
            success: function(res) {
              app.globalData.openid = res.data.openid
              app.globalData.selfuserid = res.data.userid
              app.connect()
            },
          })
        }
      })
    }
  },
  onShow: function() {
    wx.hideKeyboard()

  },
  onPullDownRefresh: function() {
    var that = this

    getproblem(that)

    wx.stopPullDownRefresh() //停止下拉刷新
  }

})



function getproblem(that) {
  wx.showNavigationBarLoading()
  wx.request({
    url: app.globalData.baseurl + '/problem/detail',
    method: 'post',
    data: {
      'problemid': that.data.problemid,
      'openid': app.globalData.openid
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function(res) {
      var subscribe_door = res.data.subscribe_door
      //回答窗口一直开放
      // var answerdoor = res.data.solved
      // that.setData({
      //   answerdoor: answerdoor
      // })


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
      var answer
      if (!res.data.answer) {
        answer = []
      } else {
        answer = res.data.answer
      }
      var hidehuida = res.data.hideanwserbox
      var comments
      if (!res.data.comment) {
        comments = []
      } else {
        comments = res.data.comment
      }

      var lookedtime = res.data.lookedtime
      var hidecaina = res.data.hidecaina != undefined
      if (!problem.problempic) {
        problem.problempic = 'noimages'
      }

      that.setData({
        grade: problem.grade,
        desc: problem.description,
        problempic: problem.problempic,
        problempic1:problem.problempic1||'',
        problempic2: problem.problempic2 || '',
        problempic3: problem.problempic3 || '',
        answer: answer,
        hidehuida: hidehuida,
        comments: comments,
        lookedtime: lookedtime,
        hidecaina: hidecaina,
        showdetail: true,
      })
      app.globalData.answerlist = that
    },
    fail: function() {},
    complete: function() {
      wx.hideNavigationBarLoading()
    }
  })
}