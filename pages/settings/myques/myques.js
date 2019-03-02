// pages/settings/myques/myques.js
const app = getApp()
Page({

  data: {
    problemlist:null,
    problemlistnull:0,
    icon: '../../../images/empty.png',
  },
  deleteproblem:function(e){
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
          url: app.globalData.baseurl + '/problem/delete',
            method: 'POST',
              data: { 'problemid': e.currentTarget.dataset.pid },
          success: function (res) {
            console.log('success to delete')
          }
        })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  tosolve:function(e){
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
  bindQueTap: function (event) {
    var problemid = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `../../question/question?problemid=${problemid}`
    })
  },

  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/problem/getmyproblem',
      method: 'post',
      data: { 'openid': app.globalData.openid },
      success: function (res) {
        if(res.data.myproblem){
          that.setData({
            problemlist: res.data.myproblem,
            problemlistnull: res.data.myproblem.length
          })
        }else{
          that.setData({
            problemlist: [],
            problemlistnull: 0
          })
        }
      }
    })
  },
})