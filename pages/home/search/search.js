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
})