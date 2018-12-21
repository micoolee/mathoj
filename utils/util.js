const app = getApp()
function get_or_create_avatar(userid,that='null'){
  var res = wx.getStorageInfoSync();
  if(res.keys.indexOf(userid)>-1){
   var avatarimgcache = wx.getStorageSync(userid)
   if (that != 'null') {
     that.setData({
       userInfo: { 'avatar': avatarimgcache, 'nickname': app.globalData.nickname }
     })
   }
   return avatarimgcache
  }else{
      wx.downloadFile({
        url: app.globalData.baseurl + '/swagger/avatar-' + userid + '.jpg',
        success: function (res) {
          wx.setStorageSync(userid, res.tempFilePath)
          var avatarimgcache = wx.getStorageSync(userid)
          if (that!='null'){
            that.setData({
              userInfo: { 'avatar': avatarimgcache, 'nickname': app.globalData.nickname }
            })
          }
          return avatarimgcache
        }
      })
  }
}

function getlastedprob(that) {
  wx.request({
    url: app.globalData.baseurl + '/problem/getten',
    data: { 'formerid': that.data.formerid, 'filter': [], 'solved': '0' },
    method:"POST",
    success: function (res) {
      wx.hideNavigationBarLoading()
      var problemlist = res.data.problem
      app.globalData.globalproblemlist = problemlist
      that.setData({
        topStories: res.data.topstory,
      })
      if (!app.globalData.globalproblemlist){
        that.setData({
          problemlist:[]
        })
        return
      }
      var arr = new Array(app.globalData.globalproblemlist.length + 1);
      arr = arr.join('0,').split(',');
      arr.length = arr.length - 1;
      that.setData({
        havenewbtn:false,
        lastedid: problemlist[0].problemid,
        problemlist: problemlist,
        formerid: problemlist[problemlist['length'] - 1].problemid
      })
    }
  })
}


function checklasted(that) {
  if (that.data.lastedid != null) {
    wx.request({
      url: app.globalData.baseurl + '/problem/checklatest',
      method:'POST',
      data: { 'formerid': that.data.lastedid },
      success: function (res) {
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
  wx.request({
    url: app.globalData.baseurl + '/problem/getten',
    data: { 'formerid': 0, 'filter': [], 'solved': '1' },
    method: "POST",
    success: function (res) {
      wx.hideNavigationBarLoading()
      if (res.data.problem) {
        var solvedproblemlist = res.data.problem
        that.setData({
          solvedproblemlist:solvedproblemlist,
          solvedformerid:solvedproblemlist[solvedproblemlist.length-1].problemid
        })
      } else {
        wx.showToast({
          title: '暂无已解决',
        })
      }

    },
    complete:function(){
      wx.hideNavigationBarLoading() //完成停止加载
    }
  })
}

function pulldownmessage(that=null) {
  wx.request({
    url: app.globalData.baseurl + '/message/getten',
    data: { 'openid': app.globalData.openid, 'statuscode': '1' },
    method:"post",
    success: function (res) {
      var messagelist = res.data.message
      if (messagelist){
        app.globalData.messagelist = messagelist
        if (that != null) {
          that.setData({
            showdetail: true
          })
        }
      }
    },
    complete: function () {
      wx.hideNavigationBarLoading() //完成停止加载
    }
  })
}


function getsessions(that = null) {
  wx.request({
    url: app.globalData.baseurl + '/message/getsessions',
    data: { 'openid': app.globalData.openid },
    method: "post",
    success: function (res) {
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
    complete: function () {
      wx.hideNavigationBarLoading() //完成停止加载
    }
  })
}

function get10prob(that,searchparam=[]) {
  var that = that
  wx.request({
    url: app.globalData.baseurl + '/problem/getten',
    data: { 'formerid': that.data.formerid, 'filter': searchparam, 'solved':'0'},
    method:'POST',
    success: function (res) {
      var problemlist = res.data.problem
      if (problemlist == undefined) {
        that.setData({
          bottom:true
        })
        wx.showToast({
          title: '到底啦~',
        })
      } else {
        app.globalData.globalproblemlist = app.globalData.globalproblemlist.concat(problemlist)



        problemlist = that.data.problemlist.concat(problemlist)
        that.setData({
          problemlist: problemlist,
          formerid: problemlist[problemlist['length'] - 1].problemid
        })
      }
    }
  })
}

function get10solvedprob(that,searchparam=[]) {
  var that = that
  wx.request({
    url: app.globalData.baseurl + '/problem/getten',
    data: { 'formerid': that.data.solvedformerid, 'filter': searchparam, 'solved': '1'},
    success: function (res) {
      var problemlist = JSON.parse(res.data.json_data)
      if (problemlist.length == 0) {
        wx.showToast({
          title: '到底啦~',
        })
      } else {
        problemlist = that.data.problemlist.concat(problemlist)
        that.setData({
          problemlist: problemlist,
          solvedformerid: problemlist[problemlist['length'] - 1].problemid
        })
      }
    }
  })
}

function checkuserinfo(that){
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
          }, complete: function (res) {
          }
        })
      }
      else {
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
    uploadavatar()
    pulldownmessage()
    that.onShow()
  } else {
    setTimeout(function () {
      wx.showLoading({
        title: '加载中',
      })
      loading(that)
    }, 100)
  }
}

function uploadavatar() {
  wx.request({
    url: app.globalData.baseurl + '/user/uploadavatar',
    method: 'post',
    data: { 'openid': app.globalData.openid, 'username': app.globalData.nickname, 'avatar': app.globalData.avatar },
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
}
