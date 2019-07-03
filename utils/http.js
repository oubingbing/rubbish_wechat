const config = require("./../config.js");

/**
 * 封装get方法
 */
const get=function ( _url, _data, callback) {
  httpRequest("GET",_url,_data,callback);
}

/**
 * 封装get方法
 */
const post = function (_url, _data, callback) {
  httpRequest("POST", _url, _data, callback);
}

/**
 * 封装put
 */
const put = function (_url, _data, callback) {
  httpRequest("PUT", _url, _data, callback);
}

/**
 * 封装delete
 */
const del = function (_url, _data, callback) {
  httpRequest("DELETE", _url, _data, callback);
}

/**
 * 封装patch
 */
const patch = function (_url, _data, callback) {
  httpRequest("PATCH", _url, _data, callback);
}

/** 
* 封装微信http请求
*/
const httpRequest=function (_method, _url, _data, callback) {
  let token = wx.getStorageSync('token');
  wx.request({
    url: config.domain + _url,
    header: {
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    method: _method,
    data: _data,
    success: function (res) {

      if (res.data.code == '4001' || res.data.code == '4000' || res.data.code == '5000') {
        console.log('token过期');
        login(_method, _url, _data, callback);
      } else {

        let resData = res.data;
        if (resData.code != 0) {
          wx.showToast({
            title: resData.message,
            icon: 'none'
          })
        }

        callback(res);
      }
    },
    fail: function (res) {
      console.log('出错了：');
      console.log(res);
    }
  })
}
/**
* 登录获取token
*/
const login = function (_method = null, _url = null, _data = null, callback = null) {
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      getUserInfo(res.code, _method, _url, _data, callback);
    }
  })
}

/**
* 获取用户信息 
*/
const getUserInfo = function (code, _method = null, _url = null, _data = null, callback = null) {
  console.log('get user info');
  let that = this;
  wx.getSetting({
    success: res => {
      console.log(res);
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            post("/auth/login", {
              encrypted_data: res.encryptedData,
              code: code,
              iv: res.iv
            }, function (res) {
              let resData = res.data;
              console.log(resData)
              if (resData.code == 0) {
                wx.setStorageSync('token', resData.data);
                console.log('token:' + resData.data);
                if (_method) {
                  httpRequest(_method, _url, _data, callback);
                }
                if (callback) {
                  //回调函数
                  callback(res);
                }
              } else {
                wx.showToast({
                  title: '登录失败',
                  icon: 'none'
                })
                return false;
              }
            });

          }
        })
      } else {
        console.log('未授权');
      }
    }
  })
}

module.exports = { get, post, patch, put, del, httpRequest, login}

