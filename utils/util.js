var network = require("network.js")
var console = require("console.js")
var config = require('../config.js')
var storedid = new Map();
const app = getApp()
var categorys = {
  12: ["集合", "基本初等函数", "平面解析几何", "算法初步", "统计", "概率", "平面向量", "三角恒等变换", "解三角形", "数列", "不等式", "圆锥曲线与方程", "空间向量与立体几何", "导数", "推理与证明", "复数", "坐标系与参数方程", "其它"],
  2: ["其它"],
  9: ["二次根式", "一元二次方程", "旋转", "圆", "概率初步", "二次函数", "相似", "锐角三角形", "投影与视图"],
  7: ["有理数", "整式的加减", "一元一次方程", "图形认识初步", "相交线与平行线", "平面直角坐标系", "三角形", "二元一次方程组", "不等式与不等式组", "数据统计"],
  10: ["集合与函数", "基本初等函数", "空间几何", "点线面位置关系", "直线与方程", "圆与方程", "算法初步", "统计", "概率"],
  5: ["四则混合运算", "其它"],
  11: ["集合", "基本初等函数", "平面解析几何", "算法初步", "统计", "概率", "平面向量", "三角恒等变换", "解三角形", "数列", "不等式", "圆锥曲线与方程", "空间向量与立体几何", "导数", "推理与证明", "复数", "坐标系与参数方程", "其它"],
  1: ["其它"],
  4: ["其它"],
  6: ["数与计算", "比和比例", "几何初步", "统计初步", "应用题", "平面直角坐标系", "三角形", "二元一次方程组", "不等式与不等式组", "数据统计"],
  3: ["其它"],
  8: ["全等三角形", "轴对称", "实数", "一次函数", "整式乘除", "因式分解", "分式", "反比例函数", "勾股定理", "四边形", "数据分析"]
}

