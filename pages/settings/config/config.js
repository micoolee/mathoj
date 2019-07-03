// pages/settings/config/config.js
var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
var console = require('../../../utils/console.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grades:[],
    index:0,
    onlysee:true
  },
  changegrade:function(e){
    console.log(e)
    this.setData({
      index:e.detail.value
    })
  },
  switch1Change:function(e){
    this.setData({
      onlysee: e.detail.value
    })
  },
  save:function(e){
    var that = this
    network.post('/user/updateconfig', { 'userid': app.globalData.selfuserid, 'onlysee': that.data.onlysee, 'grade': that.data.index*1},function(e){
      wx.showToast({
        title: '更新成功',
        duration: 1000,
        mask: true,
      })
      app.globalData.onlysee = that.data.onlysee
      console.log(that.data.index)
      app.globalData.grade = that.data.index*1
      app.globalData.tosolvethat.setData({
        formerid:0,
        solvedformerid: 0
      })
      if (that.data.onlysee){
        util.getlastedprob(app.globalData.tosolvethat, [util.gradearray[that.data.index]])
        util.getlastedsolvedprob(app.globalData.tosolvethat, [util.gradearray[that.data.index]])
      }else{
        util.getlastedprob(app.globalData.tosolvethat)
        util.getlastedsolvedprob(app.globalData.tosolvethat)
      }
      wx.navigateBack({
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(util.gradearray)
    console.log(app.globalData.grade)
    this.setData({
      grades:util.gradearray,
      index:app.globalData.grade
    })
    if(app.globalData.onlysee){
      this.setData({
        onlysee: true
      })
    }else{
      this.setData({
        onlysee: false
      })
    }
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