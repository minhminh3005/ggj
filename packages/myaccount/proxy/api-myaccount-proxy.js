'use strict'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware')
class ApiMyAccountProxy {
  constructor(app) {
    const MYACCOUNT_API_URL = process.env.MYACCOUNT_API_URL
    const options = {
      target: MYACCOUNT_API_URL,
    }
    const proxy = createProxyMiddleware(options)
    app.use('/api/myaccount/', proxy)
  }
}
module.exports = ApiMyAccountProxy
