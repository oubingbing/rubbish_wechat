const config={
  dev:{//开发环境
    domain:"http://127.0.0.1:8000/api/wechat",
    qiniuDomain:"http://article.qiuhuiyi.cn",
  },
  prod:{//生产环境
    domain: "https://heping.qiuhuiyi.cn/api/wechat",
    qiniuDomain: "http://article.qiuhuiyi.cn"
  }
}

//const domain = config.prod.domain;
const domain = config.dev.domain;

const qiniuDomain = config.prod.qiniuDomain;

module.exports = {
  domain, qiniuDomain
}