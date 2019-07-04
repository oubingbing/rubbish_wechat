const http = require("./../../../utils/http.js");
const util = require("./../../../utils/util.js");
const app = getApp();


Page({

  data: {
    pageSize: 10,
    pageNumber: 1,
    initPageNumber: 1,
    filter: '',
    showAuth: false,
    showGeMoreLoadin: false,
    notDataTips: false,
    articleList: [],
    selectTab: 0,
    from_type: 0,
    category: 0,
    searchArticle: ''
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      icon: 'none'
    })
    this.getList();
  },

  /**
   * 获取文章列表
   */
  getList: function () {
    let fromType = this.data.from_type;
    let category = this.data.category;
    if (this.data.selectTab == 0) {
      fromType = '';
    } else {
      fromType = this.data.selectTab;
    }

    if (category == 0) {
      category = '';
    }

    http.get(`/articles?page_size=${this.data.pageSize}&page_number=${this.data.pageNumber}&from_type=${fromType}&category=${category}&search=${this.data.searchArticle}&game=2`, {}, res => {
      wx.hideLoading();
      this.setData({ showGeMoreLoadin: false });
      let resData = res.data;
      if (resData.code == 0) {
        let articles = resData.data.page_data;
        if (articles) {
          let articleList = this.data.articleList;
          articles.map(item => {
            articleList.push(item);
          })
          this.setData({
            articleList: articleList,
            pageNumber: this.data.pageNumber + 1,
            notDataTips: articles.length >= 0 ? true : false
          })
        }
      }
    });
  },

  /**
   * 查看商品详情
   */
  openGoodsDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/article/detail/detail?showPage=false&id=' + id
    })
  },

  /**
   * 上拉加载更多
   */
  onReachBottom: function () {
    this.setData({
      showGeMoreLoadin: true
    });
    this.getList();
  },

  /**
   * 搜索商品
   */
  search: function () {

  },

  /**
  * 分享
  */
  onShareAppMessage: function (res) {
    return {
      title: '垃圾分类，守护地球',
      path: '/pages/home/index/index',
      imageUrl: '/images/top2.jpg',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})