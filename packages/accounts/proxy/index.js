/* eslint-disable @typescript-eslint/no-var-requires */
const ApiAuthProxy = require('./api-accounts-proxy')
const { authentication } = require('../middlewares/authentication')
class Proxy{
  constructor(app){
    app.use(authentication)
    new ApiAuthProxy(app)
  }
}
module.exports = Proxy
