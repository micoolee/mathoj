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
  onPullDownRefresh:function(){
    wx.showNavigationBarLoading()
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/message/gettensixins',
      data: { 'openid': app.globalData.openid, 'formersixinid': app.globalData.formersixinid, 'sessionid': that.data.sessionid },
      method: 'POST',
      success: function (res) {
        
        if (res.data.sixin) {
          var all = that.data.sixinlist

          var sixinlist = res.data.sixin.concat(all)

          var util = require("../../../../utils/util.js")
          //加载缓存中的照片
          for (var i in sixinlist) {
            if (util.storedid.get(sixinlist[i].openid) == 'downloaded') {
              console.log('direct use')
              sixinlist[i].avatar = util.get_or_create_avatar(sixinlist[i].openid)
            } else if (util.storedid.get(sixinlist[i].openid) == undefined) {
              console.log('download')
              util.get_or_create_avatar(sixinlist[i].openid)
            }
          }


          app.globalData.formersixinid = res.data.sixin[0].sixinid
          that.setData({
            sixinlist: sixinlist
          })
        }else{
          wx.showToast({
            title: '没有了',
          })
        }

      }
    })
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
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
    //第一次需要api请求
    wx.request({
      url: app.globalData.baseurl + '/message/gettensixins',
      data: { 'openid': app.globalData.openid, 'formersixinid': 0, 'sessionid': JSON.parse(option.sessionid)},
      method: 'POST',
      success: function (res) {
        if (res.data.sixin){
          app.globalData.formersixinid = res.data.sixin[0].sixinid
          var sixinlist = res.data.sixin
          var util = require("../../../../utils/util.js")
          //加载缓存中的照片
          for (var i in sixinlist) {
            if (util.storedid.get(sixinlist[i].openid) == 'downloaded') {
              console.log('direct use')
              sixinlist[i].avatar = util.get_or_create_avatar(sixinlist[i].openid)
            } else if (util.storedid.get(sixinlist[i].openid) == undefined) {
              console.log('download')
              util.get_or_create_avatar(sixinlist[i].openid)
            }
          }

          that.setData({
            sixinlist: sixinlist
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
      }
    })

  },

  refresh:function(){
    var that = this
    that.pageScrollToBottom()
  },

  sendmsg: function (e) {
      wx.request({
          url: app.globalData.baseurl + '/user/pushformid',
          method: 'POST',
          data: { 'formid': e.detail.formId, 'openid': app.globalData.openid },
          success: function (res) {
          }
      })
    var that = this
    var receiverid = JSON.parse(app.globalData.receiverid)
    var senderopenid = app.globalData.openid

    wx.request({
      url: app.globalData.baseurl + '/message/createsixin',
      data: { 'receiverid': receiverid, 'senderopenid': senderopenid, 'content': that.data.text},
      method:'POST',
      success: function (res) {
        that.setData({
          success: '',
          sendmsg: ''
        })
        if (res.data.result_code) {
          wx.showToast({
            title: '消息发送失败',
          })
        } else {
          that.pageScrollToBottom()
          var all = app.globalData.sessionlist
          //直接本地添加到会话中
          if (app.globalData.sessionlist.length==0){
            //第一个会话
            
            var one = {}
            one['sessionid'] = res.data.session.sessionid
            one['sixin'] = [{ 'ziji': "1", "senderavatar": app.globalData.avatar, "content": that.data.text }]
            all.push(one)
            that.setData({
              text: '',
              sixinlist: one['sixin'],
            })
            app.globalData.sessionindex = 0
            app.globalData.sessionlist = all
          }else{
            var index = null
            for (var i in all) { if (all[i].sessionid == res.data.session.sessionid) { index = i } }

            if (index!=null){
              //在原有绘画中加入新私信
              var all = app.globalData.sessionlist[index]
              all.sixin.push({ 'ziji': "1", "senderavatar": app.globalData.avatar, "content": that.data.text })
              that.setData({
                text: '',
                sixinlist: all.sixin,
              })
              app.globalData.sessionlist[app.globalData.sessionindex] = all
            }else{
              //添加了一个新绘画
              
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