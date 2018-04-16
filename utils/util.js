const app = getApp()



const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}




function getDateTimeStamp(dateStr) {
  return Date.parse(dateStr.replace(/-/gi, "/"));
}

function getDateDiff(dateStr) {
  var publishTime = getDateTimeStamp(dateStr) / 1000,
    d_seconds,
    d_minutes,
    d_hours,
    d_days,
    timeNow = parseInt(new Date().getTime() / 1000),
    d,

    date = new Date(publishTime * 1000),
    Y = date.getFullYear(),
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
  //小于10的在前面补0
  if (M < 10) {
    M = '0' + M;
  }
  if (D < 10) {
    D = '0' + D;
  }
  if (H < 10) {
    H = '0' + H;
  }
  if (m < 10) {
    m = '0' + m;
  }
  if (s < 10) {
    s = '0' + s;
  }

  d = timeNow - publishTime;
  d_days = parseInt(d / 86400);
  d_hours = parseInt(d / 3600);
  d_minutes = parseInt(d / 60);
  d_seconds = parseInt(d);

  if (d_days > 0 && d_days < 3) {
    return d_days + '天前';
  } else if (d_days <= 0 && d_hours > 0) {
    return d_hours + '小时前';
  } else if (d_hours <= 0 && d_minutes > 0) {
    return d_minutes + '分钟前';
  } else if (d_seconds < 60) {
    if (d_seconds <= 0) {
      return '刚刚发表';
    } else {
      return d_seconds + '秒前';
    }
  } else if (d_days >= 3 && d_days < 30) {
    return M + '-' + D + '&nbsp;' + H + ':' + m;
  } else if (d_days >= 30) {
    return Y + '-' + M + '-' + D + '&nbsp;' + H + ':' + m;
  }
}




var getDateDiff = getDateDiff


function getlastedprob(that) {

  // var getDateDiff = this.getDateDiff

  wx.request({
    url: app.globalData.baseurl + '/',
    success: function (res) {
      var problemlist = JSON.parse(res.data.json_data)
      // regrex to replace asktime
      var tmp = JSON.stringify(problemlist).replace(/asktime":"([\d- :]*)/g, function ($0, $1) { var tmpstr = getDateDiff($1); return ('asktime":"' + tmpstr) })
      problemlist = JSON.parse(tmp)

      var topstories = JSON.parse(res.data.topstory)
      that.setData({
        lastedid: problemlist[0].problemid,
        problemlist: problemlist,
        topStories: topstories,
        formerid: problemlist[problemlist['length'] - 1].problemid
      })
    }
  })
}


