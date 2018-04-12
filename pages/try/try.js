// pages/try/try.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  connect:function(){
console.log('aaa')
  },
send:function(){



  var socketOpen = false
  var socketMsgQueue = ['a','b']
  wx.connectSocket({
    url: 'ws://www.liyuanye.club/testwss/'
  })

  wx.onSocketOpen(function (res) {
    socketOpen = true
    for (var i = 0; i < socketMsgQueue.length; i++) {
      sendSocketMessage(socketMsgQueue[i])
    }
    socketMsgQueue = []
  })


  wx.onSocketMessage(function (res) {
    console.log('收到服务器内容：' + res.data)
  })


  function sendSocketMessage(msg) {
    if (socketOpen) {
      wx.sendSocketMessage({
        data: msg,
        success:function(res){
          console.log('wh')
          console.log(res)
        }
      })
    } else {
      socketMsgQueue.push(msg)
    }
  }


},
  /**
   * 生命周期函数--监听页面加载
   */


close:function(){


  wx.closeSocket({

  })

  wx.onSocketClose(function (res) {
    console.log('WebSocket 已关闭！')
  })




},




  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})