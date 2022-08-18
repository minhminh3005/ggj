async function paymentMiddleware(req, res, next) {
  const { query = {}, path } = req
  if (path === '/credit/complete') {
    return res.redirect(301, `/payment?ssid=${query.orderId}`)
  }
  if (path === '/credit/error') {
    return res.redirect(301, `/payment?csid=${query.sessionId}`)
  }
  next()
}

module.exports = {
  paymentMiddleware
}
