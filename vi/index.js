'use strict'

const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = require('../common')

// Import and Set Nuxt.js options
const config = require('./nuxt.config.js')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    // get and set config first before NAT use process.env.*
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  })
}
start()
