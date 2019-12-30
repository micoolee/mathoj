var network = require("network.js")
//var console = require("console.js")
var config = require('../config.js')
var storedid = new Map();
const app = getApp()
var categorys = {
  // 二年级开始
  0: ["简单逻辑推理", "组合问题", "简单的图形计数", "巧算巧填竖式", "简单应用题", "智力趣题", "重叠问题", "简单的等量代换", "较复杂的找规律", "简单周期问题", "简单的方阵问题", "巧妙的估计", "多位数组成", "数独", "巧填加减符号", "数的读写", "填图形", "简单的间隔问题", "一笔画", "其它"],
  1: ["周期问题", "平均数问题", "等量代换", "容斥原理", "和差和倍差", "周长", "加减速算", "面积", "逆推问题", "年龄问题", "排列", "盈亏问题", "巧算", "等差数列", "还原问题", "其它"],
  2: ["统筹优化问题", "植树问题", "巧算", "数阵图", "加法原理与乘法原理", "定义新运算", "数字谜", "添运算符号和括号", "图形问题", "等差数列", "行船问题", "页码问题", "年龄问题", "枚举法", "对策问题", "稍复杂的倍数问题", "鸡兔同笼问题", "还原问题", "其它"],
  3: ["列方程解应用题", "数的整除问题", "行程问题", "长方体与正方体", "组合图形的面积", "找次品问题", "余数问题", "巧算", "格点与面积", "牛吃草问题", "较复杂的周期问题", "钟面问题", "其它"],
  4: ["百分数应用题", "比例应用题", "圆的面积和周长", "圆柱和圆锥问题", "鸡兔同笼问题", "抽屉原理", "分数巧算", "最不利原则", "工程问题", "数学方法的渗透", "逻辑问题", "变与不变", "进制问题", "有序思考", "整体思考", "添辅助线", "画图", "列表", "极端思想", "不定方程和方程组", "其它"],
  5: ["有理数", "整式的加减", "一元一次方程", "图形认识初步", "相交线与平行线", "平面直角坐标系", "三角形", "二元一次方程组", "不等式与不等式组", "数据统计"],
  6: ["全等三角形", "轴对称", "实数", "一次函数", "整式乘除", "因式分解", "分式", "反比例函数", "勾股定理", "四边形", "数据分析"],
  7: ["二次根式", "一元二次方程", "旋转", "圆", "概率初步", "二次函数", "相似", "锐角三角形", "投影与视图"],
  8: ["集合与函数", "基本初等函数", "空间几何", "点线面位置关系", "直线与方程", "圆与方程", "算法初步", "统计", "概率"],
  9: ["集合", "基本初等函数", "平面解析几何", "算法初步", "统计", "概率", "平面向量", "三角恒等变换", "解三角形", "数列", "不等式", "圆锥曲线与方程", "空间向量与立体几何", "导数", "推理与证明", "复数", "坐标系与参数方程", "其它"],
  10: ["集合", "基本初等函数", "平面解析几何", "算法初步", "统计", "概率", "平面向量", "三角恒等变换", "解三角形", "数列", "不等式", "圆锥曲线与方程", "空间向量与立体几何", "导数", "推理与证明", "复数", "坐标系与参数方程", "其它"],
}

