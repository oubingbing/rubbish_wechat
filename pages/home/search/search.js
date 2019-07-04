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

    http.get(`/rubbish/search?name=${this.data.searchName}`, {}, res => {
      wx.hideLoading();
      let resData = res.data;
      if (resData.code == 0) {
        this.setData({ result: resData.data });
        if (resData.data == '' || resData.data.length <= 0) {
          wx.showToast({
            title: '无数据',
            icon: 'none'
          })
        }
      }
    });
  },
})