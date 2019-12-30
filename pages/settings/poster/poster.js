//index.js
//获取应用实例
const app = getApp()
const config = require("../../../config.js")
let network = require("../../../utils/network.js")
var randint
var isproblem = false
var problemdesc = ''
var qrCode = ''
var havepic = ''
Page({
  data: {
    qrcodepath: config.host + "/swagger/qrcode.png",
    cardInfo: {
      avaters: [
        config.host + "/swagger/qrcodeavatar1.jpg",
        config.host + "/swagger/qrcodeavatar2.jpg",
        config.host + "/swagger/qrcodeavatar3.jpg",
        config.host + "/swagger/qrcodeavatar4.jpg",
        config.host + "/swagger/qrcodeavatar5.jpg",
        config.host + "/swagger/qrcodeavatar6.jpg",
        config.host + "/swagger/qrcodeavatar7.jpg",
        config.host + "/swagger/qrcode-b1.jpg"
      ], //需要https图片路径
      colors: [
        "#fff",
        "#fff",
        "#fff",
        "#000",
        "#fff",
        "#000",
        "#fff",
        "#fff",
      ],
      // qrCode: "", //需要https图片路径
      Useravatar: "", //用户的头像
      Name: 'mike', //分享者的姓名
      Slogan: "这里可以提问答疑哦", //标语
      TagText: ''//图片里的标语
    },
    fromgame: false
  },
  onUnload: function (e) {
    if (this.data.fromgame) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },

  onLoad: function (options) {
    var that = this
    that.setData({
      ['cardInfo.Useravatar']: app.globalData.userInfo.avatarUrl || '',
      ['cardInfo.Name']: app.globalData.userInfo.nickName || ''
    })
    that.qrCode = that.data.qrcodepath || ''
    if (options.problemid != '' && options.problemid != undefined) {
      that.isproblem = true
      that.setData({
        ['cardInfo.Slogan']: '这道题你会做吗？'
      })
      that.problemdesc = app.globalData.problemdesc
      that.havepic = options.havepic
      network.post('/problem/getqrcode', {
        'path': 'pages/home/question/question?problemid=' + options.problemid,
        'problemid': options.problemid,
      }, function (e) {
        if (e.Qrcodeurl != "") {
          that.qrCode = e.Qrcodeurl || ''
          that.getAvaterInfo();
        }
      })
    } else {
      that.getAvaterInfo();
    }
  },


  /**
   * 先下载大图片
   */
  getAvaterInfo: function () {
    var that = this;
    wx.showLoading({
      title: '下载背景图...',
      mask: true,
    });
    randint = Math.floor((Math.random() * 7) + 1) - 1
    if (that.isproblem) {
      randint = 7
      that.setData({
        ['cardInfo.TagText']: that.problemdesc,
      })
    }
    wx.downloadFile({
      url: that.data.cardInfo.avaters[randint], //头像图片路径
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          var headSrc = res.tempFilePath; //下载成功返回结果
          that.getQrCode(headSrc); //继续下载二维码图片
        } else {
          wx.showToast({
            title: '背景图下载失败！',
            icon: 'none',
            duration: 2000,
            success: function () {
              var headSrc = "";
              that.getQrCode(headSrc);
            }
          })
        }
      }
    })
  },

  /**
   * zai下载二维码图片
   */
  getQrCode: function (headSrc) {
    var that = this;
    wx.showLoading({
      title: '下载二维码...',
      mask: true,
    });
    wx.downloadFile({
      url: that.qrCode, //二维码路径
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          var codeSrc = res.tempFilePath;
          that.getUseravatar(headSrc, codeSrc);
        } else {
          wx.showToast({
            title: '二维码下载失败！',
            icon: 'none',
            duration: 2000,
            success: function () {
              var codeSrc = "";
              that.sharePosteCanvas(headSrc, codeSrc);
            }
          })
        }
      }
    })
  },


  // 最后下载用户头像
  getUseravatar: function (headSrc, codeSrc) {
    var that = this;
    wx.showLoading({
      title: '下载头像...',
      mask: true,
    });

    wx.downloadFile({
      url: that.data.cardInfo.Useravatar, //用户头像路径
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          var Useravatar = res.tempFilePath;
          that.sharePosteCanvas(headSrc, codeSrc, Useravatar);
        } else {
          wx.showToast({
            title: '头像下载失败！',
            icon: 'none',
            duration: 2000,
            success: function () {
              var Useravatar = "";
              that.sharePosteCanvas(headSrc, codeSrc, Useravatar);
            }
          })
        }
      }
    })
  },

  /**
   * 开始用canvas绘制分享海报
   * @param headSrc 下载的头像图片路径
   * @param codeSrc   下载的二维码图片路径
   * @param useravatar   下载的用户头像图片路径
   */
  sharePosteCanvas: function (headSrc, codeSrc, Useravatar) {
    wx.showLoading({
      title: '稍等，生成中...',
      mask: true,
    })
    var that = this;
    var cardInfo = that.data.cardInfo; //需要绘制的数据集合
    const ctx = wx.createCanvasContext('myCanvas'); //创建画布
    var width = "";
    wx.createSelectorQuery().select('#canvas-container').boundingClientRect(function (rect) {
      var height = rect.height;
      var right = rect.right;
      width = rect.width * 0.8;
      var left = rect.left + 5;
      ctx.setFillStyle('#fff');
      ctx.fillRect(0, 0, rect.width, height);

      //大图为正方形
      if (headSrc) {
        ctx.drawImage(headSrc, 0, 0, rect.width, height);
        ctx.setFontSize(14);
        ctx.setFillStyle(that.data.cardInfo.colors[randint]);
        ctx.setTextAlign('left');
      }

      //标签
      if (cardInfo.TagText) {
        let [contentLeng, contentArray, contentRows] = that.textByteLength(cardInfo.TagText, 40)
        ctx.setTextAlign('left');
        ctx.setFontSize(12);
        var m = 0
        for (; m < contentArray.length; m++) {
          if (m > 4) {
            ctx.fillText('...', left, 100 + 30 * m);
            break
          }
          ctx.fillText(contentArray[m], left, 100 + 30 * m);
        }
        if (that.havepic != 'noimages') {
          if (m > 4) {
            ctx.fillText('(图片见小程序内)', left, 130 + 30 * m);
          } else {
            ctx.fillText('(图片见小程序内)', left, 100 + 30 * m);
          }
        }
      }

      //头像
      if (Useravatar) {
        ctx.drawImage(Useravatar, left, width + 45, width * 0.15, width * 0.15);
        ctx.setFontSize(14);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
      }

      //姓名
      if (cardInfo.Name) {
        ctx.setFontSize(14);
        ctx.setFillStyle(that.data.cardInfo.colors[randint]);
        ctx.setTextAlign('left');
        ctx.fillText(cardInfo.Name, left + 50, width + 60);
      }

      //标语
      if (cardInfo.Slogan) {
        let [contentLeng, contentArray, contentRows] = that.textByteLength(cardInfo.Slogan, 20)
        ////console.log(contentLeng, contentArray, contentRows)
        ctx.setTextAlign('left');
        ctx.setFillStyle(that.data.cardInfo.colors[randint]);
        ctx.setFontSize(12);
        let contentHh = 22 * 1;
        for (let m = 0; m < contentArray.length; m++) {
          ctx.fillText(contentArray[m], left, width + 110 + contentHh * m);
        }
      }

      //  绘制二维码
      if (codeSrc) {
        ctx.drawImage(codeSrc, left + 160, width + 40, width / 3, width / 3)
        ctx.setFontSize(10);
        ctx.setFillStyle('#000');
        // ctx.fillText("微信扫码或长按识别", left + 140, width + 140);
      }

    }).exec()

    setTimeout(function () {
      ctx.draw();
      wx.hideLoading();
    }, 1000)

  },

  /**
   * 多行文字处理，每行显示数量
   * @param text 为传入的文本
   * @param num  为单行显示的字节长度
   */
  textByteLength(text, num) {
    let strLength = 0; // text byte length
    let rows = 1;
    let str = 0;
    let arr = [];
    for (let j = 0; j < text.length; j++) {
      if (text.charCodeAt(j) > 255) {
        strLength += 2;
        if (strLength > rows * num) {
          strLength++;
          arr.push(text.slice(str, j));
          str = j;
          rows++;
        }
      } else {
        strLength++;
        if (strLength > rows * num) {
          arr.push(text.slice(str, j));
          str = j;
          rows++;
        }
      }
    }
    arr.push(text.slice(str, text.length));
    return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
  },

  //点击保存到相册
  saveShareImg: function () {
    var that = this;
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              wx.showModal({
                content: '图片已保存到相册，赶紧晒一下吧~',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333',
                success: function (res) {
                  if (res.confirm) { }
                },
                fail: function (res) { }
              })
            },
            fail: function (res) { }
          })
        }
      });
    }, 1000);
  },

})