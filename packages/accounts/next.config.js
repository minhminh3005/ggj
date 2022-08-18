/* eslint-disable @typescript-eslint/no-var-requires */
const cp = require('child_process')
const fs = require('fs')
let scr = 'node'
if (process.env.ENV === 'local') {
  // window env
  if (process.platform === 'win32') {
    scr = '%NVM_HOME%/v%npm_package_engines_node%/node'
  } else {
    scr = '$NVM_DIR/versions/node/v$npm_package_engines_node/bin/node'
  }
}

cp.execSync(`${scr} ./modules/config.js`)
const jsYaml = require('js-yaml')
/* eslint-enable @typescript-eslint/no-var-requires */
const env = jsYaml.load(fs.readFileSync('.env.yaml'))

module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true
      }
    ]
  },
  serverRuntimeConfig: {
    ...env
  },
  publicRuntimeConfig: {
    GOGO_DOMAIN: env.GOGO_DOMAIN,
    GOGO_HOST_URL: env.GOGO_HOST_URL,
    REALTRADE_HOST_URL: env.REALTRADE_HOST_URL,
    SKJ_HOST_URL: env.SKJ_HOST_URL,
    MYACCOUNT_HOST_URL: env.MYACCOUNT_HOST_URL
  },
  reactStrictMode: true
}
