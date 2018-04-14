//app.js
App({
  globalData: {
    userInfo: null,
    baseurl: 'http://www.liyuanye.club',
    wssurl: 'ws://www.liyuanye.club/testwss/',
    openid: 'null',
    audiopath: null,
    audiopathbak:null,
    returnaudiopath:'',
    duration:100,
    avatar:null,
    nickname:null,
    screenwidth:0,
    screenheight:0,
    messagelist:[],
    conversationdetaillist:[],
    receiverid:null,
    closetime:0
  },

connect:function(){
  var that = this
  wx.connectSocket({
    url: that.globalData.wssurl
  })

  wx.onSocketOpen(function (res) {
    console.log('websocket opened')

    //resend heartbeat pack 
    wx.sendSocketMessage({
      data: JSON.stringify({ 'userid': that.globalData.openid, 'statuscode': '1' }),
    })
    wx.onSocketMessage(function (res) {
      console.log('chonglianhou收到服务器内容：' + res.data)
      var singlemessage = JSON.parse(res.data)
      console.log(that.globalData.messagelist)
      console.log(singlemessage)
      var all = that.globalData.messagelist
      var one = singlemessage
      for (var i in all) { if (all[i].sessionid == one[0].sessionid) { all[i].value.push(one[0].value[0]) } }
      that.globalData.messagelist = all

      getCurrentPages()[1].onShow()

    })

  })



  wx.onSocketClose(function (res) {
    that.globalData.closetime++
    console.log('WebSocket 已关闭！')
    setTimeout(that.connect,0) 

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





