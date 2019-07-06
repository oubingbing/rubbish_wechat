const http = require("./../../../utils/http.js");
const util = require("./../../../utils/util.js");
const app = getApp();

Page({
  data: {
    questions:[],
    showIndex:0,
    answerData:[],
    answerResult:'',
    showAnswerResult:false,
    currentSelect:'',
    theRightResult:'',
    showTest:false,
    showResult:false,
    testCount:{
      totle_count:0,
      right:0,
      error:0,
      score:0,
      rate:0
    },
    showRestar:false,
    isAnswer:true,
    show_auth:false,
    avatarUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onSwiperChange: function (e) {
    let current = e.detail.current;
    let images = this.data.questions;
    images.map((item, index) => {
      if ((index) == current) {
        item.show = true;
      } else {
        item.show = false;
      }
    })
    this.setData({ questions: images })
  },

  starTest:function(){
    wx.showLoading({
      title: '试题加载中...',
    })
    this.getQuestions();
  },

  getQuestions: function () {
    this.auth();
    http.get(`/rubbish/questions`, {}, res => {
      wx.hideLoading();
      let resData = res.data;
      if(resData.code != 0){
        wx.showToast({
          title: '试题加载出错，请重试',
          icon:'none'
        })
        return false;
      }

      let questions = resData.data;
      questions.map((item,index)=>{
        if(index == 0){
            item.show = true;
        }else{
          item.show = false;
        }
        return item;
      })

      this.setData({ questions: questions, showTest: true, isAnswer:false})

    });
  },

  /**
 * 监听用户点击授权按钮
 */
  getAuthUserInfo: function (data) {
    this.setData({ avatarUrl: data.detail.userInfo.avatarUrl})
    this.setData({
      show_auth: false
    });
  },

  auth:function(){
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            show_auth: true
          });
        } else {
          wx.getUserInfo({
            success: res => {
              that.setData({ avatarUrl: res.userInfo.avatarUrl })
              console.log(res.userInfo.avatarUrl);
            }
          })
        }
      }
    })
  },

  /**
   * 下一题
   */
  showNext:function(){
    let questions = this.data.questions;
    let showIndex = this.data.showIndex;
    if(showIndex == 9){
      wx.showToast({
        title: '测试结束',
        icon:'none'
      })
      return false;
    }

    if (!this.data.isAnswer){
      wx.showToast({
        title: '当前题目未作答',
        icon: 'none'
      })
      return false;
    }

    questions.map((item,index)=>{
      if (index == (showIndex + 1)){
        item.show = true;
      }else{
        item.show = false;
      }
      return item;
    });

    this.setData({
      questions: questions,
      showIndex: showIndex+1,
      showAnswerResult:false,
      currentSelect:'',
      isAnswer:false
    })
  },

  /**
   * 用户答题
   */
  answer:function(e){
    let id = e.currentTarget.dataset.id;
    let qId = e.currentTarget.dataset.q_id;
    let currentQuestion = '';
    let answerResult = '';

    let hadAnswer = false;
    this.data.answerData.map(item=>{
      if (item.questions == qId){
        hadAnswer = true;
      }
      return item;
    })
    if(hadAnswer == true){
      return false;
    }

    this.data.questions.map(item=>{
      if(item.id == qId){
        currentQuestion = item;
      }
      return item;
    })

    let theRightResult = '';
    if (currentQuestion.category_grandpa_id == id){
      //答对了
      answerResult = true;
    }else{
      //答错
      console.log(id);
      answerResult = false;
      switch (parseInt(currentQuestion.category_grandpa_id)){
        case 1:
          theRightResult = '可回收物';
          break;
        case 2:
          theRightResult = '有害垃圾';
          break;
        case 3:
          theRightResult = '湿垃圾';
          break;
        case 4:
          theRightResult = '干垃圾';
          break;
      }
    }

    let answerData = this.data.answerData;
    answerData.push({
      questions: currentQuestion.id, user_answer: id, result: answerResult
    });

    this.setData({
      answerResult: answerResult,
      showAnswerResult: true,
      answerData: answerData,
      currentSelect:id,
      theRightResult: theRightResult,
      isAnswer:true
    })

    //判断是否已经答题结束
    setTimeout(res=>{
      if (answerData.length == this.data.questions.length){
        wx.showLoading({
          title: '正在生成报告',
        })
        //正在生成测试报告
        //计算答题结果
        let count = this.data.testCount;
        count.totle_count = answerData.length;
        answerData.map(item=>{
          if (item.result == true){
            count.right += 1;
          }else{
            count.error += 1;
          }
          return item;
        })
        count.score = 10 * count.right;

        //保存数据
        http.post(`/rubbish/examination`, {
          answer: answerData
        }, res => {
          wx.hideLoading();
          let resData = res.data;
          if (resData.code != 0) {
            wx.showToast({
              title: '保存错误',
              icon: 'none'
            })
            return false;
          }

          count.rate = resData.data;

          this.setData({ testCount: count, showResult: true, showRestar: true })
        });
      }
    },1000)
  },

  /**
   * 关闭报告页面
   */
  closeResult: function () {
    this.setData({
      showResult: false
    })
  },

  doNotThing: function () {

  },

  /**
   * 重新测试
   */
  restar:function(){
    this.setData({
      questions: [],
      showIndex: 0,
      answerData: [],
      answerResult: '',
      showAnswerResult: false,
      currentSelect: '',
      theRightResult: '',
      showTest: false,
      showResult: false,
      testCount: {
        totle_count: 0,
        right: 0,
        error: 0,
        score: 0,
        rate: 0
      },
      showRestar: false,
      isAnswer:true
    });

    wx.showLoading({
      title: '试题加载中...',
    });
    this.getQuestions();
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