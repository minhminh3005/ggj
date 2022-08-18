'use strict'
const slackv2 = require('@ggj/utils/utils/slackv2')

module.exports = function(envType, error, url, referer = '', req) {
  const headers = (req || {}).headers || {}
  const ipAddress = headers['remote-addr'] ||
    ((headers['x-forwarded-for'] || '').split(',')[0] || '')


  const preContent = `:boom:
    Env: \`Surface ${envType}\`
    Request url: \`${url}\`
    Referer: \`${referer || 'empty'}\`
    IP address: ${ipAddress}
    User Agent: ${headers['user-agent']}
  `

  const message = error.stack
  console.log('slackkkkkkkkkk', preContent, message)

  slackv2.send({message, preContent}, process.env.ERROR_SLACK_CHANNEL)
}
