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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    var that = this
    wx.request({
      url: app.globalData.baseurl+'/getrank/',
      success:function(res){
        var ranklist = JSON.parse(res.data.json_data)

        var tmp = JSON.stringify(ranklist).replace(/avatar":"(.*?avatar\/)([\w]*)(.jpg)/g, function ($0, $1, $2, $3) {  var receivercachedoor = get_or_create_avatar($2); if (receivercachedoor) { var receiveravatar = receivercachedoor } else { var receiveravatar = $1 + $2 + $3 }; return ('avatar":"' + receiveravatar ) })

        ranklist = JSON.parse(tmp)


        that.setData({
          ranklist:ranklist
        })
      }
    })
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