var gradearray = ['未选择', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三', '高一', '高二', '高三']


function get_or_create_avatar(userid, that = 'null') {
  var res = wx.getStorageInfoSync();
  if (res.keys.indexOf(userid) > -1) {
    var avatarimgcache = wx.getStorageSync(userid)
    if (that != 'null') {
      that.setData({
        userInfo: {
          'avatar': avatarimgcache,
          'nickname': app.globalData.nickname
        }
      })
    }
    return avatarimgcache
  } else {
    storedid.set(userid, 'downloading')
    wx.downloadFile({
      url: config.host + '/swagger/avatar-' + userid + '.jpg',
      success: function (res) {
        console.log('aaa')
        wx.setStorageSync(userid, res.tempFilePath)
        storedid.set(userid, 'downloaded')
        var avatarimgcache = wx.getStorageSync(userid)
        if (that != 'null') {
          that.setData({
            userInfo: {
              'avatar': avatarimgcache,
              'nickname': app.globalData.nickname
            }
          })
        }
        return avatarimgcache
      }
    })
  }
}

function getlastedprob(that, filter) {
  var utilthat = this
  console.log(filter)
  network.post('/problem/getten', {
    'formerid': that.data.formerid,
    'filter': filter || [],
    'solved': '0'
  }, function (res) {
    wx.hideNavigationBarLoading()
    var problemlist = res.problem
    //加载缓存中的照片
    for (var i in problemlist) {
      if (storedid.get(problemlist[i].openid) == 'downloaded') {
        problemlist[i].avatar = get_or_create_avatar(problemlist[i].openid)
      } else if (storedid.get(problemlist[i].openid) == undefined) {
        get_or_create_avatar(problemlist[i].openid)
      }
    }
    that.setData({
      topStories: res.topstory,
    })
    if (!problemlist) {
      that.setData({
        problemlist: []
      })
      return
    }
    that.setData({
      havenewbtn: false,
      lastedid: problemlist[0].problemid,
      problemlist: problemlist,
      formerid: problemlist[problemlist['length'] - 1].problemid
    })
  }, function (e) {
    console.log('fail')
  },
    function (e) {
      wx.hideLoading()
    }
  )
}


function checklasted(that) {
  if (that.data.lastedid != null) {
    var grade = 0
    if (app.globalData.onlysee) {
      grade = app.globalData.grade
    }
    network.post('/problem/checklatest', {
      'formerid': that.data.lastedid,
      'grade': grade
    }, function (res) {
      if (res.count) {
        that.setData({
          havenewbtn: true
        })
      }
    })
  }
}

function getlastedsolvedprob(that, filter) {
  wx.showLoading({
    title: '加载中',
  })
  network.post('/problem/getten', {
    'formerid': 0,
    'filter': filter || [],
    'solved': '1'
  }, function (res) {
    wx.hideNavigationBarLoading()

    if (res.problem) {
      var solvedproblemlist = res.problem
      console.log(solvedproblemlist)
      //加载缓存中的照片
      for (var i in solvedproblemlist) {
        if (storedid.get(solvedproblemlist[i].openid) == 'downloaded') {
          solvedproblemlist[i].avatar = get_or_create_avatar(solvedproblemlist[i].openid)
        } else if (storedid.get(solvedproblemlist[i].openid) == undefined) {
          get_or_create_avatar(solvedproblemlist[i].openid)
        }
      }
      that.setData({
        solvedproblemlist: solvedproblemlist,
        solvedformerid: solvedproblemlist[solvedproblemlist.length - 1].problemid
      })
    } else {
      wx.showToast({
        title: '暂无好题',
      })
      that.setData({
        solvedproblemlist: [],
        solvedformerid: 0
      })
    }

  }, function () {

  }, function () {
    wx.hideNavigationBarLoading() //完成停止加载
    wx.hideLoading()
  })
}

function pulldownmessage(that = null) {
  network.post('/message/getten', {
    'openid': app.globalData.openid,
    'statuscode': '1'
  }, function (res) {
    var messagelist = res.message
    if (messagelist) {
      app.globalData.messagelist = messagelist
      if (that != null) {
        that.setData({
          showdetail: true
        })
      }
    }
  }, function () {

  }, function () {
    wx.hideNavigationBarLoading() //完成停止加载
  })
}


function getsessions(app, that = null) {
  console.log('app:', app)
  network.post('/message/getsessions', {
    'openid': app.globalData.openid
  }, function (res) {
    var sessionlist = res.session
    console.log('sessions res:', res)
    if (!sessionlist) {
      app.globalData.sessionlist = []
      if (that != null) {
        that.setData({
          showdetail: true,
          sessionlist: [],
          sessionlistnull: 0
        })
      }
    } else {
      app.globalData.sessionlist = sessionlist
      if (that != null) {
        that.setData({
          showdetail: true,
          sessionlist: app.globalData.sessionlist,
          sessionlistnull: app.globalData.sessionlist.length
        })
      }
    }
  }, function () {

  }, function () {
    wx.hideNavigationBarLoading() //完成停止加载
  })
}

function get10prob(that, searchparam = []) {
  network.post('/problem/getten', {
    'formerid': that.data.formerid,
    'filter': searchparam,
    'solved': '0'
  }, function (res) {
    var problemlist = res.problem
    if (!problemlist) {
      that.setData({
        bottom: true
      })
      wx.showToast({
        title: '到底啦~',
      })
    } else {
      problemlist = that.data.problemlist.concat(problemlist)
      console.log(problemlist)
      //加载缓存中的照片
      for (var i in problemlist) {
        if (storedid.get(problemlist[i].openid) == 'downloaded') {
          problemlist[i].avatar = get_or_create_avatar(problemlist[i].openid)
        } else if (storedid.get(problemlist[i].openid) == undefined) {
          get_or_create_avatar(problemlist[i].openid)
        }
      }
      that.setData({
        problemlist: problemlist,
        formerid: problemlist[problemlist['length'] - 1].problemid
      })
    }
  })
}

function get10solvedprob(that, searchparam = []) {
  network.post('/problem/getten', {
    'formerid': that.data.solvedformerid,
    'filter': searchparam,
    'solved': '1'
  }, function (res) {

    if (!res.json_data || res.json_data.length == 0) {
      wx.showToast({
        title: '到底啦~',
      })
    } else {
      var problemlist = JSON.parse(res.json_data)
      problemlist = that.data.problemlist.concat(problemlist)
      console.log(problemlist)

      //加载缓存中的照片
      for (var i in problemlist) {
        if (storedid.get(problemlist[i].openid) == 'downloaded') {
          problemlist[i].avatar = get_or_create_avatar(problemlist[i].openid)
        } else if (storedid.get(problemlist[i].openid) == undefined) {
          get_or_create_avatar(problemlist[i].openid)
        }
      }

      that.setData({
        problemlist: problemlist,
        solvedformerid: problemlist[problemlist['length'] - 1].problemid
      })
    }
  })
}

function checkuserinfo(that) {
  wx.getSetting({
    success: function (res) {
      if (res.authSetting['scope.userInfo']) {
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            app.globalData.avatar = res.userInfo.avatarUrl
            app.globalData.nickname = res.userInfo.nickName

            if (app.userInfoReadyCallback) {
              app.userInfoReadyCallback(res)
            }
            loading(that)
          },
          complete: function (res) { }
        })
      } else {
        wx.navigateTo({
          url: '/pages/getuserinfo/getuserinfo',
        })
      }
    }
  })
}