function checklasted(that) {
  if (that.data.lastedid != null) {
    wx.request({
      url: app.globalData.baseurl + '/checklasted/',
      data: { 'lastedid': that.data.lastedid },
      success: function (res) {
        if (res.data.code == 200) {
          console.log(res.data.msg)
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
    url: app.globalData.baseurl + '/solved/',
    success: function (res) {
      console.log(res)
      if (res.data.length > 0) {
        that.setData({
          problemlist: res.data,
          formerid: res.data[res.data['length'] - 1].problemid
        })
      } else {
        wx.showToast({
          title: 'no solved',
        })
      }

    }
  })

}


function solvedpulldown(that) {
  wx.request({
    url: app.globalData.baseurl + '/solved/',

    success: function (res) {

      var problemlist = res.data
      if (problemlist.length > 0) {
        that.setData({
          lastedid: problemlist[0].problemid,
          problemlist: problemlist,
          formerid: problemlist[problemlist['length'] - 1].problemid
        })
      }
      else {
        wx.showToast({
          title: 'no solved',
        })
      }

    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
      that.setData({
        havenewbtn: false
      })
      wx.hideNavigationBarLoading() //完成停止加载

    }
  })

}

function pulldown(that) {

  wx.request({
    url: app.globalData.baseurl + '/',

    success: function (res) {
      var problemlist = JSON.parse(res.data.json_data)

      var tmp = JSON.stringify(problemlist).replace(/asktime":"([\d- :]*)/g, function ($0, $1) { var tmpstr = getDateDiff($1); return ('asktime":"' + tmpstr) })
      problemlist = JSON.parse(tmp)

      that.setData({
        lastedid: problemlist[0].problemid,
        problemlist: problemlist,
        formerid: problemlist[problemlist['length'] - 1].problemid
      })
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
      that.setData({
        havenewbtn: false
      })
      wx.hideNavigationBarLoading() //完成停止加载

    }
  })
}


function pulldownmessage(that) {
  wx.request({
    url: app.globalData.baseurl + '/getmessages/',
    data: { 'userid': app.globalData.openid, 'statuscode': '1' },
    success: function (res) {
      var messagelist = res.data.json_data
      app.globalData.messagelist = messagelist
      //       that.setData({
      // messagelist:messagelist
      //       })
    },
    complete: function () {
      wx.hideNavigationBarLoading() //完成停止加载
    }
  })
}



function pulldownchatroom(that) {
  wx.request({
    url: app.globalData.baseurl + '/getmessages/',
    data: { 'userid': app.globalData.openid, 'statuscode': '2', 'peeruserid': that.data.receiverid },
    success: function (res) {
      var messagelist = res.data.json_data
      that.setData({
        messagelist: messagelist
      })
    },
    complete: function () {
      wx.hideNavigationBarLoading() //完成停止加载
    }
  })
}






function get10prob(that) {
  console.log(that)
  var that = that
  // var getDateDiff = this.getDateDiff
  wx.request({
    url: app.globalData.baseurl + '/get10prob/',
    data: { 'formerid': that.data.formerid },
    success: function (res) {
      var problemlist = JSON.parse(res.data.json_data)

      var tmp = JSON.stringify(problemlist).replace(/asktime":"([\d- :]*)/g, function ($0, $1) { var tmpstr = getDateDiff($1); return ('asktime":"' + tmpstr) })
      problemlist = JSON.parse(tmp)

      if (problemlist.length == 0) {
        wx.showToast({
          title: 'no more',
        })
      } else {
        problemlist = that.data.problemlist.concat(problemlist)
        that.setData({
          problemlist: problemlist,
          formerid: problemlist[problemlist['length'] - 1].problemid
        })
      }

    }
  })


}



function get10solvedprob(that) {
  console.log(that)
  var that = that
  wx.request({
    url: app.globalData.baseurl + '/get10solvedprob/',
    data: { 'formerid': that.data.formerid },
    success: function (res) {
      var problemlist = JSON.parse(res.data.json_data)
      
      var tmp = JSON.stringify(problemlist).replace(/asktime":"([\d- :]*)/g, function ($0, $1) { var tmpstr = getDateDiff($1); return ('asktime":"' + tmpstr) })
      problemlist = JSON.parse(tmp)

      if (problemlist.length == 0) {
        wx.showToast({
          title: 'no more',
        })
      } else {
        problemlist = that.data.problemlist.concat(problemlist)
        that.setData({
          problemlist: problemlist,
          formerid: problemlist[problemlist['length'] - 1].problemid
        })
      }

    }
  })


}


function checksolvedlasted(that) {
  if (that.data.lastedid != null) {
    wx.request({
      url: app.globalData.baseurl + '/checksolvedlasted/',
      data: { 'lastedid': that.data.lastedid },
      success: function (res) {
        if (res.data.code == 200) {
          console.log(res.data.msg)
          that.setData({
            havenewbtn: true
          })
        }

      }
    })
  }

}




module.exports = {

  getRequestUrl: "http://localhost:59637",//获得接口地址
  get10prob: get10prob,
  getlastedprob: getlastedprob,
  pulldown: pulldown,
  checklasted: checklasted,
  getlastedsolvedprob: getlastedsolvedprob,
  solvedpulldown: solvedpulldown,
  get10solvedprob: get10solvedprob,
  checksolvedlasted: checksolvedlasted,

  pulldownmessage: pulldownmessage,
  pulldownchatroom: pulldownchatroom,
  getDateDiff: getDateDiff
}
