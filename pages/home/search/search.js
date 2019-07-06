const http = require("./../../../utils/http.js");
const util = require("./../../../utils/util.js");
const app = getApp()

Page({
  data: {
    searchName: '',
    result: []
  },

  onLoad: function (options) {

  },

  getSearchName: function (e) {
    this.setData({ searchName: e.detail.value });
  },

  search: function () {
    wx.showLoading({
      title: '查询中',
    })
    http.get(`/rubbish/search?name=${this.data.searchName}`, {}, res => {
      wx.hideLoading();
      let resData = res.data;
      if (resData.code == 0) {
        if (resData.data == '') {
          wx.showToast({
            title: '无数据',
            icon: 'none'
          })
        }else{
          this.setData({ result: resData.data }); 
        }
      }
    });
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