// pages/settings/mycomm/mycomm.js
const app = getApp()
Page({


  data: {
  commentlist:[],
  commentlistnull:0,
  loadok:false,
  icon: '../../../images/empty.png',
  },
  deletecomment:function(e){
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: app.globalData.baseurl + '/problem/deletecomment',
            method: 'POST',
            data: { 'commentid': e.currentTarget.dataset.cid },
            success: function (res) {
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  tosolve: function (e) {
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/user/pushformid',
      method: 'POST',
      data: { 'formid': e.detail.formId, 'openid': app.globalData.openid },
      success: function (res) {
      }
    })

    wx.switchTab({
      url: '../../tosolve/tosolve',
    })
  },

  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/problem/getmycomment',
      method: 'post',

      data: { 'openid': app.globalData.openid },
      success: function (res) {
        if (res.data.mycomment){
          that.setData({
            commentlist: res.data.mycomment,
            commentlistnull: res.data.mycomment.length,
            loadok: true
          })
        }else{
          that.setData({
            commentlist: [],
            commentlistnull: 0,
            loadok: true
          })
        }

      }
    })
  },



  bindQueTap: function (e) {
      var problemid = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `../../question/question?problemid=${problemid}`
      })

  },
})