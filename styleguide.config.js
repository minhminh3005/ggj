const docgen = require('vue-docgen-api')
const path = require('path')

let rules = require('vue-webpack-loaders')

module.exports = Object.freeze({
  sections: [
    {
      name: 'Global components',
      components: 'components/!(icons)/**/[A-Z]*.vue',
    },
    {
      name: 'Global icons',
      components: 'components/icons/**/[A-Z]*.vue',
    },
  ],
  propsParser(filePath, source) {
    let fn = filePath
      .split(path.sep)
      .pop()
      .replace('.vue', '')

    // replace process variable in nuxt
    source = source.replace(new RegExp(/process\./g), '{process: true}.')
    let docs = (source.match('<docs>') || []).length,
      script = (source.match('<script>') || []).length

    if (script - docs === 1) {
      // detect whether component has name property or not
      if (~source.search(/export\s+default\s+{[\s\S]*name:[\s]*}/)) {
        // component has name property
        return docgen.parse(filePath)
      }

      return docgen.parseSource(
        source.replace(/(export\s+default\s+{)/, `$1name: '${fn}',`),
        path.dirname(filePath)
      )
    }

    return docgen.parseSource(
      `${source}\r\n<script>export default {name: '${fn}'}</script>`,
      path.dirname(filePath)
    )
  },
  webpackConfig: {
    module: {
      rules,
    },
    devServer: {
      disableHostCheck: true,
      proxy: {
        '/img': {
          target: 'https://www.gogojungle.co.jp',
          secure: false,
          changeOrigin: true,
        },
      },
    },
  },
  usageMode: 'collapse',
  getComponentPathLine(componentPath) {
    const name = path.basename(componentPath, '.vue')
    const dir = path.join('@', path.dirname(componentPath), name + '.vue')
    return `import ${name} from '${dir.replace(/\\/g, '/')}'`
  },
  // defaultExample: true,
  renderRootJsx: path.join(__dirname, 'styleguide.root.js'),
  require: [
    path.join(__dirname, 'styleguide/styleguidist.js'),
    'jquery.dotdotdot',
    'bootstrap/dist/css/bootstrap.css',
    path.join(__dirname, 'common/assets/common.css'),
    path.join(__dirname, 'common/plugins/vue-i18n.js'),
    path.join(__dirname, 'common/plugins/common.js'),
    path.join(__dirname, 'common/plugins/directives.js'),
    path.join(__dirname, 'common/plugins/http-proxy/http-client.js'),
  ],
})
