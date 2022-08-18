'use strict'
/* eslint-disable @typescript-eslint/no-var-requires */
const { paymentMiddleware } = require('../middlewares/payment')

class PaymentProxy {
  constructor(app) {
    app.use('/payment', paymentMiddleware)
  }
}

module.exports = PaymentProxy
