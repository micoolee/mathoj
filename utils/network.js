// let config = require("../config.js")
// let util = require("./util.js")
var app = getApp()
let network = {
  //post请求
  post: (url, params, success, fail,complete) => {

    wx.request({
      url: app.globalData.baseurl+ `${url}`,
      method: "POST",
      data: params,
      success: res => {
        if (success) {
          console.log(res)
          success(res.data)
        }
      },
      fail: (error) => {
        console.log(error)
        if (fail) {
          fail()
        } else {
          // util.toast("服务器开小差了！")
        }
      },
      complete:(e) =>{
        if(complete){
          complete(e)
        }
      }
    })
  },
  //get请求
  get: (url, params, success, fail) => {

    wx.request({
      url: app.globalData.baseurl +`${url}`,
      method: "GET",
      header: {
        "lversion": `${config.lversion}`,
        "content-type": "application/json"
      },
      data: params,
      success: res => {
        if (success) {
          success(res.data)
        }
      },
      fail: () => {
        if (fail) {
          fail()
        } else {
          // util.toast("服务器开小差了！")
        }
      }
    })
  },

  //post文件请求
  postfile: (url, params, filepath, filename, success, fail) => {
    wx.uploadFile({
      url: app.globalData.baseurl +`${url}`,
      method: 'post',
      header: {
        "content-type": "application/form-data"
      },
      filePath: filepath,
      name: filename,
      formData: params,
      success: function (e) {
        console.log(e)
        success(e)
      },
      fail: function (e) {
        console.log(e)
        fail(e)
      }
    })
  },

}

module.exports = network;