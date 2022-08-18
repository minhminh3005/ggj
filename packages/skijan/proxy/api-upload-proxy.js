'use strict'
/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware')

class ApiUploadProxy {
  constructor(app) {
    this.UPLOAD_API_URL = process.env.UPLOAD_API_URL
    // proxy upload img
    const proxy = this.uploadProxy()
    app.use('/upload/v3/', proxy)
    // proxy get img no cache
    const imgNoCacheProxy = this.imgNoCacheProxy()
    app.use('/img/no-cache/', imgNoCacheProxy)
    // proxy get img
    const imgProxy = this.imgProxy()
    app.use('/img/v3/', imgProxy)

  }

  imgProxy (){
    const filter = function (pathname, req) {
      return pathname.match('^/img/v3/') && req.method === 'GET'
    }
    const imgOptions = {
      target: this.UPLOAD_API_URL,
      pathRewrite: {
        '^/img/v3/': '/upload/v3/'
      }
    }
    return createProxyMiddleware(filter,imgOptions)
  }

  imgNoCacheProxy (){
    const filterNoCache = function (pathname, req) {
      return req.method === 'GET'
    }
    const imgNoCacheOptions = {
      target: this.UPLOAD_API_URL,
      pathRewrite: {
        '/img/no-cache': '/upload/v3'
      }
    }
    return createProxyMiddleware(filterNoCache,imgNoCacheOptions)
  }

  uploadProxy (){
    const options = {
      target: this.UPLOAD_API_URL,
    }
    return createProxyMiddleware(options)
  }
}

module.exports = ApiUploadProxy
