// pages/invite/invite.js
const app = getApp()
var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
//var console = require('../../../utils/console.js')
var formerid = 0
var config = require('../../../config.js')
Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 

  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notes: [],
    commentcontent: '',
    date: '2016-09-01',
  },
  writecomment: function (e) {
    this.setData({
      commentcontent: e.detail.value
    })
  },


  comment: function (event) {
    var that = this
    if (this.data.commentcontent == null || this.data.commentcontent == '') {
      wx.showModal({
        title: '提示',
        content: '请输入内容',
      })
    } else {
      network.post('/user/posttowall', {
        'userid': app.globalData.selfuserid,
        'desc': this.data.commentcontent,
      }, function (res) {
        wx.showToast({
          title: '发布成功请刷新',
        })
        that.setData({
          comments: res.comment,
          commentcontent: ''
        })
      }, function () {
        wx.showToast({
          title: '发布失败',
        })
      })
    }
  },
  bindDateChange: function (e) {
    var that = this
    this.setData({
      date: e.detail.value
    })
    network.post('/user/getwall', {
      'userid': app.globalData.selfuserid,
      'date': e.detail.value,
      'formerid': 0
    }, function (res) {
      if (res.notes && res.notes.length > 0) {
        that.setData({
          notes: res.notes,
        })
        formerid = res.notes[res.notes.length - 1].id
      } else {
        that.setData({
          notes: []
        })
        formerid = 0
      }

    })
  },
  onLoad: function () {
    var today = new Date().Format("yyyy-MM-dd");
    var that = this
    that.setData({
      date: today,
    })
    network.post('/user/getwall', {
      'userid': app.globalData.selfuserid,
      'date': today,
      'formerid': 0
    }, function (res) {
      //console.log('res:', res)
      if (res.notes && res.notes.length > 0) {
        that.setData({
          notes: res.notes,
        })
        formerid = res.notes[res.notes.length - 1].id
      }

    })
  },

  totoday: function (e) {
    var that = this
    that.onLoad()
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    var that = this
    network.post('/user/getwall', {
      'userid': app.globalData.selfuserid,
      'date': that.data.date,
      'formerid': formerid
    }, function (res) {
      //console.log('res:', res)
      if (res.notes && res.notes.length > 0) {
        that.setData({
          notes: res.notes,
        })
        formerid = res.notes[res.notes.length - 1].id
      }

    })
    wx.stopPullDownRefresh() //停止下拉刷新
    wx.hideNavigationBarLoading()
  }

})