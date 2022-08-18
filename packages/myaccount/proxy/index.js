const ApiMyaccountProxy = require('./api-myaccount-proxy')
const ApiUploadProxy = require('./api-upload-proxy')
const ApiJaProxy = require('./api-ja-proxy')
class Proxy{
  constructor(app){
    new ApiMyaccountProxy(app)
    new ApiUploadProxy(app)
    new ApiJaProxy(app)
  }
}

module.exports = Proxy