const { join } = require('path')
const config = require('./styleguide.config')

let desktop = Object.assign({}, config, {
  serverPort: 7082,
  title: '[Desktop] GogoJungle VN',
  sections: config.sections.concat([
    {
      name: 'Desktop components',
      components: 'desktop/components/!(icons)/**/[A-Z]*.vue',
    },
    {
      name: 'Desktop icons',
      components: 'desktop/components/icons/**/[A-Z]*.vue',
    },
  ]),
  styleguideDir: 'styleguide_build/desktop',
})
desktop.webpackConfig = Object.assign(
  {
    resolve: {
      extensions: ['.js', '.json', '.vue', '.scss'],
      alias: {
        '~': join(__dirname, 'desktop'),
        '@': join(__dirname, 'desktop'),
        '@@': process.cwd(),
      },
    },
  },
  desktop.webpackConfig
)

module.exports = desktop
