const slack = require('./slack')

module.exports = function(envType) {
  if (!process.env.ERROR_SLACK_CHANNEL) {
    return
  }
  console.log('Hook render:errorMiddleware', envType)
  this.nuxt.hook('render:errorMiddleware', app =>
    app.use((error, _req, _res, next) => {

      slack(
        envType,
        error,
        _req.originalUrl || _req.url,
        _req.headers && _req.headers['referer'],
        _req
      )
      next(error)
    })
  )
}
