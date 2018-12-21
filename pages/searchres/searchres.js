// pages/searchres/searchres.js
const app = getApp()
Page({

  data: {
  searchlist:[],
  searchlistnull:0,
    msg2: {
      icon: '../../images/empty.png',
      buttons: [{
        text: '随便逛逛',
      }],
    },
  },
  pushformid:function(e){
    wx.request({
      url: app.globalData.baseurl + '/user/pushformid',
      method: 'POST',
      data: { 'formid': e.detail.formId, 'openid': app.globalData.openid },
      success: function (res) {
      }
    })

    wx.navigateBack({
      url: '../tosolve/tosolve'
    })
  },

  bindQueTap: function (e) {
    var problemid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../question/question?problemid=${problemid}`
    })

  },



  onLoad: function (options) {
    var searchlist = app.globalData.searchlist
    if (!searchlist){
      this.setData({
        searchlist: [],
        searchlistnull: 0
      })
    }else{
      this.setData({
        searchlist: searchlist,
        searchlistnull: searchlist.length
      })
    }

  },
})