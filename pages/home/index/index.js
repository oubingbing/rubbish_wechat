const http = require("./../../../utils/http.js");
const util = require("./../../../utils/util.js");
const app = getApp();

Page({

  data: {
    rubbishList:[],
    category:[],
    background:'',
    id:''
  },

  onLoad: function (options) {
    this.getRubbish();
  },

  onReady(){

  },

  getRubbish:function(){
    http.get(`/rubbishs`, {}, res => {
      let resData = res.data;
      if (resData.code == 0) {
        resData.data.map(res=>{
          switch(res.id){
            case 1:
              res.color = '.huishou-color';
              break;
            case 2:
              res.color = '.youhai-color';
              break;
            case 3:
              res.color = '.si-color';
              break;
            case 4:
              res.color = '.gan-color';
              break;
          }
          return res;
        })

        this.setData({
          rubbishList:resData.data,
          category:resData.data[0].category,
          background:resData.data[0].color,
          id:1
        });
      }
    });
  },

  switchTab:function(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      category:this.data.rubbishList[id-1].category,
      background: this.data.rubbishList[id - 1].color,
      id: this.data.rubbishList[id - 1].id
    });
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