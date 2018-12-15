// pages/document/chat/chat.js
const app = getApp()
var util = require('../../../../utils/util.js')
Page({
  data: {
    text: '',
    receiverid: null,
    sessionlistnull:null,
    showdetail:'nouse',
    sixinlist: [] ,
    success:'',
    sendmsg:'',
    sessionid:null,
    newsession:false,
  },


  onLoad: function (option) {
    var that = this
    that.setData({
      sessionid: JSON.parse(option.sessionid),
      newsession: option.newsession,
      receiverid: app.globalData.receiverid,
    })

    //第一次赋值给app.globaldata,为后面ws直接推送提供入口
    app.globalData.chatroomthat = that
    // if (that.data.newsession) {
    //   return
    // }
    //第一次需要api请求
    wx.request({
      url: app.globalData.baseurl + '/message/gettensixins',
      data: { 'openid': app.globalData.openid, 'formersixinid': 0, 'sessionid': JSON.parse(option.sessionid)},
      method: 'POST',
      success: function (res) {
        console.log(res.data.sixin)
        if (res.data.sixin){
          that.setData({
            sixinlist: res.data.sixin
          })
        }else{
          that.setData({
            sixinlist: []
          })
        }

      }
    })

  },

  onShow: function () {
    var that = this
    that.pageScrollToBottom()
  },
  //修改“发送”按钮状态
  inputtext: function (e) {
    if (e.detail.value==''){
      this.setData({
        success: '',
        sendmsg: ''
      })
    }else{
      this.setData({
        text: e.detail.value,
        success:'success',
        sendmsg:'sendmsg'
      })
    }

  },
  //退出的时候去除reddot，并发送已读到后端
  onUnload:function(){
    var that = this
    if (app.globalData.messagethat){
      var all = app.globalData.messagethat.data.sessionlist
      all[app.globalData.sessionindex].sixin[all[app.globalData.sessionindex].sixin.length - 1].readed = '1'
      app.globalData.messagethat.setData({
        sessionlist: all
      })
    }

    
    wx.request({
      url: app.globalData.baseurl + '/message/readsession',
      method: 'POST',
      data: { "session": that.data.sessionid },
      success: function (e) {
        console.log(e)
      }
    })

  },

  refresh:function(){
    that.pageScrollToBottom()
  },

  sendmsg: function (e) {
    var that = this
    var receiverid = JSON.parse(app.globalData.receiverid)
    var senderopenid = app.globalData.openid

    wx.request({
      url: app.globalData.baseurl + '/message/createsixin',
      data: { 'receiverid': receiverid, 'senderopenid': senderopenid, 'content': that.data.text},
      method:'POST',
      success: function (res) {
        if (res.data.result_code) {
          wx.showToast({
            title: '消息发送失败',
          })
        } else {
          that.pageScrollToBottom()
          //直接本地添加到会话中
          if (app.globalData.sessionlist.length==0){
            //第一个会话
            var all = app.globalData.sessionlist
            var one = {}
            one['sessionid'] = res.data.session.sessionid
            one['sixin'] = [{ 'ziji': "1", "senderavatar": app.globalData.avatar, "content": that.data.text }]
            all.push(one)
            // all['sixin']={ 'ziji': "1", "senderavatar": app.globalData.avatar, "content": that.data.text }
            that.setData({
              text: '',
              sixinlist: one['sixin'],
            })
            app.globalData.sessionindex = 0
            app.globalData.sessionlist = all
          }else{
            if (app.globalData.sessionindex){
              var all = app.globalData.sessionlist[app.globalData.sessionindex]
              all.sixin.push({ 'ziji': "1", "senderavatar": app.globalData.avatar, "content": that.data.text })
              that.setData({
                text: '',
                sixinlist: all.sixin,
              })
              app.globalData.sessionlist[app.globalData.sessionindex] = all
            }else{



              var all = app.globalData.sessionlist
              var one = {}
              one['sessionid'] = res.data.session.sessionid
              one['sixin'] = [{ 'ziji': "1", "senderavatar": app.globalData.avatar, "content": that.data.text }]
              all.push(one)
              that.setData({
                text: '',
                sixinlist: one['sixin'],
              })
              app.globalData.sessionindex = app.globalData.sessionlist.length+1
              app.globalData.sessionlist = all

            }

          }

        }
      }
    })
  },



  pageScrollToBottom: function() {
    var that = this
  setTimeout(function() {
      wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
        // 使页面滚动到底部
        wx.pageScrollTo({
          scrollTop: rect.bottom + rect.height + 3000
        })
      }).exec();
    }, 1000)

}

})

// function pageScrollToBottom () {
//   var that = this
//   setTimeout(function () {
//     wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
//       // 使页面滚动到底部
//       wx.pageScrollTo({
//         scrollTop: rect.bottom + rect.height +3000
//       })
//     }).exec();
//   }, 2000)

// }