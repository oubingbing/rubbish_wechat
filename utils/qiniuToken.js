const http = require("./http.js");

const getQiniuToken = function(call){
  http.get("/upload_token", {}, res => {
    let resData = res.data;
    if (resData.code == 0) {
      call(resData.data.uptoken)
    }
  })
}

module.exports = {
  getQiniuToken
}