function loading(that) {
  if (app.globalData.avatar != 'stranger' && app.globalData.openid != undefined) {
    wx.showToast({
      title: '加载完成~',
    })
    wx.hideLoading()
    if (!app.globalData.logged) {
      uploadavatar()
    }
    pulldownmessage()
    that.onShow()
  } else {
    setTimeout(function () {
      loading(that)
    }, 100)
  }
}

function uploadavatar() {
  network.post('/user/uploadavatar', {
    'openid': app.globalData.openid,
    'username': app.globalData.nickname,
    'avatar': app.globalData.avatar
  })
}

function uploadfile(url, filepath, name, formdata, success, fail) {
  wx.uploadFile({
    url: config.host + url,
    method: 'post',
    header: {
      "content-type": "application/form-data"
    },
    filePath: filepath,
    name: name,
    formData: formdata,
    success: function (e) {
      success(e)
    },
    fail: function (e) {
      fail(e)
    }
  })
}

var tabtxt = [{
  'text': '年级',
  'originalText': '不限',
  'value': ['不限', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三', '高一', '高二', '高三'],
  'active': false,
  'child': [{
    'id': 0,
    'text': '不限'
  },
  {
    'id': 1,
    'text': '一年级'
  },
  {
    'id': 2,
    'text': '二年级'
  },
  {
    'id': 3,
    'text': '三年级'
  },
  {
    'id': 4,
    'text': '四年级'
  },
  {
    'id': 5,
    'text': '五年级'
  },
  {
    'id': 6,
    'text': '六年级'
  },
  {
    'id': 7,
    'text': '初一'
  },
  {
    'id': 8,
    'text': '初二'
  },
  {
    'id': 9,
    'text': '初三'
  },
  {
    'id': 10,
    'text': '高一'
  },
  {
    'id': 11,
    'text': '高二'
  },
  {
    'id': 12,
    'text': '高三'
  },

  ],
  'type': 0
},
{
  'text': '难易',
  'originalText': '不限',
  'active': false,
  'value': ['不限', '简单', '困难'],
  'child': [{
    'id': 0,
    'text': '不限'
  },
  {
    'id': 1,
    'text': '简单'
  },
  {
    'id': 2,
    'text': '困难'
  }
  ],
  'type': 0
},
{
  'text': '奖励',
  'originalText': '不限',
  'value': ['不限', '1个奥币', '2个奥币', '3个奥币'],
  'active': false,
  'child': [{
    'id': 0,
    'text': '不限'
  },
  {
    'id': 1,
    'text': '1个奥币'
  },
  {
    'id': 2,
    'text': '2个奥币'
  },
  {
    'id': 3,
    'text': '3个奥币'
  }
  ],
  'type': 0
}
]
module.exports = {
  get10prob: get10prob,
  getlastedprob: getlastedprob,
  checklasted: checklasted,
  get10solvedprob: get10solvedprob,
  getlastedsolvedprob: getlastedsolvedprob,
  pulldownmessage: pulldownmessage,
  get_or_create_avatar: get_or_create_avatar,
  checkuserinfo: checkuserinfo,
  loading: loading,
  getsessions: getsessions,
  storedid: storedid,
  uploadfile: uploadfile,
  categorys: categorys,
  gradearray: gradearray,
  tabtxt: tabtxt
}