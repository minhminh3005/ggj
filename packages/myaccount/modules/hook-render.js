// eslint-disable-next-line @typescript-eslint/no-var-requires
const slackv2 = require('@ggj/utils/utils/slackv2')
import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()

function _sendSlack(error, url, referer = '', req) {
  const headers = (req || {}).headers || {}
  const ipAddress =
    headers['remote-addr'] ||
    (headers['x-forwarded-for'] || '').split(',')[0] ||
    ''
  const preContent = `:boom:
    Request url: \`${url}\`
    Referer: \`${referer || 'empty'}\`
    IP address: ${ipAddress}
    User Agent: ${req && req.headers['user-agent']}`

  const message = error?.stack || ''
  slackv2.send({ message, preContent }, serverRuntimeConfig.ERROR_SLACK_CHANNEL)
}

export default function sendSlack(error, req) {
  if (!serverRuntimeConfig.ERROR_SLACK_CHANNEL) {
    return
  }
  _sendSlack(
    error,
    req.originalUrl || req.url,
    req.headers && req.headers.referer,
    req
  )
}
