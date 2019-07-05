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
          title: '识别中',
        })
        let filePaths = res.tempFilePaths;
        uploader.upload(configs, filePaths[0], res => {
          if (res.error == undefined) {
            http.post('/rubbish/image_scan', {
              image_url: res.imageURL
            }, res => {
              wx.hideLoading();
              if(res.data.code == 0){
                console.log(res.data.data);
                this.setData({
                  list:res.data.data,
                  uploadImage: filePaths[0],
                  showResult: true
                });
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

  }
})