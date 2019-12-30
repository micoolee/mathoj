let console = require("console.js")
let config = require("../config.js")

let network = {
  //post请求
  post: (url, params, success, fail, complete) => {
    wx.request({
      url: config.host + url,
      method: "POST",
      data: params,
      success: res => {
        if (success) {
          ////console.log(res)
          success(res.data)
        }
      },
      fail: (error) => {
        ////console.log(error)
        if (fail) {
          fail()
        } else {
          wx.showToast({
            title: '服务器开小差了！',
          })
        }
      },
      complete: (e) => {
        if (complete) {
          complete(e)
        }
      }
    })
  },

  //post文件请求
  postfile: (url, params, filepath, filename, success, fail) => {
    wx.uploadFile({
      url: config.host + url,
      method: 'post',
      header: {
        "content-type": "application/form-data"
      },
      filePath: filepath,
      name: filename,
      formData: params,
      success: function (e) {
        ////console.log(e)
        success(e)
      },
      fail: function (e) {
        ////console.log(e)
        fail(e)
      }
    })
  },

}

module.exports = network;