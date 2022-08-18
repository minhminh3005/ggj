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
  serverRuntimeConfig: {
    ...env,
  },
  publicRuntimeConfig: {
    GOGO_DOMAIN: env.GOGO_DOMAIN,
    GOGO_URL: env.GOGO_URL,
    ACCOUNT_HOST_URL: env.ACCOUNT_HOST_URL,
    SKJ_HOST_URL: env.SKJ_HOST_URL,
    REALTRADE_HOST_URL : env.REALTRADE_HOST_URL
  },
  reactStrictMode: true,
  // https://nextjs.org/docs/api-reference/next/image#loader-configuration
  images: {
    deviceSizes: [768, 1024], // 768: md, 1024: lg
    path: '/img/myaccount/assets',
  },
  rewrites() {
    return [
      {
        source: '/img/myaccount/assets/:path*',
        destination: '/_next/image/:path*',
      },
    ]
  },
}
