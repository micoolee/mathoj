// pages/searchres/searchres.js
const app = getApp()
var network = require('../../../utils/network.js')
Page({
  data: {
    searchlist: [],
    searchlistnull: 0,
    msg2: {
      icon: '/images/empty.png',
      buttons: [{
        text: '随便逛逛',
      }],
    },
  },
  pushformid: function (e) {
    network.post('/user/pushformid', { 'formid': e.detail.formId, 'openid': app.globalData.openid })
    wx.navigateBack({
      url: '/pages/home/tosolve/tosolve'
    })
  },

  bindQueTap: function (e) {
    var problemid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/home/question/question?problemid=${problemid}`
    })
  },

  onLoad: function (options) {
    var searchlist = app.globalData.searchlist
    if (!searchlist) {
      this.setData({
        searchlist: [],
        searchlistnull: 0
      })
    } else {
      this.setData({
        searchlist: searchlist,
        searchlistnull: searchlist.length
      })
    }

  },
})