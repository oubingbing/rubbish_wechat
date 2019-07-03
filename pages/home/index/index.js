const http = require("./../../../utils/http.js");
const util = require("./../../../utils/util.js");
const app = getApp();

Page({

  data: {
    rubbishList:[]
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

        console.log(resData.data);

        this.setData({
          rubbishList:resData.data
        });
      }
    });
  }
})