/* eslint-disable @typescript-eslint/no-var-requires */
const ApiUploadProxy = require('./api-upload-proxy')
const ApiSkijanProxy = require('./api-skijan-proxy')
const PaymentProxy = require('./payment-proxy')

class Proxy {
  constructor(app) {
    new PaymentProxy(app)
    new ApiUploadProxy(app)
    new ApiSkijanProxy(app)
  }
}

module.exports = Proxy
