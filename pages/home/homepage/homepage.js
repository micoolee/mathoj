const app = getApp()
var util = require('../../../utils/util.js')
var sliderWidth = 96;
var network = require('../../../utils/network.js')
var config = require('../../../config.js')
var searchParam = []
var formerid = 0
var jinxuanformerid = 0
var choosejinxuan = 0
var tmpgrade = 0 //0是不限

var formerid1 = 0
var tmpgrade1 = 0
Page({
  data: {
    bottom: false,
    jigouhavenew: false,
    discoveryhavenew: false,
    inputvalue: null,
    //点击确认筛选后展示的结果
    activeIndexStr: '题库',
    gradeStr: '不限',
    //点击筛选中的值，实时展示
    filterjinxuan: 0,
    filtergrade: 0,
    showmask1: false,//筛选页,false为不显示
    problemlist1: [],
    grade1: 0,
    gradeStr1: '不限',
    filtergrade1: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    problemlist: undefined,
    jinxuanproblemlist: [],
    show: 'jigou',
    teacherranklist: [],
    schoolranklist: [],
    showmask: false,//筛选页,false为无开屏
    schools: [],
    activeIndex: 0,
    ifinschool: 'loading',//该用户是否已经加入了一个机构
    applyingschool: 0
  },
  totopics: function (e) {
    wx.showModal({
      title: '提示',
      content: '暂未开放，敬请期待'
    })
  },
  tovideos: function (e) {
    wx.navigateTo({
      url: '/pages/home/video/video',
    })
  },
  applytojoinshool: function (e) {
    var that = this
    wx.showModal({
      title: '只能加入一家机构',
      content: '确认申请？',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            applyingschool: e.currentTarget.dataset.schoolid * 1
          })
          //发送网络申请
          network.post('/user/applytojoinschool', {
            'userid': app.globalData.selfuserid,
            'schoolid': e.currentTarget.dataset.schoolid * 1,
            // 'remark': remark,
          }, function (res) {
            // that.setData({
            //   // showjoinremark: false,
            //   inputInfo: ''
            // })
            // remark = ''
            if (!res.resultCode) {
              app.globalData.school = 'schoolid'
              wx.showToast({
                title: '已申请',
              })
            } else if (res.resultMsg == "HaveApplyHandling") {
              wx.showToast({
                title: '勿重复申请',
              })
            } else {
              wx.showToast({
                title: '申请失败',
              })
            }
          })
        }
      }
    })

  },
  // 转换为机构模式
  showjigou: function (e) {
    this.setData({
      show: 'jigou'
    })
  },
  // 转换为发现模式
  showdiscovery: function (e) {
    this.setData({
      show: 'discovery'
    })
  },
  // 转换为排行模式
  showrank: function (e) {
    // wx.showNavigationBarLoading()
    this.setData({
      show: 'rank'
    })
    // wx.hideNavigationBarLoading()
  },
  // 去我的机构老师同学
  toschoolmate: function (e) {
    wx.navigateTo({
      url: '/pages/home/schoolmate/schoolmate',
    })
  },
  // 去匿名留言区
  topostnote: function (e) {
    wx.navigateTo({
      url: '/pages/home/anonymousnote/anonymousnote',
    })
  },


  // 机构里面设置题集或者精选
  switchactiveIndex: function (e) {
    ////console.log('switchactiveIndex: ', e)
    choosejinxuan = e.currentTarget.dataset.id
    this.setData({
      filterjinxuan: e.currentTarget.dataset.id
    })
  },
  // 机构里面设置年级
  switchgrade: function (e) {
    tmpgrade = e.currentTarget.dataset.id * 1
    this.setData({
      filtergrade: e.currentTarget.dataset.id * 1
    })
  },
  // 发现里面设置年级
  switchgrade1: function (e) {
    tmpgrade1 = e.currentTarget.dataset.id
    this.setData({
      filtergrade1: tmpgrade1
    })
  },

  // 显示机构筛选
  showfilter: function (e) {
    this.setData({
      showmask: true,
      filterjinxuan: choosejinxuan,
      filtergrade: tmpgrade
    })
  },
  //显示附近筛选
  showfilter1: function (e) {
    this.setData({
      showmask1: true,
      filtergrade1: tmpgrade1
    })
  },

  // 筛选机构的题目
  confirmfilter: function (e) {
    this.setData({
      showmask: false,
      activeIndex: choosejinxuan,
      activeIndexStr: util.tijis[choosejinxuan],
      gradeStr: util.filtergradearray[tmpgrade]
    })
    app.globalData.grade = tmpgrade
    var that = this;
    formerid = 0
    if (tmpgrade == 0) {
      searchParam = []
    } else {
      searchParam = [util.filtergradearray[tmpgrade]]
    }

    if (choosejinxuan == '0') {
      network.post('/problem/getten', {
        'openid': app.globalData.openid,
        'formerid': 0,
        'filter': searchParam,
        'jinxuan': '0'
      }, function (res) {
        if (res.problem == undefined) {
          that.setData({
            bottom: true,
            problemlist: []
          })
        } else {
          that.setData({
            problemlist: res.problem,
          })
          formerid = res.problem[res.problem.length - 1]['problemid']
        }
      })
    } else {
      network.post('/problem/getten', {
        'openid': app.globalData.openid,
        'formerid': 0,
        'filter': searchParam,
        'jinxuan': '1'
      }, function (res) {
        if (res.problem == undefined) {
          that.setData({
            bottom: true,
            jinxuanproblemlist: []
          })
        } else {
          that.setData({
            jinxuanproblemlist: res.problem,
          })
          jinxuanformerid = res.problem[res.problem.length - 1]['problemid']
        }
      })
    }
  },

  // 筛选附近十题
  confirmfilter1: function (e) {
    wx.showNavigationBarLoading()
    this.setData({
      showmask1: false,
      grade1: tmpgrade1,
      gradeStr1: util.filtergradearray[tmpgrade1]
    })
    app.globalData.grade = tmpgrade
    var that = this;
    that.formerid1 = 0
    network.post('/problem/getnearbytenproblem', {
      'openid': app.globalData.openid,
      'formerid': 0,
      'scope': 'all',
      'grade': util.filtergradearray[tmpgrade1] || '',
    }, function (res) {
      if (res.problems == undefined) {
        that.setData({
          bottom: true,
          problemlist1: []
        })
      } else {
        that.setData({
          problemlist1: res.problems,
        })
        that.formerid1 = res.problems[res.problems.length - 1]['problemid']
      }
    }, function () { }, function () {
      wx.hideNavigationBarLoading()
    })
  },


  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      var problemid = res.target.dataset.problemid
      return {
        title: '[有人@我]有题目不会，帮帮我~',
        path: '/pages/home/question/question?problemid=' + problemid,
        imageUrl: config.host + '/static/sharepic.jpg',
      }
    }
    return {
      title: '[有人@我]有题目不会，帮帮我~',
      path: '/pages/home/homepage/homepage',
    }
  },
  //放弃冒泡
  drop: function (e) {
    ////console.log('drop tap')
  },
  //发问
  toask: function () {
    var that = this
    //验证是否合法
    if (app.globalData.authorized == 'true' || app.globalData.avatar != 'stranger') {
      wx.navigateTo({
        url: '../ask/ask',
      })
    } else {
      util.checkuserinfo(that)
    }
  },
  //返回顶部
  totop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  //进入问题详情页
  bindQueTap: function (e) {
    wx.navigateTo({
      url: `/pages/home/question/question?problemid=${e.currentTarget.dataset.id}`
    })
  },

  //轮询直到getopenid加载完毕
  load: function (e) {
    var that = this
    setTimeout(function () {
      if (app.globalData.getopenidok) {
        //如果用户允许获取地理位置，上传位置信息
        wx.getLocation({
          type: 'gcj02', //返回可以用于wx.openLocation的经纬度
          success: (res) => {
            app.globalData.authorized = 'true'
            //上传用户地理位置
            network.post('/location/update', {
              'openid': app.globalData.openid,
              'latitude': res.latitude,
              'longitude': res.longitude
            }, function () {
            })
          }
        });
        if (app.globalData.onlysee && app.globalData.grade && app.globalData.grade != 0) {//设置了只看且设置了年级的
          searchParam = [util.gradearray[app.globalData.grade]]
          util.getlastedprob(that, searchParam)
          util.getnearbytenproblem(that, util.gradearray[app.globalData.grade])
        } else {
          util.getlastedprob(that)
          util.getnearbytenproblem(that)
          if (app.globalData.school == '') {//如果该用户没有加入任何机构
            network.post('/user/gettennearbyschools', {
              'userid': app.globalData.selfuserid,
            }, function (res) {
              that.setData({
                ifinschool: 'false',
                schools: res.schools || [],
                applyingschool: res.applyingschool || 0,
              })
            })
          } else {
            that.setData({
              ifinschool: 'true',
            })
          }
        }
      } else {
        that.load()
      }
    }, 500)
  },

  onLoad: function () {
    var that = this
    app.globalData.homepagethat = this
    this.load()
    //获取排行榜
    network.post('/problem/getrank', {}, function (res) {
      that.setData({
        teacherranklist: res.rankdetail || [],
        schoolranklist: res.schoolrank || []
      })
    })
  },

  //查看提问者信息
  showmore: function (e) {
    var askerid = e.currentTarget.dataset.askerid
    var avatar = e.currentTarget.dataset.avatar
    var username = e.currentTarget.dataset.username
    var openid = e.currentTarget.dataset.openid
    if (openid == app.globalData.openid) {//如果是自己
      wx.switchTab({
        url: '/pages/settings/settings',
      })
    } else {
      //到他的资料页
      wx.navigateTo({
        url: `/pages/settings/profile/profile?userid=${askerid}&avatar=${avatar}&username=${username}&openid=${openid}`,
      })
    }
  },

  conceal: function (e) {
    this.setData({ showmask: false })
  },

  conceal1: function (e) {
    this.setData({ showmask1: false })
  },

  rankshowmore: function (e) {
    var dataset = e.currentTarget.dataset
    if (dataset.openid == app.globalData.openid) {
      wx.switchTab({
        url: '/pages/settings/settings',
      })
    } else {
      wx.navigateTo({
        url: `/pages/settings/profile/profile?userid=${dataset.userid}&avatar=${dataset.avatar}&username=${dataset.username}&openid=${dataset.openid}`,
      })
    }
  },

  onShow: function () {
    var that = this
    if (app.globalData.reddot) {
      wx.showTabBarRedDot({
        index: 2,
      })
    }
    if (that.data.show == 'jigou') {
      util.checklasted(that)
    } else {
      util.checklasted(that, false)
    }
  },

  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    if (choosejinxuan == '0') {
      that.formerid = 0
      switch (that.data.show) {
        case 'jigou':
          if (that.data.ifinschool == 'true') {
            util.getlastedprob(that, searchParam, function () {
              wx.hideNavigationBarLoading()
            });
          }
          break;
        case 'discovery':
          util.getnearbytenproblem(that, util.filtergradearray[tmpgrade1], 0, 'pulldown', function () {
            wx.hideNavigationBarLoading()
          })
          break;
        case 'rank':
          wx.hideNavigationBarLoading()
          break;
      }
    } else if (choosejinxuan == '1') {
      // that.jinxuanformerid = 0
      util.getlastedjinxuanprob(that, searchParam, function () {
        wx.hideNavigationBarLoading()
      })
    }
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  onReachBottom: function () {
    var that = this
    if (choosejinxuan == '0') {
      switch (that.data.show) {
        case 'jigou':
          if (that.data.ifinschool == 'true') {
            util.get10prob(that, searchParam, that.formerid)
          }
          break;
        case 'discovery':
          util.getnearbytenproblem(that, util.filtergradearray[tmpgrade1], that.formerid1, 'reachbottom')
          break;
      }
    } else if (choosejinxuan == '1') {
      util.get10jinxuanprob(that, searchParam)
    }
  },
})