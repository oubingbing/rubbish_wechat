const http = require("./../../../utils/http.js");
const util = require("./../../../utils/util.js");
const app = getApp();

// 在页面中定义插屏广告
//let interstitialAd = null

Page({
  data: {
    articleId:'',
    article:'',
    showHomePage: false
  },

  onLoad: function (options) {
    if (options.showPage != undefined) {
      this.setData({ showHomePage: false })
    } else {
      wx.switchTab({
        url: '/pages/home/index/index'
      })
    }
    wx.showLoading({
      title: '加载中',
      icon:'none'
    })
    this.setData({ articleId:options.id})
    this.getDetail();

  },

  /**
 * 获取商品列表
 */
  getDetail: function () {
    http.get(`/article/${this.data.articleId}`, {}, res => {
      wx.hideLoading();
      this.setData({ showGeMoreLoadin: false });
      let resData = res.data;
      if (resData.code == 0) {
        this.setData({
          article: resData.data
        })
        console.log(resData.data);
      }
    });
  },

  /**
 * 预览图片
 */
  previewImage: function (e) {
    let url = e.currentTarget.dataset.id;
    console.log(url)
    wx.previewImage({
      current: url,
      urls: [url]
    })
  },

  /**
* 查看商品详情
*/
  openHome: function (e) {
    console.log("test");
    wx.switchTab({
      url: '/pages/home/index/index'
    })
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