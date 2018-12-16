// pages/invite/invite.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  problemid:null,
  invitedsign:[false],
  noone:false,
    icon: '../../images/empty.png',
  },

invite:function(e){
  
  var beinviter = e.currentTarget.dataset.beinviter
  var that = this
  var index = e.currentTarget.dataset.index
  wx.request({
    url: app.globalData.baseurl +'/problem/createinvite',
    method:'POST',
    data: { 'inviterid': app.globalData.selfuserid,'beinviterid':beinviter,'problemid':JSON.parse(that.data.problemid)},
    success:function(res){
      var tmp = that.data.invitedsign
      tmp[index]=true
      that.setData({
        invitedsign:tmp
      })
    }
  })

},

  torank: function () {
    var that = this
    wx.switchTab({
      url: '/pages/top/top',
    })
  },
  onShow:function(){
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/problem/getinvitelist',
      method: 'post',
      data: { 'openid': app.globalData.openid, 'problemid': JSON.parse(that.data.problemid) },
      success: function (res) {
        var subscriberlist = res.data.beinviter
        if (! subscriberlist ) {
          that.setData({
            noone:true
          })
          wx.showToast({
            title: '请关注后再邀请',
          })
          return
        }
        var tmplist = new Array();
        for (var i = 0; i < subscriberlist.length; i++) {
          tmplist.push(false)
        }
        that.setData({
          subscriberlist: subscriberlist,
          invitedsign: tmplist
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      problemid:options.problemid
    })

  },

})