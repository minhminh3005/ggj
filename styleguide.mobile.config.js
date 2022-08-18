const { join } = require('path')
const config = require('./styleguide.config')

let mobile = Object.assign({}, config, {
  serverPort: 7083,
  title: '[Mobile] GogoJungle VN',
  sections: config.sections.concat([
    {
      name: 'Mobile components',
      components: 'mobile/components/!(icons)/**/[A-Z]*.vue',
    },
    {
      name: 'Mobile Icons',
      components: 'mobile/components/icons/**/[A-Z]*.vue',
    },
  ]),
  styleguideDir: 'styleguide_build/mobile',
})
mobile.webpackConfig = Object.assign(
  {
    resolve: {
      extensions: ['.js', '.json', '.vue', '.scss'],
      alias: {
        '~': join(__dirname, 'mobile'),
        '@': join(__dirname, 'mobile'),
        '@@': process.cwd(),
      },
    },
  },
  mobile.webpackConfig
)

module.exports = mobile
