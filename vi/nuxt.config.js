const { isLocal } = require('../utils/dev')
const webpack = require('webpack')
const fs = require('fs')

let str = fs.readFileSync('./app/ext-router.json'),
  extRouter = JSON.parse(str)

process.env.LANG = 'vi'

module.exports = Object.assign(
  {
    router: {
      extRouter,
    },
  }, {
  mode: 'universal',
  dev: isLocal(),
  server: {
    port: 7077,
  },
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'vi',
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width',
      },
      {
        name: 'google-site-verification',
        content: 'q7zdlNKGLUmmGDm2p4o-UJ45Gld3VN-Tz0XMyZBFxRE',
      },
      {
        'http-equiv': 'X-UA-Compatible',
        content: 'IE=11',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: 'https://www.gogojungle.co.jp/img/assets/pc/common/favicon.ico',
      },
    ],
  },
  /*
   ** Disable the progress bar color
   */
  loading: false,
  /*
   ** Global CSS
   */
  css: [
    'bootstrap/dist/css/bootstrap.css',
    '@@/../common/assets/common.css',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@@/../common/plugins/vue-i18n',
    '@@/../common/plugins/http-proxy',
    '@@/../common/plugins/common',
    {
      src: '@@/../common/plugins/directives',
      mode: 'client',
    },
    {
      src: '@@/../common/plugins/gtag.js',
      mode: 'client',
    },
    {
      src: '@@/../common/plugins/google-tag-master.js',
      mode: 'client',
    },
  ],
  /*
   ** Build configuration
   */
  buildModules: ['@nuxtjs/style-resources'],
  styleResources: {
    less: [`bootstrap/less/variables.less`],
  },
  build: {
    publicPath: '/surface/vi',
    babel: {
      presets({ isServer }) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
            {
              buildTarget: isServer ? 'server' : 'client',
              corejs: { version: 3 },
              polyfills: [
                // Promise polyfill alone doesn't work in IE,
                // Needs this as well. see: #1642
                `es.array.iterator`,
                // This is required for webpack code splitting, vuex etc.
                `es.promise`,
                // this is needed for object rest spread support in templates
                // as vue-template-es2015-compiler 1.8+ compiles it to Object.assign() calls.
                `es.object.assign`,
                // #2012 es7.promise replaces native Promise in FF and causes missing finally
                `es.promise.finally`,
                `es.object.get-own-property-descriptors`,
                `es.array.from`,
              ]
            }
          ]
        ]
      },
    },
    extractCSS: process.env.ENV == 'production',
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        moment: '@@/../common/plugins/moment-tz',
        'window.moment': '@@/../common/plugins/moment-tz',
      }),
    ],
  },
  modules: [
    '@@/../bin/configs.js',
    ['@@/../common/modules/hook-render.js', 'desktop Vietnamese'],
  ],
  serverMiddleware: [
    {
      path: '/health',
      handler: (req, res) => res.sendStatus(200),
    }
  ],
})
