//index.js
//获取应用实例
const app = getApp()
const config = require("../../../config.js")
let network = require("../../../utils/network.js")
let console = require("../../../utils/console.js")
Page({
  data: {
    showpost: false,
    qrcodepath: config.host + "/swagger/qrcode.jpg",
    cardInfo: {
      avaters: [
        config.host + "/swagger/qrcodeavatar1.jpg",
        config.host + "/swagger/qrcodeavatar1.jpg",
        config.host + "/swagger/qrcodeavatar1.jpg",
        config.host + "/swagger/qrcodeavatar1.jpg",
        config.host + "/swagger/qrcodeavatar1.jpg",
        config.host + "/swagger/qrcodeavatar1.jpg",
        config.host + "/swagger/qrcodeavatar1.jpg"
      ], //需要https图片路径
      qrCode: "", //需要https图片路径
      TagText: "", //标签
      Useravatar: "", //用户的头像
      Name: 'mike', //姓名
      Position: "", //职位
      Mobile: "这里有营养早餐", //手机
      Company: "快来看看吧", //公司
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
    console.log(app.globalData.userInfo)
    var that = this
    that.setData({
      ['cardInfo.qrCode']: that.data.qrcodepath || '',
      ['cardInfo.Useravatar']: app.globalData.userInfo.avatarUrl || '',
      ['cardInfo.Name']: app.globalData.userInfo.nickName || ''
    })
    that.getAvaterInfo();
  },


  /**
   * 先下载大图片
   */
  getAvaterInfo: function () {
    var that = this;
    wx.showLoading({
      title: '生成中...',
      mask: true,
    });
    that.setData({
      showpost: true
    })
    wx.downloadFile({
      url: that.data.cardInfo.avaters[Math.floor((Math.random() * 7) + 1) - 1], //头像图片路径
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          var avaterSrc = res.tempFilePath; //下载成功返回结果
          that.getQrCode(avaterSrc); //继续下载二维码图片
        } else {
          wx.showToast({
            title: '头像下载失败！',
            icon: 'none',
            duration: 2000,
            success: function () {
              var avaterSrc = "";
              that.getQrCode(avaterSrc);
            }
          })
        }
      }
    })
  },

  /**
   * zai下载二维码图片
   */
  getQrCode: function (avaterSrc) {
    var that = this;
    wx.showLoading({
      title: '生成中...',
      mask: true,
    });
    that.setData({
      showpost: true
    })
    wx.downloadFile({
      url: that.data.cardInfo.qrCode, //二维码路径
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          var codeSrc = res.tempFilePath;
          that.getUseravatar(avaterSrc, codeSrc);
        } else {
          wx.showToast({
            title: '二维码下载失败！',
            icon: 'none',
            duration: 2000,
            success: function () {
              var codeSrc = "";
              that.sharePosteCanvas(avaterSrc, codeSrc);
            }
          })
        }
      }
    })
  },


  // 最后下载用户头像
  getUseravatar: function (avaterSrc, codeSrc) {
    var that = this;
    wx.showLoading({
      title: '生成中...',
      mask: true,
    });
    that.setData({
      showpost: true
    })
    wx.downloadFile({
      url: that.data.cardInfo.Useravatar, //用户头像路径
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          var Useravatar = res.tempFilePath;
          that.sharePosteCanvas(avaterSrc, codeSrc, Useravatar);
        } else {
          wx.showToast({
            title: '二维码下载失败！',
            icon: 'none',
            duration: 2000,
            success: function () {
              var Useravatar = "";
              that.sharePosteCanvas(avaterSrc, codeSrc, Useravatar);
            }
          })
        }
      }
    })
  },

  /**
   * 开始用canvas绘制分享海报
   * @param avaterSrc 下载的头像图片路径
   * @param codeSrc   下载的二维码图片路径
   * @param useravatar   下载的用户头像图片路径
   */
  sharePosteCanvas: function (avaterSrc, codeSrc, Useravatar) {
    wx.showLoading({
      title: '生成中...',
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

      //头像为正方形
      if (avaterSrc) {
        ctx.drawImage(avaterSrc, left, 20, width, width);
        ctx.setFontSize(14);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
      }

      //标签
      if (cardInfo.TagText) {
        ctx.fillText(cardInfo.TagText, left + 20, width - 4);
        const metrics = ctx.measureText(cardInfo.TagText); //测量文本信息
        ctx.stroke();
        ctx.rect(left + 10, width - 20, metrics.width + 20, 25);
        ctx.setFillStyle('rgba(255,255,255,0.4)');
        ctx.fill();
      }

      //头像
      if (Useravatar) {
        ctx.drawImage(Useravatar, left, width + 45, width * 0.1, width * 0.1);
        ctx.setFontSize(14);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
      }

      //姓名
      if (cardInfo.Name) {
        ctx.setFontSize(14);
        ctx.setFillStyle('#000');
        ctx.setTextAlign('left');
        ctx.fillText(cardInfo.Name, left + 30, width + 55);
      }

      //职位
      if (cardInfo.Position) {
        ctx.setFontSize(12);
        ctx.setFillStyle('#666');
        ctx.setTextAlign('left');
        ctx.fillText(cardInfo.Position, left, width + 95);
      }

      //电话
      if (cardInfo.Mobile) {
        ctx.setFontSize(12);
        ctx.setFillStyle('#666');
        ctx.setTextAlign('left');
        ctx.fillText(cardInfo.Mobile, left, width + 115);
      }

      // 公司名称
      if (cardInfo.Company) {
        ctx.setFontSize(12);
        ctx.setFillStyle('#666');
        ctx.setTextAlign('left');
        ctx.fillText(cardInfo.Company, left, width + 145);
      }

      //  绘制二维码
      if (codeSrc) {
        ctx.drawImage(codeSrc, left + 160, width + 40, width / 3, width / 3)
        ctx.setFontSize(10);
        ctx.setFillStyle('#000');
        ctx.fillText("微信扫码或长按识别", left + 155, width + 150);
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
  closePost: function (e) {
    this.setData({
      showpost: false
    })
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