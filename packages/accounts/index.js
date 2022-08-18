/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const next = require('next')
const configs = require('@ggj/configs')
const helmet = require('helmet')
const Proxy = require('./proxy')
/* eslint-enable @typescript-eslint/no-var-requires */

const hostname = 'localhost'
const port = 8914
const dev = process.env.ENV === 'local'
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handlerError(error, req, res, next) {
  await app.render404(req, res)
}

function security(server) {
  server.use(helmet.dnsPrefetchControl({
    allow: true,
  })) // controls browser DNS prefetching
  server.use(helmet.frameguard({
    action: 'sameorigin',
  })) // to prevent clickjacking
  server.use(helmet.hidePoweredBy()) // to remove the X-Powered-By header
  server.use(helmet.ieNoOpen()) // sets X-Download-Options for IE8+
  server.use(helmet.noSniff()) // to keep clients from sniffing the MIME type
}

app.prepare().then(async() => {
  const server = express()
  const serviceConfigs = await configs.getConfigs()
  configs.setEnvVariables(serviceConfigs)
  server.get('/health', (_, res) => res.sendStatus(200))
  // apply security helmet
  security(server)

  new Proxy(server)  // apply security helmet
  server.all('*', handle)
  server.use(handlerError)

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> GUI Ready on http://${hostname}:${port}`)
  })
})
