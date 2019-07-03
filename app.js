const config = require("./config.js");
const httpUtil = require("./utils/http.js");

App({
  onLaunch: function () {

    this.globalData.apiUrl = config.domain;
    this.globalData.imageUrl = config.qiniuDomain;
    this.globalData.needToReloadShareActivity = false;
    this.globalData.flushCart = false;
    //FF6347

    let token = wx.getStorageSync('token');
    console.log('token=' + token);
    if (!token) {
      //httpUtil.login();
    }
  },

  /**
   * 刷新纪录新增购物车的状态
   */
  flushCartStatus:function(){
    this.globalData.flushCart = this.globalData.flushCart==true?false:true;
  },

  globalData: {
    appId:null,
    userInfo: null,
    apiUrl: null,
    needToReloadShareActivity:false,
    flushCart:false
  }
})