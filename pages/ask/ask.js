// pages/ask/ask.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputnum:0,
    files: ["../../images/pic_160.png"],
    gradearray: ['未选择', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二','初三','高一','高二','高三'],

    grade: '未选择',
    gradeindex: 0,
    easy: 'noeasy',
    rewardarray: ['未选择', '1个奥币','2个奥币','3个奥币'],
    rewardindex:0,
    reward:0,
    easyitems: [
      { name: 'difficult', value: '困难' },
      { name: 'easy', value: '简单', checked: 'true' },
    ],
    desc: '',
    placeholder:'',
    img: 'noimage',
    askpicdoor:false,
    avatar:app.globalData.avatar,
    screenwidth:app.globalData.screenwidth,
    screenheight: app.globalData.screenheight,
    imagelength:0,
    disabledbut:false
  },

  descinput: function (e) {
    var num = e.detail.value.length
    app.globalData.placeholder= e.detail.value
    this.setData({
      desc: e.detail.value,
      inputnum:num,
      
    })
  },

  bindPickerChange: function (e) {
    this.setData({
      gradeindex: e.detail.value,
      grade: this.data.gradearray[e.detail.value]
    })
  },

  bindPickerChangereward: function (e) {
    this.setData({
      rewardindex: e.detail.value,
      reward: this.data.rewardarray[e.detail.value]
    })
  },

  uploadimg: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const src = res.tempFilePaths[0]
        that.setData({
          files: [src],
          imagelength:1,
          problempicsrc: src,
          askpicdoor:true,
          img: src
        })
      }
    })
  },

  ask: function (e) {
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/user/pushformid',
      data: { 'formid': e.detail.formId, 'openid': app.globalData.openid},
      method:"post",
      success: function (res) {
      }
    })
    if (this.data.desc==''){
      wx.showModal({
        title: '提示',
        content: '请输入问题描述',
      })
    } else if (this.data.grade == '未选择'){
      wx.showModal({
        title: '提示',
        content: '请选择年级',
      })
    } else if (this.data.reward == '未选择' || this.data.reward ==''){
      wx.showModal({
        title: '提示',
        content: '请选择奖励值',
      })
    }
    else{

      this.setData({
        hide: false,
        disabledbut:true,
        userid: app.globalData.openid,
        avatar: app.globalData.avatar,
      })
      var formdata = { "openid": app.globalData.openid, "easy": that.data.easy, "grade": that.data.grade, "desc": that.data.desc,"reward":that.data.reward,"noimage":"false" }
      var formdata1 = { "openid": app.globalData.openid, "easy": that.data.easy, "grade": that.data.grade, "desc": that.data.desc, "reward": that.data.reward,"noimage":"true" }
      if (this.data.img != 'noimage') {
        wx.uploadFile({
          url: app.globalData.baseurl + '/problem/create',
          method: 'post',
          header: {
            "content-type": "application/form-data"
          },
          filePath: this.data.img,
          name: 'problempic',
          formData: formdata,
          success: function () {
            that.setData({
              disabledbut:false
            })
            wx.showModal({
              title: '提示',
              content: '提问成功',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                  })
                }
              }
            })
          }
        })


      }
      else {
        
        wx.request({
          url: app.globalData.baseurl + '/problem/create',
          method: 'POST',
          header: {
            "content-type": "application/json"
          },
          data: formdata1,
          success: function (res) {
            that.setData({
              disabledbut: false
            })
            wx.showModal({
              title: '提示',
              content: '提问成功',
              success: function (res) {
                if (res.confirm) {
                  app.globalData.placeholder = ''
                  wx.navigateBack({
                  })
                } else if (res.cancel) {
                }
              }
            })
          },
        })
      }
    }
  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, 
      urls: this.data.files 
    })
  },

  cancelask: function (e) {
    var that = this
    wx.request({
      url: app.globalData.baseurl + '/user/pushformid',
      data: { 'formid': e.detail.formId, 'openid': app.globalData.openid},
      method: "post",
      success: function (res) {
      }
    })
    app.globalData.placeholder = ''
    wx.navigateBack({
      
    })
  },
 onShow:function(){
   this.setData({
     placeholder: app.globalData.placeholder
   })
 }


})