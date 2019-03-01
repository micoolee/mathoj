const app = getApp()

var storedid = new Map();

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
      url: app.globalData.baseurl + '/swagger/avatar-' + userid + '.jpg',
      success: function(res) {
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

function getlastedprob(that) {
  var utilthat = this
  wx.request({
    url: app.globalData.baseurl + '/problem/getten',
    data: {
      'formerid': that.data.formerid,
      'filter': [],
      'solved': '0'
    },
    method: "POST",
    success: function(res) {
      wx.hideNavigationBarLoading()
      var problemlist = res.data.problem
      //加载缓存中的照片
      for (var i in problemlist) {
        if (storedid.get(problemlist[i].openid) == 'downloaded') {
          problemlist[i].avatar = get_or_create_avatar(problemlist[i].openid)
        } else if (storedid.get(problemlist[i].openid) == undefined) {
          get_or_create_avatar(problemlist[i].openid)
        }
      }
      that.setData({
        topStories: res.data.topstory,
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
    },complete:function(e){
      wx.hideLoading()
    }
  })
}


function checklasted(that) {
  if (that.data.lastedid != null) {
    wx.request({
      url: app.globalData.baseurl + '/problem/checklatest',
      method: 'POST',
      data: {
        'formerid': that.data.lastedid
      },
      success: function(res) {
        if (res.data.count) {
          that.setData({
            havenewbtn: true
          })
        }
      }
    })
  }
}

function getlastedsolvedprob(that) {
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: app.globalData.baseurl + '/problem/getten',
    data: {
      'formerid': 0,
      'filter': [],
      'solved': '1'
    },
    method: "POST",
    success: function(res) {
      wx.hideNavigationBarLoading()
      
      if (res.data.problem) {
        var solvedproblemlist = res.data.problem
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
      }

    },
    complete: function() {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.hideLoading()
    }
  })
}

function pulldownmessage(that = null) {
  wx.request({
    url: app.globalData.baseurl + '/message/getten',
    data: {
      'openid': app.globalData.openid,
      'statuscode': '1'
    },
    method: "post",
    success: function(res) {
      var messagelist = res.data.message
      if (messagelist) {
        app.globalData.messagelist = messagelist
        if (that != null) {
          that.setData({
            showdetail: true
          })
        }
      }
    },
    complete: function() {
      wx.hideNavigationBarLoading() //完成停止加载
    }
  })
}


function getsessions(that = null) {
  wx.request({
    url: app.globalData.baseurl + '/message/getsessions',
    data: {
      'openid': app.globalData.openid
    },
    method: "post",
    success: function(res) {
      var sessionlist = res.data.session
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
    },
    complete: function() {
      wx.hideNavigationBarLoading() //完成停止加载
    }
  })
}

function get10prob(that, searchparam = []) {
  wx.request({
    url: app.globalData.baseurl + '/problem/getten',
    data: {
      'formerid': that.data.formerid,
      'filter': searchparam,
      'solved': '0'
    },
    method: 'POST',
    success: function(res) {
      var problemlist = res.data.problem
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
    }
  })
}

function get10solvedprob(that, searchparam = []) {
  var that = that
  wx.request({
    url: app.globalData.baseurl + '/problem/getten',
    data: {
      'formerid': that.data.solvedformerid,
      'filter': searchparam,
      'solved': '1'
    },
    method:'POST',
    success: function(res) {
      
      if (!res.data.json_data || res.data.json_data.length == 0) {
        wx.showToast({
          title: '到底啦~',
        })
      } else {
        var problemlist = JSON.parse(res.data.json_data)
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
    }
  })
}

function checkuserinfo(that) {
  wx.getSetting({
    success: function(res) {
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
          complete: function(res) {}
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
    uploadavatar()
    pulldownmessage()
    that.onShow()
  } else {
    setTimeout(function() {
      loading(that)
    }, 100)
  }
}

function uploadavatar() {
  wx.request({
    url: app.globalData.baseurl + '/user/uploadavatar',
    method: 'post',
    data: {
      'openid': app.globalData.openid,
      'username': app.globalData.nickname,
      'avatar': app.globalData.avatar
    },
  })
}

function uploadfile(url,filepath,name,formdata,success,fail){
  wx.uploadFile({
    url: app.globalData.baseurl + url,
    method: 'post',
    header: {
      "content-type": "application/form-data"
    },
    filePath: filepath,
    name: name,
    formData: formdata,
    success:function(e){
      success(e)
    },fail:function(e){
      fail(e)
    }

})
}



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
  uploadfile:uploadfile
}