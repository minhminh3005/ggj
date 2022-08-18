let express = require('express'),
  appDesktop = express(),
  appMobile = express(),
  { join } = require('path'),
  proxy = require('http-proxy-middleware')

appDesktop.use(
  '/img',
  proxy({
    target: 'https://www.gogojungle.co.jp',
    changeOrigin: true,
    secure: false,
  })
)

appMobile.use(
  '/img',
  proxy({
    target: 'https://www.gogojungle.co.jp',
    changeOrigin: true,
    secure: false,
  })
)

appDesktop.use(
  '/build',
  express.static(join(process.cwd(), 'styleguide_build/desktop/build'))
)
appMobile.use(
  '/build',
  express.static(join(process.cwd(), 'styleguide_build/mobile/build'))
)

appDesktop.use(
  '/static',
  express.static(join(process.cwd(), 'styleguide_build/desktop/static'))
)
appMobile.use(
  '/static',
  express.static(join(process.cwd(), 'styleguide_build/mobile/static'))
)

appDesktop.use(
  '/styleguidist.js',
  express.static(join(__dirname, '/styleguidist.js'))
)
appMobile.use(
  '/styleguidist.js',
  express.static(join(__dirname, '/styleguidist.js'))
)

appDesktop.get('/', function(req, res) {
  res.sendFile(join(process.cwd(), 'styleguide_build/desktop/index.html'))
})
appMobile.get('/', function(req, res) {
  res.sendFile(join(process.cwd(), 'styleguide_build/mobile/index.html'))
})

let serverDesktop = appDesktop.listen(7082, function() {
    let host = serverDesktop.address().address,
      port = serverDesktop.address().port
    console.log('Styleguide desktop server start on http://%s:%s', host, port)
  }),
  serverMobile = appMobile.listen(7083, function() {
    let host = serverMobile.address().address,
      port = serverMobile.address().port
    console.log('Styleguide mobile server start on http://%s:%s', host, port)
  })
