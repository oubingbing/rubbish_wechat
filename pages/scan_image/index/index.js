const app = getApp();
const http = require("./../../../utils/http.js");
const qiniuUtil = require("./../../../utils/qiniuToken.js");
const config = require("./../../../config.js");
const uploader = require("./../../../utils/uploadImage");

Page({
  data: {
    token: '',
    cam:'',
    list:[],
    showResult:false,
    uploadImage:''
  },
  onLoad: function () {
    this.getQiNiuToken();

  },

  /**
   * 获取七牛token
   */
  getQiNiuToken: function () {
    qiniuUtil.getQiniuToken(res => {
      this.setData({ token: res })
    })
  },

  /**
  * 选择图片并且上传到七牛
  */
  selectImage: function () {
    let configs = {
      region:'SCN',
      domain: config.qiniuDomain,
      token: this.data.token
    };

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        wx.showLoading({
          title: '识别中...',
        })
       
        let filePaths = res.tempFilePaths;
        uploader.upload(configs, filePaths[0], res => {
          if (res.error == undefined) {
            console.log(config.qiniuDomain + '/' + res.key);
            http.post('/rubbish/image_scan', {
              image_url: config.qiniuDomain+'/'+res.key
            }, res => {
              wx.hideLoading();
              if(res.data.code == 0){
                console.log(res.data.data);
                if(res.data.data.length>0){
                  this.setData({
                    list: res.data.data,
                    uploadImage: filePaths[0],
                    showResult: true
                  });
                }else{
                  wx.showToast({
                    title: '查询不到数据',
                    icon: 'none'
                  })
                }
              }else{
                wx.showToast({
                  title: '识别出错，请重试',
                  icon: 'none'
                })
              }
            });
          }else{
            wx.showToast({
              title: '识别失败',
              icon:'none'
            })
          }
        })
      }
    })

  },

  closeResult:function(){
    this.setData({
      showResult:false
    })
  },
  doNotThing:function(){

  },

  /**
  * 分享
  */
  onShareAppMessage: function (res) {
    return {
      title: '垃圾分类，守护地球',
      path: '/pages/home/index/index',
      imageUrl: '/images/share.jpg',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})