var backgroundcolors = { 0: 'orange', 1: 'lightblue', 2: 'red', 3: 'green', 4: 'yellow' }
var gradearray = ['二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三', '高一', '高二', '高三']
var tijis = ['题库', '精选']
var filtergradearray = ['不限', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三', '高一', '高二', '高三']
var rolemaps = { 'principal': '校长', 'pre-principal': '校长', 'teacher': '老师', 'student': '学生' }
var applymaps = { 'join': '申请加入', 'exit': '申请退出', 'pass': 'mathojtongguo', 'reject': 'mathojjujue', 'toteacher': '申请成为老师' }
var lastedjigouproblemid = ''//机构最新的problemid，用作检查是否有新提问
var lasteddiscoveryproblemid = ''
function get_or_create_avatar(userid, that = 'null') {
  var res = wx.getStorageInfoSync();
  if (res.keys.indexOf(userid) > -1) {
    var avatarimgcache = wx.getStorageSync(userid)
    if (that != 'null') {
      that.setData({
        userInfo: {
          'avatar': avatarimgcache,
          'nickname': app.globalData.userInfo.nickName || '路人甲'
        }
      })
    }
    return avatarimgcache
  } else {
    storedid.set(userid, 'downloading')
    wx.downloadFile({
      url: config.host + '/swagger/avatar-' + userid + '.jpg',
      success: function (res) {
        //console.log('aaa')
        wx.setStorageSync(userid, res.tempFilePath)
        storedid.set(userid, 'downloaded')
        var avatarimgcache = wx.getStorageSync(userid)
        if (that != 'null') {
          that.setData({
            userInfo: {
              'avatar': avatarimgcache,
              'nickname': app.globalData.userInfo.nickName || '路人甲'
            }
          })
        }
        return avatarimgcache
      }
    })
  }
}

function getlastedprob(that, filter, final = null) {
  //console.log(that.formerid, 'formerid: ')
  network.post('/problem/getten', {
    'openid': app.globalData.openid,
    'formerid': that.formerid,
    'filter': filter || [],
    'jinxuan': '0'
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
    if (!problemlist) {
      that.setData({
        problemlist: []
      })
      return
    }
    that.setData({
      jigouhavenew: false,
      problemlist: problemlist,
    })
    lastedjigouproblemid = problemlist[0].problemid

    that.formerid = problemlist[problemlist['length'] - 1].problemid
    //console.log(that.formerid, 'formerid: ')
  }, function (e) {
    //console.log('fail')
  },
    function (e) {
      if (final != null) {
        final()
      }

    }
  )
}


function getnearbytenproblem(that, filter, formerid = 0, mode = 'pulldown', final = null) {
  //获取附近的问题
  network.post('/problem/getnearbytenproblem', {
    'openid': app.globalData.openid,
    'formerid': formerid,
    'scope': 'all',
    'grade': filter || ''
  }, function (res) {
    var filterproblist = res.problems
    if (filterproblist == undefined) {
      that.setData({
        bottom: true,
      })
    } else {
      var newlist = filterproblist
      if (filterproblist && mode == 'reachbottom' && that.data.problemlist1.length > 0) {
        newlist = that.data.problemlist1.concat(filterproblist)
      }
      lasteddiscoveryproblemid = newlist[0].problemid
      that.setData({
        discoveryhavenew: false,
        problemlist1: newlist,
      })
      that.formerid1 = filterproblist[filterproblist.length - 1]['problemid']
    }
  }, function () {

  }, function () {
    if (final != null) {
      final()
    }
  })
}

//检查是否有更新的问题
function checklasted(that, jigou = true) {
  if (jigou) {
    // if (app.globalData.onlysee) {
    //   grade = app.globalData.grade
    // }
    network.post('/problem/checklatest', {
      'userid': app.globalData.selfuserid,
      'formerid': lastedjigouproblemid != '' ? lastedjigouproblemid : 0,
      'grade': app.globalData.grade,
      'jigou': 'true'
    }, function (res) {
      if (res.count) {
        that.setData({
          jigouhavenew: true
        })
      }
    })
  } else {
    // if (app.globalData.onlysee) {
    //   grade = app.globalData.grade
    // }
    network.post('/problem/checklatest', {
      'userid': app.globalData.selfuserid,
      'formerid': lasteddiscoveryproblemid != '' ? lasteddiscoveryproblemid : 0,
      'grade': app.globalData.grade,
      'jigou': 'false'
    }, function (res) {
      if (res.count) {
        that.setData({
          discoveryhavenew: true
        })
      }
    })
  }
}

function getlastedjinxuanprob(that, filter, final = null) {
  wx.showLoading({
    title: '加载中',
  })
  network.post('/problem/getten', {
    'openid': app.globalData.openid,
    'formerid': 0,
    'filter': filter || [],
    'jinxuan': '1'
  }, function (res) {
    if (res.problem) {
      var jinxuanproblemlist = res.problem
      //加载缓存中的照片
      for (var i in jinxuanproblemlist) {
        if (storedid.get(jinxuanproblemlist[i].openid) == 'downloaded') {
          jinxuanproblemlist[i].avatar = get_or_create_avatar(jinxuanproblemlist[i].openid)
        } else if (storedid.get(jinxuanproblemlist[i].openid) == undefined) {
          get_or_create_avatar(jinxuanproblemlist[i].openid)
        }
      }
      that.setData({
        jinxuanproblemlist: jinxuanproblemlist,
      })
      that.jinxuanformerid = jinxuanproblemlist[jinxuanproblemlist.length - 1].problemid
    } else {
      wx.showToast({
        title: '暂无精选',
      })
      that.setData({
        jinxuanproblemlist: [],
      })
      that.jinxuanformerid = 0
    }

  }, function () {

  }, function () {
    if (final != null) {
      final()
    }
  })
}

function pulldownmessage(that = null) {
  //console.log('pulldownmessage')
  network.post('/message/getten', {
    'openid': app.globalData.openid,
    'statuscode': '1'
  }, function (res) {
    if (res.message) {
      app.globalData.messagelist = res.message
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

function get10prob(that, searchparam = [], formerid = 0) {
  network.post('/problem/getten', {
    'openid': app.globalData.openid,
    'formerid': formerid,
    'filter': searchparam,
    'jinxuan': '0'
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

      })
      that.formerid = problemlist[problemlist['length'] - 1].problemid
    }
  })
}

function get10jinxuanprob(that, searchparam = []) {
  network.post('/problem/getten', {
    'openid': app.globalData.openid,
    'formerid': that.jinxuanformerid,
    'filter': searchparam,
    'jinxuan': '1'
  }, function (res) {

    if (!res.json_data || res.json_data.length == 0) {
      wx.showToast({
        title: '到底啦~',
      })
    } else {
      var problemlist = JSON.parse(res.json_data)
      problemlist = that.data.problemlist.concat(problemlist)
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

      })
      that.jinxuanformerid = problemlist[problemlist['length'] - 1].problemid
    }
  })
}

function checkuserinfo(that) {
  wx.getSetting({
    success: function (res) {
      if (res.authSetting['scope.userInfo']) {
        wx.getUserInfo({
          success: res => {
            console.log('in checkuserinfo: ', res.userInfo)
            app.globalData.userInfo = res.userInfo

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
    if (!app.globalData.logged || app.globalData.logged == undefined) {
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
    'username': app.globalData.userInfo.nickName || '路人甲',
    'avatar': app.globalData.userInfo.avatarUrl
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


module.exports = {
  get10prob: get10prob,
  getlastedprob: getlastedprob,
  getnearbytenproblem: getnearbytenproblem,
  checklasted: checklasted,
  get10jinxuanprob: get10jinxuanprob,
  getlastedjinxuanprob: getlastedjinxuanprob,
  pulldownmessage: pulldownmessage,
  get_or_create_avatar: get_or_create_avatar,
  checkuserinfo: checkuserinfo,
  loading: loading,
  storedid: storedid,
  uploadfile: uploadfile,
  categorys: categorys,
  gradearray: gradearray,
  tijis: tijis,
  filtergradearray: filtergradearray,
  rolemaps: rolemaps,
  applymaps: applymaps,
  backgroundcolors: backgroundcolors
}