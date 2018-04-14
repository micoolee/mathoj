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


function getlastedprob(that){
  wx.request({
    url: app.globalData.baseurl + '/',
    success: function (res) {
      var problemlist = JSON.parse(res.data.json_data)
      var topstories = JSON.parse(res.data.topstory)
      that.setData({
        lastedid: problemlist[0].problemid,
        problemlist: problemlist,
        topStories: topstories,
        formerid: problemlist[problemlist['length']-1].problemid
      })
    }
  })
}


function checklasted(that){
  if (that.data.lastedid !=null){
    wx.request({
      url: app.globalData.baseurl + '/checklasted/',
      data: { 'lastedid': that.data.lastedid },
      success: function (res) {
        if (res.data.code == 200){
          console.log(res.data.msg)
          that.setData({
            havenewbtn:true
          })
        }
        
      }
    })
  }

}

function getlastedsolvedprob(that){
  wx.request({
    url: app.globalData.baseurl + '/solved/',
    success: function (res) {
      console.log(res)
      that.setData({
        problemlist: res.data,
        formerid: res.data[res.data['length'] - 1].problemid
      })
    }
  })

}


function solvedpulldown(that){
  wx.request({
    url: app.globalData.baseurl + '/solved/',

    success: function (res) {
      var problemlist = res.data
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

function pulldown(that){
  wx.request({
    url: app.globalData.baseurl + '/',

    success: function (res) {
      var problemlist = JSON.parse(res.data.json_data)
      that.setData({
        lastedid:problemlist[0].problemid,
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
        havenewbtn:false
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
    data: { 'userid': app.globalData.openid, 'statuscode': '2','peeruserid':that.data.receiverid},
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






function get10prob(that){
  console.log(that)
  var that = that
  wx.request({
    url: app.globalData.baseurl + '/get10prob/',
    data:{'formerid':that.data.formerid},
    success: function (res) {
      var problemlist = JSON.parse(res.data.json_data)
      if (problemlist.length == 0){
        wx.showToast({
          title: 'no more',
        })
      }else{
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


function checksolvedlasted(that){
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

  getlastedprob: getlastedprob,
  pulldown: pulldown,
  checklasted: checklasted,
  getlastedsolvedprob: getlastedsolvedprob,
  solvedpulldown: solvedpulldown,
  get10solvedprob: get10solvedprob,
  checksolvedlasted: checksolvedlasted,

  pulldownmessage: pulldownmessage,
  pulldownchatroom: pulldownchatroom
}
