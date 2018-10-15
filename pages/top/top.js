// pages/top/top.js



var util = require('../../utils/util.js')
var getDateDiff = util.getDateDiff
var get_or_create_avatar = util.get_or_create_avatar


const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  ranklist:[]
  },




  showmore: function (e) {
    var userid = e.currentTarget.dataset.userid
    
    var avatar = e.currentTarget.dataset.avatar
    var username = e.currentTarget.dataset.username
    var openid = e.currentTarget.dataset.openid

    if (openid == app.globalData.openid) {
      wx.switchTab({
        url: '../settings/settings',
      })
    } else {
      wx.navigateTo({
        url: `../settings/profile/profile?userid=${userid}&avatar=${avatar}&username=${username}&openid=${openid}`,
      })
    }


  },






  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/getrank/',
      success: function (res) {
        var ranklist = JSON.parse(res.data.json_data)

        var tmp = JSON.stringify(ranklist).replace(/avatar":"(.*?avatar\/)([\w-_]*)(.jpg)/g, function ($0, $1, $2, $3) { var receivercachedoor = get_or_create_avatar($2); if (receivercachedoor) { var receiveravatar = receivercachedoor } else { var receiveravatar = $1 + $2 + $3 }; return ('avatar":"' + receiveravatar) })

        ranklist = JSON.parse(tmp)


        that.setData({
          ranklist: ranklist
        })
      },
      complete:function(){
        wx.hideNavigationBarLoading()
      }
    })
  },



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },




})