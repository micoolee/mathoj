const app =getApp()
if(app.globalData.baseurl ){
  console.log(app.globalData.baseurl)
  var baseurl = app.globalData.baseurl
}else{
  var baseurl = 'https://mathoj.liyuanye.club'
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'请等待，加载中......',
    title:null,
    author:null,
    authorid:null,
    loadok:false,
    storyid:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var storyid = options.id
    this.setData({
      storyid : options.id
    })
    
    wx.request({
      url: baseurl+'/getstory/',
      data:{'storyid':storyid},
      success:function(res){
        that.setData({
          authorid:res.data.authorid,
          title:res.data.title,
          author:res.data.author,
          content:res.data.content,
          loadok:true
        })
      }
    })
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
    return {
      title: '[有人@我]小学奥数，分享给你~',

      path: '/pages/storydetail/storydetail?id=' + this.data.storyid,

      imageUrl: app.globalData.baseurl + '/static/sharepic.jpg',

      success: function (res) {
        wx.showToast({
          title: '分享成功~',
        })
      }
    }
  }
})