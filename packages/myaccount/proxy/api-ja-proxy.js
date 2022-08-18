'use strict'
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware')

class ApiJaProxy {
  constructor(app) {
    const API_V3_URL = process.env.API_V3_URL
    const options = {
      target: API_V3_URL,
      pathRewrite: {
        '^/api/v3/member/': '/api/v3/mypage/setting/',
      }
    }
    const proxy = createProxyMiddleware(options)
    app.use('/api/v3/member/', proxy)
  }
}

module.exports = ApiJaProxy
