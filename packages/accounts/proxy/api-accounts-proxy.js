'use strict'
/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware')

class ApiAccountsProxy {
  constructor(app) {
    const ACCOUNTS_API_URL = process.env.ACCOUNTS_API_URL
    const options = {
      target: ACCOUNTS_API_URL,
    }
    const proxy = createProxyMiddleware(options)
    app.use('/api/accounts/', proxy)

    app.use(['/sns', '/logout'], createProxyMiddleware({
      target: `${ACCOUNTS_API_URL}/api/accounts/v1`
    }))
  }
}

module.exports = ApiAccountsProxy
