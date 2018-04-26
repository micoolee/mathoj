//app.js test

App({
  globalData: {
    userInfo: null,
    baseurl: 'http://www.liyuanye.club',
    wssurl: 'ws://www.liyuanye.club/testwss/',
    openid: null,
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
    informlist: [],
    messagethat: null,
    reddot: false,
    sixindoor: false,
    nothissession: true,
    chatroomthat: null,
    searchlist: [],
    globalproblemlist:[],
    placeholder:''
  },

  getlastedinform: function (informthat = null) {
    var that = this
    var util = require('utils/util.js')
    var getDateDiff = util.getDateDiff
    var get_or_create_avatar = util.get_or_create_avatar

    wx.request({
      url: this.globalData.baseurl + '/getlastedinform/',
      data: { 'userid': this.globalData.openid },
      success: function (res) {
        var informlist = JSON.parse(res.data.json_data)

        var tmp = JSON.stringify(informlist).replace(/avatar":"(.*?avatar\/)([\w]*)(.jpg)(.*?submittime":")([\d- :]*)/g, function ($0, $1, $2, $3, $4, $5) { var tmpstr = getDateDiff($5); var cachedoor = get_or_create_avatar($4); var receivercachedoor = get_or_create_avatar($2);  if (receivercachedoor) { var receiveravatar = receivercachedoor } else { var receiveravatar = $1 + $2 + $3 }; return ('avatar":"' + receiveravatar+ $4 + tmpstr) })
      
        informlist = JSON.parse(tmp)
        console.log(informlist)
        that.globalData.informlist = informlist
        if(informthat){
          informthat.setData({
            informlist:informlist
          })
        }
      }
    })
  },

  connect: function () {

    var that = this
    wx.connectSocket({
      url: that.globalData.wssurl,
      fail: function () {
        console.log('connect failed')
      }
    })

    wx.onSocketOpen(function (res) {
      console.log('websocket opened')
      wx.sendSocketMessage({
        data: JSON.stringify({ 'userid': that.globalData.openid, 'statuscode': '1' }),
      })
      wx.onSocketMessage(function (res) {
        console.log('chonglianhou收到服务器内容：' + res.data)
        var tmp = JSON.parse(res.data)

        var util = require('utils/util.js')
        var getDateDiff = util.getDateDiff
        var get_or_create_avatar = util.get_or_create_avatar

        var statuscode = tmp.statuscode
        if (statuscode == '200') {
          console.log('heart back')
        } else {
          if (statuscode == 'sixin') {
            var all = that.globalData.messagelist
            var singlemessage = tmp.json_data
            var one = singlemessage



            var tmp = JSON.stringify(one).replace(/receiveravatar":"(.*?avatar\/)([\w]*)(.jpg)(.*?senderavatar":")(.*?avatar\/)([\w]*)(.jpg)(.*?submittime":")([\d- :]*)/g, function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) { var tmpstr = getDateDiff($9); var cachedoor = get_or_create_avatar($6); var receivercachedoor = get_or_create_avatar($2); if (cachedoor) { var cacheavatar = cachedoor; } else { var cacheavatar = $5 + $6 + $7; }; if (receivercachedoor) { var receiveravatar = receivercachedoor } else { var receiveravatar = $1 + $2 + $3}; return ('receiveravatar":"' + receiveravatar + $4 + cacheavatar + $8 + tmpstr ) })




            console.log(tmp)
            // var tmp = JSON.stringify(one).replace(/submittime":"([\d- :]*)(.*?receiveravatar":")(.*?avatar\/)([\w]*)(.jpg)(.*?senderavatar":")(.*?avatar\/)([\w]*)(.jpg)/g, function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) { var tmpstr = getDateDiff($1); var cachedoor = get_or_create_avatar($4); var receivercachedoor = get_or_create_avatar($8); if (cachedoor) { var cacheavatar = cachedoor; } else { var cacheavatar = $3 + $4 + $5; }; if (receivercachedoor) { var receiveravatar = receivercachedoor } else { var receiveravatar = $7 + $8 + $9 }; return ('submittime":"' + tmpstr + $2 + cacheavatar + $6 + receiveravatar) })

            var tmpmessagelist = JSON.parse(tmp)
            one = tmpmessagelist

            for (var i in all) { if (all[i].sessionid == one[0].sessionid) { all[i].value.unshift(one[0].value[0]); that.globalData.nothissession = false } }
            if (all.length == 0 | that.globalData.nothissession) {
              all.unshift(one[0])
            }



            that.globalData.messagelist = all
            if (that.globalData.informthat) {
              that.globalData.informthat.setData({
                sixindoor: true,

              })
            } else {
              that.globalData.sixindoor = true
            }

            if (that.globalData.messagethat) {
              that.globalData.messagethat.setData({
                messagelist: all
              })
            }


            if (that.globalData.chatroomthat) {
              that.globalData.chatroomthat.setData({
                messagelist: all[that.globalData.conversationindex]
              })
            }


          } else if (statuscode == 'inform') {
            var all = that.globalData.informlist
            var singlemessage = JSON.parse(tmp.json_data)
            var one = singlemessage


            var tmp = JSON.stringify(one).replace(/submittime":"([\d- :]*)/g, function ($0, $1) { var tmpstr = getDateDiff($1); return ('submittime":"' + tmpstr) })




            var tmpinformlist = JSON.parse(tmp)
            one = tmpinformlist

            all.unshift(one[0])
            that.globalData.informlist = all
            if (that.globalData.informthat) {
              that.globalData.informthat.setData({
                informlist: all
              })
            }

          }
          that.globalData.reddot = true
          wx.vibrateShort({
          })
          wx.showTabBarRedDot({
            index: 2,
          })
        }
      })
    })
    wx.onSocketClose(function (res) {
      // that.globalData.closetime++
      console.log('WebSocket 已关闭！')
      setTimeout(that.connect, that.globalData.closetime * 1000)



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
            that.connect()
          },
        })
      }
    })

    var a = wx.getSystemInfoSync()
    that.globalData.screenwidth = a.windowWidth
    that.globalData.screenheight = a.windowHeight



  },

})





