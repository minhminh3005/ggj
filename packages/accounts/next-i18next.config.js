module.exports = {
  i18n: {
    locales: ['ja'],
    defaultLocale: 'ja',
    localeDetection: false
  },
  defaultNS: 'common@default',
  localePath: './lang',
  reloadOnPrerender: !['production', 'staging'].includes(process.env.ENV),
}
