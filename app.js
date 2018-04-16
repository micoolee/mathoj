//app.js

App({
  globalData: {
    userInfo: null,
    baseurl: 'http://www.liyuanye.club',
    wssurl: 'ws://www.liyuanye.club/testwss/',
    openid: 'null',
    audiopath: null,
    audiopathbak: null,
    returnaudiopath: '',
    duration: 100,
    avatar: null,
    nickname: null,
    screenwidth: 0,
    screenheight: 0,
    messagelist: [],
    conversationdetaillist: [],
    receiverid: null,
    closetime: 0,
    informthat: null,
    informlist: []
  },

  getlastedinform: function () {
    var that = this
    var util = require('utils/util.js')
    var getDateDiff = util.getDateDiff
    
    wx.request({
      url: this.globalData.baseurl + '/getlastedinform/',
      data: { 'userid': this.globalData.openid },
      success: function (res) {
        var informlist = JSON.parse(res.data.json_data)

        var tmp = JSON.stringify(informlist).replace(/submittime":"([\d- :]*)/g, function ($0, $1) { var tmpstr = getDateDiff($1); return ('submittime":"' + tmpstr) })
        informlist = JSON.parse(tmp)
        that.globalData.informlist = informlist



      }
    })
  },

  connect: function () {
    var that = this
    wx.connectSocket({
      url: that.globalData.wssurl
    })

    wx.onSocketOpen(function (res) {
      console.log('websocket opened')
      wx.sendSocketMessage({
        data: JSON.stringify({ 'userid': that.globalData.openid, 'statuscode': '1' }),
      })
      wx.onSocketMessage(function (res) {
        console.log('chonglianhou收到服务器内容：' + res.data)
        var tmp = JSON.parse(res.data)
        var singlemessage = JSON.parse(tmp.json_data)



        var statuscode = tmp.statuscode
        if (statuscode == '200') {
          console.log('heart back')
        } else {
          if (statuscode == 'sixin') {
            var all = that.globalData.messagelist
            var one = singlemessage
            for (var i in all) { if (all[i].sessionid == one[0].sessionid) { all[i].value.push(one[0].value[0]) } }
            that.globalData.messagelist = all
            that.globalData.informthat.print()

          } else if (statuscode == 'inform') {
            var all = that.globalData.informlist
            var one = singlemessage
            all.push(one[0])
            that.globalData.informlist = all
            console.log(singlemessage)
          }

          wx.vibrateLong({
            success: function () {
              console.log('vibrate')
            }
          })
          wx.showTabBarRedDot({
            index: 2,
          })
        }


      })

    })



    wx.onSocketClose(function (res) {
      that.globalData.closetime++
      console.log('WebSocket 已关闭！')
      setTimeout(that.connect, 0)

    })
  },


  onLaunch: function () {
    var that = this

    wx.login({
      success: res => {
        wx.request({
          data: { js_code: res.code },
          url: this.globalData.baseurl + '/getopenid/',
          method: 'GET',
          success: function (res) {
            that.globalData.openid = res.data
          },
        })
      }
    })

    that.connect()
    var a = wx.getSystemInfoSync()
    that.globalData.screenwidth = a.windowWidth
    that.globalData.screenheight = a.windowHeight



  },

})





