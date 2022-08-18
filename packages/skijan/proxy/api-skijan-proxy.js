'use strict'
/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware')

class ApiSkijanProxy {
  constructor(app) {
    const SKIJAN_API_URL = process.env.SKIJAN_API_URL
    const options = {
      target: SKIJAN_API_URL,
    }
    const proxy = createProxyMiddleware(options)
    app.use('^/api/skijan/', proxy)
  }
}

module.exports = ApiSkijanProxy
